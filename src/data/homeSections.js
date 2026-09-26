export const homeSectionOrder = Object.freeze({
  spoorthi: Object.freeze([
    'hero', 'about', 'services', '2d-design', '3d-design', 'final-output',
    'vr-experience', 'projects', 'process', 'why-spoorthi', 'cta', 'footer',
  ]),
  tejes: Object.freeze([
    'hero', 'about', 'services', '2d-design', '3d-design', 'final-output',
    'vr-experience', 'projects', 'process', 'why-tejes', 'cta', 'footer',
  ]),
})

export const homeSectionRegistry = Object.freeze({
  hero: { component: 'HeroSection', purpose: 'Primary brand introduction' },
  about: { component: 'AboutSection', purpose: 'Brand story and positioning' },
  services: { component: 'ServicesSection', purpose: 'Core service overview' },
  '2d-design': { component: 'Design2DSection', purpose: '2D design capability' },
  '3d-design': { component: 'Design3DSection', purpose: '3D design capability' },
  'final-output': { component: 'FinalOutputSection', purpose: 'From design to deliverable' },
  'vr-experience': { component: 'VrExperienceSection', purpose: 'Immersive experience offering' },
  projects: { component: 'ProjectsSection', purpose: 'Selected work preview' },
  process: { component: 'ProcessSection', purpose: 'Working process' },
  'why-spoorthi': { component: 'WhyChooseUsSection', purpose: 'Spoorthi differentiators' },
  'why-tejes': { component: 'WhyChooseUsSection', purpose: 'Tejes differentiators' },
  cta: { component: 'CTASection', purpose: 'Conversion and inquiry prompt' },
  footer: { component: 'Footer', purpose: 'Site footer' },
})
