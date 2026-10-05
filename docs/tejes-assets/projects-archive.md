# Tejes Projects archive

This page presents an illustrative design dossier, not a completed Tejes client project. All unknown business facts remain null in `src/data/tejes/projectArchive.js`. The neutral study titles are replaceable editorial labels.

## Visual assignment

| Section | Asset | Purpose |
| --- | --- | --- |
| Introduction | architecture-light | Architectural lighting detail |
| Signature project | existing featured-residence | Dominant complete interior photograph |
| Project statement | living-detail | Human scale and garden connection |
| Design intent | spatial-detail | Connected living and kitchen composition |
| Development | existing plan/model/VR SVGs + visualization-slot.svg | Explicit replaceable drawing/model/visualization slots |
| Materials | existing seven material macros | Exploratory finish board, not approved project selections |
| Milestone | milestone-view | Wider spatial relationship |
| Project story | living-detail, stone-detail, window-detail | Space, Material, Light annotations |
| Supporting studies | existing kitchen, bedroom, office photographs | Three separate room-specific visual references |
| Final statement | timber-detail | Timber and stone junction |

## Source and resolution

The signature photograph and all seven new detail exports derive from Max Vakhtbovych's camera original (7360 × 4912): https://www.pexels.com/photo/a-marble-top-with-chairs-near-the-living-room-7587858/ . License: https://www.pexels.com/license/ . They are third-party licensed references, not Tejes photographs. Existing room photographs retain their source and credit records in `homeAssets.json` and the existing asset documentation.

The signature master is 3200px wide. Every new detail master is 2560px wide, cropped from original pixels without upscaling. `projectAssets.json` records native crop dimensions, crop bounds, source, credit, license and responsive variants. WebP variants use 480, 800, 1280, 1600, 1920 and 2560px widths; the page selects an appropriate size with `srcset` and `sizes`. Only the signature image loads eagerly. Below-fold images load lazily. SVG slots remain crisp at every size.

Existing material references are illustrative generated macro imagery (1672px native width), used only as small exploratory swatches. They do not establish installed finishes.

## Client content still required

- Approved project name, project type, location, design scope, status and year.
- Actual project photographs, including wide hero and distinct editorial/detail views.
- Approved project statement, specifications, design intent and milestone wording.
- Project drawings, models, rendered views and execution/VR imagery.
- Approved finish palette and verified highlight annotations.
- Approved records and photographs for supporting projects.

Replace data and image records rather than embedding facts in JSX. Supporting records share the signature record shape. An empty `highlights` array intentionally displays a documentation placeholder instead of unverified achievements.

The page's navigation reuses existing Tejes routes. Supporting studies expand an accessible inline dossier; no nonexistent project-detail routes or ignored query parameters are introduced. Shared headers and footers are hidden only when the existing brand layout pathname is `/tejes/projects` (including its trailing-slash variant).
