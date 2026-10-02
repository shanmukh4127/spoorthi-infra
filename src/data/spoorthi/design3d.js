import { routePaths } from '../routePaths.js'

const render = { src: '/assets/spoorthi/architecture.webp', alt: 'AI-generated architectural concept of a two-storey concrete and timber residence in warm daylight.', isDemo: true, aspect: 'wide', objectPosition: 'center', width: 1536, height: 1024 }
export const spoorthiDesign3d = Object.freeze({
  intro: { eyebrow: 'Spoorthi Infra / Design & visualization', title: 'Design / 3D', description: 'From a line on paper to a space you can understand. See how layout, form and materials come together before the next decision.', notice: 'Concept studies', note: 'Illustrative drawings and an AI-generated render show the design process. These are not construction drawings or completed client work.' },
  development: { eyebrow: 'From lines → to space', title: 'One idea. Three perspectives.', stages: [
    { id: 'plan', number: '01', label: '2D Plan', description: 'Read layout, circulation, and the relationships between spaces.', media: null },
    { id: 'model', number: '02', label: '3D Model', description: 'Explore volume, proportion, and how individual planes meet.', media: null },
    { id: 'perspective', number: '03', label: 'Visualization', description: 'Bring form, material, and light into a shared view.', media: render },
  ], caption: 'Independent concept studies / The drawings and render illustrate different approaches.' },
  visualization: { eyebrow: '02 / Design development', title: 'See the possibilities.', description: 'An architectural view brings proportions, materials and light into the same conversation. Use it to compare ideas, understand the spaces and refine the direction of the design.', caption: 'AI-generated architectural concept', primary: render, secondary: null },
  workflow: { eyebrow: '03 / Design layers', title: 'Every layer adds understanding.', note: 'Your project brief determines the drawings, models and visualizations needed.', steps: [
    { id: 'plan', number: '01', title: 'Plan', points: ['Layout', 'Circulation', 'Proportion'] },
    { id: 'model', number: '02', title: 'Form', points: ['Volume', 'Structure', 'Spatial relationships'] },
    { id: 'material', number: '03', title: 'Material', points: ['Surface', 'Light', 'Atmosphere'] },
    { id: 'perspective', number: '04', title: 'Visualization', points: ['Communicate', 'Refine', 'Understand'], media: render },
  ] },
  intent: { eyebrow: '04 / Thoughtful decisions', title: 'Better spaces begin with a clear idea.', description: 'Connect the plan, the form and the experience of the space. Bring your reference images, site requirements and priorities, and begin a conversation about the direction of your project.', supporting: 'Line / Plan / Form / Space / Experience', media: { ...render, objectPosition: '25% center' } },
  continuation: { links: [ { label: 'Explore VR experience', path: routePaths.spoorthi.vr }, { label: 'Discuss a project', path: routePaths.spoorthi.contact }, { label: 'Explore projects', path: routePaths.spoorthi.projects } ] },
})
