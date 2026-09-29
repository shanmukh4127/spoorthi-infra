import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import Button from '../common/Button.jsx'
import { contactPage, projectTypes } from '../../data/spoorthi/contactPage.js'

function SpoorthiEnquiryForm({ draft, setDraft, nameRef, estimateContext }) {
  const [status, setStatus] = useState('')
  const [errors, setErrors] = useState({})
  const update = (key) => (event) => {
    setDraft(previous => ({ ...previous, [key]: event.target.value }))
    setStatus('')
    setErrors(previous => ({ ...previous, [key]: '' }))
  }
  function submit(event) {
    event.preventDefault()
    const next = {}
    if (!draft.name.trim()) next.name = 'Enter your name.'
    if (!draft.message.trim()) next.message = 'Describe your project.'
    setErrors(next)
    if (Object.keys(next).length) {
      document.getElementById(next.name ? 'enquiry-name' : 'enquiry-message')?.focus()
      return
    }
    setStatus(contactPage.enquiry.checked)
  }
  return <form className="contact-enquiry" onSubmit={submit} aria-labelledby="enquiry-title">
    <h2 id="enquiry-title">Enquiry form</h2>
    <p className="contact-enquiry__notice" id="submission-note">{contactPage.enquiry.unavailable}</p>
    {estimateContext && <p className="contact-enquiry__context" role="status">Planning context: {estimateContext}. No quotation has been generated.</p>}
    <FormField id="enquiry-name" label="01 — Your name" name="name" autoComplete="name" value={draft.name} onChange={update('name')} required maxLength={120} error={errors.name} ref={nameRef} />
    <FormField id="enquiry-email" label="02 — Email" name="email" type="email" autoComplete="email" value={draft.email} onChange={update('email')} required maxLength={254} />
    <FormField id="enquiry-type" label="03 — Project type" as="select" value={draft.type} onChange={update('type')} required><option value="">Select project type</option>{projectTypes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</FormField>
    <FormField id="enquiry-area" label="04 — Approximate area (sq.ft)" type="number" min="0.01" step="any" value={draft.area} onChange={update('area')} hint="Optional if the area is not known yet." />
    <FormField id="enquiry-message" label="05 — Tell us about the project" as="textarea" rows={4} required maxLength={4000} value={draft.message} onChange={update('message')} error={errors.message} />
    <Button type="submit" aria-describedby="submission-note">Start a conversation <span aria-hidden="true">↗</span></Button>
    <p className="contact-enquiry__status" role="status" aria-live="polite">{status}</p>
  </form>
}
export default SpoorthiEnquiryForm

