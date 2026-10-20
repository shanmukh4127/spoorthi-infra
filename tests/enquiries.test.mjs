import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createApp, hashPassword } from '../server/app.mjs'

test('public enquiries validate, persist, remain private and appear in the authenticated inbox', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'spoorthi-enquiries-'))
  const origin = 'http://localhost:5173'
  await mkdir(path.join(directory, 'dist'))
  await writeFile(path.join(directory, 'seed.json'), JSON.stringify({ projects: [], services: [], enquiries: [], settings: {} }))
  const options = { dataDirectory: path.join(directory, 'data'), distDirectory: path.join(directory, 'dist'), seedPath: path.join(directory, 'seed.json'), adminUsername: 'enquiry-test', passwordHash: hashPassword('test-password-for-enquiries'), origin, secureCookies: false }
  let app
  let base
  const start = async () => { app = await createApp(options); await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve)); base = `http://127.0.0.1:${app.server.address().port}` }
  const post = (body, requestOrigin = origin) => fetch(`${base}/api/public/enquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: requestOrigin }, body: JSON.stringify(body) })
  const draft = { name: 'Enquiry QA', email: 'enquiry-qa@example.com', type: 'residential', area: '2400', message: 'Test enquiry message', context: 'Design planning', submissionId: randomUUID() }
  const login = async () => {
    const response = await fetch(`${base}/api/admin/login`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ username: options.adminUsername, password: 'test-password-for-enquiries' }) })
    assert.equal(response.status, 200)
    return { Cookie: response.headers.get('set-cookie').split(';')[0], 'X-CSRF-Token': (await response.json()).csrfToken }
  }
  try {
    await start()
    assert.equal((await post(draft, 'https://untrusted.invalid')).status, 403)
    assert.equal((await post({ ...draft, email: 'invalid' })).status, 400)
    assert.equal((await post({ ...draft, message: 'x'.repeat(4001) })).status, 400)
    assert.equal((await fetch(`${base}/api/admin/database`)).status, 401)
    const auth = await login()
    const stale = await (await fetch(`${base}/api/admin/database`, { headers: auth })).json()
    assert.equal((await post(draft)).status, 201)
    assert.equal((await post(draft)).status, 200)
    assert.equal((await post({ ...draft, submissionId: randomUUID() })).status, 201)
    const inbox = await (await fetch(`${base}/api/admin/database`, { headers: auth })).json()
    assert.equal(inbox.enquiries.length, 2)
    assert.equal(inbox.enquiries[0].message, draft.message)
    assert.equal(inbox.enquiries[0].email, draft.email)
    assert.equal(inbox.enquiries[0].status, 'New')
    assert.notEqual(inbox.enquiries[0].id, inbox.enquiries[1].id)
    const publicData = await (await fetch(`${base}/api/public/projects`)).json()
    assert.equal(publicData.enquiries, undefined)
    assert.ok(!JSON.stringify(publicData).includes(draft.email))
    assert.equal((await fetch(`${base}/api/admin/database`, { method: 'PUT', headers: { ...auth, Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(stale) })).status, 409)
    for (let i = 0; i < 3; i++) assert.equal((await post({ ...draft, submissionId: randomUUID() })).status, 201)
    assert.equal((await post({ ...draft, submissionId: randomUUID() })).status, 429)
    const beforeDelete = await (await fetch(`${base}/api/admin/database`, { headers: auth })).json()
    const deletedId = beforeDelete.enquiries[0].id
    const afterDelete = { ...beforeDelete, enquiries: beforeDelete.enquiries.filter(item => item.id !== deletedId) }
    assert.equal((await fetch(`${base}/api/admin/database`, { method: 'PUT', headers: { ...auth, Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(afterDelete) })).status, 200)
    await app.close(); app = null
    await start()
    const restoredAuth = await login()
    const restored = await (await fetch(`${base}/api/admin/database`, { headers: restoredAuth })).json()
    assert.equal(restored.enquiries.length, 4)
    assert.ok(!restored.enquiries.some(item => item.id === deletedId))
  } finally {
    if (app) await app.close()
    await rm(directory, { recursive: true, force: true })
  }
})
