import { useEffect, useRef, useCallback } from "react";
import { GameData, NORTH, EAST, SOUTH, WEST } from "@/lib/game-engine";

interface DungeonViewProps {
  gameData: GameData;
  className?: string;
  renderWidth?: number;
  renderHeight?: number;
  visualX?: number;  // Optional interpolated X position for smooth movement
  visualY?: number;  // Optional interpolated Y position for smooth movement
  onCanvasRef?: (canvas: HTMLCanvasElement | null) => void;  // Callback to get canvas reference for post-processing
}

// Cache buster for texture reloads during development
const TEXTURE_VERSION = 18;

// Get texture paths for a specific dungeon level (1-10, each with unique textures)
function getTexturesForLevel(level: number): { wall: string; floor: string; ceiling: string; extraFloors?: string[] } {
  const lvl = Math.max(1, Math.min(10, level));
  const v = `?v=${TEXTURE_VERSION}`;
  
  if (lvl === 1) {
    return {
      wall: `/assets/textures/bricks_wall_floor1.PNG${v}`,
      floor: `/assets/textures/floorsbrick1.PNG${v}`,
      ceiling: `/assets/textures/ceiling_stone_dungeon.png${v}`,
      extraFloors: [
        `/assets/textures/runefloors.PNG${v}`,
        `/assets/textures/runefloors2.PNG${v}`,
        `/assets/textures/runefloors3.PNG${v}`,
      ]
    };
  }
  
  return {
    wall: `/assets/textures/wall_${lvl}.png`,
    floor: `/assets/textures/floor_${lvl}.png`,
    ceiling: '/assets/textures/ceiling_stone_dungeon.png'
  };
}

export function DungeonView({ gameData, className, renderWidth = 800, renderHeight = 600, visualX, visualY, onCanvasRef }: DungeonViewProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const texturesRef = useRef<{ wall: HTMLImageElement | null; floor: HTMLImageElement | null; ceiling: HTMLImageElement | null; door: HTMLImageElement | null; extraFloors: HTMLImageElement[] }>({ wall: null, floor: null, ceiling: null, door: null, extraFloors: [] });
  
  // Callback ref to notify parent when canvas is mounted, and store locally
  const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    internalCanvasRef.current = canvas;
    if (onCanvasRef) {
      onCanvasRef(canvas);
    }
  }, [onCanvasRef]);
  
  // Alias for internal usage
  const canvasRef = internalCanvasRef;
  const currentLevelRef = useRef<string | null>(null);
  
  // Dirty tracking to skip redundant redraws
  const lastRenderState = useRef<{ x: number; y: number; dir: number; level: number; width: number; height: number } | null>(null);
  
  // Offscreen canvas cache for expensive static ceiling decorations (beams, fascia, stone overlay)
  const ceilingCacheRef = useRef<{ canvas: OffscreenCanvas | HTMLCanvasElement; w: number; h: number; level: number } | null>(null);

  // Load textures based on current dungeon level (unique textures for each level 1-10)
  useEffect(() => {
    const level = Math.max(1, Math.min(10, gameData.level));
    const levelKey = `${level}-v${TEXTURE_VERSION}`;
    
    // Only reload textures if level or version changed
    if (currentLevelRef.current !== levelKey) {
      currentLevelRef.current = levelKey;
      const texturePaths = getTexturesForLevel(level);
      
      const wallImg = new Image();
      wallImg.src = texturePaths.wall;
      const floorImg = new Image();
      floorImg.src = texturePaths.floor;
      const ceilingImg = new Image();
      ceilingImg.src = texturePaths.ceiling;
      const doorImg = new Image();
      doorImg.src = "/assets/textures/door_metal.png";

      wallImg.onload = () => { texturesRef.current.wall = wallImg; lastRenderState.current = null; draw(); };
      floorImg.onload = () => { texturesRef.current.floor = floorImg; lastRenderState.current = null; draw(); };
      ceilingImg.onload = () => { texturesRef.current.ceiling = ceilingImg; lastRenderState.current = null; draw(); };
      doorImg.onload = () => { texturesRef.current.door = doorImg; lastRenderState.current = null; draw(); };
      
      texturesRef.current.extraFloors = [];
      if (texturePaths.extraFloors) {
        texturePaths.extraFloors.forEach((src) => {
          const img = new Image();
          img.src = src;
          img.onload = () => { texturesRef.current.extraFloors.push(img); lastRenderState.current = null; draw(); };
        });
      }
    }
  }, [gameData.level]);

  // Redraw when game data, visual position, or resolution changes
  useEffect(() => {
    draw();
  }, [gameData, renderWidth, renderHeight, visualX, visualY]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
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

    // Clear screen with dark color matching dungeon atmosphere
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simple Raycaster Settings
    const map = gameData.map;
    
    // Ensure camera position is clamped to valid floor tiles during interpolation
    // This prevents seeing through walls when visual position is between tiles
    const safeX = Math.max(0.1, Math.min(map[0].length - 1.1, currentX));
    const safeY = Math.max(0.1, Math.min(map.length - 1.1, currentY));
    
    // Check if current interpolated position would put camera inside a wall
    // If so, use the floor position of the player's actual tile
    const floorX = Math.floor(safeX);
    const floorY = Math.floor(safeY);
    const fracX = safeX - floorX;
    const fracY = safeY - floorY;
    
    // Clamp fractional part to avoid being too close to tile edges (0.1 to 0.9)
    const clampedFracX = Math.max(0.1, Math.min(0.9, fracX));
    const clampedFracY = Math.max(0.1, Math.min(0.9, fracY));
    
    const posX = floorX + clampedFracX + 0.5;
    const posY = floorY + clampedFracY + 0.5;
    
    // Direction vectors based on cardinal direction (0=N, 1=E, 2=S, 3=W)
    let dirX = 0, dirY = 0, planeX = 0, planeY = 0;
    
    switch(gameData.dir) {
      case NORTH: dirY = -1; planeX = 0.66; break;
      case SOUTH: dirY = 1; planeX = -0.66; break;
      case EAST: dirX = 1; planeY = 0.66; break;
      case WEST: dirX = -1; planeY = -0.66; break;
    }

    const w = canvas.width;
    const h = canvas.height;
    
    // Detect if camera is moving (fractional position = mid-interpolation)
    const isMoving = (Math.abs(currentX - Math.round(currentX)) > 0.02) || (Math.abs(currentY - Math.round(currentY)) > 0.02);
    // Use larger pixel step during movement for performance, full detail when stationary
    const pxStep = isMoving ? 4 : 2;

    // Draw Ceiling with perspective texture using dedicated ceiling texture
    const ceilingTex = texturesRef.current.ceiling || texturesRef.current.floor; // Use ceiling texture, fallback to floor
    if (ceilingTex) {
      const texW = ceilingTex.width;
      const texH = ceilingTex.height;
      const texScale = 128;
      
      // Ceiling casting - mirror of floor casting
      for (let y = 0; y < Math.floor(h / 2); y++) {
        const p = Math.floor(h / 2) - y;
        const rowDistance = (h * 0.5) / p;
        
        const ceilStepX = rowDistance * (planeX * 2) / w;
        const ceilStepY = rowDistance * (planeY * 2) / w;
        
        let ceilX = posX + rowDistance * (dirX - planeX);
        let ceilY = posY + rowDistance * (dirY - planeY);
        
        for (let x = 0; x < w; x += pxStep) {
          const tx = Math.floor(Math.abs(ceilX * texScale) % texW);
          const ty = Math.floor(Math.abs(ceilY * texScale) % texH);
          
          ctx.drawImage(
            ceilingTex,
            tx, ty, 2, 2,
            x, y, pxStep, 1
          );
          
          ceilX += ceilStepX * pxStep;
          ceilY += ceilStepY * pxStep;
        }
      }
      
      // Build or reuse cached ceiling decorations (stone overlay, beams, fascia)
      const cache = ceilingCacheRef.current;
      const needsCache = !cache || cache.w !== w || cache.h !== h || cache.level !== gameData.level;
      
      if (needsCache) {
        // Create offscreen canvas for ceiling decorations
        const offCanvas = document.createElement('canvas');
        offCanvas.width = w;
        offCanvas.height = Math.floor(h / 2) + 20;
        const offCtx = offCanvas.getContext('2d', { alpha: true });
        
        if (offCtx) {
          offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
          
          // Apply jagged stone texture with color variations to ceiling
          const stoneColors = [
            { r: 45, g: 42, b: 38 },
            { r: 55, g: 50, b: 45 },
            { r: 38, g: 45, b: 40 },
            { r: 50, g: 48, b: 52 },
            { r: 42, g: 40, b: 35 },
          ];
          
          let seed = 12345;
          const seededRandom = () => {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            return seed / 0x7fffffff;
          };
          
          for (let y = 0; y < Math.floor(h / 2); y += 2) {
            const p = Math.floor(h / 2) - y;
            const rowDistance = (h * 0.5) / p;
            const darkness = Math.min(0.75, 0.4 + rowDistance / 15);
            
            for (let x = 0; x < w; x += 6 + Math.floor(seededRandom() * 8)) {
              const blockWidth = 4 + Math.floor(seededRandom() * 10);
              const colorIdx = Math.floor(seededRandom() * stoneColors.length);
              const color = stoneColors[colorIdx];
              const brightVar = 0.85 + seededRandom() * 0.3;
              const r = Math.floor(color.r * brightVar);
              const g = Math.floor(color.g * brightVar);
              const b = Math.floor(color.b * brightVar);
              const jaggedOffset = Math.floor(seededRandom() * 2) - 1;
              
              offCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + seededRandom() * 0.2})`;
              offCtx.fillRect(x, y + jaggedOffset, blockWidth, 3);
            }
            
            offCtx.fillStyle = `rgba(5, 12, 8, ${darkness})`;
            offCtx.fillRect(0, y, w, 2);
          }
      
          // Draw wooden support beams across ceiling
          const beamCount = 5;
          const beamSizes = [1.2, 0.8, 1.0, 0.9, 1.1];
          
          let woodSeed = 54321;
          const woodRandom = () => {
            woodSeed = (woodSeed * 1103515245 + 12345) & 0x7fffffff;
            return woodSeed / 0x7fffffff;
          };
          
          for (let i = 1; i <= beamCount; i++) {
            const beamY = Math.floor((h / 2) * (i / (beamCount + 1)));
            const p = Math.floor(h / 2) - beamY;
            const rowDistance = (h * 0.5) / p;
            const sizeMultiplier = beamSizes[(i - 1) % beamSizes.length];
            const beamHeight = Math.max(8, Math.floor(22 / rowDistance * sizeMultiplier));
            const darkness = Math.min(0.6, rowDistance / 8);
            const beamTop = beamY - beamHeight/2;
            const beamBottom = beamY + beamHeight/2;
            const baseR = 90 + Math.floor(woodRandom() * 20);
            const baseG = 66 + Math.floor(woodRandom() * 15);
            const baseB = 40 + Math.floor(woodRandom() * 10);
            
            offCtx.fillStyle = `rgb(${baseR - 32}, ${baseG - 26}, ${baseB - 22})`;
            offCtx.fillRect(0, beamTop, w, 2);
            
            for (let bx = 0; bx < w; bx += 2) {
              for (let by = beamTop + 2; by < beamBottom - 2; by += 2) {
                const distFromCenter = Math.abs(by - beamY) / (beamHeight / 2);
                const edgeDarken = distFromCenter * 0.3;
                const grainOffset = Math.sin(bx * 0.1 + i * 10) * 8;
                const grainBrightness = 0.85 + Math.sin((bx + grainOffset) * 0.05 + by * 0.2) * 0.15;
                const r = Math.floor((baseR - edgeDarken * 40) * grainBrightness);
                const g = Math.floor((baseG - edgeDarken * 30) * grainBrightness);
                const b = Math.floor((baseB - edgeDarken * 20) * grainBrightness);
                offCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                offCtx.fillRect(bx, by, 2, 2);
              }
            }
            
            offCtx.lineWidth = 1;
            const grainSpacing = Math.max(2, Math.floor(beamHeight / 5));
            for (let gy = beamTop + grainSpacing; gy < beamBottom - 2; gy += grainSpacing) {
              offCtx.strokeStyle = `rgba(30, 20, 10, ${0.2 + woodRandom() * 0.2})`;
              offCtx.beginPath();
              offCtx.moveTo(0, gy);
              for (let gx = 0; gx < w; gx += 10) {
                const waveY = gy + Math.sin(gx * 0.03 + i) * 1.5;
                offCtx.lineTo(gx, waveY);
              }
              offCtx.stroke();
            }
            
            const knotCount = 2 + Math.floor(woodRandom() * 3);
            for (let k = 0; k < knotCount; k++) {
              const knotX = Math.floor(woodRandom() * w);
              const knotY = beamTop + 3 + Math.floor(woodRandom() * (beamHeight - 6));
              const knotW = 3 + Math.floor(woodRandom() * 4);
              const knotH = 2 + Math.floor(woodRandom() * 3);
              offCtx.fillStyle = `rgba(25, 18, 10, ${0.6 + woodRandom() * 0.3})`;
              offCtx.beginPath();
              offCtx.ellipse(knotX, knotY, knotW, knotH, 0, 0, Math.PI * 2);
              offCtx.fill();
              offCtx.strokeStyle = `rgba(45, 32, 20, 0.5)`;
              offCtx.lineWidth = 1;
              offCtx.beginPath();
              offCtx.ellipse(knotX, knotY, knotW + 1, knotH + 1, 0, 0, Math.PI * 2);
              offCtx.stroke();
            }
            
            for (let s = 0; s < 3; s++) {
              const streakY = beamTop + 3 + Math.floor(woodRandom() * (beamHeight - 6));
              const streakStart = Math.floor(woodRandom() * w * 0.5);
              const streakLen = 20 + Math.floor(woodRandom() * 60);
              offCtx.fillStyle = `rgba(140, 115, 80, ${0.15 + woodRandom() * 0.15})`;
              offCtx.fillRect(streakStart, streakY, streakLen, 1);
            }
            
            for (let c = 0; c < 2; c++) {
              const crackY = beamTop + 2 + Math.floor(woodRandom() * (beamHeight - 4));
              const crackStart = Math.floor(woodRandom() * w * 0.7);
              const crackLen = 10 + Math.floor(woodRandom() * 30);
              offCtx.fillStyle = `rgba(20, 12, 5, ${0.3 + woodRandom() * 0.2})`;
              offCtx.fillRect(crackStart, crackY, crackLen, 1);
            }
            
            offCtx.fillStyle = `rgb(${baseR - 48}, ${baseG - 40}, ${baseB - 30})`;
            offCtx.fillRect(0, beamBottom - 2, w, 2);
            offCtx.fillStyle = `rgba(5, 8, 5, ${darkness})`;
            offCtx.fillRect(0, beamTop, w, beamHeight);
            offCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            offCtx.fillRect(0, beamBottom, w, 3);
          }
          
          // Stone boulder fascia at ceiling/wall transition
          const fasciaY = Math.floor(h / 2) - 8;
          const fasciaHeight = 12;
          let fasciaSeed = 98765;
          const fasciaRandom = () => {
            fasciaSeed = (fasciaSeed * 1103515245 + 12345) & 0x7fffffff;
            return fasciaSeed / 0x7fffffff;
          };
          
          let boulderX = 0;
          while (boulderX < w) {
            const boulderW = 12 + Math.floor(fasciaRandom() * 18);
            const boulderH = 8 + Math.floor(fasciaRandom() * 5);
            const boulderYOffset = Math.floor(fasciaRandom() * 3) - 1;
            const baseGray = 65 + Math.floor(fasciaRandom() * 25);
            const rVar = Math.floor(fasciaRandom() * 15) - 7;
            const gVar = Math.floor(fasciaRandom() * 10) - 5;
            const bVar = Math.floor(fasciaRandom() * 10) - 5;
            const r = baseGray + rVar;
            const g = baseGray + gVar - 3;
            const b = baseGray + bVar - 5;
            
            offCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            offCtx.beginPath();
            offCtx.moveTo(boulderX + 2, fasciaY + boulderYOffset);
            offCtx.lineTo(boulderX + boulderW - 2, fasciaY + boulderYOffset);
            offCtx.lineTo(boulderX + boulderW, fasciaY + boulderYOffset + 3);
            offCtx.lineTo(boulderX + boulderW - 1, fasciaY + boulderYOffset + boulderH - 2);
            offCtx.lineTo(boulderX + boulderW - 3, fasciaY + boulderYOffset + boulderH);
            offCtx.lineTo(boulderX + 3, fasciaY + boulderYOffset + boulderH);
            offCtx.lineTo(boulderX, fasciaY + boulderYOffset + boulderH - 3);
            offCtx.lineTo(boulderX + 1, fasciaY + boulderYOffset + 2);
            offCtx.closePath();
            offCtx.fill();
            
            offCtx.fillStyle = `rgb(${r + 20}, ${g + 18}, ${b + 15})`;
            offCtx.beginPath();
            offCtx.moveTo(boulderX + 3, fasciaY + boulderYOffset + 1);
            offCtx.lineTo(boulderX + boulderW - 3, fasciaY + boulderYOffset + 1);
            offCtx.lineTo(boulderX + boulderW - 4, fasciaY + boulderYOffset + 3);
            offCtx.lineTo(boulderX + 4, fasciaY + boulderYOffset + 3);
            offCtx.closePath();
            offCtx.fill();
            
            offCtx.fillStyle = `rgba(0, 0, 0, 0.4)`;
            offCtx.beginPath();
            offCtx.moveTo(boulderX + 4, fasciaY + boulderYOffset + boulderH - 1);
            offCtx.lineTo(boulderX + boulderW - 4, fasciaY + boulderYOffset + boulderH - 1);
            offCtx.lineTo(boulderX + boulderW - 2, fasciaY + boulderYOffset + boulderH - 3);
            offCtx.lineTo(boulderX + 2, fasciaY + boulderYOffset + boulderH - 3);
            offCtx.closePath();
            offCtx.fill();
            
            if (fasciaRandom() > 0.4) {
              offCtx.strokeStyle = `rgba(30, 28, 25, 0.5)`;
              offCtx.lineWidth = 1;
              offCtx.beginPath();
              const crackStartX = boulderX + 3 + Math.floor(fasciaRandom() * (boulderW - 6));
              offCtx.moveTo(crackStartX, fasciaY + boulderYOffset + 2);
              offCtx.lineTo(crackStartX + (fasciaRandom() - 0.5) * 4, fasciaY + boulderYOffset + boulderH - 2);
              offCtx.stroke();
            }
            
            offCtx.fillStyle = 'rgba(20, 18, 15, 0.7)';
            offCtx.fillRect(boulderX + boulderW - 1, fasciaY, 2, fasciaHeight);
            boulderX += boulderW + 1;
          }
          
          offCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          offCtx.fillRect(0, fasciaY + fasciaHeight - 2, w, 3);
          offCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          offCtx.fillRect(0, fasciaY - 1, w, 2);
          
          ceilingCacheRef.current = { canvas: offCanvas, w, h, level: gameData.level };
        }
      }
      
      // Draw cached ceiling decorations overlay
      const cachedCeiling = ceilingCacheRef.current;
      if (cachedCeiling) {
        ctx.drawImage(cachedCeiling.canvas, 0, 0);
      }
    } else {
      // Fallback gradient ceiling
      const ceilingGradient = ctx.createLinearGradient(0, 0, 0, h / 2);
      ceilingGradient.addColorStop(0, "#0a0806");
      ceilingGradient.addColorStop(1, "#1a1510");
      ctx.fillStyle = ceilingGradient;
      ctx.fillRect(0, 0, w, h / 2);
    }

    // Draw Floor with perspective floor casting (cobblestone walkway effect)
    const floorTex = texturesRef.current.floor;
    const allFloorTextures = [floorTex, ...texturesRef.current.extraFloors].filter(Boolean) as HTMLImageElement[];
    if (floorTex) {
      const texScale = 128;
      
      for (let y = Math.floor(h / 2) + 1; y < h; y++) {
        const p = y - h / 2;
        const rowDistance = (h * 0.5) / p;
        
        const floorStepX = rowDistance * (planeX * 2) / w;
        const floorStepY = rowDistance * (planeY * 2) / w;
        
        let floorX = posX + rowDistance * (dirX - planeX);
        let floorY = posY + rowDistance * (dirY - planeY);
        
        for (let x = 0; x < w; x += pxStep) {
          const tileX = Math.floor(floorX);
          const tileY = Math.floor(floorY);
          const tileHash = ((tileX * 7919 + tileY * 104729) & 0x7fffffff) % allFloorTextures.length;
          const tex = allFloorTextures[tileHash];
          
          const tx = Math.floor(Math.abs(floorX * texScale) % tex.width);
          const ty = Math.floor(Math.abs(floorY * texScale) % tex.height);
          
          ctx.drawImage(
            tex,
            tx, ty, 2, 2,
            x, y, pxStep, 1
          );
          
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

    // Raycasting Loop
    for (let x = 0; x < w; x+=pxStep) {
      const cameraX = 2 * x / w - 1;
      const rayDirX = dirX + planeX * cameraX;
      const rayDirY = dirY + planeY * cameraX;

      let mapX = Math.floor(posX);
      let mapY = Math.floor(posY);

      let sideDistX, sideDistY;
      
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
        // Bounds check
        if (mapY < 0 || mapX < 0 || mapY >= map.length || mapX >= map[0].length) {
          hit = 1; perpWallDist = 100; // Infinity
        } else if (map[mapY][mapX] > 0) {
          hit = map[mapY][mapX]; // 1 = wall, 2 = door
        }
      }
      
      const isDoor = hit === 2;

      if (side === 0) perpWallDist = (mapX - posX + (1 - stepX) / 2) / rayDirX;
      else           perpWallDist = (mapY - posY + (1 - stepY) / 2) / rayDirY;

      // Draw Wall Strip
      const lineHeight = Math.floor(h / perpWallDist);
      const drawStart = Math.max(0, -lineHeight / 2 + h / 2);
      const drawEnd = Math.min(h - 1, lineHeight / 2 + h / 2);

      // Texture mapping
      if (texturesRef.current.wall) {
         let wallX; 
         if (side === 0) wallX = posY + perpWallDist * rayDirY;
         else            wallX = posX + perpWallDist * rayDirX;
         wallX -= Math.floor(wallX);

         const texX = Math.floor(wallX * texturesRef.current.wall.width);
         
         // Darken farther walls
         ctx.globalAlpha = 1.0;
         if (side === 1) ctx.globalAlpha = 0.7; // Shading for y-axis walls
         
         // Distance fog
         const fog = Math.min(1, 4.0 / perpWallDist); 
         
         if (isDoor) {
           // Draw metal door using texture with stone frame
           const doorHeight = drawEnd - drawStart;
           const doorTex = texturesRef.current.door;
           const wallTex = texturesRef.current.wall;
           
           // Door frame parameters (percentage of door width)
           const frameWidth = 0.12; // Stone frame on each side
           const topFrameHeight = 0.08; // Stone lintel at top
           const isInFrame = wallX < frameWidth || wallX > (1 - frameWidth);
           const isInTopFrame = true; // We'll handle top frame with height
           
           if (isInFrame && wallTex) {
             // Draw stone frame on edges using wall texture
             const frameTexX = Math.floor(wallX * wallTex.width);
             
             if (side === 1) {
               ctx.globalAlpha = 0.8;
             }
             
             ctx.drawImage(
               wallTex,
               frameTexX, 0, 1, wallTex.height,
               x, drawStart, pxStep, doorHeight
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
             const doorTexX = Math.floor(Math.max(0, Math.min(1, doorTexWallX)) * doorTex.width);
             
             // Top stone lintel
             const lintelHeight = Math.floor(doorHeight * topFrameHeight);
             
             if (wallTex) {
               // Draw lintel at top
               const lintelTexX = Math.floor(wallX * wallTex.width);
               ctx.drawImage(
                 wallTex,
                 lintelTexX, 0, 1, wallTex.height * 0.2,
                 x, drawStart, pxStep, lintelHeight
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
             
             // Draw door below lintel
             ctx.drawImage(
               doorTex,
               doorTexX, 0, 1, doorTex.height,
               x, drawStart + lintelHeight, pxStep, doorHeight - lintelHeight
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
           ctx.drawImage(
              texturesRef.current.wall, 
              texX, 0, 1, texturesRef.current.wall.height,
              x, drawStart, pxStep, drawEnd - drawStart
           );
           
           ctx.globalAlpha = 1 - fog;
           ctx.fillStyle = "#000";
           ctx.fillRect(x, drawStart, pxStep, drawEnd - drawStart);
           ctx.globalAlpha = 1.0;
         }
         
         // Draw stone baseboard at bottom of wall (matching floor texture) - skip for doors
         if (!isDoor) {
         const baseboardHeight = Math.max(3, Math.floor(lineHeight * 0.06));
         const baseboardTop = drawEnd - baseboardHeight;
         
         // Use floor texture for baseboard
         if (texturesRef.current.floor) {
           const floorTex = texturesRef.current.floor;
           // Sample from floor texture using wall position for continuity
           const texX = Math.floor((wallX * 64) % floorTex.width);
           
           ctx.globalAlpha = side === 1 ? 0.8 : 1.0; // Slightly darker on side walls
           ctx.drawImage(
             floorTex,
             texX, 0, 2, floorTex.height,
             x, baseboardTop, pxStep, baseboardHeight
           );
           ctx.globalAlpha = 1.0;
           
           ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
           ctx.fillRect(x, baseboardTop, pxStep, baseboardHeight);
         }
         
         ctx.fillStyle = 'rgba(180, 170, 155, 0.4)';
         ctx.fillRect(x, baseboardTop, pxStep, 1);
         
         ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
         ctx.fillRect(x, drawEnd - 1, pxStep, 1);
         
         ctx.globalAlpha = 1 - fog;
         ctx.fillStyle = "#000";
         ctx.fillRect(x, baseboardTop, pxStep, baseboardHeight);
         ctx.globalAlpha = 1.0;
         } // end if !isDoor for baseboard
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
      {/* Compass / Coords Overlay */}
      <div className="absolute top-4 right-4 text-primary font-pixel text-xs bg-black/50 p-2 rounded">
        X:{gameData.x} Y:{gameData.y} L:{gameData.level}
      </div>
    </div>
  );
}
