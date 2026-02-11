// If you can modify DungeonView.tsx, add these optimizations:
import { memo, useMemo } from 'react';

// Wrap your DungeonView component with memo:
export const DungeonView = memo(function DungeonView({ 
  gameData, 
  className, 
  renderWidth, 
  renderHeight 
}: DungeonViewProps) {
  
  // Memoize expensive calculations
  const visibleTiles = useMemo(() => {
    // Calculate which tiles are visible based on player position
    // This prevents recalculating on every render
    const tiles = [];
    const viewDistance = 10; // Adjust as needed
    
    for (let y = Math.max(0, gameData.y - viewDistance); 
         y <= Math.min(gameData.map.length - 1, gameData.y + viewDistance); 
         y++) {
      for (let x = Math.max(0, gameData.x - viewDistance); 
           x <= Math.min(gameData.map[0].length - 1, gameData.x + viewDistance); 
           x++) {
        tiles.push({ x, y, type: gameData.map[y][x] });
      }
    }
    return tiles;
  }, [gameData.map, gameData.x, gameData.y]);
  
  // ... rest of your component
  
  return (
    <div className={className}>
      {/* Render only visible tiles for performance */}
      {visibleTiles.map(tile => (
        <div 
          key={`${tile.x}-${tile.y}`}
          className={`absolute tile-${tile.type}`}
          style={{
            left: `${(tile.x - (gameData.x - 10)) * 32}px`, // Adjust based on your tile size
            top: `${(tile.y - (gameData.y - 10)) * 32}px`,
          }}
        />
      ))}
      {/* Player marker */}
      <div className="absolute player-marker" style={{
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) rotate(${gameData.dir * 90}deg)`,
      }} />
    </div>
  );
});