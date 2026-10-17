import { EquirectangularReflectionMapping, SRGBColorSpace, TextureLoader } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'

const base = '/assets/spoorthi/cinematic/'

// All files are served locally. Licensing, source URLs and optimization notes
// are recorded in the adjacent asset manifest and project documentation.
export async function loadCinematicAssets(own, onProgress = () => {}, { compact = false } = {}) {
  let completed = 0
  const total = 32
  const finished = value => { onProgress(++completed / total); return value }
  const textureLoader = new TextureLoader()
  const loadTexture = async (file, color = false) => {
    const texture = own(await textureLoader.loadAsync(base + file))
    if (color) texture.colorSpace = SRGBColorSpace
    return finished(texture)
  }
  const surface = async kind => {
    const suffix = compact && ['plaster', 'stone', 'asphalt', 'floor'].includes(kind) ? '-512' : ''
    const [color, normal, arm] = await Promise.all([
      loadTexture(`textures/${kind}-color${suffix}.webp`, true),
      loadTexture(`textures/${kind}-normal${suffix}.webp`),
      loadTexture(`textures/${kind}-arm${suffix}.webp`),
    ])
    return { color, normal, arm }
  }
  const loadModel = async file => {
    const model = (await new GLTFLoader().loadAsync(base + file)).scene
    model.traverse(object => {
      if (!object.isMesh) return
      own(object.geometry)
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      for (const material of materials) {
        own(material)
        for (const value of Object.values(material)) if (value?.isTexture) own(value)
      }
      object.castShadow = object.receiveShadow = true
    })
    return finished(model)
  }
  const [concrete, soil, steel, wood, hdr, background, excavator, barrier, crane, cement, generator, fence, plaster, stone, asphalt, floor] = await Promise.all([
    surface('concrete'), surface('soil'), surface('steel'), surface('wood'),
    new HDRLoader().loadAsync(base + 'daylight-1k.hdr').then(own).then(finished),
    loadTexture('daylight-background.webp', true),
    loadModel('cet200-excavator.glb'), loadModel('barrier/barrier-optimized.gltf'),
    loadModel('crane/tower-crane.gltf'), loadModel('cement_bag/cement_bag.gltf'),
    loadModel('portable_generator/portable_generator.gltf'), loadModel('modular_chainlink_fence/modular_chainlink_fence.gltf'),
    surface('plaster'), surface('stone'), surface('asphalt'), surface('floor'),
  ])
  hdr.mapping = background.mapping = EquirectangularReflectionMapping
  return { concrete, soil, steel, wood, hdr, background, excavator, barrier, crane, cement, generator, fence, plaster, stone, asphalt, floor }
}
