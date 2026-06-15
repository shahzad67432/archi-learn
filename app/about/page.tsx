'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, Wallet, Play } from 'lucide-react'

const SOCIALS = [
  {
    href: 'https://github.com/shahzad67432',
    label: 'GitHub',
    path: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8',
    color: '#1C1917',
  },
  {
    href: 'https://www.linkedin.com/in/muhammad-shahzad-ali-225893298/',
    label: 'LinkedIn',
    path: 'M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.493 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z',
    color: '#0A66C2',
  },
  {
    href: 'https://x.com/shahzadexec',
    label: 'X / Twitter',
    path: 'M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z',
    color: '#1C1917',
  },
  {
    href: '#',
    label: 'YouTube',
    path: 'M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z',
    color: '#FF0000',
    comingSoon: true,
  },
]

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
})

const stagger = (base: number, i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: base + i * 0.08, ease: 'easeOut' as const },
})

const pillStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '5px 14px', borderRadius: 999,
  backgroundColor: '#FFF0E5', border: '1px solid #FDBA74',
  fontFamily: 'var(--font-dm-sans)', fontSize: 11, fontWeight: 700,
  color: '#C05400', letterSpacing: '0.06em', textTransform: 'uppercase',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-canvas relative pt-[52px] overflow-hidden">
      {/* ── Ghost watermark ── */}
      <div
        className="fixed left-0 top-0 pointer-events-none select-none font-syne font-extrabold whitespace-pre-line z-0"
        style={{
          fontSize: 'clamp(56px, 14vw, 160px)',
          color: 'rgba(249, 115, 22, 0.045)',
          letterSpacing: '-0.04em',
          lineHeight: 0.82,
          padding: '52px clamp(20px, 4vw, 48px)',
          transform: 'translateX(-2%) translateY(-2%)',
        }}
      >
        {'BUILT\nIN PUBLIC'}
      </div>

      <div className="relative z-10" style={{ maxWidth: 960, margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)' }}>

        {/* ════════════════════════════════════════
            SECTION 1 — Hero
           ════════════════════════════════════════ */}
        <motion.div {...fadeUp(0.1)} className="flex flex-col items-center" style={{ padding: 'clamp(40px, 8vh, 80px) 0 clamp(24px, 4vh, 48px)' }}>
          <span style={pillStyle}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#F97316' }} />
            Built in Public
          </span>

          <h1
            className="font-syne font-extrabold text-center"
            style={{ fontSize: 'clamp(28px, 5vw, 52px)', color: '#1C1917', lineHeight: 0.95, marginTop: 20, letterSpacing: '-0.03em' }}
          >
            The Story Behind<br />
            <span style={{ color: '#F97316' }}>Archi.Learn</span>
          </h1>

          <p
            className="font-dm-sans text-center"
            style={{ fontSize: 'clamp(14px, 1.6vw, 18px)', color: '#78716C', lineHeight: 1.6, maxWidth: 580, marginTop: 16 }}
          >
            A gamified, interactive platform that turns abstract system design concepts into
            playable zones. Built one lesson at a time — in the open, for everyone.
          </p>
        </motion.div>

        {/* ════════════════════════════════════════
            SECTION 2 — Career Hook
           ════════════════════════════════════════ */}
        <motion.div {...fadeUp(0.25)} style={{
          borderRadius: 16,
          background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
          padding: 'clamp(28px, 4vw, 44px) clamp(24px, 4vw, 48px)',
          marginBottom: 40,
        }}>
          <motion.div
            className="font-syne font-extrabold"
            style={{ fontSize: 'clamp(24px, 4vw, 40px)', color: '#FCD34D', lineHeight: 1.05, letterSpacing: '-0.02em' }}
          >
            From SDE 1 → SDE 3.<br />
            <span style={{ color: '#FFFBF7' }}>From Unemployed → $30k+.</span>
          </motion.div>

          <p
            className="font-dm-sans"
            style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: '#A8A29E', lineHeight: 1.7, maxWidth: 640, marginTop: 14 }}
          >
            System design is the lever that changes everything. The same concepts that land
            senior roles at top tech companies — broken into visual, interactive, playable
            zones. No passive videos. No endless docs. Just you, the architecture, and the XP.
          </p>

          <div
            className="flex flex-wrap"
            style={{ gap: 12, marginTop: 24 }}
          >
            {[
              { value: '5', label: 'XP Levels', color: '#ADFA1D' },
              { value: '13', label: 'Concepts', color: '#00C2FF' },
              { value: '5', label: 'Interactive Zones', color: '#F97316' },
              { value: '1', label: 'Mascot Guide', color: '#A78BFA' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                {...stagger(0.35, i)}
                style={{
                  flex: 1, borderRadius: 12, minWidth: 100, textAlign: 'center',
                  padding: 'clamp(14px, 2.5vw, 24px) clamp(16px, 3vw, 28px)',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="font-syne font-extrabold" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div className="font-dm-sans" style={{ fontSize: 11, color: '#A8A29E', marginTop: 4, fontWeight: 500 }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════
            SECTION 3 — Developer Profile
           ════════════════════════════════════════ */}
        <motion.div {...fadeUp(0.4)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: 'clamp(32px, 5vw, 56px) 0',
        }}>
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
            style={{
              width: 'clamp(120px, 16vw, 180px)',
              height: 'clamp(120px, 16vw, 180px)',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #FDBA74',
              boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)',
              position: 'relative',
            }}
          >
            <Image
              src="/aboutus/developer.png"
              alt="Muhammad Shahzad Ali"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Name */}
          <h2
            className="font-syne font-extrabold"
            style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: '#1C1917', marginTop: 20, textAlign: 'center', letterSpacing: '-0.02em' }}
          >
            Muhammad Shahzad Ali
          </h2>

          {/* Role */}
          <span style={{
            ...pillStyle,
            marginTop: 10, fontSize: 12, textTransform: 'none', letterSpacing: '0.02em',
          }}>
            Builder · System Design Enthusiast
          </span>

          {/* Bio */}
          <p
            className="font-dm-sans text-center"
            style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: '#78716C', lineHeight: 1.7, maxWidth: 540, marginTop: 16 }}
          >
            I built Archi.learn because I believe the best way to learn system design is to
            {' '}<strong style={{ color: '#44403C' }}>play with it</strong>. Every zone, every quiz,
            every interactive lab is designed to make distributed systems click —
            not through memorization, but through exploration.
          </p>

          {/* Social links */}
          <div className="flex items-center" style={{ gap: 10, marginTop: 20 }}>
            {SOCIALS.map(s => (
              <motion.a
                key={s.label}
                href={s.href}
                target={s.comingSoon ? undefined : '_blank'}
                rel={s.comingSoon ? undefined : 'noopener noreferrer'}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 42, height: 42, borderRadius: '50%',
                  backgroundColor: s.comingSoon ? '#F3F4F6' : '#FFF0E5',
                  border: s.comingSoon ? '1px dashed #D6D3D1' : `1px solid ${s.color}20`,
                  cursor: s.comingSoon ? 'not-allowed' : 'pointer',
                  position: 'relative',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill={s.color}>
                  <path d={s.path} />
                </svg>
                {s.comingSoon && (
                  <span
                    className="font-dm-sans"
                    style={{
                      position: 'absolute', bottom: -18, fontSize: 9, color: '#A8A29E',
                      whiteSpace: 'nowrap', fontWeight: 500,
                    }}
                  >
                    Coming Soon
                  </span>
                )}
              </motion.a>
            ))}
          </div>

          {/* Emails */}
          <div className="flex flex-col items-center" style={{ gap: 6, marginTop: 24 }}>
            {['shahzad.exec@gmail.com', 'shaa1891640@gmail.com'].map(email => (
              <motion.a
                key={email}
                href={`mailto:${email}`}
                whileHover={{ x: 3 }}
                className="font-dm-sans"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13, color: '#78716C', textDecoration: 'none',
                  padding: '6px 14px', borderRadius: 8,
                  backgroundColor: '#F5F5F4',
                  transition: 'background-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FFF0E5'; e.currentTarget.style.color = '#C05400' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F5F5F4'; e.currentTarget.style.color = '#78716C' }}
              >
                <Mail size={14} />
                {email}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════
            SECTION 4 — Support / Crypto QRs
           ════════════════════════════════════════ */}
        <motion.div {...fadeUp(0.55)} style={{ paddingBottom: 40 }}>
          <div
            style={{
              borderRadius: 16,
              border: '0.5px solid rgba(249, 115, 22, 0.15)',
              backgroundColor: '#FFFBF7',
              padding: 'clamp(24px, 4vw, 44px) clamp(20px, 4vw, 48px)',
            }}
          >
            <div className="flex flex-col items-center" style={{ marginBottom: 28 }}>
              <Wallet size={24} style={{ color: '#F97316' }} />
              <h2
                className="font-syne font-extrabold"
                style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', color: '#1C1917', marginTop: 10, letterSpacing: '-0.02em' }}
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
              className="flex flex-col sm:flex-row items-center justify-center"
              style={{ gap: 'clamp(16px, 3vw, 32px)' }}
            >
              {/* Phantom */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center"
                style={{
                  flex: 1, maxWidth: 280, width: '100%',
                  borderRadius: 12, overflow: 'hidden',
                  border: '1px solid #E7E5E4',
                  backgroundColor: '#FAFAF9',
                }}
              >
                <div style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #AB9FF2, #7B6FE6)',
                  padding: '10px 16px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 18 }}>👻</span>
                  <span className="font-syne font-bold" style={{ fontSize: 14, color: '#FFFBF7' }}>Phantom Wallet</span>
                </div>
                <div style={{ padding: 16, width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: 200, height: 200 }}>
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
                  flex: 1, maxWidth: 280, width: '100%',
                  borderRadius: 12, overflow: 'hidden',
                  border: '1px solid #E7E5E4',
                  backgroundColor: '#FAFAF9',
                }}
              >
                <div style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #F0B90B, #CC9A00)',
                  padding: '10px 16px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 18 }}>🟡</span>
                  <span className="font-syne font-bold" style={{ fontSize: 14, color: '#1C1917' }}>Binance Wallet</span>
                </div>
                <div style={{ padding: 16, width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: 200, height: 200 }}>
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
          </div>
        </motion.div>

        {/* ════════════════════════════════════════
            SECTION 5 — Footer
           ════════════════════════════════════════ */}
        <motion.div
          {...fadeUp(0.7)}
          className="flex flex-col items-center"
          style={{
            padding: '28px 0 48px',
            borderTop: '0.5px solid rgba(0,0,0,0.06)',
            gap: 8,
          }}
        >
          <span className="font-dm-sans" style={{ fontSize: 13, color: '#A8A29E' }}>
            Built with passion by{' '}
            <a
              href="https://github.com/shahzad67432"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#F97316', textDecoration: 'none', fontWeight: 600 }}
            >
              Muhammad Shahzad Ali
            </a>
          </span>
          <span className="font-dm-sans" style={{ fontSize: 11, color: '#D6D3D1' }}>
            Archi.learn — System Design, Gamified.
          </span>
          <a
            href="https://github.com/shahzad67432/archi-learn"
            target="_blank"
            rel="noopener noreferrer"
            className="font-dm-sans"
            style={{ fontSize: 12, color: '#F97316', textDecoration: 'none', fontWeight: 600, marginTop: 4 }}
          >
            Contribute on GitHub ↗
          </a>
        </motion.div>

      </div>
    </main>
  )
}
