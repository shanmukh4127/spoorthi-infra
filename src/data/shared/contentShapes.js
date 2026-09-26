/** Small constructors keep shared data shapes consistent without introducing a CMS layer. */
export function createProject(project) {
  return Object.freeze({
    id: project.id,
    slug: project.slug,
    title: project.title ?? '[Project title]',
    category: project.category ?? '[Project category]',
    location: project.location ?? null,
    year: project.year ?? null,
    description: project.description ?? '[Project description]',
    coverImage: project.coverImage ?? null,
    gallery: Object.freeze(project.gallery ?? []),
    featured: Boolean(project.featured),
  })
}

export function createProcessStep(step) {
  return Object.freeze({
    number: step.number,
    id: step.id,
    title: step.title ?? '[Process step title]',
    description: step.description ?? '[Process step description]',
    icon: step.icon ?? null,
    image: step.image ?? null,
    link: step.link ?? null,
  })
}

export function createService(service) {
  return Object.freeze({
    id: service.id,
    label: service.label ?? '[Service label]',
    title: service.title ?? '[Service title]',
    description: service.description ?? '[Service description]',
    icon: service.icon ?? null,
    image: service.image ?? null,
    route: service.route ?? null,
  })
}
