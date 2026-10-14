import { routePaths } from '../routePaths.js'
import images from './projectsEditorialAssets.json'

const planStudy = { src: '/assets/tejes/projects/detail/illustrative-plan.svg', width: 1600, height: 1000, focalPoint: '50% 50%' }
const flowStudy = { src: '/assets/tejes/projects/detail/illustrative-flow.svg', width: 1600, height: 1000, focalPoint: '50% 50%' }
const media = (key, alt, title, description) => ({ image: images[key], alt, title, description, status: 'Illustrative concept image' })
const planMedia = { image: planStudy, alt: 'Illustrative residential floor-plan study, not an approved client drawing', title: 'Furnished concept plan', description: 'Furniture placement and room relationships · Not an approved drawing', status: 'Illustrative planning study' }
const flowMedia = { image: flowStudy, alt: 'Illustrative spatial-flow diagram, not an approved client drawing', title: 'Spatial flow study', description: 'Conceptual circulation and room relationships · Not to scale', status: 'Illustrative planning study' }

// Visual studies model the approved layout. Null fields await Tejes project records.
const project = ({ id, number, title, label, description, image, alt, featured = false, detail }) => ({
  id, number, title, label, description, image, alt, featured,
  projectType: null, designScope: null, spaces: null,
  status: null, location: null, year: null, client: null,
  detailRoute: routePaths.tejes.projectDetail(id),
  imageryStatus: 'Illustrative generated reference image; not verified client work',
  category: detail.category,
  projectInfo: detail.projectInfo,
  heroImage: detail.heroImage,
  twoDImages: detail.twoDImages ?? [planMedia, flowMedia],
  threeDImages: detail.threeDImages ?? [],
  threeDTourUrl: detail.threeDTourUrl ?? null,
  visualizationImages: detail.visualizationImages ?? [],
  vrPreviewImage: detail.vrPreviewImage || null,
  vrExperienceUrl: detail.vrExperienceUrl || null,
  videoThumbnail: detail.videoThumbnail || null,
  videoUrl: detail.videoUrl || null,
  stageCopy: detail.stageCopy,
})

export const signatureProject = project({
  id: 'signature-residence', number: '01', title: 'The Signature Residence',
  label: 'Featured work', featured: true, image: images['signature-living'],
  alt: 'Illustrative cream living room with a garden view, walnut finishes and a marble coffee table',
  description: 'A refined living space imagined around comfort, connection and everyday elegance. Warm natural tones, considered proportions and generous daylight shape the study.',
  detail: {
    category: 'Residential interior concept',
    projectInfo: { 'Project type': 'Illustrative residential concept', 'Spaces shown': 'Living · Dining · Bedroom' },
    heroImage: media('hero-living', 'Illustrative cream living and dining interior with garden light and walnut columns'),
    threeDImages: [
      media('signature-living', 'Illustrative living-room spatial perspective with sculptural stone table', 'Living perspective', 'Volume, seating scale and material balance'),
      media('harmony-kitchen', 'Illustrative kitchen and dining spatial perspective in timber and stone', 'Kitchen perspective', 'Joinery rhythm and kitchen-to-dining flow'),
      media('serenity-bedroom', 'Illustrative bedroom spatial perspective with upholstered bed', 'Bedroom perspective', 'Private-room proportions and furnishing'),
      media('urban-kitchen', 'Illustrative open-plan kitchen and dining camera view', 'Open-plan perspective', 'An alternate view of connected spaces'),
    ],
    visualizationImages: [
      media('verdant-living', 'Illustrative daylight-rich final living-room visualization', 'Daylight and atmosphere', 'A polished view of natural light and soft materials'),
      media('hero-living', 'Illustrative wide final interior visualization with warm ambient light', 'Material and mood', 'A composed view of texture, light and spatial character'),
    ],
    vrPreviewImage: media('verdant-living', 'Illustrative garden-facing interior preview for a future VR experience'),
    videoThumbnail: media('urban-kitchen', 'Illustrative open-plan kitchen and living interior for a future project video'),
    stageCopy: {
      twoD: 'An illustrative planning study explores a balanced flow between living, dining and quieter private spaces.',
      threeD: 'Spatial views translate the planning idea into volume, material and light, giving the concept a more tangible sense of place.',
      visualization: 'Carefully composed interior views convey the warmth, texture and atmosphere of the proposed design direction.',
      vr: 'An immersive walkthrough can bring scale and movement into focus once an approved VR experience is available.',
      video: 'A project film can tell the complete story when approved footage is ready to share.',
    },
  },
})

export const selectedProjects = [
  project({ id: 'harmony-home', number: '02', title: 'The Harmony Home', label: 'Residential interior', image: images['harmony-kitchen'],
    alt: 'Illustrative walnut kitchen and dining space opening toward a green landscape',
    description: 'A study in balance: a generous kitchen, natural light and warm materials that bring people together.',
    detail: { category: 'Residential interior concept', projectInfo: { 'Project type': 'Illustrative residential concept', 'Spaces shown': 'Kitchen · Dining · Living' }, heroImage: media('harmony-kitchen', 'Illustrative walnut kitchen and dining interior'), threeDImages: [media('urban-kitchen', 'Illustrative open-plan kitchen spatial view', 'Open-plan perspective'), media('harmony-kitchen', 'Illustrative kitchen and dining spatial view', 'Kitchen perspective')], visualizationImages: [media('signature-living', 'Illustrative cream living interior', 'Living atmosphere'), media('serenity-bedroom', 'Illustrative warm bedroom interior', 'Bedroom atmosphere')], vrPreviewImage: media('verdant-living', 'Illustrative living space preview for a future VR experience'), videoThumbnail: media('hero-living', 'Illustrative living and dining interior for a future project video'), stageCopy: { twoD: 'The planning study considers how kitchen, dining and living areas can connect naturally.', threeD: 'Warm timber volumes and carefully placed furniture give the shared spaces definition.', visualization: 'Interior views explore daylight, stone and wood as a calm material language.', vr: 'A walk-through can test flow and scale once an approved VR experience is supplied.', video: 'An approved project film will complete this design story when available.' } } }),
  project({ id: 'serenity-villa', number: '03', title: 'The Serenity Villa', label: 'Luxury residence', image: images['serenity-bedroom'],
    alt: 'Illustrative bedroom with walnut paneling, upholstered bed and garden light',
    description: 'An imagined retreat shaped by gentle light, quiet material contrast and a sense of ease.',
    detail: { category: 'Residential retreat concept', projectInfo: { 'Project type': 'Illustrative residential concept', 'Spaces shown': 'Bedroom · Living' }, heroImage: media('serenity-bedroom', 'Illustrative bedroom retreat with walnut walls'), threeDImages: [media('serenity-bedroom', 'Illustrative bedroom spatial study', 'Bedroom perspective'), media('signature-living', 'Illustrative living space spatial study', 'Living perspective')], visualizationImages: [media('verdant-living', 'Illustrative bright living space', 'Daylight atmosphere'), media('harmony-kitchen', 'Illustrative dining and kitchen space', 'Dining atmosphere')], vrPreviewImage: media('hero-living', 'Illustrative interior preview for a future VR experience'), videoThumbnail: media('urban-kitchen', 'Illustrative interior for a future project film'), stageCopy: { twoD: 'The planning study considers restful private areas and easy movement through the home.', threeD: 'Three-dimensional views explore soft boundaries, generous proportions and natural light.', visualization: 'Visual studies focus on a quiet, layered palette and a feeling of retreat.', vr: 'An approved immersive walkthrough will make the imagined space easier to experience.', video: 'The project story can be shown in motion when approved footage is supplied.' } } }),
  project({ id: 'urban-retreat', number: '04', title: 'The Urban Retreat', label: 'Modern living space', image: images['urban-kitchen'],
    alt: 'Illustrative dark walnut kitchen flowing into a warm living area',
    description: 'An open-plan concept with clean lines, warm timber and room to move between cooking and living.',
    detail: { category: 'Contemporary interior concept', projectInfo: { 'Project type': 'Illustrative residential concept', 'Spaces shown': 'Kitchen · Living · Dining' }, heroImage: media('urban-kitchen', 'Illustrative open-plan kitchen and living area'), threeDImages: [media('harmony-kitchen', 'Illustrative kitchen and dining spatial study')], visualizationImages: [media('hero-living', 'Illustrative bright living interior'), media('serenity-bedroom', 'Illustrative bedroom interior')], vrPreviewImage: media('signature-living', 'Illustrative living room preview for a future VR experience'), videoThumbnail: media('verdant-living', 'Illustrative bright interior for a future project film'), stageCopy: { twoD: 'An illustrative plan tests the relationship between cooking, gathering and retreat.', threeD: 'Spatial views examine the open-plan rhythm and the scale of built-in elements.', visualization: 'Visual studies look at warm timber, dark stone and a natural outlook.', vr: 'A future immersive walkthrough can clarify the open-plan experience.', video: 'Approved project footage will bring the complete concept into motion.' } } }),
  project({ id: 'verdant-home', number: '05', title: 'The Verdant Home', label: 'Residential interior', image: images['verdant-living'],
    alt: 'Illustrative bright living space with ivory seating, a low stone table and garden glazing',
    description: 'A nature-facing living study where soft upholstery, light oak and an open outlook create a calm atmosphere.',
    detail: { category: 'Nature-facing interior concept', projectInfo: { 'Project type': 'Illustrative residential concept', 'Spaces shown': 'Living · Dining · Bedroom' }, heroImage: media('verdant-living', 'Illustrative garden-facing living interior'), threeDImages: [media('hero-living', 'Illustrative living and dining spatial view')], visualizationImages: [media('serenity-bedroom', 'Illustrative warm bedroom interior'), media('harmony-kitchen', 'Illustrative kitchen and dining interior')], vrPreviewImage: media('signature-living', 'Illustrative living room preview for a future VR experience'), videoThumbnail: media('urban-kitchen', 'Illustrative interior for a future project film'), stageCopy: { twoD: 'The illustrative layout balances shared spaces with views toward greenery.', threeD: 'Three-dimensional studies explore the transition from open living to more intimate areas.', visualization: 'Visualizations test soft upholstery, warm timber and daylight across the home.', vr: 'An approved VR experience can make the nature-facing layout more tangible.', video: 'An approved film can share the journey behind the design when available.' } } }),
]

export const projectById = Object.fromEntries([signatureProject, ...selectedProjects].map(item => [item.id, item]))

export const projectsPage = {
  hero: {
    eyebrow: 'Our projects', title: 'Spaces shaped around people.',
    introduction: 'A collection of interior spaces thoughtfully developed around comfort, functionality, character and the way people live.',
    image: images['hero-living'],
    alt: 'Illustrative garden-facing living and dining space with cream sofas and warm walnut details',
  },
  selectedHeading: 'More spaces. More stories.',
  evidenceNote: 'Illustrative design studies · Project photography and records to be confirmed',
  closing: {
    eyebrow: 'Let’s create something', title: 'Your space deserves its own story.',
    description: 'Have a space in mind? Let’s explore what it could become.',
  },
  menu: [
    ['About Tejes', `${routePaths.tejes.home}#tejes-about`],
    ['Our Approach', `${routePaths.tejes.home}#tejes-approach`],
    ['Services', routePaths.tejes.interiorDesign],
    ['Projects', routePaths.tejes.projects],
    ['Design Development', routePaths.tejes.design3d],
    ['Contact', routePaths.tejes.contact],
  ],
}
