'use client'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Heart, Zap, Clock, CheckCircle, XCircle, ArrowRight, Trophy } from 'lucide-react'

const questions = [
  {
    id: 1,
    category: 'Legal & Compliance',
    question: 'What is the primary regulation governing SIX Group\'s data reporting obligations in Switzerland?',
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
]

type Phase = 'intro' | 'playing' | 'review' | 'results'

const TOTAL_QUESTIONS = 10
const QUESTION_TIME = 20

export default function GamePlayPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [results, setResults] = useState<{ correct: boolean; chosen: number | null }[]>([])
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const q = questions[current]
  const xpEarned = Math.round((score / TOTAL_QUESTIONS) * 150 + bestStreak * 10)

  const handleAnswer = useCallback((idx: number) => {
    if (answered) return
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
  }, [answered, q.correct])

  const handleNext = useCallback(() => {
    if (current + 1 >= TOTAL_QUESTIONS || lives <= (selected !== q.correct ? 1 : 0)) {
      setPhase('results')
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
      setTimeLeft(QUESTION_TIME)
    }
  }, [current, lives, selected, q.correct])

  // Timer
  useEffect(() => {
    if (phase !== 'playing' || answered) return
    if (timeLeft <= 0) {
      handleAnswer(-1)
      return
    }
    const t = setTimeout(() => setTimeLeft(tt => tt - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, answered, timeLeft, handleAnswer])

  const pct = Math.round((score / TOTAL_QUESTIONS) * 100)
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
        <div className="text-6xl mb-4">🎮</div>
        <h1 className="text-4xl font-black text-[#1A1A1A] mb-2">Quick Fire</h1>
        <p className="text-gray-500 mb-8">10 questions · {QUESTION_TIME}s per question · 3 lives</p>
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[{ icon: '❤️', label: '3 Lives' }, { icon: '⏱️', label: `${QUESTION_TIME}s Timer` }, { icon: '⚡', label: 'Up to 150 XP' }].map(s => (
            <div key={s.label} className="six-card p-4">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-sm text-gray-600 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
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
        <p className="text-gray-500 mb-8">{score}/{TOTAL_QUESTIONS} correct answers</p>

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

        {/* Per-question results */}
        <div className="text-left space-y-2 mb-8">
          {results.map((r, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${r.correct ? 'bg-duo-green/10 border border-duo-green/20' : 'bg-duo-red/10 border border-duo-red/20'}`}>
              {r.correct ? <CheckCircle size={16} className="text-duo-green shrink-0" /> : <XCircle size={16} className="text-duo-red shrink-0" />}
              <p className="text-sm text-gray-600 flex-1 line-clamp-1">{questions[i].question}</p>
              {!r.correct && <p className="text-xs text-duo-green shrink-0">{questions[i].options[questions[i].correct]}</p>}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setLives(3); setScore(0); setTimeLeft(QUESTION_TIME); setResults([]); setStreak(0); setBestStreak(0); setPhase('intro') }}
            className="flex-1 py-4 rounded-2xl bg-[#F0F0F5] hover:bg-[#E8E8F0] text-gray-700 font-bold transition-all"
          >
            Play Again
          </button>
          <Link href="/leaderboard" className="flex-1 py-4 rounded-2xl bg-six-gold hover:brightness-110 text-white font-black text-center flex items-center justify-center gap-2 transition-all">
            <Trophy size={18} /> Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )

  /* ── PLAYING ── */
  const timerPct = (timeLeft / QUESTION_TIME) * 100
  const timerColor = timeLeft > 10 ? 'bg-duo-green' : timeLeft > 5 ? 'bg-duo-orange' : 'bg-duo-red'

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/game" className="flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] text-sm transition-colors">
          <ArrowLeft size={16} /> Exit
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <span key={i} className={`text-xl transition-all ${i <= lives ? 'opacity-100' : 'opacity-20'}`}>❤️</span>
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

      {/* Progress bar */}
      <div className="mb-2 flex items-center gap-3">
        <div className="flex-1 h-2 bg-[#E8E8F0] dark:bg-[#2a2a2a] rounded-full overflow-hidden">
          <div className="h-full bg-duo-green rounded-full transition-all" style={{ width: `${(current / TOTAL_QUESTIONS) * 100}%` }} />
        </div>
        <span className="text-xs text-gray-500">{current}/{TOTAL_QUESTIONS}</span>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Clock size={12} className={timeLeft <= 5 ? 'text-duo-red animate-bounce' : 'text-gray-500'} />
          <span className={`text-xs font-bold ${timeLeft <= 5 ? 'text-duo-red' : 'text-gray-500'}`}>{timeLeft}s</span>
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
          <span className="text-xs text-gray-600">Question {current + 1} of {TOTAL_QUESTIONS}</span>
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

      {/* Post-answer explanation + Next */}
      {answered && (
        <div className="space-y-3">
          <div className={`p-4 rounded-2xl border ${selected === q.correct ? 'bg-duo-green/10 border-duo-green/30' : 'bg-duo-red/10 border-duo-red/30'}`}>
            <p className={`text-sm font-bold mb-1 ${selected === q.correct ? 'text-duo-green' : 'text-duo-red'}`}>
              {selected === q.correct ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">{q.explanation}</p>
            <p className="text-xs text-gray-500 mt-2">Source: {q.source}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-black text-lg
              shadow-[0_4px_0_#46A302] hover:shadow-[0_2px_0_#46A302] hover:translate-y-[2px] transition-all
              flex items-center justify-center gap-2"
          >
            {current + 1 >= TOTAL_QUESTIONS ? 'See Results' : 'Next Question'} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
