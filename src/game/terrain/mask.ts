import type { Heightmap } from './types'

export type TerrainMask = Uint8Array

export interface TerrainDimensions {
  width: number
  height: number
}

export const createMaskFromHeightmap = (
  heightmap: Heightmap,
  dims: TerrainDimensions,
): TerrainMask => {
  const { width, height } = dims
  const mask = new Uint8Array(width * height)
  for (let x = 0; x < width; x += 1) {
    const surfaceY = Math.max(0, Math.min(height - 1, Math.round(heightmap[x])))
    for (let y = surfaceY; y < height; y += 1) {
      mask[y * width + x] = 1
    }
  }
  return mask
}

export const cloneMask = (mask: TerrainMask): TerrainMask => mask.slice()

export const applyCrater = (
  mask: TerrainMask,
  dims: TerrainDimensions,
  centerX: number,
  centerY: number,
  radius: number,
): TerrainMask => {
  const { width, height } = dims
  const out = mask.slice()
  const r2 = radius * radius
  const minX = Math.max(0, Math.floor(centerX - radius))
  const maxX = Math.min(width - 1, Math.ceil(centerX + radius))
  const minY = Math.max(0, Math.floor(centerY - radius))
  const maxY = Math.min(height - 1, Math.ceil(centerY + radius))
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - centerX
      const dy = y - centerY
      if (dx * dx + dy * dy <= r2) {
        out[y * width + x] = 0
      }
    }
  }
  return out
}

export const isSolidAt = (
  mask: TerrainMask,
  dims: TerrainDimensions,
  x: number,
  y: number,
): boolean => {
  const { width, height } = dims
  if (x < 0 || y < 0 || x >= width || y >= height) return false
  return mask[y * width + x] === 1
}

export const surfaceYAt = (
  mask: TerrainMask,
  dims: TerrainDimensions,
  x: number,
): number | null => {
  const { width, height } = dims
  if (x < 0 || x >= width) return null
  for (let y = 0; y < height; y += 1) {
    if (isSolidAt(mask, dims, x, y)) return y
  }
  return null
}

export const recomputeHeightmapFromMask = (
  mask: TerrainMask,
  dims: TerrainDimensions,
): Heightmap => {
  const { width, height } = dims
  const heights: Heightmap = new Array(width)
  for (let x = 0; x < width; x += 1) {
    let y = 0
    while (y < height && mask[y * width + x] === 0) y += 1
    heights[x] = y < height ? y : height - 1
  }
  return heights
}

