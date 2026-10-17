import { RepeatWrapping, Vector2 } from 'three'

// Project textures in world metres. A 26m slab and a 0.64m column retain the
// same material scale, including on instanced and gently chamfered geometry.
export function applyWorldUv(material, tileMeters = 3, { variation = .035, grain = .012, weathering = 0, minRoughness = .12 } = {}) {
  const image = material.map?.image ?? material.normalMap?.image
  const aspect = image ? image.width / image.height : 1
  material.onBeforeCompile = shader => {
    const coordinates = `
      vec4 surfaceWorld = vec4(position, 1.0);
      #ifdef USE_INSTANCING
        surfaceWorld = instanceMatrix * surfaceWorld;
      #endif
      surfaceWorld = modelMatrix * surfaceWorld;
      vec3 surfaceNormal = normal;
      #ifdef USE_INSTANCING
        surfaceNormal = mat3(instanceMatrix) * surfaceNormal;
      #endif
      surfaceNormal = normalize(mat3(modelMatrix) * surfaceNormal);
      vSiSurfaceWorld = surfaceWorld.xyz;
      vec3 face = abs(surfaceNormal);
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
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vSiSurfaceWorld;')
    shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\n' + coordinates)
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vSiSurfaceWorld;
      float siHash(vec3 p) { p = fract(p * .1031); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
      float siNoise(vec3 p) {
        vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(siHash(i), siHash(i + vec3(1,0,0)), f.x), mix(siHash(i + vec3(0,1,0)), siHash(i + vec3(1,1,0)), f.x), f.y),
                   mix(mix(siHash(i + vec3(0,0,1)), siHash(i + vec3(1,0,1)), f.x), mix(siHash(i + vec3(0,1,1)), siHash(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
    `)
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      float siVariation = siNoise(vSiSurfaceWorld * .32) * 2.0 - 1.0;
      float siFine = (siHash(floor(vSiSurfaceWorld * 72.0)) * 2.0 - 1.0) * (1.0 - smoothstep(.008, .06, length(fwidth(vSiSurfaceWorld))));
      float siGround = (1.0 - smoothstep(.05, 1.6, vSiSurfaceWorld.y)) * siNoise(vSiSurfaceWorld * 1.7);
      diffuseColor.rgb *= 1.0 + siVariation * ${Number(variation).toFixed(4)} + siFine * ${Number(grain).toFixed(4)};
      diffuseColor.rgb *= mix(vec3(1.0), vec3(.63,.57,.47), siGround * ${Number(weathering).toFixed(4)});
    `)
    shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
      roughnessFactor = clamp(roughnessFactor + siVariation * .025 + siFine * .015, ${Number(minRoughness).toFixed(4)}, 1.0);
    `)
  }
  material.customProgramCacheKey = () => `spoorthi-world-uv-${tileMeters}-${aspect}-${variation}-${grain}-${weathering}-${minRoughness}`
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
