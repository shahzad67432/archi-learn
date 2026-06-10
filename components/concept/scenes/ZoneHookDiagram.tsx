'use client'
import { motion } from 'framer-motion'

interface Props {
  accentColor?: string
}

/* ── isometric cube helpers ── */

interface CubeFaces {
  top: string
  right: string
  left: string
}

function isoCube(
  cx: number,
  cy: number,
  w: number,
  h: number,
  d: number,
): CubeFaces {
  const top = `${cx - w},${cy} ${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h}`
  const right = `${cx},${cy + h} ${cx + w},${cy} ${cx + w},${cy + d} ${cx},${cy + h + d}`
  const left = `${cx},${cy + h} ${cx - w},${cy} ${cx - w},${cy + d} ${cx},${cy + h + d}`
  return { top, right, left }
}

/* ── data for annotation boxes ── */

interface Annotation {
  label: string
  sub: string
  bx: number
  by: number
  leaderEnd: [number, number]
  color: string
}

export default function ZoneHookDiagram({ accentColor = '#16A34A' }: Props) {
  const cw = 18, ch = 5, cd = 14              // cube half-w, half-h, depth
  const lx = 80, ly = 115                      // left cube center
  const rx = 280, ry = 115                     // right cube center

  const leftCube = isoCube(lx, ly, cw, ch, cd)
  const rightCube = isoCube(rx, ry, cw, ch, cd)

  /* derive face colors */
  const aD = darken(accentColor, 25)
  const aM = darken(accentColor, 12)

  const annotations: Annotation[] = [
    {
      label: 'CLIENT',
      sub: 'browser',
      bx: 8, by: 62,
      leaderEnd: [lx, ly - ch - 4],
      color: '#FF6B2B',
    },
    {
      label: 'SERVER',
      sub: 'backend',
      bx: 282, by: 62,
      leaderEnd: [rx, ry - ch - 4],
      color: accentColor,
    },
  ]

  return (
    <svg
      viewBox="0 0 360 200"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="tunnelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B2B" />
          <stop offset="40%" stopColor="#ADFA1D" />
          <stop offset="60%" stopColor="#ADFA1D" />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
        <linearGradient id="tunnelFill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B2B" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#ADFA1D" stopOpacity="0.08" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* ── Blueprint L-brackets ── */}
      {[
        [12, 14], [348, 14], [12, 186], [348, 186],
      ].map(([bx_, by_]) => (
        <path
          key={`br-${bx_}-${by_}`}
          d={`M${bx_},${by_ + 8} L${bx_},${by_} L${bx_ + 8},${by_}`}
          fill="none"
          stroke="#C4B49E"
          strokeWidth="0.6"
          opacity="0.4"
        />
      ))}

      {/* ── Layer indicator lines ── */}
      {[78, 134].map((y) => (
        <line
          key={`lyr-${y}`}
          x1={89}
          y1={y}
          x2={271}
          y2={y}
          stroke="#C4B49E"
          strokeWidth="0.4"
          opacity="0.12"
          strokeDasharray="2,3"
        />
      ))}

      {/* ── Return path (below tunnel) ── */}
      <rect x={lx + cw} y={ry + ch + cd - 1} width={rx - lx - cw * 2} height={4} rx={2}
        fill={`${accentColor}10`}
        stroke={accentColor}
        strokeWidth="0.4"
        strokeDasharray="2,2"
        opacity="0.3"
      />
      <line x1={lx + cw} y1={ry + ch + cd + 3} x2={rx - cw} y2={ry + ch + cd + 3}
        stroke={accentColor}
        strokeWidth="0.3"
        strokeDasharray="2,2"
        opacity="0.15"
      />

      {/* ── Dashed guide: cube faces ↔ tunnel ── */}
      {[
        [lx + cw, ly + ch + cd / 2, lx + cw, ly + ch + cd / 2 + 3],
        [rx - cw, ry + ch + cd / 2, rx - cw, ry + ch + cd / 2 + 3],
      ].map(([x1, y1, x2, y2]) => (
        <line key={`gui-${x1}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={accentColor} strokeWidth="0.6" strokeDasharray="2,2" opacity="0.3"
        />
      ))}
      {/* return path guides */}
      {[
        [lx + cw, ry + ch + cd + 4, lx + cw, ry + ch + cd + 7],
        [rx - cw, ry + ch + cd + 4, rx - cw, ry + ch + cd + 7],
      ].map(([x1, y1, x2, y2]) => (
        <line key={`gui2-${x1}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={accentColor} strokeWidth="0.4" strokeDasharray="2,2" opacity="0.2"
        />
      ))}

      {/* ── Tunnel ── */}
      <rect
        x={lx + cw}
        y={ly + ch + cd / 2 + 3}
        width={rx - lx - cw * 2}
        height={6}
        rx={3}
        fill="url(#tunnelFill)"
        stroke="url(#tunnelGrad)"
        strokeWidth="0.8"
      />
      {/* tunnel inner glow line */}
      <rect
        x={lx + cw + 4}
        y={ly + ch + cd / 2 + 5}
        width={rx - lx - cw * 2 - 8}
        height={2}
        rx={1}
        fill="none"
        stroke="#ADFA1D"
        strokeWidth="0.3"
        opacity="0.3"
      />

      {/* ── Return connection dots ── */}
      <circle cx={lx + cw} cy={ry + ch + cd + 7} r="1.5"
        fill="#ADFA1D" filter="url(#g)" opacity="0.4"
      />
      <circle cx={rx - cw} cy={ry + ch + cd + 7} r="1.5"
        fill="#ADFA1D" filter="url(#g)" opacity="0.4"
      />

      {/* ── LEFT CUBE (CLIENT) ── */}
      <polygon points={leftCube.right} fill="#CC4E18" stroke="#1A1A1A" strokeWidth="0.6" />
      <polygon points={leftCube.left} fill="#E05820" stroke="#1A1A1A" strokeWidth="0.6" />
      <polygon points={leftCube.top} fill="#FF6B2B" stroke="#1A1A1A" strokeWidth="0.6" />
      {/* cube detail line */}
      <line x1={lx - cw * 0.4} y1={ly - ch * 0.4} x2={lx + cw * 0.4} y2={ly - ch * 0.4}
        stroke="#1A1A1A" strokeWidth="0.4" opacity="0.15"
      />

      {/* ── RIGHT CUBE (SERVER) ── */}
      <polygon points={rightCube.right} fill={aD} stroke="#1A1A1A" strokeWidth="0.6" />
      <polygon points={rightCube.left} fill={aM} stroke="#1A1A1A" strokeWidth="0.6" />
      <polygon points={rightCube.top} fill={accentColor} stroke="#1A1A1A" strokeWidth="0.6" />
      {/* cube detail line */}
      <line x1={rx - cw * 0.4} y1={ry - ch * 0.4} x2={rx + cw * 0.4} y2={ry - ch * 0.4}
        stroke="#1A1A1A" strokeWidth="0.4" opacity="0.15"
      />

      {/* ── Connection dots (glowing) ── */}
      <circle cx={lx + cw} cy={ly + ch + cd / 2 + 3} r="2.5" fill="#ADFA1D" filter="url(#g)" />
      <circle cx={rx - cw} cy={ry + ch + cd / 2 + 3} r="2.5" fill="#ADFA1D" filter="url(#g)" />

      {/* ── Animated data packets ── */}
      {/* left → right */}
      <motion.circle
        cx={lx + cw} cy={ly + ch + cd / 2 + 6} r="2.8"
        fill="#ADFA1D"
        animate={{ cx: [lx + cw + 2, rx - cw - 2] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.circle
        cx={lx + cw} cy={ly + ch + cd / 2 + 6} r="2"
        fill="#FFFBF7"
        animate={{ cx: [lx + cw + 2, rx - cw - 2] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', delay: 1 }}
      />
      {/* right → left */}
      <motion.circle
        cx={rx - cw} cy={ly + ch + cd / 2 + 6} r="2.8"
        fill="#C4B5FD"
        animate={{ cx: [rx - cw - 2, lx + cw + 2] }}
        transition={{ duration: 2.3, repeat: Infinity, ease: 'linear', delay: 0.5 }}
      />
      <motion.circle
        cx={rx - cw} cy={ly + ch + cd / 2 + 6} r="1.8"
        fill="#ADFA1D"
        animate={{ cx: [rx - cw - 2, lx + cw + 2] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1.6 }}
      />

      {/* ── Annotations with leader lines ── */}
      {annotations.map((a) => (
        <g key={a.label}>
          {/* leader line */}
          <polyline
            points={`${a.leaderEnd[0]},${a.leaderEnd[1]} ${(a.leaderEnd[0] + a.bx + 40) / 2 - 10},${(a.leaderEnd[1] + a.by + 14) / 2} ${a.bx + 40},${a.by + 14}`}
            fill="none"
            stroke="#C4B49E"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            opacity="0.6"
          />
          {/* dot */}
          <circle cx={a.leaderEnd[0]} cy={a.leaderEnd[1]} r="2"
            fill={a.color}
          />
          {/* label box */}
          <rect x={a.bx} y={a.by} width={48} height={22} rx={3}
            fill="#1A1A1A"
          />
          <text x={a.bx + 24} y={a.by + 10}
            textAnchor="middle"
            fontFamily="var(--font-dm-sans)"
            fontSize="7"
            fill="#999"
            fontWeight="400"
          >
            LAYER
          </text>
          <text x={a.bx + 24} y={a.by + 19}
            textAnchor="middle"
            fontFamily="var(--font-dm-sans)"
            fontSize="8"
            fill="#FFFBF7"
            fontWeight="600"
          >
            {a.label}
          </text>
        </g>
      ))}

      {/* subtle architectural label — bottom right */}
      <text x={348} y={190}
        textAnchor="end"
        fontFamily="var(--font-dm-sans)"
        fontSize="6.5"
        fill="#C4B49E"
        opacity="0.5"
        letterSpacing="0.12em"
      >
        WS-01 — FULL-DUPLEX PROTOCOL
      </text>

      {/* in-tunnel label */}
      <text x={180} y={ly + ch + cd / 2 + 15}
        textAnchor="middle"
        fontFamily="var(--font-dm-sans)"
        fontSize="7"
        fill="#A8A29E"
        fontStyle="italic"
        fontWeight="300"
      >
        bi‑directional — simultaneous send &amp; receive
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
