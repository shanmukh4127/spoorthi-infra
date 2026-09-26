import { useState } from 'react'

function Media({
  src,
  alt = '',
  aspect = 'natural',
  objectPosition = 'center',
  loading = 'lazy',
  decoding = 'async',
  srcSet,
  sizes,
  overlay,
  overlayOnHover = false,
  hover = false,
  caption,
  fullWidth = false,
  contained = true,
  decorative = false,
  placeholder = null,
  className = '',
  ...imageProps
}) {
  const [status, setStatus] = useState('loading')
  const classes = [
    'media',
    `media--aspect-${aspect}`,
    fullWidth ? 'media--full-width' : '',
    contained && !fullWidth ? 'media--contained' : '',
    hover ? 'media--hover' : '',
    overlay ? `media--overlay-${overlay === true ? 'dark' : overlay}` : '',
    overlayOnHover ? 'media--overlay-hover' : '',
    `media--${status}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const resolvedAlt = decorative ? '' : alt

  return (
    <figure aria-busy={status === 'loading' ? 'true' : undefined} className={classes} style={{ '--media-object-position': objectPosition }}>
      <div className="media__frame">
        <img
          {...imageProps}
          alt={resolvedAlt}
          aria-hidden={decorative ? 'true' : undefined}
          className="media__image"
          decoding={decoding}
          loading={loading}
          sizes={sizes}
          src={src}
          srcSet={srcSet}
          onError={(event) => {
            setStatus('error')
            imageProps.onError?.(event)
          }}
          onLoad={(event) => {
            setStatus('loaded')
            imageProps.onLoad?.(event)
          }}
        />
        {status === 'loading' && placeholder && <span aria-hidden="true" className="media__placeholder">{placeholder}</span>}
        {status === 'error' && <span className="media__error" role="img" aria-label={alt || 'Media unavailable'}>{placeholder || 'Media unavailable'}</span>}
        {overlay && <span aria-hidden="true" className="media__overlay" />}
      </div>
      {caption && <figcaption className="media__caption">{caption}</figcaption>}
    </figure>
  )
}

export default Media
