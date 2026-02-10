import * as THREE from 'three'

export async function loadTransparentWallTexture(path: string): Promise<THREE.Texture | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const w = img.naturalWidth || img.width
      const h = img.naturalHeight || img.height
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(null)
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      const data = ctx.getImageData(0, 0, w, h)
      const arr = data.data
      // Remove white background (make transparent)
      for (let i = 0; i < arr.length; i += 4) {
        const r = arr[i], g = arr[i + 1], b = arr[i + 2]
        if (r > 240 && g > 240 && b > 240) {
          arr[i + 3] = 0
        }
      }
      // Simple sharpening on RGB channels
      const copy = new Uint8ClampedArray(arr)
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4
          const iN = ((y - 1) * w + x) * 4
          const iS = ((y + 1) * w + x) * 4
          const iW = (y * w + (x - 1)) * 4
          const iE = (y * w + (x + 1)) * 4
          for (let c = 0; c < 3; c++) {
            let v = 5 * arr[idx + c] - copy[iN + c] - copy[iS + c] - copy[iW + c] - copy[iE + c]
            v = v < 0 ? 0 : v > 255 ? 255 : v
            arr[idx + c] = v
          }
        }
      }
      ctx.putImageData(data, 0, 0)
      const tex = new THREE.CanvasTexture(canvas)
      tex.needsUpdate = true
      resolve(tex)
    }
    img.onerror = () => resolve(null)
    img.src = path
  })
}
