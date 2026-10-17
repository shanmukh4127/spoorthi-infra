// Offline, data-only preparation of permissively licensed construction models.
// Supply SPOORTHI_PYTHON when Pillow is installed in a non-default interpreter.
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { Box3, Group, Mesh, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

const source = '.tmp/civil-assets/source'
const destination = 'public/assets/spoorthi/cinematic'
globalThis.ProgressEvent = class { constructor(type, data) { Object.assign(this, { type }, data) } }
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(value => { this.result = value; this.onloadend?.() }) }
  readAsDataURL(blob) { blob.arrayBuffer().then(value => { this.result = `data:${blob.type};base64,${Buffer.from(value).toString('base64')}`; this.onloadend?.() }) }
}
const convert = (from, to) => execFileSync(process.env.SPOORTHI_PYTHON || 'python', ['-c',
  'from PIL import Image; import sys; im=Image.open(sys.argv[1]); im.thumbnail((1024,1024),Image.Resampling.LANCZOS); im.save(sys.argv[2],quality=93,method=6)', from, to])
const unpack = bytes => {
  const size = bytes.readUInt32LE(12)
  return { json: JSON.parse(bytes.toString('utf8', 20, 20 + size)), binary: bytes.subarray(28 + size) }
}
const { json: original, binary } = unpack(await fs.readFile(path.join(source, 'tower-crane.glb')))
const geometryOnly = structuredClone(original)
geometryOnly.buffers[0].uri = `data:application/octet-stream;base64,${binary.toString('base64')}`
delete geometryOnly.images; delete geometryOnly.textures; delete geometryOnly.samplers
delete geometryOnly.extensionsRequired
for (const material of geometryOnly.materials) {
  delete material.pbrMetallicRoughness.baseColorTexture
  delete material.extensions
}
const crane = (await new GLTFLoader().parseAsync(JSON.stringify(geometryOnly), '')).scene
crane.updateMatrixWorld(true)
const bounds = new Box3().setFromObject(crane)
const center = bounds.getCenter(new Vector3())
const parts = new Map()
crane.traverse(object => {
  if (!object.isMesh) return
  const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld)
  geometry.translate(-center.x, -bounds.min.y, -center.z)
  for (const attribute of Object.keys(geometry.attributes)) if (!['position', 'normal', 'uv'].includes(attribute)) geometry.deleteAttribute(attribute)
  const key = object.material.name
  if (!parts.has(key)) parts.set(key, { material: object.material, geometries: [] })
  parts.get(key).geometries.push(geometry)
})
const output = new Group(); output.name = 'CC0 tower crane — metre scale'
for (const [name, part] of parts) {
  const mesh = new Mesh(mergeGeometries(part.geometries), part.material); mesh.name = name; output.add(mesh)
}
const exported = unpack(Buffer.from(await new GLTFExporter().parseAsync(output, { binary: true })))
const folder = path.join(destination, 'crane'); await fs.mkdir(folder, { recursive: true })
const materialIndex = new Map(original.materials.map((material, index) => [material.name, index]))
for (const mesh of exported.json.meshes) for (const primitive of mesh.primitives) {
  primitive.material = materialIndex.get(exported.json.materials[primitive.material].name)
}
exported.json.materials = structuredClone(original.materials)
// Cab glazing keeps reflections without a second full-scene transmission pass.
for (const material of exported.json.materials) if (material.name === 'Original clear glazing') {
  delete material.extensions.KHR_materials_transmission
  material.pbrMetallicRoughness.baseColorFactor = [.32, .44, .49, 1]
  material.pbrMetallicRoughness.metallicFactor = .4
}
exported.json.textures = original.textures
exported.json.samplers = original.samplers
exported.json.extensionsUsed = original.extensionsUsed.filter(value => value !== 'KHR_materials_transmission')
exported.json.extensionsRequired = original.extensionsRequired
exported.json.images = []
for (const [index, image] of original.images.entries()) {
  const view = original.bufferViews[image.bufferView]
  const temporary = path.join(source, `crane-image-${index}.png`)
  await fs.writeFile(temporary, binary.subarray(view.byteOffset, view.byteOffset + view.byteLength))
  const uri = `surface-${index}.webp`
  convert(temporary, path.join(folder, uri))
  exported.json.images.push({ uri, mimeType: 'image/webp' })
}
exported.json.buffers[0].uri = 'tower-crane.bin'
await fs.writeFile(path.join(folder, 'tower-crane.bin'), exported.binary)
await fs.writeFile(path.join(folder, 'tower-crane.gltf'), JSON.stringify(exported.json))
console.log(`Crane: ${crane.children.length} root parts → ${output.children.length} material groups; dimensions ${bounds.getSize(new Vector3()).toArray().map(value => value.toFixed(2)).join(' × ')} m`)

for (const kind of ['cement_bag', 'portable_generator', 'modular_chainlink_fence']) {
  const input = path.join(source, kind)
  const target = path.join(destination, kind)
  await fs.mkdir(target, { recursive: true })
  const json = JSON.parse(await fs.readFile(path.join(input, `${kind}.gltf`), 'utf8'))
  if (kind === 'modular_chainlink_fence') {
    // Ship the two actual modules used by the site, not the exploded catalogue
    // of gates, spare hinges and corner fittings. Their full detail is retained.
    const selected = json.nodes.filter(node => ['modular_chainlink_fence_double', 'modular_chainlink_fence_post'].includes(node.name))
    json.meshes = selected.map(node => json.meshes[node.mesh])
    json.nodes = selected.map((node, mesh) => ({ ...node, mesh }))
    json.scenes = [{ nodes: [0, 1] }]
    const accessors = new Set()
    for (const mesh of json.meshes) for (const primitive of mesh.primitives) {
      accessors.add(primitive.indices)
      Object.values(primitive.attributes).forEach(index => accessors.add(index))
    }
    const accessorMap = new Map([...accessors].map((index, next) => [index, next]))
    json.accessors = [...accessors].map(index => json.accessors[index])
    const views = new Set(json.accessors.map(accessor => accessor.bufferView))
    const viewMap = new Map([...views].map((index, next) => [index, next]))
    const binary = await fs.readFile(path.join(input, json.buffers[0].uri))
    const chunks = []; let offset = 0
    json.bufferViews = [...views].map(index => {
      const view = json.bufferViews[index]
      const bytes = binary.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength)
      const next = { ...view, buffer: 0, byteOffset: offset }
      const padding = (4 - bytes.length % 4) % 4
      chunks.push(bytes, Buffer.alloc(padding)); offset += bytes.length + padding
      return next
    })
    for (const accessor of json.accessors) accessor.bufferView = viewMap.get(accessor.bufferView)
    for (const mesh of json.meshes) for (const primitive of mesh.primitives) {
      primitive.indices = accessorMap.get(primitive.indices)
      for (const attribute of Object.keys(primitive.attributes)) primitive.attributes[attribute] = accessorMap.get(primitive.attributes[attribute])
    }
    json.buffers[0].byteLength = offset
    await fs.writeFile(path.join(target, json.buffers[0].uri), Buffer.concat(chunks))
  }
  for (const image of json.images) {
    const originalUri = image.uri
    image.uri = path.basename(originalUri).replace(/\.(jpg|png)$/i, '.webp')
    image.mimeType = 'image/webp'
    convert(path.join(input, originalUri), path.join(target, image.uri))
  }
  if (kind !== 'modular_chainlink_fence') for (const buffer of json.buffers) await fs.copyFile(path.join(input, buffer.uri), path.join(target, buffer.uri))
  await fs.writeFile(path.join(target, `${kind}.gltf`), JSON.stringify(json))
  console.log(`Prepared ${kind}: original geometry retained, local WebP PBR maps`)
}
