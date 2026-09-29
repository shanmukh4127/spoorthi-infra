import { routePaths } from '../routePaths.js'
import demoRender from '../../assets/design-demo/architectural-concept.png'

// Phase 8: replace these demo media records with approved assets and matching descriptions.
const render = { src: demoRender, alt: 'AI-generated demonstration of a two-storey concrete and timber residence in warm daylight; not a real project.', isDemo: true, aspect: 'wide', objectPosition: 'center', width: 1536, height: 1024 }
export const spoorthiDesign3d = Object.freeze({
  intro: { eyebrow: 'Spoorthi Infra / 03', title: 'Design / 3D', description: 'From a line on paper to a space you can understand.', notice: 'Illustrative studies / Not real project material', note: 'Concept drawings and an AI-generated render for demonstration only. Not approved plans or completed work.' },
  development: { eyebrow: 'From lines → to space', title: 'One idea. Three perspectives.', stages: [
    { id: 'plan', number: '01', label: '2D Plan', description: 'Read layout, circulation, and the relationships between spaces.', media: null },
    { id: 'model', number: '02', label: '3D Model', description: 'Explore volume, proportion, and how individual planes meet.', media: null },
    { id: 'perspective', number: '03', label: 'Visualization', description: 'Bring form, material, and light into a shared view.', media: render },
  ], caption: 'Conceptual sequence / Independent illustrative studies, not coordinated construction drawings.' },
  visualization: { eyebrow: '03 / Design development', title: 'Architectural Visualization', description: 'A spatial view helps communicate proportion, material, and design intent. Read the relationships between spaces before discussing how the design develops.', caption: 'AI-generated concept / Not a real project render', primary: render, secondary: null },
  workflow: { eyebrow: '04 / Design layers', title: 'Every layer adds understanding.', note: 'A way to read a design, rather than a fixed scope of service.', steps: [
    { id: 'plan', number: '01', title: 'Plan', points: ['Layout', 'Circulation', 'Proportion'] },
    { id: 'model', number: '02', title: 'Form', points: ['Volume', 'Structure', 'Spatial relationships'] },
    { id: 'material', number: '03', title: 'Material', points: ['Surface', 'Light', 'Atmosphere'] },
    { id: 'perspective', number: '04', title: 'Visualization', points: ['Communicate', 'Refine', 'Understand'], media: render },
  ] },
  intent: { eyebrow: '05 / The final result', title: 'Better spaces. Thoughtfully designed.', description: 'A clear design intent connects the plan, the form, and the experience of a space. Together, these views create a useful starting point for conversation.', supporting: 'Line / Plan / Form / Space / Experience', media: { ...render, objectPosition: '25% center' } },
  continuation: { links: [ { label: 'Explore VR experience', path: routePaths.spoorthi.vr }, { label: 'Discuss a project', path: routePaths.spoorthi.contact }, { label: 'Explore projects', path: routePaths.spoorthi.projects } ] },
})
