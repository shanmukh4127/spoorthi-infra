import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createVercelConfig, writeVercelConfig } from '../scripts/configure-vercel-backend.mjs'

test('committed SPA routing preserves missing API/upload errors until a real backend is configured', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
  assert.equal(config.outputDirectory, 'dist')
  for (const prefix of ['spoorthi', 'tejes', 'admin']) {
    assert.deepEqual(config.rewrites.find(rule => rule.source === `/${prefix}/:path*`), { source: `/${prefix}/:path*`, destination: '/index.html' })
  }
  assert.ok(createVercelConfig().rewrites.every(rule => !rule.source.includes('api') && !rule.source.includes('uploads')))
  assert.ok(config.rewrites.filter(rule => /^\/(api|uploads)\//.test(rule.source)).every(rule => rule.destination.startsWith('https://') && rule.destination.endsWith(rule.source)))
})

test('backend configuration proxies public/admin API and uploads before SPA routes without embedding credentials', () => {
  const config = createVercelConfig('https://backend.example.test/')
  assert.deepEqual(config.rewrites.slice(0, 2), [
    { source: '/api/:path*', destination: 'https://backend.example.test/api/:path*' },
    { source: '/uploads/:path*', destination: 'https://backend.example.test/uploads/:path*' },
  ])
  assert.equal(config.rewrites.length, 5)
  for (const origin of ['http://backend.example.test', 'https://user:secret@backend.example.test', 'https://backend.example.test/api', 'https://backend.example.test/?key=secret', 'https://backend.example.test/#fragment']) {
    assert.throws(() => createVercelConfig(origin))
  }
})

test('generated backend routing is valid JSON on disk and leaves no placeholder destination', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'spoorthi-vercel-routing-'))
  try {
    const destination = path.join(directory, 'vercel.json')
    await writeVercelConfig(destination, 'https://backend.example.test')
    const config = JSON.parse(await readFile(destination, 'utf8'))
    assert.deepEqual(config, createVercelConfig('https://backend.example.test'))
    assert.ok(config.rewrites.slice(0, 2).every(rule => rule.destination.startsWith('https://backend.example.test/')))
  } finally { await rm(directory, { recursive: true, force: true }) }
})
