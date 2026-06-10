'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useXPStore } from '@/lib/store/xpStore'
import { CONCEPTS } from '@/lib/data/concepts'

const NAV_LINKS = [
  { href: '/', label: 'Home', hint: '' },
  { href: '/concepts', label: 'Concepts', hint: `${CONCEPTS.length} topics →` },
  { href: '/about', label: 'About', hint: 'The story →' },
]

export default function Nav() {
  const pathname = usePathname()
  const level = useXPStore(s => s.level)
  const [open, setOpen] = useState(false)

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
        <div className="flex items-center justify-between h-full md:px-5">
          {/* Logo */}
          <Link href="/">
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 18, color: '#1C1917' }}>
              A<span style={{ color: '#F97316' }}>.</span>rchi.learn
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center">
            <div
              style={{
                backgroundColor: '#FFF0E5',
                borderRadius: 9999,
                padding: '4px 6px',
                display: 'flex',
                gap: 2,
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
          <div className="flex items-center gap-3">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#FFF0E5',
                border: '1px solid #FDBA74',
                borderRadius: 20,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 600,
                color: '#C05400',
                fontFamily: 'var(--font-dm-sans)',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#F97316' }} />
              <span>{level}</span>
            </div>

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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
