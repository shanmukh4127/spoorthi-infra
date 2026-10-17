import { useEffect, useMemo, useState } from 'react'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import TextLink from '../../components/common/TextLink.jsx'
import SpoorthiProjectCollection from '../../components/spoorthi/SpoorthiProjectCollection.jsx'
import { spoorthiProjectCollection, spoorthiProjectsPage } from '../../data/spoorthi/index.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-projects.css'

const ADMIN_STORAGE_KEY = 'spoorthi-admin-demo-v1'

function readBrowserProjects() {
  try {
    return JSON.parse(window.localStorage.getItem(ADMIN_STORAGE_KEY))?.projects ?? []
  } catch {
    return []
  }
}

function mergeProjects(savedProjects) {
  const savedSpoorthiProjects = savedProjects.filter((project) => project?.brand === 'Spoorthi Infra')
  const savedById = new Map(savedSpoorthiProjects.map((project) => [project.id, project]))
  const baseProjects = spoorthiProjectCollection.map((project) => ({ ...project, ...savedById.get(project.id) }))
  const newProjects = savedSpoorthiProjects.filter((project) => !spoorthiProjectCollection.some((baseProject) => baseProject.id === project.id))
  return [...baseProjects, ...newProjects]
}

function ProjectsPage() {
  const { intro, collection, closing, approvedProjectIds, presentationById } = spoorthiProjectsPage
  const [savedProjects, setSavedProjects] = useState(() => readBrowserProjects())

  useEffect(() => {
    fetch('/api/admin/database')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Admin data unavailable')))
      .then((data) => setSavedProjects(Array.isArray(data.projects) ? data.projects : []))
      .catch(() => setSavedProjects(readBrowserProjects()))
  }, [])

  const projects = useMemo(() => mergeProjects(savedProjects), [savedProjects])
  const publicApprovedIds = useMemo(() => [...new Set([...approvedProjectIds, ...projects.map((project) => project.id)])], [approvedProjectIds, projects])
  const publicPresentation = useMemo(() => Object.fromEntries(projects.map((project) => [project.id, presentationById[project.id] ?? { cover: { alt: project.coverAlt ?? `${project.title} concept study` } }])), [presentationById, projects])

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

      <SpoorthiProjectCollection projects={projects} approvedIds={publicApprovedIds} presentationById={publicPresentation} content={collection} />

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
