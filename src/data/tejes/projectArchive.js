import { routePaths } from '../routePaths.js'
import assets from './homeAssets.json'
import details from './projectAssets.json'

// The same record shape supports a future approved project archive.
// Nulls are deliberate: reference imagery does not establish client facts.
const study = ({ id, number, title, type, image, description }) => ({
  id, number, title, type, description, location: null, year: null,
  status: 'Design study', designScope: null, isIllustrative: true,
  specifications: [], designIntent: [], development: [], materials: [],
  highlights: [], story: [], images: { primary: image },
})

export const signatureProject = {
  ...study({ id: 'modern-living-residence', number: '01', title: 'Modern Living Residence',
    type: 'Residential interior', image: assets['featured-residence'],
    description: 'An illustrative exploration of a garden-facing interior. Stone, timber and expansive glazing frame a connected living space, where everyday comfort meets a clear architectural rhythm.' }),
  statement: 'A space shaped around the way people live.',
  specifications: [
    { label: 'Project type', values: ['Residential interior', 'Design study'] },
    { label: 'Design scope', values: null },
    { label: 'Design language', values: ['Contemporary', 'Material-led', 'Refined'] },
    { label: 'Spaces in the study', values: ['Living', 'Kitchen'] },
    { label: 'Study palette', values: ['Timber', 'Natural stone', 'Glass', 'Upholstery'] },
  ],
  designIntent: [
    ['Space', 'A view through the room reveals its depth and connection to the garden.'],
    ['Function', 'Living and kitchen are considered together in a study of everyday movement.'],
    ['Material', 'Stone and timber offer texture, contrast and a sense of continuity.'],
    ['Light', 'Expansive glazing brings natural light into the spatial composition.'],
    ['Detail', 'Junctions, edges and furniture proportions invite a closer look.'],
    ['Comfort', 'Soft seating brings an intimate, human scale to the open interior.'],
  ].map(([title, description]) => ({ title, description })),
  development: [
    { title: '2D Design', image: assets['development-plan'], note: 'Drawing slot', path: routePaths.tejes.design3d },
    { title: '3D Development', image: assets['development-3d'], note: 'Model slot', path: routePaths.tejes.design3d },
    { title: 'Visualization', image: { src: '/assets/tejes/projects/visualization-slot.svg', width: 2400, height: 1600 }, note: 'Visualization slot', path: routePaths.tejes.design3d },
    { title: 'Execution / VR', image: assets['development-vr'], note: 'Spatial experience slot', path: routePaths.tejes.vr },
  ],
  materials: ['Wood', 'Stone', 'Marble', 'Glass', 'Metal', 'Fabric', 'Lighting'].map(title => ({ title, image: assets[`material-${title.toLowerCase()}`] })),
  milestone: 'A defining study in the Tejes design journey.',
  milestoneDescription: 'A considered direction for the spaces we imagine next.',
  story: [
    { title: 'Space', image: details['living-detail'], alt: 'Soft seating and timber flooring beside garden-facing glazing', caption: 'The scale of everyday living.' },
    { title: 'Material', image: details['stone-detail'], alt: 'Natural stone island, stools and warm timber parquet', caption: 'Texture, contrast and continuity.' },
    { title: 'Light', image: details['window-detail'], alt: 'Tall windows opening the interior to a green garden', caption: 'A dialogue with the outside.' },
  ],
  images: {
    primary: assets['featured-residence'], introduction: details['architecture-light'],
    statement: details['living-detail'], intent: details['spatial-detail'],
    milestone: details['milestone-view'], closing: details['timber-detail'],
  },
}

export const selectedStudies = [
  study({ id: 'kitchen-light', number: '02', title: 'Kitchen & light', type: 'Kitchen / Design study', image: assets['category-kitchen'], description: 'A visual reference for the relationship between timber cabinetry, an island and architectural lighting.' }),
  study({ id: 'quieter-room', number: '03', title: 'A quieter room', type: 'Bedroom / Design study', image: assets['category-bedroom'], description: 'A bedroom reference exploring a calm palette, upholstered surfaces and soft daylight.' }),
  study({ id: 'space-to-think', number: '04', title: 'Space to think', type: 'Home office / Design study', image: assets['category-office'], description: 'A workspace reference considering the balance of furniture, natural materials and room to focus.' }),
]

export const archive = {
  title: 'Spaces that define the way we live.',
  introduction: 'A carefully selected collection of interior work, design studies and spaces shaped around people, purpose and place.',
  metadata: ['Project archive', 'Selected work', 'Tejes Interiors'],
  provenance: 'Illustrative design dossier. Licensed reference photography is shown here; approved Tejes project photographs and records will replace these study assets.',
  pendingSpecifications: 'Project-specific scope, location and dates await approved documentation.',
  developmentNote: 'A framework for the design journey. These visual slots await approved project drawings, models and spatial imagery.',
  materialNote: 'An exploratory finish palette. Final selections belong to the approved project brief.',
  emptyHighlights: 'The project’s defining details will be introduced with the approved documentation.',
  journeyTitle: 'From idea to space.',
  journeyDescription: 'Explore how a Tejes project develops from planning and design into 3D visualization and the final spatial experience.',
  closing: 'Every space has a story. We design how it is experienced.',
  navigation: [
    { title: 'Signature project', path: '#signature-project' },
    { title: 'Project journey', path: '#project-development' },
    { title: 'Selected studies', path: '#selected-work' },
    { title: 'About Tejes', path: `${routePaths.tejes.home}#tejes-about` },
    { title: 'Services', path: routePaths.tejes.interiorDesign },
    { title: 'Contact', path: routePaths.tejes.contact },
  ],
  footer: [
    { title: 'About', path: `${routePaths.tejes.home}#tejes-about` },
    { title: 'Services', path: routePaths.tejes.interiorDesign },
    { title: 'Projects', path: routePaths.tejes.projects },
    { title: 'Contact', path: routePaths.tejes.contact },
  ],
}
