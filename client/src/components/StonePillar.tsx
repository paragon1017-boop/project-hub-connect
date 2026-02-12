import { useRef } from 'react';
import { Texture } from 'three';
import { useFrame } from '@react-three/fiber';

export function StonePillar({ x, y, playerX, playerY, texture }: {
  x: number;
  y: number;
  playerX: number;
  playerY: number;
  texture: Texture;
}) {
  console.log(`[StonePillar] Rendering pillar at ${x},${y}`);
  const meshRef = useRef<any>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = x - playerX;
      meshRef.current.position.z = y - playerY;
    }
  });

  return (
    <mesh ref={meshRef} position={[x - playerX, 0.5, y - playerY]}>
      <boxGeometry args={[0.2, 1, 0.2]} />
      <meshBasicMaterial map={texture} color={0xffffff} />
    </mesh>
  );
}
