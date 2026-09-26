import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'
import { ProjectPreview } from '../cards/index.js'
import EmptyState from '../states/EmptyState.jsx'

function isRealProject(project) {
  return Boolean(project?.title && !project.title.startsWith('[') && project?.category && !project.category.startsWith('['))
}

function selectCuratedProjects(projects) {
  const realProjects = projects.filter(isRealProject)
  const featuredProjects = realProjects.filter((project) => project.featured)
  const remainingProjects = realProjects.filter((project) => !project.featured)
  return [...featuredProjects, ...remainingProjects].slice(0, 3)
}

function ProjectsSection({ eyebrow, title, description, projects = [], projectRoute, brandVariant = 'neutral' }) {
  const curatedProjects = selectCuratedProjects(projects)

  return (
    <SectionWrapper id="projects" className={`projects-section projects-section--${brandVariant}`}>
      <PageContainer>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        {curatedProjects.length > 0 ? (
          <div className="projects-section__list">
            {curatedProjects.map((project, index) => <ProjectPreview key={project.id} project={project} projectRoute={projectRoute} featured={index === 0} />)}
          </div>
        ) : (
          <EmptyState
            className="projects-section__empty"
            title="Verified project material is not available"
            description="Selected work will appear here when verified project material is available."
          />
        )}
      </PageContainer>
    </SectionWrapper>
  )
}

export default ProjectsSection
