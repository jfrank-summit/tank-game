import type { Vec2 } from '../../spawn/place-tanks'

export type Phase = 'aim' | 'fire' | 'resolve' | 'next'

export interface TankState {
  id: string
  position: Vec2
  angleDeg: number
  power: number
  // Health/ammo added next commit; keep placeholders for type stability
  health?: number
  ammoBasic?: number
}

export interface GameState {
  tanks: TankState[]
  activeTankIndex: number
  windAx: number
  phase: Phase
  winnerIndex: number | null
}

export const selectActiveTank = (state: GameState): TankState =>
  state.tanks[state.activeTankIndex]

export const createInitialGameState = (params: {
  tanks: Array<{ id: string; position: Vec2 }>
  initialAngleDeg: number
  initialPower: number
  windAx: number
}): GameState => {
  const tanks: TankState[] = params.tanks.map((t) => ({
    id: t.id,
    position: t.position,
    angleDeg: params.initialAngleDeg,
    power: params.initialPower,
  }))
  return {
    tanks,
    activeTankIndex: 0,
    windAx: params.windAx,
    phase: 'aim',
    winnerIndex: null,
  }
}

export type Action =
  | { type: 'setAngle'; degrees: number }
  | { type: 'setPower'; power: number }
  | { type: 'setWind'; windAx: number }
  | { type: 'fire' }
  | { type: 'resolve' }
  | { type: 'endTurn' }

export const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'setAngle': {
      if (state.phase !== 'aim') return state
      const nextTanks = state.tanks.slice()
      nextTanks[state.activeTankIndex] = {
        ...nextTanks[state.activeTankIndex],
        angleDeg: Math.round(action.degrees),
      }
      return { ...state, tanks: nextTanks }
    }
    case 'setPower': {
      if (state.phase !== 'aim') return state
      const nextTanks = state.tanks.slice()
      nextTanks[state.activeTankIndex] = {
        ...nextTanks[state.activeTankIndex],
        power: Math.round(action.power),
      }
      return { ...state, tanks: nextTanks }
    }
    case 'setWind': {
      return { ...state, windAx: action.windAx }
    }
    case 'fire': {
      if (state.phase !== 'aim') return state
      return { ...state, phase: 'fire' }
    }
    case 'resolve': {
      if (state.phase !== 'fire') return state
      return { ...state, phase: 'resolve' }
    }
    case 'endTurn': {
      const nextActive = (state.activeTankIndex + 1) % state.tanks.length
      return { ...state, activeTankIndex: nextActive, phase: 'aim' }
    }
    default:
      return state
  }
}


