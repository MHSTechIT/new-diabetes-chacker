import React from 'react'

export class ErrorBoundary extends React.Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0A0A0F',
          color: '#fff',
          padding: 24,
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
        }}>
          <h2 style={{ color: '#ff6b6b' }}>Something went wrong</h2>
          <pre>{this.state.error.message}</pre>
          <pre style={{ opacity: 0.8, fontSize: 12 }}>{this.state.error.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
