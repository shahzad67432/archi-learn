'use client'
import { motion } from 'framer-motion'
import type { Concept } from '@/data/concepts'

/* ─── Step 0: The Event Loop ─── */
function StepEventLoop({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <svg viewBox="0 0 680 300" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <marker id="el-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="el-grn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#00E676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* ── LEFT PANEL: Multi-threaded ── */}
      <rect x={16} y={16} width={316} height={268} rx={10} fill="#FAFAF9" stroke="#E0DDD6" strokeWidth="1" />
      <text x={174} y={42} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10} fill="#A8A29E" letterSpacing="0.08em" fontWeight={400}>
        MULTI-THREADED
      </text>

      {/* Thread A */}
      <rect x={36} y={70} width={130} height={32} rx={6} fill="#FFF1F2" stroke="#FCA5A5" strokeWidth="0.8" />
      <text x={101} y={90} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#DC2626" fontWeight={600}>Thread A → write key</text>

      {/* Thread B */}
      <rect x={36} y={120} width={130} height={32} rx={6} fill="#FFF7ED" stroke="#FDBA74" strokeWidth="0.8" />
      <text x={101} y={140} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#C05400" fontWeight={600}>Thread B → read key</text>

      {/* Data box */}
      <rect x={220} y={86} width={80} height={50} rx={6} fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="1.2" />
      <text x={260} y={112} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#A8A29E" fontWeight={700}>data</text>

      {/* Collision starburst */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.5 }}
        style={{ originX: 185, originY: 120 }}
      >
        <path d="M185,96 L188,112 L204,108 L192,120 L200,134 L185,126 L170,134 L178,120 L166,108 L182,112 Z"
          fill="#FF1744" opacity="0.8" />
        <text x={185} y={168} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#FF1744" fontWeight={700}>
          Race condition ⚠
        </text>
      </motion.g>

      {/* Lock icon */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <rect x={80} y={200} width={200} height={28} rx={6} fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="0.6" />
        <text x={100} y={219} fontFamily="var(--font-dm-sans)" fontSize={11} fill="#A8A29E">🔒</text>
        <text x={118} y={219} fontFamily="var(--font-dm-sans)" fontSize={9} fill="#A8A29E">Lock → Wait → Slow</text>
      </motion.g>

      {/* ── VERTICAL DIVIDER ── */}
      <line x1={348} y1={20} x2={348} y2={280} stroke="#E0DDD6" strokeWidth="1" />

      {/* ── RIGHT PANEL: Redis ── */}
      <rect x={364} y={16} width={300} height={268} rx={10} fill="#FAFAF9" stroke="#E0DDD6" strokeWidth="1" />
      <text x={514} y={42} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10} fill="#00E676" letterSpacing="0.08em" fontWeight={400}>
        REDIS
      </text>

      {/* Command queue */}
      <g>
        {[
          { text: 'SET price:btc 68421', y: 70 },
          { text: 'GET user:123', y: 100 },
          { text: 'ZADD leaderboard 2100', y: 130 },
          { text: 'PUBLISH chat msg', y: 160 },
        ].map((cmd, i) => (
          <motion.rect key={i} x={400} y={cmd.y} width={180} height={22} rx={4} fill={`${a}12`} stroke={a} strokeWidth="0.6"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.3 }}
          />
        ))}
        {['SET price:btc 68421', 'GET user:123', 'ZADD leaderboard 2100', 'PUBLISH chat msg'].map((text, i) => (
          <text key={`t${i}`} x={490} y={77 + i * 30} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={8} fill="#1C1917" fontWeight={500}>
            {text}
          </text>
        ))}
      </g>

      {/* Down arrow between queue and event loop */}
      <motion.path
        d="M490 186 L490 202"
        stroke="#A8A29E" strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      />
      <polygon points="486,200 490,206 494,200" fill="#A8A29E" />

      {/* Event Loop box */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 12, delay: 1.3 }}
        style={{ originX: 490, originY: 230 }}
      >
        <rect x={420} y={210} width={140} height={40} rx={8} fill="#0D0D0D" />
        <text x={490} y={235} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#FFFBF7" fontWeight={700}>Event Loop</text>
        {/* Green pulse ring */}
        <motion.rect x={418} y={208} width={144} height={44} rx={10} fill="none" stroke="#00E676" strokeWidth="1.5"
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </motion.g>

      {/* Label */}
      <motion.text x={490} y={270} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#00E676" fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        One at a time. Atomic. &lt;1ms
      </motion.text>

      <text x={670} y={290} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#C4B49E" opacity="0.4" letterSpacing="0.1em">EVENT LOOP</text>
    </svg>
  )
}

/* ─── Step 1: Cache-Aside Pattern ─── */
function StepCacheAside({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <svg viewBox="0 0 680 250" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <marker id="ca-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="ca-hit" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#00E676" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="ca-miss" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#FF1744" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="ca-back" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* 1. Request */}
      <circle cx={130} cy={110} r="24" fill="#FAFAF9" stroke="#0D0D0D" strokeWidth="1.5" />
      <text x={130} y={114} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#0D0D0D" fontWeight={700}>Request</text>

      {/* Arrow to Redis */}
      <line x1={154} y1={110} x2={216} y2={110} stroke="#A8A29E" strokeWidth="1.5" markerEnd="url(#ca-arr)" />

      {/* 2. Redis */}
      <rect x={220} y={86} width={100} height={48} rx={8} fill="#FF4D00" />
      <text x={270} y={114} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={12} fill="#FFFBF7" fontWeight={700}>Redis</text>

      {/* 2a. HIT — green arrow up-right */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <line x1={320} y1={98} x2={420} y2={82} stroke="#00E676" strokeWidth="2" markerEnd="url(#ca-hit)" />
        <rect x={330} y={56} width={78} height={20} rx={4} fill="#F0FDF4" stroke="#00E676" strokeWidth="0.6" />
        <text x={369} y={70} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="#00E676" fontWeight={700}>HIT &lt;1ms</text>
      </motion.g>

      {/* Hit Response */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
      >
        <circle cx={470} cy={76} r="22" fill="#F0FDF4" stroke="#00E676" strokeWidth="1.5" />
        <text x={470} y={80} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#00E676" fontWeight={700}>Response</text>
        <text x={470} y={88} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#00E676">✓</text>
      </motion.g>

      {/* 2b. MISS — red dashed arrow down */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <line x1={270} y1={134} x2={270} y2={176} stroke="#FF1744" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#ca-miss)" />
        <rect x={222} y={146} width={96} height={20} rx={4} fill="#FEF2F2" stroke="#FF1744" strokeWidth="0.6" />
        <text x={270} y={161} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="#FF1744" fontWeight={700}>MISS</text>
      </motion.g>

      {/* 3. PostgreSQL */}
      <rect x={220} y={180} width={100} height={48} rx={8} fill="#5A5A5A" />
      <text x={270} y={204} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#FFFBF7" fontWeight={700}>PostgreSQL</text>
      <text x={270} y={214} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={8} fill="#D6D3D1">5–20ms</text>

      {/* 4. Store arrow: PostgreSQL → Redis (curves around right side) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <path d="M320,204 L380,204 Q400,204 400,184 L400,130 Q400,110 380,110 L320,110"
          fill="none" stroke="#3B82F6" strokeWidth="1.5" markerEnd="url(#ca-back)" />
        <rect x={330} y={192} width={80} height={20} rx={4} fill="#EFF6FF" stroke="#3B82F6" strokeWidth="0.6" />
        <text x={370} y={206} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={8} fill="#3B82F6" fontWeight={700}>Store EX 3600</text>
      </motion.g>

      {/* 5. Miss Response — from Redis right edge */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.4 }}
      >
        <line x1={320} y1={110} x2={510} y2={110} stroke="#A8A29E" strokeWidth="1" markerEnd="url(#ca-arr)" />
        <line x1={510} y1={110} x2={510} y2={86} stroke="#A8A29E" strokeWidth="1" markerEnd="url(#ca-arr)" />
        <circle cx={510} cy={76} r="22" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
        <text x={510} y={80} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#3B82F6" fontWeight={700}>Response</text>
        <text x={510} y={88} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#3B82F6">✓</text>
      </motion.g>

      <text x={670} y={240} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#C4B49E" opacity="0.4" letterSpacing="0.1em">CACHE-ASIDE</text>
    </svg>
  )
}

/* ─── Step 2: Pub/Sub Multi-Pod ─── */
function StepPubSub({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  return (
    <svg viewBox="0 0 680 340" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <marker id="ps-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="ps-sub" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2,2" />
        </marker>
      </defs>

      {/* ── WITHOUT REDIS state (top, muted) ── */}
      <g opacity="0.35">
        <text x={340} y={22} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#A8A29E" fontWeight={600} letterSpacing="0.08em">
          WITHOUT REDIS — POD 2 MISSES THE MESSAGE
        </text>
        {/* Pod 1 */}
        <rect x={50} y={34} width={120} height={30} rx={6} fill="#0D0D0D" />
        <text x={110} y={53} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#FFFBF7" fontWeight={600}>Pod 1</text>

        {/* Pod 2 with X */}
        <rect x={510} y={34} width={120} height={30} rx={6} fill="#FEF2F2" stroke="#FF1744" strokeWidth="1.2" />
        <text x={570} y={53} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#FF1744" fontWeight={600}>Pod 2 ✗</text>

        {/* Users */}
        <circle cx={80} cy={90} r="10" fill="#E7E5E4" stroke="#D6D3D1" strokeWidth="0.6" />
        <text x={80} y={94} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#A8A29E">A</text>
        <circle cx={140} cy={90} r="10" fill="#E7E5E4" stroke="#D6D3D1" strokeWidth="0.6" />
        <text x={140} y={94} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#A8A29E">C</text>
        <circle cx={540} cy={90} r="10" fill="#FEF2F2" stroke="#FF1744" strokeWidth="0.6" />
        <text x={540} y={94} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#FF1744">B</text>
        <circle cx={600} cy={90} r="10" fill="#FEF2F2" stroke="#FF1744" strokeWidth="0.6" />
        <text x={600} y={94} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#FF1744">D</text>

        <line x1={110} y1={64} x2={80} y2={82} stroke="#A8A29E" strokeWidth="0.6" />
        <line x1={110} y1={64} x2={140} y2={82} stroke="#A8A29E" strokeWidth="0.6" />
        <line x1={570} y1={64} x2={540} y2={82} stroke="#FF1744" strokeWidth="0.6" />
        <line x1={570} y1={64} x2={600} y2={82} stroke="#FF1744" strokeWidth="0.6" />
      </g>

      {/* ── WITH REDIS state (main) ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <text x={340} y={120} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#C8FF00" fontWeight={700} letterSpacing="0.08em">
          WITH REDIS — ALL PODS RECEIVE THE MESSAGE
        </text>

        {/* ── LEFT COLUMN: Pod 1 ── */}
        <rect x={40} y={134} width={140} height={42} rx={8} fill="#0D0D0D" />
        <text x={110} y={160} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={12} fill="#FFFBF7" fontWeight={700}>Pod 1</text>

        {/* User A */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <circle cx={60} cy={230} r="14" fill="#F0FDF4" stroke="#00E676" strokeWidth="1.2" />
          <text x={60} y={234} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#00E676" fontWeight={700}>A</text>
          <line x1={110} y1={176} x2={60} y2={218} stroke="#A8A29E" strokeWidth="0.8" />
        </motion.g>

        {/* User C */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <circle cx={140} cy={230} r="14" fill="#F0FDF4" stroke="#00E676" strokeWidth="1.2" />
          <text x={140} y={234} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#00E676" fontWeight={700}>C</text>
          <line x1={110} y1={176} x2={140} y2={218} stroke="#A8A29E" strokeWidth="0.8" />
        </motion.g>

        {/* ── CENTER: Redis ── */}
        <g transform="translate(340, 155)">
          <circle cx="0" cy="0" r="30" fill={`${a}18`} stroke={a} strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill={a} fontWeight={800}>Redis</text>
          {/* Pulse */}
          <motion.circle cx="0" cy="0" r="30" fill="none" stroke={a} strokeWidth="1"
            animate={{ r: [30, 40], opacity: [0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
        </g>

        {/* Channel label */}
        <rect x={280} y={200} width={120} height={18} rx={4} fill={`${a}10`} stroke={a} strokeWidth="0.4" />
        <text x={340} y={213} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={7} fill={a} fontWeight={500}>
          discussion:thread_42
        </text>

        {/* Subscribe lines */}
        <motion.line x1={180} y1={155} x2={310} y2={155} stroke="#A8A29E" strokeWidth="0.8" strokeDasharray="4,3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
        <motion.line x1={370} y1={155} x2={500} y2={155} stroke="#A8A29E" strokeWidth="0.8" strokeDasharray="4,3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />

        {/* Publish arrow coming down into Redis */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <rect x={280} y={115} width={120} height={20} rx={4} fill="#0D0D0D" />
          <text x={340} y={129} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={8} fill="#C8FF00" fontWeight={600}>PUBLISH comment_data</text>
          <line x1={340} y1={135} x2={340} y2={155} stroke="#C8FF00" strokeWidth="1.5" markerEnd="url(#ps-arr)" />
        </motion.g>

        {/* Broadcast arrows left and right from Redis */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          {/* Left broadcast */}
          <path d="M310 165 C250 170, 220 180, 180 180" fill="none" stroke="#C8FF00" strokeWidth="1.5" markerEnd="url(#ps-arr)" />
          {/* Right broadcast */}
          <path d="M370 165 C430 170, 460 180, 500 180" fill="none" stroke="#C8FF00" strokeWidth="1.5" markerEnd="url(#ps-arr)" />
        </motion.g>

        {/* Broadcast labels */}
        <text x={230} y={175} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#C8FF00" fontWeight={600}>broadcast</text>
        <text x={450} y={175} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7} fill="#C8FF00" fontWeight={600}>broadcast</text>

        {/* ── RIGHT COLUMN: Pod 2 ── */}
        <rect x={500} y={134} width={140} height={42} rx={8} fill="#0D0D0D" />
        <text x={570} y={160} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={12} fill="#FFFBF7" fontWeight={700}>Pod 2</text>

        {/* User B */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <circle cx={530} cy={230} r="14" fill="#F0FDF4" stroke="#00E676" strokeWidth="1.2" />
          <text x={530} y={234} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#00E676" fontWeight={700}>B</text>
          <line x1={570} y1={176} x2={530} y2={218} stroke="#A8A29E" strokeWidth="0.8" />
        </motion.g>

        {/* User D */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <circle cx={610} cy={230} r="14" fill="#F0FDF4" stroke="#00E676" strokeWidth="1.2" />
          <text x={610} y={234} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#00E676" fontWeight={700}>D</text>
          <line x1={570} y1={176} x2={610} y2={218} stroke="#A8A29E" strokeWidth="0.8" />
        </motion.g>
      </motion.g>

      <text x={670} y={330} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize={6} fill="#C4B49E" opacity="0.4" letterSpacing="0.1em">PUB/SUB</text>
    </svg>
  )
}

const STEP_COMPONENTS = [StepEventLoop, StepCacheAside, StepPubSub]

export default function RedisHowItWorksVisual({ concept, step }: { concept: Concept; step: number }) {
  const StepComponent = STEP_COMPONENTS[step]
  if (!StepComponent) return null
  return <StepComponent concept={concept} />
}
