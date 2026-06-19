'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  { label: 'TCP', status: 'SYN → SYN-ACK → ACK', delay: 0 },
  { label: 'TLS', status: 'Securing channel...', delay: 280 },
  { label: 'HTTP 101', status: 'Upgrading protocol...', delay: 560 },
  { label: 'TUNNEL', status: 'Connection open.', delay: 840 },
]

export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [currentStep, setCurrentStep] = useState(-1)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('loader-shown') === 'true') {
      setVisible(false)
      return
    }

    STEPS.forEach((s, i) => {
      setTimeout(() => setCurrentStep(i), s.delay)
    })

    setTimeout(() => setDone(true), 1100)
    setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('loader-shown', 'true')
    }, 1400)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#1C1917',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 32,
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ y: -8 }}
            animate={{ y: 0 }}
            style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(24px,3vw,36px)', color: '#FFFBF7' }}
          >
            A<span style={{ color: '#F97316' }}>.</span>rchi.learn
          </motion.div>

          {/* Connection Diagram */}
          <svg
            viewBox="0 0 280 60"
            style={{ width: 'clamp(200px,40vw,280px)', overflow: 'visible' }}
          >
            {/* CLIENT */}
            <rect x={0} y={15} width={72} height={30} rx={6} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" />
            <text x={36} y={34} textAnchor="middle" fontFamily="var(--font-syne)" fontWeight={700} fontSize={10} fill="#FFFFFF">
              CLIENT
            </text>

            {/* SERVER */}
            <rect x={208} y={15} width={72} height={30} rx={6} fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.3)" />
            <text x={244} y={34} textAnchor="middle" fontFamily="var(--font-syne)" fontWeight={700} fontSize={10} fill="#F97316">
              SERVER
            </text>

            {/* Connection line */}
            <motion.line
              x1={72} y1={30} x2={208} y2={30}
              stroke="#F97316" strokeWidth={1.5}
              strokeDasharray="136"
              initial={{ strokeDashoffset: 136 }}
              animate={{ strokeDashoffset: done ? 0 : 136 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            {/* Traveling dot */}
            <motion.circle
              r={4} cy={30}
              fill="#ADFA1D"
              animate={{ cx: done ? [72, 208, 72] : [72, 72] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            />
          </svg>

          {/* Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -12 }}
                animate={currentStep >= i ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <div style={{ width: 16, textAlign: 'center', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 12 }}>
                  {currentStep > i ? (
                    <span style={{ color: '#ADFA1D' }}>✓</span>
                  ) : currentStep === i ? (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      style={{ color: '#F97316' }}
                    >
                      ●
                    </motion.span>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                  )}
                </div>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 12, color: currentStep >= i ? '#FFFBF7' : 'rgba(255,255,255,0.2)' }}>
                  {step.label}
                </span>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 10, color: currentStep >= i ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)' }}>
                  {step.status}
                </span>
              </motion.div>
            ))}
          </div>

          {/* TUNNEL OPEN */}
          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#ADFA1D', display: 'block' }}
              />
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 13, color: '#ADFA1D', letterSpacing: '0.2em' }}>
                TUNNEL OPEN
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
