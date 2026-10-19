import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

test('company story preserves section order and publishes only approved leadership and milestones', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: Home } = await server.ssrLoadModule('/src/pages/spoorthi/SpoorthiHomePage.jsx')
    const { companyStory } = await server.ssrLoadModule('/src/data/spoorthi/companyStory.js')
    const render = () => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Home)))
    const baseline = render()
    assert.ok(baseline.indexOf('id="spoorthi-home-content"') < baseline.indexOf('id="spoorthi-demo-projects"'))
    assert.ok(baseline.indexOf('id="spoorthi-demo-projects"') < baseline.indexOf('id="our-approach"'))
    assert.deepEqual([...baseline.matchAll(/data-story-section="([^"]+)"/g)].map(m => m[1]), ['leadership', 'about', 'purpose', 'milestones', 'projects', 'capabilities', 'contact'])
    assert.match(baseline, /Pending client confirmation/)
    assert.match(baseline, /not completed Spoorthi client projects/)
    assert.match(baseline, /href="\/spoorthi\/contact"/)
    companyStory.founder = { approved: false, name: 'UNAPPROVED_PERSON', role: 'UNAPPROVED_ROLE', biography: 'UNAPPROVED_BIO' }
    companyStory.vision = { approved: false, text: 'UNAPPROVED_VISION' }
    companyStory.milestones = [{ approved: false, title: 'UNAPPROVED_AWARD' }]
    assert.doesNotMatch(render(), /UNAPPROVED_/)
    companyStory.founder = { approved: true, name: 'Approved test name', role: 'Approved test role', biography: 'Approved test biography' }
    companyStory.vision = { approved: true, text: 'Approved test vision' }
    companyStory.milestones.push({ approved: true, date: 'Approved test date', title: 'Approved test milestone', description: 'Approved test context' })
    const approved = render()
    for (const text of ['Approved test name', 'Approved test biography', 'Approved test vision', 'Approved test milestone']) assert.ok(approved.includes(text))
    assert.doesNotMatch(approved, /UNAPPROVED_/)
  } finally {
    await server.close()
  }
})
