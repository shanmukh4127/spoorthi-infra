import { useState } from 'react'
import { ArrowUpRight, Check, Ruler } from 'lucide-react'
import FormField from '../common/FormField.jsx'
import Button from '../common/Button.jsx'
import { pricingConfig, estimateCopy, calculateEstimate } from '../../data/spoorthi/estimator.js'

function SpoorthiEstimator({ onRequest }) {
  const [selection, setSelection] = useState({ type: '', scope: '', area: '', level: '' })
  const [result, setResult] = useState({ status: 'idle' })
  const [errors, setErrors] = useState({})
  const update = key => event => {
    setSelection(previous => ({ ...previous, [key]: event.target.value }))
    setResult({ status: 'idle' })
    setErrors(previous => ({ ...previous, [key]: '' }))
  }
  const format = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: pricingConfig.currency, maximumFractionDigits: 0 }).format(value)
  const isReviewed = result.status === 'ready' || result.status === 'pending'
  const projectType = pricingConfig.projectTypes.find(item => item.value === selection.type)?.label
  const scope = pricingConfig.scopes.find(item => item.value === selection.scope)?.label

  function reviewPlan(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!pricingConfig.projectTypes.some(item => item.value === selection.type)) nextErrors.type = 'Select a project type.'
    if (!pricingConfig.scopes.some(item => item.value === selection.scope)) nextErrors.scope = 'Select the support you need.'
    if (!selection.area.trim() || !Number.isFinite(Number(selection.area)) || Number(selection.area) < 0.01 || Number(selection.area) > Number.MAX_SAFE_INTEGER) nextErrors.area = 'Enter an area of at least 0.01 sq.ft.'
    if (pricingConfig.levels.length && !pricingConfig.levels.some(item => item.value === selection.level)) nextErrors.level = 'Select a project level.'
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      setResult({ status: 'incomplete' })
      event.currentTarget.elements.namedItem(firstError)?.focus()
      return
    }
    const estimate = calculateEstimate(pricingConfig, selection)
    setResult(estimate)
    if (estimate.status === 'invalid-area') setErrors({ area: 'This area is too large to calculate. Please check the value.' })
  }

  return (
    <div className="contact-estimator">
      <form onSubmit={reviewPlan} noValidate aria-label="Project planning details">
        <div className="contact-estimator__steps">
          <FormField id="estimate-type" name="type" label="01 / Project type" as="select" required value={selection.type} error={errors.type} onChange={update('type')}><option value="">Select type</option>{pricingConfig.projectTypes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</FormField>
          <FormField id="estimate-scope" name="scope" label="02 / Support you need" as="select" required value={selection.scope} error={errors.scope} onChange={update('scope')}><option value="">Select scope</option>{pricingConfig.scopes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</FormField>
          <FormField id="estimate-area" name="area" label="03 / Area (sq.ft)" type="number" required min="0.01" step="any" inputMode="decimal" placeholder="e.g. 2400" value={selection.area} error={errors.area} hint="Use the approximate built-up or design area." onChange={update('area')} />
          {pricingConfig.levels.length > 0 && <FormField id="estimate-level" name="level" label="04 / Project level" as="select" value={selection.level} error={errors.level} onChange={update('level')} required><option value="">Select level</option>{pricingConfig.levels.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</FormField>}
        </div>
        <Button type="submit" variant="secondary">Review project plan <ArrowUpRight size={17} aria-hidden="true" /></Button>
      </form>
      <div className={`contact-estimator__result${isReviewed ? ' contact-estimator__result--ready' : ''}`}>
        <div className="contact-estimator__result-heading"><p className="type-label">{result.status === 'ready' ? 'Preliminary estimate' : 'Your next step'}</p>{isReviewed ? <Check size={24} aria-hidden="true" /> : <Ruler size={24} strokeWidth={1.4} aria-hidden="true" />}</div>
        <div role="status" aria-live="polite" aria-atomic="true">
          <h3>{result.status === 'ready' ? `${format(result.min)} – ${format(result.max)}` : result.status === 'pending' ? estimateCopy.pending : result.status === 'incomplete' || result.status === 'invalid-area' ? 'Check your project details.' : 'A clear brief is a strong beginning.'}</h3>
          <p>{result.status === 'ready' ? 'An indicative range for your selected scope and approximate area.' : result.status === 'pending' ? estimateCopy.pendingDescription : result.status === 'incomplete' || result.status === 'invalid-area' ? 'Complete the highlighted fields, then review your plan.' : 'Choose the type of space, the support you need, and its approximate size.'}</p>
          {isReviewed && <dl className="contact-estimator__summary"><div><dt>Project</dt><dd>{projectType}</dd></div><div><dt>Scope</dt><dd>{scope}</dd></div><div><dt>Area</dt><dd>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 }).format(Number(selection.area))} sq.ft</dd></div></dl>}
        </div>
        {result.status === 'ready' && <p className="contact-estimator__disclaimer">{estimateCopy.disclaimer}</p>}
        {isReviewed && <Button variant="secondary" onClick={() => onRequest(selection)}>Add plan to enquiry <ArrowUpRight size={17} aria-hidden="true" /></Button>}
      </div>
    </div>
  )
}

export default SpoorthiEstimator
