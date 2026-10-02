const residentialImage = '/assets/spoorthi/architecture.webp'
const spatialImage = '/assets/spoorthi/spatial.webp'
const planningImage = '/assets/spoorthi/design-studio.webp'
const constructionImage = '/assets/spoorthi/construction.webp'

// Illustrated studies explain design ideas; they are not client commissions.
export const spoorthiProjectCollection = Object.freeze([
  Object.freeze({
    id: 'residential-concept',
    title: 'A quieter kind of home',
    category: 'Residential',
    projectType: 'Architecture & design',
    isConcept: true,
    summary: 'Warm materials, clear lines, and an open connection to the landscape.',
    description: 'A residential concept exploring how proportion, daylight, and natural materials can shape a calm place to live.',
    overview: 'This illustrated study brings together a simple architectural form, generous glazing, and layers of stone and timber. It invites a conversation about how a home can feel open to its surroundings while retaining privacy and a clear sense of arrival.',
    coverImage: residentialImage,
    coverAlt: 'Illustrative two-storey home with concrete planes, timber screens, and garden terraces at sunset',
    gallery: Object.freeze([
      { src: residentialImage, alt: 'Residential concept with timber screens, broad glazing, and a landscaped entrance', caption: 'Exterior concept / Proportion, material, and light' },
      { src: planningImage, alt: 'Illustrative architectural model beside drawings and material samples', caption: 'Design process illustration / Testing form and materials' },
    ]),
    highlights: Object.freeze([
      { title: 'Light & openness', description: 'Broad openings and shaded edges suggest a balance between daylight, views, and comfort.' },
      { title: 'A warm material palette', description: 'Timber, stone, and concrete create contrast through texture and tone.' },
      { title: 'Inside meets outside', description: 'Terraces and planting soften the threshold between the home and the landscape.' },
    ]),
    relatedService: Object.freeze({ label: 'Explore design & 3D', path: '/spoorthi/design-3d' }),
  }),
  Object.freeze({
    id: 'construction-planning',
    title: 'Structure with purpose',
    category: 'Construction',
    projectType: 'Civil construction',
    isConcept: true,
    summary: 'An exploration of structural rhythm, construction stages, and practical coordination.',
    description: 'An illustrative construction study connecting the architectural idea to the structure, sequence, and decisions behind a building.',
    overview: 'The exposed frame makes the building’s organisation visible: repeated columns, floor plates, and open bays. This study is a starting point for discussing the relationship between design intent, construction planning, and site coordination. It is illustrative material, not an engineering specification.',
    coverImage: constructionImage,
    coverAlt: 'Illustrative concrete building frame under construction with open bays and floor plates',
    gallery: Object.freeze([
      { src: constructionImage, alt: 'Illustrative concrete structure showing repeated columns and exposed floor plates', caption: 'Construction concept / Structure and sequence' },
      { src: planningImage, alt: 'An architectural model and technical drawings on a design studio table', caption: 'Planning illustration / Translating an idea into a clear brief' },
    ]),
    highlights: Object.freeze([
      { title: 'A clear structural rhythm', description: 'Repeated bays help explain how structure and usable space relate to one another.' },
      { title: 'Thoughtful sequencing', description: 'A coordinated plan considers the order of work alongside design decisions.' },
      { title: 'Design & site dialogue', description: 'Drawings, material choices, and site requirements need to inform the same conversation.' },
    ]),
    relatedService: Object.freeze({ label: 'Explore civil construction', path: '/spoorthi/civil-construction' }),
  }),
  Object.freeze({
    id: 'spatial-experience',
    title: 'Spaces that feel connected',
    category: 'Spatial design',
    projectType: 'Visualization & spatial experience',
    isConcept: true,
    summary: 'A study of thresholds, natural light, and the way a room unfolds around you.',
    description: 'An interior concept looking at the journey through a space, from a quiet entrance to an open, naturally lit living area.',
    overview: 'Framed openings guide the eye through layered spaces toward the garden. A restrained palette of timber and stone keeps the emphasis on proportion, light, and movement. This visual study helps explain why a spatial review can reveal relationships that are harder to understand from a plan alone.',
    coverImage: spatialImage,
    coverAlt: 'Illustrative stone and timber doorway framing a light-filled living room and garden',
    gallery: Object.freeze([
      { src: spatialImage, alt: 'Stone and timber entrance opening toward a living area and garden', caption: 'Interior concept / Framed views and layered thresholds' },
      { src: residentialImage, alt: 'Illustrative residential exterior connected to garden terraces', caption: 'Related exterior concept / Connecting building and landscape' },
    ]),
    highlights: Object.freeze([
      { title: 'A natural sequence', description: 'Layered thresholds make the transition between rooms feel intuitive.' },
      { title: 'Views as a guide', description: 'Aligned openings create a visual connection from the entrance to the outdoors.' },
      { title: 'Experience before decisions', description: 'Spatial visualization offers another way to review scale, atmosphere, and flow.' },
    ]),
    relatedService: Object.freeze({ label: 'Explore spatial experiences', path: '/spoorthi/vr' }),
  }),
])

export const spoorthiProjectsPage = Object.freeze({
  conceptStudies: spoorthiProjectCollection,
  intro: Object.freeze({
    eyebrow: 'Spoorthi Infra / Design perspective',
    title: 'Ideas made tangible.',
    description: 'Explore the thinking behind thoughtful buildings, from a first design idea to the experience of a space.',
    statement: 'Architecture. Structure. Experience.',
  }),
  collection: Object.freeze({
    label: 'Explore the collection',
    title: 'Selected concept studies',
    description: 'Illustrative concepts for exploring design possibilities. These are not completed client projects.',
    emptyTitle: 'No studies in this collection yet.',
    emptyDescription: 'Explore another category or speak with us about your project.',
  }),
  closing: Object.freeze({
    eyebrow: 'Your next chapter',
    title: 'Let’s make room for your idea.',
    description: 'Have a site, a brief, or simply a question? We can help you find a direction.',
    contactLabel: 'Discuss your project',
    designLabel: 'Explore design & 3D',
  }),
  approvedProjectIds: Object.freeze(spoorthiProjectCollection.map(({ id }) => id)),
  presentationById: Object.freeze(Object.fromEntries(spoorthiProjectCollection.map((project) => [project.id, { cover: { alt: project.coverAlt, aspect: 'landscape' } }]))),
})
