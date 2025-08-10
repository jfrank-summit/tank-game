import { describe, it, expect } from 'vitest'
import { segmentFirstImpact } from '../collision'
import { type TerrainDimensions } from '../../terrain/mask'

const makeMask = (dims: TerrainDimensions, solidYFrom: number) => {
  const data = new Uint8Array(dims.width * dims.height)
  for (let x = 0; x < dims.width; x += 1) {
    for (let y = solidYFrom; y < dims.height; y += 1) data[y * dims.width + x] = 1
  }
  return data
}

describe('collision', () => {
  it('detects first impact with flat ground', () => {
    const dims: TerrainDimensions = { width: 100, height: 100 }
    const mask = makeMask(dims, 60)
    const hit = segmentFirstImpact(mask, dims, 10, 10, 10, 90, 0.5)
    expect(hit).not.toBeNull()
    expect(hit!.y).toBeGreaterThanOrEqual(60)
  })
})


