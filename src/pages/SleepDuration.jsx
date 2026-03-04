import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import sleepDurationMaleImg from '../assets/sleep-duration/sleep_duration_male.png'
import sleepDurationFemaleImg from '../assets/sleep-duration/sleep_duration_female.png'
import './SleepDuration.css'

const options = [
  { id: '7-8', label: '7–8 hours' },
  { id: 'more8', label: 'More than 8 hours' },
  { id: '6-7', label: '6–7 hours' },
  { id: 'less6', label: 'Less than 6 hours' },
]

export default function SleepDuration() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [selectedOption, setSelectedOption] = useState(null)

  const resolvedGender = gender === 'female' ? 'female' : 'male'
  const currentImage = resolvedGender === 'female' ? sleepDurationFemaleImg : sleepDurationMaleImg

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
    await saveProfileData(userId, { sleep_duration: selectedOption })
    navigate('/snoring', { state: { userId, gender } })
  }

  return (
    <div className="sd-page">
      {/* ── Header ── */}
      <div className="sd-header">
        <button
          type="button"
          className="sd-back-btn"
          onClick={() => navigate('/sugary-beverages', { state: { userId, gender } })}
          aria-label="Back"
        >
          ←
        </button>
        <div className="sd-progress-track">
          <div className="sd-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="sd-title">How many hours do you sleep daily?</h1>

      {/* ── Character Image ── */}
      <div className="sd-character-area">
        <img
          key={currentImage}
          src={currentImage}
          loading="lazy"
          alt="Sleep duration"
          className="sd-character-img"
        />
      </div>

      {/* ── Options Grid (swipe to change) ── */}
      <div className="sd-options-grid" {...swipeHandlers}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`sd-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="sd-footer">
        <button
          type="button"
          className={`sd-next-btn ${selectedOption ? 'active' : 'inactive'}`}
          disabled={!selectedOption}
          onClick={handleNext}
        >
          NEXT
        </button>
      </div>
    </div>
  )
}
