## M1 — Terrain (Day 1-2) Commit Breakdown

Goal: Seeded heightmap terrain, destructible mask with crater application, collision sampling, and stable tank placement on the surface. Visualize on Canvas.

### Commit 1: feat(rng): deterministic RNG utilities

- Seeded RNG helper (Mulberry32/XorShift) and `randomRange` utilities.

Suggested files

- `src/game/rng.ts`

### Commit 2: feat(terrain): heightmap generation

- Generate 1D heightmap across world width using midpoint displacement or Perlin/simple fractal noise.
- Parameters: seed, amplitude, roughness, min/max elevation, smoothing passes.

Suggested files

- `src/game/terrain/generateHeightmap.ts`
- `src/game/terrain/types.ts` (TerrainConfig, Heightmap)

### Commit 3: feat(terrain): destructible mask + crater application

- Maintain a binary/alpha mask (Uint8Array or offscreen Canvas) representing solid terrain.
- `applyCrater(center, radius, falloff)`: subtracts material to form a crater; update heightmap locally.

Suggested files

- `src/game/terrain/mask.ts` (createMask, applyCrater)
- `src/game/terrain/modifyHeightmap.ts` (recompute local height after crater)

### Commit 4: feat(terrain): collision sampling

- `sampleCollision(x, y)`: returns whether point is inside terrain based on mask.
- `surfaceYAt(x)`: returns the y coordinate of first solid pixel from top for positioning tanks/projectiles.

Suggested files

- `src/game/terrain/collision.ts`

### Commit 5: feat(render): terrain renderer

- Render terrain by filling under heightmap and/or by drawing the mask to the Canvas.
- Simple palette, horizon gradient, and outlines.

Suggested files

- `src/game/render/terrainRenderer.ts`

### Commit 6: feat(spawn): tank placement on surface

- Given world width and tank radius, choose two spawn x positions with adequate separation and slope limits.
- `placeTankOnSurface(x)`: snaps to `surfaceYAt(x)`, adjusts if slope > threshold.

Suggested files

- `src/game/spawn/placeTanks.ts`

### Commit 7: test: unit tests for terrain

- Cover RNG determinism, heightmap bounds, crater application invariants, and `surfaceYAt` correctness.

Suggested files

- `src/game/terrain/__tests__/*.test.ts`

### Commit 8: feat(input/debug): click-to-crater debug mode

- In dev, clicking the canvas calls `applyCrater` at cursor with a fixed radius to visually confirm destructibility.

Acceptance

- Generating with the same seed yields identical landscapes.
- Clicking makes visible craters and updates collisions.
- Two tanks spawn on reasonable slopes with no overlaps.

### Parameters to expose (for M1 demo UI)

- Seed, amplitude, roughness, crater radius, crater falloff.

### Notes

- Keep core terrain logic functional and data-oriented; avoid classes.
- Use immutable updates for high-level state; within hot crater loop, mutate a scratch buffer then commit immutably.
