import { routePaths } from '../routePaths.js'
import homeAssets from './homeAssets.json'

const asset = name => homeAssets[name]
// Homepage-only reference content. Unverified client facts remain editable.
export const tejesHomeStructure = {
  media: {
    hero: asset('hero-living'), about: asset('about-interior'),
    founder: asset('founder-reference'), achievements: asset('achievement-still-life'),
    philosophy: asset('philosophy-light'), process: asset('process-interior'),
    quality: asset('quality-interior'), project: asset('featured-residence'),
    final: asset('final-living'), contact: asset('contact-detail'),
  },
  founder: { name: null, role: 'Founder / Owner', description: 'The founder’s story will be introduced here once approved.' },
  founderPrinciples: [
    ['Vision', 'To create spaces that inspire and add value to people’s lives.'],
    ['Philosophy', 'Design with purpose. Build with integrity.'],
    ['Journey', 'A continuous pursuit of better spaces, better living.'],
  ],
  capabilities: ['Interior design', 'Space planning', '3D visualization', 'Materials & finishes', 'Execution'],
  story: [['Beginning', 'The spark of an idea.'], ['Vision', 'Turning ideas into spaces.'], ['Approach', 'Design with purpose.'], ['Future', 'Growing, together.']],
  achievements: ['Projects completed', 'Spaces designed', 'Years of practice', 'Design categories', 'Awards & recognition'].map(label => ({ label, value: null })),
  philosophy: ['Space', 'Function', 'Material', 'Light', 'Detail', 'Comfort'],
  rooms: [
    ['Living Spaces', 'category-living', 'Refined cream living room with upholstered seating and marble tables'],
    ['Bedrooms', 'category-bedroom', 'Neutral bedroom with an upholstered headboard and soft daylight'],
    ['Kitchens', 'category-kitchen', 'Contemporary timber kitchen with a cantilevered central island'],
    ['Dining', 'category-dining', 'Light filled dining and kitchen interior'],
    ['Bathrooms', 'category-bathroom', 'Warm bathroom with timber detailing and natural light'],
    ['Home Offices', 'category-office', 'Quiet home workspace with a timber desk and cream seating'],
    ['Entertainment Spaces', 'category-entertainment', 'Neutral media lounge with integrated television and fireplace'],
    ['Luxury Interiors', 'category-luxury', 'Double-height residential lounge with tall curtains and elegant seating'],
    ['Contemporary Interiors', 'category-contemporary', 'Contemporary open-plan interior with leather seating and timber joinery'],
    ['Custom Spaces', 'category-custom', 'Bespoke dressing room with integrated vanity, mirrors and dark cabinetry'],
  ].map(([title, image, alt]) => ({ title, image: asset(image), alt })),
  services: ['Consultation', 'Space Planning', 'Interior Design', '2D Design', '3D Development', 'Visualization', 'Materials & Finishes', 'Execution'],
  process: [['Understand', 'Your needs'], ['Plan', 'Space & flow'], ['Design', 'Concept & style'], ['Develop', '2D, 3D & visuals'], ['Realize', 'The final space']],
  quality: [
    ['Material quality', 'The right materials for lasting spaces.'],
    ['Craftsmanship', 'Skilled hands, refined finishes.'],
    ['Detail control', 'Thoughtful details, better living.'],
    ['Spatial precision', 'Balanced spaces, perfect flow.'],
    ['Execution quality', 'From plan to the finished space.'],
    ['Finishing', 'Beautiful, durable, long-lasting.'],
  ],
  // The supplied image is an illustrative design study, not a verified client project.
  featured: { title: 'Modern Living Residence', type: 'Residential interior', description: 'A modern home design with clean lines, natural materials and a calm, elegant aesthetic.' },
  development: ['2D Design', '3D Development', 'Visualization', 'VR Experience'].map((title, i) => ({ title, image: asset(['development-plan', 'development-3d', 'development-visual', 'development-vr'][i]), path: i === 3 ? routePaths.tejes.vr : routePaths.tejes.design3d })),
  materials: ['Wood', 'Stone', 'Marble', 'Glass', 'Metal', 'Fabric', 'Lighting', 'Surface Finishes'].map((title, i) => ({ title, image: asset(['material-wood', 'material-stone', 'material-marble', 'material-glass', 'material-metal', 'material-fabric', 'material-lighting', 'material-surface'][i]) })),
  approach: ['Planning', 'Design', 'Materials', 'Coordination', 'Execution', 'Detail'],
  // Populate only with approved testimonials: { id, quote, author? }.
  reviews: [],
  reviewsEmptyState: 'Verified client feedback will appear here.',
  why: ['Personalized design', 'Function + beauty', 'Spatial thinking', 'Design development', 'Material consideration', 'Attention to detail', 'End-to-end thinking'],
  links: { projects: routePaths.tejes.projects, services: routePaths.tejes.interiorDesign, development: routePaths.tejes.design3d, contact: routePaths.tejes.contact },
}
