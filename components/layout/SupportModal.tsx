'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, QrCode } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

const PHANTOM_ADDRESS = 'REPLACE_WITH_REAL_SOLANA_ADDRESS'
const BINANCE_ADDRESS = 'REPLACE_WITH_REAL_BNB_ADDRESS'

function truncateAddress(address: string, head = 4, tail = 4) {
  if (address.length <= head + tail) return address
  return `${address.slice(0, head)}...${address.slice(-tail)}`
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // silent
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      style={{
        background: 'none',
        border: `0.5px solid ${copied ? '#16A34A' : '#E7E5E4'}`,
        borderRadius: 6,
        width: 26,
        height: 26,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        color: copied ? '#16A34A' : '#A8A29E',
        transition: 'all 0.15s',
      }}
    >
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

type WalletEntry = {
  index: string
  name: string
  network: string
  address: string
  qrSrc: string
  qrAlt: string
}

const wallets: WalletEntry[] = [
  {
    index: '01',
    name: 'Phantom wallet',
    network: 'SOL',
    address: PHANTOM_ADDRESS,
    qrSrc: '/aboutus/PhantomQR.jpeg',
    qrAlt: 'Phantom wallet QR code',
  },
  {
    index: '02',
    name: 'Binance wallet',
    network: 'BNB',
    address: BINANCE_ADDRESS,
    qrSrc: '/aboutus/BinanceQR.jpeg',
    qrAlt: 'Binance wallet QR code',
  },
]

function WalletRow({ wallet }: { wallet: WalletEntry }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: '0.5px solid #E7E5E4' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '32px 1fr auto',
          alignItems: 'center',
          gap: 10,
          padding: '12px 14px',
          backgroundColor: '#FAFAF9',
        }}
      >
        <span className="font-mono" style={{ fontSize: 11, color: '#D6D3D1' }}>
          {wallet.index}
        </span>

        <div style={{ minWidth: 0 }}>
          <div className="font-syne font-bold" style={{ fontSize: 13, color: '#1C1917' }}>
            {wallet.name}
          </div>
          <div className="font-mono" style={{ fontSize: 10, color: '#A8A29E', marginTop: 2 }}>
            {wallet.network} · {truncateAddress(wallet.address)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          style={{
            backgroundColor: '#1C1917',
            color: '#FFFBF7',
            border: 'none',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            whiteSpace: 'nowrap',
          }}
        >
          <QrCode size={12} />
          {open ? 'Hide' : 'QR'}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        style={{ overflow: 'hidden', backgroundColor: '#FAFAF9' }}
      >
        <div
          style={{
            padding: '0 14px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 140,
              height: 140,
              borderRadius: 8,
              border: '0.5px solid #E7E5E4',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
            }}
          >
            <Image
              src={wallet.qrSrc}
              alt={wallet.qrAlt}
              fill
              className="object-contain"
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              maxWidth: 260,
              backgroundColor: '#F5F4F2',
              borderRadius: 8,
              padding: '7px 10px',
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: 11,
                color: '#57534E',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {wallet.address}
            </span>
            <CopyButton value={wallet.address} label={`Copy ${wallet.name} address`} />
          </div>
        </div>
      </motion.div>
    </div>
  )
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
              background: '#FFFBF7', borderRadius: 16,
              maxWidth: 400, width: '100%',
              padding: '24px 20px 20px',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 10, right: 12,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#A8A29E', lineHeight: 1, padding: 4,
              }}
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center" style={{ marginBottom: 20 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <h2
                className="font-syne font-extrabold"
                style={{ fontSize: 18, color: '#1C1917', marginTop: 8, letterSpacing: '-0.02em' }}
              >
                Fuel the Build
              </h2>
              <p
                className="font-dm-sans text-center"
                style={{ fontSize: 12, color: '#A8A29E', lineHeight: 1.5, maxWidth: 300, marginTop: 4 }}
              >
                Support future lessons via crypto.
              </p>
            </div>

            {/* Wallet rows */}
            <div
              style={{
                border: '0.5px solid #E7E5E4',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              {wallets.map(wallet => (
                <WalletRow key={wallet.index} wallet={wallet} />
              ))}
            </div>

            <p
              className="font-dm-sans text-center"
              style={{ fontSize: 10, color: '#D6D3D1', marginTop: 14 }}
            >
              Every contribution keeps this project built in public.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
