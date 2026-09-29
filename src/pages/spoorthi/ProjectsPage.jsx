import { PageContainer, SectionWrapper, useBrandContext } from '../../components/layout/index.js'
import TextLink from '../../components/common/TextLink.jsx'
import SpoorthiProjectCollection from '../../components/spoorthi/SpoorthiProjectCollection.jsx'
import { spoorthiProjects, spoorthiProjectsPage } from '../../data/spoorthi/index.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-projects.css'

function ProjectsPage() {
  const brand = useBrandContext()
  const { intro, collection, closing, approvedProjectIds, presentationById, demo } = spoorthiProjectsPage
  const demoProjects = import.meta.env.DEV && demo.enabled ? demo.projects.filter((project) => project.isDemo === true) : []
  const projects = [...spoorthiProjects, ...demoProjects]
  const visibleIds = [...approvedProjectIds, ...demoProjects.map((project) => project.id)]

  return (
    <div className="spoorthi-projects-page">
      <SectionWrapper className="spoorthi-projects-intro">
        <PageContainer>
          <header className="spoorthi-projects-intro__layout">
            <div>
              <p className="type-label">{intro.eyebrow}</p>
              <h1 className="type-h1">{intro.title}</h1>
              <p className="type-body-large spoorthi-projects-intro__statement">{intro.description}</p>
            </div>
            <div className="spoorthi-projects-intro__copy">
              <p className="type-label">{intro.statement}</p>
            </div>
          </header>
        </PageContainer>
      </SectionWrapper>

      <SpoorthiProjectCollection projects={projects} approvedIds={visibleIds} presentationById={presentationById} content={collection} />

      <SectionWrapper className="spoorthi-projects-closing">
        <PageContainer>
          <div className="spoorthi-projects-closing__layout">
            <TextLink variant="arrow" to={routePaths.spoorthi.design3d}>Explore more</TextLink>
            <div className="spoorthi-projects-closing__actions">
              <TextLink variant="arrow" to={brand.primaryCta.path}>{closing.contactLabel}</TextLink>
            </div>
          </div>
        </PageContainer>
      </SectionWrapper>
    </div>
  )
}

export default ProjectsPage
