'use client'
import { motion } from 'framer-motion'

export default function RedisHookVisual({ accentColor }: { accentColor: string }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4B5FD', marginBottom: 6, display: 'block' }}>
        The Speed Gap
      </span>
      <svg viewBox="0 0 680 240" style={{ width: '100%', flex: 1, display: 'block' }}>
        {/* ── LEFT: RAM ── */}
        <text x={170} y={60} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={52} fontWeight={800} fill="#FF4D00">
          100 ns
        </text>
        <text x={170} y={82} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill="#5A5A5A" letterSpacing="0.12em" fontWeight={400}>
          RAM
        </text>

        {/* Lightning bolt */}
        <g transform="translate(170, 100)">
          <motion.path
            d="M-4,-12 L2,-8 L-1,-2 L5,-4 L-6,10 L-2,2 L-8,4 Z"
            fill="#FF4D00"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          />
        </g>

        {/* RAM bar — full width */}
        <rect x={40} y={130} width={260} height={8} rx={4} fill="#FF4D00" />

        {/* ── CENTER: divider + 1000× badge ── */}
        <line x1={340} y1={20} x2={340} y2={220} stroke="#E0DDD6" strokeWidth="1" />

        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 250, damping: 12, delay: 0.5 }}
          style={{ originX: 340, originY: 140 }}
        >
          <rect x={306} y={126} width={68} height={28} rx={14} fill="#0D0D0D" />
          <text x={340} y={146} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={12} fontWeight={800} fill="#C8FF00">
            1000×
          </text>
        </motion.g>

        {/* ── RIGHT: DISK ── */}
        <text x={510} y={60} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={52} fontWeight={800} fill="#5A5A5A">
          100 μs
        </text>
        <text x={510} y={82} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill="#5A5A5A" letterSpacing="0.12em" fontWeight={400}>
          DISK
        </text>

        {/* Snail icon */}
        <g transform="translate(510, 106)">
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ellipse cx="0" cy="2" rx="10" ry="6" fill="#D6D3D1" />
            <path d="M-4,0 C-4,-8 4,-8 4,0" fill="#A8A29E" stroke="#A8A29E" strokeWidth="0.5" />
            <circle cx="6" cy="-2" r="1.5" fill="#0D0D0D" />
          </motion.g>
        </g>

        {/* DISK bar — 1/1000th width (0.26px ≈ 1px minimum) */}
        <rect x={380} y={130} width={1} height={8} rx={0} fill="#5A5A5A" opacity="0.5" />

        {/* Latency callout */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <rect x={87} y={160} width={166} height={22} rx={4} fill="#FFF1F2" stroke="#FF4D00" strokeWidth="0.6" />
          <text x={170} y={175} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#FF4D00" fontWeight={700}>
            cache hit: RAM speed
          </text>
        </motion.g>

        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.4 }}
        >
          <rect x={410} y={160} width={190} height={22} rx={4} fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="0.6" />
          <text x={505} y={175} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#5A5A5A" fontWeight={700}>
            cache miss: disk I/O
          </text>
        </motion.g>

        {/* Bottom annotation */}
        <text x={340} y={220} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#A8A29E" fontStyle="italic">
          Redis lives in RAM. A cache hit is 1000× faster than a disk read.
        </text>
      </svg>
    </div>
  )
}
