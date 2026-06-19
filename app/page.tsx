'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useXPStore } from '@/lib/store/xpStore'
import { concepts } from '@/data/concepts'
import { useArchi } from '@/lib/context/ArchiContext'

const XP_ORDER: [number, string][] = [
  [0, 'Apprentice'],
  [200, 'Engineer'],
  [500, 'Senior'],
  [1000, 'Architect'],
  [2000, 'Principal'],
]

const getNextMilestone = (level: string) => {
  const idx = XP_ORDER.findIndex(([, l]) => l === level)
  if (idx >= XP_ORDER.length - 1) return null
  return { nextXP: XP_ORDER[idx + 1][0], nextLevel: XP_ORDER[idx + 1][1] }
}

const IDLE_MOODS = ['thinking', 'pointing', 'cheer'] as const

export default function Home() {
  const totalXP = useXPStore(s => s.totalXP)
  const level = useXPStore(s => s.level)
  const milestone = getNextMilestone(level)
  const { setMood, showArchiTip, hideArchiTip } = useArchi()

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 10000
      return setTimeout(() => {
        const randomMood = IDLE_MOODS[Math.floor(Math.random() * IDLE_MOODS.length)]
        setMood(randomMood)
        setTimeout(() => setMood('idle'), 1500)
        scheduleNext()
      }, delay)
    }
    const timer = scheduleNext()
    return () => clearTimeout(timer)
  }, [setMood])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('archi-landing-tip')) return

    const timer = setTimeout(() => {
      showArchiTip("Try dragging a connection on the canvas 👆", 'pointing')
      sessionStorage.setItem('archi-landing-tip', 'true')

      setTimeout(() => {
        hideArchiTip()
      }, 4000)
    }, 5000)

    return () => clearTimeout(timer)
  }, [showArchiTip, hideArchiTip])

  return (
    <main className="h-screen overflow-hidden bg-canvas relative pt-[52px]">

      {/* Ghost watermark */}
      <motion.div
        className="absolute left-0 z-0 pointer-events-none select-none font-syne font-extrabold whitespace-pre-line"
        style={{
          top: 52,
          fontSize: 'clamp(48px, 14vw, 180px)',
          color: 'rgba(249, 115, 22, 0.055)',
          opacity: 1,
          transform: 'translateX(-2%) translateY(-2%)',
          letterSpacing: '-0.04em',
          lineHeight: 0.82,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        {'SYSTEM\nDESIGN'}
      </motion.div>

      {/* ─── Desktop layout (1024px+) ─── */}
      <div
        className="hidden lg:grid h-full min-h-0"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: 'clamp(16px,2.5vw,32px) clamp(20px,4vw,48px)',
          gridTemplateColumns: '1fr 1.4fr 1fr',
          gridTemplateRows: 'auto 1fr auto',
          gap: 'clamp(8px,1.5%,16px)',
        }}
      >
        {/* ── Row 1 — Hero badge + headline ── */}
        <div className="flex flex-col gap-1.5 justify-center" style={{ gridColumn: '1 / 3' }}>
          <motion.div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full w-fit"
            style={{
              backgroundColor: '#FFF0E5',
              border: '1px solid #FDBA74',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: '#F97316' }} />
            <span
              className="font-dm-sans font-bold uppercase tracking-wider"
              style={{ fontSize: '11px', color: '#C05400' }}
            >
              {concepts.length} CONCEPTS · BUILT IN PUBLIC
            </span>
          </motion.div>

          <motion.h1
            className="font-syne font-extrabold leading-[0.95]"
            style={{ fontSize: 'clamp(22px,5vw,52px)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <span style={{ color: '#78716C' }}>Master </span>
            <span style={{ color: '#F97316' }}>System Design.</span>
          </motion.h1>

          <motion.p
            className="font-dm-sans"
            style={{ fontSize: 'clamp(12px,1.4vw,18px)', color: '#78716C' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            Through play. Earn XP. Level up.
          </motion.p>
        </div>

        {/* ── Row 1 — Level card ── */}
        <motion.div
          className="flex flex-col justify-center rounded-[12px] p-4"
          style={{
            gridColumn: '3',
            backgroundColor: '#FFF0E5',
            border: '0.5px solid #FDBA74',
          }}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
        >
          <span className="font-dm-sans font-bold" style={{ fontSize: '10px', color: '#C05400' }}>
            YOUR LEVEL
          </span>
          <span
            className="font-syne font-extrabold leading-none mt-1"
            style={{ fontSize: 'clamp(16px,2.5vw,24px)', color: '#C05400' }}
          >
            {level}
          </span>
          {milestone && (
            <span className="font-dm-sans mt-1" style={{ fontSize: '11px', color: '#D97706' }}>
              {totalXP} / {milestone.nextXP} XP to {milestone.nextLevel}
            </span>
          )}
        </motion.div>

        {/* ── Row 2 — Left column ── */}
        <motion.div
          className="flex flex-col"
          style={{ gridColumn: '1', gap: 'clamp(8px,1.5%,16px)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
        >
          <div className="flex-1 rounded-[12px] flex flex-col justify-between"
            style={{ backgroundColor: '#1C1917', padding: 'clamp(14px,6%,22px) clamp(16px,7%,24px)' }}>
            <span className="font-dm-sans"
              style={{ fontSize: '10px', color: '#6B6B6B', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Gamified
            </span>
            <div className="font-syne font-extrabold"
              style={{ fontSize: 'clamp(16px,2.2vw,24px)', color: '#FCD34D', lineHeight: 1.05 }}>
              Quiz.<br />XP.<br />Rank.
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
              {['Q','X','R'].map((l, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2,
                  backgroundColor: i === 0 ? '#FCD34D' : 'rgba(255,255,255,0.12)' }} />
              ))}
            </div>
          </div>
          <div className="flex-1 rounded-[12px] flex flex-col justify-between bg-white"
            style={{ padding: 'clamp(14px,6%,22px) clamp(16px,7%,24px)' }}>
            <span className="font-dm-sans"
              style={{ fontSize: '10px', color: '#A8A29E', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Concepts
            </span>
            <div>
              <div className="font-syne font-extrabold"
                style={{ fontSize: 'clamp(32px,4.5vw,52px)', color: '#1C1917', lineHeight: 1 }}>
                {concepts.length}
              </div>
              <div className="font-dm-sans"
                style={{ fontSize: '11px', color: '#78716C', marginTop: 4 }}>
                topics to master
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span className="font-dm-sans" style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>
                5 XP levels to climb
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Row 2 — Center: interactive canvas ── */}
        <motion.div
          className="rounded-[12px] overflow-hidden relative"
          style={{ gridColumn: '2' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <Image src="/hero-concept_01.svg" alt="Architecture diagram" fill className="object-contain p-6" />
        </motion.div>

        {/* ── Row 2 — Right column ── */}
        <motion.div
          className="flex flex-col"
          style={{ gridColumn: '3', gap: 'clamp(8px,1.5%,16px)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
        >
          <div className="rounded-[12px] p-4 bg-white flex flex-col justify-center" style={{ flex: '0 0 55%' }}>
            <span className="font-dm-sans font-bold" style={{ fontSize: '10px', color: '#A8A29E' }}>
              HOW IT WORKS
            </span>
            <div className="flex flex-col gap-2.5 mt-3">
              {[['1', 'Pick a concept'], ['2', 'Drag & connect'], ['3', 'Earn XP & rank up']].map(([num, text]) => (
                <div key={num} className="flex items-center gap-2.5">
                  <div
                    className="w-[20px] h-[20px] rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F97316' }}
                  >
                    <span className="font-syne font-bold text-white" style={{ fontSize: '10px' }}>{num}</span>
                  </div>
                  <span className="font-dm-sans" style={{ fontSize: '11px', color: '#44403C' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/concepts"
            className="flex-1 rounded-[12px] flex flex-col justify-between"
            style={{ backgroundColor: '#1C1917', padding: 'clamp(14px,6%,22px) clamp(16px,7%,24px)' }}
          >
            <div>
              <span className="font-dm-sans"
                style={{ fontSize: '10px', color: '#6B6B6B', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Ready to begin
              </span>
              <div className="font-syne font-extrabold"
                style={{ fontSize: 'clamp(18px, 2.2vw, 26px)', color: '#FFFBF7', lineHeight: 1.05, marginTop: 6 }}>
                Start<br />Learning
              </div>
              <div className="font-dm-sans"
                style={{ fontSize: '11px', color: '#6B6B6B', marginTop: 6 }}>
                {concepts.length} concepts waiting
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="flex items-center justify-center flex-shrink-0"
                style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#ADFA1D' }}>
                <span className="font-syne font-bold" style={{ fontSize: '16px', color: '#1C1917' }}>→</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Row 3 — Footer ── */}
        <motion.div
          className="flex items-center justify-between pt-3 pb-1"
          style={{ gridColumn: '1 / 4', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {[`${concepts.length} Concepts`, '5 Levels of XP', '1 Mascot Guide'].map(label => (
              <span
                key={label}
                className="px-2.5 py-1 rounded-full font-dm-sans"
                style={{ backgroundColor: '#F3F4F6', fontSize: '11px', color: '#44403C' }}
              >
                {label}
              </span>
            ))}
          </div>
          <a href="https://github.com/shahzad67432/archi-learn" target="_blank" rel="noopener noreferrer" className="font-dm-sans flex items-center gap-1 shrink-0" style={{ fontSize: '11px', textDecoration: 'none' }}>
            <span style={{ color: '#A8A29E' }}>Built in public ·</span>
            <span style={{ color: '#F97316' }}>Contribute ↗</span>
          </a>
        </motion.div>
      </div>

      {/* ─── Mobile / Tablet layout (< 1024px) ─── */}
      <div className="lg:hidden h-full overflow-y-auto relative">

        <div className="relative z-2 flex flex-col gap-3 p-4 min-h-full">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full w-fit"
            style={{ backgroundColor: '#FFF0E5', border: '1px solid #FDBA74' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: '#F97316' }} />
            <span className="font-dm-sans font-bold uppercase tracking-wider" style={{ fontSize: '11px', color: '#C05400' }}>
               {concepts.length} CONCEPTS · BUILT IN PUBLIC
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-syne font-extrabold leading-[0.95]"
            style={{ fontSize: 'clamp(22px,5vw,38px)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <span style={{ color: '#78716C' }}>Master </span>
            <span style={{ color: '#F97316' }}>System Design.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="font-dm-sans"
            style={{ fontSize: 'clamp(12px,1.4vw,16px)', color: '#78716C' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            Through play. Earn XP. Level up.
          </motion.p>

          {/* Level card */}
          <motion.div
            className="flex items-center justify-between rounded-[12px] p-3"
            style={{ backgroundColor: '#FFF0E5', border: '0.5px solid #FDBA74' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          >
            <div className="flex flex-col">
              <span className="font-dm-sans font-bold" style={{ fontSize: '10px', color: '#C05400' }}>
                YOUR LEVEL
              </span>
              <span className="font-syne font-extrabold leading-none mt-1" style={{ fontSize: 'clamp(16px,2.5vw,20px)', color: '#C05400' }}>
                {level}
              </span>
            </div>
            {milestone && (
              <span className="font-dm-sans" style={{ fontSize: '11px', color: '#D97706', textAlign: 'right', flexShrink: 0 }}>
                {totalXP} / {milestone.nextXP} XP to {milestone.nextLevel}
              </span>
            )}
          </motion.div>

          {/* CTA */}
          <Link
            href="/concepts"
            className="flex-1 rounded-[12px] flex flex-col justify-between"
            style={{ backgroundColor: '#1C1917', padding: 'clamp(14px,6%,22px) clamp(16px,7%,24px)' }}
          >
            <div>
              <span className="font-dm-sans"
                style={{ fontSize: '10px', color: '#6B6B6B', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Ready to begin
              </span>
              <div className="font-syne font-extrabold"
                style={{ fontSize: 'clamp(18px, 2.2vw, 26px)', color: '#FFFBF7', lineHeight: 1.05, marginTop: 6 }}>
                Start<br />Learning
              </div>
              <div className="font-dm-sans"
                style={{ fontSize: '11px', color: '#6B6B6B', marginTop: 6 }}>
                {concepts.length} concepts waiting
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="flex items-center justify-center flex-shrink-0"
                style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#ADFA1D' }}>
                <span className="font-syne font-bold" style={{ fontSize: '16px', color: '#1C1917' }}>→</span>
              </div>
            </div>
          </Link>

          {/* Canvas */}
          <motion.div
            className="rounded-[12px] overflow-hidden relative flex-1"
            style={{ minHeight: '45vw' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <Image src="/hero-concept_01.svg" alt="Architecture diagram" fill className="object-contain p-2" />
          </motion.div>

          {/* Left cards row */}
          <div className="flex gap-3">
            <div className="flex-1 rounded-[12px] flex flex-col justify-between"
              style={{ backgroundColor: '#1C1917', padding: 'clamp(14px,6%,22px) clamp(16px,7%,24px)' }}>
              <span className="font-dm-sans"
                style={{ fontSize: '10px', color: '#6B6B6B', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Gamified
              </span>
              <div className="font-syne font-extrabold"
                style={{ fontSize: 'clamp(16px,2.2vw,24px)', color: '#FCD34D', lineHeight: 1.05 }}>
                Quiz.<br />XP.<br />Rank.
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {['Q','X','R'].map((l, i) => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 2,
                    backgroundColor: i === 0 ? '#FCD34D' : 'rgba(255,255,255,0.12)' }} />
                ))}
              </div>
            </div>
            <div className="flex-1 rounded-[12px] flex flex-col justify-between bg-white"
              style={{ padding: 'clamp(14px,6%,22px) clamp(16px,7%,24px)' }}>
              <span className="font-dm-sans"
                style={{ fontSize: '10px', color: '#A8A29E', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Concepts
              </span>
              <div>
                <div className="font-syne font-extrabold"
                  style={{ fontSize: 'clamp(32px,4.5vw,52px)', color: '#1C1917', lineHeight: 1 }}>
                  12
                </div>
                <div className="font-dm-sans"
                  style={{ fontSize: '11px', color: '#78716C', marginTop: 4 }}>
                  topics to master
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span className="font-dm-sans" style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>
                  5 XP levels to climb
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 pb-1" style={{ borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 flex-wrap">
              {[`${concepts.length} Concepts`, '5 Levels of XP', '1 Mascot Guide'].map(label => (
                <span
                  key={label}
                  className="px-2 py-0.5 rounded-full font-dm-sans"
                  style={{ backgroundColor: '#F3F4F6', fontSize: '10px', color: '#44403C' }}
                >
                  {label}
                </span>
              ))}
            </div>
            <a href="https://github.com/shahzad67432/archi-learn" target="_blank" rel="noopener noreferrer" className="font-dm-sans flex items-center gap-1 shrink-0" style={{ fontSize: '10px', textDecoration: 'none' }}>
              <span style={{ color: '#A8A29E' }}>Built in public ·</span>
              <span style={{ color: '#F97316' }}>Contribute ↗</span>
            </a>
          </div>
        </div>
      </div>

    </main>
  )
}
