import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import logo from '../assets/logos/my-health-school-logo.png'
import './IntroPage.css'

/**
 * IntroPage - Landing page before the diabetes risk assessment test
 * Users see this first, then click "Start Risk Assessment" to begin
 */
export default function IntroPage() {
  const navigate = useNavigate()
  const { t, setLanguage } = useLanguage()
  const [showLanguageModal, setShowLanguageModal] = useState(true)

  const handleSelectLanguageFirst = (lang) => {
    setLanguage(lang)
    setShowLanguageModal(false)
  }

  const handleStartTest = () => {
    navigate('/gender-selection')
  }

  return (
    <div className="intro-page">
      <header className="intro-header">
        <div className="intro-logo">
          <img src={logo} alt="My Health School" className="logo-icon" />
        </div>
      </header>

      <div className="intro-container">
        <div className="intro-content">
          <h1 className="intro-title">{t('intro.title')}</h1>
          <p className="intro-description">{t('intro.description')}</p>
          <button className="intro-button" onClick={handleStartTest}>
            {t('intro.startButton')}
          </button>
        </div>
      </div>

      {/* Language selection modal – shown before home page (on first load) */}
      {showLanguageModal && (
        <div
          className="intro-language-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-language-modal-title"
        >
          <div className="intro-language-modal">
            <h2 id="intro-language-modal-title" className="intro-language-modal-title">
              {t('selectYourLanguage')}
            </h2>
            <div className="intro-language-modal-options">
              <button
                type="button"
                className="intro-language-modal-option"
                onClick={() => handleSelectLanguageFirst('en')}
              >
                {t('english')}
              </button>
              <button
                type="button"
                className="intro-language-modal-option"
                onClick={() => handleSelectLanguageFirst('ta')}
              >
                {t('tamil')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
