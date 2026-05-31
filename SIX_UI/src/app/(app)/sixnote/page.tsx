'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Upload, MessageCircle, FileText, Clock, ArrowRight, CheckCircle, Zap, BookOpen, Users, StickyNote } from 'lucide-react'
import PageTransition from '@/components/PageTransition'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const recentNotes = [
  { title: 'Q4 Regulatory Update Summary', author: 'Jacob Gertel', dept: 'Legal & Compliance', time: '2h ago', type: 'Upload', verified: true },
  { title: 'Customer Onboarding FAQ', author: 'Mirko Silvestri', dept: 'Customer Service', time: '5h ago', type: 'Q&A', verified: true },
  { title: 'Real-Time Feed Architecture Notes', author: 'Katharina Voegtle', dept: 'Real-Time Services', time: '1d ago', type: 'Upload', verified: false },
  { title: 'SME Interview: Data Governance', author: 'Jennifer Chang', dept: 'Innovation Hub', time: '2d ago', type: 'Q&A', verified: true },
]

interface Stat { label: string; value: string; icon: LucideIcon; color: string }

const stats: Stat[] = [
  { label: 'Notes Uploaded', value: '342', icon: FileText, color: 'text-[#D92525]' },
  { label: 'Questions Asked', value: '1,208', icon: MessageCircle, color: 'text-[#CE82FF]' },
  { label: 'Answers Verified', value: '94%', icon: CheckCircle, color: 'text-[#58CC02]' },
  { label: 'Contributors', value: '86', icon: Users, color: 'text-[#D92525]' },
]

/**
 * Render the SIX Note dashboard page, including stats, upload/ask CTAs, recent activity, and cross-links.
 *
 * The component shows an initial page transition until completion, then displays the main UI with
 * stat cards, primary call-to-action panels (Upload Information and Ask Question), a Recent Activity
 * list, and quick cross-links.
 *
 * @returns The JSX element representing the SIX Note page.
 */
export default function SixNotePage() {
  const [transitionDone, setTransitionDone] = useState(false)

  return (
    <>
      {!transitionDone && (
        <PageTransition
          Icon={StickyNote}
          quote="Capture it. Share it. Build on it."
          onComplete={() => setTransitionDone(true)}
        />
      )}
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Link href="/dashboard" className="text-gray-500 hover:text-[#1A1A1A] dark:hover:text-white dark:text-white text-sm transition-colors">Dashboard</Link>
          <span className="text-gray-700">/</span>
          <span className="text-[#D92525] text-sm font-semibold">SIX Note</span>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#D92525]/20 border border-[#D92525]/30 flex items-center justify-center">
            <StickyNote size={24} className="text-[#D92525]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white">SIX Note</h1>
            <p className="text-gray-500 text-sm">Capture knowledge. Ask questions. Build the collective intelligence of SIX.</p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map(s => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <s.icon size={24} className={s.color} />
            <div>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Two main CTA cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Upload Information */}
        <Card className="p-5 md:p-8 bg-gradient-to-br from-[#D92525]/20 to-[#D92525]/5 border border-[#D92525]/30 flex flex-col">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-[#D92525]/20 border border-[#D92525]/30 flex items-center justify-center">
              <Upload size={28} className="text-[#D92525]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-white">Upload Information</h2>
              <p className="text-gray-500 text-sm">Share your expertise with the team</p>
            </div>
          </div>
          <p className="text-gray-500 leading-relaxed flex-1 mb-6">
            Upload documents, notes, SOPs, process guides, or any knowledge artifact.
            Content is automatically tagged, attributed, and made searchable across the knowledge base.
          </p>
          <div className="space-y-2 mb-6">
            {['PDF, Word, PowerPoint supported', 'Auto-tagged by department & topic', 'SME verification workflow', 'Full source attribution'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-[#D92525] shrink-0" />
                <span className="text-sm text-gray-600">{f}</span>
              </div>
            ))}
          </div>
          <Button variant="duo-green" size="lg" asChild className="w-full">
            <Link href="/sixnote/upload" className="flex items-center justify-center gap-2">
              <Upload size={18} /> Upload Information <ArrowRight size={16} />
            </Link>
          </Button>
        </Card>

        {/* Ask Question */}
        <Card className="p-5 md:p-8 bg-gradient-to-br from-[#CE82FF]/20 to-[#CE82FF]/5 border border-[#CE82FF]/30 flex flex-col">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-[#CE82FF]/20 border border-[#CE82FF]/30 flex items-center justify-center">
              <MessageCircle size={28} className="text-[#CE82FF]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-white">Ask Question</h2>
              <p className="text-gray-500 text-sm">Get answers from verified knowledge</p>
            </div>
          </div>
          <p className="text-gray-500 leading-relaxed flex-1 mb-6">
            Ask anything about SIX processes, regulations, or workflows. Answers are grounded in
            verified knowledge articles with full source traceability — no hallucinations.
          </p>
          <div className="space-y-2 mb-6">
            {['Grounded in verified sources', 'Cites original authors & documents', 'Escalates to SME if unsure', 'Learns from feedback'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-[#CE82FF] shrink-0" />
                <span className="text-sm text-gray-600">{f}</span>
              </div>
            ))}
          </div>
          <Button size="lg" asChild className="w-full bg-[#CE82FF] hover:bg-[#B966EE] text-white font-black shadow-[0_4px_0_#A060CC] hover:shadow-[0_2px_0_#A060CC] hover:translate-y-[2px] transition-all">
            <Link href="/sixnote/ask" className="flex items-center justify-center gap-2">
              <MessageCircle size={18} /> Ask a Question <ArrowRight size={16} />
            </Link>
          </Button>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[#1A1A1A] dark:text-white">Recent Activity</h3>
          <div className="flex gap-2">
            <Link href="/sixnote/upload" className="text-xs text-[#D92525] hover:underline">+ Upload</Link>
            <span className="text-gray-700">·</span>
            <Link href="/sixnote/ask" className="text-xs text-[#CE82FF] hover:underline">+ Ask</Link>
          </div>
        </div>
        <div className="space-y-3">
          {recentNotes.map((note, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F8FA] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] hover:border-[#CCC] dark:hover:border-[#444] transition-all group">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                ${note.type === 'Upload' ? 'bg-[#D92525]/20 text-[#D92525]' : 'bg-[#CE82FF]/20 text-[#CE82FF]'}`}>
                {note.type === 'Upload' ? <Upload size={16} /> : <MessageCircle size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A1A] dark:text-white truncate">{note.title}</p>
                <p className="text-xs text-gray-500">{note.author} · {note.dept} · {note.time}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={`text-xs ${note.type === 'Upload' ? 'text-[#D92525] border-[#D92525]/30' : 'text-[#CE82FF] border-[#CE82FF]/30'}`}>
                  {note.type}
                </Badge>
                {note.verified
                  ? <CheckCircle size={14} className="text-[#58CC02]" />
                  : <Clock size={14} className="text-[#FF9600]" />}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cross-links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
        <Card className="p-5 bg-gradient-to-br from-[#58CC02]/10 to-transparent border border-[#58CC02]/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#58CC02]/20 flex items-center justify-center">
            <Zap size={18} className="text-[#58CC02]" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#1A1A1A] dark:text-white text-sm">Test Your Knowledge</p>
            <p className="text-xs text-gray-500">Turn what you know into XP</p>
          </div>
          <Link href="/game" className="text-xs text-[#58CC02] hover:underline font-semibold">Play →</Link>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-[#D92525]/10 to-transparent border border-[#D92525]/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#D92525]/20 flex items-center justify-center">
            <BookOpen size={18} className="text-[#D92525]" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#1A1A1A] dark:text-white text-sm">Knowledge Hub</p>
            <p className="text-xs text-gray-500">Browse all verified articles</p>
          </div>
          <Link href="/textbook" className="text-xs text-[#D92525] hover:underline font-semibold">Browse →</Link>
        </Card>
      </div>
    </div>
    </>
  )
}

