import { spoorthiServices } from './services.js'
import { contactPlaceholder } from '../shared/contact.js'

export const projectTypes = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'interior', label: 'Interior' },
  { value: 'infrastructure', label: 'Infrastructure' },
]

export const emptyEnquiry = { name: '', email: '', type: '', area: '', message: '' }

export function validateEnquiry(draft) {
  const errors = {}
  if (!draft.name.trim()) errors.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = 'Please enter a valid email address.'
  if (!projectTypes.some(item => item.value === draft.type)) errors.type = 'Please select a project type.'
  if (draft.area.trim() && (!Number.isFinite(Number(draft.area)) || Number(draft.area) < 0.01 || Number(draft.area) > Number.MAX_SAFE_INTEGER)) errors.area = 'Enter an area of at least 0.01 sq.ft, or leave this blank.'
  if (!draft.message.trim()) errors.message = 'Please tell us a little about your project.'
  return errors
}

export function createEnquiryBrief(draft, context = '') {
  const type = projectTypes.find(item => item.value === draft.type)?.label || 'To be discussed'
  return [
    'SPOORTHI INFRA — PROJECT ENQUIRY',
    '',
    `Name: ${draft.name.trim()}`,
    `Email: ${draft.email.trim()}`,
    `Project type: ${type}`,
    `Approximate area: ${draft.area.trim() ? `${draft.area.trim()} sq.ft` : 'To be discussed'}`,
    ...(context ? [`Project scope: ${context}`] : []),
    '',
    'PROJECT BRIEF',
    draft.message.trim(),
  ].join('\n')
}

export const contactPage = {
  intro: { eyebrow: 'Contact / Spoorthi Infra', title: 'Great spaces begin with a conversation.', description: 'A new home, a commercial space, or an idea taking shape. Tell us what you are planning and prepare a clear brief for the next step.' },
  disciplines: ['Construction', 'Infrastructure', 'Design'],
  details: contactPlaceholder,
  enquiry: { title: 'Tell us about your next project.', description: 'Start with what you know. The location, approximate size, and the way you want to use the space help bring your idea into focus.', unavailable: 'Open an email draft addressed to Spoorthi Infra and send it from your email app. You can also prepare your enquiry here to copy or download it first.', checked: 'Your email draft is ready. Review and send it from your email app. You can also copy or download the enquiry below.' },
  projectInformation: { title: 'A few details make a better beginning.', items: [
    { title: 'Your vision', text: 'Tell us what you want to build and how the space should support you.' },
    { title: 'Your starting point', text: 'Share the location, approximate area, and any drawings or references you have.' },
    { title: 'Your priorities', text: 'Mention the support you need, your preferred timeline, and what matters most.' },
  ] },
  services: spoorthiServices,
  closing: { title: 'Give your next space a clear starting point.' },
}
