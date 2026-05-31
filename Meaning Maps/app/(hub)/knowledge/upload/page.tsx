import { KnowledgeUploadForm } from "@/components/knowledge/knowledge-upload-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Upload · Knowledge · Six Sense" }

export default function KnowledgeUploadPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link
        href="/knowledge"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Knowledge
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Upload a document</h1>
        <p className="text-text-muted text-sm">
          Upload a PDF to extract its knowledge, generate a summary, and make it queryable by Sense AI.
        </p>
      </div>

      <KnowledgeUploadForm />
    </div>
  )
}
