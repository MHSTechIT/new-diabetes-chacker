import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
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
      setSubmitError('Please fill all fields. Mobile must be 10 digits.')
      return
    }
    setSubmitError(null)
    setSubmitting(true)
    try {
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
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message || 'Failed to save booking.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate('/result', { state: location.state ? { ...location.state, playAnimation: false } : undefined })
  }

  if (submitted) {
    return (
      <div className="book-home-test-page">
        <header className="book-home-test-header">
          <button type="button" className="book-home-test-back" onClick={handleBack} aria-label="Back">←</button>
          <h1 className="book-home-test-title">Book Home Test</h1>
        </header>
        <div className="book-home-test-success">
          <p className="book-home-test-success-title">Booking request saved</p>
          <p className="book-home-test-success-text">We&apos;ll contact you at +91 {mobileDigits.slice(0, 5)} {mobileDigits.slice(5)} to confirm your doorstep collection.</p>
          <button type="button" className="book-home-test-btn-primary" onClick={handleBack}>
            Back to result
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="book-home-test-page">
      <header className="book-home-test-header">
        <button type="button" className="book-home-test-back" onClick={handleBack} aria-label="Back">←</button>
        <h1 className="book-home-test-title">Book Home Test</h1>
      </header>

      <div className="book-home-test-layout">
        <section className="book-home-test-intro">
          <span className="book-home-test-intro-tag">DOORSTEP COLLECTION</span>
          <h2 className="book-home-test-intro-title">When should we come?</h2>
          <p className="book-home-test-intro-desc">Sample collected at home. Report in 24 hours.</p>
          <div className="book-home-test-feature-cards">
            <div className="book-home-test-feature-card book-home-test-feature-card-selected">
              <span className="book-home-test-feature-icon" aria-hidden>🩺</span>
              <div>
                <div className="book-home-test-feature-name">HbA1c + FBS Panel</div>
                <div className="book-home-test-feature-sub">Auto-selected based on your risk</div>
              </div>
            </div>
            <div className="book-home-test-feature-card">
              <span className="book-home-test-feature-icon" aria-hidden>📄</span>
              <div>
                <div className="book-home-test-feature-name">Report in 24 hours</div>
                <div className="book-home-test-feature-sub">Certified lab partner</div>
              </div>
            </div>
            <div className="book-home-test-feature-card">
              <span className="book-home-test-feature-icon" aria-hidden>🏠</span>
              <div>
                <div className="book-home-test-feature-name">Home collection</div>
                <div className="book-home-test-feature-sub">No need to visit a lab</div>
              </div>
            </div>
          </div>
        </section>

        <form className="book-home-test-form" onSubmit={handleSubmit}>
          <h3 className="book-home-test-form-title">Personal &amp; Appointment Details</h3>
          <label className="book-home-test-label">
            FULL NAME
            <input
              type="text"
              className="book-home-test-input"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="book-home-test-label">
            MOBILE
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
            ADDRESS
            <input
              type="text"
              className="book-home-test-input"
              placeholder="Enter full address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
            />
          </label>
          <label className="book-home-test-label">
            PINCODE
            <input
              type="text"
              inputMode="numeric"
              className="book-home-test-input"
              placeholder="e.g. 600001"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              autoComplete="postal-code"
            />
          </label>
          <label className="book-home-test-label">
            PREFERRED DATE
            <input
              type="date"
              className="book-home-test-input book-home-test-date"
              placeholder="Choose date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
            />
          </label>
          <div className="book-home-test-label">
            TIME SLOT
            <div className="book-home-test-slots">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  className={`book-home-test-slot ${timeSlot === slot.id ? 'selected' : ''}`}
                  onClick={() => setTimeSlot(slot.id)}
                >
                  <span className="book-home-test-slot-icon" aria-hidden>{slot.icon}</span>
                  <span className="book-home-test-slot-label">{slot.label}</span>
                  <span className="book-home-test-slot-range">{slot.range}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="book-home-test-panel-card">
            <span className="book-home-test-panel-icon" aria-hidden>🩺</span>
            <div>
              <div className="book-home-test-panel-name">{TEST_PANEL}</div>
              <div className="book-home-test-panel-sub">Auto-selected based on your risk score</div>
            </div>
          </div>
          {submitError && <p className="book-home-test-error">{submitError}</p>}
          <button
            type="submit"
            className="book-home-test-btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : 'Submit booking'}
          </button>
        </form>
      </div>
    </div>
  )
}
