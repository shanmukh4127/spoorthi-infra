import { useState } from 'react'
import FormField from '../common/FormField.jsx'
import Button from '../common/Button.jsx'
import { pricingConfig, estimateCopy, calculateEstimate } from '../../data/spoorthi/estimator.js'

function SpoorthiEstimator({ onRequest }) {
  const [selection, setSelection] = useState({ type: '', scope: '', area: '', level: '' })
  const [result, setResult] = useState({ status: 'pending' })
  const update = key => event => {
    setSelection(previous => ({ ...previous, [key]: event.target.value }))
    setResult({ status: 'pending' })
  }
  const format = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: pricingConfig.currency, maximumFractionDigits: 0 }).format(value)
  return <div className="contact-estimator">
    <form onSubmit={event => { event.preventDefault(); setResult(calculateEstimate(pricingConfig, selection)) }} aria-label="Preliminary project estimate">
      <div className="contact-estimator__steps">
        <FormField id="estimate-type" label="Step 01 — Project type" as="select" required value={selection.type} onChange={update('type')}><option value="">Select type</option>{pricingConfig.projectTypes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</FormField>
        <FormField id="estimate-scope" label="Step 02 — Project scope" as="select" required value={selection.scope} onChange={update('scope')}><option value="">Select scope</option>{pricingConfig.scopes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</FormField>
        <FormField id="estimate-area" label="Step 03 — Area (sq.ft)" type="number" required min="0.01" step="any" value={selection.area} onChange={update('area')} />
        <FormField id="estimate-level" label="Step 04 — Project level" as="select" value={selection.level} onChange={update('level')} disabled={!pricingConfig.levels.length} required={!!pricingConfig.levels.length} hint={!pricingConfig.levels.length ? 'Project levels await approval.' : undefined}><option value="">{pricingConfig.levels.length ? 'Select level' : 'Not configured'}</option>{pricingConfig.levels.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</FormField>
      </div>
      <Button type="submit" variant="secondary">Check estimate <span aria-hidden="true">↗</span></Button>
    </form>
    <div className="contact-estimator__result">
      <p className="type-label">Estimate range</p>
      <div role="status" aria-live="polite" aria-atomic="true">
        <h3>{result.status === 'ready' ? `${format(result.min)} – ${format(result.max)}` : result.status === 'invalid-area' ? 'Enter a valid positive area.' : result.status === 'incomplete' ? 'Complete the project selections.' : estimateCopy.pending}</h3>
        <p>{result.status === 'ready' ? 'Preliminary estimate' : estimateCopy.pendingDescription}</p>
      </div>
      <p className="contact-estimator__disclaimer">{estimateCopy.disclaimer}</p>
      <Button variant="secondary" onClick={() => onRequest(selection)}>Request a detailed quotation <span aria-hidden="true">↗</span></Button>
    </div>
  </div>
}
export default SpoorthiEstimator
