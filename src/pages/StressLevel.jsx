import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import lowMaleImg from '../assets/stress-level/low_male.png'
import lowFemaleImg from '../assets/stress-level/low_female.png'
import moderateMaleImg from '../assets/stress-level/moderate_male.png'
import moderateFemaleImg from '../assets/stress-level/moderate_female.png'
import highMaleImg from '../assets/stress-level/high_male.png'
import highFemaleImg from '../assets/stress-level/high_female.png'
import './StressLevel.css'

const options = [
  { id: 'low', label: 'Low' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'high', label: 'High' },
]

const imageMap = {
  low: { male: lowMaleImg, female: lowFemaleImg },
  moderate: { male: moderateMaleImg, female: moderateFemaleImg },
  high: { male: highMaleImg, female: highFemaleImg },
}

export default function StressLevel() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedOption, setSelectedOption] = useState(null)

  const resolvedGender = gender === 'female' ? 'female' : 'male'
  const currentImage =
    selectedOption && imageMap[selectedOption]
      ? imageMap[selectedOption][resolvedGender]
      : imageMap.moderate[resolvedGender]

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
    await saveProfileData(userId, { stress_level: selectedOption })
    navigate('/medical-conditions', { state: { userId, gender } })
  }

  return (
    <div className="sl-page">
      {/* ── Header ── */}
      <div className="sl-header">
        <button
          type="button"
          className="sl-back-btn"
          onClick={() => navigate('/weight-gain', { state: { userId, gender } })}
          aria-label="Back"
        >
          ←
        </button>
        <div className="sl-progress-track">
          <div className="sl-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="sl-title">What is your stress level?</h1>

      {/* ── Character Image ── */}
      <div className="sl-character-area">
        {/* Music Symbols Animation - Only for Low stress */}
        {selectedOption === 'low' && (
          <div className="sl-music-container">
            <div className="sl-music-note sl-music-note1">♪</div>
            <div className="sl-music-note sl-music-note2">♫</div>
            <div className="sl-music-note sl-music-note3">♪</div>
            <div className="sl-music-note sl-music-note4">♫</div>
          </div>
        )}

        {/* Red Face Shade Animation - Only for High stress */}
        {selectedOption === 'high' && (
          <div className="sl-red-shade-container">
            <div className="sl-red-shade" />
          </div>
        )}

        <img
          src={currentImage}
          alt="Stress level"
          loading="lazy"
          className="sl-character-img"
        />
      </div>

      {/* ── Options Grid (swipe to change) ── */}
      <div className="sl-options-grid" {...swipeHandlers}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`sl-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="sl-footer">
        <button
          type="button"
          className={`sl-next-btn ${selectedOption ? 'active' : 'inactive'}`}
          disabled={!selectedOption}
          onClick={handleNext}
        >
          NEXT
        </button>
      </div>
    </div>
  )
}
