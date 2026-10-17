import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import test from 'node:test'
import { Box3, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const root = path.resolve('public/assets/spoorthi/cinematic')
const manifest = JSON.parse(await fs.readFile(path.join(root, 'asset-manifest.json'), 'utf8'))

test('distributed visual assets match their audit manifest and carry source licenses', async () => {
  for (const item of manifest.files) {
    const bytes = await fs.readFile(path.join(root, item.file))
    assert.equal(bytes.length, item.bytes, item.file)
    assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256, item.file)
  }
  assert.ok(manifest.assetSources.length >= 12)
  for (const source of manifest.assetSources) assert.ok(source.license && source.source.startsWith('https://'))
  assert.match(await fs.readFile(path.join(root, 'CET200-LICENSE.txt'), 'utf8'), /Apache License/)
  assert.match(await fs.readFile(path.join(root, 'CET200-NOTICE.txt'), 'utf8'), /VMC Motion Technologies/)
})

test('architectural PBR surfaces have complete desktop and smaller mobile texture sets', async () => {
  let desktopBytes = 0; let mobileBytes = 0
  for (const surface of ['plaster', 'stone', 'asphalt', 'floor']) for (const map of ['color', 'normal', 'arm']) {
    const desktop = await fs.stat(path.join(root, `textures/${surface}-${map}.webp`))
    const mobile = await fs.stat(path.join(root, `textures/${surface}-${map}-512.webp`))
    desktopBytes += desktop.size; mobileBytes += mobile.size
    assert.ok(mobile.size < desktop.size)
  }
  assert.ok(mobileBytes < desktopBytes * .5)
  for (const id of ['beige_wall_001', 'marble_01', 'asphalt_02', 'concrete_floor_worn_001']) {
    assert.equal(manifest.assetSources.find(asset => asset.id === id)?.license, 'CC0-1.0')
  }
})

test('scanned barrier references local buffers and correctly typed optimized textures', async () => {
  const folder = path.join(root, 'barrier')
  const model = JSON.parse(await fs.readFile(path.join(folder, 'barrier.gltf'), 'utf8'))
  for (const image of model.images) {
    assert.equal(image.mimeType, 'image/webp')
    assert.ok(!image.uri.includes('://'))
    await fs.access(path.join(folder, image.uri))
  }
  for (const buffer of model.buffers) await fs.access(path.join(folder, buffer.uri))
})

test('optimized barrier keeps scanned PBR maps and reduces the render cost substantially', async () => {
  const folder = path.join(root, 'barrier')
  const original = JSON.parse(await fs.readFile(path.join(folder, 'barrier.gltf'), 'utf8'))
  const optimized = JSON.parse(await fs.readFile(path.join(folder, 'barrier-optimized.gltf'), 'utf8'))
  const triangleCount = model => model.accessors[model.meshes[0].primitives[0].indices].count / 3
  assert.ok(triangleCount(optimized) < triangleCount(original) * .15)
  assert.deepEqual(optimized.materials, original.materials)
  assert.deepEqual(optimized.images, original.images)
  for (const buffer of optimized.buffers) {
    const bytes = await fs.readFile(path.join(folder, buffer.uri))
    assert.equal(bytes.length, buffer.byteLength)
  }
  for (const attribute of ['POSITION', 'NORMAL', 'TEXCOORD_0']) assert.ok(attribute in optimized.meshes[0].primitives[0].attributes)
})

test('optimized excavator preserves realistic metre scale and detailed complete tracks', async () => {
  const bytes = await fs.readFile(path.join(root, 'cet200-excavator.glb'))
  const model = (await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '')).scene
  const bounds = new Box3().setFromObject(model)
  const size = bounds.getSize(new Vector3())
  assert.ok(size.x > 8 && size.x < 9)
  assert.ok(size.y > 5 && size.y < 7)
  assert.ok(size.z > 3 && size.z < 3.5)
  assert.ok(Math.abs(bounds.min.y) < .001)
  assert.ok(model.getObjectByName('left-track') && model.getObjectByName('right-track'))
  let meshes = 0
  model.traverse(object => { if (object.isMesh) meshes++ })
  assert.ok(meshes <= 10, 'Static model should retain merged draw groups')
})
