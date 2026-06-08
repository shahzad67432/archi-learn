'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useXPStore } from '@/lib/store/xpStore'
import { useCountUp } from '@/lib/hooks/useCountUp'
import PlaygroundCanvas from '@/components/hero/PlaygroundCanvas'
import Archi from '@/components/mascot/Archi'

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

const spring = { type: 'spring' as const, stiffness: 400, damping: 28 }

const headlineContainer = {
  initial: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const fadeUp = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: spring },
}

const cardFromLeft = {
  initial: { x: -40, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: spring },
}

const cardFromRight = {
  initial: { x: 40, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: spring },
}

const staggerCards = {
  initial: { transition: { staggerChildren: 0.08 } },
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.6 } },
}

const TOTAL_CONCEPTS = 12

export default function Home() {
  const totalXP = useXPStore(s => s.totalXP)
  const level = useXPStore(s => s.level)
  const unlockedCount = useXPStore(s => s.conceptsUnlocked.length)
  const animatedXP = useCountUp(totalXP)
  const milestone = getNextMilestone(level)
  const progressPct = Math.min(Math.round((unlockedCount / TOTAL_CONCEPTS) * 100), 100)

  return (
    <main className="h-screen overflow-hidden bg-canvas flex flex-col">
      {/* Headline */}
      <section className="flex flex-col items-center justify-center pt-24 pb-2 shrink-0">
        <motion.div
          initial="initial"
          animate="animate"
          variants={headlineContainer}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-flame/10 text-flame text-[10px] font-dm-sans font-medium uppercase tracking-[2px]">
              LEARN BY DOING
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col items-center">
            <h1
              className="font-syne font-extrabold text-ink text-center leading-[1.05]"
              style={{ fontSize: 'clamp(52px, 5vw, 72px)', letterSpacing: '-0.03em' }}
            >
              Master
            </h1>
            <motion.div
              className="h-[4px] bg-flame rounded mt-1 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.4 }}
              style={{ width: '60%' }}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <h1
              className="font-syne font-extrabold text-ink text-center inline leading-[1.05]"
              style={{ fontSize: 'clamp(52px, 5vw, 72px)', letterSpacing: '-0.03em' }}
            >
              System Design
            </h1>
            <motion.span
              className="font-syne font-extrabold text-flame inline"
              style={{ fontSize: 'clamp(52px, 5vw, 72px)', letterSpacing: '-0.03em' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.15 }}
            >
              .
            </motion.span>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center mt-1">
            <span
              className="font-dm-sans font-light text-ink-muted"
              style={{ fontSize: 'clamp(22px, 2.5vw, 26px)' }}
            >
              Through{' '}
            </span>
            <motion.span
              className="font-syne font-extrabold text-flame inline-block"
              style={{ fontSize: 'clamp(22px, 2.5vw, 26px)' }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24, delay: 0.2 }}
            >
              Play.
            </motion.span>
          </motion.div>
        </motion.div>
      </section>

      {/* Desktop: three-column grid */}
      <div className="hidden md:grid grid-cols-[164px_1fr_164px] gap-4 px-4 flex-1 overflow-hidden pb-2">
        {/* Left column */}
        <motion.div
          className="flex flex-col gap-[10px]"
          initial="initial"
          animate="animate"
          variants={staggerCards}
        >
          <motion.div variants={cardFromLeft} className="bg-surface border rounded-[14px] p-3 flex flex-col gap-2">
            <span className="text-[9px] font-dm-sans font-medium uppercase tracking-wider text-ink-muted">CONCEPTS</span>
            <div className="flex items-baseline gap-1">
              <span className="font-syne font-extrabold text-[34px] text-ink leading-none">{TOTAL_CONCEPTS}</span>
              <span className="font-dm-sans text-[11px] text-ink-muted">topics</span>
            </div>
            <div className="w-full h-[5px] rounded-full bg-surface-raised overflow-hidden">
              <div className="h-full rounded-full bg-flame" style={{ width: `${progressPct}%` }} />
            </div>
          </motion.div>

          <motion.div variants={cardFromLeft} className="bg-ink rounded-[14px] p-3 flex flex-col gap-1.5 flex-1">
            <span className="text-[9px] font-dm-sans font-medium uppercase tracking-wider text-ink-muted">XP SYSTEM</span>
            <div className="flex items-baseline gap-1">
              <span className="font-syne font-extrabold text-[34px] text-xp-gold leading-none">∞</span>
              <span className="font-dm-sans text-[10px] text-ink-muted">to earn</span>
            </div>
            <span className="font-dm-sans text-[8px] text-ink-muted/60">Apprentice → Principal</span>
          </motion.div>

          <motion.div variants={cardFromLeft} className="bg-volt rounded-[14px] p-3 flex flex-col gap-1">
            <span className="text-[9px] font-dm-sans font-medium uppercase tracking-wider text-[#5A6600]">GAMIFIED</span>
            <span className="font-syne font-extrabold text-[15px] text-ink leading-tight">Quiz. XP. Rank.</span>
          </motion.div>

          <motion.div
            variants={cardFromLeft}
            className="rounded-[14px] p-3 flex flex-col items-center justify-center"
            style={{ border: '1.5px dashed #E0DDD6' }}
          >
            <Link href="#" className="text-center">
              <p className="font-dm-sans text-[10px] text-ink">⭐ Contribute</p>
              <p className="font-dm-sans text-[10px] text-flame">on GitHub</p>
            </Link>
          </motion.div>
        </motion.div>

        {/* Center: canvas */}
        <motion.div
          className="flex flex-col bg-surface border rounded-[16px] p-3"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.3 }}
        >
          <div
            className="flex-1 bg-[#0F0F0F] rounded-[10px] p-3 relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(200,255,0,0.06) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-volt rounded-t-[10px]" />
            <PlaygroundCanvas />
          </div>
          <p className="text-center text-[10px] italic text-ink-muted font-dm-sans mt-[10px]">
            Drag the colored port dots to connect services
          </p>
        </motion.div>

        {/* Right column */}
        <motion.div
          className="flex flex-col gap-[10px]"
          initial="initial"
          animate="animate"
          variants={staggerCards}
        >
          <motion.div variants={cardFromRight} className="bg-flame rounded-[14px] p-3 flex flex-col gap-1.5">
            <span className="text-[9px] font-dm-sans font-medium uppercase tracking-wider text-[#FF9070]">YOUR LEVEL</span>
            <span className="font-syne font-extrabold text-[20px] text-white leading-none">{level}</span>
            <span className="font-dm-sans text-[9px] text-[#FF9070]">
              {totalXP} / {milestone?.nextXP ?? totalXP} XP to {milestone?.nextLevel ?? level}
            </span>
          </motion.div>

          <motion.div variants={cardFromRight} className="bg-surface border rounded-[14px] p-3 flex flex-col gap-1.5 flex-1">
            <span className="text-[9px] font-dm-sans font-medium uppercase tracking-wider text-ink-muted">HOW IT WORKS</span>
            <div className="flex flex-col gap-0.5" style={{ lineHeight: '1.8' }}>
              <p className="font-dm-sans text-[10px] text-ink">① Drag & connect nodes</p>
              <p className="font-dm-sans text-[10px] text-ink">② Learn each concept</p>
              <p className="font-dm-sans text-[10px] text-ink">③ Earn XP & level up</p>
            </div>
          </motion.div>

          <motion.div variants={cardFromRight} className="bg-ink rounded-[14px] p-3 flex flex-col gap-0.5">
            <span className="text-[9px] font-dm-sans font-medium uppercase tracking-wider text-ink-muted">GUIDE</span>
            <span className="font-syne font-extrabold text-[16px] text-white">Archi</span>
            <span className="font-dm-sans text-[9px] text-ink-muted">Your mascot guide</span>
          </motion.div>

          <motion.div
            variants={cardFromRight}
            className="bg-volt rounded-[14px] p-3"
            whileHover={{ scale: 1.03 }}
            transition={spring}
          >
            <Link
              href="/concepts"
              className="flex flex-col items-center justify-center gap-0.5"
            >
              <span className="font-syne font-extrabold text-[14px] text-ink">Start Learning</span>
              <span className="font-syne font-extrabold text-[14px] text-ink">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile: canvas only */}
      <div className="md:hidden flex-1 px-4 pb-2">
        <motion.div
          className="flex flex-col bg-surface border rounded-[16px] p-3 h-full"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.3 }}
        >
          <div
            className="flex-1 bg-[#0F0F0F] rounded-[10px] p-3 relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(200,255,0,0.06) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-volt rounded-t-[10px]" />
            <PlaygroundCanvas />
          </div>
          <p className="text-center text-[10px] italic text-ink-muted font-dm-sans mt-[10px]">
            Drag the colored port dots to connect services
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="shrink-0 mx-4 mb-4 bg-surface border rounded-[12px] h-11 px-5 flex items-center justify-between"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.9 }}
      >
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-surface-raised text-[9px] font-dm-sans text-ink-muted">12 Concepts</span>
          <span className="px-3 py-1 rounded-full bg-surface-raised text-[9px] font-dm-sans text-ink-muted hidden sm:inline-block">5 Levels of XP</span>
          <span className="px-3 py-1 rounded-full bg-surface-raised text-[9px] font-dm-sans text-ink-muted hidden sm:inline-block">1 Mascot Guide</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-dm-sans text-[9px] text-ink-muted">Built in public ·</span>
          <Link href="#" className="font-dm-sans text-[9px] text-flame">⭐ Contribute on GitHub</Link>
        </div>
      </motion.div>

      <Archi />
    </main>
  )
}
