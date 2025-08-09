## Browser Artillery Game Plan

### Original inspiration

- **Scorched Earth (1991, DOS)** by Wendell Hicken. Other influences: **Tank Wars**, **Worms**.

### Vision

- Faithful core (trajectory + wind + destructible terrain + shop) with modern UX, smooth performance, and optional online play.

### Tech stack (browser-first, TypeScript)

- **Language**: TypeScript (strict)
- **Package manager**: Yarn
- **Build tool**: Vite
- **UI**: React function components + Hooks (menus/HUD only)
- **Rendering**: HTML5 Canvas 2D (upgrade path to PixiJS if needed)
- **State**: Zustand for UI, plain functional modules for game state; **Immer** for ergonomic immutable updates
- **Testing**: Vitest + React Testing Library; Playwright for E2E
- **Lint/format**: ESLint (typescript-eslint) + Prettier
- **Audio**: Web Audio API
- **Networking (later)**: Node.js + ws (WebSocket) for turn-based online; simple authoritative server
- **Hosting**: Vercel or Netlify

Coding conventions

- Prefer **arrow functions**, **immutability** (structural sharing via Immer where helpful), avoid **classes** in core game logic. Keep hot paths data-oriented and functional.

### Core systems (MVP scope)

- **Terrain**: 2D heightmap + destructible mask; procedural generation (midpoint displacement/perlin). Craters modify mask and heightmap.
- **Physics**: Ballistic projectile motion with gravity g and wind w(t). Simple collision vs terrain mask; explosion radius applies terrain deformation and damage.
- **Turn system**: Two tanks alternate. Player selects angle and power; wind displayed.
- **Weapons**: Basic shell, big shell, nuke (larger radius), roller (rolls along ground then explodes), MIRV (splits mid-air). Balance via cost.
- **Economy/shop**: Earn credits from hits/wins; between rounds buy weapons and utilities (parachute, shields).
- **AI**: Baseline bot that estimates angle/power using iterative aim with wind compensation.
- **UX**: Minimal menus, HUD (wind, angle, power, weapon), keyboard and mouse controls, basic SFX, screen shake, particles.

### High-level architecture

- **Modules**
  - `terrain`: generateHeightmap, applyCrater, sampleCollision
  - `physics`: integrateProjectile, collideProjectile
  - `weapons`: data-driven specs (mass, fuse, effects); effect functions
  - `game`: turn loop state machine (setup → aiming → firing → resolve → next)
  - `ai`: chooseAngleAndPower
  - `ui`: React for menus/HUD; Canvas layer for gameplay
- **Data**: immutable game state snapshots per turn; local, transient mutation inside integrators for perf, then commit results immutably

### Build plan (see milestones.md for acceptance criteria)

1. Project bootstrap and rendering loop
2. Terrain generation and destructible mask
3. Projectile physics, collisions, explosions
4. Turn loop + basic UI (angle/power/wind)
5. Weapons system (data-driven) with 3–5 weapons
6. Economy + shop between rounds
7. AI opponent (easy → normal)
8. Polish pass: SFX, particles, screen shake, menus
9. Optional: Online turn-based play (WebSocket)

### Fun ideas and modern twists

- **Weather**: gusting wind, storms that change gravity briefly
- **Terrain types**: ice (slippery), sand (bigger craters), rock (smaller craters)
- **Utilities**: teleport, digger, build wall/ramp, jetpack, parachute
- **Progression**: roguelite runs with unlockable weapon mods and tank parts
- **Daily seeds**: same wind/terrain seed for all players, leaderboards
- **Replays**: deterministic seeds and inputs → compact replay files
- **Level editor**: draw terrain, share codes/links
- **Accessibility**: aim assists, colorblind palettes, reduced motion mode
- **Online**: quickmatch + friends lobby; async matches (play-by-mail style)

### Next actions

- Create repo structure with Vite + React + TS + ESLint/Prettier (Yarn)
- Implement a vertical slice: one map, two tanks, one weapon, wind, destructible terrain, win condition
- Add data-driven weapons and shop
