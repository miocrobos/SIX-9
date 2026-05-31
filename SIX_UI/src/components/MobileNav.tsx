'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Home, Zap, Gamepad2, BookOpen, Trophy, StickyNote,
  Upload, MessageCircle, MoreHorizontal, X, ChevronRight,
  Flame, Star,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const bottomNavItems = [
  { href: '/dashboard',   label: 'Home',    icon: Home },
  { href: '/duoknow',     label: 'DuoKnow', icon: Zap },
  { href: '/game',        label: 'Game',    icon: Gamepad2 },
  { href: '/textbook',    label: 'Hub',     icon: BookOpen },
  { href: '/leaderboard', label: 'Ranks',   icon: Trophy },
]

const allNavItems = [
  { href: '/dashboard',   label: 'Dashboard',     icon: Home },
  { href: '/duoknow',     label: 'DuoKnow',       icon: Zap },
  { href: '/game',        label: 'Know Game',     icon: Gamepad2 },
  { href: '/textbook',    label: 'Knowledge Hub', icon: BookOpen },
  { href: '/leaderboard', label: 'Leaderboard',   icon: Trophy },
  { href: '/sixnote',     label: 'SIX Note',      icon: StickyNote },
]

const sixNoteSubItems = [
  { href: '/sixnote/upload', label: 'Upload Info',  icon: Upload },
  { href: '/sixnote/ask',    label: 'Ask Question', icon: MessageCircle },
]

export default function MobileNav() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* ── Bottom tab bar (mobile only) ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111111] border-t border-[#E8E8E8] dark:border-[#2A2A2A] flex items-stretch"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {bottomNavItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors active:scale-95
                ${active ? 'text-[#D92525]' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[9px] font-semibold tracking-wide uppercase">{label}</span>
            </Link>
          )
        })}

        {/* More → opens drawer */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-gray-400 dark:text-gray-500 transition-colors active:scale-95"
        >
          <MoreHorizontal size={21} strokeWidth={1.8} />
          <span className="text-[9px] font-semibold tracking-wide uppercase">More</span>
        </button>
      </nav>

      {/* ── Drawer (slide-in from left) ── */}
      {drawerOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Panel */}
          <aside
            className="fixed left-0 top-0 bottom-0 w-[280px] z-[70] bg-[#111111] flex flex-col shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Logo + close */}
            <div className="px-5 py-5 border-b border-[#2A2A2A] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#D92525] rounded-xl px-2 py-1.5 flex items-center justify-center">
                  <Image src="/six-logo.png" alt="SIX" width={48} height={13} priority className="brightness-0 invert" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-tight">Knowledge</p>
                  <p className="text-xs text-gray-500 leading-tight">Hub Platform</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#1A1A1A] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* User stats strip */}
            <div className="px-4 py-3 border-b border-[#2A2A2A] flex-shrink-0">
              <div className="flex items-center justify-between">
                <Badge variant="streak"><Flame size={12} /> 7 day streak</Badge>
                <Badge variant="xp"><Star size={10} /> 2,480 XP</Badge>
              </div>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {allNavItems.map(({ href, label, icon: Icon }) => {
                const active = isActive(href)
                const isSixNote = href === '/sixnote' && pathname.startsWith('/sixnote')
                const finalActive = active || isSixNote
                return (
                  <div key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group
                        ${finalActive
                          ? 'bg-six-gold/10 text-six-gold border border-six-gold/20'
                          : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-white'}`}
                    >
                      <Icon size={16} className={finalActive ? 'text-six-gold' : 'text-gray-500 group-hover:text-white'} />
                      <span className="flex-1">{label}</span>
                      {finalActive && <ChevronRight size={13} className="text-six-gold" />}
                    </Link>

                    {/* SIX Note sub-items */}
                    {isSixNote && (
                      <div className="ml-4 mt-1 space-y-0.5 border-l border-[#2A2A2A] pl-3">
                        {sixNoteSubItems.map(({ href: sub, label: sl, icon: SI }) => {
                          const subActive = pathname === sub
                          return (
                            <Link
                              key={sub}
                              href={sub}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all
                                ${subActive ? 'text-duo-purple bg-duo-purple/10' : 'text-gray-500 hover:text-white hover:bg-[#1A1A1A]'}`}
                            >
                              <SI size={13} />
                              {sl}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Connected Sources */}
            <div className="px-4 py-4 border-t border-[#2A2A2A] flex-shrink-0">
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-2.5 font-semibold">Connected</p>
              {[
                { name: 'Confluence', color: '#0052CC' },
                { name: 'SharePoint', color: '#107C41' },
                { name: 'MS Teams',   color: '#6264A7' },
                { name: 'Documents',  color: '#D92525' },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-2 py-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-gray-400">{s.name}</span>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-duo-green animate-pulse" />
                </div>
              ))}
            </div>

            {/* User avatar */}
            <div className="px-4 py-4 border-t border-[#2A2A2A] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-duo-purple to-duo-blue flex items-center justify-center text-xs font-bold text-white">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">Jan Doe</p>
                  <p className="text-xs text-gray-500 truncate">Legal &amp; Compliance</p>
                </div>
                <ChevronRight size={14} className="text-gray-600" />
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
