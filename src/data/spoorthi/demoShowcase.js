const image = (src, alt) => ({ image: { src, width: 1600, height: 1000, focalPoint: '50% 50%' }, alt })
const demo = ({ id, title, category, description, plan, model, final, copy }) => ({
  id, title, category, description,
  brand: 'Spoorthi Infra', status: 'Published', isConcept: true, isShowcaseDemo: true,
  projectType: category, summary: description,
  overview: `${description} This is an illustrative demo, not completed client work. The diagram, massing study and reference visualization explain a design process rather than a coordinated construction set.`,
  coverImage: final.src, coverAlt: final.alt,
  twoDImage: plan.src, threeDImage: model.src, finalOutputImage: final.src,
  twoDImages: [image(plan.src, plan.alt)],
  threeDImages: [image(model.src, model.alt)],
  visualizationImages: [image(final.src, final.alt)],
  gallery: [plan, model, final].map((media, index) => ({ ...media, caption: ['2D concept diagram · Not a construction drawing', '3D massing concept · Illustrative proportions', 'Reference visualization · Not completed client work'][index] })),
  highlights: [
    { title: 'Plan the relationships', description: copy.twoD.description },
    { title: 'Explore the form', description: copy.threeD.description },
    { title: 'Review the direction', description: copy.visualization.description },
  ],
  showcaseCopy: copy,
  relatedService: { label: 'Discuss a concept', path: '/spoorthi/contact' },
})

export const spoorthiDemoProjects = [
  demo({
    id: 'demo-courtyard-residence', title: 'The Courtyard Residence', category: 'Residential concept',
    description: 'A home imagined around a planted courtyard, generous shared spaces and a warm architectural palette.',
    plan: { src: '/assets/spoorthi/demo-projects/courtyard-plan.svg', alt: 'Illustrative courtyard residence plan with living spaces arranged around an open garden' },
    model: { src: '/assets/spoorthi/demo-projects/courtyard-massing.svg', alt: 'Axonometric courtyard residence massing study with stepped volumes and an open central court' },
    final: { src: '/assets/spoorthi/architecture.webp', alt: 'AI-generated residential reference with concrete planes, timber screens and planted terraces; not a client project' },
    copy: {
      twoD: { heading: 'Life around a little green.', description: 'A planted court brings the everyday rooms into conversation. This diagram explores the relationship between arrival, gathering and a quieter private wing.' },
      threeD: { heading: 'A courtyard finds its form.', description: 'Stepped volumes frame an open centre. The massing study tests enclosure, shade and how a small garden can give the whole home a sense of orientation.' },
      visualization: { heading: 'Warmth in every threshold.', description: 'Concrete, timber and planting suggest a calm residential character. The reference image explores a possible material direction, rather than a completed building.' },
    },
  }),
  demo({
    id: 'demo-urban-framework', title: 'The Urban Framework', category: 'Commercial concept',
    description: 'An adaptable commercial building study connecting a clear structural grid with open, flexible floor space.',
    plan: { src: '/assets/spoorthi/demo-projects/framework-plan.svg', alt: 'Illustrative commercial floor plate with a regular column grid, service core and flexible work areas' },
    model: { src: '/assets/spoorthi/demo-projects/framework-massing.svg', alt: 'Axonometric commercial frame concept showing repeated columns and stacked floor plates' },
    final: { src: '/assets/spoorthi/construction.webp', alt: 'Illustrative concrete structural reference showing exposed floors and open bays; not a completed client project' },
    copy: {
      twoD: { heading: 'Room for the way work changes.', description: 'A regular planning grid sets out flexible work areas around a compact service core. It is an early spatial idea, not a structural or engineering specification.' },
      threeD: { heading: 'Clarity, one layer at a time.', description: 'Columns and floor plates make the building legible. The diagram explores a repeatable framework and the relationship between the ground floor and the spaces above.' },
      visualization: { heading: 'A structure with possibility.', description: 'The exposed-frame reference brings rhythm, depth and construction sequence into view. It shows a design direction for discussion, not a claim of completed work.' },
    },
  }),
  demo({
    id: 'demo-garden-pavilion', title: 'The Garden Pavilion', category: 'Spatial architecture concept',
    description: 'A small pavilion concept that layers an entrance, a sheltered living space and a garden-facing terrace.',
    plan: { src: '/assets/spoorthi/demo-projects/pavilion-plan.svg', alt: 'Illustrative pavilion plan connecting an entrance gallery, shared living space and a garden terrace' },
    model: { src: '/assets/spoorthi/demo-projects/pavilion-massing.svg', alt: 'Axonometric garden pavilion massing with a low roof, glazed openings and an outdoor terrace' },
    final: { src: '/assets/spoorthi/spatial.webp', alt: 'AI-generated stone and timber interior reference opening toward a garden; not a completed client project' },
    copy: {
      twoD: { heading: 'A simple path to the garden.', description: 'An entrance gallery leads into a shared room and out to a terrace. The plan studies how a few clear thresholds can make a compact space feel generous.' },
      threeD: { heading: 'Shelter without closing in.', description: 'A low roof and open edges frame the garden. The massing diagram tests the balance between a protected interior and a comfortable space outdoors.' },
      visualization: { heading: 'Let the outside come closer.', description: 'Stone, timber and an aligned garden view give the reference its atmosphere. This final concept image explores light and material rather than documenting a built pavilion.' },
    },
  }),
]

export const spoorthiShowcaseStages = [
  { key: 'twoDImages', copyKey: 'twoD', label: '2D design', title: 'Begin with the plan.', note: 'Demo concept diagram · Not a construction drawing' },
  { key: 'threeDImages', copyKey: 'threeD', label: '3D design', title: 'Give the idea dimension.', note: 'Illustrative massing study · Not an engineering model' },
  { key: 'visualizationImages', copyKey: 'visualization', label: 'Final output', title: 'See a possible direction.', note: 'Reference concept imagery · Not completed client work' },
]
