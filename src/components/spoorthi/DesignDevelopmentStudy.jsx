import Media from '../common/Media.jsx'
import DesignDrawing from './DesignDrawing.jsx'
function DesignDevelopmentStudy({ stages, caption }) {
  return <figure className="design-study"><ol className="design-study__board">{stages.map(stage => <li key={stage.id}>
    <div className="design-study__copy"><span className="type-label">{stage.number}</span><h3>{stage.label}</h3><p>{stage.description}</p></div>
    <div className="design-study__sheet">{stage.media?.src ? <Media src={stage.media.src} alt={stage.media.alt} aspect="wide" width={stage.media.width} height={stage.media.height} caption="AI-generated concept" /> : <DesignDrawing variant={stage.id} />}</div>
  </li>)}</ol><figcaption>{caption}</figcaption></figure>
}
export default DesignDevelopmentStudy
