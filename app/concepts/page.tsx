'use client'

import Image from 'next/image'
import { concepts } from '@/data/concepts'
import ConceptCard from '@/components/concepts/ConceptCard'

const decorImages = [
  '/hero-chapter_01.svg',
  '/hero-chapter_02.svg',
  '/hero-chapter_03.svg',
  '/hero-chapter_04.svg',
]

const TOTAL_SLOTS = concepts.length
const DECOR_INTERVAL = 3
const decorSlots = Array.from({ length: TOTAL_SLOTS }, (_, i) => i)
  .filter(i => i % DECOR_INTERVAL === 0)

export default function ConceptsPage() {
  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: '#FFFBF7',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header strip ── */}
      <div
        style={{
          padding: '0 clamp(16px, 3vw, 32px)',
          paddingTop: 'clamp(16px, 2vh, 28px)',
          paddingBottom: 'clamp(12px, 1.5vh, 20px)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }} className='mt-12'>
          {/* Left side */}
          {/* <div>
            <span
              className="font-dm-sans"
              style={{ fontSize: 10, color: '#A8A29E', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}
            >
              Concepts
            </span>
            <div className="font-syne" style={{ fontWeight: 800, fontSize: 'clamp(22px,3vw,36px)', color: '#1C1917', lineHeight: 1.05 }}>
              {concepts.length} Topics
            </div>
            <div className="font-dm-sans" style={{ fontSize: 13, color: '#78716C', marginTop: 2 }}>
              Master system design one concept at a time.
            </div>
          </div> */}

          {/* Right side */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }} className='mr-4'>
            {/* Total XP pill */}
            {/* <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#FFF0E5',
                border: '1px solid #FDBA74',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 11,
                fontWeight: 600,
                color: '#C05400',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#F97316' }} />
              <span>Up to {totalXP} XP</span>
            </div> */}

            {/* Difficulty legend */}
            {/* <div style={{ display: 'flex', gap: 12 }}>
              {[
                { label: 'Beginner', color: '#16A34A' },
                { label: 'Intermediate', color: '#F97316' },
                { label: 'Advanced', color: '#8B5CF6' },
              ].map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: d.color }} />
                  <span className="font-dm-sans" style={{ fontSize: 11, color: '#78716C' }}>{d.label}</span>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      {/* ── Concepts grid ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 clamp(16px, 3vw, 32px)',
          paddingBottom: 24,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'clamp(10px, 1.5vw, 16px)',
            alignContent: 'start',
          }}
        >
          {Array.from({ length: TOTAL_SLOTS }, (_, i) => {
            const decorIdx = decorSlots.indexOf(i)
            if (decorIdx !== -1) {
              const src = decorImages[decorIdx % decorImages.length]
              return (
                <div
                  key={`decor-${i}`}
                  style={{
                    borderRadius: 14,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 180,
                  }}
                >
                  <Image src={src} alt="" width={200} height={200} style={{ width: '100%', height: 'auto' }} />
                </div>
              )
            }
            const cardIndex = i - decorSlots.filter(d => d < i).length
            return <ConceptCard key={concepts[cardIndex].slug} concept={concepts[cardIndex]} index={cardIndex} />
          })}
        </div>
      </div>
    </div>
  )
}
