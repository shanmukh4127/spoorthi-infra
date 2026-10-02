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
      <img className="gateway-panel__image" src={brand.id === 'spoorthi' ? '/assets/spoorthi/construction.webp' : '/assets/spoorthi/spatial.webp'} alt="" aria-hidden="true" width={brand.id === 'spoorthi' ? 1672 : 1536} height={brand.id === 'spoorthi' ? 941 : 1024} fetchPriority={brand.id === 'spoorthi' ? 'high' : 'auto'} />
      <div className="gateway-panel__content">
        <p className="gateway-panel__industry">{brand.industry}</p>
        <h2>{brand.name}</h2>
        <p className="gateway-panel__descriptor">{brand.gateway.descriptor}</p>
        <span className="gateway-panel__cta">
          {brand.gateway.cta}
          <span aria-hidden="true">↗</span>
        </span>
      </div>

      <span className="gateway-panel__concept">Illustrative architectural concept</span>
    </Link>
  )
}

export default BrandPanel
