'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import type { Concept } from '@/data/concepts'

interface ServiceDef {
  id: string
  label: string
  color: string
}

interface Props {
  $m: boolean
  concept: Concept
  a: string
  connections: {from:string, to:string}[]
  setConnections: (updater: (prev: {from:string, to:string}[]) => {from:string, to:string}[]) => void
  selectedNode: string | null
  setSelectedNode: (v: string | null) => void
  hint: boolean
  setHint: (v: boolean) => void
  wrongAttempts: number
  setWrongAttempts: (updater: (prev: number) => number) => void
  lastConsequence: string | null
  setLastConsequence: (v: string | null) => void
  placedNodes: {id:string, x:number, y:number}[]
  setPlacedNodes: (updater: (prev: {id:string, x:number, y:number}[]) => {id:string, x:number, y:number}[]) => void
  paletteService: string | null
  setPaletteService: (v: string | null) => void
  correctCount: number
  SERVICES: ServiceDef[]
  CORRECT: Set<string>
  WRONG: Record<string, string>
  setAct: (a: 0|1|2) => void
}

export function Act1Canvas({
  concept, a,
  connections, setConnections,
  selectedNode, setSelectedNode,
  hint, setHint,
  wrongAttempts, setWrongAttempts,
  lastConsequence, setLastConsequence,
  placedNodes, setPlacedNodes,
  paletteService, setPaletteService,
  correctCount,
  SERVICES, CORRECT, WRONG,
  setAct,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{nodeId:string;startClientX:number;startClientY:number;nodeStartX:number;nodeStartY:number;moved:boolean}|null>(null)

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
      if (!target && paletteService && !placedNodes.some(p => p.id === paletteService)) {
        const nodeX = Math.round(svgPt.x - 45)
        const nodeY = Math.round(svgPt.y - 26)
        setPlacedNodes(prev => [...prev, { id: paletteService, x: Math.max(0, nodeX), y: Math.max(0, nodeY) }])
        setPaletteService(null)
      }
    }

    dragRef.current = null
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* TOP ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 15, color: '#1C1917' }}>
          Build the architecture
        </div>
        <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: a, fontWeight: 700 }}>
          {correctCount} / 9 correct connections
        </div>
      </div>

      {/* CANVAS */}
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
              <text x={320} y={155} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={14} fontWeight={600} fill="#A8A29E">
                Select a service from the palette
              </text>
              <text x={320} y={177} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize={14} fontWeight={600} fill="#A8A29E">
                then click the canvas to place it
              </text>
            </g>
          )}

          {/* Hint layer — ghost correct lines */}
          {hint && placedNodes.length > 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ duration: 0.3 }}>
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
              <motion.g key={key} animate={isWrong ? { x: [0, -3, 3, -2, 2, 0] } : {}} transition={{ duration: 0.3 }}>
                <motion.path
                  d={`M${fn.x + 45} ${fn.y + 26} L${tn.x + 45} ${tn.y + 26}`}
                  fill="none"
                  stroke={isCorrect ? a : '#EF4444'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray={isCorrect ? '8 8' : '4 3'}
                  animate={isCorrect ? { strokeDashoffset: [0, -32] } : {}}
                  transition={isCorrect ? { duration: 1.1, repeat: Infinity, ease: 'linear' } : {}}
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
                {selectedNode === node.id && (
                  <motion.circle
                    cx={node.x + 45} cy={node.y + 26} r={38}
                    fill="none" stroke={a} strokeWidth={2}
                    initial={{ opacity: 0.4, scale: 1 }}
                    animate={{ opacity: 0.2, scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <rect
                  x={node.x} y={node.y} width={90} height={52} rx={10}
                  fill={selectedNode === node.id ? concept.color.bg : '#fff'}
                  stroke={service.color}
                  strokeWidth={selectedNode === node.id ? 2.5 : 1.5}
                />
                {lines.map((line, li) => (
                  <text
                    key={li}
                    x={node.x + 45}
                    y={node.y + (lines.length === 2 ? 20 + li * 18 : 30)}
                    textAnchor="middle"
                    fontFamily="var(--font-dm-sans)"
                    fontSize={10} fontWeight={700} fill="#1C1917"
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
              position: 'absolute' as const, top: 10, left: '50%', transform: 'translateX(-50%)',
              background: '#1C1917', color: '#FFFBF7', fontFamily: 'var(--font-syne)',
              fontWeight: 700, fontSize: 12, borderRadius: 10, padding: '10px 18px',
              whiteSpace: 'nowrap' as const, zIndex: 10, maxWidth: '90%',
            }}
          >
            {lastConsequence}
          </motion.div>
        )}
      </div>

      {/* BOTTOM ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        {wrongAttempts > 0 ? (
          <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#EF4444', fontWeight: 600 }}>
            {wrongAttempts} wrong connection{wrongAttempts !== 1 ? 's' : ''}
          </div>
        ) : (
          <div />
        )}
        {correctCount === 9 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <button
              onClick={() => setAct(2)}
              style={{
                padding: '10px 24px', borderRadius: 10, border: 'none',
                background: a, color: '#FFFBF7', fontFamily: 'var(--font-syne)',
                fontWeight: 800, fontSize: 13, cursor: 'pointer',
              }}
            >
              ✓ Architecture complete — watch it work →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
