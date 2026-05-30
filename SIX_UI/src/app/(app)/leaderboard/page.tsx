'use client'
import { useState } from 'react'
import {
  Trophy, Star, Flame, Zap, Award, TrendingUp,
  Medal, Crown, ChevronUp, ChevronDown, BookOpen,
  FileText, MessageSquare, Scale, Users, Brain,
  Calendar, Rocket, Lock
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Player {
  rank: number
  name: string
  dept: string
  initials: string
  xp: number
  streak: number
  badges: number
  contributions: number
  delta: number
  gradient: string
  isMe?: boolean
}

const leaderboardData: Player[] = [
  { rank: 1, name: 'Jacob Gertel', dept: 'Legal & Compliance', initials: 'JG', xp: 8420, streak: 34, badges: 12, contributions: 47, delta: 0, gradient: 'from-[#FFD700] to-[#FFA500]' },
  { rank: 2, name: 'Mirko Silvestri', dept: 'Real-Time Services', initials: 'MS', xp: 7180, streak: 21, badges: 10, contributions: 38, delta: 1, gradient: 'from-[#C0C0C0] to-[#A8A8A8]' },
  { rank: 3, name: 'Katharina Voegtle', dept: 'Customer Service', initials: 'KV', xp: 6950, streak: 18, badges: 9, contributions: 34, delta: -1, gradient: 'from-[#CD7F32] to-[#A0522D]' },
  { rank: 4, name: 'Jennifer Chang', dept: 'Innovation Hub', initials: 'JC', xp: 5830, streak: 15, badges: 8, contributions: 29, delta: 2, gradient: 'from-duo-purple to-duo-blue' },
  { rank: 5, name: 'Magdalena Tuta', dept: 'Innovation Hub', initials: 'MT', xp: 5210, streak: 12, badges: 7, contributions: 25, delta: 0, gradient: 'from-duo-blue to-duo-green' },
  { rank: 6, name: 'Andreas Brunner', dept: 'Risk Management', initials: 'AB', xp: 4720, streak: 9, badges: 6, contributions: 22, delta: 1, gradient: 'from-duo-green to-duo-blue' },
  { rank: 7, name: 'Sarah Müller', dept: 'IT & Architecture', initials: 'SM', xp: 4180, streak: 8, badges: 5, contributions: 19, delta: -2, gradient: 'from-duo-orange to-duo-red' },
  { rank: 8, name: 'Thomas Weber', dept: 'Legal & Compliance', initials: 'TW', xp: 3950, streak: 7, badges: 5, contributions: 17, delta: 0, gradient: 'from-duo-purple to-duo-orange' },
  { rank: 9, name: 'Lisa Keller', dept: 'Customer Service', initials: 'LK', xp: 3420, streak: 6, badges: 4, contributions: 14, delta: 3, gradient: 'from-duo-blue to-duo-purple' },
  { rank: 10, name: 'Nico Braun', dept: 'Real-Time Services', initials: 'NB', xp: 3180, streak: 5, badges: 4, contributions: 13, delta: -1, gradient: 'from-six-gold to-duo-orange' },
  { rank: 11, name: 'Lena Hoffmann', dept: 'Innovation Hub', initials: 'LH', xp: 2840, streak: 4, badges: 3, contributions: 11, delta: 1, gradient: 'from-duo-green to-six-gold' },
  { rank: 12, name: 'Jan Doe', dept: 'Legal & Compliance', initials: 'JD', xp: 2480, streak: 7, badges: 8, contributions: 9, delta: 2, gradient: 'from-duo-purple to-duo-blue', isMe: true },
]

// Monthly XP is ~40% of all-time; weekly is ~10%
const monthlyData: Player[] = leaderboardData.map(p => ({ ...p, xp: Math.round(p.xp * 0.40) }))
const weeklyData: Player[] = [
  { ...leaderboardData[1], rank: 1, xp: 620, delta: 1 },   // Mirko top this week
  { ...leaderboardData[0], rank: 2, xp: 540, delta: -1 },  // Jacob second
  { ...leaderboardData[3], rank: 3, xp: 490, delta: 1 },   // Jennifer climbs
  { ...leaderboardData[2], rank: 4, xp: 440, delta: -1 },
  { ...leaderboardData[5], rank: 5, xp: 380, delta: 1 },
  { ...leaderboardData[4], rank: 6, xp: 310, delta: -1 },
  { ...leaderboardData[6], rank: 7, xp: 270, delta: 0 },
  { ...leaderboardData[10], rank: 8, xp: 240, delta: 3 },  // Lena surges
  { ...leaderboardData[7], rank: 9, xp: 210, delta: -1 },
  { ...leaderboardData[8], rank: 10, xp: 180, delta: -1 },
  { ...leaderboardData[9], rank: 11, xp: 160, delta: -1 },
  { ...leaderboardData[11], rank: 12, xp: 140, delta: 0 },
]

interface BadgeItem {
  id: number
  name: string
  icon: LucideIcon
  desc: string
  earned: boolean
  color: string
}

const badges: BadgeItem[] = [
  { id: 1, name: 'First Contribution', icon: FileText, desc: 'Added your first knowledge article', earned: true, color: 'bg-[#D92525]/10 border-[#D92525]/30 text-[#D92525]' },
  { id: 2, name: 'Week Warrior', icon: Flame, desc: '7-day learning streak', earned: true, color: 'bg-[#FF9600]/10 border-[#FF9600]/30 text-[#FF9600]' },
  { id: 3, name: 'Compliance Pro', icon: Scale, desc: 'Completed Legal & Compliance path', earned: true, color: 'bg-[#D92525]/10 border-[#D92525]/30 text-[#D92525]' },
  { id: 4, name: 'Knowledge Sharer', icon: Users, desc: 'Article cited by 5+ colleagues', earned: true, color: 'bg-[#58CC02]/10 border-[#58CC02]/30 text-[#58CC02]' },
  { id: 5, name: 'SME Contributor', icon: Brain, desc: 'Verified by a Subject Matter Expert', earned: true, color: 'bg-[#D92525]/10 border-[#D92525]/30 text-[#D92525]' },
  { id: 6, name: 'Fast Learner', icon: Zap, desc: 'Completed a module in under 2 days', earned: true, color: 'bg-[#CE82FF]/10 border-[#CE82FF]/30 text-[#CE82FF]' },
  { id: 7, name: 'Month Master', icon: Calendar, desc: '30-day learning streak', earned: false, color: 'bg-[#F5F5F7] dark:bg-[#1a1a1a] border-[#E8E8F0] dark:border-[#2a2a2a] text-gray-400' },
  { id: 8, name: 'Trendsetter', icon: Rocket, desc: 'First to complete a new module', earned: false, color: 'bg-[#F5F5F7] dark:bg-[#1a1a1a] border-[#E8E8F0] dark:border-[#2a2a2a] text-gray-400' },
]

const periodBtnActive = 'bg-[#D92525] text-white'
const periodBtnInactive = 'bg-[#F5F5F7] dark:bg-[#111] text-gray-500 hover:text-[#1A1A1A] border border-[#E8E8F0] dark:border-[#2a2a2a]'

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={16} className="text-[#FFD700]" />
  if (rank === 2) return <Medal size={16} className="text-[#C0C0C0]" />
  if (rank === 3) return <Medal size={16} className="text-[#CD7F32]" />
  return <span className="text-sm font-bold text-gray-500">#{rank}</span>
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'alltime'>('monthly')

  const activeData = period === 'weekly' ? weeklyData : period === 'monthly' ? monthlyData : leaderboardData
  const me = activeData.find(p => p.isMe)!
  const top3 = activeData.slice(0, 3)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#1A1A1A]">Leaderboard</h1>
        <p className="text-gray-500 mt-1">Earn XP by learning, contributing, and sharing knowledge with your team.</p>
      </div>

      {/* Period Toggle */}
      <div className="flex items-center gap-2 mb-8">
        <Button size="sm" variant={period === 'weekly' ? 'six-red' : 'outline'} onClick={() => setPeriod('weekly')}>This Week</Button>
        <Button size="sm" variant={period === 'monthly' ? 'six-red' : 'outline'} onClick={() => setPeriod('monthly')}>This Month</Button>
        <Button size="sm" variant={period === 'alltime' ? 'six-red' : 'outline'} onClick={() => setPeriod('alltime')}>All Time</Button>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {/* 2nd */}
        <div className="flex flex-col items-center">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${top3[1].gradient} flex items-center justify-center text-lg font-black mb-2 shadow-lg`}>
            {top3[1].initials}
          </div>
          <p className="text-xs font-bold text-[#1A1A1A] mb-1">{top3[1].name.split(' ')[0]}</p>
          <div className="w-24 bg-[#C0C0C0]/20 border border-[#C0C0C0]/30 rounded-t-xl h-20 flex flex-col items-center justify-center">
            <Medal size={20} className="text-[#C0C0C0] mb-1" />
            <p className="text-xs font-bold text-[#C0C0C0]">{(top3[1].xp / 1000).toFixed(1)}K XP</p>
          </div>
        </div>
        {/* 1st */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-6 h-6 mb-1">
            <Crown size={20} className="text-[#FFD700] animate-float" />
          </div>
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${top3[0].gradient} flex items-center justify-center text-xl font-black mb-2 shadow-2xl ring-2 ring-[#FFD700]/50`}>
            {top3[0].initials}
          </div>
          <p className="text-xs font-bold text-[#1A1A1A] mb-1">{top3[0].name.split(' ')[0]}</p>
          <div className="w-24 bg-[#FFD700]/20 border border-[#FFD700]/30 rounded-t-xl h-28 flex flex-col items-center justify-center">
            <Trophy size={22} className="text-[#FFD700] mb-1" />
            <p className="text-sm font-black text-[#FFD700]">{(top3[0].xp / 1000).toFixed(1)}K XP</p>
          </div>
        </div>
        {/* 3rd */}
        <div className="flex flex-col items-center">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${top3[2].gradient} flex items-center justify-center text-lg font-black mb-2 shadow-lg`}>
            {top3[2].initials}
          </div>
          <p className="text-xs font-bold text-[#1A1A1A] mb-1">{top3[2].name.split(' ')[0]}</p>
          <div className="w-24 bg-[#CD7F32]/20 border border-[#CD7F32]/30 rounded-t-xl h-14 flex flex-col items-center justify-center">
            <Medal size={18} className="text-[#CD7F32] mb-0.5" />
            <p className="text-xs font-bold text-[#CD7F32]">{(top3[2].xp / 1000).toFixed(1)}K XP</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Full Leaderboard */}
        <div className="col-span-2 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="px-5 py-4 border-b border-[#E8E8F0] dark:border-[#2a2a2a] flex items-center justify-between">
            <h2 className="font-bold text-[#1A1A1A] text-sm">Rankings</h2>
            <span className="text-xs text-gray-500">{activeData.length} participants</span>
          </div>
          <div className="divide-y divide-[#1F1F1F]">
            {activeData.map(player => (
              <div
                key={player.rank}
                className={`flex items-center gap-3 px-5 py-3 transition-colors
                  ${player.isMe ? 'bg-six-gold/5 border-l-2 border-six-gold' : 'hover:bg-[#F5F5F7]'}`}
              >
                <div className="w-8 text-center flex-shrink-0">
                  <RankIcon rank={player.rank} />
                </div>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${player.gradient} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xs font-black">{player.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${player.isMe ? 'text-six-gold' : 'text-[#1A1A1A]'}`}>
                      {player.name}
                    </span>
                    {player.isMe && <span className="text-xs bg-six-gold/20 text-six-gold px-1.5 py-0.5 rounded-full font-bold">You</span>}
                  </div>
                  <p className="text-xs text-gray-500">{player.dept}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-xs font-bold text-[#1A1A1A]">{String(player.xp).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    <p className="text-xs text-gray-600">XP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-duo-orange">{player.streak}</p>
                    <p className="text-xs text-gray-600">streak</p>
                  </div>
                  <div className="text-center hidden lg:block">
                    <p className="text-xs font-bold text-duo-purple">{player.badges}</p>
                    <p className="text-xs text-gray-600">badges</p>
                  </div>
                  <div className="w-6 flex justify-end">
                    {player.delta > 0 && <span className="flex items-center text-xs text-duo-green font-bold"><ChevronUp size={14} />{player.delta}</span>}
                    {player.delta < 0 && <span className="flex items-center text-xs text-duo-red font-bold"><ChevronDown size={14} />{Math.abs(player.delta)}</span>}
                    {player.delta === 0 && <span className="text-xs text-gray-600">—</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* My Stats */}
          <Card className="p-5 border-[#D92525]/20">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Your Stats</p>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${me.gradient} flex items-center justify-center text-base font-black`}>
                {me.initials}
              </div>
              <div>
                <p className="font-bold text-[#1A1A1A]">{me.name}</p>
                <p className="text-xs text-gray-500">{me.dept}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'XP', value: String(me.xp).replace(/\B(?=(\d{3})+(?!\d))/g, ','), icon: Zap, color: 'text-six-gold' },
                { label: 'Rank', value: `#${me.rank}`, icon: TrendingUp, color: 'text-duo-purple' },
                { label: 'Streak', value: `${me.streak}d`, icon: Flame, color: 'text-duo-orange' },
                { label: 'Badges', value: me.badges, icon: Award, color: 'text-duo-green' },
              ].map(s => (
                <div key={s.label} className="bg-[#F5F5F7] rounded-xl p-3 text-center">
                  <s.icon size={16} className={`${s.color} mx-auto mb-1`} />
                  <p className={`text-lg font-black ${s.color}`}>{String(s.value)}</p>
                  <p className="text-xs text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Progress to next rank */}
            <div className="bg-[#F5F5F7] rounded-xl p-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">To Rank #11</span>
                <span className="text-[#1A1A1A] font-semibold">2,840 – 2,480 = 360 XP</span>
              </div>
              <Progress value={78} className="h-3" />
              <p className="text-xs text-gray-600 mt-1.5 text-center">78% of the way there</p>
            </div>
          </Card>

          {/* Contributions */}
          <Card className="p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Contribution Types</p>
            <div className="space-y-3">
              {[
                { label: 'Articles Written', val: 4, icon: FileText, color: 'text-duo-blue', bg: 'bg-duo-blue' },
                { label: 'Modules Completed', val: 7, icon: BookOpen, color: 'text-duo-green', bg: 'bg-duo-green' },
                { label: 'Reviews Given', val: 12, icon: MessageSquare, color: 'text-duo-purple', bg: 'bg-duo-purple' },
                { label: 'Articles Cited', val: 5, icon: Star, color: 'text-six-gold', bg: 'bg-six-gold' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-3">
                  <c.icon size={13} className={c.color} />
                  <span className="text-xs text-gray-500 flex-1">{c.label}</span>
                  <span className={`text-xs font-bold ${c.color}`}>{c.val}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Badges */}
          <Card className="p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Achievements</p>
            <div className="grid grid-cols-4 gap-2">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  title={`${badge.name}: ${badge.desc}`}
                  className={`aspect-square rounded-xl border flex items-center justify-center
                    ${badge.color}
                    ${!badge.earned ? 'opacity-40' : ''}
                    cursor-pointer hover:scale-110 transition-transform`}
                >
                  {badge.earned
                    ? <badge.icon size={16} />
                    : <Lock size={16} />}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">{badges.filter(b => b.earned).length}/{badges.length} earned</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
