'use client'
import Link from 'next/link'
import { useState } from 'react'
import {
  Gamepad2, Trophy, Zap, Star, Flame, ArrowRight,
  Play, Target, Clock, Award, Users, TrendingUp, Lock, CheckCircle,
  Crown, Medal
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface GameMode {
  id: string
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
  color: string
  border: string
  bg: string
  badge: string
  badgeColor: string
  xp: string
  unlocked: boolean
}

const gameModes: GameMode[] = [
  {
    id: 'quick',
    title: 'Quick Fire',
    subtitle: '10 questions · ~3 min',
    description: 'Fast-paced knowledge blitz. Test what you know right now.',
    icon: Zap,
    color: 'text-[#58CC02]',
    border: 'border-[#58CC02]/30',
    bg: 'from-[#58CC02]/20 to-[#58CC02]/5',
    badge: 'Popular',
    badgeColor: 'bg-[#58CC02]/20 text-[#58CC02]',
    xp: '+50 XP',
    unlocked: true,
  },
  {
    id: 'deep',
    title: 'Deep Dive',
    subtitle: '25 questions · ~12 min',
    description: 'Full coverage quiz across your department knowledge areas.',
    icon: Target,
    color: 'text-[#D92525]',
    border: 'border-[#D92525]/30',
    bg: 'from-[#D92525]/20 to-[#D92525]/5',
    badge: 'Thorough',
    badgeColor: 'bg-[#D92525]/20 text-[#D92525]',
    xp: '+150 XP',
    unlocked: true,
  },
  {
    id: 'challenge',
    title: 'Weekly Challenge',
    subtitle: 'Competitive · All departments',
    description: 'Go head-to-head with colleagues. Rankings update live.',
    icon: Trophy,
    color: 'text-[#D92525]',
    border: 'border-[#D92525]/30',
    bg: 'from-[#D92525]/20 to-[#D92525]/5',
    badge: 'Ends Sunday',
    badgeColor: 'bg-[#D92525]/20 text-[#D92525]',
    xp: '+300 XP',
    unlocked: true,
  },
  {
    id: 'expert',
    title: 'Expert Mode',
    subtitle: 'No hints · Time pressure',
    description: 'Only for knowledge champions. No lifelines, strict timer.',
    icon: Flame,
    color: 'text-[#FF4B4B]',
    border: 'border-[#FF4B4B]/30',
    bg: 'from-[#FF4B4B]/20 to-[#FF4B4B]/5',
    badge: 'Level 10+',
    badgeColor: 'bg-[#FF4B4B]/20 text-[#FF4B4B]',
    xp: '+500 XP',
    unlocked: false,
  },
]

const recentScores = [
  { mode: 'Quick Fire', score: 85, date: '2h ago', xpEarned: 43 },
  { mode: 'Deep Dive', score: 91, date: 'Yesterday', xpEarned: 137 },
  { mode: 'Weekly Challenge', score: 78, date: '3 days ago', xpEarned: 234 },
]

const topPlayers = [
  { name: 'Jacob G.', score: 9840, rank: 1 },
  { name: 'Mirko S.', score: 9210, rank: 2 },
  { name: 'Katharina V.', score: 8760, rank: 3 },
]

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={18} className="text-[#FFD700]" />
  if (rank === 2) return <Medal size={18} className="text-[#C0C0C0]" />
  return <Medal size={18} className="text-[#CD7F32]" />
}

export default function KnowGamePage() {
  const [selected, setSelected] = useState('quick')

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Link href="/dashboard" className="text-gray-500 hover:text-[#1A1A1A] text-sm transition-colors">Dashboard</Link>
          <span className="text-gray-700">/</span>
          <span className="text-[#58CC02] text-sm font-semibold">Know Game</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-[#58CC02]/20 border border-[#58CC02]/30 flex items-center justify-center">
                <Gamepad2 size={24} className="text-[#58CC02]" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#1A1A1A]">Know Game</h1>
                <p className="text-gray-500 text-sm">Test your SIX knowledge. Earn XP. Climb the ranks.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Card className="px-4 py-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Your Best</p>
              <p className="text-xl font-black text-[#D92525]">91%</p>
            </Card>
            <Card className="px-4 py-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Games Played</p>
              <p className="text-xl font-black text-[#1A1A1A]">24</p>
            </Card>
            <Card className="px-4 py-3 text-center">
              <p className="text-xs text-gray-500 mb-1">XP from Games</p>
              <p className="text-xl font-black text-[#58CC02]">2,140</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Game Mode Selection */}
        <div className="col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Choose Your Mode</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {gameModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => mode.unlocked && setSelected(mode.id)}
                className={`rounded-lg border bg-card p-5 text-left transition-all relative overflow-hidden
                  bg-gradient-to-br ${mode.bg}
                  ${selected === mode.id ? `${mode.border} ring-1 ring-inset ${mode.border}` : 'border-transparent'}
                  ${!mode.unlocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] cursor-pointer'}`}
              >
                {!mode.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl z-10">
                    <Lock size={24} className="text-gray-500" />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <mode.icon size={28} className={mode.color} />
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mode.badgeColor}`}>
                    {mode.badge}
                  </span>
                </div>
                <h3 className={`text-lg font-black ${mode.color} mb-0.5`}>{mode.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{mode.subtitle}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{mode.description}</p>
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-[#58CC02]" />
                  <span className="text-xs font-semibold text-[#58CC02]">{mode.xp}</span>
                </div>
                {selected === mode.id && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle size={16} className="text-[#58CC02]" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Play Button */}
          <Button variant="duo-green" size="lg" asChild className="w-full text-xl py-5">
            <Link href={`/game/play?mode=${selected}`} className="flex items-center justify-center gap-3">
              <Play size={24} className="fill-white" />
              Start Game
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Mini Leaderboard */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1A1A1A] text-sm">Top Players</h3>
              <Link href="/leaderboard" className="text-xs text-[#D92525] hover:underline">Full Board</Link>
            </div>
            <div className="space-y-3">
              {topPlayers.map(p => (
                <div key={p.rank} className="flex items-center gap-3">
                  <RankIcon rank={p.rank} />
                  <span className="text-sm text-[#1A1A1A] flex-1 font-medium">{p.name}</span>
                  <span className="text-xs text-[#D92525] font-semibold">{String(p.score).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} pts</span>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-[#E8E8F0] dark:border-[#2a2a2a] mt-2">
                <span className="text-xs text-gray-600 w-6 text-center">#12</span>
                <span className="text-sm text-[#D92525] flex-1 font-medium">You (Jan D.)</span>
                <span className="text-xs text-[#D92525] font-semibold">4,820 pts</span>
              </div>
            </div>
          </Card>

          {/* Recent Games */}
          <Card className="p-5">
            <h3 className="font-bold text-[#1A1A1A] text-sm mb-4">Recent Games</h3>
            <div className="space-y-3">
              {recentScores.map((g, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#1A1A1A] font-medium">{g.mode}</p>
                    <p className="text-xs text-gray-500">{g.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${g.score >= 90 ? 'text-[#58CC02]' : g.score >= 80 ? 'text-[#D92525]' : 'text-[#FF9600]'}`}>
                      {g.score}%
                    </p>
                    <p className="text-xs text-gray-500">+{g.xpEarned} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Navigate to SIX Note */}
          <Card className="p-5 bg-gradient-to-br from-[#D92525]/10 to-[#CE82FF]/5 border border-[#D92525]/20">
            <p className="text-xs text-gray-500 mb-2">Also explore</p>
            <p className="font-bold text-[#1A1A1A] mb-1">SIX Note</p>
            <p className="text-xs text-gray-500 mb-3">Upload knowledge or ask questions to the knowledge base.</p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/sixnote">Open SIX Note →</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
