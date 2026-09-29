import interior from '../../assets/vr-demo/spatial-portal.png'
import { routePaths } from '../routePaths.js'

// Phase 8: replace the demo media and approved copy here, without changing the composition.
const spatialMedia = {
  src: interior,
  alt: 'AI-generated concept: a timber-framed doorway opens onto a sunlit living space and garden. Not a real project.',
  width: 1536, height: 1024, objectPosition: 'center', isDemo: true,
}
export const spoorthiVr = Object.freeze({
  intro: { eyebrow: 'Spoorthi Infra / 04', title: 'VR Experience', description: 'Step beyond the drawing. Experience the space.' },
  portal: { title: 'From drawing to spatial perspective', media: spatialMedia, caption: 'Illustrative portal / AI-generated interior concept', note: 'A conceptual presentation, not a live VR experience or a completed project.' },
  experience: { eyebrow: '03 / Spatial experience / Conceptual', title: 'Experience the space', statements: ['See the relationships.', 'Understand the proportions.', 'Explore the design intent.'], media: spatialMedia },
  sequence: { title: 'From design to immersion', steps: [
    { id: 'plan', number: '01', title: 'Design', description: 'Ideas take shape through plans and spatial relationships.' },
    { id: 'model', number: '02', title: 'Model', description: 'Volume and proportion give the design a spatial form.' },
    { id: 'perspective', number: '03', title: 'Immersion', description: 'A spatial perspective helps communicate the intended experience.' },
  ] },
  closing: { eyebrow: '05 / Beyond the drawing', title: 'Understand the space before you enter it.', description: 'Explore how design can be experienced beyond the screen.', links: [
    { label: 'Explore Design / 3D', path: routePaths.spoorthi.design3d },
    { label: 'Discuss a project', path: routePaths.spoorthi.contact },
  ] },
})
