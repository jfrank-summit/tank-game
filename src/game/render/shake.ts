export interface ShakeState {
  intensity: number // pixels
  duration: number // seconds remaining
}

export const createShake = (): ShakeState => ({ intensity: 0, duration: 0 })

export const addShake = (state: ShakeState, intensity: number, duration: number): void => {
  state.intensity = Math.max(state.intensity, intensity)
  state.duration = Math.max(state.duration, duration)
}

export const updateAndGetOffset = (
  state: ShakeState,
  dt: number,
): { x: number; y: number } => {
  if (state.duration <= 0 || state.intensity <= 0) return { x: 0, y: 0 }
  state.duration = Math.max(0, state.duration - dt)
  const falloff = state.duration > 0 ? state.duration : 0
  const i = state.intensity * (falloff)
  const angle = Math.random() * Math.PI * 2
  const r = Math.random() * i
  return { x: Math.cos(angle) * r, y: Math.sin(angle) * r }
}

