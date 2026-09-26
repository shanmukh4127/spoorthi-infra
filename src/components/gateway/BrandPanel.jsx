import { Link } from 'react-router-dom'

function BrandPanel({
  brand,
  isActive,
  isMuted,
  onFocusChange,
  onHoverChange,
}) {
  const stateClass = [
    'gateway-panel',
    `gateway-panel--${brand.id}`,
    isActive ? 'gateway-panel--active' : '',
    isMuted ? 'gateway-panel--muted' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link
      className={stateClass}
      to={brand.routeBase}
      aria-label={brand.gateway.cta}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onFocusChange(null)
        }
      }}
      onFocus={() => onFocusChange(brand.id)}
      onKeyDown={(event) => {
        if (event.key === ' ') {
          event.preventDefault()
          event.currentTarget.click()
        }
      }}
      onMouseEnter={() => onHoverChange(brand.id)}
      onMouseLeave={() => onHoverChange(null)}
    >
      <div className="gateway-panel__content">
        <p className="gateway-panel__industry">{brand.industry}</p>
        <h2>{brand.name}</h2>
        <p className="gateway-panel__descriptor">{brand.gateway.descriptor}</p>
        <span className="gateway-panel__cta">
          {brand.gateway.cta}
          <span aria-hidden="true">↗</span>
        </span>
      </div>

      <div className="gateway-panel__visual" aria-hidden="true">
        <span className="gateway-panel__line gateway-panel__line--vertical" />
        <span className="gateway-panel__line gateway-panel__line--horizontal" />
        <span className="gateway-panel__marker" />
      </div>
    </Link>
  )
}

export default BrandPanel
