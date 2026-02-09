# 🤖 Agent Instructions for Dungeon Crawler

## Project Overview
This is a retro-styled first-person dungeon crawler RPG built with React, TypeScript, and Three.js. It features raycasting rendering, turn-based combat, character progression, and equipment systems.

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **3D Rendering**: Three.js, React Three Fiber, React Three Drei
- **Backend**: Express.js, PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth
- **Build Tool**: Vite

## Key Files & Architecture

### Core Game Logic
- `client/src/lib/game-engine.ts` - Game state, combat calculations, equipment logic
- `client/src/components/DungeonView.tsx` - Raycasting renderer (main game view)
- `client/src/components/BattleView.tsx` - Turn-based combat system
- `client/src/pages/Game.tsx` - Main game page and state management

### Data & Types
- `shared/schema.ts` - Database schema (game states, users)
- `shared/models/auth.ts` - User authentication models
- `client/src/lib/equipment-data.ts` - Equipment database and set bonuses

### Configuration
- `vite.config.ts` - Build configuration, aliases (@/, @shared/, @assets/)
- `drizzle.config.ts` - Database configuration
- `tailwind.config.ts` - UI styling configuration

## Recent Optimizations
- **Unlimited FPS**: Removed all artificial frame rate limits
- **4:3 Aspect Ratios**: Fixed stretched graphics with proper VGA/SVGA/XGA resolutions
- **Performance**: Web Workers for raycasting, object pooling, optimized textures
- **Viewport Scaling**: Shrink game view to prevent GUI overlap (70% default)

## Code Conventions

### Naming
- Components: PascalCase (e.g., `DungeonView.tsx`)
- Utilities: camelCase (e.g., `game-engine.ts`)
- Types/Interfaces: PascalCase (e.g., `GameData`, `Player`)
- Constants: UPPER_SNAKE_CASE (e.g., `RESOLUTION_PRESETS`)

### State Management
- Use React hooks (`useState`, `useEffect`, `useRef`)
- Game state stored in database via `useGameState()` hook
- Refs for mutable state that shouldn't trigger re-renders

### Performance Patterns
- Canvas 2D rendering with dirty checking
- Three.js textures with mipmapping and WebP fallback
- RequestAnimationFrame for smooth animations
- Debounced saves to database

## Common Tasks

### Adding New Resolutions
Update `RESOLUTION_PRESETS` in `client/src/pages/Game.tsx`:
```typescript
const RESOLUTION_PRESETS = {
  vga: { width: 640, height: 480, label: '640×480 (4:3)', aspect: '4:3' },
  // ... add new resolution here
};
```

### Adding New Monsters
Add to monster database in `client/src/lib/game-engine.ts` with sprite imports

### Modifying Combat
Update `BattleView.tsx` for UI changes, `game-engine.ts` for logic

### Database Changes
1. Update `shared/schema.ts`
2. Run `npm run db:push` to apply migrations

## Testing
- Check browser console for "DungeonView FPS" logs
- Use PerformanceMonitor component (top-left in dev mode)
- Test in incognito to bypass cache

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## AI Assistant Notes
- Always maintain unlimited FPS optimizations (no artificial limits)
- Preserve 4:3 aspect ratios for classic gaming feel
- Keep viewport at 70% default to prevent GUI overlap
- Ensure TypeScript compiles without errors before finishing
- Test changes don't break existing functionality

## User Preferences to Maintain
- Unlimited FPS (no frame rate limiting)
- 4:3 aspect ratio resolutions by default
- Viewport scale at 70% (adjustable 50-100%)
- Maximum texture quality
- Smooth movement interpolation
- Retro CRT-style visual effects (toggleable)

---
*Last Updated: Feb 2026*
*Game: Shining in the Darkness - Web Edition*