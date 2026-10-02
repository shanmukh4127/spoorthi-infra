import { spoorthiProjectCollection } from './projectsPage.js'

export { spoorthiProjectCollection }

export const spoorthiProjectDetails = Object.freeze(
  spoorthiProjectCollection.map((project, index) => Object.freeze({
    ...project,
    number: String(index + 1).padStart(2, '0'),
    type: project.projectType,
    status: 'Illustrative concept study',
    heroImage: Object.freeze({ src: project.coverImage, alt: project.coverAlt }),
    nextProjectId: spoorthiProjectCollection[(index + 1) % spoorthiProjectCollection.length]?.id ?? null,
  })),
)

export function getSpoorthiProject(projectId) {
  return spoorthiProjectDetails.find((project) => project.id === projectId) ?? null
}
