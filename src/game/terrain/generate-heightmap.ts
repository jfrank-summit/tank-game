import { createRng, randomRange } from '../rng'
import type { TerrainConfig, Heightmap } from './types'

const smooth = (values: Heightmap): Heightmap => {
  const out = values.slice()
  for (let i = 1; i < values.length - 1; i += 1) {
    out[i] = (values[i - 1] + values[i] + values[i + 1]) / 3
  }
  return out
}

export const generateHeightmap = (config: TerrainConfig): Heightmap => {
  const { width, minHeight, maxHeight, roughness, seed, smoothingPasses = 2 } = config
  const rng = createRng(seed)
  const heights: Heightmap = new Array(width).fill(0)

  // Midpoint displacement (1D) — iterative refinement
  heights[0] = randomRange(rng, minHeight, maxHeight)
  heights[width - 1] = randomRange(rng, minHeight, maxHeight)

  let step = width - 1
  let disp = (maxHeight - minHeight) * roughness

  while (step > 1) {
    for (let left = 0; left < width - 1; left += step) {
      const right = left + step
      const mid = (left + right) >> 1
      const avg = (heights[left] + heights[right]) / 2
      const offset = (rng.next() * 2 - 1) * disp
      heights[mid] = Math.max(minHeight, Math.min(maxHeight, avg + offset))
    }
    step = step >> 1
    disp *= roughness
  }

  // Fill any remaining zeros (in case width isn't power-of-two + 1)
  for (let i = 0; i < width; i += 1) {
    if (heights[i] === 0) {
      heights[i] = (minHeight + maxHeight) / 2
    }
  }

  // Smoothing passes
  let out = heights
  for (let s = 0; s < smoothingPasses; s += 1) out = smooth(out)
  return out
}

