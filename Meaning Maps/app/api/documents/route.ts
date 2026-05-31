import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createDocument, getDocumentsForUser } from "@/lib/resources"
import { getCurrentProjectIdentity } from "@/lib/project-access"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const identity = await getCurrentProjectIdentity()
  const { owned, shared } = await getDocumentsForUser(
    userId,
    identity.primaryEmailAddress ?? ""
  )
  return NextResponse.json({ owned, shared })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name } = (await request.json()) as { name?: string }
  const doc = await createDocument(userId, name ?? "Untitled Document")
  return NextResponse.json(doc, { status: 201 })
}
