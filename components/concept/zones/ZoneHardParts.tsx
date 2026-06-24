'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Concept } from '@/data/concepts'
import { getScenes } from '@/components/concept/scenes/sceneRegistry'
import { useArchi } from '@/lib/context/ArchiContext'

interface Props {
  concept: Concept
  onComplete: () => void
  onNext: () => void
  isVisible?: boolean
}

export default function ZoneHardParts({ concept, onComplete, isVisible = true }: Props) {
  const scenes = getScenes(concept.slug)
  const CHAPTERS = scenes?.hardPartsChapters ?? []
  const ChapterVisual = scenes?.HardPartsVisual

  const [activeChapter, setActiveChapter] = useState(0)
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(new Set())
  const [showCode, setShowCode] = useState<boolean[]>([])
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

  useEffect(() => {
    setShowCode(CHAPTERS.map(() => false))
  }, [CHAPTERS.length])

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
  }, [activeChapter, CHAPTERS.length, scrollToChapter])

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

  const isZoneComplete = completedChapters.size >= CHAPTERS.length

  if (!scenes || !CHAPTERS.length) return null

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
                    {ChapterVisual && <ChapterVisual accentColor={a} chapter={i} />}
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
                  {ch.explanations.map((p, pi) => (
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
                            {ch.codeBlock}
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


