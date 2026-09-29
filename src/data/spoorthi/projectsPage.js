export const spoorthiProjectsPage = Object.freeze({
  // Temporary visual fixtures: disable this flag or remove this block in Phase 8.
  // ProjectsPage additionally restricts these records to Vite development mode.
  demo: Object.freeze({
    enabled: true,
    projects: Object.freeze([
      Object.freeze({ id: 'demo-residential-structure', isDemo: true, title: 'Demo Project — Residential Structure', category: 'Residential structure', projectType: 'Architecture demonstration', visualVariant: 'planes', summary: 'A neutral composition of planes and proportion for testing the portfolio presentation.', description: 'Fictional content for evaluating project titles, metadata, and editorial spacing. This is not a real client project or completed Spoorthi work.', coverImage: null, gallery: Object.freeze([]) }),
      Object.freeze({ id: 'demo-commercial-space', isDemo: true, title: 'Demo Project — Commercial Space', category: 'Commercial space', projectType: 'Architecture demonstration', visualVariant: 'facade', summary: 'A study of repetition, alignment, and open space, presented only as a fictional layout example.', description: 'Temporary demonstration content for evaluating the commercial portfolio layout. The abstract visual does not depict a real building or completed Spoorthi project.', coverImage: null, gallery: Object.freeze([]) }),
      Object.freeze({ id: 'demo-spatial-study', isDemo: true, title: 'Demo Project — Spatial Study', category: 'Spatial study', projectType: 'Design demonstration', visualVariant: 'frames', summary: 'An abstract arrangement of frames and negative space for visual review.', description: 'A temporary layout example for development review only. No real project, client, construction outcome, or service claim is represented.', coverImage: null, gallery: Object.freeze([]) }),
      Object.freeze({ id: 'demo-structural-volume', isDemo: true, title: 'Demo — Structural Volume', category: 'Civil structure', projectType: 'Form / Structure study', visualVariant: 'facade', summary: 'A fictional study of rhythm, solid planes, and open space.', description: 'Development-only composition. No engineering specification or completed project is represented.', coverImage: null, gallery: Object.freeze([]) }),
      Object.freeze({ id: 'demo-courtyard-study', isDemo: true, title: 'Demo — Courtyard Study', category: 'Residential', projectType: 'Space / Proportion study', visualVariant: 'planes', summary: 'An illustrative arrangement exploring a central space and surrounding volumes.', description: 'A fictional visual example for reviewing portfolio composition, not a real residence or client commission.', coverImage: null, gallery: Object.freeze([]) }),
      Object.freeze({ id: 'demo-display-space', isDemo: true, title: 'Demo — Display Space', category: 'Commercial', projectType: 'Interior / Spatial study', visualVariant: 'frames', summary: 'A temporary spatial illustration with a restrained sequence of frames.', description: 'Demo material for layout review only. No actual commercial interior, client, or delivered outcome is represented.', coverImage: null, gallery: Object.freeze([]) }),
    ]),
  }),
  intro: {
    eyebrow: 'Spoorthi Infra / 02',
    title: 'Projects',
    description: 'Architectural, construction, and spatial ideas, presented as a demonstration collection.',
    statement: 'Form. Space. A considered perspective.',
    practiceLinkLabel: 'Explore Civil Construction',
  },
  collection: {
    label: 'Project collection',
    title: 'Selected project material',
    emptyTitle: 'Project material is not yet available.',
    emptyDescription: 'Approved project information and imagery will appear here as they become available. In the meantime, explore the Civil Construction practice or start a conversation about your requirements.',
    indexLabel: 'Project index',
  },
  closing: {
    eyebrow: 'Start a conversation',
    title: 'Discuss what comes next.',
    description: 'Explore the design perspective, or bring your project questions to a conversation with Spoorthi Infra.',
    contactLabel: 'Discuss a project',
    designLabel: 'Explore Design / 3D',
  },
  // Publication is explicit. Adding a record to projects.js alone does not approve it.
  approvedProjectIds: Object.freeze([]),
  // Key by project ID. Optional cover/gallery settings: alt, caption, aspect,
  // objectPosition, srcSet, sizes, width, height. Project facts stay in projects.js.
  presentationById: Object.freeze({}),
})
