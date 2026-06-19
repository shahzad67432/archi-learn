'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { QrCode, Wallet } from 'lucide-react'

const PHANTOM_ADDRESS = 'REPLACE_WITH_REAL_SOLANA_ADDRESS'
const BINANCE_ADDRESS = 'REPLACE_WITH_REAL_BNB_ADDRESS'

function truncateAddress(address: string, head = 4, tail = 4) {
  if (address.length <= head + tail) return address
  return `${address.slice(0, head)}...${address.slice(-tail)}`
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
          gap: 14,
          padding: '14px 16px',
          backgroundColor: '#FAFAF9',
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: 11, color: '#D6D3D1' }}
        >
          {wallet.index}
        </span>

        <div style={{ minWidth: 0 }}>
          <div
            className="font-syne font-bold"
            style={{ fontSize: 13, color: '#1C1917' }}
          >
            {wallet.name}
          </div>
          <div
            className="font-mono"
            style={{ fontSize: 10, color: '#A8A29E', marginTop: 2 }}
          >
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
            borderRadius: 7,
            padding: '7px 14px',
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            whiteSpace: 'nowrap',
          }}
        >
          <QrCode size={13} />
          {open ? 'Hide QR' : 'Show QR'}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{ overflow: 'hidden', backgroundColor: '#FAFAF9' }}
      >
        <div
          style={{
            padding: '0 16px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 160,
              height: 160,
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
              maxWidth: 280,
              backgroundColor: '#F5F4F2',
              borderRadius: 8,
              padding: '8px 10px',
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

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

export default function FuelTheBuild() {
  return (
    <motion.div {...fadeUp(0.55)} style={{ paddingBottom: 40 }}>
      <div
        style={{
          borderRadius: 16,
          border: '0.5px solid rgba(249, 115, 22, 0.15)',
          backgroundColor: '#FFFBF7',
          padding: 'clamp(24px, 4vw, 44px) clamp(20px, 4vw, 48px)',
        }}
      >
        <div className="flex flex-col items-center" style={{ marginBottom: 24 }}>
          <Wallet size={24} style={{ color: '#F97316' }} />
          <h2
            className="font-syne font-extrabold"
            style={{
              fontSize: 'clamp(20px, 2.5vw, 28px)',
              color: '#1C1917',
              marginTop: 10,
              letterSpacing: '-0.02em',
            }}
          >
            Fuel the Build
          </h2>
          <p
            className="font-dm-sans text-center"
            style={{ fontSize: 13, color: '#A8A29E', lineHeight: 1.6, maxWidth: 420, marginTop: 6 }}
          >
            If Archi.learn helped you level up, consider supporting future lessons
            via crypto. Every contribution keeps this project built in public.
          </p>
        </div>

        <div
          style={{
            border: '0.5px solid #E7E5E4',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {wallets.map(wallet => (
            <WalletRow key={wallet.index} wallet={wallet} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
