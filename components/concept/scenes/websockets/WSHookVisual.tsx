'use client'
import { motion } from 'framer-motion'
import ZoneHookDiagram from '@/components/concept/scenes/ZoneHookDiagram'
import ZoneHookPanels from '@/components/concept/scenes/ZoneHookPanels'

export default function WSHookVisual({ accentColor }: { accentColor: string }) {
  return (
    <>
      <motion.div
        className="flex flex-col min-h-0"
        style={{
          flex: 5,
          borderRadius: 14,
          padding: 'clamp(14px, 2vw, 20px)',
        }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <span
          style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#C4B5FD',
            marginBottom: 6, display: 'block',
          }}
        >
          The Real-Time Layer
        </span>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <ZoneHookDiagram accentColor={accentColor} />
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 min-h-0 pb-6 pl-7"
        style={{ flex: 3, gap: 'clamp(6px, 1vw, 10px)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <ZoneHookPanels accentColor={accentColor} />
      </motion.div>
    </>
  )
}
