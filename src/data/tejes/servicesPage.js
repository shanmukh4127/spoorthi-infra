import images from './servicesAssets.json'
import editorial from './projectsEditorialAssets.json'

const visual = (image, alt, focalPoint = '50% 50%') => ({ image: { ...image, focalPoint }, alt })

// Reference content only. Switch to confirmed only after the client approves the scope.
export const tejesServicesPage = {
  confirmed: false,
  hero: {
    label: 'Our services',
    title: ['Thoughtful', 'design. Timeless', 'spaces.'],
    introduction: 'A considered interior brings creativity, functionality and your own way of living together. Explore the possibilities for a space that feels comfortable, purposeful and timeless.',
    signature: ['Your Space', 'Our Expertise'],
    image: visual(images.hero, 'Illustrative sunset apartment living room with ivory seating, walnut walls and a city view', '50% 55%'),
    sideNote: ['Beautiful', 'spaces.', 'Better', 'living.'],
  },
  solutions: {
    label: 'Our services',
    heading: ['Comprehensive', 'interior solutions'],
    description: 'Every space has a story. Thoughtful planning, a coherent material palette and careful detail can bring that story to life.',
    notice: 'Provisional service categories · Scope awaiting client confirmation · Illustrative imagery',
    sideNote: ['Design', 'that', 'feels', 'like', 'you'],
  },
  services: [
    { id: 'interior-planning', number: '01', title: 'Interior Design & Space Planning', titleLines: ['Interior Design', '& Space Planning'], description: 'A planning direction that balances layout, aesthetics and everyday function.', image: visual(editorial['signature-living'], 'Illustrative living-room composition with soft seating and a stone coffee table') },
    { id: 'kitchens-wardrobes', number: '02', title: 'Modular Kitchens & Wardrobes', titleLines: ['Modular Kitchens', '& Wardrobes'], description: 'Ideas for practical storage, considered joinery and a coherent material palette.', image: visual(editorial['harmony-kitchen'], 'Illustrative walnut kitchen with a stone island and dining area') },
    { id: 'residential', number: '03', title: 'Residential Interiors', description: 'Home concepts shaped around personal routines, comfort and a sense of belonging.', image: visual(editorial['serenity-bedroom'], 'Illustrative refined bedroom with warm timber panels and natural light') },
    { id: 'commercial', number: '04', title: 'Commercial Spaces', description: 'Concept directions for workplaces, retail and hospitality with a clear spatial identity.', image: visual(images.commercial, 'Illustrative boutique hospitality lounge with meeting tables and upholstered seating') },
    { id: 'materials', number: '05', title: 'Materials & Finishes', description: 'An exploration of materials, textures and finishes that work together with purpose.', image: visual(images.materials, 'Illustrative board of timber, marble, linen and bronze interior samples') },
    { id: 'visualization', number: '06', title: '3D Visualization', description: 'Spatial views to explore proportions, materials and atmosphere before decisions are made.', image: visual(images.visualization, 'Illustrative tablet showing an interior visualization on a designer’s worktable') },
  ],
  process: {
    label: 'Our process', heading: ['From vision', 'to reality'],
    description: 'An illustrative journey from an initial idea to a considered space, with each stage shaped around the project brief.',
    notice: 'Illustrative process · Final workflow to be confirmed',
    image: visual(images.process, 'Illustrative designer reviewing a floor plan, interior visualization and material samples', '62% 55%'),
    signature: ['Better', 'Design', 'Brighter', 'Living'],
    stages: [
      { number: '01', title: 'Discover', description: 'Understand the space, needs, lifestyle and design priorities.' },
      { number: '02', title: 'Plan', description: 'Explore concepts, layouts and a clear direction for the space.' },
      { number: '03', title: 'Design', description: 'Refine drawings, spatial views and the material palette.' },
      { number: '04', title: 'Execute', description: 'Coordinate the agreed scope, details and sequence of work.' },
    ],
  },
  closing: {
    label: 'Ready to transform your space?',
    title: ['Let’s create', 'something beautiful', 'together'],
    description: 'Start a conversation about your space and explore the right scope for your project.',
    action: 'Get in touch', signature: ['Your Dream', 'Space Awaits'],
    image: visual(images.closing, 'Illustrative cinematic dining interior overlooking a city at dusk', '50% 56%'),
  },
}
