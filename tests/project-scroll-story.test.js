import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { createProjectStory } from '../src/data/shared/projectStory.js'

test('the no-motion reading view exposes every stage and a working detail link', async () => {
  const server = await createServer({ configFile: false, plugins: [react()], server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: Story } = await server.ssrLoadModule('/src/components/common/ProjectScrollStory.jsx')
    const { spoorthiDemoProjects, spoorthiShowcaseStages } = await server.ssrLoadModule('/src/data/spoorthi/demoShowcase.js')
    for (const project of spoorthiDemoProjects) {
      const route = `/spoorthi/projects/${project.id}`
      const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Story, { project: { ...project, detailRoute: route }, index: 0, total: 3, stages: spoorthiShowcaseStages, copy: project.showcaseCopy, projectLinkLabel: 'Explore demo study' })))
      assert.match(html, /tfp-project--static/)
      assert.doesNotMatch(html, /tfp-project--animated/)
      for (const stage of spoorthiShowcaseStages) {
        assert.ok(html.includes(project.showcaseCopy[stage.copyKey].heading))
        assert.ok(html.includes(project[stage.key][0].image.src))
      }
      assert.ok(html.includes(`href="${route}"`))
    }
    const story = createProjectStory({ id: 'uploaded-reading-view', title: 'Uploaded reading view', twoDImage: '/uploads/own-plan.png', threeDImage: '/uploads/own-model.png' })
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Story, { ...story, index: 0, total: 1 })))
    assert.ok(html.includes('/uploads/own-plan.png'))
    assert.ok(html.includes('/uploads/own-model.png'))
    assert.ok(html.includes('Final output image not yet added'))
    assert.doesNotMatch(html, /src="(?:null|undefined|)"/)
    assert.equal((html.match(/class="tfp-stage tfp-stage--/g) || []).length, 3)
  } finally { await server.close() }
})

test('Spoorthi renders desktop stories and Tejes-style mobile swipe cards for published projects', async () => {
  const server = await createServer({ configFile: false, plugins: [react()], server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: Featured } = await server.ssrLoadModule('/src/components/spoorthi/SpoorthiFeaturedProjects.jsx')
    const { spoorthiDemoProjects } = await server.ssrLoadModule('/src/data/spoorthi/demoShowcase.js')
    const uploaded = { id: 'new-homepage-project', title: 'New homepage project', brand: 'Spoorthi Infra', status: 'Published', showOnHomepage: true, twoDImage: '/uploads/new-plan.png', threeDImage: '/uploads/new-model.png', finalOutputImage: '/uploads/new-final.png' }
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Featured, { projects: [...spoorthiDemoProjects, uploaded], status: 'ready' })))
    assert.equal((html.match(/class="tfp-project tfp-project--/g) || []).length, 4)
    assert.equal((html.match(/class="tfp-stage tfp-stage--/g) || []).length, 12)
    assert.match(html, /tfp-mobile-projects tfp-mobile-projects--floating/)
    assert.match(html, /sfp-project-stories tfp-desktop-projects/)
    assert.equal((html.match(/class="tfp-mobile-slide"/g) || []).length, 12)
    assert.equal((html.match(/class="sfp-mobile-story"/g) || []).length, 4)
    assert.match(html, /id="spoorthi-project-cards"/)
    for (const project of [...spoorthiDemoProjects, uploaded]) {
      assert.ok(html.includes(`id="featured-${project.id}"`))
      assert.ok(html.includes(`href="/spoorthi/projects/${project.id}"`))
      for (const source of [project.twoDImage, project.threeDImage, project.finalOutputImage]) assert.ok(html.includes(source))
    }
  } finally { await server.close() }
})
