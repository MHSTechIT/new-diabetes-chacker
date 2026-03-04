import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveProfileData } from '../lib/saveProfile'
import { getProgressPercent } from '../lib/progressSteps'
import './WeightHeight.css'

/* ── Ruler ───────────────────────────────────────────────────── */
function Ruler({ min, max, value, pixelsPerUnit, majorEvery, labelFormatter, onChange }) {
  const containerRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const lastValRef = useRef(value)
  const count = max - min + 1

  /* set spacers + scroll to initial value */
  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    const hw = c.offsetWidth / 2
    if (leftRef.current)  leftRef.current.style.minWidth  = `${hw}px`
    if (rightRef.current) rightRef.current.style.minWidth = `${hw}px`
    c.scrollLeft = (value - min) * pixelsPerUnit
  }, []) // eslint-disable-line

  /* scroll → value */
  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    const onScroll = () => {
      const val = Math.round(c.scrollLeft / pixelsPerUnit) + min
      const clamped = Math.max(min, Math.min(max, val))
      if (clamped !== lastValRef.current) {
        lastValRef.current = clamped
        if (navigator.vibrate) navigator.vibrate(8)
      }
      onChange(clamped)
    }
    c.addEventListener('scroll', onScroll, { passive: true })
    return () => c.removeEventListener('scroll', onScroll)
  }, [min, max, pixelsPerUnit, onChange]) // eslint-disable-line

  /* mouse drag */
  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    let down = false, sx = 0, sl = 0
    const md = e => { down = true; sx = e.clientX; sl = c.scrollLeft }
    const mm = e => { if (!down) return; c.scrollLeft = sl - (e.clientX - sx) }
    const mu = () => { down = false }
    c.addEventListener('mousedown', md)
    window.addEventListener('mousemove', mm)
    window.addEventListener('mouseup', mu)
    return () => {
      c.removeEventListener('mousedown', md)
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('mouseup', mu)
    }
  }, [])

  return (
    <div className="ruler-outer">
      <div className="ruler-indicator" />
      <div className="ruler-scroll" ref={containerRef}>
        <div ref={leftRef}  className="ruler-spacer" />
        {Array.from({ length: count }, (_, i) => {
          const val = min + i
          const isMajor = val % majorEvery === 0
          return (
            <div
              key={val}
              className={`rtick ${isMajor ? 'rtick-major' : 'rtick-minor'}`}
              style={{ width: pixelsPerUnit }}
            >
              {isMajor && (
                <span className="rtick-label">
                  {labelFormatter ? labelFormatter(val) : val}
                </span>
              )}
            </div>
          )
        })}
        <div ref={rightRef} className="ruler-spacer" />
      </div>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
export default function WeightHeight() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const userId    = location.state?.userId

  const [weightUnit, setWeightUnit] = useState('lbs')
  const [heightUnit, setHeightUnit] = useState('ft')
  const [weightKg,   setWeightKg]   = useState(75)   // ~165 lbs
  const [heightCm,   setHeightCm]   = useState(175)  // ~5 ft 9 in
  const [editingWeight, setEditingWeight] = useState(false)
  const [editingHeight, setEditingHeight] = useState(false)
  const [weightInput, setWeightInput] = useState('')
  const [heightInput, setHeightInput] = useState('')

  /* ── derived display values ── */
  const weightLbs   = Math.round(weightKg * 2.20462 * 10) / 10
  const totalInches = Math.round(heightCm / 2.54)
  const ftDisplay   = Math.floor(totalInches / 12)
  const inDisplay   = totalInches % 12

  /* ── ruler configs ── */
  const weightCfg = weightUnit === 'kg'
    ? { min: 30,  max: 200, value: weightKg,    ppu: 20, major: 10 }
    : { min: 66,  max: 440, value: Math.round(weightKg * 2.20462), ppu: 10, major: 10 }

  const heightCfg = heightUnit === 'cm'
    ? { min: 100, max: 250, value: heightCm,    ppu: 20, major: 10 }
    : { min: 48,  max: 96,  value: totalInches, ppu: 20, major: 12 }

  const handleWeightChange = val =>
    setWeightKg(weightUnit === 'kg' ? val : Math.round(val / 2.20462))

  const handleHeightChange = val =>
    setHeightCm(heightUnit === 'cm' ? val : Math.round(val * 2.54))

  const handleWeightDoubleClick = () => {
    setEditingWeight(true)
    setWeightInput(weightUnit === 'kg' ? weightKg.toString() : weightLbs.toFixed(1))
  }

  const handleHeightDoubleClick = () => {
    setEditingHeight(true)
    if (heightUnit === 'cm') {
      setHeightInput(heightCm.toString())
    } else {
      setHeightInput(`${ftDisplay} ${inDisplay}`)
    }
  }

  const handleWeightInputChange = (e) => {
    setWeightInput(e.target.value)
  }

  const handleHeightInputChange = (e) => {
    setHeightInput(e.target.value)
  }

  const handleWeightInputBlur = () => {
    const val = parseFloat(weightInput)
    if (!isNaN(val) && val > 0) {
      const newKg = weightUnit === 'kg' ? val : Math.round(val / 2.20462)
      setWeightKg(Math.max(30, Math.min(200, newKg)))
    }
    setEditingWeight(false)
  }

  const handleHeightInputBlur = () => {
    if (heightUnit === 'cm') {
      const val = parseFloat(heightInput)
      if (!isNaN(val) && val > 0) {
        setHeightCm(Math.max(100, Math.min(250, val)))
      }
    } else {
      // Parse "5 9" or "5" format
      const parts = heightInput.trim().split(/\s+/)
      let feet = parseInt(parts[0])
      let inches = parts[1] ? parseInt(parts[1]) : 0
      if (!isNaN(feet)) {
        const totalInches = feet * 12 + (isNaN(inches) ? 0 : inches)
        const cm = Math.round(totalInches * 2.54)
        setHeightCm(Math.max(100, Math.min(250, cm)))
      }
    }
    setEditingHeight(false)
  }

  const handleWeightKeyDown = (e) => {
    if (e.key === 'Enter') handleWeightInputBlur()
  }

  const handleHeightKeyDown = (e) => {
    if (e.key === 'Enter') handleHeightInputBlur()
  }

  // BMI Calculation
  const calculateBMI = (weightKg, heightCm) => {
    const heightM = heightCm / 100
    const bmi = weightKg / (heightM * heightM)
    return Math.round(bmi * 10) / 10 // Round to 1 decimal
  }

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3B82F6' }
    if (bmi < 25) return { category: 'Normal Weight', color: '#10B981' }
    if (bmi < 30) return { category: 'Overweight', color: '#F59E0B' }
    return { category: 'Obese', color: '#EF4444' }
  }

  const bmi = calculateBMI(weightKg, heightCm)
  const bmiInfo = getBMICategory(bmi)

  const handleNext = async () => {
    await saveProfileData(userId, { weight_kg: weightKg, height_cm: heightCm })
    navigate('/family-history', { state: { userId, gender: location.state?.gender } })
  }

  return (
    <div className="wh-page">
      <div className="wh-scroll-body">
        {/* Header */}
        <div className="wh-header">
          <button className="wh-back-btn" onClick={() => navigate('/age-selection', { state: { userId } })} aria-label="Back">←</button>
          <div className="wh-progress-track">
            <div className="wh-progress-fill" style={{ width: `${getProgressPercent(location.pathname)}%` }} />
          </div>
        </div>

        <div className="wh-content">
        <h1 className="wh-title">Let us know you better</h1>
        <p className="wh-subtitle">Help us personalise your diabetes management plan</p>

        {/* ── Weight ── */}
        <div className="wh-section">
          <div className="wh-section-header">
            <span className="wh-section-label">Weight</span>
            <div className="wh-toggle">
              <button
                className={`wh-toggle-btn ${weightUnit === 'kg' ? 'active' : ''}`}
                onClick={() => setWeightUnit('kg')}
              >kg</button>
              <button
                className={`wh-toggle-btn ${weightUnit === 'lbs' ? 'active' : ''}`}
                onClick={() => setWeightUnit('lbs')}
              >lbs</button>
            </div>
          </div>

          <div className="wh-value-display" onDoubleClick={handleWeightDoubleClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
            {editingWeight ? (
              <input
                type="number"
                value={weightInput}
                onChange={handleWeightInputChange}
                onBlur={handleWeightInputBlur}
                onKeyDown={handleWeightKeyDown}
                autoFocus
                className="wh-value-input"
                placeholder="Enter value"
              />
            ) : (
              <>
                <span className="wh-value-number">
                  {weightUnit === 'kg' ? weightKg : weightLbs.toFixed(1)}
                </span>
                <span className="wh-value-unit">{weightUnit}</span>
              </>
            )}
          </div>

          <Ruler
            key={`w-${weightUnit}`}
            min={weightCfg.min}
            max={weightCfg.max}
            value={weightCfg.value}
            pixelsPerUnit={weightCfg.ppu}
            majorEvery={weightCfg.major}
            onChange={handleWeightChange}
          />
        </div>

        {/* ── Height ── */}
        <div className="wh-section">
          <div className="wh-section-header">
            <span className="wh-section-label">Height</span>
            <div className="wh-toggle">
              <button
                className={`wh-toggle-btn ${heightUnit === 'cm' ? 'active' : ''}`}
                onClick={() => setHeightUnit('cm')}
              >cm</button>
              <button
                className={`wh-toggle-btn ${heightUnit === 'ft' ? 'active' : ''}`}
                onClick={() => setHeightUnit('ft')}
              >ft</button>
            </div>
          </div>

          <div className="wh-value-display" onDoubleClick={handleHeightDoubleClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
            {editingHeight ? (
              <input
                type="text"
                value={heightInput}
                onChange={handleHeightInputChange}
                onBlur={handleHeightInputBlur}
                onKeyDown={handleHeightKeyDown}
                autoFocus
                className="wh-value-input"
                placeholder={heightUnit === 'cm' ? 'Enter cm' : 'Enter ft in (e.g. 5 9)'}
              />
            ) : (
              <>
                {heightUnit === 'cm' ? (
                  <>
                    <span className="wh-value-number">{heightCm}</span>
                    <span className="wh-value-unit">cm</span>
                  </>
                ) : (
                  <>
                    <span className="wh-value-number">{ftDisplay}</span>
                    <span className="wh-value-unit-sm">ft</span>
                    <span className="wh-value-number">{inDisplay}</span>
                    <span className="wh-value-unit-sm">in</span>
                  </>
                )}
              </>
            )}
          </div>

          <Ruler
            key={`h-${heightUnit}`}
            min={heightCfg.min}
            max={heightCfg.max}
            value={heightCfg.value}
            pixelsPerUnit={heightCfg.ppu}
            majorEvery={heightCfg.major}
            labelFormatter={heightUnit === 'ft'
              ? val => `${Math.floor(val / 12)}ft`
              : null}
            onChange={handleHeightChange}
          />
        </div>
        </div>

        {/* ── BMI Card ── */}
        <div className="wh-bmi-card">
          <div className="wh-bmi-value" style={{ color: bmiInfo.color }}>
            {bmi}
          </div>
          <div className="wh-bmi-label">BMI</div>
          <div className="wh-bmi-status" style={{ color: bmiInfo.color }}>
            {bmiInfo.category}
          </div>
        </div>
      </div>

      <div className="wh-next-wrap">
        <button className="wh-next-btn" onClick={handleNext}>
          NEXT
        </button>
      </div>
    </div>
  )
}
