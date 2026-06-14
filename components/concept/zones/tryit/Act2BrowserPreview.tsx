'use client'

import { motion } from 'framer-motion'

interface Props {
  $m: boolean
  $d: boolean
  streamPhase: 'idle'|'planning'|'coding'|'testing'|'deploying'|'done'|'interrupted'
  tokens: string
  tokensSaved: number
  a: string
}

export function Act2BrowserPreview({ $m, streamPhase, tokens, tokensSaved, a }: Props) {
  return (
    <div
      style={{
        ...($m ? { height: 'clamp(200px, 38vh, 340px)', flexShrink: 0, display: 'flex', flexDirection: 'column' } : { display: 'flex', flexDirection: 'column' }),
        background: '#1C1917',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      {/* Header — traffic lights only */}
      <div
        style={{
          padding: $m ? '8px 12px' : '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
        </div>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: $m ? 12 : 16,
          display: 'flex',
          flexDirection: 'column',
          gap: $m ? 8 : 10,
        }}
      >
        {/* Prompt */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(10px, 2vw, 11px)',
            color: a,
            fontWeight: 700,
          }}
        >
          &gt; prompt: &apos;Build me a login page template&apos;
        </div>

        {(streamPhase === 'planning' ||
          streamPhase === 'coding' ||
          streamPhase === 'testing' ||
          streamPhase === 'deploying' ||
          streamPhase === 'done') && (
          <motion.div
            key={`planning-${streamPhase}`}
            initial={{ x: -12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(10px, 2vw, 11px)',
              color: '#F59E0B',
              fontWeight: 600,
            }}
          >
            [STATUS] Planning file structure...
          </motion.div>
        )}

        {(streamPhase === 'coding' ||
          streamPhase === 'testing' ||
          streamPhase === 'deploying' ||
          streamPhase === 'done') && (
          <motion.div
            key={`coding-start-${streamPhase}`}
            initial={{ x: -12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(10px, 2vw, 11px)',
                color: a,
                fontWeight: 600,
                marginBottom: tokens ? 8 : 0,
              }}
            >
              [CODE_STREAM] Generating tokens...
            </div>
            {streamPhase === 'coding' && tokens && (
              <div
                style={{
                  background: '#2A2A2A',
                  borderRadius: 6,
                  padding: 10,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(9px, 1.8vw, 10px)',
                  color: '#ADFA1D',
                  lineHeight: 1.6,
                  whiteSpace: 'pre' as const,
                  overflow: 'auto',
                  maxHeight: 140,
                }}
              >
                {tokens}
                {streamPhase === 'coding' && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    style={{ color: '#ADFA1D' }}
                  >
                    |
                  </motion.span>
                )}
              </div>
            )}
          </motion.div>
        )}

        {(streamPhase === 'testing' ||
          streamPhase === 'deploying' ||
          streamPhase === 'done') && (
          <motion.div
            key={`testing-${streamPhase}`}
            initial={{ x: -12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(10px, 2vw, 11px)',
              color: '#F59E0B',
              fontWeight: 600,
            }}
          >
            [STATUS] Running test scripts...
          </motion.div>
        )}

        {(streamPhase === 'deploying' || streamPhase === 'done') && (
          <motion.div
            key={`deploying-${streamPhase}`}
            initial={{ x: -12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(10px, 2vw, 11px)',
              color: '#F59E0B',
              fontWeight: 600,
            }}
          >
            [STATUS] Deploying to preview...
          </motion.div>
        )}

        {streamPhase === 'done' && (
          <motion.div
            key="done"
            initial={{ x: -12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(10px, 2vw, 11px)',
                color: a,
                fontWeight: 700,
              }}
            >
              [SUCCESS] Live at preview.app/login-abc123
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(9px, 1.8vw, 10px)',
                color: '#16A34A',
              }}
            >
              Total time: 4.2s
            </div>
          </motion.div>
        )}

        {streamPhase === 'interrupted' && (
          <motion.div
            key="interrupted"
            initial={{ x: -12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(10px, 2vw, 11px)',
                color: '#EF4444',
                fontWeight: 700,
              }}
            >
              [INTERRUPTED] Generation stopped by user
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(9px, 1.8vw, 10px)',
                color: '#16A34A',
              }}
            >
              Tokens saved: ~{tokensSaved}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
