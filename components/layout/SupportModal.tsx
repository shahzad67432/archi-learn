'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Wallet } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SupportModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 2147483647,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFBF7', borderRadius: 20,
              maxWidth: 520, width: '100%',
              padding: '28px 24px 24px',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 12, right: 14,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#A8A29E', fontSize: 18, lineHeight: 1, padding: 4,
              }}
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center" style={{ marginBottom: 24 }}>
              <Wallet size={24} style={{ color: '#F97316' }} />
              <h2
                className="font-syne font-extrabold"
                style={{ fontSize: 20, color: '#1C1917', marginTop: 8, letterSpacing: '-0.02em' }}
              >
                Fuel the Build
              </h2>
              <p
                className="font-dm-sans text-center"
                style={{ fontSize: 13, color: '#A8A29E', lineHeight: 1.5, maxWidth: 360, marginTop: 4 }}
              >
                If Archi.learn helped you level up, consider supporting future lessons via crypto.
              </p>
            </div>

            {/* QR cards */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center"
              style={{ gap: 16 }}
            >
              {/* Phantom */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center"
                style={{
                  flex: 1, maxWidth: 220, width: '100%',
                  borderRadius: 12, overflow: 'hidden',
                  border: '1px solid #E7E5E4',
                  backgroundColor: '#FAFAF9',
                }}
              >
                <div style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #AB9FF2, #7B6FE6)',
                  padding: '8px 14px',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 16 }}>👻</span>
                  <span className="font-syne font-bold" style={{ fontSize: 13, color: '#FFFBF7' }}>Phantom</span>
                </div>
                <div style={{ padding: 12, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: 160, height: 160 }}>
                    <Image
                      src="/aboutus/PhantomQR.jpeg"
                      alt="Phantom Wallet QR"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Binance */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center"
                style={{
                  flex: 1, maxWidth: 220, width: '100%',
                  borderRadius: 12, overflow: 'hidden',
                  border: '1px solid #E7E5E4',
                  backgroundColor: '#FAFAF9',
                }}
              >
                <div style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #F0B90B, #CC9A00)',
                  padding: '8px 14px',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 16 }}>🟡</span>
                  <span className="font-syne font-bold" style={{ fontSize: 13, color: '#1C1917' }}>Binance</span>
                </div>
                <div style={{ padding: 12, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: 160, height: 160 }}>
                    <Image
                      src="/aboutus/BinanceQR.jpeg"
                      alt="Binance Wallet QR"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            <p
              className="font-dm-sans text-center"
              style={{ fontSize: 11, color: '#D6D3D1', marginTop: 16 }}
            >
              Every contribution keeps this project built in public.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
