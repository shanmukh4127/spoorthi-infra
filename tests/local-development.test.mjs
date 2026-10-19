import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import { isLocalDevelopmentRequest } from '../server/local-development.mjs'
import { createApp, hashPassword } from '../server/app.mjs'

const localRequest = () => ({ socket: { remoteAddress: '127.0.0.1', localAddress: '127.0.0.1', localPort: 5173 }, headers: { host: 'localhost:5173' } })
test('local development requires loopback socket, exact host/port and no forwarding or cross-site context', () => {
  assert.equal(isLocalDevelopmentRequest(localRequest()), true)
  for (const patch of [{ remoteAddress: '192.168.1.5' }, { localAddress: '192.168.1.2' }, { localPort: 3001 }]) {
    const request = localRequest(); Object.assign(request.socket, patch)
    assert.equal(isLocalDevelopmentRequest(request), false)
  }
  for (const patch of [{ host: 'evil.example:5173' }, { forwarded: 'for=127.0.0.1' }, { 'x-forwarded-for': '127.0.0.1' }, { via: 'proxy' }, { origin: 'https://evil.example' }, { 'sec-fetch-site': 'cross-site' }]) {
    const request = localRequest(); Object.assign(request.headers, patch)
    assert.equal(isLocalDevelopmentRequest(request), false)
  }
})

test('development session authorizes data and uploads with CSRF; preview and production still require login', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'spoorthi-local-auth-'))
  let app
  const options = { dataDirectory: directory, distDirectory: directory, seedPath: path.resolve('src/data/adminDatabase.json'), adminUsername: 'test-admin', passwordHash: hashPassword('test-only-long-password'), origin: 'http://localhost:5173', secureCookies: false }
  try {
    // Use an ephemeral test port; independently tested gate still requires 5173.
    app = await createApp({ ...options, localDevelopmentAccess: request => isLocalDevelopmentRequest({ headers: request.headers, socket: { remoteAddress: request.socket.remoteAddress, localAddress: request.socket.localAddress, localPort: 5173 } }) })
    await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve))
    const base = `http://127.0.0.1:${app.server.address().port}`
    let cookie = ''
    const request = (route, method = 'GET', body, extra = {}) => new Promise((resolve, reject) => {
      const outgoing = http.request(base + route, { method, headers: { Host: 'localhost:5173', Origin: options.origin, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}), ...extra } }, response => {
        let content = ''
        response.on('data', chunk => { content += chunk })
        response.on('end', () => resolve({ status: response.statusCode, cookie: response.headers['set-cookie']?.[0]?.split(';')[0], json: async () => JSON.parse(content) }))
      })
      outgoing.on('error', reject)
      outgoing.end(body ? JSON.stringify(body) : undefined)
    })
    assert.equal((await request('/api/admin/session')).status, 401)
    assert.equal((await request('/api/admin/database')).status, 401)
    assert.equal((await request('/api/admin/login', 'POST', { username: 'wrong-user' })).status, 401)
    const login = await request('/api/admin/login', 'POST', { username: options.adminUsername })
    assert.equal(login.status, 200)
    cookie = login.cookie
    const session = await (await request('/api/admin/session')).json()
    assert.equal(session.localDevelopment, true)
    const workspace = await (await request('/api/admin/database')).json()
    assert.equal((await request('/api/admin/database', 'PUT', workspace)).status, 403)
    assert.equal((await request('/api/admin/database', 'PUT', workspace, { 'X-CSRF-Token': session.csrfToken })).status, 200)
    const image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jFQAAAABJRU5ErkJggg=='
    assert.equal((await request('/api/admin/upload', 'POST', { mime: 'image/png', data: image }, { 'X-CSRF-Token': session.csrfToken })).status, 201)
    assert.equal((await request('/api/admin/session', 'GET', null, { 'X-Forwarded-For': '127.0.0.1' })).status, 401)
    assert.equal((await request('/api/admin/session', 'GET', null, { Host: 'lan.example:5173' })).status, 401)
    assert.equal((await request('/api/admin/logout', 'POST', {}, { 'X-CSRF-Token': session.csrfToken })).status, 200)
    assert.equal((await request('/api/admin/session')).status, 401)
    await app.close(); app = null
    for (const production of [false, true]) {
      app = await createApp({ ...options, secureCookies: production, origin: production ? 'https://example.test' : options.origin, ...(production ? { localDevelopmentAccess: () => true } : {}) })
      await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve))
      assert.equal((await fetch(`http://127.0.0.1:${app.server.address().port}/api/admin/session`)).status, 401)
      await app.close(); app = null
    }
  } finally { if (app) await app.close(); await rm(directory, { recursive: true, force: true }) }
})
