import { useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Download, FileText } from 'lucide-react'
import FormField from '../common/FormField.jsx'
import Button from '../common/Button.jsx'
import { contactPage, createEnquiryBrief, projectTypes, validateEnquiry } from '../../data/spoorthi/contactPage.js'

function SpoorthiEnquiryForm({ draft, setDraft, nameRef, estimateContext, onClear }) {
  const source = JSON.stringify([draft, estimateContext])
  const [feedback, setFeedback] = useState({ source: '', message: '' })
  const status = feedback.source === source ? feedback.message : ''
  const setStatus = message => setFeedback({ source, message })
  const [errors, setErrors] = useState({})
  const [checkedDraft, setCheckedDraft] = useState(null)
  const [prepared, setPrepared] = useState(null)
  const brief = prepared?.source === source ? prepared.brief : ''
  const [copying, setCopying] = useState(false)
  const briefRef = useRef(null)
  const update = key => event => {
    setDraft(previous => ({ ...previous, [key]: event.target.value }))
    setPrepared(null)
    setStatus('')
    setErrors(previous => ({ ...previous, [key]: '' }))
  }

  function prepareEnquiry(form) {
    const next = validateEnquiry(draft)
    setErrors(next)
    setCheckedDraft(draft)
    const firstError = Object.keys(next)[0]
    if (firstError) {
      setStatus('Please check the highlighted details.')
      form.elements.namedItem(firstError)?.focus()
      return null
    }
    const preparedBrief = createEnquiryBrief(draft, estimateContext)
    setPrepared({ source, brief: preparedBrief })
    setStatus('Your project enquiry is ready. Copy or download it below, or open an email draft when you are ready to send.')
    return preparedBrief
  }

  function submit(event) {
    event.preventDefault()
    const preparedBrief = prepareEnquiry(event.currentTarget)
    if (!preparedBrief || !contactPage.details.email) return
    setStatus(contactPage.enquiry.checked)
    window.location.assign(`mailto:${contactPage.details.email}?subject=${encodeURIComponent('Project enquiry — Spoorthi Infra')}&body=${encodeURIComponent(preparedBrief)}`)
  }

  async function copyBrief() {
    setCopying(true)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(brief)
      setStatus('Enquiry copied. You can paste it into your preferred conversation.')
    } catch {
      briefRef.current?.focus()
      briefRef.current?.select()
      setStatus('Your browser could not copy automatically. The brief is selected so you can copy it, or download a copy.')
    } finally {
      setCopying(false)
    }
  }

  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'spoorthi-project-enquiry.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('Your enquiry download is ready. It has not been sent to Spoorthi Infra.')
  }

  function clearDraft() {
    onClear()
    setErrors({})
    setCheckedDraft(null)
    setPrepared(null)
    setFeedback({ source: '', message: '' })
    nameRef.current?.focus()
  }

  return (
    <form className="contact-enquiry" noValidate onSubmit={submit} aria-labelledby="enquiry-title">
      <div className="contact-enquiry__heading">
        <div><p className="type-label">Your project brief</p><h2 id="enquiry-title">Let’s hear your idea.</h2></div>
        <FileText size={28} strokeWidth={1.3} aria-hidden="true" />
      </div>
      <p className="contact-enquiry__notice" id="submission-note">{contactPage.enquiry.unavailable}</p>
      {estimateContext && <p className="contact-enquiry__context" role="status"><Check size={16} aria-hidden="true" /><span>Project plan added: {estimateContext}</span></p>}
      <div className="contact-enquiry__fields">
        <FormField id="enquiry-name" label="Your name" name="name" autoComplete="name" placeholder="Full name" value={draft.name} onChange={update('name')} required maxLength={120} error={checkedDraft?.name === draft.name ? errors.name : ''} ref={nameRef} />
        <FormField id="enquiry-email" label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={draft.email} onChange={update('email')} required maxLength={254} error={checkedDraft?.email === draft.email ? errors.email : ''} />
        <FormField id="enquiry-type" label="Project type" name="type" as="select" value={draft.type} onChange={update('type')} required error={checkedDraft?.type === draft.type ? errors.type : ''}><option value="">Select project type</option>{projectTypes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</FormField>
        <FormField id="enquiry-area" label="Approximate area (sq.ft)" name="area" type="number" min="0.01" step="any" inputMode="decimal" placeholder="e.g. 2400" value={draft.area} onChange={update('area')} hint="Optional. An early approximation is enough." error={checkedDraft?.area === draft.area ? errors.area : ''} />
        <FormField id="enquiry-message" className="contact-enquiry__message" label="Tell us about the project" name="message" as="textarea" rows={5} placeholder="What are you planning? Include the location, priorities, and timeline if you know them." required maxLength={4000} value={draft.message} onChange={update('message')} error={checkedDraft?.message === draft.message ? errors.message : ''} />
      </div>
      <div className="contact-enquiry__actions">
        <Button type="submit" aria-describedby="submission-note">{contactPage.details.email ? 'Open email draft' : 'Prepare enquiry'} <ArrowUpRight size={17} aria-hidden="true" /></Button>
        {contactPage.details.email && <Button variant="secondary" onClick={event => prepareEnquiry(event.currentTarget.form)}>Prepare enquiry</Button>}
        <Button variant="text" onClick={clearDraft} disabled={!Object.values(draft).some(Boolean) && !estimateContext}>Clear draft</Button>
      </div>
      <p className="contact-enquiry__privacy">Your draft stays in this browser tab when storage is available. Download a copy before closing the tab.</p>
      <p className="contact-enquiry__status" role="status" aria-live="polite">{status}</p>
      {brief && (
        <div className="contact-enquiry__prepared">
          <div className="contact-enquiry__prepared-title"><Check size={18} aria-hidden="true" /><h3>Your enquiry, ready to keep.</h3></div>
          <label className="ui-field__label" htmlFor="enquiry-brief">Prepared project enquiry</label>
          <textarea id="enquiry-brief" ref={briefRef} className="contact-enquiry__brief" readOnly value={brief} rows={9} />
          <div className="contact-enquiry__actions">
            <Button variant="secondary" onClick={downloadBrief}><Download size={16} aria-hidden="true" /> Download enquiry</Button>
            <Button variant="text" loading={copying} onClick={copyBrief}><Copy size={16} aria-hidden="true" /> Copy enquiry</Button>
            {contactPage.details.email && <a className="ui-link" href={`mailto:${contactPage.details.email}?subject=${encodeURIComponent('Project enquiry — Spoorthi Infra')}&body=${encodeURIComponent(brief)}`}>Open in email <ArrowUpRight size={16} aria-hidden="true" /></a>}
          </div>
        </div>
      )}
    </form>
  )
}

export default SpoorthiEnquiryForm
