import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createApp, hashPassword } from '../server/app.mjs'
import { getPublicProjects, getWorkspaceProjects } from '../src/data/spoorthi/publicProjects.js'
import { getHomepageProjects, createHomepageStory } from '../src/data/shared/homepageProjects.js'

test('only the six legacy selections migrate on; explicit off and publication always win', () => {
  const catalog = getWorkspaceProjects()
  for (const brand of ['Spoorthi Infra', 'Tejes Interiors']) assert.equal(getHomepageProjects(catalog, brand).length, 3)
  const brand = 'Tejes Interiors'
  const saved = [
    { id: 'signature-residence', brand, showOnHomepage: false },
    { id: 'harmony-home', brand, showOnHomepage: true, status: 'Draft' },
    { id: 'new-unselected', brand, title: 'New project', status: 'Published' },
    { id: 'new-selected', brand, title: 'Selected project', category: 'Residential', showOnHomepage: true, status: 'Published', coverImage: '/uploads/own-cover.webp', finalOutputImage: '/uploads/own-final.webp' },
  ]
  const publicProjects = getPublicProjects(saved)
  const selected = getHomepageProjects(publicProjects, brand)
  assert.deepEqual(selected.map(p => p.id), ['serenity-villa', 'new-selected'])
  assert.ok(publicProjects.some(p => p.id === 'signature-residence'))
  assert.equal(publicProjects.find(p => p.id === 'new-unselected').showOnHomepage, false)
  assert.ok(!getHomepageProjects(publicProjects, 'Spoorthi Infra').some(p => p.id.startsWith('new-')))
  assert.equal(createHomepageStory(selected.at(-1)).project.visualizationImages[0].image.src, '/uploads/own-final.webp')
  const cover = createHomepageStory({ id: 'cover-only', title: 'Own cover', coverImage: '/uploads/own-cover.webp' })
  assert.equal(cover.project.visualizationImages[0].image.src, '/uploads/own-cover.webp')
  assert.equal(cover.stages[2].label, 'Project overview')
})

test('create, publish, toggle, edit and restart persist homepage selection for both brands', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'homepage-selection-'))
  const password = 'test-only-homepage-selection-password'
  const options = { dataDirectory: directory, distDirectory: directory, seedPath: path.resolve('src/data/adminDatabase.json'), adminUsername: 'test-admin', passwordHash: hashPassword(password), origin: 'http://localhost:5173', secureCookies: false }
  let app, base, cookie = '', csrf = ''
  const request = async (route, method = 'GET', body) => {
    const response = await fetch(base + route, { method, headers: { Cookie: cookie, Origin: options.origin, 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, ...(body ? { body: JSON.stringify(body) } : {}) })
    assert.equal(response.status, 200)
    return response
  }
  const start = async () => {
    app = await createApp(options)
    await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve))
    base = `http://127.0.0.1:${app.server.address().port}`
    const login = await request('/api/admin/login', 'POST', { username: 'test-admin', password })
    cookie = login.headers.get('set-cookie').split(';')[0]
    csrf = (await login.json()).csrfToken
  }
  try {
    await start()
    let workspace = await (await request('/api/admin/database')).json()
    for (const [index, brand] of ['Spoorthi Infra', 'Tejes Interiors'].entries()) workspace.projects.push({ id: `homepage-test-${index}`, brand, title: `Test ${index}`, category: 'Test', status: 'Draft', showOnHomepage: false, finalOutputImage: `/uploads/${index}-final.webp` })
    await request('/api/admin/database', 'PUT', workspace)
    workspace = await (await request('/api/admin/database')).json()
    for (const project of workspace.projects.filter(p => p.id.startsWith('homepage-test-'))) { project.status = 'Published'; project.showOnHomepage = true }
    await request('/api/admin/database', 'PUT', workspace)
    for (const brand of ['Spoorthi Infra', 'Tejes Interiors']) assert.equal(getHomepageProjects((await (await request('/api/public/projects')).json()).projects, brand).filter(p => p.id.startsWith('homepage-test-')).length, 1)
    workspace = await (await request('/api/admin/database')).json()
    workspace.projects.find(p => p.id === 'homepage-test-0').showOnHomepage = false
    workspace.projects.find(p => p.id === 'homepage-test-1').title = 'Updated selected project'
    await request('/api/admin/database', 'PUT', workspace)
    await app.close(); app = null
    await start()
    const published = (await (await request('/api/public/projects')).json()).projects
    assert.ok(published.some(p => p.id === 'homepage-test-0'))
    assert.ok(!getHomepageProjects(published, 'Spoorthi Infra').some(p => p.id === 'homepage-test-0'))
    assert.equal(getHomepageProjects(published, 'Tejes Interiors').find(p => p.id === 'homepage-test-1').title, 'Updated selected project')
  } finally { if (app) await app.close(); await rm(directory, { recursive: true, force: true }) }
})
