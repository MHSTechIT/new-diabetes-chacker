import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getTranslation } from '../translations'

const STORAGE_KEY = 'diabetes-app-lang'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {}
  }, [language])

  const setLanguage = useCallback((lang) => {
    if (lang === 'en' || lang === 'ta') setLanguageState(lang)
  }, [])

  const t = useCallback((key) => getTranslation(language, key), [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
