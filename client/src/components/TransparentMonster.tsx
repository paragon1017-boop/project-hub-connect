import { useEffect, useRef, useState } from "react";

interface TransparentMonsterProps {
  src: string;
  alt: string;
  className?: string;
}

export function TransparentMonster({ src, alt, className }: TransparentMonsterProps) {
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
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const brightness = (r + g + b) / 3;
        const isGrayish = Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20;
        
        // Detect if pixel should be yellow (eye area - white/cream that should be yellow)
        const isLightArea = brightness > 200 && isGrayish;
        
        if (isLightArea) {
          // Check if this might be part of the eye (center region)
          const pixelIndex = i / 4;
          const x = pixelIndex % canvas.width;
          const y = Math.floor(pixelIndex / canvas.width);
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          
          // If near center, color it yellow (eye)
          if (distFromCenter < canvas.width * 0.25) {
            data[i] = 255;     // R
            data[i + 1] = 235; // G
            data[i + 2] = 150; // B
            data[i + 3] = 255; // Full opacity
          } else {
            // Background - make transparent
            data[i + 3] = 0;
          }
        }
        else if (brightness > 180 && isGrayish) {
          data[i + 3] = Math.floor((200 - brightness) * 12);
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setLoaded(true);
    };
    
    img.src = src;
  }, [src]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ 
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in'
      }}
    />
  );
}
