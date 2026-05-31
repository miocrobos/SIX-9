import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { getAccessibleDocument } from "@/lib/resources"
import { getCurrentProjectIdentity } from "@/lib/project-access"
import { DocumentWorkspaceClient } from "@/components/document/document-workspace-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return { title: "Document · Six Sense" }
  const identity = await getCurrentProjectIdentity()
  const doc = await getAccessibleDocument(id, userId, identity.primaryEmailAddress ?? "")
  return { title: doc ? `${doc.name} · Documents · Six Sense` : "Not Found" }
}

export default async function DocumentPage({ params }: PageProps) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { id } = await params
  const identity = await getCurrentProjectIdentity()
  const doc = await getAccessibleDocument(id, userId, identity.primaryEmailAddress ?? "")
  if (!doc) notFound()

  return (
    <DocumentWorkspaceClient documentId={doc.id} documentName={doc.name} />
  )
}
