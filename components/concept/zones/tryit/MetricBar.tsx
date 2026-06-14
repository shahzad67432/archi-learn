'use client'

import { motion } from 'framer-motion'

export function MetricBar({
  label,
  value,
  suffix,
  tone,
}: {
  label: string
  value: number
  suffix?: string
  tone: string
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
        <span style={{ fontSize: 'clamp(9px, 1.5vw, 10px)', color: '#78716C', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 'clamp(9px, 1.5vw, 10px)', color: tone, fontWeight: 700 }}>{value}{suffix}</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.35 }}
          style={{ height: '100%', borderRadius: 999, background: tone }}
        />
      </div>
    </div>
  )
}
