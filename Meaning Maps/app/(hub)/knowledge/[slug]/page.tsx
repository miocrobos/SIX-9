import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, FileText } from "lucide-react"
import { getKnowledgeDocBySlug } from "@/lib/resources"
import { getOrCreateDocSummary, searchKnowledgeSegments } from "@/lib/knowledge"
import { KnowledgeChat } from "@/components/knowledge/knowledge-chat"
import { prisma } from "@/lib/prisma"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const doc = await getKnowledgeDocBySlug(slug)
  return { title: doc ? `${doc.title} · Knowledge · Six Sense` : "Not Found" }
}

export default async function KnowledgeDetailPage({ params }: PageProps) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { slug } = await params
  const doc = await getKnowledgeDocBySlug(slug)
  if (!doc) notFound()

  // Get segments for summary generation
  const segments = await prisma.knowledgeSegment
    .findMany({
      where: { docId: doc.id },
      orderBy: { segmentIndex: "asc" },
      take: 10,
      select: { content: true },
    })
    .then((rows) => rows.map((r) => r.content))

  const summary = await getOrCreateDocSummary(doc.id, segments)

  return (
    <div className="flex h-[calc(100vh-3rem)] overflow-hidden">
      {/* Left: Document info + PDF embed */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border-default overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border-default shrink-0">
          <Link
            href="/knowledge"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-text-primary truncate">{doc.title}</h1>
            <p className="text-xs text-text-muted">{doc.author}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Cover + summary */}
          <div className="flex gap-6">
            <div className="shrink-0 w-24 h-36 bg-bg-elevated rounded-xl overflow-hidden border border-border-default flex items-center justify-center">
              {doc.coverUrl ? (
                <Image
                  src={doc.coverUrl}
                  alt={doc.title}
                  width={96}
                  height={144}
                  className="object-cover w-full h-full"
                />
              ) : (
                <FileText className="h-8 w-8 text-text-faint" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Summary
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">{summary}</p>
            </div>
          </div>

          {/* PDF embed */}
          <div className="rounded-2xl border border-border-default overflow-hidden">
            <iframe
              src={`${doc.fileUrl}#toolbar=0`}
              className="w-full h-[600px]"
              title={doc.title}
            />
          </div>
        </div>
      </div>

      {/* Right: AI Chat */}
      <div className="w-80 shrink-0 flex flex-col">
        <KnowledgeChat docId={doc.id} docTitle={doc.title} />
      </div>
    </div>
  )
}
