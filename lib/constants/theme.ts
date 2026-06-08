export const SPRING_DEFAULT = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 28,
}

export const SPRING_GENTLE = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 24,
}

export const STAGGER_CHILDREN = {
  animate: { transition: { staggerChildren: 0.08 } },
}

export const FADE_UP_ITEM = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { ...SPRING_DEFAULT } },
}

export const XP_THRESHOLDS: Record<number, string> = {
  0:    'Apprentice',
  200:  'Engineer',
  500:  'Senior',
  1000: 'Architect',
  2000: 'Principal',
}

export const CONCEPT_COLORS: Record<string, string> = {
  flame:    '#FF4D00',
  volt:     '#C8FF00',
  signal:   '#00C2FF',
  'xp-gold':'#FFB300',
}

export const XP_REWARDS = {
  PLAYGROUND_CORRECT:  10,
  CONCEPT_OPENED:      20,
  QUIZ_CORRECT:        50,
  ALL_TABS_VISITED:    30,
}
