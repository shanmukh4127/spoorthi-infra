export const experiencePipeline = Object.freeze([
  '2d-design',
  '3d-design',
  'final-output',
  'vr-experience',
])

export function createBrandConfig(config) {
  return Object.freeze({
    ...config,
    experiencePipeline,
  })
}
