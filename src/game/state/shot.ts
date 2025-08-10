import { createProjectile, stepProjectile } from '../physics/projectile';
import { segmentFirstImpact } from '../physics/collision';
import { applyExplosion } from '../effects/explosion';
import type { TerrainDimensions, TerrainMask } from '../terrain/mask';
import type { GameState, TankState } from './game';
import { EXPLOSION_RADIUS, GRAVITY_PX_S2 } from '../config';

export interface FireResult {
  mask: TerrainMask;
  heights: number[];
  impact: { x: number; y: number } | null;
}

export const simulateShot = (
  state: GameState,
  shooter: TankState,
  terrain: { mask: TerrainMask; dims: TerrainDimensions },
): FireResult => {
  const angleRad = (shooter.angleDeg * Math.PI) / 180;
  let prev = createProjectile(shooter.position.x, shooter.position.y, shooter.power, angleRad);
  let current = prev;
  const dt = 1 / 240;
  let impact = null as { x: number; y: number } | null;
  for (let i = 0; i < 20000; i += 1) {
    current = stepProjectile(current, dt, {
      gravity: GRAVITY_PX_S2,
      windAx: state.windAx,
    });
    const hit = segmentFirstImpact(
      terrain.mask,
      terrain.dims,
      prev.x,
      prev.y,
      current.x,
      current.y,
      0.75,
    );
    if (
      hit ||
      current.x < 0 ||
      current.x >= terrain.dims.width ||
      current.y >= terrain.dims.height
    ) {
      if (hit) impact = { x: hit.x, y: hit.y };
      break;
    }
    prev = current;
  }

  if (impact) {
    const res = applyExplosion(terrain.mask, terrain.dims, impact.x, impact.y, EXPLOSION_RADIUS);
    return { mask: res.mask, heights: res.heights, impact };
  }
  return { mask: terrain.mask, heights: [], impact };
};
