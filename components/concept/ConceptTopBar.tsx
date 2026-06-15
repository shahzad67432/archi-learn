'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Concept } from '@/data/concepts'
import SupportModal from '@/components/layout/SupportModal'

const DIFFICULTY_STYLES: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: '#DCFCE7', color: '#16A34A' },
  Intermediate: { bg: '#FFF7ED', color: '#C05400' },
  Advanced:     { bg: '#F3F0FF', color: '#6D28D9' },
}

export default function ConceptTopBar({
  concept,
  activeZone,
  totalZones,
}: {
  concept: Concept
  activeZone: number
  totalZones: number
}) {
  const ds = DIFFICULTY_STYLES[concept.difficulty] ?? { bg: '#F3F4F6', color: '#78716C' }
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 52,
          zIndex: 100,
        background: 'rgba(255,251,247,0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '0.5px solid rgba(0,0,0,0.07)',
        padding: '0 clamp(16px, 3vw, 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link
        href="/concepts"
        style={{
          textDecoration: 'none',
          background: '#F3F0EB',
          borderRadius: 8,
          padding: '6px 8px 6px 12px',
          fontSize: 13,
          color: '#78716C',
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          transition: 'background 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8E4DD' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F3F0EB' }}
      >
        <span className="hidden sm:inline">← Concepts</span>
        <span className="sm:hidden">←</span>
      </Link>

      <div className="min-w-0" style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: concept.color.accent,
            flexShrink: 0,
          }}
        />
        <span
          className="font-syne"
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: '#1C1917',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {concept.title}
        </span>
        <span
          style={{
            backgroundColor: ds.bg,
            color: ds.color,
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 10px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {concept.difficulty}
        </span>
      </div>

      <button
        onClick={() => setSupportOpen(true)}
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: 11,
          fontWeight: 700,
          padding: '5px 12px',
          borderRadius: 20,
          border: 'none',
          backgroundColor: concept.color.accent,
          color: '#FFFBF7',
          cursor: 'pointer',
          transition: 'opacity 0.15s',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      >
        ☕ Support dev
      </button>

      </div>

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  )
}
