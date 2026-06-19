'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Concept } from '@/data/concepts'
import { generateStoredCertPNG, downloadBlob, storeCertificate, getStoredCertificate, generateCertId } from './CertificateUtils'
import Archi from '@/components/mascot/Archi'
import { useArchi } from '@/lib/context/ArchiContext'

const CONFETTI_COLORS = ['#ADFA1D', '#00C2FF', '#FCD34D', '#FF4D00', '#FF69B4', '#8B5CF6', '#10B981', '#F97316']

interface Props {
  concept: Concept
  score: number
  total: number
  onComplete: () => void
  onNext: () => void
}

export default function CertificateModal({ concept, score, total, onComplete, onNext }: Props) {
  const [name, setName] = useState('')
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [certId, setCertId] = useState('')
  const { setVisible: setGlobalArchiVisible } = useArchi()

  useEffect(() => {
    setGlobalArchiVisible(false)
    return () => setGlobalArchiVisible(true)
  }, [setGlobalArchiVisible])

  const confetti = useMemo(() => {
    const pieces: { left: number; delay: number; duration: number; color: string }[] = []
    for (let i = 0; i < 40; i++) {
      pieces.push({
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 1.5 + Math.random() * 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      })
    }
    return pieces
  }, [])

  useEffect(() => {
    const stored = getStoredCertificate(concept.slug)
    if (stored) {
      setName(stored.name)
      setGenerated(true)
      setCertId(stored.certId)
    }
  }, [concept.slug])

  const handleGenerate = async () => {
    if (!name.trim()) return
    setLoading(true)
    const id = generateCertId(concept.slug)
    const certData = {
      name: name.trim(),
      conceptTitle: concept.title,
      conceptTagline: concept.tagline,
      accentColor: concept.color.accent,
      certId: id,
    }
    storeCertificate(concept.slug, certData)
    setCertId(id)
    setGenerated(true)
    setLoading(false)
  }

  const handleDownload = async () => {
    try {
      const stored = getStoredCertificate(concept.slug)
      if (!stored) return
      const blob = await generateStoredCertPNG(stored)
      downloadBlob(blob, `archi-learn-${concept.slug}-certificate.png`)
    } catch (e) {
      console.error('Certificate download failed:', e)
    }
  }

  const handleShareLinkedIn = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://archi.learn'
    const shareText = `Just mastered ${concept.title} on archi.learn — ${concept.tagline}. If you're preparing for system design interviews this is worth your time. ${origin}/concepts/${concept.slug}`
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(origin)}&text=${encodeURIComponent(shareText)}`
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer')
    onComplete()
    onNext()
  }

  const handleContinue = () => {
    onComplete()
    onNext()
  }

  const firstName = name.trim().split(' ')[0]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2147483647,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {generated && confetti.map((p, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', rotate: 720, opacity: 0 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
            repeat: Infinity,
          }}
          style={{
            position: 'absolute', pointerEvents: 'none',
            left: `${p.left}%`,
            top: -10,
            width: 8, height: 8,
            borderRadius: 3,
            background: p.color,
          }}
        />
      ))}

      {!generated ? (
        /* ── Phase 1: Name input ── */
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
            width: 'clamp(320px,90vw,480px)',
            position: 'relative', zIndex: 1,
          }}
        >
          {/* Outer card */}
          <div
            style={{
              background: '#FFFBF7',
              borderRadius: 16,
              padding: 'clamp(28px,4vw,44px) clamp(20px,3vw,36px)',
              width: '100%',
              border: '2px solid #1C1917',
              boxShadow: `0 0 0 4px #FFFBF7, 0 0 0 6px ${concept.color.accent}30, 0 4px 20px rgba(0,0,0,0.06)`,
            }}
          >
            {/* Inner card */}
            <div
              style={{
                background: '#FAFAF9',
                borderRadius: 12,
                // borderLeft: `4px solid ${concept.color.accent}`,
                padding: 'clamp(20px,3vw,32px)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {/* Header row: text left, Archi right */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-syne)', fontWeight: 700,
                      fontSize: 'clamp(16px,2.4vw,22px)',
                      color: '#1C1917', lineHeight: 1.2,
                    }}
                  >
                    One last thing —
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans)', fontWeight: 400,
                      fontSize: 'clamp(12px,1.6vw,15px)',
                      color: '#78716C', lineHeight: 1.4,
                      marginTop: 4,
                    }}
                  >
                    Your name for the certificate
                  </div>
                </div>
                <div style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: -4 }}>
                  <Archi mood="thinking" fixed={false} size={56} />
                </div>
              </div>

              {/* Input + button */}
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                maxLength={60}
                style={{
                  marginTop: 14, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E7E5E4',
                  fontFamily: 'var(--font-dm-sans)', fontSize: 14,
                  color: '#1C1917', background: '#FFFBF7',
                  outline: 'none', width: '100%', boxSizing: 'border-box',
                }}
                onKeyDown={e => { if (e.key === 'Enter') handleGenerate() }}
              />
              <button
                onClick={handleGenerate}
                disabled={!name.trim() || loading}
                style={{
                  marginTop: 8, padding: '11px 0', borderRadius: 10, border: 'none', width: '100%',
                  background: !name.trim() ? '#E7E5E4' : concept.color.accent,
                  color: !name.trim() ? '#A8A29E' : '#FFFBF7',
                  cursor: !name.trim() ? 'default' : 'pointer',
                  fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 13,
                  transition: 'background 0.15s',
                }}
              >
                {loading ? 'Generating...' : 'Generate Certificate'}
              </button>

              {/* Divider */}
              <div style={{
                textAlign: 'center', marginTop: 16,
                color: concept.color.accent, fontSize: 9,
                letterSpacing: '0.4em', opacity: 0.5,
              }}>
                ✦   ✦   ✦
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* ── Phase 2: Completion card ── */
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
            width: 'clamp(320px,90vw,480px)',
            position: 'relative', zIndex: 1,
          }}
        >
          {/* Outer card */}
          <div
            style={{
              background: '#FFFBF7',
              borderRadius: 16,
              padding: 'clamp(28px,4vw,44px) clamp(20px,3vw,36px)',
              width: '100%',
              border: '2px solid #1C1917',
              boxShadow: `0 0 0 4px #FFFBF7, 0 0 0 6px ${concept.color.accent}30, 0 4px 20px rgba(0,0,0,0.06)`,
            }}
          >
            {/* Inner card */}
            <div
              style={{
                background: '#FAFAF9',
                borderRadius: 12,
                // borderLeft: `4px solid ${concept.color.accent}`,
                padding: 'clamp(20px,3vw,32px)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              {/* Header row: text left, Archi right */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-sans)', fontStyle: 'italic', fontWeight: 500,
                      fontSize: 'clamp(15px,2.2vw,22px)',
                      color: '#1C1917', lineHeight: 1.5,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {`"Congratulations, ${firstName}!\nYou didn't break production. Yet."`}
                  </div>
                </div>
                <div style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: -4 }}>
                  <Archi mood="cheer" fixed={false} size={64} />
                </div>
              </div>

              {/* Divider */}
              <div style={{
                textAlign: 'center', marginTop: 18,
                color: concept.color.accent, fontSize: 9,
                letterSpacing: '0.4em', opacity: 0.5,
              }}>
                ✦   ✦   ✦
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 400 }}>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)',
                  background: 'transparent', color: '#FFFBF7', cursor: 'pointer',
                  fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 2v9M4 7l4 4 4-4M2 13h12" />
                </svg>
                Download Certificate
              </motion.button>
              <motion.button
                onClick={handleShareLinkedIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 10, border: 'none',
                  background: '#0A66C2', color: '#FFFBF7', cursor: 'pointer',
                  fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Share on LinkedIn
              </motion.button>
            </div>

            <motion.button
              onClick={handleContinue}
              whileHover={{ x: 4 }}
              style={{
                alignSelf: 'center', background: 'none', border: 'none',
                color: '#6B6B6B', cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans)', fontSize: 11,
                display: 'flex', alignItems: 'center', gap: 4, padding: '4px 0',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FFFBF7' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6B6B6B' }}
            >
              Continue
              <span style={{ fontSize: 14 }}>→</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2 }}>
        <Archi mood="cheer" fixed={false} size={70} />
      </div>
    </div>
  )
}
