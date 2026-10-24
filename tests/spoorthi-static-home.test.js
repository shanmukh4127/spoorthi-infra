import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'

test('Spoorthi homepage uses a static hero and readable header without mounting the background scene', async () => {
  const server = await createServer({ configFile: false, plugins: [react()], server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: Home } = await server.ssrLoadModule('/src/pages/spoorthi/SpoorthiHomePage.jsx')
    const { default: Header } = await server.ssrLoadModule('/src/components/spoorthi/SpoorthiCinematicHeader.jsx')
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement('div', null, createElement(Header), createElement(Home))))
    assert.doesNotMatch(html, /si-journey|scene-loading|<canvas|si-cinematic-header--over-scene/)
    assert.match(html, /class="sh-hero__image"/)
    assert.match(html, /architecture.webp/)
    assert.match(html, /id="sh-hero-title"/)
    assert.match(html, /href="#spoorthi-demo-projects"/)
    assert.match(html, /href="\/spoorthi\/contact"/)
    assert.match(html, /Open Spoorthi navigation/)
    assert.match(html, /id="spoorthi-demo-projects"/)
    const headerHtml = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Header)))
    const navigation = headerHtml.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1]
    assert.ok(navigation)
    assert.deepEqual([...navigation.matchAll(/href="([^"]+)"/g)].map(match => match[1]), ['/spoorthi', '/spoorthi/projects', '/spoorthi/contact', '/tejes'])
    assert.doesNotMatch(headerHtml, /<dialog|si-menu-overlay|Explore Spoorthi|Building|Infrastructure|Engineering/)
    assert.match(headerHtml, /class="si-menu-panel"[^>]*hidden/)
  } finally { await server.close() }
})

test('every Spoorthi route retains one compact header instead of horizontal or duplicate navigation', async () => {
  const server = await createServer({ configFile: false, plugins: [react()], server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { default: Layout } = await server.ssrLoadModule('/src/components/layout/SpoorthiLayout.jsx')
    for (const route of ['/spoorthi', '/spoorthi/projects', '/spoorthi/projects/example', '/spoorthi/contact', '/spoorthi/civil-construction', '/spoorthi/design-3d', '/spoorthi/vr', '/spoorthi/admin']) {
      const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [route] }, createElement(Layout, null, createElement('h1', null, 'Page content retained'))))
      assert.equal((html.match(/<header\b/g) || []).length, 1)
      assert.match(html, /class="si-menu-panel"/)
      assert.doesNotMatch(html, /brand-header__navigation|mobile-navigation|si-menu-overlay/)
      assert.match(html, /Page content retained/)
      assert.equal(html.includes('si-cinematic-header--in-flow'), route !== '/spoorthi')
    }
  } finally { await server.close() }
})
