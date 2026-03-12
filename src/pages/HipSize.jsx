import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import maleLess90 from '../assets/hip-size/male_less90.png'
import male90_100 from '../assets/hip-size/male_90_100.png'
import maleMore100 from '../assets/hip-size/male_more100.png'
import femaleLess80 from '../assets/hip-size/female_less80.png'
import female80_90 from '../assets/hip-size/female_80_90.png'
import femaleMore90 from '../assets/hip-size/female_more90.png'
import './HipSize.css'

const maleOptions = [
  { id: 'less90', labelKey: 'hipSize.maleLess90', image: maleLess90 },
  { id: '90-100', labelKey: 'hipSize.male90_100', image: male90_100 },
  { id: 'more100', labelKey: 'hipSize.maleMore100', image: maleMore100 },
]

const femaleOptions = [
  { id: 'less80', labelKey: 'hipSize.femaleLess80', image: femaleLess80 },
  { id: '80-90', labelKey: 'hipSize.female80_90', image: female80_90 },
  { id: 'more90', labelKey: 'hipSize.femaleMore90', image: femaleMore90 },
]

export default function HipSize() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const userId = location.state?.userId
  const gender = location.state?.gender

  const options = gender === 'female' ? femaleOptions : maleOptions
  const [selectedOption, setSelectedOption] = useState(null)
  const currentImage = selectedOption
    ? options.find((opt) => opt.id === selectedOption)?.image
    : options[0].image

  const handleOptionSelect = (optionId) => {
    setSelectedOption((prev) => (prev === optionId ? null : optionId))
  }

  const goPrev = useCallback(() => {
    const idx = selectedOption ? options.findIndex((o) => o.id === selectedOption) : -1
    setSelectedOption(options[Math.max(0, idx)].id)
  }, [selectedOption, options])

  const goNext = useCallback(() => {
    const idx = selectedOption ? options.findIndex((o) => o.id === selectedOption) : -1
    setSelectedOption(options[Math.min(options.length - 1, idx + 1)].id)
  }, [selectedOption, options])

  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev })

  const handleNext = async () => {
    if (!selectedOption) return
    await saveProfileData(userId, { hip_size: selectedOption })
    navigate('/physical-activity', { state: { userId, gender } })
  }

  return (
    <div className="hs-page">
      {/* ── Header ── */}
      <div className="hs-header">
        <button
          type="button"
          className="hs-back-btn"
          onClick={() => navigate('/family-history', { state: { userId, gender } })}
          aria-label={t('common.back')}
        >
          ←
        </button>
        <div className="hs-progress-track">
          <div className="hs-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      {/* ── Title ── */}
      <h1 className="hs-title">{t('hipSize.title')}</h1>

      {/* ── Character Image ── */}
      <div className="hs-character-area">
        <img
          key={currentImage}
          src={currentImage}
          loading="lazy"
          alt="Hip measurement"
          className="hs-character-img"
        />
      </div>

      {/* ── Options Grid (swipe to change) ── */}
      <div className="hs-options-grid" {...swipeHandlers}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`hs-option-btn ${selectedOption === opt.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(opt.id)}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {/* ── Footer / NEXT ── */}
      <div className="hs-footer">
        <button
          type="button"
          className={`hs-next-btn ${selectedOption ? 'active' : 'inactive'}`}
          disabled={!selectedOption}
          onClick={handleNext}
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}
