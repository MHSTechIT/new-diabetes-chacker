import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import outsideFoodMale from '../assets/outside-food/outside_food_male.png'
import outsideFoodFemale from '../assets/outside-food/outside_food_female.png'
import './OutsideFoodFrequency.css'

const options = [
  { id: 'rarely', label: 'Rarely' },
  { id: 'weekly1_2', label: '1–2 times per week' },
  { id: 'weekly3_4', label: '3–4 times per week' },
  { id: 'weekly5plus', label: '5 or more times/week' },
]

function OutsideFoodFrequency() {
  const navigate = useNavigate()
  const location = useLocation()
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
          aria-label="Back"
        >
          ←
        </button>
        <div className="off-progress-track">
          <div className="off-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="off-title">How often do you eat outside food (restaurant/takeaway)?</h1>

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
            {opt.label}
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
          NEXT
        </button>
      </div>
    </div>
  )
}

export default OutsideFoodFrequency
