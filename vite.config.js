import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const databasePath = path.join(projectRoot, 'src', 'data', 'adminDatabase.json')
const projectAssetDirectory = path.join(projectRoot, 'public', 'assets', 'projects')

function adminDatabasePlugin() {
  return {
    name: 'admin-database',
    configureServer(server) {
      server.middlewares.use('/api/admin/database', (request, response, next) => {
        if (!['GET', 'PUT', 'POST'].includes(request.method)) {
          next()
          return
        }

        if (request.method === 'GET') {
          try {
            response.statusCode = 200
            response.setHeader('Content-Type', 'application/json')
            response.end(fs.readFileSync(databasePath, 'utf8'))
          } catch {
            response.statusCode = 500
            response.end(JSON.stringify({ error: 'Unable to read the admin data file.' }))
          }
          return
        }

        const chunks = []
        request.on('data', (chunk) => chunks.push(chunk))
        request.on('end', () => {
          try {
            const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'))
            if (!payload || !Array.isArray(payload.projects) || !Array.isArray(payload.services) || !Array.isArray(payload.enquiries)) throw new Error('Invalid admin data')
            fs.writeFileSync(databasePath, `${JSON.stringify({ ...payload, initialized: true }, null, 2)}\n`, 'utf8')
            response.statusCode = 200
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({ ok: true }))
          } catch {
            response.statusCode = 400
            response.end(JSON.stringify({ error: 'Invalid admin data.' }))
          }
        })
      })
      server.middlewares.use('/api/admin/upload', (request, response, next) => {
        if (request.method !== 'POST') { next(); return }
        const chunks = []
        request.on('data', (chunk) => chunks.push(chunk))
        request.on('end', () => {
          try {
            const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'))
            if (!payload?.filename || !payload?.mime?.startsWith('image/') || typeof payload.data !== 'string') throw new Error('Invalid image upload')
            const extension = path.extname(payload.filename).toLowerCase()
            if (!['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(extension)) throw new Error('Unsupported image type')
            const safeName = `${Date.now()}-${path.basename(payload.filename, extension).replace(/[^a-z0-9-_]+/gi, '-').toLowerCase()}${extension}`
            fs.mkdirSync(projectAssetDirectory, { recursive: true })
            fs.writeFileSync(path.join(projectAssetDirectory, safeName), Buffer.from(payload.data, 'base64'))
            response.statusCode = 201
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({ path: `/assets/projects/${safeName}` }))
          } catch {
            response.statusCode = 400
            response.end(JSON.stringify({ error: 'Image upload failed.' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminDatabasePlugin()],
})
