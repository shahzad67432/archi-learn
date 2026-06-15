'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { concepts } from '@/data/concepts'
import SupportModal from './SupportModal'

const NAV_LINKS = [
  { href: '/', label: 'Home', hint: '' },
  { href: '/concepts', label: 'Concepts', hint: `${concepts.length} topics →` },
  { href: '/about', label: 'About', hint: 'The story →' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: 52,
          padding: '0 clamp(16px, 3vw, 32px)',
          backgroundColor: 'rgba(255, 251, 247, 0.95)',
          borderBottom: '1px solid rgba(249,115,22,0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <div
          className="h-full md:px-5"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {/* Logo (left) */}
          <Link href="/">
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 18, color: '#1C1917' }}>
              A<span style={{ color: '#F97316' }}>.</span>rchi.learn
            </span>
          </Link>

          {/* Desktop links (center) */}
          <div className="hidden sm:flex items-center">
            <div
              style={{
                backgroundColor: '#FFF0E5',
                borderRadius: 9999,
                padding: '4px 6px',
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: 'none',
                      padding: '6px 16px',
                      borderRadius: 9999,
                      backgroundColor: isActive ? '#1C1917' : 'transparent',
                      color: isActive ? '#FFFBF7' : '#78716C',
                      transition: 'background-color 0.15s, color 0.15s',
                    }}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSupportOpen(true)}
              className="hidden sm:flex items-center"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 12,
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: 9999,
                border: 'none',
                backgroundColor: '#F97316',
                color: '#FFFBF7',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
                gap: 5,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              ☕ Buy me a coffee
            </button>

            {/* Hamburger */}
            <button
              className="sm:hidden"
              onClick={() => setOpen(prev => !prev)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 20,
                color: '#1C1917',
                padding: 4,
                lineHeight: 1,
              }}
            >
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              top: 52,
              left: 0,
              right: 0,
              zIndex: 49,
              overflow: 'hidden',
              backgroundColor: '#FFFBF7',
              borderBottom: '1px solid rgba(249,115,22,0.15)',
              borderLeft: '1px solid rgba(249,115,22,0.15)',
              borderRight: '1px solid rgba(249,115,22,0.15)',
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              padding: '0 clamp(16px, 3vw, 32px)',
            }}
          >
            <div style={{ paddingTop: 8, paddingBottom: 8 }}>
              {NAV_LINKS.map(({ href, label, hint }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 10,
                      backgroundColor: isActive ? '#1C1917' : 'transparent',
                      color: isActive ? '#FFFBF7' : '#1C1917',
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: 14,
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    <span>{label}</span>
                    {isActive ? (
                      <span style={{ color: '#ADFA1D' }}>●</span>
                    ) : (
                      <span style={{ color: '#A8A29E', fontSize: 12 }}>{hint}</span>
                    )}
                  </Link>
                )
              })}
              {/* Mobile support link */}
              <button
                onClick={() => { setOpen(false); setSupportOpen(true) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'transparent',
                  color: '#1C1917',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginBottom: 4,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>☕</span> Buy me a coffee
                </span>
                <span style={{ color: '#F97316', fontSize: 12, fontWeight: 600 }}>☕</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  )
}
