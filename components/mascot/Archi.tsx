'use client'

import { motion, AnimatePresence } from 'framer-motion'

export type ArchiMood =
  'idle' | 'cheer' | 'thinking' | 'sad' |
  'pointing' | 'surprised' | 'celebrating'

interface Props {
  mood?: ArchiMood
  size?: number
  tipOverride?: string
  showTip?: boolean
  onTipClose?: () => void
  className?: string
  style?: React.CSSProperties
  fixed?: boolean
}

/* ── Shared SVG fragments ── */

function Shadow({ mood, small }: { mood: ArchiMood; small?: boolean }) {
  const rx = small || mood === 'cheer' || mood === 'celebrating' ? 16 : mood === 'sad' ? 19 : 22
  return (
    <ellipse cx={55} cy={122} rx={rx} ry={5} fill="rgba(0,0,0,0.1)" className={mood !== 'sad' ? 'archi-shadow-pulse' : undefined} />
  )
}

function Hat({ className: extra }: { className?: string }) {
  return (
    <g className={extra}>
      <ellipse cx={55} cy={30} rx={22} ry={5} fill="#E05800" opacity={0.9} />
      <path d="M34 30 Q34 14 55 14 Q76 14 76 30Z" fill="#F97316" />
    </g>
  )
}

function Body({ className: extra }: { className?: string }) {
  return (
    <g className={extra}>
      <path
        d="M22 65 Q18 45 35 38 Q45 32 55 33 Q65 32 75 38 Q92 45 88 65 Q92 85 82 98 Q70 112 55 112 Q40 112 28 98 Q18 85 22 65Z"
        fill="#F97316"
      />
      <path
        d="M30 70 Q26 55 38 46 Q45 40 55 41"
        fill="none" stroke="#E05800" strokeWidth={3} strokeLinecap="round" opacity={0.25}
      />
    </g>
  )
}

function EyesNormal() {
  return (
    <g className="archi-blink">
      <ellipse cx={43} cy={62} rx={9} ry={10} fill="white" />
      <ellipse cx={44} cy={63} rx={5} ry={5.5} fill="#1C1917" />
      <circle cx={46} cy={60} r={2} fill="white" />
      <ellipse cx={67} cy={62} rx={9} ry={10} fill="white" />
      <ellipse cx={68} cy={63} rx={5} ry={5.5} fill="#1C1917" />
      <circle cx={70} cy={60} r={2} fill="white" />
    </g>
  )
}

function HappyEyes() {
  return (
    <g className="archi-jump">
      <path d="M36 60 Q43 52 50 60" fill="none" stroke="#1C1917" strokeWidth={3} strokeLinecap="round" />
      <path d="M60 60 Q67 52 74 60" fill="none" stroke="#1C1917" strokeWidth={3} strokeLinecap="round" />
    </g>
  )
}

function SurprisedEyes() {
  return (
    <g className="archi-startle">
      <circle cx={43} cy={63} r={11} fill="white" />
      <circle cx={44} cy={64} r={6.5} fill="#1C1917" />
      <circle cx={47} cy={60} r={2.5} fill="white" />
      <circle cx={67} cy={63} r={11} fill="white" />
      <circle cx={68} cy={64} r={6.5} fill="#1C1917" />
      <circle cx={71} cy={60} r={2.5} fill="white" />
    </g>
  )
}

function ThinkingEyes() {
  return (
    <g>
      <ellipse cx={43} cy={62} rx={9} ry={5} fill="white" />
      <ellipse cx={44} cy={62} rx={5} ry={3} fill="#1C1917" />
      <circle cx={46} cy={61} r={1.5} fill="white" />
      <ellipse cx={67} cy={62} rx={9} ry={10} fill="white" />
      <ellipse cx={68} cy={63} rx={5} ry={5.5} fill="#1C1917" />
      <circle cx={70} cy={60} r={2} fill="white" />
    </g>
  )
}

function SadEyes() {
  return (
    <g>
      <ellipse cx={43} cy={64} rx={9} ry={10} fill="white" />
      <ellipse cx={44} cy={66} rx={5} ry={5} fill="#1C1917" />
      <path d="M37 59 Q43 63 49 61" fill="none" stroke="#1C1917" strokeWidth={1.5} strokeLinecap="round" />
      <ellipse cx={67} cy={64} rx={9} ry={10} fill="white" />
      <ellipse cx={68} cy={66} rx={5} ry={5} fill="#1C1917" />
      <path d="M61 59 Q67 63 73 61" fill="none" stroke="#1C1917" strokeWidth={1.5} strokeLinecap="round" />
    </g>
  )
}

function PointingEyes() {
  return (
    <g>
      <ellipse cx={43} cy={62} rx={9} ry={10} fill="white" />
      <ellipse cx={46} cy={63} rx={5} ry={5.5} fill="#1C1917" />
      <circle cx={48} cy={60} r={2} fill="white" />
      <ellipse cx={67} cy={62} rx={9} ry={10} fill="white" />
      <ellipse cx={70} cy={63} rx={5} ry={5.5} fill="#1C1917" />
      <circle cx={72} cy={60} r={2} fill="white" />
    </g>
  )
}

function Cheeks() {
  return (
    <>
      <ellipse cx={35} cy={75} rx={6} ry={4} fill="#FF8C42" opacity={0.3} />
      <ellipse cx={75} cy={75} rx={6} ry={4} fill="#FF8C42" opacity={0.3} />
    </>
  )
}

function LargeCheeks() {
  return (
    <>
      <ellipse cx={32} cy={74} rx={7} ry={5} fill="#FF8C42" opacity={0.5} />
      <ellipse cx={78} cy={74} rx={7} ry={5} fill="#FF8C42" opacity={0.5} />
    </>
  )
}

/* ── Mood extras ── */

function CheerConfetti() {
  return (
    <g>
      <rect x={50} y={10} width={7} height={7} rx={1} fill="#ADFA1D" opacity={0.9} className="archi-confetti-1" />
      <rect x={58} y={8} width={5} height={5} rx={1} fill="#8B5CF6" opacity={0.9} className="archi-confetti-2" />
      <circle cx={72} cy={14} r={4} fill="#06B6D4" opacity={0.9} className="archi-confetti-3" />
      <rect x={35} y={12} width={5} height={5} rx={1} fill="#F97316" opacity={0.9} className="archi-confetti-4" />
      <circle cx={30} cy={18} r={3} fill="#ADFA1D" opacity={0.8} className="archi-confetti-1" />
      <circle cx={80} cy={16} r={3} fill="#EF4444" opacity={0.8} className="archi-confetti-2" />
    </g>
  )
}

function CelebrateConfetti() {
  return (
    <g>
      {[...Array(8)].map((_, i) => {
        const colors = ['#ADFA1D', '#8B5CF6', '#06B6D4', '#F97316', '#EF4444', '#FCD34D', '#FF69B4', '#10B981']
        const anims = ['archi-confetti-1', 'archi-confetti-2', 'archi-confetti-3', 'archi-confetti-4']
        const xOff = [50, 58, 35, 65, 42, 72, 30, 60]
        const yOff = [10, 8, 12, 6, 14, 16, 18, 20]
        return (
          <rect
            key={i}
            x={xOff[i]} y={yOff[i]}
            width={i % 2 === 0 ? 7 : 5}
            height={i % 2 === 0 ? 7 : 5}
            rx={1}
            fill={colors[i]}
            opacity={0.9}
            className={anims[i % 4]}
          />
        )
      })}
    </g>
  )
}

function ThoughtDots() {
  return (
    <g>
      <circle cx={72} cy={28} r={3} fill="#A8A29E" className="archi-dot-appear" style={{ animationDelay: '0.6s' }} />
      <circle cx={80} cy={20} r={4.5} fill="#A8A29E" className="archi-dot-appear" style={{ animationDelay: '0.3s' }} />
      <circle cx={90} cy={10} r={6} fill="#F3F0EB" stroke="#A8A29E" strokeWidth={1} className="archi-dot-appear" />
      <text x={86} y={15} fontSize={8} fill="#78716C" className="archi-dot-appear">?</text>
    </g>
  )
}

function Tears() {
  return (
    <g>
      <ellipse cx={38} cy={74} rx={3} ry={4} fill="#93C5FD" opacity={0.8} className="archi-tear-fall" />
      <ellipse cx={72} cy={74} rx={3} ry={4} fill="#93C5FD" opacity={0.8} className="archi-tear-fall" style={{ animationDelay: '0.6s' }} />
    </g>
  )
}

function DirectionDots() {
  return (
    <g>
      <circle cx={96} cy={38} r={2.5} fill="#ADFA1D" opacity={0.9} className="archi-dot-appear" style={{ animationDelay: '0.1s' }} />
      <circle cx={104} cy={32} r={2} fill="#ADFA1D" opacity={0.7} className="archi-dot-appear" style={{ animationDelay: '0.3s' }} />
    </g>
  )
}

function ShockLines() {
  return (
    <g>
      <line x1={55} y1={8} x2={55} y2={1} stroke="#F97316" strokeWidth={2} strokeLinecap="round" className="archi-shock-line" />
      <line x1={72} y1={12} x2={77} y2={6} stroke="#F97316" strokeWidth={2} strokeLinecap="round" className="archi-shock-line" style={{ animationDelay: '0.1s' }} />
      <line x1={38} y1={12} x2={33} y2={6} stroke="#F97316" strokeWidth={2} strokeLinecap="round" className="archi-shock-line" style={{ animationDelay: '0.05s' }} />
      <line x1={82} y1={20} x2={89} y2={16} stroke="#ADFA1D" strokeWidth={2} strokeLinecap="round" className="archi-shock-line" style={{ animationDelay: '0.15s' }} />
      <line x1={28} y1={20} x2={21} y2={16} stroke="#ADFA1D" strokeWidth={2} strokeLinecap="round" className="archi-shock-line" style={{ animationDelay: '0.08s' }} />
    </g>
  )
}

/* ── Mood renderer ── */

function renderMood(mood: ArchiMood) {
  switch (mood) {
    case 'idle':
      return (
        <g className="archi-breathe" style={{ transformOrigin: '55px 80px' }}>
          <Shadow mood={mood} />
          <Hat />
          <Body />
          <path d="M28 72 Q16 76 14 85 Q13 91 19 92 Q24 93 28 85" fill="#F97316" stroke="#E05800" strokeWidth={0.5} opacity={0.9} />
          <path d="M82 72 Q94 76 96 85 Q97 91 91 92 Q86 93 82 85" fill="#F97316" stroke="#E05800" strokeWidth={0.5} opacity={0.9} />
          <EyesNormal />
          <path d="M46 80 Q55 87 64 80" fill="none" stroke="#1C1917" strokeWidth={2.5} strokeLinecap="round" />
          <Cheeks />
          <path d="M38 26 Q55 20 72 26" fill="none" stroke="#E05800" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
        </g>
      )

    case 'cheer':
      return (
        <g className="archi-jump" style={{ transformOrigin: '55px 80px' }}>
          <CheerConfetti />
          <Shadow mood={mood} small />
          <Hat className="archi-jump" />
          <Body className="archi-jump" />
          <g className="archi-arm-left-cheer" style={{ transformOrigin: '28px 70px' }}>
            <path d="M28 70 Q12 58 10 46 Q9 38 16 37 Q22 36 26 44 Q28 58 28 70Z" fill="#F97316" stroke="#E05800" strokeWidth={0.5} />
          </g>
          <g className="archi-arm-right-cheer" style={{ transformOrigin: '82px 70px' }}>
            <path d="M82 70 Q98 58 100 46 Q101 38 94 37 Q88 36 84 44 Q82 58 82 70Z" fill="#F97316" stroke="#E05800" strokeWidth={0.5} />
          </g>
          <HappyEyes />
          <g className="archi-jump">
            <path d="M40 76 Q55 92 70 76" fill="#1C1917" />
            <path d="M44 78 Q55 88 66 78" fill="white" />
          </g>
          <g className="archi-jump">
            <ellipse cx={35} cy={72} rx={7} ry={5} fill="#FF8C42" opacity={0.4} />
            <ellipse cx={75} cy={72} rx={7} ry={5} fill="#FF8C42" opacity={0.4} />
          </g>
        </g>
      )

    case 'thinking':
      return (
        <g className="archi-think-tilt" style={{ transformOrigin: '55px 75px' }}>
          <Shadow mood={mood} />
          <ThoughtDots />
          <Hat />
          <Body />
          <path d="M28 72 Q16 76 14 85 Q13 91 19 92 Q24 93 28 85" fill="#F97316" />
          <path d="M82 72 Q96 62 98 52 Q99 44 93 43 Q87 42 84 50 Q82 62 82 72Z" fill="#F97316" stroke="#E05800" strokeWidth={0.5} />
          <ThinkingEyes />
          <path d="M47 80 Q55 82 63 79" fill="none" stroke="#1C1917" strokeWidth={2.5} strokeLinecap="round" />
          <Cheeks />
        </g>
      )

    case 'sad':
      return (
        <g className="archi-droop" style={{ transformOrigin: '55px 80px' }}>
          <Tears />
          <Shadow mood={mood} />
          <g opacity={0.8}>
            <ellipse cx={52} cy={32} rx={20} ry={5} fill="#E05800" opacity={0.7} />
            <path d="M33 32 Q32 16 52 16 Q72 16 73 32Z" fill="#F97316" opacity={0.8} />
          </g>
          <g opacity={0.85}>
            <path d="M26 70 Q24 52 38 44 Q46 38 55 39 Q64 38 72 44 Q86 52 84 70 Q86 88 76 100 Q66 112 55 112 Q44 112 34 100 Q24 88 26 70Z" fill="#F97316" opacity={0.85} />
            <path d="M26 75 Q16 82 15 92 Q14 98 20 98 Q25 98 26 90" fill="#F97316" opacity={0.85} />
            <path d="M84 75 Q94 82 95 92 Q96 98 90 98 Q85 98 84 90" fill="#F97316" opacity={0.85} />
            <SadEyes />
            <path d="M44 84 Q55 78 66 84" fill="none" stroke="#1C1917" strokeWidth={2.5} strokeLinecap="round" />
          </g>
        </g>
      )

    case 'pointing':
      return (
        <g className="archi-point-bounce" style={{ transformOrigin: '55px 75px' }}>
          <Shadow mood={mood} />
          <Hat className="archi-point-bounce" />
          <g className="archi-point-bounce" style={{ transformOrigin: '55px 75px' }}>
            <path d="M24 66 Q20 46 37 39 Q47 33 57 34 Q67 33 77 39 Q94 46 90 66 Q94 86 84 99 Q72 113 57 113 Q42 113 30 99 Q20 86 24 66Z" fill="#F97316" />
            <path d="M28 74 Q18 78 17 87 Q16 93 22 93 Q27 93 28 86" fill="#F97316" />
          </g>
          <g className="archi-arm-point" style={{ transformOrigin: '84px 68px' }}>
            <path d="M84 68 Q100 60 108 54 Q114 48 110 43 Q106 38 100 42 Q94 50 84 60 Q84 64 84 68Z" fill="#F97316" stroke="#E05800" strokeWidth={0.5} />
            <circle cx={108} cy={46} r={5} fill="#F97316" stroke="#E05800" strokeWidth={0.5} />
          </g>
          <DirectionDots />
          <PointingEyes />
          <path d="M46 80 Q57 89 66 82" fill="none" stroke="#1C1917" strokeWidth={2.5} strokeLinecap="round" />
          <ellipse cx={36} cy={75} rx={6} ry={4} fill="#FF8C42" opacity={0.3} />
          <ellipse cx={76} cy={75} rx={6} ry={4} fill="#FF8C42" opacity={0.3} />
        </g>
      )

    case 'surprised':
      return (
        <g className="archi-startle" style={{ transformOrigin: '55px 75px' }}>
          <ShockLines />
          <Shadow mood={mood} />
          <ellipse cx={55} cy={26} rx={22} ry={5} fill="#E05800" opacity={0.9} />
          <path d="M34 26 Q34 10 55 10 Q76 10 76 26Z" fill="#F97316" />
          <path d="M20 62 Q16 42 34 35 Q44 29 55 30 Q66 29 76 35 Q94 42 90 62 Q94 84 82 98 Q70 114 55 114 Q40 114 28 98 Q16 84 20 62Z" fill="#F97316" />
          <path d="M24 68 Q10 62 6 52 Q4 44 10 43 Q16 42 20 50 Q22 62 24 68Z" fill="#F97316" />
          <path d="M86 68 Q100 62 104 52 Q106 44 100 43 Q94 42 90 50 Q88 62 86 68Z" fill="#F97316" />
          <SurprisedEyes />
          <ellipse cx={55} cy={82} rx={7} ry={8} fill="#1C1917" />
          <ellipse cx={55} cy={83} rx={4} ry={5} fill="#7C2D12" opacity={0.6} />
          <LargeCheeks />
        </g>
      )

    case 'celebrating':
      return (
        <g className="archi-spin" style={{ transformOrigin: '55px 80px' }}>
          <CelebrateConfetti />
          <Shadow mood={mood} small />
          <Hat className="archi-spin" />
          <Body className="archi-spin" />
          <g className="archi-arm-left-cheer" style={{ transformOrigin: '28px 70px' }}>
            <path d="M28 70 Q12 58 10 46 Q9 38 16 37 Q22 36 26 44 Q28 58 28 70Z" fill="#F97316" stroke="#E05800" strokeWidth={0.5} />
          </g>
          <g className="archi-arm-right-cheer" style={{ transformOrigin: '82px 70px' }}>
            <path d="M82 70 Q98 58 100 46 Q101 38 94 37 Q88 36 84 44 Q82 58 82 70Z" fill="#F97316" stroke="#E05800" strokeWidth={0.5} />
          </g>
          <HappyEyes />
          <g className="archi-spin">
            <path d="M40 76 Q55 92 70 76" fill="#1C1917" />
            <path d="M44 78 Q55 88 66 78" fill="white" />
          </g>
          <g className="archi-spin">
            <ellipse cx={35} cy={72} rx={7} ry={5} fill="#FF8C42" opacity={0.4} />
            <ellipse cx={75} cy={72} rx={7} ry={5} fill="#FF8C42" opacity={0.4} />
          </g>
        </g>
      )
  }
}

export default function Archi({
  mood = 'idle',
  size = 80,
  tipOverride,
  showTip = false,
  onTipClose,
  className,
  style,
  fixed = true,
}: Props) {
  return (
    <div
      className={className}
      style={{
        position: fixed ? 'fixed' : 'relative',
        ...(fixed ? { bottom: 24, right: 24, zIndex: 9998, cursor: 'pointer' } : {}),
        display: 'inline-block',
        lineHeight: 0,
        ...style,
      }}
    >
      <AnimatePresence>
        {showTip && tipOverride && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ duration: 0.2, ease: 'backOut' }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 10px)',
              right: 0,
              minWidth: 180,
              maxWidth: 240,
              background: '#1C1917',
              color: '#FFFBF7',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 12,
              fontFamily: 'var(--font-dm-sans)',
              lineHeight: 1.5,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            {tipOverride}
            {onTipClose && (
              <button
                onClick={onTipClose}
                style={{
                  position: 'absolute', top: 6, right: 8,
                  fontSize: 10, color: '#6B6B6B', cursor: 'pointer',
                  background: 'none', border: 'none', padding: 0, lineHeight: 1,
                }}
              >
                ✕
              </button>
            )}
            <div
              style={{
                position: 'absolute', bottom: -6, right: 16,
                width: 12, height: 12, background: '#1C1917',
                transform: 'rotate(45deg)', borderRadius: 2,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <svg viewBox="0 0 110 130" style={{ height: size, width: 'auto', display: 'block' }}>
        {renderMood(mood)}
      </svg>
    </div>
  )
}
