import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import weightGainMaleImg from '../assets/weight-gain/weight_gain_male.png'
import weightGainFemaleImg from '../assets/weight-gain/weight_gain_female.png'
import './WeightGain.css'

const options = [
  { id: 'no', labelKey: 'common.no' },
  { id: 'yes', labelKey: 'common.yes' },
]

export default function WeightGain() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedOption, setSelectedOption] = useState(null)

  const resolvedGender = gender === 'female' ? 'female' : 'male'
  const currentImage = resolvedGender === 'female' ? weightGainFemaleImg : weightGainMaleImg

  const handleOptionSelect = (optionId) => {
    setSelectedOption((prev) => (prev === optionId ? null : optionId))
  }

  const goPrev = useCallback(() => {
    const idx = selectedOption ? options.findIndex((o) => o.id === selectedOption) : -1
    setSelectedOption(options[Math.max(0, idx)].id)
  }, [selectedOption])

  const goNext = useCallback(() => {
    const idx = selectedOption ? options.findIndex((o) => o.id === selectedOption) : -1
    setSelectedOption(options[Math.min(options.length - 1, idx + 1)].id)
  }, [selectedOption])

  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev })

  const handleNext = async () => {
    if (!selectedOption) return
    await saveProfileData(userId, { weight_gain: selectedOption })
    navigate('/stress-level', { state: { userId, gender } })
  }

  return (
    <div className="wg-page">
      {/* ── Header ── */}
      <div className="wg-header">
        <button
          type="button"
          className="wg-back-btn"
          onClick={() => navigate('/sleep-duration', { state: { userId, gender } })}
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className="wg-progress-track">
          <div className="wg-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="wg-title">{t('weightGain.title')}</h1>

      {/* ── Character Image ── */}
      <div className="wg-character-area">
        <img
          key={currentImage}
          src={currentImage}
          loading="lazy"
          alt="Weight gain"
          className="wg-character-img"
        />
      </div>

      {/* ── Options Grid (swipe to change) ── */}
      <div className="wg-options-grid" {...swipeHandlers}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`wg-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="wg-footer">
        <button
          type="button"
          className={`wg-next-btn ${selectedOption ? 'active' : 'inactive'}`}
          disabled={!selectedOption}
          onClick={handleNext}
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}
