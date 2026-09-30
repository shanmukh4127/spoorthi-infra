function TejesMediaPlaceholder({ label, aspect = 'landscape', className = '' }) {
  return <figure className={['tejes-media-placeholder', `tejes-media-placeholder--${aspect}`, className].filter(Boolean).join(' ')}>
    <div className="tejes-media-placeholder__frame" role="img" aria-label={`${label}. Replaceable Tejes Interiors image placeholder.`}>
      <span className="tejes-media-placeholder__line" aria-hidden="true" />
      <span className="tejes-media-placeholder__label">{label}</span>
    </div>
    <figcaption>Image placeholder / client asset to be added later.</figcaption>
  </figure>
}

export default TejesMediaPlaceholder
