'use client'
import { useMemo, useState, useEffect } from 'react'

export interface DayCycleState {
  hour: number
  sunX: number
  sunY: number
  sunElevation: number
  sunGlowRadius: number
  sunFill: string
  moonX: number
  moonY: number
  moonPhase: number
  isNight: boolean
  shadowOffsetX: number
  shadowLength: number
  shadowOpacity: number
  tintFill: string
  tintOpacity: number
  stars: { x: number; y: number; opacity: number }[]
  cloudOpacity: number
}

export function useDayCycle(seed = 0): DayCycleState {
  const [hour, setHour] = useState(() => {
    const now = new Date()
    return now.getHours() + now.getMinutes() / 60
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setHour(h => (h + 1 / 120) % 24)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return useMemo(() => {
    const frac = ((hour - 6 + 24) % 24) / 24
    const isNight = frac > 0.5

    const t = Math.min(frac * 2, 1)
    const sunX = 20 + 440 * t
    const sunY = 100 - 70 * Math.sin(t * Math.PI)
    const sunElevation = isNight ? 0 : Math.sin(t * Math.PI)

    const moonPhase = (frac + 0.5) % 1
    const moonX = 20 + 440 * moonPhase
    const moonY = 100 - 60 * Math.sin(moonPhase * Math.PI)

    const shadowAmount = isNight ? 0 : 1 - sunElevation
    const shadowOffsetX = 16 * shadowAmount
    const shadowLength = 8 + 26 * shadowAmount
    const shadowOpacity = isNight ? 0 : 0.03 + 0.05 * shadowAmount

    const w = shadowAmount
    const sat = Math.round(20 + 60 * w)
    const lit = Math.round(88 + 10 * (1 - w))
    const sunFill = isNight ? 'transparent' : `hsl(35, ${sat}%, ${lit}%)`
    const sunGlowRadius = isNight ? 0 : 10 + 10 * shadowAmount

    let tintFill: string
    let tintOpacity: number
    if (frac < 0.07) {
      const p = frac / 0.07
      tintFill = '#F97316'
      tintOpacity = 0.10 * (1 - p)
    } else if (frac < 0.13) {
      const p = (frac - 0.07) / 0.06
      tintFill = '#FBBF24'
      tintOpacity = 0.04 * (1 - p)
    } else if (frac > 0.38 && frac < 0.44) {
      const p = (frac - 0.38) / 0.06
      tintFill = '#FBBF24'
      tintOpacity = 0.04 * p
    } else if (frac > 0.44 && frac < 0.50) {
      const p = (frac - 0.44) / 0.06
      tintFill = '#F97316'
      tintOpacity = 0.10 * p
    } else if (frac >= 0.50 && frac < 0.56) {
      const p = (frac - 0.50) / 0.06
      tintFill = '#1E3A5F'
      tintOpacity = 0.03 + 0.10 * p
    } else if (frac >= 0.56 && frac < 0.90) {
      tintFill = '#1E3A5F'
      tintOpacity = 0.13
    } else {
      const p = (frac - 0.90) / 0.10
      tintFill = '#1E3A5F'
      tintOpacity = 0.13 * (1 - p)
    }

    const stars = Array.from({ length: 16 }, (_, i) => ({
      x: ((i * 131.7 + seed * 43.1 + 0.3) % 1) * 440 + 20,
      y: ((i * 97.3 + seed * 71.9 + 0.7) % 1) * 120 + 10,
      opacity: 0.12 + ((i * 47.3) % 1) * 0.28,
    }))

    const cloudOpacity = isNight ? 0.04 : 0.06 + 0.04 * sunElevation

    return {
      hour, sunX, sunY, sunElevation, sunGlowRadius, sunFill,
      moonX, moonY, moonPhase, isNight,
      shadowOffsetX, shadowLength, shadowOpacity,
      tintFill, tintOpacity, stars, cloudOpacity,
    }
  }, [hour, seed])
}
