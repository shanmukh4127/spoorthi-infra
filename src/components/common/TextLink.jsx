import { ArrowUpRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function TextLink({
  to,
  href,
  variant = 'inline',
  active = false,
  external = false,
  className = '',
  children,
  ...props
}) {
  const Component = to ? NavLink : 'a'
  const getClasses = (isActive = active) =>
    ['ui-link', `ui-link--${variant}`, isActive ? 'is-active' : '', className]
      .filter(Boolean)
      .join(' ')

  return (
    <Component
      aria-current={active ? 'page' : undefined}
      className={to ? ({ isActive }) => getClasses(isActive) : getClasses()}
      href={to ? undefined : href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
      to={to}
      {...props}
    >
      <span>{children}</span>
      {variant === 'arrow' && (
        <ArrowUpRight aria-hidden="true" className="ui-link__arrow" size={16} />
      )}
    </Component>
  )
}

export default TextLink
