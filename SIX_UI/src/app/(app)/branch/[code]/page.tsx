'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft, Building2, Users, MapPin, ExternalLink,
  CheckCircle, FileText, Link2, Database, Video, Globe2,
  ChevronRight, BookOpen, X
} from 'lucide-react'
import { SIX_BRANCHES, type BranchNote } from '@/lib/branches'

const typeColor: Record<string, string> = {
  Policy:       'bg-blue-50   text-blue-600   border-blue-100',
  Process:      'bg-green-50  text-green-600  border-green-100',
  Technical:    'bg-purple-50 text-purple-600 border-purple-100',
  Methodology:  'bg-amber-50  text-amber-600  border-amber-100',
  'Market Brief':'bg-cyan-50   text-cyan-600   border-cyan-100',
  'Q&A':        'bg-rose-50   text-rose-600   border-rose-100',
}

function sourceIcon(src: string) {
  if (src.startsWith('Confluence'))  return <Link2  size={11} className="text-[#0052CC]" />
  if (src.startsWith('SharePoint'))  return <Database size={11} className="text-[#107C41]" />
  if (src.startsWith('MS Teams') || src.startsWith('Teams')) return <Video size={11} className="text-[#6264A7]" />
  if (src.startsWith('Meeting'))     return <Video size={11} className="text-orange-400" />
  return <FileText size={11} className="text-amber-500" />
}

/**
 * Renders a clickable card for a single branch note that shows its type, title, excerpt, author meta, sources, and verification state.
 *
 * @param note - The BranchNote to display (type, title, excerpt, author, date, verified flag, sources, etc.).
 * @param onOpen - Callback invoked with `note` when the card is clicked to open the note detail modal.
 * @returns The JSX element for the note card.
 */
function NoteCard({ note, onOpen }: { note: BranchNote; onOpen: (n: BranchNote) => void }) {
  return (
    <div
      onClick={() => onOpen(note)}
      className="bg-white border border-[#E8E8E8] rounded-2xl p-5 cursor-pointer hover:border-[#CCC] hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeColor[note.type] ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}>
          {note.type}
        </span>
        {note.verified && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex-shrink-0">
            <CheckCircle size={9} /> Verified
          </span>
        )}
      </div>

      <h3 className="font-bold text-sm text-[#1A1A1A] dark:text-white leading-snug mb-2 group-hover:text-[#D92525] transition-colors">
        {note.title}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{note.excerpt}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#D92525]/10 flex items-center justify-center text-[9px] font-bold text-[#D92525]">
            {note.author.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">{note.author}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[11px] text-gray-400">{note.date}</span>
        </div>
        <ChevronRight size={13} className="text-gray-300 group-hover:text-[#D92525] transition-colors" />
      </div>

      {/* Source chips */}
      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#F0F0F0]">
        {note.sources.map(s => (
          <span key={s} className="flex items-center gap-1 text-[10px] text-gray-400 bg-[#F7F7F7] px-2 py-0.5 rounded-full">
            {sourceIcon(s)}
            {s.split(':')[0]}
          </span>
        ))}
      </div>
    </div>
  )
}

function NoteModal({ note, onClose }: { note: BranchNote; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-xl overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.2)', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#D92525] px-6 py-5 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20 mb-2`}>
              {note.type}
            </span>
            <h2 className="text-white font-bold text-lg leading-snug">{note.title}</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors flex-shrink-0 mt-0.5">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">{note.excerpt}</p>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-[#D92525]/10 flex items-center justify-center text-[9px] font-bold text-[#D92525]">
                {note.author.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <span className="font-medium text-gray-600">{note.author}</span>
            </div>
            <span>·</span>
            <span>{note.dept}</span>
            <span>·</span>
            <span>{note.date}</span>
            {note.verified && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle size={11} /> Verified
                </span>
              </>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map(t => (
              <span key={t} className="text-[11px] font-bold text-[#D92525] bg-[#FDF0F0] px-2.5 py-0.5 rounded-full border border-red-100">
                {t}
              </span>
            ))}
          </div>

          {/* Sources */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Sources</p>
            <div className="space-y-1.5">
              {note.sources.map(s => (
                <div key={s} className="flex items-center gap-2 text-xs text-gray-500 bg-[#F7F7F7] px-3 py-2 rounded-lg">
                  {sourceIcon(s)}
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Render the branch details page with metadata, filterable notes list, and a note detail modal.
 *
 * Loads the branch identified by the route `params.code`, manages the active filter and open-note state,
 * shows a fallback UI when the branch is not found, and renders notes (with filtering and a modal for details).
 *
 * @returns The JSX element for the branch page.
 */
export default function BranchPage() {
  const params = useParams()
  const router = useRouter()
  const code = (params.code as string).toUpperCase()
  const branch = SIX_BRANCHES.find(b => b.code === code)

  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [openNote, setOpenNote] = useState<BranchNote | null>(null)

  const NOTE_TYPES = ['Policy', 'Process', 'Technical', 'Methodology', 'Market Brief', 'Q&A']
  const isFocusFilter = activeFilter !== 'All' && !NOTE_TYPES.includes(activeFilter)

  if (!branch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Globe2 size={40} className="text-gray-300" />
        <p className="text-gray-500 font-bold">Branch not found</p>
        <button onClick={() => router.back()} className="text-[#D92525] font-bold text-sm hover:underline">
          ← Go back
        </button>
      </div>
    )
  }

  const allTypes = ['All', ...Array.from(new Set(branch.notes.map(n => n.type)))]
  const filtered = activeFilter === 'All'
    ? branch.notes
    : isFocusFilter
      ? branch.notes.filter(n => n.focusArea.includes(activeFilter))
      : branch.notes.filter(n => n.type === activeFilter)

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-8" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <button onClick={() => router.push('/dashboard')} className="hover:text-[#D92525] transition-colors font-medium">
            Dashboard
          </button>
          <ChevronRight size={12} />
          <button onClick={() => router.back()} className="hover:text-[#D92525] transition-colors font-medium">
            Branches
          </button>
          <ChevronRight size={12} />
          <span className="text-[#D92525] font-bold">{branch.city}</span>
        </div>

        {/* ── Hero banner ─────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden mb-8 border border-[#E8E8E8]" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {/* Red top strip */}
          <div className="bg-[#D92525] px-8 py-6">
            <div className="flex items-center gap-5">
              {/* Flag */}
              <div className="rounded-xl overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0" style={{ width: 80, height: 56 }}>
                <Image src={branch.flag} alt={branch.name} width={80} height={56} className="object-cover w-full h-full" unoptimized />
              </div>
              {/* Titles */}
              <div className="flex-1 min-w-0">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">SIX Group Branch</p>
                <h1 className="text-white font-bold text-3xl leading-none" style={{ letterSpacing: '-0.025em' }}>
                  {branch.city}
                  <span className="text-white/60 text-xl font-normal ml-3">{branch.name}</span>
                </h1>
              </div>
              {/* Back */}
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-bold transition-colors flex-shrink-0"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>
          </div>

          {/* Info row */}
          <div className="bg-white px-8 py-6 grid md:grid-cols-3 gap-6">
            {/* Description */}
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 leading-relaxed">{branch.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {branch.focus.map(f => {
                  const isActive = activeFilter === f
                  const hasNotes = branch.notes.some(n => n.focusArea.includes(f))
                  return (
                    <button
                      key={f}
                      onClick={() => {
                        setActiveFilter(isActive ? 'All' : f)
                        if (!isActive) {
                          setTimeout(() => {
                            document.getElementById('branch-notes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }, 50)
                        }
                      }}
                      className="text-xs font-bold px-3 py-1 rounded-full border transition-all"
                      style={{
                        background: isActive ? '#D92525' : '#FDF0F0',
                        color: isActive ? '#fff' : '#D92525',
                        borderColor: isActive ? '#D92525' : '#FECACA',
                        cursor: hasNotes ? 'pointer' : 'default',
                        opacity: hasNotes ? 1 : 0.5,
                      }}
                      title={hasNotes ? `Filter by ${f}` : 'No notes in this area yet'}
                    >
                      {f}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-[#F7F7F7] rounded-xl px-4 py-3">
                <Building2 size={15} className="text-[#D92525] flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Established</p>
                  <p className="text-sm font-bold text-[#1A1A1A] dark:text-white">{branch.established}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#F7F7F7] rounded-xl px-4 py-3">
                <Users size={15} className="text-[#D92525] flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Headcount</p>
                  <p className="text-sm font-bold text-[#1A1A1A] dark:text-white">{branch.headcount}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-[#F7F7F7] rounded-xl px-4 py-3">
                <MapPin size={15} className="text-[#D92525] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 leading-relaxed">{branch.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Notes & Information ─────────────────────────────── */}
        <div id="branch-notes" className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-[#D92525]" />
            <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white">Branch Notes & Information</h2>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {branch.notes.length}
            </span>
          </div>
          <a
            href={branch.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-[#D92525] hover:underline"
          >
            Official site <ExternalLink size={11} />
          </a>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {isFocusFilter && (
            <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#D92525] bg-[#FDF0F0] px-3 py-1.5 rounded-lg border border-red-100">
              {activeFilter}
              <button
                onClick={() => setActiveFilter('All')}
                className="ml-1 hover:text-[#B01A1A] transition-colors"
                title="Clear focus filter"
              >
                <X size={11} />
              </button>
            </span>
          )}
          {allTypes.map(t => (
            <button
              key={t}
              onClick={() => setActiveFilter(t)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: !isFocusFilter && activeFilter === t ? '#D92525' : '#fff',
                color:      !isFocusFilter && activeFilter === t ? '#fff'    : '#666',
                border:     `1.5px solid ${!isFocusFilter && activeFilter === t ? '#D92525' : '#E0E0E0'}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Note cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText size={32} className="mb-3 opacity-30" />
            <p className="text-sm font-bold">No notes in this category yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(note => (
              <NoteCard key={note.id} note={note} onOpen={setOpenNote} />
            ))}
          </div>
        )}
      </div>

      {/* Note detail modal */}
      {openNote && <NoteModal note={openNote} onClose={() => setOpenNote(null)} />}
    </>
  )
}
