## M3 — Turn Loop (commit-by-commit)

- feat(state): basic game state and turn machine
  - Files: `src/game/state/game.ts`
  - State shape: tanks, activeTankId, windAx, phase: 'aim' | 'fire' | 'resolve' | 'next'.
  - Actions: setAngle, setPower, fire, resolveImpact, endTurn.

- feat(state): per-tank ammo and health (stubs)
  - Files: `src/game/state/game.ts`
  - Track ammo counts for basic shell; health value per tank.

- feat(app): integrate state into App (replace local refs)
  - Files: `src/App.tsx`
  - Drive HUD from state; dispatch actions for angle/power changes and fire.

- feat(physics): resolve shot → explosion → damage
  - Files: `src/game/state/shot.ts`
  - Simulate projectile, find impact, deform terrain, compute tank damage in radius.

- feat(state): turn advance and win detection
  - Files: `src/game/state/game.ts`
  - Switch active tank after resolve; detect round end when one tank <= 0 HP.

- feat(ui): HUD indicators for active tank and health bars
  - Files: `src/ui/hud.tsx`, `src/game/render/tank.ts`
  - Highlight active tank, draw simple health bars above tanks.

- feat(render): simple camera follow during fire
  - Files: `src/game/render/camera.ts`, `src/App.tsx`
  - Track target (projectile or midpoint between tanks); smooth lerp, clamp to world.

- feat(audio): launch/explosion SFX
  - Files: `src/game/audio/sfx.ts`
  - Web Audio one-shots: playLaunch(), playExplosion(). Respect a master volume.

- chore(config): tunables for damage radius and health
  - Files: `src/game/config.ts`
  - Add DAMAGE_BASE, HEALTH_MAX, WIND_VARIANCE_PER_TURN.

- feat(state): wind changes per turn
  - Files: `src/game/state/game.ts`
  - On turn advance, randomize wind within bounds (seeded RNG) and update HUD.

- test(state): turn machine transitions
  - Files: `src/game/state/__tests__/game.test.ts`
  - Aim → fire → resolve → next; win condition when HP <= 0.

- docs(plan): update milestone acceptance notes
  - Files: `plan/milestones.md`
  - Two tanks alternate turns; HUD shows active tank; wind changes per turn.

- refactor: tidy types and selectors
  - Files: `src/game/state/game.ts`, `src/App.tsx`
  - Extract selectors/helpers; no behavior changes.

Optional polish (if time permits)

- feat(ui): end-of-round banner + reset button
- feat(ui): ammo count display and disable when 0
