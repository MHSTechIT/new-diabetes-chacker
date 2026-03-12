import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import vigorousMale from '../assets/physical-activity/vigorous_male.png'
import vigorousFemale from '../assets/physical-activity/vigorous_female.png'
import moderateMale from '../assets/physical-activity/moderate_male.png'
import moderateFemale from '../assets/physical-activity/moderate_female.png'
import lightMale from '../assets/physical-activity/light_male.png'
import lightFemale from '../assets/physical-activity/light_female.png'
import sedentaryMale from '../assets/physical-activity/sedentary_male.png'
import sedentaryFemale from '../assets/physical-activity/sedentary_female.png'
import './PhysicalActivityLevel.css'

const options = [
  { id: 'vigorous', labelKey: 'physicalActivity.vigorous' },
  { id: 'moderate', labelKey: 'physicalActivity.moderate' },
  { id: 'light', labelKey: 'physicalActivity.light' },
  { id: 'sedentary', labelKey: 'physicalActivity.sedentary' },
]

const imageMap = {
  vigorous: { male: vigorousMale, female: vigorousFemale },
  moderate: { male: moderateMale, female: moderateFemale },
  light: { male: lightMale, female: lightFemale },
  sedentary: { male: sedentaryMale, female: sedentaryFemale },
}

export default function PhysicalActivityLevel() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
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
    const prev = options[Math.max(0, idx)]
    setSelectedOption(prev.id)
  }, [selectedOption])

  const goNext = useCallback(() => {
    const idx = selectedOption ? options.findIndex((o) => o.id === selectedOption) : -1
    const next = options[Math.min(options.length - 1, idx + 1)]
    setSelectedOption(next.id)
  }, [selectedOption])

  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev })

  const handleNext = async () => {
    if (!selectedOption) return
    await saveProfileData(userId, { physical_activity_level: selectedOption })
    navigate('/junk-food-frequency', { state: { userId, gender } })
  }

  return (
    <div className="pal-page">
      {/* ── Header ── */}
      <div className="pal-header">
        <button
          type="button"
          className="pal-back-btn"
          onClick={() => navigate('/hip-size', { state: { userId, gender } })}
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className="pal-progress-track">
          <div className="pal-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="pal-title">{t('physicalActivity.title')}</h1>

      {/* ── Character Image ── */}
      <div className="pal-character-area">
        <img
          key={currentImage}
          src={currentImage}
          loading="lazy"
          alt="Physical activity"
          className="pal-character-img"
        />
      </div>

      {/* ── Options Grid (swipe to change) ── */}
      <div className="pal-options-grid" {...swipeHandlers}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`pal-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="pal-footer">
        <button
          type="button"
          className={`pal-next-btn ${selectedOption ? 'active' : 'inactive'}`}
          disabled={!selectedOption}
          onClick={handleNext}
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}
