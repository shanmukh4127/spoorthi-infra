import { spoorthiServices } from './services.js'
import { contactPlaceholder } from '../shared/contact.js'

export const projectTypes = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'interior', label: 'Interior' },
]
export const contactPage = {
  intro: { eyebrow: 'Spoorthi Infra / 05', title: 'Let’s build the next space.', description: 'Start with an idea, a requirement, or a question. Give the next space a clear starting point.' },
  disciplines: ['Civil Construction', 'Infrastructure', 'Design'],
  details: contactPlaceholder,
  enquiry: { title: 'An open line.', description: 'Tell us what you have in mind and where you are in the planning process.', unavailable: 'Online submission is not connected yet. You can prepare and validate your enquiry here; nothing is sent or saved.', checked: 'Your enquiry is ready, but online submission is unavailable. Nothing has been sent or saved. Keep this page open to retain your draft.' },
  projectInformation: { title: 'A little context goes a long way.', items: [
    { title: 'The intention', text: 'Describe the space and what you would like it to do.' },
    { title: 'The starting point', text: 'Mention any drawings, approximate area, or requirements you already have.' },
    { title: 'The scope', text: 'Identify the kind of support you would like to discuss.' },
  ] },
  services: spoorthiServices,
  closing: { title: 'From idea. To drawing. To space.' },
}
