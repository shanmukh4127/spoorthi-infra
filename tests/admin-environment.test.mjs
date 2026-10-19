import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { literalAdminEnvironment } from '../server/environment.mjs'

test('admin hash dollar signs survive env loading and mode overrides', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'spoorthi-env-'))
  try {
    const hash = `scrypt$${'a'.repeat(32)}$${'b'.repeat(128)}`
    writeFileSync(path.join(root, '.env'), `SPOORTHI_ADMIN_USERNAME=base\nSPOORTHI_ADMIN_PASSWORD_HASH=${hash}\n`)
    writeFileSync(path.join(root, '.env.development.local'), 'SPOORTHI_ADMIN_USERNAME=local\n')
    assert.deepEqual(literalAdminEnvironment(root, 'development'), {
      SPOORTHI_ADMIN_USERNAME: 'local', SPOORTHI_ADMIN_PASSWORD_HASH: hash,
    })
  } finally { rmSync(root, { recursive: true, force: true }) }
})
