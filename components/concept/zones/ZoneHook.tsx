'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Concept } from '@/data/concepts'

interface Props {
  concept: Concept
  onComplete: () => void
  onNext: () => void
}

export default function ZoneHook({ concept, onComplete, onNext }: Props) {
  const [showRightPanel, setShowRightPanel] = useState(false)

  const rightColumnContent = (
    <>
      {/* Main tunnel card */}
      <motion.div
        className="flex flex-col min-h-0"
        style={{
          flex: 5,
          background: concept.color.bg,
          border: `0.5px solid ${concept.color.border}`,
          borderRadius: 14,
          padding: 'clamp(14px, 2vw, 24px)',
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
            color: concept.color.accent,
            marginBottom: 8,
            display: 'block',
          }}
        >
          The WebSocket tunnel
        </span>

        {/* SVG tunnel diagram */}
        <svg
          style={{ flex: 1, width: '100%', minHeight: 0 }}
          viewBox="0 0 340 140"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="ag" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none"
                stroke={concept.color.accent}
                stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round"/>
            </marker>
            <marker id="am" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none"
                stroke="#A8A29E" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
            </marker>
          </defs>

          {/* HTTP upgrade label */}
          <text x="170" y="18" textAnchor="middle"
            fontFamily="var(--font-dm-sans)" fontSize="9"
            fill="#A8A29E" fontStyle="italic">
            HTTP 101 upgrade — happens once, then HTTP is gone
          </text>
          <line x1="60" y1="26" x2="280" y2="26"
            stroke="#A8A29E" strokeWidth="0.7"
            strokeDasharray="3,2" markerEnd="url(#am)"/>

          {/* CLIENT box */}
          <rect x="10" y="52" width="72" height="42" rx="8"
            fill="white" stroke={concept.color.border}
            strokeWidth="1"/>
          <text x="46" y="70" textAnchor="middle"
            fontFamily="var(--font-syne)" fontSize="11"
            fontWeight="700" fill={concept.color.accent}>
            CLIENT
          </text>
          <text x="46" y="84" textAnchor="middle"
            fontFamily="var(--font-dm-sans)" fontSize="9"
            fill="#A8A29E">
            browser
          </text>

          {/* SERVER box */}
          <rect x="258" y="52" width="72" height="42" rx="8"
            fill="white" stroke={concept.color.border}
            strokeWidth="1"/>
          <text x="294" y="70" textAnchor="middle"
            fontFamily="var(--font-syne)" fontSize="11"
            fontWeight="700" fill={concept.color.accent}>
            SERVER
          </text>
          <text x="294" y="84" textAnchor="middle"
            fontFamily="var(--font-dm-sans)" fontSize="9"
            fill="#A8A29E">
            backend
          </text>

          {/* Persistent tunnel pipe */}
          <rect x="82" y="62" width="176" height="22" rx="11"
            fill={concept.color.bg}
            stroke={concept.color.accent} strokeWidth="1.5"/>
          <text x="170" y="77" textAnchor="middle"
            fontFamily="var(--font-dm-sans)" fontSize="9"
            fontWeight="600" fill={concept.color.accent}>
            persistent tunnel — stays open
          </text>

          {/* Bidirectional arrows */}
          <line x1="86" y1="105" x2="200" y2="105"
            stroke={concept.color.accent} strokeWidth="1.5"
            markerEnd="url(#ag)"/>
          <text x="143" y="100" textAnchor="middle"
            fontFamily="var(--font-dm-sans)" fontSize="9"
            fill={concept.color.accent}>
            comment sent →
          </text>

          <line x1="254" y1="120" x2="140" y2="120"
            stroke={concept.color.accent} strokeWidth="1.5"
            markerEnd="url(#ag)"/>
          <text x="197" y="133" textAnchor="middle"
            fontFamily="var(--font-dm-sans)" fontSize="9"
            fill={concept.color.accent}>
            ← new post pushed
          </text>

          {/* Caption */}
          <text x="72" y="132"
            fontFamily="var(--font-dm-sans)" fontSize="8.5"
            fill="#A8A29E" fontStyle="italic">
            simultaneously — no asking permission
          </text>
        </svg>

        <span
          style={{
            fontSize: 10,
            color: '#A8A29E',
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: 6,
            fontWeight: 300,
            display: 'block',
          }}
        >
          Both sides speak freely — server pushes without being asked
        </span>
      </motion.div>

      {/* Bottom panels grid */}
      <motion.div
        className="grid grid-cols-2 min-h-0"
        style={{ flex: 4, gap: 'clamp(8px, 1.2vw, 12px)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {/* Panel A — HTTP polling problem */}
        <div
          style={{
            background: 'var(--color-background-secondary)',
            borderRadius: 10,
            padding: 'clamp(8px, 1.2vw, 12px)',
            border: '0.5px solid var(--color-border-tertiary)',
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
              color: '#DC2626',
              marginBottom: 5,
              display: 'block',
            }}
          >
            HTTP polling — the problem
          </span>
          <svg
            style={{ flex: 1, width: '100%', minHeight: 0 }}
            viewBox="0 0 148 88"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="5" markerHeight="5"
                orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="#DC2626"
                  strokeWidth="1.8" strokeLinecap="round"
                  strokeLinejoin="round"/>
              </marker>
              <marker id="ag3" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="5" markerHeight="5"
                orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E"
                  strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
              </marker>
            </defs>
            <rect x="2" y="4" width="36" height="20" rx="4"
              fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="0.5"/>
            <text x="20" y="18" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="8"
              fill="#DC2626" fontWeight="600">client</text>
            <rect x="110" y="4" width="36" height="20" rx="4"
              fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="0.5"/>
            <text x="128" y="18" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="8"
              fill="#DC2626" fontWeight="600">server</text>

            <line x1="38" y1="11" x2="108" y2="11"
              stroke="#DC2626" strokeWidth="1"
              strokeDasharray="3,2" markerEnd="url(#ar)"/>
            <text x="73" y="9" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7.5"
              fill="#DC2626">ask?</text>
            <line x1="108" y1="20" x2="38" y2="20"
              stroke="#A8A29E" strokeWidth="0.8"
              strokeDasharray="3,2" markerEnd="url(#ag3)"/>
            <text x="73" y="30" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7.5"
              fill="#A8A29E">nothing.</text>

            <line x1="38" y1="40" x2="108" y2="40"
              stroke="#DC2626" strokeWidth="1"
              strokeDasharray="3,2" markerEnd="url(#ar)"/>
            <text x="73" y="38" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7.5"
              fill="#DC2626">ask again?</text>
            <line x1="108" y1="49" x2="38" y2="49"
              stroke="#A8A29E" strokeWidth="0.8"
              strokeDasharray="3,2" markerEnd="url(#ag3)"/>
            <text x="73" y="59" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7.5"
              fill="#A8A29E">nothing.</text>

            <line x1="38" y1="66" x2="108" y2="66"
              stroke="#DC2626" strokeWidth="1"
              strokeDasharray="3,2" markerEnd="url(#ar)"/>
            <text x="73" y="64" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7.5"
              fill="#DC2626">again?</text>

            <text x="74" y="82" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="8"
              fill="#DC2626" fontStyle="italic"
              fontWeight="500">
              99% of requests return empty
            </text>
          </svg>
        </div>

        {/* Panel B — Frame anatomy */}
        <div
          style={{
            background: 'var(--color-background-secondary)',
            borderRadius: 10,
            padding: 'clamp(8px, 1.2vw, 12px)',
            border: '0.5px solid var(--color-border-tertiary)',
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
              color: concept.color.accent,
              marginBottom: 5,
              display: 'block',
            }}
          >
            Frame anatomy
          </span>
          <svg
            style={{ flex: 1, width: '100%', minHeight: 0 }}
            viewBox="0 0 148 88"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Frame segments */}
            <rect x="4" y="8" width="18" height="20" rx="3"
              fill={concept.color.bg}
              stroke={concept.color.border} strokeWidth="0.5"/>
            <text x="13" y="21" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7.5"
              fill={concept.color.accent} fontWeight="600">op</text>
            <rect x="22" y="8" width="20" height="20" rx="3"
              fill={concept.color.bg}
              stroke={concept.color.border} strokeWidth="0.5"/>
            <text x="32" y="21" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7.5"
              fill={concept.color.accent} fontWeight="600">len</text>
            <rect x="42" y="8" width="102" height="20" rx="3"
              fill="white" stroke={concept.color.border}
              strokeWidth="0.5"/>
            <text x="93" y="21" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7.5"
              fill={concept.color.accent}>payload (your data)</text>

            {/* Callout lines */}
            <line x1="13" y1="28" x2="13" y2="38"
              stroke="#A8A29E" strokeWidth="0.5"
              strokeDasharray="2,1"/>
            <text x="13" y="45" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7"
              fill="#A8A29E">0x1=text</text>
            <text x="13" y="53" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7"
              fill="#A8A29E">0x9=ping</text>

            <line x1="93" y1="28" x2="93" y2="38"
              stroke="#A8A29E" strokeWidth="0.5"
              strokeDasharray="2,1"/>
            <text x="93" y="45" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7"
              fill="#A8A29E">your JSON string</text>

            {/* Overhead comparison */}
            <rect x="4" y="62" width="60" height="13" rx="3"
              fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="0.5"/>
            <text x="34" y="73" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7.5"
              fill="#DC2626">HTTP ≈ 800 bytes</text>
            <rect x="70" y="62" width="74" height="13" rx="3"
              fill={concept.color.bg}
              stroke={concept.color.border} strokeWidth="0.5"/>
            <text x="107" y="73" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7.5"
              fill={concept.color.accent}>WS ≈ 14 bytes ✓</text>

            <text x="74" y="86" textAnchor="middle"
              fontFamily="var(--font-dm-sans)" fontSize="7.5"
              fill="#A8A29E" fontStyle="italic">57× less per message</text>
          </svg>
        </div>
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
        style={{ borderRight: '0.5px solid rgba(22,163,74,0.15)' }}
        className="flex flex-col min-h-0 overflow-y-auto lg:overflow-hidden
                   [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                   px-[clamp(16px,2.5vw,28px)]
                   py-[clamp(12px,3vw,40px)]
                   lg:border-r lg:border-b-0
                   border-b border-r-0"
      >
        {/* Scrollable top section */}
        <div className="lg:flex-1 lg:overflow-y-auto min-h-0 lg:mb-0 pb-38">
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
