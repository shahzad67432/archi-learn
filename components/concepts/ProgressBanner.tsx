'use client'

interface Props {
  completed: number
  total: number
}

export default function ProgressBanner({ completed, total }: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-raised)',
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <div>
        <div
          className="font-dm-sans"
          style={{ fontSize: 14, color: 'var(--color-ink-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}
        >
          Your progress
        </div>
        <div className="font-dm-sans" style={{ fontSize: 12, color: 'var(--color-ink-muted)' }}>
          {completed} concept{completed !== 1 ? 's' : ''} mastered
        </div>
      </div>

      <div
        style={{
          flex: 1,
          height: 6,
          background: 'var(--color-surface-raised)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--color-flame), #FF8C38)',
            borderRadius: 3,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      <div>
        <span
          className="font-syne"
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--color-ink)',
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap',
          }}
        >
          {pct}%
        </span>
        <div className="font-dm-sans" style={{ fontSize: 12, color: 'var(--color-ink-muted)' }}>
          complete
        </div>
      </div>
    </div>
  )
}
