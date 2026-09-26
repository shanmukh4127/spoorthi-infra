export const innerPageArchitecture = Object.freeze({
  service: ['Hero', 'ServiceOverview', 'Capabilities', 'Process', 'CtaSection'],
  projects: ['Hero', 'ProjectFilters', 'ProjectGrid', 'CtaSection'],
  experience: ['Hero', 'ExperienceOverview', 'ExperienceSteps', 'CtaSection'],
  contact: ['Hero', 'ContactDetails', 'InquiryForm', 'CtaSection'],
})

export const pageArchitecture = Object.freeze({
  spoorthi: {
    home: 'SpoorthiHomePage',
    inner: {
      'civil-construction': 'service', projects: 'projects', 'design-3d': 'service', vr: 'experience', contact: 'contact',
    },
  },
  tejes: {
    home: 'TejesHomePage',
    inner: {
      'interior-design': 'service', projects: 'projects', 'design-3d': 'service', vr: 'experience', contact: 'contact',
    },
  },
})
