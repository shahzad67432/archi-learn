import { useXPStore } from '@/lib/store/xpStore'
import { useMascotStore } from '@/lib/store/mascotStore'
import { XP_REWARDS } from '@/lib/constants/theme'

export const useXP = () => {
  const addXP = useXPStore(s => s.addXP)
  const unlockConcept = useXPStore(s => s.unlockConcept)
  const mascotSetState = useMascotStore(s => s.setState)
  const setTip = useMascotStore(s => s.setTip)

  const gainXP = (type: keyof typeof XP_REWARDS, label?: string) => {
    const amount = XP_REWARDS[type]
    addXP(amount)
    if (type === 'QUIZ_CORRECT') {
      mascotSetState('cheer')
    }
  }

  const openConcept = (slug: string, title: string) => {
    unlockConcept(slug)
    addXP(XP_REWARDS.CONCEPT_OPENED)
    setTip(`Now learning: ${title}. Let's go!`)
  }

  return { gainXP, openConcept }
}
