// Data-only asset preparation. Source geometry: vmc-motion/cet200, Apache-2.0.
// Keep the distributed LICENSE and NOTICE beside the exported model.
import fs from 'node:fs/promises'
import { Box3, BufferAttribute, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

const source = '.tmp/civil-assets/source/'
const original = source + 'cet200-original.glb'
try { await fs.access(original) } catch { await fs.copyFile('public/assets/spoorthi/cinematic/cet200-excavator.glb', original) }
const load = async file => {
  const bytes = await fs.readFile(file)
  return (await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')).scene
}
const body = await load(original)
const belt = await load(source + 'crawler-belt.glb')
const material = (name, color, metalness, roughness) => new MeshStandardMaterial({ name, color, metalness, roughness })
const materials = {
  paint: material('Equipment paint', '#ee9c22', .25, .4),
  steel: material('Machined steel', '#62686b', .8, .48),
  chrome: material('Hydraulic chrome', '#c4c8c9', 1, .2),
  cab: material('Cab frame', '#303638', .35, .62),
  glass: material('Cab glazing', '#637e89', .42, .12),
  tracks: material('Track steel', '#424548', .72, .62),
}
function preparedGeometry(mesh) {
  const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld)
  for (const name of Object.keys(geometry.attributes)) if (!['position', 'normal'].includes(name)) geometry.deleteAttribute(name)
  if (!geometry.attributes.normal) geometry.computeVertexNormals()
  // Real dimensions, not a whole-model UV stretch; useful for material detail.
  const pos = geometry.attributes.position; const normal = geometry.attributes.normal
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    const nx = Math.abs(normal.getX(i)); const ny = Math.abs(normal.getY(i)); const nz = Math.abs(normal.getZ(i))
    uv[i * 2] = nx > ny && nx > nz ? pos.getZ(i) : pos.getX(i)
    uv[i * 2 + 1] = ny > nx && ny > nz ? pos.getZ(i) : pos.getY(i)
  }
  geometry.setAttribute('uv', new BufferAttribute(uv, 2))
  return geometry
}
body.updateMatrixWorld(true)
const buckets = new Map()
body.traverse(mesh => {
  if (!mesh.isMesh) return
  let parent = mesh; let path = ''
  while (parent) { path = parent.name + '/' + path; parent = parent.parent }
  if (/Hidden|Collider|VMCLogo/.test(path)) return
  let kind = 'steel'
  if (mesh.material.name === 'Material_3' && !/Bucket\//.test(path)) kind = 'paint'
  if (/CabFrame|CabInterior/.test(path)) kind = 'cab'
  if (/Window_/.test(path)) kind = 'glass'
  if (mesh.material.name === 'Material_2') kind = 'chrome'
  if (!buckets.has(kind)) buckets.set(kind, [])
  buckets.get(kind).push(preparedGeometry(mesh))
})
const output = new Group(); output.name = 'CET200 construction concept'
for (const [kind, geometries] of buckets) {
  const mesh = new Mesh(mergeGeometries(geometries), materials[kind]); mesh.name = kind; output.add(mesh)
}
belt.updateMatrixWorld(true)
const trackParts = []
belt.traverse(mesh => { if (mesh.isMesh) trackParts.push(preparedGeometry(mesh)) })
const trackGeometry = mergeGeometries(trackParts)
trackGeometry.computeBoundingBox()
const center = trackGeometry.boundingBox.getCenter(new Vector3())
trackGeometry.translate(-center.x - .015, -center.y + .42286, -center.z)
for (const z of [-1.1, 1.1]) {
  const mesh = new Mesh(trackGeometry, materials.tracks); mesh.position.z = z; mesh.name = z < 0 ? 'left-track' : 'right-track'; output.add(mesh)
}
output.position.y = -new Box3().setFromObject(output).min.y

// Standard KHR_mesh_quantization reduces transfer size without simplifying a
// single triangle. World-space detail maps are applied by the scene material.
const quantized = new Map()
for (const mesh of output.children) {
  const originalGeometry = mesh.geometry
  if (!quantized.has(originalGeometry)) {
    originalGeometry.computeBoundingBox()
    const minimum = originalGeometry.boundingBox.min.clone()
    const size = originalGeometry.boundingBox.getSize(new Vector3()).max(new Vector3(.0001, .0001, .0001))
    const geometry = originalGeometry.clone()
    const position = geometry.attributes.position; const normals = geometry.attributes.normal
    const p = new Uint16Array(position.count * 3); const n = new Int16Array(normals.count * 3)
    const direction = new Vector3()
    for (let i = 0; i < position.count; i++) {
      for (let axis = 0; axis < 3; axis++) p[i * 3 + axis] = Math.round((position.array[i * 3 + axis] - minimum.getComponent(axis)) / size.getComponent(axis) * 65535)
      direction.set(normals.getX(i) * size.x, normals.getY(i) * size.y, normals.getZ(i) * size.z).normalize()
      for (let axis = 0; axis < 3; axis++) n[i * 3 + axis] = Math.round(direction.getComponent(axis) * 32767)
    }
    geometry.setAttribute('position', new BufferAttribute(p, 3, true))
    geometry.setAttribute('normal', new BufferAttribute(n, 3, true))
    geometry.deleteAttribute('uv')
    quantized.set(originalGeometry, { geometry, minimum, size })
  }
  const prepared = quantized.get(originalGeometry)
  mesh.geometry = prepared.geometry; mesh.position.add(prepared.minimum); mesh.scale.copy(prepared.size)
}

// GLTFExporter uses the browser FileReader protocol; implement just its Blob
// methods for the local Node asset pipeline. No browser or dependency needed.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(value => { this.result = value; this.onloadend?.() }) }
  readAsDataURL(blob) { blob.arrayBuffer().then(value => { this.result = `data:${blob.type};base64,${Buffer.from(value).toString('base64')}`; this.onloadend?.() }) }
}
const bytes = await new GLTFExporter().parseAsync(output, { binary: true, onlyVisible: true })
await fs.writeFile('public/assets/spoorthi/cinematic/cet200-excavator.glb', Buffer.from(bytes))
console.log(`Prepared ${output.children.length} meshes, ${(bytes.byteLength / 1e6).toFixed(2)} MB. Detailed geometry retained; instances share track geometry.`)
