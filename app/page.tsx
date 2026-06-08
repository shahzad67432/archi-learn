'use client'

import { useXPStore } from '@/lib/store/xpStore'
import { useMascotStore } from '@/lib/store/mascotStore'

export default function Page() {
  const { totalXP, level, addXP } = useXPStore()
  const { state, setState, setTip, tipText } = useMascotStore()

  return (
    <div style={{ padding: '40px', fontFamily: 'var(--font-dm-sans)' }}>
      <h1 style={{ fontFamily: 'var(--font-syne)', color: 'var(--flame)', marginBottom: '24px' }}>
        Archi.learn — State Test
      </h1>

      <div style={{ marginBottom: '32px' }}>
        <p>Total XP: <strong>{totalXP}</strong></p>
        <p>Level: <strong>{level}</strong></p>
        <button
          onClick={() => addXP(100)}
          style={{ marginTop: '12px', padding: '8px 20px', background: 'var(--flame)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          + 100 XP
        </button>
      </div>

      <div>
        <p>Mascot State: <strong>{state}</strong></p>
        <p>Tip Text: <em>{tipText || '(none)'}</em></p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          {(['idle', 'cheer', 'sad'] as const).map(s => (
            <button
              key={s}
              onClick={() => setState(s)}
              style={{ padding: '8px 16px', background: 'var(--surface-raised)', border: '1px solid var(--ink-muted)', borderRadius: '8px', cursor: 'pointer' }}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => setTip('Hello from Archi!')}
            style={{ padding: '8px 16px', background: 'var(--volt)', color: 'var(--ink)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Set Tip
          </button>
        </div>
      </div>
    </div>
  )
}
