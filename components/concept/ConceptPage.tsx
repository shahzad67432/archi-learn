'use client'

import dynamic from 'next/dynamic'
import { useState, useRef, useEffect, useCallback } from 'react'
import type { Concept } from '@/data/concepts'
import { getScenes } from '@/components/concept/scenes/sceneRegistry'
import { registerWebSocketScenes } from '@/components/concept/scenes/websockets/WSRegistration'
import { registerRedisScenes } from '@/components/concept/scenes/redis/RedisRegistration'
import ConceptTopBar from '@/components/concept/ConceptTopBar'
import ProgressSpine from '@/components/concept/ProgressSpine'
import { useXPStore } from '@/lib/store/xpStore'

registerWebSocketScenes()
registerRedisScenes()

const ZoneHook = dynamic(() => import('@/components/concept/zones/ZoneHook'))
const ZoneHowItWorks = dynamic(() => import('@/components/concept/zones/ZoneHowItWorks'))
const ZoneHardParts = dynamic(() => import('@/components/concept/zones/ZoneHardParts'))
const ZoneQuiz = dynamic(() => import('@/components/concept/zones/ZoneQuiz'))

const ZONES = [
  { id: 0, label: 'The Problem',   icon: '⚡' },
  { id: 1, label: 'How It Works',  icon: '⚙️' },
  { id: 2, label: 'Hard Parts',    icon: '🔥' },
  { id: 3, label: 'Try It',        icon: '🎮' },
  { id: 4, label: 'Quiz',          icon: '🧠' },
]

export default function ConceptPage({ concept }: { concept: Concept }) {
  const [activeZone, setActiveZone] = useState(0)
  const [completedZones, setCompletedZones] = useState<Set<number>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)
  const markConceptComplete = useXPStore(s => s.markConceptComplete)
  const scenes = getScenes(concept.slug)

  const markZoneComplete = (index: number) => {
    setCompletedZones(prev => new Set([...prev, index]))
    localStorage.setItem(`zone-complete-${concept.slug}-${index}`, 'true')
  }

  const scrollToZone = useCallback((index: number) => {
    const container = scrollRef.current
    if (!container) return
    const zoneHeight = window.innerHeight
    container.scrollTo({ top: index * zoneHeight, behavior: 'smooth' })
    setActiveZone(index)
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const zoneHeight = window.innerHeight
      const newZone = Math.round(scrollTop / zoneHeight)
      if (newZone !== activeZone) {
        setActiveZone(newZone)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [activeZone])

  useEffect(() => {
    const zones = [0, 1, 2, 3, 4]
    zones.forEach(i => {
      const key = `zone-complete-${concept.slug}-${i}`
      if (localStorage.getItem(key) === 'true') {
        markZoneComplete(i)
      }
    })
    if (!scenes?.TryItContent) {
      markZoneComplete(3)
    }
  }, [scenes])

  useEffect(() => {
    if (completedZones.size === ZONES.length) {
      markConceptComplete(concept.slug, concept.xpReward)
    }
  }, [completedZones.size, concept.slug, concept.xpReward, markConceptComplete])

  return (
    <div style={{ background: '#FFFBF7', minHeight: '100vh' }}>
      <ConceptTopBar
        concept={concept}
        activeZone={activeZone}
        totalZones={ZONES.length}
      />

      <ProgressSpine
        zones={ZONES}
        activeZone={activeZone}
        completedZones={completedZones}
        onZoneClick={scrollToZone}
        accentColor={concept.color.accent}
      />

      <div
        ref={scrollRef}
        className="lg:pl-[60px] pl-0 lg:pb-0 pb-[52px]"
        style={{
          height: '100vh',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          paddingTop: '52px',
        }}
      >
        {ZONES.map((zone, i) => (
          <div
            key={zone.id}
            style={{
              height: '100vh',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              position: 'relative',
              background: i === 0 ? `${concept.color.bg}40` : '#FFFBF7',
            }}
          >
            {i === 0 ? (
              <ZoneHook
                concept={concept}
                onComplete={() => markZoneComplete(0)}
                onNext={() => scrollToZone(1)}
              />
            ) : i === 1 ? (
              <ZoneHowItWorks
                concept={concept}
                onComplete={() => markZoneComplete(1)}
                onNext={() => scrollToZone(2)}
              />
            ) : i === 2 ? (
              <ZoneHardParts
                concept={concept}
                onComplete={() => markZoneComplete(2)}
                onNext={() => scrollToZone(3)}
                isVisible={activeZone === 2}
              />
            ) : i === 3 ? (
              scenes?.TryItContent ? (
                <scenes.TryItContent
                  concept={concept}
                  onComplete={() => markZoneComplete(3)}
                  onNext={() => scrollToZone(4)}
                />
              ) : null
            ) : (
              <ZoneQuiz
                concept={concept}
                onComplete={() => markZoneComplete(4)}
                onNext={() => {}}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
