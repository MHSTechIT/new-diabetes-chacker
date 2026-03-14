import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getFactorLabel } from '../translations'
import { supabase } from '../lib/supabaseClient'
import { getProfile, clearProfile } from '../lib/profileStorage'
import { calculateRisk } from '../utils/scoring'
import { apiAnalyzeReport } from '../lib/api'
import ConfirmModal from '../components/ConfirmModal'
import RiskVideoPlayer from '../components/RiskVideoPlayer'
import RiskGauge from '../components/RiskGauge'
import './Result.css'

const RISK_COLORS = {
  LOW: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#10b981', dot: '#10b981' },
  LOW_MODERATE: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', dot: '#f59e0b' },
  MODERATE: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', dot: '#f59e0b' },
  MODERATE_HIGH: { bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)', text: '#f97316', dot: '#f97316' },
  HIGH: { bg: 'rgba(244,63,94,0.15)', border: 'rgba(244,63,94,0.3)', text: '#f43f5e', dot: '#f43f5e' },
}

const STATUS_LINE_KEYS = {
  LOW: 'resultPage.lowRisk',
  LOW_MODERATE: 'resultPage.lowModerate',
  MODERATE: 'resultPage.moderate',
  MODERATE_HIGH: 'resultPage.moderateHigh',
  HIGH: 'resultPage.high',
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

const BADGE_LABEL_KEYS = {
  LOW: 'resultPage.lowRiskBadge',
  LOW_MODERATE: 'resultPage.lowModerateBadge',
  MODERATE: 'resultPage.moderateBadge',
  MODERATE_HIGH: 'resultPage.moderateHighBadge',
  HIGH: 'resultPage.highRiskBadge',
}

const RECOMMENDED_ACTION_KEYS = {
  LOW: ['resultPage.maintainWeight', 'resultPage.stayActive', 'resultPage.eatBalanced'],
  LOW_MODERATE: ['resultPage.reduceCarbs', 'resultPage.addWalking', 'resultPage.bloodTest6mo'],
  MODERATE: ['resultPage.seeDoctor', 'resultPage.hba1c', 'resultPage.lifestyleChanges'],
  MODERATE_HIGH: ['resultPage.seeDoctorSoon', 'resultPage.fullBloodPanel', 'resultPage.strictLifestyle'],
  HIGH: ['resultPage.seeDoctorNow', 'resultPage.bloodTests', 'resultPage.followAdvice'],
}

export default function Result() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language } = useLanguage()
  const resultFromState = location.state?.result
  const userId = location.state?.userId

  const [resultData, setResultData] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(!resultFromState && !!userId)
  const [loadError, setLoadError] = useState(null)
  const [animationPhase, setAnimationPhase] = useState(() => (location.state?.playAnimation === true ? 'intro' : 'done'))
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [boostStep, setBoostStep] = useState('options')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)
  const [enhancedResult, setEnhancedResult] = useState(null)
  const [showBackConfirm, setShowBackConfirm] = useState(false)
  const [showRetestConfirm, setShowRetestConfirm] = useState(false)

  const result = enhancedResult?.result ?? resultFromState ?? resultData

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

  /* Only show very high risk factors in Contribution factor (points >= 5) */
  const VERY_HIGH_RISK_POINTS = 5
  const groupedFactors = useMemo(() => {
    const grouped = {}
    const categoryTotals = {}

    result?.riskyFactors?.forEach((factor) => {
      const points = factor.points || 0
      if (points < VERY_HIGH_RISK_POINTS) return
      const category = factor.category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
        categoryTotals[category] = 0
      }
      grouped[category].push(factor)
      categoryTotals[category] += points
    })

    return { grouped, categoryTotals }
  }, [result?.riskyFactors])

  const summary = useMemo(() => {
    if (!result?.riskyFactors?.length) {
      if (level === 'LOW') return t('resultPage.summaryNoFactorsLow')
      if (level === 'LOW_MODERATE') return t('resultPage.summaryNoFactorsLowModerate')
      if (level === 'MODERATE') return t('resultPage.summaryNoFactorsModerate')
      if (level === 'MODERATE_HIGH') return t('resultPage.summaryNoFactorsModerateHigh')
      return t('resultPage.summaryHigh')
    }
    const first = result.riskyFactors[0]
    const second = result.riskyFactors[1]
    const rest = result.riskyFactors.length > 2 ? ` and ${result.riskyFactors.length - 2} other factor(s)` : ''
    const f1 = getFactorLabel(first.factor, language)
    const f2 = second ? getFactorLabel(second.factor, language) : ''
    if (level === 'LOW') return t('resultPage.summaryLowPrefix') + f1 + t('resultPage.summaryLowSuffix')
    if (level === 'LOW_MODERATE') return t('resultPage.summaryLowModeratePrefix') + f1 + (f2 ? `, ${f2}` : '') + rest + t('resultPage.summaryLowModerateSuffix')
    if (level === 'MODERATE') return t('resultPage.summaryModeratePrefix') + f1 + t('resultPage.summaryModerateSuffix')
    if (level === 'MODERATE_HIGH') return t('resultPage.summaryModerateHighPrefix') + f1 + t('resultPage.summaryModerateHighSuffix')
    return t('resultPage.summaryHighMultiPrefix') + f1 + t('resultPage.summaryHighMultiSuffix')
  }, [result?.riskyFactors, level, t, language])

  const [gaugeShrinking, setGaugeShrinking] = useState(false)
  const [loadingTextLen, setLoadingTextLen] = useState(0)
  const gaugeHoldTimerRef = useRef(null)
  const GAUGE_HOLD_MS = 5000   /* show gauge for 5 sec after needle animation */
  const SHRINK_GAUGE_MS = 800   /* fade-out duration */
  const loadingText = t('resultPage.loadingText')

  const handleGaugeDone = useCallback(() => {
    gaugeHoldTimerRef.current = setTimeout(() => setGaugeShrinking(true), GAUGE_HOLD_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (gaugeHoldTimerRef.current) clearTimeout(gaugeHoldTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!gaugeShrinking) return
    const t = setTimeout(() => setAnimationPhase('done'), SHRINK_GAUGE_MS)
    return () => clearTimeout(t)
  }, [gaugeShrinking])

  /* Typewriter: loading text during intro */
  useEffect(() => {
    if (animationPhase !== 'intro') return
    setLoadingTextLen(0)
    const id = setInterval(() => {
      setLoadingTextLen((n) => Math.min(n + 1, loadingText.length))
    }, 90)
    return () => clearInterval(id)
  }, [animationPhase, loadingText])

  const handleRetake = () => {
    clearProfile()
    navigate('/')
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
        <p className="result-loader-text">{t('resultLoader.calculating')}</p>
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
            {t('resultPage.goBack')}
          </button>
        </div>
        {showBackConfirm && (
          <ConfirmModal
            message={t('confirm.backToStart')}
            confirmLabel={t('common.yes')}
            cancelLabel={t('common.no')}
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

  const mainContent = (
    <>
      <h1 className="result-title">{t('resultPage.yourResult')}</h1>
      <div className="result-body">
        {/* Video at top on mobile, left column on desktop; 16:9 aspect ratio */}
        {animationPhase === 'done' && level && (
          <div className="result-video-wrap">
            <h2 className="result-video-heading">{t('resultPage.watchRiskLevel')}</h2>
            <RiskVideoPlayer riskLevel={level} autoPlay={false} aspectRatio="16/9" />
          </div>
        )}

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

        {animationPhase === 'done' && (
          <>
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

            {/* End-of-page format: Visual and result → Your report summary → What to do next → Contribution factor */}
            <div className="result-format-block">
              <h2 className="result-format-block-title">{t('resultPage.yourResult')}</h2>

              <section className="result-format-section" aria-labelledby="result-visual-heading">
                <h3 id="result-visual-heading" className="result-format-section-title">{t('resultPage.visualAndResult')}</h3>
                <div className="result-format-gauge-wrap">
                  <RiskGauge key={level} riskLevel={level} animate={false} compact />
                </div>
                <div className="result-format-visual-meta">
                  <div
                    className="result-badge result-format-badge"
                    style={{ background: colors.bg, borderColor: colors.border }}
                  >
                    <span className="result-badge-dot" style={{ background: colors.dot }} />
                    <span className="result-badge-label" style={{ color: colors.text }}>
                      {t(BADGE_LABEL_KEYS[level])}
                    </span>
                  </div>
                  <p className="result-format-status" style={{ color: colors.text }}>
                    {t(STATUS_LINE_KEYS[level])}
                  </p>
                  <p className="result-format-probability">{t('resultPage.probability')}: {result.probabilityRangeText}</p>
                </div>
              </section>

              <section className="result-format-section" aria-labelledby="result-summary-heading">
                <h3 id="result-summary-heading" className="result-format-section-title">{t('resultPage.yourReportSummary')}</h3>
                {!(enhancedResult?.extractedLabs && (enhancedResult.extractedLabs.hba1c != null || enhancedResult.extractedLabs.fastingGlucose != null)) ? (
                  <div className="result-format-accuracy-note">
                    <span className="result-accuracy-icon" aria-hidden>⚠</span>
                    <span>{t('resultPage.accuracyNote')}</span>
                  </div>
                ) : null}
                <p className="result-summary-text">{summary}</p>
              </section>

              <section className="result-format-section result-format-section--book-cta" aria-labelledby="result-book-cta-heading">
                <button
                  type="button"
                  id="result-book-cta-heading"
                  className="result-book-blood-test-cta"
                  onClick={() =>
                    navigate('/book-home-test', {
                      state: {
                        ...location.state,
                        name: profile?.name,
                        phone: profile?.phone,
                      },
                    })
                  }
                >
                  {t('resultPage.bookBloodTestCta')}
                </button>
              </section>

              <section className="result-format-section" aria-labelledby="result-next-heading">
                <h3 id="result-next-heading" className="result-format-section-title">{t('resultPage.whatToDoNext')}</h3>
                <ul className="result-actions-list">
                  {(RECOMMENDED_ACTION_KEYS[level] || []).map((key, i) => (
                    <li key={i}><span className="result-actions-arrow">→</span> {t(key)}</li>
                  ))}
                </ul>
              </section>

              <section className="result-format-section" aria-labelledby="result-factors-heading">
                <h3 id="result-factors-heading" className="result-format-section-title">{t('resultPage.contributionFactor')}</h3>
                {Object.keys(groupedFactors.grouped).length > 0 ? (
                  <div className="result-format-factors result-format-factors--chips-only">
                    {Object.entries(groupedFactors.grouped).map(([category, factors]) => (
                      <div key={category} className="result-factor-chips">
                        {factors.map((f, i) => (
                          <span
                            key={`${category}-${i}`}
                            className="result-factor-chip"
                            style={{
                              borderColor: CATEGORY_COLORS[category]?.border,
                              color: CATEGORY_COLORS[category]?.text,
                              background: CATEGORY_COLORS[category]?.bg,
                            }}
                          >
                            <span className="result-factor-chip-icon">▲</span>
                            <span className="result-factor-name">{truncate(getFactorLabel(f.factor, language))}</span>
                            <span className="result-factor-points">+{f.points}</span>
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="result-format-no-factors">{t('resultPage.noFactorsNote')}</p>
                )}
              </section>
            </div>

            <div className="result-footer-btns">
              <button type="button" className="result-btn-ghost" onClick={() => setShowRetestConfirm(true)}>
                {t('resultPage.retest')}
              </button>
              <button type="button" className="result-btn-primary" onClick={handleShare}>
                {t('resultPage.share')}
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
        <div
          className={`risk-gauge-intro-overlay ${gaugeShrinking ? 'risk-gauge-intro-overlay--shrinking' : ''}`}
          aria-hidden
        >
          <div className="risk-gauge-intro-content">
            <div className={`risk-gauge-intro-wrap ${gaugeShrinking ? 'risk-gauge-intro-wrap--shrinking' : ''}`}>
              <RiskGauge riskLevel={level} animate={!gaugeShrinking} introDurationMs={5000} onAnimationDone={handleGaugeDone} />
            </div>
            <p className="result-loading-typewriter" aria-live="polite">
              {loadingText.slice(0, loadingTextLen)}
              <span className="result-loading-cursor" aria-hidden>|</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="result-page">
      {mainContent}

      {analyzing && (
        <div className="result-analyzing-overlay" aria-live="polite">
          <div className="result-analyzing-spinner-wrap">
            <div className="result-loader-spinner" aria-hidden />
            <p className="result-analyzing-label">{t('resultPage.analyzingReport')}</p>
          </div>
        </div>
      )}

      {showRetestConfirm && (
        <ConfirmModal
          message={t('resultPage.retestConfirmMessage')}
          confirmLabel={t('resultPage.retestConfirmYes')}
          cancelLabel={t('common.cancel')}
          onConfirm={() => {
            setShowRetestConfirm(false)
            handleRetake()
          }}
          onCancel={() => setShowRetestConfirm(false)}
        />
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
