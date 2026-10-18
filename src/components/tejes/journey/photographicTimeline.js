// Crossfade at the existing chapter boundary. Reverse/seek restores the exact
// same weights; no image zoom or simulated 3D camera is applied.
export function photographicWeight(progress, index) {
  const distance = Math.abs(Math.max(0, Math.min(1, progress)) * 11 - index)
  const t = Math.max(0, Math.min(1, (.65 - distance) / .3))
  return t * t * (3 - 2 * t)
}
