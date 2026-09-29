export const routeMetadata = Object.freeze({
  '/': { title: 'Spoorthi Infra × Tejes Interiors', description: 'Choose a practice.', pageType: 'gateway' },
  '/spoorthi': { title: 'Spoorthi Infra', description: 'Construction, infrastructure, and engineering with structural clarity.', brand: 'spoorthi', route: '/spoorthi', navigationLabel: 'Home', pageType: 'home' },
  '/spoorthi/civil-construction': { title: 'Civil Construction', description: 'Explore Spoorthi Infra civil construction and engineering services.', brand: 'spoorthi', route: '/spoorthi/civil-construction', navigationLabel: 'Civil Construction', pageType: 'service' },
  '/spoorthi/projects': { title: 'Spoorthi Projects', description: 'Explore selected Spoorthi Infra work when verified project material is available.', brand: 'spoorthi', route: '/spoorthi/projects', navigationLabel: 'Projects', pageType: 'projects' },
  '/spoorthi/design-3d': { title: 'Spoorthi Design / 3D', description: 'Explore 2D planning and 3D visualization within the Spoorthi Infra design journey.', brand: 'spoorthi', route: '/spoorthi/design-3d', navigationLabel: 'Design / 3D', pageType: 'service' },
  '/spoorthi/vr': { title: 'Spoorthi VR Experience', description: 'Explore the spatial understanding layer of the Spoorthi Infra design journey.', brand: 'spoorthi', route: '/spoorthi/vr', navigationLabel: 'VR Experience', pageType: 'experience' },
  '/spoorthi/contact': { title: 'Contact Spoorthi Infra', description: 'Start a construction, infrastructure, or design conversation with Spoorthi Infra.', brand: 'spoorthi', route: '/spoorthi/contact', navigationLabel: 'Contact', pageType: 'contact' },
  '/tejes': { title: 'Tejes Interiors', description: 'Interior spaces shaped with clarity, material, and light.', brand: 'tejes', route: '/tejes', navigationLabel: 'Home', pageType: 'home' },
  '/tejes/interior-design': { title: 'Interior Design', description: 'Explore Tejes Interiors spatial and interior design services.', brand: 'tejes', route: '/tejes/interior-design', navigationLabel: 'Interior Design', pageType: 'service' },
  '/tejes/projects': { title: 'Tejes Projects', description: 'Explore selected Tejes Interiors work when verified project material is available.', brand: 'tejes', route: '/tejes/projects', navigationLabel: 'Projects', pageType: 'projects' },
  '/tejes/design-3d': { title: 'Tejes Design / 3D', description: 'Explore spatial planning and 3D visualization within the Tejes Interiors design journey.', brand: 'tejes', route: '/tejes/design-3d', navigationLabel: 'Design / 3D', pageType: 'service' },
  '/tejes/vr': { title: 'Tejes VR Experience', description: 'Explore the immersive spatial understanding layer of the Tejes Interiors design journey.', brand: 'tejes', route: '/tejes/vr', navigationLabel: 'VR Experience', pageType: 'experience' },
  '/tejes/contact': { title: 'Contact Tejes Interiors', description: 'Begin an interior or spatial design conversation with Tejes Interiors.', brand: 'tejes', route: '/tejes/contact', navigationLabel: 'Contact', pageType: 'contact' },
})

export function getRouteMetadata(pathname) {
  if (pathname.startsWith('/spoorthi/projects/')) return { title: 'Spoorthi Project', description: 'Explore a Spoorthi Infra project record and its connected design journey.', brand: 'spoorthi', route: pathname, pageType: 'project-detail' }
  return routeMetadata[pathname] ?? { title: 'Page not found', pageType: '404' }
}
