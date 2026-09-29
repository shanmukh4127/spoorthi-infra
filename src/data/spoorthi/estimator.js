import { spoorthiServices } from './services.js'
import { projectTypes } from './contactPage.js'

const scopes = spoorthiServices.filter(service => ['civil-construction', 'design', '2d-design', '3d-design'].includes(service.id)).map(service => ({ value: service.id, label: service.label }))
// Add only client-approved tiers: [{ value: 'approved-id', label: 'Approved label' }].
// Rates are INR per sq.ft: rates[type][scope][level || 'base'] = { min, max }.
// Null means unconfigured. No inferred market rates or fallback prices.
export const pricingConfig = {
  currency: 'INR', unit: 'sq.ft', projectTypes, scopes, levels: [],
  rates: Object.fromEntries(projectTypes.map(type => [type.value, Object.fromEntries(scopes.map(scope => [scope.value, { base: null }]))])),
}
export const estimateCopy = {
  eyebrow: '05 / Project estimate', title: 'Start with a direction. Get an early cost range.',
  introduction: 'A preliminary planning estimate, not a final quotation. Select a project type, scope, and approximate area to outline your enquiry.',
  pending: 'Pricing configuration pending', pendingDescription: 'Preliminary pricing will appear here once approved rates are added.',
  disclaimer: 'This estimate is intended for early planning only. Final project costs depend on design, specifications, materials, site conditions and project scope.',
}
export function calculateEstimate(config, { type, scope, area, level = '' }) {
  if (!config.projectTypes.some(item => item.value === type) || !config.scopes.some(item => item.value === scope)) return { status: 'incomplete' }
  if (config.levels.length && !config.levels.some(item => item.value === level)) return { status: 'incomplete' }
  const size = Number(area)
  if (String(area).trim() === '' || !Number.isFinite(size) || size <= 0) return { status: 'invalid-area' }
  const rate = config.rates?.[type]?.[scope]?.[config.levels.length ? level : 'base']
  if (!rate || !Number.isFinite(rate.min) || !Number.isFinite(rate.max) || rate.min <= 0 || rate.max < rate.min) return { status: 'pending' }
  const min = size * rate.min
  const max = size * rate.max
  if (!Number.isFinite(min) || !Number.isFinite(max) || max > Number.MAX_SAFE_INTEGER) return { status: 'invalid-area' }
  return { status: 'ready', min: Math.round(min), max: Math.round(max) }
}
