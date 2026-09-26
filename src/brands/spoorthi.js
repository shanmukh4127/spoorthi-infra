import { createBrandConfig } from './brandConfig.js'
import { spoorthiTokens } from './spoorthiTokens.js'
import { routePaths } from '../data/routePaths.js'

export const spoorthiBrand = createBrandConfig({
  id: 'spoorthi',
  name: 'Spoorthi Infra',
  shortDescription: '[Spoorthi short description]',
  industry: 'Construction / Civil Engineering / Infrastructure',
  routeBase: routePaths.spoorthi.home,
  logo: null,
  navigationKey: 'spoorthi',
  primaryCta: { label: 'Contact', path: routePaths.spoorthi.contact },
  secondaryCta: null,
  socialLinks: [],
  contact: null,
  themeId: 'spoorthi',
  tokens: spoorthiTokens,
  gateway: {
    descriptor: 'Construction · Infrastructure · Engineering',
    cta: 'Enter Spoorthi Infra',
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
    'why-spoorthi',
    'cta',
    'footer',
  ],
  designPrinciples: [
    'architectural',
    'engineering-focused',
    'technical',
    'structured',
    'premium',
    'grid-based',
    'architectural-line-details',
  ],
})
