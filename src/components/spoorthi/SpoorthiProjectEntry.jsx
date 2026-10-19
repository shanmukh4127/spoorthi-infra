import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Media from '../common/Media.jsx'
import { routePaths } from '../../data/routePaths.js'

function SpoorthiProjectEntry({ project, presentation = {}, number = 1 }) {
  const id = `spoorthi-study-${project.id}`
  const cover = presentation.cover ?? {}
  const coverSource = project.coverImage || project.finalOutputImage || project.threeDImage || project.twoDImage

  return (
    <article className="spoorthi-project-preview" aria-labelledby={`${id}-title`}>
      <Link className="spoorthi-project-preview__visual" to={routePaths.spoorthi.projectDetail(project.id)} aria-label={`Explore ${project.title}`}>
        {coverSource ? <Media src={coverSource} alt={cover.alt ?? project.coverAlt ?? project.title} aspect="landscape" objectPosition={cover.objectPosition ?? 'center'} /> : <div className="spoorthi-project-preview__missing">Project image not yet added</div>}
        <span className="spoorthi-project-preview__badge">{project.isConcept ? 'Concept study' : 'Project'}</span>
        <span className="spoorthi-project-preview__image-arrow" aria-hidden="true"><ArrowUpRight size={22} /></span>
      </Link>
      <div className="spoorthi-project-preview__copy">
        <p className="spoorthi-project-preview__category type-label"><span>{project.category}</span><span>{String(number).padStart(2, '0')}</span></p>
        <h3 id={`${id}-title`}><Link to={routePaths.spoorthi.projectDetail(project.id)}>{project.title}</Link></h3>
        <p>{project.summary ?? project.description}</p>
        <Link className="spoorthi-project-preview__link" to={routePaths.spoorthi.projectDetail(project.id)} aria-label={`View project: ${project.title}`}>Explore project <ArrowUpRight aria-hidden="true" size={16} /></Link>
      </div>
    </article>
  )
}

export default SpoorthiProjectEntry
