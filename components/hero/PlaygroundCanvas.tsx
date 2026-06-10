'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { SERVICE_NODES, isValidConnection, VALID_CONNECTIONS } from '@/lib/data/connectionRules'

const NODE_W = 82
const NODE_H = 96
const PORT_R = 5
const HIT_R = 20
const STORAGE_KEY = 'archi-canvas-state'

interface Position { x: number; y: number }
interface Connection { fromId: string; toId: string }
interface CanvasState { positions: Record<string, Position>; connections: Connection[] }

type Phase = 'connected' | 'disconnecting' | 'circling' | 'done' | 'idle'

const NODE_COLORS: Record<string, { bg: string; border: string }> = {
  Client:        { bg: 'rgba(255,255,255,0.7)', border: '#FDBA74' },
  'Load Balancer': { bg: 'rgba(255,255,255,0.7)', border: '#C4B5FD' },
  Server:        { bg: 'rgba(255,255,255,0.7)', border: '#86EFAC' },
  Cache:         { bg: 'rgba(255,255,255,0.7)', border: '#FDE047' },
  Database:      { bg: 'rgba(255,255,255,0.7)', border: '#93C5FD' },
}

const NODE_IMAGE: Record<string, string> = {
  client: '/client.png',
  'load-balancer': '/load-balancer.png',
  server: '/server.png',
  cache: '/cache.png',
  database: '/database.png',
}

function loadState<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed ?? fallback
    }
  } catch { /* ignore */ }
  return fallback
}

function getCirclePositions(cx: number, cy: number, r: number): Record<string, Position> {
  const positions: Record<string, Position> = {}
  SERVICE_NODES.forEach((node, i) => {
    const angle = (i / SERVICE_NODES.length) * 2 * Math.PI - Math.PI / 2
    positions[node.id] = {
      x: cx + r * Math.cos(angle) - NODE_W / 2,
      y: cy + r * Math.sin(angle) - NODE_H / 2,
    }
  })
  return positions
}

function getDefaultPositions(): Record<string, Position> {
  return Object.fromEntries(
    SERVICE_NODES.map(n => [n.id, { x: n.defaultPosition.x, y: n.defaultPosition.y }])
  )
}

function getCenteredDefaultPositions(cw: number, ch: number): Record<string, Position> {
  const defaults = SERVICE_NODES.map(n => n.defaultPosition)
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const d of defaults) {
    minX = Math.min(minX, d.x)
    maxX = Math.max(maxX, d.x + NODE_W)
    minY = Math.min(minY, d.y)
    maxY = Math.max(maxY, d.y + NODE_H)
  }
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const dx = Math.round(cw / 2 - cx)
  const dy = Math.round(ch / 2 - cy)
  return Object.fromEntries(
    SERVICE_NODES.map(n => [
      n.id,
      { x: n.defaultPosition.x + dx, y: n.defaultPosition.y + dy }
    ])
  )
}

function getAllConnections(): Connection[] {
  return VALID_CONNECTIONS.map(([fromId, toId]) => ({ fromId, toId }))
}

export default function PlaygroundCanvas({ compact }: { compact?: boolean }) {
  const nw = compact ? 56 : NODE_W
  const nh = compact ? 66 : NODE_H
  const pr = compact ? 4 : PORT_R
  const imgSize = compact ? 44 : 72
  const labelSize = compact ? 7 : 9

  const containerRef = useRef<HTMLDivElement>(null)
  const userInteractedRef = useRef(false)
  const hasRunRef = useRef(false)

  const [nodePositions, setNodePositions] = useState<Record<string, Position>>(() => {
    const saved = loadState<CanvasState | null>(STORAGE_KEY, null)
    if (saved?.positions) return saved.positions
    return getDefaultPositions()
  })
  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = loadState<CanvasState | null>(STORAGE_KEY, null)
    return saved?.connections ?? getAllConnections()
  })
  const [phase, setPhase] = useState<Phase>(() => {
    const saved = loadState<CanvasState | null>(STORAGE_KEY, null)
    return saved ? 'idle' : 'connected'
  })
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null)
  const [dragLineEnd, setDragLineEnd] = useState<Position>({ x: 0, y: 0 })
  const [hoveredPort, setHoveredPort] = useState<string | null>(null)

  const dragStartRef = useRef<{ x: number; y: number; nodeX: number; nodeY: number } | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ positions: nodePositions, connections }))
    } catch { /* ignore */ }
  }, [nodePositions, connections])

  // Center pattern on first load
  const centeredRef = useRef(false)

  useEffect(() => {
    const saved = loadState<CanvasState | null>(STORAGE_KEY, null)
    if (saved?.positions) return

    const container = containerRef.current
    if (!container || centeredRef.current) return

    const { width, height } = container.getBoundingClientRect()
    if (width === 0 || height === 0) return

    centeredRef.current = true
    setNodePositions(getCenteredDefaultPositions(width, height))
  }, [])

  // Demo timing
  useEffect(() => {
    if (phase !== 'connected') return

    const delay = 3000 + Math.random() * 2000

    const t1 = setTimeout(() => {
      if (userInteractedRef.current) { setPhase('idle'); return }
      setPhase('disconnecting')

      const t2 = setTimeout(() => {
        if (userInteractedRef.current) { setPhase('idle'); return }
        setConnections([])

        const container = containerRef.current
        if (container) {
          const { width, height } = container.getBoundingClientRect()
          const r = Math.min(width, height) * 0.28
          setNodePositions(getCirclePositions(width / 2, height / 2, r))
        }

        setPhase('circling')

        const t3 = setTimeout(() => {
          if (userInteractedRef.current) { setPhase('idle'); return }
          setPhase('done')
        }, 800)
        hasRunRef.current = true
        return () => clearTimeout(t3)
      }, 400)
      return () => clearTimeout(t2)
    }, delay)
    return () => clearTimeout(t1)
  }, [phase])

  const cancelDemo = useCallback(() => {
    userInteractedRef.current = true
    if (phase === 'connected' || phase === 'disconnecting' || phase === 'circling') {
      setPhase('idle')
    }
  }, [phase])

  const handleRefresh = useCallback(() => {
    userInteractedRef.current = false
    hasRunRef.current = false
    centeredRef.current = false
    localStorage.removeItem(STORAGE_KEY)
    const container = containerRef.current
    if (container) {
      const { width, height } = container.getBoundingClientRect()
      if (width > 0 && height > 0) {
        setNodePositions(getCenteredDefaultPositions(width, height))
      }
    }
    setConnections(getAllConnections())
    setPhase('connected')
  }, [])

  const getOutputCenter = useCallback((id: string) => {
    const p = nodePositions[id]
    return { x: p.x + nw, y: p.y + nh / 2 }
  }, [nodePositions, nw, nh])

  const getInputCenter = useCallback((id: string) => {
    const p = nodePositions[id]
    return { x: p.x, y: p.y + nh / 2 }
  }, [nodePositions, nh])

  const handleNodePointerDown = (id: string, e: React.PointerEvent) => {
    cancelDemo()
    e.preventDefault()
    const p = nodePositions[id]
    dragStartRef.current = { x: e.clientX, y: e.clientY, nodeX: p.x, nodeY: p.y }
    setDraggingNode(id)

    const onMove = (e: PointerEvent) => {
      const start = dragStartRef.current
      if (!start) return
      const dx = e.clientX - start.x
      const dy = e.clientY - start.y
      setNodePositions(prev => ({
        ...prev,
        [id]: {
          x: start.nodeX + dx,
          y: start.nodeY + dy,
        }
      }))
    }

    const onUp = () => {
      setDraggingNode(null)
      dragStartRef.current = null
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  const handlePortPointerDown = (id: string, e: React.PointerEvent) => {
    cancelDemo()
    e.stopPropagation()
    setDraggingFrom(id)

    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()

    const onMove = (e: PointerEvent) => {
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      setDragLineEnd({ x: mx, y: my })

      let target: string | null = null
      for (const node of SERVICE_NODES) {
        if (node.id === id) continue
        const ip = getInputCenter(node.id)
        const dx = mx - ip.x
        const dy = my - ip.y
        if (dx * dx + dy * dy < HIT_R * HIT_R) {
          target = node.id
          break
        }
      }
      setHoveredPort(target)
    }

    const onUp = (e: PointerEvent) => {
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      for (const node of SERVICE_NODES) {
        if (node.id === id) continue
        const ip = getInputCenter(node.id)
        const dx = mx - ip.x
        const dy = my - ip.y
        if (dx * dx + dy * dy < HIT_R * HIT_R) {
          if (
            isValidConnection(id, node.id) &&
            !connections.some(c => c.fromId === id && c.toId === node.id)
          ) {
            setConnections(prev => [...prev, { fromId: id, toId: node.id }])
          }
          break
        }
      }

      setDraggingFrom(null)
      setHoveredPort(null)
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {connections.map(c => {
          const from = getOutputCenter(c.fromId)
          const to = getInputCenter(c.toId)
          return (
            <motion.line
              key={`${c.fromId}-${c.toId}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(85,85,85,0.8)"
              strokeWidth={2}
              strokeLinecap="round"
              animate={{ opacity: phase === 'disconnecting' ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            />
          )
        })}
        {draggingFrom && (() => {
          const from = getOutputCenter(draggingFrom)
          const isValid = hoveredPort && isValidConnection(draggingFrom, hoveredPort)
          const isInvalid = hoveredPort && !isValidConnection(draggingFrom, hoveredPort)
          const color = isValid ? 'rgba(0,230,118,0.2)' : isInvalid ? 'rgba(255,77,0,0.2)' : 'rgba(200,255,0,0.2)'
          return (
            <line
              x1={from.x}
              y1={from.y}
              x2={dragLineEnd.x}
              y2={dragLineEnd.y}
              stroke={color}
              strokeWidth={2}
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          )
        })()}
      </svg>

      {SERVICE_NODES.map(node => {
        const pos = nodePositions[node.id]
        return (
          <motion.div
            key={node.id}
            layout
            style={{
              position: 'absolute',
              width: nw,
              height: nh,
              zIndex: draggingNode === node.id ? 30 : 10,
              cursor: draggingNode === node.id ? 'grabbing' : 'grab',
              backgroundColor: NODE_COLORS[node.label]?.bg ?? '#ffffff',
              borderRadius: 10,
            }}
            animate={{ left: pos.x, top: pos.y }}
            transition={phase === 'circling'
              ? { type: 'spring', stiffness: 120, damping: 18, mass: 0.8 }
              : { duration: 0 }
            }
            onPointerDown={e => handleNodePointerDown(node.id, e)}
          >
            <div
              style={{
                position: 'absolute',
                left: -pr,
                top: '50%',
                transform: 'translateY(-50%)',
                width: pr * 2,
                height: pr * 2,
                borderRadius: '50%',
                backgroundColor: 'rgba(85,85,85,0.2)',
                zIndex: 15,
                transition: 'box-shadow 0.15s',
                boxShadow: hoveredPort === node.id
                  ? '0 0 0 3px rgba(200,255,0,0.5)'
                  : 'none',
              }}
            />
            <div className="flex flex-col items-center justify-center w-full h-full gap-0">
              <Image src={NODE_IMAGE[node.id]} alt={node.label} width={imgSize} height={imgSize} className="pointer-events-none" />
              <span className="font-dm-sans text-ink font-medium leading-tight text-center mt-[2px]" style={{ fontSize: labelSize }}>
                {node.label}
              </span>
            </div>
            <div
              style={{
                position: 'absolute',
                right: -pr,
                top: '50%',
                transform: 'translateY(-50%)',
                width: pr * 2,
                height: pr * 2,
                borderRadius: '50%',
                backgroundColor: 'rgba(85,85,85,0.2)',
                zIndex: 15,
                cursor: 'crosshair',
              }}
              onPointerDown={e => handlePortPointerDown(node.id, e)}
            />
          </motion.div>
        )
      })}

      {/* Try connecting text */}
      {phase === 'done' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        >
          <span className="font-dm-sans text-[13px] text-ink-muted italic">
            Try connecting them yourself!
          </span>
        </motion.div>
      )}

      {/* Refresh button */}
      {(phase === 'done' || phase === 'idle') && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={handleRefresh}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20
                     w-8 h-8 rounded-full border border-[#D0CCC4]
                     flex items-center justify-center
                     hover:border-ink transition-colors bg-white/60 backdrop-blur-sm cursor-pointer"
        >
          <span className="text-[14px] text-ink leading-none">↻</span>
        </motion.button>
      )}
    </div>
  )
}
