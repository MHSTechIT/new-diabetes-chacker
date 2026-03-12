import { useState, useRef, useEffect } from 'react'
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
  const { t, language, setLanguage } = useLanguage()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleStartTest = () => {
    navigate('/gender-selection')
  }

  const handleSelectLanguage = (lang) => {
    setLanguage(lang)
    setDropdownOpen(false)
  }

  return (
    <div className="intro-page">
      {/* Top header: logo centered, language button top right */}
      <header className="intro-header">
        <div className="intro-logo">
          <img src={logo} alt="My Health School" className="logo-icon" />
        </div>
        <div className="intro-language-wrap" ref={dropdownRef}>
          <button
            type="button"
            className="intro-language-btn"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            {t('language')}
          </button>
          {dropdownOpen && (
            <div className="intro-language-dropdown" role="menu">
              <button
                type="button"
                role="menuitem"
                className={`intro-language-option ${language === 'en' ? 'selected' : ''}`}
                onClick={() => handleSelectLanguage('en')}
              >
                {t('english')}
              </button>
              <button
                type="button"
                role="menuitem"
                className={`intro-language-option ${language === 'ta' ? 'selected' : ''}`}
                onClick={() => handleSelectLanguage('ta')}
              >
                {t('tamil')}
              </button>
            </div>
          )}
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
    </div>
  )
}
