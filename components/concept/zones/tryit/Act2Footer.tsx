'use client'

interface Props {
  $m: boolean
  $d: boolean
  streaming: boolean
  streamPhase: 'idle'|'planning'|'coding'|'testing'|'deploying'|'done'|'interrupted'
  handleGenerateStream: () => void
  handleStopStream: () => void
  a: string
}

export function Act2Footer({ $m, $d, streaming, streamPhase, handleGenerateStream, handleStopStream, a }: Props) {
  return (
    <div
      style={{
        ...($d ? { gridColumn: '1 / -1' } : {}),
        padding: $m ? '8px 12px' : '10px 14px',
        background: '#1C1917',
        borderRadius: 14,
        display: 'flex',
        gap: $m ? 6 : 8,
        flexShrink: 0,
      }}
    >
      <button
        onClick={handleGenerateStream}
        disabled={streaming || streamPhase === 'done'}
        style={{
          flex: 1,
          minHeight: $m ? 44 : 36,
          borderRadius: 8,
          border: 'none',
          background:
            streaming || streamPhase === 'done' ? '#57534E' : a,
          color: '#FFFBF7',
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: 'clamp(10px, 1.5vw, 12px)',
          cursor:
            streaming || streamPhase === 'done'
              ? 'default'
              : 'pointer',
        }}
      >
        ▶ Generate
      </button>
      {streaming && streamPhase !== 'done' && (
        <button
          onClick={handleStopStream}
          style={{
            flex: 1,
            minHeight: $m ? 44 : 36,
            borderRadius: 8,
            border: 'none',
            background: '#EF4444',
            color: '#FFFBF7',
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 'clamp(10px, 1.5vw, 12px)',
            cursor: 'pointer',
          }}
        >
          ⏹ Stop
        </button>
      )}
    </div>
  )
}
