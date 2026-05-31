"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import {
  ArrowRight, BarChart3, BookOpen, BrainCircuit,
  CheckCircle, ChevronDown, FileText, GitBranch,
  Star, Table2, Users, X,
} from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { IntroAnimation } from "@/components/intro-animation"
import { SplineHero } from "@/components/spline-hero"

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: BrainCircuit,
    title: "Knowledge Hub",
    tag: "Discover",
    color: "#D92525",
    bg: "rgba(217,37,37,0.1)",
    desc: "Upload PDFs, Word docs, and spreadsheets. Sense AI extracts, indexes, and makes them searchable — with full source attribution and AI-grounded Q&A.",
    href: "/knowledge",
  },
  {
    icon: FileText,
    title: "Documents",
    tag: "Collaborate",
    color: "#6457f9",
    bg: "rgba(100,87,249,0.1)",
    desc: "Real-time collaborative rich-text editor with live cursors, comments, and an AI Copilot that can improve, summarise, and rewrite your content.",
    href: "/documents",
  },
  {
    icon: Table2,
    title: "Sheets",
    tag: "Analyse",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    desc: "Multiplayer spreadsheets backed by Liveblocks. Every cell is live, every change synced. Ask the AI Copilot to analyse, generate, or explain your data.",
    href: "/sheets",
  },
  {
    icon: GitBranch,
    title: "Workflow",
    tag: "Map",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    desc: "Drag-and-drop meaning maps on an infinite canvas. Sense AI builds them from a topic, process, or document — with relationships, colors, and structure.",
    href: "/editor",
  },
]

const stats = [
  { value: "Real-time", label: "Collaboration",    icon: Users },
  { value: "AI-native", label: "Knowledge search", icon: BookOpen },
  { value: "Zero",      label: "Hallucinations",   icon: Star },
  { value: "Full",      label: "Source tracing",   icon: BarChart3 },
]

const steps = [
  { n: "01", title: "Upload & Explore",    desc: "Add PDFs, Word, or Excel files to the Knowledge Hub. Sense AI extracts content, segments it, and makes every paragraph searchable and citable." },
  { n: "02", title: "Collaborate & Build", desc: "Work on Documents and Sheets with your team in real time. Live cursors, presence indicators, and comments keep everyone aligned." },
  { n: "03", title: "Map & Share",         desc: "Turn any topic or document into an AI-built knowledge map. Export briefs with full source citations your team can reuse." },
]

const navLinks = [
  { label: "Features",    href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Stats",       href: "#stats" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [hubModal, setHubModal] = useState(false)
  const [expandedCards, setExpandedCards] = useState<string[]>([])
  const [introComplete, setIntroComplete] = useState(false)
  const handleIntroComplete = useCallback(() => setIntroComplete(true), [])

  useEffect(() => {
    if (isSignedIn) router.replace("/dashboard")
  }, [isSignedIn, router])

  const toggleCard = (title: string) =>
    setExpandedCards((prev) =>
      prev.includes(title) ? prev.filter((c) => c !== title) : [...prev, title]
    )

  return (
    <>
      <IntroAnimation onComplete={handleIntroComplete} />

      <div
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
        className="min-h-screen bg-white dark:bg-black text-[#1A1A1A] dark:text-white"
      >
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-50 bg-white dark:bg-black border-b border-[#E8E8E8] dark:border-[#1f1f1f]"
          style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}
        >
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/Six-Sense.png" alt="SIX SENSE" width={120} height={22} priority style={{ height: "auto" }} className="invert dark:invert-0" />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  style={{ fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}
                  className="text-gray-500 dark:text-gray-400 hover:text-[#D92525] dark:hover:text-[#D92525] transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/sign-in"
                style={{
                  fontWeight: 700, fontSize: "0.875rem",
                  background: "#D92525", color: "#fff",
                  borderRadius: 10, padding: "8px 18px",
                  textDecoration: "none", display: "inline-flex",
                  alignItems: "center", gap: 6,
                }}
                className="hidden sm:inline-flex hover:brightness-110 transition-all"
              >
                Sign in <ArrowRight size={14} />
              </Link>
              <button
                className="md:hidden p-2"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menu"
              >
                <ChevronDown
                  size={20}
                  style={{ transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                />
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden border-t border-[#E8E8E8] dark:border-[#1f1f1f] bg-white dark:bg-black px-6 py-4 space-y-3">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                  style={{ display: "block", fontWeight: 700, textDecoration: "none" }}>
                  {l.label}
                </a>
              ))}
              <Link href="/sign-in" style={{ display: "block", fontWeight: 700, color: "#D92525", textDecoration: "none" }}>
                Sign in →
              </Link>
            </div>
          )}
        </header>

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ height: 520 }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <SplineHero height={520} />
          </div>

          {/* Gradient veil */}
          <div
            style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(to right, var(--hero-veil, rgba(255,255,255,0.92)) 38%, transparent 72%)",
            }}
            className="dark:[--hero-veil:rgba(0,0,0,0.85)]"
          />

          <div className="relative h-full flex flex-col justify-center pl-8 lg:pl-16 xl:pl-24" style={{ zIndex: 2 }}>
            <div style={{ maxWidth: 520 }}>
              <h1
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
                className="text-[#1A1A1A] dark:text-white mb-6"
              >
                Your organisation&apos;s knowledge,<br />
                <span style={{ color: "#D92525" }}>always at your fingertips.</span>
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  onClick={() => setHubModal(true)}
                  style={{
                    fontWeight: 700, background: "#D92525", color: "#fff",
                    borderRadius: 10, border: "none", cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 8,
                    boxShadow: "0 4px 0 #A01B10",
                  }}
                  className="w-full sm:w-auto justify-center px-6 py-3 text-sm sm:text-base hover:brightness-110 transition-all active:translate-y-1"
                >
                  Launch the Hub <ArrowRight size={16} />
                </button>
                <Link
                  href="/sign-in"
                  style={{ fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}
                  className="text-[#1A1A1A] dark:text-white hover:text-[#D92525] transition-colors hidden sm:block"
                >
                  Sign in →
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-5">
                {["SME-verified content", "Full source attribution", "AI-grounded answers", "Zero hallucinations"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-[#1A1A1A] dark:text-white" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                    <CheckCircle size={14} style={{ color: "#D92525", flexShrink: 0 }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ───────────────────────────────────────────────── */}
        <section
          id="stats"
          className="bg-[#fafafa] dark:bg-[#0a0a0a] border-t border-b border-[#E8E8E8] dark:border-[#1f1f1f]"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <div style={{ background: "#FDF0F0", borderRadius: 10, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Icon size={20} style={{ color: "#D92525" }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: "1.75rem", letterSpacing: "-0.02em", lineHeight: 1 }} className="text-[#1A1A1A] dark:text-white">{value}</p>
                <p style={{ fontWeight: 700, fontSize: "0.75rem", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.04em" }} className="text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────── */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p style={{ fontWeight: 700, fontSize: "0.75rem", color: "#D92525", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>CAPABILITIES</p>
            <h2 style={{ fontWeight: 700, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: 1.2 }} className="text-[#1A1A1A] dark:text-white">
              Four tools. One company brain.
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3" style={{ fontSize: "1.0625rem", fontWeight: 400 }}>
              Open the Hub to pick your tool.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => setHubModal(true)}
              style={{
                fontWeight: 700, background: "#D92525", color: "#fff",
                borderRadius: 10, border: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8,
                boxShadow: "0 3px 0 #A01B10",
              }}
              className="px-6 py-3 text-sm hover:brightness-110 transition-all"
            >
              Launch the Hub <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
        <section id="how" className="bg-[#fafafa] dark:bg-[#0a0a0a] border-t border-[#E8E8E8] dark:border-[#1f1f1f]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center mb-14">
              <p style={{ fontWeight: 700, fontSize: "0.75rem", color: "#D92525", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>WORKFLOW</p>
              <h2 style={{ fontWeight: 700, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: 1.2 }} className="text-[#1A1A1A] dark:text-white">
                How it works
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="bg-white dark:bg-[#111] border border-[#E8E8E8] dark:border-[#1f1f1f] rounded-2xl p-8">
                  <p style={{ fontWeight: 700, fontSize: "2.5rem", color: "#D92525", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 16, opacity: 0.25 }}>{n}</p>
                  <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 8 }} className="text-[#1A1A1A] dark:text-white">{title}</h3>
                  <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.9rem", lineHeight: 1.65, fontWeight: 400 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section style={{ background: "#D92525" }}>
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <h2 style={{ fontWeight: 700, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "#fff", letterSpacing: "-0.025em", marginBottom: 16 }}>
              Ready to build your company brain?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.0625rem", marginBottom: 32, fontWeight: 400 }}>
              Sign in to start capturing, mapping, and sharing knowledge across your organisation.
            </p>
            <Link
              href="/sign-in"
              style={{
                fontWeight: 700, background: "#fff", color: "#D92525",
                borderRadius: 10, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8,
                boxShadow: "0 4px 0 rgba(0,0,0,0.15)",
                padding: "12px 36px", fontSize: "1rem",
              }}
              className="hover:brightness-95 transition-all"
            >
              Get started now <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <footer className="border-t border-[#E8E8E8] dark:border-[#1f1f1f] bg-white dark:bg-black">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/Six-Sense.png" alt="SIX SENSE" width={72} height={20} />
              <span style={{ fontWeight: 700, fontSize: "0.8rem" }} className="text-gray-400 dark:text-gray-500">
                Knowledge Hub · Internal Platform
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", fontWeight: 400 }} className="text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} SIX Group AG. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href}
                  style={{ fontWeight: 700, fontSize: "0.8rem", textDecoration: "none" }}
                  className="text-gray-400 hover:text-[#D92525] transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* ── HUB MODAL ─────────────────────────────────────────────── */}
      {hubModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          style={{ background: "rgba(10,10,10,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setHubModal(false)}
        >
          <div
            className="bg-white dark:bg-[#111] border border-[#E8E8E8] dark:border-[#222]"
            style={{
              borderRadius: 18, width: "100%", maxWidth: 980,
              boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
              overflow: "auto", maxHeight: "min(88vh, 700px)",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ padding: "24px 28px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.7rem", color: "#D92525", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>WHERE DO YOU WANT TO GO?</p>
                <h2 style={{ fontWeight: 700, fontSize: "1.35rem", letterSpacing: "-0.025em", lineHeight: 1.15 }} className="text-[#1A1A1A] dark:text-white">Launch the Hub</h2>
                <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.8125rem", marginTop: 6, fontWeight: 400 }}>
                  Four tools, one platform. Sign in to access each section.
                </p>
              </div>
              <button
                onClick={() => setHubModal(false)}
                className="text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", lineHeight: 1, padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "20px 28px 28px" }}>
              <div style={{ display: "flex", alignItems: "stretch", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {features.map(({ icon: Icon, title, tag, color, bg, desc, href }) => {
                  const isExpanded = expandedCards.includes(title)
                  return (
                    <div
                      key={title}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleCard(title)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCard(title) } }}
                      aria-expanded={isExpanded}
                      style={{
                        flex: isExpanded ? "1 1 260px" : "0 0 68px",
                        minWidth: isExpanded ? 260 : 68,
                        maxWidth: isExpanded ? "100%" : 68,
                        cursor: "pointer",
                        transition: "flex 0.35s cubic-bezier(0.22, 1, 0.36, 1), min-width 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      <div
                        className="dark:border-[#222]"
                        style={{
                          background: isExpanded ? "var(--card-bg, #fff)" : "transparent",
                          border: isExpanded ? `1.5px solid ${color}44` : "1.5px solid transparent",
                          borderRadius: 16,
                          minHeight: isExpanded ? 210 : 68,
                          height: "100%",
                          position: "relative",
                          overflow: "hidden",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                          boxShadow: isExpanded ? "0 10px 36px rgba(0,0,0,0.14)" : "none",
                        }}
                      >
                        {!isExpanded && (
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ background: bg, borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Icon size={22} style={{ color }} />
                            </div>
                          </div>
                        )}
                        {isExpanded && (
                          <div style={{ padding: "22px 18px", minHeight: 210, display: "flex", flexDirection: "column" }}>
                            <div style={{ background: bg, borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, flexShrink: 0 }}>
                              <Icon size={22} style={{ color }} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                              <h3 style={{ fontWeight: 700, fontSize: "1.05rem", whiteSpace: "nowrap" }} className="text-[#1A1A1A] dark:text-white">{title}</h3>
                              <span style={{ fontWeight: 700, fontSize: "0.65rem", color, background: bg, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{tag}</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: "0.875rem", lineHeight: 1.65, fontWeight: 400, flex: 1 }}>{desc}</p>
                            <Link
                              href="/sign-in"
                              onClick={(e) => { e.stopPropagation(); setHubModal(false) }}
                              style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 700, fontSize: "0.78rem", color: "#D92525", textDecoration: "none" }}
                            >
                              Open {title} <ArrowRight size={13} />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
