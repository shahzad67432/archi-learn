'use client'

export default function ZonePlaceholder({
  label,
  color,
}: {
  label: string
  color: string
}) {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `${color}26`,
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color,
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {label.charAt(0)}
        </span>
      </div>
      <span
        className="font-syne"
        style={{ fontSize: 18, fontWeight: 700, color: '#1C1917' }}
      >
        {label}
      </span>
      <span
        className="font-dm-sans"
        style={{ fontSize: 12, color: '#A8A29E' }}
      >
        Coming in next phase
      </span>
    </div>
  )
}
