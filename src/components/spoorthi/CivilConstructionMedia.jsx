import Media from '../common/Media.jsx'

function PlaceholderDrawing({ label, aspect }) {
  return <figure className={`civil-media civil-media--${aspect}`}>
    <div className="civil-media__frame" role="img" aria-label={`${label}. Media placeholder; approved asset to be added later.`}><span className="civil-media__grid" aria-hidden="true" /><span className="civil-media__label">{label}</span><span className="civil-media__mark" aria-hidden="true">＋</span></div>
    <figcaption>Media placeholder / approved asset to be added later.</figcaption>
  </figure>
}

function CivilConstructionMedia({ media, className = '' }) { return media?.src && media.alt ? <Media {...media} className={className} /> : <PlaceholderDrawing {...media} /> }
export default CivilConstructionMedia
