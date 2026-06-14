'use client'

import { useState, useMemo } from 'react'
import { concepts as allConcepts } from '@/data/concepts'
import type { Category } from '@/data/concepts'
import { useXPStore } from '@/lib/store/xpStore'
import ConceptsHero from './ConceptsHero'
import ProgressBanner from './ProgressBanner'
import FilterBar from './FilterBar'
import ConceptCard from './ConceptCard'

const CATEGORY_LABELS: Record<Category, string> = {
  scale: 'Scalability',
  store: 'Storage & DBs',
  net: 'Networking',
  rel: 'Reliability',
  msg: 'Messaging',
}

const CATEGORY_COLORS: Record<Category, string> = {
  scale: '#0EA5E9',
  store: '#10B981',
  net: '#F59E0B',
  rel: '#EF4444',
  msg: '#8B5CF6',
}

export default function ConceptsPage() {
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all')
  const completedCount = useXPStore(s => s.completedConcepts.length)
  const availableCount = allConcepts.filter(c => c.published).length

  const categories = useMemo(() => {
    const cats = new Set(allConcepts.map(c => c.category))
    return cats.size
  }, [])

  const totalTime = useMemo(() =>
    Math.round(allConcepts.reduce((sum, c) => sum + c.readTime, 0) / 60),
    [],
  )

  const filtered = activeFilter === 'all'
    ? allConcepts
    : allConcepts.filter(c => c.category === activeFilter)

  const grouped = useMemo(() => {
    const groups: Record<string, typeof allConcepts> = {}
    filtered.forEach(c => {
      const key = c.category
      if (!groups[key]) groups[key] = []
      groups[key].push(c)
    })
    return groups
  }, [filtered])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-canvas)',
        paddingTop: 52,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 40px)',
        }}
      >
        <ConceptsHero
          totalConcepts={allConcepts.length}
          totalCategories={categories}
          totalTime={totalTime}
          completedCount={completedCount}
          availableCount={availableCount}
        />

        <div style={{ padding: '28px 0 0' }}>
          <ProgressBanner completed={completedCount} total={allConcepts.length} />
        </div>

        <FilterBar active={activeFilter} onFilter={setActiveFilter} />

        {Object.entries(grouped).map(([cat, concepts]) => (
          <div key={cat}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                padding: '32px 0 14px',
              }}
            >
              <h2
                className="font-syne"
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: CATEGORY_COLORS[cat as Category],
                  }}
                />
                {CATEGORY_LABELS[cat as Category]}
              </h2>
              <span
                className="font-dm-sans"
                style={{ fontSize: 13, color: 'var(--color-ink-muted)' }}
              >
                {concepts.length} concept{concepts.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
                gap: 20,
              }}
            >
              {concepts.map((concept, i) => (
                <ConceptCard key={concept.slug} concept={concept} index={i} />
              ))}
            </div>
          </div>
        ))}

        <div style={{ height: 80 }} />
      </div>
    </div>
  )
}
