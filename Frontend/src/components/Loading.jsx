const Loading = () => {
  return (
    <div className="loading-panel">
      <div className="loading-card">
        <div className="spinner" aria-hidden="true"></div>
        <p className="loading-text">Analyzing your code...</p>
      </div>
    </div>
  )
}

export default Loading
