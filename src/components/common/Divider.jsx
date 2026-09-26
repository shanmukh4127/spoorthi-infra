function Divider({ orientation = 'horizontal', className = '' }) {
  const classes = ['ui-divider', `ui-divider--${orientation}`, className]
    .filter(Boolean)
    .join(' ')

  return <span aria-orientation={orientation} className={classes} role="separator" />
}

export default Divider
