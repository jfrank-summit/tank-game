export interface TerrainConfig {
  width: number
  minHeight: number
  maxHeight: number
  roughness: number
  seed: number
  smoothingPasses?: number
}

export type Heightmap = number[]

