# Shared Spoorthi / Tejes server

The repository includes a self-hosted Node.js server. Adding the code does **not** deploy it to the internet. Static-only hosting cannot run the database or upload endpoints.

## Local setup

Use Node.js 24.13 or later. Node's built-in SQLite currently emits an experimental-feature warning. No hosted database account or paid service is required.

For the usual laptop workflow, run `npm run dev`. Vite now starts the shared public-data service automatically. The Spoorthi home page's three featured cards, collection and detail pages work without an administrator account. `npm run preview` also includes the local data service after a build. Neither command enables a demo password.

Administrator setup is optional for public viewing:

For password-free laptop administration, run `npm run dev` in development mode and use `localhost:5173/admin` (or the loopback IP on port 5173). Enter the configured administrator username; a password is not required in this mode. An incorrect username is rejected, and the server issues a session cookie only after a matching username. Local development login is available only when both socket addresses are loopback, the Host matches that port, and no forwarding or cross-site headers are present. Saves and uploads still require the session CSRF token and matching Origin. This convenience is never enabled by `npm run preview` or the standalone server, including production; those require the credentials below. LAN access and other ports require normal sign-in. Signing out clears the session and returns to the username gate.

1. Run `npm ci` (and `npm run build` if using the built app).
2. Run `npm run admin:hash` in an interactive terminal. Enter a unique password of at least 14 characters; input is hidden. Copy the resulting scrypt hash, not the password.
3. Copy `.env.example` to `.env`. Set your own `SPOORTHI_ADMIN_USERNAME` and `SPOORTHI_ADMIN_PASSWORD_HASH`. There is no default administrator or production password.
4. For the full local app, keep `PUBLIC_ORIGIN=http://localhost:3001`, `NODE_ENV=development`, and run `npm start`. Visit that origin. Node serves the frontend, APIs and uploaded images.
5. Alternatively, run `npm run dev` alone for Vite hot reload. It reads the same server-only `.env` credentials and data directory and serves `/api` and `/uploads` within the Vite process. No separate server on port 3001 is required. Local API writes accept the actual localhost/127.0.0.1 port, including Vite's alternate port if the preferred one is occupied. For a phone accessing the laptop over the LAN, configure `PUBLIC_ORIGIN` to the actual LAN origin.

Production startup refuses missing administrator configuration. Local viewing remains available without credentials, while admin endpoints show a setup message and reject reads/writes/uploads. Credentials and sessions are never embedded in the client bundle or saved in localStorage. The old `admin / 123` demo login has been removed.

## Production setup still required

Choose one Node-capable server or container host with a persistent disk. Configure these server-only environment variables:

- `NODE_ENV=production`
- `PUBLIC_ORIGIN=https://your-exact-domain.example` without a trailing slash
- `SPOORTHI_ADMIN_USERNAME` and `SPOORTHI_ADMIN_PASSWORD_HASH`
- `SPOORTHI_DATA_DIR` as an absolute path on a writable persistent disk
- `HOST=127.0.0.1` behind a host proxy, or `0.0.0.0` inside a private container network
- `PORT=3001` or the chosen internal port

Terminate HTTPS at a reverse proxy and forward the website, `/api`, and `/uploads` to Node. Keep the Node port private. Production sessions use Secure, HttpOnly, SameSite=Strict cookies, so plain HTTP is insufficient. The server verifies the exact Origin and a session CSRF token for admin writes. Preserve those headers in the proxy.

For example, after configuring the domain and DNS, a Caddy reverse proxy can use:

```caddy
your-domain.example {
    reverse_proxy 127.0.0.1:3001
}
```

The Dockerfile builds the frontend and runs Node as a non-root user. Mount a persistent volume at `/app/storage`; supply credentials and origin at runtime. `.env` must not be baked into the image. Docker build and public deployment have not been performed by this change.

## Persistence, migration and backup

On the first start with a new data directory, the server reads `src/data/adminDatabase.json` and merges saved projects with the static concept catalogs. Existing saved projects are preserved. Review the seed before a public launch: existing enquiry records and profile content may be illustrative. Startup never rewrites the source JSON. Subsequent starts use SQLite rather than re-importing seed data. Old browser-only changes are not automatically trusted or imported; retain/export any browser-only records before switching.

`SPOORTHI_DATA_DIR` contains `workspace.sqlite`, SQLite WAL/SHM companion files, and the `uploads/` directory. Back up this whole directory together. For a simple consistent backup, stop Node, copy the entire directory, then restart. Restore the full directory to the configured volume; keep backups private and test restoration.

New uploads use authenticated endpoints, server-generated names, PNG/JPEG/WebP signature validation and an 8 MB limit. They live outside `dist`, so frontend rebuilds do not remove them. Keep existing `public/assets/projects/` assets in the deployment too, because older records can reference them. Portfolio media URLs are public, not confidential storage. Deleting a record retains uploaded files to avoid breaking other projects.

This is a single-instance SQLite/filesystem design. Ephemeral/serverless disks and independent replicas are unsupported; they need a deliberate shared database/storage deployment.

Draft and deleted records are excluded on the server before public responses are sent. Static studies have persisted overrides, so unpublishing/deleting one cannot revive it via a static fallback. Home, collection and detail pages read the public response. Service failure shows an unavailable state rather than publishing browser-local copies. Revision checks prevent an older admin session from overwriting newer saved data. On a conflict/save failure, the UI provides a recovery copy and requires reloading saved data.

Sessions last eight hours and expire on a server restart. Restart after changing the configured password hash to revoke sessions. Login attempts are limited by the connecting IP; behind a proxy, that is normally the proxy's address, so the limit is shared. Add per-client throttling at the proxy if needed. Do not blindly trust user-supplied forwarding headers.

## Verification and remaining boundaries

Run `npm run lint`, `npm run build`, and `npm run test:server`. Tests use isolated temporary databases and cover authentication, CSRF/origin, throttling, publication, uploads, concurrent revisions and restart persistence. The saved seed is checked for changes.

Contact forms still prepare email/download drafts; delivery is not connected to the admin inbox. Analytics are unconnected and labeled accordingly. No mail/analytics vendor, paid account, public deployment or live administrator credential was created.

## Vercel frontend with the existing persistent Node backend

The frontend can be served by Vercel, but `server/start.mjs` must run separately on a Node-capable host with persistent storage. Vercel's static Vite output does not run the local Vite API plugin. Without a backend connection, `/api/public/projects` returns an error and the public project lists correctly remain unavailable. Do not replace that response with a static catalog: it would bypass saved Draft/deleted publication overrides.

The committed `vercel.json` restores direct links under `/spoorthi`, `/tejes`, and `/admin`. It intentionally does not rewrite `/api`, `/uploads`, or missing assets to HTML. The backend HTTPS address has not been supplied, so API/upload proxy rules are not yet configured.

Once the real backend is hosted, prepare its connection **before** committing or deploying. In PowerShell, set `SPOORTHI_BACKEND_ORIGIN` to that backend's actual HTTPS origin (no path, credentials, query, or fragment), then run:

```powershell
node scripts/configure-vercel-backend.mjs
```

Alternatively pass the real HTTPS origin as the script's first argument. The script writes explicit external rewrites for `/api/:path*` and `/uploads/:path*` ahead of SPA routes. Review the resulting `vercel.json`; no push or deployment is performed by the script. Vercel reads this configuration before its build, so running the script inside `npm run build` would be too late. Setting an environment variable on Vercel alone does not generate those rewrites.

Use Vercel's Vite preset, build command `npm run build`, and output `dist`. On the separate Node host, configure production credentials, persistent `SPOORTHI_DATA_DIR`, and `PUBLIC_ORIGIN` to the exact public Vercel frontend origin. Keep the existing Origin and CSRF checks enabled. API calls and uploads stay on the frontend origin through external rewrites; the existing host-only Secure session cookies do not require browser CORS changes. Preserve request Origin, cookies, CSRF headers, and response Set-Cookie in any additional backend reverse proxy. The backend must send its existing `Cache-Control: no-store` on public project and admin responses so publication changes are not served from a stale cache.

Migrate the local SQLite workspace and `uploads/` together if existing locally added projects must appear online. Do not commit storage or copy administrator/enquiry data into a public JSON snapshot. Keep required legacy `public/assets/projects/` assets with the frontend build. The initial source seed is used only for a new empty backend database; it is not the same as the current local SQLite workspace.

After a separately approved deployment, verify:

- Direct navigation and refresh on a project detail route return the SPA, while nonexistent API/assets remain errors.
- `/api/public/projects` returns JSON with the intended published records; Draft/deleted and homepage-disabled projects stay excluded from their intended surfaces.
- Every selected homepage project has its own 2D, 3D, and final-output scroll story at phone and desktop widths. Reduced-motion mode exposes the reading view.
- Uploaded images load through `/uploads`, and admin login/save/upload/logout retain session, CSRF, and publication behavior.

No backend address, hosting account, persistent disk, credentials, push, or deployment has been created by this preparation.
