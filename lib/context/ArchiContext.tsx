'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import type { ArchiMood } from '@/components/mascot/Archi'

interface ArchiContextValue {
  mood: ArchiMood
  tip: string | null
  showTip: boolean
  visible: boolean
  setMood: (mood: ArchiMood) => void
  showArchiTip: (text: string, mood?: ArchiMood) => void
  hideArchiTip: () => void
  setVisible: (v: boolean) => void
}

const ArchiContext = createContext<ArchiContextValue>({
  mood: 'idle',
  tip: null,
  showTip: false,
  visible: true,
  setMood: () => {},
  showArchiTip: () => {},
  hideArchiTip: () => {},
  setVisible: () => {},
})

export function ArchiProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMoodState] = useState<ArchiMood>('idle')
  const [tip, setTip] = useState<string | null>(null)
  const [showTip, setShowTip] = useState(false)
  const [visible, setVisibleState] = useState(true)

  const setMood = useCallback((m: ArchiMood) => setMoodState(m), [])

  const showArchiTip = useCallback((text: string, m?: ArchiMood) => {
    setTip(text)
    setShowTip(true)
    if (m) setMoodState(m)
  }, [])

  const hideArchiTip = useCallback(() => {
    setShowTip(false)
    setTip(null)
    setMoodState('idle')
  }, [])

  const setVisible = useCallback((v: boolean) => setVisibleState(v), [])

  return (
    <ArchiContext.Provider value={{
      mood, tip, showTip, visible,
      setMood, showArchiTip, hideArchiTip, setVisible,
    }}>
      {children}
    </ArchiContext.Provider>
  )
}

export const useArchi = () => useContext(ArchiContext)
