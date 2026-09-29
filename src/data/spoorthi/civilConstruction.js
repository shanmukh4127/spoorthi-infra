import { routePaths } from '../routePaths.js'

const placeholder = (label, aspect = 'landscape') => ({ label, aspect, src: null, alt: '', caption: 'Media placeholder / approved construction imagery to be added later.' })

export const civilConstruction = Object.freeze({
  intro: {
    eyebrow: 'Spoorthi Infra / 01',
    title: 'Civil Construction',
    statement: 'From drawing to physical form.',
    description: 'Civil construction is where design intent becomes physical form. Explore the relationship between structure, form, and space through a connected practice.',
    media: {
      src: '/assets/spoorthi/civil-construction-hero.png',
      alt: 'Modern concrete building under development with exposed structural columns, floor slabs, and architectural glazing.',
      caption: 'Architectural construction study / replaceable visual asset',
      aspect: 'wide',
      objectPosition: 'center',
      width: 1536,
      height: 1024,
    },
  },
  build: { eyebrow: '02 / The build', title: 'The build', description: 'Structure gives form a clear frame. Space gives that frame a purpose.', labels: ['Structure', 'Form', 'Space'], media: [placeholder('Structure / future asset', 'landscape'), placeholder('Built form / future asset', 'portrait')] },
  connections: { eyebrow: '03 / Connected practice', title: 'What civil construction connects', items: [
    { number: '01', title: 'Civil Construction', description: 'The physical framework for a considered space.' }, { number: '02', title: 'Infrastructure', description: 'The wider context that supports a built outcome.' }, { number: '03', title: 'Design', description: 'The intent, proportion, and spatial direction.' }, { number: '04', title: 'Final Output', description: 'The result that brings the idea into view.' },
  ] },
  transformation: { eyebrow: '04 / From drawing to built form', title: 'From drawing to built form', items: [
    { number: '01', title: '2D Design', description: 'Plans and layouts establish the starting point.', media: placeholder('2D drawing / future asset', 'landscape') }, { number: '02', title: '3D Development', description: 'Spatial studies make form and relationships easier to understand.', media: placeholder('3D development / future asset', 'square') }, { number: '03', title: 'Final Output', description: 'The physical result gives the design its presence.', media: placeholder('Final output / future asset', 'landscape') },
  ] },
  journey: { eyebrow: '05 / The construction journey', title: 'The construction journey', steps: [
    { number: '01', title: 'Plan', description: 'A clear starting point for the space.' }, { number: '02', title: 'Structure', description: 'A considered relationship between form and frame.' }, { number: '03', title: 'Build', description: 'The design moves toward physical expression.' }, { number: '04', title: 'Output', description: 'The intended result becomes visible.' },
  ] },
  gallery: { eyebrow: '06 / Built in detail', title: 'Built in detail', media: [placeholder('Detail / future asset', 'landscape'), placeholder('Material / future asset', 'square'), placeholder('Structure / future asset', 'portrait'), placeholder('Space / future asset', 'wide'), placeholder('Context / future asset', 'landscape')] },
  relationship: { eyebrow: '07 / Design + construction', title: 'Design + construction', description: 'A space begins as an idea. Construction gives that idea physical form.', media: placeholder('Design and construction / future asset', 'wide') },
  closing: { eyebrow: '08 / Continue the conversation', title: 'From idea to drawing to space.', links: [{ label: 'Explore projects', path: routePaths.spoorthi.projects }, { label: 'Design / 3D', path: routePaths.spoorthi.design3d }, { label: 'Start a conversation', path: routePaths.spoorthi.contact }] },
})
