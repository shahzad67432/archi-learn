'use client'

import { useEffect } from 'react'
import { useXPStore } from '@/lib/store/xpStore'

export default function Providers({ children }: { children: React.ReactNode }) {
  const clearLevelUp = useXPStore(s => s.clearLevelUp)

  useEffect(() => {
    clearLevelUp()
  }, [clearLevelUp])

  return <>{children}</>
}
