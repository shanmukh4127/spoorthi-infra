import { useRef, useState } from 'react'
import { ArrowRight, Download, LockKeyhole } from 'lucide-react'
import FormField from '../common/FormField.jsx'
import { contactMethods, contactServices, createContactEnquiryPayload, emptyContactEnquiry, formatContactEnquiry, projectTypes, propertyTypes, validateContactEnquiry } from '../../data/tejes/contactPage.js'

export default function TejesContactEnquiryForm() {
  const [draft, setDraft] = useState({ ...emptyContactEnquiry, services: [] })
  const [errors, setErrors] = useState({})
  const [prepared, setPrepared] = useState(null)
  const [status, setStatus] = useState('')
  const feedbackRef = useRef(null)
  const submittedRef = useRef(false)
  function updateValue(key, value) {
    setDraft(current => ({ ...current, [key]: value }))
    setErrors(current => ({ ...current, [key]: '', ...(key === 'contactMethod' ? { phone: '' } : {}) }))
    setPrepared(null)
    setStatus('')
    submittedRef.current = false
  }
  const update = key => event => updateValue(key, event.target.value)
  function submit(event) {
    event.preventDefault()
    if (submittedRef.current) return
    const nextErrors = validateContactEnquiry(draft)
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      event.currentTarget.elements.namedItem(firstError)?.focus()
      setStatus('Please check the highlighted fields.')
      return
    }
    submittedRef.current = true
    setPrepared(createContactEnquiryPayload(draft))
    setStatus('Your enquiry draft is ready. It has not been sent or stored by Tejes Interiors. Download a copy to keep your details.')
    requestAnimationFrame(() => feedbackRef.current?.focus())
  }
  function download() {
    const url = URL.createObjectURL(new Blob([formatContactEnquiry(prepared)], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'tejes-enquiry-draft.txt'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <form id="contact-enquiry" className="tc-form" noValidate onSubmit={submit} aria-labelledby="contact-form-title" aria-describedby="contact-submission-note">
    <p className="tc-label">Get in touch</p>
    <h2 id="contact-form-title">Tell us about<br />your project</h2>
    <p className="tc-form-intro">A new space, a fresh perspective, or an idea taking shape. Tell us what you have in mind.</p>
    <div className="tc-form-fields">
      <FormField id="tc-name" name="name" label="Full name" required autoComplete="name" placeholder="Your name" maxLength={120} value={draft.name} onChange={update('name')} error={errors.name} />
      <FormField id="tc-phone" name="phone" label="Phone number" type="tel" autoComplete="tel" inputMode="tel" placeholder="Mobile or +country code" maxLength={30} required={draft.contactMethod !== 'Email'} value={draft.phone} onChange={update('phone')} error={errors.phone} />
      <FormField id="tc-email" name="email" label="Email address" type="email" required autoComplete="email" placeholder="you@example.com" maxLength={254} value={draft.email} onChange={update('email')} error={errors.email} />
      <FormField id="tc-project" name="projectType" label="Project type" as="select" required value={draft.projectType} onChange={update('projectType')} error={errors.projectType}><option value="">Select project type</option>{projectTypes.map(type => <option key={type}>{type}</option>)}</FormField>
      <FormField id="tc-property" name="propertyType" label="Property type" as="select" value={draft.propertyType} onChange={update('propertyType')} error={errors.propertyType}><option value="">Select property type</option>{propertyTypes.map(type => <option key={type}>{type}</option>)}</FormField>
      <FormField id="tc-location" name="location" label="Approximate location" autoComplete="address-level2" placeholder="City or locality" maxLength={160} value={draft.location} onChange={update('location')} />
      <fieldset className="tc-services"><legend>Services interested in <span>(optional)</span></legend><div>{contactServices.map(service => <label key={service}><input type="checkbox" name="services" value={service} checked={draft.services.includes(service)} onChange={event => updateValue('services', event.target.checked ? [...draft.services, service] : draft.services.filter(item => item !== service))} /><span>{service}</span></label>)}</div></fieldset>
      <FormField id="tc-method" name="contactMethod" className="tc-full-width" label="Preferred contact method" as="select" value={draft.contactMethod} onChange={update('contactMethod')} error={errors.contactMethod}>{contactMethods.map(method => <option key={method}>{method}</option>)}</FormField>
      <FormField id="tc-message" name="message" className="tc-full-width" label="Tell us about your project" as="textarea" required rows={4} placeholder="Your space, ideas, priorities and what you would like to change…" maxLength={3000} value={draft.message} onChange={update('message')} error={errors.message} />
    </div>
    <p id="contact-submission-note" className="tc-submission-note">Enquiry delivery is being set up. This form currently prepares a draft on your device.</p>
    <button className="tc-button tc-submit" type="submit" disabled={Boolean(prepared)}>{prepared ? 'Draft prepared' : 'Send enquiry'} <ArrowRight size={15} aria-hidden="true" /></button>
    <p className="tc-privacy"><LockKeyhole size={12} aria-hidden="true" /> Your details stay in this page until you leave or refresh.</p>
    {status && <div className={`tc-feedback${prepared ? ' is-prepared' : ''}`} ref={feedbackRef} tabIndex={-1} role="status"><p>{status}</p>{prepared && <button type="button" className="tc-download" onClick={download}><Download size={15} aria-hidden="true" /> Download enquiry draft</button>}</div>}
  </form>
}
