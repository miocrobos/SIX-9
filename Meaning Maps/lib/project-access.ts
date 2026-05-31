import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export interface ProjectIdentity {
  userId: string | null
  primaryEmailAddress: string | null
}

export async function getCurrentProjectIdentity(): Promise<ProjectIdentity> {
  const { userId } = await auth()

  if (!userId) {
    return {
      userId: null,
      primaryEmailAddress: null,
    }
  }

  const user = await currentUser()

  return {
    userId,
    primaryEmailAddress:
      user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? null,
  }
}

export async function getAccessibleProject(
  projectId: string,
  identity: ProjectIdentity
) {
  if (!identity.userId) return null

  return prisma.project.findFirst({
    where: {
      id: projectId,
      OR: identity.primaryEmailAddress
        ? [
            { ownerId: identity.userId },
            {
              collaborators: {
                some: {
                  email: {
                    equals: identity.primaryEmailAddress,
                    mode: "insensitive",
                  },
                },
              },
            },
          ]
        : [{ ownerId: identity.userId }],
    },
  })
}

export async function userHasProjectAccess(
  projectId: string,
  identity: ProjectIdentity
) {
  const project = await getAccessibleProject(projectId, identity)
  return Boolean(project)
}

/**
 * Checks whether a Liveblocks room ID corresponds to an accessible resource.
 * Room IDs are the resource's own database ID, so we check Project, Document,
 * and Sheet tables in order.
 */
export async function userHasRoomAccess(
  roomId: string,
  identity: ProjectIdentity
): Promise<boolean> {
  if (!identity.userId) return false

  const emailFilter = identity.primaryEmailAddress
    ? { email: { equals: identity.primaryEmailAddress, mode: "insensitive" as const } }
    : null

  const [project, document, sheet] = await Promise.all([
    prisma.project.findFirst({
      where: {
        id: roomId,
        OR: emailFilter
          ? [{ ownerId: identity.userId }, { collaborators: { some: emailFilter } }]
          : [{ ownerId: identity.userId }],
      },
      select: { id: true },
    }),
    prisma.document.findFirst({
      where: {
        id: roomId,
        OR: emailFilter
          ? [{ ownerId: identity.userId }, { collaborators: { some: emailFilter } }]
          : [{ ownerId: identity.userId }],
      },
      select: { id: true },
    }),
    prisma.sheet.findFirst({
      where: {
        id: roomId,
        OR: emailFilter
          ? [{ ownerId: identity.userId }, { collaborators: { some: emailFilter } }]
          : [{ ownerId: identity.userId }],
      },
      select: { id: true },
    }),
  ])

  return Boolean(project ?? document ?? sheet)
}
