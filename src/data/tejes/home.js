import { routePaths } from '../routePaths.js'

export const tejesHomeSections = Object.freeze([
  {
    id: 'hero',
    label: 'Hero',
    title: 'Interior spaces shaped with clarity, material, and light',
    description: 'A spatial design practice focused on thoughtful planning, refined interiors, and the relationship between a concept and the finished space.',
  },
  {
    id: 'about',
    label: 'About',
    eyebrow: '01 / ABOUT TEJES',
    title: 'Interior spaces shaped with clarity, material, and light',
    description: 'A spatial design practice focused on thoughtful planning, refined interiors, and the relationship between a concept and the finished space.',
    supporting: 'SPATIAL PLANNING  •  MATERIAL DIRECTION  •  FINAL SPACE',
  },
  {
    id: 'services',
    label: 'Services',
    eyebrow: '02 / SERVICES',
    title: 'A considered approach to interior space',
    description: 'Explore the service areas currently defined for Tejes Interiors.',
  },
  {
    id: '2d-design',
    label: '2D Design',
    eyebrow: '03 / 2D DESIGN',
    title: 'Space begins with a considered plan',
    description: 'Spatial layouts and interior planning establish proportion, composition, and the direction of the finished space.',
    supporting: 'SPATIAL PLANNING  •  PROPORTION  •  DESIGN INTENT',
    cta: { label: 'Continue to Design / 3D', path: routePaths.tejes.design3d },
  },
  {
    id: '3d-design',
    label: '3D Design',
    eyebrow: '04 / 3D DESIGN',
    title: 'From layout to lived spatial understanding',
    description: 'Three-dimensional visualization develops the interior concept through space, proportion, material, and light.',
    supporting: 'VISUALIZATION  •  PROPORTION  •  MATERIAL DIRECTION',
    cta: { label: 'Explore Design / 3D', path: routePaths.tejes.design3d },
  },
  {
    id: 'final-output',
    label: 'Final Output',
    eyebrow: '05 / FINAL OUTPUT',
    title: 'Where a considered concept becomes a finished space',
    description: 'The final output stage connects spatial planning and visualization to the interior result when real project evidence is available.',
    supporting: 'CONCEPT  •  MATERIAL REALIZATION  •  FINISHED SPACE',
  },
  {
    id: 'vr-experience',
    label: 'VR Experience',
    eyebrow: '06 / VR EXPERIENCE',
    title: 'Experience the space beyond the image',
    description: 'An immersive presentation layer can help clarify proportion, atmosphere, and spatial relationships, when a real experience is available.',
    supporting: 'PROPORTION  •  ATMOSPHERE  •  SPATIAL RELATIONSHIP',
    cta: { label: 'Explore VR Experience', path: routePaths.tejes.vr },
  },
  {
    id: 'projects',
    label: 'Projects',
    eyebrow: '07 / PROJECTS',
    title: 'A considered selection of finished work',
    description: 'A curated preview of verified Tejes Interiors work will appear here when real project material is available.',
  },
  {
    id: 'process',
    label: 'Process',
    eyebrow: '08 / PROCESS',
    title: 'A considered progression through the work',
    description: 'The process framework follows the stages currently defined for Tejes Interiors.',
  },
  {
    id: 'why-tejes',
    label: 'Why Tejes',
    eyebrow: '09 / WHY TEJES',
    title: 'A considered approach to shaping space',
    description: 'Each design decision is considered in relation to the space, its materials, and the experience the brief is asking for.',
  },
  {
    id: 'cta',
    label: 'CTA',
    eyebrow: '10 / BEGIN A CONVERSATION',
    title: 'Give the space a considered beginning',
    description: 'When you are ready to discuss an interior or spatial design brief, begin with a conversation about the space and its possibilities.',
    primary: { label: 'Discuss your space' },
    secondary: { label: 'Explore projects', path: routePaths.tejes.projects },
  },
])

export const tejesWhyPrinciples = Object.freeze([
  {
    id: 'spatial-planning',
    title: 'Thoughtful spatial planning',
    description: 'Layout, proportion, and movement are considered together so the space can feel clear and intentional.',
  },
  {
    id: 'material-awareness',
    title: 'Material awareness',
    description: 'Material direction is part of the design conversation, with texture, tone, and use kept in view.',
  },
  {
    id: 'visual-harmony',
    title: 'Visual harmony',
    description: 'Colour, light, form, and detail are brought into a coherent spatial language.',
  },
  {
    id: 'personalized-thinking',
    title: 'Personalized design thinking',
    description: 'The design starts from the character of the space and the priorities expressed in the brief.',
  },
])
