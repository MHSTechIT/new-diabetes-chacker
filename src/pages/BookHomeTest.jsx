import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useLanguage } from '../context/LanguageContext'
import './BookHomeTest.css'

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', range: '7-11 AM', icon: '☀️' },
  { id: 'afternoon', label: 'Afternoon', range: '11-3 PM', icon: '☀️' },
  { id: 'evening', label: 'Evening', range: '3-7 PM', icon: '🌆' },
]

const TEST_PANEL = 'HbA1c + Fasting Blood Sugar Panel'
const MOBILE_MAX_DIGITS = 10

function formatMobileInput(digits) {
  if (!digits || digits.length === 0) return ''
  const d = digits.slice(0, MOBILE_MAX_DIGITS)
  return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d
}

export default function BookHomeTest() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const { userId, gender, phone: statePhone, name: stateName } = location.state ?? {}

  const [fullName, setFullName] = useState(stateName ?? '')
  const [mobileDigits, setMobileDigits] = useState(
    (statePhone && String(statePhone).replace(/\D/g, '').slice(0, MOBILE_MAX_DIGITS)) ?? ''
  )
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('morning')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleMobileChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, MOBILE_MAX_DIGITS)
    setMobileDigits(digits)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = fullName.trim()
    const mobile = mobileDigits.trim()
    const addr = address.trim()
    const pin = pincode.trim()
    if (!name || mobile.length !== MOBILE_MAX_DIGITS || !addr || !pin || !preferredDate) {
      setSubmitError(t('bookHomeTest.errorFill'))
      return
    }
    setSubmitError(null)
    setSubmitting(true)
    try {
      if (supabase) {
        const { error } = await supabase.from('home_test_bookings').insert({
          full_name: name,
          mobile: `+91${mobile}`,
          address: addr,
          pincode: pin,
          preferred_date: preferredDate,
          time_slot: timeSlot,
          test_panel: TEST_PANEL,
          profile_id: userId || null,
        })
        if (error) throw error
      }
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message || 'Failed to save booking.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = (booked = false) => {
    navigate('/result', {
      replace: true,
      state: location.state
        ? { ...location.state, playAnimation: false, ...(booked ? { bloodTestBooked: true } : {}) }
        : undefined,
    })
  }

  if (submitted) {
    return (
      <div className="book-home-test-page">
        <header className="book-home-test-header">
          <button type="button" className="book-home-test-back" onClick={handleBack} aria-label="Back">←</button>
          <h1 className="book-home-test-title">{t('bookHomeTest.pageTitle')}</h1>
        </header>
        <div className="book-home-test-success">
          <p className="book-home-test-success-title">{t('bookHomeTest.successTitle')}</p>
          <p className="book-home-test-success-text">{t('bookHomeTest.successText').replace('{mobile}', `${mobileDigits.slice(0, 5)} ${mobileDigits.slice(5)}`)}</p>
          <button type="button" className="book-home-test-btn-primary" onClick={() => handleBack(true)}>
            {t('bookHomeTest.backToResult')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="book-home-test-page">
      <header className="book-home-test-header">
        <button type="button" className="book-home-test-back" onClick={handleBack} aria-label="Back">←</button>
        <h1 className="book-home-test-title">{t('bookHomeTest.pageTitle')}</h1>
      </header>

      <div className="book-home-test-layout">
        <section className="book-home-test-intro">
          <span className="book-home-test-intro-tag">{t('bookHomeTest.doorstepTag')}</span>
          <h2 className="book-home-test-intro-title">{t('bookHomeTest.introTitle')}</h2>
          <p className="book-home-test-intro-desc">{t('bookHomeTest.introDesc')}</p>
          <div className="book-home-test-feature-cards">
            <div className="book-home-test-feature-card book-home-test-feature-card-selected">
              <span className="book-home-test-feature-icon" aria-hidden>🩺</span>
              <div>
                <div className="book-home-test-feature-name">{t('bookHomeTest.featurePanel')}</div>
                <div className="book-home-test-feature-sub">{t('bookHomeTest.featurePanelSub')}</div>
              </div>
            </div>
            <div className="book-home-test-feature-card">
              <span className="book-home-test-feature-icon" aria-hidden>📄</span>
              <div>
                <div className="book-home-test-feature-name">{t('bookHomeTest.featureReport')}</div>
                <div className="book-home-test-feature-sub">{t('bookHomeTest.featureReportSub')}</div>
              </div>
            </div>
            <div className="book-home-test-feature-card">
              <span className="book-home-test-feature-icon" aria-hidden>🏠</span>
              <div>
                <div className="book-home-test-feature-name">{t('bookHomeTest.featureHome')}</div>
                <div className="book-home-test-feature-sub">{t('bookHomeTest.featureHomeSub')}</div>
              </div>
            </div>
          </div>
        </section>

        <form className="book-home-test-form" onSubmit={handleSubmit}>
          <h3 className="book-home-test-form-title">{t('bookHomeTest.formTitle')}</h3>
          <label className="book-home-test-label">
            {t('bookHomeTest.labelName')}
            <input
              type="text"
              className="book-home-test-input"
              placeholder={t('bookHomeTest.placeholderName')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="book-home-test-label">
            {t('bookHomeTest.labelMobile')}
            <div className="book-home-test-mobile-wrap">
              <span className="book-home-test-mobile-prefix" aria-hidden>+91</span>
              <input
                type="text"
                inputMode="numeric"
                className="book-home-test-input book-home-test-mobile-input"
                placeholder="98765 43210"
                value={formatMobileInput(mobileDigits)}
                onChange={handleMobileChange}
                maxLength={12}
                autoComplete="tel"
              />
            </div>
          </label>
          <label className="book-home-test-label">
            {t('bookHomeTest.labelAddress')}
            <input
              type="text"
              className="book-home-test-input"
              placeholder={t('bookHomeTest.placeholderAddress')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
            />
          </label>
          <label className="book-home-test-label">
            {t('bookHomeTest.labelPincode')}
            <input
              type="text"
              inputMode="numeric"
              className="book-home-test-input"
              placeholder={t('bookHomeTest.placeholderPincode')}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              autoComplete="postal-code"
            />
          </label>
          <label className="book-home-test-label">
            {t('bookHomeTest.labelDate')}
            <input
              type="date"
              className="book-home-test-input book-home-test-date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
            />
          </label>
          {submitError && <p className="book-home-test-error">{submitError}</p>}
          <button
            type="submit"
            className="book-home-test-btn-primary"
            disabled={submitting}
          >
            {submitting ? t('bookHomeTest.submitting') : t('bookHomeTest.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
