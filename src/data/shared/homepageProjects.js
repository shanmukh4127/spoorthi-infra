import { createProjectStory } from './projectStory.js'

// Only the projects already selected before the setting existed are migrated on.
const legacySelections = {
  'Spoorthi Infra': new Set(['demo-courtyard-residence', 'demo-urban-framework', 'demo-garden-pavilion']),
  'Tejes Interiors': new Set(['signature-residence', 'harmony-home', 'serenity-villa']),
}

export function isHomepageProject(project) {
  return typeof project.showOnHomepage === 'boolean' ? project.showOnHomepage : Boolean(legacySelections[project.brand]?.has(project.id))
}

export function getHomepageProjects(projects, brand) {
  return projects.filter(project => project.brand === brand && !project.deleted && (project.status == null || project.status === 'Published') && isHomepageProject(project))
}

export function createHomepageStory(record) {
  const story = createProjectStory(record)
  const project = { ...record, ...story.project }
  if (!project.visualizationImages[0].image.src && record.coverImage) {
    project.visualizationImages = [{ image: { src: record.coverImage, width: 1600, height: 1000 }, alt: record.coverAlt || `${record.title} — project cover` }]
    story.stages[2] = { ...story.stages[2], label: 'Project overview', title: record.title, note: record.isConcept ? 'Illustrative concept cover' : 'Project cover supplied through the workspace' }
    story.copy.visualization = { heading: record.location || record.category || 'Explore the project.', description: record.description || 'View the supplied project cover and details.' }
  }
  return { ...story, project }
}
