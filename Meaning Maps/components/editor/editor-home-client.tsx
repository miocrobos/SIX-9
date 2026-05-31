"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, GitBranch, Plus, Users } from "lucide-react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { Button } from "@/components/ui/button"
import { useProjectActions, type ProjectRow } from "@/hooks/use-project-actions"

interface EditorHomeClientProps {
  ownedProjects: ProjectRow[]
  sharedProjects: ProjectRow[]
}

export function EditorHomeClient({ ownedProjects, sharedProjects }: EditorHomeClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const actions = useProjectActions()

  const recentAll = [
    ...ownedProjects.map((p) => ({ ...p, isShared: false })),
    ...sharedProjects.map((p) => ({ ...p, isShared: true })),
  ].slice(0, 12)

  return (
    <div className="flex flex-col h-screen bg-bg-base">
      <EditorNavbar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onNewProject={actions.openCreate}
        onRename={actions.openRename}
        onDelete={actions.openDelete}
      />

      <main className="flex-1 overflow-y-auto px-8 py-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Workflow</h1>
            <p className="text-sm text-text-muted mt-1">AI-powered knowledge maps on a collaborative canvas</p>
          </div>
          <Button onClick={actions.openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {recentAll.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-2xl bg-bg-elevated flex items-center justify-center mb-4">
              <GitBranch className="h-8 w-8 text-text-faint" />
            </div>
            <p className="text-text-primary font-semibold mb-2">No knowledge maps yet</p>
            <p className="text-sm text-text-muted mb-6">
              Create your first AI-powered knowledge map.
            </p>
            <Button onClick={actions.openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Create first project
            </Button>
          </div>
        ) : (
          <>
            {/* Recent section */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-text-muted" />
                <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">Recent projects</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recentAll.map((project) => (
                  <Link
                    key={project.id}
                    href={`/editor/${project.id}`}
                    className="group p-5 rounded-2xl bg-bg-surface border border-border-default hover:border-accent-primary/40 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-9 w-9 rounded-xl bg-[rgba(251,191,36,0.12)] flex items-center justify-center shrink-0">
                        <GitBranch className="h-4 w-4 text-state-warning" />
                      </div>
                      {project.isShared && (
                        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-text-faint border border-border-subtle rounded-full px-2 py-0.5">
                          <Users className="h-2.5 w-2.5" />
                          Shared
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-accent-primary transition-colors">
                      {project.name}
                    </p>
                    <p className="text-xs text-text-faint mt-1.5">Open canvas →</p>
                  </Link>
                ))}

                {/* New project card */}
                <button
                  type="button"
                  onClick={actions.openCreate}
                  className="p-5 rounded-2xl border-2 border-dashed border-border-default hover:border-accent-primary/50 hover:bg-bg-subtle transition-all text-left group"
                >
                  <div className="h-9 w-9 rounded-xl bg-bg-elevated flex items-center justify-center mb-3">
                    <Plus className="h-4 w-4 text-text-muted group-hover:text-accent-primary transition-colors" />
                  </div>
                  <p className="text-sm font-semibold text-text-muted group-hover:text-accent-primary transition-colors">
                    New project
                  </p>
                  <p className="text-xs text-text-faint mt-1">Create a knowledge map</p>
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <ProjectDialogs {...actions} />
    </div>
  )
}
