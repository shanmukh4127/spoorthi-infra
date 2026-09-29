import DesignDrawing from './DesignDrawing.jsx'
import Media from '../common/Media.jsx'
function DesignWorkflow({ steps, note }) {
  return <div className="design-workflow"><ol>{steps.map(step => <li key={step.id}>
    <span className="type-label">{step.number}</span><h3>{step.title}</h3>
    {step.media?.src ? <Media src={step.media.src} alt={step.media.alt} aspect="wide" /> : <DesignDrawing variant={step.id} />}
    <ul>{step.points.map(point => <li key={point}>{point}</li>)}</ul>
  </li>)}</ol><p className="design-workflow__note">{note}</p></div>
}
export default DesignWorkflow
