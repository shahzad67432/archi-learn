'use client'

interface Props {
  totalConcepts: number
  totalCategories: number
  totalTime: number
  completedCount: number
  availableCount: number
}

export default function ConceptsHero({ totalConcepts, totalCategories, totalTime, completedCount, availableCount }: Props) {
  return (
    <section style={{ padding: '56px 0 0', maxWidth: 900 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-flame)',
          fontWeight: 600,
          background: '#FFF0E6',
          padding: '4px 12px',
          borderRadius: 20,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            background: 'var(--color-flame)',
            borderRadius: '50%',
            animation: 'concepts-pulse-dot 2s ease infinite',
          }}
        />
        System Design
      </div>

      <h1
        className="font-syne"
        style={{
          fontSize: 'clamp(32px, 4.5vw, 52px)',
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          color: 'var(--color-ink)',
          marginBottom: 16,
        }}
      >
        Core Concepts<br />
        <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--color-ink-muted)' }}>every engineer needs</em>
      </h1>

      <p
        className="font-dm-sans"
        style={{
          fontSize: 17,
          color: 'var(--color-ink-muted)',
          lineHeight: 1.65,
          maxWidth: 580,
          marginBottom: 32,
        }}
      >
        Learn the core building blocks behind scalable systems. Start with the fundamentals, understand how they work, and see how they're used to build applications that grow from hundreds of users to hundreds of millions.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 'clamp(16px, 3vw, 32px)',
          padding: '24px 0',
          borderTop: '1px solid var(--color-surface-raised)',
        }}
      >
        <Stat value={totalConcepts} label="Concepts" />
        <Stat value={totalCategories} label="Categories" />
        <Stat value={`${totalTime}h`} label="Study Time" />
        <Stat value={completedCount} label="Completed" />
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span
        className="font-syne"
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: 'var(--color-ink)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        className="font-dm-sans"
        style={{ fontSize: 12, color: 'var(--color-ink-muted)', letterSpacing: '0.02em' }}
      >
        {label}
      </span>
    </div>
  )
}
