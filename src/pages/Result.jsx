import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { getProfile } from '../lib/profileStorage'
import { calculateRisk } from '../utils/scoring'
import { apiAnalyzeReport } from '../lib/api'
import BodyOutline from '../components/BodyOutline'
import ConfirmModal from '../components/ConfirmModal'
import './Result.css'

const WATER_COLORS = {
  LOW: '#10b981',
  LOW_MODERATE: '#22c55e',
  MODERATE: '#f59e0b',
  MODERATE_HIGH: '#f97316',
  HIGH: '#f43f5e',
}

const INTRO_DURATION_MS = 8000
const SHRINK_DURATION_MS = 1500

const AURORA_BY_LEVEL = {
  LOW: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(16,185,129,0.12), transparent)',
  LOW_MODERATE: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(34,197,94,0.12), transparent)',
  MODERATE: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(245,158,11,0.15), transparent)',
  MODERATE_HIGH: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(249,115,22,0.15), transparent)',
  HIGH: 'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(244,63,94,0.15), transparent), radial-gradient(ellipse 80% 40% at 50% 20%, rgba(139,92,246,0.1), transparent)',
}

const RISK_COLORS = {
  LOW: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#10b981', dot: '#10b981' },
  LOW_MODERATE: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', dot: '#f59e0b' },
  MODERATE: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', dot: '#f59e0b' },
  MODERATE_HIGH: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)', text: '#f97316', dot: '#f97316' },
  HIGH: { bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)', text: '#f43f5e', dot: '#f43f5e' },
}

const STATUS_LINE = {
  LOW: 'You are unlikely to be Diabetic',
  LOW_MODERATE: 'Low chance of developing diabetes',
  MODERATE: 'You may be Pre-Diabetic',
  MODERATE_HIGH: 'You are likely Diabetic',
  HIGH: 'You are likely Diabetic — act now',
}

const CATEGORY_COLORS = {
  'Medical history': { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#3b82f6', label: 'Medical' },
  'Diet': { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', label: 'Diet' },
  'Lifestyle': { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', text: '#a855f7', label: 'Lifestyle' },
  'Activity': { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)', text: '#a855f7', label: 'Lifestyle' },
  'Sleep': { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)', text: '#6366f1', label: 'Sleep' },
  'Gestational': { bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.3)', text: '#ec4899', label: 'Gestational' },
  'Symptoms': { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#ef4444', label: 'Symptoms' },
  'BMI': { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#3b82f6', label: 'Medical' },
  'Family history': { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#3b82f6', label: 'Medical' },
  'Age': { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#3b82f6', label: 'Medical' },
  'Waist/Hip': { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#3b82f6', label: 'Medical' },
}

const BADGE_LABEL = {
  LOW: 'LOW RISK',
  LOW_MODERATE: 'LOW TO MODERATE',
  MODERATE: 'MODERATE RISK',
  MODERATE_HIGH: 'MODERATE TO HIGH',
  HIGH: 'HIGH RISK',
}

const RECOMMENDED_ACTIONS = {
  LOW: ['Maintain healthy weight', 'Stay active', 'Eat balanced diet'],
  LOW_MODERATE: ['Reduce refined carbs and sugary drinks', 'Add 30 minutes daily walking', 'Get a blood sugar test within 6 months'],
  MODERATE: ['See a doctor', 'HbA1c and fasting glucose', 'Lifestyle changes'],
  MODERATE_HIGH: ['See doctor soon', 'Full blood panel', 'Strict lifestyle changes'],
  HIGH: ['See doctor immediately', 'Blood tests', 'Follow medical advice'],
}

const DURATION_MS = 1200

function easeOutQuad(t) {
  return 1 - (1 - t) ** 2
}

export default function Result() {
  const navigate = useNavigate()
  const location = useLocation()
  const resultFromState = location.state?.result
  const userId = location.state?.userId
  const gender = location.state?.gender

  const [resultData, setResultData] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(!resultFromState && !!userId)
  const [loadError, setLoadError] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)
  const [animationPhase, setAnimationPhase] = useState(() => (location.state?.playAnimation === true ? 'intro' : 'done'))
  const [introWaterLevel, setIntroWaterLevel] = useState(0)
  const [introPercentage, setIntroPercentage] = useState(0)
  const [shrinkTransform, setShrinkTransform] = useState(null)
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [boostStep, setBoostStep] = useState('options')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeWaterLevel, setAnalyzeWaterLevel] = useState(0)
  const [analysisError, setAnalysisError] = useState(null)
  const [enhancedResult, setEnhancedResult] = useState(null)
  const [showBackConfirm, setShowBackConfirm] = useState(false)
  const bodyWrapRef = useRef(null)
  const targetSlotRef = useRef(null)

  const result = enhancedResult?.result ?? resultFromState ?? resultData
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!resultFromState && !userId) {
      navigate('/', { replace: true })
      return
    }
  }, [userId, resultFromState, navigate])

  useEffect(() => {
    if (resultFromState || !userId) return
    let cancelled = false
    async function fetchAndCompute() {
      try {
        let profile = {}
        if (supabase) {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single()
          if (!cancelled && error) {
            profile = getProfile() || {}
          } else if (data) {
            profile = data
          }
        } else {
          profile = getProfile() || {}
        }
        if (cancelled) return
        setProfile(profile)
        const computed = calculateRisk(profile)
        setResultData(computed)
      } catch (err) {
        if (!cancelled) {
          setLoadError(err?.message || 'Something went wrong')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAndCompute()
    return () => { cancelled = true }
  }, [userId, resultFromState])

  const level = result?.riskLevel ?? 'LOW'
  const colors = RISK_COLORS[level] ?? RISK_COLORS.LOW
  const truncate = (str, max = 24) => (str?.length > max ? `${str.slice(0, max)}...` : str)

  const groupedFactors = useMemo(() => {
    const grouped = {}
    const categoryTotals = {}

    result?.riskyFactors?.forEach((factor) => {
      const category = factor.category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
        categoryTotals[category] = 0
      }
      grouped[category].push(factor)
      categoryTotals[category] += factor.points || 0
    })

    return { grouped, categoryTotals }
  }, [result?.riskyFactors])

  const summary = useMemo(() => {
    if (!result?.riskyFactors?.length) {
      if (level === 'LOW') return 'Your responses suggest a low diabetes risk. Keep up healthy habits.'
      if (level === 'LOW_MODERATE') return 'You have a low but present risk. Targeted lifestyle changes can keep this risk from growing.'
      if (level === 'MODERATE') return 'Your risk is moderate. We recommend speaking with a doctor.'
      if (level === 'MODERATE_HIGH') return 'Your risk is elevated. Please consult a healthcare provider.'
      return 'Your risk is high. Please see a doctor as soon as possible.'
    }
    const first = result.riskyFactors[0]
    const second = result.riskyFactors[1]
    const rest = result.riskyFactors.length > 2 ? ` and ${result.riskyFactors.length - 2} other factor(s)` : ''
    if (level === 'LOW') return `Your risk is low. Factors like ${first.factor} may contribute. Keep up healthy habits.`
    if (level === 'LOW_MODERATE') return `You have a low but present risk. Factors like ${first.factor}${second ? `, ${second.factor}` : ''}${rest} are contributing. Targeted lifestyle changes can keep this risk from growing.`
    if (level === 'MODERATE') return `Notable factors: ${first.factor}. A check-up is recommended.`
    if (level === 'MODERATE_HIGH') return `Several factors (e.g. ${first.factor}) suggest elevated risk. Please consult a healthcare provider.`
    return `Multiple risk factors including ${first.factor} indicate high risk. See a doctor as soon as possible.`
  }, [result?.riskyFactors, level])

  useEffect(() => {
    if (result?.totalScore == null) return
    const target = result.totalScore
    const start = 0
    const startTime = performance.now()

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / DURATION_MS, 1)
      const eased = easeOutQuad(progress)
      setScoreDisplay(Math.round(start + (target - start) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [result?.totalScore])

  useEffect(() => {
    if (!result || animationPhase !== 'intro') return
    if (prefersReducedMotion) {
      setIntroWaterLevel((result.totalScore ?? 0) / 100)
      setIntroPercentage(result.totalScore ?? 0)
      setAnimationPhase('done')
      return
    }
    const totalScore = result.totalScore ?? 0
    const targetWater = totalScore / 100
    const startTime = performance.now()

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / INTRO_DURATION_MS, 1)
      const eased = easeOutQuad(progress)
      setIntroWaterLevel(targetWater * eased)
      setIntroPercentage(Math.round(totalScore * eased))
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setAnimationPhase('shrink')
      }
    }
    requestAnimationFrame(tick)
  }, [result, animationPhase, prefersReducedMotion])

  useEffect(() => {
    if (animationPhase !== 'shrink' || !bodyWrapRef.current || !targetSlotRef.current) return
    const bodyEl = bodyWrapRef.current
    const targetEl = targetSlotRef.current
    let rafId
    const run = () => {
      const bodyRect = bodyEl.getBoundingClientRect()
      const targetRect = targetEl.getBoundingClientRect()
      const scale = targetRect.width / bodyRect.width
      const translateX = targetRect.left + targetRect.width / 2 - (bodyRect.left + bodyRect.width / 2)
      const translateY = targetRect.top + targetRect.height / 2 - (bodyRect.top + bodyRect.height / 2)
      setShrinkTransform({ scale, translateX, translateY })
    }
    rafId = requestAnimationFrame(() => requestAnimationFrame(run))
    return () => { if (rafId) cancelAnimationFrame(rafId) }
  }, [animationPhase])

  useEffect(() => {
    if (animationPhase !== 'shrink' || !shrinkTransform) return
    const t = setTimeout(() => setAnimationPhase('done'), SHRINK_DURATION_MS)
    return () => clearTimeout(t)
  }, [animationPhase, shrinkTransform])

  useEffect(() => {
    if (!analyzing) return
    const startTime = performance.now()
    const duration = 2500
    let rafId
    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) ** 2
      setAnalyzeWaterLevel(0.15 + eased * 0.45)
      if (analyzing) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => { if (rafId) cancelAnimationFrame(rafId) }
  }, [analyzing])

  const handleRetake = () => {
    navigate('/', { state: userId ? { userId, gender } : undefined })
  }

  const openBoostModal = () => {
    setShowBoostModal(true)
    setBoostStep('options')
    setAnalysisError(null)
  }

  const closeBoostModal = () => {
    setShowBoostModal(false)
    setBoostStep('options')
    setAnalysisError(null)
  }

  const handleUploadReport = () => {
    setBoostStep('upload')
    setAnalysisError(null)
  }

  const handleBoostBack = () => {
    setBoostStep('options')
    setAnalysisError(null)
  }

  const MIN_ANALYZING_MS = 2500

  const handleFileSelect = async (e) => {
    const file = e.target?.files?.[0]
    if (!file || !file.type.startsWith('image/')) {
      setAnalysisError('Please select an image file (e.g. JPG, PNG).')
      return
    }
    setAnalyzing(true)
    setAnalyzeWaterLevel(0)
    setAnalysisError(null)
    const startTime = Date.now()
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result
          const base64Part = dataUrl?.indexOf(',') >= 0 ? dataUrl.slice(dataUrl.indexOf(',') + 1) : dataUrl
          resolve(base64Part)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const profileToSend = profile || getProfile()
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      const data = await apiAnalyzeReport({
        userId: profileToSend?.id || userId,
        profile: profileToSend,
        imageBase64: base64,
        imageMimeType: mimeType,
      })
      const elapsed = Date.now() - startTime
      if (elapsed < MIN_ANALYZING_MS) {
        await new Promise((r) => setTimeout(r, MIN_ANALYZING_MS - elapsed))
      }
      setEnhancedResult(data)
      setResultData(data.result)
      setShowBoostModal(false)
    } catch (err) {
      setAnalysisError(err?.message || 'Analysis failed. Please try again.')
      setBoostStep('upload')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Diabetes Risk Result',
        text: `My diabetes risk score: ${result?.totalScore ?? 0}/100 (${result?.riskLevel ?? 'LOW'})`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(window.location.href)
    }
  }

  if (!result) {
    return null
  }

  if (loading) {
    return (
      <div className="result-page result-loading">
        <div className="result-loader-spinner" aria-hidden />
        <p className="result-loader-text">Calculating your result…</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <>
        <div className="result-page result-loading">
          <p className="result-loader-error">{loadError}</p>
          <button
            type="button"
            className="result-btn-primary"
            onClick={() => setShowBackConfirm(true)}
          >
            Go back
          </button>
        </div>
        {showBackConfirm && (
          <ConfirmModal
            message="Do you need to start from the beginning?"
            confirmLabel="Yes"
            cancelLabel="No"
            onConfirm={() => {
              setShowBackConfirm(false)
              navigate('/', { replace: true })
            }}
            onCancel={() => setShowBackConfirm(false)}
          />
        )}
      </>
    )
  }

  const waterColor = WATER_COLORS[level] ?? WATER_COLORS.LOW
  const resolvedGender = gender === 'female' ? 'female' : 'male'

  const scoreSlotContent = () => {
    if (animationPhase === 'shrink') {
      return <div ref={targetSlotRef} className="result-animation-slot" aria-hidden />
    }
    if (animationPhase === 'done') {
      return (
        <BodyOutline
          gender={resolvedGender}
          width={120}
          height={120}
          waterLevel={(result?.totalScore ?? 0) / 100}
          waterColor={waterColor}
          centerContent={
            <span className="result-score-value result-score-percent">{scoreDisplay}%</span>
          }
        />
      )
    }
    return null
  }

  const mainContent = (
    <>
      <h1 className="result-title">Your Result</h1>
      <div className="result-body">
        {!(enhancedResult?.extractedLabs && (enhancedResult.extractedLabs.hba1c != null || enhancedResult.extractedLabs.fastingGlucose != null)) && (
          <div className="result-accuracy-banner">
            <div className="result-accuracy-message">
              <span className="result-accuracy-icon" aria-hidden>⚠</span>
              <span>This result is 50–60% accurate. Based on your answers only. Upload your blood report to get AI-powered precision.</span>
            </div>
            <button
              type="button"
              className="result-accuracy-cta"
              onClick={openBoostModal}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBoostModal(); } }}
            >
              Get 90%+ Accuracy →
            </button>
          </div>
        )}

        <div className="result-score-section">
          <div className="result-score-ring-wrap">
            {scoreSlotContent()}
          </div>
          {animationPhase === 'done' && (
            <>
              <div
                className="result-badge"
                style={{ background: colors.bg, borderColor: colors.border }}
              >
                <span className="result-badge-dot" style={{ background: colors.dot }} />
                <span className="result-badge-label" style={{ color: colors.text }}>
                  {BADGE_LABEL[level]}
                </span>
              </div>
              <p className="result-status-line" style={{ color: colors.text }}>
                {STATUS_LINE[level]}
              </p>
              <p className="result-probability">
                Probability: {result.probabilityRangeText}
              </p>
            </>
          )}
        </div>

        {animationPhase === 'done' && enhancedResult?.extractedLabs && (enhancedResult.extractedLabs.hba1c != null || enhancedResult.extractedLabs.fastingGlucose != null) && (
          <div className="result-card result-combined-report-card">
            <h2 className="result-card-title">Your combined report</h2>
            {enhancedResult.quotaExceeded && (
              <p className="result-combined-quota-notice">
                {enhancedResult.quotaReason === 'rate_limit'
                  ? 'Sample values below (rate limit — not your daily quota). This often happens with free tier’s per-minute limit. Wait about 60 seconds and try again to get your real HbA1c and blood sugar from your report.'
                  : 'Sample values below (API quota exceeded). We could not read your report this time. Try again later for your real HbA1c and blood sugar.'}
              </p>
            )}
            <p className="result-combined-intro">
              {enhancedResult.quotaExceeded
                ? 'Your result above is based on your questionnaire only. When quota is available, we will combine it with values from your blood report.'
                : (enhancedResult.combinedReportSummary || 'Your risk score above combines your questionnaire answers with the blood report values read by AI.')}
            </p>
            <div className="result-combined-sections">
              <div className="result-combined-section">
                <span className="result-combined-section-title">From your questionnaire</span>
                <span className="result-combined-section-text">Your answers (age, diet, activity, health) are included in the result.</span>
              </div>
              <div className="result-combined-section">
                <span className="result-combined-section-title">
                  From your blood report {enhancedResult.quotaExceeded ? '(report not read this time)' : '(AI-read)'}
                </span>
                {enhancedResult.quotaExceeded ? (
                  <p className="result-blood-report-not-read">
                    We couldn’t read your report (rate limit). Wait about 60 seconds and upload again to get your real HbA1c and fasting blood sugar.
                  </p>
                ) : (
                  <div className="result-blood-report-values">
                    {enhancedResult.extractedLabs.hba1c != null && (
                      <div className="result-blood-report-row">
                        <span className="result-blood-report-label">HbA1c</span>
                        <span className="result-blood-report-value">{enhancedResult.extractedLabs.hba1c}%</span>
                      </div>
                    )}
                    {enhancedResult.extractedLabs.fastingGlucose != null && (
                      <div className="result-blood-report-row">
                        <span className="result-blood-report-label">Fasting blood sugar</span>
                        <span className="result-blood-report-value">{enhancedResult.extractedLabs.fastingGlucose} mg/dL</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {animationPhase === 'done' && Object.keys(groupedFactors.grouped).length > 0 && (
          <>
            <div className="result-card result-factors-section">
              <h3 className="result-factors-title">Contributing Factors</h3>
              {Object.entries(groupedFactors.grouped).map(([category, factors]) => (
                <div key={category} className="result-category-group">
                  <div className="result-category-header">
                    <span
                      className="result-category-badge"
                      style={{
                        background: CATEGORY_COLORS[category]?.bg,
                        borderColor: CATEGORY_COLORS[category]?.border,
                        color: CATEGORY_COLORS[category]?.text,
                      }}
                    >
                      {CATEGORY_COLORS[category]?.label || category}
                    </span>
                  </div>
                  <div className="result-factor-chips">
                    {factors.map((f, i) => (
                      <span
                        key={i}
                        className="result-factor-chip"
                        style={{
                          borderColor: CATEGORY_COLORS[category]?.border,
                          color: CATEGORY_COLORS[category]?.text,
                          background: CATEGORY_COLORS[category]?.bg,
                        }}
                      >
                        <span className="result-factor-chip-icon">▲</span>
                        <span className="result-factor-name">{truncate(f.factor)}</span>
                        <span className="result-factor-points">+{f.points}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {animationPhase === 'done' && (
          <>
            <div className="result-card">
              <h2 className="result-card-title">Your Report Summary</h2>
              <p className="result-summary-text">{summary}</p>
            </div>

            <div className="result-card">
              <h2 className="result-card-title">What To Do Next</h2>
              <ul className="result-actions-list">
                {RECOMMENDED_ACTIONS[level].map((action, i) => (
                  <li key={i}><span className="result-actions-arrow">→</span> {action}</li>
                ))}
              </ul>
            </div>

            {enhancedResult?.riskExplanation && (
              <div className="result-card result-risk-explanation">
                <h2 className="result-card-title">Risk in context</h2>
                <p className="result-summary-text">{enhancedResult.riskExplanation}</p>
              </div>
            )}

            {enhancedResult?.quotaExceeded && (
              <div className="result-card result-quota-notice">
                <p className="result-quota-notice-text">
                  {enhancedResult.quotaMessage || 'AI analysis is temporarily unavailable. Your result above is based on your answers only — we could not read your blood report this time.'}
                </p>
                <p className="result-quota-notice-hint">
{enhancedResult.quotaReason === 'rate_limit'
                  ? 'Wait about 60 seconds and try again (this is usually a per-minute limit, not daily quota). If it keeps happening, check that the Gemini API is enabled for your key at Google AI Studio.'
                    : (
                      <>
                        Try again in a few hours (free tier resets daily), or check your usage at{' '}
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="result-quota-link">Google AI Studio</a>.
                      </>
                      )}
                </p>
              </div>
            )}

            <div className="result-footer-btns">
              <button type="button" className="result-btn-ghost" onClick={handleRetake}>
                Retake test
              </button>
              <button type="button" className="result-btn-primary" onClick={handleShare}>
                Share
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )

  if (animationPhase === 'intro') {
    return (
      <div className="result-page">
        <div className="result-animation-overlay" aria-hidden>
          <div ref={bodyWrapRef} className="result-animation-body-wrap">
            <BodyOutline
              gender={resolvedGender}
              width={200}
              height={440}
              waterLevel={introWaterLevel}
              waterColor={waterColor}
              centerContent={
                <div className="result-intro-percentage">
                  <span className="result-score-value result-score-percent">{introPercentage}%</span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    )
  }

  if (animationPhase === 'shrink') {
    return (
      <div className="result-page">
        <div className="result-animation-overlay" aria-hidden>
          <div
            ref={bodyWrapRef}
            className="result-animation-body-wrap result-animation-body-shrinking"
            style={{
              transition: `transform ${SHRINK_DURATION_MS}ms ease-out`,
              transform: shrinkTransform
                ? `translate(${shrinkTransform.translateX}px, ${shrinkTransform.translateY}px) scale(${shrinkTransform.scale})`
                : undefined,
            }}
          >
            <BodyOutline
              gender={resolvedGender}
              width={200}
              height={440}
              waterLevel={(result?.totalScore ?? 0) / 100}
              waterColor={waterColor}
              centerContent={
                <div className="result-intro-percentage">
                  <span className="result-score-value result-score-percent">{result?.totalScore ?? 0}%</span>
                </div>
              }
            />
          </div>
        </div>
        <div className={`result-content ${animationPhase === 'shrink' ? 'result-content-hidden' : ''}`}>
          {mainContent}
        </div>
      </div>
    )
  }

  return (
    <div className="result-page">
      {mainContent}

      {analyzing && (
        <div className="result-animation-overlay result-analyzing-overlay" aria-live="polite">
          <div className="result-animation-body-wrap">
            <BodyOutline
              gender={resolvedGender}
              width={200}
              height={440}
              waterLevel={analyzeWaterLevel}
              waterColor={waterColor}
              centerContent={
                <div className="result-intro-percentage">
                  <span className="result-analyzing-label">Analyzing your report…</span>
                </div>
              }
            />
          </div>
        </div>
      )}

      {showBoostModal && (
        <div className="boost-modal-overlay" onClick={closeBoostModal} role="dialog" aria-modal="true" aria-labelledby="boost-modal-title">
          <div className="boost-modal" onClick={(e) => e.stopPropagation()}>
            {boostStep === 'options' && (
              <>
                <h2 id="boost-modal-title" className="boost-modal-title">Boost Your Accuracy</h2>
                <button type="button" className="boost-modal-option" onClick={handleUploadReport}>
                  <span className="boost-modal-option-icon" aria-hidden>🩸</span>
                  <div className="boost-modal-option-text">
                    <strong>Upload Blood Report</strong>
                    <span>Confirm with 90%+ accuracy.</span>
                  </div>
                </button>
                <button
                  type="button"
                  className="boost-modal-option"
                  onClick={() => {
                    closeBoostModal()
                    navigate('/book-home-test', {
                      state: {
                        ...location.state,
                        name: profile?.name,
                        phone: profile?.phone,
                      },
                    })
                  }}
                >
                  <span className="boost-modal-option-icon" aria-hidden>📄</span>
                  <div className="boost-modal-option-text">
                    <strong>I Don&apos;t Have a Blood Report</strong>
                    <span>Book a test to get your report.</span>
                    <span className="boost-modal-sublinks">
                      <span className="boost-modal-link">24hr Report</span>
                      <span className="boost-modal-link">Certified Lab</span>
                    </span>
                  </div>
                </button>
                <button type="button" className="boost-modal-later" onClick={closeBoostModal}>
                  Maybe Later
                </button>
              </>
            )}
            {boostStep === 'upload' && (
              <>
                <h2 id="boost-modal-title" className="boost-modal-title">Upload Blood Report</h2>
                <p className="boost-modal-subtitle">Upload an image of your report (photo or scan). We&apos;ll read HbA1c and blood sugar to refine your result.</p>
                <label className="boost-upload-zone">
                  <input type="file" accept="image/*" className="boost-upload-input" onChange={handleFileSelect} disabled={analyzing} />
                  <span className="boost-upload-label">{analyzing ? 'Processing…' : 'Choose image or drag here'}</span>
                </label>
                {analyzing && (
                  <div className="boost-analyzing-status" aria-live="polite">
                    <p className="boost-analyzing-step">Fetching details from your image…</p>
                    <p className="boost-analyzing-step">Thinking the result…</p>
                    <div className="boost-analyzing-spinner" aria-hidden />
                  </div>
                )}
                {analysisError && <p className="boost-modal-error">{analysisError}</p>}
                <button type="button" className="boost-modal-later" onClick={handleBoostBack} disabled={analyzing}>Back</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
