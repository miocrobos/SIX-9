import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getKnowledgeDocBySlug } from "@/lib/resources"
import { KnowledgeVapiControls } from "@/components/knowledge/knowledge-vapi-controls"

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

  return (
    <div className="book-page-container min-h-[calc(100vh-3rem)] relative">
      <Link href="/knowledge" className="back-btn-floating">
        <ArrowLeft className="size-6 text-[#212a3b] dark:text-white" />
      </Link>

      <KnowledgeVapiControls
        id={doc.id}
        title={doc.title}
        author={doc.author}
        persona={doc.persona ?? ""}
        fileUrl={doc.fileUrl ?? ""}
        coverUrl={doc.coverUrl ?? null}
        slug={doc.slug}
      />
    </div>
  )
}
