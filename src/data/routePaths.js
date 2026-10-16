export const routePaths = Object.freeze({
  gateway: '/',
  admin: '/admin',
  spoorthi: Object.freeze({
    home: '/spoorthi',
    civilConstruction: '/spoorthi/civil-construction',
    projects: '/spoorthi/projects',
    projectDetail: (projectId = ':projectId') => `/spoorthi/projects/${projectId}`,
    design3d: '/spoorthi/design-3d',
    vr: '/spoorthi/vr',
    contact: '/spoorthi/contact',
    admin: '/spoorthi/admin',
  }),
  tejes: Object.freeze({
    home: '/tejes',
    interiorDesign: '/tejes/interior-design',
    projects: '/tejes/projects',
    projectDetail: (projectId = ':projectId') => `/tejes/projects/${projectId}`,
    design3d: '/tejes/design-3d',
    vr: '/tejes/vr',
    contact: '/tejes/contact',
  }),
})
