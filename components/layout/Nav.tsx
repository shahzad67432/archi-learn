'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu } from 'lucide-react'
import { useXPStore } from '@/lib/store/xpStore'
import { useCountUp } from '@/lib/hooks/useCountUp'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/concepts', label: 'Concepts' },
  { href: '/profile', label: 'Profile' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [scrolledPast, setScrolledPast] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const totalXP = useXPStore(s => s.totalXP)
  const level = useXPStore(s => s.level)
  const animatedXP = useCountUp(totalXP)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolledPast(latest > 80)
  })

  const show = pathname !== '/' || scrolledPast

  return (
    <motion.nav
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-2.5 bg-white/85 backdrop-blur-md rounded-full border border-black/10 w-max"
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : -8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      style={{ pointerEvents: show ? 'auto' : 'none' }}
    >
      <Link href="/" className="flex items-center shrink-0">
        <span className="font-syne font-extrabold text-flame">A.</span>
        <span className="font-syne font-bold text-ink">rchi.learn</span>
      </Link>

      <div className="hidden md:flex items-center gap-5">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname === href
          const isHovered = hoveredLink === href

          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-1"
              onMouseEnter={() => setHoveredLink(href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span
                className={`text-sm font-dm-sans font-medium transition-colors duration-100 ${
                  isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {label}
              </span>
              <motion.span
                className="block w-[3px] h-[3px] rounded-full bg-flame"
                initial={false}
                animate={{ scale: isActive || isHovered ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              />
            </Link>
          )
        })}
      </div>

      <div className="hidden md:flex items-center">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised">
          <span className="font-syne font-bold text-[13px] text-xp-gold">{animatedXP}</span>
          <span className="font-dm-sans font-medium text-[11px] text-ink-muted"> XP · {level}</span>
        </div>
      </div>

      <button className="md:hidden ml-auto" aria-label="Menu">
        <Menu size={20} className="text-ink" />
      </button>
    </motion.nav>
  )
}
