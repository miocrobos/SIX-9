'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

interface IntroAnimationProps {
  onComplete: () => void
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const overlayRef  = useRef<HTMLDivElement>(null)
  const logoRef     = useRef<HTMLDivElement>(null)
  const redBoxRef   = useRef<HTMLDivElement>(null)
  const taglineRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const entries = [
      { ref: overlayRef,  anim: 'sixIntroOverlay 4s ease forwards'  },
      { ref: logoRef,     anim: 'sixIntroLogo 4s ease forwards'      },
      { ref: redBoxRef,   anim: 'sixRedBox 4s ease forwards'         },
      { ref: taglineRef,  anim: 'sixIntroTagline 4s ease forwards'   },
    ]

    // 1. Strip all animations so the browser resets the playback state
    entries.forEach(({ ref }) => { if (ref.current) ref.current.style.animation = 'none' })

    // 2. Force a synchronous reflow — makes the browser forget the previous animation
    void overlayRef.current?.offsetWidth

    // 3. Re-apply animations — they now start fresh from 0%
    entries.forEach(({ ref, anim }) => { if (ref.current) ref.current.style.animation = anim })

    const t = setTimeout(onComplete, 3400)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--overlay-bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* Logo + red box stacked together */}
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Primary logo sits behind the red box, revealed as it fades */}
        <div ref={logoRef} style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/Six-Sense.png"
            alt="SIX SENSE"
            width={336} height={80}
            priority
            style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxWidth: 336, maxHeight: 80, display: 'block' }}
          />
        </div>

        {/* Red box + white logo — fade in and out together */}
        <div
          ref={redBoxRef}
          style={{
            position: 'absolute',
            top: -18, bottom: -18, left: -24, right: -24,
            background: '#D92525',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Image
            src="/Six-Sense.png"
            alt="SIX SENSE"
            width={336} height={80}
            style={{
              objectFit: 'contain', width: 'auto', height: 'auto',
              maxWidth: 336, maxHeight: 80, display: 'block',
            }}
          />
        </div>
      </div>

      {/* Tagline */}
      <div
        ref={taglineRef}
        style={{
          marginTop: 28,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 700, fontSize: '0.6rem', color: 'var(--overlay-text)',
          textTransform: 'uppercase', letterSpacing: '0.22em',
        }}
      >
        THE FUTURE OF FINANCE IS NOW.
      </div>
    </div>
  )
}


