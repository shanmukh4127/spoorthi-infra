import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './app.mjs'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const production = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 3001)
try {
  const app = await createApp({
    dataDirectory: path.resolve(process.env.SPOORTHI_DATA_DIR || path.join(root, 'storage')),
    distDirectory: path.join(root, 'dist'),
    seedPath: path.join(root, 'src/data/adminDatabase.json'),
    adminUsername: process.env.SPOORTHI_ADMIN_USERNAME,
    passwordHash: process.env.SPOORTHI_ADMIN_PASSWORD_HASH,
    origin: process.env.PUBLIC_ORIGIN || (!production ? `http://localhost:${port}` : ''),
    secureCookies: production,
    allowUnconfiguredAdmin: !production,
  })
  app.server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`Spoorthi server listening on port ${port}.`))
  const stop = async () => { await app.close(); process.exit(0) }
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
