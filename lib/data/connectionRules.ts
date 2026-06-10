import type { ServiceNode } from '@/lib/types'

export const SERVICE_NODES: ServiceNode[] = [
  { id: 'client',        label: 'Client',         icon: '💻', color: '#FF4D00', defaultPosition: { x: 274, y: 20  } },
  { id: 'load-balancer', label: 'Load Balancer',  icon: '⚖️', color: '#C8FF00', defaultPosition: { x: 90,  y: 140 } },
  { id: 'server',        label: 'Server',         icon: '🖥️', color: '#00C2FF', defaultPosition: { x: 274, y: 140 } },
  { id: 'cache',         label: 'Cache',          icon: '⚡', color: '#FFB300', defaultPosition: { x: 458, y: 140 } },
  { id: 'database',      label: 'Database',       icon: '🗄️', color: '#00E676', defaultPosition: { x: 274, y: 260 } },
]

// All architecturally valid directed connections
export const VALID_CONNECTIONS: [string, string][] = [
  ['client',        'load-balancer'],
  ['load-balancer', 'server'],
  ['server',        'cache'],
  ['server',        'database'],
  ['cache',         'database'],
]

export const isValidConnection = (fromId: string, toId: string): boolean => {
  if (fromId === toId) return false
  return VALID_CONNECTIONS.some(([f, t]) => f === fromId && t === toId)
}

export const getNodeById = (id: string) =>
  SERVICE_NODES.find(n => n.id === id) ?? null
