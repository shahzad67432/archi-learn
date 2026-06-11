'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Concept } from '@/data/concepts'
import ZoneHookDiagram from '@/components/concept/scenes/ZoneHookDiagram'
import ZoneHookPanels from '@/components/concept/scenes/ZoneHookPanels'

interface Props {
  concept: Concept
  onComplete: () => void
  onNext: () => void
}

export default function ZoneHook({ concept, onComplete, onNext }: Props) {
  const [showRightPanel, setShowRightPanel] = useState(false)

  const rightColumnContent = (
    <>
      {/* Real-Time Layer — isometric 2D architectural diagram */}
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
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#C4B5FD',
            marginBottom: 6,
            display: 'block',
          }}
        >
          The Real-Time Layer
        </span>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            position: 'relative',
          }}
        >
          <ZoneHookDiagram accentColor={concept.color.accent} />
        </div>
      </motion.div>

      {/* Bottom panels grid */}
      <motion.div
        className="grid grid-cols-2 min-h-0 pb-6 pl-7"
        style={{ flex: 3, gap: 'clamp(6px, 1vw, 10px)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <ZoneHookPanels accentColor={concept.color.accent} />
      </motion.div>
    </>
  )

  return (
    <div
      style={{
        height: '100dvh',
        overflow: 'hidden',
        display: 'grid',
        paddingTop: '52px',
      }}
      className="lg:grid-cols-[1fr_1fr] grid-cols-1"
    >
      {/* LEFT COLUMN */}
      <div
        className="flex flex-col min-h-0 overflow-y-auto lg:overflow-hidden
                   [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                   px-[clamp(16px,2.5vw,28px)]
                   py-[clamp(12px,3vw,40px)]
                   lg:border-b-0
                   border-b border-r-0"
      >
        {/* Scrollable top section */}
        <div className="lg:flex-1 min-h-0 lg:mb-0 pb-38">
        <div className="flex flex-col gap-[clamp(8px,1.2vw,14px)]">

          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <span
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: concept.color.accent,
                textTransform: 'uppercase',
              }}
            >
              {String(concept.number).padStart(2, '0')}
              &nbsp;/&nbsp;
              {concept.title}
            </span>
            <div
              style={{
                flex: 1,
                height: '0.5px',
                background: concept.color.accent,
                opacity: 0.25,
                maxWidth: 60,
              }}
            />
          </motion.div>

          {/* Title — split on space or camelCase */}
          <motion.h1
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(38px, 6.5vw, 72px)',
              lineHeight: 0.88,
              letterSpacing: '-0.03em',
              color: '#1C1917',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {(() => {
              const parts = concept.title.includes(' ')
                ? concept.title.split(' ')
                : concept.title.split(/(?<=[a-z])(?=[A-Z])/);
              return parts.map((word, i) => (
                <span key={i} style={{ display: 'block' }}>
                  {word}
                  <span style={{ color: concept.color.accent }}>.</span>
                </span>
              ));
            })()}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 'clamp(12px, 1.2vw, 14px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#78716C',
              letterSpacing: '0.01em',
              lineHeight: 1.5,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {concept.tagline}
          </motion.p>

          {/* Hairline divider */}
          <div style={{ height: '0.5px', background: 'rgba(0,0,0,0.08)' }} />

          {/* Drop cap paragraph */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: 'clamp(12px, 1.15vw, 13.5px)',
              lineHeight: 1.72,
              color: '#57534E',
              fontWeight: 400,
            }}
          >
            <span
              style={{
                float: 'left',
                fontFamily: 'var(--font-syne)',
                fontSize: 'clamp(42px, 5.5vw, 56px)',
                fontWeight: 800,
                lineHeight: 0.78,
                color: concept.color.accent,
                marginRight: 4,
                marginTop: 4,
              }}
            >
              H
            </span>
            TTP spoils you. A request comes in, a response goes out,
            the connection closes. Clean. Automatic. You never think
            about it. WebSocket is a tunnel that stays open —
            indefinitely. Both sides talk whenever they want, without
            asking permission first.
          </motion.div>

          {/* Properties list */}
          <motion.div
            className="flex flex-col"
            style={{ gap: 'clamp(6px, 1vw, 10px)' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {[
              {
                label: 'Full-duplex communication',
                sub: 'Both sides send simultaneously — like a phone call, not walkie-talkies',
              },
              {
                label: 'Single TCP connection',
                sub: 'One handshake, then the tunnel stays open for the entire session',
              },
              {
                label: '2–14 bytes overhead per message',
                sub: 'HTTP sends 200–800 bytes of headers every single time',
              },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: concept.color.accent,
                    marginTop: 5,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <span
                    style={{
                      fontSize: 'clamp(11px, 1vw, 12.5px)',
                      fontWeight: 500,
                      color: '#1C1917',
                      lineHeight: 1.4,
                      display: 'block',
                    }}
                  >
                    {p.label}
                  </span>
                  <span
                    style={{
                      fontSize: 'clamp(10px, 0.9vw, 11.5px)',
                      fontWeight: 300,
                      color: '#A8A29E',
                      display: 'block',
                    }}
                  >
                    {p.sub}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
          </div>

        <motion.div
            className="flex-shrink-0 flex flex-col pb-[clamp(8px,1.5vw,16px)]"
          style={{
              borderTop: '0.5px solid rgba(0,0,0,0.07)',
              paddingTop: 'clamp(28px, 5vw, 48px)',
              gap: 5,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          {/* Tags — desktop only */}
          <div className="hidden lg:flex flex-wrap gap-[6px]">
            {concept.tags.map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: 4,
                  background: concept.color.bg,
                  border: `0.5px solid ${concept.color.border}`,
                  color: concept.color.accent,
                  letterSpacing: '0.04em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Difficulty + XP + CTA row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="hidden lg:inline"
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '4px 11px',
                borderRadius: 20,
                background: concept.difficulty === 'Beginner'
                  ? '#DCFCE7'
                  : concept.difficulty === 'Intermediate'
                  ? '#FFF7ED'
                  : '#F3F0FF',
                border: `0.5px solid ${concept.color.border}`,
                color: concept.color.accent,
              }}
            >
              {concept.difficulty}
            </span>
            <span
              className="hidden lg:inline"
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 10,
                fontWeight: 700,
                padding: '4px 11px',
                borderRadius: 20,
                background: '#1C1917',
                color: '#ADFA1D',
              }}
            >
              +{concept.xpReward} XP
            </span>

            {/* Start Learning button */}
            <motion.button
              onClick={() => { onComplete(); onNext(); }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center lg:justify-start gap-2 w-full lg:w-auto lg:ml-auto"
              style={{
                background: '#1C1917',
                color: '#FFFBF7',
                border: 'none',
                borderRadius: 10,
                padding: 'clamp(10px,1.2vw,12px) clamp(14px,2vw,22px)',
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 'clamp(12px, 1.1vw, 14px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Start Learning
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: concept.color.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: 'white',
                }}
              >
                →
              </div>
            </motion.button>
          </div>

          {/* Hint text — desktop only */}
          <span className="hidden lg:block" style={{ fontSize: 11, color: '#A8A29E', fontWeight: 300 }}>
            Complete all 5 modules to earn +{concept.xpReward} XP
          </span>

          {/* View Diagrams — mobile only */}
          <motion.button
            onClick={() => setShowRightPanel(true)}
            className="lg:hidden w-full"
            style={{
              background: concept.color.bg,
              border: `0.5px solid ${concept.color.border}`,
              borderRadius: 8,
              padding: 'clamp(10px, 1.5vw, 12px) 14px',
              fontFamily: 'var(--font-syne)',
              fontWeight: 600,
              fontSize: 12,
              color: concept.color.accent,
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
            whileTap={{ scale: 0.98 }}
          >
            View Diagrams
            <span style={{ fontSize: 14 }}>→</span>
          </motion.button>
        </motion.div>
      </div>

      {/* RIGHT COLUMN — desktop only */}
      <div
        className="hidden lg:flex flex-col min-h-0"
        style={{
          gap: 'clamp(10px, 1.5vw, 14px)',
          padding: 'clamp(16px, 3vw, 36px) clamp(16px, 2.5vw, 24px)',
          overflow: 'hidden',
        }}
      >
        {rightColumnContent}
      </div>

      {/* MOBILE OVERLAY for right column SVGs */}
      {showRightPanel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 lg:hidden"
          style={{ background: '#FFFBF7' }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}
          >
            <button
              onClick={() => setShowRightPanel(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                borderRadius: 8,
                color: '#78716C',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ← Back
            </button>
          </div>
          {/* Scrollable content */}
          <div
            className="flex flex-col overflow-y-auto"
            style={{
              height: 'calc(100dvh - 48px)',
              padding: 'clamp(12px, 3vw, 20px)',
              gap: 'clamp(10px, 1.5vw, 14px)',
            }}
          >
            {rightColumnContent}
            {/* Back to text — inside overlay, bottom */}
            <motion.button
              onClick={() => setShowRightPanel(false)}
              className="w-full mt-3"
              style={{
                background: '#1C1917',
                color: '#FFFBF7',
                border: 'none',
                borderRadius: 10,
                padding: '12px 14px',
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
              whileTap={{ scale: 0.98 }}
            >
              ← Back to text
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
