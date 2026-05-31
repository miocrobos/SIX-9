import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText, Plus } from "lucide-react"
import { getDocumentsForUser } from "@/lib/resources"
import { getCurrentProjectIdentity } from "@/lib/project-access"
import { DocumentCreateButton } from "@/components/document/document-create-button"

export const metadata = { title: "Documents · Six Sense" }

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date))
}

export default async function DocumentsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const identity = await getCurrentProjectIdentity()
  const { owned, shared } = await getDocumentsForUser(
    userId,
    identity.primaryEmailAddress ?? ""
  )

  const allDocs = [
    ...owned.map((d) => ({ ...d, shared: false })),
    ...shared.map((d) => ({ ...d, shared: true })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Documents</h1>
          <p className="text-text-muted text-sm mt-1">Collaborative rich-text documents</p>
        </div>
        <DocumentCreateButton />
      </div>

      {/* List */}
      {allDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 rounded-2xl bg-bg-elevated flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-text-faint" />
          </div>
          <p className="text-text-primary font-semibold mb-2">No documents yet</p>
          <p className="text-sm text-text-muted mb-6">
            Create your first collaborative document.
          </p>
          <DocumentCreateButton label="Create first document" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allDocs.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="group p-5 rounded-2xl bg-bg-surface border border-border-default hover:border-accent-primary/40 transition-all hover:shadow-sm"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-[rgba(100,87,249,0.12)] flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-accent-ai" />
                </div>
                {doc.shared && (
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-text-faint border border-border-subtle rounded-full px-2 py-0.5">
                    Shared
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 mb-1.5">
                {doc.name}
              </p>
              <p className="text-xs text-text-faint">{formatDate(doc.createdAt)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
