'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { ArrowLeft, Upload, FileText, X, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'

const departments = ['Legal & Compliance', 'Customer Service', 'Real-Time Services', 'Innovation Hub', 'Data Governance', 'Operations']
const contentTypes = ['Policy', 'Process / SOP', 'Technical Documentation', 'Interview / SME Notes', 'Meeting Notes', 'Research', 'Other']
const sources = [
  { id: 'confluence', label: 'Confluence', color: '#0052CC' },
  { id: 'sharepoint', label: 'SharePoint', color: '#107C41' },
  { id: 'teams', label: 'MS Teams', color: '#6264A7' },
  { id: 'email', label: 'Email', color: '#D92525' },
  { id: 'document', label: 'Original Document', color: '#888' },
]

type UploadFile = { name: string; size: number; type: string }
type Phase = 'form' | 'uploading' | 'success'

export default function UploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [dept, setDept] = useState('')
  const [contentType, setContentType] = useState('')
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [requestVerify, setRequestVerify] = useState(true)
  const [phase, setPhase] = useState<Phase>('form')
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files).map(f => ({ name: f.name, size: f.size, type: f.type }))
    setFiles(prev => [...prev, ...dropped])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const picked = Array.from(e.target.files).map(f => ({ name: f.name, size: f.size, type: f.type }))
    setFiles(prev => [...prev, ...picked])
  }

  const toggleSource = (id: string) =>
    setSelectedSources(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  const handleSubmit = () => {
    if (!title || !dept || !contentType) return
    setPhase('uploading')
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 18
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => setPhase('success'), 400)
      }
      setProgress(Math.min(p, 100))
    }, 200)
  }

  const fmt = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

  /* ── SUCCESS ── */
  if (phase === 'success') return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="six-card p-12 text-center bg-gradient-to-br from-duo-green/15 to-duo-blue/10 border border-duo-green/30">
        <div className="w-20 h-20 rounded-full bg-duo-green/20 border-2 border-duo-green flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-duo-green" />
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2">Upload Successful!</h2>
        <p className="text-gray-500 mb-2">Your knowledge is now queued for SME verification.</p>
        <p className="text-sm text-gray-500 mb-8">You'll be notified once {requestVerify ? 'a reviewer approves' : 'it goes live'} in the knowledge base.</p>
        <div className="six-card p-4 text-left mb-8">
          <p className="text-sm font-bold text-[#1A1A1A] mb-1">{title}</p>
          <p className="text-xs text-gray-500">{dept} · {contentType} · {files.length} file{files.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setPhase('form'); setFiles([]); setTitle(''); setDescription(''); setTags(''); setDept(''); setContentType(''); setSelectedSources([]); setProgress(0) }}
            className="flex-1 py-3 rounded-xl bg-[#F0F0F5] hover:bg-[#E8E8F0] text-gray-700 font-bold transition-all text-sm"
          >
            Upload Another
          </button>
          <Link href="/sixnote" className="flex-1 py-3 rounded-xl bg-duo-blue hover:brightness-110 text-white font-bold text-center transition-all text-sm flex items-center justify-center">
            Back to SIX Note
          </Link>
        </div>
      </div>
    </div>
  )

  /* ── UPLOADING ── */
  if (phase === 'uploading') return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="six-card p-12 text-center">
        <div className="text-5xl mb-6 animate-bounce">📤</div>
        <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">Uploading & Processing...</h2>
        <p className="text-gray-500 mb-8 text-sm">Extracting knowledge, tagging content, building index...</p>
        <div className="h-3 bg-[#E8E8F0] rounded-full overflow-hidden mb-3">
          <div className="h-full bg-duo-blue rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-duo-blue font-semibold">{Math.round(progress)}%</p>
      </div>
    </div>
  )

  const valid = title.length > 0 && dept.length > 0 && contentType.length > 0

  /* ── FORM ── */
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Link href="/sixnote" className="text-gray-500 hover:text-[#1A1A1A] text-sm transition-colors flex items-center gap-1">
          <ArrowLeft size={14} /> SIX Note
        </Link>
        <span className="text-gray-700">/</span>
        <span className="text-duo-blue text-sm font-semibold">Upload Information</span>
      </div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-duo-blue/20 flex items-center justify-center">
          <Upload size={20} className="text-duo-blue" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">Upload Information</h1>
          <p className="text-gray-500 text-sm">Share your expertise. Attribute it. Make it traceable.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Drag & Drop Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
            ${dragging ? 'border-duo-blue bg-duo-blue/10' : 'border-[#E8E8F0] dark:border-[#2a2a2a] hover:border-duo-blue/40 hover:bg-[#F5F5F7]'}`}
        >
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileInput} accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md" />
          <div className="text-4xl mb-3">📂</div>
          <p className="text-[#1A1A1A] font-semibold mb-1">Drop files here or click to browse</p>
          <p className="text-xs text-gray-500">PDF, Word, PowerPoint, Markdown, TXT · Max 50 MB per file</p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a]">
                <FileText size={16} className="text-duo-blue shrink-0" />
                <span className="text-sm text-[#1A1A1A] flex-1 truncate">{f.name}</span>
                <span className="text-xs text-gray-500 shrink-0">{fmt(f.size)}</span>
                <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-gray-600 hover:text-duo-red transition-colors ml-1">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">Title *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Q4 Regulatory Reporting Framework"
            className="w-full bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-[#1A1A1A] dark:text-white placeholder-gray-300
              focus:outline-none focus:border-duo-blue/60 text-sm transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="Brief summary of what this document covers..."
            className="w-full bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-[#1A1A1A] dark:text-white placeholder-gray-300
              focus:outline-none focus:border-duo-blue/60 text-sm transition-all resize-none"
          />
        </div>

        {/* Department + Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">Department *</label>
            <div className="relative">
              <select
                value={dept}
                onChange={e => setDept(e.target.value)}
                className="w-full appearance-none bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-[#1A1A1A] dark:text-white
                  focus:outline-none focus:border-duo-blue/60 text-sm transition-all cursor-pointer"
              >
                <option value="">Select department...</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">Content Type *</label>
            <div className="relative">
              <select
                value={contentType}
                onChange={e => setContentType(e.target.value)}
                className="w-full appearance-none bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-[#1A1A1A] dark:text-white
                  focus:outline-none focus:border-duo-blue/60 text-sm transition-all cursor-pointer"
              >
                <option value="">Select type...</option>
                {contentTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Source Attribution */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">Source Origin</label>
          <div className="flex flex-wrap gap-2">
            {sources.map(s => (
              <button
                key={s.id}
                onClick={() => toggleSource(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all
                  ${selectedSources.includes(s.id)
                    ? 'text-[#1A1A1A] border-transparent'
                    : 'text-gray-500 border-[#E8E8F0] dark:border-[#2a2a2a] hover:border-[#3A3A3A]'}`}
                style={selectedSources.includes(s.id) ? { backgroundColor: s.color + '33', borderColor: s.color + '88', color: s.color } : {}}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">Tags</label>
          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. FINMA, reporting, Q4, compliance (comma-separated)"
            className="w-full bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-[#1A1A1A] dark:text-white placeholder-gray-300
              focus:outline-none focus:border-duo-blue/60 text-sm transition-all"
          />
        </div>

        {/* Verification Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <AlertCircle size={16} className="text-duo-orange" />
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">Request SME Verification</p>
              <p className="text-xs text-gray-500">A subject-matter expert will review before publishing</p>
            </div>
          </div>
          <button
            onClick={() => setRequestVerify(v => !v)}
            className={`w-12 h-6 rounded-full transition-all relative ${requestVerify ? 'bg-duo-green' : 'bg-[#3A3A3A]'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${requestVerify ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!valid}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2
            ${valid
              ? 'bg-duo-blue hover:brightness-110 text-white shadow-[0_4px_0_#A01C1C] hover:shadow-[0_2px_0_#A01C1C] hover:translate-y-[2px]'
              : 'bg-[#E8E8F0] text-gray-400 cursor-not-allowed'}`}
        >
          <Upload size={20} /> Submit to Knowledge Base
        </button>
        {!valid && (
          <p className="text-xs text-center text-gray-600">Fill in Title, Department and Content Type to continue</p>
        )}
      </div>
    </div>
  )
}
