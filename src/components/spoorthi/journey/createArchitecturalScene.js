import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { applyJourneyCamera } from './cameraPath.js'
import { constructionLayout as site } from './constructionLayout.js'
import { loadCinematicAssets } from './loadCinematicAssets.js'
import { pbrProperties, applyWorldUv } from './physicalMaterials.js'

// One continuous civil-construction environment, in metres. This remains an
// illustrative model, not a representation of a verified Spoorthi client site.
// The existing renderer, on-demand drawing and scroll camera architecture stay.
export async function createArchitecturalScene(host) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(43, 1, .1, 280)
  const resources = new Set()
  let disposed = false
  const own = resource => { if (disposed) resource.dispose(); else resources.add(resource); return resource }
  const boxGeometry = own(new THREE.BoxGeometry(1, 1, 1))
  const rodGeometry = own(new THREE.CylinderGeometry(1, 1, 1, 16))
  const batches = new Map()
  const matrix = new THREE.Object3D()
  const modelOrigin = new THREE.Vector3()
  const up = new THREE.Vector3(0, 1, 0)
  let environment
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))
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
    resources.forEach(resource => resource.dispose())
    environment?.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
  }

  try {
    const assets = await loadCinematicAssets(own)
    const material = properties => own(new THREE.MeshStandardMaterial(properties))
    const concrete = applyWorldUv(material({ color: '#ffffff', ...pbrProperties(assets.concrete, renderer, .7), roughness: .95 }), 3)
    const cutConcrete = applyWorldUv(material({ color: '#e8e7e0', ...pbrProperties(assets.concrete, renderer, .45), roughness: .92 }), 3)
    const white = material({ color: '#f5f4ef', roughness: .63 })
    const soil = applyWorldUv(material({ color: '#e4dbc9', ...pbrProperties(assets.soil, renderer, .8), roughness: 1 }), 3.5)
    const metalMaps = pbrProperties(assets.steel, renderer, .3)
    const steel = applyWorldUv(material({ ...metalMaps, map: null, color: '#adb1b1', metalness: .9, roughness: .65 }), 1.8)
    const rebar = applyWorldUv(material({ ...metalMaps, color: '#c5a58d', metalness: .72, roughness: .88 }), 1.8)
    // Facet colours sampled from the official supplied Spoorthi logo.
    const amber = material({ color: '#ee9c22', metalness: .25, roughness: .45 })
    const orange = material({ color: '#e67926', metalness: .15, roughness: .53 })
    const red = material({ color: '#d92927', roughness: .65 })
    const formwork = applyWorldUv(material({ color: '#d1c5af', ...pbrProperties(assets.wood, renderer, .55), roughness: .95 }), .65)
    const glazing = own(new THREE.MeshPhysicalMaterial({ color: '#b7ced5', metalness: .25, roughness: .085, clearcoat: 1, clearcoatRoughness: .08, envMapIntensity: 1.25, transparent: true, opacity: .63, depthWrite: false, side: THREE.DoubleSide }))
    const deepGlazing = material({ color: '#34464e', metalness: .4, roughness: .28 })
    const paving = material({ color: '#dedbd0', roughness: .9 })
    const facadeStone = applyWorldUv(material({ color: '#e9e2d6', ...pbrProperties(assets.concrete, renderer, .16), roughness: .72 }), 2.4)
    const facadeMetal = material({ color: '#555b5d', metalness: .78, roughness: .3 })
    const joint = material({ color: '#595952', roughness: .9 })
    const rounded = new Map()

    // Static construction parts are instanced by geometry and material: detailed
    // reinforcement and scaffold tubes do not become hundreds of draw calls.
    function instance(geometry, mat, shadows = true) {
      const key = `${geometry.id}/${mat.id}/${shadows}`
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

    const pmrem = new THREE.PMREMGenerator(renderer)
    environment = pmrem.fromEquirectangular(assets.hdr)
    scene.environment = environment.texture; scene.environmentIntensity = .65
    scene.background = assets.background
    scene.backgroundRotation.y = scene.environmentRotation.y = Math.PI
    scene.backgroundIntensity = .95
    pmrem.dispose()
    scene.fog = new THREE.Fog('#e4e6df', 95, 230)
    scene.add(new THREE.HemisphereLight('#d5e8f0', '#baa98e', .18))
    // Direction measured from the HDRI's brightest pixel, rotated with the map.
    const sunDirection = new THREE.Vector3(-.5904, .6851, .4267).normalize()
    const sun = new THREE.DirectionalLight('#fff4e0', 2.2)
    sun.position.copy(sunDirection).multiplyScalar(65)
    sun.target.position.set(-8, 0, -5)
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048)
    Object.assign(sun.shadow.camera, { left: -48, right: 48, top: 40, bottom: -40, near: 1, far: 160 })
    sun.shadow.normalBias = .035; sun.shadow.bias = -.0002
    scene.add(sun, sun.target); own(sun)

    // Excavation: the ground is divided around the opening, so the foundations
    // are genuinely below grade and visible rather than buried inside a plane.
    box([360, .4, 360], [0, -1.85, 0], soil, 0, false)
    box([163, 1.45, 360], [-98.5, -.92, 0], soil, 0, false)
    box([163, 1.45, 360], [98.5, -.92, 0], soil, 0, false)
    box([34, 1.45, 163], [0, -.92, -97.5], soil, 0, false)
    box([34, 1.45, 163], [0, -.92, 99.5], soil, 0, false)
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

    // Tower crane: lattice mast, counterweight, jib, trolley, cable and load.
    const craneX = -19; const craneZ = 10
    box([3.8, .9, 3.8], [craneX, -.1, craneZ], concrete)
    for (const dx of [-.55, .55]) for (const dz of [-.55, .55]) rod([craneX + dx, .3, craneZ + dz], [craneX + dx, 24, craneZ + dz], .085, amber)
    for (let y = 1; y < 24; y += 2) {
      for (const dz of [-.55, .55]) {
        rod([craneX - .55, y, craneZ + dz], [craneX + .55, y + 2, craneZ + dz], .045, amber)
        rod([craneX - .55, y + 2, craneZ + dz], [craneX + .55, y, craneZ + dz], .045, amber)
      }
      for (const dx of [-.55, .55]) rod([craneX + dx, y, craneZ - .55], [craneX + dx, y + 2, craneZ + .55], .045, amber)
    }
    box([38, .32, 1.15], [-9, 24.1, craneZ], amber)
    rod([-28, 25.1, craneZ], [10, 25.1, craneZ], .06, amber)
    for (let x = -28; x < 10; x += 2) {
      rod([x, 24.2, craneZ], [x + 1, 25.1, craneZ], .04, amber)
      rod([x + 1, 25.1, craneZ], [x + 2, 24.2, craneZ], .04, amber)
    }
    box([3.2, 1.1, 1.8], [-26, 24.5, craneZ], concrete)
    box([1.3, 1.35, 1.35], [-17.8, 23.7, craneZ], white)
    box([.04, .85, 1.1], [-17.12, 23.8, craneZ], deepGlazing)
    rod([-19, 28.2, craneZ], [-19, 24.3, craneZ], .09, amber)
    rod([-19, 28.2, craneZ], [8, 24.3, craneZ], .035, steel)
    rod([-19, 28.2, craneZ], [-27, 24.3, craneZ], .035, steel)
    rod([-6, 24, craneZ], [-6, 13.3, craneZ], .023, steel)
    box([.45, .55, .35], [-6, 13.2, craneZ], orange)
    rod([-6, 13, craneZ], [-7.5, 11.8, craneZ], .024, steel)
    rod([-6, 13, craneZ], [-4.5, 11.8, craneZ], .024, steel)
    box([4.2, .9, 1.3], [-6, 11.3, craneZ], concrete)

    // Licensed CAD-derived machine replaces every box-built excavator part.
    // Full tracks, hydraulic rams, pivots, cab, counterweight and bucket retained.
    assets.excavator.traverse(mesh => {
      if (!mesh.isMesh) return
      const mat = mesh.material
      if (mesh.name === 'glass') {
        mesh.material = own(new THREE.MeshPhysicalMaterial({ color: '#7c969f', metalness: .22, roughness: .1, clearcoat: 1, envMapIntensity: 1.2 }))
      } else {
        mat.roughnessMap = assets.steel.arm
        mat.normalMap = assets.steel.normal
        mat.normalScale = new THREE.Vector2(.13, .13)
        applyWorldUv(mat, .85)
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
    for (let x = -37; x < -33; x += .55) box([.1, 11.7, .42], [x, 6, -16.1], amber)
    box([9, .06, 8.5], [buildingX, -.07, -12], paving)
    for (let z = -15; z < -7; z += 1.5) box([9, .009, .018], [buildingX, -.03, z], steel, 0, false)
    for (let i = 0; i < 3; i++) box([8.5, .11, .45], [buildingX, -.15 + i * .1, -12.6 - i * .45], cutConcrete)
    modelOrigin.set(0, 0, 0)

    // A photographed clear-day sky supplies coherent light and distant context,
    // rather than unrelated apartment imagery or block-shaped city placeholders.

    for (const { geometry, mat, shadows, transforms } of batches.values()) {
      const mesh = own(new THREE.InstancedMesh(geometry, mat, transforms.length))
      transforms.forEach((transform, index) => mesh.setMatrixAt(index, transform))
      mesh.castShadow = shadows; mesh.receiveShadow = true
      mesh.computeBoundingSphere(); scene.add(mesh)
    }
    const renderTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: Math.min(2, renderer.capabilities.maxSamples) })
    const composer = own(new EffectComposer(renderer, renderTarget))
    composer.addPass(own(new RenderPass(scene, camera)))
    const ambientOcclusion = own(new GTAOPass(scene, camera, 1, 1, undefined, { radius: .65, thickness: .75, distanceFallOff: 1, samples: 8 }, { radius: 4, samples: 8 }))
    ambientOcclusion.blendIntensity = .42
    composer.addPass(ambientOcclusion)
    composer.addPass(own(new OutputPass()))
    function resize() {
      if (disposed) return
      const { width, height } = host.getBoundingClientRect()
      renderer.setSize(Math.max(1, width), Math.max(1, height), false)
      camera.aspect = width / Math.max(1, height); camera.updateProjectionMatrix()
      composer.setSize(Math.max(1, width), Math.max(1, height))
      const ratio = renderer.getPixelRatio()
      ambientOcclusion.setSize(Math.max(1, Math.round(width * ratio * .65)), Math.max(1, Math.round(height * ratio * .65)))
    }
    function update(progress) {
      if (disposed) return
      applyJourneyCamera(camera, progress)
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
    }
    resize(); applyJourneyCamera(camera, 0)
    await renderer.compileAsync(scene, camera)
    renderer.shadowMap.needsUpdate = true
    update(0)
    return { resize, update, dispose }
  } catch (error) {
    dispose()
    throw error
  }
}
