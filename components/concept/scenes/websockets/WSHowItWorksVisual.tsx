'use client'
import { motion } from 'framer-motion'
import type { Concept } from '@/data/concepts'

interface CubeFaces { top: string; right: string; left: string }

function isoCube(cx: number, cy: number, w: number, h: number, d: number): CubeFaces {
  const top = `${cx - w},${cy} ${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h}`
  const right = `${cx},${cy + h} ${cx + w},${cy} ${cx + w},${cy + d} ${cx},${cy + h + d}`
  const left = `${cx},${cy + h} ${cx - w},${cy} ${cx - w},${cy + d} ${cx},${cy + h + d}`
  return { top, right, left }
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max((num >> 16) - amount, 0)
  const g = Math.max(((num >> 8) & 0xff) - amount, 0)
  const b = Math.max((num & 0xff) - amount, 0)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function StepCanvas({ concept, children }: { concept: Concept; children: React.ReactNode }) {
  const a = concept.color.accent
  const cw = 18, ch = 5, cd = 14
  const lx = 80, ly = 115
  const rx = 280, ry = 115
  const leftCube = isoCube(lx, ly, cw, ch, cd)
  const rightCube = isoCube(rx, ry, cw, ch, cd)
  const aD = darken(a, 25)
  const aM = darken(a, 12)

  return (
    <svg viewBox="0 0 360 200" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="tunnelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B2B" />
          <stop offset="40%" stopColor="#ADFA1D" />
          <stop offset="60%" stopColor="#ADFA1D" />
          <stop offset="100%" stopColor={a} />
        </linearGradient>
        <linearGradient id="tunnelFill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B2B" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#ADFA1D" stopOpacity="0.08" />
          <stop offset="100%" stopColor={a} stopOpacity="0.12" />
        </linearGradient>
        <marker id="arrow-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id="arrow-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke={a} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
        <marker id="arrow-m" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      {[[12,14],[348,14],[12,186],[348,186]].map(([bx,by]) => (
        <path key={`br-${bx}-${by}`} d={`M${bx},${by+8} L${bx},${by} L${bx+8},${by}`}
          fill="none" stroke="#C4B49E" strokeWidth="0.6" opacity="0.4" />
      ))}
      {[78, 134].map(y => (
        <line key={`lyr-${y}`} x1={89} y1={y} x2={271} y2={y}
          stroke="#C4B49E" strokeWidth="0.4" opacity="0.12" strokeDasharray="2,3" />
      ))}
      <rect x={lx+cw} y={ry+ch+cd-1} width={rx-lx-cw*2} height={4} rx={2}
        fill={`${a}10`} stroke={a} strokeWidth="0.4" strokeDasharray="2,2" opacity="0.3" />
      <line x1={lx+cw} y1={ry+ch+cd+3} x2={rx-cw} y2={ry+ch+cd+3}
        stroke={a} strokeWidth="0.3" strokeDasharray="2,2" opacity="0.15" />
      {[[lx+cw,ly+ch+cd/2,lx+cw,ly+ch+cd/2+3],[rx-cw,ry+ch+cd/2,rx-cw,ry+ch+cd/2+3]].map(([x1,y1,x2,y2]) => (
        <line key={`gui-${x1}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={a} strokeWidth="0.6" strokeDasharray="2,2" opacity="0.3" />
      ))}
      {[[lx+cw,ry+ch+cd+4,lx+cw,ry+ch+cd+7],[rx-cw,ry+ch+cd+4,rx-cw,ry+ch+cd+7]].map(([x1,y1,x2,y2]) => (
        <line key={`gui2-${x1}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={a} strokeWidth="0.4" strokeDasharray="2,2" opacity="0.2" />
      ))}
      <circle cx={lx+cw} cy={ry+ch+cd+7} r="1.5" fill="#ADFA1D" filter="url(#g)" opacity="0.4" />
      <circle cx={rx-cw} cy={ry+ch+cd+7} r="1.5" fill="#ADFA1D" filter="url(#g)" opacity="0.4" />
      <circle cx={lx+cw} cy={ly+ch+cd/2+3} r="2.5" fill="#ADFA1D" filter="url(#g)" />
      <circle cx={rx-cw} cy={ry+ch+cd/2+3} r="2.5" fill="#ADFA1D" filter="url(#g)" />
      <polygon points={leftCube.right} fill="#CC4E18" stroke="#1A1A1A" strokeWidth="0.6" />
      <polygon points={leftCube.left} fill="#E05820" stroke="#1A1A1A" strokeWidth="0.6" />
      <polygon points={leftCube.top} fill="#FF6B2B" stroke="#1A1A1A" strokeWidth="0.6" />
      <line x1={lx-cw*0.4} y1={ly-ch*0.4} x2={lx+cw*0.4} y2={ly-ch*0.4}
        stroke="#1A1A1A" strokeWidth="0.4" opacity="0.15" />
      <polygon points={rightCube.right} fill={aD} stroke="#1A1A1A" strokeWidth="0.6" />
      <polygon points={rightCube.left} fill={aM} stroke="#1A1A1A" strokeWidth="0.6" />
      <polygon points={rightCube.top} fill={a} stroke="#1A1A1A" strokeWidth="0.6" />
      <line x1={rx-cw*0.4} y1={ry-ch*0.4} x2={rx+cw*0.4} y2={ry-ch*0.4}
        stroke="#1A1A1A" strokeWidth="0.4" opacity="0.15" />
      <g>
        <polyline points={`${lx},${ly-ch-4} ${(lx+48)/2-10},${(ly-ch-4+76)/2} ${48},${76}`}
          fill="none" stroke="#C4B49E" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
        <circle cx={lx} cy={ly-ch-4} r="2" fill="#FF6B2B" />
        <rect x={0} y={62} width={48} height={22} rx={3} fill="#1A1A1A" />
        <text x={24} y={70} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="7" fill="#999">LAYER</text>
        <text x={24} y={79} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="8" fill="#FFFBF7" fontWeight="600">CLIENT</text>
      </g>
      <g>
        <polyline points={`${rx},${ry-ch-4} ${(rx+282+48)/2-10},${(ry-ch-4+76)/2} ${282+48},${76}`}
          fill="none" stroke="#C4B49E" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.6" />
        <circle cx={rx} cy={ry-ch-4} r="2" fill={a} />
        <rect x={282} y={62} width={48} height={22} rx={3} fill="#1A1A1A" />
        <text x={306} y={70} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="7" fill="#999">LAYER</text>
        <text x={306} y={79} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="8" fill="#FFFBF7" fontWeight="600">SERVER</text>
      </g>
      <text x={348} y={190} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize="6.5"
        fill="#C4B49E" opacity="0.5" letterSpacing="0.12em">WS-01 — FULL-DUPLEX PROTOCOL</text>
      {children}
    </svg>
  )
}

function StepTCPHandshake({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  const cw = 18, lx = 80, rx = 280
  const x1 = lx + cw, x2 = rx - cw, mid = (x1 + x2) / 2
  return (
    <StepCanvas concept={concept}>
      <motion.g initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <line x1={x1} y1={95} x2={x2} y2={95} stroke="#F97316" strokeWidth={1.5} strokeDasharray="5,3" markerEnd="url(#arrow-r)" />
        <text x={mid} y={91} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#F97316" fontWeight={600}>SYN</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
        <line x1={x2} y1={108} x2={x1} y2={108} stroke={a} strokeWidth={1.5} strokeDasharray="5,3" markerEnd="url(#arrow-a)" />
        <text x={mid} y={104} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill={a} fontWeight={600}>SYN-ACK</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
        <line x1={x1} y1={121} x2={x2} y2={121} stroke="#F97316" strokeWidth={1.5} strokeDasharray="5,3" markerEnd="url(#arrow-r)" />
        <text x={mid} y={117} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={10} fill="#F97316" fontWeight={600}>ACK</text>
      </motion.g>
      <text x={mid} y={160} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#A8A29E" fontStyle="italic">Raw TCP — no encryption yet</text>
    </StepCanvas>
  )
}

function StepTLS({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  const cw = 18, lx = 80, ly = 115, rx = 280, ch = 5, cd = 14
  const x1 = lx + cw, x2 = rx - cw, mid = (x1 + x2) / 2
  const tY = ly + ch + cd / 2 + 3
  return (
    <StepCanvas concept={concept}>
      <rect x={x1} y={tY} width={x2 - x1} height={4} rx={2} fill={concept.color.bg} stroke={a} strokeWidth={0.8} />
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.5 }}
        style={{ originX: 180, originY: tY - 18 }}>
        <rect x={172} y={tY - 12} width={16} height={14} rx={3} fill={a} />
        <path d={`M168,${tY - 12} v-6 a8,8 0 0,1 16,0 v6`} fill="none" stroke={a} strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>
      <text x={mid} y={160} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#A8A29E" fontStyle="italic">Encrypted — wss:// only, once per connection</text>
    </StepCanvas>
  )
}

function StepHTTPUpgrade({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  const cw = 18, lx = 80, rx = 280
  const x1 = lx + cw, x2 = rx - cw
  return (
    <StepCanvas concept={concept}>
      <motion.g
        initial={{ x: x1, opacity: 0 }}
        animate={{ x: x2 - 160, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}>
        <rect x={0} y={93} width={140} height={32} rx={6} fill="white" stroke="#A8A29E" strokeWidth={1} />
        <text x={70} y={105} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill="#44403C" fontWeight={500}>GET /ws HTTP/1.1</text>
        <text x={70} y={115} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7.5} fill={a} fontWeight={600}>Upgrade: websocket</text>
        <text x={70} y={123} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7.5} fill={a} fontWeight={600}>Connection: Upgrade</text>
      </motion.g>
      <text x={180} y={160} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#A8A29E" fontStyle="italic">HTTP disguise — firewalls see normal traffic</text>
    </StepCanvas>
  )
}

function Step101Response({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  const cw = 18, lx = 80, rx = 280
  const x1 = lx + cw, x2 = rx - cw
  return (
    <StepCanvas concept={concept}>
      <motion.g
        initial={{ x: x2 - 140, opacity: 0 }}
        animate={{ x: x1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}>
        <rect x={0} y={93} width={140} height={32} rx={6} fill={concept.color.bg} stroke={concept.color.border} strokeWidth={1} />
        <text x={70} y={105} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill={a} fontWeight={600}>HTTP/1.1 101 Switching</text>
        <text x={70} y={115} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={8} fill={a} fontWeight={600}>Protocols</text>
        <text x={70} y={123} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={7.5} fill="#A8A29E">Upgrade: websocket</text>
      </motion.g>
      <motion.g
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 1.3 }}
        style={{ originX: 85, originY: 65 }}>
        <circle cx={85} cy={65} r={12} fill={a} />
        <text x={85} y={70} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={12} fill="white" fontWeight={800}>✓</text>
      </motion.g>
      <text x={180} y={160} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#A8A29E" fontStyle="italic">Last HTTP message — protocol dies here</text>
    </StepCanvas>
  )
}

function StepHTTPDies({ concept }: { concept: Concept }) {
  const cw = 18, lx = 80, rx = 280, mid = (lx + cw + rx - cw) / 2
  return (
    <StepCanvas concept={concept}>
      <motion.text x={mid} y={115} textAnchor="middle"
        fontFamily="var(--font-syne)" fontWeight={800} fontSize={40} fill="#D4CFC9"
        initial={{ opacity: 1 }} animate={{ opacity: 0.15 }}
        transition={{ duration: 0.6, delay: 0.8 }}>HTTP</motion.text>
      <motion.line x1={mid - 100} y1={115} x2={mid + 100} y2={115}
        stroke="#EF4444" strokeWidth={2.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }} />
      <motion.g
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 1.1 }}
        style={{ originX: mid, originY: 140 }}>
        <rect x={mid - 40} y={128} width={80} height={24} rx={12} fill="#FFF1F2" stroke="#FDA4AF" strokeWidth={0.5} />
        <text x={mid} y={145} textAnchor="middle" fontFamily="var(--font-syne)" fontSize={11} fill="#EF4444" fontWeight={700}>GONE</text>
      </motion.g>
      <text x={mid} y={170} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#A8A29E" fontStyle="italic">2-14 byte frames replace 800 byte headers</text>
    </StepCanvas>
  )
}

function StepTunnelOpens({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  const cw = 18, lx = 80, ly = 115, rx = 280, ch = 5, cd = 14
  const x1 = lx + cw, x2 = rx - cw, mid = (x1 + x2) / 2
  const tY = ly + ch + cd / 2 + 3
  const tH = 6
  return (
    <StepCanvas concept={concept}>
      <motion.rect x={x1} y={tY} width={x2 - x1} height={tH} rx={3}
        fill="url(#tunnelFill)" stroke="url(#tunnelGrad)" strokeWidth="0.8"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.0, delay: 0.2, ease: 'easeOut' }}
        style={{ originX: x1 }} />
      <motion.rect x={x1 + 4} y={tY + 1} width={x2 - x1 - 8} height={2} rx={1}
        fill="none" stroke="#ADFA1D" strokeWidth="0.3" opacity="0.3"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.0, delay: 0.2, ease: 'easeOut' }}
        style={{ originX: x1 }} />
      <motion.text x={mid} y={tY + tH + 12} textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize={8} fill={a} fontWeight={600} fontStyle="italic"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.0 }}>persistent</motion.text>
      <motion.rect x={x1} y={tY} width={x2 - x1} height={tH} rx={3} fill={a}
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 2, delay: 1.2 }} />
      <text x={mid} y={160} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#A8A29E" fontStyle="italic">Stays open — server speaks first now</text>
    </StepCanvas>
  )
}

function StepFreeFlow({ concept }: { concept: Concept }) {
  const a = concept.color.accent
  const cw = 18, lx = 80, ly = 115, rx = 280, ch = 5, cd = 14
  const x1 = lx + cw, x2 = rx - cw, mid = (x1 + x2) / 2
  const tY = ly + ch + cd / 2 + 3
  const tH = 6
  return (
    <StepCanvas concept={concept}>
      <rect x={x1} y={tY} width={x2 - x1} height={tH} rx={3}
        fill="url(#tunnelFill)" stroke="url(#tunnelGrad)" strokeWidth="0.8" />
      <rect x={x1 + 4} y={tY + 1} width={x2 - x1 - 8} height={2} rx={1}
        fill="none" stroke="#ADFA1D" strokeWidth="0.3" opacity="0.3" />
      <motion.circle cx={x1} cy={tY + tH / 2} r="2.8" fill="#ADFA1D"
        animate={{ cx: [x1 + 2, x2 - 2] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
      <motion.circle cx={x1} cy={tY + tH / 2} r="2" fill="#FFFBF7"
        animate={{ cx: [x1 + 2, x2 - 2] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', delay: 1 }} />
      <motion.circle cx={x2} cy={tY + tH / 2} r="2.8" fill="#C4B5FD"
        animate={{ cx: [x2 - 2, x1 + 2] }}
        transition={{ duration: 2.3, repeat: Infinity, ease: 'linear', delay: 0.5 }} />
      <motion.circle cx={x2} cy={tY + tH / 2} r="1.8" fill="#ADFA1D"
        animate={{ cx: [x2 - 2, x1 + 2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1.6 }} />
      <text x={mid} y={tY + tH + 12} textAnchor="middle"
        fontFamily="var(--font-dm-sans)" fontSize={8} fill="#A8A29E" fontWeight={400} fontStyle="italic">bi‑directional — real-time</text>
      <motion.rect x={x1} y={tY} width={x2 - x1} height={tH} rx={3} fill={a}
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 2 }} />
      <text x={mid} y={160} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={9} fill="#A8A29E" fontStyle="italic">Both directions, simultaneously, no asking permission</text>
    </StepCanvas>
  )
}

const STEP_COMPONENTS = [StepTCPHandshake, StepTLS, StepHTTPUpgrade, Step101Response, StepHTTPDies, StepTunnelOpens, StepFreeFlow]

export default function WSHowItWorksVisual({ concept, step }: { concept: Concept; step: number }) {
  const StepComponent = STEP_COMPONENTS[step]
  if (!StepComponent) return null
  return <StepComponent concept={concept} />
}
