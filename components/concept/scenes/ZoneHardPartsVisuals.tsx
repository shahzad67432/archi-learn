'use client'
import { motion } from 'framer-motion'

/* ── 1. Zombie Connections ── */

interface ZombieProps {
  accentColor: string
  heartbeatActive: boolean
}

function PhoneIcon({ x, y, color, signal }: { x: number; y: number; color: string; signal: number }) {
  const bars = [
    { h: 5, act: signal >= 1 },
    { h: 8, act: signal >= 2 },
    { h: 11, act: signal >= 3 },
  ]
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width="14" height="22" rx="3" fill="#1C1917" />
      <rect x="2" y="3" width="10" height="16" rx="1.5" fill={color} opacity="0.9" />
      <circle cx="7" cy="21" r="1.2" fill="#A8A29E" />
      {/* Signal bars */}
      {bars.map((b, i) => (
        <rect key={i} x={16 + i * 3.5} y={12 - b.h} width="2.5" height={b.h} rx="0.8"
          fill={b.act ? color : '#D4CFC9'} opacity={b.act ? 0.9 : 0.3} />
      ))}
    </g>
  )
}

const COLORS = { alive: '#22C55E', idle: '#A8A29E', zombie: '#EF4444' }

export function ZombieVisual({ accentColor, heartbeatActive }: ZombieProps) {
  const serverX = 215, serverY = 30, serverW = 78, serverH = 50
  const lineEndX = serverX
  const lineStartX = 62

  const connections: { y: number; label: string; type: 'alive' | 'idle' | 'zombie'; signal: number }[] = [
    { y: 35,  label: 'ACTIVE',  type: 'alive' , signal: 3 },
    { y: 58,  label: 'ACTIVE',  type: 'alive' , signal: 3 },
    { y: 81,  label: 'ACTIVE',  type: 'alive' , signal: 2 },
    { y: 104, label: 'IDLE',    type: 'idle'  , signal: 2 },
    { y: 127, label: 'IDLE',    type: 'idle'  , signal: 1 },
    { y: 150, label: 'ZOMBIE',  type: 'zombie', signal: 0 },
  ]

  const pongCount = heartbeatActive ? 5 : 3
  const idleCount = heartbeatActive ? 0 : 2
  const zombieCount = heartbeatActive ? 0 : 1
  const cleanedCount = heartbeatActive ? 1 : 0

  const memW = heartbeatActive ? 64 : 115
  const memColor = heartbeatActive ? '#22C55E' : '#EF4444'
  const memLabel = heartbeatActive ? '300 MB / 1 GB' : '900 MB / 1 GB'
  const fdW = heartbeatActive ? 52 : 95
  const fdColor = heartbeatActive ? '#22C55E' : '#F97316'
  const fdLabel = heartbeatActive ? '38 / 256' : '198 / 256'
  const redisW = heartbeatActive ? 44 : 82
  const redisColor = heartbeatActive ? '#22C55E' : '#F97316'
  const redisLabel = heartbeatActive ? '8 / 50' : '42 / 50'

  const zombieFadeId = 'zfade'

  return (
    <svg viewBox="0 0 400 220" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <filter id="z-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id={zombieFadeId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#EF4444" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── Header ── */}
      <text x={12} y={15} fontFamily="var(--font-dm-sans)" fontSize={7} fill="#EF4444" fontWeight={700} letterSpacing="0.15em">
        💀 ZOMBIE CONNECTIONS
      </text>
      <text x={200} y={15} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#A8A29E" fontStyle="italic">
        #1 WebSocket production bug
      </text>

      {/* ── Column labels ── */}
      <text x={32} y={208} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#A8A29E" fontWeight={500} letterSpacing="0.12em">CLIENTS</text>
      <text x={138} y={208} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#A8A29E" fontWeight={500} letterSpacing="0.12em">CONNECTIONS</text>
      <text x={254} y={208} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#A8A29E" fontWeight={500} letterSpacing="0.12em">SERVER</text>

      {/* ── Server box ── */}
      <rect x={serverX} y={serverY} width={serverW} height={serverH} rx={7} fill="#1C1917" />
      <rect x={serverX} y={serverY} width={serverW} height={serverH} rx={7} fill="none" stroke={accentColor} strokeWidth="0.4" opacity="0.3" />
      <text x={serverX + serverW / 2} y={serverY + 22} textAnchor="middle" fill="#FFFBF7" fontFamily="var(--font-syne)" fontSize={11} fontWeight={700}>SERVER</text>
      <text x={serverX + serverW / 2} y={serverY + 36} textAnchor="middle" fill="#78716C" fontFamily="var(--font-dm-sans)" fontSize={7.5}>:4000</text>
      {[0, 1, 2, 3].map(i => (
        <circle key={i} cx={serverX + 8} cy={serverY + 8 + i * 10} r="1.5" fill={accentColor} opacity="0.35" />
      ))}

      {/* ── Clients + Connections ── */}
      {connections.map((conn, i) => {
        const c = COLORS[conn.type]
        const clientX = 12
        const isZombie = conn.type === 'zombie'
        const isIdle = conn.type === 'idle'
        const isAlive = conn.type === 'alive'

        /* are we revived or cleaned? */
        const revived = heartbeatActive && (isIdle || isAlive)
        const cleaned = heartbeatActive && isZombie

        return (
          <g key={i} style={{ opacity: cleaned ? 0.5 : 1 }}>
            {/* Phone icon */}
            <PhoneIcon x={clientX} y={conn.y - 11} color={c} signal={cleaned ? 0 : conn.signal} />

            {/* Connection line */}
            {isZombie && !heartbeatActive && (
              <>
                {/* Fading zombie line */}
                <line x1={lineStartX} y1={conn.y} x2={lineStartX + 78} y2={conn.y}
                  stroke="url(#zfade)" strokeWidth="1.5" strokeDasharray="4,3" />
                {/* Ghost stub from server — "server still thinks they're there" */}
                <line x1={lineEndX} y1={conn.y} x2={lineEndX - 50} y2={conn.y}
                  stroke="#22C55E" strokeWidth="0.8" strokeDasharray="2,3" opacity="0.35" />
                {/* Skull at fade point */}
                <text x={lineStartX + 74} y={conn.y + 4} textAnchor="middle" fontSize={10} fontWeight={700}>💀</text>
                {/* Ghost label */}
                <text x={lineEndX - 30} y={conn.y - 6} textAnchor="middle" fontFamily="var(--font-dm-sans)"
                  fontSize={5} fill="#22C55E" opacity="0.35" fontStyle="italic">still thinks connected</text>
              </>
            )}

            {isZombie && heartbeatActive && (
              <>
                <line x1={lineStartX} y1={conn.y} x2={lineEndX} y2={conn.y}
                  stroke="#EF4444" strokeWidth="1" strokeDasharray="4,3" opacity="0.25" />
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.25 }}
                >
                  <line x1={lineStartX + 40} y1={conn.y - 5} x2={lineStartX + 56} y2={conn.y + 5} stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1={lineStartX + 56} y1={conn.y - 5} x2={lineStartX + 40} y2={conn.y + 5} stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                </motion.g>
              </>
            )}

            {isAlive && (
              <line x1={lineStartX} y1={conn.y} x2={lineEndX} y2={conn.y}
                stroke={c} strokeWidth="1.5" opacity={0.9} />
            )}
            {isIdle && (
              <line x1={lineStartX} y1={conn.y} x2={lineEndX} y2={conn.y}
                stroke={c} strokeWidth="1" strokeDasharray="4,4" opacity={0.75} />
            )}

            {/* State label */}
            {!cleaned && (
              <text x={(lineStartX + lineEndX) / 2} y={conn.y - 7} textAnchor="middle"
                fontFamily="var(--font-dm-sans)" fontSize={6} fill={c} fontWeight={600} letterSpacing="0.04em">
                {conn.label}
              </text>
            )}

            {/* Cleaned label */}
            {cleaned && (
              <motion.text x={(lineStartX + lineEndX) / 2} y={conn.y - 7} textAnchor="middle"
                fontFamily="var(--font-dm-sans)" fontSize={6} fill="#22C55E" fontWeight={700}
                initial={{ opacity: 0, y: conn.y - 3 }} animate={{ opacity: 1, y: conn.y - 7 }} transition={{ delay: 0.35 }}>
                ✓ CLEANED
              </motion.text>
            )}

            {/* Ping/pong frame dots on active lines */}
            {heartbeatActive && isAlive && (
              <>
                <motion.circle cx={lineEndX} cy={conn.y} r="2.5" fill="#ADFA1D" filter="url(#z-glow)"
                  animate={{ cx: [lineEndX, lineStartX + 40, lineEndX] }}
                  transition={{ duration: 2.5, delay: 0.1 * i, repeat: Infinity, ease: 'linear' }} />
                <motion.circle cx={lineStartX} cy={conn.y} r="2" fill={accentColor}
                  animate={{ cx: [lineStartX, lineEndX - 40, lineStartX] }}
                  transition={{ duration: 3, delay: 0.1 * i + 0.5, repeat: Infinity, ease: 'linear' }} />
              </>
            )}

            {/* Idle revived dot */}
            {heartbeatActive && isIdle && (
              <motion.circle cx={lineStartX + 40} cy={conn.y} r="2.5" fill="#22C55E"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.12, type: 'spring', stiffness: 200 }} />
            )}
          </g>
        )
      })}

      {/* ── Resource panel ── */}
      <g transform="translate(210, 88)">
        <rect x="0" y="0" width="180" height="76" rx="6" fill="#F5F3EE" />

        {/* Memory */}
        <text x={8} y={17} fontFamily="var(--font-dm-sans)" fontSize={7} fill="#78716C" fontWeight={600}>Memory</text>
        <rect x={58} y={8} width={70} height={10} rx={4} fill="#E7E5E4" />
        <motion.rect x={58} y={8} height={10} rx={4} fill={memColor}
          animate={{ width: memW }} transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }} />
        <text x={134} y={17} fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#A8A29E" fontWeight={500}>{memLabel}</text>

        {/* FDs */}
        <text x={8} y={39} fontFamily="var(--font-dm-sans)" fontSize={7} fill="#78716C" fontWeight={600}>FDs</text>
        <rect x={58} y={30} width={70} height={10} rx={4} fill="#E7E5E4" />
        <motion.rect x={58} y={30} height={10} rx={4} fill={fdColor}
          animate={{ width: fdW }} transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }} />
        <text x={134} y={39} fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#A8A29E" fontWeight={500}>{fdLabel}</text>

        {/* Redis subs */}
        <text x={8} y={61} fontFamily="var(--font-dm-sans)" fontSize={7} fill="#78716C" fontWeight={600}>Redis</text>
        <rect x={58} y={52} width={70} height={10} rx={4} fill="#E7E5E4" />
        <motion.rect x={58} y={52} height={10} rx={4} fill={redisColor}
          animate={{ width: redisW }} transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }} />
        <text x={134} y={61} fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#A8A29E" fontWeight={500}>{redisLabel}</text>
      </g>

      {/* ── Zombie resource drain annotation ── */}
      {!heartbeatActive && (
        <text x={300} y={172} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#EF4444" fontWeight={500} fontStyle="italic">
          holding resources for users who left
        </text>
      )}
      {heartbeatActive && (
        <motion.text x={300} y={172} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#22C55E" fontWeight={500} fontStyle="italic"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          resources recovered ✓
        </motion.text>
      )}

      {/* ── Status bar ── */}
      <g transform="translate(10, 177)">
        <rect x="0" y="0" width="380" height={heartbeatActive ? 20 : 20} rx="5" fill="#F5F3EE" />
        <text x={12} y={14} fontFamily="var(--font-dm-sans)" fontSize={8.5} fill="#22C55E" fontWeight={700}>
          Live: {heartbeatActive ? 5 : 3}
        </text>
        <text x={80} y={14} fontFamily="var(--font-dm-sans)" fontSize={8.5} fill={heartbeatActive ? '#22C55E' : '#A8A29E'} fontWeight={700}>
          Idle: {idleCount}
        </text>
        <text x={148} y={14} fontFamily="var(--font-dm-sans)" fontSize={8.5} fill={heartbeatActive ? '#22C55E' : '#EF4444'} fontWeight={700}>
          Zombie: {zombieCount}
        </text>
        {heartbeatActive && (
          <text x={228} y={14} fontFamily="var(--font-dm-sans)" fontSize={8.5} fill="#22C55E" fontWeight={700}>
            Cleaned: {cleanedCount}
          </text>
        )}
        <text x={heartbeatActive ? 310 : 250} y={14} fontFamily="var(--font-dm-sans)" fontSize={8.5} fill="#78716C" fontWeight={600}>
          Total: 6
        </text>
      </g>

      {/* ── Ping/pong annotation ── */}
      {!heartbeatActive && (
        <text x={200} y={213} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#A8A29E" fontStyle="italic">
          TCP goes silent — server never knows they left
        </text>
      )}
      {heartbeatActive && (
        <motion.text x={200} y={213} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#ADFA1D" fontWeight={600}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          PING (0x9) every 30s → PONG (0xA) → terminated ✓
        </motion.text>
      )}
    </svg>
  )
}


/* ── 2. Auth at Handshake ── */

export function AuthVisual({ accentColor }: { accentColor: string }) {
  const aD = darken(accentColor, 25)

  return (
    <svg viewBox="0 0 400 220" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* ── Title ── */}
      <text x={12} y={14} fontFamily="var(--font-dm-sans)" fontSize={7.5} fill="#EF4444" fontWeight={700} letterSpacing="0.12em">
        🔐 AUTH AT HANDSHAKE
      </text>
      <text x={388} y={14} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#A8A29E" fontStyle="italic">
        one check — entire connection
      </text>

      {/* ── L0: TCP + TLS (invisible layer) ── */}
      <g transform="translate(0, 0)">
        <rect x={10} y={22} width={380} height={34} rx={6} fill="#F5F3EE" />
        <text x={12} y={34} fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#A8A29E" fontWeight={700} letterSpacing="0.12em">
          L0  TCP + TLS
        </text>
        {/* TCP handshake mini-sequence */}
        <text x={80} y={34} fontFamily="monospace" fontSize={5.5} fill="#A8A29E">[SYN] → [SYN-ACK] → [ACK]</text>
        <text x={80} y={43} fontFamily="monospace" fontSize={5.5} fill="#A8A29E">[TLS 1.3] → [encrypted tunnel]</text>
        {/* Badge: invisible to app */}
        <rect x={250} y={26} width={130} height={24} rx={4} fill="#FFFBF7" stroke="#E7E5E4" strokeWidth="0.5" />
        <text x={315} y={38} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#A8A29E" fontStyle="italic">
          invisible to your code
        </text>
        <text x={315} y={47} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#A8A29E" fontStyle="italic">
          one-time cost per connection
        </text>
        {/* Small lock on right */}
        <text x={370} y={44} textAnchor="end" fontSize={10}>🔒</text>
      </g>

      {/* ── L1: HTTP Upgrade + AUTH — this is where auth lives ── */}
      <g transform="translate(0, 0)">
        <rect x={10} y={58} width={380} height={52} rx={6} fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="0.5" />
        <text x={12} y={71} fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#DC2626" fontWeight={700} letterSpacing="0.12em">
          L1  HTTP Upgrade  🔑  AUTH HAPPENS HERE
        </text>

        {/* Request side */}
        <rect x={12} y={76} width={170} height={30} rx={4} fill="#FFFBF7" stroke="#FDA4AF" strokeWidth="0.5" />
        <text x={18} y={88} fontFamily="monospace" fontSize={6} fill="#1C1917" fontWeight={600}>GET /ws HTTP/1.1</text>
        {/* Authorization highlighted */}
        <rect x={18} y={91} width={158} height={11} rx={2} fill="#FEF2F2" />
        <text x={22} y={100} fontFamily="monospace" fontSize={5.5} fill="#DC2626" fontWeight={700}>Authorization: Bearer eyJhbGciOiJ...</text>
        <rect x={146} y={93} width={8} height={7} rx={1.5} fill="#DC2626" />
        <text x={150} y={99} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={5} fill="white" fontWeight={800}>✓</text>

        {/* 101 response side */}
        <rect x={190} y={76} width={100} height={30} rx={4} fill="#F0FDF4" stroke="#86EFAC" strokeWidth="0.5" />
        <text x={240} y={88} textAnchor="middle" fontFamily="monospace" fontSize={6} fill="#16A34A" fontWeight={700}>101 Switching</text>
        <text x={240} y={100} textAnchor="middle" fontFamily="monospace" fontSize={6} fill="#16A34A" fontWeight={700}>Protocols</text>

        {/* Arrow between */}
        <line x1={186} y1={91} x2={186} y2={91} stroke="#A8A29E" strokeWidth="0.8" />
        <text x={178} y={86} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#A8A29E" fontStyle="italic">→ validate JWT →</text>
        <text x={294} y={91} fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#A8A29E" fontStyle="italic"> 4001 if invalid</text>

        {/* Wrong way annotation — inline, thin */}
        <g transform="translate(298, 76)">
          <rect x={0} y={0} width={86} height={30} rx={4} fill="#FFFBF7" stroke="#FDA4AF" strokeWidth="0.5" strokeDasharray="2,2" />
          <text x={43} y={12} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#DC2626" fontWeight={600}>✗ ?token=</text>
          <text x={43} y={21} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={5} fill="#A8A29E">leaks: logs · history</text>
        </g>
      </g>

      {/* ── L2: 101 — THE BOUNDARY ── */}
      <g transform="translate(0, 0)">
        <rect x={10} y={112} width={380} height={20} rx={6} fill="#F5F3EE" />
        <text x={12} y={125} fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#78716C" fontWeight={700} letterSpacing="0.12em">
          L2  101
        </text>
        <text x={100} y={125} fontFamily="var(--font-dm-sans)" fontSize={7} fill="#A8A29E" fontStyle="italic" fontWeight={600}>
          ════════════════════  HTTP DIED  ════════════════════
        </text>
        <text x={370} y={125} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#78716C" fontWeight={500}>
          HTTP protocol gone
        </text>
      </g>

      {/* ── L3: Tunnel — No Auth ── */}
      <g transform="translate(0, 0)">
        <rect x={10} y={134} width={380} height={38} rx={6} fill="#F0FDF4" stroke="#86EFAC" strokeWidth="0.5" />
        <text x={12} y={147} fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#16A34A" fontWeight={700} letterSpacing="0.12em">
          L3  OPEN TUNNEL — no auth needed
        </text>

        {/* Frame boxes flowing freely */}
        {[
          { x: 14, label: '0x1 text' },
          { x: 78, label: '0x2 bin' },
          { x: 142, label: '0x9 ping' },
          { x: 206, label: '0xA pong' },
          { x: 270, label: '0x1 text' },
          { x: 334, label: '0x8 close' },
        ].map((f, i) => (
          <g key={i}>
            <rect x={f.x} y={152} width={58} height={16} rx={3} fill="#F0FDF4" stroke="#86EFAC" strokeWidth="0.5" />
            <text x={f.x + 29} y={163} textAnchor="middle" fontFamily="monospace" fontSize={6.5} fill="#16A34A" fontWeight={600}>{f.label}</text>
          </g>
        ))}
        <text x={200} y={130} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#A8A29E" fontStyle="italic">
          bidirectional · 2–14 byte overhead
        </text>
      </g>

      {/* ── L4: REST comparison — layered above ── */}
      <g transform="translate(0, 0)">
        <rect x={10} y={174} width={380} height={24} rx={6} fill="#F5F3EE" />
        <text x={12} y={189} fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#A8A29E" fontWeight={700} letterSpacing="0.12em">
          L4  REST
        </text>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <g key={i}>
            <rect x={54 + i * 30} y={179} width={24} height={14} rx={3} fill="#FECACA" stroke="#FDA4AF" strokeWidth="0.5" />
            <text x={66 + i * 30} y={189} textAnchor="middle" fontFamily="monospace" fontSize={6} fill="#DC2626" fontWeight={600}>JWT</text>
          </g>
        ))}
        <text x={244} y={189} fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#A8A29E" fontWeight={500}>
          auth on every request
        </text>
        <text x={370} y={189} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#78716C" fontWeight={500}>
          400-800B each
        </text>
      </g>

      {/* ── Bottom annotation ── */}
      <text x={200} y={210} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#78716C" fontStyle="italic">
        ⚡ "You authenticate at L1. After 101, the connection IS the identity. No re-auth needed."
      </text>
    </svg>
  )
}


/* ── 3. Multi-Pod & Redis ── */

interface MultiPodVisualProps {
  accentColor: string
  noRedis: boolean
}

export function MultiPodVisual({ accentColor, noRedis }: MultiPodVisualProps) {
  const aD = darken(accentColor, 25)
  const pubX = 148, pod1CX = 148, pod2CX = 148
  const pod1CY = 76, pod2CY = 156
  const redisCX = 320, redisCY = 90

  return (
    <svg viewBox="0 0 400 220" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <marker id="mp-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#22C55E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="mp-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="mp-arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* ── Column headers ── */}
      <text x={55} y={22} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#A8A29E" fontWeight={600} letterSpacing="0.15em">CLIENTS</text>
      <text x={pod1CX} y={22} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#A8A29E" fontWeight={600} letterSpacing="0.15em">PODS</text>
      <text x={redisCX} y={22} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#A8A29E" fontWeight={600} letterSpacing="0.15em">REDIS</text>

      {/* ── discussion:42 label ── */}
      <text x={200} y={34} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#A8A29E" fontStyle="italic" fontWeight={500}>
        discussion:42
      </text>

      {/* ── Load balancer badge ── */}
      <g transform="translate(346, 10)">
        <rect x={0} y={0} width={28} height={14} rx={4} fill="#1C1917" />
        <text x={14} y={10} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={7} fill="#ADFA1D" fontWeight={800}>LB</text>
        <text x={14} y={24} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#A8A29E" fontWeight={500}>round-robin</text>
      </g>

      {/* ── User A (left column, top) ── */}
      <g>
        <circle cx={55} cy={65} r={14} fill="#F97316" />
        <text x={55} y={70} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={11} fill="#FFFBF7" fontWeight={800}>A</text>
        <text x={55} y={88} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#78716C" fontWeight={500}>User A</text>
      </g>

      {/* ── User B (left column, bottom) ── */}
      <g>
        <circle cx={55} cy={145} r={14} fill="#6D28D9" />
        <text x={55} y={150} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={11} fill="#FFFBF7" fontWeight={800}>B</text>
        <text x={55} y={168} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#78716C" fontWeight={500}>User B</text>
      </g>

      {/* ── Connection lines: A→Pod1, B→Pod2 ── */}
      <line x1={69} y1={68} x2={108} y2={74} stroke="#22C55E" strokeWidth="1.5" markerEnd="url(#mp-arrow-green)" />
      <line x1={69} y1={148} x2={108} y2={154} stroke="#22C55E" strokeWidth="1.5" markerEnd="url(#mp-arrow-green)" />
      <text x={84} y={62} fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#22C55E" fontWeight={500}>connected</text>
      <text x={84} y={142} fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#22C55E" fontWeight={500}>connected</text>

      {/* ── Pod 1 (center column, top) ── */}
      <g opacity={noRedis ? 0.65 : 1}>
        <rect x={108} y={56} width={80} height={48} rx={6} fill="#1C1917" />
        <rect x={108} y={56} width={80} height={48} rx={6} fill="none" stroke={accentColor} strokeWidth="0.4" opacity="0.3" />
        <text x={pod1CX} y={74} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={9} fill="#FFFBF7" fontWeight={700}>Pod 1</text>
        <text x={pod1CX} y={86} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#78716C">User A connected</text>
        <circle cx={pod1CX - 22} cy={94} r={2.5} fill="#22C55E" />
        <text x={pod1CX - 16} y={97} fontFamily="var(--font-dm-sans)" fontSize={6} fill="#22C55E" fontWeight={500}>live</text>
      </g>

      {/* ── Pod 2 (center column, bottom) ── */}
      <g opacity={noRedis ? 0.65 : 1}>
        <rect x={108} y={136} width={80} height={48} rx={6} fill="#1C1917" />
        <rect x={108} y={136} width={80} height={48} rx={6} fill="none" stroke={accentColor} strokeWidth="0.4" opacity="0.3" />
        <text x={pod2CX} y={154} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={9} fill="#FFFBF7" fontWeight={700}>Pod 2</text>
        <text x={pod2CX} y={166} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#78716C">User B connected</text>
        {noRedis ? (
          <>
            <text x={pod2CX} y={180} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={11} fill="#EF4444" fontWeight={700}>✗</text>
          </>
        ) : (
          <>
            <circle cx={pod2CX - 22} cy={174} r={2.5} fill="#22C55E" />
            <text x={pod2CX - 16} y={177} fontFamily="var(--font-dm-sans)" fontSize={6} fill="#22C55E" fontWeight={500}>live</text>
          </>
        )}
      </g>

      {/* ── Redis (right column) ── */}
      <g opacity={noRedis ? 0.3 : 1}>
        {/* Redis cylinder */}
        <ellipse cx={redisCX} cy={redisCY} rx={40} ry={10} fill={accentColor} opacity="0.15" />
        <rect x={redisCX - 40} y={redisCY} width={80} height={36} fill={accentColor} opacity="0.08" />
        <ellipse cx={redisCX} cy={redisCY} rx={40} ry={10} fill="none" stroke={accentColor} strokeWidth="0.6" opacity="0.5" />
        <path d={`M${redisCX - 40},${redisCY} L${redisCX - 40},${redisCY + 36}`} stroke={accentColor} strokeWidth="0.6" opacity="0.5" />
        <path d={`M${redisCX + 40},${redisCY} L${redisCX + 40},${redisCY + 36}`} stroke={accentColor} strokeWidth="0.6" opacity="0.5" />
        <ellipse cx={redisCX} cy={redisCY + 36} rx={40} ry={10} fill={accentColor} opacity="0.12" />

        {noRedis ? (
          <>
            <line x1={redisCX - 22} y1={redisCY + 12} x2={redisCX + 22} y2={redisCY + 12} stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            <text x={redisCX} y={redisCY + 28} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={9} fill="#EF4444" fontWeight={800}>OFFLINE</text>
          </>
        ) : (
          <>
            <text x={redisCX} y={redisCY + 14} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={10} fill={accentColor} fontWeight={800}>REDIS</text>
            <text x={redisCX} y={redisCY + 26} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6} fill={aD}>Pub/Sub</text>
          </>
        )}
      </g>

      {/* ── Broken state: red X between Pod 1 and Pod 2 ── */}
      {noRedis && (
        <g>
          <line x1={138} y1={108} x2={158} y2={130} stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          <line x1={158} y1={108} x2={138} y2={130} stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          <text x={165} y={122} fontFamily="var(--font-dm-sans)" fontSize={6} fill="#EF4444" fontWeight={600}>isolated</text>
          {/* Never received badge near User B */}
          <g transform="translate(22, 172)">
            <rect x={0} y={0} width={74} height={18} rx={4} fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="0.5" />
            <text x={37} y={12} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#EF4444" fontWeight={700}>✗ never received</text>
          </g>
        </g>
      )}

      {/* ── Fixed state: PUBLISH + BROADCAST arrows ── */}
      {!noRedis && (
        <>
          {/* Pod 1 → Redis (PUBLISH) */}
          <line x1={188} y1={78} x2={280} y2={88} stroke={accentColor} strokeWidth="1.5" markerEnd="url(#mp-arrow-accent)" />
          <text x={218} y={72} fontFamily="var(--font-dm-sans)" fontSize={6.5} fill={accentColor} fontWeight={700}>PUBLISH</text>
          <text x={218} y={81} fontFamily="var(--font-dm-sans)" fontSize={5.5} fill="#A8A29E" fontStyle="italic">discussion:42</text>

          {/* Redis → Pod 1 (BROADCAST) */}
          <line x1={280} y1={88} x2={198} y2={80} stroke="#A8A29E" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#mp-arrow-muted)" />
          <text x={238} y={58} fontFamily="var(--font-dm-sans)" fontSize={6} fill="#78716C" fontWeight={500}>BROADCAST</text>

          {/* Redis → Pod 2 (BROADCAST) */}
          <line x1={280} y1={105} x2={198} y2={158} stroke="#A8A29E" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#mp-arrow-muted)" />
          <text x={230} y={132} fontFamily="var(--font-dm-sans)" fontSize={6} fill="#78716C" fontWeight={500}>BROADCAST</text>

          {/* Checkmark near User B */}
          <g transform="translate(100, 172)">
            <rect x={0} y={0} width={84} height={18} rx={4} fill="#F0FDF4" stroke="#86EFAC" strokeWidth="0.5" />
            <text x={42} y={12} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#16A34A" fontWeight={700}>✓ User B receives</text>
          </g>
        </>
      )}

      {/* ── Bottom annotation ── */}
      <text x={200} y={210} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#A8A29E" fontStyle="italic">
        {noRedis
          ? 'Each pod only knows its own connections. Pod 2 never hears the message.'
          : 'Any pod publishes via Redis, all pods receive. 6 lines of code.'}
      </text>
    </svg>
  )
}


/* ── 4. Reconnection ── */

export function ReconnectVisual({ accentColor }: { accentColor: string }) {
  const curvePoints = [
    [1, 1000], [2, 2000], [3, 4000], [4, 8000], [5, 16000],
  ]

  const pathD = curvePoints.map((p, i) => {
    const x = 60 + p[0] * 55, y = 150 - p[1] / 160
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  /* deterministic pseudo-random scatter */
  function seed(n: number) { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x) }

  const jitterDots = curvePoints.flatMap((p) => {
    const dots = []
    for (let i = 0; i < 10; i++) {
      const r1 = seed(p[0] * 100 + i * 7)
      const r2 = seed(p[0] * 200 + i * 13)
      const r3 = seed(p[0] * 300 + i * 19)
      const base = p[1]
      const jitter = base * 0.3 * (r1 - 0.5)
      const delay = base + jitter
      const x = 60 + p[0] * 55 + (r2 - 0.5) * 18
      const y = 150 - delay / 160 + (r3 - 0.5) * 6
      dots.push({ x, y, attempt: p[0] })
    }
    return dots
  })

  return (
    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Grid lines */}
      {[50, 80, 110, 133, 147, 155].map(y => (
        <line key={`grid-${y}`} x1={60} y1={y} x2={335} y2={y} stroke="#E7E5E4" strokeWidth="0.5" strokeDasharray="2,3" />
      ))}

      {/* Y-axis */}
      <line x1={60} y1={20} x2={60} y2={155} stroke="#1C1917" strokeWidth="1" />
      <text x={56} y={20} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#78716C">ms</text>
      <text x={56} y={155} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#78716C">0</text>
      <text x={56} y={133} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#78716C">1s</text>
      <text x={56} y={110} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#78716C">4s</text>
      <text x={56} y={80} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#78716C">8s</text>
      <text x={56} y={50} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#78716C">16s</text>

      {/* X-axis */}
      <line x1={60} y1={155} x2={335} y2={155} stroke="#1C1917" strokeWidth="1" />
      {[1, 2, 3, 4, 5].map(n => (
        <text key={n} x={60 + n * 55} y={168} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#78716C">
          {n}
        </text>
      ))}
      <text x={200} y={180} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#78716C" fontWeight={500}>
        Attempt #
      </text>

      {/* Exponential curve */}
      <motion.path d={pathD} fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Jitter dots - animated staggered */}
      {jitterDots.map((dot, i) => (
        <motion.circle key={i} cx={dot.x} cy={dot.y} r={2} fill="#F97316" opacity="0.6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.03, duration: 0.2 }}
        />
      ))}

      {/* Annotations */}
      <text x={250} y={45} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill={accentColor} fontWeight={600} fontStyle="italic">
        exponential backoff
      </text>
      <text x={250} y={55} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#A8A29E">
        base × 2^attempt + jitter
      </text>

      {/* Jitter label */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <circle cx={270} cy={68} r={2} fill="#F97316" opacity="0.6" />
        <text x={276} y={71} fontFamily="var(--font-dm-sans)" fontSize={6.5} fill="#F97316" fontWeight={500}>±30% jitter</text>
      </motion.g>

      {/* Bottom annotation */}
      <text x={200} y={192} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#78716C" fontStyle="italic">
        5,000 clients stagger across 2–6s window — no thundering herd
      </text>
    </svg>
  )
}

/* tiny colour helper */
function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max((num >> 16) - amount, 0)
  const g = Math.max(((num >> 8) & 0xff) - amount, 0)
  const b = Math.max((num & 0xff) - amount, 0)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
