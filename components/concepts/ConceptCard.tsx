'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Concept } from '@/data/concepts'
import ConceptDiagram from './ConceptDiagram'
import { useXPStore } from '@/lib/store/xpStore'
import { getStoredCertificate, generateStoredCertPNG, downloadBlob } from '@/components/concept/CertificateUtils'
import { useArchi } from '@/lib/context/ArchiContext'

const DIFFICULTY_STYLES: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: '#DCFCE7', color: '#16A34A' },
  Intermediate: { bg: '#FFF7ED', color: '#C05400' },
  Advanced:     { bg: '#F3F0FF', color: '#6D28D9' },
}

interface Props {
  concept: Concept
  index: number
}

function LockedCard({ concept, index }: Props) {
  const ds = DIFFICULTY_STYLES[concept.difficulty] ?? { bg: '#F3F4F6', color: '#78716C' }
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const { showArchiTip, hideArchiTip } = useArchi()

  const handleHoverStart = () => {
    hoverTimer.current = setTimeout(() => {
      showArchiTip("Complete the previous concept to unlock 🔒", 'pointing')
    }, 600)
  }

  const handleHoverEnd = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hideArchiTip()
  }

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current)
      hideArchiTip()
    }
  }, [hideArchiTip])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: 'easeOut' }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-raised)',
        borderRadius: 16,
        overflow: 'hidden',
        opacity: 0.6,
        pointerEvents: 'none',
      }}
    >
      {/* Diagram area — muted */}
      <div style={{ height: 130, overflow: 'hidden', filter: 'grayscale(0.6) saturate(0.3)', opacity: 0.5 }}>
        <ConceptDiagram concept={concept} />
      </div>

      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          <h2
            className="font-syne"
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: 'var(--color-ink)',
            }}
          >
            {concept.title}
          </h2>
          <span
            style={{
              flexShrink: 0,
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: 20,
              background: ds.bg,
              color: ds.color,
              marginTop: 3,
            }}
          >
            {concept.difficulty}
          </span>
        </div>

        <p
          className="font-dm-sans"
          style={{
            fontSize: 13.5,
            color: 'var(--color-ink-muted)',
            lineHeight: 1.6,
            marginBottom: 14,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {concept.tagline}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
          {concept.tags.map(tag => (
            <span
              key={tag}
              className="font-mono"
              style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 5,
                background: 'var(--color-surface-raised)',
                color: 'var(--color-ink-muted)',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 12, borderTop: '1px solid var(--color-surface-raised)' }}>
          <span
            className="font-dm-sans"
            style={{
              fontSize: 11,
              color: 'var(--color-ink-muted)',
              background: 'var(--color-surface-raised)',
              padding: '4px 14px',
              borderRadius: 20,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="7" width="10" height="8" rx="1.5" />
              <path d="M5.5 7V4.5a2.5 2.5 0 015 0V7" />
            </svg>
            Coming Soon
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function PublishedCard({ concept, index }: Props) {
  const ds = DIFFICULTY_STYLES[concept.difficulty] ?? { bg: '#F3F4F6', color: '#78716C' }
  const completedConcepts = useXPStore(s => s.completedConcepts)
  const isCompleted = completedConcepts.includes(concept.slug)
  const certData = getStoredCertificate(concept.slug)

  const handleDownloadCert = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const data = certData
    if (!data) return
    const blob = await generateStoredCertPNG(data)
    downloadBlob(blob, `archi-learn-${concept.slug}-certificate.png`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: 'easeOut' }}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-raised)',
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      <Link
        href={`/concepts/${concept.slug}`}
        style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}
        onMouseEnter={e => {
          e.currentTarget.closest('div')!.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'
          e.currentTarget.closest('div')!.style.borderColor = 'var(--color-ink)'
        }}
        onMouseLeave={e => {
          e.currentTarget.closest('div')!.style.boxShadow = 'none'
          e.currentTarget.closest('div')!.style.borderColor = 'var(--color-surface-raised)'
        }}
      >
        <div style={{ height: 130, overflow: 'hidden' }}>
          <ConceptDiagram concept={concept} />
        </div>

        <div style={{ padding: '18px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
            <h2
              className="font-syne"
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: 'var(--color-ink)',
              }}
            >
              {concept.title}
            </h2>
            <span
              style={{
                flexShrink: 0,
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
                padding: '3px 9px',
                borderRadius: 20,
                background: ds.bg,
                color: ds.color,
                marginTop: 3,
              }}
            >
              {concept.difficulty}
            </span>
          </div>

          <p
            className="font-dm-sans"
            style={{
              fontSize: 13.5,
              color: 'var(--color-ink-muted)',
              lineHeight: 1.6,
              marginBottom: 14,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {concept.tagline}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
            {concept.tags.map(tag => (
              <span
                key={tag}
                className="font-mono"
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  borderRadius: 5,
                  background: 'var(--color-surface-raised)',
                  color: 'var(--color-ink-muted)',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--color-surface-raised)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-ink-muted)' }}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 13, height: 13 }}>
                  <circle cx="8" cy="8" r="6" /><path d="M8 5v3l2 2" />
                </svg>
                {concept.readTime} min
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-ink-muted)' }}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 13, height: 13 }}>
                  <path d="M8 2l2 4 5 .7-3.5 3.4.8 5L8 12l-4.3 2.1.8-5L1 5.7 6 5z" />
                </svg>
                {concept.rating}
              </span>
            </div>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'var(--font-dm-sans)',
                color: 'var(--color-flame)',
              }}
            >
              Explore
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </div>
        </div>
      </Link>

      {isCompleted && certData && (
        <button
          onClick={handleDownloadCert}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            width: '100%', padding: '10px 0', border: 'none', borderTop: '1px solid var(--color-surface-raised)',
            background: 'var(--color-surface)', color: 'var(--color-ink-muted)', cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans)', fontSize: 12, fontWeight: 600,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#1C1917' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-ink-muted)' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 2v9M4 7l4 4 4-4M2 13h12" />
          </svg>
          Download Certificate
        </button>
      )}
    </motion.div>
  )
}

export default function ConceptCard({ concept, index }: Props) {
  return concept.published
    ? <PublishedCard concept={concept} index={index} />
    : <LockedCard concept={concept} index={index} />
}
