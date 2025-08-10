## M2 — Projectile Core (commit-by-commit)

- feat(physics): add projectile integrator
  - Files: `src/game/physics/projectile.ts`
  - Ballistic motion with gravity g; wind force input; returns path/final state.

- feat(collision): terrain collision for projectile
  - Files: `src/game/physics/collision.ts`
  - Stepwise sampling along path; detect first impact vs mask.

- feat(explosion): explosion effects and crater application
  - Files: `src/game/effects/explosion.ts`
  - Apply damage radius and deform terrain via `applyCrater`; recompute heightmap.

- feat(render): projectile rendering and trail
  - Files: `src/game/render/projectile.ts`
  - Draw projectile and optional dotted trail; simple screen shake hook.

- feat(state): fire action and resolve loop
  - Files: `src/game/state/game.ts`
  - Minimal turn slice for “aim → fire → simulate → resolve”; updates terrain on hit.

- feat(ui): aiming HUD for angle/power + wind indicator
  - Files: `src/ui/Hud.tsx`
  - Keyboard/mouse controls; shows angle, power, wind.

- feat(debug): deterministic seed + replay of last shot
  - Files: `src/game/debug/replay.ts`
  - Store inputs and RNG seed to replay a shot.

- test(physics): unit tests for integrator and collision
  - Files: `src/game/physics/__tests__/*.test.ts`
  - Validate gravity, wind, and collision edge-cases.

- chore(config): constants for gravity and wind ranges
  - Files: `src/game/config.ts`
  - Centralize tunables; data-only.

- docs(milestone): update milestones acceptance
  - Files: `plan/milestones.md`
  - Projectile hits deform terrain; wind visibly affects arc.

- feat(sfx) [optional]: launch/explosion sounds
  - Files: `src/game/audio/sfx.ts`
  - Web Audio API one-shots; clamped volume.

- feat(camera) [optional]: basic camera follow
  - Files: `src/game/render/camera.ts`
  - Smoothly follow projectile with bounds.

- chore(app): wire vertical slice in `App`
  - Files: `src/App.tsx`
  - Fire key → simulate → deform terrain → HUD updates.

- test(e2e) [optional]: smoke test
  - Files: `tests/e2e/projectile.spec.ts`
  - Arc changes with wind; terrain craters on hit.

- refactor: tidy naming/typing
  - Files: small touches across modules; no behavior changes.

- docs: README “How to play dev slice”
  - Files: `README.md`
  - Keys, seed, and debug toggles.
