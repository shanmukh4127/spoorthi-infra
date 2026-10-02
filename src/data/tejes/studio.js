import { routePaths } from '../routePaths.js'

export const tejesContactEmail = 'aarambh634@gmail.com'
export const tejesConceptMedia = Object.freeze({ src: '/assets/spoorthi/spatial.webp', alt: 'AI-generated interior concept with a pale stone doorway, timber ceiling and garden-facing living room.', width: 1536, height: 1024, caption: 'AI-generated interior concept / Illustrative study' })

export const tejesConceptStudies = Object.freeze([
  { id: 'living', number: '01', title: 'A room for everyday living', category: 'Living', description: 'An open seating arrangement and garden-facing windows connect comfort, circulation and daylight.', position: '50% 65%', focalX: 53, focalY: 64 },
  { id: 'material', number: '02', title: 'Warmth in the material palette', category: 'Materials', description: 'Timber, pale stone and soft fabrics bring texture and a quiet sense of continuity to the interior.', position: '75% 45%', focalX: 72, focalY: 44 },
  { id: 'space', number: '03', title: 'A considered transition', category: 'Space', description: 'A framed entrance creates a clear transition while preserving the view through to the living area and garden.', position: '30% 50%', focalX: 50, focalY: 45 },
])

export const tejesServicePages = Object.freeze({
  interiors: {
    eyebrow: 'Tejes Interiors / Interior design', title: 'Designed around your life.', description: 'Bring the way you live into the design of your space. Layout, storage, materials and lighting work together to make each room feel considered.',
    heading: 'A place for every part of your day.', supporting: 'Discuss one room, an existing home or a complete interior. Your brief shapes the approach and the scope.',
    items: [
      ['Space planning', 'Review the room dimensions, furniture arrangement and everyday movement before refining the details.'],
      ['Kitchen & storage', 'Consider work zones, appliance positions and practical storage in relation to your routines.'],
      ['Material & finishes', 'Develop a palette of surfaces, textures and colours that suits the atmosphere and use of the space.'],
      ['Lighting & detail', 'Connect daylight, task lighting and individual details with the experience of the room.'],
    ],
    secondLink: { label: 'Explore design & 3D', path: routePaths.tejes.design3d },
  },
  development: {
    eyebrow: 'Tejes Interiors / Design & 3D', title: 'See your ideas take shape.', description: 'Turn a brief into a clear spatial direction. Drawings and visual studies help connect the layout, proportions, materials and experience of an interior.',
    heading: 'From a floor plan to a shared picture.', supporting: 'Use each view to answer a different question about the space. The drawings and visualizations needed are agreed around your project brief.',
    items: [
      ['01 / Understand the plan', 'Read the layout, openings and relationship between rooms. Make circulation and furniture placement easier to discuss.'],
      ['02 / Develop the form', 'Consider volume, height and the arrangement of individual elements in three dimensions.'],
      ['03 / Refine the atmosphere', 'Bring materials and light together in a visual study to compare ideas and refine the direction.'],
      ['04 / Explore the details', 'Look closer at a concept interior through our interactive browser explorer. Project-specific immersive tours begin with a prepared model.'],
    ],
    secondLink: { label: 'Explore the spatial concept', path: routePaths.tejes.vr },
  },
})

export const tejesFaqs = Object.freeze([
  { question: 'What should I share first?', answer: 'Start with the location, rooms involved, approximate area and your priorities. Plans and reference images are helpful when available.' },
  { question: 'Can we begin with one room?', answer: 'Share the room and the changes you have in mind. The scope of the design conversation can be shaped around your brief.' },
  { question: 'How do I discuss the budget?', answer: 'Include an approximate budget and preferred timeline in your enquiry so the next conversation can focus on a realistic scope.' },
])
