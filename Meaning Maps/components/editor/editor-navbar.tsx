"use client"

import Link from "next/link"
import { LayoutDashboard, LayoutTemplate, PanelLeftClose, PanelLeftOpen, Save, Share2, Sparkles } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import type { SaveStatus } from "@/hooks/use-canvas-autosave"

interface EditorNavbarProps {
  isOpen: boolean
  onToggle: () => void
  projectName?: string
  isAiSidebarOpen?: boolean
  onToggleAiSidebar?: () => void
  onOpenShareDialog?: () => void
  onOpenTemplates?: () => void
  saveStatus?: SaveStatus
  onSave?: () => void
}

export function EditorNavbar({
  isOpen,
  onToggle,
  projectName,
  isAiSidebarOpen = false,
  onToggleAiSidebar,
  onOpenShareDialog,
  onOpenTemplates,
  saveStatus,
  onSave,
}: EditorNavbarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-3">
      <div className="flex min-w-0 items-center gap-2">
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

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
          {isOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        {projectName ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">{projectName}</p>
            <p className="text-xs text-text-faint">Workflow</p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {onToggleAiSidebar ? (
          <>
            {onSave ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={onSave}
                disabled={saveStatus === "saving"}
              >
                <Save className="h-4 w-4" />
                {saveStatus === "saving"
                  ? "Saving..."
                  : saveStatus === "saved"
                  ? "Saved"
                  : saveStatus === "error"
                  ? "Error"
                  : "Save"}
              </Button>
            ) : null}
            {onOpenTemplates ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={onOpenTemplates}
              >
                <LayoutTemplate className="h-4 w-4" />
                Templates
              </Button>
            ) : null}
            {onOpenShareDialog ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={onOpenShareDialog}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            ) : null}
            <Button
              variant={isAiSidebarOpen ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={onToggleAiSidebar}
            >
              <Sparkles className="h-4 w-4" />
              AI
            </Button>
          </>
        ) : null}

        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  )
}
