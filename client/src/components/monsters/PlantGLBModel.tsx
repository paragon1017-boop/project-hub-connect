import React from 'react'
import { useGLTF } from '@react-three/drei'

type PlantGLBModelProps = {
  path: string
  scale?: number
}

// Simple GLB model loader for plant monsters
export function PlantGLBModel({ path, scale = 1 }: PlantGLBModelProps) {
  const gltf = useGLTF(path, true)
  return <primitive object={gltf.scene} scale={scale} />
}

export default PlantGLBModel
