"use client"

import { LiveObject, LiveMap } from "@liveblocks/client"
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react"
import { DocumentEditor } from "./document-editor"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@clerk/nextjs"

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
          {/* Nav */}
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/documents"
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <span className="text-sm font-medium text-text-primary truncate">
                {documentName}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggle />
              <UserButton />
            </div>
          </header>

          {/* Editor */}
          <main className="flex-1 overflow-hidden">
            <DocumentEditor documentId={documentId} documentName={documentName} />
          </main>
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
