import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('desktop and mobile enable the journey; reduced motion and data saving expose all chapters', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  try {
    const { default: Journey } = await server.ssrLoadModule('/src/components/spoorthi/SpoorthiHomeJourney.jsx')
    for (const mode of ['mobile', 'reduced motion', 'data saving', 'desktop']) {
      Object.defineProperty(globalThis, 'window', { configurable: true, value: { matchMedia: query => {
        assert.match(query, /prefers-reduced-motion: no-preference/)
        return { matches: mode !== 'reduced motion' }
      } } })
      Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { connection: { saveData: mode === 'data saving' } } })
      const html = renderToStaticMarkup(createElement(Journey))
      if (mode === 'desktop' || mode === 'mobile') {
        assert.ok(!html.includes('si-journey--static'))
      } else {
        assert.match(html, /si-journey--static/)
        assert.equal((html.match(/<article/g) ?? []).length, 20)
        assert.ok(!html.includes('aria-hidden="true" class="si-journey__chapter'))
        assert.ok(!html.includes('Read without 3D'))
      }
    }
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow); else delete globalThis.window
    if (previousNavigator) Object.defineProperty(globalThis, 'navigator', previousNavigator); else delete globalThis.navigator
    await server.close()
  }
})
