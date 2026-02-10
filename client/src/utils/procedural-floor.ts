import * as THREE from 'three'

// Simple deterministic crack texture generator for floor tiles.
// Returns a THREE.CanvasTexture that can be mapped on top of a floor tile.
export function crackTexture(seed: number, size: number = 128): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    // Fallback: empty texture
    const t = new THREE.CanvasTexture(canvas)
    t.needsUpdate = true
    return t
  }

  // Base background (slightly darker than floor base so cracks show)
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, size, size)

  // Pseudo-random generator seeded by input
  let s = seed >>> 0
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return (s & 0xffffffff) / 4294967296
  }

  // Draw a few jagged cracks
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = Math.max(1, Math.floor(size * 0.015))
  ctx.lineCap = 'round'
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    const x = rnd() * size
    const y = rnd() * size
    const ex = x + (rnd() - 0.5) * size * 0.9
    const ey = y + (rnd() - 0.5) * size * 0.9
    ctx.moveTo(x, y)
    ctx.lineTo(ex, ey)
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}
