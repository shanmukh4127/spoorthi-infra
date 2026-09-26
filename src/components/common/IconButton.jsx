import { forwardRef } from 'react'

const IconButton = forwardRef(function IconButton({
  label,
  variant = 'ghost',
  className = '',
  icon,
  type = 'button',
  ...props
}, ref) {
  const classes = ['ui-icon-button', `ui-icon-button--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      aria-label={label}
      className={classes}
      type={type}
      ref={ref}
      {...props}
    >
      {icon}
    </button>
  )
})

export default IconButton
