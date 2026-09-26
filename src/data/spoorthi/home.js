import { routePaths } from '../routePaths.js'

export const spoorthiHomeSections = Object.freeze([
  {
    id: 'hero',
    label: 'Hero',
    title: 'Construction, infrastructure, and engineering with structural clarity',
    description: 'A technical design-to-execution practice for work that begins with clear planning and moves toward a considered built outcome.',
  },
  {
    id: 'about',
    label: 'About',
    eyebrow: '01 / ABOUT SPOORTHI',
    title: 'Construction, infrastructure, and engineering with structural clarity',
    description: 'A technical design-to-execution practice for work that begins with clear planning and moves toward a considered built outcome.',
    supporting: 'PLANNING  •  VISUALIZATION  •  FINAL OUTPUT',
  },
  {
    id: 'services',
    label: 'Services',
    eyebrow: '02 / SERVICES',
    title: 'A structured view of the built environment',
    description: 'Explore the service areas currently defined for Spoorthi Infra.',
  },
  {
    id: '2d-design',
    label: '2D Design',
    eyebrow: '03 / 2D DESIGN',
    title: 'Plans that make intent legible',
    description: 'Technical drawings, layouts, and planning structure the next stage of the work.',
    supporting: 'TECHNICAL REPRESENTATION  •  LAYOUT  •  DESIGN INTENT',
    cta: { label: 'Continue to Design / 3D', path: routePaths.spoorthi.design3d },
  },
  {
    id: '3d-design',
    label: '3D Design',
    eyebrow: '04 / 3D DESIGN',
    title: 'A clearer view of the proposed form',
    description: 'Three-dimensional visualization develops the plan into a more understandable view of space, structure, and design intent.',
    supporting: 'VISUALIZATION  •  FORM  •  SPATIAL UNDERSTANDING',
    cta: { label: 'Explore Design / 3D', path: routePaths.spoorthi.design3d },
  },
  {
    id: 'final-output',
    label: 'Final Output',
    eyebrow: '05 / FINAL OUTPUT',
    title: 'Where design intent meets the built result',
    description: 'The final output stage connects planning and visualization to the physical result when real project evidence is available.',
    supporting: 'DESIGN INTENT  •  EXECUTION  •  BUILT RESULT',
  },
  {
    id: 'vr-experience',
    label: 'VR Experience',
    eyebrow: '06 / VR EXPERIENCE',
    title: 'A more spatial understanding of the design',
    description: 'An immersive presentation layer can help explore architectural intent beyond drawings and renders, when a real experience is available.',
    supporting: 'SPATIAL EXPLORATION  •  DESIGN CONTEXT',
    cta: { label: 'Explore VR Experience', path: routePaths.spoorthi.vr },
  },
  {
    id: 'projects',
    label: 'Projects',
    eyebrow: '07 / PROJECTS',
    title: 'Selected work, when the record is ready to show it',
    description: 'A curated preview of verified Spoorthi Infra work will appear here when real project material is available.',
  },
  {
    id: 'process',
    label: 'Process',
    eyebrow: '08 / PROCESS',
    title: 'A clear progression from plan to outcome',
    description: 'The process framework follows the stages currently defined for Spoorthi Infra.',
  },
  {
    id: 'why-spoorthi',
    label: 'Why Spoorthi',
    eyebrow: '09 / WHY SPOORTHI',
    title: 'Clarity at every stage of the built environment',
    description: 'A structured way of thinking keeps planning, visualization, and the intended result connected throughout the design journey.',
  },
  {
    id: 'cta',
    label: 'CTA',
    eyebrow: '10 / START A CONVERSATION',
    title: 'Bring the next project into clearer view',
    description: 'When you are ready to discuss a construction, infrastructure, or design requirement, start with a focused conversation.',
    primary: { label: 'Discuss a project' },
    secondary: { label: 'Explore projects', path: routePaths.spoorthi.projects },
  },
])

export const spoorthiWhyPrinciples = Object.freeze([
  {
    id: 'structured-thinking',
    title: 'Structured thinking',
    description: 'Questions, constraints, and priorities are made visible before the work moves forward.',
  },
  {
    id: 'design-clarity',
    title: 'Design clarity',
    description: 'Plans and visual references connect technical intent with a shared understanding of the outcome.',
  },
  {
    id: 'technical-precision',
    title: 'Technical precision',
    description: 'Proportion, detail, and clear information support decisions made with care.',
  },
  {
    id: 'integrated-perspective',
    title: 'Integrated perspective',
    description: '2D planning, 3D visualization, final output, and VR remain connected as one design journey.',
  },
])
