'use client'

interface Props {
  stage: 0 | 1 | 2 | 3
}

interface MilestoneDef {
  label: string
  plantLabel: string
  annotation: string
  subAnnotation: string
  accent: string
}

const DEFS: MilestoneDef[] = [
  {
    label: 'MILESTONE I — ROOTS',
    plantLabel: 'SEEDLING',
    annotation: 'The unseen foundation is as important as what you see.',
    subAnnotation: 'These protocols form the root system of every distributed system you will ever build.',
    accent: '#86EFAC',
  },
  {
    label: 'MILESTONE II — BRANCHES',
    plantLabel: 'SAPLING',
    annotation: 'Data management lets you grow in every direction.',
    subAnnotation: 'Storage, consistency, and partitioning give your system the structure to scale.',
    accent: '#4ADE80',
  },
  {
    label: 'MILESTONE III — ECOSYSTEM',
    plantLabel: 'MATURE TREE',
    annotation: 'Services connect into a living, breathing system.',
    subAnnotation: 'Async communication and rate protection create resilience across every node.',
    accent: '#22C55E',
  },
  {
    label: 'MILESTONE IV — MASTERY',
    plantLabel: 'FRUIT TREE',
    annotation: 'You can build production systems at internet scale.',
    subAnnotation: 'Consistent hashing, replication, microservices — the tools of a master architect.',
    accent: '#F97316',
  },
]

function SeedlingSVG({ accent }: { accent: string }) {
  const cx = 280
  return (
    <g>
      <line x1={80} y1={90} x2={420} y2={90}
        stroke="#C4B49E" strokeWidth="0.6" strokeDasharray="3,4" opacity="0.35"
      />
      <text x={82} y={87} fontFamily="var(--font-dm-sans)" fontSize="5.5" fill="#C4B49E" opacity="0.5">
        GROUND
      </text>
      <text x={82} y={93} fontFamily="var(--font-dm-sans)" fontSize="5.5" fill="#C4B49E" opacity="0.5">
        LINE
      </text>

      <line x1={75} y1={90} x2={75} y2={42}
        stroke="#C4B49E" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3"
      />
      <line x1={73} y1={42} x2={77} y2={42} stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      <line x1={73} y1={90} x2={77} y2={90} stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      <text x={73} y={68} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize="5"
        fill="#C4B49E" opacity="0.4" transform="rotate(-90,73,68)"
      >
        CANOPY
      </text>

      <line x1={410} y1={90} x2={410} y2={130}
        stroke="#C4B49E" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3"
      />
      <line x1={408} y1={90} x2={412} y2={90} stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      <line x1={408} y1={130} x2={412} y2={130} stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      <text x={412} y={112} fontFamily="var(--font-dm-sans)" fontSize="5"
        fill="#C4B49E" opacity="0.4" transform="rotate(90,412,112)"
      >
        ROOT ZONE
      </text>

      <path d={`M${cx},90 Q${cx - 5},78 ${cx},66`} fill="none" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" />
      <path d={`M${cx},66 Q${cx - 16},60 ${cx - 18},65 Q${cx - 10},68 ${cx},68`} fill={accent} opacity="0.8" />
      <path d={`M${cx},68 Q${cx + 16},62 ${cx + 18},67 Q${cx + 10},70 ${cx},70`} fill={accent} opacity="0.8" />

      <path d={`M${cx},90 Q${cx + 2},105 ${cx},135`} fill="none" stroke="#8B7355" strokeWidth="1.8" strokeLinecap="round" />
      <path d={`M${cx - 2},98 Q${cx - 18},103 ${cx - 22},113`} fill="none" stroke="#8B7355" strokeWidth="1" strokeLinecap="round" />
      <path d={`M${cx + 2},100 Q${cx + 20},106 ${cx + 24},116`} fill="none" stroke="#8B7355" strokeWidth="1" strokeLinecap="round" />
      <path d={`M${cx - 1},108 Q${cx - 15},110 ${cx - 18},120`} fill="none" stroke="#8B7355" strokeWidth="0.8" strokeLinecap="round" />
      <path d={`M${cx + 1},110 Q${cx + 16},114 ${cx + 20},124`} fill="none" stroke="#8B7355" strokeWidth="0.8" strokeLinecap="round" />
      <path d={`M${cx},118 Q${cx - 10},120 ${cx - 12},127`} fill="none" stroke="#8B7355" strokeWidth="0.6" strokeLinecap="round" />
      <path d={`M${cx},120 Q${cx + 10},122 ${cx + 12},129`} fill="none" stroke="#8B7355" strokeWidth="0.6" strokeLinecap="round" />

      <circle cx={cx} cy={65} r="2" fill={accent} />
    </g>
  )
}

function SaplingSVG({ accent }: { accent: string }) {
  const cx = 280
  return (
    <g>
      <line x1={80} y1={95} x2={420} y2={95}
        stroke="#C4B49E" strokeWidth="0.6" strokeDasharray="3,4" opacity="0.35"
      />
      <text x={82} y={92} fontFamily="var(--font-dm-sans)" fontSize="5.5" fill="#C4B49E" opacity="0.5">
        GROUND
      </text>

      <line x1={75} y1={95} x2={75} y2={30}
        stroke="#C4B49E" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3"
      />
      <line x1={73} y1={30} x2={77} y2={30} stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      <line x1={73} y1={95} x2={77} y2={95} stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      <text x={73} y={55} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize="5"
        fill="#C4B49E" opacity="0.4" transform="rotate(-90,73,55)"
      >
        HEIGHT
      </text>

      <path d={`M${cx},95 Q${cx - 3},70 ${cx},45`} fill="none" stroke="#8B7355" strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M${cx},65 Q${cx - 25},58 ${cx - 28},62`} fill="none" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" />
      <path d={`M${cx},50 Q${cx + 22},42 ${cx + 26},46`} fill="none" stroke="#8B7355" strokeWidth="1.8" strokeLinecap="round" />
      <path d={`M${cx},75 Q${cx + 18},70 ${cx + 20},74`} fill="none" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />

      <ellipse cx={cx - 28} cy={61} rx={8} ry={5} fill={accent} opacity="0.85" />
      <ellipse cx={cx - 26} cy={60} rx={4} ry={2.5} fill="#fff" opacity="0.15" />
      <ellipse cx={cx + 26} cy={45} rx={8} ry={5} fill={accent} opacity="0.85" />
      <ellipse cx={cx + 28} cy={44} rx={4} ry={2.5} fill="#fff" opacity="0.15" />
      <ellipse cx={cx + 20} cy={73} rx={7} ry={4.5} fill={accent} opacity="0.75" />
      <ellipse cx={cx} cy={44} rx={7} ry={4.5} fill={accent} opacity="0.85" />
      <ellipse cx={cx - 2} cy={43} rx={3.5} ry={2} fill="#fff" opacity="0.15" />

      <path d={`M${cx},95 Q${cx + 2},108 ${cx},130`} fill="none" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" />
      <path d={`M${cx - 2},102 Q${cx - 20},106 ${cx - 24},116`} fill="none" stroke="#8B7355" strokeWidth="1.2" strokeLinecap="round" />
      <path d={`M${cx + 2},104 Q${cx + 22},108 ${cx + 26},118`} fill="none" stroke="#8B7355" strokeWidth="1.2" strokeLinecap="round" />
      <path d={`M${cx - 1},112 Q${cx - 16},114 ${cx - 18},124`} fill="none" stroke="#8B7355" strokeWidth="0.8" strokeLinecap="round" />
      <path d={`M${cx + 1},114 Q${cx + 16},116 ${cx + 18},126`} fill="none" stroke="#8B7355" strokeWidth="0.8" strokeLinecap="round" />
      <path d={`M${cx},120 Q${cx - 8},122 ${cx - 10},129`} fill="none" stroke="#8B7355" strokeWidth="0.6" strokeLinecap="round" />
      <path d={`M${cx},121 Q${cx + 8},123 ${cx + 10},130`} fill="none" stroke="#8B7355" strokeWidth="0.6" strokeLinecap="round" />

      <rect x={cx - 26} y={58} width={52} height={10} rx={2} fill="#1A1A1A" opacity="0.7" />
      <text x={cx} y={65} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="5.5"
        fill={accent} fontWeight="600"
      >
        MULTI-DIRECTIONAL GROWTH
      </text>
    </g>
  )
}

function TreeSVG({ accent }: { accent: string }) {
  const cx = 280
  return (
    <g>
      <line x1={80} y1={100} x2={420} y2={100}
        stroke="#C4B49E" strokeWidth="0.6" strokeDasharray="3,4" opacity="0.35"
      />

      <rect x={cx - 8} y={65} width={16} height={35} rx={3} fill="#8B7355" />
      <path d={`M${cx - 8},75 Q${cx - 35},65 ${cx - 40},70`} fill="none" stroke="#8B7355" strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M${cx + 8},72 Q${cx + 30},60 ${cx + 38},65`} fill="none" stroke="#8B7355" strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M${cx},80 Q${cx - 28},72 ${cx - 32},76`} fill="none" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" />
      <path d={`M${cx},82 Q${cx + 25},74 ${cx + 30},78`} fill="none" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" />
      <path d={`M${cx},76 Q${cx - 15},50 ${cx - 18},54`} fill="none" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />
      <path d={`M${cx},74 Q${cx + 12},48 ${cx + 16},52`} fill="none" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" />

      {[
        [cx, 48, 38], [cx - 20, 62, 30], [cx + 22, 58, 32],
        [cx - 35, 72, 25], [cx + 32, 68, 28], [cx - 12, 55, 22], [cx + 14, 52, 24],
      ].map(([cx2, cy2, r], i) => (
        <circle key={i} cx={cx2} cy={cy2} r={r} fill={accent} opacity="0.35" />
      ))}
      {[
        [cx, 48, 30], [cx - 18, 62, 22], [cx + 20, 58, 24],
      ].map(([cx2, cy2, r], i) => (
        <circle key={`h-${i}`} cx={cx2} cy={cy2} r={r * 0.5} fill="#fff" opacity="0.08" />
      ))}

      <line x1={75} y1={100} x2={75} y2={40}
        stroke="#C4B49E" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3"
      />
      <line x1={73} y1={40} x2={77} y2={40} stroke="#C4B49E" strokeWidth="0.5" opacity="0.3" />
      <text x={73} y={72} textAnchor="end" fontFamily="var(--font-dm-sans)" fontSize="5"
        fill="#C4B49E" opacity="0.4" transform="rotate(-90,73,72)"
      >
        TRUNK
      </text>

      <line x1={180} y1={36} x2={380} y2={36}
        stroke="#C4B49E" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.2"
      />
      <line x1={180} y1={34} x2={180} y2={38} stroke="#C4B49E" strokeWidth="0.5" opacity="0.2" />
      <line x1={380} y1={34} x2={380} y2={38} stroke="#C4B49E" strokeWidth="0.5" opacity="0.2" />
      <text x={280} y={34} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="5"
        fill="#C4B49E" opacity="0.4"
      >
        CANOPY SPAN
      </text>

      <rect x={cx - 30} y={50} width={60} height={10} rx={2} fill="#1A1A1A" opacity="0.7" />
      <text x={cx} y={57} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="5.5"
        fill={accent} fontWeight="600"
      >
        INTERCONNECTED SYSTEM
      </text>
    </g>
  )
}

function FruitTreeSVG({ accent }: { accent: string }) {
  const cx = 280
  return (
    <g>
      <line x1={80} y1={100} x2={420} y2={100}
        stroke="#C4B49E" strokeWidth="0.6" strokeDasharray="3,4" opacity="0.35"
      />

      <rect x={cx - 9} y={60} width={18} height={40} rx={3} fill="#8B7355" />
      <path d={`M${cx - 9},70 Q${cx - 38},60 ${cx - 44},66`} fill="none" stroke="#8B7355" strokeWidth="2.8" strokeLinecap="round" />
      <path d={`M${cx + 9},68 Q${cx + 34},56 ${cx + 42},62`} fill="none" stroke="#8B7355" strokeWidth="2.8" strokeLinecap="round" />
      <path d={`M${cx},75 Q${cx - 30},66 ${cx - 35},72`} fill="none" stroke="#8B7355" strokeWidth="2.2" strokeLinecap="round" />
      <path d={`M${cx},78 Q${cx + 28},68 ${cx + 33},74`} fill="none" stroke="#8B7355" strokeWidth="2.2" strokeLinecap="round" />
      <path d={`M${cx},70 Q${cx - 18},44 ${cx - 22},48`} fill="none" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" />
      <path d={`M${cx},68 Q${cx + 15},40 ${cx + 20},44`} fill="none" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" />

      {[
        [cx, 42, 42], [cx - 24, 58, 34], [cx + 26, 54, 36],
        [cx - 38, 70, 28], [cx + 36, 66, 30],
      ].map(([cx2, cy2, r], i) => (
        <circle key={i} cx={cx2} cy={cy2} r={r} fill="#22C55E" opacity="0.3" />
      ))}
      {[
        [cx, 42, 34], [cx - 22, 58, 26], [cx + 24, 54, 28],
      ].map(([cx2, cy2, r], i) => (
        <circle key={`h-${i}`} cx={cx2} cy={cy2} r={r * 0.5} fill="#fff" opacity="0.08" />
      ))}

      {[
        [cx - 12, 50], [cx + 16, 46], [cx - 28, 62],
        [cx + 30, 58], [cx - 6, 56], [cx + 8, 52],
      ].map(([fx, fy], i) => (
        <g key={`fruit-${i}`}>
          <circle cx={fx} cy={fy} r={5} fill={accent} opacity="0.9" />
          <circle cx={fx - 1.5} cy={fy - 1.5} r={2} fill="#FFB300" opacity="0.6" />
          <path d={`M${fx},${fy - 5} Q${fx + 1},${fy - 7} ${fx + 2},${fy - 7}`}
            fill="none" stroke="#8B7355" strokeWidth="0.6" strokeLinecap="round"
          />
        </g>
      ))}

      <rect x={cx - 32} y={44} width={64} height={10} rx={2} fill="#1A1A1A" opacity="0.7" />
      <text x={cx} y={51} textAnchor="middle" fontFamily="var(--font-dm-sans)" fontSize="5.5"
        fill={accent} fontWeight="600"
      >
        PRODUCTION READY
      </text>
    </g>
  )
}

export default function GrowthMilestone({ stage }: Props) {
  const def = DEFS[stage]

  return (
    <div style={{ padding: '24px 0', position: 'relative' }}>
      <svg
        viewBox="0 0 480 150"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          <filter id="mg" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[[12, 8], [468, 8], [12, 142], [468, 142]].map(([bx, by]) => (
          <path
            key={`br-${bx}-${by}`}
            d={`M${bx},${by + 6} L${bx},${by} L${bx + 6},${by}`}
            fill="none" stroke="#C4B49E" strokeWidth="0.5" opacity="0.25"
          />
        ))}

        <text x={12} y={14} fontFamily="var(--font-dm-sans)" fontSize="6"
          fill="#C4B49E" opacity="0.5" letterSpacing="0.1em" fontWeight="600"
        >
          {def.label}
        </text>

        <text x={468} y={146} textAnchor="end"
          fontFamily="var(--font-dm-sans)" fontSize="7"
          fill={def.accent} opacity="0.5" fontStyle="italic"
        >
          {def.plantLabel}
        </text>

        {stage === 0 && <SeedlingSVG accent={def.accent} />}
        {stage === 1 && <SaplingSVG accent={def.accent} />}
        {stage === 2 && <TreeSVG accent={def.accent} />}
        {stage === 3 && <FruitTreeSVG accent={def.accent} />}

        <rect x={80} y={124} width={320} height={22} rx={3} fill="#1A1A1A" opacity="0.85" />
        <text x={240} y={134} textAnchor="middle"
          fontFamily="var(--font-dm-sans)" fontSize="7.5"
          fill={def.accent} fontWeight="500"
        >
          {def.annotation}
        </text>
        <text x={240} y={142} textAnchor="middle"
          fontFamily="var(--font-dm-sans)" fontSize="6"
          fill="#A8A29E" fontStyle="italic"
        >
          {def.subAnnotation}
        </text>
      </svg>
    </div>
  )
}
