import { surfaceYAt, type TerrainDimensions, type TerrainMask } from '../terrain/mask'

export interface TankSpawnConfig {
  dims: TerrainDimensions
  mask: TerrainMask
  tankRadius: number
  minSeparation: number
  maxSlopeDegrees: number
}

export interface Vec2 {
  x: number
  y: number
}

const deg = (radians: number): number => (radians * 180) / Math.PI

const slopeAtX = (mask: TerrainMask, dims: TerrainDimensions, x: number): number => {
  const x0 = Math.max(0, x - 1)
  const x1 = Math.min(dims.width - 1, x + 1)
  const y0 = surfaceYAt(mask, dims, x0)
  const y1 = surfaceYAt(mask, dims, x1)
  if (y0 == null || y1 == null) return 90
  const dy = y1 - y0
  const dx = x1 - x0 || 1
  return deg(Math.atan2(Math.abs(dy), dx))
}

const findSurfacePointNear = (
  mask: TerrainMask,
  dims: TerrainDimensions,
  xStart: number,
  maxSlope: number,
  tankRadius: number,
): Vec2 | null => {
  const radius = Math.max(0, Math.floor(tankRadius))
  for (let delta = 0; delta < dims.width; delta += 1) {
    for (const x of [xStart - delta, xStart + delta]) {
      if (x < radius || x >= dims.width - radius) continue
      const y = surfaceYAt(mask, dims, x)
      if (y == null || y < radius || y >= dims.height) continue
      const slope = slopeAtX(mask, dims, x)
      if (slope <= maxSlope) {
        return { x, y: y - radius }
      }
    }
  }
  return null
}

export const placeTwoTanks = (config: TankSpawnConfig): [Vec2, Vec2] => {
  const { dims, mask, tankRadius, minSeparation, maxSlopeDegrees } = config
  const leftGuess = Math.floor(dims.width * 0.2)
  const rightGuess = Math.floor(dims.width * 0.8)

  const left = findSurfacePointNear(mask, dims, leftGuess, maxSlopeDegrees, tankRadius)
  if (!left) throw new Error('Failed to place left tank')

  // Ensure separation by scanning around the right guess until far enough from left
  let right: Vec2 | null = null
  for (let delta = 0; delta < dims.width; delta += 1) {
    for (const x of [rightGuess - delta, rightGuess + delta]) {
      if (Math.abs(x - left.x) < minSeparation) continue
      const candidate = findSurfacePointNear(mask, dims, x, maxSlopeDegrees, tankRadius)
      if (candidate && Math.abs(candidate.x - left.x) >= minSeparation) {
        right = candidate
        break
      }
    }
    if (right) break
  }
  if (!right) throw new Error('Failed to place right tank with required separation')

  return [left, right]
}

