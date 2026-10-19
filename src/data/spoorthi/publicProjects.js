import { spoorthiProjectCollection } from './projectsPage.js'
import { signatureProject, selectedProjects } from '../tejes/projectArchive.js'

// Legacy static studies have no publication status; saved Draft records must
// override them before filtering, rather than allowing a static fallback through.
export function getWorkspaceProjects(savedProjects = []) {
  const catalog = [
    ...spoorthiProjectCollection.map(project => ({ ...project, brand: 'Spoorthi Infra', status: 'Published' })),
    ...[signatureProject, ...selectedProjects].map(project => ({ ...project, brand: 'Tejes Interiors', status: 'Published', category: project.category || 'Interior design', coverImage: project.image.src, isConcept: true })),
  ]
  const saved = (Array.isArray(savedProjects) ? savedProjects : []).filter(project => project && ['Spoorthi Infra', 'Tejes Interiors'].includes(project.brand))
  const savedById = new Map(saved.map(project => [project.id, project]))
  const staticIds = new Set(catalog.map(project => project.id))
  return [
    ...catalog.map(project => ({ ...project, ...savedById.get(project.id) })),
    ...saved.filter(project => !staticIds.has(project.id)),
  ]
}

export function getPublicProjects(savedProjects = []) {
  return getWorkspaceProjects(savedProjects).filter(project => !project.deleted && (project.status == null || project.status === 'Published'))
}

export function getPublicSpoorthiProjects(savedProjects = []) {
  return getPublicProjects(savedProjects).filter(project => project.brand === 'Spoorthi Infra')
}
