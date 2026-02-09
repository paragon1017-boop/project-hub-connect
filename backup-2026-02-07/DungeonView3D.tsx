import { useRef, useMemo, useState, useEffect, Component, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import * as THREE from "three";
import { GameData, TILE_WALL, TILE_DOOR } from "@/lib/game-engine";

interface DungeonView3DProps {
  gameData: GameData;
  className?: string;
  renderWidth?: number;
  renderHeight?: number;
  visualX?: number;
  visualY?: number;
}

interface ErrorState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<{ children: ReactNode; onError?: (error: Error) => void }, ErrorState> {
  constructor(props: { children: ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          <div className="text-center p-4">
            <h2 className="text-xl font-bold text-red-500 mb-2">3D Error</h2>
            <p className="text-sm text-gray-400">{this.state.error?.message || "Unknown error"}</p>
            <p className="text-xs text-gray-500 mt-4">
              Your browser may not support WebGL properly.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function DungeonMesh({ gameData, visualX, visualY }: { gameData: GameData; visualX?: number; visualY?: number }) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  const { walls, floors, ceilings } = useMemo(() => {
    const map = gameData.map;
    const walls: { x: number; y: number; type: number }[] = [];
    const floors: { x: number; y: number }[] = [];
    const ceilings: { x: number; y: number }[] = [];

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tile = map[y][x];
        if (tile === TILE_WALL || tile === TILE_DOOR) {
          walls.push({ x, y, type: tile });
        } else {
          floors.push({ x, y });
          ceilings.push({ x, y });
        }
      }
    }
    return { walls, floors, ceilings };
  }, [gameData.map]);

  useEffect(() => {
    const targetX = visualX !== undefined ? visualX : gameData.x;
    const targetY = visualY !== undefined ? visualY : gameData.y;

    const dir = gameData.dir;
    let dirX = 0, dirY = 0;
    switch (dir) {
      case 0: dirY = -1; break;
      case 1: dirX = 1; break;
      case 2: dirY = 1; break;
      case 3: dirX = -1; break;
    }

    const lookX = targetX + dirX * 0.5;
    const lookY = targetY + dirY * 0.5;

    camera.position.set(targetX + 0.5, 1.6, targetY + 0.5);
    camera.lookAt(lookX + 0.5, 1.6, lookY + 0.5);
  }, [visualX, visualY, gameData.x, gameData.y, gameData.dir, camera]);

  return (
    <group ref={groupRef}>
      {walls.map((tile, i) => (
        <mesh key={`wall-${tile.x}-${tile.y}-${i}`} position={[tile.x + 0.5, 1.5, tile.y + 0.5]}>
          <boxGeometry args={[1, 3, 1]} />
          <meshStandardMaterial color={tile.type === TILE_DOOR ? "#8B6914" : "#666666"} />
        </mesh>
      ))}

      {floors.map((tile, i) => (
        <mesh key={`floor-${tile.x}-${tile.y}-${i}`} position={[tile.x + 0.5, 0, tile.y + 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
      ))}

      {ceilings.map((tile, i) => (
        <mesh key={`ceiling-${tile.x}-${tile.y}-${i}`} position={[tile.x + 0.5, 3, tile.y + 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  );
}

function DungeonScene({ gameData, visualX, visualY }: { gameData: GameData; visualX?: number; visualY?: number }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 4, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[10, 4, 10]} intensity={0.5} color="#aaaaff" />
      <DungeonMesh gameData={gameData} visualX={visualX} visualY={visualY} />
    </>
  );
}

export function DungeonView3D({
  gameData,
  className,
  renderWidth = 800,
  renderHeight = 600,
  visualX,
  visualY
}: DungeonView3DProps) {
  const [error, setError] = useState<Error | null>(null);

  return (
    <div className={className} style={{ width: renderWidth, height: renderHeight, position: 'relative' }}>
      <ErrorBoundary onError={(err) => {
        console.error("Three.js Error:", err);
        setError(err);
      }}>
        <Canvas
          camera={{ fov: 75, aspect: renderWidth / renderHeight, near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={({ gl }: RootState) => {
            gl.setClearColor("#111111");
          }}
          shadows={false}
        >
          <color attach="background" args={["#111111"]} />
          <DungeonScene gameData={gameData} visualX={visualX} visualY={visualY} />
        </Canvas>
      </ErrorBoundary>
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          <div className="text-center p-4">
            <h2 className="text-xl font-bold text-red-500 mb-2">3D Error</h2>
            <p className="text-sm text-gray-400">{error.message}</p>
            <p className="text-xs text-gray-500 mt-4">Your browser may not support WebGL properly.</p>
          </div>
        </div>
      ) : null}
      <div className="absolute top-4 right-4 text-primary font-pixel text-xs bg-black/50 p-2 rounded pointer-events-none select-none">
        X:{gameData.x} Y:{gameData.y} L:{gameData.level}
      </div>
    </div>
  );
}
