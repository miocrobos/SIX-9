'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Zap, Gamepad2, BookOpen, StickyNote, ChevronLeft, Flame, Star } from 'lucide-react'
import BranchSelector from '@/components/BranchSelector'
import ThemeToggle from '@/components/ThemeToggle'
import { Badge } from '@/components/ui/badge'
// Routes that belong to each mode
const SIX_NOTE_ROUTES = ['/sixnote', '/textbook', '/branch']
const DUO_KNOW_ROUTES = ['/duoknow', '/game', '/leaderboard', '/dashboard']

const sixNoteNavItems = [
  { href: '/textbook', label: 'Knowledge Hub', icon: BookOpen },
  { href: '/sixnote',  label: 'SIX Note',      icon: StickyNote },
]

const duoKnowNavItems = [
  { href: '/duoknow',     label: 'DuoKnow',    icon: Zap },
  { href: '/game',        label: 'Know Game',  icon: Gamepad2 },
]

export default function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const inSixNoteMode = SIX_NOTE_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))
  const navItems = inSixNoteMode ? sixNoteNavItems : duoKnowNavItems

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <header
      className="sticky top-0 z-50 bg-white dark:bg-black border-b border-[#E8E8E8] dark:border-[#1f1f1f]"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center gap-4">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-[#D92525] dark:hover:text-[#D92525] transition-colors flex-shrink-0 text-sm font-semibold"
          title="Go back"
        >
          <ChevronLeft size={16} />
        </button>

        {/* SIX Logo → landing */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 border-r border-[#E8E8E8] dark:border-[#1f1f1f] pr-4">
          <Image src="/six-logo.png" alt="SIX" width={52} height={14} priority style={{ filter: 'brightness(0) saturate(100%) invert(19%) sepia(100%) saturate(5000%) hue-rotate(353deg) brightness(85%)' }} />
        </Link>

        {/* Mode-specific nav links */}
        <nav className="flex items-center gap-0.5 overflow-x-auto flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all flex-shrink-0
                  ${active
                    ? 'bg-[#D92525]/10 dark:bg-[#D92525]/20 text-[#D92525] font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-[#F5F5F7] dark:hover:bg-[#111] hover:text-[#1A1A1A] dark:hover:text-white font-semibold'
                  }`}
              >
                <Icon size={13} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right-side controls — context-specific */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {inSixNoteMode ? (
            <>
              {/* Branch selector only in SIX Notes mode */}
              <BranchSelector />

              {/* Switch to DuoKnow */}
              <Link
                href="/duoknow"
                title="Switch to DuoKnow"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-[#F5F5F7] dark:hover:bg-[#111] hover:text-[#D92525] dark:hover:text-[#D92525] transition-all border border-[#E8E8E8] dark:border-[#1f1f1f]"
              >
                <Zap size={13} />
                DuoKnow
              </Link>
            </>
          ) : (
            <>
              {/* XP and Streaks only in DuoKnow mode */}
              <Badge variant="streak"><Flame size={11} /> 7</Badge>
              <Badge variant="xp"><Star size={11} /> 2,480 XP</Badge>

              {/* Switch to SIX Notes */}
              <Link
                href="/sixnote"
                title="Switch to SIX Note"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-[#F5F5F7] dark:hover:bg-[#111] hover:text-[#D92525] dark:hover:text-[#D92525] transition-all border border-[#E8E8E8] dark:border-[#1f1f1f]"
              >
                <StickyNote size={13} />
                SIX Note
              </Link>
            </>
          )}

          {/* Dark / light mode toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
