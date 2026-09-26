import { Media } from '../common/index.js'

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      {project.coverImage && <Media src={project.coverImage} alt={project.title} aspect="landscape" />}
      <div className="project-card__content">
        <p className="type-label">{project.category}</p>
        <h3 className="type-h3">{project.title}</h3>
        {project.description && <p className="type-body">{project.description}</p>}
      </div>
    </article>
  )
}

export default ProjectCard
