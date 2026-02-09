import { useEffect, useRef, useState } from "react";

export type MonsterAnimationState = 'idle' | 'attack' | 'hit' | 'death' | 'entrance';

interface TransparentMonsterProps {
  src: string;
  alt: string;
  className?: string;
  animationState?: MonsterAnimationState;
  isFlying?: boolean;
}

export function TransparentMonster({ src, alt, className, animationState = 'idle', isFlying = false }: TransparentMonsterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Check if image already has significant transparency
      let transparentPixelCount = 0;
      let totalPixelCount = width * height;
      
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 10) {
          transparentPixelCount++;
        }
      }
      
      // If more than 5% of pixels are already transparent, preserve original transparency
      const hasExistingTransparency = transparentPixelCount > (totalPixelCount * 0.05);
      
      if (hasExistingTransparency) {
        // Image already has transparency - just apply color grading
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          
          // Skip fully transparent pixels
          if (a === 0) continue;
          
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];
          const pixelIndex = i / 4;
          const x = pixelIndex % width;
          const y = Math.floor(pixelIndex / width);
          
          // Apply subtle dungeon atmosphere color grading
          r = Math.min(255, r * 1.02 + 3);
          g = Math.min(255, g * 0.98);
          b = Math.min(255, b * 0.94);
          
          // Very light darkening for dungeon atmosphere
          const darkenAmount = 0.95;
          r *= darkenAmount;
          g *= darkenAmount;
          b *= darkenAmount;
          
          // Very subtle vignette based on distance from center
          const centerX = width / 2;
          const centerY = height / 2;
          const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
          const vignette = 1 - (distFromCenter / maxDist) * 0.08;
          
          r *= vignette;
          g *= vignette;
          b *= vignette;
          
          data[i] = Math.floor(r);
          data[i + 1] = Math.floor(g);
          data[i + 2] = Math.floor(b);
        }
      } else {
        // First pass: identify background pixels aggressively
        const isBackground = new Uint8Array(width * height);
        
        // Sample corners to detect the likely background color
        const corners = [
          0, // top-left
          width - 1, // top-right
          (height - 1) * width, // bottom-left
          (height - 1) * width + width - 1, // bottom-right
        ];
        
        // Get average corner colors
        let bgR = 0, bgG = 0, bgB = 0;
        for (const idx of corners) {
          bgR += data[idx * 4];
          bgG += data[idx * 4 + 1];
          bgB += data[idx * 4 + 2];
        }
        bgR /= 4; bgG /= 4; bgB /= 4;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const pixelIndex = i / 4;
          
          // Check if pixel matches detected background color (with high tolerance for boxes)
          const matchesBg = Math.abs(r - bgR) < 50 && Math.abs(g - bgG) < 50 && Math.abs(b - bgB) < 50;
          
          // Magenta chroma key (#FF00FF) - very common for transparency
          const isMagenta = r > 200 && g < 80 && b > 200;
          
          // Purple detection (common AI generation background) - stricter to not remove purple slimes
          const isPurpleBackground = r > 100 && r < 160 && b > 100 && b < 160 && 
                                      Math.abs(r - b) < 20 && g < 80 && g < Math.max(r, b) * 0.6;
          
          // Green screen detection - but NOT slime greens (slimes tend to be teal/lime, not pure green)
          const isGreenBackground = g > 180 && g > r * 1.5 && g > b * 1.5 && r < 100 && b < 100;
          
          // White/light gray backgrounds - AGGRESSIVE detection for gray boxes
          const brightness = (r + g + b) / 3;
          const isGrayish = Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30;
          const isWhiteBackground = brightness > 220 && isGrayish;
          // Catch all gray tones that might be around monsters
          const isAnyGray = isGrayish && brightness > 80 && brightness < 240;
          const isLightGray = brightness > 160 && isGrayish;
          
          // Very dark backgrounds
          const isDarkBackground = brightness < 25 && isGrayish;
          
          // Blue/cyan backgrounds - stricter to not remove blue slimes/oozes
          const isBlueBackground = b > 180 && b > r * 1.8 && b > g * 1.5 && r < 80 && g < 120;
          
          // Beige/tan AI backgrounds - relaxed thresholds
          const isBeigeBackground = r > 140 && g > 130 && b > 120 && 
                                     r >= g && g >= b && (r - b) < 80 && brightness > 130;
          
          if (matchesBg || isMagenta || isPurpleBackground || isGreenBackground || isWhiteBackground || 
              isLightGray || isAnyGray || isDarkBackground || isBlueBackground || isBeigeBackground) {
            isBackground[pixelIndex] = 1;
          }
        }
        
        // Flood fill from edges to catch connected background regions
        const visited = new Uint8Array(width * height);
        const queue: number[] = [];
        
        // Add edge pixels that are background to queue
        for (let x = 0; x < width; x++) {
          if (isBackground[x]) queue.push(x);
          if (isBackground[(height - 1) * width + x]) queue.push((height - 1) * width + x);
        }
        for (let y = 0; y < height; y++) {
          if (isBackground[y * width]) queue.push(y * width);
          if (isBackground[y * width + width - 1]) queue.push(y * width + width - 1);
        }
        
        // Flood fill to mark connected background
        while (queue.length > 0) {
          const idx = queue.pop()!;
          if (visited[idx]) continue;
          visited[idx] = 1;
          
          const x = idx % width;
          const y = Math.floor(idx / width);
          
          // Check 4-connected neighbors
          const neighbors = [
            y > 0 ? idx - width : -1,
            y < height - 1 ? idx + width : -1,
            x > 0 ? idx - 1 : -1,
            x < width - 1 ? idx + 1 : -1,
          ];
          
          for (const n of neighbors) {
            if (n >= 0 && !visited[n] && isBackground[n]) {
              queue.push(n);
            }
          }
        }
        
        // Only keep background pixels that are connected to edges
        for (let i = 0; i < isBackground.length; i++) {
          if (isBackground[i] && !visited[i]) {
            isBackground[i] = 0; // Interior pixel that matched bg color but isn't connected
          }
        }
        
        // Second pass: apply transparency with edge softening and dungeon color grading
        for (let i = 0; i < data.length; i += 4) {
          const pixelIndex = i / 4;
          const x = pixelIndex % width;
          const y = Math.floor(pixelIndex / width);
          
          if (isBackground[pixelIndex]) {
            // Check if this is an edge pixel (next to non-background)
            let isEdge = false;
            for (let dx = -2; dx <= 2; dx++) {
              for (let dy = -2; dy <= 2; dy++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  const neighborIdx = ny * width + nx;
                  if (!isBackground[neighborIdx]) {
                    isEdge = true;
                    break;
                  }
                }
              }
              if (isEdge) break;
            }
            
            if (isEdge) {
              // Soften edge - partial transparency (higher alpha = less transparent)
              data[i + 3] = 220;
            } else {
              // Full transparency for definite background
              data[i + 3] = 0;
            }
          } else {
            // Apply subtle dungeon atmosphere color grading to non-background pixels
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            // Add very subtle warm torch-like tint (slight orange/amber shift)
            r = Math.min(255, r * 1.02 + 3);
            g = Math.min(255, g * 0.98);
            b = Math.min(255, b * 0.94);
            
            // Very light darkening for dungeon atmosphere - keep colors vibrant
            const darkenAmount = 0.95;
            r *= darkenAmount;
            g *= darkenAmount;
            b *= darkenAmount;
            
            // Very subtle vignette based on distance from center
            const centerX = width / 2;
            const centerY = height / 2;
            const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
            const vignette = 1 - (distFromCenter / maxDist) * 0.08;
            
            r *= vignette;
            g *= vignette;
            b *= vignette;
            
            data[i] = Math.floor(r);
            data[i + 1] = Math.floor(g);
            data[i + 2] = Math.floor(b);
          }
        }
        
        // Third pass: add subtle white outline around monster
        // Only draw outline on the outer edge, not internal details
        const outlineData = new Uint8ClampedArray(data.length);
        
        // First, copy the current state
        for (let i = 0; i < data.length; i++) {
          outlineData[i] = data[i];
        }
        
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const pixelIndex = y * width + x;
            const i = pixelIndex * 4;
            
            // Only process background pixels
            if (isBackground[pixelIndex]) {
              // Check if this background pixel touches a monster pixel
              let touchesMonster = false;
              
              // Check 4-connected neighbors (up, down, left, right)
              const neighbors = [
                (y - 1) * width + x, // up
                (y + 1) * width + x, // down
                y * width + (x - 1), // left
                y * width + (x + 1)  // right
              ];
              
              for (const neighborIdx of neighbors) {
                if (!isBackground[neighborIdx]) {
                  touchesMonster = true;
                  break;
                }
              }
              
              // If this background pixel touches a monster, add subtle white outline
              if (touchesMonster) {
                outlineData[i] = 255;     // R
                outlineData[i + 1] = 255; // G
                outlineData[i + 2] = 255; // B
                outlineData[i + 3] = 150; // A - semi-transparent outline
              }
            }
          }
        }
        
        // Copy outline data back
        for (let i = 0; i < data.length; i++) {
          data[i] = outlineData[i];
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setLoaded(true);
    };
    
    img.src = src;
  }, [src]);

  // Determine animation class based on state
  const getAnimationClass = () => {
    switch (animationState) {
      case 'attack':
        return 'monster-attack';
      case 'hit':
        return 'monster-hit';
      case 'death':
        return 'monster-death';
      case 'entrance':
        return 'monster-entrance';
      case 'idle':
      default:
        return isFlying ? 'monster-float' : 'monster-breathe';
    }
  };

  return (
    <canvas 
      ref={canvasRef} 
      className={`${className || ''} ${getAnimationClass()}`}
      style={{ 
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in'
      }}
    />
  );
}
