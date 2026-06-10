'use client'

import { motion } from 'framer-motion'
import type { Concept } from '@/data/concepts'

export default function ZoneHook({
  concept,
  onComplete,
  onNext,
}: {
  concept: Concept
  onComplete: () => void
  onNext: () => void
}) {
  const c = concept.color

  const handleStart = () => {
    onComplete()
    onNext()
  }

  return (
    <div
      className="lg:grid-cols-[1fr_1fr]"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        height: '100vh',
        padding: 'clamp(24px, 4vw, 56px)',
        paddingTop: 'calc(52px + clamp(24px, 4vw, 56px))',
        background: `${c.bg}35`,
        gap: 'clamp(16px, 3vw, 40px)',
        overflow: 'hidden',
      }}
    >
      {/* ── LEFT COLUMN ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          minHeight: 0,
        }}
      >
        <div>
          {/* Concept number */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
            className="font-syne"
            style={{
              fontWeight: 800,
              fontSize: 'clamp(11px, 1vw, 13px)',
              color: c.accent,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {String(concept.number).padStart(2, '0')}
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="font-syne"
            style={{
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 64px)',
              color: '#1C1917',
              lineHeight: 0.95,
              marginTop: 8,
              margin: 0,
            }}
          >
            {concept.title}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
            className="font-dm-sans"
            style={{
              fontSize: 'clamp(14px, 1.4vw, 18px)',
              color: '#78716C',
              marginTop: 12,
              lineHeight: 1.5,
              margin: 0,
              marginBlock: '12px 0',
            }}
          >
            {concept.tagline}
          </motion.p>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}
          >
            {concept.tags.map(tag => (
              <span
                key={tag}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  border: `1px solid ${c.border}`,
                  borderRadius: 6,
                  padding: '3px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: c.accent,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Problem card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.25 }}
            style={{
              marginTop: 24,
              background: '#fff',
              border: `1px solid ${c.border}`,
              borderRadius: 14,
              padding: 'clamp(16px, 2vw, 24px)',
            }}
          >
            <div
              className="font-syne"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: c.accent,
                marginBottom: 10,
              }}
            >
              THE PROBLEM
            </div>
            <p
              className="font-dm-sans"
              style={{
                fontSize: 'clamp(13px, 1.2vw, 15px)',
                color: '#44403C',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {concept.problem ?? 'How this concept solves a real engineering challenge.'}
            </p>
          </motion.div>
        </div>

        {/* Bottom block */}
        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.35 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full lg:w-auto"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: '#1C1917',
              color: '#FFFBF7',
              border: 'none',
              borderRadius: 12,
              padding: 'clamp(12px, 1.5vw, 16px) clamp(20px, 2.5vw, 32px)',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(14px, 1.3vw, 16px)',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Start Learning
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: c.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 14,
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              →
            </span>
          </motion.button>

          <div
            className="font-dm-sans"
            style={{
              marginTop: 12,
              fontSize: 11,
              color: '#A8A29E',
              textAlign: 'center',
            }}
          >
            Complete all 5 modules to earn +{concept.xpReward} XP
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN — HTTP vs WebSocket diagram ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
        className="-order-1 lg:order-none"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '40vw',
          minHeight: 200,
          maxHeight: '100%',
        }}
      >
        <div
          style={{
            background: '#fff',
            border: `1px solid ${c.border}`,
            borderRadius: 16,
            padding: 'clamp(20px, 2.5vw, 32px)',
            width: '100%',
            height: '100%',
            maxHeight: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            overflow: 'hidden',
          }}
        >
          {/* ── Panel 1: HTTP Polling ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span
                className="font-syne"
                style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#EF4444' }}
              >
                HTTP POLLING
              </span>
              <span
                style={{
                  background: '#FFF1F2',
                  color: '#BE123C',
                  border: '1px solid #FDA4AF',
                  borderRadius: 20,
                  padding: '2px 10px',
                  fontSize: 10,
                }}
              >
                ❌ Wasteful
              </span>
            </div>
            <svg viewBox="0 0 400 100" style={{ width: '100%', height: 100 }}>
              {/* CLIENT box */}
              <rect x="10" y="30" width="70" height="40" rx="8" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="1"/>
              <text x="45" y="55" textAnchor="middle" fontSize="11" fill="#BE123C" fontFamily="sans-serif" fontWeight="600">CLIENT</text>

              {/* SERVER box */}
              <rect x="320" y="30" width="70" height="40" rx="8" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="1"/>
              <text x="355" y="55" textAnchor="middle" fontSize="11" fill="#BE123C" fontFamily="sans-serif" fontWeight="600">SERVER</text>

              {/* Arrow 1 — request */}
              <line x1="80" y1="25" x2="315" y2="25" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,3"/>
              <polygon points="315,21 325,25 315,29" fill="#EF4444"/>
              <text x="200" y="20" textAnchor="middle" fontSize="9" fill="#EF4444" fontFamily="sans-serif">GET /updates?</text>

              {/* Arrow 1 — response */}
              <line x1="315" y1="38" x2="80" y2="38" stroke="#A8A29E" strokeWidth="1" strokeDasharray="4,3"/>
              <polygon points="80,34 70,38 80,42" fill="#A8A29E"/>
              <text x="200" y="36" textAnchor="middle" fontSize="9" fill="#A8A29E" fontFamily="sans-serif">204 No Content</text>

              {/* Arrow 2 — request */}
              <line x1="80" y1="58" x2="315" y2="58" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,3"/>
              <polygon points="315,54 325,58 315,62" fill="#EF4444"/>
              <text x="200" y="53" textAnchor="middle" fontSize="9" fill="#EF4444" fontFamily="sans-serif">GET /updates?</text>

              {/* Arrow 2 — response */}
              <line x1="315" y1="71" x2="80" y2="71" stroke="#A8A29E" strokeWidth="1" strokeDasharray="4,3"/>
              <polygon points="80,67 70,71 80,75" fill="#A8A29E"/>
              <text x="200" y="69" textAnchor="middle" fontSize="9" fill="#A8A29E" fontFamily="sans-serif">204 No Content</text>

              {/* Arrow 3 — request (partial) */}
              <line x1="80" y1="88" x2="200" y2="88" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,3"/>
              <polygon points="200,84 210,88 200,92" fill="#EF4444"/>
              <text x="140" y="84" textAnchor="middle" fontSize="9" fill="#EF4444" fontFamily="sans-serif">GET /updates?</text>

              {/* Waste label */}
              <text x="320" y="80" fontSize="9" fill="#EF4444" fontFamily="sans-serif" fontStyle="italic">99% empty</text>
            </svg>
          </div>

          {/* ── Panel 2: WebSocket ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span
                className="font-syne"
                style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: c.accent }}
              >
                WEBSOCKET
              </span>
              <span
                style={{
                  background: c.bg,
                  color: c.accent,
                  border: `1px solid ${c.border}`,
                  borderRadius: 20,
                  padding: '2px 10px',
                  fontSize: 10,
                }}
              >
                ✓ Efficient
              </span>
            </div>
            <svg viewBox="0 0 400 120" style={{ width: '100%', height: 100 }}>
              {/* CLIENT box */}
              <rect x="10" y="40" width="70" height="40" rx="8" fill={c.bg} stroke={c.border} strokeWidth="1"/>
              <text x="45" y="65" textAnchor="middle" fontSize="11" fill={c.accent} fontFamily="sans-serif" fontWeight="600">CLIENT</text>

              {/* SERVER box */}
              <rect x="320" y="40" width="70" height="40" rx="8" fill={c.bg} stroke={c.border} strokeWidth="1"/>
              <text x="355" y="65" textAnchor="middle" fontSize="11" fill={c.accent} fontFamily="sans-serif" fontWeight="600">SERVER</text>

              {/* Persistent tunnel line (animates) */}
              <motion.line
                x1="80" y1="60" x2="320" y2="60"
                stroke={c.accent} strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              />
              <text x="200" y="52" textAnchor="middle" fontSize="10" fill={c.accent} fontFamily="sans-serif" fontWeight="600">persistent tunnel — stays open</text>

              {/* Bidirectional arrows (fade in after line) */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
              >
                {/* Right-going message */}
                <line x1="85" y1="78" x2="200" y2="78" stroke={c.accent} strokeWidth="1.5"/>
                <polygon points="200,74 210,78 200,82" fill={c.accent}/>
                <text x="142" y="74" textAnchor="middle" fontSize="10" fill={c.accent} fontFamily="sans-serif">comment →</text>

                {/* Left-going message */}
                <line x1="315" y1="95" x2="200" y2="95" stroke={c.accent} strokeWidth="1.5"/>
                <polygon points="200,91 190,95 200,99" fill={c.accent}/>
                <text x="258" y="92" textAnchor="middle" fontSize="10" fill={c.accent} fontFamily="sans-serif">← new post</text>
              </motion.g>

              {/* Efficiency label */}
              <text x="320" y="115" fontSize="9" fill={c.accent} fontFamily="sans-serif" fontStyle="italic">real-time ✓</text>
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
