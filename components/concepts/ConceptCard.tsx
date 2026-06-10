'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Concept } from '@/data/concepts'

const DIFFICULTY_STYLES: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: '#DCFCE7', color: '#16A34A' },
  Intermediate: { bg: '#FFF7ED', color: '#C05400' },
  Advanced:     { bg: '#F3F0FF', color: '#6D28D9' },
}

function LockedCard({ concept, index }: { concept: Concept; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      style={{
        backgroundColor: `rgba(255,255,255,0.4)`,
        border: `1px solid rgba(0,0,0,0.06)`,
        borderRadius: 14,
        padding: 'clamp(14px,5%,20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 180,
        cursor: 'default',
        position: 'relative',
      }}
    >
      <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 14, color: '#A8A29E' }}>🔒</span>
      <span className="font-syne" style={{ fontWeight: 800, fontSize: 32, color: 'rgba(0,0,0,0.08)' }}>
        {String(concept.number).padStart(2, '0')}
      </span>
      <span className="font-syne" style={{ fontWeight: 700, fontSize: 14, color: '#A8A29E', marginTop: 4 }}>
        {concept.title}
      </span>
      <div
        style={{
          marginTop: 12,
          backgroundColor: '#F3F4F6',
          color: '#A8A29E',
          fontSize: 10,
          borderRadius: 20,
          padding: '3px 10px',
        }}
      >
        Coming Soon
      </div>
    </motion.div>
  )
}

function PublishedCard({ concept, index }: { concept: Concept; index: number }) {
  const ds = DIFFICULTY_STYLES[concept.difficulty] ?? { bg: '#F3F4F6', color: '#78716C' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      style={{
        backgroundColor: concept.color.bg,
        border: `1px solid ${concept.color.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 200,
      }}
    >
      <Link href={`/concepts/${concept.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Image section — fills full width, no padding */}
        <div
          style={{
            position: 'relative',
            height: 'clamp(100px, 14vw, 140px)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {/* Dark gradient overlay for text readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 50%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={concept.illustration}
            alt={concept.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Overlaid number + difficulty */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'clamp(10px, 1.5vw, 16px)',
            }}
          >
            <span
              className="font-syne"
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: '#fff',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              {String(concept.number).padStart(2, '0')}
            </span>
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 10px',
                borderRadius: 20,
                backdropFilter: 'blur(2px)',
              }}
            >
              {concept.difficulty}
            </span>
          </div>
        </div>

        {/* Content section — padded */}
        <div style={{ padding: 'clamp(14px, 5%, 20px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="font-syne" style={{ fontWeight: 700, fontSize: 'clamp(14px,1.6vw,17px)', color: '#1C1917', lineHeight: 1.1, marginBottom: 4 }}>
            {concept.title}
          </div>
          <div
            className="font-dm-sans"
            style={{
              fontSize: 11,
              color: '#78716C',
              lineHeight: 1.4,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {concept.tagline}
          </div>

          {/* Bottom row: tags + XP (pushed to bottom) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 10 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {concept.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    borderRadius: 4,
                    padding: '2px 6px',
                    fontSize: 10,
                    color: concept.color.accent,
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <span
              className="font-syne"
              style={{
                backgroundColor: concept.color.accent,
                color: '#fff',
                borderRadius: 20,
                padding: '3px 8px',
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              +{concept.xpReward} XP
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function ConceptCard({ concept, index }: { concept: Concept; index: number }) {
  return concept.published
    ? <PublishedCard concept={concept} index={index} />
    : <LockedCard concept={concept} index={index} />
}
