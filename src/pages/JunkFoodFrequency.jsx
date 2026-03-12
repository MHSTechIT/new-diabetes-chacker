import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import junkFoodMale from '../assets/junk-food/junk_food_male.png'
import junkFoodFemale from '../assets/junk-food/junk_food_female.png'
import './JunkFoodFrequency.css'

const options = [
  { id: 'rarely', labelKey: 'junkFood.rarely' },
  { id: 'weekly1_2', labelKey: 'junkFood.weekly1_2' },
  { id: 'weekly3_4', labelKey: 'junkFood.weekly3_4' },
  { id: 'weekly5plus', labelKey: 'junkFood.weekly5plus' },
]

export default function JunkFoodFrequency() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedOption, setSelectedOption] = useState(null)

  const currentImage = gender === 'male' ? junkFoodMale : junkFoodFemale

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
    await saveProfileData(userId, { junk_food_frequency: selectedOption })
    navigate('/outside-food-frequency', { state: { userId, gender } })
  }

  return (
    <div className="jff-page">
      {/* ── Header ── */}
      <div className="jff-header">
        <button
          type="button"
          className="jff-back-btn"
          onClick={() => navigate('/physical-activity', { state: { userId, gender } })}
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className="jff-progress-track">
          <div className="jff-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="jff-title">{t('junkFood.title')}</h1>

      {/* ── Character Image ── */}
      <div className="jff-character-area">
        <img
          key={currentImage}
          src={currentImage}
          loading="lazy"
          alt="Junk food consumption"
          className="jff-character-img"
        />
      </div>

      {/* ── Options Grid (swipe to change) ── */}
      <div className="jff-options-grid" {...swipeHandlers}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`jff-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="jff-footer">
        <button
          type="button"
          className={`jff-next-btn ${selectedOption ? 'active' : 'inactive'}`}
          disabled={!selectedOption}
          onClick={handleNext}
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}
