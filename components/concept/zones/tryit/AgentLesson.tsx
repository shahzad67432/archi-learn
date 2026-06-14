'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Concept } from '@/data/concepts'
import { Act1Canvas } from './Act1Canvas'
import { Act1ServicePalette } from './Act1ServicePalette'
import { Act2BrowserPreview } from './Act2BrowserPreview'
import { Act2ArchDiagram } from './Act2ArchDiagram'
import { Act2Footer } from './Act2Footer'
import { Act2MetricsPanel } from './Act2MetricsPanel'
import { MetricBar } from './MetricBar'

interface Props {
  concept: Concept
  onComplete: () => void
  act: 0|1|2
  setAct: (a: 0|1|2) => void
  $m: boolean
  $d: boolean
}

export function AgentLesson({ concept, onComplete, act, setAct, $m, $d }: Props) {
  const [httpRunning, setHttpRunning] = useState(false)
  const [httpProgress, setHttpProgress] = useState(0)
  const [httpError, setHttpError] = useState<null|string>(null)
  const [pollCost, setPollCost] = useState(0)
  const [pollRequests, setPollRequests] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const a = concept.color.accent

  useEffect(() => {
    if (!httpRunning) return
    const progressTimer = window.setInterval(() => {
      setHttpProgress(prev => Math.min(prev + 1, 65))
    }, 123)
    const costTimer = window.setInterval(() => {
      setPollCost(c => c + 0.011)
      setPollRequests(r => r + 1)
    }, 800)
    const errorTimer = window.setTimeout(() => {
      setHttpRunning(false)
      setHttpError('504 Gateway Timeout')
    }, 8000)
    return () => {
      window.clearInterval(progressTimer)
      window.clearInterval(costTimer)
      window.clearTimeout(errorTimer)
    }
  }, [httpRunning])

  useEffect(() => {
    if (!httpRunning && !httpError) return
    const id = window.setInterval(() => setElapsed(prev => prev + 1), 1000)
    return () => window.clearInterval(id)
  }, [httpRunning, httpError])

  // ── Act 1 state ──
  const [connections, setConnections] = useState<{from:string, to:string}[]>([])
  const [selectedNode, setSelectedNode] = useState<string|null>(null)
  const [hint, setHint] = useState(false)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [lastConsequence, setLastConsequence] = useState<string|null>(null)
  const [placedNodes, setPlacedNodes] = useState<{id:string, x:number, y:number}[]>([])
  const [paletteService, setPaletteService] = useState<string|null>(null)

  // ── Act 2 state ──
  const [streaming, setStreaming] = useState(false)
  const [streamPhase, setStreamPhase] = useState<'idle'|'planning'|'coding'|'testing'|'deploying'|'done'|'interrupted'>('idle')
  const [tokens, setTokens] = useState('')
  const [interrupted, setInterrupted] = useState(false)
  const [tokensSaved, setTokensSaved] = useState(0)
  const [showAct1Warning, setShowAct1Warning] = useState(false)

  const handleGenerate = () => {
    setHttpRunning(true)
    setHttpProgress(0)
    setHttpError(null)
    setPollCost(0)
    setPollRequests(0)
    setElapsed(0)
  }

  const SERVICES = [
    { id:'browser', label:'Browser\nClient', color:'#F97316' },
    { id:'cdn', label:'CDN', color:'#8B5CF6' },
    { id:'api-gw', label:'API Gateway\n/ LB', color:'#DC2626' },
    { id:'ws-server', label:'WebSocket\nServer', color:a },
    { id:'app-server', label:'App\nServer', color:'#06B6D4' },
    { id:'orchestrator', label:'AI\nOrchestrator', color:'#8B5CF6' },
    { id:'llm', label:'LLM\nAPI', color:'#F59E0B' },
    { id:'postgres', label:'PostgreSQL', color:'#3B82F6' },
    { id:'redis', label:'Redis\nCache/Queue', color:'#F59E0B' },
    { id:'deploy', label:'Deploy\nTarget', color:'#10B981' },
  ]
  const CORRECT = new Set([
    'browser→cdn', 'cdn→api-gw', 'api-gw→ws-server', 'ws-server→app-server',
    'app-server→orchestrator', 'orchestrator→llm', 'orchestrator→postgres', 'orchestrator→redis', 'orchestrator→deploy',
  ])
  const WRONG: Record<string, string> = {
    'browser→api-gw': '🔥 Bypasses CDN. DDoS hits raw gateway. Infrastructure team paged at 2 AM.',
    'browser→llm': '💸 API keys exposed in browser. Hacker drains $4,200 in 3 hours.',
    'browser→postgres': '🧨 Database exposed to internet. Classic rookie mistake. Senior devs wince.',
    'cdn→ws-server': '❌ CDN cant route WebSocket traffic. Connection fails silently.',
    'api-gw→orchestrator': '⏰ Business logic bypassed. Unvalidated requests reach orchestrator.',
    'api-gw→llm': '💰 Direct LLM calls without orchestration. No context. $800 wasted.',
    'ws-server→postgres': '🔒 WS thread blocked by DB query. All other users frozen.',
    'ws-server→deploy': '🚀 Deployment triggered by WS events. Accidental prod push.',
    'orchestrator→browser': '🌀 Response sent directly to client. Skips all transforms.',
    'app-server→redis': '🔄 App server bypasses orchestrator. Inconsistent cache state.',
  }
  const ACT2_NODES = [
    { id:'browser', label:'Browser\nClient', x:30, y:50, w:90, h:42, color:'#F97316' },
    { id:'cdn', label:'CDN', x:140, y:54, w:80, h:38, color:'#8B5CF6' },
    { id:'api-gw', label:'API Gateway\n/ LB', x:240, y:50, w:95, h:42, color:'#DC2626' },
    { id:'ws-server', label:'WebSocket\nServer', x:355, y:50, w:95, h:42, color:a },
    { id:'app-server', label:'App\nServer', x:120, y:180, w:85, h:38, color:'#06B6D4' },
    { id:'orchestrator', label:'AI\nOrchestrator', x:235, y:178, w:105, h:42, color:'#8B5CF6' },
    { id:'llm', label:'LLM\nAPI', x:40, y:310, w:80, h:38, color:'#F59E0B' },
    { id:'postgres', label:'PostgreSQL', x:140, y:310, w:95, h:38, color:'#3B82F6' },
    { id:'redis', label:'Redis\nCache/Queue', x:255, y:308, w:95, h:42, color:'#F59E0B' },
    { id:'deploy', label:'Deploy\nTarget', x:370, y:310, w:90, h:38, color:'#10B981' },
  ]
  const ACT2_CORRECT = CORRECT
  const ACT2_ACTIVE_PATHS: Record<string, string[]> = {
    planning: ['browser→cdn', 'cdn→api-gw', 'api-gw→ws-server'],
    coding: ['ws-server→app-server', 'app-server→orchestrator'],
    testing: ['orchestrator→llm', 'orchestrator→postgres'],
    deploying: ['orchestrator→redis', 'orchestrator→deploy'],
    done: ['browser→cdn', 'cdn→api-gw', 'api-gw→ws-server', 'ws-server→app-server', 'app-server→orchestrator', 'orchestrator→llm', 'orchestrator→postgres', 'orchestrator→redis', 'orchestrator→deploy'],
  }
  const correctCount = connections.filter(c => CORRECT.has(`${c.from}→${c.to}`)).length

  // ── Act 2 streaming effect ──
  const HTML_TOKENS = `<html>\n  <body>\n    <form class='login'>\n      <input type='email' />\n      <input type='password' />\n      <button>Sign in</button>\n    </form>\n  </body>\n</html>`

  useEffect(() => {
    if (!streaming) return
    const timers: (number|NodeJS.Timeout)[] = []

    const t1 = window.setTimeout(() => setStreamPhase('planning'), 500)
    timers.push(t1)

    const t2 = window.setTimeout(() => {
      setStreamPhase('coding')

      let charIndex = 0
      const t3 = window.setInterval(() => {
        if (charIndex < HTML_TOKENS.length) {
          setTokens(HTML_TOKENS.slice(0, charIndex + 1))
          charIndex++
        } else {
          window.clearInterval(t3)
          const t4 = window.setTimeout(() => {
            setStreamPhase('testing')
            const t5 = window.setTimeout(() => {
              setStreamPhase('deploying')
              const t6 = window.setTimeout(() => {
                setStreamPhase('done')
                setStreaming(false)
              }, 1500)
              timers.push(t6)
            }, 1500)
            timers.push(t5)
          }, 1000)
          timers.push(t4)
        }
      }, 60)
      timers.push(t3)
    }, 2000)
    timers.push(t2)

    return () => timers.forEach(id => window.clearTimeout(id as number))
  }, [streaming])

  const handleGenerateStream = () => {
    if (correctCount < 9) {
      setShowAct1Warning(true)
      return
    }
    setStreaming(true)
    setStreamPhase('planning')
    setTokens('')
    setInterrupted(false)
    setTokensSaved(0)
  }

  const handleStopStream = () => {
    const saved = streamPhase === 'planning' ? 8400 : streamPhase === 'coding' ? 6200 : 3100
    setTokensSaved(saved)
    setInterrupted(true)
    setStreamPhase('interrupted')
    setStreaming(false)
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: act >= 1 ? '0' : 'clamp(16px,2.5vw,32px)',
        gap: 14,
        overflow: act === 2 ? 'hidden' : 'auto',
      }}
    >
      {/* ════════════════════════════════════════════════
          ACT 0 — The Problem
          ════════════════════════════════════════════════ */}
      {act === 0 && (
        <>
          <div className="tryit-content" style={{ flex: 1, minHeight: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* ── LEFT: Mock AI Agent UI ── */}
            <div
              style={{
                background: '#1C1917',
                borderRadius: 14,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, color: '#FFFBF7' }}>
                    AI Coding Agent
                  </div>
                  <div style={{ fontSize: 11, color: '#A8A29E', marginTop: 2 }}>
                    Prompt → Code generator
                  </div>
                </div>
                <div
                  style={{
                    background: '#FEF2F2', color: '#DC2626', padding: '3px 10px',
                    borderRadius: 999, fontSize: 9, fontWeight: 800,
                    fontFamily: 'var(--font-dm-sans)', textTransform: 'uppercase' as const,
                    letterSpacing: '0.04em',
                  }}
                >
                  HTTP REST
                </div>
              </div>

              {/* Prompt input */}
              <div
                style={{
                  background: '#2A2A2A', borderRadius: 8, padding: 12,
                  fontFamily: 'var(--font-mono)', fontSize: 12, color: '#FFFBF7',
                  marginBottom: 12, lineHeight: 1.5,
                }}
              >
                Build me a login page template
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={httpRunning}
                style={{
                  width: '100%', minHeight: 40, borderRadius: 10, border: 'none',
                  background: httpRunning ? '#57534E' : '#EF4444',
                  color: '#FFFBF7', fontFamily: 'var(--font-syne)',
                  fontWeight: 700, fontSize: 13,
                  cursor: httpRunning ? 'default' : 'pointer', marginBottom: 12,
                }}
              >
                {httpRunning ? 'Generating...' : 'Generate with HTTP'}
              </button>

              {/* Progress area */}
              {httpRunning && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: elapsed > 8 ? '#EF4444' : '#A8A29E' }}>
                      {elapsed > 8 ? `${elapsed}s elapsed...` : 'Waiting for server response...'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#A8A29E' }}>
                      {httpProgress}%
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: '#2A2A2A', overflow: 'hidden' }}>
                    <motion.div
                      animate={{ width: `${httpProgress}%` }}
                      transition={{ duration: 0.15 }}
                      style={{ height: '100%', background: '#F97316', borderRadius: 999 }}
                    />
                  </div>
                </div>
              )}

              {/* Error state */}
              {httpError && (
                <div style={{ marginTop: 4, marginBottom: 8 }}>
                  <div style={{ background: '#450A0A', borderRadius: 10, padding: 16, textAlign: 'center' as const }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 22, color: '#EF4444', marginBottom: 8 }}>
                      504 Gateway Timeout
                    </div>
                    <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: '#FCA5A5', lineHeight: 1.6 }}>
                      The cloud proxy dropped your connection.<br />
                      User sees a blank screen. Task lost.
                    </div>
                    <div style={{ fontSize: 36, marginTop: 10 }}>💀</div>
                  </div>
                </div>
              )}

              {/* Polling cost counter */}
              {(httpRunning || httpError) && (
                <div style={{ textAlign: 'center' as const, marginTop: 4, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 8 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#EF4444', fontWeight: 700 }}>
                    💸 ${pollCost.toFixed(3)} wasted on empty polls
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#A8A29E', marginTop: 2 }}>
                    {pollRequests} HTTP requests returned nothing
                  </div>
                </div>
              )}
            </div>

            {httpError && (
              <svg viewBox="0 0 600 80" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <rect x="20" y="24" width="80" height="32" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.4" />
                <text x="60" y="45" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="9" fontWeight="700" fill="#DC2626">Browser</text>
                <path d="M100 40 C120 40 130 40 150 40" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="6 4" />
                <rect x="150" y="24" width="80" height="32" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.4" />
                <text x="190" y="45" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="9" fontWeight="700" fill="#DC2626">HTTP API</text>
                <path d="M230 40 C260 40 270 40 290 40" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="6 4" />
                <rect x="290" y="18" width="90" height="44" rx="6" fill="#450A0A" stroke="#EF4444" strokeWidth="2" />
                <text x="335" y="37" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="9" fontWeight="700" fill="#EF4444">504 Gateway</text>
                <text x="335" y="51" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="8" fontWeight="600" fill="#FCA5A5">Timeout</text>
                <text x="420" y="45" textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="8" fill="#A8A29E">{pollRequests} failed polls</text>
              </svg>
            )}
          </div>

            {/* ── RIGHT: Explanation cards ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { emoji: '🪟', title: 'The UX Black Box', desc: 'User clicks Generate. Stares at a spinner for 22+ seconds. No progress. No feedback. 71% of users abandon after 10 seconds.', impact: '71% abandonment rate' },
                { emoji: '⏰', title: 'Gateway Timeout', desc: 'Cloudflare and AWS ALB kill connections after 30 seconds. Complex AI tasks take longer. Your app crashes. Your user loses everything.', impact: 'Task lost, user gone' },
                { emoji: '🌊', title: 'Polling Overhead', desc: 'To show any progress, devs add polling — 1 request per second. 10,000 users = 10,000 requests/second of pure server noise.', impact: '$340/month in wasted compute' },
              ].map(card => (
                <div key={card.title} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 20, lineHeight: 1 }}>{card.emoji}</div>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 13, color: '#1C1917', marginTop: 6 }}>{card.title}</div>
                  <div style={{ fontSize: 11, color: '#57534E', lineHeight: 1.55, marginTop: 4 }}>{card.desc}</div>
                  <div style={{ marginTop: 8, padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: '#FFF1F2', color: '#BE123C', display: 'inline-block' }}>
                    {card.impact}
                  </div>
                </div>
              ))}

              {(httpRunning || httpError) && (
                <div style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#fff', borderRadius: 12, padding: 12, display: 'grid', gap: 8 }}>
                  <MetricBar label="Abandonment risk" value={71} suffix="%" tone="#DC2626" />
                  <MetricBar label="Cost per session" value={240} suffix="¢" tone="#DC2626" />
                  <MetricBar label="Avg latency" value={22} suffix="s" tone="#DC2626" />
                </div>
              )}
            </div>
          </div>

          {/* Bottom CTA */}
          {httpError && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4, ease: 'easeOut' }}
              style={{ textAlign: 'center' as const, flexShrink: 0 }}
            >
              <button
                onClick={() => setAct(1)}
                style={{ padding: '14px 32px', borderRadius: 12, border: 'none', background: '#1C1917', color: '#FFFBF7', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              >
                Show me the WebSocket way →
              </button>
            </motion.div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════
          ACT 1 — Build It
          ════════════════════════════════════════════════ */}
      {act === 1 && (
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: $m ? '1fr' : 'minmax(0, 1.4fr) minmax(260px, 0.6fr)', gap: 14 }}>
          <Act1Canvas
            $m={$m}
            concept={concept}
            a={a}
            connections={connections}
            setConnections={setConnections}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            hint={hint}
            setHint={setHint}
            wrongAttempts={wrongAttempts}
            setWrongAttempts={setWrongAttempts}
            lastConsequence={lastConsequence}
            setLastConsequence={setLastConsequence}
            placedNodes={placedNodes}
            setPlacedNodes={setPlacedNodes}
            paletteService={paletteService}
            setPaletteService={setPaletteService}
            correctCount={correctCount}
            SERVICES={SERVICES}
            CORRECT={CORRECT}
            WRONG={WRONG}
            setAct={setAct}
          />
          <Act1ServicePalette
            $m={$m}
            placedNodes={placedNodes}
            paletteService={paletteService}
            setPaletteService={setPaletteService}
            correctCount={correctCount}
            wrongAttempts={wrongAttempts}
            hint={hint}
            SERVICES={SERVICES}
            a={a}
          />
        </div>
      )}

      {/* ════════════════════════════════════════════════
          ACT 2 — Watch It Work
          ════════════════════════════════════════════════ */}
      {act === 2 && ($m ? (
        <div style={{
          flex: 1, minHeight: 0, overflow: 'auto',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <Act2BrowserPreview $m={$m} $d={$d} streamPhase={streamPhase} tokens={tokens} tokensSaved={tokensSaved} a={a} />
          <Act2ArchDiagram $m={$m} $d={$d} streamPhase={streamPhase} ACT2_NODES={ACT2_NODES} ACT2_CORRECT={ACT2_CORRECT} ACT2_ACTIVE_PATHS={ACT2_ACTIVE_PATHS} placedNodes={placedNodes} a={a} />
          <Act2Footer $m={$m} $d={$d} streaming={streaming} streamPhase={streamPhase} handleGenerateStream={handleGenerateStream} handleStopStream={handleStopStream} a={a} />
          <Act2MetricsPanel $m={$m} streamPhase={streamPhase} tokensSaved={tokensSaved} concept={concept} a={a} onComplete={onComplete} />
        </div>
      ) : (
        <div style={{
          flex: 1, minHeight: 0, overflow: 'hidden',
          display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(260px, 0.6fr)', gap: 14,
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr auto', gap: 14,
            flex: 1, minHeight: 0, overflow: 'hidden',
          }}>
            <Act2BrowserPreview $m={$m} $d={$d} streamPhase={streamPhase} tokens={tokens} tokensSaved={tokensSaved} a={a} />
            <Act2ArchDiagram $m={$m} $d={$d} streamPhase={streamPhase} ACT2_NODES={ACT2_NODES} ACT2_CORRECT={ACT2_CORRECT} ACT2_ACTIVE_PATHS={ACT2_ACTIVE_PATHS} placedNodes={placedNodes} a={a} />
            <Act2Footer $m={$m} $d={$d} streaming={streaming} streamPhase={streamPhase} handleGenerateStream={handleGenerateStream} handleStopStream={handleStopStream} a={a} />
          </div>
          <Act2MetricsPanel $m={$m} streamPhase={streamPhase} tokensSaved={tokensSaved} concept={concept} a={a} onComplete={onComplete} />
        </div>
      ))}

      {/* ── Act 1 warning modal ── */}
      {showAct1Warning && (
        <div style={{
          position:'fixed', inset:0, zIndex:9999,
          display:'flex', alignItems:'center', justifyContent:'center',
          background:'rgba(0,0,0,0.6)',
        }}>
          <div style={{
            background:'#292524', borderRadius:16, padding:'28px 32px',
            maxWidth:420, width:'90%', color:'#FFFBF7',
            fontFamily:'var(--font-syne)',
            display:'flex', flexDirection:'column', gap:16,
          }}>
            <div style={{ fontSize:18, fontWeight:700 }}>Act 1 Not Complete</div>
            <div style={{ fontSize:14, color:'#A8A29E', lineHeight:1.5 }}>
              Complete the system design in Act 1 before generating code. You need to connect all 9 services correctly.
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:4 }}>
              <button
                onClick={() => setShowAct1Warning(false)}
                style={{
                  padding:'8px 18px', borderRadius:10, border:'1px solid #44403C',
                  background:'transparent', color:'#FFFBF7', cursor:'pointer',
                  fontFamily:'var(--font-syne)', fontWeight:600, fontSize:13,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowAct1Warning(false); setAct(1) }}
                style={{
                  padding:'8px 18px', borderRadius:10, border:'none',
                  background:a, color:'#FFFBF7', cursor:'pointer',
                  fontFamily:'var(--font-syne)', fontWeight:600, fontSize:13,
                }}
              >
                Go to Build It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
