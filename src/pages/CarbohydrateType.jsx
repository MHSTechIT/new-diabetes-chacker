import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import complexImg from '../assets/carbohydrate-type/complex.png'
import mixedImg from '../assets/carbohydrate-type/mixed.png'
import refinedImg from '../assets/carbohydrate-type/refined.png'
import './CarbohydrateType.css'

const options = [
  { id: 'complex', label: 'Mostly complex (millets, brown rice, whole grains)' },
  { id: 'mixed', label: 'Mixed'},
  { id: 'refined', label: 'Mostly refined (white rice, maida, bakery items)'},
]

const imageMap = {
  complex: complexImg,
  mixed: mixedImg,
  refined: refinedImg,
}

function CarbohydrateType() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedOption, setSelectedOption] = useState(null)

  const currentImage = selectedOption ? imageMap[selectedOption] : imageMap.complex

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
    await saveProfileData(userId, { carbohydrate_type: selectedOption })
    navigate('/sugary-beverages', { state: { userId, gender } })
  }

  return (
    <div className="carb-page">
      {/* ── Header ── */}
      <div className="carb-header">
        <button
          type="button"
          className="carb-back-btn"
          onClick={() => navigate('/outside-food-frequency', { state: { userId, gender } })}
          aria-label="Back"
        >
          ←
        </button>
        <div className="carb-progress-track">
          <div className="carb-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="carb-title">What type of carbohydrates do you mostly consume?</h1>

      {/* ── Character Image ── */}
      <div className="carb-character-area">
        <img
          key={currentImage}
          src={currentImage}
          loading="lazy"
          alt="Carbohydrate type"
          className="carb-character-img"
        />
      </div>

      {/* ── Options Grid (swipe to change) ── */}
      <div className="carb-options-grid" {...swipeHandlers}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`carb-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            <span className="carb-option-text">{opt.label}</span>
           
          </button>
        ))}
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="carb-footer">
        <button
          type="button"
          className={`carb-next-btn ${selectedOption ? 'active' : 'inactive'}`}
          disabled={!selectedOption}
          onClick={handleNext}
        >
          NEXT
        </button>
      </div>
    </div>
  )
}

export default CarbohydrateType
