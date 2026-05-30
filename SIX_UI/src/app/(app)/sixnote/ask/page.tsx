'use client'
import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ArrowLeft, Send, MessageCircle, BookOpen, CheckCircle,
  ThumbsUp, ThumbsDown, Loader2, Sparkles, Paperclip,
  Mic, MicOff, X, AlertTriangle, ShieldCheck, Info,
} from 'lucide-react'

/* ── Types ──────────────────────────────────────────────── */
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
  mediaPreview?: string
  fileName?: string
  thinking?: boolean
  error?: boolean
}

/* ── Constants ──────────────────────────────────────────── */
const SUGGESTED = [
  'What is the process for handling a Tier-1 customer escalation?',
  'Summarise the Q4 regulatory reporting requirements.',
  'What data classification applies to client trade records?',
  'How does SIX BME Clearing handle CCP default procedures?',
  'What are the SDX digital asset services offered from Singapore?',
  'Explain the SIC interbank clearing system operated by SIX.',
]

const ALLOWED_FILE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'text/plain', 'text/csv',
]

const CONFIDENCE_CONFIG = {
  high: { label: 'High Confidence', color: '#107C41', bg: '#F0FBF0', icon: ShieldCheck },
  medium: { label: 'Medium Confidence', color: '#FF9600', bg: '#FFF7EB', icon: Info },
  low: { label: 'Low Confidence', color: '#D92525', bg: '#FDF0F0', icon: AlertTriangle },
}

/* ── Markdown renderer (safe subset) ───────────────────── */
function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1 mb-2">
          {items.map((item, j) => (
            <li key={j} className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
          ))}
        </ol>
      )
      continue
    }

    if (/^[-*]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s/, ''))
        i++
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1 mb-2">
          {items.map((item, j) => (
            <li key={j} className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
          ))}
        </ul>
      )
      continue
    }

    if (line.startsWith('### ')) {
      elements.push(
        <p key={i} className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-3 mb-1">
          {line.slice(4)}
        </p>
      )
      i++
      continue
    }

    if (line.trim() === '') {
      elements.push(<div key={i} className="h-1.5" />)
      i++
      continue
    }

    elements.push(
      <p key={i} className="text-sm text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />
    )
    i++
  }

  return elements
}

function inlineMd(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#1A1A1A] font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-[#D92525]">$1</code>')
}

/* ── Main page ───────────────────────────────────────────── */
export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({})
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingPreview, setPendingPreview] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)

  const endRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const hasSR =
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition)
    setSpeechSupported(hasSR)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert('Supported files: images (JPEG, PNG, GIF, WebP) and text/CSV files.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5 MB.')
      return
    }
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

  const clearFile = () => {
    setPendingFile(null)
    setPendingPreview(null)
  }

  const toggleVoice = useCallback(() => {
    type SR = typeof SpeechRecognition
    const SRClass =
      (typeof window !== 'undefined' &&
        (window.SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: SR }).webkitSpeechRecognition)) as SR | undefined

    if (!SRClass) return

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const recognition = new SRClass()
    recognition.lang = 'en-GB'
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('')
      setInput(transcript)
    }
    recognitionRef.current = recognition
    recognition.start()
  }, [isListening])

  const send = async (text?: string) => {
    const messageText = (text ?? input).trim()
    if (!messageText && !pendingFile) return
    if (loading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: messageText,
      mediaPreview: pendingPreview ?? undefined,
      fileName: pendingFile && !pendingFile.type.startsWith('image/') ? pendingFile.name : undefined,
    }
    const thinkingMsg: Message = { id: crypto.randomUUID(), role: 'assistant', text: '', thinking: true }

    setMessages(prev => [...prev, userMsg, thinkingMsg])
    setInput('')
    const fileToSend = pendingFile
    setPendingFile(null)
    setPendingPreview(null)
    setLoading(true)

    const history = messages
      .filter(m => !m.thinking && !m.error)
      .map(m => ({ role: m.role, content: m.text }))

    try {
      let response: Response
      if (fileToSend) {
        const formData = new FormData()
        formData.append('message', messageText)
        formData.append('history', JSON.stringify(history))
        formData.append('file', fileToSend)
        response = await fetch('/api/ask', { method: 'POST', body: formData })
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
            ? { ...m, thinking: false, error: true, text: `Unable to get a response: ${errMsg}. Please check your API key or try again.` }
            : m
        )
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>

      {/* Top bar */}
      <div className="px-6 py-3 border-b border-[#E8E8F0] dark:border-[#2a2a2a] flex items-center gap-4 shrink-0 bg-white dark:bg-black">
        <Link href="/sixnote" className="flex items-center gap-1.5 text-gray-500 hover:text-[#1A1A1A] text-sm transition-colors">
          <ArrowLeft size={15} /> SIX Note
        </Link>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-duo-purple" />
          <span className="text-sm font-bold text-[#1A1A1A]">Ask Question</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-xs bg-[#F0FBF0] text-[#107C41] border border-[#107C41]/20 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck size={11} /> Grounded in verified knowledge
          </span>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} className="text-xs text-gray-400 hover:text-[#D92525] transition-colors flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-duo-purple/15 border border-duo-purple/25 flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={28} className="text-duo-purple" />
              </div>
              <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">Ask the Knowledge Base</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Every answer is grounded in verified, attributed knowledge from SIX colleagues.
                Attach images or documents, or use voice input.
              </p>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold text-center">Suggested Questions</p>
            <div className="space-y-2">
              {SUGGESTED.map((q, i) => (
                <button key={i} onClick={() => send(q)}
                  className="w-full text-left p-4 rounded-xl bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] hover:border-duo-purple/40 hover:bg-[#EEE8F8] transition-all group text-sm text-gray-600 hover:text-[#1A1A1A]">
                  <span className="text-duo-purple mr-2 group-hover:mr-3 transition-all">→</span>{q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`max-w-2xl ${msg.role === 'user' ? 'ml-auto' : 'mx-auto w-full'}`}>
            {msg.role === 'user' ? (
              <div className="inline-block max-w-lg ml-auto">
                {msg.mediaPreview && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-duo-purple/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={msg.mediaPreview} alt="Attached" className="max-h-48 w-auto" />
                  </div>
                )}
                {msg.fileName && (
                  <div className="mb-2 flex items-center gap-2 px-3 py-2 bg-[#F5F5F7] dark:bg-[#111] rounded-lg border border-[#E8E8F0] dark:border-[#2a2a2a]">
                    <Paperclip size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-600 truncate">{msg.fileName}</span>
                  </div>
                )}
                {msg.text && (
                  <div className="bg-duo-purple/15 border border-duo-purple/25 rounded-2xl rounded-tr-md px-5 py-3">
                    <p className="text-sm text-[#1A1A1A]">{msg.text}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-duo-purple/15 border border-duo-purple/25 flex items-center justify-center">
                    <Sparkles size={13} className="text-duo-purple" />
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">SIX Knowledge AI</span>
                </div>

                {msg.thinking ? (
                  <div className="six-card p-5 flex items-center gap-3">
                    <Loader2 size={16} className="text-duo-purple animate-spin" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Searching knowledge base…</p>
                      <p className="text-xs text-gray-400">Referencing verified SIX articles</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`six-card p-5 ${msg.error ? 'border-[#D92525]/30 bg-[#FDF0F0]' : ''}`}>
                      <div className="space-y-1">{renderMarkdown(msg.text)}</div>
                    </div>

                    {msg.references && msg.references.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5 font-semibold">
                          <BookOpen size={11} /> References
                        </p>
                        <div className="space-y-1.5">
                          {msg.references.map(ref => (
                            <div key={ref.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#F8F8FA] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] hover:border-[#CCC] dark:hover:border-[#444] transition-all">
                              <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: ref.color }} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#1A1A1A] truncate">{ref.title}</p>
                                <p className="text-xs text-gray-500">{ref.author} · {ref.branch}</p>
                              </div>
                              {ref.verified && <CheckCircle size={12} className="text-[#107C41] mt-0.5 shrink-0" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.checks && !msg.error && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5 font-semibold">
                          <ShieldCheck size={11} /> Important Checks
                        </p>
                        <div className="rounded-xl border p-3 space-y-2"
                          style={{ borderColor: CONFIDENCE_CONFIG[msg.checks.confidence].color + '40', backgroundColor: CONFIDENCE_CONFIG[msg.checks.confidence].bg }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {(() => { const Icon = CONFIDENCE_CONFIG[msg.checks.confidence].icon; return <Icon size={13} style={{ color: CONFIDENCE_CONFIG[msg.checks.confidence].color }} /> })()}
                              <span className="text-xs font-semibold" style={{ color: CONFIDENCE_CONFIG[msg.checks.confidence].color }}>
                                {CONFIDENCE_CONFIG[msg.checks.confidence].label}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{msg.checks.sources_found} article{msg.checks.sources_found !== 1 ? 's' : ''} searched</span>
                          </div>
                          {msg.checks.caveat && (
                            <p className="text-xs text-gray-600 border-t border-black/5 pt-2">{msg.checks.caveat}</p>
                          )}
                          {msg.checks.needs_sme && (
                            <p className="text-xs flex items-center gap-1.5 text-[#FF9600] font-medium border-t border-black/5 pt-2">
                              <AlertTriangle size={11} /> Recommend SME verification before acting on this answer
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {!msg.error && (
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-xs text-gray-400">Was this helpful?</span>
                        <button onClick={() => setFeedback(p => ({ ...p, [msg.id]: 'up' }))}
                          className={`p-1.5 rounded-lg transition-all ${feedback[msg.id] === 'up' ? 'bg-[#107C41]/15 text-[#107C41]' : 'text-gray-400 hover:text-[#107C41] hover:bg-[#107C41]/10'}`}>
                          <ThumbsUp size={13} />
                        </button>
                        <button onClick={() => setFeedback(p => ({ ...p, [msg.id]: 'down' }))}
                          className={`p-1.5 rounded-lg transition-all ${feedback[msg.id] === 'down' ? 'bg-[#D92525]/15 text-[#D92525]' : 'text-gray-400 hover:text-[#D92525] hover:bg-[#D92525]/10'}`}>
                          <ThumbsDown size={13} />
                        </button>
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

      {/* Input area */}
      <div className="px-4 sm:px-8 pb-6 pt-3 shrink-0 bg-white dark:bg-black border-t border-[#E8E8F0] dark:border-[#2a2a2a]">
        <div className="max-w-2xl mx-auto">
          {pendingFile && (
            <div className="mb-2 flex items-center gap-2 p-2 bg-[#F5F5F7] dark:bg-[#111] rounded-lg border border-[#E8E8F0] dark:border-[#2a2a2a]">
              {pendingPreview
                ? <img src={pendingPreview} alt="" className="h-10 w-10 object-cover rounded" /> // eslint-disable-line @next/next/no-img-element
                : <Paperclip size={16} className="text-gray-400" />}
              <span className="text-xs text-gray-600 flex-1 truncate">{pendingFile.name}</span>
              <button onClick={clearFile} className="text-gray-400 hover:text-[#D92525] transition-colors"><X size={14} /></button>
            </div>
          )}

          <div className="flex items-end gap-2 rounded-2xl border border-[#E8E8F0] dark:border-[#2a2a2a] bg-[#F9F9FB] dark:bg-[#111] p-2 focus-within:border-duo-purple/40 focus-within:bg-white dark:focus-within:bg-[#1a1a1a] transition-all">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask anything about SIX knowledge…"
              disabled={loading}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-[#1A1A1A] placeholder-gray-400 focus:outline-none px-2 py-1.5 max-h-32 overflow-y-auto"
              style={{ scrollbarWidth: 'none' }}
            />
            <div className="flex items-center gap-1 shrink-0">
              <input ref={fileInputRef} type="file" accept={ALLOWED_FILE_TYPES.join(',')} onChange={handleFileChange} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} disabled={loading} title="Attach file"
                className="p-2 rounded-xl text-gray-400 hover:text-duo-purple hover:bg-duo-purple/10 transition-all disabled:opacity-40">
                <Paperclip size={16} />
              </button>
              {speechSupported && (
                <button onClick={toggleVoice} disabled={loading} title={isListening ? 'Stop recording' : 'Voice input'}
                  className={`p-2 rounded-xl transition-all disabled:opacity-40 ${isListening ? 'text-[#D92525] bg-[#D92525]/10 animate-pulse' : 'text-gray-400 hover:text-duo-purple hover:bg-duo-purple/10'}`}>
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              )}
              <button onClick={() => send()} disabled={loading || (!input.trim() && !pendingFile)}
                className="p-2 rounded-xl bg-duo-purple text-white hover:bg-[#B96FE8] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-2">
            Answers grounded in SIX internal knowledge · Always verify before acting
          </p>
        </div>
      </div>
    </div>
  )
}

