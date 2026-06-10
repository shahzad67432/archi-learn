export default function Loading() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFBF7',
      }}
    >
      <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: '#FF6B2B' }} />
    </div>
  )
}
