/**
 * Data access helpers for Document, Sheet, and KnowledgeDoc resources.
 * All queries are owner + collaborator scoped.
 */

import { prisma } from "@/lib/prisma"

export interface DocumentRow {
  id: string
  name: string
  createdAt: Date
}

export interface SheetRow {
  id: string
  name: string
  createdAt: Date
}

export interface KnowledgeDocRow {
  id: string
  title: string
  author: string
  slug: string
  coverUrl: string | null
  createdAt: Date
}

// ─── Documents ───────────────────────────────────────────────────────────────

export async function getDocumentsForUser(
  userId: string,
  email: string
): Promise<{ owned: DocumentRow[]; shared: DocumentRow[] }> {
  const [owned, sharedCollabs] = await Promise.all([
    prisma.document.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.documentCollaborator.findMany({
      where: { email: email.toLowerCase() },
      include: {
        document: { select: { id: true, name: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ])
  return {
    owned,
    shared: sharedCollabs.map((c) => c.document),
  }
}

export async function createDocument(
  ownerId: string,
  name: string
): Promise<DocumentRow> {
  return prisma.document.create({
    data: { ownerId, name },
    select: { id: true, name: true, createdAt: true },
  })
}

export async function getAccessibleDocument(
  id: string,
  userId: string,
  email: string
) {
  const doc = await prisma.document.findUnique({
    where: { id },
    include: { collaborators: true },
  })
  if (!doc) return null
  const isOwner = doc.ownerId === userId
  const isCollab = doc.collaborators.some(
    (c) => c.email.toLowerCase() === email.toLowerCase()
  )
  if (!isOwner && !isCollab) return null
  return doc
}

// ─── Sheets ──────────────────────────────────────────────────────────────────

export async function getSheetsForUser(
  userId: string,
  email: string
): Promise<{ owned: SheetRow[]; shared: SheetRow[] }> {
  const [owned, sharedCollabs] = await Promise.all([
    prisma.sheet.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.sheetCollaborator.findMany({
      where: { email: email.toLowerCase() },
      include: {
        sheet: { select: { id: true, name: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ])
  return {
    owned,
    shared: sharedCollabs.map((c) => c.sheet),
  }
}

export async function createSheet(
  ownerId: string,
  name: string
): Promise<SheetRow> {
  return prisma.sheet.create({
    data: { ownerId, name },
    select: { id: true, name: true, createdAt: true },
  })
}

export async function getAccessibleSheet(
  id: string,
  userId: string,
  email: string
) {
  const sheet = await prisma.sheet.findUnique({
    where: { id },
    include: { collaborators: true },
  })
  if (!sheet) return null
  const isOwner = sheet.ownerId === userId
  const isCollab = sheet.collaborators.some(
    (c) => c.email.toLowerCase() === email.toLowerCase()
  )
  if (!isOwner && !isCollab) return null
  return sheet
}

// ─── Knowledge docs ──────────────────────────────────────────────────────────

export async function getKnowledgeDocsForUser(
  userId: string
): Promise<KnowledgeDocRow[]> {
  return prisma.knowledgeDoc.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      author: true,
      slug: true,
      coverUrl: true,
      createdAt: true,
    },
  })
}

export async function getAllKnowledgeDocs(
  search?: string
): Promise<KnowledgeDocRow[]> {
  return prisma.knowledgeDoc.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { author: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      author: true,
      slug: true,
      coverUrl: true,
      createdAt: true,
    },
  })
}

export async function getKnowledgeDocBySlug(slug: string) {
  return prisma.knowledgeDoc.findUnique({
    where: { slug },
  })
}

export async function getRecentKnowledgeDocs(
  userId: string,
  limit = 6
): Promise<KnowledgeDocRow[]> {
  return prisma.knowledgeDoc.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      author: true,
      slug: true,
      coverUrl: true,
      createdAt: true,
    },
  })
}
