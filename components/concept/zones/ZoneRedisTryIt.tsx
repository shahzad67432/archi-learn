'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Concept } from '@/data/concepts'
import { MetricBar } from './tryit/MetricBar'

interface Props {
  concept: Concept
  onComplete: () => void
  onNext: () => void
}

type ReqStatus = 'fast' | 'slow' | 'stale' | 'error'

const MISSIONS = [
  {
    title: 'Stop hammering the database',
    brief: 'Every product page request hits PostgreSQL directly. 500 req/s, DB at 95% CPU, P99 latency is 320ms. The database is the bottleneck.',
    action: 'Add Redis cache',
  },
  {
    title: 'Fix stale inventory',
    brief: 'Two admins update stock simultaneously. Direct cache updates cause race conditions — shoppers see wrong inventory counts.',
    action: 'Switch to write-delete',
  },
  {
    title: 'Survive the flash sale',
    brief: 'A popular product cache key expires mid-flash-sale. 1000 concurrent requests all miss — the database spikes to 100%.',
    action: 'Add mutex lock',
  },
  {
    title: 'Auto-clean stale keys',
    brief: 'No TTL on cached product descriptions means data is weeks old. Or TTL is too short causing 30% hit rate.',
    action: 'Set TTL policies',
  },
]

function Node({
  label,
  sub,
  x,
  y,
  active,
  danger,
  accent,
}: {
  label: string
  sub?: string
  x: number
  y: number
  active?: boolean
  danger?: boolean
  accent: string
}) {
  return (
    <motion.g animate={{ opacity: active === false ? 0.35 : 1 }}>
      <rect
        x={x} y={y}
        width="120" height="44" rx="10"
        fill={danger ? '#FEF2F2' : '#FFFBF7'}
        stroke={danger ? '#EF4444' : active ? accent : '#D6D3D1'}
        strokeWidth="1.4"
      />
      <text x={x + 60} y={y + 18} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="11" fontWeight="700" fill={danger ? '#DC2626' : '#1C1917'}>
        {label}
      </text>
      {sub && (
        <text x={x + 60} y={y + 32} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="#A8A29E">
          {sub}
        </text>
      )}
    </motion.g>
  )
}

function FlowLine({ path, active, danger, accent, delay = 0 }: {
  path: string
  active?: boolean
  danger?: boolean
  accent?: string
  delay?: number
}) {
  const color = danger ? '#EF4444' : active ? '#16A34A' : '#D6D3D1'
  return (
    <motion.path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={active ? 2 : 1.2}
      strokeDasharray={danger ? '5,3' : 'none'}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, delay }}
    />
  )
}

export default function ZoneRedisTryIt({ concept, onComplete, onNext }: Props) {
  const a = concept.color.accent

  const [mission, setMission] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [cacheActive, setCacheActive] = useState(false)
  const [writeDelete, setWriteDelete] = useState(false)
  const [stampedeProtection, setStampedeProtection] = useState(false)
  const [ttlSet, setTtlSet] = useState(false)
  const [logs, setLogs] = useState<string[]>([
    'Incident opened: Product API is degrading under traffic.',
    'P99 latency at 320ms — database CPU at 95%.',
  ])
  const [showProblem, setShowProblem] = useState([false, false, false, false])
  const logEndRef = useRef<HTMLDivElement>(null)

  const allComplete = completed.size === MISSIONS.length
  const systemHealthy = cacheActive && writeDelete && stampedeProtection && ttlSet

  const metrics = useMemo(() => {
    if (!cacheActive) return { dbLoad: 95, latency: 320, hitRate: 0, memory: 22 }
    if (!writeDelete) return { dbLoad: 48, latency: 86, hitRate: 62, memory: 34 }
    if (!stampedeProtection) return { dbLoad: 72, latency: 120, hitRate: 70, memory: 38 }
    if (!ttlSet) return { dbLoad: 35, latency: 42, hitRate: 30, memory: 44 }
    return { dbLoad: 18, latency: 12, hitRate: 91, memory: 52 }
  }, [cacheActive, writeDelete, stampedeProtection, ttlSet])

  const requests: { name: string; status: ReqStatus }[] = [
    { name: 'GET /products/featured', status: !cacheActive ? 'slow' : systemHealthy ? 'fast' : ttlSet ? 'fast' : 'stale' },
    { name: 'GET /inventory/shoes', status: !cacheActive ? 'slow' : !writeDelete ? 'stale' : systemHealthy ? 'fast' : 'fast' },
    { name: 'GET /products/trending', status: !cacheActive ? 'slow' : !stampedeProtection ? 'error' : systemHealthy ? 'fast' : 'fast' },
    { name: 'GET /products/live', status: !cacheActive ? 'error' : !ttlSet ? 'stale' : systemHealthy ? 'fast' : 'fast' },
  ]

  const addLog = (line: string) => {
    setLogs(prev => [`${new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })} ${line}`, ...prev].slice(0, 7))
  }

  const completeMission = (index: number) => {
    setCompleted(prev => new Set([...prev, index]))
    if (index < MISSIONS.length - 1) setMission(index + 1)
  }

  const handlePrimaryAction = () => {
    if (mission === 0) {
      if (!showProblem[0]) {
        setShowProblem(prev => { const c = [...prev]; c[0] = true; return c })
        addLog('Traffic spike: 500 req/s hitting PostgreSQL directly.')
        return
      }
      setCacheActive(true)
      addLog('Redis cache-aside enabled: requests now check cache first.')
      completeMission(0)
      return
    }

    if (mission === 1) {
      if (!showProblem[1]) {
        setShowProblem(prev => { const c = [...prev]; c[1] = true; return c })
        addLog('Concurrent writes: two admins updating inventory cache — race condition detected.')
        return
      }
      setWriteDelete(true)
      addLog('Write-delete pattern applied: cache invalidated on DB write, next read fetches fresh data.')
      completeMission(1)
      return
    }

    if (mission === 2) {
      if (!showProblem[2]) {
        setShowProblem(prev => { const c = [...prev]; c[2] = true; return c })
        addLog('Flash sale triggered: popular product cache expired — 1000 concurrent misses!')
        return
      }
      setStampedeProtection(true)
      addLog('Mutex lock added: only one request queries DB per cache miss — others wait for it.')
      completeMission(2)
      return
    }

    if (mission === 3) {
      if (!showProblem[3]) {
        setShowProblem(prev => { const c = [...prev]; c[3] = true; return c })
        addLog('TTL expiry: cached product descriptions are weeks old — showing stale data.')
        return
      }
      setTtlSet(true)
      addLog('TTL policies applied: 3600s for stable data, 60s for trending, no-expiry for reference.')
      completeMission(3)
    }
  }

  const finishZone = () => {
    localStorage.setItem(`zone-complete-${concept.slug}-3`, 'true')
    onComplete()
    onNext()
  }

  const primaryLabel = !showProblem[mission]
    ? MISSIONS[mission]?.action === 'Add Redis cache'
      ? 'Simulate traffic spike'
      : MISSIONS[mission]?.action === 'Switch to write-delete'
      ? 'Simulate concurrent writes'
      : MISSIONS[mission]?.action === 'Add mutex lock'
      ? 'Trigger flash sale'
      : 'Simulate TTL expiry'
    : MISSIONS[mission]?.action

  /* SVG layout coordinates (720×320 viewBox):
     Users: circles at (60-116,170), rightmost ≈130
     API Gateway: x=140-260, y=140-184, center (200,162), right edge (260,162)
     App Server:  x=280-400, y=140-184, center (340,162), right edge (400,162)
     Redis:       x=440-560, y=32-78,  left edge (440,55),  bottom (500,78)
     PostgreSQL:  x=440-560, y=180-226, left edge (440,203), right edge (560,203)
  */

  const statusColor = (status: ReqStatus) => {
    switch (status) {
      case 'fast': return '#16A34A'
      case 'slow': return '#D97706'
      case 'stale': return '#DC2626'
      case 'error': return '#DC2626'
    }
  }

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
      {/* TOP BAR */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 15, color: '#1C1917' }}>
            Try It
          </span>
          <span style={{
            background: concept.color.bg,
            border: `1px solid ${concept.color.border}`,
            color: a,
            borderRadius: 999,
            padding: '2px 9px',
            fontSize: 10,
            fontWeight: 700,
          }}>
            Production Lab
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: 11,
          color: '#A8A29E',
          fontWeight: 600,
        }}>
          {completed.size} / {MISSIONS.length} fixed
        </span>
      </div>

      {/* MAIN CONTENT */}
      <div className="tryit-content" style={{ flex: 1, minHeight: 0 }}>
        {/* LEFT COLUMN / TOP ROW */}
        <div className="tryit-main">
          {/* SVG ARCHITECTURE DIAGRAM */}
          <div className="tryit-canvas-card">
            <svg viewBox="0 0 720 320" style={{ width: '100%', height: '100%', display: 'block' }}>
              <rect x="0" y="0" width="720" height="320" fill="#FFFDF9" />

              {/* Background grid areas */}
              {cacheActive && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <rect x="430" y="130" width="180" height="160" rx="12" fill="#F0FDF4" fillOpacity="0.12" stroke="#16A34A" strokeWidth="0.5" strokeDasharray="4,4" />
                  <text x="440" y="148" fontFamily="var(--font-mono)" fontSize="7" fill="#16A34A" fontWeight={700} letterSpacing="0.08em">
                    CACHE LAYER — REDIS
                  </text>
                </motion.g>
              )}

              {/* ── FLOW LINES ── */}
              {!cacheActive ? (
                <>
                  {/* Request: Users → API Gateway → App Server → PostgreSQL */}
                  <FlowLine path="M130,170 L260,162 L400,162 Q440,162 440,203 L500,203"
                    active danger accent={a} />
                  {/* Response: PostgreSQL → App Server → API Gateway → Users */}
                  <FlowLine path="M500,203 Q500,162 400,162 L260,162 L130,170"
                    active danger accent={a} />
                </>
              ) : (
                <>
                  {/* Request: Users → API Gateway → App Server */}
                  <FlowLine path="M130,170 L260,162 L340,162"
                    active accent={a} delay={0.1} />

                  {/* Cache check: App Server → Redis (up-right curve into Redis left) */}
                  <FlowLine path="M400,162 Q430,162 430,110 Q430,55 440,55"
                    active accent={a} delay={0.3} />

                  {/* Hit response: Redis → App Server → Users */}
                  {(cacheActive) && (
                    <FlowLine path="M440,55 Q430,55 430,110 Q430,162 400,162 L260,162 L130,170"
                      active={systemHealthy}
                      danger={false}
                      accent={a} delay={0.5} />
                  )}

                  {/* Miss: Redis bottom → PostgreSQL */}
                  <FlowLine path="M500,78 Q500,130 500,203"
                    active={!systemHealthy}
                    danger={!stampedeProtection}
                    accent={a} delay={0.4} />

                  {/* DB response: PostgreSQL → App Server → Users */}
                  <FlowLine path="M500,203 Q500,162 400,162 L260,162 L130,170"
                    active={!systemHealthy}
                    danger={!stampedeProtection}
                    accent={a} delay={0.6} />

                  {/* Store: PostgreSQL right → Redis right (arc around right side) */}
                  {(cacheActive && !systemHealthy) && (
                    <FlowLine path="M560,203 Q630,203 630,130 Q630,78 560,78"
                      active danger={false} accent={a} delay={0.7} />
                  )}
                </>
              )}

              {/* ── NODES ── */}
              {/* Users */}
              <g>
                {[0, 1, 2].map(i => (
                  <circle key={i} cx={60 + i * 28} cy={170} r="14" fill={systemHealthy ? '#F0FDF4' : '#F5F5F4'} stroke={systemHealthy ? '#16A34A' : '#D6D3D1'} strokeWidth="1.2" />
                ))}
                {['U', 's', 'r'].map((l, i) => (
                  <text key={i} x={60 + i * 28} y={174} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="7" fontWeight="700" fill={systemHealthy ? '#16A34A' : '#A8A29E'}>{l}</text>
                ))}
                <text x={102} y={174} fontFamily="var(--font-dm-sans)" fontSize="9" fill="#A8A29E" fontWeight={600}>Users</text>
              </g>

              {/* API Gateway */}
              <Node label="API Gateway" sub={`${metrics.latency}ms`} x={140} y={140} active accent={a} danger={!cacheActive && metrics.latency > 200} />

              {/* App Server */}
              <Node label="App Server" sub={`${metrics.dbLoad}% CPU`} x={280} y={140} active accent={a} danger={metrics.dbLoad > 70} />

              {/* Redis */}
              <motion.g animate={{ opacity: cacheActive ? 1 : 0.3 }}>
                <rect x="440" y="32" width="120" height="46" rx="12" fill={cacheActive ? '#F0FDF4' : '#F5F5F4'} stroke={cacheActive ? '#16A34A' : '#D6D3D1'} strokeWidth="1.4" />
                <text x="500" y="58" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="12" fontWeight="800" fill={cacheActive ? '#047857' : '#A8A29E'}>Redis</text>
                {cacheActive && (
                  <>
                    <text x="500" y="70" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="#16A34A">{metrics.hitRate}% hit</text>
                    <motion.circle cx="500" cy="55" r="38" fill="none" stroke="#16A34A" strokeWidth="0.6"
                      animate={{ r: [38, 48], opacity: [0.3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                  </>
                )}
              </motion.g>

              {/* PostgreSQL */}
              <motion.g animate={{ opacity: 1 }}>
                <rect x="440" y="180" width="120" height="46" rx="12" fill={metrics.dbLoad > 70 ? '#FEF2F2' : '#F5F5F4'} stroke={metrics.dbLoad > 70 ? '#EF4444' : '#D6D3D1'} strokeWidth="1.4" />
                <text x="500" y="206" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="11" fontWeight="800" fill={metrics.dbLoad > 70 ? '#DC2626' : '#1C1917'}>PostgreSQL</text>
                <text x="500" y="218" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="#A8A29E">{metrics.dbLoad}% loaded</text>
                {metrics.dbLoad > 70 && (
                  <motion.rect x="442" y="182" width="116" height="42" rx="10" fill="none" stroke="#EF4444" strokeWidth="1"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.g>

              {/* Labels */}
              <text x="710" y="30" textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize="6" fill="#C4B49E" opacity="0.4" letterSpacing="0.1em">
                CACHE-ASIDE
              </text>

              {/* Cache store indicator */}
              {(cacheActive && !systemHealthy) && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  <rect x="600" y="110" width="80" height="20" rx="4" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="0.6" />
                  <text x="640" y="123" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="#3B82F6" fontWeight={700}>STORE + TTL</text>
                </motion.g>
              )}

              {systemHealthy && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <rect x="600" y="130" width="80" height="20" rx="4" fill="#F0FDF4" stroke="#16A34A" strokeWidth="0.6" />
                  <text x="640" y="143" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="#16A34A" fontWeight={700}>ALL GREEN ✓</text>
                </motion.g>
              )}
            </svg>
          </div>

          {/* BOTTOM ROW — Event log + request experience */}
          <div className="tryit-main-bottom">
            {/* Event log */}
            <div className="tryit-event-log">
              <div ref={logEndRef} className="tryit-log" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#1C1917', borderRadius: 12, padding: 12, overflow: 'auto' }}>
              <div style={{ fontSize: 10, color: '#A8A29E', fontWeight: 800, marginBottom: 8 }}>EVENT LOG</div>
              <div style={{ display: 'grid', gap: 6 }}>
                {logs.map((line, i) => (
                  <div key={`${line}-${i}`} style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: i === 0 ? '#ADFA1D' : '#D6D3D1',
                    lineHeight: 1.45,
                  }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN / BOTTOM ON MOBILE */}
        <div className="tryit-side">
          {/* Mission card */}
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
              {allComplete ? 'All missions complete' : showProblem[mission] ? MISSIONS[mission]?.action : primaryLabel}
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

          {/* Metrics */}
          <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 12, display: 'grid', gap: 10 }}>
            <MetricBar label="P99 Latency" value={metrics.latency} suffix="ms" tone={metrics.latency > 200 ? '#DC2626' : metrics.latency > 60 ? '#D97706' : '#16A34A'} />
            <MetricBar label="DB load" value={metrics.dbLoad} suffix="%" tone={metrics.dbLoad > 70 ? '#DC2626' : metrics.dbLoad > 40 ? '#D97706' : '#16A34A'} />
            <MetricBar label="Cache hit rate" value={metrics.hitRate} suffix="%" tone={metrics.hitRate < 40 ? '#DC2626' : metrics.hitRate < 70 ? '#D97706' : '#16A34A'} />
            <MetricBar label="Memory usage" value={metrics.memory} suffix="%" tone={metrics.memory > 70 ? '#DC2626' : metrics.memory > 50 ? '#D97706' : '#16A34A'} />
          </div>

          {/* Request experience */}
          <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 10, color: '#A8A29E', fontWeight: 800, marginBottom: 8 }}>REQUEST EXPERIENCE</div>
            <div style={{ display: 'grid', gap: 7 }}>
              {requests.map(req => {
                const color = statusColor(req.status)
                return (
                  <div key={req.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#1C1917', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{req.name}</span>
                    <span style={{ color, background: `${color}14`, border: `1px solid ${color}33`, borderRadius: 999, padding: '2px 8px', fontSize: 9, fontWeight: 800, textTransform: 'uppercase' }}>
                      {req.status}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
