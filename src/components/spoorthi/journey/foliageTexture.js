import { CanvasTexture, SRGBColorSpace } from 'three'

// A small deterministic leaf atlas: alpha-cut foliage cards keep crowns airy
// and detailed without shipping a large tree model or drawing solid blobs.
export function createFoliageTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')
  let seed = 9471
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  for (let i = 0; i < 280; i++) {
    const angle = random() * Math.PI * 2
    const radius = Math.sqrt(random()) * 108
    const x = 128 + Math.cos(angle) * radius
    const y = 128 + Math.sin(angle) * radius
    ctx.save(); ctx.translate(x, y); ctx.rotate(random() * Math.PI)
    const light = 27 + Math.floor(random() * 20)
    ctx.fillStyle = `hsl(${76 + random() * 23} 18% ${light}%)`
    ctx.beginPath(); ctx.ellipse(0, 0, 3 + random() * 4, 1.5 + random() * 2, 0, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}
