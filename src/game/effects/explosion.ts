import type { TerrainDimensions, TerrainMask } from '../terrain/mask'
import { applyCrater, recomputeHeightmapFromMask } from '../terrain/mask'
import type { Heightmap } from '../terrain/types'

export interface ExplosionResult {
  mask: TerrainMask
  heights: Heightmap
}

export const applyExplosion = (
  mask: TerrainMask,
  dims: TerrainDimensions,
  centerX: number,
  centerY: number,
  radius: number,
): ExplosionResult => {
  const nextMask = applyCrater(mask, dims, centerX, centerY, radius)
  const heights = recomputeHeightmapFromMask(nextMask, dims)
  return { mask: nextMask, heights }
}

