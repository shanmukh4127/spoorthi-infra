import http from 'node:http'
import { DatabaseSync } from 'node:sqlite'
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto'
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { getPublicProjects, getWorkspaceProjects } from '../src/data/spoorthi/publicProjects.js'
import { validateEnquiry, projectTypes } from '../src/data/spoorthi/contactPage.js'

const SESSION_SECONDS = 8 * 60 * 60
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_BODY_BYTES = 12 * 1024 * 1024
const hashToken = token => createHash('sha256').update(token).digest('hex')
const scryptOptions = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }

export function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 14) throw new Error('Use an administrator password of at least 14 characters.')
  const salt = randomBytes(16).toString('hex')
  return `scrypt$${salt}$${scryptSync(password, salt, 64, scryptOptions).toString('hex')}`
}

function verifyPassword(password, encoded) {
  const [, salt, hex] = encoded.split('$')
  const actual = scryptSync(password, salt, 64, scryptOptions)
  const expected = Buffer.from(hex, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

function validateDatabase(value) {
  if (!value || !Array.isArray(value.projects) || value.projects.length > 1000 || !Array.isArray(value.services) || value.services.length > 100 || !Array.isArray(value.enquiries) || value.enquiries.length > 1000 || !value.settings || typeof value.settings !== 'object') throw new Error('Invalid workspace data.')
  if (value.services.some(item => !item || typeof item.name !== 'string' || !['Published', 'Draft'].includes(item.status)) || value.enquiries.some(item => !item || typeof item.name !== 'string' || typeof item.subject !== 'string' || !['New', 'In review', 'Replied'].includes(item.status))) throw new Error('Invalid service or enquiry record.')
  if (!['all', 'Spoorthi Infra', 'Tejes Interiors'].includes(value.settings.defaultBrand || 'all')) throw new Error('Invalid workspace preference.')
  const ids = new Set()
  const allowedBrands = ['Spoorthi Infra', 'Tejes Interiors']
  for (const project of value.projects) {
    if (!project || typeof project.id !== 'string' || !/^[a-z0-9-]{1,100}$/i.test(project.id) || ids.has(project.id) || typeof project.title !== 'string' || !project.title.trim() || project.title.length > 200 || typeof project.category !== 'string' || project.category.length > 200 || !allowedBrands.includes(project.brand) || !['Published', 'Draft'].includes(project.status || 'Published')) throw new Error('Invalid project record.')
    for (const key of ['description', 'location', 'serviceNeeded', 'area']) if (project[key] != null && (typeof project[key] !== 'string' || project[key].length > 4000)) throw new Error('Invalid project details.')
    if (project.showOnHomepage != null && typeof project.showOnHomepage !== 'boolean') throw new Error('Homepage selection must be true or false.')
    ids.add(project.id)
    for (const key of ['coverImage', 'twoDImage', 'threeDImage', 'finalOutputImage', 'vrArUrl']) {
      if (project[key] && (typeof project[key] !== 'string' || project[key].length > 2048 || !/^(\/(?!\/)|https?:\/\/)/i.test(project[key]))) throw new Error('Project media must use a local path or an HTTP(S) URL.')
    }
  }
  if (JSON.stringify(value).length > 2 * 1024 * 1024) throw new Error('Workspace data is too large.')
  return { projects: value.projects, services: value.services, enquiries: value.enquiries, settings: value.settings, initialized: true }
}

async function readJson(request, maxBytes = MAX_BODY_BYTES) {
  if (!/^application\/json(?:;|$)/i.test(request.headers['content-type'] || '')) throw Object.assign(new Error('JSON request required.'), { status: 415 })
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > maxBytes) throw Object.assign(new Error('Request is too large.'), { status: 413 })
    chunks.push(chunk)
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { throw Object.assign(new Error('Invalid JSON.'), { status: 400 }) }
}

function imageType(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return { ext: 'png', mime: 'image/png' }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: 'jpg', mime: 'image/jpeg' }
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return { ext: 'webp', mime: 'image/webp' }
  return null
}

const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.gif': 'image/gif', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream', '.woff2': 'font/woff2', '.mp4': 'video/mp4' }

export async function createApp({ dataDirectory, distDirectory, seedPath, adminUsername, passwordHash, origin, secureCookies = true, allowUnconfiguredAdmin = false, developmentOrigins, localDevelopmentAccess }) {
  const adminConfigured = Boolean(adminUsername && /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(passwordHash || ''))
  if (!adminConfigured && (!allowUnconfiguredAdmin || secureCookies)) throw new Error('Set SPOORTHI_ADMIN_USERNAME and a valid SPOORTHI_ADMIN_PASSWORD_HASH. No default administrator exists.')
  if (!origin || new URL(origin).origin !== origin || (secureCookies && !origin.startsWith('https://'))) throw new Error('Set PUBLIC_ORIGIN to the exact HTTPS site origin (HTTP is allowed only outside production).')
  await mkdir(dataDirectory, { recursive: true, mode: 0o700 })
  const uploadDirectory = path.join(dataDirectory, 'uploads')
  await mkdir(uploadDirectory, { recursive: true, mode: 0o700 })
  const database = new DatabaseSync(path.join(dataDirectory, 'workspace.sqlite'))
  database.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS workspace (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL, payload TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires INTEGER NOT NULL);')
  if (!database.prepare('SELECT id FROM workspace WHERE id=1').get()) {
    const seed = JSON.parse(await readFile(seedPath, 'utf8'))
    const initial = validateDatabase({ ...seed, projects: getWorkspaceProjects(seed.projects), settings: seed.settings || {} })
    database.prepare('INSERT INTO workspace VALUES (1, 1, ?)').run(JSON.stringify(initial))
  }
  // A credential change invalidates sessions from the previous server process.
  database.exec('DELETE FROM sessions')
  const attempts = new Map()
  const enquiryAttempts = new Map()
  const developmentSessions = new Set()
  const localAccess = request => !secureCookies && localDevelopmentAccess?.(request) === true
  const readWorkspace = () => { const row = database.prepare('SELECT revision,payload FROM workspace WHERE id=1').get(); const payload = JSON.parse(row.payload); return { ...payload, projects: getWorkspaceProjects(payload.projects), revision: row.revision } }
  const sessionFor = request => {
    const token = (request.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith('spoorthi_session='))?.slice('spoorthi_session='.length)
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return null
    if (developmentSessions.has(hashToken(token)) && !localAccess(request)) return null
    const session = database.prepare('SELECT csrf,expires FROM sessions WHERE token_hash=?').get(hashToken(token))
    return session && session.expires > Date.now() ? { ...session, hash: hashToken(token) } : null
  }
  const cookie = (token, seconds) => `spoorthi_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${seconds}${secureCookies ? '; Secure' : ''}`
  const send = (response, status, body) => { response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); response.end(JSON.stringify(body)) }
  const handler = async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.setHeader('X-Frame-Options', 'DENY')
    response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self' data:; media-src 'self' https: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'")
    if (secureCookies) response.setHeader('Strict-Transport-Security', 'max-age=31536000')
    try {
      const url = new URL(request.url, origin)
      const pathname = decodeURIComponent(url.pathname)
      if (pathname.startsWith('/api/')) {
        const trustedOrigin = request.headers.origin === origin || (!secureCookies && developmentOrigins?.().includes(request.headers.origin))
        if (!['GET', 'HEAD'].includes(request.method) && !trustedOrigin) return send(response, 403, { error: 'This request must come from the configured site origin.' })
        if (pathname === '/api/public/projects' && request.method === 'GET') {
          const workspace = readWorkspace()
          // Include Draft overrides while merging; never send their content publicly.
          return send(response, 200, { projects: getPublicProjects(workspace.projects), services: workspace.services.filter(service => service.status === 'Published') })
        }
        if (pathname === '/api/public/enquiries' && request.method === 'POST') {
          const body = await readJson(request, 24 * 1024)
          const limits = { name: 120, email: 254, type: 30, area: 30, message: 4000, context: 500 }
          if (!body || typeof body !== 'object' || Object.entries(limits).some(([key, limit]) => (key !== 'context' || body[key] != null) && (typeof body[key] !== 'string' || body[key].length > limit)) || typeof body.submissionId !== 'string' || !/^[a-f0-9-]{36}$/i.test(body.submissionId)) return send(response, 400, { error: 'Please check your enquiry details.' })
          const draft = Object.fromEntries(Object.keys(limits).map(key => [key, (body[key] || '').trim()]))
          const errors = validateEnquiry(draft)
          if (Object.keys(errors).length) return send(response, 400, { error: 'Please check the highlighted details.', errors })
          const workspace = readWorkspace()
          const id = `enquiry-${body.submissionId}`
          if (workspace.enquiries.some(item => item.id === id)) return send(response, 200, { ok: true })
          const now = Date.now()
          for (const [key, value] of enquiryAttempts) if (value.until <= now) enquiryAttempts.delete(key)
          const ip = request.socket.remoteAddress || 'unknown'
          const limit = enquiryAttempts.get(ip)
          if (limit?.count >= 5) { response.setHeader('Retry-After', String(Math.ceil((limit.until - now) / 1000))); return send(response, 429, { error: 'Too many enquiries. Please try again in a few minutes.' }) }
          if (workspace.enquiries.length >= 1000) return send(response, 503, { error: 'Enquiries are temporarily unavailable. Please try again later.' })
          const enquiry = { ...draft, id, brand: 'Spoorthi Infra', subject: `${projectTypes.find(item => item.value === draft.type).label} project enquiry`, status: 'New', initials: draft.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase(), createdAt: new Date(now).toISOString(), date: new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(now) }
          const payload = validateDatabase({ ...workspace, enquiries: [enquiry, ...workspace.enquiries] })
          database.prepare('UPDATE workspace SET payload=?, revision=revision+1 WHERE id=1').run(JSON.stringify(payload))
          enquiryAttempts.set(ip, { count: (limit?.count || 0) + 1, until: limit?.until || now + 10 * 60 * 1000 })
          return send(response, 201, { ok: true })
        }
        if (!adminConfigured && !localAccess(request)) return send(response, 503, { error: 'Public projects are available. To enable administrator sign-in, configure SPOORTHI_ADMIN_USERNAME and SPOORTHI_ADMIN_PASSWORD_HASH in .env, then restart the local server. No demo password is enabled.' })
        if (pathname === '/api/admin/login' && request.method === 'POST') {
          const ip = request.socket.remoteAddress || 'unknown'
          const now = Date.now()
          for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key)
          const limit = attempts.get(ip)
          if (limit && limit.count >= 5) { response.setHeader('Retry-After', String(Math.ceil((limit.until - now) / 1000))); return send(response, 429, { error: 'Too many sign-in attempts. Try again in 15 minutes.' }) }
          const body = await readJson(request)
          const developmentLogin = localAccess(request) && Boolean(adminUsername)
          if (typeof body.username !== 'string' || (!developmentLogin && (typeof body.password !== 'string' || body.password.length > 1024))) return send(response, 400, { error: developmentLogin ? 'Enter your username.' : 'Enter your username and password.' })
          const validPassword = developmentLogin || verifyPassword(body.password, passwordHash)
          if (body.username !== adminUsername || !validPassword) {
            attempts.set(ip, { count: (limit?.count || 0) + 1, until: limit?.until || now + 15 * 60 * 1000 })
            return send(response, 401, { error: developmentLogin ? 'Incorrect username.' : 'Incorrect username or password.' })
          }
          attempts.delete(ip)
          database.prepare('DELETE FROM sessions WHERE expires <= ?').run(now)
          const previous = sessionFor(request)
          if (previous) database.prepare('DELETE FROM sessions WHERE token_hash=?').run(previous.hash)
          const token = randomBytes(32).toString('hex')
          const csrfToken = randomBytes(32).toString('hex')
          database.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(hashToken(token), csrfToken, now + SESSION_SECONDS * 1000)
          if (developmentLogin) developmentSessions.add(hashToken(token))
          response.setHeader('Set-Cookie', cookie(token, SESSION_SECONDS))
          return send(response, 200, { username: adminUsername, csrfToken, ...(developmentLogin ? { localDevelopment: true } : {}) })
        }
        const session = sessionFor(request)
        if (!session) return send(response, 401, { error: 'Sign in to manage the workspace.', ...(pathname === '/api/admin/session' && localAccess(request) ? { localDevelopment: true } : {}) })
        if (pathname === '/api/admin/session' && request.method === 'GET') return send(response, 200, { username: adminUsername || 'Local developer', csrfToken: session.csrf, ...(localAccess(request) ? { localDevelopment: true } : {}) })
        if (!['GET', 'HEAD'].includes(request.method) && request.headers['x-csrf-token'] !== session.csrf) return send(response, 403, { error: 'Your session could not be verified. Sign in again.' })
        if (pathname === '/api/admin/logout' && request.method === 'POST') {
          database.prepare('DELETE FROM sessions WHERE token_hash=?').run(session.hash)
          response.setHeader('Set-Cookie', cookie('', 0))
          return send(response, 200, { ok: true })
        }
        if (pathname === '/api/admin/database' && request.method === 'GET') return send(response, 200, readWorkspace())
        if (pathname === '/api/admin/database' && request.method === 'PUT') {
          const body = await readJson(request)
          const payload = validateDatabase(body)
          const result = database.prepare('UPDATE workspace SET payload=?, revision=revision+1 WHERE id=1 AND revision=?').run(JSON.stringify(payload), Number(body.revision))
          if (!result.changes) return send(response, 409, { error: 'The workspace changed in another session. Reload before editing again.' })
          return send(response, 200, { ok: true, revision: Number(body.revision) + 1 })
        }
        if (pathname === '/api/admin/upload' && request.method === 'POST') {
          const body = await readJson(request)
          if (typeof body.data !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(body.data) || body.data.length % 4 !== 0) return send(response, 400, { error: 'Invalid image data.' })
          const bytes = Buffer.from(body.data, 'base64')
          if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) return send(response, 413, { error: 'Choose an image smaller than 8 MB.' })
          const type = imageType(bytes)
          if (!type || body.mime !== type.mime) return send(response, 400, { error: 'Choose a PNG, JPEG or WebP image.' })
          const name = `${randomUUID()}.${type.ext}`
          await writeFile(path.join(uploadDirectory, name), bytes, { flag: 'wx', mode: 0o600 })
          return send(response, 201, { path: `/uploads/${name}` })
        }
        return send(response, 404, { error: 'API endpoint not found.' })
      }
      if (!['GET', 'HEAD'].includes(request.method)) return send(response, 405, { error: 'Method not allowed.' })
      const isUpload = pathname.startsWith('/uploads/')
      const root = path.resolve(isUpload ? uploadDirectory : distDirectory)
      const relative = isUpload ? pathname.slice('/uploads/'.length) : pathname.slice(1)
      if (isUpload && !/^[a-f0-9-]+\.(png|jpg|webp)$/.test(relative)) return send(response, 404, { error: 'Image not found.' })
      let filename = path.resolve(root, relative || 'index.html')
      if (filename !== root && !filename.startsWith(root + path.sep)) return send(response, 404, { error: 'File not found.' })
      try { if (!(await stat(filename)).isFile()) throw new Error('Not a file') } catch {
        if (isUpload || path.extname(relative)) return send(response, 404, { error: 'File not found.' })
        filename = path.join(root, 'index.html')
      }
      const bytes = await readFile(filename)
      response.writeHead(200, { 'Content-Type': contentTypes[path.extname(filename)] || 'application/octet-stream', 'Content-Length': bytes.length, 'Cache-Control': isUpload ? 'public, max-age=31536000, immutable' : 'no-cache', ...(isUpload ? { 'Content-Security-Policy': "default-src 'none'; sandbox" } : {}) })
      response.end(request.method === 'HEAD' ? undefined : bytes)
    } catch (error) {
      send(response, error.status || (error instanceof SyntaxError || /^Invalid |^Project media|^Workspace/.test(error.message) ? 400 : 500), { error: error.status || /^Invalid |^Project media|^Workspace/.test(error.message) ? error.message : 'The server could not complete this request.' })
    }
  }
  const server = http.createServer(handler)
  server.requestTimeout = 30_000
  server.headersTimeout = 15_000
  return { server, handler, close: async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); database.close() } }
}
