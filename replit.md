# Shining in the Darkness - Web Edition

## Overview

A retro-styled first-person dungeon crawler RPG inspired by classic games like "Shining in the Darkness." Players explore dungeons from a first-person perspective, encounter monsters in turn-based combat, and manage a party of characters with different classes and abilities. The game features a raycasting-based dungeon renderer, persistent game saves, and authentication via Replit Auth.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local React state for game logic
- **Styling**: Tailwind CSS with custom retro theme (pixel fonts, dark theme, amber/orange accents)
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Implementation**: Passport.js with custom OIDC strategy
- **Session Storage**: PostgreSQL-backed sessions with 1-week TTL
- **Protected Routes**: Middleware-based authentication checks

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` and `shared/models/auth.ts`
- **Key Tables**:
  - `users` - User profiles from Replit Auth
  - `sessions` - Session storage for authentication
  - `game_states` - Persisted game saves (JSON blob per user)

### Game Engine
- **Rendering**: Canvas-based raycasting for first-person dungeon view
- **Map System**: 2D grid-based procedural maps with wall/floor tiles and doors
- **Combat**: Turn-based system with party members and job-specific abilities
- **Character Classes**: Fighter, Mage, Monk with unique abilities
- **Movement**: Cardinal directions (WASD/Arrow keys) with 90-degree turns
- **Mini Map**: Toggle with M key, shows 15x15 grid with player direction
- **Equipment System**: 4 slots (weapon, armor, helmet, accessory) with job restrictions and rarity tiers
  - Equipment drops from monsters with rarity based on dungeon floor
  - Stats affect ATK/DEF/HP/MP with bonuses applied to combat and resource pools
  - Toggle equipment panel with E key

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components (RetroUI, DungeonView)
    hooks/        # Custom hooks (use-auth, use-game)
    lib/          # Utilities and game engine
    pages/        # Route pages (Landing, Game)
server/           # Express backend
  replit_integrations/auth/  # Replit Auth implementation
shared/           # Shared types and schemas
  models/         # Database models
  routes.ts       # API route definitions
  schema.ts       # Drizzle schema
```

## External Dependencies

### Database
- PostgreSQL via Replit's managed database
- Connection via `DATABASE_URL` environment variable
- Drizzle Kit for schema migrations (`npm run db:push`)

### Authentication
- Replit OpenID Connect provider
- Required environment variables: `REPL_ID`, `ISSUER_URL`, `SESSION_SECRET`

### Frontend Libraries
- React Query for async data fetching
- react-use for keyboard hooks
- Radix UI for accessible component primitives
- Lucide React for icons

### Build Dependencies
- Vite for frontend bundling
- esbuild for server bundling
- TypeScript for type checking