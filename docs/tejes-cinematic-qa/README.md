# Tejas cinematic journey — verification

**Current implementation:** see [the connected-house review](house/README.md). The report below describes the earlier gallery implementation. It does not establish acceptance of the later AI-image reconstruction.

Tested 17 October 2026 in local Chrome.

## Checks completed
- Exactly 12 chapters, with editable copy and camera anchors in `src/data/tejes/cinematicJourney.js`.
- All chapters visited with native document scrolling in forward and reverse directions at 1440×1000, 1024×768, 390×844 and 375×812. No horizontal overflow.
- Deterministic camera poses, arbitrary seeks, continuity, shell clearance and portrait framing: automated Node tests pass.
- Chapter menu, keyboard chapter controls, dialog focus containment and Escape-to-close pass.
- Closing Get in Touch action navigates to the existing `/tejes/contact` route.
- Reduced motion presents all 12 illustrated chapters without creating a WebGL canvas. All fallback images load.
- Simulated WebGL creation failure exposes the full illustrated story and Retry 3D action.
- A separate native-mobile run mounts and disposes the scene three times, with no unexpected console errors or failed requests. JavaScript heaps after forced collection: 29,938,536; 30,161,880; 30,193,872 bytes. The small settling increase is not evidence of an ongoing leak. GPU memory was not directly measured.
- Production build passes. Vite retains its chunk-size advisory for shared Three.js/application bundles.
- Tejas camera tests and all nine existing Spoorthi camera regression tests pass (12 tests total).

## Issues found and fixed
- Source emissive light panels washed out the environment: hidden in the runtime; lighting rebalanced.
- Nonseamless floor sample: replaced with CC0 seamless Poly Haven colour, normal and roughness maps.
- Upholstery photograph: replaced with a woven normal texture.
- Material library display lacked supports: brass supports added.
- Imported mesh transforms for the office furniture: preserved world transforms when recomposing meshes.
- A queued scroll callback could observe an unmounted root during contact navigation: guarded detached refs and verified three mount/unmount cycles with zero unexpected errors.
- Reading-mode menu focus could scroll back to the masthead: preventScroll applied and chapter seek verified.

## Evidence
`results.json` contains the four-viewport run, including the earlier detached-ref error and the intentional WebGL-failure console messages. `lifecycle.json` records the clean verification after the navigation fix. Screenshot contact sheets cover all twelve chapters at each requested width; individual PNGs provide full-size evidence.

## Rendering and scope
This is real-time rasterized PBR, with desktop screen-space ambient occlusion, soft directional shadows, warm area lights, and a reversible scroll camera. It is not an offline path-traced render. Mobile caps pixel density and omits the desktop ambient-occlusion pass. Low-memory devices, data-saving mode, reduced motion, and WebGL failure have an illustrated reading fallback.

Only the Tejas homepage integration and new Tejas-specific components, styles, assets, data, tests and this evidence folder were authored for this request. Existing uncommitted gateway changes were preserved. No routes, inner pages or Spoorthi source/assets were edited. Nothing was committed, pushed or deployed.

Asset sources, original licence notices and adaptations: `public/assets/tejes/cinematic/ASSET-SOURCES.md`.
