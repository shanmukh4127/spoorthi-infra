import Media from '../common/Media.jsx'
import DesignDrawing from './DesignDrawing.jsx'
function DesignVisualization({ primary, caption }) {
  return <div className="design-visualization">{primary?.src && primary.alt ? <Media src={primary.src} alt={primary.alt} aspect={primary.aspect ?? 'wide'} objectPosition={primary.objectPosition} width={primary.width} height={primary.height} caption={caption} /> : <figure><DesignDrawing /><figcaption>{caption}</figcaption></figure>}</div>
}
export default DesignVisualization
