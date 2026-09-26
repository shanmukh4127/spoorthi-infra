function PageContainer({ as: Element = 'div', width = 'default', fullWidth = false, className = '', children }) {
  const classes = [
    'layout-container',
    width === 'wide' ? 'layout-container--wide' : '',
    fullWidth || width === 'full' ? 'layout-container--bleed' : '',
    className,
  ]
    .filter(Boolean).join(' ')
  return <Element className={classes}>{children}</Element>
}

export default PageContainer
