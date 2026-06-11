'use client'
import { motion } from 'framer-motion'

interface Props {
  accentColor: string
}

/* ── shared card wrapper ── */
function Card({ children, title, titleColor }: { children: React.ReactNode; title: string; titleColor: string }) {
  return (
    <div
      style={{
        background: '#FEFCFB',
        borderRadius: 10,
        padding: 'clamp(6px, 1vw, 10px)',
        border: '0.5px solid rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: titleColor,
          marginBottom: 4,
          display: 'block',
        }}
      >
        {title}
      </span>
      {children}
    </div>
  )
}

/* ── Panel A: 99% waste ── */
function WasteStat() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Visual bar at top */}
      <div className="flex flex-col justify-start min-h-0" style={{ flex: 1, gap: 3 }}>
        <svg
          viewBox="0 0 100 6"
          preserveAspectRatio="none"
          style={{ width: '100%', height: 6, display: 'block' }}
        >
          <rect x="0" y="0" width="100" height="6" rx="3" fill="#E5E0DB" />
          <motion.rect
            x="0" y="0" width="99" height="6" rx="3"
            fill="#DC2626"
            initial={{ width: 0 }}
            animate={{ width: 99 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="flex justify-between">
          <span style={{ fontSize: 7, color: '#DC2626', fontWeight: 500 }}>
            99 wasted
          </span>
          <span style={{ fontSize: 7, color: '#A8A29E', fontWeight: 500 }}>
            1 delivered
          </span>
        </div>
      </div>
      {/* Text pinned to bottom — aligns with Start Learning button */}
      <div className="flex-shrink-0">
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(26px, 3.2vw, 44px)',
            lineHeight: 0.88,
            color: '#DC2626',
            letterSpacing: '-0.03em',
            display: 'block',
          }}
        >
          99%
        </span>
        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: 'clamp(9px, 1vw, 11px)',
            color: '#78716C',
            fontWeight: 300,
            lineHeight: 1.45,
            display: 'block',
          }}
        >
          of polling requests return empty — the server has nothing to say 99 times out of 100.
        </span>
      </div>
    </div>
  )
}

/* ── Panel B: 57× overhead ── */
function OverheadStat({ accentColor }: { accentColor: string }) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Visual bars at top */}
      <div className="flex flex-col justify-start min-h-0" style={{ flex: 1, gap: 5 }}>
        {/* HTTP bar */}
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '85%' }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            style={{
              height: 10,
              borderRadius: 4,
              background: '#DC2626',
              opacity: 0.35,
            }}
          />
          <motion.span
            style={{ fontSize: 7, color: '#DC2626', fontWeight: 600, whiteSpace: 'nowrap' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            800 B
          </motion.span>
        </div>
        {/* WS bar */}
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '12%' }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
            style={{
              height: 10,
              borderRadius: 4,
              background: accentColor,
            }}
          />
          <motion.span
            style={{ fontSize: 7, color: accentColor, fontWeight: 600, whiteSpace: 'nowrap' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            14 B ✓
          </motion.span>
        </div>
        {/* Labels */}
        <div className="flex justify-between">
          <span style={{ fontSize: 6, color: '#A8A29E', fontWeight: 500 }}>HTTP</span>
          <span style={{ fontSize: 6, color: accentColor, fontWeight: 500 }}>WebSocket</span>
        </div>
      </div>
      {/* Text pinned to bottom — aligns with Start Learning button */}
      <div className="flex-shrink-0">
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(26px, 3.2vw, 44px)',
            lineHeight: 0.88,
            color: accentColor,
            letterSpacing: '-0.03em',
            display: 'block',
          }}
        >
          57×
        </span>
        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: 'clamp(9px, 1vw, 11px)',
            color: '#78716C',
            fontWeight: 300,
            lineHeight: 1.45,
            display: 'block',
          }}
        >
          less overhead per message — WebSocket frames are 14 bytes vs HTTP&apos;s 800.
        </span>
      </div>
    </div>
  )
}

/* ── Root ── */
export default function ZoneHookPanels({ accentColor }: Props) {
  return (
    <>
      <Card title="HTTP polling — the problem" titleColor="#DC2626">
        <WasteStat />
      </Card>
      <Card title="Frame anatomy" titleColor={accentColor}>
        <OverheadStat accentColor={accentColor} />
      </Card>
    </>
  )
}
