import { useNavigate } from 'react-router-dom'
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
          <div className="logo-icon">
            <svg width="120" height="120" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Left Wing */}
              <path d="M 60 80 Q 40 120, 50 180 Q 60 200, 80 190 Q 70 150, 75 100 Z" fill="#9333ea" />
              {/* Right Wing */}
              <path d="M 140 80 Q 160 120, 150 180 Q 140 200, 120 190 Q 130 150, 125 100 Z" fill="#9333ea" />
              {/* Left Wing Top */}
              <path d="M 70 50 Q 50 80, 60 140 Q 80 130, 85 80 Z" fill="#a855f7" />
              {/* Right Wing Top */}
              <path d="M 130 50 Q 150 80, 140 140 Q 120 130, 115 80 Z" fill="#a855f7" />
            </svg>
          </div>
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
