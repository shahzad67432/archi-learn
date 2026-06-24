'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Concept } from '@/data/concepts'
import { getScenes } from '@/components/concept/scenes/sceneRegistry'
import { useArchi } from '@/lib/context/ArchiContext'

interface Props {
  concept: Concept
  onComplete: () => void
  onNext: () => void
}

export default function ZoneHowItWorks({ concept, onComplete, onNext }: Props) {
  const scenes = getScenes(concept.slug)
  const STEPS = scenes?.howItWorksSteps ?? []
  const StepVisual = scenes?.HowItWorksVisual

  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const { setMood, showArchiTip, hideArchiTip } = useArchi()

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    if (step === 4) {
      setMood('sad')
      hideArchiTip()
    } else if (step === 5) {
      timeouts.push(setTimeout(() => {
        setMood('cheer')
        showArchiTip("The tunnel is alive! 🎉", 'cheer')
      }, 600))
      timeouts.push(setTimeout(() => {
        hideArchiTip()
      }, 3600))
    } else if (step === 6) {
      setMood('celebrating')
      hideArchiTip()
    } else {
      hideArchiTip()
    }

    return () => timeouts.forEach(clearTimeout)
  }, [step, setMood, showArchiTip, hideArchiTip])

  const goNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      setCompleted(true)
      onComplete()
      localStorage.setItem(`zone-complete-${concept.slug}-1`, 'true')
    }
  }, [step, STEPS.length, onComplete, concept.slug])

  const goPrev = useCallback(() => {
    if (step > 0) setStep(s => s - 1)
  }, [step])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  const current = STEPS[step]

  if (!scenes || !STEPS.length) return null

  return (
    <div
      style={{
        height: 'calc(100dvh - 52px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 52,
        background: '#FFFBF7',
      }}
    >
      {/* TOP BAR — zone label + step counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(10px,1.5vw,16px) clamp(16px,3vw,40px)',
          borderBottom: '0.5px solid rgba(0,0,0,0.06)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 13,
            fontWeight: 700,
            color: '#1C1917',
          }}>
            How It Works
          </span>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '3px 9px',
            borderRadius: 20,
            background: concept.color.bg,
            border: `0.5px solid ${concept.color.border}`,
            color: concept.color.accent,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {current.tag}
          </span>
        </div>

        {/* Step counter + progress dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                style={{
                  width: i === step ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i <= step
                    ? concept.color.accent
                    : 'rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <span style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: 11,
            color: '#A8A29E',
          }}>
            {step + 1} / {STEPS.length}
          </span>
        </div>
      </div>

      {/* ANIMATION CANVAS — flex:1, fills most of screen */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          overflow: 'hidden',
          background: concept.color.bg + '30',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(16px,3vw,40px)',
            }}
          >
            {StepVisual && <StepVisual concept={concept} step={step} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM PANEL — step text + navigation */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-center"
        style={{
          flexShrink: 0,
          borderTop: '0.5px solid rgba(0,0,0,0.06)',
          padding: 'clamp(14px,2vw,22px) clamp(16px,3vw,40px)',
          background: '#FFFBF7',
        }}
      >
        {/* Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div style={{
              fontFamily: 'var(--font-syne)',
              fontSize: 'clamp(16px,2vw,22px)',
              fontWeight: 700,
              color: '#1C1917',
              marginBottom: 6,
              lineHeight: 1.1,
            }}>
              {current.title}
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 'clamp(11px,1.1vw,13px)',
              fontWeight: 500,
              color: concept.color.accent,
              marginBottom: 4,
            }}>
              {current.subtitle}
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 'clamp(11px,1vw,13px)',
              fontWeight: 300,
              color: '#78716C',
              lineHeight: 1.6,
              maxWidth: 560,
            }}>
              {current.body}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex flex-wrap items-center gap-2.5 justify-start lg:justify-end flex-shrink-0">
          <button
            onClick={goPrev}
            disabled={step === 0}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.1)',
              background: step === 0 ? '#F5F3EE' : '#FFFBF7',
              color: step === 0 ? '#A8A29E' : '#1C1917',
              fontSize: 16,
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            ←
          </button>

          <motion.button
            onClick={goNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              height: 42,
              paddingLeft: 20,
              paddingRight: 16,
              borderRadius: 10,
              border: 'none',
              background: step === STEPS.length - 1
                ? concept.color.accent
                : '#1C1917',
              color: '#FFFBF7',
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {step === STEPS.length - 1 ? 'Complete ✓' : 'Next'}
            {step < STEPS.length - 1 && (
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: concept.color.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}>→</div>
            )}
          </motion.button>

          {completed && step === STEPS.length - 1 && (
            <motion.button
              onClick={onNext}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                height: 42,
                padding: '0 16px',
                borderRadius: 10,
                border: `1px solid ${concept.color.border}`,
                background: concept.color.bg,
                color: concept.color.accent,
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Zone 3 →
            </motion.button>
          )}
        </div>
        {/* Mobile swipe hint */}
        <div className="lg:hidden flex items-center justify-center gap-1 mt-2">
          <span style={{ fontSize: 10, color: '#A8A29E', fontFamily: 'var(--font-dm-sans)', fontWeight: 300 }}>
            ← → arrow keys or tap buttons to navigate
          </span>
        </div>
      </div>
    </div>
  )
}
