'use client'
import Link from 'next/link'
import {
  BookOpen, Trophy, Zap, TrendingUp, Users, FileText,
  Search, ArrowRight, Clock, CheckCircle, AlertCircle,
  Database, Star, Flame, Gamepad2, StickyNote
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const recentItems = [
  { title: 'Regulatory Reporting Framework Q4', author: 'Jacob Gertel', dept: 'Legal & Compliance', time: '2h ago', verified: true, type: 'Policy' },
  { title: 'Customer Escalation Handling SOP', author: 'Mirko Silvestri', dept: 'Customer Service', time: '5h ago', verified: true, type: 'Process' },
  { title: 'Real-Time Data Feed Architecture', author: 'Katharina Voegtle', dept: 'Real-Time Services', time: '1d ago', verified: false, type: 'Technical' },
  { title: 'SME Knowledge Capture Interview', author: 'Jennifer Chang', dept: 'Innovation Hub', time: '2d ago', verified: true, type: 'Interview' },
]

const stats = [
  { label: 'Knowledge Articles', value: '1,247', icon: FileText, color: 'text-[#D92525]', bg: 'bg-[#D92525]/10', delta: '+23 this week' },
  { label: 'Contributors', value: '86', icon: Users, color: 'text-[#CE82FF]', bg: 'bg-[#CE82FF]/10', delta: '+4 this month' },
  { label: 'Avg Quality Score', value: '94%', icon: Star, color: 'text-[#D92525]', bg: 'bg-[#D92525]/10', delta: 'Verified by SMEs' },
  { label: 'Knowledge Retention', value: '98%', icon: TrendingUp, color: 'text-[#58CC02]', bg: 'bg-[#58CC02]/10', delta: 'vs 67% industry avg' },
]

const quickAccess = [
  {
    href: '/duoknow', title: 'DuoKnow', subtitle: 'Interactive learning paths',
    description: 'Master organizational knowledge through gamified modules. Earn XP, build streaks, and level up your expertise.',
    icon: Zap, gradient: 'from-[#58CC02]/20 to-[#D92525]/10', border: 'border-[#58CC02]/30',
    iconBg: 'bg-[#58CC02]/20', iconColor: 'text-[#58CC02]', btnVariant: 'duo-green' as const, btnLabel: 'Start Learning',
  },
  {
    href: '/textbook', title: 'Knowledge Hub', subtitle: 'Expert knowledge repository',
    description: 'Browse traceable, SME-verified articles from colleagues past and present. Full source attribution and decision trails.',
    icon: BookOpen, gradient: 'from-[#D92525]/10 to-[#FF9600]/5', border: 'border-[#D92525]/20',
    iconBg: 'bg-[#D92525]/20', iconColor: 'text-[#D92525]', btnVariant: 'six-red' as const, btnLabel: 'Browse Knowledge',
  },
  {
    href: '/leaderboard', title: 'Leaderboard', subtitle: 'Rankings & achievements',
    description: 'See where you stand. Earn badges for contributions, learning milestones, and knowledge sharing across departments.',
    icon: Trophy, gradient: 'from-[#CE82FF]/10 to-[#D92525]/5', border: 'border-[#CE82FF]/20',
    iconBg: 'bg-[#CE82FF]/20', iconColor: 'text-[#CE82FF]', btnVariant: 'outline' as const, btnLabel: 'View Rankings',
  },
  {
    href: '/game', title: 'Know Game', subtitle: 'Test your knowledge',
    description: 'Challenge yourself with interactive quizzes. Earn XP, beat the clock, and climb the game leaderboard.',
    icon: Gamepad2, gradient: 'from-[#58CC02]/15 to-[#58CC02]/5', border: 'border-[#58CC02]/25',
    iconBg: 'bg-[#58CC02]/20', iconColor: 'text-[#58CC02]', btnVariant: 'duo-green' as const, btnLabel: 'Play Now',
  },
  {
    href: '/sixnote', title: 'SIX Note', subtitle: 'Upload & ask questions',
    description: 'Contribute knowledge or ask questions grounded in verified sources. Full author attribution, no hallucinations.',
    icon: StickyNote, gradient: 'from-[#D92525]/10 to-[#CE82FF]/5', border: 'border-[#D92525]/20',
    iconBg: 'bg-[#D92525]/20', iconColor: 'text-[#D92525]', btnVariant: 'outline' as const, btnLabel: 'Open SIX Note',
  },
]

const deptCoverage = [
  { dept: 'Legal & Compliance', pct: 87, indicator: 'bg-[#D92525]' },
  { dept: 'Customer Service', pct: 74, indicator: 'bg-[#58CC02]' },
  { dept: 'Real-Time Services', pct: 91, indicator: 'bg-[#D92525]' },
  { dept: 'Innovation Hub', pct: 62, indicator: 'bg-[#CE82FF]' },
  { dept: 'Risk Management', pct: 79, indicator: 'bg-[#FF9600]' },
  { dept: 'IT & Architecture', pct: 55, indicator: 'bg-[#FF4B4B]' },
]

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="streak"><Flame size={14} /> 7</Badge>
          <span className="text-gray-600 text-sm">day streak</span>
        </div>
        <h1 className="text-3xl font-black text-[#1A1A1A]">Good morning, Jan</h1>
        <p className="text-gray-500 mt-1">Your organization's knowledge is growing. Here's today's overview.</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search knowledge, articles, experts, topics..."
          className="w-full bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] rounded-2xl pl-12 pr-4 py-4
                     text-[#1A1A1A] dark:text-white placeholder-gray-300 focus:outline-none focus:border-[#D92525]/50
                     dark:focus:border-[#D92525]/50 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all text-sm"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
          <kbd className="text-xs bg-[#F0F0F5] text-gray-400 px-2 py-0.5 rounded font-mono">⌘</kbd>
          <kbd className="text-xs bg-[#F0F0F5] text-gray-400 px-2 py-0.5 rounded font-mono">K</kbd>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Card key={s.label} className="p-5">
            <div className={`inline-flex p-2.5 rounded-xl ${s.bg} mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className="text-2xl font-black text-[#1A1A1A]">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            <p className={`text-xs mt-2 ${s.color} font-medium`}>{s.delta}</p>
          </Card>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-3 xl:grid-cols-5 gap-4 mb-8" style={{ alignItems: 'start' }}>
        {quickAccess.map(card => (
          <Card key={card.href} className={`p-4 bg-gradient-to-br ${card.gradient} border ${card.border} flex flex-col h-fit`}>
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
              <card.icon size={18} className={card.iconColor} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">{card.subtitle}</p>
            <h3 className="text-lg font-black text-[#1A1A1A] mb-2">{card.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{card.description}</p>
            <Button variant={card.btnVariant} size="sm" asChild className="mt-4 w-full">
              <Link href={card.href} className="flex items-center justify-center gap-2">
                {card.btnLabel} <ArrowRight size={14} />
              </Link>
            </Button>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#1A1A1A] flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            Recently Updated Knowledge
          </h2>
          <Link href="/textbook" className="text-xs text-[#D92525] hover:text-[#E8341F] flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-3">
          {recentItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F5F5F7] transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-[#F5F5F7] flex items-center justify-center flex-shrink-0">
                <FileText size={15} className="text-gray-500 group-hover:text-[#D92525] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A1A] truncate">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.author} · {item.dept}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Badge variant="outline" className={`text-xs font-medium
                  ${item.type === 'Policy' ? 'border-[#D92525]/40 text-[#D92525] bg-[#D92525]/10'
                  : item.type === 'Process' ? 'border-[#58CC02]/40 text-[#58CC02] bg-[#58CC02]/10'
                  : item.type === 'Technical' ? 'border-[#CE82FF]/40 text-[#CE82FF] bg-[#CE82FF]/10'
                  : 'border-[#D92525]/40 text-[#D92525] bg-[#D92525]/10'}`}>
                  {item.type}
                </Badge>
                {item.verified
                  ? <CheckCircle size={14} className="text-[#58CC02]" />
                  : <AlertCircle size={14} className="text-[#FF9600]" />}
                <span className="text-xs text-gray-600">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Knowledge Coverage */}
      <Card className="p-6 mt-4">
        <h2 className="font-bold text-[#1A1A1A] mb-5 flex items-center gap-2">
          <Database size={16} className="text-gray-500" />
          Department Knowledge Coverage
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {deptCoverage.map(d => (
            <div key={d.dept}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">{d.dept}</span>
                <span className="text-[#1A1A1A] font-semibold">{d.pct}%</span>
              </div>
              <Progress value={d.pct} className="h-3" indicatorClassName={d.indicator} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
