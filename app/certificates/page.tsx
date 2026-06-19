'use client'

import { motion } from 'framer-motion'
import CertificateConcept2 from '@/components/certificates/CertificateConcept2'
import ArchiMascotVisual from '@/components/certificates/ArchiMascotVisual'

export default function CertificatesPage() {
  return (
    <main className="min-h-screen pt-[52px] bg-canvas">
      <div className="mx-auto" style={{ maxWidth: 1024, padding: 'clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-syne font-extrabold text-3xl text-ink">Certificates</h1>
          <p className="font-dm-sans text-sm text-ink-muted mt-1">
            Your earned credentials and achievements
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CertificateConcept2 />
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="font-syne font-bold text-lg text-ink mb-4">Mascot Preview</h2>
          <ArchiMascotVisual />
        </motion.div>

      </div>
    </main>
  )
}

