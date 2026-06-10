'use client'

import { useState } from 'react'

interface SpineZone {
  id: number
  label: string
  icon: string
}

export default function ProgressSpine({
  zones,
  activeZone,
  completedZones,
  onZoneClick,
  accentColor,
}: {
  zones: SpineZone[]
  activeZone: number
  completedZones: Set<number>
  onZoneClick: (index: number) => void
  accentColor: string
}) {
  const [hoveredZone, setHoveredZone] = useState<number | null>(null)

  return (
    <>
      <div
        className="hidden lg:flex"
        style={{
          position: 'fixed',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 50,
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 1,
            height: '100%',
            background: 'rgba(0,0,0,0.08)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 0,
          }}
        />

        {zones.map((zone, i) => {
          const isCompleted = completedZones.has(i)
          const isActive = activeZone === i
          const isHovered = hoveredZone === i

          return (
            <div
              key={zone.id}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => onZoneClick(i)}
                onMouseEnter={() => setHoveredZone(i)}
                onMouseLeave={() => setHoveredZone(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  border: '2px solid',
                  borderColor: isCompleted
                    ? accentColor
                    : isActive
                    ? accentColor
                    : 'rgba(0,0,0,0.12)',
                  background: isCompleted
                    ? accentColor
                    : '#fff',
                  boxShadow: isActive
                    ? `0 0 0 4px ${accentColor}22`
                    : 'none',
                  outline: 'none',
                  padding: 0,
                }}
              >
                {isCompleted ? (
                  <span style={{ fontSize: 12, color: '#fff', lineHeight: 1 }}>✓</span>
                ) : (
                  <span
                    style={{
                      fontSize: 13,
                      lineHeight: 1,
                      opacity: isActive ? 1 : 0.4,
                    }}
                  >
                    {zone.icon}
                  </span>
                )}
              </button>

              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    left: 44,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#1C1917',
                    color: '#FFFBF7',
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 60,
                  }}
                >
                  {zone.label}
                </div>
              )}

              {i < zones.length - 1 && (
                <div
                  style={{
                    width: 1,
                    height: 28,
                    background: isCompleted ? accentColor : 'rgba(0,0,0,0.08)',
                    transition: 'background 0.4s ease',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      <div
        className="flex lg:hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 52,
          background: 'rgba(255,251,247,0.95)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderTop: '0.5px solid rgba(0,0,0,0.08)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {zones.map((zone, i) => {
          const isCompleted = completedZones.has(i)
          const isActive = activeZone === i

          return (
            <button
              key={zone.id}
              onClick={() => onZoneClick(i)}
              style={{
                width: isCompleted || isActive ? 24 : 8,
                height: 8,
                borderRadius: 20,
                background: isCompleted
                  ? accentColor
                  : isActive
                  ? accentColor
                  : 'rgba(0,0,0,0.12)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: 'none',
                padding: 0,
                outline: 'none',
              }}
            />
          )
        })}
      </div>
    </>
  )
}
