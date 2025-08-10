import { describe, it, expect } from 'vitest'
import { createProjectile, stepProjectile, type PhysicsParams } from '../projectile'

const approx = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) <= eps

describe('projectile physics', () => {
  it('updates velocity and position under gravity (no wind)', () => {
    const p0 = createProjectile(0, 0, 10, Math.PI / 4) // 45°
    const params: PhysicsParams = { gravity: 10, windAx: 0 }
    const dt = 0.5
    const p1 = stepProjectile(p0, dt, params)

    // Velocity should change by a = g over dt on y only
    expect(approx(p1.vx, p0.vx)).toBe(true)
    expect(approx(p1.vy, p0.vy + params.gravity * dt)).toBe(true)

    // Position integrates using average velocity
    const vxAvg = (p0.vx + p1.vx) * 0.5
    const vyAvg = (p0.vy + p1.vy) * 0.5
    expect(approx(p1.x, p0.x + vxAvg * dt)).toBe(true)
    expect(approx(p1.y, p0.y + vyAvg * dt)).toBe(true)
  })

  it('wind accelerates horizontally', () => {
    const p0 = createProjectile(0, 0, 20, 0) // 0° (to the right)
    const params: PhysicsParams = { gravity: 0, windAx: 5 }
    const dt = 1
    const p1 = stepProjectile(p0, dt, params)
    expect(approx(p1.vx, p0.vx + params.windAx * dt)).toBe(true)
    expect(approx(p1.vy, p0.vy)).toBe(true)
  })
})


