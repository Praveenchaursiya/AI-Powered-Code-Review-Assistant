import { useState } from 'react'

const ErrorState = ({ message, onRetry }) => {
  const [showCopied, setShowCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message || '')
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (error) {
      // Copy failed, silently fail
    }
  }

  return (
    <div className="error-panel">
      <div className="error-card">
        <div className="error-icon" aria-hidden="true">
          ⚠️
        </div>
        <h3 className="error-title">Review unavailable</h3>
        <p className="error-message">{message || 'We couldn\'t analyze your code right now. Please try again.'}</p>
        <div className="error-actions">
          <button onClick={onRetry} className="error-button primary-button">
            Try Again
          </button>
          <button onClick={handleCopy} className="error-button secondary-button">
            {showCopied ? 'Copied!' : 'Copy Message'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorState