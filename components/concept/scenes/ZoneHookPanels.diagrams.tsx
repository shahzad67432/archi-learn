'use client'
import { motion } from 'framer-motion'

interface Props {
  accentColor: string
}

/* ── shared card wrapper ── */
function Card({ children, title, titleColor }: { children: React.ReactNode; title: string; titleColor: string }) {
  return (
    <div
      style={{
        background: '#FEFCFB',
        borderRadius: 10,
        padding: 'clamp(8px, 1.2vw, 12px)',
        border: '0.5px solid rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: titleColor,
          marginBottom: 5,
          display: 'block',
        }}
      >
        {title}
      </span>
      {children}
    </div>
  )
}

/* ── HTTP Polling Panel ── */
function HttpPollingSVG() {
  const R = [
    { qY: 31, qLabel: 'new data?', aY: 39, aLabel: 'empty.', delay: 0 },
    { qY: 50, qLabel: 'anything?', aY: 58, aLabel: 'empty.', delay: 1.2 },
    { qY: 69, qLabel: 'now?',     aY: null, aLabel: null, delay: 2.4 },
  ]

  return (
    <svg
      viewBox="0 0 200 110"
      preserveAspectRatio="xMidYMid meet"
      style={{ flex: 1, width: '100%', minHeight: 0, display: 'block' }}
    >
      <defs>
        <marker id="arR" viewBox="0 0 10 10" refX="8" refY="5"
          markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#DC2626"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id="arG" viewBox="0 0 10 10" refX="8" refY="5"
          markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>

      {/* CLIENT */}
      <rect x="6" y="4" width="40" height="22" rx="4"
        fill="#FEF2F2" stroke="#FDA4AF" strokeWidth="0.5"/>
      <text x="26" y="19" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="8"
        fill="#DC2626" fontWeight="600">client</text>

      {/* SERVER */}
      <rect x="154" y="4" width="40" height="22" rx="4"
        fill="#FEF2F2" stroke="#FDA4AF" strokeWidth="0.5"/>
      <text x="174" y="19" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="8"
        fill="#DC2626" fontWeight="600">server</text>

      {/* Request / Response pairs */}
      {R.map((r, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: r.delay }}
        >
          {/* Request arrow → */}
          <line x1="46" y1={r.qY} x2="152" y2={r.qY}
            stroke="#DC2626" strokeWidth="1"
            strokeDasharray="3,2" markerEnd="url(#arR)"/>
          <text x="99" y={r.qY - 2} textAnchor="middle"
            fontFamily="var(--font-dm-sans)" fontSize="7"
            fill="#DC2626" opacity="0.9">{r.qLabel}</text>

          {/* Response arrow ← */}
          {r.aY && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: r.delay + 0.5 }}
            >
              <line x1="152" y1={r.aY} x2="46" y2={r.aY}
                stroke="#A8A29E" strokeWidth="0.8"
                strokeDasharray="3,2" markerEnd="url(#arG)"/>
              <text x="99" y={r.aY - 2} textAnchor="middle"
                fontFamily="var(--font-dm-sans)" fontSize="7"
                fill="#A8A29E">{r.aLabel}</text>
            </motion.g>
          )}
        </motion.g>
      ))}

      {/* Timeline axis */}
      <line x1="6" y1="83" x2="194" y2="83"
        stroke="#DC2626" strokeWidth="0.4" opacity="0.2"/>

      {/* Waste meter */}
      <motion.rect
        x="173" y="30" width="6" height="52" rx="3"
        fill="#FEF2F2" stroke="#FDA4AF" strokeWidth="0.4"
      />
      <motion.rect
        x="174" y="32" width="4" height="48" rx="2"
        fill="#DC2626" opacity="0.4"
        initial={{ height: 0, y: 80 }}
        animate={{ height: 48, y: 32 }}
        transition={{ duration: 2, delay: 1, ease: 'easeOut' }}
      />
      <motion.text x="176" y="88" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="6"
        fill="#DC2626" opacity="0.6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2.5 }}
      >
        waste
      </motion.text>

      {/* 99% stat */}
      <motion.rect x="6" y="92" width="106" height="14" rx="4"
        fill="#FEF2F2" stroke="#FDA4AF" strokeWidth="0.5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3, duration: 0.5 }}
      />
      <motion.text x="59" y="102" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="8"
        fill="#DC2626" fontStyle="italic" fontWeight="500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.3 }}
      >
        99% of requests return empty
      </motion.text>

      {/* Waste percentage ring (top right) */}
      <motion.circle cx="186" cy="15" r="8" fill="none"
        stroke="#FEF2F2" strokeWidth="3"
      />
      <motion.circle cx="186" cy="15" r="8" fill="none"
        stroke="#DC2626" strokeWidth="3" opacity="0.5"
        strokeDasharray={`${2 * Math.PI * 8 * 0.99} ${2 * Math.PI * 8 * 0.01}`}
        strokeDashoffset={2 * Math.PI * 8 * 0.25}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 3.5, duration: 0.6 }}
      />
      <motion.text x="186" y="18" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="6"
        fill="#DC2626" fontWeight="700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8 }}
      >
        99%
      </motion.text>
    </svg>
  )
}

/* ── Frame Anatomy Panel ── */
function FrameAnatomySVG({ accentColor }: { accentColor: string }) {
  const aD = accentColor

  return (
    <svg
      viewBox="0 0 200 110"
      preserveAspectRatio="xMidYMid meet"
      style={{ flex: 1, width: '100%', minHeight: 0, display: 'block' }}
    >
      <defs>
        <linearGradient id="segOp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="segPay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFBF7" stopOpacity="1" />
          <stop offset="100%" stopColor="#F5F5F0" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Frame segments row */}
      {/* Opcode */}
      <motion.rect x="4" y="6" width="24" height="22" rx={3}
        fill="url(#segOp)" stroke={aD} strokeWidth="0.5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      />
      <motion.text x="16" y="20" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="8"
        fill={aD} fontWeight="700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        op
      </motion.text>

      {/* Length */}
      <motion.rect x="28" y="6" width="28" height="22" rx={3}
        fill="url(#segOp)" stroke={aD} strokeWidth="0.5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      />
      <motion.text x="42" y="20" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="8"
        fill={aD} fontWeight="700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        len
      </motion.text>

      {/* Mask bit */}
      <motion.rect x="56" y="6" width="14" height="22" rx={3}
        fill="url(#segOp)" stroke={aD} strokeWidth="0.4"
        opacity="0.6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      />
      <motion.text x="63" y="20" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="6.5"
        fill={aD} fontWeight="600" opacity="0.7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.75 }}
      >
        M
      </motion.text>

      {/* Payload */}
      <motion.rect x="70" y="6" width="126" height="22" rx={3}
        fill="url(#segPay)" stroke={aD} strokeWidth="0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      <motion.text x="133" y="20" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="7.5"
        fill="#57534E" fontWeight="400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        payload (your data)
      </motion.text>

      {/* Callout: opcode */}
      <motion.line x1="16" y1="28" x2="16" y2="40"
        stroke="#A8A29E" strokeWidth="0.5" strokeDasharray="2,1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      />
      <motion.text x="16" y="47" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="6.5"
        fill="#A8A29E"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        0x1=text
      </motion.text>
      <motion.text x="16" y="54" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="6.5"
        fill="#A8A29E"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        0x9=ping
      </motion.text>

      {/* Callout: payload */}
      <motion.line x1="133" y1="28" x2="133" y2="40"
        stroke="#A8A29E" strokeWidth="0.5" strokeDasharray="2,1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      />
      <motion.text x="133" y="47" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="6.5"
        fill="#A8A29E"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        your JSON string
      </motion.text>

      {/* Overhead comparison */}
      {/* HTTP bar */}
      <motion.rect x="4" y="65" width="76" height="14" rx={3}
        fill="#FEF2F2" stroke="#FDA4AF" strokeWidth="0.5"
        initial={{ width: 0 }}
        animate={{ width: 76 }}
        transition={{ duration: 0.6, delay: 1.6, ease: 'easeOut' }}
      />
      <motion.text x="42" y="75" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="7.5"
        fill="#DC2626"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        HTTP ≈ 800 bytes
      </motion.text>

      {/* WS bar */}
      <motion.rect x="86" y="65" width="110" height="14" rx={3}
        fill="url(#segOp)" stroke={aD} strokeWidth="0.5"
        initial={{ width: 0 }}
        animate={{ width: 110 }}
        transition={{ duration: 0.6, delay: 1.8, ease: 'easeOut' }}
      />
      <motion.text x="141" y="75" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="7.5"
        fill={aD}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        WS ≈ 14 bytes ✓
      </motion.text>

      {/* Scale markers */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
      >
        <line x1="4" y1="82" x2="4" y2="85" stroke="#A8A29E" strokeWidth="0.3" />
        <line x1="80" y1="82" x2="80" y2="85" stroke="#A8A29E" strokeWidth="0.3" />
        <text x="42" y="90" textAnchor="middle"
          fontFamily="var(--font-dm-sans)" fontSize="6"
          fill="#A8A29E"
        >
          0 bytes
        </text>
        <text x="80" y="90" textAnchor="middle"
          fontFamily="var(--font-dm-sans)" fontSize="6"
          fill="#A8A29E"
        >
          800
        </text>
      </motion.g>

      {/* WS arrow from HTTP bar pointing to WS bar */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
      >
        <line x1="80" y1="72" x2="86" y2="72"
          stroke={aD} strokeWidth="1" strokeLinecap="round"
        />
        <polygon points="84,69 90,72 84,75" fill={aD} />
      </motion.g>

      {/* 57× badge */}
      <motion.rect x="144" y="93" width="52" height="13" rx={6}
        fill="transparent" stroke={aD} strokeWidth="0.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, duration: 0.4, type: 'spring' }}
      />
      <motion.text x="170" y="103" textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize="7.5"
        fill={aD} fontWeight="600" fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2 }}
      >
        57× less per message
      </motion.text>
    </svg>
  )
}

/* ── Root ── */
export default function ZoneHookPanels({ accentColor }: Props) {
  return (
    <>
      <Card title="HTTP polling — the problem" titleColor="#DC2626">
        <HttpPollingSVG />
      </Card>
      <Card title="Frame anatomy" titleColor={accentColor}>
        <FrameAnatomySVG accentColor={accentColor} />
      </Card>
    </>
  )
}
