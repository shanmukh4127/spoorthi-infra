import { RepeatWrapping, Vector2 } from 'three'

// Project textures in world metres. A 26m slab and a 0.64m column retain the
// same material scale, including on instanced and gently chamfered geometry.
export function applyWorldUv(material, tileMeters = 3) {
  const image = material.map?.image ?? material.normalMap?.image
  const aspect = image ? image.width / image.height : 1
  material.onBeforeCompile = shader => {
    const coordinates = `
      vec4 surfaceWorld = vec4(position, 1.0);
      #ifdef USE_INSTANCING
        surfaceWorld = instanceMatrix * surfaceWorld;
      #endif
      surfaceWorld = modelMatrix * surfaceWorld;
      vec3 face = abs(normal);
      vec2 surfaceUv = face.x > face.y && face.x > face.z ? surfaceWorld.zy : (face.y > face.z ? surfaceWorld.xz : surfaceWorld.xy);
      surfaceUv /= vec2(${Number(tileMeters * aspect).toFixed(3)}, ${Number(tileMeters).toFixed(3)});
      #ifdef USE_MAP
        vMapUv = surfaceUv;
      #endif
      #ifdef USE_NORMALMAP
        vNormalMapUv = surfaceUv;
      #endif
      #ifdef USE_ROUGHNESSMAP
        vRoughnessMapUv = surfaceUv;
      #endif
      #ifdef USE_METALNESSMAP
        vMetalnessMapUv = surfaceUv;
      #endif
      #ifdef USE_AOMAP
        vAoMapUv = surfaceUv;
      #endif
    `
    shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\n' + coordinates)
  }
  material.customProgramCacheKey = () => `spoorthi-world-uv-${tileMeters}-${aspect}`
  return material
}

export function pbrProperties(surface, renderer, normalStrength = .5) {
  for (const texture of Object.values(surface)) {
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
  }
  return {
    map: surface.color, normalMap: surface.normal, normalScale: new Vector2(normalStrength, normalStrength),
    roughnessMap: surface.arm, metalnessMap: surface.arm, aoMap: surface.arm, aoMapIntensity: .55,
  }
}
