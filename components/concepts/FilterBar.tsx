'use client'

import type { Category } from '@/data/concepts'

interface FilterOption {
  key: Category | 'all'
  label: string
  color?: string
}

const FILTERS: FilterOption[] = [
  { key: 'all', label: 'All' },
  { key: 'scale', label: 'Scalability', color: '#0EA5E9' },
  { key: 'store', label: 'Storage', color: '#10B981' },
  { key: 'net', label: 'Networking', color: '#F59E0B' },
  { key: 'rel', label: 'Reliability', color: '#EF4444' },
  { key: 'msg', label: 'Messaging', color: '#8B5CF6' },
]

interface Props {
  active: Category | 'all'
  onFilter: (cat: Category | 'all') => void
}

export default function FilterBar({ active, onFilter }: Props) {
  return (
    <div
      style={{
        padding: '24px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      {FILTERS.map(f => {
        const isActive = active === f.key
        return (
          <button
            key={f.key}
            onClick={() => onFilter(f.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '6px 14px',
              borderRadius: 20,
              border: isActive ? '1.5px solid transparent' : '1.5px solid var(--color-surface-raised)',
              background: isActive ? 'var(--color-ink)' : 'var(--color-surface)',
              color: isActive ? '#fff' : 'var(--color-ink-muted)',
              fontSize: 13,
              fontWeight: 500,
              fontFamily: 'var(--font-dm-sans)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {f.key !== 'all' && (
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: isActive ? '#fff' : f.color,
                }}
              />
            )}
            {f.label}
          </button>
        )
      })}
    </div>
  )
}
