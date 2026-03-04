import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import sugaryBeveragesImg from '../assets/sugary-beverages/sugary_beverages.png'
import './SugaryBeverages.css'

const options = [
  { id: 'no', label: 'No' },
  { id: 'yes', label: 'Yes' },
]

export default function SugaryBeverages() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedOption, setSelectedOption] = useState(null)

  const currentImage = sugaryBeveragesImg

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
    await saveProfileData(userId, { sugary_beverages: selectedOption })
    navigate('/sleep-duration', { state: { userId, gender } })
  }

  return (
    <div className="sb-page">
      {/* ── Header ── */}
      <div className="sb-header">
        <button
          type="button"
          className="sb-back-btn"
          onClick={() => navigate('/carbohydrate-type', { state: { userId, gender } })}
          aria-label="Back"
        >
          ←
        </button>
        <div className="sb-progress-track">
          <div className="sb-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="sb-title">Do you consume sugary beverages daily?<br />(tea, coffee or drinks)</h1>

      {/* ── Character Image ── */}
      <div className="sb-character-area">
        <img
          key={currentImage}
          src={currentImage}
          loading="lazy"
          alt="Sugary beverages consumption"
          className="sb-character-img"
        />
      </div>

      {/* ── Options Grid (swipe to change) ── */}
      <div className="sb-options-grid" {...swipeHandlers}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`sb-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="sb-footer">
        <button
          type="button"
          className={`sb-next-btn ${selectedOption ? 'active' : 'inactive'}`}
          disabled={!selectedOption}
          onClick={handleNext}
        >
          NEXT
        </button>
      </div>
    </div>
  )
}
