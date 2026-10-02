import { useState } from 'react'
import { PageContainer, SectionWrapper } from '../layout/index.js'
import EmptyState from '../states/EmptyState.jsx'
import SpoorthiProjectEntry from './SpoorthiProjectEntry.jsx'

function SpoorthiProjectCollection({ projects = [], approvedIds = [], presentationById = {}, content }) {
  const [category, setCategory] = useState('All studies')
  const approved = new Set(approvedIds)
  const seen = new Set()
  const published = projects.filter((project) => {
    if (!project || typeof project.id !== 'string' || !approved.has(project.id) || seen.has(project.id)) return false
    if (typeof project.title !== 'string' || !project.title.trim() || project.title.includes('[') || /placeholder/i.test(project.id)) return false
    seen.add(project.id)
    return true
  })
  const categories = ['All studies', ...new Set(published.map((project) => project.category).filter(Boolean))]
  const visible = category === 'All studies' ? published : published.filter((project) => project.category === category)

  return (
    <SectionWrapper className="spoorthi-project-collection">
      <PageContainer>
        <header className="spoorthi-project-collection__heading">
          <div>
            <p className="type-label">{content.label}</p>
            <h2>{content.title}</h2>
          </div>
          <p>{content.description}</p>
        </header>
        {published.length > 0 && <div className="spoorthi-project-collection__toolbar">
          <div className="spoorthi-project-collection__filters" role="group" aria-label="Filter concept studies by category">
            {categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <p role="status">{visible.length} {visible.length === 1 ? 'study' : 'studies'}</p>
        </div>}
        {visible.length ? <div className="spoorthi-project-collection__previews">
          {visible.map((project) => <SpoorthiProjectEntry key={project.id} number={published.indexOf(project) + 1} project={project} presentation={presentationById[project.id]} />)}
        </div> : <EmptyState className="spoorthi-project-collection__empty" title={content.emptyTitle} description={content.emptyDescription} />}
      </PageContainer>
    </SectionWrapper>
  )
}

export default SpoorthiProjectCollection
