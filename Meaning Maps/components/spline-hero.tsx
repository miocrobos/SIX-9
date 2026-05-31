"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false })

const DARK_SCENE  = "https://prod.spline.design/vQLFCQsffxnHCWiD/scene.splinecode"
const LIGHT_SCENE = "https://prod.spline.design/bayXJmNpjIXwcz2l/scene.splinecode"

function hideWatermark() {
  const tryHide = () => {
    document.querySelectorAll<HTMLElement>('a[href*="spline.design"], a[href*="spline"]').forEach((el) => {
      el.style.display = "none"
    })
    Array.from(document.body.children).forEach((child) => {
      const el = child as HTMLElement
      const txt = el.innerText?.toLowerCase() ?? ""
      if (txt.includes("spline") || txt.includes("built with")) {
        el.style.display = "none"
      }
    })
  }
  tryHide()
  const observer = new MutationObserver(tryHide)
  observer.observe(document.body, { childList: true })
  setTimeout(() => observer.disconnect(), 15_000)
}

/** Static gradient fallback shown when Spline fails to load */
function StaticFallback({ height }: { height: number }) {
  return (
    <div
      style={{
        width: "100%",
        height,
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 30%, #2d0c0c 55%, #D92525 85%, #ff6b35 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated diagonal light streaks — matches the screenshot */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "-20%",
            left: `${10 + i * 18}%`,
            width: 60 + i * 12,
            height: "160%",
            background: `linear-gradient(to bottom, transparent, rgba(217,37,37,${0.12 + i * 0.04}), rgba(255,107,53,${0.18 + i * 0.06}), transparent)`,
            transform: `rotate(${-30 + i * 2}deg) skewX(-10deg)`,
            filter: "blur(24px)",
            animation: `shimmer-${i} ${4 + i * 0.6}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer-0 { from { opacity: 0.6; } to { opacity: 1; } }
        @keyframes shimmer-1 { from { opacity: 0.5; transform: rotate(-28deg) skewX(-10deg) translateY(-3%); } to { opacity: 0.9; transform: rotate(-28deg) skewX(-10deg) translateY(3%); } }
        @keyframes shimmer-2 { from { opacity: 0.7; } to { opacity: 1; } }
        @keyframes shimmer-3 { from { opacity: 0.4; transform: rotate(-26deg) skewX(-10deg) translateY(2%); } to { opacity: 0.85; transform: rotate(-26deg) skewX(-10deg) translateY(-2%); } }
        @keyframes shimmer-4 { from { opacity: 0.6; } to { opacity: 1; } }
      `}</style>
    </div>
  )
}

export function SplineHero({ height = 520 }: { height?: number }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Detect dark mode via CSS media query (avoids hydration mismatch)
  const isDark = typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : true

  if (failed) {
    return <StaticFallback height={height} />
  }

  return (
    <div style={{ position: "relative", width: "100%", height, overflow: "hidden" }}>
      {/* Show fallback while Spline is loading, then fade it out */}
      {!loaded && (
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <StaticFallback height={height} />
        </div>
      )}
      <div
        style={{
          position: "absolute", inset: 0, zIndex: 2,
          opacity: loaded ? 1 : 0,
          transition: "opacity 1.2s ease",
          filter: isDark ? "none" : "hue-rotate(150deg) saturate(1.4)",
        }}
      >
        <Spline
          scene={isDark ? DARK_SCENE : LIGHT_SCENE}
          style={{ width: "100%", height }}
          onLoad={() => { setLoaded(true); hideWatermark() }}
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  )
}
