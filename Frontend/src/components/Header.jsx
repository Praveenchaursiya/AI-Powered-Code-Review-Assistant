const Header = ({ status }) => {
  const isOnline = status !== 'Offline' && status !== 'Analyzing'

  return (
    <header className="code-lens-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-name">CodeLens</h1>
          <p className="app-subtitle">AI-Powered Code Review Assistant</p>
        </div>
        <div className="header-right">
          <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
            <span className="status-dot" aria-label={isOnline ? 'Online' : 'Offline'}></span>
            <span className="status-text">{status}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header