'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Concept } from '@/data/concepts'
import CertificateModal from '@/components/concept/CertificateModal'
import SupportModal from '@/components/layout/SupportModal'
import { useArchi } from '@/lib/context/ArchiContext'

interface Question {
  id: number
  type: 'concept' | 'scenario' | 'system-design'
  question: string
  options: { id: string; text: string }[]
  correct: string
}

const QUESTIONS: Question[] = [
  {
    id: 1, type: 'concept',
    question: 'What HTTP header pair does a client send to initiate a WebSocket upgrade?',
    options: [
      { id: 'A', text: 'Connection: Upgrade + Upgrade: websocket' },
      { id: 'B', text: 'Content-Type: application/json' },
      { id: 'C', text: 'Accept: text/html' },
      { id: 'D', text: 'Transfer-Encoding: chunked' },
    ],
    correct: 'A',
  },
  {
    id: 2, type: 'concept',
    question: 'What status code does the server respond with to confirm a successful WebSocket handshake?',
    options: [
      { id: 'A', text: '200 OK' },
      { id: 'B', text: '101 Switching Protocols' },
      { id: 'C', text: '426 Upgrade Required' },
      { id: 'D', text: '301 Moved Permanently' },
    ],
    correct: 'B',
  },
  {
    id: 3, type: 'system-design',
    question: 'In the system design from Act 1, which service should receive traffic directly from the CDN?',
    options: [
      { id: 'A', text: 'App Server' },
      { id: 'B', text: 'API Gateway / LB' },
      { id: 'C', text: 'AI Orchestrator' },
      { id: 'D', text: 'Redis Cache' },
    ],
    correct: 'B',
  },
  {
    id: 4, type: 'scenario',
    question: 'A real-time dashboard polls every 2 seconds using HTTP. Users report sluggishness and battery drain. What is the root cause?',
    options: [
      { id: 'A', text: 'The server hardware is underpowered' },
      { id: 'B', text: 'HTTP headers add ~800 bytes per request, keeping the radio active pointlessly' },
      { id: 'C', text: 'JavaScript parses JSON responses too slowly' },
      { id: 'D', text: 'The Wi-Fi connection has high latency' },
    ],
    correct: 'B',
  },
  {
    id: 5, type: 'concept',
    question: 'What key capability does WebSocket have that Server-Sent Events (SSE) lack?',
    options: [
      { id: 'A', text: 'Binary data support' },
      { id: 'B', text: 'Full-duplex communication — client sends messages anytime' },
      { id: 'C', text: 'Encrypted transport via TLS' },
      { id: 'D', text: 'Standardized by the W3C' },
    ],
    correct: 'B',
  },
  {
    id: 6, type: 'scenario',
    question: 'A WebSocket server restarts and 5000 clients reconnect within 100ms. CPU spikes to 100%, crashing the server again. What prevents this?',
    options: [
      { id: 'A', text: 'Add more RAM to the server' },
      { id: 'B', text: 'Exponential backoff with random jitter on reconnection' },
      { id: 'C', text: 'Switch from WebSocket to HTTP/2' },
      { id: 'D', text: 'Use a different load balancing algorithm' },
    ],
    correct: 'B',
  },
  {
    id: 7, type: 'system-design',
    question: 'In Act 1, what happens when Browser connects directly to API Gateway, bypassing the CDN?',
    options: [
      { id: 'A', text: 'The page loads faster with fewer network hops' },
      { id: 'B', text: 'DDoS traffic hits the raw gateway — infrastructure team paged at 2 AM' },
      { id: 'C', text: 'Images fail to load without CDN compression' },
      { id: 'D', text: 'The connection auto-upgrades to WebSocket' },
    ],
    correct: 'B',
  },
  {
    id: 8, type: 'scenario',
    question: 'You have 5 WebSocket server pods behind a round-robin load balancer. A user disconnects briefly, reconnects to a different pod, and loses session state. What is the correct fix?',
    options: [
      { id: 'A', text: 'Use Redis Pub/Sub to share session state across pods' },
      { id: 'B', text: 'Increase the WebSocket timeout to 24 hours' },
      { id: 'C', text: 'Switch from WebSocket to HTTP long polling' },
      { id: 'D', text: 'Route all traffic to a single pod' },
    ],
    correct: 'A',
  },
  {
    id: 9, type: 'concept',
    question: 'What mechanism detects WebSocket connections that are dead on the client side but still open on the server?',
    options: [
      { id: 'A', text: 'Garbage collection' },
      { id: 'B', text: 'Connection pooling' },
      { id: 'C', text: 'Heartbeat / ping-pong frames' },
      { id: 'D', text: 'Reference counting' },
    ],
    correct: 'C',
  },
  {
    id: 10, type: 'system-design',
    question: 'What is the correct end-to-end request flow from Browser to the LLM API in the Act 1 architecture?',
    options: [
      { id: 'A', text: 'Browser → API GW → LLM' },
      { id: 'B', text: 'Browser → CDN → API GW → WS Server → App Server → Orchestrator → LLM' },
      { id: 'C', text: 'Browser → CDN → WS Server → App Server → LLM' },
      { id: 'D', text: 'Browser → WS Server → App Server → Orchestrator → LLM' },
    ],
    correct: 'B',
  },
]

const PASS_THRESHOLD = 7

const TYPE_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  'concept':        { label: 'Concept',       bg: '#EEF2FF', color: '#4F46E5' },
  'scenario':       { label: 'Scenario',      bg: '#FFF7ED', color: '#EA580C' },
  'system-design':  { label: 'System Design', bg: '#F0FDF4', color: '#16A34A' },
}

interface Props {
  concept: Concept
  onComplete: () => void
  onNext: () => void
}

export default function ZoneQuiz({ concept, onComplete, onNext }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState<Record<number, boolean>>({})
  const [finished, setFinished] = useState(false)
  const [retryUntil, setRetryUntil] = useState<number | null>(null)
  const [countdown, setCountdown] = useState('')
  const [lastScore, setLastScore] = useState<{score: number, total: number} | null>(null)
  const [showCertPrompt, setShowCertPrompt] = useState(false)
  const [dismissedBanner, setDismissedBanner] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [certDismissed, setCertDismissed] = useState(false)
  const { setMood, showArchiTip, hideArchiTip } = useArchi()

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    if (answered && selected !== null) {
      const isCorrect = QUESTIONS[current].correct === selected
      if (isCorrect) {
        setMood('cheer')
        showArchiTip("Correct! +XP earned 🎉", 'cheer')
        timeouts.push(setTimeout(() => {
          setMood('idle')
          hideArchiTip()
        }, 2500))
      } else {
        setMood('sad')
        showArchiTip("Not quite. Check the diagram above 👆", 'sad')
        timeouts.push(setTimeout(() => {
          setMood('idle')
          hideArchiTip()
        }, 3000))
      }
    }

    return () => timeouts.forEach(clearTimeout)
  }, [answered, current, selected, setMood, showArchiTip, hideArchiTip])

  const q = QUESTIONS[current]
  const isLast = current === QUESTIONS.length - 1
  const correctCount = Object.values(results).filter(Boolean).length
  const passed = correctCount >= PASS_THRESHOLD

  useEffect(() => {
    const key = `quiz-retry-${concept.slug}`
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const ts = parseInt(stored, 10)
        if (ts > Date.now()) {
          setRetryUntil(ts)
        } else {
          localStorage.removeItem(key)
        }
      }
    } catch {}
  }, [concept.slug])

  useEffect(() => {
    if (!retryUntil) return
    const tick = () => {
      const left = retryUntil - Date.now()
      if (left <= 0) {
        setRetryUntil(null)
        setCountdown('')
        try { localStorage.removeItem(`quiz-retry-${concept.slug}`) } catch {}
        return
      }
      const m = Math.floor(left / 60000)
      const s = Math.floor((left % 60000) / 1000)
      setCountdown(`${m}:${s.toString().padStart(2, '0')}`)
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [retryUntil, concept.slug])

  useEffect(() => {
    const key = `quiz-last-score-${concept.slug}`
    try {
      const raw = localStorage.getItem(key)
      if (raw) setLastScore(JSON.parse(raw))
    } catch {}
  }, [concept.slug])

  useEffect(() => {
    try {
      const zoneDone = localStorage.getItem(`zone-complete-${concept.slug}-4`) === 'true'
      const hasCert = localStorage.getItem(`certificate-${concept.slug}`) !== null
      if (zoneDone && !hasCert) setShowCertPrompt(true)
    } catch {}
  }, [concept.slug])

  const handleSelect = useCallback((id: string) => {
    if (answered) return
    setSelected(id)
    setAnswered(true)
    const isCorrect = QUESTIONS[current].correct === id
    setResults(prev => ({ ...prev, [current]: isCorrect }))
  }, [answered, current])

  const handleNext = useCallback(() => {
    if (!isLast) {
      setCurrent(prev => prev + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
      const finalScore = Object.values(results).filter(Boolean).length
      try {
        localStorage.setItem(`quiz-last-score-${concept.slug}`, JSON.stringify({ score: finalScore, total: QUESTIONS.length }))
      } catch {}
      if (finalScore < PASS_THRESHOLD) {
        const until = Date.now() + 3600000
        setRetryUntil(until)
        try {
          localStorage.setItem(`quiz-retry-${concept.slug}`, String(until))
        } catch {}
      }
    }
  }, [isLast, results, concept.slug])

  const handleRetry = useCallback(() => {
    try {
      const key = `quiz-retry-${concept.slug}`
      const stored = localStorage.getItem(key)
      if (stored) {
        const ts = parseInt(stored, 10)
        if (ts > Date.now()) {
          setRetryUntil(ts)
          return
        }
        localStorage.removeItem(key)
      }
    } catch {}
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setResults({})
    setFinished(false)
  }, [concept.slug])

  // ── Locked screen (retry timeout) ──
  if (retryUntil) {
    return (
      <>
        <div className="h-full flex flex-col items-center justify-center px-6" style={{ minHeight: '100vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5"
          style={{ maxWidth: 360, textAlign: 'center' }}
        >
          <div
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: `${concept.color.accent}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32,
            }}
          >
            ⏰
          </div>
          <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 20, color: '#1C1917' }}>
            Come back in 1 hour
          </div>
          <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#A8A29E', lineHeight: 1.5 }}>
            Use this time to revise the concepts in zones 1–3. You'll do better next time.
          </div>
          <div
            style={{
              fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28,
              color: concept.color.accent, letterSpacing: '0.04em',
            }}
          >
            {countdown}
          </div>
        </motion.div>
      </div>
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  )
  }

  // ── Certificate prompt (completed quiz, no cert yet) ──
  if (showCertPrompt) {
    const stored = lastScore || { score: Math.round(QUESTIONS.length / 2), total: QUESTIONS.length }
    return (
      <>
        <div className="h-full flex flex-col items-center justify-center px-6" style={{ minHeight: '100vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5"
          style={{ maxWidth: 360, textAlign: 'center' }}
        >
          <div style={{ fontSize: 48, marginBottom: 4 }}>🎓</div>
          <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 20, color: '#1C1917' }}>
            You completed the quiz!
          </div>
          <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#A8A29E', lineHeight: 1.5 }}>
            Generate your certificate to showcase your achievement.
          </div>
          <div className="flex flex-col" style={{ gap: 8, width: '100%', marginTop: 8 }}>
            {showCertPrompt && (
              <CertificateModal
                concept={concept}
                score={stored.score}
                total={stored.total}
                onComplete={() => { setShowCertPrompt(false); onComplete() }}
                onNext={onNext}
              />
            )}
            <motion.button
              onClick={() => { setShowCertPrompt(false); setResults({}); setCurrent(0); setSelected(null); setAnswered(false) }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '10px 0', borderRadius: 10, border: '1.5px solid #D6D3D1',
                background: 'transparent', color: '#78716C', cursor: 'pointer',
                fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 13,
              }}
            >
              Re-take Quiz
            </motion.button>
            <button
              onClick={() => setSupportOpen(true)}
              className="font-dm-sans"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: '#A8A29E', padding: '4px 0',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F97316' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#A8A29E' }}
            >
              ☕ Support the project
            </button>
          </div>
        </motion.div>
      </div>
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  )
  }

  // ── Results screen ──
  if (finished) {
    return (
      <>
        <div className="h-full flex flex-col items-center justify-center px-6" style={{ minHeight: '100vh' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5"
          style={{ maxWidth: 400, textAlign: 'center' }}
        >
          {/* Score circle */}
          <div
            style={{
              width: 100, height: 100, borderRadius: '50%',
              background: passed ? '#DCFCE7' : '#FEF2F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, color: passed ? '#16A34A' : '#DC2626' }}>
              {correctCount}/{QUESTIONS.length}
            </span>
          </div>

          {/* Title */}
          <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 20, color: '#1C1917' }}>
            {passed ? 'Nice work!' : 'Not quite yet'}
          </div>

          {passed && !certDismissed ? (
            <CertificateModal
              concept={concept}
              score={correctCount}
              total={QUESTIONS.length}
              onComplete={() => { setCertDismissed(true); onComplete() }}
              onNext={onNext}
            />
          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#A8A29E', lineHeight: 1.5 }}>
                Review the material in zones 1–3 and come back in 1 hour to try again.
              </div>
              <motion.button
                onClick={handleRetry}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  marginTop: 8, padding: '12px 28px', borderRadius: 10, border: 'none',
                  background: concept.color.accent, color: '#FFFBF7', cursor: 'pointer',
                  fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 14,
                }}
              >
                Retry in 1 hour
              </motion.button>
              <button
                onClick={() => setSupportOpen(true)}
                className="font-dm-sans"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: '#A8A29E', padding: '2px 0',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#F97316' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#A8A29E' }}
              >
                ☕ Fuel the Build
              </button>
            </>
          )}
        </motion.div>
      </div>
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  )
  }

  // ── Quiz in progress ──
  return (
    <div className="h-full flex flex-col pt-12" style={{ minHeight: '100vh' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{
          padding: 'clamp(12px, 2vw, 20px) clamp(16px, 3vw, 32px)',
          borderBottom: '0.5px solid rgba(0,0,0,0.07)',
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 18 }}>🧠</span>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 14, color: '#1C1917' }}>
            Quiz
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress dots */}
          <div className="flex items-center gap-1">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === current ? 18 : 6, height: 6, borderRadius: 999,
                  background: i === current ? concept.color.accent : i < current ? '#D6D3D1' : '#E7E5E4',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, fontWeight: 600, color: '#A8A29E', minWidth: 32, textAlign: 'right' }}>
            {current + 1}/{QUESTIONS.length}
          </span>
        </div>
      </div>

      {lastScore && !dismissedBanner && (
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px clamp(16px, 3vw, 32px)',
            background: '#FFFBEB', borderBottom: '0.5px solid rgba(0,0,0,0.07)',
          }}
        >
          <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: '#A16207' }}>
            Previous attempt: <strong>{lastScore.score}/{lastScore.total}</strong>
          </div>
          <button
            onClick={() => setDismissedBanner(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A16207', fontSize: 14, padding: 0, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-4 py-6" style={{ minHeight: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col w-full"
            style={{ maxWidth: 560, gap: 16 }}
          >
            {/* Type badge */}
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: 'var(--font-dm-sans)', fontSize: 11, fontWeight: 700,
                padding: '4px 10px', borderRadius: 6,
                background: TYPE_CONFIG[q.type].bg,
                color: TYPE_CONFIG[q.type].color,
                alignSelf: 'flex-start',
              }}
            >
              <span style={{ fontSize: 10 }}>{TYPE_CONFIG[q.type].bg === '#EEF2FF' ? '●' : TYPE_CONFIG[q.type].bg === '#FFF7ED' ? '◆' : '■'}</span>
              {TYPE_CONFIG[q.type].label}
            </div>

            {/* Question */}
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 'clamp(16px, 2vw, 20px)', color: '#1C1917', lineHeight: 1.35 }}>
              {q.question}
            </div>

            {/* Options */}
            <div className="flex flex-col" style={{ gap: 8, marginTop: 4 }}>
              {q.options.map(opt => {
                const isSelected = selected === opt.id
                const isCorrectOption = q.correct === opt.id
                let borderColor = 'rgba(0,0,0,0.08)'
                let bg = '#FAFAF9'
                if (answered && isSelected && isCorrectOption) {
                  borderColor = '#16A34A'
                  bg = '#F0FDF4'
                } else if (answered && isSelected && !isCorrectOption) {
                  borderColor = '#DC2626'
                  bg = '#FEF2F2'
                } else if (answered && !isSelected && isCorrectOption) {
                  borderColor = '#16A34A'
                  bg = '#F0FDF4'
                }
                return (
                  <motion.button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    whileHover={!answered ? { scale: 1.01, x: 2 } : {}}
                    whileTap={!answered ? { scale: 0.99 } : {}}
                    disabled={answered}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 16px', borderRadius: 10,
                      border: `1.5px solid ${borderColor}`,
                      background: bg,
                      cursor: answered ? 'default' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-dm-sans)', fontSize: 11, fontWeight: 700,
                      background: isSelected && answered
                        ? (isCorrectOption ? '#16A34A' : '#DC2626')
                        : isSelected ? concept.color.accent : '#E7E5E4',
                      color: isSelected ? '#FFFBF7' : '#A8A29E',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}>
                      {answered && isSelected
                        ? (isCorrectOption ? '✓' : '✗')
                        : opt.id
                      }
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(13px, 1.1vw, 14px)',
                      fontWeight: 500, color: '#1C1917', lineHeight: 1.4, flex: 1,
                    }}>
                      {opt.text}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {/* Feedback + Next */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col"
                  style={{ gap: 12, marginTop: 4 }}
                >
                  {/* Feedback message */}
                  <div
                    style={{
                      padding: '10px 14px', borderRadius: 8,
                      background: q.correct === selected ? '#F0FDF4' : '#FEF2F2',
                      fontFamily: 'var(--font-dm-sans)', fontSize: 13, lineHeight: 1.5,
                      color: q.correct === selected ? '#166534' : '#991B1B',
                    }}
                  >
                    {q.correct === selected
                      ? '✓ Correct!'
                      : '✗ Not quite. Review the concepts in zones 1–3 to find this answer.'
                    }
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '10px 22px', borderRadius: 8, border: 'none',
                        background: concept.color.accent, color: '#FFFBF7', cursor: 'pointer',
                        fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 13,
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      {isLast ? 'See Results' : 'Next'}
                      <span style={{ fontSize: 14 }}>→</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom support link */}
      <div className="flex justify-center flex-shrink-0" style={{ padding: '4px 0 16px' }}>
        <button
          onClick={() => setSupportOpen(true)}
          className="font-dm-sans"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, color: '#D6D3D1',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#F97316' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#D6D3D1' }}
        >
          ☕ Fuel the Build
        </button>
      </div>

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  )
}
