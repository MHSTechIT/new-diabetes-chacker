import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProgressPercent } from '../lib/progressSteps'
import { saveProfileData } from '../lib/saveProfile'
import './Habits.css'

const habits = [
  { id: 'smoking', label: 'Smoking' },
  { id: 'alcohol', label: 'Alcohol' },
  { id: 'tobacco-chewing', label: 'Tobacco chewing' },
  { id: 'none', label: 'None' },
]

export default function Habits() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedHabits, setSelectedHabits] = useState(new Set())
  const [showResultModal, setShowResultModal] = useState(false)
  const [resultName, setResultName] = useState('')
  const [resultPhone, setResultPhone] = useState('')

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

    const habitsString = Array.from(selectedHabits).join(',')
    await saveProfileData(userId, { habits: habitsString, name, phone })

    setShowResultModal(false)
    navigate('/next-step', { state: { userId, gender } })
  }

  const handleCancelModal = () => {
    setShowResultModal(false)
    setResultName('')
    setResultPhone('')
  }

  return (
    <div className="hab-page">
      <div className="hab-header">
        <button
          type="button"
          className="hab-back-btn"
          onClick={() => navigate('/symptoms', { state: { userId, gender } })}
          aria-label="Back"
        >
          ←
        </button>
        <div className="hab-progress-track">
          <div className="hab-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      <h1 className="hab-title">Do you have any of these habits?</h1>

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
                {habit.label}
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
          RESULT
        </button>
      </div>

      <div className={`hab-result-modal-overlay ${showResultModal ? 'visible' : ''}`} onClick={handleCancelModal}>
        <div className="hab-result-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="hab-result-modal-title">Almost there!</h2>
          <p className="hab-result-modal-subtitle">Enter your details to view your result.</p>

          <div className="hab-result-modal-field">
            <label className="hab-result-modal-label">NAME</label>
            <input
              type="text"
              className="hab-result-modal-input"
              placeholder="Your full name"
              value={resultName}
              onChange={(e) => setResultName(e.target.value)}
            />
          </div>

          <div className="hab-result-modal-field">
            <label className="hab-result-modal-label">PHONE NUMBER</label>
            <input
              type="text"
              className="hab-result-modal-input"
              placeholder="e.g. 9876543210"
              value={resultPhone}
              onChange={handlePhoneChange}
              maxLength={PHONE_MAX_DIGITS}
              minLength={PHONE_MAX_DIGITS}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="tel"
              aria-label="Phone number (10 digits)"
            />
            <span className="hab-result-modal-hint">Enter exactly 10 digits</span>
          </div>

          <button
            type="button"
            className="hab-result-modal-submit"
            onClick={handleViewResult}
            disabled={!resultName.trim() || resultPhone.length !== 10}
          >
            View my result
          </button>

          <button type="button" className="hab-result-modal-cancel" onClick={handleCancelModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
