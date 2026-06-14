'use client'

import { motion } from 'framer-motion'

const BASE_ASKS = [0.7, 1.6, 2.4, 3.1, 4.2]
const BASE_BIDS = [0.5, 1.2, 2.1, 3.4, 4.8]

function formatPrice(price: number) {
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function Orderbook({
  price,
  streamHealthy,
  podBStale,
  accent,
}: {
  price: number
  streamHealthy: boolean
  podBStale: boolean
  accent: string
}) {
  const asks = BASE_ASKS.map((offset, i) => ({
    price: price + offset,
    size: 0.42 + ((i + 1) * 0.31) % 2.4,
  })).reverse()
  const bids = BASE_BIDS.map((offset, i) => ({
    price: price - offset,
    size: 0.58 + ((i + 2) * 0.27) % 2.8,
  }))

  return (
    <div
      style={{
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 12,
        background: '#1C1917',
        color: '#FFFBF7',
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 15 }}>BTC/USDT</div>
          <div style={{ fontSize: 10, color: '#A8A29E', marginTop: 2 }}>dummy realtime orderbook</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <motion.div
            key={Math.round(price * 100)}
            initial={{ y: -4, opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: streamHealthy ? '#ADFA1D' : '#FCD34D', fontWeight: 700 }}
          >
            {formatPrice(price)}
          </motion.div>
          <div style={{ fontSize: 9, color: podBStale ? '#FCA5A5' : '#A8A29E' }}>
            {podBStale ? 'Pod B clients stale' : streamHealthy ? 'streaming live' : 'polling batches'}
          </div>
        </div>
      </div>

      <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr auto auto', columnGap: 10, rowGap: 5, fontFamily: 'var(--font-mono)', fontSize: 10 }}>
        <span style={{ color: '#A8A29E' }}>ASK</span>
        <span style={{ color: '#A8A29E', textAlign: 'right' }}>PRICE</span>
        <span style={{ color: '#A8A29E', textAlign: 'right' }}>SIZE</span>
        {asks.map(row => (
          <div key={`ask-${row.price}`} style={{ display: 'contents' }}>
            <span style={{ height: 14, borderRadius: 3, background: 'linear-gradient(90deg, rgba(239,68,68,0.28), transparent)' }} />
            <span style={{ color: '#FCA5A5', textAlign: 'right' }}>{formatPrice(row.price)}</span>
            <span style={{ color: '#E7E5E4', textAlign: 'right' }}>{row.size.toFixed(3)}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '8px 14px', borderTop: `1px solid ${accent}55`, borderBottom: `1px solid ${accent}55`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#A8A29E' }}>LAST TRADE</span>
        <span style={{ fontFamily: 'var(--font-mono)', color: accent, fontWeight: 800 }}>{formatPrice(price)}</span>
      </div>

      <div style={{ padding: '10px 14px 12px', display: 'grid', gridTemplateColumns: '1fr auto auto', columnGap: 10, rowGap: 5, fontFamily: 'var(--font-mono)', fontSize: 10 }}>
        <span style={{ color: '#A8A29E' }}>BID</span>
        <span style={{ color: '#A8A29E', textAlign: 'right' }}>PRICE</span>
        <span style={{ color: '#A8A29E', textAlign: 'right' }}>SIZE</span>
        {bids.map(row => (
          <div key={`bid-${row.price}`} style={{ display: 'contents' }}>
            <span style={{ height: 14, borderRadius: 3, background: 'linear-gradient(90deg, rgba(16,185,129,0.28), transparent)' }} />
            <span style={{ color: '#86EFAC', textAlign: 'right' }}>{formatPrice(row.price)}</span>
            <span style={{ color: '#E7E5E4', textAlign: 'right' }}>{row.size.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
