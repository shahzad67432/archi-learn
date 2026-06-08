import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:   'var(--canvas)',
        ink:      'var(--ink)',
        flame:    'var(--flame)',
        volt:     'var(--volt)',
        signal:   'var(--signal)',
        pass:     'var(--pass)',
        fail:     'var(--fail)',
        'xp-gold':'var(--xp-gold)',
        'ink-muted':'var(--ink-muted)',
        surface:  'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
      },
      fontFamily: {
        syne:   ['var(--font-syne)', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        mono:   ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulse_dot: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        dash_flow: {
          to: { 'stroke-dashoffset': '-20' },
        },
      },
      animation: {
        float:      'float 3s ease-in-out infinite',
        pulse_dot:  'pulse_dot 1.8s ease-in-out infinite',
        dash_flow:  'dash_flow 0.6s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
