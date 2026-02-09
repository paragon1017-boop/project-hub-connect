import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

export type MonsterAnimationState = 'idle' | 'attack' | 'hit' | 'death' | 'entrance';

interface Monster3DProps {
  modelPath: string;
  scale?: number;
  animationState?: MonsterAnimationState;
  isFlying?: boolean;
  className?: string;
}

function MonsterModel({ modelPath, scale = 1, animationState = 'idle', isFlying }: Monster3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  
  // Clone the scene to avoid sharing between instances
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    // Do not override material properties; rely on GLTF's own material setup
    return cloned;
  }, [scene]);
  
  // Animation logic
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    switch (animationState) {
      case 'idle':
        if (isFlying) {
          groupRef.current.position.y = Math.sin(time * 2) * 0.2;
        } else {
          // Subtle breathing
          const breathScale = scale * (1 + Math.sin(time * 1.5) * 0.03);
          groupRef.current.scale.setScalar(breathScale);
        }
        groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
        break;
        
      case 'attack':
        groupRef.current.position.z = Math.sin(time * 15) * 0.3;
        break;
        
      case 'hit':
        groupRef.current.position.x = Math.sin(time * 30) * 0.1;
        break;
        
      case 'death':
        groupRef.current.rotation.x = Math.min(Math.PI / 2, groupRef.current.rotation.x + 0.1);
        groupRef.current.position.y = Math.max(0, groupRef.current.position.y - 0.05);
        break;
    }
  });
  
  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

export function Monster3D({ 
  modelPath, 
  scale = 0.06, 
  animationState = 'idle', 
  isFlying, 
  className
}: Monster3DProps) {
  return (
    <div className={`w-full h-full ${className || ''}`}>
      <Canvas
        camera={{ 
          position: [0, 0.8, 10.4],
          fov: 35,
          near: 0.1, 
          far: 50 
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
      >
        <ambientLight intensity={0.5} />
        
        <directionalLight
          position={[4, 6, 4]}
          intensity={0.8}
          castShadow
          shadow-mapSize={1024}
        />
        
        <directionalLight position={[-3, 2, -3]} intensity={0.3} color="#e0e0ff" />
        
        <pointLight position={[-2, 3, 2]} intensity={0.4} color="#ffcc88" distance={8} />
        
        <Center position={[0, -0.7, 0]}>
          <MonsterModel
            modelPath={modelPath}
            scale={scale}
            animationState={animationState}
            isFlying={isFlying}
          />
        </Center>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/assets/models/monsters/monster_plant/scene.gltf');
useGLTF.preload('/assets/models/monsters/monster_plant/sunflower_sentinel.glb');
useGLTF.preload('/assets/models/monsters/monster_plant/carnivorous_plant.glb');
useGLTF.preload('/assets/models/monsters/monster_plant/spore_cloud.glb');
useGLTF.preload('/assets/models/monsters/monster_plant/vine_behemoth.glb');
useGLTF.preload('/assets/models/monsters/monster_plant/mushroom_king.glb');
useGLTF.preload('/assets/models/monsters/monster_plant/thorn_bush.glb');
useGLTF.preload('/assets/models/monsters/monster_plant/lotus_guardian.glb');
useGLTF.preload('/assets/models/monsters/monster_plant/cactus_sprite.glb');
useGLTF.preload('/assets/models/monsters/monster_plant/root_guardian.glb');
useGLTF.preload('/assets/models/monsters/monster_plant/bloom_wisp.glb');

export default Monster3D;
