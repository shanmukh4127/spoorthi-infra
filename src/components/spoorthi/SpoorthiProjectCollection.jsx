import { PageContainer, SectionWrapper } from '../layout/index.js'
import EmptyState from '../states/EmptyState.jsx'
import SpoorthiProjectEntry from './SpoorthiProjectEntry.jsx'

function SpoorthiProjectCollection({ projects = [], approvedIds = [], presentationById = {}, content }) {
  const approved = new Set(approvedIds)
  const seen = new Set()
  const published = projects.filter((project) => {
    if (!project || typeof project.id !== 'string' || !approved.has(project.id) || seen.has(project.id)) return false
    if (typeof project.title !== 'string' || !project.title.trim() || project.title.includes('[') || /placeholder/i.test(project.id)) return false
    seen.add(project.id)
    return true
  })
  const anchorFor = (project) => `spoorthi-project-${encodeURIComponent(project.id)}`
  const hasDemo = published.some((project) => project.isDemo === true)

  if (!published.length) {
    return (
      <SectionWrapper as="div" className="spoorthi-project-collection">
        <PageContainer>
          <div className="spoorthi-project-collection__empty-layout">
            <p className="type-label">{content.label}</p>
            <EmptyState className="spoorthi-project-collection__empty" title={content.emptyTitle} description={content.emptyDescription} />
          </div>
        </PageContainer>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper className="spoorthi-project-collection">
      <PageContainer>
        <header className="spoorthi-project-collection__heading">
          <h2 className="type-h3">{hasDemo ? 'Selected Demonstration Projects' : content.title}</h2>
          {hasDemo && <p className="type-body-small">Development previews only. Fictional content, not completed Spoorthi work.</p>}
        </header>
        <div className="spoorthi-project-collection__previews">
          {published.map((project, index) => <SpoorthiProjectEntry key={project.id} preview number={index + 1} project={project} anchorId={anchorFor(project)} presentation={presentationById[project.id]} />)}
        </div>
        <details className="spoorthi-project-collection__entries">
          <summary>Read {hasDemo ? 'demonstration' : 'project'} notes</summary>
          <h2 className="type-h3">{hasDemo ? 'Demonstration project notes' : 'Project information'}</h2>
          {published.map((project) => <SpoorthiProjectEntry key={project.id} project={project} anchorId={anchorFor(project)} presentation={presentationById[project.id]} />)}
        </details>
      </PageContainer>
    </SectionWrapper>
  )
}

export default SpoorthiProjectCollection
