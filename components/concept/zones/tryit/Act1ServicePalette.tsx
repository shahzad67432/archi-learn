'use client'

import { Fragment, useState } from 'react'
import { motion } from 'framer-motion'

interface ServiceDef {
  id: string
  label: string
  color: string
}

interface Props {
  $m: boolean
  placedNodes: {id:string}[]
  paletteService: string | null
  setPaletteService: (v: string | null) => void
  correctCount: number
  wrongAttempts: number
  hint: boolean
  SERVICES: ServiceDef[]
  a: string
}

export function Act1ServicePalette({
  $m, placedNodes, paletteService, setPaletteService,
  correctCount, wrongAttempts, hint, SERVICES, a,
}: Props) {
  const [showMobileModal, setShowMobileModal] = useState(false)

  const paletteGrid = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
      {SERVICES.map(service => {
        const placed = placedNodes.some(p => p.id === service.id)
        const selected = paletteService === service.id
        return (
          <button
            key={service.id}
            onClick={() => {
              if (!placed) {
                setPaletteService(selected ? null : service.id)
                if ($m) setShowMobileModal(false)
              }
            }}
            disabled={placed}
            style={{
              padding: '5px 8px', borderRadius: 6,
              border: selected ? `1.5px solid ${service.color}` : '1px solid transparent',
              background: selected ? `${service.color}12` : placed ? '#F5F5F4' : '#FAFAF9',
              cursor: placed ? 'default' : 'pointer',
              opacity: placed ? 0.45 : 1,
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 10, fontWeight: 600,
              color: placed ? '#A8A29E' : '#1C1917',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 2, background: service.color, flexShrink: 0 }} />
            <span>{placed ? '✓ ' : ''}{service.label.replace('\n', ' ')}</span>
          </button>
        )
      })}
    </div>
  )

  return (
    <>
      {/* Floating "+ Add Service" button (mobile only) */}
      {$m && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 50 }}>
          <button
            onClick={() => setShowMobileModal(true)}
            style={{
              height: 48, padding: '0 20px', borderRadius: 999, border: 'none',
              background: a, color: '#FFFBF7', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
            <span>Add Service</span>
          </button>
        </div>
      )}

      {/* Desktop palette */}
      {!$m && (
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 10, color: '#A8A29E', fontWeight: 800, marginBottom: 8 }}>SERVICES</div>
          {paletteGrid}
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#A8A29E', fontWeight: 600 }}>Placed {placedNodes.length}/10</span>
            <div style={{ width: 80, height: 4, borderRadius: 999, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${(placedNodes.length / 10) * 100}%` }}
                style={{ height: '100%', borderRadius: 999, background: a }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile modal overlay */}
      {$m && showMobileModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setShowMobileModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFBF7', borderRadius: 16, padding: 20,
              maxWidth: 320, width: '90%', maxHeight: '80vh', overflowY: 'auto',
            }}
          >
            <div style={{ fontSize: 13, color: '#1C1917', fontWeight: 800, marginBottom: 12 }}>
              Select a service
            </div>
            {paletteGrid}
            <button
              onClick={() => setShowMobileModal(false)}
              style={{
                marginTop: 12, width: '100%', padding: '8px 0',
                borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)',
                background: '#fff', color: '#78716C', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-dm-sans)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Connection Status (desktop only) */}
      {!$m && (
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 10, color: '#A8A29E', fontWeight: 800, marginBottom: 8 }}>CONNECTIONS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: correctCount === 9 ? '#16A34A' : a, fontFamily: 'var(--font-syne)' }}>
            {correctCount}
            <span style={{ fontSize: 14, color: '#A8A29E' }}>/9 correct</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(0,0,0,0.08)', overflow: 'hidden', marginTop: 8 }}>
            <motion.div
              animate={{ width: `${(correctCount / 9) * 100}%` }}
              style={{ height: '100%', background: a, borderRadius: 999 }}
            />
          </div>
          {wrongAttempts > 0 && (
            <div style={{ marginTop: 8, fontSize: 10, color: '#EF4444', fontWeight: 600 }}>
              {wrongAttempts} wrong attempt{wrongAttempts !== 1 ? 's' : ''}
            </div>
          )}
          {hint && (
            <div style={{ marginTop: 8, fontSize: 10, color: '#78716C', lineHeight: 1.45 }}>
              💡 Hint: Follow the data flow: Browser → CDN → API Gateway → WS Server → App Server → Orchestrator → LLM / PostgreSQL / Redis / Deploy
            </div>
          )}
        </div>
      )}
    </>
  )
}
