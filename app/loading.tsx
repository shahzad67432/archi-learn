import Image from 'next/image'

export default function Loading() {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFBF7',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Image
        src="/archi-scene.svg"
        alt="Loading..."
        width={280}
        height={280}
        priority
        style={{ maxWidth: '80vw', maxHeight: '60vh' }}
      />
    </div>
  )
}
