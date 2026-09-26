function Label({ as: Element = 'span', tone = 'default', className = '', children }) {
  const classes = ['ui-label', `ui-label--${tone}`, className]
    .filter(Boolean)
    .join(' ')

  return <Element className={classes}>{children}</Element>
}

export default Label
