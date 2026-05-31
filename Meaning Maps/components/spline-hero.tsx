"use client"

import dynamic from "next/dynamic"
import { useTheme } from "@/components/theme-provider"

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

export function SplineHero({ height = 520 }: { height?: number }) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div style={{ position: "relative", width: "100%", height, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, filter: isDark ? "none" : "hue-rotate(150deg) saturate(1.4)" }}>
        <Spline
          scene={isDark ? DARK_SCENE : LIGHT_SCENE}
          style={{ width: "100%", height }}
          onLoad={hideWatermark}
        />
      </div>
    </div>
  )
}
