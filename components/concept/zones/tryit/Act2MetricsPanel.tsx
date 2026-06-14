'use client'

import { motion } from 'framer-motion'
import type { Concept } from '@/data/concepts'
import { MetricBar } from './MetricBar'

interface Props {
  $m: boolean
  streamPhase: 'idle'|'planning'|'coding'|'testing'|'deploying'|'done'|'interrupted'
  tokensSaved: number
  concept: Concept
  a: string
  onComplete: () => void
}

export function Act2MetricsPanel({ $m, streamPhase, tokensSaved, concept, a, onComplete }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: $m ? 8 : 12,
        flexShrink: 0,
      }}
    >
      {/* Live Metrics */}
      {streamPhase !== 'idle' && (
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 'clamp(8px, 2vw, 12px)', display: 'grid', gap: 10 }}>
          <MetricBar label="Latency" value={streamPhase === 'done' ? 5 : streamPhase === 'coding' ? 42 : 18} suffix="ms" tone={streamPhase === 'done' ? '#16A34A' : '#D97706'} />
          <MetricBar label="Token rate" value={streamPhase === 'coding' ? 940 : streamPhase === 'done' ? 1280 : 0} suffix="/s" tone={a} />
          <MetricBar label="Cost per session" value={streamPhase === 'done' || streamPhase === 'interrupted' ? 18 : streamPhase === 'coding' ? 9 : 0} suffix="¢" tone={a} />
        </div>
      )}

      {/* Cost comparison */}
      <div
        style={{
          background: '#F5F3EE',
          borderRadius: 12,
          padding: $m ? 'clamp(10px, 3vw, 16px)' : 16,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 'clamp(11px, 2vw, 13px)',
            color: '#1C1917',
            marginBottom: $m ? 8 : 12,
          }}
        >
          Cost Reality
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {[
            { label: '504 errors', http: 'Frequent', ws: 'Never', httpPct: 95, wsPct: 0 },
            { label: 'User wait', http: '22s spinner', ws: 'Live stream', httpPct: 100, wsPct: 0 },
            { label: 'Cost/session', http: '$2.40', ws: '$0.18', httpPct: 100, wsPct: 8 },
            { label: 'Interruptible', http: '❌', ws: '✅', httpPct: 100, wsPct: 0 },
            { label: 'Token waste', http: '100%', ws: '~8,400 saved', httpPct: 100, wsPct: 14 },
          ].map(row => (
            <div key={row.label}>
              <div style={{ fontSize: 'clamp(8px, 1.5vw, 9px)', color: '#A8A29E', fontWeight: 600, marginBottom: 3 }}>{row.label}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <div style={{ height: 5, borderRadius: 999, background: '#FEF2F2', overflow: 'hidden' }}>
                    <motion.div
                      animate={{ width: `${row.httpPct}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      style={{ height: '100%', borderRadius: 999, background: '#EF4444' }}
                    />
                  </div>
                  <div style={{ fontSize: 'clamp(8px, 1.5vw, 9px)', color: '#DC2626', fontWeight: 700, marginTop: 2 }}>{row.http}</div>
                </div>
                <div>
                  <div style={{ height: 5, borderRadius: 999, background: `${a}14`, overflow: 'hidden' }}>
                    <motion.div
                      animate={{ width: `${row.wsPct}%` }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                      style={{ height: '100%', borderRadius: 999, background: a }}
                    />
                  </div>
                  <div style={{ fontSize: 'clamp(8px, 1.5vw, 9px)', color: a, fontWeight: 700, marginTop: 2 }}>{row.ws}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          style={{
            textAlign: 'center' as const,
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              color: a,
            }}
          >
            13× cheaper per session
          </div>
        </motion.div>

        {/* Interrupted savings banner */}
        {streamPhase === 'interrupted' && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            style={{
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 8,
              background: concept.color.bg,
              border: `1px solid ${concept.color.border}`,
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 12,
              color: a,
              fontWeight: 600,
              textAlign: 'center' as const,
            }}
          >
            You just saved ~{tokensSaved} tokens by interrupting — that&apos;s real money.
          </motion.div>
        )}
      </div>

      {/* Complete button */}
      {(streamPhase === 'done' || streamPhase === 'interrupted') && (
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={onComplete}
          style={{
            width: '100%',
            minHeight: $m ? 48 : 44,
            borderRadius: 10,
            border: 'none',
            background: a,
            color: '#FFFBF7',
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 'clamp(11px, 1.8vw, 13px)',
            cursor: 'pointer',
          }}
        >
          ✓ I understand WebSocket streaming
        </motion.button>
      )}
    </div>
  )
}
