import Media from '../common/Media.jsx'
import VrDrawing from './VrDrawing.jsx'

function SpatialPortal({ content }) {
  const { media } = content
  return (
    <figure className="spatial-portal" aria-label={content.title}>
      <div className="spatial-portal__board">
        <div className="spatial-portal__plan"><VrDrawing variant="plan" /></div>
        <div className="spatial-portal__opening">
          <Media src={media.src} alt={media.alt} aspect="portrait" objectPosition={media.objectPosition} width={media.width} height={media.height} loading="eager" />
        </div>
        <div className="spatial-portal__perspective"><VrDrawing /></div>
      </div>
      <div className="spatial-portal__labels" aria-hidden="true"><span>Plan</span><span>Space</span><span>Perspective</span></div>
      <figcaption><span>{content.caption}</span><span>{content.note}</span></figcaption>
    </figure>
  )
}
export default SpatialPortal
