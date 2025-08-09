export type Rng = {
  next: () => number
}

// Mulberry32 PRNG — fast and good enough for gameplay randomness
export const createRng = (seed: number): Rng => {
  let s = seed >>> 0
  const next = (): number => {
    s += 0x6d2b79f5
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return { next }
}

export const randomRange = (rng: Rng, min: number, max: number): number => {
  return min + (max - min) * rng.next()
}

export const hashStringToSeed = (text: string): number => {
  let h = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

