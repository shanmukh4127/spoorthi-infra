function Button({
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const classes = ['ui-button', `ui-button--${variant}`, loading ? 'ui-button--loading' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      aria-busy={loading ? 'true' : undefined}
      className={classes}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? <span role="status">Loading…</span> : children}
    </button>
  )
}

export default Button
