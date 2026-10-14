import assets from './contactAssets.json'
import homeAssets from './homeAssets.json'

// Populate only after the client confirms the business information.
export const tejesContactDetails = {
  phone: null,
  email: null,
  address: null,
  hours: null,
  mapUrl: null,
  socialLinks: [],
}

export const contactPageMedia = {
  hero: { image: { ...assets.hero, focalPoint: '62% 50%' }, alt: 'Illustrative warm living interior with ivory seating, walnut panels and a landscape view' },
  detail: { image: { ...assets.detail, focalPoint: '57% 50%' }, alt: 'Illustrative walnut interior detail with a ceramic lamp and olive branches' },
  studio: { image: { ...assets.studio, focalPoint: '50% 55%' }, alt: 'Illustrative architectural entrance with travertine walls and planting; studio photography pending' },
  closing: { image: { ...homeAssets['contact-detail'], focalPoint: '50% 78%' }, alt: 'Refined dining interior with sculptural lighting and upholstered chairs' },
}

export const projectTypes = ['New interior', 'Renovation', 'Single-room design', 'Design consultation', 'Another project']
export const propertyTypes = ['Apartment', 'Villa / independent home', 'Office', 'Commercial space', 'Another property']
export const contactMethods = ['Email', 'Phone call', 'WhatsApp']
export const contactServices = ['Interior design', 'Space planning', '3D visualization', 'Materials & finishes', 'Execution']

export const emptyContactEnquiry = { name: '', email: '', phone: '', projectType: '', propertyType: '', location: '', services: [], contactMethod: 'Email', message: '' }

export function validateContactEnquiry(draft) {
  const errors = {}
  if (draft.name.trim().length < 2) errors.name = 'Enter your full name (at least 2 characters).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = 'Enter a valid email address, such as name@example.com.'
  const phone = draft.phone.trim()
  const digits = phone.replace(/\D/g, '')
  if (!phone && draft.contactMethod !== 'Email') errors.phone = 'Add a phone number for your preferred contact method.'
  else if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || (phone.startsWith('+') ? digits.length < 7 || digits.length > 15 : !/^[6-9]\d{9}$/.test(digits)))) errors.phone = 'Use a 10-digit Indian mobile number, or include + and the country code.'
  if (!projectTypes.includes(draft.projectType)) errors.projectType = 'Select the kind of project you have in mind.'
  if (draft.propertyType && !propertyTypes.includes(draft.propertyType)) errors.propertyType = 'Select a property type from the list.'
  if (!contactMethods.includes(draft.contactMethod)) errors.contactMethod = 'Select your preferred contact method.'
  if (draft.message.trim().length < 10) errors.message = 'Tell us a little about your project (at least 10 characters).'
  return errors
}

// A future delivery adapter can accept this payload. No network request is made here.
export function createContactEnquiryPayload(draft) {
  return {
    name: draft.name.trim(), email: draft.email.trim(), phone: draft.phone.trim(),
    projectType: draft.projectType, propertyType: draft.propertyType,
    location: draft.location.trim(), services: contactServices.filter(service => draft.services.includes(service)),
    contactMethod: draft.contactMethod, message: draft.message.trim(),
  }
}

export function formatContactEnquiry(payload) {
  return ['TEJES INTERIORS — ENQUIRY DRAFT', 'Prepared locally. Not submitted to Tejes Interiors.', '',
    `Name: ${payload.name}`, `Email: ${payload.email}`, `Phone: ${payload.phone || 'Not provided'}`,
    `Project type: ${payload.projectType}`, `Property type: ${payload.propertyType || 'To discuss'}`,
    `Approximate location: ${payload.location || 'To discuss'}`, `Services: ${payload.services.join(', ') || 'To discuss'}`,
    `Preferred contact: ${payload.contactMethod}`, '', 'Project description:', payload.message].join('\n')
}
