## Milestones

### M0 — Bootstrap (Day 0-1)

- Yarn + Vite + React + TS (strict), ESLint/Prettier configured
- Canvas render loop with fixed timestep update (60Hz) and interpolation

- Commit breakdown: see `plan/commits/M0_bootstrap.md`

### M1 — Terrain (Day 1-2)

- Heightmap generation (seeded)
- Destructible crater application and collision sampling
- Tank placement on surface with simple stability

- Commit breakdown: see `plan/commits/M1_terrain.md`

### M2 — Projectile Core (Day 2-3)

- Ballistic integration with wind
- Collision vs terrain mask
- Explosion radius: damage and terrain deformation

### M3 — Turn Loop + HUD (Day 3-4)

- State machine for turns
- Angle/power controls, wind indicator
- Basic SFX, simple camera follow

- Commit breakdown: see `plan/commits/M3_turn-loop.md`

### M4 — Weapons (Day 4-5)

- Data-driven weapon definitions
- Implement: Small/Big shell, Roller, MIRV

### M5 — Economy + Shop (Day 5-6)

- Credits on hit/win; between-round shop UI

### M6 — AI (Day 6-7)

- Baseline bot: iterate angle/power with wind compensation
- Difficulty via aim variance and information limits

### M7 — Polish (Day 7-9)

- Particles, screen shake, improved audio, menus

### M8 — Online (Optional)

- Turn-based WebSocket server, room model, deterministic sim

### Acceptance for MVP

- Two tanks on destructible terrain
- 3+ weapons with distinct behaviors
- Wind affects trajectory
- Simple AI
- Smooth 60 FPS on mid-tier laptop
