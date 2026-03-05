import { useNavigate } from 'react-router-dom'
import logo from '../assets/logos/my-health-school-logo.png'
import './IntroPage.css'

/**
 * IntroPage - Landing page before the diabetes risk assessment test
 * Users see this first, then click "Start Risk Assessment" to begin
 */
export default function IntroPage() {
  const navigate = useNavigate()

  const handleStartTest = () => {
    navigate('/gender-selection')
  }

  return (
    <div className="intro-page">
      <div className="intro-container">
        {/* Logo/Branding */}
        <div className="intro-logo">
          <img src={logo} alt="My Health School" className="logo-icon" />
          <p className="logo-text">My Health School</p>
        </div>

        {/* Main Content */}
        <div className="intro-content">
          <h1 className="intro-title">Diabetes Risk Assessment</h1>
          <p className="intro-description">
            Answer 19 quick questions about your lifestyle, body, and health history. Get your personalised
            diabetes risk score in under 3 minutes.
          </p>

          {/* Call to Action Button */}
          <button className="intro-button" onClick={handleStartTest}>
            Start Risk Assessment →
          </button>

          {/* Info Badges */}
          <div className="intro-badges">
            <div className="badge">
              <span className="badge-icon">⏱️</span>
              <span className="badge-text">3 min</span>
            </div>
            <div className="badge">
              <span className="badge-icon">🔒</span>
              <span className="badge-text">Private</span>
            </div>
            <div className="badge">
              <span className="badge-icon">📋</span>
              <span className="badge-text">19 Questions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
