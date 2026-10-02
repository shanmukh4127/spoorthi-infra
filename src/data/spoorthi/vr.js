import { routePaths } from '../routePaths.js'

const spatialMedia = {
  src: '/assets/spoorthi/spatial.webp',
  alt: 'AI-generated concept: a timber-framed doorway opens onto a sunlit living space and garden. Not a real project.',
  width: 1536, height: 1024, objectPosition: 'center', isDemo: true,
}
export const spoorthiVr = Object.freeze({
  intro: { eyebrow: 'Spoorthi Infra / Spatial experience', title: 'A new perspective.', description: 'Look closer at the spaces you imagine. Explore an interior concept, from its materials to its connection with the outdoors.' },
  portal: {
    title: 'Explore an interior concept',
    media: spatialMedia,
    caption: 'AI-generated interior concept / Interactive image study',
    note: 'Browser image exploration. A project-specific 360° or headset tour requires a prepared model.',
    viewpoints: [
      { id: 'overview', title: 'The whole picture', label: '01 / Spatial composition', x: 50, y: 50, zoom: 1, description: 'A framed entrance leads into a garden-facing living room. Notice how the doorway, ceiling and floor create a continuous visual rhythm.' },
      { id: 'living', title: 'Living & proportion', label: '02 / Room relationships', x: 53, y: 64, zoom: 1.65, description: 'Furniture placement makes the central living area easy to read. Open sightlines connect the entrance, seating and garden without breaking the sense of enclosure.' },
      { id: 'material', title: 'Material & texture', label: '03 / A restrained palette', x: 72, y: 44, zoom: 1.65, description: 'Pale stone and warm timber frame the doorway. Repeating these materials across the floor and ceiling brings the individual surfaces into one calm composition.' },
      { id: 'garden', title: 'Light & landscape', label: '04 / Inside meets outside', x: 52, y: 44, zoom: 1.8, description: 'Large garden-facing windows draw daylight into the living space. The view beyond the glazing adds depth and helps the room feel connected to its surroundings.' },
    ],
  },
  experience: { eyebrow: '02 / Spatial thinking', title: 'See it before you build it.', statements: ['Consider the relationships.', 'Read the proportions.', 'Refine the design together.'], media: spatialMedia },
  sequence: { title: 'From design to immersion', steps: [
    { id: 'plan', number: '01', title: 'Design', description: 'Ideas take shape through plans and spatial relationships.' },
    { id: 'model', number: '02', title: 'Model', description: 'Volume and proportion give the design a spatial form.' },
    { id: 'perspective', number: '03', title: 'Immersion', description: 'A spatial perspective helps communicate the intended experience.' },
  ] },
  closing: { eyebrow: '04 / Beyond the drawing', title: 'Your space. A clearer picture.', description: 'Bring your plans and ideas to a conversation about visualization and the right presentation for your project.', links: [
    { label: 'Explore Design / 3D', path: routePaths.spoorthi.design3d },
    { label: 'Discuss a project', path: routePaths.spoorthi.contact },
  ] },
})
