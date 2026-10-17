import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('mobile, reduced motion and data saving render every chapter without the long 3D track', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  try {
    const { default: Journey } = await server.ssrLoadModule('/src/components/spoorthi/SpoorthiHomeJourney.jsx')
    for (const mode of ['mobile', 'reduced motion', 'data saving', 'desktop']) {
      Object.defineProperty(globalThis, 'window', { configurable: true, value: { matchMedia: query => {
        assert.match(query, /prefers-reduced-motion: no-preference/)
        return { matches: mode === 'desktop' || mode === 'data saving' }
      } } })
      Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { connection: { saveData: mode === 'data saving' } } })
      const html = renderToStaticMarkup(createElement(Journey))
      if (mode === 'desktop') {
        assert.ok(!html.includes('si-journey--static'))
      } else {
        assert.match(html, /si-journey--static/)
        assert.equal((html.match(/<article/g) ?? []).length, 6)
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
