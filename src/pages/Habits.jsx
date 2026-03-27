import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getProgressPercent } from '../lib/progressSteps'
import { saveProfileData } from '../lib/saveProfile'
import './Habits.css'

const habits = [
  { id: 'smoking', labelKey: 'habits.smoking' },
  { id: 'alcohol', labelKey: 'habits.alcohol' },
  { id: 'tobacco-chewing', labelKey: 'habits.tobaccoChewing' },
  { id: 'none', labelKey: 'habits.none' },
]

export default function Habits() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedHabits, setSelectedHabits] = useState(new Set())
  const [showResultModal, setShowResultModal] = useState(false)
  const [resultName, setResultName] = useState('')
  const [resultPhone, setResultPhone] = useState('')
  const [resultAge, setResultAge] = useState('')
  const [ageError, setAgeError] = useState('')
  const [resultLocation, setResultLocation] = useState('')
  const [saveError, setSaveError] = useState(null)

  const PHONE_MAX_DIGITS = 10
  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, PHONE_MAX_DIGITS)
    setResultPhone(digitsOnly)
  }

  const handleHabitToggle = (habitId) => {
    const newSelected = new Set(selectedHabits)

    if (newSelected.has(habitId)) {
      newSelected.delete(habitId)
    } else {
      if (habitId === 'none') {
        newSelected.clear()
        newSelected.add('none')
      } else {
        newSelected.delete('none')
        newSelected.add(habitId)
      }
    }
    setSelectedHabits(newSelected)
  }

  const handleResultClick = () => {
    if (selectedHabits.size === 0) return
    setShowResultModal(true)
  }

  const handleViewResult = async () => {
    const name = resultName.trim()
    const phone = resultPhone.trim()
    if (!name || !phone) return
    if (resultAge && (Number(resultAge) < 1 || Number(resultAge) > 110)) {
      setAgeError('Please enter a valid age between 1 and 110.')
      return
    }

    setSaveError(null)
    const habitsString = Array.from(selectedHabits).join(',')
    const age = resultAge.trim() || null
    const location = resultLocation.trim() || null
    try {
      await saveProfileData(userId, { habits: habitsString, name, phone, age, location })
      setShowResultModal(false)
      navigate('/next-step', { state: { userId, gender } })
    } catch (err) {
      setSaveError(err?.message || 'Failed to save. Please try again.')
    }
  }

  const handleCancelModal = () => {
    setShowResultModal(false)
    setSaveError(null)
    setResultName('')
    setResultPhone('')
    setResultAge('')
    setResultLocation('')
  }

  return (
    <div className="hab-page">
      <div className="hab-header">
        <button
          type="button"
          className="hab-back-btn"
          onClick={() => navigate('/symptoms', { state: { userId, gender } })}
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className="hab-progress-track">
          <div className="hab-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      <h1 className="hab-title">{t('habits.title')}</h1>

      <div className="hab-content-area">
        <div className="hab-options-grid">
          {habits.map((habit) => {
            const isSelected = selectedHabits.has(habit.id)
            return (
              <button
                key={habit.id}
                type="button"
                className={`hab-option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleHabitToggle(habit.id)}
              >
                {t(habit.labelKey)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="hab-footer">
        <button
          type="button"
          className={`hab-next-btn ${selectedHabits.size > 0 ? 'active' : 'inactive'}`}
          disabled={selectedHabits.size === 0}
          onClick={handleResultClick}
        >
          {t('common.result')}
        </button>
      </div>

      <div className={`hab-result-modal-overlay ${showResultModal ? 'visible' : ''}`} onClick={handleCancelModal}>
        <div className="hab-result-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="hab-result-modal-title">{t('habits.modalTitle')}</h2>
          <p className="hab-result-modal-subtitle">{t('habits.modalSubtitle')}</p>

          <div className="hab-result-modal-field">
            <label className="hab-result-modal-label">{t('habits.nameLabel')}</label>
            <input
              type="text"
              className="hab-result-modal-input"
              placeholder={t('habits.namePlaceholder')}
              value={resultName}
              onChange={(e) => setResultName(e.target.value)}
            />
          </div>

          <div className="hab-result-modal-field">
            <label className="hab-result-modal-label">{t('habits.phoneLabel')}</label>
            <input
              type="text"
              className="hab-result-modal-input"
              placeholder={t('habits.phonePlaceholder')}
              value={resultPhone}
              onChange={handlePhoneChange}
              maxLength={PHONE_MAX_DIGITS}
              minLength={PHONE_MAX_DIGITS}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="tel"
              aria-label={t('habits.phoneLabel')}
            />
            <span className="hab-result-modal-hint">{t('habits.phoneHint')}</span>
          </div>

          <div className="hab-result-modal-field">
            <label className="hab-result-modal-label">{t('habits.ageLabel')}</label>
            <input
              type="number"
              className="hab-result-modal-input"
              placeholder={t('habits.agePlaceholder')}
              value={resultAge}
              onChange={(e) => {
                const val = e.target.value
                setResultAge(val)
                if (val && (Number(val) < 1 || Number(val) > 110)) {
                  setAgeError('Please enter a valid age between 1 and 110.')
                } else {
                  setAgeError('')
                }
              }}
              min={1}
              max={110}
              autoComplete="off"
              aria-label={t('habits.ageLabel')}
            />
            {ageError && <span className="hab-result-modal-hint" style={{color:'#f43f5e'}}>{ageError}</span>}
          </div>

          <div className="hab-result-modal-field">
            <label className="hab-result-modal-label">{t('habits.locationLabel')}</label>
            <input
              type="text"
              className="hab-result-modal-input"
              placeholder={t('habits.locationPlaceholder')}
              value={resultLocation}
              onChange={(e) => setResultLocation(e.target.value)}
              autoComplete="address-level2"
              aria-label={t('habits.locationLabel')}
            />
          </div>

          {saveError && <p className="hab-result-modal-error">{saveError}</p>}
          <button
            type="button"
            className="hab-result-modal-submit"
            onClick={handleViewResult}
            disabled={!resultName.trim() || resultPhone.length !== 10}
          >
            {t('habits.viewResult')}
          </button>

          <button type="button" className="hab-result-modal-cancel" onClick={handleCancelModal}>
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
