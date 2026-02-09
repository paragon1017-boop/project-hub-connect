import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'

type PillarFieldProps = {
  enabled: boolean
  tileCenters: Array<{ x: number; z: number }>
  playerX: number
  playerY: number
  pillarRadius?: number
  pillarHeight?: number
  color?: number
}

// Pure-code pillar field around specified floor tiles.
export function PillarField({ enabled, tileCenters, playerX, playerY, pillarRadius = 0.07, pillarHeight = 1.2, color = 0x8a8a8a }: PillarFieldProps) {
  const instanceCount = tileCenters.length * 4

  // Geometry and material are shared across all instances
  const geometry = useMemo(() => new THREE.CylinderGeometry(pillarRadius, pillarRadius, pillarHeight, 16), [pillarRadius, pillarHeight])
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color }), [color])

  // Reference to the instanced mesh so we can set per-instance transforms
  const meshRef = useRef<THREE.InstancedMesh | null>(null)

  // Precompute and apply per-instance transforms when inputs change
  useEffect(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    let idx = 0
    for (const t of tileCenters) {
      const cx = t.x
      const cz = t.z
      // Pillars at the four corners of the tile
      const corners: [number, number][] = [
        [cx - 0.5, cz - 0.5],
        [cx + 0.5, cz - 0.5],
        [cx - 0.5, cz + 0.5],
        [cx + 0.5, cz + 0.5],
      ]
      for (const [rx, rz] of corners) {
        // Align with the same world coordinates system as other 3D objects
        dummy.position.set(rx - playerX + 0.5, pillarHeight / 2, rz - playerY + 0.5)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(idx++, dummy.matrix)
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [tileCenters, playerX, playerY, pillarHeight, pillarRadius])

  if (!enabled || instanceCount <= 0) return null
  return (
    <instancedMesh ref={meshRef} args={[geometry, material, instanceCount]} castShadow receiveShadow />
  )
}
