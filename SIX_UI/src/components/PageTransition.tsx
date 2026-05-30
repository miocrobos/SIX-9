'use client'
import { useEffect } from 'react'
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
  useEffect(() => {
    const t = setTimeout(onComplete, 4200)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--overlay-bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        animation: 'pgOverlay 4s ease forwards',
      }}
      onAnimationEnd={onComplete}
    >
      {/* Icon + red box container */}
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Natural-coloured icon — revealed after red box fades */}
        <div style={{ animation: 'pgIcon 4s ease forwards', lineHeight: 1 }}>
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
          }}
        >
          <div style={{ animation: 'pgIconWiggle 4s ease forwards', lineHeight: 1 }}>
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
        }}
      >
        {quote}
      </div>
    </div>
  )
}
