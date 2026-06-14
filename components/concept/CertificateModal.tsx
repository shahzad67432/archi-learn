'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Concept } from '@/data/concepts'
import { generateCertificatePNG, downloadBlob, storeCertificate, getStoredCertificate } from './CertificateUtils'

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

  useEffect(() => {
    const stored = getStoredCertificate(concept.slug)
    if (stored) {
      setName(stored.name)
      setGenerated(true)
    }
  }, [concept.slug])

  const handleGenerate = async () => {
    if (!name.trim()) return
    setLoading(true)
    const certData = {
      name: name.trim(),
      conceptTitle: concept.title,
      conceptTagline: concept.tagline,
      xp: concept.xpReward,
      accentColor: concept.color.accent,
    }
    storeCertificate(concept.slug, certData)
    setGenerated(true)
    setLoading(false)
  }

  const handleDownload = async () => {
    const stored = getStoredCertificate(concept.slug)
    if (!stored) return
    const blob = await generateCertificatePNG(stored)
    downloadBlob(blob, `archi-learn-${concept.slug}-certificate.png`)
  }

  const handleContinue = () => {
    onComplete()
    onNext()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: '#FFFBF7', borderRadius: 20,
          maxWidth: 480, width: '100%',
          padding: '32px 28px 28px',
          display: 'flex', flexDirection: 'column', gap: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        {/* Score summary */}
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: '#DCFCE7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 16, color: '#16A34A' }}>
              {score}/{total}
            </span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, color: '#1C1917' }}>
              {score === total ? 'Perfect score!' : 'Nice work!'}
            </div>
            <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: '#A8A29E' }}>
              You passed the quiz
            </div>
          </div>
        </div>

        {/* Name input (only if not generated yet) */}
        {!generated ? (
          <>
            <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: '#78716C', lineHeight: 1.5 }}>
              Enter your name for the certificate:
            </div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              maxLength={60}
              style={{
                padding: '10px 14px', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.1)',
                fontFamily: 'var(--font-dm-sans)', fontSize: 15,
                color: '#1C1917', background: '#FAFAF9',
                outline: 'none',
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleGenerate() }}
            />
            <button
              onClick={handleGenerate}
              disabled={!name.trim() || loading}
              style={{
                padding: '11px 0', borderRadius: 10, border: 'none',
                background: !name.trim() ? '#D6D3D1' : concept.color.accent,
                color: '#FFFBF7', cursor: !name.trim() ? 'default' : 'pointer',
                fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 14,
              }}
            >
              {loading ? 'Generating...' : 'Generate Certificate'}
            </button>
          </>
        ) : (
          <>
            {/* Certificate preview */}
            <div
              style={{
                background: '#FFFBF7',
                border: `2px solid ${concept.color.accent}`,
                borderRadius: 12, padding: '20px 24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 4, position: 'relative',
              }}
            >
              {/* Decorative corners */}
              <span style={{ position: 'absolute', top: 8, left: 10, fontSize: 18, color: concept.color.accent }}>◆</span>
              <span style={{ position: 'absolute', top: 8, right: 10, fontSize: 18, color: concept.color.accent }}>◆</span>
              <span style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 18, color: concept.color.accent }}>◆</span>
              <span style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 18, color: concept.color.accent }}>◆</span>

              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 18, color: '#1C1917', letterSpacing: '0.04em' }}>
                ARCHI-LEARN
              </div>
              <div style={{ width: 100, height: 2, background: concept.color.accent, margin: '4px 0' }} />
              <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#A8A29E' }}>
                Certificate of Completion
              </div>
              <div style={{ fontSize: 22, margin: '4px 0', color: concept.color.accent }}>★</div>
              <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#A8A29E' }}>This certifies that</div>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 20, color: '#1C1917', margin: '2px 0' }}>
                {name}
              </div>
              <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: '#A8A29E' }}>has successfully completed</div>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, color: concept.color.accent }}>
                {concept.title}
              </div>
              <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 10, color: '#A8A29E', maxWidth: 300, textAlign: 'center' }}>
                {concept.tagline}
              </div>
              <div style={{ width: '60%', height: 1, background: '#E7E5E4', margin: '8px 0' }} />
              <div className="flex items-center w-full justify-between" style={{ padding: '0 10px' }}>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 10, color: '#A8A29E' }}>
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span style={{
                  fontFamily: 'var(--font-dm-sans)', fontSize: 10, fontWeight: 700,
                  padding: '2px 10px', borderRadius: 999, background: '#ADFA1D20', color: '#1C1917',
                }}>
                  +{concept.xpReward} XP
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 10, border: '1.5px solid #1C1917',
                  background: '#FFFBF7', color: '#1C1917', cursor: 'pointer',
                  fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 2v9M4 7l4 4 4-4M2 13h12" />
                </svg>
                Download PNG
              </motion.button>
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1, padding: '11px 0', borderRadius: 10, border: 'none',
                  background: '#1C1917', color: '#FFFBF7', cursor: 'pointer',
                  fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 13,
                }}
              >
                Continue
                <span style={{ marginLeft: 6 }}>→</span>
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
