'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Sparkles, X, Send, Paperclip, Mic, MicOff,
  Loader2, BookOpen, CheckCircle, ShieldCheck, AlertTriangle, Info,
} from 'lucide-react'

interface Reference {
  id: string
  title: string
  author: string
  branch: string
  branchCode: string
  verified: boolean
  color: string
  dept: string
  type: string
}

interface Checks {
  confidence: 'high' | 'medium' | 'low'
  caveat: string
  needs_sme: boolean
  sources_found: number
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  references?: Reference[]
  checks?: Checks
  thinking?: boolean
  error?: boolean
}

const QUICK_STARTS = [
  'What services does SIX provide?',
  'How does SIX SDX work?',
  'Explain SIX clearing operations.',
]

const ALLOWED_FILE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'text/plain', 'text/csv',
]

const CONFIDENCE_CONFIG = {
  high: { label: 'High', color: '#107C41', bg: '#F0FBF0', icon: ShieldCheck },
  medium: { label: 'Medium', color: '#FF9600', bg: '#FFF7EB', icon: Info },
  low: { label: 'Low', color: '#D92525', bg: '#FDF0F0', icon: AlertTriangle },
}

function inlineMd(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#f1f1f1;padding:0 3px;border-radius:3px;font-size:11px">$1</code>')
}

export default function AIChatbox() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingPreview, setPendingPreview] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)

  const endRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    const hasSR =
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition)
    setSpeechSupported(hasSR)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!ALLOWED_FILE_TYPES.includes(file.type)) return
    if (file.size > 5 * 1024 * 1024) { alert('Max 5 MB'); return }
    setPendingFile(file)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = ev => setPendingPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setPendingPreview(null)
    }
    e.target.value = ''
  }

  const toggleVoice = useCallback(() => {
    type SR = typeof SpeechRecognition
    const SRClass =
      (typeof window !== 'undefined' &&
        (window.SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: SR }).webkitSpeechRecognition)) as SR | undefined
    if (!SRClass) return
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return }
    const r = new SRClass()
    r.lang = 'en-GB'; r.interimResults = true; r.maxAlternatives = 1
    r.onstart = () => setIsListening(true)
    r.onend = () => setIsListening(false)
    r.onerror = () => setIsListening(false)
    r.onresult = (event: SpeechRecognitionEvent) => {
      setInput(Array.from(event.results).map(r => r[0].transcript).join(''))
    }
    recognitionRef.current = r
    r.start()
  }, [isListening])

  const send = async (text?: string) => {
    const messageText = (text ?? input).trim()
    if (!messageText && !pendingFile) return
    if (loading) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: messageText }
    const thinkingMsg: Message = { id: crypto.randomUUID(), role: 'assistant', text: '', thinking: true }

    setMessages(prev => [...prev, userMsg, thinkingMsg])
    setInput('')
    const fileToSend = pendingFile
    setPendingFile(null); setPendingPreview(null)
    setLoading(true)

    const history = messages
      .filter(m => !m.thinking && !m.error)
      .map(m => ({ role: m.role, content: m.text }))

    try {
      let response: Response
      if (fileToSend) {
        const fd = new FormData()
        fd.append('message', messageText)
        fd.append('history', JSON.stringify(history))
        fd.append('file', fileToSend)
        response = await fetch('/api/ask', { method: 'POST', body: fd })
      } else {
        response = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageText, history }),
        })
      }
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Request failed')
      setMessages(prev =>
        prev.map(m =>
          m.thinking
            ? { ...m, thinking: false, text: data.answer, references: data.references ?? [], checks: data.checks }
            : m
        )
      )
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error'
      setMessages(prev =>
        prev.map(m =>
          m.thinking
            ? { ...m, thinking: false, error: true, text: `Error: ${errMsg}` }
            : m
        )
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open SIX Knowledge AI"
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#D92525] text-white shadow-lg
          hover:bg-[#B81F1F] hover:shadow-xl transition-all duration-200 flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-[#D92525] focus:ring-offset-2"
        style={{ boxShadow: open ? 'none' : '0 4px 20px rgba(217,37,37,0.45)' }}
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-36 right-2 left-2 md:left-auto md:bottom-24 md:right-6 md:w-96 z-50 rounded-2xl bg-white dark:bg-[#0d0d0d] shadow-2xl border border-[#E8E8F0] dark:border-[#2a2a2a] flex flex-col overflow-hidden"
          style={{ height: 520, maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#E8E8F0] dark:border-[#2a2a2a] flex items-center gap-3 bg-white dark:bg-[#0d0d0d] shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#D92525]/10 border border-[#D92525]/20 flex items-center justify-center">
              <Sparkles size={15} className="text-[#D92525]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1A1A1A] dark:text-white">SIX Knowledge AI</p>
              <p className="text-xs text-gray-400">Grounded in verified SIX content</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white dark:text-white transition-colors p-1">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 text-center py-2">Ask me anything about SIX Group</p>
                {QUICK_STARTS.map((q, i) => (
                  <button key={i} onClick={() => send(q)}
                    className="w-full text-left text-xs p-3 rounded-xl bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] hover:border-[#D92525]/30 hover:bg-[#FDF5F5] transition-all text-gray-600 hover:text-[#1A1A1A] dark:hover:text-white dark:text-white">
                    <span className="text-[#D92525] mr-1.5">→</span>{q}
                  </button>
                ))}
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className={msg.role === 'user' ? 'flex justify-end' : ''}>
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] bg-[#D92525]/10 border border-[#D92525]/20 rounded-2xl rounded-tr-sm px-3 py-2">
                    <p className="text-sm text-[#1A1A1A] dark:text-white">{msg.text}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {msg.thinking ? (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F8F8FA] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a]">
                        <Loader2 size={13} className="text-[#D92525] animate-spin shrink-0" />
                        <p className="text-xs text-gray-500">Searching knowledge base…</p>
                      </div>
                    ) : (
                      <>
                        <div className={`p-3 rounded-xl text-sm text-gray-700 leading-relaxed ${msg.error ? 'bg-[#FDF0F0] border border-[#D92525]/30' : 'bg-[#F8F8FA] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a]'}`}
                          dangerouslySetInnerHTML={{ __html: inlineMd(msg.text) }} />

                        {msg.references && msg.references.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1"><BookOpen size={10} /> References</p>
                            <div className="space-y-1">
                              {msg.references.map(ref => (
                                <div key={ref.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a]">
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: ref.color }} />
                                  <span className="text-xs text-gray-700 truncate flex-1">{ref.title}</span>
                                  {ref.verified && <CheckCircle size={10} className="text-[#107C41] shrink-0" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {msg.checks && !msg.error && (
                          <div className="rounded-xl border p-2.5"
                            style={{ borderColor: CONFIDENCE_CONFIG[msg.checks.confidence].color + '40', backgroundColor: CONFIDENCE_CONFIG[msg.checks.confidence].bg }}>
                            <div className="flex items-center gap-1.5">
                              {(() => { const Icon = CONFIDENCE_CONFIG[msg.checks.confidence].icon; return <Icon size={11} style={{ color: CONFIDENCE_CONFIG[msg.checks.confidence].color }} /> })()}
                              <span className="text-xs font-semibold" style={{ color: CONFIDENCE_CONFIG[msg.checks.confidence].color }}>
                                {CONFIDENCE_CONFIG[msg.checks.confidence].label} Confidence
                              </span>
                              <span className="text-xs text-gray-400 ml-auto">{msg.checks.sources_found} sources</span>
                            </div>
                            {msg.checks.caveat && (
                              <p className="text-xs text-gray-600 mt-1.5 pt-1.5 border-t border-black/5">{msg.checks.caveat}</p>
                            )}
                            {msg.checks.needs_sme && (
                              <p className="text-xs text-[#FF9600] font-medium mt-1 flex items-center gap-1">
                                <AlertTriangle size={10} /> SME review recommended
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#E8E8F0] dark:border-[#2a2a2a] bg-white dark:bg-[#0d0d0d] shrink-0">
            {pendingFile && (
              <div className="mb-2 flex items-center gap-2 px-2 py-1.5 bg-[#F5F5F7] rounded-lg text-xs text-gray-500">
                {pendingPreview
                  ? <img src={pendingPreview} alt="" className="h-6 w-6 object-cover rounded" /> // eslint-disable-line @next/next/no-img-element
                  : <Paperclip size={11} />}
                <span className="flex-1 truncate">{pendingFile.name}</span>
                <button onClick={() => { setPendingFile(null); setPendingPreview(null) }} className="text-gray-400 hover:text-red-500">
                  <X size={11} />
                </button>
              </div>
            )}
            <div className="flex items-end gap-1.5 rounded-xl border border-[#E8E8F0] dark:border-[#2a2a2a] bg-[#F9F9FB] dark:bg-[#111] px-3 py-2 focus-within:border-[#D92525]/30 focus-within:bg-white dark:focus-within:bg-[#1a1a1a] transition-all">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Ask about SIX…"
                disabled={loading}
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-[#1A1A1A] dark:text-white placeholder-gray-400 focus:outline-none max-h-20 overflow-y-auto"
                style={{ scrollbarWidth: 'none' }}
              />
              <div className="flex items-center gap-0.5 shrink-0">
                <input ref={fileInputRef} type="file" accept={ALLOWED_FILE_TYPES.join(',')} onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} disabled={loading} title="Attach file"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#D92525] hover:bg-[#D92525]/10 transition-all disabled:opacity-40">
                  <Paperclip size={14} />
                </button>
                {speechSupported && (
                  <button onClick={toggleVoice} disabled={loading}
                    className={`p-1.5 rounded-lg transition-all disabled:opacity-40 ${isListening ? 'text-[#D92525] bg-[#D92525]/10 animate-pulse' : 'text-gray-400 hover:text-[#D92525] hover:bg-[#D92525]/10'}`}>
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  </button>
                )}
                <button onClick={() => send()} disabled={loading || (!input.trim() && !pendingFile)}
                  className="p-1.5 rounded-xl bg-[#D92525] text-white hover:bg-[#B81F1F] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
