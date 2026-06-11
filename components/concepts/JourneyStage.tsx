'use client'

import type { Concept } from '@/data/concepts'
import ConceptCard from './ConceptCard'

interface Props {
  stageNumber: number
  title: string
  theme: string
  concepts: Concept[]
  totalStages: number
}

export default function JourneyStage({ stageNumber, title, theme, concepts, totalStages }: Props) {
  return (
    <div style={{ marginBottom: 12 }}>
      {/* Stage header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* Stage number badge */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: '#1C1917',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            className="font-syne"
            style={{ fontSize: 12, fontWeight: 700, color: '#FFFBF7' }}
          >
            {String(stageNumber).padStart(2, '0')}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="font-syne"
            style={{
              fontWeight: 700,
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: '#1C1917',
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            className="font-dm-sans"
            style={{
              fontSize: 12,
              color: '#78716C',
              marginTop: 1,
            }}
          >
            {theme}
          </div>
        </div>

        {/* Progress for this stage */}
        <div
          className="font-dm-sans"
          style={{
            fontSize: 11,
            color: '#A8A29E',
            flexShrink: 0,
          }}
        >
          {concepts.filter(c => c.published).length}/{concepts.length} available
        </div>
      </div>

      {/* Card grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 'clamp(10px, 1.5vw, 16px)',
        }}
      >
        {concepts.map((concept, i) => (
          <ConceptCard key={concept.slug} concept={concept} index={i} />
        ))}
      </div>

      {/* Divider (not shown after last stage) */}
      {stageNumber < totalStages && (
        <div
          style={{
            height: 1,
            background: 'linear-gradient(to right, transparent, #E5E5E5, transparent)',
            marginTop: 20,
            opacity: 0.5,
          }}
        />
      )}
    </div>
  )
}
