"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const redBoxRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    const completeDelay = isDark ? 4500 : 3400

    const style = document.createElement("style")
    style.textContent = `
      @keyframes sixIntroOverlay {
        0%   { opacity: 1; }
        70%  { opacity: 1; }
        100% { opacity: 0; pointer-events: none; }
      }
      @keyframes sixIntroOverlayDark {
        0%   { opacity: 1; }
        75%  { opacity: 1; }
        100% { opacity: 0; pointer-events: none; }
      }
      @keyframes sixIntroLogo {
        0%   { opacity: 0; }
        20%  { opacity: 1; }
        80%  { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes sixIntroLogoDark {
        0%   { opacity: 0; }
        20%  { opacity: 1; }
        85%  { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes sixRedBox {
        0%   { opacity: 1; transform: scale(1); }
        40%  { opacity: 1; transform: scale(1); }
        65%  { opacity: 0; transform: scale(1.05); }
        100% { opacity: 0; }
      }
      @keyframes sixRedBoxDark {
        0%   { opacity: 1; transform: scale(1); }
        45%  { opacity: 1; transform: scale(1); }
        70%  { opacity: 0; transform: scale(1.05); }
        100% { opacity: 0; }
      }
      @keyframes sixIntroTagline {
        0%,40%  { opacity: 0; transform: translateY(5px); }
        60%     { opacity: 1; transform: translateY(0); }
        85%     { opacity: 1; }
        100%    { opacity: 0; }
      }
      @keyframes sixIntroTaglineDark {
        0%,45%  { opacity: 0; transform: translateY(5px); }
        65%     { opacity: 1; transform: translateY(0); }
        90%     { opacity: 1; }
        100%    { opacity: 0; }
      }
    `
    document.head.appendChild(style)

    const overlayAnim = isDark ? "sixIntroOverlayDark 4.5s ease forwards" : "sixIntroOverlay 4s ease forwards"
    const logoAnim = isDark ? "sixIntroLogoDark 4.5s ease forwards" : "sixIntroLogo 4s ease forwards"
    const redBoxAnim = isDark ? "sixRedBoxDark 5s ease forwards" : "sixRedBox 4s ease forwards"
    const taglineAnim = isDark ? "sixIntroTaglineDark 2.5s ease 2s forwards" : "sixIntroTagline 4s ease forwards"

    const entries = [
      { ref: overlayRef, anim: overlayAnim },
      { ref: logoRef, anim: logoAnim },
      { ref: redBoxRef, anim: redBoxAnim },
      { ref: taglineRef, anim: taglineAnim },
    ]

    entries.forEach(({ ref }) => { if (ref.current) ref.current.style.animation = "none" })
    void overlayRef.current?.offsetWidth
    entries.forEach(({ ref, anim }) => { if (ref.current) ref.current.style.animation = anim })

    const t = setTimeout(onComplete, completeDelay)
    return () => {
      clearTimeout(t)
      style.remove()
    }
  }, [onComplete])

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "var(--bg-base, #0d0d0d)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <div ref={logoRef} style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/Six-Sense.png"
            alt="SIX SENSE"
            width={336} height={80}
            priority
            style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: 336, maxHeight: 80 }}
          />
        </div>
        <div
          ref={redBoxRef}
          style={{
            position: "absolute",
            top: -18, bottom: -18, left: -24, right: -24,
            background: "#D92525",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Image
            src="/Six-Sense.png"
            alt="SIX SENSE"
            width={336} height={80}
            style={{ objectFit: "contain", width: "auto", height: "auto", maxWidth: 336, maxHeight: 80 }}
          />
        </div>
      </div>
      <div
        ref={taglineRef}
        style={{
          marginTop: 28, opacity: 0, transform: "translateY(5px)",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 700, fontSize: "0.6rem", color: "#fff",
          textTransform: "uppercase", letterSpacing: "0.22em",
        }}
      >
        THE FUTURE OF FINANCE IS NOW.
      </div>
    </div>
  )
}
