'use client'
import { useState, useEffect, useRef } from 'react'
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
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(16px,3vw,40px)',
            }}
          >
            {step === 0 && <StepTCPHandshake concept={concept} />}
            {step === 1 && <StepTLS concept={concept} />}
            {step === 2 && <StepHTTPUpgrade concept={concept} />}
            {step === 3 && <Step101Response concept={concept} />}
            {step === 4 && <StepHTTPDies concept={concept} />}
            {step === 5 && <StepTunnelOpens concept={concept} />}
            {step === 6 && <StepFreeFlow concept={concept} />}
          </motion.div>
        </AnimatePresence>
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

/* ── Shared SVG helpers ── */
function ClientBox({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <g>
      <rect x={40} y={80} width={90} height={50} rx={10} fill="white" stroke={concept.color.border} strokeWidth={1.5} />
      <text x={85} y={106} textAnchor="middle" fontFamily="var(--font-syne)" fontWeight={700} fontSize={11} fill={a}>CLIENT</text>
      <text x={85} y={120} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#A8A29E">browser</text>
    </g>
  )
}

function ServerBox({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <g>
      <rect x={430} y={80} width={90} height={50} rx={10} fill="white" stroke={concept.color.border} strokeWidth={1.5} />
      <text x={475} y={106} textAnchor="middle" fontFamily="var(--font-syne)" fontWeight={700} fontSize={11} fill={a}>SERVER</text>
      <text x={475} y={120} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#A8A29E">backend</text>
    </g>
  )
}

/* ── Step 0: TCP Handshake ── */
function StepTCPHandshake({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <svg viewBox="0 0 560 220" style={{ width:'100%', maxWidth:640, height:'100%', maxHeight:260 }}>
      <defs>
        <marker id="ag-0" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke={a} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id="am-0" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      <ClientBox concept={concept} />
      <ServerBox concept={concept} />
      <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0 }}>
        <line x1={132} y1={75} x2={428} y2={75} stroke="#F97316" strokeWidth={1.5} strokeDasharray="5,3" markerEnd="url(#ag-0)" />
        <text x={280} y={70} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#F97316" fontWeight={600}>SYN</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <line x1={428} y1={100} x2={132} y2={100} stroke={a} strokeWidth={1.5} strokeDasharray="5,3" markerEnd="url(#ag-0)" />
        <text x={280} y={95} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill={a} fontWeight={600}>SYN-ACK</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
        <line x1={132} y1={125} x2={428} y2={125} stroke="#F97316" strokeWidth={1.5} strokeDasharray="5,3" markerEnd="url(#ag-0)" />
        <text x={280} y={120} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#F97316" fontWeight={600}>ACK</text>
      </motion.g>
      <text x={280} y={170} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={11} fill="#A8A29E" fontStyle="italic">
        Raw TCP connection established — no encryption yet
      </text>
    </svg>
  )
}

/* ── Step 1: TLS Encryption ── */
function StepTLS({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <svg viewBox="0 0 560 220" style={{ width:'100%', maxWidth:640, height:'100%', maxHeight:260 }}>
      <defs>
        <marker id="ag-1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke={a} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id="am-1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      <ClientBox concept={concept} />
      <ServerBox concept={concept} />
      {/* Dashed unsecured line */}
      <motion.g initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
        <line x1={132} y1={105} x2={428} y2={105} stroke="#A8A29E" strokeWidth={1} strokeDasharray="6,4" />
        <text x={280} y={99} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#A8A29E" fontStyle="italic">unsecured</text>
      </motion.g>
      {/* Solid TLS secured line */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
        <line x1={132} y1={105} x2={428} y2={105} stroke={a} strokeWidth={2.5} />
        <text x={280} y={99} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill={a} fontWeight={600}>TLS secured</text>
      </motion.g>
      {/* Lock icon */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.4 }}
        style={{ originX: 260, originY: 82 }}
      >
        <circle cx={260} cy={82} r={10} fill={concept.color.bg} stroke={a} strokeWidth={1.5} />
        <rect x={253} y={85} width={14} height={10} rx={2} fill={a} />
      </motion.g>
      <text x={280} y={170} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={11} fill="#A8A29E" fontStyle="italic">
        wss:// encrypts everything — 1-2 extra round trips, once only
      </text>
    </svg>
  )
}

/* ── Step 2: HTTP Upgrade Request ── */
function StepHTTPUpgrade({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <svg viewBox="0 0 560 220" style={{ width:'100%', maxWidth:640, height:'100%', maxHeight:260 }}>
      <defs>
        <marker id="ag-2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke={a} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id="am-2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      <ClientBox concept={concept} />
      <ServerBox concept={concept} />
      {/* Packet traveling client → server */}
      <motion.g
        initial={{ x: 140, opacity: 0 }}
        animate={{ x: 290, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
      >
        <rect x={0} y={95} width={160} height={36} rx={8} fill="white" stroke="#A8A29E" strokeWidth={1} />
        <text x={80} y={110} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#44403C" fontWeight={500}>GET /ws/discussion/42 HTTP/1.1</text>
        <text x={80} y={121} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill={a} fontWeight={600}>Upgrade: websocket</text>
        <text x={80} y={130} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill={a} fontWeight={600}>Connection: Upgrade</text>
      </motion.g>
      <text x={280} y={170} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={11} fill="#A8A29E" fontStyle="italic">
        Disguised as HTTP — firewalls let it through
      </text>
    </svg>
  )
}

/* ── Step 3: 101 Switching Protocols ── */
function Step101Response({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <svg viewBox="0 0 560 220" style={{ width:'100%', maxWidth:640, height:'100%', maxHeight:260 }}>
      <defs>
        <marker id="ag-3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke={a} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id="am-3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      <ClientBox concept={concept} />
      <ServerBox concept={concept} />
      {/* Packet traveling server → client */}
      <motion.g
        initial={{ x: 290, opacity: 0 }}
        animate={{ x: 140, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
      >
        <rect x={0} y={95} width={150} height={36} rx={8} fill={concept.color.bg} stroke={concept.color.border} strokeWidth={1} />
        <text x={75} y={110} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill={a} fontWeight={600}>HTTP/1.1 101 Switching</text>
        <text x={75} y={121} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill={a} fontWeight={600}>Protocols</text>
        <text x={75} y={130} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#A8A29E">Upgrade: websocket</text>
      </motion.g>
      {/* Checkmark */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 1.4 }}
        style={{ originX: 85, originY: 70 }}
      >
        <circle cx={85} cy={70} r={14} fill={a} />
        <text x={85} y={76} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={14} fill="white" fontWeight={800}>✓</text>
      </motion.g>
      <text x={280} y={170} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={11} fill="#A8A29E" fontStyle="italic">
        Last HTTP message ever — the protocol dies here
      </text>
    </svg>
  )
}

/* ── Step 4: HTTP Dies ── */
function StepHTTPDies({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <svg viewBox="0 0 560 220" style={{ width:'100%', maxWidth:640, height:'100%', maxHeight:260 }}>
      <defs>
        <marker id="ag-4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke={a} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id="am-4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      <ClientBox concept={concept} />
      <ServerBox concept={concept} />
      {/* HTTP text fading */}
      <motion.text
        x={280} y={115} textAnchor="middle"
        fontFamily="var(--font-syne)" fontWeight={800}
        fontSize="clamp(32px,5vw,48px)" fill="#A8A29E"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        HTTP
      </motion.text>
      {/* Strikethrough line */}
      <motion.line
        x1={180} y1={115} x2={380} y2={115}
        stroke="#EF4444" strokeWidth={2.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      {/* GONE badge */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 1.1 }}
        style={{ originX: 280, originY: 140 }}
      >
        <rect x={240} y={128} width={80} height={24} rx={12} fill="#FFF1F2" stroke="#FDA4AF" strokeWidth={0.5} />
        <text x={280} y={145} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={11} fill="#EF4444" fontWeight={700}>GONE</text>
      </motion.g>
      <text x={280} y={170} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={11} fill="#A8A29E" fontStyle="italic">
        No more HTTP headers. 2-14 byte WebSocket frames from now on.
      </text>
    </svg>
  )
}

/* ── Step 5: Tunnel Opens ── */
function StepTunnelOpens({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <svg viewBox="0 0 560 220" style={{ width:'100%', maxWidth:640, height:'100%', maxHeight:260 }}>
      <defs>
        <marker id="ag-5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke={a} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id="am-5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      <ClientBox concept={concept} />
      <ServerBox concept={concept} />
      {/* Tunnel pipe */}
      <motion.rect
        x={132} y={97} width={296} height={22} rx={11}
        fill={concept.color.bg} stroke={a} strokeWidth={2}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.0, delay: 0.2, ease: 'easeOut' }}
        style={{ originX: 0.5 }}
      />
      {/* Persistent label */}
      <motion.text
        x={280} y={112} textAnchor="middle"
        fontFamily="var(--font-syne)" fontSize={10} fill={a} fontWeight={800}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.0 }}
      >
        persistent
      </motion.text>
      {/* Glow pulse */}
      <motion.rect
        x={132} y={97} width={296} height={22} rx={11}
        fill={a}
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ repeat: Infinity, duration: 2, delay: 1.2 }}
      />
      <text x={280} y={170} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={11} fill="#A8A29E" fontStyle="italic">
        Stays open until explicitly closed — server can speak first now
      </text>
    </svg>
  )
}

/* ── Step 6: Free Flow ── */
function StepFreeFlow({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <svg viewBox="0 0 560 220" style={{ width:'100%', maxWidth:640, height:'100%', maxHeight:260 }}>
      <defs>
        <marker id="ag-6" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke={a} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id="am-6" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <style>{`
          @keyframes flowRight {
            0%   { transform: translateX(0);   opacity: 0 }
            8%   { opacity: 1 }
            92%  { opacity: 1 }
            100% { transform: translateX(200px); opacity: 0 }
          }
          @keyframes flowLeft {
            0%   { transform: translateX(0);   opacity: 0 }
            8%   { opacity: 1 }
            92%  { opacity: 1 }
            100% { transform: translateX(-200px); opacity: 0 }
          }
        `}</style>
      </defs>
      <ClientBox concept={concept} />
      <ServerBox concept={concept} />
      {/* Tunnel */}
      <rect x={132} y={97} width={296} height={22} rx={11} fill={concept.color.bg} stroke={a} strokeWidth={2} />
      <text x={280} y={112} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={10} fill={a} fontWeight={800}>persistent</text>
      {/* Flow right: comment */}
      <g style={{ animation: 'flowRight 2.2s linear infinite' }}>
        <rect x={0} y={128} width={60} height={14} rx={7} fill={a} />
        <text x={30} y={138} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7.5} fill="white" fontWeight={600}>comment →</text>
      </g>
      {/* Flow right: typing */}
      <g style={{ animation: 'flowRight 2.2s linear infinite 1.1s' }}>
        <rect x={0} y={128} width={48} height={14} rx={7} fill={a} opacity={0.8} />
        <text x={24} y={138} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7.5} fill="white" fontWeight={600}>typing…</text>
      </g>
      {/* Flow left: new post */}
      <g style={{ animation: 'flowLeft 2.6s linear infinite 0.4s' }}>
        <rect x={0} y={148} width={56} height={14} rx={7} fill="#059669" />
        <text x={28} y={158} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7.5} fill="white" fontWeight={600}>← new post</text>
      </g>
      {/* Flow left: notification */}
      <g style={{ animation: 'flowLeft 2.6s linear infinite 1.6s' }}>
        <rect x={0} y={148} width={74} height={14} rx={7} fill="#059669" opacity={0.8} />
        <text x={37} y={158} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7.5} fill="white" fontWeight={600}>← notification</text>
      </g>
      <text x={280} y={190} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={11} fill={a} fontWeight={500} fontStyle="italic">
        Both directions, simultaneously, no asking permission
      </text>
    </svg>
  )
}
