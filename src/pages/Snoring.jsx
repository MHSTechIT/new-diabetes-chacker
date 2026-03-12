import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import snoringMaleImg from '../assets/sleep-duration/sleep_duration_male.png'
import snoringFemaleImg from '../assets/sleep-duration/sleep_duration_female.png'
import './Snoring.css'

const options = [
  { id: 'no', labelKey: 'common.no' },
  { id: 'not-sure', labelKey: 'common.notSure' },
  { id: 'yes', labelKey: 'common.yes' },
]

export default function Snoring() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedOption, setSelectedOption] = useState(null)

  const resolvedGender = gender === 'female' ? 'female' : 'male'
  const currentImage = resolvedGender === 'female' ? snoringFemaleImg : snoringMaleImg

  const handleOptionSelect = (optionId) => {
    setSelectedOption((prev) => (prev === optionId ? null : optionId))
  }

  const goPrev = useCallback(() => {
    const idx = selectedOption ? options.findIndex((o) => o.id === selectedOption) : -1
    setSelectedOption(options[Math.max(0, idx - 1)].id)
  }, [selectedOption])

  const goNext = useCallback(() => {
    const idx = selectedOption ? options.findIndex((o) => o.id === selectedOption) : -1
    setSelectedOption(options[Math.min(options.length - 1, idx + 1)].id)
  }, [selectedOption])

  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev })

  const handleNext = async () => {
    if (!selectedOption) return
    await saveProfileData(userId, { snoring: selectedOption })
    navigate('/weight-gain', { state: { userId, gender } })
  }

  return (
    <div className="sn-page">
      {/* ── Header ── */}
      <div className="sn-header">
        <button
          type="button"
          className="sn-back-btn"
          onClick={() => navigate('/sleep-duration', { state: { userId, gender } })}
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className="sn-progress-track">
          <div className="sn-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="sn-title">{t('snoring.title')}</h1>

      {/* ── Character Image ── */}
      <div className="sn-character-area">
        {/* Snoring Animation */}
        <div className={`sn-snore-container ${selectedOption === 'no' ? 'paused' : ''}`}>
          <div className="sn-snore-z sn-snore-z1">Z</div>
          <div className="sn-snore-z sn-snore-z2">Z</div>
          <div className="sn-snore-z sn-snore-z3">Z</div>
        </div>

        <img
          key={currentImage}
          src={currentImage}
          loading="lazy"
          alt="Snoring"
          className="sn-character-img"
        />
      </div>

      {/* ── Options Grid (swipe to change) ── */}
      <div className="sn-options-grid" {...swipeHandlers}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`sn-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="sn-footer">
        <button
          type="button"
          className={`sn-next-btn ${selectedOption ? 'active' : 'inactive'}`}
          disabled={!selectedOption}
          onClick={handleNext}
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}
