import { useRef, useEffect } from 'react';
import { Texture } from 'three';
import { useFrame } from '@react-three/fiber';

export function WallTrim({ x, y, playerX, playerY, texture, type }: {
  x: number;
  y: number;
  playerX: number;
  playerY: number;
  texture: Texture;
  type: 'top' | 'base';
}) {
  console.log(`[WallTrim] Rendering ${type} trim at ${x},${y}`);
  const meshRef = useRef<any>(null);
  const height = 0.1;
  const posY = type === 'top' ? 1.0 + height / 2 : -height / 2;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = x + 0.5 - playerX;
      meshRef.current.position.z = y + 0.5 - playerY;
    }
  });

  return (
    <mesh ref={meshRef} position={[x + 0.5 - playerX, posY, y + 0.5 - playerY]}>
      <boxGeometry args={[1.05, height, 1.05]} />
      <meshBasicMaterial map={texture} color={0xffffff} />
    </mesh>
  );
}
