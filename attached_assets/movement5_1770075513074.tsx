// Add this custom hook at the top of your file (or in a separate file):
import { useRef, useEffect } from 'react';

function useSmoothMovement(callback: () => void, isActive: boolean) {
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }
    
    const animate = (time: number) => {
      if (time - lastTimeRef.current > 16) { // ~60fps
        callback();
        lastTimeRef.current = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, callback]);
}

// Then in your Game component, use it for continuous movement:
const moveForward = useCallback(() => {
  if (!game || combatState.active) return;
  if (game.dir === NORTH) move(0, -1);
  if (game.dir === SOUTH) move(0, 1);
  if (game.dir === EAST) move(1, 0);
  if (game.dir === WEST) move(-1, 0);
}, [game, combatState.active, move]);

// Use the smooth movement hook when a key is held
useSmoothMovement(moveForward, keyRepeat?.key === 'ArrowUp' || keyRepeat?.key === 'w');