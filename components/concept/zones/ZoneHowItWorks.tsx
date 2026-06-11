'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Concept } from '@/data/concepts'

interface Props {
  concept: Concept
  onComplete: () => void
  onNext: () => void
}

const STEPS = [
  {
    id: 0,
    title: 'TCP Handshake',
    subtitle: 'Before anything else, a raw connection is established.',
    body: 'Three packets travel between client and server — SYN, SYN-ACK, ACK. This is pure TCP. Nothing WebSocket-specific yet. Just two machines agreeing to talk.',
    tag: 'FOUNDATION',
  },
  {
    id: 1,
    title: 'TLS Encryption',
    subtitle: 'The channel is secured before any data flows.',
    body: 'Because you use wss:// the connection is encrypted. A TLS handshake adds 30-200ms — but only once. Every message after this is encrypted automatically.',
    tag: 'SECURITY',
  },
  {
    id: 2,
    title: 'HTTP Upgrade Request',
    subtitle: 'WebSocket disguises itself as HTTP to get past firewalls.',
    body: 'The client sends a normal HTTP GET with two special headers: Upgrade: websocket and Connection: Upgrade. Firewalls see HTTP on port 443. They let it through.',
    tag: 'THE TRICK',
  },
  {
    id: 3,
    title: '101 Switching Protocols',
    subtitle: 'The server agrees. This is the last HTTP message ever.',
    body: 'Server responds with HTTP 101. After this single response, the HTTP protocol is completely gone from this socket. Both sides switch to WebSocket framing.',
    tag: 'THE SWITCH',
  },
  {
    id: 4,
    title: 'HTTP Dies',
    subtitle: 'No more headers. No more request-response.',
    body: 'The HTTP layer disappears permanently. What remains is a raw TCP socket speaking WebSocket frames — 2 to 14 bytes of overhead instead of 800.',
    tag: 'THE DEATH',
  },
  {
    id: 5,
    title: 'Tunnel Opens',
    subtitle: 'The persistent connection is now live.',
    body: 'A full-duplex channel exists between client and server. It will stay open until someone explicitly closes it or a network failure occurs. The server can now speak first.',
    tag: 'ALIVE',
  },
  {
    id: 6,
    title: 'Free Flow',
    subtitle: 'Both sides talk whenever they want.',
    body: 'Messages travel in both directions simultaneously without permission. Comments, typing indicators, notifications — all pushed instantly. This is what you came for.',
    tag: 'REAL-TIME',
  },
]

export default function ZoneHowItWorks({ concept, onComplete, onNext }: Props) {
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      setCompleted(true)
      onComplete()
    }
  }

  const goPrev = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const current = STEPS[step]

  return (
    <div
      style={{
        height: 'calc(100dvh - 52px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 52,
        background: '#FFFBF7',
      }}
    >
      {/* TOP BAR — zone label + step counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(10px,1.5vw,16px) clamp(16px,3vw,40px)',
          borderBottom: '0.5px solid rgba(0,0,0,0.06)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 13,
            fontWeight: 700,
            color: '#1C1917',
          }}>
            How It Works
          </span>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '3px 9px',
            borderRadius: 20,
            background: concept.color.bg,
            border: `0.5px solid ${concept.color.border}`,
            color: concept.color.accent,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {current.tag}
          </span>
        </div>

        {/* Step counter + progress dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                style={{
                  width: i === step ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i <= step
                    ? concept.color.accent
                    : 'rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <span style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: 11,
            color: '#A8A29E',
          }}>
            {step + 1} / {STEPS.length}
          </span>
        </div>
      </div>

      {/* ANIMATION CANVAS — flex:1, fills most of screen */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          overflow: 'hidden',
          background: concept.color.bg + '30',
        }}
      >
        {/* CANVAS PLACEHOLDER — replaced in next prompt */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 'clamp(48px,8vw,96px)',
            fontWeight: 800,
            color: `${concept.color.accent}08`,
            userSelect: 'none',
          }}>
            STEP {step + 1}
          </span>
        </div>
      </div>

      {/* BOTTOM PANEL — step text + navigation */}
      <div
        style={{
          flexShrink: 0,
          borderTop: '0.5px solid rgba(0,0,0,0.06)',
          padding: 'clamp(14px,2vw,22px) clamp(16px,3vw,40px)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 20,
          alignItems: 'center',
          background: '#FFFBF7',
        }}
        className="lg:grid-cols-[1fr_auto] grid-cols-1"
      >
        {/* Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div style={{
              fontFamily: 'var(--font-syne)',
              fontSize: 'clamp(16px,2vw,22px)',
              fontWeight: 700,
              color: '#1C1917',
              marginBottom: 6,
              lineHeight: 1.1,
            }}>
              {current.title}
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 'clamp(11px,1.1vw,13px)',
              fontWeight: 500,
              color: concept.color.accent,
              marginBottom: 4,
            }}>
              {current.subtitle}
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 'clamp(11px,1vw,13px)',
              fontWeight: 300,
              color: '#78716C',
              lineHeight: 1.6,
              maxWidth: 560,
            }}>
              {current.body}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}>
          <button
            onClick={goPrev}
            disabled={step === 0}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.1)',
              background: step === 0 ? '#F5F3EE' : '#FFFBF7',
              color: step === 0 ? '#A8A29E' : '#1C1917',
              fontSize: 16,
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            ←
          </button>

          <motion.button
            onClick={goNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              height: 42,
              paddingLeft: 20,
              paddingRight: 16,
              borderRadius: 10,
              border: 'none',
              background: step === STEPS.length - 1
                ? concept.color.accent
                : '#1C1917',
              color: '#FFFBF7',
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {step === STEPS.length - 1 ? 'Complete ✓' : 'Next'}
            {step < STEPS.length - 1 && (
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: concept.color.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}>→</div>
            )}
          </motion.button>

          {completed && step === STEPS.length - 1 && (
            <motion.button
              onClick={onNext}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                height: 42,
                padding: '0 16px',
                borderRadius: 10,
                border: `1px solid ${concept.color.border}`,
                background: concept.color.bg,
                color: concept.color.accent,
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Zone 3 →
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
