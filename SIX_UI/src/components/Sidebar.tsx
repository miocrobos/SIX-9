'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  BookOpen, Trophy, Flame, Home,
  ChevronRight, Zap, Star, Gamepad2, StickyNote,
  Upload, MessageCircle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { href: '/dashboard',   label: 'Dashboard',      icon: Home },
  { href: '/game/play',   label: 'DuoKnow',        icon: Zap },
  { href: '/game',        label: 'Know Game',      icon: Gamepad2 },
  { href: '/textbook',    label: 'Knowledge Hub',  icon: BookOpen },
  { href: '/leaderboard', label: 'Leaderboard',    icon: Trophy },
  { href: '/sixnote',     label: 'SIX Note',       icon: StickyNote },
]

const sixNoteSubItems = [
  { href: '/sixnote/upload', label: 'Upload Info',    icon: Upload },
  { href: '/sixnote/ask',    label: 'Ask Question',   icon: MessageCircle },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#111111] border-r border-[#2A2A2A] flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="rounded-xl px-2 py-1.5 flex items-center justify-center gap-1.5">
            <Image src="/Six-Sense.png" alt="SIX SENSE" width={104} height={24} priority />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Knowledge</p>
            <p className="text-xs text-gray-500 leading-tight">Hub Platform</p>
          </div>
        </div>
      </div>

      {/* User Stats Strip */}
      <div className="px-4 py-3 border-b border-[#2A2A2A]">
        <div className="flex items-center justify-between">
          <Badge variant="streak"><Flame size={12} /> 7 day streak</Badge>
          <Badge variant="xp"><Star size={10} /> 2,480 XP</Badge>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          const isGameActive = href === '/game' && (pathname === '/game' || pathname.startsWith('/game/'))
          const isSixNoteActive = href === '/sixnote' && pathname.startsWith('/sixnote')
          const finalActive = active || isGameActive || isSixNoteActive
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
              {isSixNoteActive && (
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

      {/* Data Sources */}
      <div className="px-4 py-4 border-t border-[#2A2A2A]">
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-3 font-semibold">Connected Sources</p>
        {[
          { name: 'Confluence', color: '#0052CC', dot: true },
          { name: 'SharePoint', color: '#107C41', dot: true },
          { name: 'MS Teams', color: '#6264A7', dot: true },
          { name: 'Documents', color: '#D92525', dot: true },
        ].map(s => (
          <div key={s.name} className="flex items-center gap-2 py-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-400">{s.name}</span>
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-duo-green animate-pulse" />
          </div>
        ))}
      </div>

      {/* User avatar */}
      <div className="px-4 py-4 border-t border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-duo-purple to-duo-blue flex items-center justify-center text-xs font-bold">
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
  )
}
