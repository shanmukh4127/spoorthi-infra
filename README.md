# Spoorthi Infra

## Purpose

Spoorthi Infra is a React website with a self-hosted Node administrator server for the Spoorthi Infra and Tejes Interiors experiences.

## Tech stack

- React
- React Router
- Vite
- Oxlint

## Website

- `/` — practice gateway for Spoorthi Infra and Tejes Interiors.
- `/spoorthi` — responsive architecture and construction home page.
- `/spoorthi/civil-construction` and `/spoorthi/design-3d` — services and design process.
- `/spoorthi/projects` — filterable architectural concept collection with individual galleries.
- `/spoorthi/vr` — interactive concept image explorer with viewpoints, zoom, pan, and keyboard controls.
- `/spoorthi/contact` — project planner and validated enquiry preparation.
- `/tejes` — Tejes Interiors home, with interior services and contact routes.

The displayed studies and illustrations are concepts, not completed client projects. Replace them with approved project photography and facts when available.

## Contact configuration

Public contact details are configured in `src/data/shared/contact.js`. The current email is `aarambh634@gmail.com`. The enquiry flow prepares an encoded email draft; the visitor sends it from their email app. Visitors can also prepare, copy, or download a brief without opening email. No server submission endpoint is configured.

Spoorthi enquiry drafts use session storage when available and remain within the current browser tab. The project planner helps prepare a scope; monetary estimates require approved rates in `src/data/spoorthi/estimator.js`.

## Development

`npm run dev` starts the website and its local public-data service together. The Spoorthi home page's three featured project cards work without administrator setup. To enable admin edits, see [server setup and deployment](docs/deployment.md) and `.env.example`. Admin access requires your own configured credentials; no demo password is enabled.

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Verification

```bash
npm run lint
npm run build
npm run preview
```

`npm run preview` serves the built frontend with the local public-data service. `npm start` runs the standalone Node server; without local credentials it enables public viewing only. Production requires server credentials, HTTPS and persistent storage. Static-only hosting cannot provide the APIs. Vite and the Node server supply the SPA fallback for nested routes.
