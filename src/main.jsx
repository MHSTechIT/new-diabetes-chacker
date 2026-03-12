import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './ErrorBoundary'
import { LanguageProvider } from './context/LanguageContext'
import App from './App.jsx'
import './index.css'

// Images load on-demand as users navigate (not preloaded to improve app startup)

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<p style="padding:20px;color:red;">Root element #root not found.</p>'
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  )
}
