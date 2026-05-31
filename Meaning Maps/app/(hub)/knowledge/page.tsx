import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { getAllKnowledgeDocs } from "@/lib/resources"
import { KnowledgeCard } from "@/components/knowledge/knowledge-card"

export const metadata = { title: "Knowledge · Six Sense" }

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function KnowledgePage({ searchParams }: PageProps) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { q } = await searchParams
  const docs = await getAllKnowledgeDocs(q)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Recent Knowledge</h1>
          <p className="text-text-muted text-sm mt-1">
            Documents uploaded and processed by your team
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <form className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by title or source…"
              className="pl-9 pr-4 py-2 text-sm bg-bg-surface border border-border-default rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary/60 w-56 transition-colors"
            />
          </form>
          <Link
            href="/knowledge/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Upload
          </Link>
        </div>
      </div>

      {/* Grid */}
      {docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 rounded-2xl bg-bg-elevated flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-text-faint" />
          </div>
          <p className="text-text-primary font-semibold mb-2">
            {q ? "No documents found" : "No knowledge uploaded yet"}
          </p>
          <p className="text-sm text-text-muted mb-6">
            {q
              ? "Try a different search term."
              : "Upload a PDF to get started."}
          </p>
          {!q && (
            <Link
              href="/knowledge/upload"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Upload your first document
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
          {docs.map((doc) => (
            <KnowledgeCard
              key={doc.id}
              title={doc.title}
              author={doc.author}
              slug={doc.slug}
              coverUrl={doc.coverUrl}
            />
          ))}
        </div>
      )}
    </div>
  )
}
