import { SIX_BRANCHES, BranchNote, SixBranch } from './branches'

export interface KnowledgeResult {
  note: BranchNote
  branch: SixBranch
  relevanceScore: number
}

export interface NoteReference {
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

const BRANCH_COLORS: Record<string, string> = {
  CH: '#D92525',
  ES: '#FF6B00',
  ZA: '#107C41',
  AE: '#0052CC',
  SG: '#8B5CF6',
}

export function branchColor(code: string): string {
  return BRANCH_COLORS[code] ?? '#6B7280'
}

/**
 * Find relevant knowledge base articles for a given query using keyword matching.
 * Returns up to maxResults results sorted by relevance score.
 */
export function findRelevantKnowledge(query: string, maxResults = 6): KnowledgeResult[] {
  const terms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2)

  if (terms.length === 0) return []

  const results: KnowledgeResult[] = []

  for (const branch of SIX_BRANCHES) {
    for (const note of branch.notes) {
      let score = 0

      const searchableFields = [
        note.title,
        note.excerpt,
        note.author,
        note.dept,
        note.type,
        ...note.tags,
        ...note.focusArea,
        ...note.sources,
        branch.name,
        branch.city,
        ...branch.focus,
        branch.description,
      ]

      const searchable = searchableFields.join(' ').toLowerCase()

      for (const term of terms) {
        const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        const matches = (searchable.match(regex) || []).length
        // Boost title/tag matches
        const titleMatches = (note.title.toLowerCase().match(regex) || []).length
        const tagMatches = note.tags.join(' ').toLowerCase().match(regex)?.length ?? 0
        score += matches + titleMatches * 2 + tagMatches * 1.5
      }

      if (score > 0) {
        results.push({ note, branch, relevanceScore: score })
      }
    }
  }

  return results
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults)
}

/**
 * Format found knowledge results into a context string for the AI prompt.
 */
export function buildKnowledgeContext(results: KnowledgeResult[]): string {
  if (results.length === 0) return ''

  return results
    .map(
      ({ note, branch }) => `Article ID: ${note.id}
Title: ${note.title}
Branch: ${branch.name} (${branch.city})
Author: ${note.author} — ${note.dept}
Type: ${note.type}
Tags: ${note.tags.join(', ')}
Verified by SME: ${note.verified ? 'Yes' : 'Pending verification'}
Content Summary: ${note.excerpt}
Internal Sources: ${note.sources.join('; ')}`
    )
    .join('\n\n---\n\n')
}

/**
 * Resolve a list of article IDs to full NoteReference objects.
 */
export function resolveReferences(ids: string[]): NoteReference[] {
  const refs: NoteReference[] = []
  for (const id of ids) {
    for (const branch of SIX_BRANCHES) {
      const note = branch.notes.find(n => n.id === id)
      if (note) {
        refs.push({
          id: note.id,
          title: note.title,
          author: note.author,
          branch: branch.name,
          branchCode: branch.code,
          verified: note.verified,
          color: branchColor(branch.code),
          dept: note.dept,
          type: note.type,
        })
        break
      }
    }
  }
  return refs
}
