import type { ServiceNode } from '@/lib/types'

export const SERVICE_NODES: ServiceNode[] = [
  { id: 'client',        label: 'Client',         icon: '💻', color: '#FF4D00', defaultPosition: { x: 60,  y: 120 } },
  { id: 'cdn',           label: 'CDN',            icon: '🌐', color: '#00C2FF', defaultPosition: { x: 60,  y: 280 } },
  { id: 'load-balancer', label: 'Load Balancer',  icon: '⚖️', color: '#C8FF00', defaultPosition: { x: 240, y: 80  } },
  { id: 'server',        label: 'Server',         icon: '🖥️', color: '#00C2FF', defaultPosition: { x: 420, y: 80  } },
  { id: 'cache',         label: 'Cache',          icon: '⚡', color: '#FFB300', defaultPosition: { x: 420, y: 240 } },
  { id: 'database',      label: 'Database',       icon: '🗄️', color: '#00E676', defaultPosition: { x: 580, y: 160 } },
  { id: 'message-queue', label: 'Message Queue',  icon: '📨', color: '#FF4D00', defaultPosition: { x: 240, y: 280 } },
]

// All architecturally valid directed connections
export const VALID_CONNECTIONS: [string, string][] = [
  ['client',        'cdn'],
  ['client',        'load-balancer'],
  ['cdn',           'load-balancer'],
  ['cdn',           'server'],
  ['load-balancer', 'server'],
  ['server',        'cache'],
  ['server',        'database'],
  ['server',        'message-queue'],
  ['message-queue', 'server'],
  ['cache',         'database'],
]

export const isValidConnection = (fromId: string, toId: string): boolean => {
  if (fromId === toId) return false
  return VALID_CONNECTIONS.some(([f, t]) => f === fromId && t === toId)
}

export const getNodeById = (id: string) =>
  SERVICE_NODES.find(n => n.id === id) ?? null
