import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { FloorRim } from './FloorRim';
import { WallPillar } from './WallPillar';
import { PillarField } from './PillarField';
import type { RimEdge } from './FloorRim';
import { crackTexture } from '../utils/procedural-floor'
import { loadTransparentWallTexture } from '../utils/transparent-wall'
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
import { CanvasTexture } from 'three';
import { GameData, TILE_WALL, TILE_DOOR, TILE_FLOOR, TILE_LADDER_DOWN, TILE_LADDER_UP } from '@/lib/game-engine';

// ─── Constants ───────────────────────────────────────────────────────────────
const TEXTURE_VERSION = 25;
const FLOOR_TINTS: number[] = [
  0xffffff, 0xf0f0f0, 0xe6e6e6, 0xdadada, 0xcdcdcd, 0xbfbfbf, 0xb0b0b0, 0xa2a2a2,
  0x939393, 0x858585, 0x767676, 0x686868, 0x595959, 0x4a4a4a, 0x3b3b3b, 0x2c2c2c
];
const textureVersionQuery = `?v=${TEXTURE_VERSION}`;
const VIEW_DISTANCE = 16;
const DEFAULT_TILE_WORLD_SIZE = 0.6;
const TILE_WORLD_SIZE = (() => {
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(window.location.search).get('tileSize')
    const v = parseFloat(q ?? '')
    return Number.isFinite(v) ? v : DEFAULT_TILE_WORLD_SIZE
  }
  return DEFAULT_TILE_WORLD_SIZE
})();

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

  if (lvl === 1) {
    return {
      wall: `/assets/textures/wall1.jpg${textureVersionQuery}`,
      floor: `/assets/textures/floor1ground1.PNG${textureVersionQuery}`,
      ceiling: `/assets/textures/ceiling1floor1.PNG${textureVersionQuery}`,
      extraWalls: [
        `/assets/textures/wall1.jpg${textureVersionQuery}`,
        `/assets/textures/wall2.jpg${textureVersionQuery}`,
        `/assets/textures/wall3.jpg${textureVersionQuery}`,
        `/assets/textures/wall4.jpg${textureVersionQuery}`,
        `/assets/textures/wall5.jpg${textureVersionQuery}`,
        `/assets/textures/wall6.jpg${textureVersionQuery}`,
        `/assets/textures/wall7.jpg${textureVersionQuery}`,
        `/assets/textures/wall8.jpg${textureVersionQuery}`,
        `/assets/textures/wall9.jpg${textureVersionQuery}`,
        `/assets/textures/wall10.jpg${textureVersionQuery}`,
      ],
      extraFloors: [
        `/assets/textures/floor1ground2.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground3.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground4.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground5.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground6.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground7.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground8_matched.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground9_matched.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground10_matched.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground11_matched.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground12_matched.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground13_matched.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground14_matched.PNG${textureVersionQuery}`,
      ],
      extraCeilings: [
        `/assets/textures/ceiling1floor2.PNG${textureVersionQuery}`,
        `/assets/textures/ceiling1floor3.PNG${textureVersionQuery}`,
        `/assets/textures/ceiling1floor4.PNG${textureVersionQuery}`,
        `/assets/textures/ceiling_user1.png${textureVersionQuery}`,
        `/assets/textures/ceiling_user2.png${textureVersionQuery}`,
        `/assets/textures/ceiling_user3.png${textureVersionQuery}`,
        `/assets/textures/ceiling_user4.png${textureVersionQuery}`,
        `/assets/textures/ceiling_user5.png${textureVersionQuery}`,
        `/assets/textures/ceiling_user6.png${textureVersionQuery}`,
        `/assets/textures/ceiling_user7.png${textureVersionQuery}`,
        `/assets/textures/ceiling_user8.png${textureVersionQuery}`,
        `/assets/textures/ceiling_user9.png${textureVersionQuery}`,
      ],
    };
  }

  return {
    wall: `/assets/textures/wall_${lvl}.png${textureVersionQuery}`,
    floor: `/assets/textures/floor_${lvl}.png${textureVersionQuery}`,
    ceiling: `/assets/textures/ceiling_stone_dungeon.png${textureVersionQuery}`,
  };
}

// ─── Texture loader helper ───────────────────────────────────────────────────

function configureTexture(tex: Texture): Texture {
  tex.generateMipmaps = true;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.magFilter = LinearFilter;
  tex.wrapS = ClampToEdgeWrapping;
  tex.wrapT = ClampToEdgeWrapping;
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
  normals?: Texture[]; // per-floor normal maps (Phase 4)
  roughness?: Texture[]; // per-floor roughness maps (Phase 4)
  stylizedFloors?: Texture[]; // additional floor textures (Phase 3)
  customWalls?: Texture[]; // additional wall textures loaded from wall1-wall5
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
  const geometryRef = useRef<BoxGeometry | null>(null);
  
  // If door and we have door texture, use it; else fallback to wall texture
  const usedTexture = isDoor && doorTexture ? doorTexture : texture;

  // Apply AGGRESSIVE UV inset to prevent white edges on box geometry
  useEffect(() => {
    if (geometryRef.current) {
      const uvAttribute = geometryRef.current.attributes.uv;
      const uvs = uvAttribute.array as Float32Array;
      const inset = 0.05; // 5% inset - very aggressive to clip past texture borders
      
      for (let i = 0; i < uvs.length; i += 2) {
        const u = uvs[i];
        const v = uvs[i + 1];
        
        // Apply inset: push UVs significantly inward from edges
        // Map from [0,1] to [inset, 1-inset]
        uvs[i] = inset + u * (1 - 2 * inset);
        uvs[i + 1] = inset + v * (1 - 2 * inset);
      }
      
      uvAttribute.needsUpdate = true;
    }
  }, []);

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
          <boxGeometry ref={geometryRef} args={[1, 1, 1]} />
          <meshBasicMaterial map={doorTexture} color={0xcccccc} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh ref={meshRef} position={[x + 0.5 - playerX, 0.5, y + 0.5 - playerY]}>
      <boxGeometry ref={geometryRef} args={[1, 1, 1]} />
      <meshBasicMaterial map={usedTexture} color={0xdddddd} />
    </mesh>
  );
}

// ─── Floor tile (individual quad per tile for texture variety) ────────────────

function FloorTile({ x, y, playerX, playerY, texture, normalMap, roughnessMap, tintColor }: {
  x: number; y: number;
  playerX: number; playerY: number;
  texture: Texture;
  normalMap?: Texture;
  roughnessMap?: Texture;
  tintColor?: number;
}) {
  const meshRef = useRef<any>(null);
  const geometryRef = useRef<PlaneGeometry | null>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = (x - playerX) * TILE_WORLD_SIZE + TILE_WORLD_SIZE / 2;
      meshRef.current.position.z = (y - playerY) * TILE_WORLD_SIZE + TILE_WORLD_SIZE / 2;
    }
  });

  // Apply AGGRESSIVE UV inset to prevent white edges
  useEffect(() => {
    if (geometryRef.current) {
      const uvAttribute = geometryRef.current.attributes.uv;
      const uvs = uvAttribute.array as Float32Array;
      const inset = 0.05; // 5% inset - very aggressive to clip past texture borders
      
      for (let i = 0; i < uvs.length; i += 2) {
        const u = uvs[i];
        const v = uvs[i + 1];
        
        // Apply inset: push UVs significantly inward from edges
        // Map from [0,1] to [inset, 1-inset]
        uvs[i] = inset + u * (1 - 2 * inset);
        uvs[i + 1] = inset + v * (1 - 2 * inset);
      }
      
      uvAttribute.needsUpdate = true;
    }
  }, []);

  // If normal/roughness maps exist, render with PBR material
  if (normalMap || roughnessMap) {
    return (
        <mesh
          ref={meshRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[(x - playerX) * TILE_WORLD_SIZE + TILE_WORLD_SIZE/2, 0.0, (y - playerY) * TILE_WORLD_SIZE + TILE_WORLD_SIZE/2]}
        >
        <planeGeometry ref={geometryRef} args={[1, 1]} />
        <meshStandardMaterial map={texture} normalMap={normalMap} roughnessMap={roughnessMap} metalness={0} roughness={0.6} />
      </mesh>
    );
  }
  // Fallback to basic material
  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[(x - playerX) * TILE_WORLD_SIZE + TILE_WORLD_SIZE/2, 0.0, (y - playerY) * TILE_WORLD_SIZE + TILE_WORLD_SIZE/2]}
    >
      <planeGeometry ref={geometryRef} args={[1, 1]} />
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
  const geometryRef = useRef<PlaneGeometry | null>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = x - playerX + 0.5;
      meshRef.current.position.z = y - playerY + 0.5;
    }
  });

  // Apply AGGRESSIVE UV inset to prevent white edges
  useEffect(() => {
    if (geometryRef.current) {
      const uvAttribute = geometryRef.current.attributes.uv;
      const uvs = uvAttribute.array as Float32Array;
      const inset = 0.05; // 5% inset - very aggressive to clip past texture borders
      
      for (let i = 0; i < uvs.length; i += 2) {
        const u = uvs[i];
        const v = uvs[i + 1];
        
        // Apply inset: push UVs significantly inward from edges
        // Map from [0,1] to [inset, 1-inset]
        uvs[i] = inset + u * (1 - 2 * inset);
        uvs[i + 1] = inset + v * (1 - 2 * inset);
      }
      
      uvAttribute.needsUpdate = true;
    }
  }, []);

  return (
    <mesh
      ref={meshRef}
      rotation={[Math.PI / 2, 0, 0]}
      position={[x - playerX + 0.5, 1.0, y - playerY + 0.5]}
    >
      <planeGeometry ref={geometryRef} args={[1, 1]} />
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
  // Pillars: detect 90-degree wall intersections and place pillars there
  const pillarIntersections = useMemo(() => {
    if (!wallTiles || wallTiles.length === 0) return [] as Array<{x:number,y:number}>
    const wallSet = new Set<string>(wallTiles.map(t => t.x + ',' + t.y))
    const corners: Array<{x:number, y:number}> = []
    const seen = new Set<string>()
    for (const w of wallTiles) {
      const x = w.x, y = w.y
      const NE = wallSet.has((x+1) + ',' + y) && wallSet.has(x + ',' + (y-1))
      if (NE) { const cx = x + 0.5, cy = y - 0.5; const key = cx + ',' + cy; if (!seen.has(key)) { seen.add(key); corners.push({x: cx, y: cy}) } }
      const NW = wallSet.has((x-1) + ',' + y) && wallSet.has(x + ',' + (y-1))
      if (NW) { const cx = x - 0.5, cy = y - 0.5; const key = cx + ',' + cy; if (!seen.has(key)) { seen.add(key); corners.push({x: cx, y: cy}) } }
      const SE = wallSet.has((x+1) + ',' + y) && wallSet.has(x + ',' + (y+1))
      if (SE) { const cx = x + 0.5, cy = y + 0.5; const key = cx + ',' + cy; if (!seen.has(key)) { seen.add(key); corners.push({x: cx, y: cy}) } }
      const SW = wallSet.has((x-1) + ',' + y) && wallSet.has(x + ',' + (y+1))
      if (SW) { const cx = x - 0.5, cy = y + 0.5; const key = cx + ',' + cy; if (!seen.has(key)) { seen.add(key); corners.push({x: cx, y: cy}) } }
    }
    return corners
  }, [wallTiles])

  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.9} />

      <CameraController x={px} y={py} dir={gameData.dir} />

      {/* Walls (and doors) with hash-based texture variety */}
      {wallTiles.map((w) => {
        const isDoor = w.tile === TILE_DOOR;
        // Build wall texture pool including any custom wall textures
        let wallPool = wallTextures.slice();
        if (textures?.customWalls?.length) wallPool = wallPool.concat(textures.customWalls);
        // Optional testing switch: ?wallMode=new to force new walls; default uses existing plus custom
        const wallTexIndex = wallPool.length > 0 ? tileHash(w.x, w.y, wallPool.length) : 0;
        const tex = wallPool[wallTexIndex] || wallPool[0];
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
      {/* Pillars between walls at 90-degree corners */}
      {pillarIntersections.map((p) => (
        <WallPillar key={`pillar-${p.x}-${p.y}`} x={p.x} y={p.y} playerX={px} playerY={py} />
      ))}

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
        const tileIndex2 = floorTextures.length > 0 ? tileHash(f.x, f.y, floorTextures.length) : 0;
        const tex = floorTextures[tileIndex2] || floorTextures[0];
        if (!tex) return null;
        // Deterministic per-tile rim variant
        const seed = (f.x * 374761393 + f.y * 668265263) >>> 0;
        const variant = seed % 4;

        // Check adjacent tiles to determine which rims to draw (only on borders with walls/unwalkable)
        const isOpen = (tx: number, ty: number) => {
          if (tx < 0 || tx >= map[0].length || ty < 0 || ty >= map.length) return false;
          const t = map[ty][tx];
          return t !== TILE_WALL && t !== TILE_DOOR;
        };

        const rims = [];
        if (!isOpen(f.x, f.y - 1)) rims.push(<FloorRim key={`rim-n-${f.x}-${f.y}`} edge={'N' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />);
        if (!isOpen(f.x, f.y + 1)) rims.push(<FloorRim key={`rim-s-${f.x}-${f.y}`} edge={'S' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />);
        if (!isOpen(f.x - 1, f.y)) rims.push(<FloorRim key={`rim-w-${f.x}-${f.y}`} edge={'W' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />);
        if (!isOpen(f.x + 1, f.y)) rims.push(<FloorRim key={`rim-e-${f.x}-${f.y}`} edge={'E' as RimEdge} variant={variant} x={f.x} y={f.y} px={px} py={py} texture={rimTexture} />);

        // Compute per-tile maps for potential PBR textures (with parity for extra floors)
        const tileIndex = floorTextures.length > 0 ? tileHash(f.x, f.y, floorTextures.length) : 0;
        let texToUse = floorTextures[tileIndex] || floorTextures[0];
        if (textures?.stylizedFloors?.length) {
          const stylIndex = tileHash(f.x, f.y, textures.stylizedFloors.length);
          const stylTex = textures.stylizedFloors[stylIndex];
          if (stylTex) texToUse = stylTex;
        }
        const normalTex = textures?.normals?.length ? textures.normals[tileIndex % textures.normals.length] : undefined;
        const roughTex = textures?.roughness?.length ? textures.roughness[tileIndex % textures.roughness.length] : undefined;
        return (
          <group key={`fgroup-${f.x}-${f.y}`}>
            <FloorTile
              key={`f-${f.x}-${f.y}`}
              x={f.x}
              y={f.y}
              playerX={px}
              playerY={py}
              texture={texToUse!}
              // Pass PBR maps if present (Phase 4)
              normalMap={normalTex}
              roughnessMap={roughTex}
            />
            {rims}
          </group>
        );
      })}

      {/* Ceiling tiles with hash-based texture variety */}
      {floorTiles.map((f) => {
        const ceilTexIndex = ceilingTextures.length > 0 ? tileHash(f.x + 3, f.y + 7, ceilingTextures.length) : 0;
        const tex = ceilingTextures[ceilTexIndex] || ceilingTextures[0];
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

      // Phase 3/4: load normals and roughness maps for Phase 4 improvements
    const textureVersionQuery = `?v=${TEXTURE_VERSION}`;
    // 9 additional floor textures (10-18) - new pool for variation
    const stylizedPaths = [
      `/assets/textures/floor1ground10.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground11.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground12.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground13.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground14.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground15.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground16.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground17.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground18.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground19.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground20.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground21.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground22.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground23.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground24.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground25.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground26.PNG${textureVersionQuery}`,
      `/assets/textures/floor1ground27.PNG${textureVersionQuery}`,
    ];
    // Stylized floor textures pool for Phase 3 (9 new textures will be added by user)
    const normalPaths = [
      `/assets/textures/floor1ground1_normal.png${textureVersionQuery}`,
      `/assets/textures/floor1ground2_normal.png${textureVersionQuery}`,
      `/assets/textures/floor1ground3_normal.png${textureVersionQuery}`,
      `/assets/textures/floor1ground4_normal.png${textureVersionQuery}`,
      `/assets/textures/floor1ground5_normal.png${textureVersionQuery}`,
      `/assets/textures/floor1ground6_normal.png${textureVersionQuery}`,
      `/assets/textures/floor1ground7_normal.png${textureVersionQuery}`,
      `/assets/textures/floor1ground8_normal.png${textureVersionQuery}`,
      `/assets/textures/floor1ground9_normal.png${textureVersionQuery}`,
    ];
    const roughPaths = [
      `/assets/textures/floor1ground1_rough.png${textureVersionQuery}`,
      `/assets/textures/floor1ground2_rough.png${textureVersionQuery}`,
      `/assets/textures/floor1ground3_rough.png${textureVersionQuery}`,
      `/assets/textures/floor1ground4_rough.png${textureVersionQuery}`,
      `/assets/textures/floor1ground5_rough.png${textureVersionQuery}`,
      `/assets/textures/floor1ground6_rough.png${textureVersionQuery}`,
      `/assets/textures/floor1ground7_rough.png${textureVersionQuery}`,
      `/assets/textures/floor1ground8_rough.png${textureVersionQuery}`,
      `/assets/textures/floor1ground9_rough.png${textureVersionQuery}`,
    ];
    Promise.all([
      Promise.all(wallPaths.map((p) => loadTex(loader, p))),
      Promise.all(floorPaths.map((p) => loadTex(loader, p))),
      Promise.all(ceilingPaths.map((p) => loadTex(loader, p))),
      Promise.all(normalPaths.map((p) => loadTex(loader, p))),
      Promise.all(roughPaths.map((p) => loadTex(loader, p))),
      Promise.all(stylizedPaths.map((p) => loadTex(loader, p))),
      loadTex(loader, doorPath),
    ]).then(([walls, floors, ceilings, normals, roughness, stylizedTexes, door]) => {
      const validWalls = walls.filter((t): t is Texture => t !== null);
      const validFloors = floors.filter((t): t is Texture => t !== null);
      const validCeilings = ceilings.filter((t): t is Texture => t !== null);
      const validNormals = normals.filter((t): t is Texture => t !== null);
      const validRough = roughness.filter((t): t is Texture => t !== null);

      console.log(`[WebGL] Textures loaded for level ${gameData.level}:`, {
        walls: validWalls.length,
        floors: validFloors.length,
        ceilings: validCeilings.length,
        door: !!door,
      });

      setTextures({
        walls: validWalls,
        floors: validFloors,
        normals: normals.filter((t): t is Texture => t !== null),
        roughness: roughness.filter((t): t is Texture => t !== null),
        stylizedFloors: stylizedTexes.filter((t): t is Texture => t !== null),
        ceilings: validCeilings,
        door,
      });
      // Load additional wall textures (wall1-wall5) with transparency so they blend with ceilings/floors
      const extraWallPaths = [
        `/assets/textures/wall1.jpg${textureVersionQuery}`,
        `/assets/textures/wall2.jpg${textureVersionQuery}`,
        `/assets/textures/wall3.jpg${textureVersionQuery}`,
        `/assets/textures/wall4.jpg${textureVersionQuery}`,
        `/assets/textures/wall5.jpg${textureVersionQuery}`,
        `/assets/textures/wall6.jpg${textureVersionQuery}`,
        `/assets/textures/wall7.jpg${textureVersionQuery}`,
        `/assets/textures/wall8.jpg${textureVersionQuery}`,
        `/assets/textures/wall9.jpg${textureVersionQuery}`,
        `/assets/textures/wall10.jpg${textureVersionQuery}`,
      ];
      Promise.all(extraWallPaths.map((p) => loadTransparentWallTexture(p))).then((customs) => {
        const arr = customs.filter((t): t is Texture => t !== null);
        if (arr.length) {
          setTextures((prev) => (prev ? { ...prev, customWalls: arr } : prev));
        }
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
      {/* Top-center coords overlay for 3D view */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 text-primary font-pixel text-xs px-2 py-1 rounded">
        X:{gameData.x} Y:{gameData.y} L:{gameData.level}
      </div>
    </div>
  );
}

export default WebGLDungeonView;
