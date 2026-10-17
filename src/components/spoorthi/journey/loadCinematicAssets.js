import { EquirectangularReflectionMapping, SRGBColorSpace, TextureLoader } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'

const base = '/assets/spoorthi/cinematic/'

// All files are served locally. Licensing, source URLs and optimization notes
// are recorded in the adjacent asset manifest and project documentation.
export async function loadCinematicAssets(own) {
  const textureLoader = new TextureLoader()
  const loadTexture = async (file, color = false) => {
    const texture = own(await textureLoader.loadAsync(base + file))
    if (color) texture.colorSpace = SRGBColorSpace
    return texture
  }
  const surface = async kind => {
    const [color, normal, arm] = await Promise.all([
      loadTexture(`textures/${kind}-color.webp`, true),
      loadTexture(`textures/${kind}-normal.webp`),
      loadTexture(`textures/${kind}-arm.webp`),
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
    return model
  }
  const [concrete, soil, steel, wood, hdr, background, excavator, barrier] = await Promise.all([
    surface('concrete'), surface('soil'), surface('steel'), surface('wood'),
    new HDRLoader().loadAsync(base + 'daylight-1k.hdr').then(own),
    loadTexture('daylight-background.webp', true),
    loadModel('cet200-excavator.glb'), loadModel('barrier/barrier.gltf'),
  ])
  hdr.mapping = background.mapping = EquirectangularReflectionMapping
  return { concrete, soil, steel, wood, hdr, background, excavator, barrier }
}
