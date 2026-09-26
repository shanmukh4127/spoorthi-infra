function LoadingState({ label = 'Loading', size = 'medium', className = '' }) {
  return (
    <div
      aria-label={label}
      aria-live="polite"
      className={['state-message', `state-message--${size}`, 'loading-state', className].filter(Boolean).join(' ')}
      role="status"
    >
      <span aria-hidden="true" className="loading-state__indicator" />
      <span>{label}</span>
    </div>
  )
}

export default LoadingState
