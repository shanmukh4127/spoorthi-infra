import test from 'node:test'
import assert from 'node:assert/strict'
import { getPublicProjects, getWorkspaceProjects } from '../src/data/spoorthi/publicProjects.js'

test('static studies remain visible until an explicit saved Draft overrides them', () => {
  const catalog = getPublicProjects()
  assert.equal(catalog.length, 11)
  const overrides = catalog.map(record => ({ ...record, status: 'Draft', description: 'PRIVATE DRAFT' }))
  assert.deepEqual(getPublicProjects(overrides), [])
})

test('saved Published and legacy records are included, Draft and deleted records are excluded for both brands', () => {
  const records = ['Spoorthi Infra', 'Tejes Interiors'].flatMap((brand, index) => [
    { id: `published-${index}`, brand, status: 'Published', title: 'Visible' },
    { id: `draft-${index}`, brand, status: 'Draft', title: 'Private' },
    { id: `deleted-${index}`, brand, status: 'Published', deleted: true, title: 'Deleted' },
    { id: `legacy-${index}`, brand, title: 'Legacy' },
  ])
  const result = getPublicProjects(records)
  for (const index of [0, 1]) {
    assert.ok(result.some(item => item.id === `published-${index}`))
    assert.ok(result.some(item => item.id === `legacy-${index}`))
    assert.ok(!result.some(item => item.id === `draft-${index}` || item.id === `deleted-${index}`))
  }
})

test('static record edits persist and deleted catalog records cannot reappear through the static fallback', () => {
  const result = getPublicProjects([{ id: 'residential-concept', brand: 'Spoorthi Infra', title: 'Edited title', status: 'Published' }, { id: 'signature-residence', brand: 'Tejes Interiors', status: 'Draft', deleted: true }])
  assert.equal(result.find(item => item.id === 'residential-concept').title, 'Edited title')
  assert.ok(!result.some(item => item.id === 'signature-residence'))
  assert.equal(getWorkspaceProjects([{ id: 'residential-concept', brand: 'Spoorthi Infra', status: 'Draft' }]).find(item => item.id === 'residential-concept').status, 'Draft')
})
