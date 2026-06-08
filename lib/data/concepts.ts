import type { Concept } from '@/lib/types'

export const CONCEPTS: Concept[] = [
  { slug: 'dns-cdn',        title: 'DNS & CDN',         tagline: 'How your request finds its server — globally.',      difficulty: 'beginner',      xpReward: 100, color: 'signal',  icon: '🌐', locked: false, phase: 1, category: 'Networking Layer'    },
  { slug: 'load-balancing', title: 'Load Balancing',    tagline: 'Distribute traffic so no server breaks a sweat.',     difficulty: 'beginner',      xpReward: 100, color: 'volt',    icon: '⚖️', locked: false, phase: 1, category: 'Distribution'        },
  { slug: 'caching',        title: 'Caching',           tagline: 'Speed up everything by remembering the answer.',      difficulty: 'beginner',      xpReward: 100, color: 'xp-gold', icon: '⚡', locked: false, phase: 1, category: 'Performance'         },
  { slug: 'consistent-hashing', title: 'Consistent Hashing', tagline: 'Route requests to the right node — reliably.',  difficulty: 'intermediate',  xpReward: 150, color: 'flame',   icon: '🔁', locked: false, phase: 1, category: 'Routing'             },
  { slug: 'sql-vs-nosql',   title: 'SQL vs NoSQL',      tagline: 'Pick the right data storage for the right job.',      difficulty: 'intermediate',  xpReward: 150, color: 'signal',  icon: '🗄️', locked: true,  phase: 2, category: 'Data Storage'        },
  { slug: 'cap-theorem',    title: 'CAP Theorem',       tagline: 'The unavoidable tradeoff in distributed systems.',    difficulty: 'intermediate',  xpReward: 150, color: 'flame',   icon: '⚠️', locked: true,  phase: 2, category: 'Distributed'         },
  { slug: 'sharding',       title: 'Sharding',          tagline: 'Split your database before it splits under pressure.', difficulty: 'intermediate', xpReward: 150, color: 'volt',    icon: '🔀', locked: true,  phase: 2, category: 'Scalability'         },
  { slug: 'message-queues', title: 'Message Queues',    tagline: 'Decouple services with async communication.',         difficulty: 'intermediate',  xpReward: 150, color: 'xp-gold', icon: '📨', locked: true,  phase: 2, category: 'Async'               },
  { slug: 'rate-limiting',  title: 'Rate Limiting',     tagline: 'Protect your API from the stampede.',                 difficulty: 'advanced',      xpReward: 200, color: 'flame',   icon: '🚦', locked: true,  phase: 3, category: 'API Design'          },
  { slug: 'api-gateway',    title: 'API Gateway',       tagline: 'One entry point to rule all your services.',          difficulty: 'advanced',      xpReward: 200, color: 'signal',  icon: '🚪', locked: true,  phase: 3, category: 'Routing'             },
  { slug: 'replication',    title: 'Replication',       tagline: 'Copy data so failure is never the end.',              difficulty: 'advanced',      xpReward: 200, color: 'volt',    icon: '📋', locked: true,  phase: 3, category: 'Reliability'         },
  { slug: 'microservices',  title: 'Microservices',     tagline: 'Small, focused services that scale independently.',   difficulty: 'advanced',      xpReward: 200, color: 'xp-gold', icon: '🧩', locked: true,  phase: 3, category: 'Architecture'        },
]

export const getConceptBySlug = (slug: string) =>
  CONCEPTS.find(c => c.slug === slug) ?? null

export const getUnlockedConcepts = () =>
  CONCEPTS.filter(c => !c.locked)
