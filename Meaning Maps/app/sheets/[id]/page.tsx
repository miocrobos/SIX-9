import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { getAccessibleSheet } from "@/lib/resources"
import { getCurrentProjectIdentity } from "@/lib/project-access"
import { SheetWorkspaceClient } from "@/components/sheet/sheet-workspace-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return { title: "Sheet · Six Sense" }
  const identity = await getCurrentProjectIdentity()
  const sheet = await getAccessibleSheet(id, userId, identity.primaryEmailAddress ?? "")
  return { title: sheet ? `${sheet.name} · Sheets · Six Sense` : "Not Found" }
}

export default async function SheetPage({ params }: PageProps) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { id } = await params
  const identity = await getCurrentProjectIdentity()
  const sheet = await getAccessibleSheet(id, userId, identity.primaryEmailAddress ?? "")
  if (!sheet) notFound()

  return <SheetWorkspaceClient sheetId={sheet.id} sheetName={sheet.name} />
}
