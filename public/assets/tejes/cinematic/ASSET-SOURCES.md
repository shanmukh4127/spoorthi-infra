# Tejas cinematic interior asset sources

The current connected-house implementation and its original generation prompts, additional CC0 furnishings, rendering approach and visual limitations are documented in [house/README.md](house/README.md). The gallery and photographic layers described below are earlier experiments retained for provenance; they are not the current moving environment.

These are conceptual environments, not TEJAS client projects. No source author endorses TEJAS.

## Imported 3D models
- **The White Room**, Jay-Artist. Source: https://benedikt-bitterli.me/resources/ ; original https://blendswap.com/blend/5014 . Converted glTF: https://github.com/ErfanMo77/gltf-research-scenes/tree/main/scenes/living-room-2 . Licence: CC BY 3.0, https://creativecommons.org/licenses/by/3.0/ . Local: living-room.glb. Original notice: WHITE-ROOM-LICENSE.txt.
- **Country Kitchen**, Jay-Artist. Source: https://benedikt-bitterli.me/resources/ ; original https://www.blendswap.com/blends/view/42851 . Converted glTF: https://github.com/ErfanMo77/gltf-research-scenes/tree/main/scenes/kitchen . Licence: CC BY 3.0, https://creativecommons.org/licenses/by/3.0/ . Local: kitchen.glb. Original notice: KITCHEN-LICENSE.txt.
- **SWEEP 160 — Upholstered Sleigh Bed**, Innerscene. Source: https://www.innerscene.com/tools/library/3d-parts/sweep-160-upholstered-sleigh-bed-eb63225c . Download: https://www.innerscene.com/api/library/sweep-160-upholstered-sleigh-bed-eb63225c/download . CC0 dedication: https://www.innerscene.com/tools/library/terms . Local: sleigh-bed.glb.

## Modifications
Living room and kitchen meshes were deduplicated, welded, simplified with a bounded geometric error, and quantized. Textures were resized to at most 1024px and converted to WebP. Source shells are hidden in the runtime. Furniture is arranged within a new open architectural gallery; selected surfaces are recoloured. Furnishing meshes are reused for the second seating composition and workstation. The upholstered bed is uniformly scaled to fit the sleeping area. No source geometry was used for the gateway or Spoorthi.

## Existing local assets
- Official supplied wordmark: /assets/tejes/brand/wordmark.svg, displayed without distortion or recolouring.
- Material and fallback images: /assets/tejes/reference/*.webp, reused from the existing Tejas library. Existing provenance is recorded under docs/tejes-assets and src/data/tejes/homeAssets.json. These images are illustrative.
- New shell, joinery, lighting and planning drawing: authored in createInteriorScene.js for this experience.

## Runtime
Three.js and its GLTFLoader, RoomEnvironment and RoundedBoxGeometry are reused from the existing dependency (MIT). No new application dependency was added. Temporary model-processing tools are not application dependencies and are not required to run or build the application.

## Seamless PBR floor
Wooden Floor 02, Poly Haven. Source: https://polyhaven.com/a/wooden_floor_02 . API manifest: https://api.polyhaven.com/files/wooden_floor_02 . CC0: https://polyhaven.com/license . Local 1K JPEG colour, OpenGL normal and roughness maps: oak-color.jpg, oak-normal.jpg, oak-roughness.jpg. Repeated at architectural scale, with a warm tint and reduced normal strength.



## Original photographic concept collection (visual upgrade)
All 12 chapter images are newly generated original AI concepts. Sources, exact prompts, native PNGs, responsive WebP derivatives and crop metadata are in the photoreal/ subdirectory. These supersede the previous reused fallback imagery for this homepage. They are explicitly separate from the live 3D spatial study and are not presented as actual Tejas projects.

