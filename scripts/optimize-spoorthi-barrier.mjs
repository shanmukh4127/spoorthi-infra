// Offline mesh reduction. Preserve the scan's UVs, normals, scale, materials
// and texture references; keep the original asset available for comparison.
import fs from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { BufferAttribute, BufferGeometry } from 'three'
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js'

const folder = 'public/assets/spoorthi/cinematic/barrier/'
const source = JSON.parse(await fs.readFile(folder + 'barrier.gltf', 'utf8'))
const binary = await fs.readFile(folder + source.buffers[0].uri)
const geometry = new BufferGeometry()
const primitive = source.meshes[0].primitives[0]
const names = { POSITION: 'position', NORMAL: 'normal', TEXCOORD_0: 'uv' }
for (const [semantic, index] of Object.entries({ ...primitive.attributes, index: primitive.indices })) {
  const accessor = source.accessors[index]
  const view = source.bufferViews[accessor.bufferView]
  const size = { VEC3: 3, VEC2: 2, SCALAR: 1 }[accessor.type]
  const Type = { 5126: Float32Array, 5123: Uint16Array, 5125: Uint32Array }[accessor.componentType]
  const offset = (view.byteOffset || 0) + (accessor.byteOffset || 0)
  const bytes = binary.subarray(offset, offset + accessor.count * size * Type.BYTES_PER_ELEMENT)
  const attribute = new BufferAttribute(new Type(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)), size)
  if (semantic === 'index') geometry.setIndex(attribute)
  else geometry.setAttribute(names[semantic], attribute)
}
const simplified = await new SimplifyModifier().modify(geometry, Math.floor(geometry.attributes.position.count * .88))
const output = structuredClone(source)
output.accessors = []; output.bufferViews = []
const chunks = []; let byteOffset = 0
const append = (attribute, type, target) => {
  const bytes = Buffer.from(attribute.array.buffer, attribute.array.byteOffset, attribute.array.byteLength)
  const index = output.accessors.length
  output.accessors.push({ bufferView: index, componentType: attribute.array instanceof Float32Array ? 5126 : attribute.array instanceof Uint16Array ? 5123 : 5125, count: attribute.count, type })
  output.bufferViews.push({ buffer: 0, byteOffset, byteLength: bytes.length, target })
  const padding = (4 - bytes.length % 4) % 4
  chunks.push(bytes, Buffer.alloc(padding)); byteOffset += bytes.length + padding
  return index
}
const result = output.meshes[0].primitives[0]
result.attributes = {}
for (const [semantic, name] of Object.entries(names)) result.attributes[semantic] = append(simplified.attributes[name], name === 'uv' ? 'VEC2' : 'VEC3', 34962)
result.indices = append(simplified.index, 'SCALAR', 34963)
simplified.computeBoundingBox()
Object.assign(output.accessors[0], { min: simplified.boundingBox.min.toArray(), max: simplified.boundingBox.max.toArray() })
output.buffers = [{ uri: 'barrier-optimized.bin', byteLength: byteOffset }]
output.asset.generator = 'Spoorthi offline meshoptimizer reduction; original scan preserved'
await fs.writeFile(folder + 'barrier-optimized.bin', Buffer.concat(chunks))
await fs.writeFile(folder + 'barrier-optimized.gltf', JSON.stringify(output))
const manifestPath = 'public/assets/spoorthi/cinematic/asset-manifest.json'
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
for (const name of ['barrier-optimized.bin', 'barrier-optimized.gltf']) {
  const bytes = await fs.readFile(folder + name)
  const item = { file: 'barrier/' + name, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }
  manifest.files = manifest.files.filter(file => file.file !== item.file)
  manifest.files.push(item)
}
manifest.totalBytes = manifest.files.reduce((total, file) => total + file.bytes, 0)
manifest.cameraPathSha256 = createHash('sha256').update(await fs.readFile('src/components/spoorthi/journey/cameraPath.js')).digest('hex').toUpperCase()
manifest.barrierOptimization = { source: 'concrete_road_barrier', originalTriangles: geometry.index.count / 3, triangles: simplified.index.count / 3, method: 'Offline meshoptimizer with UV and normal preservation; original scan retained' }
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Scanned barrier: ${geometry.index.count / 3} → ${simplified.index.count / 3} triangles; ${binary.length} → ${byteOffset} bytes`)
