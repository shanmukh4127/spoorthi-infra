function LoadingScreen({ label = 'Loading experience' }) {
  return <div aria-label={label} aria-live="polite" className="loading-screen" role="status"><span className="type-label">{label}</span></div>
}

export default LoadingScreen
