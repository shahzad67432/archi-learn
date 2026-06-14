'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Concept } from '@/data/concepts'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { AgentLesson } from './tryit/AgentLesson'
import { FlowLine } from './tryit/FlowLine'
import { Orderbook } from './tryit/Orderbook'
import { MetricBar } from './tryit/MetricBar'

interface Props {
  concept: Concept
  onComplete: () => void
  onNext: () => void
}

type ClientStatus = 'live' | 'stale' | 'zombie' | 'reconnecting'

const MISSIONS = [
  {
    title: 'Replace polling with a stream',
    brief: 'BTC/USDT prices are arriving in delayed batches. Traders see stale quotes while the API burns cycles on empty polling requests.',
    action: 'Switch to WebSocket stream',
  },
  {
    title: 'Clean up dead clients',
    brief: 'Some traders closed laptops mid-session. The gateway still counts them as connected and keeps writing into dead sockets.',
    action: 'Enable heartbeat',
  },
  {
    title: 'Broadcast across pods',
    brief: 'Pod A receives every price tick, but users connected to Pod B are missing updates. Local memory is not a shared broadcast layer.',
    action: 'Add Redis Pub/Sub',
  },
  {
    title: 'Survive a reconnect storm',
    brief: 'A gateway restart dropped every client at once. Without jitter, they all reconnect in the same second and spike TLS + upgrade load.',
    action: 'Add backoff + jitter',
  },
]

const BASE_ASKS = [0.7, 1.6, 2.4, 3.1, 4.2]
const BASE_BIDS = [0.5, 1.2, 2.1, 3.4, 4.8]

function formatPrice(price: number) {
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function Node({
  label,
  x,
  y,
  active,
  danger,
  accent,
}: {
  label: string
  x: number
  y: number
  active?: boolean
  danger?: boolean
  accent: string
}) {
  return (
    <motion.g animate={{ opacity: active === false ? 0.42 : 1 }}>
      <rect
        x={x}
        y={y}
        width="104"
        height="42"
        rx="8"
        fill={danger ? '#FEF2F2' : '#FFFBF7'}
        stroke={danger ? '#EF4444' : active ? accent : '#D6D3D1'}
        strokeWidth="1.4"
      />
      <text x={x + 52} y={y + 25} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="10" fontWeight="700" fill={danger ? '#DC2626' : '#1C1917'}>
        {label}
      </text>
    </motion.g>
  )
}

export default function ZoneTryIt({ concept, onComplete, onNext }: Props) {
  const $m = useMediaQuery('(max-width: 639px)')
  const $d = useMediaQuery('(min-width: 1024px)')

  const [mission, setMission] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [wsActive, setWsActive] = useState(false)
  const [heartbeat, setHeartbeat] = useState(false)
  const [redis, setRedis] = useState(false)
  const [jitter, setJitter] = useState(false)
  const [zombie, setZombie] = useState(false)
  const [podSplit, setPodSplit] = useState(false)
  const [reconnectStorm, setReconnectStorm] = useState(false)
  const [price, setPrice] = useState(68421.5)
  const [logs, setLogs] = useState<string[]>([
    'Incident opened: BTC/USDT quotes are stale for active traders.',
    'Current design uses repeated HTTP polling against a volatile feed.',
  ])
  const [lesson, setLesson] = useState(0)
  const [act, setAct] = useState<0|1|2>(0)
  const [lesson1Complete, setLesson1Complete] = useState(false)
  const [lesson2Complete, setLesson2Complete] = useState(false)

  const a = concept.color.accent
  const allComplete = completed.size === MISSIONS.length
  const streamHealthy = wsActive && (!zombie || heartbeat) && (!podSplit || redis) && (!reconnectStorm || jitter)
  const podBStale = wsActive && podSplit && !redis

  const metrics = useMemo(() => {
    const latency = !wsActive ? 82 : streamHealthy ? 16 : 48
    const gatewayLoad = !wsActive ? 78 : reconnectStorm && !jitter ? 94 : streamHealthy ? 28 : 55
    const memory = zombie && !heartbeat ? 86 : streamHealthy ? 24 : 46
    return { latency, gatewayLoad, memory }
  }, [heartbeat, jitter, reconnectStorm, streamHealthy, wsActive, zombie])

  const clients: { name: string; pod: string; status: ClientStatus }[] = [
    { name: 'Trader A', pod: 'Pod A', status: reconnectStorm && !jitter ? 'reconnecting' : wsActive ? 'live' : 'stale' },
    { name: 'Trader B', pod: 'Pod B', status: podBStale ? 'stale' : wsActive ? 'live' : 'stale' },
    { name: 'Trader C', pod: 'Pod A', status: zombie && !heartbeat ? 'zombie' : wsActive ? 'live' : 'stale' },
  ]

  useEffect(() => {
    const delay = wsActive ? 850 : 2600
    const id = window.setInterval(() => {
      if (podBStale) return
      setPrice(prev => prev + (Math.random() - 0.48) * (streamHealthy ? 5.6 : 1.8))
    }, delay)
    return () => window.clearInterval(id)
  }, [podBStale, streamHealthy, wsActive])

  useEffect(() => {
    if (allComplete && !lesson1Complete) {
      setLesson1Complete(true)
      const t1 = window.setTimeout(() => setLesson(1), 400)
      return () => window.clearTimeout(t1)
    }
  }, [allComplete, lesson1Complete])

  const addLog = (line: string) => {
    setLogs(prev => [`${new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })} ${line}`, ...prev].slice(0, 7))
  }

  const completeMission = (index: number) => {
    setCompleted(prev => new Set([...prev, index]))
    if (index < MISSIONS.length - 1) setMission(index + 1)
  }

  const handlePrimaryAction = () => {
    if (mission === 0) {
      setWsActive(true)
      addLog('HTTP polling replaced by persistent WebSocket stream.')
      completeMission(0)
      return
    }

    if (mission === 1) {
      if (!zombie) {
        setZombie(true)
        addLog('Network drop simulated: Trader C became a zombie connection.')
        return
      }
      setHeartbeat(true)
      addLog('Heartbeat enabled: stale socket detected and cleaned up.')
      completeMission(1)
      return
    }

    if (mission === 2) {
      if (!podSplit) {
        setPodSplit(true)
        addLog('Second gateway pod added: Pod B missed the local-only broadcast.')
        return
      }
      setRedis(true)
      addLog('Redis Pub/Sub added: both pods now receive the same price ticks.')
      completeMission(2)
      return
    }

    if (mission === 3) {
      if (!reconnectStorm) {
        setReconnectStorm(true)
        addLog('Gateway restart simulated: clients are reconnecting in one burst.')
        return
      }
      setJitter(true)
      addLog('Backoff with jitter added: reconnect attempts spread out safely.')
      completeMission(3)
    }
  }

  const finishZone = () => {
    localStorage.setItem(`zone-complete-${concept.slug}-3`, 'true')
    onComplete()
    onNext()
  }

  const primaryLabel = mission === 1 && !zombie
    ? 'Simulate silent disconnect'
    : mission === 2 && !podSplit
    ? 'Add second gateway pod'
    : mission === 3 && !reconnectStorm
    ? 'Restart gateway'
    : MISSIONS[mission]?.action

  const missionCardEl = (
    <div style={{ border: `1px solid ${concept.color.border}`, background: concept.color.bg, borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: 10, color: a, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 7 }}>
        MISSION {mission + 1}
      </div>
      <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 18, lineHeight: 1.05, color: '#1C1917', marginBottom: 8 }}>
        {MISSIONS[mission]?.title}
      </div>
      <div style={{ fontSize: 12, color: '#57534E', lineHeight: 1.55 }}>
        {MISSIONS[mission]?.brief}
      </div>
      <button
        onClick={handlePrimaryAction}
        disabled={allComplete}
        style={{
          marginTop: 13,
          width: '100%',
          minHeight: 40,
          border: 'none',
          borderRadius: 10,
          background: allComplete ? '#D6D3D1' : '#1C1917',
          color: allComplete ? '#78716C' : '#FFFBF7',
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 12,
          cursor: allComplete ? 'default' : 'pointer',
        }}
      >
        {allComplete ? 'All missions complete' : primaryLabel}
      </button>
      {allComplete && (
        <button
          onClick={finishZone}
          style={{
            marginTop: 8,
            width: '100%',
            minHeight: 40,
            border: `1px solid ${a}`,
            borderRadius: 10,
            background: a,
            color: '#FFFBF7',
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          Continue to Quiz
        </button>
      )}
    </div>
  )

  const eventLogEl = (
    <div className="tryit-log" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#1C1917', borderRadius: 12, padding: 12, overflow: 'auto' }}>
      <div style={{ fontSize: 10, color: '#A8A29E', fontWeight: 800, marginBottom: 8 }}>EVENT LOG</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {logs.map((line, index) => (
          <div key={`${line}-${index}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: index === 0 ? '#ADFA1D' : '#D6D3D1', lineHeight: 1.45 }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div
      style={{
        height: 'calc(100dvh - 52px)',
        paddingTop: 52,
        background: '#FFFBF7',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: 'clamp(10px,1.5vw,16px) clamp(16px,3vw,40px)',
          borderBottom: '0.5px solid rgba(0,0,0,0.07)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexShrink: 0,
        }}
      >
        <div className='flex flex-col gap-4'>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 15, color: '#1C1917' }}>Try It</span>
            <span style={{ background: concept.color.bg, border: `1px solid ${concept.color.border}`, color: a, borderRadius: 999, padding: '2px 9px', fontSize: 10, fontWeight: 700 }}>
              Production Lab
            </span>
          </div>
          {/* ── SUB-HEADER: Lesson toggle ── */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {(['Lesson 1 — Fix the Orderbook', 'Lesson 2 — Build the AI Agent'] as const).map((label, i) => {
                const isLesson2 = i === 1
                const locked = isLesson2 && !lesson1Complete
                const active = lesson === i
                const complete = i === 0 && lesson1Complete && !active
                const shortLabel = $m ? `Lesson ${i + 1}` : label

                let bg: string, color: string, border: string, cursor: string
                if (active) {
                  bg = '#1C1917'; color = '#FFFBF7'; border = 'none'; cursor = 'pointer'
                } else if (complete) {
                  bg = concept.color.bg; color = a; border = `1px solid ${concept.color.border}`; cursor = 'pointer'
                } else if (locked) {
                  bg = '#F3F0EB'; color = '#A8A29E'; border = 'none'; cursor = 'not-allowed'
                } else {
                  bg = '#F3F0EB'; color = '#78716C'; border = 'none'; cursor = 'pointer'
                }

                return (
                  <button
                    key={i}
                    onClick={() => { if (!locked) setLesson(i) }}
                    style={{
                      padding: $m ? '4px 10px' : '6px 12px',
                      borderRadius: 8,
                      fontSize: $m ? 10 : 11,
                      fontWeight: 700,
                      fontFamily: 'var(--font-dm-sans)',
                      background: bg,
                      color,
                      border,
                      cursor,
                      whiteSpace: 'nowrap' as const,
                    }}
                  >
                    {complete ? '✓ ' : ''}{locked ? '🔒 ' : ''}{shortLabel}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {lesson === 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
            {$m ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {act > 0 && (
                  <button
                    onClick={() => setAct((act - 1) as 0|1|2)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: 'var(--font-dm-sans)',
                      border: 'none',
                      background: '#F3F0EB',
                      color: '#78716C',
                      cursor: 'pointer',
                    }}
                  >
                    ← Act {act}
                  </button>
                )}
                {act < 2 && (
                  <button
                    onClick={() => setAct((act + 1) as 0|1|2)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: 'var(--font-dm-sans)',
                      border: 'none',
                      background: a,
                      color: '#FFFBF7',
                      cursor: 'pointer',
                    }}
                  >
                    Act {act + 2} →
                  </button>
                )}
              </div>
            ) : (
              ['The Problem', 'Build It', 'Watch It Work'].map((label, i) => (
                <Fragment key={label}>
                  {i > 0 && (
                    <div style={{ width: 24, height: 2, background: act >= i ? a : '#D6D3D1', borderRadius: 1 }} />
                  )}
                  <button
                    onClick={() => setAct(i as 0|1|2)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: 'var(--font-dm-sans)',
                      border: 'none',
                      background: act === i ? '#1C1917' : act > i ? a : '#F3F0EB',
                      color: act >= i ? '#FFFBF7' : '#78716C',
                      whiteSpace: 'nowrap' as const,
                      cursor: 'pointer',
                    }}
                  >
                    Act {i + 1} — {label}
                  </button>
                </Fragment>
              ))
            )}
          </div>
        )}
      </div>

      {lesson === 0 ? (
        <div
          className="tryit-content"
          style={{
            flex: 1,
            minHeight: 0,
            padding: 'clamp(12px,2vw,22px) clamp(16px,3vw,40px)',
          }}
        >
          <div className="tryit-main">
            <div className="tryit-canvas-card">
              <svg viewBox="0 0 720 360" style={{ width: '100%', height: '100%', display: 'block' }}>
                <rect x="0" y="0" width="720" height="360" fill="#FFFDF9" />
                <FlowLine path="M114 88 C170 88 178 160 236 160" active={!wsActive} danger={!wsActive} accent={a} />
                <FlowLine path="M114 236 C176 236 178 186 236 186" active={wsActive} accent={a} />
                <FlowLine path="M340 170 C390 170 412 110 462 110" active={wsActive && (!podSplit || redis)} danger={podBStale} accent={a} />
                <FlowLine path="M340 188 C392 188 412 250 462 250" active={wsActive} accent={a} />
                <FlowLine path="M514 132 C514 160 514 188 514 216" active={redis} accent={a} />
                <FlowLine path="M566 110 C612 110 618 162 650 162" active={wsActive && (!podBStale || redis)} accent={a} />
                <FlowLine path="M566 250 C612 250 618 198 650 198" active={wsActive} accent={a} />

                <Node label="HTTP Polling" x={28} y={66} active={!wsActive} danger={!wsActive} accent={a} />
                <Node label="Price Feed" x={28} y={214} active accent={a} />
                <Node label="WS Gateway" x={236} y={150} active={wsActive} danger={reconnectStorm && !jitter} accent={a} />
                <Node label="Pod A" x={462} y={89} active={wsActive} accent={a} />
                <Node label="Pod B" x={462} y={229} active={wsActive} danger={podBStale} accent={a} />
                <Node label="Traders" x={592} y={160} active={wsActive} danger={zombie && !heartbeat} accent={a} />

                <motion.g animate={{ opacity: redis ? 1 : 0.28 }}>
                  <rect x="446" y="154" width="136" height="52" rx="10" fill={redis ? '#ECFDF5' : '#F5F5F4'} stroke={redis ? '#10B981' : '#D6D3D1'} />
                  <text x="514" y="184" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="11" fontWeight="800" fill={redis ? '#047857' : '#A8A29E'}>Redis Pub/Sub</text>
                </motion.g>

                <motion.g animate={{ opacity: heartbeat ? 1 : 0.3 }}>
                  <circle cx="323" cy="118" r="18" fill={heartbeat ? '#F0FDF4' : '#F5F5F4'} stroke={heartbeat ? '#16A34A' : '#D6D3D1'} />
                  <text x="323" y="122" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="9" fontWeight="800" fill={heartbeat ? '#15803D' : '#A8A29E'}>PING</text>
                </motion.g>

                <motion.g animate={{ opacity: jitter ? 1 : reconnectStorm ? 1 : 0.28 }}>
                  <rect x="252" y="228" width="72" height="30" rx="8" fill={jitter ? '#F0FDF4' : reconnectStorm ? '#FEF2F2' : '#F5F5F4'} stroke={jitter ? '#16A34A' : reconnectStorm ? '#EF4444' : '#D6D3D1'} />
                  <text x="288" y="247" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="9" fontWeight="800" fill={jitter ? '#15803D' : reconnectStorm ? '#DC2626' : '#A8A29E'}>JITTER</text>
                </motion.g>
              </svg>
            </div>

            <div className="lg:hidden" style={{ margin: 0 }}>{missionCardEl}</div>

            <div className="tryit-main-bottom">
              <div className="tryit-orderbook-wrap">
                <Orderbook price={price} streamHealthy={streamHealthy} podBStale={podBStale} accent={a} />
              </div>
              <div className="tryit-event-log hidden lg:block">{eventLogEl}</div>
            </div>
          </div>

          <div className="tryit-side">
            <div className="hidden lg:block">{missionCardEl}</div>

            <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 12, display: 'grid', gap: 10 }}>
              <MetricBar label="Latency" value={metrics.latency} suffix="%" tone={metrics.latency > 70 ? '#DC2626' : metrics.latency > 40 ? '#D97706' : '#16A34A'} />
              <MetricBar label="Gateway load" value={metrics.gatewayLoad} suffix="%" tone={metrics.gatewayLoad > 70 ? '#DC2626' : metrics.gatewayLoad > 40 ? '#D97706' : '#16A34A'} />
              <MetricBar label="Memory pressure" value={metrics.memory} suffix="%" tone={metrics.memory > 70 ? '#DC2626' : metrics.memory > 40 ? '#D97706' : '#16A34A'} />
            </div>

            <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#A8A29E', fontWeight: 800, marginBottom: 8 }}>CLIENT EXPERIENCE</div>
              <div style={{ display: 'grid', gap: 7 }}>
                {clients.map(client => {
                  const color = client.status === 'live' ? '#16A34A' : client.status === 'stale' ? '#D97706' : '#DC2626'
                  return (
                    <div key={client.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#1C1917', fontWeight: 700 }}>{client.name}</div>
                        <div style={{ fontSize: 10, color: '#A8A29E' }}>{client.pod}</div>
                      </div>
                      <span style={{ color, background: `${color}14`, border: `1px solid ${color}33`, borderRadius: 999, padding: '3px 8px', fontSize: 10, fontWeight: 800 }}>
                        {client.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="lg:hidden">{eventLogEl}</div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '0 clamp(16px,3vw,40px)' }}>
          <AgentLesson concept={concept} onComplete={() => setLesson2Complete(true)} act={act} setAct={setAct} $m={$m} $d={$d} />
          {lesson2Complete && (
            <div style={{ marginTop: 20, width: '100%', maxWidth: 360 }}>
              <button
                onClick={finishZone}
                style={{
                  width: '100%',
                  minHeight: 44,
                  border: 'none',
                  borderRadius: 10,
                  background: a,
                  color: '#FFFBF7',
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Continue to Quiz →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
