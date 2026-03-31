import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useLanguage } from '../context/LanguageContext'
import './ExpertCallModal.css'

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM',  '2:00 PM',  '3:00 PM',
  '4:00 PM',  '5:00 PM',
]

const MONTH_NAMES = {
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  ta: ['ஜனவரி','பிப்ரவரி','மார்ச்','ஏப்ரல்','மே','ஜூன்','ஜூலை','ஆகஸ்ட்','செப்டம்பர்','அக்டோபர்','நவம்பர்','டிசம்பர்'],
}
const DAY_NAMES = {
  en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  ta: ['ஞா','திங்','செவ்','புத','வியா','வெள்','சனி'],
}

function isBefore(dateA, dateB) {
  return dateA < dateB
}

function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function ExpertCallModal({ onClose, onBookingSuccess, profileName, profilePhone, riskLevel, profileId }) {
  const { t, language } = useLanguage()
  const lang = language || 'en'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  today.setDate(today.getDate() + 1) // minimum bookable date is tomorrow

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [step, setStep] = useState('pick') // 'pick' | 'confirm' | 'saving' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const goNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const handleDayClick = (day) => {
    const clicked = new Date(viewYear, viewMonth, day)
    clicked.setHours(0, 0, 0, 0)
    if (isBefore(clicked, today)) return
    setSelectedDate(toDateKey(viewYear, viewMonth, day))
    setSelectedTime(null)
  }

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return
    setStep('saving')
    setErrorMsg('')
    try {
      if (supabase) {
        const { error } = await supabase.from('expert_call_bookings').insert({
          profile_id: profileId || null,
          name: profileName || null,
          phone: profilePhone || null,
          call_date: selectedDate,
          time_slot: selectedTime,
          risk_level: riskLevel || null,
          status: 'pending',
        })
        if (error) throw error
      }
      setStep('success')
      if (onBookingSuccess) setTimeout(onBookingSuccess, 1500)
    } catch (err) {
      setErrorMsg(err?.message || 'Something went wrong. Please try again.')
      setStep('error')
    }
  }

  const formattedDate = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="ecm-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Schedule Expert Call">
      <div className="ecm-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ecm-header">
          <h2 className="ecm-title">{t('expertCall.title')}</h2>
          <button className="ecm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {step === 'pick' && (
          <>
            <p className="ecm-subtitle">{t('expertCall.subtitle')}</p>

            {/* Calendar */}
            <div className="ecm-calendar">
              <div className="ecm-cal-nav">
                <button className="ecm-cal-nav-btn" onClick={goPrevMonth}>‹</button>
                <span className="ecm-cal-month-label">{MONTH_NAMES[lang][viewMonth]} {viewYear}</span>
                <button className="ecm-cal-nav-btn" onClick={goNextMonth}>›</button>
              </div>

              <div className="ecm-cal-grid">
                {DAY_NAMES[lang].map(d => (
                  <span key={d} className="ecm-cal-day-name">{d}</span>
                ))}
                {/* Empty cells for first row */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <span key={`empty-${i}`} className="ecm-cal-empty" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dateKey = toDateKey(viewYear, viewMonth, day)
                  const dateObj = new Date(viewYear, viewMonth, day)
                  dateObj.setHours(0, 0, 0, 0)
                  const isPast = isBefore(dateObj, today)
                  const isSelected = selectedDate === dateKey
                  const isToday = dateObj.getTime() === today.getTime()
                  return (
                    <button
                      key={day}
                      className={`ecm-cal-day ${isPast ? 'past' : 'available'} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                      onClick={() => handleDayClick(day)}
                      disabled={isPast}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <>
                <p className="ecm-time-heading">{t('expertCall.timeHeading')}</p>
                <div className="ecm-time-grid">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      className={`ecm-time-slot ${selectedTime === slot ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Confirm button */}
            <button
              className={`ecm-confirm-btn ${selectedDate && selectedTime ? 'active' : 'inactive'}`}
              onClick={() => selectedDate && selectedTime && setStep('confirm')}
              disabled={!selectedDate || !selectedTime}
            >
              {t('expertCall.confirmSchedule')}
            </button>
          </>
        )}

        {step === 'confirm' && (
          <div className="ecm-confirm-screen">
            <div className="ecm-confirm-icon">📅</div>
            <h3 className="ecm-confirm-heading">{t('expertCall.confirmHeading')}</h3>
            <div className="ecm-confirm-detail">
              <span className="ecm-confirm-label">{t('expertCall.labelDate')}</span>
              <span className="ecm-confirm-value">{formattedDate}</span>
            </div>
            <div className="ecm-confirm-detail">
              <span className="ecm-confirm-label">{t('expertCall.labelTime')}</span>
              <span className="ecm-confirm-value">{selectedTime}</span>
            </div>
            {profileName && (
              <div className="ecm-confirm-detail">
                <span className="ecm-confirm-label">{t('expertCall.labelName')}</span>
                <span className="ecm-confirm-value">{profileName}</span>
              </div>
            )}
            {profilePhone && (
              <div className="ecm-confirm-detail">
                <span className="ecm-confirm-label">{t('expertCall.labelPhone')}</span>
                <span className="ecm-confirm-value">{profilePhone}</span>
              </div>
            )}
            <p className="ecm-confirm-note">{t('expertCall.confirmNote')}</p>
            <div className="ecm-confirm-btns">
              <button className="ecm-back-btn" onClick={() => setStep('pick')}>{t('expertCall.change')}</button>
              <button className="ecm-submit-btn" onClick={handleConfirm}>{t('expertCall.bookCall')}</button>
            </div>
          </div>
        )}

        {step === 'saving' && (
          <div className="ecm-status-screen">
            <div className="ecm-spinner" />
            <p className="ecm-status-text">{t('expertCall.booking')}</p>
          </div>
        )}

        {step === 'success' && (
          <div className="ecm-status-screen">
            <div className="ecm-success-icon">✅</div>
            <h3 className="ecm-success-heading">{t('expertCall.successHeading')}</h3>
            <p className="ecm-status-text">
              {t('expertCall.successText')}<br />
              <strong>{formattedDate}</strong><br />
              {t('expertCall.successAt')} <strong>{selectedTime}</strong>.<br /><br />
              {t('expertCall.successNote')}
            </p>
            <button className="ecm-submit-btn" onClick={onClose}>{t('expertCall.done')}</button>
          </div>
        )}

        {step === 'error' && (
          <div className="ecm-status-screen">
            <div className="ecm-error-icon">⚠️</div>
            <p className="ecm-status-text ecm-status-error">{errorMsg}</p>
            <button className="ecm-submit-btn" onClick={() => setStep('confirm')}>{t('expertCall.tryAgain')}</button>
          </div>
        )}
      </div>
    </div>
  )
}
