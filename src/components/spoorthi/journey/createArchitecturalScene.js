import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { applyJourneyCamera, originalJourneyEnd } from './cameraPath.js'
import { homeJourney } from '../../../data/spoorthi/homeJourney.js'
import { constructionLayout as site } from './constructionLayout.js'
import { loadCinematicAssets } from './loadCinematicAssets.js'
import { pbrProperties, applyWorldUv } from './physicalMaterials.js'
import { extendConstruction } from './extendedConstruction.js'
import { createFoliageTexture } from './foliageTexture.js'
import { addFinalConstructionStages } from './finalConstructionStages.js'

// One continuous civil-construction environment, in metres. This remains an
// illustrative model, not a representation of a verified Spoorthi client site.
// The existing renderer, on-demand drawing and scroll camera architecture stay.
export async function createArchitecturalScene(host, onProgress, { signal } = {}) {
  const compact = window.matchMedia('(max-width: 767px)').matches
  const useScreenAo = !compact || ((navigator.deviceMemory ?? 0) >= 6 && navigator.hardwareConcurrency >= 6)
  const renderer = new THREE.WebGLRenderer({ antialias: !compact, alpha: false, powerPreference: compact ? 'low-power' : 'high-performance' })
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(43, 1, .1, compact ? 85 : 280)
  const resources = new Set()
  let disposed = false
  let dirty = true
  let lastProgress = -1
  const own = resource => { if (disposed) resource.dispose(); else resources.add(resource); return resource }
  const boxGeometry = own(new THREE.BoxGeometry(1, 1, 1))
  const rodGeometry = own(new THREE.CylinderGeometry(1, 1, 1, compact ? 6 : 10))
  const batches = new Map()
  const matrix = new THREE.Object3D()
  const modelOrigin = new THREE.Vector3()
  const up = new THREE.Vector3(0, 1, 0)
  let environment
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1 : 1.25))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.shadowMap.autoUpdate = false
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = .9
  renderer.info.autoReset = false
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.domElement.setAttribute('aria-hidden', 'true')
  host.appendChild(renderer.domElement)
  const dispose = () => {
    if (disposed) return
    disposed = true
    signal?.removeEventListener('abort', dispose)
    resources.forEach(resource => resource.dispose())
    environment?.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
  }
  signal?.addEventListener('abort', dispose, { once: true })

  try {
    const assets = await loadCinematicAssets(own, progress => onProgress?.(progress * .8), { compact })
    if (signal?.aborted) throw new DOMException('Scene cancelled', 'AbortError')
    const material = properties => own(new THREE.MeshStandardMaterial(properties))
    const concrete = applyWorldUv(material({ color: '#d5d2c9', ...pbrProperties(assets.concrete, renderer, .43), roughness: .96, metalness: 0 }), 3, { variation: .09, grain: .02, weathering: .19, minRoughness: .76 })
    const cutConcrete = applyWorldUv(material({ ...pbrProperties(assets.floor, renderer, .28), map: null, color: '#c5c4bc', roughness: .95, metalness: 0 }), 3.2, { variation: .07, grain: .02, weathering: .13, minRoughness: .74 })
    const white = applyWorldUv(material({ color: '#f5f2e9', ...pbrProperties(assets.plaster, renderer, .18), roughness: .94, metalness: 0 }), 2.5, { variation: .025, grain: .01, weathering: .03, minRoughness: .77 })
    const soil = applyWorldUv(material({ color: '#e4d5be', ...pbrProperties(assets.soil, renderer, .65), roughness: 1, metalness: 0 }), 4.5, { variation: .15, grain: .025, minRoughness: .9 })
    const brick = applyWorldUv(material({ color: '#b58365', ...pbrProperties(assets.plaster, renderer, .5), roughness: 1, metalness: 0 }), .7, { variation: .12, grain: .025, weathering: .12, minRoughness: .85 })
    const metalMaps = pbrProperties(assets.steel, renderer, .16)
    const servicePipe = applyWorldUv(material({ ...metalMaps, map: null, color: '#718489', metalness: .28, roughness: .58 }), .65, { variation: .025, grain: .015, minRoughness: .42 })
    const steel = applyWorldUv(material({ ...metalMaps, map: null, color: '#929d9e', metalness: .94, roughness: .5 }), 1.3, { variation: .04, grain: .015, minRoughness: .32 })
    const rebar = applyWorldUv(material({ ...metalMaps, color: '#9e8c77', metalness: .68, roughness: .88 }), 1.2, { variation: .09, grain: .02, weathering: .2, minRoughness: .66 })
    // Facet colours sampled from the official supplied Spoorthi logo.
    const amber = applyWorldUv(material({ ...metalMaps, map: null, color: '#c99539', metalness: .07, roughness: .58 }), .8, { variation: .04, grain: .015, weathering: .14, minRoughness: .46 })
    const orange = applyWorldUv(material({ ...metalMaps, map: null, color: '#bc783f', metalness: .06, roughness: .66 }), .8, { variation: .04, grain: .015, weathering: .15, minRoughness: .5 })
    const red = material({ color: '#d92927', roughness: .65 })
    const formwork = applyWorldUv(material({ color: '#c6b293', ...pbrProperties(assets.wood, renderer, .4), roughness: .95 }), .65, { variation: .08, weathering: .2, minRoughness: .75 })
    const timber = applyWorldUv(material({ color: '#d7ad76', ...pbrProperties(assets.wood, renderer, .24), roughness: .72 }), .8, { variation: .055, grain: .012, weathering: .035, minRoughness: .5 })
    const glazing = own(new THREE.MeshPhysicalMaterial({ color: '#adc0bf', metalness: 0, roughness: .11, ior: 1.52, clearcoat: .4, clearcoatRoughness: .09, envMapIntensity: 1.05, transparent: true, opacity: .74, depthWrite: false, side: THREE.FrontSide }))
    const finalGlazing = own(glazing.clone())
    const deepGlazing = material({ color: '#263131', metalness: .04, roughness: .78 })
    const paving = applyWorldUv(material({ color: '#e3dfd3', ...pbrProperties(assets.floor, renderer, .21), roughness: .95, metalness: 0 }), 3, { variation: .055, grain: .015, weathering: .06, minRoughness: .77 })
    const asphalt = applyWorldUv(material({ color: '#a6aaa7', ...pbrProperties(assets.asphalt, renderer, .4), roughness: 1, metalness: 0 }), 3, { variation: .09, grain: .018, minRoughness: .88 })
    const facadeStone = applyWorldUv(material({ color: '#e5decc', ...pbrProperties(assets.stone, renderer, .18), roughness: .85, metalness: 0 }), 2.8, { variation: .035, grain: .009, weathering: .025, minRoughness: .52 })
    const facadeMetal = applyWorldUv(material({ ...metalMaps, map: null, color: '#424a49', metalness: .62, roughness: .45 }), .8, { variation: .025, grain: .012, minRoughness: .3 })
    const joint = material({ color: '#595952', roughness: .9 })
    const rubber = material({ color: '#292b29', roughness: .96 })
    const bark = applyWorldUv(material({ color: '#947c58', ...pbrProperties(assets.wood, renderer, .5), roughness: 1 }), .45, { variation: .12, grain: .02, minRoughness: .88 })
    const foliageMap = own(createFoliageTexture())
    const leaf = ['#e0ddc4', '#f0eed9', '#bdc5ab'].map(color => material({ color, map: foliageMap, roughness: .85, metalness: 0, alphaTest: .4, side: THREE.DoubleSide }))
    const rounded = new Map()
    // Keep the scanned/CAD material assignments and authored UVs. Painted
    // machinery is a dielectric coating; exposed rams remain polished metal.
    assets.crane.traverse(mesh => {
      if (!mesh.isMesh) return
      for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        if (/paint/i.test(mat.name)) {
          mat.color.set('#e4d3a7'); mat.metalness = .035; mat.roughness = .52
        }
        mat.envMapIntensity = .95
      }
    })

    function batchModel(source, placements) {
      const bounds = new THREE.Box3().setFromObject(source)
      const center = bounds.getCenter(new THREE.Vector3())
      for (const { at, angle = 0 } of placements) {
        const placed = new THREE.Group()
        const copy = source.clone(true)
        copy.position.sub(new THREE.Vector3(center.x, bounds.min.y, center.z))
        placed.add(copy); placed.position.set(...at); placed.rotation.y = angle
        placed.updateMatrixWorld(true)
        placed.traverse(mesh => {
          if (!mesh.isMesh) return
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          for (const mat of materials) for (const value of Object.values(mat)) if (value?.isTexture) value.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
          const key = `${mesh.geometry.id}/${materials.map(mat => mat.id).join('_')}/true/${Math.floor(at[0] / 24)}/${Math.floor(at[2] / 24)}`
          if (!batches.has(key)) batches.set(key, { geometry: mesh.geometry, mat: mesh.material, shadows: true, transforms: [] })
          batches.get(key).transforms.push(mesh.matrixWorld.clone())
        })
      }
    }

    // Static construction parts are instanced by geometry and material: detailed
    // reinforcement and scaffold tubes do not become hundreds of draw calls.
    function instance(geometry, mat, shadows = true) {
      // Spatial batches allow the renderer to cull distant work areas rather
      // than drawing every scaffold and steel tie for the entire itinerary.
      const key = `${geometry.id}/${mat.id}/${shadows}/${Math.floor((matrix.position.x + modelOrigin.x) / 24)}/${Math.floor((matrix.position.z + modelOrigin.z) / 24)}`
      if (!batches.has(key)) batches.set(key, { geometry, mat, shadows, transforms: [] })
      matrix.position.add(modelOrigin)
      matrix.updateMatrix()
      batches.get(key).transforms.push(matrix.matrix.clone())
    }
    function box(size, at, mat = concrete, angle = 0, shadows = true) {
      const chamfer = [concrete, cutConcrete, white].includes(mat) && Math.min(...size) >= .25
      let geometry = boxGeometry
      if (chamfer) {
        const key = size.join('/')
        if (!rounded.has(key)) rounded.set(key, own(new RoundedBoxGeometry(...size, 1, Math.min(.025, Math.min(...size) * .08))))
        geometry = rounded.get(key)
      }
      matrix.position.set(...at); matrix.scale.set(...(chamfer ? [1, 1, 1] : size)); matrix.rotation.set(0, angle, 0)
      instance(geometry, mat, shadows)
    }
    function rod(from, to, radius = .035, mat = steel) {
      const start = new THREE.Vector3(...from); const end = new THREE.Vector3(...to)
      const direction = end.clone().sub(start)
      matrix.position.copy(start).add(end).multiplyScalar(.5)
      matrix.scale.set(radius, direction.length(), radius)
      matrix.quaternion.setFromUnitVectors(up, direction.normalize())
      instance(rodGeometry, mat)
    }
    function shape(geometry, size, at, mat, rotation = [0, 0, 0]) {
      matrix.position.set(...at); matrix.scale.set(...size); matrix.rotation.set(...rotation)
      instance(geometry, mat)
    }
    const ribGeometry = own(new THREE.TorusGeometry(1, .07, 4, 12))
    function cage(x, z, bottom, top, width = .52) {
      const half = width / 2
      for (const dx of [-half, 0, half]) for (const dz of [-half, half]) rod([x + dx, bottom, z + dz], [x + dx, top, z + dz], .012, rebar)
      if (x === -8.8) for (const dx of [-half, 0, half]) for (const dz of [-half, half]) for (let y = bottom; y < top; y += .085) {
        matrix.position.set(x + dx, y, z + dz); matrix.scale.setScalar(.0125); matrix.rotation.set(Math.PI / 2, 0, 0)
        instance(ribGeometry, rebar)
      }
      for (let y = bottom; y < top; y += .22) {
        rod([x - half, y, z - half], [x + half, y, z - half], .006, rebar)
        rod([x + half, y, z - half], [x + half, y, z + half], .006, rebar)
        rod([x + half, y, z + half], [x - half, y, z + half], .006, rebar)
        rod([x - half, y, z + half], [x - half, y, z - half], .006, rebar)
      }
    }

    const pmrem = own(new THREE.PMREMGenerator(renderer))
    environment = pmrem.fromEquirectangular(assets.hdr)
    scene.environment = environment.texture; scene.environmentIntensity = .78
    scene.background = assets.background
    scene.backgroundRotation.y = scene.environmentRotation.y = Math.PI
    scene.backgroundIntensity = .95
    // Mobile draws the current work area; natural haze conceals its shorter
    // distance limit before detailed machines would enter the far clip plane.
    scene.fog = new THREE.Fog('#dce2df', compact ? 55 : 125, compact ? 85 : 260)
    scene.add(new THREE.HemisphereLight('#dce8ec', '#a28e73', .24))
    // Direction measured from the HDRI's brightest pixel, rotated with the map.
    const sunDirection = new THREE.Vector3(-.5904, .6851, .4267).normalize()
    const sun = new THREE.DirectionalLight('#fff4e5', 1.85)
    sun.position.copy(sunDirection).multiplyScalar(65)
    sun.target.position.set(-16, 0, -12)
    sun.position.add(sun.target.position)
    sun.castShadow = true; sun.shadow.mapSize.set(compact ? 1024 : 2048, compact ? 1024 : 2048)
    Object.assign(sun.shadow.camera, { left: -85, right: 85, top: 85, bottom: -85, near: .1, far: 210 })
    sun.shadow.normalBias = .025; sun.shadow.bias = -.00015; sun.shadow.radius = 1.6
    scene.add(sun, sun.target); own(sun)

    // Excavation: the ground is divided around the opening, so the foundations
    // are genuinely below grade and visible rather than buried inside a plane.
    box([360, .4, 360], [0, -1.85, 0], soil, 0, false)
    box([163, 1.45, 360], [-98.5, -.92, 0], soil, 0, false)
    // Retain the original ground around the new open utilities corridor.
    box([18, 1.45, 360], [26, -.92, 0], soil, 0, false)
    box([124, 1.45, 360], [118, -.92, 0], soil, 0, false)
    box([21, 1.45, 197], [45.5, -.92, -81.5], soil, 0, false)
    box([21, 1.45, 157], [45.5, -.92, 101.5], soil, 0, false)
    box([34, 1.45, 163], [0, -.92, -97.5], soil, 0, false)
    // Cut out a second genuine excavation on the approach (x -3..17, z 23..43).
    box([34, 1.45, 139], [0, -.92, 112.5], soil, 0, false)
    box([14, 1.45, 26], [-10, -.92, 30], soil, 0, false)
    box([20, 1.45, 6], [7, -.92, 20], soil, 0, false)
    box([26.4, .25, 20.4], [0, -.13, -3], concrete)
    for (const x of site.columnsX) for (const z of [...site.structuralRowsZ, 9]) {
      box([2.7, .42, 2.7], [x, -1.4, z], cutConcrete)
      box([1.25, .55, 1.25], [x, -.92, z], concrete)
      if (z === 9) {
        box([.68, 1.5, .68], [x, .1, z], concrete)
        cage(x, z, .7, site.frontCageTop(x))
        for (let offset = -1; offset <= 1; offset += .25) {
          rod([x - 1.1, -1.16, z + offset], [x + 1.1, -1.16, z + offset], .01, rebar)
          rod([x + offset, -1.14, z - 1.1], [x + offset, -1.14, z + 1.1], .01, rebar)
        }
      }
    }
    for (const x of [-12, -6, 0, 6, 12]) box([.45, .42, 18], [x, -.86, 0], concrete)
    // Two storeys of reinforced-concrete columns, downstand beams and slabs.
    for (const y of [2.05, 6.45]) for (const x of site.columnsX) for (const z of site.structuralRowsZ) box([site.columnWidth, 4.1, site.columnWidth], [x, y, z], concrete)
    for (const floor of site.floorsY) {
      box(site.slabSize, [0, floor, site.slabCenterZ], concrete)
      for (const z of [-9, -3, 3]) box([26, .62, .52], [0, floor - .31, z], concrete)
      for (const x of [-12, -6, 0, 6, 12]) box([.52, .62, 19], [x, floor - .31, -3], concrete)
      // Temporary edge protection, with toe boards and two horizontal rails.
      for (let x = -12; x <= 12; x += 3) rod([x, floor + .17, 7.15], [x, floor + 1.25, 7.15], .03, orange)
      for (const y of [floor + .68, floor + 1.2]) rod([-12.5, y, 7.15], [12.5, y, 7.15], .026, orange)
      box([25.4, .16, .045], [0, floor + .27, 7.15], formwork)
    }
    // Exposed roof reinforcement and a close engineering detail beside the path.
    for (const x of [-12, -6, 0, 6, 12]) cage(x, -9, 8.9, 10.4)
    box([2.4, .55, 2.4], [-8.8, .28, -6.5], cutConcrete)
    cage(-8.8, -6.5, .55, 3.7, .68)
    for (let x = -11; x <= 11; x += .65) rod([x, 8.94, -11.5], [x, 8.94, -4.2], .017, rebar)
    for (let z = -11.5; z <= -4.2; z += .65) rod([-11, 8.97, z], [11, 8.97, z], .017, rebar)
    // Site-formwork stacks, safely beside the route rather than in its way.
    for (let y = .18; y < .75; y += .11) box([3.5, .075, 1.3], [-13.8, y, 13.8], formwork)
    for (let x = 5; x < 10; x += .2) rod([x, -.05, 15], [x, -.05, 18.5], .06, rebar)

    // Tube-and-coupler scaffold with actual diagonal bracing and work platforms.
    for (const z of [-11, -9, -7, -5, -3, -1, 1, 3, 5]) {
      for (const x of [13.9, 15.1]) {
        rod([x, -.15, z], [x, 10.8, z], .024, steel)
        box([.3, .07, .3], [x, -.17, z], steel)
        for (let y = 2; y <= 10; y += 2) rod([x, y - .045, z], [x, y + .045, z], .036, steel)
      }
      for (const y of [2, 4, 6, 8, 10]) rod([13.9, y, z], [15.1, y, z], .024, steel)
    }
    for (let z = -11; z < 5; z += 2) for (let y = 0; y < 10; y += 2) {
      rod([15.1, y, z], [15.1, y + 2, z + 2], .024, steel)
      rod([15.1, y + 2, z], [15.1, y, z + 2], .024, steel)
      rod([13.9, y + 2, z], [13.9, y + 2, z + 2], .024, steel)
    }
    for (const y of [2.05, 4.05, 6.05, 8.05]) {
      for (const x of [14.05, 14.34, 14.63, 14.92]) box([.25, .065, 16.5], [x, y, -3], formwork)
      for (const offset of [.6, 1.1]) rod([15.1, y + offset, -11], [15.1, y + offset, 5], .024, steel)
    }

    // Downloaded CC0 crane: lattice, ladders, slew ring, cab, winches,
    // handrails, counterweights, trolley and hoist. No mesh decimation.
    batchModel(assets.crane, [{ at: [-8, -.2, 10] }])

    // Scanned site props retain their original metre scale; repeated bags
    // and perimeter panels share geometry/materials through instancing.
    const cementPlacements = []
    for (let layer = 0; layer < 4; layer++) for (let x = 0; x < 3; x++) for (let z = 0; z < 2; z++) cementPlacements.push({ at: [-10.5 + x * .48, .01 + layer * .175, 5 + z * .7], angle: layer % 2 ? Math.PI : 0 })
    batchModel(assets.cement, cementPlacements)
    batchModel(assets.generator, [{ at: [11, .02, 5.3], angle: -.4 }])
    const fencePanel = assets.fence.getObjectByName('modular_chainlink_fence_double')
    const fencePost = assets.fence.getObjectByName('modular_chainlink_fence_post')
    const panels = []; const posts = []
    for (let z = -18; z <= 18; z += 1.95) {
      panels.push({ at: [30, -.14, z], angle: Math.PI / 2 })
      posts.push({ at: [30, -.2, z - .975] })
    }
    batchModel(fencePanel, panels); batchModel(fencePost, posts)
    // Licensed CAD-derived machine replaces every box-built excavator part.
    // Full tracks, hydraulic rams, pivots, cab, counterweight and bucket retained.
    assets.excavator.traverse(mesh => {
      if (!mesh.isMesh) return
      let mat = mesh.material
      if (mesh.name === 'glass') {
        mesh.material = own(new THREE.MeshPhysicalMaterial({ color: '#61797d', metalness: .04, roughness: .12, ior: 1.52, clearcoat: .4, envMapIntensity: 1.05 }))
      } else if (mesh.name === 'chrome') {
        mat.color.set('#bcc4c4'); mat.metalness = 1; mat.roughness = .18; mat.envMapIntensity = 1.1
      } else {
        if (mesh.name === 'paint') {
          mat = own(new THREE.MeshPhysicalMaterial({ color: '#d1a13d', metalness: .06, roughness: .56, clearcoat: .22, clearcoatRoughness: .35 }))
          mesh.material = mat
        }
        mat.roughnessMap = assets.steel.arm
        mat.normalMap = assets.steel.normal
        mat.normalScale = new THREE.Vector2(.1, .1)
        applyWorldUv(mat, .85, { variation: .045, grain: .018, weathering: .35, minRoughness: mesh.name === 'paint' ? .46 : .52 })
      }
      if (!mesh.geometry.attributes.uv) mesh.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(mesh.geometry.attributes.position.count * 2), 2))
    })
    assets.excavator.position.add(new THREE.Vector3(19, -.2, 14)); scene.add(assets.excavator)

    // Photogrammetry-scanned concrete barriers, with original PBR imperfections.
    const barrierBounds = new THREE.Box3().setFromObject(assets.barrier)
    const barrierCenter = barrierBounds.getCenter(new THREE.Vector3())
    assets.barrier.traverse(mesh => {
      if (!mesh.isMesh) return
      mesh.material.aoMap = mesh.material.roughnessMap
      mesh.material.aoMapIntensity = .65
      for (const value of Object.values(mesh.material)) if (value?.isTexture) value.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    })
    for (const x of [-13, -9, -5, 0, 5]) {
      const barrier = assets.barrier.clone(true)
      barrier.position.set(x - barrierCenter.x, -.2 - barrierBounds.min.y, 20 - barrierCenter.z)
      scene.add(barrier)
    }
    // A corrugated site cabin, with recessed windows and a usable door step.
    box([6.5, 2.9, 3.5], [25, 1.3, -7], white)
    box([6.7, .18, 3.7], [25, 2.86, -7], cutConcrete)
    box([2.1, 1.05, .05], [24, 1.65, -5.2], deepGlazing)
    box([.95, 2.25, .06], [27, .98, -5.2], steel)
    box([.18, .8, .18], [21.4, .3, -5.1], red)
    for (let x = 21.9; x <= 28; x += .22) box([.045, 2.75, .05], [x, 1.3, -5.22], cutConcrete)
    box([1.3, .18, .65], [27, -.06, -4.85], concrete)
    rod([27.32, 1.1, -5.12], [27.32, 1.32, -5.12], .018, steel)

    // The result is a completed modern BUILDING exterior, in the same world.
    // The final camera turn reveals its facade; no scene or image is switched.
    modelOrigin.set(-14, 0, -7)
    const buildingX = -28; const buildingZ = -25
    box([25.4, .4, 18.5], [buildingX, -.15, buildingZ], paving)
    // A finished site apron, scored paving and drainage distinguish the reveal
    // from the adjacent live construction ground without changing the camera.
    box([39, .12, 31], [buildingX, -.22, buildingZ + 1], paving)
    for (let x = -46; x <= -10; x += 2) box([.014, .008, 30], [x, -.153, buildingZ + 1], joint, 0, false)
    for (let z = -38; z <= -9; z += 2) box([38, .008, .014], [buildingX, -.152, z], joint, 0, false)
    // Recessed commercial floor plates and service core give real depth behind
    // the curtain wall. No furniture or decorative interior imagery is used.
    box([8, 11.7, 5], [buildingX, 5.8, -29], cutConcrete)
    box([23, 12, .3], [buildingX, 6, -32.5], cutConcrete)
    for (const y of [.12, 4.1, 8.1, 12.1]) box([24, .28, 17], [buildingX, y, buildingZ], white)
    for (let x = -38.7; x <= -17.2; x += 3.05) {
      box([.09, 12, .18], [x, 6, -16.3], facadeMetal)
      for (const y of [2.1, 6.1, 10.1]) box([2.8, 3.6, .08], [x + 1.5, y, -16.4], glazing)
      for (const y of [4.1, 8.1, 12.1]) box([3, .55, .15], [x + 1.5, y - .24, -16.3], facadeMetal)
      for (const y of [2.8, 6.8, 10.8]) box([2.95, .045, .13], [x + 1.5, y, -16.28], facadeMetal)
      for (const y of [4.1, 8.1]) box([2.8, .045, .14], [x + 1.5, y - .2, -16.32], steel)
    }
    for (let z = -32.5; z <= -18; z += 3) {
      box([.18, 12, .09], [-15.9, 6, z], facadeMetal)
      for (const y of [2.1, 6.1, 10.1]) box([.08, 3.6, 2.75], [-15.96, y, z + 1.4], glazing)
      for (const y of [4.1, 8.1, 12.1]) box([.15, .55, 2.95], [-15.88, y - .24, z + 1.4], facadeMetal)
      for (const y of [2.8, 6.8, 10.8]) box([.13, .045, 2.95], [-15.86, y, z + 1.4], facadeMetal)
      for (const y of [4.1, 8.1]) box([.14, .045, 2.75], [-15.88, y - .2, z + 1.4], steel)
    }
    // Recessed stone piers with panel joints, sun-control blades, copings and
    // service grilles provide construction-scale facade detail at close range.
    for (const z of [-31.05, -22.05]) {
      box([.46, 11.85, .72], [-15.65, 5.96, z], facadeStone)
      box([.48, .1, .76], [-15.65, 11.96, z], steel)
      for (let y = 1; y < 11.8; y += 1.2) box([.012, .012, .73], [-15.411, y, z], joint)
    }
    for (let z = -29; z < -25.4; z += .45) box([.52, 7.7, .055], [-15.6, 8, z], facadeMetal)
    for (let z = -31.8; z < -29.9; z += .14) box([.14, .06, .07], [-15.8, 3.4, z], facadeMetal)
    box([24.25, .16, 17.25], [buildingX, 12.35, buildingZ], facadeStone)
    box([24.35, .06, 17.35], [buildingX, 12.46, buildingZ], steel)
    box([7.5, .2, 3.5], [buildingX, 3.8, -15.1], white)
    box([7.6, .055, 3.6], [buildingX, 3.93, -15.1], facadeMetal)
    for (const x of [-29.1, -28, -26.9]) {
      box([.055, 3, .11], [x, 1.52, -16.15], facadeMetal)
      box([1.02, 2.9, .06], [x + .54, 1.52, -16.18], glazing)
      rod([x + .88, 1.1, -16.05], [x + .88, 1.65, -16.05], .014, steel)
    }
    box([3.4, .07, .15], [-28, 3.05, -16.12], facadeMetal)
    for (const x of [-31.3, -24.7]) box([.19, 3.7, .19], [x, 1.85, -13.7], cutConcrete)
    for (let x = -37; x < -33; x += .55) box([.1, 11.7, .42], [x, 6, -16.1], timber)
    box([9, .06, 8.5], [buildingX, -.07, -12], paving)
    for (let z = -15; z < -7; z += 1.5) box([9, .009, .018], [buildingX, -.03, z], steel, 0, false)
    for (let i = 0; i < 3; i++) box([8.5, .11, .45], [buildingX, -.15 + i * .1, -12.6 - i * .45], cutConcrete)
    modelOrigin.set(0, 0, 0)

    extendConstruction({ box, rod, cage, batchModel, shape, own, assets, compact,
      materials: { concrete, cutConcrete, soil, steel, rebar, formwork, timber, asphalt, amber, orange, white, glazing, facadeMetal, facadeStone, paving, joint, rubber, leaf, bark },
    })
    addFinalConstructionStages({ box, rod, shape, batchModel, own, assets, compact,
      materials: { concrete, cutConcrete, steel, formwork, timber, amber, orange, white, glazing: finalGlazing, deepGlazing, facadeStone, facadeMetal, paving, joint, soil, brick, servicePipe, rubber, leaf, bark },
    })

    // A photographed clear-day sky supplies coherent light and distant context,
    // rather than unrelated apartment imagery or block-shaped city placeholders.

    for (const { geometry, mat, shadows, transforms } of batches.values()) {
      const mesh = own(new THREE.InstancedMesh(geometry, mat, transforms.length))
      transforms.forEach((transform, index) => mesh.setMatrixAt(index, transform))
      mesh.castShadow = shadows; mesh.receiveShadow = true
      mesh.computeBoundingSphere(); scene.add(mesh)
    }
    // Two static reflection probes capture the actual neighbouring architecture,
    // ground, trees and equipment. Bake once while loading, never during scroll.
    const shadowEnabled = renderer.shadowMap.enabled
    renderer.shadowMap.enabled = false
    glazing.visible = finalGlazing.visible = false
    try {
      for (const [index, [glass, at]] of [[glazing, [-42, 6, -21]], [finalGlazing, [35.5, 6, -25]]].entries()) {
        const target = own(new THREE.WebGLCubeRenderTarget(compact ? 64 : 128, { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter }))
        const probe = new THREE.CubeCamera(.3, 70, target)
        probe.position.set(...at)
        probe.update(renderer, scene)
        const reflection = own(pmrem.fromCubemap(target.texture))
        glass.envMap = reflection.texture
        glass.needsUpdate = true
        onProgress?.(.8 + (index + 1) * .025)
      }
    } finally {
      glazing.visible = finalGlazing.visible = true
      renderer.shadowMap.enabled = shadowEnabled
    }
    const renderTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: compact ? 0 : Math.min(2, renderer.capabilities.maxSamples) })
    const composer = own(new EffectComposer(renderer, renderTarget))
    composer.addPass(own(new RenderPass(scene, camera)))
    const ambientOcclusion = own(new GTAOPass(scene, camera, 1, 1, undefined, { radius: .45, thickness: .6, distanceFallOff: 1, samples: compact ? 4 : 8 }, { radius: 4, samples: compact ? 4 : 8 }))
    ambientOcclusion.blendIntensity = compact ? .28 : .48
    if (useScreenAo) composer.addPass(ambientOcclusion)
    composer.addPass(own(new OutputPass()))
    function resize() {
      if (disposed) return
      dirty = true
      const { width, height } = host.getBoundingClientRect()
      renderer.setSize(Math.max(1, width), Math.max(1, height), false)
      camera.aspect = width / Math.max(1, height); camera.updateProjectionMatrix()
      composer.setSize(Math.max(1, width), Math.max(1, height))
      const ratio = renderer.getPixelRatio()
      const aoScale = compact ? .35 : .65
      ambientOcclusion.setSize(Math.max(1, Math.round(width * ratio * aoScale)), Math.max(1, Math.round(height * ratio * aoScale)))
    }
    function update(progress) {
      if (disposed || (!dirty && progress === lastProgress)) return
      dirty = false
      lastProgress = progress
      applyJourneyCamera(camera, progress)
      // A subtle late-afternoon warmth develops toward the final reveal.
      // All lighting is a function of scroll, so reverse travel is identical.
      const finish = THREE.MathUtils.smoothstep(Math.min(1, progress / originalJourneyEnd), .7, 1)
      renderer.toneMappingExposure = .9 + finish * .045
      sun.color.setRGB(1, .94 - finish * .035, .84 - finish * .07)
      // Original lighting stays unchanged through chapter 12. The same sun
      // follows the added campus with its direction and shadow quality intact.
      const shadowX = -16 + THREE.MathUtils.smoothstep(progress, originalJourneyEnd, .7) * 66
      if (sun.target.position.x !== shadowX) {
        sun.target.position.x = shadowX
        sun.position.copy(sunDirection).multiplyScalar(65).add(sun.target.position)
        sun.target.updateMatrixWorld()
        renderer.shadowMap.needsUpdate = true
      }
      const started = performance.now()
      renderer.info.reset()
      composer.render()
      const canvas = renderer.domElement
      canvas.dataset.progress = progress.toFixed(6)
      canvas.dataset.cameraPosition = camera.position.toArray().map(value => value.toFixed(6)).join(',')
      canvas.dataset.cameraRotation = camera.quaternion.toArray().map(value => value.toFixed(6)).join(',')
      canvas.dataset.cameraFov = camera.fov.toFixed(6)
      canvas.dataset.drawCalls = renderer.info.render.calls
      canvas.dataset.triangles = renderer.info.render.triangles
      canvas.dataset.renderMs = (performance.now() - started).toFixed(2)
      canvas.dataset.quality = compact ? 'mobile' : 'desktop'
      canvas.dataset.materialProfile = 'architectural-pbr-v2'
      canvas.dataset.reflectionProbes = '2'
      canvas.dataset.ambientOcclusion = useScreenAo ? 'gtao-and-material' : 'material'
    }
    resize(); applyJourneyCamera(camera, 0)
    await renderer.compileAsync(scene, camera)
    if (disposed) throw new DOMException('Scene cancelled', 'AbortError')
    renderer.shadowMap.needsUpdate = true
    // Upload distant geometry and warm material/postprocessing variants while
    // the poster is visible. Entering a new area must not stall the first frame.
    const chapters = homeJourney.stages.length
    for (let chapter = 0; chapter < chapters; chapter++) {
      if (disposed) throw new DOMException('Scene cancelled', 'AbortError')
      update((chapter + .5) / chapters)
      onProgress?.(.85 + (chapter + 1) / chapters * .15)
      await new Promise(resolve => requestAnimationFrame(resolve))
    }
    update(0)
    return { resize, update, dispose }
  } catch (error) {
    dispose()
    throw error
  }
}
