function SectionWrapper({ as: Element = 'section', id, variant = 'standard', contained = false, fullWidth = false, className = '', children }) {
  const classes = [
    'layout-section',
    variant !== 'standard' ? `layout-section--${variant}` : '',
    contained ? 'layout-section--contained' : '',
    fullWidth ? 'layout-section--full-width' : '',
    className,
  ]
    .filter(Boolean).join(' ')
  const content = contained && !fullWidth ? <div className="layout-container">{children}</div> : children
  return <Element className={classes} id={id}>{content}</Element>
}

export default SectionWrapper
