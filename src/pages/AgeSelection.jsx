import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProgressPercent } from '../lib/progressSteps'
import { useSwipe } from '../hooks/useSwipe'
import { saveProfileData } from '../lib/saveProfile'
import menDefault from '../assets/men/men.png'
import men26_30 from '../assets/men/m_26-30.png'
import men30_35 from '../assets/men/m_30-35.png'
import men35_40 from '../assets/men/m_35-40.png'
import men40_45 from '../assets/men/m_40-45.png'
import men45_50 from '../assets/men/m_45-50.png'
import menAbove50 from '../assets/men/above_50.png'

import womenDefault from '../assets/women/women.png'
import women26_30 from '../assets/women/w_26-30.png'
import women30_35 from '../assets/women/w_30-35.png'
import women35_40 from '../assets/women/w_35-40.png'
import women40_45 from '../assets/women/w_40-45.png'
import women45_50 from '../assets/women/w_45-50.png'
import womenAbove50 from '../assets/women/above_50.png'

import './AgeSelection.mobile.css'
import './AgeSelection.desktop.css'

const ageOptions = [
  { id: 'below25', label: 'Below 25' },
  { id: '26-30', label: 'Age 26 - 30' },
  { id: '30-35', label: 'Age 30 - 35' },
  { id: '35-40', label: 'Age 35 - 40' },
  { id: '40-45', label: 'Age 40 - 45' },
  { id: '45-50', label: 'Age 45 - 50' },
  { id: 'above50', label: 'Above 50' },
]

const maleImageMap = {
  below25: menDefault,
  '26-30': men26_30,
  '30-35': men30_35,
  '35-40': men35_40,
  '40-45': men40_45,
  '45-50': men45_50,
  above50: menAbove50,
}

const femaleImageMap = {
  below25: womenDefault,
  '26-30': women26_30,
  '30-35': women30_35,
  '35-40': women35_40,
  '40-45': women40_45,
  '45-50': women45_50,
  above50: womenAbove50,
}

export default function AgeSelection() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId
  const gender = location.state?.gender
  const fromRect = location.state?.fromRect

  const ageImageMap = gender === 'female' ? femaleImageMap : maleImageMap
  const heroSrc = gender === 'female' ? womenDefault : menDefault

  const [currentImage, setCurrentImage] = useState(ageImageMap.below25)
  const [selectedAge, setSelectedAge] = useState(null)
  const [mainCharVisible, setMainCharVisible] = useState(!fromRect)
  const [heroStyle, setHeroStyle] = useState(null)
  const characterSectionRef = useRef(null)

  useEffect(() => {
    if (!fromRect || !characterSectionRef.current) return

    const section = characterSectionRef.current
    const sectionRect = section.getBoundingClientRect()
    const finalHeight = sectionRect.height
    const aspectRatio = fromRect.width / fromRect.height
    const finalWidth = finalHeight * aspectRatio
    const centerX = sectionRect.left + sectionRect.width / 2
    const finalTop = sectionRect.top

    setHeroStyle({
      top: fromRect.top,
      left: fromRect.left,
      width: fromRect.width,
      height: fromRect.height,
      transition: 'none',
    })

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setHeroStyle({
          top: finalTop,
          left: centerX - finalWidth / 2,
          width: finalWidth,
          height: finalHeight,
          transition: 'top 0.55s cubic-bezier(0.4,0,0.2,1), left 0.55s cubic-bezier(0.4,0,0.2,1), width 0.55s cubic-bezier(0.4,0,0.2,1), height 0.55s cubic-bezier(0.4,0,0.2,1)',
        })
      })
    })

    const timer = setTimeout(() => {
      setMainCharVisible(true)
      setHeroStyle(null)
    }, 620)

    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAgeSelect = (option) => {
    setSelectedAge(option.id)
    setCurrentImage(ageImageMap[option.id] ?? ageImageMap.below25)
  }

  const goPrevAge = useCallback(() => {
    const idx = ageOptions.findIndex((o) => o.id === (selectedAge ?? ageOptions[0].id))
    const prev = ageOptions[Math.max(0, idx - 1)]
    setSelectedAge(prev.id)
    setCurrentImage(ageImageMap[prev.id] ?? ageImageMap.below25)
  }, [selectedAge, ageImageMap])

  const goNextAge = useCallback(() => {
    const idx = ageOptions.findIndex((o) => o.id === (selectedAge ?? ageOptions[0].id))
    const next = ageOptions[Math.min(ageOptions.length - 1, idx + 1)]
    setSelectedAge(next.id)
    setCurrentImage(ageImageMap[next.id] ?? ageImageMap.below25)
  }, [selectedAge, ageImageMap])

  const swipeHandlers = useSwipe({
    onSwipeLeft: goNextAge,
    onSwipeRight: goPrevAge,
  })

  const handleNext = async () => {
    if (!selectedAge) return
    await saveProfileData(userId, { age_range: selectedAge })
    const isFemale = gender === 'female'
    if (isFemale) {
      navigate('/gestational-diabetes', { state: { userId, gender, selectedAge } })
      return
    }
    navigate('/weight-height', { state: { userId, gender } })
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="header">
        <button type="button" className="back-btn" onClick={() => navigate('/')} aria-label="Back">
          ←
        </button>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
        </div>
      </div>

      <h1 className="title">Please choose your age</h1>

      {/* Main content: image top, options bottom on mobile */}
      <div className="main-content">
        {/* Character image (top on mobile) */}
        <div className="character-column" ref={characterSectionRef}>
          <div className="char-glow" />
          <img
            key={currentImage}
            src={currentImage}
            alt="character"
            loading="lazy"
            className="character-img"
            style={{ opacity: mainCharVisible ? 1 : 0 }}
          />
        </div>
        {/* Age options (bottom on mobile) — swipe to change age */}
        <div className="options-column" {...swipeHandlers}>
          {ageOptions.map((option) => (
            <div
              key={option.id}
              role="button"
              tabIndex={0}
              className={`age-card ${selectedAge === option.id ? 'selected' : ''}`}
              onClick={() => handleAgeSelect(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleAgeSelect(option)
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>

      {/* Hero animation overlay */}
      {heroStyle && (
        <img
          src={heroSrc}
          alt=""
          aria-hidden
          style={{
            position: 'fixed',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            pointerEvents: 'none',
            zIndex: 9999,
            ...heroStyle,
          }}
        />
      )}

      {/* Bottom: NEXT */}
      <div className="bottom-section">
        <button
          type="button"
          className={`next-btn ${selectedAge ? 'active' : 'inactive'}`}
          onClick={handleNext}
          disabled={!selectedAge}
        >
          NEXT
        </button>
      </div>
    </div>
  )
}
