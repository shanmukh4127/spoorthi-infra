import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Media from '../common/Media.jsx'
import { routePaths } from '../../data/routePaths.js'

function SpoorthiProjectEntry({ project, presentation = {}, number = 1 }) {
  const id = `spoorthi-study-${project.id}`
  const cover = presentation.cover ?? {}

  return (
    <article className="spoorthi-project-preview" aria-labelledby={`${id}-title`}>
      <Link className="spoorthi-project-preview__visual" to={routePaths.spoorthi.projectDetail(project.id)} aria-label={`Explore ${project.title}`}>
        <Media src={project.coverImage} alt={cover.alt ?? project.coverAlt} aspect="landscape" objectPosition={cover.objectPosition ?? 'center'} />
        <span className="spoorthi-project-preview__badge">Concept study</span>
        <span className="spoorthi-project-preview__image-arrow" aria-hidden="true"><ArrowUpRight size={22} /></span>
      </Link>
      <div className="spoorthi-project-preview__copy">
        <p className="spoorthi-project-preview__category type-label"><span>{project.category}</span><span>{String(number).padStart(2, '0')}</span></p>
        <h3 id={`${id}-title`}><Link to={routePaths.spoorthi.projectDetail(project.id)}>{project.title}</Link></h3>
        <p>{project.summary ?? project.description}</p>
        <Link className="spoorthi-project-preview__link" to={routePaths.spoorthi.projectDetail(project.id)} aria-label={`View concept study: ${project.title}`}>Explore the study <ArrowUpRight aria-hidden="true" size={16} /></Link>
      </div>
    </article>
  )
}

export default SpoorthiProjectEntry
