import path from 'node:path'
import { isLocalDevelopmentRequest } from './local-development.mjs'

// The public data service starts with Vite, so the normal single-command local
// workflow cannot leave the home-page project grid waiting for a second server.
export function localWorkspacePlugin(environment, root) {
  const attach = async (vite, development = false) => {
    // SSR/test consumers use middleware mode without a listening HTTP server.
    if (!vite.httpServer) return
    const { createApp } = await import('./app.mjs')
    const dataDirectory = path.resolve(environment.SPOORTHI_DATA_DIR || path.join(root, 'storage'))
    const app = await createApp({
      dataDirectory,
      distDirectory: path.join(root, 'dist'),
      seedPath: path.join(root, 'src/data/adminDatabase.json'),
      adminUsername: environment.SPOORTHI_ADMIN_USERNAME,
      passwordHash: environment.SPOORTHI_ADMIN_PASSWORD_HASH,
      origin: environment.PUBLIC_ORIGIN || 'http://localhost:5173',
      secureCookies: false,
      allowUnconfiguredAdmin: true,
      localDevelopmentAccess: development && vite.config.mode === 'development' ? isLocalDevelopmentRequest : undefined,
      developmentOrigins: () => {
        const address = vite.httpServer.address()
        const port = address && typeof address === 'object' ? address.port : 5173
        return [`http://localhost:${port}`, `http://127.0.0.1:${port}`, `http://[::1]:${port}`]
      },
    })
    vite.watcher?.unwatch(dataDirectory)
    vite.middlewares.use((request, response, next) => {
      const pathname = (request.url || '').split('?')[0]
      if (pathname.startsWith('/api/') || pathname.startsWith('/uploads/')) return app.handler(request, response)
      next()
    })
    vite.httpServer.once('close', () => { void app.close() })
  }
  return { name: 'local-shared-workspace', configureServer: vite => attach(vite, true), configurePreviewServer: vite => attach(vite) }
}
