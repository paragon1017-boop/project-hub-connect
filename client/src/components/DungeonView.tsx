import { useEffect, useRef, useCallback } from "react";
import { GameData, NORTH, EAST, SOUTH, WEST, TILE_FLOOR, TILE_LADDER_UP, TILE_LADDER_DOWN } from "@/lib/game-engine";
import * as THREE from 'three';

interface DungeonViewProps {
  gameData: GameData;
  className?: string;
  renderWidth?: number;
  renderHeight?: number;
  visualX?: number;  // Optional interpolated X position for smooth movement
  visualY?: number;  // Optional interpolated Y position for smooth movement
  viewportScale?: number;  // User's preferred viewport scale (0.5-1.0)
  onCanvasRef?: (canvas: HTMLCanvasElement | null) => void;
}

// Cache buster for texture reloads during development
const TEXTURE_VERSION = 25;
const textureVersionQuery = `?v=${TEXTURE_VERSION}`;

// Border offset to clip white edges from textures (pixels)
const TEXTURE_BORDER_CLIP = 32;

// Get texture paths for a specific dungeon level (1-10, each with unique textures)
function getTexturesForLevel(level: number): { wall: string; floor: string; ceiling: string; extraFloors?: string[]; extraWalls?: string[]; extraCeilings?: string[] } {
  const lvl = Math.max(1, Math.min(10, level));
  const v = `?v=${TEXTURE_VERSION}`;
  
  if (lvl === 1) {
    return {
      wall: `/assets/textures/floor1tile1.PNG${textureVersionQuery}`,
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
        `/assets/textures/floor1ground8.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground9.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground10.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground11.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground12.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground13.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground14.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground15.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground16.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground17.PNG${textureVersionQuery}`,
        `/assets/textures/floor1ground18.PNG${textureVersionQuery}`,
      ],
      extraCeilings: [
        `/assets/textures/ceiling1floor2.PNG${textureVersionQuery}`,
        `/assets/textures/ceiling1floor3.PNG${textureVersionQuery}`,
        `/assets/textures/ceiling1floor4.PNG${textureVersionQuery}`,
      ],
    };
  }
  
  return {
    wall: `/assets/textures/wall_${lvl}.png${textureVersionQuery}`,
    floor: `/assets/textures/floor_${lvl}.png${textureVersionQuery}`,
    ceiling: `/assets/textures/ceiling_stone_dungeon.png${textureVersionQuery}`
  };
}

export function DungeonView({ gameData, className, renderWidth = 800, renderHeight = 600, visualX, visualY, viewportScale = 0.7, onCanvasRef }: DungeonViewProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const texturesRef = useRef<{ wall: HTMLImageElement | null; floor: HTMLImageElement | null; ceiling: HTMLImageElement | null; door: HTMLImageElement | null; extraFloors: HTMLImageElement[]; extraWalls: HTMLImageElement[]; extraCeilings: HTMLImageElement[] }>({ wall: null, floor: null, ceiling: null, door: null, extraFloors: [], extraWalls: [], extraCeilings: [] });
  
  // Add Three.js texture loader for performance optimizations
  const threeTextureLoader = useRef<THREE.TextureLoader | null>(null);
  const threeTexturesRef = useRef<{ wall: THREE.Texture | null; floor: THREE.Texture | null; ceiling: THREE.Texture | null; door: THREE.Texture | null; extraFloors: THREE.Texture[]; extraWalls: THREE.Texture[]; extraCeilings: THREE.Texture[] }>({ wall: null, floor: null, ceiling: null, door: null, extraFloors: [], extraWalls: [], extraCeilings: [] });
  
  // Callback ref to notify parent when canvas is mounted, and store locally
  const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    internalCanvasRef.current = canvas;
    if (onCanvasRef) {
      onCanvasRef(canvas);
    }
    
    // Initialize Three.js texture loader for performance optimizations
    if (canvas && !threeTextureLoader.current) {
      threeTextureLoader.current = new THREE.TextureLoader();
      threeTextureLoader.current.setCrossOrigin('anonymous');
    }
    
    // Initialize Web Worker for maximum performance
    if (useWorker && !raycastingWorker.current && typeof Worker !== 'undefined') {
      raycastingWorker.current = new Worker('/workers/raycastingWorker.js');
      
      raycastingWorker.current.onmessage = (e) => {
        const { type, data } = e.data;
        if (type === 'raycast-results') {
          workerResults.current = data;
        }
      };
    }
  }, [onCanvasRef]);
  
  // Alias for internal usage
  const canvasRef = internalCanvasRef;
  const currentLevelRef = useRef<string | null>(null);
  
  // Dirty tracking to skip redundant redraws
  const lastRenderState = useRef<{ x: number; y: number; dir: number; level: number; width: number; height: number } | null>(null);
  


  // Load textures based on current dungeon level (unique textures for each level 1-10)
  useEffect(() => {
    const level = Math.max(1, Math.min(10, gameData.level));
    const levelKey = `${level}-v${TEXTURE_VERSION}`;
    
    if (currentLevelRef.current === levelKey) return;
    currentLevelRef.current = levelKey;
    const texturePaths = getTexturesForLevel(level);
    
    // Reset textures
    texturesRef.current = { wall: null, floor: null, ceiling: null, door: null, extraFloors: [], extraWalls: [], extraCeilings: [] };
    
    // Load textures with proper error handling
    const loadTexture = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => {
          console.warn(`Failed to load texture: ${src}`);
          resolve(null as any); // Resolve with null to prevent blocking
        };
        img.src = src;
      });
    };

    // Load optimized Three.js textures with mipmapping and proper filtering
    const loadOptimizedTexture = (src: string): Promise<THREE.Texture | null> => {
      return new Promise((resolve) => {
        if (!threeTextureLoader.current) {
          resolve(null);
          return;
        }

        // Try to load compressed WebP version first, fallback to PNG
        const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        
        const loadWithFallback = (primarySrc: string, fallbackSrc: string) => {
          threeTextureLoader.current!.load(
            primarySrc,
            (texture) => {
              // Apply performance optimizations
              texture.generateMipmaps = true;
              texture.minFilter = THREE.LinearMipmapLinearFilter;
              texture.magFilter = THREE.LinearFilter;
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              texture.anisotropy = 4; // Improve texture quality at angles
              texture.needsUpdate = true;
              resolve(texture);
            },
            (progress) => {
              // Optional: track loading progress
              console.log(`Loading texture: ${primarySrc}`, (progress.loaded / progress.total * 100).toFixed(1) + '%');
            },
            (error) => {
              console.warn(`Failed to load primary texture: ${primarySrc}, trying fallback...`);
              // Try fallback texture
              threeTextureLoader.current!.load(
                fallbackSrc,
                (fallbackTexture) => {
                  fallbackTexture.generateMipmaps = true;
                  fallbackTexture.minFilter = THREE.LinearMipmapLinearFilter;
                  fallbackTexture.magFilter = THREE.LinearFilter;
                  fallbackTexture.wrapS = THREE.RepeatWrapping;
                  fallbackTexture.wrapT = THREE.RepeatWrapping;
                  fallbackTexture.anisotropy = 4;
                  fallbackTexture.needsUpdate = true;
                  resolve(fallbackTexture);
                },
                undefined,
                () => {
                  console.error(`Failed to load both texture versions: ${primarySrc}, ${fallbackSrc}`);
                  resolve(null);
                }
              );
            }
          );
        };

        loadWithFallback(webpSrc, src);
      });
    };
    
    // Load all textures in parallel
    const loadAllTextures = async () => {
      try {
        // Load primary textures (both HTML and Three.js versions)
        const [wallImg, floorImg, ceilingImg, doorImg] = await Promise.all([
          loadTexture(texturePaths.wall),
          loadTexture(texturePaths.floor),
          loadTexture(texturePaths.ceiling),
          loadTexture(`/assets/textures/door_metal.png?v=${TEXTURE_VERSION}`)
        ]);

        // Load optimized Three.js textures in parallel
        const [wallTex, floorTex, ceilingTex, doorTex] = await Promise.all([
          loadOptimizedTexture(texturePaths.wall),
          loadOptimizedTexture(texturePaths.floor),
          loadOptimizedTexture(texturePaths.ceiling),
          loadOptimizedTexture(`/assets/textures/door_metal.png?v=${TEXTURE_VERSION}`)
        ]);
        
        // Load extra textures if they exist (both HTML and Three.js)
        const extraFloorPromises = texturePaths.extraFloors?.map(src => loadTexture(src)) || [];
        const extraWallPromises = texturePaths.extraWalls?.map(src => loadTexture(src)) || [];
        const extraCeilingPromises = texturePaths.extraCeilings?.map(src => loadTexture(src)) || [];
        
        const extraFloorTexPromises = texturePaths.extraFloors?.map(src => loadOptimizedTexture(src)) || [];
        const extraWallTexPromises = texturePaths.extraWalls?.map(src => loadOptimizedTexture(src)) || [];
        const extraCeilingTexPromises = texturePaths.extraCeilings?.map(src => loadOptimizedTexture(src)) || [];
        
        const [extraFloors, extraWalls, extraCeilings] = await Promise.all([
          Promise.all(extraFloorPromises),
          Promise.all(extraWallPromises),
          Promise.all(extraCeilingPromises)
        ]);

        const [extraFloorTextures, extraWallTextures, extraCeilingTextures] = await Promise.all([
          Promise.all(extraFloorTexPromises),
          Promise.all(extraWallTexPromises),
          Promise.all(extraCeilingTexPromises)
        ]);
        
        // Update HTML textures ref (for current Canvas 2D rendering)
        texturesRef.current = {
          wall: wallImg,
          floor: floorImg,
          ceiling: ceilingImg,
          door: doorImg,
          extraFloors: extraFloors.filter(Boolean),
          extraWalls: extraWalls.filter(Boolean),
          extraCeilings: extraCeilings.filter(Boolean)
        };

        // Update Three.js textures ref (for potential WebGL upgrade)
        threeTexturesRef.current = {
          wall: wallTex,
          floor: floorTex,
          ceiling: ceilingTex,
          door: doorTex,
          extraFloors: extraFloorTextures.filter((tex): tex is THREE.Texture => tex !== null),
          extraWalls: extraWallTextures.filter((tex): tex is THREE.Texture => tex !== null),
          extraCeilings: extraCeilingTextures.filter((tex): tex is THREE.Texture => tex !== null)
        };
        
        console.log('Textures loaded successfully:', {
          htmlTextures: { wall: !!wallImg, floor: !!floorImg, ceiling: !!ceilingImg, door: !!doorImg },
          threeTextures: { wall: !!wallTex, floor: !!floorTex, ceiling: !!ceilingTex, door: !!doorTex }
        });
        
        // Trigger redraw
        lastRenderState.current = null;
        draw();
      } catch (error) {
        console.error('Error loading textures:', error);
        // Fallback: trigger redraw even if textures failed
        lastRenderState.current = null;
        draw();
      }
    };
    
    loadAllTextures();
  }, [gameData.level]);

  // Redraw when game data, visual position, or resolution changes
  // Performance monitoring only (no artificial limits)
  const frameRateRef = useRef<{ lastTime: number; frameCount: number; fps: number }>({ lastTime: 0, frameCount: 0, fps: 0 });
  
  // Object pooling to reduce garbage collection
  const vectorPool = useRef<{ x: number; y: number }[]>([]);
  const rayPool = useRef<{ x: number; y: number; side: number; distance: number }[]>([]);
  
  // Web Worker for raycasting (max performance)
  const raycastingWorker = useRef<Worker | null>(null);
  const workerResults = useRef<any[]>([]);
  const useWorker = true; // Set to true for unlimited FPS
  
  const getVector = (x: number, y: number) => {
    if (vectorPool.current.length > 0) {
      const vec = vectorPool.current.pop()!;
      vec.x = x;
      vec.y = y;
      return vec;
    }
    return { x, y };
  };
  
  const returnVector = (vec: { x: number; y: number }) => {
    vectorPool.current.push(vec);
  };
  
  const measureFPS = useCallback(() => {
    const now = performance.now();
    frameRateRef.current.frameCount++;
    
    if (now - frameRateRef.current.lastTime >= 1000) {
      frameRateRef.current.fps = Math.round((frameRateRef.current.frameCount * 1000) / (now - frameRateRef.current.lastTime));
      frameRateRef.current.frameCount = 0;
      frameRateRef.current.lastTime = now;
      
      // Log raw FPS (no artificial limits)
      if (process.env.NODE_ENV === 'development') {
        console.log(`DungeonView FPS: ${frameRateRef.current.fps} (UNLIMITED)`);
      }
    }
  }, []);

  useEffect(() => {
    draw();
  }, [gameData, renderWidth, renderHeight, visualX, visualY]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    measureFPS();
    
    // Calculate scaled render dimensions based on viewport scale
    const actualViewportScale = viewportScale || 0.7;
    const scaledRenderWidth = Math.floor(renderWidth * actualViewportScale);
    const scaledRenderHeight = Math.floor(renderHeight * actualViewportScale);
    
    // Use interpolated visual position if provided, otherwise use logical position
    const currentX = visualX !== undefined ? visualX : gameData.x;
    const currentY = visualY !== undefined ? visualY : gameData.y;
    
    // Dirty check - skip redraw if nothing changed (with small tolerance for floating point)
    const last = lastRenderState.current;
    if (last && 
        Math.abs(last.x - currentX) < 0.001 && 
        Math.abs(last.y - currentY) < 0.001 && 
        last.dir === gameData.dir && 
        last.level === gameData.level &&
        last.width === renderWidth &&
        last.height === renderHeight) {
      return; // Skip redraw - nothing changed
    }
    
    // Update last render state
    lastRenderState.current = { x: currentX, y: currentY, dir: gameData.dir, level: gameData.level, width: renderWidth, height: renderHeight };
    
    // Get context with alpha:false for better performance
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Enable image smoothing for smoother textures
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Clear entire canvas with black - prevents any colored artifacts from showing through gaps
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simple Raycaster Settings
    const map = gameData.map;
    
    // Ensure camera position stays within map bounds with better safety margins
    const safeX = Math.max(0.1, Math.min(map[0].length - 1.1, currentX));
    const safeY = Math.max(0.1, Math.min(map.length - 1.1, currentY));
    
    // Check if current interpolated position would put camera inside a wall
    // If so, use the floor position of the player's actual tile
    let floorX = Math.floor(safeX);
    let floorY = Math.floor(safeY);
    const fracX = safeX - floorX;
    const fracY = safeY - floorY;
    
    // Enhanced collision detection - check surrounding tiles
    const checkTile = (x: number, y: number): boolean => {
      if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return false;
      return map[y][x] === TILE_FLOOR || map[y][x] === TILE_LADDER_UP || map[y][x] === TILE_LADDER_DOWN;
    };
    
    // Ensure current tile and adjacent tiles are walkable
    if (!checkTile(floorX, floorY) || 
        !checkTile(floorX + 1, floorY) || 
        !checkTile(floorX - 1, floorY) ||
        !checkTile(floorX, floorY + 1) || 
        !checkTile(floorX, floorY - 1)) {
      // Fallback to player's logical position
      floorX = gameData.x;
      floorY = gameData.y;
    }
    
    // Conservative clamping to prevent wall clipping (0.15 to 0.85)
    const clampedFracX = Math.max(0.15, Math.min(0.85, fracX));
    const clampedFracY = Math.max(0.15, Math.min(0.85, fracY));
    
    const posX = floorX + clampedFracX + 0.5;
    const posY = floorY + clampedFracY + 0.5;
    
    // Direction vectors based on cardinal direction (0=N, 1=E, 2=S, 3=W)
    // plane values of 1.73 = 120° FOV for ultra-wide immersive view
    let dirX = 0, dirY = 0, planeX = 0, planeY = 0;
    
    switch(gameData.dir) {
      case NORTH: dirY = -1; planeX = 1.0; break;
      case SOUTH: dirY = 1; planeX = -1.0; break;
      case EAST: dirX = 1; planeY = 1.0; break;
      case WEST: dirX = -1; planeY = -1.0; break;
    }

    const w = canvas.width;
    const h = canvas.height;
    
    // For debugging - show actual rendering dimensions
    if (process.env.NODE_ENV === 'development') {
      console.log(`Viewport Scale: ${actualViewportScale}, Scaled Size: ${scaledRenderWidth}x${scaledRenderHeight}, Original: ${renderWidth}x${renderHeight}`);
    }
    
    // Maximum quality settings for unlimited FPS
    const pxStep = 1; // Full resolution - no performance compromise
    const textureSampleSize = 8; // Maximum texture quality - best visuals

    // Draw Ceiling with perspective texture, randomly mixed per tile
    const ceilingTex = texturesRef.current.ceiling || texturesRef.current.floor;
    const allCeilingTextures = [ceilingTex, ...texturesRef.current.extraCeilings].filter(Boolean) as HTMLImageElement[];
    if (ceilingTex) {
      for (let y = 0; y < Math.floor(h / 2); y++) {
        const p = Math.floor(h / 2) - y;
        // Smaller multiplier (0.3 instead of 0.5) makes tiles appear flatter and smaller
        const rowDistance = (h * 0.3) / p;
        
        const ceilStepX = rowDistance * (planeX * 2) / w;
        const ceilStepY = rowDistance * (planeY * 2) / w;
        
        let ceilX = posX + rowDistance * (dirX - planeX);
        let ceilY = posY + rowDistance * (dirY - planeY);
        
          for (let x = 0; x < w; x += pxStep) {
          const tileX = Math.floor(ceilX);
          const tileY = Math.floor(ceilY);
          const tileHash = ((tileX * 7919 + tileY * 104729) & 0x7fffffff) % allCeilingTextures.length;
          const tex = allCeilingTextures[tileHash];
          if (tex && tex.width > 0 && tex.height > 0) {
            // Get fractional position within this tile (0-1)
            const fracX = ceilX - tileX;
            const fracY = ceilY - tileY;
            
            // Sample from full texture to show stone rims around tiles
            const txC = Math.floor(fracX * tex.width);
            const tyC = Math.floor(fracY * tex.height);
            
            // Sample full texture to show complete tile with borders
            ctx.drawImage(tex, txC, tyC, 4, 4, x, y, pxStep, 1);
          }
          
          ceilX += ceilStepX * pxStep;
          ceilY += ceilStepY * pxStep;
        }
      }
    } else {
      const ceilingGradient = ctx.createLinearGradient(0, 0, 0, h / 2);
      ceilingGradient.addColorStop(0, "#0a0806");
      ceilingGradient.addColorStop(1, "#1a1510");
      ctx.fillStyle = ceilingGradient;
      ctx.fillRect(0, 0, w, h / 2);
    }

    // Draw Floor with perspective floor casting, randomly mixed per tile
    const floorTex = texturesRef.current.floor;
    const allFloorTextures = [floorTex, ...texturesRef.current.extraFloors].filter(Boolean) as HTMLImageElement[];
    if (floorTex) {
      for (let y = Math.floor(h / 2) + 1; y < h; y++) {
        const p = y - h / 2;
        // Smaller multiplier (0.3 instead of 0.5) makes tiles appear flatter and smaller
        const rowDistance = (h * 0.3) / p;
        
        const floorStepX = rowDistance * (planeX * 2) / w;
        const floorStepY = rowDistance * (planeY * 2) / w;
        
        let floorX = posX + rowDistance * (dirX - planeX);
        let floorY = posY + rowDistance * (dirY - planeY);
        
        for (let x = 0; x < w; x += pxStep) {
          const tileX = Math.floor(floorX);
          const tileY = Math.floor(floorY);
          const tileHash = ((tileX * 7919 + tileY * 104729) & 0x7fffffff) % allFloorTextures.length;
          const tex = allFloorTextures[tileHash];
          if (tex && tex.width > 0 && tex.height > 0) {
            // Get fractional position within this tile (0-1)
            const fracX = floorX - tileX;
            const fracY = floorY - tileY;
            
            // Sample from full texture to show stone rims around tiles
            const txF = Math.floor(fracX * tex.width);
            const tyF = Math.floor(fracY * tex.height);
            
            // Sample full texture to show complete tile with borders
            ctx.drawImage(tex, txF, tyF, 4, 4, x, y, pxStep, 1);
          }
          
          floorX += floorStepX * pxStep;
          floorY += floorStepY * pxStep;
        }
      }
      
    } else {
      // Fallback gradient floor
      const floorGradient = ctx.createLinearGradient(0, h / 2, 0, h);
      floorGradient.addColorStop(0, "#2a2520");
      floorGradient.addColorStop(0.5, "#3d3528");
      floorGradient.addColorStop(1, "#1a1510");
      ctx.fillStyle = floorGradient;
      ctx.fillRect(0, h / 2, w, h / 2);
    }

    // Pre-compute wall texture array once for the raycasting loop
    const allWallTextures = [texturesRef.current.wall, ...texturesRef.current.extraWalls].filter(Boolean) as HTMLImageElement[];

    // Optimized Raycasting Loop
    const wHalf = w * 0.5;
    const invW = 1 / w;
    
    for (let x = 0; x < w; x+=pxStep) {
      // Pre-compute expensive calculations
      const cameraX = 2 * x * invW - 1;
      const rayDirX = dirX + planeX * cameraX;
      const rayDirY = dirY + planeY * cameraX;

      let mapX = Math.floor(posX);
      let mapY = Math.floor(posY);

      let sideDistX, sideDistY;
      
      // Cache expensive divisions
      const deltaDistX = Math.abs(1 / rayDirX);
      const deltaDistY = Math.abs(1 / rayDirY);
      
      let perpWallDist;
      let stepX, stepY;
      let hit = 0;
      let side;

      if (rayDirX < 0) {
        stepX = -1;
        sideDistX = (posX - mapX) * deltaDistX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1.0 - posX) * deltaDistX;
      }

      if (rayDirY < 0) {
        stepY = -1;
        sideDistY = (posY - mapY) * deltaDistY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1.0 - posY) * deltaDistY;
      }

      // DDA
      let hitBoundary = false;
      while (hit === 0) {
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }
        // Bounds check - use max distance so boundary walls still render as dark strips
        if (mapY < 0 || mapX < 0 || mapY >= map.length || mapX >= map[0].length) {
          hit = 1;
          hitBoundary = true;
        } else if (map[mapY][mapX] > 0) {
          hit = map[mapY][mapX]; // 1 = wall, 2 = door
        }
      }
      
      const isDoor = hit === 2;

      // Calculate perpendicular wall distance (skip for boundary hits to avoid invalid coords)
      if (side === 0) perpWallDist = (mapX - posX + (1 - stepX) / 2) / rayDirX;
      else           perpWallDist = (mapY - posY + (1 - stepY) / 2) / rayDirY;
      
      // Clamp to sane range - prevents garbage values from boundary hits or floating point issues
      if (!perpWallDist || perpWallDist <= 0 || !isFinite(perpWallDist)) perpWallDist = 20;
      perpWallDist = Math.max(0.1, Math.min(perpWallDist, 20));

      // Draw Wall Strip
      // Lower camera position to show more floor/ceiling - makes dungeon feel taller
      const CAMERA_HEIGHT_OFFSET = -0.3; // Negative = lower camera, shows more floor
      const lineHeight = Math.floor(h / perpWallDist);
      const centerLine = h / 2;
      const verticalShift = lineHeight * CAMERA_HEIGHT_OFFSET;
      const drawStart = Math.max(0, -lineHeight / 2 + centerLine + verticalShift);
      const drawEnd = Math.min(h - 1, lineHeight / 2 + centerLine + verticalShift);

      // Texture mapping
       if (allWallTextures.length > 0) {
          const wallTileHash = ((mapX * 7919 + mapY * 104729) & 0x7fffffff) % allWallTextures.length;
          const selectedWallTex = allWallTextures[wallTileHash];

          let wallX;
          if (side === 0) wallX = posY + perpWallDist * rayDirY;
          else            wallX = posX + perpWallDist * rayDirX;
          wallX -= Math.floor(wallX);

          // Darken farther walls
          ctx.globalAlpha = 1.0;
          if (side === 1) ctx.globalAlpha = 0.7; // Shading for y-axis walls

          // Distance fog
          const fog = Math.min(1, 4.0 / perpWallDist);

          if (isDoor) {
            // Draw metal door using texture with stone frame
            const doorHeight = drawEnd - drawStart;
            const doorTex = texturesRef.current.door;
            const wallTex = selectedWallTex;

            // Door frame parameters (percentage of door width)
            const frameWidth = 0.12; // Stone frame on each side
            const topFrameHeight = 0.08; // Stone lintel at top
            const isInFrame = wallX < frameWidth || wallX > (1 - frameWidth);
            const isInTopFrame = true; // We'll handle top frame with height

            if (isInFrame && wallTex) {
              // Draw stone frame on edges using wall texture with smoothing
              const usableFrameWidth = wallTex.width - (TEXTURE_BORDER_CLIP * 2);
              const usableFrameHeight = wallTex.height - (TEXTURE_BORDER_CLIP * 2);
              const frameTexX = TEXTURE_BORDER_CLIP + (Math.floor(wallX * usableFrameWidth) % usableFrameWidth);

              if (side === 1) {
                ctx.globalAlpha = 0.8;
              }

              ctx.drawImage(
                wallTex,
                Math.max(TEXTURE_BORDER_CLIP, frameTexX - 6), TEXTURE_BORDER_CLIP, 12, usableFrameHeight,
                x - 1, drawStart, pxStep + 2, doorHeight
              );

              ctx.globalAlpha = 0.4;
              ctx.fillStyle = "#000";
              if (wallX < frameWidth) {
                if (wallX > frameWidth - 0.03) {
                  ctx.fillRect(x, drawStart, pxStep, doorHeight);
                }
              } else {
                if (wallX < (1 - frameWidth) + 0.03) {
                  ctx.fillRect(x, drawStart, pxStep, doorHeight);
                }
              }
              ctx.globalAlpha = 1.0;
            } else if (doorTex) {
              // Draw the door itself (recessed slightly)
              // Map wallX from frame area to full door texture
              const doorAreaStart = frameWidth;
              const doorAreaEnd = 1 - frameWidth;
              const doorTexWallX = (wallX - doorAreaStart) / (doorAreaEnd - doorAreaStart);
              const usableDoorWidth = doorTex.width - (TEXTURE_BORDER_CLIP * 2);
              const doorTexX = TEXTURE_BORDER_CLIP + (Math.floor(Math.max(0, Math.min(1, doorTexWallX)) * usableDoorWidth));

              // Top stone lintel
              const lintelHeight = Math.floor(doorHeight * topFrameHeight);

              if (wallTex) {
                // Draw lintel at top with smoothing
                const usableLintelWidth = wallTex.width - (TEXTURE_BORDER_CLIP * 2);
                const lintelTexX = TEXTURE_BORDER_CLIP + (Math.floor(wallX * usableLintelWidth) % usableLintelWidth);
                const usableLintelHeight = Math.floor((wallTex.height - (TEXTURE_BORDER_CLIP * 2)) * 0.2);
                ctx.drawImage(
                  wallTex,
                  Math.max(TEXTURE_BORDER_CLIP, lintelTexX - 6), TEXTURE_BORDER_CLIP, 12, usableLintelHeight,
                  x - 1, drawStart, pxStep + 2, lintelHeight
                );
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "#000";
                ctx.fillRect(x, drawStart + lintelHeight - 2, pxStep, 3);
                ctx.globalAlpha = 1.0;
              }

              // Apply side shading (darker on one side for depth)
              if (side === 1) {
                ctx.globalAlpha = 0.85;
              }

              // Draw door below lintel with slight oversampling for smoothing
              const usableDoorHeight = doorTex.height - (TEXTURE_BORDER_CLIP * 2);
              ctx.drawImage(
                doorTex,
                Math.max(TEXTURE_BORDER_CLIP, doorTexX - 6), TEXTURE_BORDER_CLIP, 12, usableDoorHeight,
                x - 1, drawStart + lintelHeight, pxStep + 2, doorHeight - lintelHeight
              );

              ctx.globalAlpha = 1.0;
            } else {
              // Fallback solid color if texture not loaded
              ctx.fillStyle = side === 1 ? '#3a4a50' : '#4a5a60';
              ctx.fillRect(x, drawStart, pxStep, doorHeight);
            }

            // Apply fog to door
            ctx.globalAlpha = 1 - fog;
            ctx.fillStyle = "#000";
            ctx.fillRect(x, drawStart, pxStep, doorHeight);
            ctx.globalAlpha = 1.0;
          } else {
            // Calculate texture X coordinate for regular walls with border clipping
            const usableWallWidth = selectedWallTex.width - (TEXTURE_BORDER_CLIP * 2);
            const wallTexX = TEXTURE_BORDER_CLIP + (Math.floor(wallX * usableWallWidth) % usableWallWidth);
            const usableWallHeight = selectedWallTex.height - (TEXTURE_BORDER_CLIP * 2);
            
            // Draw wall with smooth sampling (12px sample for smoother tile edges)
            ctx.drawImage(
               selectedWallTex,
                Math.max(TEXTURE_BORDER_CLIP, wallTexX - 6), TEXTURE_BORDER_CLIP, 12, usableWallHeight,
                x - 1, drawStart, pxStep + 2, drawEnd - drawStart
            );

            ctx.globalAlpha = 1 - fog;
            ctx.fillStyle = "#000";
            ctx.fillRect(x, drawStart, pxStep, drawEnd - drawStart);
            ctx.globalAlpha = 1.0;
          }
      } else {
         // Fallback color
         const color = side === 1 ? '#555' : '#777';
         ctx.fillStyle = color;
         ctx.fillRect(x, drawStart, pxStep, drawEnd - drawStart);
      }
    }
    
  };

  return (
    <div className={className}>
      <canvas 
        ref={setCanvasRef} 
        width={renderWidth} 
        height={renderHeight} 
        className="w-full h-full rounded-lg border-4 border-muted shadow-inner bg-black"
      />
      {/* Compass / Coords Overlay (centered at top) */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-primary font-pixel text-xs bg-black/50 p-2 rounded pointer-events-none">
        X:{gameData.x} Y:{gameData.y} L:{gameData.level}
      </div>
    </div>
  );
}
