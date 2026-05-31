"use client"

import { LiveObject, LiveMap } from "@liveblocks/client"
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react"
import { DocumentEditor } from "./document-editor"
import Link from "next/link"
import { ArrowLeft, LayoutDashboard } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@clerk/nextjs"
import { CollaboratorAvatarStack } from "./collaborator-avatar-stack"

interface DocumentWorkspaceClientProps {
  documentId: string
  documentName: string
}

export function DocumentWorkspaceClient({
  documentId,
  documentName,
}: DocumentWorkspaceClientProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={documentId}
        initialPresence={{ cursor: null, thinking: false }}
        initialStorage={new LiveObject({
          flow: new LiveObject({ nodes: new LiveMap(), edges: new LiveMap() }),
        })}
      >
        <div className="flex flex-col h-screen bg-bg-base">
          {/* Nav — full standalone header identical in spirit to the workflow editor */}
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-4">
            <div className="flex items-center gap-2 min-w-0">
              {/* Hub home link */}
              <Link
                href="/dashboard"
                className="flex items-center justify-center h-8 w-8 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
                title="Back to Hub"
              >
                <LayoutDashboard className="h-4 w-4" />
              </Link>
              {/* Six Sense logo */}
              <Link href="/dashboard" className="flex items-center shrink-0">
                <div className="h-5 w-5 rounded bg-accent-primary flex items-center justify-center">
                  <span className="text-white font-bold text-[10px] leading-none select-none">S</span>
                </div>
              </Link>
              <div className="w-px h-4 bg-border-default mx-1" />
              {/* Back to documents list */}
              <Link
                href="/documents"
                className="flex items-center justify-center h-8 w-8 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
                title="All documents"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <span className="text-sm font-medium text-text-primary truncate max-w-xs">
                {documentName}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <CollaboratorAvatarStack />
              <ThemeToggle />
              <UserButton />
            </div>
          </header>

          {/* Editor — takes up all remaining space */}
          <main className="flex-1 overflow-hidden">
            <DocumentEditor documentId={documentId} documentName={documentName} />
          </main>
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
