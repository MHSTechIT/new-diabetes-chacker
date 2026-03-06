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
        </div>

        {/* Main Content */}
        <div className="intro-content">
          <h1 className="intro-title">Diabetes Risk Assessment</h1>
          <p className="intro-description">
            This assessment is a screening tool only and does not replace a medical diagnosis. Results are based on
            self-reported information. Please consult a qualified doctor for confirmation and treatment.
            MYHEALTHSCHOOL is not liable for decisions made based solely on this screening result.
          </p>

          {/* Call to Action Button */}
          <button className="intro-button" onClick={handleStartTest}>
            Start Risk Assessment →
          </button>
        </div>
      </div>
    </div>
  )
}
