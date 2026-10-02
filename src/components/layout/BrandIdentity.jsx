function BrandIdentity({ brand, className = '' }) {
  if (brand.id !== 'spoorthi') return <span className="type-label">{brand.name}</span>

  return <span className={`spoorthi-identity ${className}`}>
    <svg className="spoorthi-identity__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M9 30V17L20 10L31 17V30M9 23L20 16L31 23M15 30V23L20 20L25 23V30M20 10V5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
    <span className="spoorthi-identity__wordmark"><strong>SPOORTHI</strong><small>INFRA</small></span>
  </span>
}

export default BrandIdentity
