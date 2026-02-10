import React from 'react'
import * as THREE from 'three'

type PillarProps = {
  x: number
  y: number
  playerX: number
  playerY: number
  tileSize?: number
  height?: number
  color?: number
}

// Square pillar placed at a grid intersection
export const WallPillar: React.FC<PillarProps> = ({
  x, y, playerX, playerY, tileSize = 0.6, height = 1.0, color = 0x6a6a6a
}) => {
  const worldX = (x - playerX) * tileSize
  const worldZ = (y - playerY) * tileSize
  return (
    <mesh position={[worldX, height / 2, worldZ]} castShadow receiveShadow>
      <boxGeometry args={[0.15, height, 0.15]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
