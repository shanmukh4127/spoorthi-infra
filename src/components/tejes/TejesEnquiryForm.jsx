import { useRef, useState } from 'react'
import Button from '../common/Button.jsx'
import FormField from '../common/FormField.jsx'
import { tejesContactEmail } from '../../data/tejes/studio.js'

const emptyDraft = { name: '', email: '', type: '', location: '', message: '' }

function TejesEnquiryForm() {
  const [draft, setDraft] = useState({ ...emptyDraft })
  const [errors, setErrors] = useState({})
  const [brief, setBrief] = useState('')
  const [status, setStatus] = useState('')
  const briefRef = useRef(null)
  const update = key => event => {
    setDraft(previous => ({ ...previous, [key]: event.target.value }))
    setErrors(previous => ({ ...previous, [key]: '' }))
    setBrief('')
    setStatus('')
  }

  function prepareEnquiry(event) {
    event.preventDefault()
    const nextErrors = {}
    if (draft.name.trim().length < 2) nextErrors.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) nextErrors.email = 'Please enter a valid email address.'
    if (!draft.type) nextErrors.type = 'Please select a project type.'
    if (draft.message.trim().length < 10) nextErrors.message = 'Please share a little more about your space (at least 10 characters).'
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      event.currentTarget.elements.namedItem(firstError)?.focus()
      setStatus('Please check the highlighted details.')
      return
    }
    const prepared = ['Interior enquiry — Tejes Interiors', '', `Name: ${draft.name.trim()}`, `Email: ${draft.email.trim()}`, `Project: ${draft.type}`, `Location: ${draft.location.trim() || 'To be discussed'}`, '', 'My requirements:', draft.message.trim()].join('\n')
    setBrief(prepared)
    setStatus('Your enquiry is ready. Open an email draft below, review it and send it from your email app.')
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief)
      setStatus('Enquiry copied. Paste it into an email to Tejes Interiors.')
    } catch {
      briefRef.current?.focus()
      briefRef.current?.select()
      setStatus('Your brief is selected. Copy it manually or download a copy below.')
    }
  }

  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'tejes-interior-enquiry.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('Your enquiry download is ready. Send the brief to Tejes Interiors when you are ready.')
  }

  function clearDraft() {
    setDraft({ ...emptyDraft })
    setErrors({})
    setBrief('')
    setStatus('Your enquiry has been cleared.')
  }

  return <form className="tejes-enquiry" noValidate onSubmit={prepareEnquiry} aria-labelledby="tejes-enquiry-title">
    <h2 id="tejes-enquiry-title">Tell us about your space.</h2>
    <p className="tejes-detail-note">Prepare your enquiry, then send it from your email app. You can also copy or download the brief.</p>
    <div className="tejes-enquiry__fields">
      <FormField id="tejes-name" name="name" label="Your name" autoComplete="name" value={draft.name} onChange={update('name')} required maxLength={120} error={errors.name} />
      <FormField id="tejes-email" name="email" label="Email address" type="email" autoComplete="email" value={draft.email} onChange={update('email')} required maxLength={254} error={errors.email} />
      <FormField id="tejes-type" name="type" label="Project type" as="select" value={draft.type} onChange={update('type')} required error={errors.type}><option value="">Select a project type</option>{['Complete home interior', 'Kitchen', 'Bedroom', 'Living & dining', 'Commercial interior', 'Another space'].map(type => <option key={type}>{type}</option>)}</FormField>
      <FormField id="tejes-location" name="location" label="Project location" autoComplete="address-level2" value={draft.location} onChange={update('location')} maxLength={200} hint="Optional. City or locality is enough." />
      <FormField id="tejes-message" name="message" label="What do you have in mind?" as="textarea" rows={5} value={draft.message} onChange={update('message')} required maxLength={3000} hint="Include the rooms, approximate area, priorities, budget or timeline when you can." error={errors.message} />
    </div>
    <div className="tejes-enquiry__actions"><Button type="submit">Prepare enquiry</Button><Button variant="secondary" onClick={clearDraft}>Clear details</Button></div>
    {status && <p className="tejes-detail-note" role="status">{status}</p>}
    {brief && <div className="tejes-enquiry__preview"><label className="type-label" htmlFor="tejes-enquiry-brief">Your enquiry brief</label><textarea id="tejes-enquiry-brief" ref={briefRef} readOnly value={brief} /><nav className="tejes-detail-actions" aria-label="Send your enquiry"><a className="ui-button ui-button--primary" href={`mailto:${tejesContactEmail}?subject=${encodeURIComponent('Interior enquiry — Tejes Interiors')}&body=${encodeURIComponent(brief)}`}>Open email draft</a><Button variant="secondary" onClick={copyBrief}>Copy brief</Button><Button variant="secondary" onClick={downloadBrief}>Download brief</Button></nav></div>}
  </form>
}
export default TejesEnquiryForm
