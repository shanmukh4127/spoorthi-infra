import { createBrandConfig } from './brandConfig.js'
import { tejesTokens } from './tejesTokens.js'
import { routePaths } from '../data/routePaths.js'

export const tejesBrand = createBrandConfig({
  id: 'tejes',
  name: 'Tejes Interiors',
  shortDescription: '[Tejes short description]',
  industry: 'Interior Design / Spatial Design',
  routeBase: routePaths.tejes.home,
  logo: null,
  navigationKey: 'tejes',
  primaryCta: { label: 'Contact', path: routePaths.tejes.contact },
  secondaryCta: null,
  socialLinks: [],
  contact: null,
  themeId: 'tejes',
  tokens: tejesTokens,
  gateway: {
    descriptor: 'Interior Design · Spatial Design · Luxury',
    cta: 'Enter Tejes Interiors',
  },
  homeSections: [
    'hero',
    'about',
    'services',
    '2d-design',
    '3d-design',
    'final-output',
    'vr-experience',
    'projects',
    'process',
    'why-tejes',
    'cta',
    'footer',
  ],
  designPrinciples: [
    'elegant',
    'premium',
    'minimal',
    'luxury',
    'spatial',
    'sophisticated',
    'material-focused',
  ],
})
