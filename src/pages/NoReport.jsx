import { useNavigate, useLocation } from 'react-router-dom'
import './NoReport.css'

export default function NoReport() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    navigate('/result', { state: location.state ? { ...location.state, playAnimation: false } : undefined })
  }

  const handleBookTest = () => {
    navigate('/book-home-test', { state: location.state ?? {} })
  }

  return (
    <div className="no-report-page">
      <header className="no-report-header">
        <button type="button" className="no-report-back" onClick={handleBack} aria-label="Back">←</button>
        <h1 className="no-report-title">I don&apos;t have a report</h1>
      </header>

      <div className="no-report-content">
        <p className="no-report-message">
          No problem. Your screening result is based on your answers and is a good first step.
        </p>
        <p className="no-report-message">
          To get a 100% accurate result, you can book a blood test. We&apos;ll collect the sample at home and share the report in 24 hours.
        </p>
        <button type="button" className="no-report-btn-primary" onClick={handleBookTest}>
          Book blood test for 100% result
        </button>
        <button type="button" className="no-report-btn-ghost" onClick={handleBack}>
          Back to my result
        </button>
      </div>
    </div>
  )
}
