'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useArchi } from '@/lib/context/ArchiContext'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

/* ── isometric cube helpers (matched to ZoneHookDiagram) ── */

function isoCube(cx: number, cy: number, w: number, h: number, d: number) {
  const top = `${cx - w},${cy} ${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h}`
  const right = `${cx},${cy + h} ${cx + w},${cy} ${cx + w},${cy + d} ${cx},${cy + h + d}`
  const left = `${cx},${cy + h} ${cx - w},${cy} ${cx - w},${cy + d} ${cx},${cy + h + d}`
  return { top, right, left }
}

export default function NotFound() {
  const [phase, setPhase] = useState(0)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })
  const $m = useMediaQuery('(max-width: 639px)')
  const { setMood, showArchiTip, setVisible } = useArchi()

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 900)
    const t3 = setTimeout(() => setPhase(3), 1500)
    const t4 = setTimeout(() => setPhase(4), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  useEffect(() => {
    setVisible(true)
    showArchiTip("This page doesn't exist. I checked twice. 🔍", 'surprised')
    return () => {
      setMood('idle')
      setVisible(true)
    }
  }, [setVisible, setMood, showArchiTip])

  /* ── Cursor trail ── */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer:coarse)').matches) return

    const dots: HTMLDivElement[] = []
    const max = 12

    const handleMove = (e: MouseEvent) => {
      const dot = document.createElement('div')
      dot.style.cssText = `
        position: fixed; width: 6px; height: 6px; border-radius: 50%;
        background: #F97316; opacity: 0.6; pointer-events: none;
        z-index: 9998; left: ${e.clientX - 3}px; top: ${e.clientY - 3}px;
      `
      document.body.appendChild(dot)
      dots.push(dot)

      if (dots.length > max) {
        const old = dots.shift()
        old?.remove()
      }

      setTimeout(() => {
        dot.style.transition = 'opacity 0.5s'
        dot.style.opacity = '0'
        setTimeout(() => dot.remove(), 500)
      }, 600)
    }

    document.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      document.removeEventListener('mousemove', handleMove)
      dots.forEach(d => d.remove())
    }
  }, [])

  const handleMouse = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100
    setMouse({ x, y })
  }

  /* ISO cube config */
  const cw = 20, ch = 6, cd = 16
  const lx = 70, ly = 72
  const rx = 330, ry = 72
  const leftCube = isoCube(lx, ly, cw, ch, cd)
  const rightCube = isoCube(rx, ry, cw, ch, cd)

  const ts = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  const fields = [
    { label: 'TIMESTAMP', value: ts },
    { label: 'ROOT CAUSE', value: 'User typed something weird' },
    { label: 'AFFECTED SYSTEMS', value: 'This page only (phew)' },
    { label: 'IMPACT', value: 'Mild confusion, recoverable' },
    { label: 'ON-CALL ENGINEER', value: 'Archi 🤖 (always awake)' },
    { label: 'RESOLUTION ETA', value: 'Immediate (click below)' },
  ]

  return (
    <div
      onMouseMove={handleMouse}
      style={{
        background: '#FFFBF7', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(24px,5vw,64px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* ── LAYER 1 - Ghost 404 watermark ── */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          userSelect: 'none', pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-syne)', fontWeight: 800,
            fontSize: 'clamp(180px,30vw,320px)',
            color: 'rgba(249,115,22,0.04)',
            letterSpacing: '-0.06em',
            transform: `translate(${(mouse.x - 50) * 0.02 + '%'}, ${(mouse.y - 50) * 0.02 + '%'})`,
          }}
        >
          404
        </span>
      </div>

      {/* ── LAYER 2 - Incident diagram ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'relative', zIndex: 1, marginBottom: 32 }}
      >
        <svg
          viewBox="0 0 400 120"
          style={{ width: 'clamp(280px,50vw,400px)', display: 'block' }}
        >
          {/* CLIENT cube */}
          <polygon points={leftCube.top} fill="#F97316" opacity={0.9} />
          <polygon points={leftCube.left} fill="#E8630A" opacity={0.85} />
          <polygon points={leftCube.right} fill="#D45408" opacity={0.8} />

          {/* SERVER cube */}
          <polygon points={rightCube.top} fill="#16A34A" opacity={0.9} />
          <polygon points={rightCube.left} fill="#15803D" opacity={0.85} />
          <polygon points={rightCube.right} fill="#166534" opacity={0.8} />

          {/* Broken connection — left segment */}
          <motion.line
            x1={90} y1={72} x2={170} y2={72}
            stroke="#A8A29E" strokeDasharray="4,3"
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: [1, 0.4, 1] } : { opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Broken connection — right segment */}
          <motion.line
            x1={230} y1={72} x2={310} y2={72}
            stroke="#A8A29E" strokeDasharray="4,3"
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: [1, 0.4, 1] } : { opacity: 0 }}
            transition={{ duration: 1.8, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Red X in the gap */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={phase >= 1 ? { opacity: 1, scale: [1, 1.15, 1] } : {}}
            transition={{ type: 'tween', duration: 2, ease: 'easeInOut', delay: 0.4, repeat: Infinity }}
          >
            <line x1={188} y1={60} x2={212} y2={84} stroke="#EF4444" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={212} y1={60} x2={188} y2={84} stroke="#EF4444" strokeWidth={2.5} strokeLinecap="round" />
          </motion.g>

          {/* CLIENT annotation */}
          <rect x={14} y={28} width={82} height={24} rx={4} fill="#1C1917" />
          <text x={55} y={44} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontWeight={700} fontSize={9} fill="#FFFBF7">
            LAYER / CLIENT
          </text>

          {/* SERVER annotation */}
          <rect x={304} y={28} width={82} height={24} rx={4} fill="#1C1917" />
          <text x={345} y={44} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontWeight={700} fontSize={9} fill="#FFFBF7">
            LAYER / SERVER
          </text>

          {/* Error badge */}
          <motion.g
            initial={{ scale: 0 }}
            animate={phase >= 2 ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}
          >
            <rect x={150} y={96} width={106} height={24} rx={8} fill="#FFF1F2" stroke="#FDA4AF" strokeWidth={1} />
            <text x={203} y={112} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontWeight={700} fontSize={11} fill="#BE123C">
              CONNECTION LOST
            </text>
          </motion.g>
        </svg>
      </motion.div>

      {/* ── LAYER 3 - Incident report card ── */}
      {$m ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 8,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'block' }} />
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 700, fontSize: 10, color: '#EF4444' }}>
            INCIDENT-404
          </span>
          <span
            style={{
              fontFamily: 'var(--font-dm-sans)', fontWeight: 700, fontSize: 9,
              color: '#166534', background: '#F0FDF4', padding: '2px 6px', borderRadius: 999,
            }}
          >
            Severity: LOW
          </span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'relative', zIndex: 1,
            background: '#FFFFFF',
            border: '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: 14,
            padding: 'clamp(20px,3vw,32px)',
            width: 'clamp(280px,50vw,480px)',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'block' }} />
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 700, fontSize: 11, color: '#EF4444' }}>
                INCIDENT-404
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-dm-sans)', fontWeight: 700, fontSize: 10,
                color: '#166534', background: '#F0FDF4', padding: '3px 8px', borderRadius: 999,
              }}
            >
              Severity: LOW
            </span>
          </div>

          <div style={{ height: 0.5, background: 'rgba(0,0,0,0.06)', margin: '12px 0' }} />

          {/* Report fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {fields.map(f => (
              <div key={f.label}>
                <div style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 600, fontSize: 10, color: '#A8A29E', marginBottom: 2 }}>
                  {f.label}
                </div>
                <div style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: 12, color: '#1C1917' }}>
                  {f.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 0.5, background: 'rgba(0,0,0,0.06)', margin: '12px 0' }} />

          {/* Resolution note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontStyle: 'italic',
              fontSize: 12, color: '#78716C', lineHeight: 1.6,
            }}
          >
            "POSTMORTEM: The page you're looking for either never existed, was deleted by a distracted dev, or is still being built. Classic."
          </motion.div>
        </motion.div>
      )}

      {/* ── LAYER 4 - Action buttons ── */}
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={phase >= 3 ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.35, delay: 0.15 }}
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', gap: $m ? 8 : 12, flexWrap: 'wrap',
            justifyContent: 'center', marginTop: $m ? 16 : 24,
            width: '100%', maxWidth: $m ? 280 : 'none',
            flexDirection: $m ? 'column' : 'row',
          }}
        >
          <Link
            href="/"
            style={{
              background: '#1C1917', color: '#FFFBF7',
              fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: $m ? 13 : 14,
              borderRadius: 10, padding: $m ? '11px 20px' : '12px 24px',
              textDecoration: 'none', transition: 'transform 0.15s',
              textAlign: 'center', width: $m ? '100%' : 'auto',
            }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = '' }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)' }}
        >
          ← Back to Home
        </Link>

          <Link
            href="/concepts"
            style={{
              background: '#F97316', color: '#FFFFFF',
              fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: $m ? 13 : 14,
              borderRadius: 10, padding: $m ? '11px 20px' : '12px 24px',
              textDecoration: 'none', transition: 'transform 0.15s',
              textAlign: 'center', width: $m ? '100%' : 'auto',
            }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = '' }}
          onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)' }}
        >
          View Concepts →
        </Link>

        <a
          href="mailto:shahzad.exec@gmail.com?subject=INCIDENT-404 Report&body=I found a broken page on Archi.learn"
          style={{
            background: 'transparent', color: '#A8A29E',
            border: '0.5px solid rgba(0,0,0,0.1)',
            fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: $m ? 11 : 12,
            borderRadius: 10, padding: $m ? '11px 20px' : '12px 20px',
            textDecoration: 'none', transition: 'border-color 0.15s, color 0.15s',
            textAlign: 'center', width: $m ? '100%' : 'auto',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#F97316'; e.currentTarget.style.color = '#F97316' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = '#A8A29E' }}
        >
          Report this incident 🙃
        </a>
      </motion.div>

      {/* ── LAYER 5 - Easter egg ── */}
      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3 }}
          style={{
            position: 'relative', zIndex: 1,
            marginTop: 32, textAlign: 'center',
            fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontStyle: 'italic',
            fontSize: 11, color: '#A8A29E',
          }}
        >
          P.S. Archi checked. The page is definitely gone.
        </motion.div>
      )}


    </div>
  )
}
