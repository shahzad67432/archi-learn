'use client'

import { useArchi } from '@/lib/context/ArchiContext'
import Archi from './Archi'

export default function ArchiFromContext() {
  const { mood, tip, showTip, visible, hideArchiTip } = useArchi()

  if (!visible) return null

  return (
    <Archi
      mood={mood}
      tipOverride={tip ?? undefined}
      showTip={showTip}
      onTipClose={hideArchiTip}
      fixed
    />
  )
}
