'use client'
import { Suspense } from 'react'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Zap, Clock, CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react'

const allQuestions = [
  {
    id: 1,
    category: 'Legal & Compliance',
    question: "What is the primary regulation governing SIX Group's data reporting obligations in Switzerland?",
    options: ['MiFID II', 'FINMA Circular 2013/3', 'Basel III Framework', 'GDPR Article 30'],
    correct: 1,
    explanation: 'FINMA Circular 2013/3 governs market conduct and reporting obligations for SIX-listed entities in Switzerland.',
    source: 'Regulatory Reporting Framework Q4 — Jacob Gertel',
  },
  {
    id: 2,
    category: 'Customer Service',
    question: 'What is the maximum escalation response time defined in the Customer SOP for Tier-1 incidents?',
    options: ['15 minutes', '30 minutes', '1 hour', '4 hours'],
    correct: 0,
    explanation: 'Tier-1 incidents must be escalated and acknowledged within 15 minutes per the Customer Escalation Handling SOP.',
    source: 'Customer Escalation Handling SOP — Mirko Silvestri',
  },
  {
    id: 3,
    category: 'Real-Time Services',
    question: 'Which protocol is used as the primary data feed standard for SIX real-time market data distribution?',
    options: ['REST over HTTPS', 'FIX Protocol 5.0', 'ITCH/OUCH', 'WebSocket JSON'],
    correct: 2,
    explanation: 'SIX uses the ITCH/OUCH protocol for ultra-low-latency real-time market data feeds.',
    source: 'Real-Time Data Feed Architecture — Katharina Voegtle',
  },
  {
    id: 4,
    category: 'Data Governance',
    question: 'According to SIX data classification policy, what category covers client trade records?',
    options: ['Internal Use Only', 'Confidential', 'Restricted', 'Public'],
    correct: 2,
    explanation: 'Client trade records are classified as "Restricted" — the highest sensitivity tier in SIX data governance policy.',
    source: 'Data Classification Policy — Jennifer Chang',
  },
  {
    id: 5,
    category: 'Innovation Hub',
    question: 'What methodology does SIX use for structured knowledge capture from subject matter experts?',
    options: ['Agile Sprint Review', 'SME Interview Protocol', 'RACI Matrix Mapping', 'OKR Documentation'],
    correct: 1,
    explanation: 'The SME Interview Protocol ensures tacit knowledge is captured systematically and attributed correctly.',
    source: 'SME Knowledge Capture Process — Jennifer Chang',
  },
  {
    id: 6,
    category: 'Legal & Compliance',
    question: 'Trade settlement fails under SIX rules must be reported within how many business days?',
    options: ['Same day', 'T+1', 'T+2', 'T+3'],
    correct: 1,
    explanation: 'SIX requires failed trade settlements to be reported by T+1 to the relevant compliance desk.',
    source: 'Settlement Compliance Manual — Jacob Gertel',
  },
  {
    id: 7,
    category: 'Customer Service',
    question: 'What is the Net Promoter Score target defined in the Customer Excellence Framework for 2025?',
    options: ['+40', '+55', '+65', '+80'],
    correct: 2,
    explanation: 'The 2025 Customer Excellence Framework targets an NPS of +65, up from +58 in 2024.',
    source: 'Customer Excellence Framework — Mirko Silvestri',
  },
  {
    id: 8,
    category: 'Real-Time Services',
    question: 'What is the SLA uptime requirement for SIX core market data infrastructure?',
    options: ['99.5%', '99.9%', '99.95%', '99.99%'],
    correct: 3,
    explanation: 'SIX core market data infrastructure carries a 99.99% uptime SLA ("four nines" availability).',
    source: 'Infrastructure SLA Documentation — Katharina Voegtle',
  },
  {
    id: 9,
    category: 'Data Governance',
    question: 'Under GDPR, what is the maximum time SIX has to notify FINMA of a personal data breach?',
    options: ['24 hours', '48 hours', '72 hours', '7 days'],
    correct: 2,
    explanation: 'GDPR Article 33 mandates breach notification to supervisory authorities within 72 hours of discovery.',
    source: 'GDPR Incident Response Policy — Jennifer Chang',
  },
  {
    id: 10,
    category: 'Innovation Hub',
    question: 'Which AI capability does the SIX Knowledge Hub prioritize for knowledge extraction from legacy documents?',
    options: ['Sentiment Analysis', 'RAG (Retrieval Augmented Generation)', 'Image Recognition', 'Time-series Forecasting'],
    correct: 1,
    explanation: 'RAG enables the knowledge hub to ground AI answers in verified source documents rather than hallucinating.',
    source: 'AI Knowledge Strategy — Magdalena Tuta',
  },
  {
    id: 11,
    category: 'Legal & Compliance',
    question: 'Which Swiss act governs conduct rules for financial service providers including information duties and suitability?',
    options: ['FINMASA', 'FMIA', 'FinSA', 'AMLA'],
    correct: 2,
    explanation: 'The Financial Services Act (FinSA) governs conduct rules including information duties, suitability checks, and documentation for financial service providers.',
    source: 'Swiss Financial Services Regulation — Jacob Gertel',
  },
  {
    id: 12,
    category: 'Data Governance',
    question: 'In SIX data governance, who is the primary accountable owner of a data domain?',
    options: ['Data Steward', 'Data Owner', 'Chief Data Officer', 'IT System Owner'],
    correct: 1,
    explanation: 'The Data Owner holds business accountability for the data domain, while the Data Steward handles day-to-day management.',
    source: 'Data Governance Framework — Jennifer Chang',
  },
  {
    id: 13,
    category: 'Customer Service',
    question: "What is the first step in SIX's structured customer complaint resolution process?",
    options: ['Escalate to management', 'Log and acknowledge within 2 business hours', 'Issue a formal written response', 'Transfer to legal team'],
    correct: 1,
    explanation: 'All customer complaints must be logged in the CRM and acknowledged to the client within 2 business hours per SIX service standards.',
    source: 'Customer Complaint Handling Procedure — Mirko Silvestri',
  },
  {
    id: 14,
    category: 'Real-Time Services',
    question: 'What is the maximum permitted latency for SIX Level 1 market data under the standard SLA?',
    options: ['1 millisecond', '10 milliseconds', '100 milliseconds', '500 milliseconds'],
    correct: 1,
    explanation: 'SIX Level 1 market data carries a maximum latency SLA of 10 milliseconds under normal operating conditions.',
    source: 'Market Data SLA Specification — Katharina Voegtle',
  },
  {
    id: 15,
    category: 'Innovation Hub',
    question: 'What is the primary purpose of the SIX Knowledge Graph initiative?',
    options: [
      'Replace the existing document management system',
      'Map relationships between experts, knowledge and business processes',
      'Automate compliance reporting',
      'Build a customer-facing FAQ portal',
    ],
    correct: 1,
    explanation: 'The Knowledge Graph maps relationships between SMEs, knowledge assets, and business processes to surface hidden expertise and enable smarter search.',
    source: 'Knowledge Graph Strategy — Magdalena Tuta',
  },
  {
    id: 16,
    category: 'Legal & Compliance',
    question: 'Under FMIA, which entities must be authorized and registered with FINMA as financial market infrastructure?',
    options: [
      'Any firm with more than CHF 100M in OTC derivatives',
      'Only SIX Exchange itself',
      'Central counterparties and trading venues',
      'All firms that report derivatives transactions',
    ],
    correct: 2,
    explanation: 'Under FMIA, central counterparties (CCPs), trading venues, and payment systems must be authorized and registered with FINMA.',
    source: 'FMIA Registration Requirements — Jacob Gertel',
  },
  {
    id: 17,
    category: 'Customer Service',
    question: "How many escalation tiers exist in SIX's incident management framework?",
    options: ['2', '3', '4', '5'],
    correct: 2,
    explanation: 'SIX uses a 4-tier escalation framework: Tier 1 (front-line), Tier 2 (team lead), Tier 3 (management), Tier 4 (executive/crisis).',
    source: 'Incident Management Framework — Katharina Voegtle',
  },
  {
    id: 18,
    category: 'Data Governance',
    question: 'What does the SIX Data Quality Index (DQI) measure?',
    options: [
      'Speed of data ingestion pipelines',
      'Completeness, accuracy, timeliness and consistency of data assets',
      'Number of active data users per department',
      'Security patch compliance rate',
    ],
    correct: 1,
    explanation: 'The DQI aggregates four dimensions — completeness, accuracy, timeliness, and consistency — into a single score for each data asset.',
    source: 'Data Quality Framework — Jennifer Chang',
  },
  {
    id: 19,
    category: 'Innovation Hub',
    question: 'What is the required review step before deploying a high-risk AI model at SIX?',
    options: [
      'Manager sign-off only',
      'Ethics & AI Risk Committee approval',
      'FINMA pre-clearance',
      'Legal department review alone',
    ],
    correct: 1,
    explanation: 'High-risk AI models require approval from the Ethics & AI Risk Committee before deployment.',
    source: 'AI Governance Policy — Magdalena Tuta',
  },
  {
    id: 20,
    category: 'Real-Time Services',
    question: 'Which redundancy model does SIX employ for its core trading infrastructure?',
    options: [
      'Active-Passive (cold standby)',
      'Active-Active with geographic distribution',
      'Single-site with nightly backup',
      'Cloud-only with auto-scaling',
    ],
    correct: 1,
    explanation: 'SIX runs an Active-Active model with geographically distributed data centres, ensuring zero failover time and continuous operation.',
    source: 'Trading Infrastructure Architecture — Mirko Silvestri',
  },
  {
    id: 21,
    category: 'Legal & Compliance',
    question: 'How frequently must SIX conduct its mandatory Anti-Money Laundering (AML) risk assessment under Swiss law?',
    options: ['Monthly', 'Quarterly', 'Annually', 'Every 3 years'],
    correct: 2,
    explanation: 'Swiss AMLA regulations require a comprehensive AML risk assessment to be conducted and documented at least annually.',
    source: 'AML Compliance Manual — Jacob Gertel',
  },
  {
    id: 22,
    category: 'Customer Service',
    question: 'What metric tracks the efficiency of first-contact resolution in SIX customer service?',
    options: ['CSAT Score', 'FCR Rate', 'TTR (Time to Resolve)', 'AHT (Average Handle Time)'],
    correct: 1,
    explanation: 'FCR (First Contact Resolution) Rate measures the percentage of customer issues fully resolved during the first interaction.',
    source: 'Service Performance Dashboard — Mirko Silvestri',
  },
  {
    id: 23,
    category: 'Data Governance',
    question: 'Which committee at SIX is responsible for approving changes to the enterprise data model?',
    options: [
      'IT Architecture Board',
      'Data Governance Council',
      'Product Management Committee',
      'Risk & Compliance Board',
    ],
    correct: 1,
    explanation: 'The Data Governance Council, chaired by the CDO, is the approval authority for all enterprise data model changes.',
    source: 'Data Governance Council Charter — Jennifer Chang',
  },
  {
    id: 24,
    category: 'Real-Time Services',
    question: 'What is the purpose of the SIX Connectivity Hub?',
    options: [
      'Hosting internal employee communication tools',
      'Providing standardized API access to market data and post-trade services',
      'Managing cloud infrastructure for SIX products',
      'Routing regulatory reporting files to FINMA',
    ],
    correct: 1,
    explanation: 'The SIX Connectivity Hub offers standardized REST and FIX API access to market data, reference data, and post-trade services for clients.',
    source: 'Connectivity Hub Product Guide — Katharina Voegtle',
  },
  {
    id: 25,
    category: 'Innovation Hub',
    question: 'What framework does SIX use to prioritize innovation initiatives in the knowledge management space?',
    options: ['RICE Scoring', 'OKR + Impact/Effort Matrix', 'MoSCoW Method', 'Weighted Shortest Job First (WSJF)'],
    correct: 1,
    explanation: 'SIX combines OKR alignment with an Impact/Effort Matrix to ensure innovation initiatives deliver maximum value relative to complexity.',
    source: 'Innovation Portfolio Management — Magdalena Tuta',
  },
]

const modeConfigs = {
  quick:     { title: 'Quick Fire',       total: 10, time: 20, lives: 3, showHints: true,  emoji: '⚡', xpMax: 150, desc: '10 questions · 20s per question · 3 lives' },
  deep:      { title: 'Deep Dive',        total: 25, time: 30, lives: 3, showHints: true,  emoji: '🎯', xpMax: 400, desc: '25 questions · 30s per question · 3 lives' },
  challenge: { title: 'Weekly Challenge', total: 10, time: 20, lives: 3, showHints: true,  emoji: '🏆', xpMax: 300, desc: '10 questions · competitive · all departments' },
  expert:    { title: 'Expert Mode',      total: 10, time: 15, lives: 1, showHints: false, emoji: '🔥', xpMax: 500, desc: '10 questions · 15s per question · 1 life · no hints' },
} as const

type ModeKey = keyof typeof modeConfigs
type Phase = 'intro' | 'playing' | 'results'

function GamePlayContent() {
  const searchParams = useSearchParams()
  const modeKey = (searchParams.get('mode') ?? 'quick') as ModeKey
  const cfg = modeConfigs[modeKey] ?? modeConfigs.quick
  const gameQuestions = allQuestions.slice(0, cfg.total)

  const [phase, setPhase] = useState<Phase>('intro')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [lives, setLives] = useState(cfg.lives)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(cfg.time)
  const [results, setResults] = useState<{ correct: boolean; chosen: number | null }[]>([])
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const q = gameQuestions[current]
  const xpEarned = Math.round((score / cfg.total) * cfg.xpMax + bestStreak * 10)

  const handleAnswer = useCallback((idx: number) => {
    if (answered || !q) return
    setSelected(idx)
    setAnswered(true)
    const correct = idx === q.correct
    setResults(r => [...r, { correct, chosen: idx }])
    if (correct) {
      setScore(s => s + 1)
      setStreak(s => {
        const next = s + 1
        setBestStreak(b => Math.max(b, next))
        return next
      })
    } else {
      setStreak(0)
      setLives(l => l - 1)
    }
  }, [answered, q])

  const handleNext = useCallback(() => {
    const livesAfter = selected !== null && q && selected !== q.correct ? lives - 1 : lives
    if (current + 1 >= cfg.total || livesAfter <= 0) {
      setPhase('results')
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
      setTimeLeft(cfg.time)
    }
  }, [current, lives, selected, q, cfg.total, cfg.time])

  const handleRestart = useCallback(() => {
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setLives(cfg.lives)
    setScore(0)
    setTimeLeft(cfg.time)
    setResults([])
    setStreak(0)
    setBestStreak(0)
    setPhase('intro')
  }, [cfg.lives, cfg.time])

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || answered) return
    if (timeLeft <= 0) { handleAnswer(-1); return }
    const t = setTimeout(() => setTimeLeft(tt => tt - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, answered, timeLeft, handleAnswer])

  const pct = Math.round((score / cfg.total) * 100)
  const grade = pct >= 90 ? { label: 'Outstanding!', color: 'text-six-gold', emoji: '🏆' }
    : pct >= 75 ? { label: 'Excellent!', color: 'text-duo-green', emoji: '🎉' }
    : pct >= 60 ? { label: 'Good Job!', color: 'text-duo-blue', emoji: '👍' }
    : { label: 'Keep Practicing', color: 'text-duo-orange', emoji: '💪' }

  /* ── INTRO ── */
  if (phase === 'intro') return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/game" className="flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] text-sm mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Know Game
      </Link>
      <div className="six-card p-10 text-center bg-gradient-to-br from-duo-green/20 to-duo-blue/10 border border-duo-green/30">
        <div className="text-6xl mb-4">{cfg.emoji}</div>
        <h1 className="text-4xl font-black text-[#1A1A1A] mb-2">{cfg.title}</h1>
        <p className="text-gray-500 mb-8">{cfg.desc}</p>
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: cfg.lives === 1 ? '💀' : '❤️', label: `${cfg.lives} ${cfg.lives === 1 ? 'Life' : 'Lives'}` },
            { icon: '⏱️', label: `${cfg.time}s Timer` },
            { icon: '⚡', label: `Up to ${cfg.xpMax} XP` },
          ].map(s => (
            <div key={s.label} className="six-card p-4">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-sm text-gray-600 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
        {!cfg.showHints && (
          <div className="mb-6 p-3 rounded-xl bg-duo-red/10 border border-duo-red/20 text-duo-red text-sm font-semibold">
            ⚠️ Expert Mode: No hints. Only the correct answer is revealed after each question.
          </div>
        )}
        <button
          onClick={() => setPhase('playing')}
          className="w-full py-5 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-black text-xl
            shadow-[0_6px_0_#46A302] hover:shadow-[0_3px_0_#46A302] hover:translate-y-[3px] transition-all"
        >
          🚀 Start Quiz
        </button>
      </div>
    </div>
  )

  /* ── RESULTS ── */
  if (phase === 'results') return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="six-card p-10 text-center bg-gradient-to-br from-six-gold/15 to-duo-green/10 border border-six-gold/30">
        <div className="text-6xl mb-3">{grade.emoji}</div>
        <h1 className={`text-4xl font-black ${grade.color} mb-1`}>{grade.label}</h1>
        <p className="text-gray-500 mb-8">{score}/{cfg.total} correct answers</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="six-card p-4">
            <p className="text-3xl font-black text-[#1A1A1A]">{pct}%</p>
            <p className="text-xs text-gray-500 mt-1">Accuracy</p>
          </div>
          <div className="six-card p-4">
            <p className="text-3xl font-black text-duo-green">+{xpEarned}</p>
            <p className="text-xs text-gray-500 mt-1">XP Earned</p>
          </div>
          <div className="six-card p-4">
            <p className="text-3xl font-black text-duo-orange">{bestStreak}🔥</p>
            <p className="text-xs text-gray-500 mt-1">Best Streak</p>
          </div>
        </div>

        <div className="text-left space-y-2 mb-8 max-h-64 overflow-y-auto pr-1">
          {results.map((r, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${r.correct ? 'bg-duo-green/10 border border-duo-green/20' : 'bg-duo-red/10 border border-duo-red/20'}`}>
              {r.correct ? <CheckCircle size={16} className="text-duo-green shrink-0" /> : <XCircle size={16} className="text-duo-red shrink-0" />}
              <p className="text-sm text-gray-600 flex-1 line-clamp-1">{gameQuestions[i]?.question}</p>
              {!r.correct && <p className="text-xs text-duo-green shrink-0">{gameQuestions[i]?.options[gameQuestions[i]?.correct]}</p>}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="flex-1 py-4 rounded-2xl bg-[#F0F0F5] hover:bg-[#E8E8F0] text-gray-700 font-bold transition-all"
          >
            Play Again
          </button>
          <Link
            href="/leaderboard"
            className="flex-1 py-4 rounded-2xl bg-six-gold hover:brightness-110 text-white font-black text-center flex items-center justify-center gap-2 transition-all"
          >
            <Trophy size={18} /> Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )

  /* ── PLAYING ── */
  const timerPct = (timeLeft / cfg.time) * 100
  const timerColor = timerPct > 50 ? 'bg-duo-green' : timerPct > 25 ? 'bg-duo-orange' : 'bg-duo-red'

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/game" className="flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] text-sm transition-colors">
          <ArrowLeft size={16} /> Exit
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {Array.from({ length: cfg.lives }).map((_, i) => (
              <span key={i} className={`text-xl transition-all ${i < lives ? 'opacity-100' : 'opacity-20'}`}>
                {cfg.lives === 1 ? '💀' : '❤️'}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 xp-badge">
            <Zap size={12} /> {score * 15} pts
          </div>
          {streak >= 2 && (
            <div className="streak-badge text-xs">🔥 {streak} streak</div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2 flex items-center gap-3">
        <div className="flex-1 h-2 bg-[#E8E8F0] dark:bg-[#2a2a2a] rounded-full overflow-hidden">
          <div className="h-full bg-duo-green rounded-full transition-all" style={{ width: `${(current / cfg.total) * 100}%` }} />
        </div>
        <span className="text-xs text-gray-500">{current}/{cfg.total}</span>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Clock size={12} className={timerPct <= 25 ? 'text-duo-red animate-bounce' : 'text-gray-500'} />
          <span className={`text-xs font-bold ${timerPct <= 25 ? 'text-duo-red' : 'text-gray-500'}`}>{timeLeft}s</span>
        </div>
        <div className="h-1.5 bg-[#E8E8F0] dark:bg-[#2a2a2a] rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${timerPct}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="six-card p-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-duo-blue/20 text-duo-blue">
            {q.category}
          </span>
          <span className="text-xs text-gray-600">Question {current + 1} of {cfg.total}</span>
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] leading-relaxed">{q.question}</h2>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {q.options.map((opt, idx) => {
          let style = 'bg-[#F5F5F7] dark:bg-[#111] border-[#E8E8F0] dark:border-[#2a2a2a] text-[#1A1A1A] dark:text-white hover:border-duo-blue/50 hover:bg-[#EDF2FF]'
          if (answered) {
            if (idx === q.correct) style = 'bg-duo-green/20 border-duo-green text-duo-green'
            else if (idx === selected) style = 'bg-duo-red/20 border-duo-red text-duo-red'
            else style = 'bg-[#F5F5F7] dark:bg-[#111] border-[#E8E8F0] dark:border-[#2a2a2a] text-gray-500 opacity-50'
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={answered}
              className={`w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all ${style}
                ${!answered ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}
            >
              <span className="inline-flex w-7 h-7 rounded-lg bg-black/10 items-center justify-center text-sm mr-3 font-black">
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
              {answered && idx === q.correct && <CheckCircle size={16} className="inline ml-2 text-duo-green" />}
              {answered && idx === selected && idx !== q.correct && <XCircle size={16} className="inline ml-2 text-duo-red" />}
            </button>
          )
        })}
      </div>

      {/* Post-answer feedback + Next */}
      {answered && (
        <div className="space-y-3">
          {cfg.showHints ? (
            <div className={`p-4 rounded-2xl border ${selected === q.correct ? 'bg-duo-green/10 border-duo-green/30' : 'bg-duo-red/10 border-duo-red/30'}`}>
              <p className={`text-sm font-bold mb-1 ${selected === q.correct ? 'text-duo-green' : 'text-duo-red'}`}>
                {selected === q.correct ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">{q.explanation}</p>
              <p className="text-xs text-gray-500 mt-2">Source: {q.source}</p>
            </div>
          ) : (
            <div className={`p-3 rounded-2xl border text-center ${selected === q.correct ? 'bg-duo-green/10 border-duo-green/30' : 'bg-duo-red/10 border-duo-red/30'}`}>
              <p className={`text-sm font-bold ${selected === q.correct ? 'text-duo-green' : 'text-duo-red'}`}>
                {selected === q.correct ? '✓ Correct!' : `✗ Incorrect — Correct answer: ${q.options[q.correct]}`}
              </p>
            </div>
          )}
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-black text-lg
              shadow-[0_4px_0_#46A302] hover:shadow-[0_2px_0_#46A302] hover:translate-y-[2px] transition-all
              flex items-center justify-center gap-2"
          >
            {current + 1 >= cfg.total ? 'See Results' : 'Next Question'} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

export default function GamePlayPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading game...</div>}>
      <GamePlayContent />
    </Suspense>
  )
}