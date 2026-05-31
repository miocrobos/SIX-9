"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import {
  useLiveblocksExtension,
  FloatingComposer,
  FloatingThreads,
  useIsEditorReady,
} from "@liveblocks/react-tiptap"
import { useThreads } from "@liveblocks/react"
import { DocumentToolbar } from "./document-toolbar"
import { DocumentAiToolbar } from "./document-ai-toolbar"
import { CollaboratorAvatarStack } from "./collaborator-avatar-stack"
import { Loader2 } from "lucide-react"

interface DocumentEditorProps {
  documentId: string
  documentName: string
}

export function DocumentEditor({ documentId, documentName }: DocumentEditorProps) {
  const liveblocks = useLiveblocksExtension()
  const isReady = useIsEditorReady()
  const { threads } = useThreads()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      liveblocks,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (StarterKit as any).configure({ history: false }), // Liveblocks handles undo/redo
      Underline,
      Placeholder.configure({
        placeholder: "Start writing your document…",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[400px] text-text-primary",
      },
    },
  })

  if (!isReady) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar + presence */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-border-default shrink-0 gap-4">
        <DocumentToolbar editor={editor} />
        <CollaboratorAvatarStack />
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-y-auto relative">
        {editor && <DocumentAiToolbar editor={editor} documentId={documentId} />}
        <div className="max-w-3xl mx-auto px-8 py-10">
          <h1 className="text-2xl font-bold text-text-primary mb-6 outline-none" suppressContentEditableWarning>
            {documentName}
          </h1>
          <EditorContent editor={editor} className="[&_.tiptap]:outline-none" />
        </div>

        {/* Anchored comment threads */}
        {editor && threads && (
          <FloatingThreads
            editor={editor}
            threads={threads}
            className="ml-4"
          />
        )}
      </div>

      {/* Floating comment composer (appears when text is selected) */}
      {editor && <FloatingComposer editor={editor} />}
    </div>
  )
}
