'use client'
import Image from 'next/image'
import { useEffect } from 'react'

interface IntroAnimationProps {
  onComplete: () => void
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3400)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--overlay-bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        animation: 'sixIntroOverlay 4s ease forwards',
        pointerEvents: 'none',
      }}
    >
      {/* Logo + red box stacked together */}
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* SIX logo — sits behind the red box, revealed as it fades */}
        <div style={{ animation: 'sixIntroLogo 4s ease forwards' }}>
          <Image
            src="/six-logo.png"
            alt="SIX"
            width={160} height={80}
            priority
            style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxWidth: 160, maxHeight: 80, display: 'block', filter: 'brightness(0) saturate(100%) invert(19%) sepia(100%) saturate(5000%) hue-rotate(353deg) brightness(85%)' }}
          />
        </div>

        {/* Red box + white logo — fade in and out together */}
        <div
          style={{
            position: 'absolute',
            top: -18, bottom: -18, left: -24, right: -24,
            background: '#D92525',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'sixRedBox 4s ease forwards',
          }}
        >
          <Image
            src="/six-logo.png"
            alt="SIX"
            width={160} height={80}
            style={{
              objectFit: 'contain', width: 'auto', height: 'auto',
              maxWidth: 160, maxHeight: 80, display: 'block',
              filter: 'brightness(0) invert(1)',
            }}
          />
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 28,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 700, fontSize: '0.6rem', color: 'var(--overlay-text)',
          textTransform: 'uppercase', letterSpacing: '0.22em',
          animation: 'sixIntroTagline 4s ease forwards',
        }}
      >
        THE FUTURE OF FINANCE IS NOW.
      </div>
    </div>
  )
}


