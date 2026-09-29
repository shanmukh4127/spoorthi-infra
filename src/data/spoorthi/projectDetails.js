import { spoorthiProjectsPage } from './projectsPage.js'

const detailSections = Object.freeze({
  design2D: Object.freeze([]),
  development3D: Object.freeze([]),
  visualization: Object.freeze([]),
  vr: Object.freeze({ image: null, title: null, description: null, experienceUrl: null }),
})

export const spoorthiProjectCollection = spoorthiProjectsPage.demo.projects

export const spoorthiProjectDetails = Object.freeze(
  spoorthiProjectCollection.map((project, index) => Object.freeze({
    id: project.id,
    number: String(index + 1).padStart(2, '0'),
    title: project.title,
    description: project.description ?? null,
    type: null,
    location: null,
    area: null,
    status: null,
    isDemo: project.isDemo === true,
    heroImage: null,
    overview: null,
    ...detailSections,
    nextProjectId: spoorthiProjectCollection[index + 1]?.id ?? null,
  })),
)

export function getSpoorthiProject(projectId) {
  return spoorthiProjectDetails.find((project) => project.id === projectId) ?? null
}
