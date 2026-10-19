import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { localWorkspacePlugin } from './server/vite-api.mjs'
import { literalAdminEnvironment } from './server/environment.mjs'

// Both local commands start their own public data service. Administrator writes
// remain disabled until the user configures real credentials in .env.
export default defineConfig(({ mode }) => ({
  plugins: [react(), localWorkspacePlugin({ ...loadEnv(mode, process.cwd(), ''), ...literalAdminEnvironment(process.cwd(), mode), ...process.env }, process.cwd())],
  server: {
    watch: { ignored: ['**/storage/**', '**/.tmp/spoorthi-qa/**'] },
  },
}))
