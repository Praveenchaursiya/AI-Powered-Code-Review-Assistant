import { useState, useCallback } from 'react'
import Header from './components/Header'
import CodeEditor from './components/CodeEditor'
import ReviewPanel from './components/ReviewPanel'
import Loading from './components/Loading'
import ErrorState from './components/ErrorMessage'
import { useCodeReview } from './hooks/useCodeReview'
import './App.css'

const DEFAULT_CODE = `function sum(a, b) {
    return a + b;
}`

function App() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [language, setLanguage] = useState('javascript')
  const { reviewCode, isReviewing, review, error } = useCodeReview()
  const [status, setStatus] = useState('Ready')

  const handleReview = useCallback(() => {
    if (!code.trim() || isReviewing) return
    setStatus('Analyzing')
    reviewCode(code, language)
  }, [code, language, reviewCode, isReviewing])

  const handleClear = useCallback(() => {
    setCode('')
    setStatus('Ready')
  }, [])

  // Update status based on review state
  useCallback(() => {
    if (isReviewing) setStatus('Analyzing')
    else if (review) setStatus('Review Complete')
    else if (error) setStatus('Offline')
    else setStatus('Ready')
  }, [isReviewing, review, error])

  const handleRetry = useCallback(() => {
    handleReview()
  }, [handleReview])

  return (
    <div className="app">
      <Header status={status} />
      <main className="app-main">
        <div className="editor-section">
          <CodeEditor
            value={code}
            onChange={setCode}
            disabled={isReviewing}
            language={language}
            onLanguageChange={setLanguage}
          />
        </div>
        <div className="review-section">
          {isReviewing ? (
            <Loading />
          ) : error ? (
            <ErrorState message="We couldn't analyze your code right now. Please try again." onRetry={handleRetry} />
          ) : (
            <ReviewPanel review={review} />
          )}
        </div>
      </main>
      <footer className="app-toolbar">
        <div className="toolbar-left">
          <span className="toolbar-item" id="line-count">Lines: {code.split('\n').length}</span>
          <span className="toolbar-divider">|</span>
          <span className="toolbar-item" id="char-count">Characters: {code.length}</span>
        </div>
        <div className="toolbar-right">
          <button
            onClick={handleClear}
            disabled={isReviewing || !code.trim()}
            className="toolbar-button clear-button"
            aria-label="Clear editor and review"
          >
            Clear
          </button>
          <button
            onClick={handleReview}
            disabled={isReviewing || !code.trim()}
            className="toolbar-button review-button"
            aria-label="Review code"
          >
            {isReviewing ? 'Analyzing...' : 'Review Code'}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App