'use client'
import { motion } from 'framer-motion'

/* ─── Chapter 0: Write-Delete Pattern ─── */
function ChapterWriteDelete({ accentColor }: { accentColor: string }) {
  return (
    <svg viewBox="0 0 680 260" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <marker id="wd-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      {[[12,10],[668,10],[12,250],[668,250]].map(([bx,by]) => (
        <path key={`br-${bx}-${by}`} d={`M${bx},${by+5} L${bx},${by} L${bx+5},${by}`}
          fill="none" stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      ))}

      {/* ── TOP ROW: Wrong way ── */}
      <text x={340} y={26} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fontWeight={700} letterSpacing="0.08em">
        Wrong way <tspan fill="#FF1744">✗</tspan>
      </text>

      <rect x={60} y={40} width={140} height={36} rx={6} fill="#F0EFE9" stroke="#D6D3D1" />
      <text x={130} y={63} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#1C1917" fontWeight={600}>Write to DB</text>

      <line x1={200} y1={58} x2={260} y2={58} stroke="#A8A29E" strokeWidth="1.2" markerEnd="url(#wd-arr)" />

      <rect x={264} y={40} width={160} height={36} rx={6} fill="#F0EFE9" stroke="#D6D3D1" />
      <text x={344} y={63} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#1C1917" fontWeight={600}>Update cache directly</text>

      <line x1={424} y1={58} x2={484} y2={58} stroke="#A8A29E" strokeWidth="1.2" markerEnd="url(#wd-arr)" />

      <rect x={488} y={40} width={140} height={36} rx={6} fill="#FEF2F2" stroke="#FF1744" strokeWidth="1.2" />
      <text x={558} y={63} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#FF1744" fontWeight={600}>Concurrent write</text>

      {/* Collision starburst */}
      <motion.path
        d="M558,88 L562,100 L576,98 L566,106 L572,118 L558,112 L544,118 L550,106 L540,98 L554,100 Z"
        fill="#FF1744" opacity="0.7"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.5 }}
        style={{ originX: 558, originY: 102 }}
      />

      <motion.text x={558} y={135} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#FF1744" fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        Race condition: cache has wrong value
      </motion.text>

      {/* ── HORIZONTAL RULE ── */}
      <line x1={40} y1={152} x2={640} y2={152} stroke="#E0DDD6" strokeWidth="1" />

      {/* ── BOTTOM ROW: Right way ── */}
      <text x={340} y={172} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fontWeight={700} letterSpacing="0.08em">
        Right way <tspan fill="#00E676">✓</tspan>
      </text>

      <rect x={60} y={186} width={140} height={36} rx={6} fill="#F0EFE9" stroke="#D6D3D1" />
      <text x={130} y={209} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#1C1917" fontWeight={600}>Write to DB</text>

      <line x1={200} y1={204} x2={260} y2={204} stroke="#A8A29E" strokeWidth="1.2" markerEnd="url(#wd-arr)" />

      <rect x={264} y={186} width={160} height={36} rx={6} fill="#F0FDF4" stroke="#00E676" strokeWidth="1.2" />
      <text x={344} y={207} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#00E676" fontWeight={700}>DELETE cache key</text>
      {/* Strikethrough on the key */}
      <motion.line x1={288} y1={216} x2={400} y2={216} stroke="#FF1744" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />

      <line x1={424} y1={204} x2={484} y2={204} stroke="#A8A29E" strokeWidth="1.2" markerEnd="url(#wd-arr)" />

      <rect x={488} y={180} width={160} height={48} rx={6} fill="#F0FDF4" stroke="#00E676" />
      <text x={568} y={203} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#00E676" fontWeight={700}>Next GET misses</text>
      <text x={568} y={218} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#00E676" fontWeight={500}>fresh fetch → re-cache</text>

      <motion.text x={340} y={252} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#00E676" fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        No race possible. Cache is always fresh.
      </motion.text>

      <text x={670} y={254} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize="6" fill="#C4B49E" opacity="0.4" letterSpacing="0.1em">WRITE-DELETE</text>
    </svg>
  )
}

/* ─── Chapter 1: Cache Stampede ─── */
function ChapterStampede({ accentColor }: { accentColor: string }) {
  const a = accentColor
  return (
    <svg viewBox="0 0 680 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <marker id="st-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      {[[12,10],[668,10],[12,190],[668,190]].map(([bx,by]) => (
        <path key={`br-${bx}-${by}`} d={`M${bx},${by+5} L${bx},${by} L${bx+5},${by}`}
          fill="none" stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      ))}

      <text x={340} y={22} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fontWeight={700} fill="#A8A29E" letterSpacing="0.08em">CACHE STAMPEDE</text>

      {/* Redis — the key expires */}
      <rect x={270} y={36} width={120} height={40} rx={8} fill={`${a}12`} stroke={a} strokeWidth="1.2" />
      <text x={330} y={56} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fontWeight={700} fill={a}>popular:article</text>
      <text x={330} y={68} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill={a} fillOpacity="0.5">TTL: 3 → 2 → 1 → ✗</text>

      {/* TTL timer */}
      <motion.text x={330} y={90} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={16} fontWeight={800} fill="#DC2626"
        initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.3, 0.6, 1], ease: 'linear' }}>
        3
      </motion.text>

      {/* Key poofs */}
      <motion.circle cx={330} cy={85} r="4" fill={a}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.8, 0], scale: [0, 2, 0], y: [0, -10] }}
        transition={{ delay: 2.2, duration: 0.8, ease: 'easeOut' }} />

      {/* Database zone */}
      <rect x={40} y={130} width={600} height={58} rx={10} fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.2" />
      <rect x={40} y={130} width={600} height={22} rx={10} fill="#FEE2E2" />
      <text x={340} y={145} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fontWeight={700} fill="#DC2626">DATABASE — 100% CPU 🔥</text>

      {/* 6 concurrent requests */}
      {[80, 170, 260, 350, 440, 530].map((x, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6 + i * 0.15, duration: 0.3 }}
        >
          <line x1={x + 15} y1={98} x2={x + 15} y2={128} stroke="#DC2626" strokeWidth="1.2" markerEnd="url(#st-red)" />
          <text x={x + 15} y={115} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#DC2626" fontWeight={600}>req {i + 1}</text>
        </motion.g>
      ))}

      {/* Flame indicator */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: 2.8 }}
      >
        <rect x={620} y={136} width={18} height={14} rx={3} fill="#FEF2F2" stroke="#EF4444" strokeWidth="0.8" />
        <text x={629} y={147} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9}>🔥</text>
      </motion.g>

      <text x={670} y={194} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize="6" fill="#C4B49E" opacity="0.4" letterSpacing="0.1em">STAMPEDE</text>
    </svg>
  )
}

/* ─── Chapter 2: TTL Mental Model ─── */
function ChapterTTL({ accentColor }: { accentColor: string }) {
  const a = accentColor
  const ttlExamples = [
    { label: 'session', ex: 'EX 86400', time: '24h' },
    { label: 'feed', ex: 'EX 600', time: '10m' },
    { label: 'book', ex: 'EX 3600', time: '1h' },
    { label: 'reco', ex: 'EX 21600', time: '6h' },
    { label: 'trending', ex: 'EX 300', time: '5m' },
  ]
  return (
    <svg viewBox="0 0 680 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      {[[12,10],[668,10],[12,190],[668,190]].map(([bx,by]) => (
        <path key={`br-${bx}-${by}`} d={`M${bx},${by+5} L${bx},${by} L${bx+5},${by}`}
          fill="none" stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      ))}

      <text x={340} y={22} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fontWeight={700} fill="#A8A29E" letterSpacing="0.08em">TTL TIMELINE — KEY LIFECYCLE</text>

      {/* Key icon + command */}
      <rect x={20} y={36} width={140} height={22} rx={4} fill={`${a}10`} stroke={a} strokeWidth="0.6" />
      <text x={90} y={51} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={8} fill={a} fontWeight={500}>SET reco:user123 EX 21600</text>

      {/* Timeline bar */}
      <rect x={20} y={76} width={640} height={8} rx={4} fill="#E7E5E4" />
      <rect x={20} y={76} width={640} height={8} rx={4} fill={a} />

      {/* Created dot */}
      <circle cx={20} cy={80} r="7" fill="#16A34A" />
      <text x={20} y={70} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#16A34A" fontWeight={700}>Created</text>

      {/* Hourglass — middle */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <text x={320} y={70} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={14}>⌛</text>
        <rect x={260} y={88} width={120} height={16} rx={3} fill="#FFF7ED" stroke="#F97316" strokeWidth="0.6" />
        <text x={320} y={100} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={7} fill="#C05400" fontWeight={600}>TTL: 21,543s remaining</text>
      </motion.g>

      {/* Getting cold — 80% */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <circle cx={536} cy={80} r="6" fill="#F59E0B" />
        <text x={536} y={66} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#F59E0B" fontWeight={700}>Getting cold</text>
      </motion.g>

      {/* Auto-deleted — end */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 12, delay: 1.5 }}
        style={{ originX: 660, originY: 80 }}
      >
        <circle cx={660} cy={80} r="7" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1.5" />
        <text x={660} y={84} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#DC2626" fontWeight={700}>✗</text>
        <text x={660} y={66} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#DC2626" fontWeight={700}>Auto-deleted</text>
      </motion.g>

      {/* Return arrow */}
      <motion.path
        d="M660 96 C660 120, 340 120, 20 96"
        fill="none" stroke="#A8A29E" strokeWidth="1" strokeDasharray="4,3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      />
      <polygon points="24,94 20,96 26,100" fill="#A8A29E" />
      <text x={340} y={118} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#A8A29E" fontStyle="italic">
        Next request → recalculate → cache again
      </text>

      {/* TTL reference table */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        {ttlExamples.map((ex, i) => (
          <g key={i}>
            <text x={90 * i + 40} y={148} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={7} fill="#1C1917" fontWeight={600}>
              {ex.label}
            </text>
            <text x={90 * i + 40} y={158} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={6.5} fill="#A8A29E">
              {ex.ex}
            </text>
            <text x={90 * i + 40} y={168} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill={a} fontWeight={700}>
              {ex.time}
            </text>
          </g>
        ))}
      </motion.g>

      <text x={670} y={194} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize="6" fill="#C4B49E" opacity="0.4" letterSpacing="0.1em">TTL</text>
    </svg>
  )
}

/* ─── Chapter 3: High Availability ─── */
function ChapterHA({ accentColor }: { accentColor: string }) {
  const a = accentColor
  return (
    <svg viewBox="0 0 680 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      {[[12,10],[668,10],[12,190],[668,190]].map(([bx,by]) => (
        <path key={`br-${bx}-${by}`} d={`M${bx},${by+5} L${bx},${by} L${bx+5},${by}`}
          fill="none" stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      ))}

      <text x={340} y={22} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fontWeight={700} fill="#A8A29E" letterSpacing="0.08em">HIGH AVAILABILITY — SENTINEL FAILOVER</text>

      {/* Master node */}
      <rect x={265} y={36} width={120} height={46} rx={10} fill={`${a}18`} stroke={a} strokeWidth="2" />
      <rect x={265} y={36} width={120} height={46} rx={10} fill={`${a}08`} />
      <text x={325} y={62} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={11} fontWeight={800} fill={a}>Master</text>
      <text x={325} y={74} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill={a} fillOpacity="0.6">write + read</text>

      {/* Replicas */}
      {[
        { x: 50, y: 110, label: 'Replica 1' },
        { x: 215, y: 110, label: 'Replica 2' },
        { x: 380, y: 110, label: 'Replica 3' },
      ].map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={100} height={40} rx={8} fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="1" />
          <text x={r.x + 50} y={r.y + 25} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fontWeight={600} fill="#1C1917">{r.label}</text>
          <text x={r.x + 50} y={r.y + 35} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#A8A29E">replica (read-only)</text>
          <line x1={325} y1={82} x2={r.x + 50} y2={r.y} stroke="#A8A29E" strokeWidth="0.8" strokeDasharray="3,2" />
          <polygon points={`${r.x + 47},${r.y - 2} ${r.x + 50},${r.y} ${r.x + 53},${r.y - 2}`} fill="#A8A29E" />
        </g>
      ))}

      {/* Sentinel */}
      <g transform="translate(630, 8)">
        <rect x={0} y={0} width={36} height={28} rx={6} fill="#FFF7ED" stroke="#F97316" strokeWidth="1.2" />
        <text x={18} y={18} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fontWeight={800} fill="#C05400">S</text>
        <circle cx={18} cy={10} r="3" fill="none" stroke="#C05400" strokeWidth="0.6" />
        <circle cx={18} cy={10} r="1" fill="#C05400" />
        <line x1={-160} y1={14} x2={0} y2={14} stroke="#F97316" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.5" />
      </g>

      {/* Failover zone */}
      <motion.rect x={260} y={162} width={130} height={22} rx={5} fill="#F0FDF4" stroke="#16A34A" strokeWidth="0.8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} />
      <text x={325} y={177} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#16A34A" fontWeight={600}>
        failover: replica promoted → new master
      </text>

      <text x={670} y={194} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize="6" fill="#C4B49E" opacity="0.4" letterSpacing="0.1em">SENTINEL</text>
    </svg>
  )
}

/* ─── Chapter 4: Data Structures Reference ─── */
function ChapterDataStructures({ accentColor }: { accentColor: string }) {
  const a = accentColor
  return (
    <svg viewBox="0 0 680 340" style={{ width: '100%', height: '100%', display: 'block' }}>
      {[[12,10],[668,10],[12,330],[668,330]].map(([bx,by]) => (
        <path key={`br-${bx}-${by}`} d={`M${bx},${by+5} L${bx},${by} L${bx+5},${by}`}
          fill="none" stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      ))}

      <text x={340} y={22} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fontWeight={700} fill="#A8A29E" letterSpacing="0.08em">DATA STRUCTURES — FIVE TYPES</text>

      {/* Cell grid: 3 columns, 2 rows */}
      {[
        // Row 1: String, Hash, List
        {
          x: 20, y: 36, w: 200, h: 130,
          type: 'String', use: 'sessions · counters',
          icon: (
            <g>
              <rect x="60" y="66" width="100" height="28" rx={14} fill={`${a}15`} stroke={a} strokeWidth="1" />
              <text x={110} y={84} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={8} fill={a} fontWeight={600}>jwt_token...</text>
            </g>
          ),
        },
        {
          x: 240, y: 36, w: 200, h: 130,
          type: 'Hash', use: 'objects · profiles',
          icon: (
            <g>
              <rect x="276" y="66" width="128" height="48" rx={4} fill={`${a}08`} stroke={a} strokeWidth="0.8" />
              {['title | Dune', 'author | Herbert', 'year | 1965'].map((row, j) => (
                <g key={j}>
                  <line x1={276} y1={82 + j * 16} x2={404} y2={82 + j * 16} stroke={a} strokeWidth="0.3" opacity="0.3" />
                  <text x={282} y={79 + j * 16} fontFamily="var(--font-mono)" fontSize={7} fill={a} fontWeight={500}>{row}</text>
                </g>
              ))}
            </g>
          ),
        },
        {
          x: 460, y: 36, w: 200, h: 130,
          type: 'List', use: 'feeds · queues',
          icon: (
            <g>
              {/* LPUSH arrow */}
              <path d="M510,58 L510,70" stroke="#A8A29E" strokeWidth="0.8" />
              <polygon points="508,66 510,72 514,66" fill="#A8A29E" />
              <text x={508} y={56} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#A8A29E">LPUSH</text>
              {/* Stacked rects */}
              {[86, 100, 114, 128].map((y, j) => (
                <rect key={j} x={500} y={y} width={100} height={12} rx={3} fill={`${a}${10 + j * 5}`} stroke={a} strokeWidth="0.5" opacity={1 - j * 0.15} />
              ))}
              {/* RPUSH arrow */}
              <path d="M550,142 L550,154" stroke="#A8A29E" strokeWidth="0.8" />
              <polygon points="548,150 550,156 554,150" fill="#A8A29E" />
              <text x={552} y={152} textAnchor="start" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#A8A29E">RPUSH</text>
            </g>
          ),
        },
        // Row 2: Set, Sorted Set
        {
          x: 240, y: 180, w: 200, h: 140,
          type: 'Set', use: 'likes · readers',
          icon: (
            <g>
              <circle cx={340} cy={232} r="32" fill={`${a}08`} stroke={a} strokeWidth="0.8" />
              {[[320, 222], [350, 218], [330, 240], [355, 238]].map(([px, py], j) => (
                <circle key={j} cx={px} cy={py} r="3" fill={a} />
              ))}
              <text x={374} y={230} fontFamily="var(--font-dm-sans)" fontSize={7} fill="#16A34A" fontWeight={700}>✓</text>
              <text x={340} y={280} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#A8A29E">unique · no order</text>
            </g>
          ),
        },
        {
          x: 460, y: 180, w: 200, h: 140,
          type: 'Sorted Set', use: 'leaderboards · trending',
          icon: (
            <g>
              <circle cx={560} cy={232} r="32" fill={`${a}08`} stroke={a} strokeWidth="0.8" />
              {/* Ranked dots with scores */}
              {[
                { y: 218, score: '9.8' },
                { y: 230, score: '8.5' },
                { y: 242, score: '7.2' },
              ].map((dot, j) => (
                <g key={j}>
                  <circle cx={548} cy={dot.y} r="3" fill={a} />
                  <text x={558} y={dot.y + 1} fontFamily="var(--font-mono)" fontSize={6} fill={a} fontWeight={600}>{dot.score}</text>
                </g>
              ))}
              <text x={560} y={280} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#A8A29E">ranked · ordered by score</text>
            </g>
          ),
        },
      ].map((cell, i) => (
        <g key={i}>
          <rect x={cell.x} y={cell.y} width={cell.w} height={cell.h} rx={8} fill="#F0EFE9" stroke="#D6D3D1" strokeWidth="1" />
          {cell.icon}
          <text x={cell.x + 12} y={cell.y + cell.h - 28} fontFamily="var(--font-dm-sans)" fontSize={11} fill={a} fontWeight={700}>
            {cell.type}
          </text>
          <text x={cell.x + 12} y={cell.y + cell.h - 14} fontFamily="var(--font-mono)" fontSize={7} fill="#A8A29E" fontWeight={400}>
            {cell.use}
          </text>
        </g>
      ))}

      <text x={670} y={334} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize="6" fill="#C4B49E" opacity="0.4" letterSpacing="0.1em">DATA STRUCTURES</text>
    </svg>
  )
}

export default function RedisHardPartsVisual({ accentColor, chapter }: { accentColor: string; chapter: number }) {
  switch (chapter) {
    case 0: return <ChapterWriteDelete accentColor={accentColor} />
    case 1: return <ChapterStampede accentColor={accentColor} />
    case 2: return <ChapterTTL accentColor={accentColor} />
    case 3: return <ChapterHA accentColor={accentColor} />
    case 4: return <ChapterDataStructures accentColor={accentColor} />
    default: return null
  }
}
