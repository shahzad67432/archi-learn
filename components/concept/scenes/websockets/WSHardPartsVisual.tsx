'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ZombieVisual,
  AuthVisual,
  MultiPodVisual,
  ReconnectVisual,
} from '@/components/concept/scenes/ZoneHardPartsVisuals'

export default function WSHardPartsVisual({ accentColor, chapter }: { accentColor: string; chapter: number }) {
  const [heartbeatActive, setHeartbeatActive] = useState(false)
  const [noRedis, setNoRedis] = useState(true)

  const resetMultiPod = () => setNoRedis(true)

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {chapter === 0 && (
        <>
          <ZombieVisual accentColor={accentColor} heartbeatActive={heartbeatActive} />
          {!heartbeatActive ? (
            <motion.button
              onClick={() => setHeartbeatActive(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'absolute', right: 20, bottom: 20,
                background: '#1C1917', color: '#ADFA1D',
                border: 'none', borderRadius: 8, padding: '8px 14px',
                fontFamily: 'var(--font-syne)', fontSize: 10, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <span>♥ Start Heartbeat</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setHeartbeatActive(false)}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'absolute', right: 20, bottom: 20,
                background: accentColor, color: '#FFFBF7',
                border: 'none', borderRadius: 8, padding: '8px 14px',
                fontFamily: 'var(--font-syne)', fontSize: 10, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ↺ Reset
            </motion.button>
          )}
        </>
      )}
      {chapter === 1 && <AuthVisual accentColor={accentColor} />}
      {chapter === 2 && (
        <>
          <MultiPodVisual accentColor={accentColor} noRedis={noRedis} />
          {noRedis ? (
            <motion.button
              onClick={() => setNoRedis(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'absolute', right: 20, bottom: 20,
                background: accentColor, color: '#FFFBF7',
                border: 'none', borderRadius: 8, padding: '8px 14px',
                fontFamily: 'var(--font-syne)', fontSize: 10, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <span>+ Add Redis Pub/Sub</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={resetMultiPod}
              whileTap={{ scale: 0.97 }}
              style={{
                position: 'absolute', right: 20, bottom: 20,
                background: '#1C1917', color: '#ADFA1D',
                border: 'none', borderRadius: 8, padding: '8px 14px',
                fontFamily: 'var(--font-syne)', fontSize: 10, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ↺ Reset
            </motion.button>
          )}
        </>
      )}
      {chapter === 3 && <ReconnectVisual accentColor={accentColor} />}
    </div>
  )
}
