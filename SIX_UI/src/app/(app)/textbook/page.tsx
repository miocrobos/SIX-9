'use client'
import { useState } from 'react'
import {
  Search, Filter, CheckCircle, Clock, User, Tag,
  BookOpen, ChevronRight, ExternalLink, Star, AlertCircle,
  FileText, Video, Link2, Database, Eye, ThumbsUp, Shield, X
} from 'lucide-react'
import PageTransition from '@/components/PageTransition'
import BranchSelector from '@/components/BranchSelector'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'

interface Article {
  id: number
  title: string
  excerpt: string
  author: string
  dept: string
  date: string
  verified: boolean
  verifiedBy?: string
  type: string
  tags: string[]
  views: number
  helpful: number
  sources: string[]
  confidence: number
  category: string
}

const articles: Article[] = [
  {
    id: 1,
    title: 'Regulatory Reporting Requirements — MiFID II Transaction Reporting',
    excerpt: 'Comprehensive guide to transaction reporting obligations under MiFID II, including field mappings, submission timelines, and error correction procedures for SIX Financial Information clients.',
    author: 'Jacob Gertel', dept: 'Legal & Compliance', date: 'Dec 2025',
    verified: true, verifiedBy: 'Compliance Committee',
    type: 'Policy', tags: ['MiFID II', 'Regulatory', 'Reporting', 'Compliance'],
    views: 1247, helpful: 98, confidence: 97,
    sources: ['Confluence: Legal/Policies/MiFID', 'SharePoint: Compliance Docs Q4', 'MS Teams: Legal Channel'],
    category: 'Legal & Compliance'
  },
  {
    id: 2,
    title: 'Customer Escalation Matrix & Resolution Playbook',
    excerpt: 'Step-by-step escalation paths for Tier 1-3 customer issues. Covers SLA thresholds, escalation triggers, ownership handoff procedures, and resolution documentation standards.',
    author: 'Katharina Voegtle', dept: 'Customer Service Transformation', date: 'Nov 2025',
    verified: true, verifiedBy: 'Service Operations Board',
    type: 'Process', tags: ['SLA', 'Escalation', 'Customer', 'Process'],
    views: 892, helpful: 94, confidence: 95,
    sources: ['SharePoint: CS Playbooks', 'Confluence: Service/Escalation', 'Email Thread: CS_Transform_2025'],
    category: 'Customer Service'
  },
  {
    id: 3,
    title: 'Real-Time Data Feed Architecture & Latency SLAs',
    excerpt: 'Technical overview of SIX real-time market data infrastructure. Covers feed types, connectivity options, failover procedures, and contractual latency thresholds per service tier.',
    author: 'Mirko Silvestri', dept: 'Real-Time Services', date: 'Oct 2025',
    verified: true, verifiedBy: 'CTO Office',
    type: 'Technical', tags: ['Real-Time', 'Architecture', 'Data Feeds', 'SLA'],
    views: 634, helpful: 91, confidence: 93,
    sources: ['Confluence: Tech/Architecture', 'SharePoint: Infrastructure Docs', 'Meeting Transcript: RT_Services_Oct'],
    category: 'Real-Time Services'
  },
  {
    id: 4,
    title: 'SME Knowledge Capture Methodology — Innovation Hub',
    excerpt: 'Structured approach to extracting, contextualizing, and validating expert knowledge before employee transitions. Includes interview templates, traceability frameworks, and quality gates.',
    author: 'Jennifer Chang', dept: 'Innovation Hub', date: 'Jan 2026',
    verified: false,
    type: 'Methodology', tags: ['Knowledge Management', 'SME', 'Innovation', 'Process'],
    views: 431, helpful: 87, confidence: 78,
    sources: ['Confluence: Innovation/KM', 'Meeting Transcript: KM_Framework_Jan'],
    category: 'Innovation Hub'
  },
  {
    id: 5,
    title: 'Data Governance Framework — Quality & Stewardship',
    excerpt: 'Enterprise data governance policy covering data ownership, quality standards, stewardship roles, and access control matrices for all SIX Financial Information data assets.',
    author: 'Jacob Gertel', dept: 'Legal & Compliance', date: 'Sep 2025',
    verified: true, verifiedBy: 'Data Governance Council',
    type: 'Policy', tags: ['Data Governance', 'Quality', 'Access Control', 'Policy'],
    views: 1089, helpful: 96, confidence: 99,
    sources: ['SharePoint: Governance/Policies', 'Confluence: Data/Governance', 'PDF: DG_Framework_v3.2'],
    category: 'Legal & Compliance'
  },
  {
    id: 6,
    title: 'Client Onboarding SOP — New Account Setup',
    excerpt: 'End-to-end standard operating procedure for onboarding new institutional clients. Covers KYC requirements, system provisioning steps, welcome communications, and 30-day check-in protocols.',
    author: 'Magdalena Tuta', dept: 'Innovation Hub', date: 'Feb 2026',
    verified: false,
    type: 'Process', tags: ['Onboarding', 'KYC', 'Client', 'SOP'],
    views: 278, helpful: 82, confidence: 74,
    sources: ['Confluence: CS/Onboarding', 'Teams: Onboarding_Channel'],
    category: 'Customer Service'
  },
]

const categories = ['All', 'Legal & Compliance', 'Customer Service', 'Real-Time Services', 'Innovation Hub']
const types = ['All', 'Policy', 'Process', 'Technical', 'Methodology']

const sourceIcon = (src: string) => {
  if (src.startsWith('Confluence')) return <Link2 size={11} className="text-[#0052CC]" />
  if (src.startsWith('SharePoint')) return <Database size={11} className="text-[#107C41]" />
  if (src.startsWith('MS Teams') || src.startsWith('Teams') || src.startsWith('Email')) return <Video size={11} className="text-[#6264A7]" />
  if (src.startsWith('Meeting')) return <Video size={11} className="text-[#FF9600]" />
  return <FileText size={11} className="text-[#D92525]" />
}

const typeColor: Record<string, string> = {
  Policy: 'bg-[#D92525]/10 text-[#D92525]',
  Process: 'bg-[#58CC02]/10 text-[#58CC02]',
  Technical: 'bg-[#CE82FF]/10 text-[#CE82FF]',
  Methodology: 'bg-[#D92525]/10 text-[#D92525]',
}

function ArticleCard({ article, onOpen }: { article: Article; onOpen: (a: Article) => void }) {
  return (
    <Card
      onClick={() => onOpen(article)}
      className="p-5 cursor-pointer hover:border-[#CCC] hover:bg-[#F8F8FA] transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[article.type]}`}>
            {article.type}
          </span>
          {article.verified
            ? <span className="flex items-center gap-1 text-xs text-[#58CC02] font-medium">
                <Shield size={11} /> Verified
              </span>
            : <span className="flex items-center gap-1 text-xs text-[#FF9600] font-medium">
                <AlertCircle size={11} /> Pending Review
              </span>
          }
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Star size={11} className="text-[#D92525]" />
          <span className="text-[#D92525] font-semibold">{article.confidence}%</span>
          <span className="ml-1">confidence</span>
        </div>
      </div>

      <h3 className="font-bold text-[#1A1A1A] dark:text-white text-sm mb-2 group-hover:text-[#D92525] transition-colors leading-snug">
        {article.title}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{article.excerpt}</p>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D92525] to-[#CE82FF] flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold">{article.author.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs text-[#1A1A1A] dark:text-white font-medium">{article.author}</span>
          <span className="text-xs text-gray-600"> · {article.dept}</span>
        </div>
        <span className="text-xs text-gray-600">{article.date}</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {article.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs bg-[#222] text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>

      {/* Sources */}
      <div className="border-t border-[#E8E8F0] dark:border-[#2a2a2a] pt-3">
        <p className="text-xs text-gray-600 mb-1.5 flex items-center gap-1"><Link2 size={10} /> Sources</p>
        <div className="flex flex-wrap gap-1.5">
          {article.sources.map(src => (
            <span key={src} className="flex items-center gap-1 text-xs bg-[#222] text-gray-500 px-2 py-0.5 rounded-full">
              {sourceIcon(src)} {src.split(':')[0]}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3">
        <span className="flex items-center gap-1 text-xs text-gray-600"><Eye size={11} /> {article.views}</span>
        <span className="flex items-center gap-1 text-xs text-gray-600"><ThumbsUp size={11} /> {article.helpful}% helpful</span>
        <span className="ml-auto text-xs text-[#D92525] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Read <ChevronRight size={11} />
        </span>
      </div>
    </Card>
  )
}

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[article.type]}`}>{article.type}</span>
            {article.verified
              ? <span className="flex items-center gap-1 text-xs text-[#58CC02] font-medium"><Shield size={11} /> Verified by {article.verifiedBy}</span>
              : <span className="flex items-center gap-1 text-xs text-[#FF9600] font-medium"><AlertCircle size={11} /> Pending Review</span>
            }
          </div>
          <DialogTitle className="text-xl font-black text-[#1A1A1A] dark:text-white leading-snug">{article.title}</DialogTitle>
        </DialogHeader>

          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#E8E8F0] dark:border-[#2a2a2a]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D92525] to-[#CE82FF] flex items-center justify-center">
              <span className="text-sm font-bold text-white">{article.author.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A] dark:text-white">{article.author}</p>
              <p className="text-xs text-gray-500">{article.dept} · {article.date}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <Star size={14} className="text-[#D92525]" />
              <span className="text-[#D92525] font-bold text-sm">{article.confidence}%</span>
              <span className="text-xs text-gray-500">confidence</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">{article.excerpt}</p>

          <div className="bg-[#F5F5F7] rounded-xl p-4 mb-4">
            <p className="text-xs font-bold text-[#1A1A1A] dark:text-white mb-3 flex items-center gap-1.5">
              <Shield size={13} className="text-[#D92525]" /> Knowledge Traceability
            </p>
            <div className="space-y-2">
              {article.sources.map((src, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-5 h-5 rounded bg-[#F0F0F5] flex items-center justify-center flex-shrink-0">
                    {sourceIcon(src)}
                  </div>
                  <span className="text-gray-500">{src}</span>
                  <ExternalLink size={10} className="text-gray-600 ml-auto" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {article.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-2.5 py-1 text-gray-500">
                <Tag size={9} className="inline mr-1" />{tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="six-red" className="flex-1 flex items-center justify-center gap-2">
              <BookOpen size={14} /> Read Full Article
            </Button>
            <Button variant="outline" className="flex items-center gap-2 px-4">
              <ThumbsUp size={14} /> Helpful
            </Button>
          </div>
      </DialogContent>
    </Dialog>
  )
}

export default function TextbookPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [type, setType] = useState('All')
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [openArticle, setOpenArticle] = useState<Article | null>(null)
  const [transitionDone, setTransitionDone] = useState(false)

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
      || a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      || a.author.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || a.category === category
    const matchType = type === 'All' || a.type === type
    const matchVerified = !onlyVerified || a.verified
    return matchSearch && matchCat && matchType && matchVerified
  })

  return (
    <>
      {!transitionDone && (
        <PageTransition
          Icon={BookOpen}
          quote="Every answer starts with the right question."
          onComplete={() => setTransitionDone(true)}
        />
      )}
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {openArticle && <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white">Knowledge Hub</h1>
        <p className="text-gray-500 mt-1">Transparent, traceable expert knowledge — with full source attribution.</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6 overflow-x-auto pb-1">
        {[
          { label: 'Total Articles', value: articles.length, color: 'text-[#D92525]' },
          { label: 'SME Verified', value: articles.filter(a => a.verified).length, color: 'text-[#58CC02]' },
          { label: 'Pending Review', value: articles.filter(a => !a.verified).length, color: 'text-[#FF9600]' },
          { label: 'Avg Confidence', value: `${Math.round(articles.reduce((s, a) => s + a.confidence, 0) / articles.length)}%`, color: 'text-[#D92525]' },
        ].map(s => (
          <Card key={s.label} className="px-4 py-2.5 flex items-center gap-2 flex-shrink-0">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles, authors, tags..."
            className="w-full bg-[#F5F5F7] dark:bg-[#111] border border-[#E8E8F0] dark:border-[#2a2a2a] rounded-xl pl-9 pr-4 py-2.5 text-sm
                       text-[#1A1A1A] dark:text-white placeholder-gray-300 focus:outline-none focus:border-[#D92525]/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <Filter size={14} className="text-gray-500" />
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all
                ${category === c ? 'bg-[#D92525] text-white' : 'bg-[#F5F5F7] dark:bg-[#111] text-gray-500 hover:text-[#1A1A1A] dark:hover:text-white dark:text-white dark:hover:text-white border border-[#E8E8F0] dark:border-[#2a2a2a]'}`}
            >
              {c === 'All' ? 'All Depts' : c.split(' ').slice(0, 1).join('') + (c.includes('&') ? ' & ' + c.split(' ').slice(-1) : '')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {types.slice(1).map(t => (
            <button
              key={t}
              onClick={() => setType(type === t ? 'All' : t)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all
                ${type === t ? `${typeColor[t]} border border-current` : 'bg-[#F5F5F7] dark:bg-[#111] text-gray-500 hover:text-[#1A1A1A] dark:hover:text-white dark:text-white dark:hover:text-white border border-[#E8E8F0] dark:border-[#2a2a2a]'}`}
            >
              {t}
            </button>
          ))}          
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium border transition-all whitespace-nowrap
              ${onlyVerified ? 'bg-[#58CC02]/10 text-[#58CC02] border-[#58CC02]/30' : 'bg-[#F5F5F7] dark:bg-[#111] text-gray-500 border-[#E8E8F0] dark:border-[#2a2a2a] hover:text-[#1A1A1A] dark:hover:text-white'}`}
          >
            <CheckCircle size={12} /> Verified only
          </button>          <BranchSelector />      
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500 mb-4">
        {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
        {(search || category !== 'All' || type !== 'All' || onlyVerified) && (
          <button
            onClick={() => { setSearch(''); setCategory('All'); setType('All'); setOnlyVerified(false) }}
            className="ml-2 text-[#D92525] hover:text-[#B01A1A]"
          >
            Clear filters
          </button>
        )}
      </p>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {filtered.map(article => (
          <ArticleCard key={article.id} article={article} onOpen={setOpenArticle} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No articles match your filters</p>
          <p className="text-sm mt-1">Try broadening your search</p>
        </div>
      )}
    </div>
    </>
  )
}
