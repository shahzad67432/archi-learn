'use client'

import { concepts as allConcepts } from '@/data/concepts'
import JourneyStage from './JourneyStage'
import GrowthMilestone from './GrowthMilestone'

interface StageDef {
  title: string
  theme: string
  indices: number[]
}

const STAGES: StageDef[] = [
  {
    title: 'Foundation',
    theme: 'How data travels across the network',
    indices: [0, 1, 2, 3],
  },
  {
    title: 'Storage & Data',
    theme: 'Storing and organizing at scale',
    indices: [4, 5, 6],
  },
  {
    title: 'Communication',
    theme: 'Async communication between services',
    indices: [7, 8],
  },
  {
    title: 'Architecture',
    theme: 'Building resilient distributed systems',
    indices: [9, 10, 11],
  },
]

export default function JourneyPage() {
  const publishedCount = allConcepts.filter(c => c.published).length
  const totalXP = allConcepts.reduce((sum, c) => sum + c.xpReward, 0)

  return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#FFFBF7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 52,
        }}
    >
      {/* ── Page header ── */}
      <div
        style={{
          width: '100%',
          padding: 'clamp(24px, 4vh, 48px) clamp(20px, 4vw, 48px) 0',
        }}
      >
        <div
          className="font-syne"
          style={{
            fontWeight: 800,
            fontSize: 'clamp(24px, 3.5vw, 40px)',
            color: '#1C1917',
            lineHeight: 1.05,
            marginBottom: 4,
          }}
        >
          Concept Modules
        </div>
        <div
          className="font-dm-sans"
          style={{
            fontSize: 'clamp(12px, 1.4vw, 15px)',
            color: '#78716C',
            lineHeight: 1.4,
            marginBottom: 14,
          }}
        >
          A connected learning journey &middot; {publishedCount} of {allConcepts.length} concepts available &middot; up to {totalXP} XP
        </div>

        <div
          style={{
            width: '100%',
            height: 3,
            backgroundColor: '#E5E5E5',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(publishedCount / allConcepts.length) * 100}%`,
              height: '100%',
              backgroundColor: '#F97316',
              borderRadius: 2,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* ── Journey body ── */}
      <div
        style={{
          width: '100%',
          padding: 'clamp(20px, 3vh, 36px) clamp(20px, 4vw, 48px) 48px',
        }}
      >
        {STAGES.map((stage, i) => (
          <div key={stage.title}>
            <JourneyStage
              stageNumber={i + 1}
              title={stage.title}
              theme={stage.theme}
              concepts={stage.indices.map(idx => allConcepts[idx])}
              totalStages={STAGES.length}
            />

            {/* Growth milestone between stages */}
            {i < STAGES.length - 1 && (
              <GrowthMilestone stage={i as 0 | 1 | 2} />
            )}
          </div>
        ))}

        {/* Final milestone after last stage */}
        <div style={{ marginTop: 24 }}>
          <GrowthMilestone stage={3} />
        </div>
      </div>
    </div>
  )
}
