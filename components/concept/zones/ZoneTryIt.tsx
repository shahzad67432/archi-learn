'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Concept } from '@/data/concepts'

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
        <span style={{ fontSize: 10, color: '#78716C', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 10, color: tone, fontWeight: 700 }}>{value}{suffix}</span>
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
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 15, color: '#1C1917' }}>Try It</span>
            <span style={{ background: concept.color.bg, border: `1px solid ${concept.color.border}`, color: a, borderRadius: 999, padding: '2px 9px', fontSize: 10, fontWeight: 700 }}>
              Production Lab
            </span>
          </div>
          <div style={{ fontSize: 11, color: '#78716C', lineHeight: 1.4 }}>
            Stabilize a live token-price orderbook using the WebSocket patterns from the previous zones.
          </div>
        </div>
        <div style={{ flexShrink: 0, minWidth: 130 }}>
          <div style={{ fontSize: 10, color: '#A8A29E', fontWeight: 600, marginBottom: 5 }}>MISSIONS {completed.size}/{MISSIONS.length}</div>
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${(completed.size / MISSIONS.length) * 100}%` }}
              style={{ height: '100%', background: a, borderRadius: 999 }}
            />
          </div>
        </div>
      </div>

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

          <div className="tryit-orderbook-wrap">
            <Orderbook price={price} streamHealthy={streamHealthy} podBStale={podBStale} accent={a} />
          </div>
        </div>

        <div className="tryit-side">
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
        </div>
      </div>
    </div>
  )
}
