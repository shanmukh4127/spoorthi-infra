import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import TextLink from '../../components/common/TextLink.jsx'
import SpoorthiProjectCollection from '../../components/spoorthi/SpoorthiProjectCollection.jsx'
import { spoorthiProjectCollection, spoorthiProjectsPage } from '../../data/spoorthi/index.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-projects.css'

function ProjectsPage() {
  const { intro, collection, closing, approvedProjectIds, presentationById } = spoorthiProjectsPage

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

      <SpoorthiProjectCollection projects={spoorthiProjectCollection} approvedIds={approvedProjectIds} presentationById={presentationById} content={collection} />

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
