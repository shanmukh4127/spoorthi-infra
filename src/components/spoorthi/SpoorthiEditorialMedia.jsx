import Media from '../common/Media.jsx'

function SpoorthiEditorialMedia({
  media,
  label = 'Architectural study',
  aspect = 'landscape',
  className = '',
}) {
  if (media?.src && media?.alt) {
    return <Media {...media} aspect={media.aspect || aspect} className={className} />
  }

  return (
    <figure className={['spoorthi-editorial-media', `spoorthi-editorial-media--${aspect}`, className].filter(Boolean).join(' ')}>
      <div className="spoorthi-editorial-media__frame" role="img" aria-label={`${label}. Replaceable architectural media placeholder.`}>
        <span className="spoorthi-editorial-media__diagram" aria-hidden="true" />
        <span className="spoorthi-editorial-media__label">{label}</span>
      </div>
      <figcaption>Replaceable visual study</figcaption>
    </figure>
  )
}

export default SpoorthiEditorialMedia
