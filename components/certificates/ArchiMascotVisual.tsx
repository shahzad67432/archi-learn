'use client'

import React from 'react'

export default function ArchiMascotVisual() {
  return (
    <div className="w-full max-w-sm mx-auto p-6 flex flex-col items-center justify-center bg-surface rounded-2xl border border-surface-raised shadow-sm group">

      {/* Dynamic Animated SVG Stage */}
      <svg
        viewBox="0 0 320 340"
        className="w-full h-auto drop-shadow-md select-none pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definitions for gradients/clips */}
        <defs>
          <linearGradient id="gradientFlame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-flame, #FF4D00)" />
            <stop offset="100%" stopColor="#FF7733" />
          </linearGradient>
          <linearGradient id="gradientVolt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-volt, #C8FF00)" />
            <stop offset="100%" stopColor="#AEE600" />
          </linearGradient>
        </defs>

        {/* 1. Ground Shadow (Reacts to floating/breathing) */}
        <ellipse
          cx="160"
          cy="310"
          rx="55"
          ry="8"
          fill="var(--color-ink, #0D0D0D)"
          opacity="0.08"
          style={{
            animation: 'archi-shadow-pulse 3s ease-in-out infinite',
            transformOrigin: '160px 310px'
          }}
        />

        {/* Main Floating Wrapper Group for Entire Character Body */}
        <g style={{ animation: 'archi-float 3s ease-in-out infinite', transformOrigin: '160px 200px' }}>

          {/* 2. Floating Sparks / Micro-services (Orbiting decoration) */}
          <circle cx="60" cy="140" r="4" fill="var(--color-signal, #00C2FF)" style={{ animation: 'archi-confetti-1 4s linear infinite alternate' }} />
          <circle cx="270" cy="120" r="5" fill="var(--color-volt, #C8FF00)" style={{ animation: 'archi-confetti-2 5s linear infinite alternate' }} />
          <rect x="75" y="240" width="6" height="6" rx="1" fill="var(--color-flame, #FF4D00)" style={{ animation: 'archi-confetti-3 3s linear infinite alternate' }} />

          {/* 3. Left Hand - Holding a structural terminal wire line */}
          <path
            d="M 95 195 Q 60 190 70 160"
            stroke="var(--color-ink, #0D0D0D)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="70" cy="160" r="8" fill="var(--color-ink, #0D0D0D)" />

          {/* 4. Right Hand - Cheering / High-fiving */}
          <g style={{ animation: 'archi-arm-right-cheer 1.5s ease-in-out infinite alternate', transformOrigin: '225px 195px' }}>
            <path
              d="M 225 195 Q 260 185 255 155"
              stroke="var(--color-ink, #0D0D0D)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="255" cy="155" r="8" fill="url(#gradientFlame)" />
          </g>

          {/* 5. Main Chassis / The Server Node (Breathing element) */}
          <g style={{ animation: 'archi-breathe 6s ease-in-out infinite', transformOrigin: '160px 210px' }}>

            {/* Outer Case Structure */}
            <rect
              x="90"
              y="130"
              width="140"
              height="140"
              rx="28"
              fill="var(--color-surface, #FFFFFF)"
              stroke="var(--color-ink, #0D0D0D)"
              strokeWidth="6"
            />

            {/* Structural Server Slot Grids (Backing aesthetics) */}
            <line x1="120" y1="245" x2="200" y2="245" stroke="var(--color-surface-raised, #F0EFE9)" strokeWidth="4" strokeLinecap="round" />
            <line x1="140" y1="253" x2="180" y2="253" stroke="var(--color-surface-raised, #F0EFE9)" strokeWidth="3" strokeLinecap="round" />

            {/* Inner Digital Screen Console */}
            <rect
              x="104"
              y="144"
              width="112"
              height="86"
              rx="16"
              fill="var(--color-ink, #0D0D0D)"
            />

            {/* Screen Content Grid: Ledger Lines */}
            <circle cx="120" cy="160" r="3" fill="var(--color-pass, #00E676)" style={{ animation: 'concepts-server-blink 1s steps(2, start) infinite' }} />
            <line x1="132" y1="160" x2="200" y2="160" stroke="#333333" strokeWidth="2" strokeLinecap="round" />

            {/* 6. Expressive Eyes (Blinking Framework) */}
            <g style={{ animation: 'archi-blink 4s ease-in-out infinite', transformOrigin: '160px 190px' }}>
              {/* Left Eye */}
              <ellipse cx="136" cy="190" rx="7" ry="10" fill="url(#gradientVolt)" />
              <circle cx="134" cy="186" r="2.5" fill="#000" />

              {/* Right Eye */}
              <ellipse cx="184" cy="190" rx="7" ry="10" fill="url(#gradientVolt)" />
              <circle cx="182" cy="186" r="2.5" fill="#000" />
            </g>

            {/* Happy Little Terminal Console Smile */}
            <path
              d="M 152 208 Q 160 216 168 208"
              stroke="var(--color-surface, #FFFFFF)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

          </g> {/* End Chassis Group */}

          {/* 7. Platform Graduation Cap (Sits perfectly askew on top) */}
          <g transform="translate(0, -6)">
            {/* Cap Tassel Line hanging down */}
            <path d="M 130 95 Q 100 110 98 134" stroke="var(--color-xp-gold, #FFB300)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="98" cy="135" r="4" fill="var(--color-xp-gold, #FFB300)" />

            {/* Diamond Board Plate */}
            <polygon
              points="160,80 225,98 160,116 95,98"
              fill="var(--color-ink, #0D0D0D)"
              stroke="var(--color-surface-raised, #F0EFE9)"
              strokeWidth="2"
            />

            {/* Under-cap Skullcap Mount */}
            <path d="M 128 99 Q 160 114 192 99" stroke="var(--color-ink, #0D0D0D)" strokeWidth="8" fill="none" />

            {/* Center Cap Button */}
            <ellipse cx="160" cy="98" rx="4" ry="2" fill="var(--color-xp-gold, #FFB300)" />
          </g>

          {/* 8. Little Mechanical Node Feet */}
          <rect x="120" y="272" width="16" height="18" rx="6" fill="var(--color-ink, #0D0D0D)" />
          <rect x="184" y="272" width="16" height="18" rx="6" fill="var(--color-ink, #0D0D0D)" />

        </g> {/* End Floating Wrapper Group */}
      </svg>

      {/* Interactive Caption */}
      <div className="text-center mt-2 space-y-1">
        <h4 className="text-sm font-mono font-bold tracking-tight text-ink uppercase">
          Node-01: Archi
        </h4>
        <p className="text-xs text-ink-muted font-dm-sans max-w-[200px]">
          Ready to verify, audit, and distribute your next architectural XP level.
        </p>
      </div>

    </div>
  )
}
