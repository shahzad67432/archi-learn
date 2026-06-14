'use client'

import { motion } from 'framer-motion'

export function FlowLine({
  path,
  active,
  danger,
  accent,
}: {
  path: string
  active: boolean
  danger?: boolean
  accent: string
}) {
  return (
    <motion.path
      d={path}
      fill="none"
      stroke={danger ? '#EF4444' : active ? accent : '#D6D3D1'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray={active ? '8 8' : '0'}
      animate={active ? { strokeDashoffset: [0, -32] } : {}}
      transition={active ? { duration: 1.1, repeat: Infinity, ease: 'linear' } : {}}
      opacity={active ? 1 : 0.45}
    />
  )
}
