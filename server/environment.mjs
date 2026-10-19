import { readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import path from 'node:path'

// Password hashes contain literal dollar signs, which Vite's dotenv expansion
// otherwise treats as variable references. Keep these server settings literal.
export function literalAdminEnvironment(root, mode) {
  const values = {}
  for (const name of ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`]) {
    let parsed
    try { parsed = parseEnv(readFileSync(path.join(root, name), 'utf8')) }
    catch (error) { if (error.code === 'ENOENT') continue; throw error }
    for (const key of ['SPOORTHI_ADMIN_USERNAME', 'SPOORTHI_ADMIN_PASSWORD_HASH']) {
      if (Object.hasOwn(parsed, key)) values[key] = parsed[key]
    }
  }
  return values
}
