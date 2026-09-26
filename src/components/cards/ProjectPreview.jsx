import { Media, TextLink } from '../common/index.js'

function ProjectPreview({ project, projectRoute, featured = false }) {
  const hasLocation = Boolean(project.location && !project.location.startsWith('['))
  const hasYear = Boolean(project.year)
  const description = project.description?.startsWith('[') ? null : project.description

  return (
    <article className={['project-preview', featured ? 'project-preview--featured' : ''].filter(Boolean).join(' ')}>
      {project.coverImage && <Media src={project.coverImage} alt={project.title} aspect="landscape" loading="lazy" hover />}
      <div className="project-preview__content">
        {project.category && !project.category.startsWith('[') && <p className="type-label">{project.category}</p>}
        <h3 className="project-preview__title type-h3">{project.title}</h3>
        {(hasLocation || hasYear) && (
          <p className="project-preview__metadata type-label">
            {[hasLocation ? project.location : null, hasYear ? project.year : null].filter(Boolean).join('  •  ')}
          </p>
        )}
        {description && <p className="project-preview__description type-body">{description}</p>}
        {projectRoute && <TextLink to={projectRoute} variant="arrow">View Projects</TextLink>}
      </div>
    </article>
  )
}

export default ProjectPreview
