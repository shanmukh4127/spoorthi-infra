# Tejas connected concept house

Experimental image-based architectural walkthrough, generated 17 October 2026; reviewed 18 October 2026. This is an invented design study, not a completed Tejas client project.

18 October clarity/performance update: dedicated frontal kitchen (2121 × 741), bedroom (1774 × 887) and bathroom (1717 × 916) images now spend their full resolution on individual walls, replacing low-resolution panorama sectors there. Original PNGs are in `originals/*-wall.png`, optimized high-quality native/mobile WebPs are alongside this file, and exact prompts are in `detail-wall-prompts.json`. Remaining panoramic walls now retain native 1774 px on phones as well. The scroll camera uses 85 ms frame-rate-independent easing, reaches the exact scroll-derived pose at rest and stops rendering while idle. Ambient occlusion now runs at half viewport resolution while the main image stays sharp. These changes improve clarity and responsiveness; they do not establish the full photographic acceptance criterion below.

## Current acceptance status

**Movement and interface checks pass; the premium photography visual criterion is not met.** Do not describe this prototype as a photorealistic, fully reconstructed house. The 1774 × 887 source panoramas lack enough angular resolution for large close-up views. Some generated perspectives and baked reflections do not obey the measured geometry. The freestanding furnishings also remain recognizably rasterized. See the complete forward/reverse recordings and the candid review in `docs/tejes-cinematic-qa/house/`.

## Architecture

One Three.js world contains four connected volumes: entrance foyer, open-plan living/dining/kitchen, bedroom with private reading corner, and bathroom. The shared layout is `layout.json`. Real door apertures connect the rooms. The same camera follows a continuous path through these apertures, approaches furniture and joinery, turns back through the house and finishes at a wide interior view. Scene contents do not change at chapter boundaries. There are no chapter background images, scene swaps, image crossfades, camera resets, or autoplay.

The twelve copy entries remain in `src/data/tejes/cinematicJourney.js`. `houseWalkthrough.js` holds 27 spatial controls and twelve nonuniform editorial markers. `houseCameraPath.js` derives the complete pose from native document scroll progress. Unwrapped yaw and pitch avoid a target crossing through the camera during U-turns. Reverse scroll and arbitrary seeks produce the same pose exactly.

Original generated architectural imagery is mapped onto fixed, measured wall surfaces. Floors, ceilings, coves, door walls, frames, freestanding furniture, pendants and kitchen island are physical geometry. This is a constrained hybrid reconstruction; it is not a flat photograph claimed to be navigable 3D. Wall imagery supplies fixed cabinetry, decoration, windows and garden views. It cannot supply correct parallax or live reflections for those photographed objects.

Chapter eight presents an original commercial concept as a framed architectural study inside the house. It does not splice a commercial room into the residential floor plan. The reduced-motion/data-saving/error alternative uses twelve stills captured from the same house, with responsive desktop and portrait compositions. These are lazy-loaded reading illustrations, never the moving background.

## Original generated assets

Built-in OpenAI `image_gen` mode; no API-key CLI fallback, stock image substitution, or temporary remote image URLs. Exact prompts and sources:

- `generation-prompts.json`: four original room panorama prompts.
- `clean-plate-prompts.json`: four edits, referenced to the corresponding generated room, removing freestanding furniture for geometric reconstruction.
- `originals/{main,foyer,bedroom,bathroom}.png`: native generated sources, 1774 × 887.
- `originals/*-clean.png`: generated architectural clean plates, same native size.
- `*-clean-1774.webp` and `*-clean-1280.webp`: responsive runtime wall imagery.
- `stills/01` through `stills/12`, `-desktop.webp` and `-mobile.webp`: rendered views of this connected world for the reading alternative.

The original generation prompts requested a larger equirectangular image. The tool returned 1774 × 887. The native sources are preserved and are not mislabeled as 4K. Generated image approval has not been assumed.

## Depth experiment and rejected approach

Depth Anything V2 Small was run offline against the four generated images. Estimated depth, preview maps and foreground difference masks are retained for reference, but **are not fetched or used by the shipped renderer**. The initial depth-mesh prototype stretched furniture silhouettes and exposed disocclusion gaps during multi-metre camera travel. That approach failed the visual review and was replaced by stable geometric foreground furnishings and exact rectangular wall projection. No AI video generator was available in this session; the delivered WebM files are browser acceptance recordings, not synthesized walkthrough assets.

Depth sources: [official Depth Anything V2](https://github.com/DepthAnything/Depth-Anything-V2) (Small model, Apache 2.0); [ONNX conversion](https://huggingface.co/onnx-community/depth-anything-v2-small). Model weights and Python tools are not application dependencies or runtime downloads.

## Furnishings and surface credits

The room imagery is original AI-generated work. The supplementary furniture geometry is sourced separately and is not claimed to be AI-generated or Tejas-designed. All following furnishing downloads are CC0 according to their source pages and [Innerscene library terms](https://www.innerscene.com/tools/library/terms).

| Local file | Asset and source |
| --- | --- |
| `models/sofa.glb` | [Crescent curved boucle sofa — Innerscene](https://www.innerscene.com/tools/library/3d-parts/crescent-curved-boucle-sofa-90c9ad84) |
| `models/armchair.glb` | [Oak and leather armchair — Vibrant Nordic / Poly Haven, via Innerscene](https://www.innerscene.com/tools/library/3d-parts/oak-and-leather-armchair-346c4879) |
| `models/dining-table.glb` | [MORROW 210 oval oak dining table — Innerscene](https://www.innerscene.com/tools/library/3d-parts/morrow-210-oval-oak-dining-table-0715db09) |
| `models/dining-chair.glb` | [Rue bistro armchair — Innerscene](https://www.innerscene.com/tools/library/3d-parts/rue-bistro-armchair-292cb3d6) |
| `models/coffee-table.glb` | [Marble-top round coffee table — Ulan Cabanilla / Poly Haven, via Innerscene](https://www.innerscene.com/tools/library/3d-parts/marble-top-round-coffee-table-446df690) |
| `../sleigh-bed.glb` | [SWEEP 160 upholstered sleigh bed — Innerscene](https://www.innerscene.com/tools/library/3d-parts/sweep-160-upholstered-sleigh-bed-eb63225c) |

Textures embedded in the five newly downloaded GLBs were resized to at most 1024 px, with opaque maps encoded as JPEG and transparency retained as PNG. Their combined size fell from 24.1 MB to 3.4 MB. Static submeshes are combined by material at load time. Models are normalized to physical widths and staged within the house. Materials are modestly tinted; the images are not altered into false product photographs.

Oak colour, OpenGL normal and roughness maps reuse the existing local CC0 [Poly Haven Wooden Floor 02](https://polyhaven.com/a/wooden_floor_02) assets. World-coordinate floor UVs keep grain scale aligned across thresholds. Stone sample and official Tejas logo reuse Tejas-specific local assets. Existing asset notices remain in `../ASSET-SOURCES.md`. The earlier 12-image collection remains archived in `../photoreal/`; only its commercial study is used as a physical framed print here.

## Performance and teardown

No new application packages. Three.js loaders, material batching and ambient occlusion use the installed dependency. Wall imagery uses 1280 px on mobile and 1774 px on desktop. The camera renders only on scroll, resize and initial load. Shadows are computed once. Pixel density is capped; portrait uses fewer AO samples. Reduced motion, save-data, low device memory and WebGL failure provide the reading alternative. Fetches abort on unmount. Textures, decoded bitmaps, materials, geometry, render targets, shadow maps, postprocessing passes, renderer/context and listeners are released, including late model decodes after abort.

Headless browser emulation is not physical-phone performance certification. The recordings include measured frame times; visual acceptance and a claim of no performance regression remain open. Nothing was committed, pushed or deployed.
