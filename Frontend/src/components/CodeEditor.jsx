import { useRef, useState } from 'react'
import Editor from 'react-simple-code-editor'
import prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-php'
import './CodeEditor.css'

const CodeEditor = ({ value, onChange, disabled, language, onLanguageChange }) => {
  const editorRef = useRef(null)
  const [currentLanguage, setCurrentLanguage] = useState(language || 'javascript')

  const highlight = (code) => {
    try {
      return prism.highlight(code, prism.languages[currentLanguage] || prism.languages.javascript)
    } catch {
      return code
    }
  }

  const handleLanguageChange = (e) => {
    const lang = e.target.value
    setCurrentLanguage(lang)
    onLanguageChange(lang)
  }

  return (
    <div className="code-editor-card">
      <div className="code-editor-header">
        <div className="editor-title">CODE</div>
        <div className="language-selector-wrapper">
          <label htmlFor="language-selector" className="sr-only">Programming language</label>
          <select
            id="language-selector"
            value={currentLanguage}
            onChange={handleLanguageChange}
            disabled={disabled}
            className="language-selector"
            aria-label="Programming language"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="go">Go</option>
            <option value="php">PHP</option>
          </select>
        </div>
      </div>
      <Editor
        ref={editorRef}
        value={value}
        onValueChange={onChange}
        highlight={highlight}
        padding={16}
        style={{
          fontFamily: '"JetBrains Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace',
          fontSize: '14px',
          lineHeight: 1.6,
          minHeight: '400px',
          width: '100%',
          outline: 'none',
          color: '#e0e0e0',
          backgroundColor: '#1e1e1e'
        }}
        disabled={disabled}
        tabSize={2}
        insertSpaces={true}
        autoFocus={!disabled}
      />
      <div className="editor-toolbar">
        <div className="toolbar-info">
          <span className="toolbar-item" id="line-count">1 Line</span>
          <span className="toolbar-divider">|</span>
          <span className="toolbar-item" id="char-count">0 Characters</span>
        </div>
        <div className="toolbar-actions">
          <button
            onClick={() => onChange('')}
            disabled={disabled || !value.trim()}
            className="toolbar-button clear-button"
            aria-label="Clear editor"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor