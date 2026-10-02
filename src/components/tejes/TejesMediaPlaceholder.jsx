function TejesMediaPlaceholder({ label, aspect = 'landscape', className = '', media }) {
  return <figure className={['tejes-media-placeholder', `tejes-media-placeholder--${aspect}`, className].filter(Boolean).join(' ')}>
    <div className="tejes-media-placeholder__frame" role={media ? undefined : 'img'} aria-label={media ? undefined : `${label}. Illustrative spatial diagram.`}>
      {media ? <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <><span className="tejes-media-placeholder__line" aria-hidden="true" /><span className="tejes-media-placeholder__label">{label}</span></>}
    </div>
    <figcaption>{media?.caption ?? 'Illustrative spatial diagram'}</figcaption>
  </figure>
}

export default TejesMediaPlaceholder
