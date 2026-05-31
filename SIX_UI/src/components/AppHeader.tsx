'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Zap, Gamepad2, BookOpen, StickyNote, ChevronLeft, Flame, Star } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { Badge } from '@/components/ui/badge'

// Routes that belong to each mode
const SIX_NOTE_ROUTES = ['/sixnote', '/textbook', '/branch']

const sixNoteNavItems = [
  { href: '/textbook', label: 'Knowledge Hub', icon: BookOpen },
  { href: '/sixnote',  label: 'SIX Note',      icon: StickyNote },
]

const duoKnowNavItems = [
  { href: '/duoknow',     label: 'DuoKnow',   icon: Zap },
  { href: '/game',        label: 'Know Game', icon: Gamepad2 },
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
      className="sticky top-0 z-40 bg-white dark:bg-black border-b border-[#E8E8E8] dark:border-[#1f1f1f]"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07)', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-5 h-13 md:h-14 flex items-center gap-3 md:gap-4">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-[#D92525] dark:hover:text-[#D92525] transition-colors flex-shrink-0 text-sm font-semibold"
          title="Go back"
        >
          <ChevronLeft size={16} />
        </button>

        {/* SIX Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 border-r border-[#E8E8E8] dark:border-[#1f1f1f] pr-3 md:pr-4">
          <Image src="/Six-Sense.png" alt="SIX SENSE" width={110} height={26} priority />
        </Link>

        {/* Mode-specific nav links — desktop only */}
        <nav
          className="hidden md:flex items-center gap-0.5 overflow-x-auto flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors duration-200 flex-shrink-0
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

        {/* Mobile: spacer */}
        <div className="flex-1 md:hidden" />

        {/* Right-side controls */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          {inSixNoteMode ? (
            <>
              {/* Switch to DuoKnow — icon only on mobile */}
              <Link
                href="/duoknow"
                title="Switch to DuoKnow"
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-[#F5F5F7] dark:hover:bg-[#111] hover:text-[#D92525] dark:hover:text-[#D92525] transition-colors duration-200 border border-[#E8E8E8] dark:border-[#1f1f1f]"
              >
                <Zap size={14} />
                <span className="hidden md:inline">DuoKnow</span>
              </Link>
            </>
          ) : (
            <>
              {/* Streak badge — compact on mobile */}
              <Badge variant="streak" className="gap-1">
                <Flame size={11} />
                <span>7</span>
                <span className="hidden sm:inline"> streak</span>
              </Badge>
              <Badge variant="xp" className="gap-1">
                <Star size={11} />
                <span className="hidden sm:inline">2,480 </span>XP
              </Badge>

              {/* Switch to SIX Notes — icon only on mobile */}
              <Link
                href="/sixnote"
                title="Switch to SIX Note"
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-[#F5F5F7] dark:hover:bg-[#111] hover:text-[#D92525] dark:hover:text-[#D92525] transition-colors duration-200 border border-[#E8E8E8] dark:border-[#1f1f1f]"
              >
                <StickyNote size={14} />
                <span className="hidden md:inline">SIX Note</span>
              </Link>
            </>
          )}

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}