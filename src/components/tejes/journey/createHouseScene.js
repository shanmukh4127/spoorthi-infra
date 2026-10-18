import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import layout from '../../../../public/assets/tejes/cinematic/house/layout.json'
import { applyHouseCamera } from './houseCameraPath.js'
import { projectRoomArchitecture } from './reconstructHouseRoom.js'

const base = '/assets/tejes/cinematic/house/'
export async function createHouseScene(host, onProgress, signal) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#c1ad91')
  const camera = new THREE.PerspectiveCamera(65, 1, .035, 65)
  const mobile = innerWidth < 700
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = .94
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.shadowMap.autoUpdate = false
  host.appendChild(renderer.domElement)
  let disposed = false, lastProgress = 0, loaded = 0, composer, ao
  const textures = new Set(), geometries = new Set(), materials = new Set(), targets = new Set(), objects = []
  function retain(object) {
    object.traverse(o => {
      if (o.geometry) geometries.add(o.geometry)
      for (const material of o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []) {
        materials.add(material)
        Object.values(material).forEach(v => { if (v?.isTexture) textures.add(v) })
      }
    })
    return object
  }
  const register = object => { retain(object); scene.add(object); return object }
  function dispose() {
    if (disposed) return
    disposed = true
    signal.removeEventListener('abort', dispose)
    scene.traverse(o => o.shadow?.map?.dispose())
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose())
    textures.forEach(t => { t.image?.close?.(); t.dispose() }); targets.forEach(t => t.dispose())
    composer?.passes.forEach(p => p.dispose()); composer?.dispose()
    renderer.renderLists.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove()
    delete host.__tejasHouse
  }
  signal.addEventListener('abort', dispose, { once: true })
  const check = () => { if (disposed) throw new DOMException('Aborted', 'AbortError') }
  async function texture(url, data = false) {
    const response = await fetch(url, { signal })
    if (!response.ok) throw Error(`Unable to load house texture: ${response.status}`)
    const bitmap = await createImageBitmap(await response.blob(), { imageOrientation: 'flipY' })
    if (disposed) { bitmap.close(); check() }
    const result = new THREE.Texture(bitmap)
    result.colorSpace = data ? THREE.NoColorSpace : THREE.SRGBColorSpace
    result.needsUpdate = true
    result.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    textures.add(result); return result
  }
  const standard = settings => { const m = new THREE.MeshStandardMaterial(settings); materials.add(m); return m }
  function box(w, h, d, x, y, z, material, rounded = 0) {
    const geometry = rounded ? new RoundedBoxGeometry(w, h, d, 3, rounded) : new THREE.BoxGeometry(w, h, d)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z); mesh.receiveShadow = true
    return register(mesh)
  }
  try {
    const pmrem = new THREE.PMREMGenerator(renderer), environment = new RoomEnvironment()
    const reflection = pmrem.fromScene(environment, .04)
    targets.add(reflection); scene.environment = reflection.texture; scene.environmentIntensity = .65
    environment.dispose(); pmrem.dispose()
    scene.add(new THREE.HemisphereLight('#fff3df', '#9b8a79', .7))
    const sun = new THREE.DirectionalLight('#ffeed8', 2.1)
    sun.position.set(7, 11, -1); sun.target.position.set(-1, 0, 5); sun.castShadow = true
    sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048)
    Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 13, bottom: -13, near: .5, far: 35 })
    sun.shadow.bias = -.0003; sun.shadow.normalBias = .016
    scene.add(sun, sun.target)
    const [oak, normal, roughness] = await Promise.all([
      texture('/assets/tejes/cinematic/oak-color.jpg'), texture('/assets/tejes/cinematic/oak-normal.jpg', true), texture('/assets/tejes/cinematic/oak-roughness.jpg', true),
    ])
    for (const t of [oak, normal, roughness]) { t.wrapS = t.wrapT = THREE.RepeatWrapping }
    const floor = standard({ map: oak, normalMap: normal, roughnessMap: roughness, normalScale: new THREE.Vector2(.22, .22), roughness: .78, color: '#b6a087' })
    const plaster = standard({ color: '#cfc4b4', roughness: .92 })
    const ceiling = standard({ color: '#e2d9c9', roughness: .95 })
    const walnut = standard({ color: '#6c4937', roughness: .5 })
    const bronze = standard({ color: '#9e7f51', roughness: .34, metalness: .72 })
    const stoneImage = await texture(`${base}marble-surface.webp`)
    const stone = standard({ color: '#c4b6a5', map: stoneImage, roughness: .28 })
    const glow = new THREE.MeshBasicMaterial({ color: '#ffe5b3', toneMapped: false })
    materials.add(glow)

    async function roomMesh(room) {
      const image = await texture(`${base}${room.id}-clean-1774.webp`)
      image.wrapS = THREE.RepeatWrapping
      check()
      // Photographic architectural surfaces stay fixed in the world. Floors,
      // ceilings, portal walls and all freestanding furniture are real geometry.
      const feature = {
        main: { id: 'kitchen-wall', axis: 2, plane: room.min[2], width: 11, center: [0, 1.6, -5.5], rotation: 0 },
        bedroom: { id: 'bedroom-wall', axis: 2, plane: room.max[2], width: 6.4, center: [1.2, 1.6, 11.5], rotation: Math.PI },
        bathroom: { id: 'bathroom-wall', axis: 0, plane: room.max[0], width: 6, center: [8.4, 1.6, 8.5], rotation: -Math.PI / 2 },
      }[room.id]
      const geometry = projectRoomArchitecture(room, { segments: mobile ? 40 : 72, rows: mobile ? 20 : 32, omitWalls: feature ? [feature] : [] })
      register(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: image, side: THREE.FrontSide, toneMapped: false })))
      if (feature) {
        // A dedicated frontal image spends its full resolution on one wall,
        // instead of stretching a small sector of a 360-degree panorama.
        const map = await texture(`${base}${feature.id}-${mobile ? 'mobile' : 'native'}.webp`)
        const crop = { main: .015, bedroom: .06, bathroom: .04 }[room.id]
        map.offset.y = crop; map.repeat.y = 1 - crop
        const wall = register(new THREE.Mesh(new THREE.PlaneGeometry(feature.width, 3.2), new THREE.MeshBasicMaterial({ map, toneMapped: false })))
        wall.position.set(...feature.center); wall.rotation.y = feature.rotation
      }
      const cx = (room.min[0] + room.max[0]) / 2, cz = (room.min[2] + room.max[2]) / 2
      const w = room.max[0] - room.min[0], d = room.max[2] - room.min[2]
      const floorGeometry = new THREE.PlaneGeometry(w, d)
      floorGeometry.rotateX(-Math.PI / 2); floorGeometry.translate(cx, -.002, cz)
      const vertices = floorGeometry.getAttribute('position'), uv = floorGeometry.getAttribute('uv')
      for (let i = 0; i < vertices.count; i++) uv.setXY(i, vertices.getX(i) / 3, -vertices.getZ(i) / 3)
      const floorMesh = register(new THREE.Mesh(floorGeometry, room.id === 'bathroom' ? stone : floor))
      floorMesh.receiveShadow = true
      box(w, .06, d, cx, room.max[1] + .03, cz, ceiling)
      // Perimeter coves: a restrained warm line, recessed behind plaster lips.
      for (const sign of [-1, 1]) {
        box(w - .28, .055, .13, cx, 3.08, cz + sign * (d / 2 - .13), plaster)
        box(w - .4, .014, .025, cx, 3.12, cz + sign * (d / 2 - .2), glow)
        box(.13, .055, d - .28, cx + sign * (w / 2 - .13), 3.08, cz, plaster)
        box(.025, .014, d - .4, cx + sign * (w / 2 - .2), 3.12, cz, glow)
      }
      // Entire portal walls are built to measured apertures. This avoids a
      // photograph of a doorway sitting behind the physical doorway.
      const planes = new Set(room.portals.map(p => `${p.axis}:${p.plane}`))
      for (const key of planes) {
        const [axis, plane] = key.split(':').map(Number), across = axis === 2 ? 0 : 2
        const openings = room.portals.filter(p => p.axis === axis && p.plane === plane).sort((a, b) => a.range[0] - b.range[0])
        const segment = (lo, hi, bottom, top) => {
          if (hi - lo < .001 || top <= bottom) return
          const x = axis === 2 ? (lo + hi) / 2 : plane, z = axis === 2 ? plane : (lo + hi) / 2
          box(axis === 2 ? hi - lo : .09, top - bottom, axis === 2 ? .09 : hi - lo, x, (top + bottom) / 2, z, plaster)
        }
        let edge = room.min[across]
        for (const p of openings) {
          segment(edge, p.range[0], 0, room.max[1]); segment(p.range[0], p.range[1], p.height, room.max[1]); edge = p.range[1]
        }
        segment(edge, room.max[across], 0, room.max[1])
      }
      loaded++; onProgress(Math.round(loaded / 10 * 90))
    }
    await Promise.all(layout.rooms.slice(0, 2).map(roomMesh))
    await Promise.all(layout.rooms.slice(2).map(roomMesh))
    const doorKeys = new Set()
    for (const room of layout.rooms) for (const portal of room.portals) {
      const key = `${portal.axis}:${portal.plane}:${portal.range.join(',')}`
      if (doorKeys.has(key)) continue
      doorKeys.add(key)
      const middle = (portal.range[0] + portal.range[1]) / 2, width = portal.range[1] - portal.range[0]
      if (portal.axis === 2) {
        for (const edge of portal.range) box(.10, portal.height, .20, edge, portal.height / 2, portal.plane, walnut)
        box(width + .10, .12, .20, middle, portal.height + .03, portal.plane, walnut)
        box(width, .012, .23, middle, .006, portal.plane, bronze)
      } else {
        for (const edge of portal.range) box(.20, portal.height, .10, portal.plane, portal.height / 2, edge, walnut)
        box(.20, .12, width + .10, portal.plane, portal.height + .03, middle, walnut)
        box(.23, .012, width, portal.plane, .006, middle, bronze)
      }
    }
    const loader = new GLTFLoader()
    async function model(name, url, width) {
      const response = await fetch(url, { signal })
      if (!response.ok) throw Error(`Unable to load interior furnishing: ${name}`)
      const gltf = await loader.parseAsync(await response.arrayBuffer(), base)
      let source = gltf.scene
      if (disposed) {
        source.traverse(o => {
          o.geometry?.dispose()
          for (const m of o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []) {
            Object.values(m).forEach(t => { if (t?.isTexture) { t.image?.close?.(); t.dispose() } }); m.dispose()
          }
        }); check()
      }
      retain(source)
      // These furnishings are static. Combine their many small submeshes by
      // material before cloning chairs, retaining all original UVs and normals.
      const meshes = []
      source.traverse(o => { if (o.isMesh) meshes.push(o) })
      if (meshes.every(o => !o.isSkinnedMesh && !Array.isArray(o.material) && !Object.keys(o.geometry.morphAttributes).length)) {
        source.updateMatrixWorld(true)
        const groups = new Map(), flattened = new THREE.Group()
        for (const mesh of meshes) {
          const key = `${mesh.material.uuid}:${Object.keys(mesh.geometry.attributes).sort().join(',')}:${!!mesh.geometry.index}`
          if (!groups.has(key)) groups.set(key, { material: mesh.material, parts: [] })
          groups.get(key).parts.push(mesh.geometry.clone().applyMatrix4(mesh.matrixWorld))
        }
        for (const { material, parts } of groups.values()) {
          const merged = mergeGeometries(parts)
          parts.forEach(g => g.dispose())
          if (!merged) throw Error(`Unable to prepare furnishing: ${name}`)
          flattened.add(new THREE.Mesh(merged, material))
        }
        source = retain(flattened)
      }
      const bounds = new THREE.Box3().setFromObject(source), size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3())
      const factor = width / size.x
      source.scale.setScalar(factor)
      source.position.set(-center.x * factor, -bounds.min.y * factor, -center.z * factor)
      const template = new THREE.Group(); template.add(source)
      template.traverse(o => { if (o.isMesh) {
        o.castShadow = true; o.receiveShadow = true
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          if (name === 'sofa' && /textile/i.test(m.name)) m.color.set('#b9a18d')
          if (name === 'armchair' && /pillow/i.test(m.name)) m.color.set('#886277')
        }
      } })
      loaded++; onProgress(Math.min(94, Math.round(loaded / 10 * 90)))
      return (x, z, rotation = 0, y = 0) => {
        const instance = template.clone(true)
        instance.position.set(x, y, z); instance.rotation.y = rotation; register(instance)
        const bounds = new THREE.Box3().setFromObject(instance)
        objects.push({ name, min: bounds.min.toArray(), max: bounds.max.toArray() })
        return instance
      }
    }
    const [sofa, armchair, table, chair, coffee, bed] = await Promise.all([
      model('sofa', `${base}models/sofa.glb`, 2.64), model('armchair', `${base}models/armchair.glb`, .82),
      model('dining-table', `${base}models/dining-table.glb`, 2.1), model('dining-chair', `${base}models/dining-chair.glb`, .64),
      model('coffee-table', `${base}models/coffee-table.glb`, 1.3), model('bed', '/assets/tejes/cinematic/sleigh-bed.glb', 1.83),
    ])
    sofa(4.15, -.55, -Math.PI / 2)
    armchair(3.35, 1.6, Math.PI * .88)
    armchair(2.3, -2.25, .25)
    coffee(2.8, -.6)
    table(-3.15, -1.9)
    for (const x of [-3.78, -2.52]) { chair(x, -2.72, 0); chair(x, -1.08, Math.PI) }
    chair(-4.55, -1.9, Math.PI / 2); chair(-1.75, -1.9, -Math.PI / 2)
    bed(.3, 10.05, Math.PI)
    armchair(2.85, 10.4, -.6)

    // The open kitchen has actual stone edges, cabinet reveals and hardware.
    const island = box(3.1, .83, 1.04, 0, .47, -3.7, walnut, .035); island.castShadow = true
    box(3.2, .065, 1.16, 0, .92, -3.7, stone, .026).castShadow = true
    box(2.94, .12, .86, 0, .065, -3.7, walnut)
    for (const x of [-1.025, 0, 1.025]) {
      box(.99, .65, .018, x, .5, -3.17, walnut, .008)
      box(.48, .012, .025, x, .78, -3.15, bronze, .004)
    }
    // A slim console makes the foyer legible while keeping its walking line clear.
    box(.38, .72, 1.85, -4.88, .4, 8.1, walnut, .025).castShadow = true
    box(.43, .045, 1.93, -4.88, .79, 8.1, stone, .014)
    box(.38, .72, 1.5, 3.98, .4, 10.6, walnut, .025)
    // Physical pendant above the dining table, rather than a pasted silhouette.
    const pendant = register(new THREE.Mesh(new THREE.TorusGeometry(.55, .022, 8, 64), bronze))
    pendant.rotation.x = Math.PI / 2; pendant.position.set(-3.15, 2.35, -1.9)
    for (const x of [-3.48, -2.82]) box(.008, .8, .008, x, 2.75, -1.9, bronze)
    const light = new THREE.PointLight('#ffe1b1', 12, 5, 2); light.position.set(-3.15, 2.3, -1.9); scene.add(light)
    // Chapter eight is explicitly a concept print, spatially part of this wall.
    const commercial = await texture('/assets/tejes/cinematic/photoreal/08-workspace-1280.webp')
    const print = new THREE.MeshBasicMaterial({ map: commercial, toneMapped: false })
    const frame = standard({ color: '#382a31', roughness: .6 })
    const study = register(new THREE.Mesh(new THREE.PlaneGeometry(1.75, .985), print))
    study.position.set(3.6, 1.7, 5.37); study.rotation.y = Math.PI
    box(1.84, 1.075, .045, 3.6, 1.7, 5.41, frame)
    // Contact shading grounds the furniture without a continuously running loop.
    composer = new EffectComposer(renderer)
    ao = new SSAOPass(scene, camera, 512, 512, mobile ? 8 : 12)
    ao.kernelRadius = .32; ao.minDistance = .001; ao.maxDistance = .08
    composer.addPass(new RenderPass(scene, camera)); composer.addPass(ao); composer.addPass(new OutputPass())
    renderer.shadowMap.needsUpdate = true
    renderer.info.autoReset = false
    const runtime = {
      resize() { if (disposed) return; const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix(); ao.setSize(Math.max(1, Math.round(w * .5)), Math.max(1, Math.round(h * .5))) },
      update(progress) { if (disposed) return; lastProgress = Math.max(0, Math.min(1, progress)); applyHouseCamera(camera, lastProgress); renderer.info.reset(); composer.render() },
      dispose,
      inspect() { return { progress: lastProgress, position: camera.position.toArray(), quaternion: camera.quaternion.toArray(), fov: camera.fov, drawCalls: renderer.info.render.calls, triangles: renderer.info.render.triangles, memory: { ...renderer.info.memory }, rooms: layout.rooms.map(r => r.id), furniture: objects } },
    }
    if (import.meta.env.DEV) host.__tejasHouse = runtime
    runtime.resize(); runtime.update(0); onProgress(100)
    return runtime
  } catch (error) { dispose(); throw error }
}
