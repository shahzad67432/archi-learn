'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Concept } from '@/data/concepts'

interface Props {
  concept: Concept
  onComplete: () => void
  onNext: () => void
}

type ClientStatus = 'live' | 'stale' | 'zombie' | 'reconnecting'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

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

function MetricBar({
  label,
  value,
  suffix,
  tone,
}: {
  label: string
  value: number
  suffix?: string
  tone: string
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
        <span style={{ fontSize: 'clamp(9px, 1.5vw, 10px)', color: '#78716C', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 'clamp(9px, 1.5vw, 10px)', color: tone, fontWeight: 700 }}>{value}{suffix}</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.35 }}
          style={{ height: '100%', borderRadius: 999, background: tone }}
        />
      </div>
    </div>
  )
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

function FlowLine({
  path,
  active,
  danger,
  accent,
}: {
  path: string
  active: boolean
  danger?: boolean
  accent: string
}) {
  return (
    <motion.path
      d={path}
      fill="none"
      stroke={danger ? '#EF4444' : active ? accent : '#D6D3D1'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray={active ? '8 8' : '0'}
      animate={active ? { strokeDashoffset: [0, -32] } : {}}
      transition={active ? { duration: 1.1, repeat: Infinity, ease: 'linear' } : {}}
      opacity={active ? 1 : 0.45}
    />
  )
}

function Orderbook({
  price,
  streamHealthy,
  podBStale,
  accent,
}: {
  price: number
  streamHealthy: boolean
  podBStale: boolean
  accent: string
}) {
  const asks = BASE_ASKS.map((offset, i) => ({
    price: price + offset,
    size: 0.42 + ((i + 1) * 0.31) % 2.4,
  })).reverse()
  const bids = BASE_BIDS.map((offset, i) => ({
    price: price - offset,
    size: 0.58 + ((i + 2) * 0.27) % 2.8,
  }))

  return (
    <div
      style={{
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 12,
        background: '#1C1917',
        color: '#FFFBF7',
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 15 }}>BTC/USDT</div>
          <div style={{ fontSize: 10, color: '#A8A29E', marginTop: 2 }}>dummy realtime orderbook</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <motion.div
            key={Math.round(price * 100)}
            initial={{ y: -4, opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: streamHealthy ? '#ADFA1D' : '#FCD34D', fontWeight: 700 }}
          >
            {formatPrice(price)}
          </motion.div>
          <div style={{ fontSize: 9, color: podBStale ? '#FCA5A5' : '#A8A29E' }}>
            {podBStale ? 'Pod B clients stale' : streamHealthy ? 'streaming live' : 'polling batches'}
          </div>
        </div>
      </div>

      <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr auto auto', columnGap: 10, rowGap: 5, fontFamily: 'var(--font-mono)', fontSize: 10 }}>
        <span style={{ color: '#A8A29E' }}>ASK</span>
        <span style={{ color: '#A8A29E', textAlign: 'right' }}>PRICE</span>
        <span style={{ color: '#A8A29E', textAlign: 'right' }}>SIZE</span>
        {asks.map(row => (
          <div key={`ask-${row.price}`} style={{ display: 'contents' }}>
            <span style={{ height: 14, borderRadius: 3, background: 'linear-gradient(90deg, rgba(239,68,68,0.28), transparent)' }} />
            <span style={{ color: '#FCA5A5', textAlign: 'right' }}>{formatPrice(row.price)}</span>
            <span style={{ color: '#E7E5E4', textAlign: 'right' }}>{row.size.toFixed(3)}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '8px 14px', borderTop: `1px solid ${accent}55`, borderBottom: `1px solid ${accent}55`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#A8A29E' }}>LAST TRADE</span>
        <span style={{ fontFamily: 'var(--font-mono)', color: accent, fontWeight: 800 }}>{formatPrice(price)}</span>
      </div>

      <div style={{ padding: '10px 14px 12px', display: 'grid', gridTemplateColumns: '1fr auto auto', columnGap: 10, rowGap: 5, fontFamily: 'var(--font-mono)', fontSize: 10 }}>
        <span style={{ color: '#A8A29E' }}>BID</span>
        <span style={{ color: '#A8A29E', textAlign: 'right' }}>PRICE</span>
        <span style={{ color: '#A8A29E', textAlign: 'right' }}>SIZE</span>
        {bids.map(row => (
          <div key={`bid-${row.price}`} style={{ display: 'contents' }}>
            <span style={{ height: 14, borderRadius: 3, background: 'linear-gradient(90deg, rgba(16,185,129,0.28), transparent)' }} />
            <span style={{ color: '#86EFAC', textAlign: 'right' }}>{formatPrice(row.price)}</span>
            <span style={{ color: '#E7E5E4', textAlign: 'right' }}>{row.size.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ZoneTryIt({ concept, onComplete, onNext }: Props) {
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
        // overflow: 'hidden',
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
          <div
              style={{
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {['Lesson 1 — Fix the Orderbook', 'Lesson 2 — Build the AI Agent'].map((label, i) => {
                  const isLesson2 = i === 1
                  const locked = isLesson2 && !lesson1Complete
                  const active = lesson === i
                  const complete = i === 0 && lesson1Complete && !active
                
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
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: 'var(--font-dm-sans)',
                        background: bg,
                        color,
                        border,
                        cursor,
                        whiteSpace: 'nowrap' as const,
                      }}
                    >
                      {complete ? '✓ ' : ''}{locked ? '🔒 ' : ''}{label}
                    </button>
                  )
                })}
              </div>
          </div>
        </div>

        

        {lesson === 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
            {['The Problem', 'Build It', 'Watch It Work'].map((label, i) => (
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
            ))}
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
          <AgentLesson concept={concept} onComplete={() => setLesson2Complete(true)} act={act} setAct={setAct} />
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

function AgentLesson({ concept, onComplete, act, setAct }: { concept: Concept; onComplete: () => void; act: 0|1|2; setAct: (a: 0|1|2) => void }) {
  const [httpRunning, setHttpRunning] = useState(false)
  const [httpProgress, setHttpProgress] = useState(0)
  const [httpError, setHttpError] = useState<null|string>(null)
  const [pollCost, setPollCost] = useState(0)
  const [pollRequests, setPollRequests] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const a = concept.color.accent

  useEffect(() => {
    if (!httpRunning) return
    const progressTimer = window.setInterval(() => {
      setHttpProgress(prev => Math.min(prev + 1, 65))
    }, 123)
    const costTimer = window.setInterval(() => {
      setPollCost(c => c + 0.011)
      setPollRequests(r => r + 1)
    }, 800)
    const errorTimer = window.setTimeout(() => {
      setHttpRunning(false)
      setHttpError('504 Gateway Timeout')
    }, 8000)
    return () => {
      window.clearInterval(progressTimer)
      window.clearInterval(costTimer)
      window.clearTimeout(errorTimer)
    }
  }, [httpRunning])

  useEffect(() => {
    if (!httpRunning && !httpError) return
    const id = window.setInterval(() => setElapsed(prev => prev + 1), 1000)
    return () => window.clearInterval(id)
  }, [httpRunning, httpError])

  // ── Act 1 state ──
  const [connections, setConnections] = useState<{from:string, to:string}[]>([])
  const [selectedNode, setSelectedNode] = useState<string|null>(null)
  const [hint, setHint] = useState(false)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [lastConsequence, setLastConsequence] = useState<string|null>(null)
  const [placedNodes, setPlacedNodes] = useState<{id:string, x:number, y:number}[]>([])
  const [paletteService, setPaletteService] = useState<string|null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{nodeId:string;startClientX:number;startClientY:number;nodeStartX:number;nodeStartY:number;moved:boolean}|null>(null)

  // ── Act 2 state ──
  const [streaming, setStreaming] = useState(false)
  const [streamPhase, setStreamPhase] = useState<'idle'|'planning'|'coding'|'testing'|'deploying'|'done'|'interrupted'>('idle')
  const [tokens, setTokens] = useState('')
  const [interrupted, setInterrupted] = useState(false)
  const [tokensSaved, setTokensSaved] = useState(0)
  const isMobile = useMediaQuery('(max-width: 639px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const handleGenerate = () => {
    setHttpRunning(true)
    setHttpProgress(0)
    setHttpError(null)
    setPollCost(0)
    setPollRequests(0)
    setElapsed(0)
  }

  const SERVICES = [
    { id:'browser', label:'Browser\nClient', color:'#F97316' },
    { id:'cdn', label:'CDN', color:'#8B5CF6' },
    { id:'api-gw', label:'API Gateway\n/ LB', color:'#DC2626' },
    { id:'ws-server', label:'WebSocket\nServer', color:a },
    { id:'app-server', label:'App\nServer', color:'#06B6D4' },
    { id:'orchestrator', label:'AI\nOrchestrator', color:'#8B5CF6' },
    { id:'llm', label:'LLM\nAPI', color:'#F59E0B' },
    { id:'postgres', label:'PostgreSQL', color:'#3B82F6' },
    { id:'redis', label:'Redis\nCache/Queue', color:'#F59E0B' },
    { id:'deploy', label:'Deploy\nTarget', color:'#10B981' },
  ]
  const CORRECT = new Set([
    'browser→cdn',
    'cdn→api-gw',
    'api-gw→ws-server',
    'ws-server→app-server',
    'app-server→orchestrator',
    'orchestrator→llm',
    'orchestrator→postgres',
    'orchestrator→redis',
    'orchestrator→deploy',
  ])
  const WRONG: Record<string, string> = {
    'browser→api-gw': '🔥 Bypasses CDN. DDoS hits raw gateway. Infrastructure team paged at 2 AM.',
    'browser→llm': '💸 API keys exposed in browser. Hacker drains $4,200 in 3 hours.',
    'browser→postgres': '🧨 Database exposed to internet. Classic rookie mistake. Senior devs wince.',
    'cdn→ws-server': '❌ CDN cant route WebSocket traffic. Connection fails silently.',
    'api-gw→orchestrator': '⏰ Business logic bypassed. Unvalidated requests reach orchestrator.',
    'api-gw→llm': '💰 Direct LLM calls without orchestration. No context. $800 wasted.',
    'ws-server→postgres': '🔒 WS thread blocked by DB query. All other users frozen.',
    'ws-server→deploy': '🚀 Deployment triggered by WS events. Accidental prod push.',
    'orchestrator→browser': '🌀 Response sent directly to client. Skips all transforms.',
    'app-server→redis': '🔄 App server bypasses orchestrator. Inconsistent cache state.',
  }
  const ACT2_NODES = [
    { id:'browser',  label:'Browser\nClient', x:30, y:175, w:90, h:42, color:'#F97316' },
    { id:'http-lb',  label:'HTTP\nLB',        x:240, y:50, w:80, h:38, color:'#DC2626' },
    { id:'timeout',  label:'504\nTimeout',    x:440, y:50, w:80, h:38, color:'#DC2626' },
    { id:'ws-lb',    label:'WS\nLB',          x:160, y:270, w:80, h:38, color:a },
    { id:'ws-server',label:'WS\nServer',      x:310, y:270, w:88, h:42, color:'#8B5CF6' },
    { id:'orchestrator',label:'AI\nOrchestrator',x:450, y:270, w:100, h:42, color:'#06B6D4' },
    { id:'llm',      label:'LLM\nAPI',        x:600, y:200, w:80, h:38, color:'#F59E0B' },
    { id:'redis',    label:'Redis\nQueue',    x:600, y:270, w:80, h:38, color:'#10B981' },
    { id:'deploy',   label:'Preview\nDeploy', x:600, y:340, w:80, h:38, color:'#3B82F6' },
  ]
  const ACT2_CORRECT = new Set([
    'browser→ws-lb',
    'ws-lb→ws-server',
    'ws-server→orchestrator',
    'orchestrator→llm',
    'orchestrator→redis',
    'orchestrator→deploy',
  ])
  const ACT2_ACTIVE_PATHS: Record<string, string[]> = {
    planning: ['browser→ws-lb', 'ws-lb→ws-server'],
    coding: ['ws-server→orchestrator', 'orchestrator→llm'],
    testing: ['orchestrator→redis'],
    deploying: ['orchestrator→deploy'],
    done: ['browser→ws-lb', 'ws-lb→ws-server', 'ws-server→orchestrator', 'orchestrator→llm', 'orchestrator→redis', 'orchestrator→deploy'],
  }
  const correctCount = connections.filter(c => CORRECT.has(`${c.from}→${c.to}`)).length

  const handleConnection = (fromId: string, toId: string) => {
    const key = `${fromId}→${toId}`
    if (connections.some(c => c.from === fromId && c.to === toId)) return
    if (CORRECT.has(key)) {
      setConnections(prev => [...prev, { from: fromId, to: toId }])
      setSelectedNode(null)
    } else if (WRONG[key]) {
      const attempt = wrongAttempts + 1
      setConnections(prev => [...prev, { from: fromId, to: toId }])
      setLastConsequence(WRONG[key])
      setWrongAttempts(w => w + 1)
      setSelectedNode(null)
      setTimeout(() => {
        setLastConsequence(null)
        setWrongAttempts(w => w === attempt ? w : w)
        setConnections(prev => prev.filter(c => !(c.from === fromId && c.to === toId)))
      }, 3000)
    }
  }

  // ── Act 1 canvas pointer handlers (place, connect, drag) ──
  const handleCanvasPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = svg.getScreenCTM()!.inverse()
    const svgPt = pt.matrixTransform(ctm)

    const target = placedNodes.find(
      n => svgPt.x >= n.x && svgPt.x <= n.x + 90 && svgPt.y >= n.y && svgPt.y <= n.y + 52,
    )
    if (target) {
      dragRef.current = {
        nodeId: target.id,
        startClientX: e.clientX,
        startClientY: e.clientY,
        nodeStartX: target.x,
        nodeStartY: target.y,
        moved: false,
      }
    } else {
      dragRef.current = null
    }
  }

  const handleCanvasPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current
    if (!d) return
    const svg = svgRef.current
    if (!svg) return
    const dx = Math.abs(e.clientX - d.startClientX)
    const dy = Math.abs(e.clientY - d.startClientY)
    if (dx > 3 || dy > 3) {
      dragRef.current = { ...d, moved: true }
      const r = svg.getBoundingClientRect()
      const sx = 640 / r.width
      const sy = 340 / r.height
      setPlacedNodes(prev => prev.map(n =>
        n.id === d.nodeId
          ? { ...n, x: d.nodeStartX + (e.clientX - d.startClientX) * sx, y: d.nodeStartY + (e.clientY - d.startClientY) * sy }
          : n
      ))
    }
  }

  const handleCanvasPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current
    const svg = svgRef.current
    if (!svg) { dragRef.current = null; return }
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = svg.getScreenCTM()!.inverse()
    const svgPt = pt.matrixTransform(ctm)

    const target = placedNodes.find(
      n => svgPt.x >= n.x && svgPt.x <= n.x + 90 && svgPt.y >= n.y && svgPt.y <= n.y + 52,
    )

    if (d && !d.moved) {
      // Click on a node (no drag) — handle selection / connection
      if (target) {
        if (selectedNode === null) {
          setSelectedNode(target.id)
        } else if (selectedNode === target.id) {
          setSelectedNode(null)
        } else {
          handleConnection(selectedNode, target.id)
        }
      }
    } else if (!d) {
      // Click on empty canvas — place service from palette if one is selected
      if (!target && paletteService && !placedNodes.some(p => p.id === paletteService)) {
        const nodeX = Math.round(svgPt.x - 45)
        const nodeY = Math.round(svgPt.y - 26)
        setPlacedNodes(prev => [...prev, { id: paletteService, x: Math.max(0, nodeX), y: Math.max(0, nodeY) }])
        setPaletteService(null)
      }
    }

    dragRef.current = null
  }

  // ── Act 2 streaming effect ──
  const HTML_TOKENS = `<html>\n  <body>\n    <form class='login'>\n      <input type='email' />\n      <input type='password' />\n      <button>Sign in</button>\n    </form>\n  </body>\n</html>`

  useEffect(() => {
    if (!streaming) return
    const timers: (number|NodeJS.Timeout)[] = []

    const t1 = window.setTimeout(() => setStreamPhase('planning'), 500)
    timers.push(t1)

    const t2 = window.setTimeout(() => {
      setStreamPhase('coding')

      let charIndex = 0
      const t3 = window.setInterval(() => {
        if (charIndex < HTML_TOKENS.length) {
          setTokens(HTML_TOKENS.slice(0, charIndex + 1))
          charIndex++
        } else {
          window.clearInterval(t3)
          const t4 = window.setTimeout(() => {
            setStreamPhase('testing')
            const t5 = window.setTimeout(() => {
              setStreamPhase('deploying')
              const t6 = window.setTimeout(() => {
                setStreamPhase('done')
                setStreaming(false)
              }, 1500)
              timers.push(t6)
            }, 1500)
            timers.push(t5)
          }, 1000)
          timers.push(t4)
        }
      }, 60)
      timers.push(t3)
    }, 2000)
    timers.push(t2)

    return () => timers.forEach(id => window.clearTimeout(id as number))
  }, [streaming])

  const activePaths: Record<string, string[]> = {
    planning: ['browser→ws-server', 'ws-server→orchestrator'],
    coding: ['orchestrator→llm'],
    testing: ['orchestrator→redis'],
    deploying: ['orchestrator→deploy'],
    done: ['browser→ws-server', 'ws-server→orchestrator', 'orchestrator→llm', 'orchestrator→redis', 'orchestrator→deploy'],
  }

  const handleGenerateStream = () => {
    setStreaming(true)
    setStreamPhase('planning')
    setTokens('')
    setInterrupted(false)
    setTokensSaved(0)
  }

  const handleStopStream = () => {
    const saved = streamPhase === 'planning' ? 8400 : streamPhase === 'coding' ? 6200 : 3100
    setTokensSaved(saved)
    setInterrupted(true)
    setStreamPhase('interrupted')
    setStreaming(false)
  }

  const actPills = ['The Problem', 'Build It', 'Watch It Work']

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: act >= 1 ? '0' : 'clamp(16px,2.5vw,32px)',
        gap: 14,
        overflow: act === 2 ? 'hidden' : 'auto',
      }}
    >
      {/* ── ACT INDICATOR ── */}
      {/* <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          flexShrink: 0,
          justifyContent: 'center',
        }}
      >
        {actPills.map((label, i) => (
          <Fragment key={label}>
            {i > 0 && (
              <div
                style={{
                  width: 24,
                  height: 2,
                  background: act >= i ? a : '#D6D3D1',
                  borderRadius: 1,
                }}
              />
            )}
            <div
              style={{
                padding: '6px 16px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'var(--font-dm-sans)',
                background: act === i ? '#1C1917' : act > i ? a : '#F3F0EB',
                color: act >= i ? '#FFFBF7' : '#78716C',
                whiteSpace: 'nowrap' as const,
              }}
            >
              Act {i + 1} — {label}
            </div>
          </Fragment>
        ))}
      </div> */}

      {/* ════════════════════════════════════════════════
          ACT 0 — The Problem
          ════════════════════════════════════════════════ */}
      {act === 0 && (
        <>
          <div className="tryit-content" style={{ flex: 1, minHeight: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* ── LEFT: Mock AI Agent UI ── */}
            <div
              style={{
                background: '#1C1917',
                borderRadius: 14,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 700,
                      fontSize: 16,
                      color: '#FFFBF7',
                    }}
                  >
                    AI Coding Agent
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#A8A29E',
                      marginTop: 2,
                    }}
                  >
                    Prompt → Code generator
                  </div>
                </div>
                <div
                  style={{
                    background: '#FEF2F2',
                    color: '#DC2626',
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 9,
                    fontWeight: 800,
                    fontFamily: 'var(--font-dm-sans)',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.04em',
                  }}
                >
                  HTTP REST
                </div>
              </div>

              {/* Prompt input */}
              <div
                style={{
                  background: '#2A2A2A',
                  borderRadius: 8,
                  padding: 12,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: '#FFFBF7',
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
              >
                Build me a login page template
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={httpRunning}
                style={{
                  width: '100%',
                  minHeight: 40,
                  borderRadius: 10,
                  border: 'none',
                  background: httpRunning ? '#57534E' : '#EF4444',
                  color: '#FFFBF7',
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: httpRunning ? 'default' : 'pointer',
                  marginBottom: 12,
                }}
              >
                {httpRunning ? 'Generating...' : 'Generate with HTTP'}
              </button>

              {/* ── Progress area ── */}
              {httpRunning && (
                <div style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: elapsed > 8 ? '#EF4444' : '#A8A29E',
                      }}
                    >
                      {elapsed > 8
                        ? `${elapsed}s elapsed...`
                        : 'Waiting for server response...'}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: '#A8A29E',
                      }}
                    >
                      {httpProgress}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 999,
                      background: '#2A2A2A',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      animate={{ width: `${httpProgress}%` }}
                      transition={{ duration: 0.15 }}
                      style={{
                        height: '100%',
                        background: '#F97316',
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ── Error state ── */}
              {httpError && (
                <div
                  style={{
                    marginTop: 4,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      background: '#450A0A',
                      borderRadius: 10,
                      padding: 16,
                      textAlign: 'center' as const,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-syne)',
                        fontWeight: 800,
                        fontSize: 22,
                        color: '#EF4444',
                        marginBottom: 8,
                      }}
                    >
                      504 Gateway Timeout
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: 12,
                        color: '#FCA5A5',
                        lineHeight: 1.6,
                      }}
                    >
                      The cloud proxy dropped your connection.
                      <br />
                      User sees a blank screen. Task lost.
                    </div>
                    <div style={{ fontSize: 36, marginTop: 10 }}>💀</div>
                  </div>
                </div>
              )}

              {/* ── Polling cost counter ── */}
              {(httpRunning || httpError) && (
                <div
                  style={{
                    textAlign: 'center' as const,
                    marginTop: 4,
                    padding: '8px 12px',
                    background: 'rgba(239,68,68,0.08)',
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: '#EF4444',
                      fontWeight: 700,
                    }}
                  >
                    💸 ${pollCost.toFixed(3)} wasted on empty polls
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: '#A8A29E',
                      marginTop: 2,
                    }}
                  >
                    {pollRequests} HTTP requests returned nothing
                  </div>
                </div>
              )}
            </div>

            {httpError && (
              <svg viewBox="0 0 600 80" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <rect x="20" y="24" width="80" height="32" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.4" />
                <text x="60" y="45" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="9" fontWeight="700" fill="#DC2626">Browser</text>
                <path d="M100 40 C120 40 130 40 150 40" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="6 4" />
                <rect x="150" y="24" width="80" height="32" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.4" />
                <text x="190" y="45" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="9" fontWeight="700" fill="#DC2626">HTTP API</text>
                <path d="M230 40 C260 40 270 40 290 40" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="6 4" />
                <rect x="290" y="18" width="90" height="44" rx="6" fill="#450A0A" stroke="#EF4444" strokeWidth="2" />
                <text x="335" y="37" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="9" fontWeight="700" fill="#EF4444">504 Gateway</text>
                <text x="335" y="51" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="8" fontWeight="600" fill="#FCA5A5">Timeout</text>
                <text x="420" y="45" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="8" fill="#A8A29E">{pollRequests} failed polls</text>
              </svg>
            )}
          </div>

            {/* ── RIGHT: Explanation cards ── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {[
                {
                  emoji: '🪟',
                  title: 'The UX Black Box',
                  desc: 'User clicks Generate. Stares at a spinner for 22+ seconds. No progress. No feedback. 71% of users abandon after 10 seconds.',
                  impact: '71% abandonment rate',
                },
                {
                  emoji: '⏰',
                  title: 'Gateway Timeout',
                  desc: 'Cloudflare and AWS ALB kill connections after 30 seconds. Complex AI tasks take longer. Your app crashes. Your user loses everything.',
                  impact: 'Task lost, user gone',
                },
                {
                  emoji: '🌊',
                  title: 'Polling Overhead',
                  desc: 'To show any progress, devs add polling — 1 request per second. 10,000 users = 10,000 requests/second of pure server noise.',
                  impact: '$340/month in wasted compute',
                },
              ].map(card => (
                <div
                  key={card.title}
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 12,
                    padding: 14,
                  }}
                >
                  <div style={{ fontSize: 20, lineHeight: 1 }}>{card.emoji}</div>
                  <div
                    style={{
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 800,
                      fontSize: 13,
                      color: '#1C1917',
                      marginTop: 6,
                    }}
                  >
                    {card.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: '#57534E',
                      lineHeight: 1.55,
                      marginTop: 4,
                    }}
                  >
                    {card.desc}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 700,
                      background: '#FFF1F2',
                      color: '#BE123C',
                      display: 'inline-block',
                    }}
                  >
                    {card.impact}
                  </div>
                </div>
              ))}

              {(httpRunning || httpError) && (
                <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 12, display: 'grid', gap: 8 }}>
                  <MetricBar label="Abandonment risk" value={71} suffix="%" tone="#DC2626" />
                  <MetricBar label="Cost per session" value={240} suffix="¢" tone="#DC2626" />
                  <MetricBar label="Avg latency" value={22} suffix="s" tone="#DC2626" />
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom CTA — appears after error ── */}
          {httpError && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4, ease: 'easeOut' }}
              style={{ textAlign: 'center' as const, flexShrink: 0 }}
            >
              <button
                onClick={() => setAct(1)}
                style={{
                  padding: '14px 32px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#1C1917',
                  color: '#FFFBF7',
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Show me the WebSocket way →
              </button>
            </motion.div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════
          ACT 1 — Build It
          ════════════════════════════════════════════════ */}
      {act === 1 && (
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(260px, 0.6fr)', gap: 14 }} className='pt-8'>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }} >
          {/* ── TOP ROW ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 15,
                color: '#1C1917',
              }}
            >
              Build the architecture
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 12,
                color: a,
                fontWeight: 700,
              }}
            >
              {correctCount} / 9 correct connections
            </div>
            <button
              onClick={() => setHint(h => !h)}
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                border: 'none',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'var(--font-dm-sans)',
                background: hint ? a : '#F3F0EB',
                color: hint ? '#FFFBF7' : '#78716C',
                cursor: 'pointer',
              }}
            >
              💡 {hint ? 'Hide' : 'Show'} hint
            </button>
          </div>

          {/* ── CANVAS ── */}
          <div style={{ flex: 1, minHeight: 0, position: 'relative' as const }}>
            <svg
              ref={svgRef}
              viewBox="0 0 640 340"
              style={{
                width: '100%',
                height: '100%',
                background: '#FAFAF9',
                borderRadius: 14,
                border: '1px solid rgba(0,0,0,0.08)',
                display: 'block',
                cursor: paletteService ? 'crosshair' : 'default',
              }}
              onPointerDown={handleCanvasPointerDown}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
            >
              {/* Empty state prompt */}
              {placedNodes.length === 0 && (
                <g opacity={0.25}>
                  <text
                    x={320} y={155}
                    textAnchor="middle"
                    fontFamily="var(--font-dm-sans)"
                    fontSize={14}
                    fontWeight={600}
                    fill="#A8A29E"
                  >
                    Select a service from the palette
                  </text>
                  <text
                    x={320} y={177}
                    textAnchor="middle"
                    fontFamily="var(--font-dm-sans)"
                    fontSize={14}
                    fontWeight={600}
                    fill="#A8A29E"
                  >
                    then click the canvas to place it
                  </text>
                </g>
              )}

              {/* Hint layer — ghost correct lines */}
              {hint && placedNodes.length > 0 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ duration: 0.3 }}
                >
                  {Array.from(CORRECT).map(key => {
                    const [f, t] = key.split('→')
                    const fn = placedNodes.find(n => n.id === f)
                    const tn = placedNodes.find(n => n.id === t)
                    if (!fn || !tn) return null
                    return (
                      <path
                        key={`hint-${key}`}
                        d={`M${fn.x + 45} ${fn.y + 26} L${tn.x + 45} ${tn.y + 26}`}
                        stroke="rgba(0,0,0,0.12)"
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        fill="none"
                      />
                    )
                  })}
                </motion.g>
              )}

              {/* Connection lines */}
              {connections.map(conn => {
                const fn = placedNodes.find(n => n.id === conn.from)
                const tn = placedNodes.find(n => n.id === conn.to)
                if (!fn || !tn) return null
                const key = `${conn.from}→${conn.to}`
                const isCorrect = CORRECT.has(key)
                const isWrong = !!WRONG[key]
                return (
                  <motion.g
                    key={key}
                    animate={isWrong ? { x: [0, -3, 3, -2, 2, 0] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.path
                      d={`M${fn.x + 45} ${fn.y + 26} L${tn.x + 45} ${tn.y + 26}`}
                      fill="none"
                      stroke={isCorrect ? a : '#EF4444'}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeDasharray={isCorrect ? '8 8' : '4 3'}
                      animate={isCorrect ? { strokeDashoffset: [0, -32] } : {}}
                      transition={
                        isCorrect
                          ? { duration: 1.1, repeat: Infinity, ease: 'linear' }
                          : {}
                      }
                    />
                  </motion.g>
                )
              })}

              {/* Placed nodes */}
              {placedNodes.map(node => {
                const service = SERVICES.find(s => s.id === node.id)
                if (!service) return null
                const lines = service.label.split('\n')
                return (
                  <g key={node.id} style={{ cursor: 'pointer' }}>
                    {/* Selection ring */}
                    {selectedNode === node.id && (
                      <motion.circle
                        cx={node.x + 45}
                        cy={node.y + 26}
                        r={38}
                        fill="none"
                        stroke={a}
                        strokeWidth={2}
                        initial={{ opacity: 0.4, scale: 1 }}
                        animate={{ opacity: 0.2, scale: [1, 1.08, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    {/* Node rect */}
                    <rect
                      x={node.x}
                      y={node.y}
                      width={90}
                      height={52}
                      rx={10}
                      fill={selectedNode === node.id ? concept.color.bg : '#fff'}
                      stroke={service.color}
                      strokeWidth={selectedNode === node.id ? 2.5 : 1.5}
                    />
                    {/* Label */}
                    {lines.map((line, li) => (
                      <text
                        key={li}
                        x={node.x + 45}
                        y={node.y + (lines.length === 2 ? 20 + li * 18 : 30)}
                        textAnchor="middle"
                        fontFamily="var(--font-dm-sans)"
                        fontSize={10}
                        fontWeight={700}
                        fill="#1C1917"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                )
              })}
            </svg>

            {/* Wrong attempt consequence overlay */}
            {lastConsequence && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute' as const,
                  top: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#1C1917',
                  color: '#FFFBF7',
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: 12,
                  borderRadius: 10,
                  padding: '10px 18px',
                  whiteSpace: 'nowrap' as const,
                  zIndex: 10,
                  maxWidth: '90%',
                }}
              >
                {lastConsequence}
              </motion.div>
            )}
          </div>

          {/* ── BOTTOM ROW ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {wrongAttempts > 0 ? (
              <div
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 11,
                  color: '#EF4444',
                  fontWeight: 600,
                }}
              >
                {wrongAttempts} wrong connection{wrongAttempts !== 1 ? 's' : ''}
              </div>
            ) : (
              <div />
            )}
            {correctCount === 9 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <button
                  onClick={() => setAct(2)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 10,
                    border: 'none',
                    background: a,
                    color: '#FFFBF7',
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  ✓ Architecture complete — watch it work →
                </button>
              </motion.div>
            )}
          </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* ── Services Palette ── */}
            <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#A8A29E', fontWeight: 800, marginBottom: 8 }}>SERVICES</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                {SERVICES.map(service => {
                  const placed = placedNodes.some(p => p.id === service.id)
                  const selected = paletteService === service.id
                  return (
                    <button
                      key={service.id}
                      onClick={() => {
                        if (!placed) setPaletteService(selected ? null : service.id)
                      }}
                      disabled={placed}
                      style={{
                        padding: '5px 8px',
                        borderRadius: 6,
                        border: selected ? `1.5px solid ${service.color}` : '1px solid transparent',
                        background: selected ? `${service.color}12` : placed ? '#F5F5F4' : '#FAFAF9',
                        cursor: placed ? 'default' : 'pointer',
                        opacity: placed ? 0.45 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: 10,
                        fontWeight: 600,
                        color: placed ? '#A8A29E' : '#1C1917',
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: service.color, flexShrink: 0 }} />
                      <span>{placed ? '✓ ' : ''}{service.label.replace('\n', ' ')}</span>
                    </button>
                  )
                })}
              </div>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#A8A29E', fontWeight: 600 }}>Placed {placedNodes.length}/10</span>
                <div style={{ width: 80, height: 4, borderRadius: 999, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${(placedNodes.length / 10) * 100}%` }}
                    style={{ height: '100%', borderRadius: 999, background: a }}
                  />
                </div>
              </div>
            </div>

            {/* ── Connection Status ── */}
            <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#A8A29E', fontWeight: 800, marginBottom: 8 }}>CONNECTIONS</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: correctCount === 9 ? '#16A34A' : a, fontFamily: 'var(--font-syne)' }}>
                {correctCount}
                <span style={{ fontSize: 14, color: '#A8A29E' }}>/9 correct</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: 'rgba(0,0,0,0.08)', overflow: 'hidden', marginTop: 8 }}>
                <motion.div
                  animate={{ width: `${(correctCount / 9) * 100}%` }}
                  style={{ height: '100%', background: a, borderRadius: 999 }}
                />
              </div>
              {wrongAttempts > 0 && (
                <div style={{ marginTop: 8, fontSize: 10, color: '#EF4444', fontWeight: 600 }}>
                  {wrongAttempts} wrong attempt{wrongAttempts !== 1 ? 's' : ''}
                </div>
              )}
              {hint && (
                <div style={{ marginTop: 8, fontSize: 10, color: '#78716C', lineHeight: 1.45 }}>
                  💡 Hint: Follow the data flow: Browser → CDN → API Gateway → WS Server → App Server → Orchestrator → LLM / PostgreSQL / Redis / Deploy
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          ACT 2 — Watch It Work
          ════════════════════════════════════════════════ */}
      {act === 2 && (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: isMobile ? 'auto' : 'hidden',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.4fr) minmax(260px, 0.6fr)',
            gap: isMobile ? 8 : 14,
          }}
        >
          {/* ─── LEFT COLUMN: Side-by-side Browser + Architecture ─── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 8 : 14,
              minHeight: 0,
              overflow: isMobile ? 'visible' : 'hidden',
              flex: 1,
            }}
          >
            {/* Side-by-side: Browser (left) + Architecture (right) */}
            <div
              style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? 8 : 14,
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              {/* Left: Browser Preview */}
              <div
                style={{
                  background: '#1C1917',
                  borderRadius: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Header — traffic lights only */}
                <div
                  style={{
                    padding: isMobile ? '8px 12px' : '10px 14px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
                  </div>
                </div>

                {/* Messages area */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: isMobile ? 12 : 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: isMobile ? 8 : 10,
                  }}
                >
                  {/* Prompt */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(10px, 2vw, 11px)',
                      color: a,
                      fontWeight: 700,
                    }}
                  >
                    &gt; prompt: &apos;Build me a login page template&apos;
                  </div>

                  {(streamPhase === 'planning' ||
                    streamPhase === 'coding' ||
                    streamPhase === 'testing' ||
                    streamPhase === 'deploying' ||
                    streamPhase === 'done') && (
                    <motion.div
                      key={`planning-${streamPhase}`}
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(10px, 2vw, 11px)',
                        color: '#F59E0B',
                        fontWeight: 600,
                      }}
                    >
                      [STATUS] Planning file structure...
                    </motion.div>
                  )}

                  {(streamPhase === 'coding' ||
                    streamPhase === 'testing' ||
                    streamPhase === 'deploying' ||
                    streamPhase === 'done') && (
                    <motion.div
                      key={`coding-start-${streamPhase}`}
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(10px, 2vw, 11px)',
                        color: a,
                        fontWeight: 600,
                        marginBottom: tokens ? 8 : 0,
                      }}
                    >
                      [CODE_STREAM] Generating tokens...
                      </div>
                      {(streamPhase === 'coding') && tokens && (
                        <div
                          style={{
                            background: '#2A2A2A',
                            borderRadius: 6,
                            padding: 10,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'clamp(9px, 1.8vw, 10px)',
                          color: '#ADFA1D',
                            lineHeight: 1.6,
                            whiteSpace: 'pre' as const,
                            overflow: 'auto',
                            maxHeight: 140,
                          }}
                        >
                          {tokens}
                          {streamPhase === 'coding' && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                              style={{ color: '#ADFA1D' }}
                            >
                              |
                            </motion.span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {(streamPhase === 'testing' ||
                    streamPhase === 'deploying' ||
                    streamPhase === 'done') && (
                    <motion.div
                      key={`testing-${streamPhase}`}
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(10px, 2vw, 11px)',
                        color: '#F59E0B',
                        fontWeight: 600,
                      }}
                    >
                      [STATUS] Running test scripts...
                    </motion.div>
                  )}

                  {(streamPhase === 'deploying' || streamPhase === 'done') && (
                    <motion.div
                      key={`deploying-${streamPhase}`}
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(10px, 2vw, 11px)',
                        color: '#F59E0B',
                        fontWeight: 600,
                      }}
                    >
                      [STATUS] Deploying to preview...
                    </motion.div>
                  )}

                  {streamPhase === 'done' && (
                    <motion.div
                      key="done"
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'clamp(10px, 2vw, 11px)',
                          color: a,
                          fontWeight: 700,
                        }}
                      >
                        [SUCCESS] Live at preview.app/login-abc123
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'clamp(9px, 1.8vw, 10px)',
                          color: '#16A34A',
                        }}
                      >
                        Total time: 4.2s
                      </div>
                    </motion.div>
                  )}

                  {streamPhase === 'interrupted' && (
                    <motion.div
                      key="interrupted"
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'clamp(10px, 2vw, 11px)',
                          color: '#EF4444',
                          fontWeight: 700,
                        }}
                      >
                        [INTERRUPTED] Generation stopped by user
                      </div>
                      <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'clamp(9px, 1.8vw, 10px)',
                            color: '#16A34A',
                        }}
                      >
                        Tokens saved: ~{tokensSaved}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right: Architecture Diagram */}
              <div
                style={{
                  background: '#FAFAF9',
                  borderRadius: 14,
                  border: '1px solid rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  ...(isMobile ? { maxHeight: 320, minHeight: 200 } : { flex: 1 }),
                }}
              >
                <svg
                  viewBox="0 0 720 420"
                  style={{ width: '100%', height: '100%', display: 'block' }}
                >
                  {/* HTTP failure path (always dimmed) */}
                  <path
                    d="M120 196 L280 69"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth={1.5}
                    strokeDasharray="6 4"
                    opacity={0.35}
                  />
                  <path
                    d="M280 69 L480 69"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth={1.5}
                    strokeDasharray="6 4"
                    opacity={0.35}
                  />

                  {/* WS live paths */}
                  {Array.from(ACT2_CORRECT).map(key => {
                    const [f, t] = key.split('→')
                    const fn = ACT2_NODES.find(n => n.id === f)
                    const tn = ACT2_NODES.find(n => n.id === t)
                    if (!fn || !tn) return null
                    const isActive =
                      ACT2_ACTIVE_PATHS[streamPhase]?.includes(key) ||
                      (streamPhase === 'interrupted' &&
                        ACT2_ACTIVE_PATHS['coding']?.includes(key))
                    return (
                      <FlowLine
                        key={key}
                        path={`M${fn.x + fn.w/2} ${fn.y + fn.h/2} L${tn.x + tn.w/2} ${tn.y + tn.h/2}`}
                        active={isActive}
                        accent={a}
                      />
                    )
                  })}

                  {/* HTTP error nodes (dimmed) */}
                  {['http-lb', 'timeout'].map(id => {
                    const node = ACT2_NODES.find(n => n.id === id)
                    if (!node) return null
                    const lines = node.label.split('\n')
                    return (
                      <g key={node.id} opacity={0.5}>
                        <rect
                          x={node.x} y={node.y}
                          width={node.w} height={node.h}
                          rx={8} fill="#fff"
                          stroke={id === 'timeout' ? '#EF4444' : '#D6D3D1'}
                          strokeWidth={1.2}
                        />
                        {lines.map((line, li) => (
                          <text
                            key={li}
                            x={node.x + node.w/2}
                            y={node.y + (lines.length === 2 ? (isMobile ? 20 + li * 18 : 16 + li * 14) : (isMobile ? 31 : 27))}
                            textAnchor="middle"
                            fontFamily="var(--font-dm-sans)"
                            fontSize={isMobile ? 14 : 9}
                            fontWeight={700}
                            fill={id === 'timeout' ? '#DC2626' : '#A8A29E'}
                          >
                            {line}
                          </text>
                        ))}
                        {id === 'timeout' && (
                          <text
                            x={node.x + node.w/2}
                            y={node.y + node.h - 6}
                            textAnchor="middle"
                            fontFamily="var(--font-mono)"
                            fontSize={isMobile ? 11 : 7}
                            fill="#EF4444"
                            opacity={0.6}
                          >
                            gateway timeout
                          </text>
                        )}
                      </g>
                    )
                  })}

                  {/* WS live nodes */}
                  {ACT2_NODES.filter(n => !['http-lb', 'timeout'].includes(n.id) && n.id !== 'browser').map(node => {
                    const lines = node.label.split('\n')
                    const isNodeActive =
                      ACT2_ACTIVE_PATHS[streamPhase]?.some(p => p.includes(node.id)) ||
                      (streamPhase === 'interrupted' &&
                        ACT2_ACTIVE_PATHS['coding']?.some(p => p.includes(node.id)))
                    return (
                      <g key={node.id} opacity={isNodeActive ? 1 : 0.5}>
                        <rect
                          x={node.x} y={node.y}
                          width={node.w} height={node.h}
                          rx={8} fill="#fff"
                          stroke={node.color}
                          strokeWidth={isNodeActive ? 1.5 : 1}
                        />
                        {lines.map((line, li) => (
                          <text
                            key={li}
                            x={node.x + node.w/2}
                            y={node.y + (lines.length === 2 ? (isMobile ? 20 + li * 18 : 16 + li * 14) : (isMobile ? 31 : 27))}
                            textAnchor="middle"
                            fontFamily="var(--font-dm-sans)"
                            fontSize={isMobile ? 14 : 9}
                            fontWeight={700}
                            fill={isNodeActive ? '#1C1917' : '#A8A29E'}
                          >
                            {line}
                          </text>
                        ))}
                        <motion.circle
                          cx={node.x + node.w - 8}
                          cy={node.y + 9}
                          r={3.5}
                          fill={isNodeActive ? '#16A34A' : '#D6D3D1'}
                          animate={isNodeActive ? { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] } : {}}
                          transition={isNodeActive ? { duration: 1.2, repeat: Infinity } : {}}
                        />
                      </g>
                    )
                  })}

                  {/* Browser client (shared origin) */}
                  <g>
                    <rect x={30} y={175} width={90} height={42} rx={8} fill="#fff" stroke="#F97316" strokeWidth={1.4} />
                    <text x={75} y={isMobile ? 196 : 193} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={isMobile ? 15 : 10} fontWeight={700} fill="#1C1917">Browser</text>
                    <text x={75} y={isMobile ? 213 : 207} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={isMobile ? 14 : 9} fill="#78716C">Client</text>
                  </g>

                  {/* Pulsing glow on active target node */}
                  {Array.from(ACT2_CORRECT).map(key => {
                    const isActive =
                      ACT2_ACTIVE_PATHS[streamPhase]?.includes(key) ||
                      (streamPhase === 'interrupted' &&
                        ACT2_ACTIVE_PATHS['coding']?.includes(key))
                    if (!isActive) return null
                    const [, t] = key.split('→')
                    const tn = ACT2_NODES.find(n => n.id === t)
                    if (!tn) return null
                    return (
                      <motion.circle
                        key={`glow-${t}`}
                        cx={tn.x + tn.w/2}
                        cy={tn.y + tn.h/2}
                        r={Math.max(tn.w, tn.h) * 0.6}
                        fill="none"
                        stroke={a}
                        strokeWidth={1.5}
                        opacity={0.3}
                        animate={{ scale: [1, 1.06, 1], opacity: [0.15, 0.35, 0.15] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )
                  })}

                  {/* Phase annotation */}
                  <g transform="translate(10, 14)">
                    <rect x={0} y={0} width={isMobile ? 120 : 92} height={isMobile ? 24 : 18} rx={4} fill={a} opacity={0.12} />
                    <text x={6} y={isMobile ? 17 : 13} fontFamily="var(--font-mono)" fontSize={isMobile ? 11 : 8} fontWeight={700} fill={a}>
                      {streamPhase === 'idle' ? 'waiting...' : `[ ${streamPhase} ]`}
                    </text>
                  </g>

                  {/* Protocol badge */}
                  {streamPhase !== 'idle' && (
                    <g transform={`translate(${isMobile ? 580 : 620}, ${isMobile ? 378 : 390})`}>
                      <rect x={0} y={0} width={isMobile ? 110 : 82} height={isMobile ? 24 : 18} rx={4} fill="#16A34A" opacity={0.12} />
                      <text x={6} y={isMobile ? 17 : 13} fontFamily="var(--font-mono)" fontSize={isMobile ? 11 : 8} fontWeight={700} fill="#16A34A">
                        ⚡ WebSocket
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Footer buttons */}
            <div
              style={{
                padding: isMobile ? '8px 12px' : '10px 14px',
                background: '#1C1917',
                borderRadius: 14,
                display: 'flex',
                gap: isMobile ? 6 : 8,
                flexShrink: 0,
              }}
            >
              <button
                onClick={handleGenerateStream}
                disabled={streaming || streamPhase === 'done'}
                style={{
                  flex: 1,
                  minHeight: isMobile ? 44 : 36,
                  borderRadius: 8,
                  border: 'none',
                  background:
                    streaming || streamPhase === 'done' ? '#57534E' : a,
                  color: '#FFFBF7',
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: 'clamp(10px, 1.5vw, 12px)',
                  cursor:
                    streaming || streamPhase === 'done'
                      ? 'default'
                      : 'pointer',
                }}
              >
                ▶ Generate
              </button>
              {streaming && streamPhase !== 'done' && (
                <button
                  onClick={handleStopStream}
                  style={{
                    flex: 1,
                    minHeight: isMobile ? 44 : 36,
                    borderRadius: 8,
                    border: 'none',
                    background: '#EF4444',
                    color: '#FFFBF7',
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 700,
                    fontSize: 'clamp(10px, 1.5vw, 12px)',
                    cursor: 'pointer',
                  }}
                >
                  ⏹ Stop
                </button>
              )}
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Metrics + Cost ─── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 8 : 12,
              minHeight: 0,
              overflowY: 'auto',
            }}
          >

            {/* Live Metrics */}
            {(streamPhase !== 'idle') && (
              <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 'clamp(8px, 2vw, 12px)', display: 'grid', gap: 10 }}>
                <MetricBar label="Latency" value={streamPhase === 'done' ? 5 : streamPhase === 'coding' ? 42 : 18} suffix="ms" tone={streamPhase === 'done' ? '#16A34A' : '#D97706'} />
                <MetricBar label="Token rate" value={streamPhase === 'coding' ? 940 : streamPhase === 'done' ? 1280 : 0} suffix="/s" tone={a} />
                <MetricBar label="Cost per session" value={streamPhase === 'done' || streamPhase === 'interrupted' ? 18 : streamPhase === 'coding' ? 9 : 0} suffix="¢" tone={a} />
              </div>
            )}

            {/* Cost comparison */}
            <div
              style={{
                background: '#F5F3EE',
                borderRadius: 12,
                padding: isMobile ? 'clamp(10px, 3vw, 16px)' : 16,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: 'clamp(11px, 2vw, 13px)',
                  color: '#1C1917',
                  marginBottom: isMobile ? 8 : 12,
                }}
              >
                Cost Reality
              </div>

              <div style={{ display: 'grid', gap: 8 }}>
                {[
                  { label: '504 errors', http: 'Frequent', ws: 'Never', httpPct: 95, wsPct: 0 },
                  { label: 'User wait', http: '22s spinner', ws: 'Live stream', httpPct: 100, wsPct: 0 },
                  { label: 'Cost/session', http: '$2.40', ws: '$0.18', httpPct: 100, wsPct: 8 },
                  { label: 'Interruptible', http: '❌', ws: '✅', httpPct: 100, wsPct: 0 },
                  { label: 'Token waste', http: '100%', ws: '~8,400 saved', httpPct: 100, wsPct: 14 },
                ].map(row => (
                  <div key={row.label}>
                    <div style={{ fontSize: 'clamp(8px, 1.5vw, 9px)', color: '#A8A29E', fontWeight: 600, marginBottom: 3 }}>{row.label}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      <div>
                        <div style={{ height: 5, borderRadius: 999, background: '#FEF2F2', overflow: 'hidden' }}>
                          <motion.div
                            animate={{ width: `${row.httpPct}%` }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            style={{ height: '100%', borderRadius: 999, background: '#EF4444' }}
                          />
                        </div>
                        <div style={{ fontSize: 'clamp(8px, 1.5vw, 9px)', color: '#DC2626', fontWeight: 700, marginTop: 2 }}>{row.http}</div>
                      </div>
                      <div>
                        <div style={{ height: 5, borderRadius: 999, background: `${a}14`, overflow: 'hidden' }}>
                          <motion.div
                            animate={{ width: `${row.wsPct}%` }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            style={{ height: '100%', borderRadius: 999, background: a }}
                          />
                        </div>
                        <div style={{ fontSize: 'clamp(8px, 1.5vw, 9px)', color: a, fontWeight: 700, marginTop: 2 }}>{row.ws}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                style={{
                  textAlign: 'center' as const,
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 800,
                    fontSize: 'clamp(20px, 2.5vw, 28px)',
                    color: a,
                  }}
                >
                  13× cheaper per session
                </div>
              </motion.div>

              {/* Interrupted savings banner */}
              {streamPhase === 'interrupted' && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    marginTop: 12,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: concept.color.bg,
                    border: `1px solid ${concept.color.border}`,
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: 12,
                    color: a,
                    fontWeight: 600,
                    textAlign: 'center' as const,
                  }}
                >
                  You just saved ~{tokensSaved} tokens by interrupting — that&apos;s real money.
                </motion.div>
              )}
            </div>

            {/* Complete button */}
            {(streamPhase === 'done' || streamPhase === 'interrupted') && (
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={onComplete}
                style={{
                  width: '100%',
                  minHeight: isMobile ? 48 : 44,
                  borderRadius: 10,
                  border: 'none',
                  background: a,
                  color: '#FFFBF7',
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: 'clamp(11px, 1.8vw, 13px)',
                  cursor: 'pointer',
                }}
              >
                ✓ I understand WebSocket streaming
              </motion.button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
