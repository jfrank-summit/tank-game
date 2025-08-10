export interface ProjectileState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
}

export interface PhysicsParams {
  gravity: number; // pixels/s^2 (positive downward)
  windAx: number; // horizontal accel from wind, pixels/s^2 (can be negative)
}

export const createProjectile = (
  x: number,
  y: number,
  speed: number,
  angleRadians: number,
): ProjectileState => {
  const vx = Math.cos(angleRadians) * speed;
  const vy = -Math.sin(angleRadians) * speed;
  return { x, y, vx, vy, alive: true };
};

export const stepProjectile = (
  p: ProjectileState,
  dt: number,
  params: PhysicsParams,
): ProjectileState => {
  if (!p.alive) return p;
  const ax = params.windAx;
  const ay = params.gravity;
  const nextVx = p.vx + ax * dt;
  const nextVy = p.vy + ay * dt;
  const nextX = p.x + (p.vx + nextVx) * 0.5 * dt;
  const nextY = p.y + (p.vy + nextVy) * 0.5 * dt;
  return { x: nextX, y: nextY, vx: nextVx, vy: nextVy, alive: true };
};

export const integrateUntil = (
  initial: ProjectileState,
  dt: number,
  params: PhysicsParams,
  shouldStop: (p: ProjectileState) => boolean,
  maxSteps: number = 20000,
): ProjectileState[] => {
  const path: ProjectileState[] = [initial];
  let current = initial;
  for (let i = 0; i < maxSteps; i += 1) {
    const next = stepProjectile(current, dt, params);
    path.push(next);
    if (shouldStop(next)) break;
    current = next;
  }
  return path;
};
