export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type ConceptColor = 'flame' | 'signal' | 'volt' | 'xp-gold'
export type MascotState = 'idle' | 'cheer' | 'sad' | 'tip'
export type Level = 'Apprentice' | 'Engineer' | 'Senior' | 'Architect' | 'Principal'

export interface Concept {
  slug: string
  title: string
  tagline: string
  difficulty: Difficulty
  xpReward: number
  color: ConceptColor
  icon: string
  locked: boolean
  phase: number
  category: string
}

export interface ServiceNode {
  id: string
  label: string
  icon: string
  color: string
  defaultPosition: { x: number; y: number }
}

export interface Connection {
  fromId: string
  toId: string
  valid: boolean
}

export interface XPStore {
  totalXP: number
  level: Level
  conceptsUnlocked: string[]
  addXP: (amount: number) => void
  unlockConcept: (slug: string) => void
}

export interface MascotStore {
  state: MascotState
  tipText: string
  visible: boolean
  setState: (state: MascotState) => void
  setTip: (text: string) => void
  setVisible: (visible: boolean) => void
}
