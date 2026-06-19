import type { Concept } from '@/data/concepts'

interface Props {
  concept: Concept
}

export default function ConceptDiagram({ concept }: Props) {
  const c = concept.color.accent
  const bg = concept.color.bg

  switch (concept.slug) {
    case 'consistent-hashing':
      return <ConsistentHashing color={c} bg={bg} />
    case 'load-balancing':
      return <LoadBalancer color={c} bg={bg} />
    case 'horizontal-scaling':
      return <HorizontalScaling color={c} bg={bg} />
    case 'caching':
      return <CacheDiagram color={c} bg={bg} />
    case 'sharding':
      return <ShardingDiagram color={c} bg={bg} />
    case 'message-queues':
      return <QueueDiagram color={c} bg={bg} />
    case 'replication':
      return <ReplicationDiagram color={c} bg={bg} />
    case 'cap-theorem':
      return <CAPDiagram color={c} bg={bg} />
    case 'cdn':
    case 'dns-and-cdn':
      return <CDNDiagram color={c} bg={bg} />
    case 'websockets':
      return <WebSocketDiagram color={c} bg={bg} />
    case 'databases':
      return <DatabaseDiagram color={c} bg={bg} />
    case 'rate-limiting':
      return <RateLimitingDiagram color={c} bg={bg} />
    case 'microservices':
      return <MicroservicesDiagram color={c} bg={bg} />
    default:
      return (
        <div style={{ background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `${c}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: c }} />
          </div>
        </div>
      )
  }
}

/* ─── Individual Diagrams ─── */

function ConsistentHashing({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}15`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 108, height: 108, border: `2.5px dashed ${c}55`, borderRadius: '50%', position: 'relative', animation: 'concepts-spin-slow 12s linear infinite' }}>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <div key={i} style={{
            position: 'absolute', width: 14, height: 14,
            background: c, borderRadius: '50%',
            top: '50%', left: '50%',
            boxShadow: `0 0 0 3px #fff, 0 0 0 4px ${c}`,
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-54px)`,
          }} />
        ))}
        <div style={{
          position: 'absolute', width: 8, height: 8,
          background: '#FDE68A', border: `2px solid ${c}`, borderRadius: 2,
          top: '50%', left: '50%',
          animation: 'concepts-orbit-key 4s linear infinite',
        }} />
      </div>
    </div>
  )
}

function LoadBalancer({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}10`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%', background: c,
              animation: 'concepts-fall-in 0.8s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>
        <div style={{ background: c, borderRadius: 8, padding: '5px 18px', color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>
          Load Balancer
        </div>
        <div style={{ display: 'flex', gap: 24, height: 20, alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 2, background: c, borderRadius: 1, opacity: 0.5,
              height: i === 1 ? 14 : 18,
              animation: 'concepts-lb-pulse 1.2s ease infinite',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 34, height: 24, borderRadius: 5,
              border: `2px solid ${c}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', background: c,
                animation: 'concepts-server-blink 2s ease infinite',
                animationDelay: `${i * 0.5}s`,
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HorizontalScaling({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}15`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <div><div style={{ width: 38, height: 28, background: c, borderRadius: 6, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 600 }}>s1</div></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ width: 38, height: 28, background: c, borderRadius: 6, opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 600 }}>s2</div>
          <div style={{ width: 38, height: 28, background: c, borderRadius: 6, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 600 }}>s3</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ width: 38, height: 28, background: c, borderRadius: 6, opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 600 }}>s4</div>
          <div style={{ width: 38, height: 28, background: c, borderRadius: 6, opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 600 }}>s5</div>
          <div style={{ width: 38, height: 28, background: c, borderRadius: 6, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 600 }}>s6</div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: c, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.04em', marginTop: 'auto', marginBottom: 4 }}>scale out →</div>
    </div>
  )
}

function CacheDiagram({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}10`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 10, color: c, fontWeight: 600, letterSpacing: '0.05em' }}>CACHE LAYER</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: 44, height: 20, borderRadius: 4,
              background: i === 2 ? '#fff' : c,
              border: `1.5px solid ${c}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, color: i === 2 ? c : '#fff', fontWeight: 600,
              animation: i === 2 ? undefined : 'concepts-cache-flash 2s ease infinite',
              animationDelay: i === 2 ? undefined : `${i * 0.4}s`,
            }}>
              {i === 2 ? 'MISS' : 'HIT'}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9, color: c, fontFamily: 'var(--font-mono)' }}>hit rate: 75%</div>
      </div>
    </div>
  )
}

function ShardingDiagram({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}10`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        {[55, 40, 65, 30].map((h, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
            <div style={{
              width: 26, borderRadius: '4px 4px 0 0',
              height: h, background: c,
              opacity: 0.9 - i * 0.1,
              animation: 'concepts-shard-grow 2s ease-in-out infinite',
              animationDelay: `${i * 0.3}s`,
            }} />
            <div style={{ fontSize: 8, color: c, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>shard-{i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QueueDiagram({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}10`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12 }}>P</div>
        <div style={{ width: 12, height: 2, background: c, opacity: 0.3, borderRadius: 1 }} />
        <div style={{ flex: 1, height: 32, borderRadius: 5, background: '#fff', border: `1.5px solid ${c}`, display: 'flex', alignItems: 'center', gap: 4, padding: '0 5px', overflow: 'hidden' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: 2, background: c, flexShrink: 0,
              animation: 'concepts-msg-flow 2.4s linear infinite',
              animationDelay: `${i * 0.8}s`,
              opacity: i === 0 ? 0.7 : i === 1 ? 0.5 : 0.35,
            }} />
          ))}
        </div>
        <div style={{ width: 12, height: 2, background: c, opacity: 0.3, borderRadius: 1 }} />
        <div style={{ width: 30, height: 30, borderRadius: 7, border: `2px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>C</div>
      </div>
    </div>
  )
}

function ReplicationDiagram({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}10`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ padding: '5px 18px', borderRadius: 7, background: c, color: '#fff', fontSize: 10, fontWeight: 600, letterSpacing: '0.04em' }}>PRIMARY</div>
        <div style={{ display: 'flex', gap: 24, height: 14, alignItems: 'center', justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 2, height: 14, background: c, borderRadius: 1, position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', border: '4px solid transparent', borderTop: `5px solid ${c}` }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              padding: '4px 10px', borderRadius: 5,
              border: `1.5px solid ${c}`,
              fontSize: 9, color: c, fontWeight: 500,
              animation: 'concepts-repl-sync 2.5s ease infinite',
              animationDelay: `${i * 0.5}s`,
            }}>
              replica-{i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CAPDiagram({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}08`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 110, height: 96 }}>
        <svg viewBox="0 0 110 96" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <polygon points="55,8 100,88 10,88" fill="none" stroke={`${c}60`} strokeWidth="1.5" strokeDasharray="4 3" />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', padding: '3px 8px', borderRadius: 20, fontSize: 9, fontWeight: 700, background: c, color: '#fff' }}>C</div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '3px 8px', borderRadius: 20, fontSize: 9, fontWeight: 700, background: '#0EA5E9', color: '#fff' }}>A</div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, padding: '3px 8px', borderRadius: 20, fontSize: 9, fontWeight: 700, background: '#10B981', color: '#fff' }}>P</div>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 8, height: 8, borderRadius: '50%', background: c,
          animation: 'concepts-cap-orbit 3s linear infinite',
        }} />
      </div>
    </div>
  )
}

function CDNDiagram({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}10`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 7, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>🌐</div>
        <div style={{ width: 16, height: 2, background: c, opacity: 0.3, borderRadius: 1 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { label: 'NYC', delay: 0 },
            { label: 'LHR', delay: 0.5 },
            { label: 'SIN', delay: 1 },
          ].map((edge, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 28, height: 16, borderRadius: 3, border: `1.5px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: c, fontWeight: 500 }}>{edge.label}</div>
              <div style={{ width: 16, height: 2, background: c, borderRadius: 1, animation: 'concepts-cdn-flash 1.5s ease infinite', animationDelay: `${edge.delay}s` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WebSocketDiagram({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}10`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>C</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ width: 40, height: 2, background: c, borderRadius: 1, animation: 'concepts-wire-pulse 1.5s ease infinite', position: 'relative' }}>
            <div style={{ position: 'absolute', right: -3, top: -3, border: '4px solid transparent', borderLeft: `6px solid ${c}` }} />
          </div>
          <div style={{ fontSize: 8, color: c, fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>FULL-DUPLEX</div>
          <div style={{ width: 40, height: 2, background: c, borderRadius: 1, animation: 'concepts-wire-pulse 1.5s ease infinite 0.5s', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -3, top: -3, border: '4px solid transparent', borderRight: `6px solid ${c}` }} />
          </div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: c }}>S</div>
      </div>
    </div>
  )
}

function DatabaseDiagram({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}10`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div style={{ width: 48, height: 32, border: `2px solid ${c}`, borderRadius: '6px 6px 4px 4px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: 16, height: 12, border: `2px solid ${c}`, borderRadius: 2, opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: -6, left: -4, right: -4, height: 10, background: `${c}22`, border: `1px solid ${c}`, borderRadius: '50%' }} />
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.3, animation: 'concepts-dot-float 2s ease infinite', animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function RateLimitingDiagram({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}10`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i < 3 ? c : `${c}30`,
              animation: i < 3 ? 'concepts-scale-pulse 1.5s ease infinite' : undefined,
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
        <div style={{ width: 56, height: 4, background: `${c}20`, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
          <div style={{ width: '60%', height: '100%', background: c, borderRadius: 2, animation: 'concepts-shard-grow 2s ease-in-out infinite' }} />
        </div>
        <div style={{ fontSize: 8, color: c, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>3 / 5 req/s</div>
      </div>
    </div>
  )
}

function MicroservicesDiagram({ color: c }: { color: string; bg: string }) {
  return (
    <div style={{ background: `${c}08`, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {['API', 'SVC', 'DB', 'QUE'].map((label, i) => (
          <div key={i} style={{
            width: 30, height: 30, borderRadius: 6,
            background: i % 2 === 0 ? c : '#fff',
            border: i % 2 === 0 ? 'none' : `1.5px solid ${c}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, fontWeight: 600, color: i % 2 === 0 ? '#fff' : c,
            animation: 'concepts-scale-pulse 2s ease infinite',
            animationDelay: `${i * 0.3}s`,
          }}>
            {label}
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ width: 12, height: 1.5, background: c, opacity: 0.3, borderRadius: 1, animation: 'concepts-wire-pulse 1.2s ease infinite' }} />
          <div style={{ width: 12, height: 1.5, background: c, opacity: 0.3, borderRadius: 1, animation: 'concepts-wire-pulse 1.2s ease infinite 0.4s' }} />
        </div>
      </div>
    </div>
  )
}
