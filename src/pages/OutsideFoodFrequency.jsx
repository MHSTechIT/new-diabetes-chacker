import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import outsideFoodMale from '../assets/outside-food/outside_food_male.png'
import outsideFoodFemale from '../assets/outside-food/outside_food_female.png'
import './OutsideFoodFrequency.css'

const options = [
  { id: 'rarely', labelKey: 'junkFood.rarely' },
  { id: 'weekly1_2', labelKey: 'junkFood.weekly1_2' },
  { id: 'weekly3_4', labelKey: 'junkFood.weekly3_4' },
  { id: 'weekly5plus', labelKey: 'junkFood.weekly5plus' },
]

function OutsideFoodFrequency() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedOption, setSelectedOption] = useState(null)

  const currentImage = gender === 'male' ? outsideFoodMale : outsideFoodFemale

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
    await saveProfileData(userId, { outside_food_frequency: selectedOption })
    navigate('/carbohydrate-type', { state: { userId, gender } })
  }

  return (
    <div className="off-page">
      {/* ── Header ── */}
      <div className="off-header">
        <button
          type="button"
          className="off-back-btn"
          onClick={() => navigate('/junk-food-frequency', { state: { userId, gender } })}
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className="off-progress-track">
          <div className="off-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="off-title">{t('outsideFood.title')}</h1>

      {/* ── Character Image ── */}
      <div className="off-character-area">
        <img
          key={currentImage}
          src={currentImage}
          loading="lazy"
          alt="Outside food consumption"
          className="off-character-img"
        />
      </div>

      {/* ── Options Grid (swipe to change) ── */}
      <div className="off-options-grid" {...swipeHandlers}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`off-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="off-footer">
        <button
          type="button"
          className={`off-next-btn ${selectedOption ? 'active' : 'inactive'}`}
          disabled={!selectedOption}
          onClick={handleNext}
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}

export default OutsideFoodFrequency
