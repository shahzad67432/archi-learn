import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Level, XPStore } from '@/lib/types'
import { XP_THRESHOLDS } from '@/lib/constants/theme'

const calculateLevel = (xp: number): Level => {
  const thresholds = Object.entries(XP_THRESHOLDS)
    .map(([k, v]) => ({ xp: Number(k), level: v as Level }))
    .sort((a, b) => b.xp - a.xp)

  for (const { xp: threshold, level } of thresholds) {
    if (xp >= threshold) return level
  }
  return 'Apprentice'
}

interface XPState extends XPStore {
  previousLevel: Level
  justLeveledUp: boolean
  completedConcepts: string[]
  clearLevelUp: () => void
  markConceptComplete: (slug: string, xp: number) => void
}

export const useXPStore = create<XPState>()(
  persist(
    (set, get) => ({
      totalXP: 0,
      level: 'Apprentice',
      previousLevel: 'Apprentice',
      conceptsUnlocked: [],
      completedConcepts: [],
      justLeveledUp: false,

      addXP: (amount: number) => {
        const current = get()
        const newXP = current.totalXP + amount
        const newLevel = calculateLevel(newXP)
        const leveledUp = newLevel !== current.level

        set({
          totalXP: newXP,
          level: newLevel,
          previousLevel: current.level,
          justLeveledUp: leveledUp,
        })
      },

      unlockConcept: (slug: string) => {
        const current = get()
        if (!current.conceptsUnlocked.includes(slug)) {
          set({ conceptsUnlocked: [...current.conceptsUnlocked, slug] })
        }
      },

      clearLevelUp: () => set({ justLeveledUp: false }),

      markConceptComplete: (slug: string, xp: number) => {
        const { completedConcepts } = get()
        if (completedConcepts.includes(slug)) return
        set({ completedConcepts: [...completedConcepts, slug] })
        get().addXP(xp)
      },
    }),
    {
      name: 'archi-xp-storage',
      partialize: (state: XPState) => ({
        totalXP: state.totalXP,
        level: state.level,
        conceptsUnlocked: state.conceptsUnlocked,
        completedConcepts: state.completedConcepts,
      }),
    }
  )
)
