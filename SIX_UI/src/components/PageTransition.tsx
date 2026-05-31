'use client'
import { useCallback, useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'

interface PageTransitionProps {
  Icon: LucideIcon
  iconColor?: string
  quote: string
  onComplete: () => void
}

export default function PageTransition({
  Icon,
  iconColor = '#D92525',
  quote,
  onComplete,
}: PageTransitionProps) {
  const completedRef = useRef(false)

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }, [onComplete])

  useEffect(() => {
    const t = setTimeout(finish, 4200)
    return () => clearTimeout(t)
  }, [finish])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--overlay-bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        animation: 'pgOverlay 4s ease forwards',
        willChange: 'opacity',
        transform: 'translateZ(0)',
      }}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) finish()
      }}
    >
      {/* Icon + red box container */}
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Natural-coloured icon — revealed after red box fades */}
        <div style={{ animation: 'pgIcon 4s ease forwards', lineHeight: 1, willChange: 'opacity, transform' }}>
          <Icon size={52} color={iconColor} />
        </div>

        {/* Red box with white icon + wiggle animation */}
        <div
          style={{
            position: 'absolute',
            top: -22, bottom: -22, left: -22, right: -22,
            background: '#D92525',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pgRedBox 4s ease forwards',
            willChange: 'opacity, transform',
          }}
        >
          <div style={{ animation: 'pgIconWiggle 4s ease forwards', lineHeight: 1, willChange: 'transform' }}>
            <Icon size={52} color="white" />
          </div>
        </div>

      </div>

      {/* Quote */}
      <div
        style={{
          marginTop: 28,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 400, fontSize: '0.82rem',
          fontStyle: 'italic',
          maxWidth: 260, textAlign: 'center', lineHeight: 1.6,
          color: 'var(--overlay-text)',
          animation: 'pgQuote 4s ease forwards',
          willChange: 'opacity, transform',
        }}
      >
        {quote}
      </div>
    </div>
  )
}
