import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Run before committing/deploying: Vercel reads routing configuration before the build.
export function createVercelConfig(backendOrigin = '') {
  const rewrites = []
  if (backendOrigin) {
    const url = new URL(backendOrigin)
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      throw new Error('Use the backend HTTPS origin only, without credentials, a path, query, or fragment.')
    }
    for (const prefix of ['api', 'uploads']) {
      rewrites.push({ source: `/${prefix}/:path*`, destination: `${url.origin}/${prefix}/:path*` })
    }
  }
  // Only application routes use the SPA shell; missing API/assets must remain errors.
  for (const brand of ['spoorthi', 'tejes', 'admin']) {
    rewrites.push({ source: `/${brand}/:path*`, destination: '/index.html' })
  }
  return { $schema: 'https://openapi.vercel.sh/vercel.json', framework: 'vite', buildCommand: 'npm run build', outputDirectory: 'dist', rewrites }
}

export async function writeVercelConfig(destination, backendOrigin) {
  await writeFile(destination, JSON.stringify(createVercelConfig(backendOrigin), null, 2) + '\n')
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const origin = process.argv[2] || process.env.SPOORTHI_BACKEND_ORIGIN
  if (!origin) throw new Error('Supply the real backend HTTPS origin as an argument or SPOORTHI_BACKEND_ORIGIN. No backend has been configured.')
  const destination = fileURLToPath(new URL('../vercel.json', import.meta.url))
  await writeVercelConfig(destination, origin)
  console.log('Prepared vercel.json API/upload routing. Review and commit it before a separately approved deployment.')
}
