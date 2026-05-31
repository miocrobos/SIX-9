'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  Lock, CheckCircle, Star, Flame, Zap, BookOpen,
  Trophy, ArrowRight, Play, Clock, Award, ChevronDown,
  Scale, ClipboardList, ShieldCheck, Users, Phone, Rocket
} from 'lucide-react'
import PageTransition from '@/components/PageTransition'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type NodeStatus = 'completed' | 'active' | 'locked'

interface PathNode {
  id: number
  title: string
  subtitle: string
  status: NodeStatus
  xp: number
  lessons: number
  completedLessons: number
  icon: LucideIcon
  color: string
  glow: string
  description: string
  source: string
}

const paths: { category: string; color: string; nodes: PathNode[] }[] = [
  {
    category: 'Legal & Compliance',
    color: 'text-[#D92525]',
    nodes: [
      {
        id: 1, title: 'Regulatory Basics', subtitle: 'Foundation', status: 'completed',
        xp: 150, lessons: 5, completedLessons: 5, icon: Scale, color: 'bg-[#D92525]', glow: 'shadow-[#D92525]/40',
        description: 'Core regulatory reporting requirements and SIX compliance framework.',
        source: 'Jacob Gertel — Content Management, Legal & Compliance'
      },
      {
        id: 2, title: 'MiFID II Reporting', subtitle: 'Intermediate', status: 'completed',
        xp: 200, lessons: 7, completedLessons: 7, icon: ClipboardList, color: 'bg-[#D92525]', glow: 'shadow-[#D92525]/40',
        description: 'In-depth MiFID II transaction and position reporting obligations.',
        source: 'Jacob Gertel — Content Management, Legal & Compliance'
      },
      {
        id: 3, title: 'Data Governance', subtitle: 'Intermediate', status: 'active',
        xp: 250, lessons: 8, completedLessons: 3, icon: ShieldCheck, color: 'bg-[#D92525]', glow: 'shadow-[#D92525]/40',
        description: 'Data quality, stewardship, and governance processes at SIX.',
        source: 'Jacob Gertel — Content Management, Legal & Compliance'
      },
      {
        id: 4, title: 'Advanced Compliance', subtitle: 'Expert', status: 'locked',
        xp: 350, lessons: 10, completedLessons: 0, icon: Lock, color: 'bg-[#E8E8F0]', glow: '',
        description: 'Complex cross-border compliance scenarios and escalation paths.',
        source: 'Jacob Gertel — Content Management, Legal & Compliance'
      },
    ]
  },
  {
    category: 'Customer Service',
    color: 'text-[#58CC02]',
    nodes: [
      {
        id: 5, title: 'Client Onboarding', subtitle: 'Foundation', status: 'completed',
        xp: 120, lessons: 4, completedLessons: 4, icon: Users, color: 'bg-[#58CC02]', glow: 'shadow-[#58CC02]/40',
        description: 'End-to-end client onboarding processes and documentation.',
        source: 'Mirko Silvestri — Real Time Services & Customer Service'
      },
      {
        id: 6, title: 'Escalation Handling', subtitle: 'Intermediate', status: 'active',
        xp: 180, lessons: 6, completedLessons: 2, icon: Phone, color: 'bg-[#58CC02]', glow: 'shadow-[#58CC02]/40',
        description: 'Structured escalation matrix and resolution playbooks.',
        source: 'Katharina Voegtle — Customer Service Transformation'
      },
      {
        id: 7, title: 'Service Excellence', subtitle: 'Expert', status: 'locked',
        xp: 300, lessons: 9, completedLessons: 0, icon: Star, color: 'bg-[#E8E8F0]', glow: '',
        description: 'Advanced service delivery and customer relationship management.',
        source: 'Mirko Silvestri — Real Time Services & Customer Service'
      },
    ]
  },
  {
    category: 'Real-Time Services',
    color: 'text-[#D92525]',
    nodes: [
      {
        id: 8, title: 'Data Feed Fundamentals', subtitle: 'Foundation', status: 'active',
        xp: 160, lessons: 5, completedLessons: 1, icon: Zap, color: 'bg-[#D92525]', glow: 'shadow-[#D92525]/40',
        description: 'Architecture and operation of SIX real-time market data feeds.',
        source: 'Mirko Silvestri — Real Time Services'
      },
      {
        id: 9, title: 'Latency Optimization', subtitle: 'Advanced', status: 'locked',
        xp: 280, lessons: 8, completedLessons: 0, icon: Rocket, color: 'bg-[#E8E8F0]', glow: '',
        description: 'Performance tuning and SLA management for real-time systems.',
        source: 'Mirko Silvestri — Real Time Services'
      },
    ]
  },
]

/**
 * Render an interactive node tile with icon, status badges, labels, and an optional detail panel.
 *
 * The card displays the node's icon (or a lock), title and subtitle, and overlays for completed or active states.
 * When `selected` is true and the node is not locked, a detail panel is shown with description, XP, progress,
 * source, and action buttons to open the textbook or jump into the game.
 *
 * @param node - The learning node to render (identity, content, progress, and UI metadata)
 * @param onSelect - Callback invoked with `node` when the card is clicked (not called for locked nodes)
 * @param selected - Whether the node's detail panel should be displayed
 * @returns The JSX element for the node card
 */
function NodeCard({ node, onSelect, selected }: { node: PathNode; onSelect: (n: PathNode) => void; selected: boolean }) {
  const isCompleted = node.status === 'completed'
  const isActive = node.status === 'active'
  const isLocked = node.status === 'locked'

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={() => !isLocked && onSelect(node)}
        className={`relative w-20 h-20 rounded-2xl flex flex-col items-center justify-center
          transition-all duration-300 border-2
          ${isCompleted ? `${node.color} border-transparent shadow-lg ${node.glow} scale-100 hover:scale-105` : ''}
          ${isActive ? `${node.color} border-white/20 shadow-xl ${node.glow} scale-100 hover:scale-105 animate-pulse-gold` : ''}
          ${isLocked ? 'bg-[#E8E8F0] dark:bg-[#2a2a2a] border-[#E8E8F0] dark:border-[#2a2a2a] cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={isActive ? { boxShadow: `0 0 24px rgba(255,255,255,0.15)` } : {}}
      >
        {isLocked
          ? <Lock size={22} className="text-gray-600" />
          : <node.icon size={22} className="text-white" />}
        {isCompleted && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#58CC02] rounded-full flex items-center justify-center border-2 border-white">
            <CheckCircle size={14} className="text-[#1A1A1A] dark:text-white" />
          </div>
        )}
        {isActive && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF9600] rounded-full flex items-center justify-center border-2 border-white animate-bounce-slow">
            <Play size={10} className="text-[#1A1A1A] dark:text-white ml-0.5" />
          </div>
        )}
      </button>

      <div className="mt-2 text-center">
        <p className={`text-xs font-bold ${isLocked ? 'text-gray-600' : 'text-[#1A1A1A] dark:text-white'}`}>{node.title}</p>
        <p className="text-xs text-gray-600">{node.subtitle}</p>
      </div>

      {/* Detail panel */}
      {selected && !isLocked && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-72 z-20">
          <Card className="p-4 border border-[#E8E8F0] dark:border-[#2a2a2a] shadow-2xl">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-bold text-[#1A1A1A] dark:text-white text-sm">{node.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{node.subtitle}</p>
            </div>
            <Badge variant="xp">+{node.xp} XP</Badge>
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">{node.description}</p>
          <Progress
            value={(node.completedLessons / node.lessons) * 100}
            className="h-2 mb-2"
            indicatorClassName={isCompleted ? 'bg-[#58CC02]' : 'bg-[#FF9600]'}
          />
          <p className="text-xs text-gray-500 mb-3">{node.completedLessons}/{node.lessons} lessons</p>
          <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-600">
            <Clock size={11} />
            <span className="truncate">{node.source}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link href="/textbook" className="flex items-center justify-center gap-1">
                <BookOpen size={11} /> Textbook
              </Link>
            </Button>
            <Button variant="duo-green" size="sm" asChild className="flex-1">
              <Link href="/game/play?mode=quick" className="flex items-center justify-center gap-1">
                <Play size={11} /> {isCompleted ? 'Review' : 'Continue'}
              </Link>
            </Button>
          </div>
          </Card>
          </div>
          )}
    </div>
  )
}

/**
 * Render the DuoKnow learning dashboard with header stats, expandable learning paths, node cards with detail popovers, and bottom CTAs.
 *
 * The page shows an initial transition overlay until it completes, a responsive stats bar, a list of categorized paths that can be expanded to reveal horizontally scrollable nodes, per-path progress and a continue banner for active nodes, and links to the textbook and leaderboard.
 *
 * @returns The DuoKnow page React element.
 */
export default function DuoKnowPage() {
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null)
  const [expandedPath, setExpandedPath] = useState<string | null>('Legal & Compliance')
  const [transitionDone, setTransitionDone] = useState(false)

  const totalXP = 1020
  const streak = 7

  const handleSelect = (node: PathNode) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node)
  }

  return (
    <>
      {!transitionDone && (
        <PageTransition
          Icon={Zap}
          iconColor="#D92525"
          quote="Every lesson builds the next."
          onComplete={() => setTransitionDone(true)}
        />
      )}
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white">DuoKnow</h1>
        <p className="text-gray-500 mt-1">Learn from your organization's best experts. Build skills, earn XP, keep your streak.</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 md:flex md:items-stretch gap-2 md:gap-4 mb-6 md:mb-8">
        <Card className="flex-1 min-w-0 px-4 py-4 flex flex-col items-center justify-center gap-1 text-center">
          <Flame size={16} className="text-[#FF9600] mb-1" />
          <p className="text-xl font-black text-[#1A1A1A] dark:text-white">{streak}</p>
          <p className="text-xs text-gray-500">Day Streak</p>
        </Card>
        <Card key="xp" className="flex-1 min-w-0 px-4 py-4 flex flex-col items-center justify-center gap-1 text-center">
          <Zap size={16} className="text-[#D92525] mb-1" />
          <p className="text-xl font-black text-[#1A1A1A] dark:text-white">{totalXP.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
          <p className="text-xs text-gray-500">Total XP</p>
        </Card>
        <Card key="league" className="flex-1 min-w-0 px-4 py-4 flex flex-col items-center justify-center gap-1 text-center">
          <Trophy size={16} className="text-[#CE82FF] mb-1" />
          <p className="text-xl font-black text-[#1A1A1A] dark:text-white">Gold</p>
          <p className="text-xs text-gray-500">Current League</p>
        </Card>
        <Card key="badges" className="flex-1 min-w-0 px-4 py-4 flex flex-col items-center justify-center gap-1 text-center">
          <Award size={16} className="text-[#58CC02] mb-1" />
          <p className="text-xl font-black text-[#1A1A1A] dark:text-white">8</p>
          <p className="text-xs text-gray-500">Badges Earned</p>
        </Card>
        <Link
          href="/leaderboard"
          className="flex-1 min-w-0 rounded-lg border bg-card px-4 py-4 flex flex-col items-center justify-center gap-1 text-center hover:border-[#D92525]/30 transition-colors group shadow-sm"
        >
          <Star size={16} className="text-[#D92525] mb-1 group-hover:animate-bounce-slow" />
          <p className="text-sm font-bold text-[#1A1A1A] dark:text-white">Rank #12</p>
          <p className="text-xs text-gray-500 flex items-center gap-1">Leaderboard <ArrowRight size={10} /></p>
        </Link>
      </div>

      {/* Learning Paths */}
      <div className="space-y-4">
        {paths.map(path => (
          <div key={path.category} className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
            {/* Path Header */}
            <button
              onClick={() => setExpandedPath(expandedPath === path.category ? null : path.category)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F5F5F7] transition-colors"
            >
              <div className="flex items-center gap-3">
                <h3 className={`font-bold text-sm ${path.color}`}>{path.category}</h3>
                <span className="text-xs text-gray-600">
                  {path.nodes.filter(n => n.status === 'completed').length}/{path.nodes.length} completed
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24">
                  <Progress
                    value={(path.nodes.filter(n => n.status === 'completed').length / path.nodes.length) * 100}
                    className="h-2"
                  />
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${expandedPath === path.category ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {/* Path Nodes */}
            {expandedPath === path.category && (
              <div className="px-6 pb-8 pt-4">
                <div className="overflow-x-auto -mx-2 px-2">
                  <div className="relative flex items-start justify-around min-w-[320px]">
                  {/* Connector line */}
                  <div className="absolute top-10 left-10 right-10 h-0.5 bg-[#E0E0E8] z-0" />

                  {path.nodes.map(node => (
                    <div key={node.id} className="relative z-10">
                      <NodeCard node={node} onSelect={handleSelect} selected={selectedNode?.id === node.id} />
                    </div>
                  ))}
                </div>
                </div>
                {path.nodes.find(n => n.status === 'active') && (
                  <div className="mt-8 bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A] dark:text-white">
                        Continue: {path.nodes.find(n => n.status === 'active')?.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {path.nodes.find(n => n.status === 'active')?.completedLessons} of {path.nodes.find(n => n.status === 'active')?.lessons} lessons done
                      </p>
                    </div>
                    <Button variant="duo-green" size="sm" asChild>
                      <Link href="/game/play?mode=quick" className="flex items-center gap-2">
                        <Play size={14} /> Continue <ArrowRight size={14} />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA — Go to Textbook */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <Link
          href="/textbook"
          className="rounded-lg border bg-card p-5 flex items-center gap-4 hover:border-[#D92525]/30 transition-all group cursor-pointer shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#D92525]/10 flex items-center justify-center group-hover:bg-[#D92525]/20 transition-colors">
            <BookOpen size={22} className="text-[#D92525]" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#1A1A1A] dark:text-white text-sm">Knowledge Textbook</p>
            <p className="text-xs text-gray-500 mt-0.5">Read full expert knowledge articles</p>
          </div>
          <ArrowRight size={16} className="text-gray-600 group-hover:text-[#D92525] transition-colors" />
        </Link>
        <Link
          href="/leaderboard"
          className="rounded-lg border bg-card p-5 flex items-center gap-4 hover:border-[#CE82FF]/30 transition-all group cursor-pointer shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#CE82FF]/10 flex items-center justify-center group-hover:bg-[#CE82FF]/20 transition-colors">
            <Trophy size={22} className="text-[#CE82FF]" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#1A1A1A] dark:text-white text-sm">Gamified Leaderboard</p>
            <p className="text-xs text-gray-500 mt-0.5">See your rank and earn achievements</p>
          </div>
          <ArrowRight size={16} className="text-gray-600 group-hover:text-[#CE82FF] transition-colors" />
        </Link>
      </div>
    </div>
    </>
  )
}
