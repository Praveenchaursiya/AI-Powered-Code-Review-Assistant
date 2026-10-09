import { useState } from 'react'

const ReviewPanel = ({ review, isLoading, error }) => {
  const [showCopied, setShowCopied] = useState(false)

  if (!review) {
    return (
      <div className="review-panel empty">
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3>AI Code Review</h3>
          <p>Paste your code and click &quot;Review Code&quot; to analyze it.</p>
        </div>
      </div>
    )
  }

  const { summary, score, issues, security, performance, maintainability, suggestions, improvedCode } = review

  const handleCopyImprovedCode = async () => {
    if (!improvedCode) return
    try {
      await navigator.clipboard.writeText(improvedCode)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (err) {
      // silently fail
    }
  }

  const hasData = issues?.length > 0 || security?.length > 0 || performance?.length > 0 || suggestions?.length > 0 || maintainability?.length > 0

  return (
    <div className="review-panel">
      <div className="review-header">
        <h2>AI Review</h2>
        {score !== undefined && score !== null && (
          <div className="score-card">
            <span className="score-label">CODE QUALITY</span>
            <span className="score-value">{score} / 10</span>
          </div>
        )}
      </div>

      <div className="review-summary">
        <h3>Summary</h3>
        <p>{summary || 'No summary available.'}</p>
      </div>

      {hasData && (
        <div className="review-sections">
          {issues?.length > 0 && (
            <div className="review-section">
              <h3 className="section-title issues-title">Issues</h3>
              <ul className="issue-list">
                {issues.map((issue, index) => (
                  <li key={index} className="issue-item">
                    <span className="issue-severity severity-low">{issue.severity || 'Info'}</span>
                    <div className="issue-content">
                      <strong>{issue.title || issue}</strong>
                      {issue.description && <p className="issue-description">{issue.description}</p>}
                      {issue.recommendation && <p className="issue-recommendation">{issue.recommendation}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {security?.length > 0 && (
            <div className="review-section">
              <h3 className="section-title security-title">Security</h3>
              <ul className="issue-list">
                {security.map((item, index) => (
                  <li key={index} className="issue-item">
                    <span className="issue-severity severity-high">{item.severity || 'High'}</span>
                    <div className="issue-content">
                      <strong>{item.title || item}</strong>
                      {item.description && <p className="issue-description">{item.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {performance?.length > 0 && (
            <div className="review-section">
              <h3 className="section-title performance-title">Performance</h3>
              <ul className="issue-list">
                {performance.map((item, index) => (
                  <li key={index} className="issue-item">
                    <span className="issue-severity severity-medium">{item.severity || 'Medium'}</span>
                    <div className="issue-content">
                      <strong>{item.title || item}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {maintainability?.length > 0 && (
            <div className="review-section">
              <h3 className="section-title maintainability-title">Code Quality</h3>
              <ul className="issue-list">
                {maintainability.map((item, index) => (
                  <li key={index} className="issue-item">
                    <span className="issue-severity severity-info">{item.severity || 'Info'}</span>
                    <div className="issue-content">
                      <strong>{item.title || item}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions?.length > 0 && (
            <div className="review-section">
              <h3 className="section-title suggestions-title">Suggestions</h3>
              <ul className="issue-list">
                {suggestions.map((item, index) => (
                  <li key={index} className="issue-item">
                    <span className="issue-severity severity-info">{item.severity || 'Info'}</span>
                    <div className="issue-content">
                      <strong>{item.title || item}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!hasData && (
        <div className="review-section">
          <h3 className="section-title">Security</h3>
          <p className="no-issues">✓ No major security issues detected.</p>
        </div>
      )}

      {improvedCode && (
        <div className="review-section improved-code-section">
          <div className="improved-header">
            <h3 className="section-title improved-title">Improved Code</h3>
            <button
              onClick={handleCopyImprovedCode}
              className="copy-button"
              aria-label="Copy improved code"
            >
              {showCopied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="code-block"><code>{improvedCode}</code></pre>
        </div>
      )}
    </div>
  )
}

export default ReviewPanel
