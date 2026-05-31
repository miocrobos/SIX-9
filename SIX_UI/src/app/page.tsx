'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import {
  BookOpen, Trophy, Zap, Gamepad2, StickyNote,
  ArrowRight, CheckCircle,
  BarChart3, Users, Star, ChevronDown
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import IntroAnimation from '@/components/IntroAnimation'
import SplineHero from '@/components/SplineHero'

const features = [
  {
    icon: Zap,
    title: 'DuoKnow',
    tag: 'Learn',
    color: '#58CC02',
    bg: '#F0FBE8',
    desc: 'Gamified learning paths modelled on Duolingo. Earn XP, build streaks, and master organisational knowledge through bite-sized interactive modules.',
    href: '/dashboard',
  },
  {
    icon: BookOpen,
    title: 'Knowledge Hub',
    tag: 'Discover',
    color: '#D92525',
    bg: '#E8F7FD',
    desc: 'A fully traceable article repository with SME verification, confidence scores, and complete source attribution. Every claim is backed.',
    href: '/textbook',
  },
  {
    icon: Gamepad2,
    title: 'Know Game',
    tag: 'Test',
    color: '#D92525',
    bg: '#FDF0F0',
    desc: 'Challenge yourself and colleagues with timed quizzes. Quick Fire, Deep Dive, Weekly Challenges — four game modes, one leaderboard.',
    href: '/game',
  },
  {
    icon: StickyNote,
    title: 'SIX Note',
    tag: 'Contribute',
    color: '#CE82FF',
    bg: '#F8F0FF',
    desc: 'Upload institutional knowledge or ask AI-grounded questions. Every answer cites its source — no hallucinations, full audit trails.',
    href: '/sixnote',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    tag: 'Compete',
    color: '#FF9600',
    bg: '#FFF7EB',
    desc: 'Live rankings across departments. Earn badges for contributions, learning milestones, and knowledge sharing. Healthy competition drives retention.',
    href: '/leaderboard',
  },
]

const stats = [
  { value: '1,247', label: 'Knowledge Articles', icon: BookOpen },
  { value: '86',    label: 'Contributors',       icon: Users },
  { value: '94%',   label: 'Quality Score',      icon: Star },
  { value: '98%',   label: 'Knowledge Retention',icon: BarChart3 },
]

const steps = [
  { n: '01', title: 'Explore & Learn', desc: 'Browse the Knowledge Hub or follow structured DuoKnow learning paths tailored to your department and role.' },
  { n: '02', title: 'Contribute Knowledge', desc: 'Use SIX Note to upload articles, documentation, or meeting insights. Our AI verifies sources and removes duplicates.' },
  { n: '03', title: 'Test & Earn', desc: 'Play Know Game to reinforce learning. Climb the Leaderboard, earn XP, and collect achievement badges.' },
]

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how' },
  { label: 'Stats', href: '#stats' },
  { label: 'SIX Note', href: '/sixnote' },
]

const headerNavLinks = navLinks.filter(link => link.label !== 'SIX Note')

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hubModal, setHubModal] = useState(false)
  const [expandedHubCards, setExpandedHubCards] = useState<string[]>([])
  const [introComplete, setIntroComplete] = useState(false)
  const handleIntroComplete = useCallback(() => setIntroComplete(true), [])

  return (
    <>
      {/* ── INTRO ANIMATION ─────────────────────────────────── */}
      <IntroAnimation onComplete={handleIntroComplete} />

    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        opacity: introComplete ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
      className="min-h-screen bg-white dark:bg-black text-[#1A1A1A] dark:text-white"
    >

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-[#E8E8E8] dark:border-[#1f1f1f]" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/six-logo.png" alt="SIX" width={52} height={26} priority style={{ filter: 'brightness(0) saturate(100%) invert(19%) sepia(100%) saturate(5000%) hue-rotate(353deg) brightness(85%)' }} />
            <Image
              src="/sense-logo.png"
              alt="SENSE"
              width={52}
              height={26}
              priority
              style={{ filter: 'brightness(0) saturate(100%) invert(19%) sepia(100%) saturate(5000%) hue-rotate(353deg) brightness(85%)' }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {headerNavLinks.map(l => (
              <a
                key={l.label}
                href={l.href}
                style={{ fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}
                className="text-gray-500 dark:text-gray-400 hover:text-[#D92525] dark:hover:text-[#D92525] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Mobile burger */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menu"
            >
              <ChevronDown size={20} style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#E8E8E8] dark:border-[#1f1f1f] bg-white dark:bg-black px-6 py-4 space-y-3">
            {headerNavLinks.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', fontWeight: 700, textDecoration: 'none' }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 520 }}>

        {/* Spline full-bleed background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <SplineHero height={520} />
        </div>

        {/* Gradient veil – bg colour on the left so text stays readable */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(to right, var(--lp-bg) 38%, transparent 72%)',
          }}
        />

        {/* Text overlay – left-anchored */}
        <div className="relative h-full flex flex-col justify-center pl-8 lg:pl-16 xl:pl-24" style={{ zIndex: 2 }}>
          <div style={{ maxWidth: 520 }}>

            <h1
              style={{
                fontWeight: 700,
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--lp-text)',
              }}
              className="mb-6"
            >
              Your organisation's knowledge,<br />
              <span style={{ color: '#D92525' }}>always at your fingertips.</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={() => setHubModal(true)}
                style={{
                  fontWeight: 700, fontSize: '1rem',
                  background: '#D92525', color: '#fff',
                  padding: '0.875rem 2rem', borderRadius: '10px',
                  border: 'none', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 0 #A01B10',
                }}
                className="hover:brightness-110 transition-all active:translate-y-1"
              >
                Launch the Hub <ArrowRight size={16} />
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-5">
              {[
                'SME-verified content',
                'Full source attribution',
                'AI-grounded answers',
                'Zero hallucinations',
              ].map(t => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 text-black dark:text-white"
                  style={{ fontSize: '0.85rem', fontWeight: 700 }}
                >
                  <CheckCircle size={14} style={{ color: '#D92525', flexShrink: 0 }} />
                  {t}
                </span>
              ))}
            </div>

          </div>
        </div>

      </section>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <section id="stats" style={{ background: 'var(--lp-bg-2)', borderTop: '1px solid var(--lp-border)', borderBottom: '1px solid var(--lp-border)', position: 'relative', zIndex: 10, marginTop: '-80px', paddingTop: '80px' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div style={{ background: '#FDF0F0', borderRadius: '10px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <Icon size={20} style={{ color: '#D92525' }} />
              </div>
              <p style={{ fontWeight: 700, fontSize: '2rem', color: 'var(--lp-text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
              <p style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--lp-text-faint)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p style={{ fontWeight: 700, fontSize: '0.75rem', color: '#D92525', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>CAPABILITIES</p>
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.025em', color: 'var(--lp-text)', lineHeight: 1.2 }}>
            Five tools. One platform.
          </h2>
          <p style={{ color: 'var(--lp-text-muted)', fontSize: '1.0625rem', marginTop: '12px', fontWeight: 400 }}>
            Open Launch the Hub to pick your tool.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setHubModal(true)}
            style={{
              fontWeight: 700, fontSize: '0.95rem',
              background: '#D92525', color: '#fff',
              padding: '0.75rem 1.5rem', borderRadius: '10px',
              border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 3px 0 #A01B10'
            }}
            className="hover:brightness-110 transition-all"
          >
            Launch the Hub <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how" style={{ background: 'var(--lp-bg-2)', borderTop: '1px solid var(--lp-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p style={{ fontWeight: 700, fontSize: '0.75rem', color: '#D92525', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>WORKFLOW</p>
            <h2 style={{ fontWeight: 700, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.025em', color: 'var(--lp-text)', lineHeight: 1.2 }}>
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ n, title, desc }) => (
              <div key={n} style={{ background: 'var(--lp-card)', border: '1.5px solid var(--lp-border)', borderRadius: '16px', padding: '32px' }}>
                <p style={{ fontWeight: 700, fontSize: '2.5rem', color: 'var(--lp-step-n)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '16px' }}>{n}</p>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--lp-text)', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: 'var(--lp-text-muted)', fontSize: '0.9rem', lineHeight: 1.65, fontWeight: 400 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section style={{ background: '#D92525' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 style={{ fontWeight: 700, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#fff', letterSpacing: '-0.025em', marginBottom: '16px' }}>
            Ready to start learning?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.0625rem', marginBottom: '32px', fontWeight: 400 }}>
            Join 86 colleagues already building SIX's institutional knowledge base.
          </p>
          <button
            onClick={() => setHubModal(true)}
            style={{
              fontWeight: 700, fontSize: '1rem',
              background: '#fff', color: '#D92525',
              padding: '0.875rem 2.25rem', borderRadius: '10px',
              border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 0 rgba(0,0,0,0.15)'
            }}
            className="hover:brightness-95 transition-all"
          >
            Launch the Hub <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--lp-border)', background: 'var(--lp-bg)' }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/six-logo.png" alt="SIX" width={40} height={20} style={{ filter: 'brightness(0) saturate(100%) invert(19%) sepia(100%) saturate(5000%) hue-rotate(353deg) brightness(85%)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--lp-text-faint)' }}>Knowledge Hub · Internal Platform</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--lp-text-dim)', fontWeight: 400 }}>
            © {new Date().getFullYear()} SIX Group AG. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--lp-text-faint)', textDecoration: 'none' }}
                className="hover:text-[#D92525] transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>

      {/* ── ENTRY MODAL ────────────────────────────────────────── */}
      {hubModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          style={{ background: 'rgba(10,10,10,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setHubModal(false)}
        >
          <div
            style={{
              background: 'var(--lp-card)', borderRadius: '18px', width: '100%', maxWidth: '980px',
              border: '1px solid var(--lp-border)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.18)', overflow: 'auto', maxHeight: 'min(88vh, 700px)',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ padding: '24px 28px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.7rem', color: '#D92525', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>WHERE DO YOU WANT TO GO?</p>
                <h2 style={{ fontWeight: 700, fontSize: '1.35rem', color: 'var(--lp-text)', letterSpacing: '-0.025em', lineHeight: 1.15 }}>Launch the Hub</h2>
                <p style={{ color: 'var(--lp-text-faint)', fontSize: '0.8125rem', marginTop: '6px', fontWeight: 400 }}>Five tools, one platform. Hover on desktop to preview each entry point.</p>
              </div>
              <button
                onClick={() => setHubModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', fontSize: '1.25rem', lineHeight: 1, padding: '4px', marginTop: '-4px' }}
                className="hover:text-[#1A1A1A] dark:hover:text-white dark:text-white transition-colors"
              >✕</button>
            </div>

            <div style={{ padding: '20px 28px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {features.map(({ icon: Icon, title, tag, color, bg, desc, href }) => {
                  const isExpanded = expandedHubCards.includes(title)
                  return (
                    <div
                      key={title}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setExpandedHubCards(prev =>
                          prev.includes(title)
                            ? prev.filter(card => card !== title)
                            : [...prev, title]
                        )
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setExpandedHubCards(prev =>
                            prev.includes(title)
                              ? prev.filter(card => card !== title)
                              : [...prev, title]
                          )
                        }
                      }}
                      style={{
                        flex: isExpanded ? '1 1 260px' : '0 0 68px',
                        minWidth: isExpanded ? '260px' : '68px',
                        maxWidth: isExpanded ? '100%' : '68px',
                        cursor: 'pointer',
                        transition: 'flex 0.35s cubic-bezier(0.22, 1, 0.36, 1), min-width 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                      aria-expanded={isExpanded}
                      aria-label={`${title} ${isExpanded ? 'expanded' : 'collapsed'}`}
                    >
                      <div
                        style={{
                          background: isExpanded ? 'var(--lp-card)' : 'transparent',
                          border: isExpanded ? '1.5px solid var(--lp-border)' : '1.5px solid transparent',
                          borderRadius: '16px',
                          minHeight: isExpanded ? '210px' : '68px',
                          height: '100%',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                          boxShadow: isExpanded ? '0 10px 36px rgba(0, 0, 0, 0.14)' : 'none',
                          borderColor: isExpanded ? 'rgba(217, 37, 37, 0.3)' : 'transparent',
                        }}
                      >
                        {!isExpanded && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <div style={{ background: bg, borderRadius: '10px', width: '33px', height: '33px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Icon size={22} style={{ color }} />
                            </div>
                          </div>
                        )}

                        {isExpanded && (
                          <div style={{ padding: '22px 18px', minHeight: '210px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ background: bg, borderRadius: '10px', width: '33px', height: '33px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', flexShrink: 0 }}>
                              <Icon size={22} style={{ color }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--lp-text)', whiteSpace: 'nowrap' }}>{title}</h3>
                              <span style={{ fontWeight: 700, fontSize: '0.65rem', color, background: bg, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{tag}</span>
                            </div>
                            <p style={{ color: 'var(--lp-text-muted)', fontSize: '0.875rem', lineHeight: 1.65, fontWeight: 400, flex: 1 }}>{desc}</p>
                            <Link
                              href={href}
                              onClick={e => {
                                e.stopPropagation()
                                setHubModal(false)
                              }}
                              style={{ marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.78rem', color: '#D92525', textDecoration: 'none' }}
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
