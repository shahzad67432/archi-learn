'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Concept } from '@/data/concepts'
import {
  ZombieVisual,
  AuthVisual,
  MultiPodVisual,
  ReconnectVisual,
} from '@/components/concept/scenes/ZoneHardPartsVisuals'
import { useArchi } from '@/lib/context/ArchiContext'

const CHAPTERS = [
  { id: 0, title: 'Zombie Connections', subtitle: 'Heartbeat, ping/pong, memory leaks' },
  { id: 1, title: 'Auth at Handshake',   subtitle: 'JWT validation at connection time' },
  { id: 2, title: 'Multi-Pod & Redis',   subtitle: 'Sticky sessions, Redis Pub/Sub' },
  { id: 3, title: 'Reconnection',        subtitle: 'Exponential backoff, thundering herd' },
]

const CODE_BLOCKS: string[] = [
  // Chapter 0 - Python heartbeat
  `async def heartbeat(websocket: WebSocket):
    while True:
        await asyncio.sleep(30)
        try:
            await websocket.send_text('{"type":"ping"}')
        except:
            break

@app.websocket("/ws/discussion/{thread_id}")
async def discussion_ws(websocket, thread_id):
    await websocket.accept()
    hb_task = asyncio.create_task(heartbeat(websocket))
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            if msg["type"] == "pong":
                pass
            elif msg["type"] == "comment":
                await handle_comment(msg, thread_id)
    except WebSocketDisconnect:
        hb_task.cancel()
        await manager.disconnect(websocket, thread_id)`,

  // Chapter 1 - Python auth
  `async def get_ws_user(websocket: WebSocket):
    token = websocket.headers.get(
        "Authorization", ""
    ).replace("Bearer ", "")

    if not token:
        await websocket.close(code=4001)
        return None

    user = decode_jwt(token)
    if not user:
        await websocket.close(code=4001)
        return None
    return user

@app.websocket("/ws/discussion/{thread_id}")
async def discussion_ws(websocket, thread_id):
    user = await get_ws_user(websocket)
    if not user:
        return
    await websocket.accept()
    # connection is now proof of identity`,

  // Chapter 2 - Python Redis
  `# WRONG — state in pod memory
local_connections = {}  # dies when pod restarts

# RIGHT — state in Redis
async def register_connection(
    user_id: str, thread_id: str, pod_id: str
):
    await redis.hset(
        f"ws:connections:{thread_id}",
        user_id, pod_id
    )
    await redis.expire(
        f"ws:connections:{thread_id}", 3600
    )

# Broadcast via Pub/Sub
await redis.publish(
    f"discussion:{thread_id}",
    json.dumps(message)
)`,

  // Chapter 3 - JS client
  `class WSManager {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxAttempts = 10;
    }

    scheduleReconnect(threadId) {
        if (this.reconnectAttempts >= this.maxAttempts)
            return;

        const base = Math.min(30000,
            1000 * 2 ** this.reconnectAttempts
        );
        const jitter = base * 0.3 * Math.random();
        const delay = base + jitter;

        this.reconnectAttempts++;
        setTimeout(
            () => this.connect(threadId), delay
        );
    }

    connect(threadId) { /* ... */ }
}`,
]

const EXPLANATIONS: { title: string; body: string }[][] = [
  [
    { title: 'The Zombie Problem',
      body: 'This is the #1 real-world WebSocket bug. A user\'s phone loses signal. Their TCP connection doesn\'t cleanly close — it just goes silent. Your server still thinks they\'re connected. That "zombie" connection holds memory, a file descriptor, and a Redis Pub/Sub subscription — all for a user who left 20 minutes ago.' },
    { title: 'Silent Resource Drain',
      body: 'Dead connections silently consume memory and file descriptors. Without heartbeats, you will eventually crash under load. Every production server needs heartbeat implementation to detect and clean up dead peers.' },
    { title: 'The Fix — Ping/Pong',
      body: 'The fix is embarrassingly simple once you know it exists. Send a ping every 30 seconds. If they don\'t pong back, they\'re gone. Clean it up. The WebSocket protocol has ping/pong frames built in for exactly this reason — most tutorials never mention them.' },
  ],
  [
    { title: 'One Chance to Auth',
      body: 'HTTP requests carry auth in every header. WebSocket only has one chance — the handshake. Once the tunnel opens, there are no more headers, no more auth checks. This changes how you think about authentication entirely.' },
    { title: 'Auth at Connection Time',
      body: 'Auth happens once. At the handshake. Not on every message like REST. You validate the JWT when the connection opens and that connection becomes the proof of identity for its entire lifetime. Miss this and anyone can send messages as anyone.' },
    { title: 'The Senior Rule',
      body: 'Senior rule: authenticate at handshake time, not on every message. The user is verified once when they connect. After that, the connection itself is the proof of identity. This is why WebSocket auth mistakes are so dangerous — there\'s no second chance to check.' },
  ],
  [
    { title: 'The Multi-Pod Trap',
      body: 'Pod 1 only knows its own connections. Has no idea Pod 2 exists. Broadcasts to its users. Pod 2\'s users get nothing. This is where most junior engineers make a critical mistake — they assume all pods are one shared system.' },
    { title: 'Redis Pub/Sub Fix',
      body: 'Fix is Redis Pub/Sub. Every pod subscribes to the same channel. One pod publishes, all pods receive, all users see it. 6 lines of code that make realtime actually work across servers. Discord figured this out early. So did Slack.' },
    { title: 'Stateless Architecture',
      body: 'Combined with Redis Pub/Sub, you get a fully stateless WS layer. Don\'t store state in pod memory at all. Every WS connection state goes into Redis. Any pod can serve any user because all state is external. Sticky sessions become optional.' },
  ],
  [
    { title: 'The Thundering Herd',
      body: 'When a server restarts or a network blip occurs, all connected clients disconnect simultaneously. If they all reconnect at once, the TLS handshake and WebSocket upgrade overhead can overwhelm the server before a single message is exchanged.' },
    { title: 'Jittered Reconnection',
      body: 'The fix is jittered reconnection on the client side combined with server-side connection rate limiting. Exponential backoff spreads retries: 1s, 2s, 4s, 8s, 16s — each attempt doubles the wait time.' },
    { title: 'Why Jitter Matters',
      body: 'Without jitter, 5,000 clients all wait exactly 2 seconds and hit the server simultaneously. With jitter (±30% randomness), they spread across a 2–6 second window. The server recovers gracefully instead of collapsing under the reconnect storm.' },
  ],
]

interface Props {
  concept: Concept
  onComplete: () => void
  onNext: () => void
  isVisible?: boolean
}

export default function ZoneHardParts({ concept, onComplete, isVisible = true }: Props) {
  const [activeChapter, setActiveChapter] = useState(0)
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set())
  const [showCode, setShowCode] = useState<boolean[]>([false, false, false, false])
  const [heartbeatActive, setHeartbeatActive] = useState(false)
  const [noRedis, setNoRedis] = useState(true)
  const { showArchiTip, hideArchiTip } = useArchi()

  useEffect(() => {
    if (activeChapter === 0) {
      showArchiTip('Zombie connections eat memory — let\'s fix them!', 'sad')
    } else {
      hideArchiTip()
    }
  }, [activeChapter, showArchiTip, hideArchiTip])

  useEffect(() => {
    return () => hideArchiTip()
  }, [hideArchiTip])
  const scrollRef = useRef<HTMLDivElement>(null)
  const a = concept.color.accent

  const scrollToChapter = useCallback((index: number) => {
    const container = scrollRef.current
    if (!container) return
    const ch = window.innerHeight
    container.scrollTo({ top: index * ch, behavior: 'instant' })
    setActiveChapter(index)
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const handleScroll = () => {
      const st = container.scrollTop
      const ch = window.innerHeight
      const next = Math.round(st / ch)
      if (next !== activeChapter) setActiveChapter(next)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [activeChapter])

  const toggleCode = (idx: number) => {
    setShowCode(prev => { const n = [...prev]; n[idx] = !n[idx]; return n })
  }

  const goNext = useCallback(() => {
    if (activeChapter < CHAPTERS.length - 1) scrollToChapter(activeChapter + 1)
  }, [activeChapter, scrollToChapter])

  const goPrev = useCallback(() => {
    if (activeChapter > 0) scrollToChapter(activeChapter - 1)
  }, [activeChapter, scrollToChapter])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  const markChapterComplete = (idx: number) => {
    const updated = new Set(completedChapters)
    updated.add(idx)
    setCompletedChapters(updated)
    if (updated.size >= CHAPTERS.length) {
      onComplete()
      localStorage.setItem(`zone-complete-${concept.slug}-2`, 'true')
    }
  }

  const resetMultiPod = () => {
    setNoRedis(true)
  }

  const isZoneComplete = completedChapters.size >= CHAPTERS.length

  /* ── render ── */
  return (
    <div
      style={{
        height: 'calc(100dvh - 52px)',
        overflow: 'hidden',
        paddingTop: 52,
        background: '#FFFBF7',
        display: 'flex',
        position: 'relative',
      }}
    >
      {/* LEFT — scrollable chapters */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
        }}
        className="lg:pr-[220px] pr-0 scrollbar-none"
      >
        {CHAPTERS.map((ch, i) => {
          return (
            <div
              key={ch.id}
              style={{
                height: '100dvh',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Chapter header bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 'clamp(8px,1.2vw,14px) clamp(16px,3vw,40px)',
                  borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontSize: 11,
                    fontWeight: 700,
                    color: a,
                    letterSpacing: '0.12em',
                  }}
                >
                  CH.{i + 1}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#1C1917',
                  }}
                >
                  {ch.title}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: 10,
                    color: '#A8A29E',
                    fontStyle: 'italic',
                  }}
                >
                  — {ch.subtitle}
                </span>
              </div>

              {/* Scrollable body */}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                {/* SVG visual area */}
                <div
                  style={{
                    flex: '5 0 0',
                    minHeight: 0,
                    padding: 'clamp(8px,1.2vw,14px) clamp(16px,3vw,40px) 0',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                    {i === 0 && (
                      <>
                        <ZombieVisual accentColor={a} heartbeatActive={heartbeatActive} />
                        {!heartbeatActive && (
                          <motion.button
                            onClick={() => setHeartbeatActive(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              position: 'absolute',
                              right: 20,
                              bottom: 20,
                              background: '#1C1917',
                              color: '#ADFA1D',
                              border: 'none',
                              borderRadius: 8,
                              padding: '8px 14px',
                              fontFamily: 'var(--font-syne)',
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <span>♥ Start Heartbeat</span>
                          </motion.button>
                        )}
                        {heartbeatActive && (
                          <motion.button
                            onClick={() => setHeartbeatActive(false)}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              position: 'absolute',
                              right: 20,
                              bottom: 20,
                              background: a,
                              color: '#FFFBF7',
                              border: 'none',
                              borderRadius: 8,
                              padding: '8px 14px',
                              fontFamily: 'var(--font-syne)',
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            ↺ Reset
                          </motion.button>
                        )}
                      </>
                    )}
                    {i === 1 && <AuthVisual accentColor={a} />}
                    {i === 2 && (
                      <>
                        <MultiPodVisual
                          accentColor={a}
                          noRedis={noRedis}
                        />
                        {noRedis && (
                          <motion.button
                            onClick={() => setNoRedis(false)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              position: 'absolute',
                              right: 20,
                              bottom: 20,
                              background: a,
                              color: '#FFFBF7',
                              border: 'none',
                              borderRadius: 8,
                              padding: '8px 14px',
                              fontFamily: 'var(--font-syne)',
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <span>+ Add Redis Pub/Sub</span>
                          </motion.button>
                        )}
                        {!noRedis && (
                          <motion.button
                            onClick={resetMultiPod}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              position: 'absolute',
                              right: 20,
                              bottom: 20,
                              background: '#1C1917',
                              color: '#ADFA1D',
                              border: 'none',
                              borderRadius: 8,
                              padding: '8px 14px',
                              fontFamily: 'var(--font-syne)',
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            ↺ Reset
                          </motion.button>
                        )}
                      </>
                    )}
                    {i === 3 && <ReconnectVisual accentColor={a} />}
                  </div>
                </div>

                {/* Explanation paragraphs */}
                <div
                  style={{
                    flex: '3 0 0',
                    minHeight: 0,
                    padding: 'clamp(10px,1.5vw,16px) clamp(16px,3vw,40px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    overflowY: 'auto',
                  }}
                >
                  {EXPLANATIONS[i].map((p, pi) => (
                    <div key={pi}>
                      <span
                        style={{
                          fontFamily: 'var(--font-dm-sans)',
                          fontSize: 'clamp(10px,0.85vw,11px)',
                          fontWeight: 600,
                          color: a,
                          display: 'block',
                          marginBottom: 1,
                        }}
                      >
                        {p.title}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-dm-sans)',
                          fontSize: 'clamp(10px,0.8vw,11px)',
                          fontWeight: 300,
                          color: '#57534E',
                          lineHeight: 1.6,
                          display: 'block',
                          maxWidth: 600,
                        }}
                      >
                        {p.body}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Show code + navigation */}
                <div
                  style={{
                    flexShrink: 0,
                    borderTop: '0.5px solid rgba(0,0,0,0.06)',
                    padding: 'clamp(8px,1.2vw,12px) clamp(16px,3vw,40px)',
                  }}
                >
                  {/* Show code toggle */}
                  <div style={{ marginBottom: showCode[i] ? 8 : 0 }}>
                    <button
                      onClick={() => toggleCode(i)}
                      style={{
                        background: 'none',
                        border: '0.5px solid rgba(0,0,0,0.1)',
                        borderRadius: 6,
                        padding: '5px 12px',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: 10,
                        fontWeight: 600,
                        color: '#78716C',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'all 0.15s',
                      }}
                    >
                      {showCode[i] ? '−' : '+'} Show code
                    </button>
                    <AnimatePresence>
                      {showCode[i] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <pre
                            style={{
                              marginTop: 8,
                              background: '#1C1917',
                              color: '#FFFBF7',
                              padding: '12px 16px',
                              borderRadius: 8,
                              fontSize: 'clamp(9px,0.7vw,10px)',
                              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                              lineHeight: 1.6,
                              overflowX: 'auto',
                              maxHeight: 200,
                              overflowY: 'auto',
                            }}
                          >
                            {CODE_BLOCKS[i]}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Navigation row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    {/* Prev / Next */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={goPrev}
                        disabled={i === 0}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 8,
                          border: '1px solid rgba(0,0,0,0.1)',
                          background: i === 0 ? '#F5F3EE' : '#FFFBF7',
                          color: i === 0 ? '#A8A29E' : '#1C1917',
                          fontSize: 11,
                          fontFamily: 'var(--font-syne)',
                          fontWeight: 600,
                          cursor: i === 0 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={goNext}
                        disabled={i === CHAPTERS.length - 1}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 8,
                          border: 'none',
                          background: i < CHAPTERS.length - 1 ? '#1C1917' : '#F5F3EE',
                          color: i < CHAPTERS.length - 1 ? '#FFFBF7' : '#A8A29E',
                          fontSize: 11,
                          fontFamily: 'var(--font-syne)',
                          fontWeight: 600,
                          cursor: i < CHAPTERS.length - 1 ? 'pointer' : 'not-allowed',
                        }}
                      >
                        Next →
                      </button>
                    </div>

                    {/* Chapter complete toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {completedChapters.has(i) ? (
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: 'var(--font-dm-sans)',
                            fontWeight: 600,
                            color: a,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          ✓ Chapter complete
                        </span>
                      ) : (
                        <motion.button
                          onClick={() => markChapterComplete(i)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 8,
                            border: `1px solid ${a}`,
                            background: `${a}15`,
                            color: a,
                            fontSize: 10,
                            fontFamily: 'var(--font-syne)',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Mark Complete
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Zone complete banner */}
                  {isZoneComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginTop: 8,
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: `${a}20`,
                        border: `1px solid ${a}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-syne)',
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#1C1917',
                        }}
                      >
                        🎉 Zone 3 complete!
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* RIGHT — Chapter rail (desktop) — only visible when this zone is active */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="hidden lg:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              right: 24,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 50,
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
              width: 160,
            }}
          >
        {/* Vertical connecting line */}
        <div
          style={{
            position: 'absolute',
            width: 1,
            height: '100%',
            background: 'rgba(0,0,0,0.08)',
            left: 24,
            top: 0,
            zIndex: 0,
          }}
        />

        {CHAPTERS.map((ch, i) => {
          const isCompleted = completedChapters.has(i)
          const isActive = activeChapter === i
          return (
            <div
              key={ch.id}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: 48,
              }}
            >
              {/* Dot */}
              <button
                onClick={() => scrollToChapter(i)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  border: '2px solid',
                  borderColor: isCompleted
                    ? a
                    : isActive
                    ? a
                    : 'rgba(0,0,0,0.12)',
                  background: isCompleted ? a : '#fff',
                  boxShadow: isActive ? `0 0 0 4px ${a}22` : 'none',
                  outline: 'none',
                  padding: 0,
                  flexShrink: 0,
                  marginRight: 10,
                }}
              >
                {isCompleted ? (
                  <span style={{ fontSize: 10, color: '#fff', lineHeight: 1 }}>✓</span>
                ) : (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: isActive ? a : 'rgba(0,0,0,0.15)',
                      transition: 'background 0.3s',
                    }}
                  />
                )}
              </button>

              {/* Label */}
              <div
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#1C1917' : '#A8A29E',
                  transition: 'all 0.2s',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {ch.title}
              </div>

              {/* Connecting line between dots */}
              {i < CHAPTERS.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 12,
                    bottom: -24,
                    width: 1,
                    height: 24,
                    background: isCompleted ? a : 'rgba(0,0,0,0.08)',
                    transition: 'background 0.4s',
                    zIndex: -1,
                  }}
                />
              )}
            </div>
          )
        })}

        {/* Counter */}
        <div
          style={{
            marginTop: 12,
            fontFamily: 'var(--font-dm-sans)',
            fontSize: 9,
            color: '#A8A29E',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          Chapter {activeChapter + 1}/{CHAPTERS.length}
        </div>
      </motion.div>
      )}
      </AnimatePresence>

      {/* MOBILE — bottom dot bar — only visible when this zone is active */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="flex lg:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: 52,
              background: 'rgba(255,251,247,0.95)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderTop: '0.5px solid rgba(0,0,0,0.08)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {CHAPTERS.map((ch, i) => {
              const isCompleted = completedChapters.has(i)
              const isActive = activeChapter === i
              return (
                <button
                  key={ch.id}
                  onClick={() => scrollToChapter(i)}
                  style={{
                    width: isCompleted || isActive ? 24 : 8,
                    height: 8,
                    borderRadius: 20,
                    background: isCompleted
                      ? a
                      : isActive
                      ? a
                      : 'rgba(0,0,0,0.12)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: 'none',
                    padding: 0,
                    outline: 'none',
                  }}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


