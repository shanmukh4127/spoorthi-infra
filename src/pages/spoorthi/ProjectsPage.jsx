import { useMemo } from 'react'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import TextLink from '../../components/common/TextLink.jsx'
import SpoorthiProjectCollection from '../../components/spoorthi/SpoorthiProjectCollection.jsx'
import { spoorthiProjectsPage } from '../../data/spoorthi/index.js'
import usePublicProjects from '../../data/usePublicProjects.js'
import ErrorState from '../../components/states/ErrorState.jsx'
import LoadingState from '../../components/states/LoadingState.jsx'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-projects.css'

function ProjectsPage() {
  const { intro, collection, closing, approvedProjectIds, presentationById } = spoorthiProjectsPage
  const { projects: allProjects, status } = usePublicProjects()
  const projects = useMemo(() => allProjects.filter(project => project.brand === 'Spoorthi Infra'), [allProjects])
  const publicApprovedIds = useMemo(() => [...new Set([...approvedProjectIds, ...projects.map((project) => project.id)])], [approvedProjectIds, projects])
  const publicPresentation = useMemo(() => Object.fromEntries(projects.map((project) => [project.id, presentationById[project.id] ?? { cover: { alt: project.coverAlt ?? `${project.title} concept study` } }])), [presentationById, projects])

  if (status !== 'ready') return <SectionWrapper><PageContainer>{status === 'loading' ? <LoadingState label="Loading project collection" /> : <ErrorState title="Project collection unavailable" message="The project service could not be reached. Please try again shortly." onRetry={() => window.location.reload()} />}</PageContainer></SectionWrapper>

  return (
    <div className="spoorthi-projects-page">
      <SectionWrapper className="spoorthi-projects-intro">
        <PageContainer>
          <header className="spoorthi-projects-intro__layout">
            <div>
              <p className="type-label">{intro.eyebrow}</p>
              <h1>{intro.title}</h1>
            </div>
            <div className="spoorthi-projects-intro__copy">
              <p className="type-body-large">{intro.description}</p>
              <p className="type-label">{intro.statement}</p>
            </div>
          </header>
        </PageContainer>
      </SectionWrapper>

      <SpoorthiProjectCollection projects={projects} approvedIds={publicApprovedIds} presentationById={publicPresentation} content={{ ...collection, label: 'Explore projects', title: 'Projects and design studies', description: 'Published projects and illustrative concepts. Open a project to follow its 2D drawing, 3D view and final image.' }} />

      <SectionWrapper className="spoorthi-projects-closing">
        <PageContainer>
          <div className="spoorthi-projects-closing__layout">
            <div>
              <p className="type-label">{closing.eyebrow}</p>
              <h2>{closing.title}</h2>
              <p>{closing.description}</p>
            </div>
            <div className="spoorthi-projects-closing__actions">
              <TextLink variant="arrow" to={routePaths.spoorthi.contact}>{closing.contactLabel}</TextLink>
              <TextLink variant="arrow" to={routePaths.spoorthi.design3d}>{closing.designLabel}</TextLink>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>
    </div>
  )
}

export default ProjectsPage
