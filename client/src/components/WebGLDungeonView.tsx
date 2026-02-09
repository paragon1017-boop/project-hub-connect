import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { FloorRim } from './FloorRim';
import { PillarField } from './PillarField';
import type { RimEdge } from './FloorRim';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  TextureLoader,
  MeshBasicMaterial,
  Color,
  FogExp2,
  NearestFilter,
  LinearMipmapLinearFilter,
  LinearFilter,
  RepeatWrapping,
  ClampToEdgeWrapping,
  Texture,
  DoubleSide,
  Object3D,
  InstancedMesh as ThreeInstancedMesh,
  Matrix4,
  PlaneGeometry,
  BoxGeometry,
  Vector3,
} from 'three';
import { GameData, TILE_WALL, TILE_DOOR, TILE_FLOOR, TILE_LADDER_DOWN, TILE_LADDER_UP } from '@/lib/game-engine';

// ─── Constants ───────────────────────────────────────────────────────────────
const TEXTURE_VERSION = 25;
const VIEW_DISTANCE = 16;

// Hash function matching old DungeonView for texture variety per tile
function tileHash(x: number, y: number, modulus: number): number {
  return ((x * 7919 + y * 104729) & 0x7fffffff) % modulus;
}

// ─── Texture path definitions (ported from DungeonView) ──────────────────────

interface LevelTextures {
  wall: string;
  floor: string;
  ceiling: string;
  extraWalls?: string[];
  extraFloors?: string[];
  extraCeilings?: string[];
}

function getTexturesForLevel(level: number): LevelTextures {
  const lvl = Math.max(1, Math.min(10, level));
  const v = `?v=${TEXTURE_VERSION}`;

  if (lvl === 1) {
    return {
      wall: `/assets/textures/floor1tile1.PNG${v}`,
      floor: `/assets/textures/floor1ground1.PNG${v}`,
      ceiling: `/assets/textures/ceiling1floor1.PNG${v}`,
      extraWalls: [
        `/assets/textures/floor1tile2.PNG${v}`,
        `/assets/textures/floor1tile3.PNG${v}`,
        `/assets/textures/floor1tile4.PNG${v}`,
        `/assets/textures/floor1tile5.PNG${v}`,
        `/assets/textures/floor1tile6.PNG${v}`,
        `/assets/textures/floor1tile7.PNG${v}`,
        `/assets/textures/floor1tile8.PNG${v}`,
        `/assets/textures/floor1tile9.PNG${v}`,
      ],
      extraFloors: [
        `/assets/textures/floor1ground2.PNG${v}`,
        `/assets/textures/floor1ground3.PNG${v}`,
        `/assets/textures/floor1ground4.PNG${v}`,
        `/assets/textures/floor1ground5.PNG${v}`,
        `/assets/textures/floor1ground6.PNG${v}`,
        `/assets/textures/floor1ground7.PNG${v}`,
      ],
      extraCeilings: [
        `/assets/textures/ceiling1floor2.PNG${v}`,
        `/assets/textures/ceiling1floor3.PNG${v}`,
        `/assets/textures/ceiling1floor4.PNG${v}`,
      ],
    };
  }

  return {
    wall: `/assets/textures/wall_${lvl}.png${v}`,
    floor: `/assets/textures/floor_${lvl}.png${v}`,
    ceiling: `/assets/textures/ceiling_stone_dungeon.png${v}`,
  };
}

// ─── Texture loader helper ───────────────────────────────────────────────────

function configureTexture(tex: Texture): Texture {
  tex.generateMipmaps = true;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.magFilter = LinearFilter;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function loadTex(loader: TextureLoader, src: string): Promise<Texture | null> {
  return new Promise((resolve) => {
    loader.load(
      src,
      (tex) => resolve(configureTexture(tex)),
      undefined,
      () => {
        console.warn(`[WebGL] Failed to load texture: ${src}`);
        resolve(null);
      }
    );
  });
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface LoadedTextures {
  walls: Texture[];   // primary + extras
  floors: Texture[];  // primary + extras
  ceilings: Texture[]; // primary + extras
  door: Texture | null;
}

interface WebGLDungeonViewProps {
  gameData: GameData;
  visualX?: number;
  visualY?: number;
  viewportScale?: number;
  resolution?: { width: number; height: number };
}

// ─── Scene setup ─────────────────────────────────────────────────────────────

function SceneSetup() {
  const { scene, gl } = useThree();
  useEffect(() => {
    scene.background = new Color(0x000000);
    scene.fog = new FogExp2(0x000000, 0.12);
    gl.setClearColor(0x000000, 1);
  }, [scene, gl]);
  return null;
}

// ─── Camera controller ───────────────────────────────────────────────────────

function CameraController({ x, y, dir }: { x: number; y: number; dir: number }) {
  const { camera } = useThree();

  useFrame(() => {
    // Camera always at origin; world moves around it
    camera.position.set(0, 0.5, 0);
    // Direction: 0=N(-Z), 1=E(+X), 2=S(+Z), 3=W(-X)
    const rotMap: Record<number, number> = {
      0: 0,               // North: default -Z
      1: -Math.PI / 2,    // East
      2: Math.PI,          // South
      3: Math.PI / 2,      // West
    };
    camera.rotation.set(0, rotMap[dir] ?? 0, 0);
  });

  return null;
}

// ─── Wall block (individual mesh with hash-selected texture + side shading) ──

function WallBlock({ x, y, playerX, playerY, texture, isDoor, doorTexture }: {
  x: number; y: number;
  playerX: number; playerY: number;
  texture: Texture;
  isDoor: boolean;
  doorTexture: Texture | null;
}) {
  const meshRef = useRef<any>(null);
  // If door and we have door texture, use it; else fallback to wall texture
  const usedTexture = isDoor && doorTexture ? doorTexture : texture;

  // Side-shading: walls are boxes so Three.js applies per-face.
  // We approximate by tinting the material color slightly darker.
  // For a more accurate approach we'd need face-specific materials.

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = x + 0.5 - playerX;
      meshRef.current.position.z = y + 0.5 - playerY;
    }
  });

  if (isDoor && doorTexture) {
    // Door: render as thinner box with door texture on front/back, wall texture on sides
    return (
      <group>
        {/* Door panel - slightly thinner */}
        <mesh ref={meshRef} position={[x + 0.5 - playerX, 0.5, y + 0.5 - playerY]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial map={doorTexture} color={0xcccccc} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh ref={meshRef} position={[x + 0.5 - playerX, 0.5, y + 0.5 - playerY]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial map={usedTexture} color={0xdddddd} />
    </mesh>
  );
}

// ─── Floor tile (individual quad per tile for texture variety) ────────────────

function FloorTile({ x, y, playerX, playerY, texture }: {
  x: number; y: number;
  playerX: number; playerY: number;
  texture: Texture;
}) {
  const meshRef = useRef<any>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = x - playerX + 0.5;
      meshRef.current.position.z = y - playerY + 0.5;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[x - playerX + 0.5, 0.0, y - playerY + 0.5]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} color={0xffffff} />
    </mesh>
  );
}

// ─── Ceiling tile (individual quad per tile for texture variety) ──────────────

function CeilingTile({ x, y, playerX, playerY, texture }: {
  x: number; y: number;
  playerX: number; playerY: number;
  texture: Texture;
}) {
  const meshRef = useRef<any>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = x - playerX + 0.5;
      meshRef.current.position.z = y - playerY + 0.5;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[Math.PI / 2, 0, 0]}
      position={[x - playerX + 0.5, 1.0, y - playerY + 0.5]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} color={0xffffff} />
    </mesh>
  );
}

// ─── Baseboard strip at bottom of walls ──────────────────────────────────────

function Baseboard({ x, y, playerX, playerY, texture, map }: {
  x: number; y: number;
  playerX: number; playerY: number;
  texture: Texture;
  map: number[][];
}) {
  const groupRef = useRef<any>(null);
  const boardHeight = 0.12;
  const boardOffset = 0.501; // Slightly in front of wall face

  // Check which adjacent tiles are open (floor/ladder) to place baseboard faces
  const maxY = map.length;
  const maxX = map[0]?.length || 0;

  const isOpen = (tx: number, ty: number) => {
    if (tx < 0 || tx >= maxX || ty < 0 || ty >= maxY) return false;
    const t = map[ty][tx];
    return t === TILE_FLOOR || t === TILE_LADDER_DOWN || t === TILE_LADDER_UP;
  };

  // Which faces need a baseboard strip
  const faces: { px: number; pz: number; ry: number }[] = [];
  if (isOpen(x, y - 1)) faces.push({ px: 0, pz: -boardOffset, ry: 0 });          // North face
  if (isOpen(x, y + 1)) faces.push({ px: 0, pz: boardOffset, ry: Math.PI });     // South face
  if (isOpen(x + 1, y)) faces.push({ px: boardOffset, pz: 0, ry: -Math.PI / 2 }); // East face
  if (isOpen(x - 1, y)) faces.push({ px: -boardOffset, pz: 0, ry: Math.PI / 2 }); // West face

  if (faces.length === 0) return null;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = x + 0.5 - playerX;
      groupRef.current.position.z = y + 0.5 - playerY;
    }
  });

  return (
    <group ref={groupRef} position={[x + 0.5 - playerX, 0, y + 0.5 - playerY]}>
      {faces.map((f, i) => (
        <mesh
          key={i}
          position={[f.px, boardHeight / 2, f.pz]}
          rotation={[0, f.ry, 0]}
        >
          <planeGeometry args={[1, boardHeight]} />
          <meshBasicMaterial map={texture} color={0x888888} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Main scene content ──────────────────────────────────────────────────────

function DungeonScene({ gameData, textures, visualX, visualY }: { gameData: GameData; textures: LoadedTextures; visualX?: number; visualY?: number }) {
  // Use visual position if available (for smooth interpolation), otherwise fall back to game position
  // Add +0.5 to center camera within the player's tile (matching old raycaster convention)
  const px = (visualX ?? gameData.x) + 0.5;
  const py = (visualY ?? gameData.y) + 0.5;
  const map = gameData.map;

  // Calculate visible tile positions within view distance
  const { wallTiles, floorTiles } = useMemo(() => {
    const walls: { x: number; y: number; tile: number }[] = [];
    const floors: { x: number; y: number }[] = [];
    const ipx = Math.floor(px);
    const ipy = Math.floor(py);

    for (let y = Math.max(0, ipy - VIEW_DISTANCE); y < Math.min(map.length, ipy + VIEW_DISTANCE); y++) {
      for (let x = Math.max(0, ipx - VIEW_DISTANCE); x < Math.min(map[y].length, ipx + VIEW_DISTANCE); x++) {
        const t = map[y][x];
        if (t === TILE_WALL || t === TILE_DOOR) {
          walls.push({ x, y, tile: t });
        } else {
          // Floor, ladder up, ladder down — all get floor/ceiling tiles
          floors.push({ x, y });
        }
      }
    }
    return { wallTiles: walls, floorTiles: floors };
  }, [map, px, py]);

  const wallTextures = textures.walls;
  const rimTexture = wallTextures.length > 0 ? wallTextures[0] : null;
  const floorTextures = textures.floors;
  const ceilingTextures = textures.ceilings;
  const doorTex = textures.door;

  // Fallback: if no floor textures for baseboard, use first wall tex
  const baseboardTex = floorTextures[0] || wallTextures[0] || null;

  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.9} />

      <CameraController x={px} y={py} dir={gameData.dir} />

      {/* Walls (and doors) with hash-based texture variety */}
      {wallTiles.map((w) => {
        const isDoor = w.tile === TILE_DOOR;
        const texIdx = wallTextures.length > 0 ? tileHash(w.x, w.y, wallTextures.length) : 0;
        const tex = wallTextures[texIdx] || wallTextures[0];
        if (!tex) return null;
        return (
          <WallBlock
            key={`w-${w.x}-${w.y}`}
            x={w.x}
            y={w.y}
            playerX={px}
            playerY={py}
            texture={tex}
            isDoor={isDoor}
            doorTexture={doorTex}
          />
        );
      })}

      {/* Baseboards at bottom of walls */}
      {baseboardTex && wallTiles.map((w) => (
        <Baseboard
          key={`bb-${w.x}-${w.y}`}
          x={w.x}
          y={w.y}
          playerX={px}
          playerY={py}
          texture={baseboardTex}
          map={map}
        />
      ))}

      {/* Floor tiles with rim variations around every tile edge (square around tile) */}
      {floorTiles.map((f) => {
        const texIdx = floorTextures.length > 0 ? tileHash(f.x, f.y, floorTextures.length) : 0;
        const tex = floorTextures[texIdx] || floorTextures[0];
        if (!tex) return null;
        // Deterministic per-tile rim variant
        const seed = (f.x * 374761393 + f.y * 668265263) >>> 0;
        const variant = seed % 4;
        const rims = [
          <FloorRim key={`rim-n-${f.x}-${f.y}`} edge={'N' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />,
          <FloorRim key={`rim-s-${f.x}-${f.y}`} edge={'S' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />,
          <FloorRim key={`rim-w-${f.x}-${f.y}`} edge={'W' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />,
          <FloorRim key={`rim-e-${f.x}-${f.y}`} edge={'E' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />,
          <FloorRim key={`rim-ne-${f.x}-${f.y}`} edge={'NE' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />,
          <FloorRim key={`rim-nw-${f.x}-${f.y}`} edge={'NW' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />,
          <FloorRim key={`rim-se-${f.x}-${f.y}`} edge={'SE' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />,
          <FloorRim key={`rim-sw-${f.x}-${f.y}`} edge={'SW' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />,
        ];
        return (
          <>
            <FloorTile
              key={`f-${f.x}-${f.y}`}
              x={f.x}
              y={f.y}
              playerX={px}
              playerY={py}
              texture={tex}
            />
            {rims}
          </>
        );
      })}

      {/* Pillars around floor1tile1-9 (4 corners per tile) */}
      <PillarField
        enabled={true}
        tileCenters={[
          { x: -1, z: -1 }, { x: 0, z: -1 }, { x: 1, z: -1 },
          { x: -1, z: 0 }, { x: 0, z: 0 }, { x: 1, z: 0 },
          { x: -1, z: 1 }, { x: 0, z: 1 }, { x: 1, z: 1 },
        ]}
        playerX={px}
        playerY={py}
        pillarRadius={0.07}
        pillarHeight={1.2}
        color={0x8a8a8a}
      />
      {/* Ceiling tiles with hash-based texture variety */}
      {floorTiles.map((f) => {
        const texIdx = ceilingTextures.length > 0 ? tileHash(f.x + 3, f.y + 7, ceilingTextures.length) : 0;
        const tex = ceilingTextures[texIdx] || ceilingTextures[0];
        if (!tex) return null;
        return (
          <CeilingTile
            key={`c-${f.x}-${f.y}`}
            x={f.x}
            y={f.y}
            playerX={px}
            playerY={py}
            texture={tex}
          />
        );
      })}
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function WebGLDungeonView({ gameData, visualX, visualY, viewportScale = 0.7, resolution }: WebGLDungeonViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textures, setTextures] = useState<LoadedTextures | null>(null);
  const [loading, setLoading] = useState(true);
  const loadedLevelRef = useRef<number>(-1);

  // Log mount
  useEffect(() => {
    console.log('[WebGLDungeonView] Component mounted - Using WebGL/Three.js rendering');
  }, []);

  // Load all textures for current level
  useEffect(() => {
    if (loadedLevelRef.current === gameData.level) return;
    loadedLevelRef.current = gameData.level;
    setLoading(true);

    const loader = new TextureLoader();
    const paths = getTexturesForLevel(gameData.level);

    const wallPaths = [paths.wall, ...(paths.extraWalls || [])];
    const floorPaths = [paths.floor, ...(paths.extraFloors || [])];
    const ceilingPaths = [paths.ceiling, ...(paths.extraCeilings || [])];
    const doorPath = `/assets/textures/door_metal.png?v=${TEXTURE_VERSION}`;

    Promise.all([
      Promise.all(wallPaths.map((p) => loadTex(loader, p))),
      Promise.all(floorPaths.map((p) => loadTex(loader, p))),
      Promise.all(ceilingPaths.map((p) => loadTex(loader, p))),
      loadTex(loader, doorPath),
    ]).then(([walls, floors, ceilings, door]) => {
      const validWalls = walls.filter((t): t is Texture => t !== null);
      const validFloors = floors.filter((t): t is Texture => t !== null);
      const validCeilings = ceilings.filter((t): t is Texture => t !== null);

      console.log(`[WebGL] Textures loaded for level ${gameData.level}:`, {
        walls: validWalls.length,
        floors: validFloors.length,
        ceilings: validCeilings.length,
        door: !!door,
      });

      setTextures({
        walls: validWalls,
        floors: validFloors,
        ceilings: validCeilings,
        door,
      });
      setLoading(false);
    });
  }, [gameData.level]);

  if (loading || !textures || textures.walls.length === 0) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <span className="text-amber-400 text-sm font-pixel">Loading Dungeon...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-black"
    >
      <Canvas
        camera={{
          fov: 53,
          near: 0.1,
          far: 50,
          position: [0, 0.5, 0],
        }}
        scene={{ background: new Color(0x000000), fog: new FogExp2(0x000000, 0.12) }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 1);
          scene.background = new Color(0x000000);
        }}
        style={{ width: '100%', height: '100%', background: '#000000' }}
      >
        <DungeonScene gameData={gameData} textures={textures} visualX={visualX} visualY={visualY} />
      </Canvas>
    </div>
  );
}

export default WebGLDungeonView;
