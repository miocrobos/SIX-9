'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  BookOpen, Trophy, Zap, Gamepad2, StickyNote,
  Upload, MessageCircle, ArrowRight, CheckCircle,
  BarChart3, Shield, Users, Star, ChevronDown
} from 'lucide-react'
import BranchSelector from '@/components/BranchSelector'
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

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hubModal, setHubModal] = useState(false)
  const [introComplete, setIntroComplete] = useState(false)
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  const toggleFeature = (key: string) =>
    setExpandedFeature(prev => (prev === key ? null : key))

  return (
    <>
      {/* ── INTRO ANIMATION ─────────────────────────────────── */}
      <IntroAnimation onComplete={() => setIntroComplete(true)} />

    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        opacity: introComplete ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
      className="min-h-screen bg-white dark:bg-black text-[#1A1A1A] dark:text-[#D92525]"
    >

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-[#E8E8E8] dark:border-[#1f1f1f]" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/six-logo.png" alt="SIX" width={52} height={26} priority style={{ filter: 'brightness(0) saturate(100%) invert(19%) sepia(100%) saturate(5000%) hue-rotate(353deg) brightness(85%)' }} />
            <span className="font-bold text-[#1A1A1A] dark:text-[#D92525]" style={{ fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
              Knowledge Hub
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
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
            <BranchSelector />
            <ThemeToggle />
            <button
              onClick={() => setHubModal(true)}
              style={{
                fontWeight: 700, fontSize: '0.875rem',
                background: '#D92525', color: '#fff',
                padding: '0.5rem 1.25rem', borderRadius: '8px',
                border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 2px 0 #A01B10'
              }}
              className="hover:brightness-110 transition-all"
            >
              Enter Hub <ArrowRight size={14} />
            </button>
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
            {navLinks.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', fontWeight: 700, color: '#333', textDecoration: 'none' }}>
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
              <a
                href="#features"
                style={{
                  fontWeight: 700, fontSize: '1rem', color: 'var(--lp-text)',
                  padding: '0.875rem 2rem', borderRadius: '10px',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                  border: '2px solid var(--lp-border)',
                }}
                className="hover:border-[#D92525] hover:text-[#D92525] transition-all"
              >
                See Features <ChevronDown size={16} />
              </a>
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
              <div style={{ background: '#FDF0F0', borderRadius: '12px', padding: '10px', marginBottom: '10px' }}>
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
            Everything your organisation needs to capture, share, and master institutional knowledge.
          </p>
        </div>

        <div className="feature-row">
          {features.map(({ icon: Icon, title, tag, color, bg, desc, href }) => {
            const isExp = expandedFeature === title
            return (
              <div
                key={title}
                className={`feature-card-wrapper${isExp ? ' is-expanded' : ''}`}
                onClick={() => toggleFeature(title)}
              >
                <div
                  className="feature-card-inner"
                  style={{
                    background: 'var(--lp-card)',
                    border: '1.5px solid var(--lp-border)',
                    borderRadius: '16px',
                    position: 'relative',
                    height: '100%',
                    minHeight: '72px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                >
                  {/* Collapsed view — icon only (desktop) */}
                  <div
                    className="feature-collapsed-view"
                    style={{
                      position: 'absolute', inset: 0,
                      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <div style={{ background: bg, borderRadius: '12px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                  </div>

                  {/* Expanded view — full card content */}
                  <div
                    className="feature-expanded-view"
                    style={{ padding: '24px 20px', minHeight: '220px', display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ background: bg, borderRadius: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', flexShrink: 0 }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--lp-text)', whiteSpace: 'nowrap' }}>{title}</h3>
                      <span style={{ fontWeight: 700, fontSize: '0.65rem', color, background: bg, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{tag}</span>
                    </div>
                    <p style={{ color: 'var(--lp-text-muted)', fontSize: '0.875rem', lineHeight: 1.65, fontWeight: 400, flex: 1 }}>{desc}</p>
                    <Link
                      href={href}
                      onClick={e => e.stopPropagation()}
                      style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.8rem', color: '#D92525', textDecoration: 'none' }}
                    >
                      Explore <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}

          {/* "Enter the Hub" card */}
          <div
            className={`feature-card-wrapper${expandedFeature === 'hub' ? ' is-expanded' : ''}`}
            onClick={() => toggleFeature('hub')}
          >
              <div
                className="feature-card-inner"
                style={{ background: '#D92525', borderRadius: '16px', position: 'relative', height: '100%', minHeight: '72px', overflow: 'hidden' }}
              >
                {/* Collapsed view */}
                <div
                  className="feature-collapsed-view"
                  style={{
                    position: 'absolute', inset: 0,
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Shield size={22} style={{ color: 'rgba(255,255,255,0.85)' }} />
                </div>

                {/* Expanded view */}
                <div
                  className="feature-expanded-view"
                  style={{ padding: '24px 20px', minHeight: '220px', display: 'flex', flexDirection: 'column' }}
                >
                  <Shield size={28} style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '16px', flexShrink: 0 }} />
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>Enter the Hub</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', lineHeight: 1.65, fontWeight: 400, flex: 1 }}>
                    Access your full dashboard — learning paths, game modes, knowledge articles, and your personal stats.
                  </p>
                  <button
                    onClick={e => { e.stopPropagation(); setHubModal(true) }}
                    style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.875rem', color: '#fff', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer' }}
                  >
                    Choose your entry <ArrowRight size={14} />
                  </button>
                </div>
              </div>
          </div>
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: 'rgba(10,10,10,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setHubModal(false)}
        >
          <div
            style={{
              background: 'var(--lp-card)', borderRadius: '20px', width: '100%', maxWidth: '680px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ padding: '28px 32px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.7rem', color: '#D92525', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>WHERE DO YOU WANT TO GO?</p>
                <h2 style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--lp-text)', letterSpacing: '-0.025em', lineHeight: 1.2 }}>Choose your entry point</h2>
                <p style={{ color: 'var(--lp-text-faint)', fontSize: '0.875rem', marginTop: '6px', fontWeight: 400 }}>Two separate tools, one platform.</p>
              </div>
              <button
                onClick={() => setHubModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AAA', fontSize: '1.25rem', lineHeight: 1, padding: '4px', marginTop: '-4px' }}
                className="hover:text-[#1A1A1A] transition-colors"
              >✕</button>
            </div>

            {/* Two choice cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '24px 32px 32px' }}>

              {/* Knowledge Hub */}
              <Link
                href="/dashboard"
                onClick={() => setHubModal(false)}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  style={{
                    border: '2px solid var(--lp-border)', borderRadius: '16px', padding: '24px',
                    cursor: 'pointer', transition: 'all 0.18s', height: '100%'
                  }}
                  className="hover:border-[#D92525] hover:shadow-md group"
                >
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#FDF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Zap size={22} style={{ color: '#D92525' }} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--lp-text)', marginBottom: '6px' }}>Knowledge Hub</h3>
                  <p style={{ color: 'var(--lp-text-faint)', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 400, marginBottom: '16px' }}>
                    Gamified learning paths, quizzes, leaderboards and the knowledge article library. Earn XP and build streaks.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                    {['DuoKnow', 'Know Game', 'Leaderboard', 'Textbook'].map(t => (
                      <span key={t} style={{ fontSize: '0.7rem', fontWeight: 700, background: '#FDF0F0', color: '#D92525', padding: '3px 9px', borderRadius: '20px' }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, fontSize: '0.85rem', color: '#D92525' }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Go to Dashboard <ArrowRight size={13} />
                  </div>
                </div>
              </Link>

              {/* SIX Note */}
              <Link
                href="/sixnote"
                onClick={() => setHubModal(false)}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  style={{
                    border: '2px solid var(--lp-border)', borderRadius: '16px', padding: '24px',
                    cursor: 'pointer', transition: 'all 0.18s', height: '100%'
                  }}
                  className="hover:border-[#CE82FF] hover:shadow-md group"
                >
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#F8F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Upload size={22} style={{ color: '#CE82FF' }} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--lp-text)', marginBottom: '6px' }}>SIX Note</h3>
                  <p style={{ color: 'var(--lp-text-faint)', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 400, marginBottom: '16px' }}>
                    Upload institutional knowledge or ask AI-grounded questions. Every answer cites its source — no hallucinations.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                    {['Upload Docs', 'Ask AI', 'Source Attribution', 'SME Verified'].map(t => (
                      <span key={t} style={{ fontSize: '0.7rem', fontWeight: 700, background: '#F8F0FF', color: '#CE82FF', padding: '3px 9px', borderRadius: '20px' }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, fontSize: '0.85rem', color: '#CE82FF' }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Open SIX Note <ArrowRight size={13} />
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
