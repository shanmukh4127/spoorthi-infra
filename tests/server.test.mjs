import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { randomBytes, createHash } from 'node:crypto'
import { createApp, hashPassword } from '../server/app.mjs'

test('server authentication, published reads, uploads, conflicts and persistence', async t => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'spoorthi-server-test-'))
  const originalSeed = await readFile('src/data/adminDatabase.json')
  const seedHash = createHash('sha256').update(originalSeed).digest('hex')
  const dist = path.join(directory, 'dist')
  await mkdir(dist)
  await writeFile(path.join(dist, 'index.html'), '<html>Test application</html>')
  const password = randomBytes(24).toString('hex')
  const options = { dataDirectory: path.join(directory, 'data'), distDirectory: dist, seedPath: path.resolve('src/data/adminDatabase.json'), adminUsername: 'test-admin', passwordHash: hashPassword(password), origin: 'http://localhost:5173', secureCookies: false }
  let app
  let base
  let cookie = ''
  let csrfToken = ''
  const request = (url, method = 'GET', body, headers = {}) => fetch(base + url, { method, headers: { ...(body ? { 'Content-Type': 'application/json', Origin: options.origin } : {}), ...(cookie ? { Cookie: cookie } : {}), ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}), ...headers }, ...(body ? { body: JSON.stringify(body) } : {}) })
  const start = async () => {
    app = await createApp(options)
    await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve))
    base = `http://127.0.0.1:${app.server.address().port}`
  }
  const login = async () => {
    const response = await request('/api/admin/login', 'POST', { username: options.adminUsername, password })
    assert.equal(response.status, 200)
    assert.match(response.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/)
    cookie = response.headers.get('set-cookie').split(';')[0]
    csrfToken = (await response.json()).csrfToken
  }
  try {
    await assert.rejects(createApp({ ...options, passwordHash: '' }), /No default administrator/)
    await assert.rejects(createApp({ ...options, secureCookies: true }), /HTTPS/)
    await start()
    await t.test('anonymous access and forged browser flags do not authorize admin endpoints', async () => {
      for (const url of ['/api/admin/database', '/api/admin/session']) assert.equal((await request(url)).status, 401)
      assert.equal((await request('/api/admin/upload', 'POST', {})).status, 401)
      assert.equal((await request('/api/admin/database', 'GET', null, { Cookie: 'spoorthi-admin-auth=true; spoorthi_session=fake' })).status, 401)
      assert.equal((await request('/api/admin/login', 'POST', { username: 'test-admin', password: 'incorrect' })).status, 401)
    })
    await login()
    let workspace = await (await request('/api/admin/database')).json()
    await t.test('writes require both matching origin and session CSRF token', async () => {
      assert.equal((await request('/api/admin/database', 'PUT', workspace, { Origin: 'https://untrusted.invalid' })).status, 403)
      assert.equal((await request('/api/admin/database', 'PUT', workspace, { 'X-CSRF-Token': '' })).status, 403)
      const invalid = { ...workspace, projects: [...workspace.projects, { id: 'bad-url', title: 'Invalid', category: 'Test', brand: 'Spoorthi Infra', status: 'Draft', vrArUrl: 'javascript:alert(1)' }] }
      assert.equal((await request('/api/admin/database', 'PUT', invalid)).status, 400)
    })
    await t.test('Draft overrides and deleted static records never appear in anonymous responses', async () => {
      workspace.projects = workspace.projects.map(record => record.id === 'residential-concept' || record.id === 'signature-residence' ? { ...record, status: 'Draft', description: 'PRIVATE-DRAFT-CONTENT' } : record.id === 'construction-planning' ? { ...record, status: 'Draft', deleted: true } : record)
      workspace.projects.push({ id: 'shared-published-record', title: 'Published test record', category: 'Test', brand: 'Spoorthi Infra', status: 'Published' })
      const saved = await request('/api/admin/database', 'PUT', workspace)
      assert.equal(saved.status, 200)
      assert.equal((await request('/api/admin/database', 'PUT', workspace)).status, 409)
      workspace.revision = (await saved.json()).revision
      const visible = await (await request('/api/public/projects', 'GET', null, { Cookie: '' })).json()
      assert.ok(visible.projects.some(record => record.id === 'shared-published-record'))
      assert.ok(!visible.projects.some(record => ['residential-concept', 'signature-residence', 'construction-planning'].includes(record.id)))
      assert.ok(!JSON.stringify(visible).includes('PRIVATE-DRAFT-CONTENT'))
      assert.equal(visible.enquiries, undefined)
      assert.equal(visible.settings, undefined)
    })
    let uploadPath
    const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jFQAAAABJRU5ErkJggg==', 'base64')
    await t.test('authenticated uploads validate content and persist outside the build directory', async () => {
      assert.equal((await request('/api/admin/upload', 'POST', { mime: 'image/png', data: Buffer.from('<svg onload="alert(1)"></svg>').toString('base64') })).status, 400)
      assert.equal((await request('/api/admin/upload', 'POST', { mime: 'image/png', data: Buffer.alloc(8 * 1024 * 1024 + 1).toString('base64') })).status, 413)
      const response = await request('/api/admin/upload', 'POST', { mime: 'image/png', filename: '../../escape.png', data: image.toString('base64') })
      assert.equal(response.status, 201)
      uploadPath = (await response.json()).path
      assert.match(uploadPath, /^\/uploads\/[a-f0-9-]+\.png$/)
      const asset = await request(uploadPath, 'GET', null, { Cookie: '' })
      assert.equal(asset.headers.get('content-type'), 'image/png')
      assert.equal(asset.headers.get('x-content-type-options'), 'nosniff')
      assert.deepEqual(Buffer.from(await asset.arrayBuffer()), image)
    })
    await app.close()
    app = null
    await start()
    await t.test('database and image survive server restart, while old login sessions expire', async () => {
      assert.equal((await request('/api/admin/database')).status, 401)
      const publicData = await (await request('/api/public/projects')).json()
      assert.ok(publicData.projects.some(record => record.id === 'shared-published-record'))
      assert.equal((await request(uploadPath)).status, 200)
      assert.equal((await request('/api/missing')).status, 401)
      await login()
      assert.equal((await request('/api/missing')).status, 404)
      assert.equal((await request('/assets/missing.png')).status, 404)
      assert.equal((await request('/spoorthi/contact')).status, 200)
      assert.equal((await request('/api/admin/logout', 'POST', {}, { Origin: options.origin })).status, 200)
      assert.equal((await request('/api/admin/database')).status, 401)
    })
    await t.test('login attempts are limited and production cookies require Secure', async () => {
      cookie = ''; csrfToken = ''
      for (let index = 0; index < 5; index++) assert.equal((await request('/api/admin/login', 'POST', { username: 'test-admin', password: 'incorrect' })).status, 401)
      assert.equal((await request('/api/admin/login', 'POST', { username: 'test-admin', password })).status, 429)
      await app.close(); app = null
      app = await createApp({ ...options, origin: 'https://example.invalid', secureCookies: true })
      await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve))
      base = `http://127.0.0.1:${app.server.address().port}`
      const response = await request('/api/admin/login', 'POST', { username: 'test-admin', password }, { Origin: 'https://example.invalid' })
      assert.equal(response.status, 200)
      assert.match(response.headers.get('set-cookie'), /; Secure/)
    })
    assert.equal(createHash('sha256').update(await readFile('src/data/adminDatabase.json')).digest('hex'), seedHash)
    await t.test('local public viewing works without admin credentials and still hides drafts', async () => {
      const localSeed = JSON.parse(originalSeed)
      localSeed.projects.push({ id: 'residential-concept', title: 'Private local draft', category: 'Residential', brand: 'Spoorthi Infra', status: 'Draft' })
      const localSeedPath = path.join(directory, 'local-seed.json')
      await writeFile(localSeedPath, JSON.stringify(localSeed))
      const local = await createApp({ ...options, dataDirectory: path.join(directory, 'local-public-data'), seedPath: localSeedPath, adminUsername: undefined, passwordHash: undefined, allowUnconfiguredAdmin: true, developmentOrigins: () => ['http://localhost:5181'] })
      try {
        await new Promise(resolve => local.server.listen(0, '127.0.0.1', resolve))
        const localBase = `http://127.0.0.1:${local.server.address().port}`
        const result = await fetch(localBase + '/api/public/projects')
        assert.equal(result.status, 200)
        const data = await result.json()
        assert.ok(!data.projects.some(project => project.id === 'residential-concept'))
        assert.ok(data.projects.some(project => project.title === 'shannu'))
        assert.equal((await fetch(localBase + '/api/admin/session')).status, 503)
        assert.equal((await fetch(localBase + '/api/admin/database', { method: 'PUT', headers: { Origin: 'http://localhost:5181', 'Content-Type': 'application/json' }, body: '{}' })).status, 503)
      } finally { await local.close() }
      await assert.rejects(createApp({ ...options, passwordHash: '', secureCookies: true, origin: 'https://example.invalid', allowUnconfiguredAdmin: true }), /No default administrator/)
    })
  } finally {
    if (app) await app.close()
    await rm(directory, { recursive: true, force: true })
  }
})
