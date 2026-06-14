'use client'

import { motion } from 'framer-motion'
import { FlowLine } from './FlowLine'

interface NodeDef {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
  color: string
}

interface Props {
  $m: boolean
  $d: boolean
  streamPhase: 'idle'|'planning'|'coding'|'testing'|'deploying'|'done'|'interrupted'
  ACT2_NODES: NodeDef[]
  ACT2_CORRECT: Set<string>
  ACT2_ACTIVE_PATHS: Record<string, string[]>
  placedNodes: {id:string, x:number, y:number}[]
  a: string
}

export function Act2ArchDiagram({ $m, $d, streamPhase, ACT2_NODES, ACT2_CORRECT, ACT2_ACTIVE_PATHS, placedNodes, a }: Props) {
  const placedIds = new Set(placedNodes.map(n => n.id))

  if (placedNodes.length === 0) {
    return (
      <div
        style={{
          ...($m ? { height: 'clamp(160px, 30vh, 280px)', flexShrink: 0 } : { flex: 1 }),
          background: '#FAFAF9',
          borderRadius: 14,
          border: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#A8A29E',
          fontFamily: 'var(--font-syne)',
          fontSize: $m ? 14 : 13,
          padding: '0 24px',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        Complete the system design in Act 1 to see your architecture here
      </div>
    )
  }

  return (
    <div
      style={{
        ...($m ? { height: 'clamp(160px, 30vh, 280px)', flexShrink: 0 } : { flex: 1 }),
        background: '#FAFAF9',
        borderRadius: 14,
        border: '1px solid rgba(0,0,0,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <svg
        viewBox="0 0 720 420"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {/* Connection lines */}
        {Array.from(ACT2_CORRECT).map(key => {
          const [f, t] = key.split('→')
          const fn = ACT2_NODES.find(n => n.id === f)
          const tn = ACT2_NODES.find(n => n.id === t)
          if (!fn || !tn) return null
          if (!placedIds.has(f) || !placedIds.has(t)) return null
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

        {/* Service nodes (only placed ones) */}
        {ACT2_NODES.filter(n => placedIds.has(n.id)).map(node => {
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
                  y={node.y + (lines.length === 2 ? ($m ? 20 + li * 18 : 16 + li * 14) : ($m ? 31 : 27))}
                  textAnchor="middle"
                  fontFamily="var(--font-dm-sans)"
                  fontSize={$m ? 14 : 9}
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

        {/* Pulsing glow on active target node */}
        {Array.from(ACT2_CORRECT).map(key => {
          const isActive =
            ACT2_ACTIVE_PATHS[streamPhase]?.includes(key) ||
            (streamPhase === 'interrupted' &&
              ACT2_ACTIVE_PATHS['coding']?.includes(key))
          if (!isActive) return null
          const [, t] = key.split('→')
          const tn = ACT2_NODES.find(n => n.id === t)
          if (!tn || !placedIds.has(t)) return null
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
          <rect x={0} y={0} width={$m ? 120 : 92} height={$m ? 24 : 18} rx={4} fill={a} opacity={0.12} />
          <text x={6} y={$m ? 17 : 13} fontFamily="var(--font-mono)" fontSize={$m ? 11 : 8} fontWeight={700} fill={a}>
            {streamPhase === 'idle' ? 'waiting...' : `[ ${streamPhase} ]`}
          </text>
        </g>

        {/* Protocol badge */}
        {streamPhase !== 'idle' && (
          <g transform={`translate(${$m ? 580 : 620}, ${$m ? 378 : 390})`}>
            <rect x={0} y={0} width={$m ? 110 : 82} height={$m ? 24 : 18} rx={4} fill="#16A34A" opacity={0.12} />
            <text x={6} y={$m ? 17 : 13} fontFamily="var(--font-mono)" fontSize={$m ? 11 : 8} fontWeight={700} fill="#16A34A">
              ⚡ WebSocket
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
