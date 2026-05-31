import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  FileText,
  GitBranch,
  Table2,
  BookOpen,
  Bell,
  Clock,
  Plus,
} from "lucide-react"
import { getCurrentProjectIdentity } from "@/lib/project-access"
import { getRecentKnowledgeDocs, getDocumentsForUser, getSheetsForUser } from "@/lib/resources"
import { getProjectsForUser } from "@/lib/projects"
import { KnowledgeCard } from "@/components/knowledge/knowledge-card"
import { DashboardActivityChart } from "@/components/dashboard/dashboard-activity-chart"
import { DashboardAiPanel } from "@/components/dashboard/dashboard-ai-panel"

export const metadata = { title: "Dashboard · Six Sense" }

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "short", timeStyle: "short" }).format(new Date(date))
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const identity = await getCurrentProjectIdentity()
  const email = identity.primaryEmailAddress ?? ""

  const [recentKnowledge, docs, sheets, projects] = await Promise.all([
    getRecentKnowledgeDocs(userId, 4),
    getDocumentsForUser(userId, email),
    getSheetsForUser(userId, email),
    getProjectsForUser(userId, email),
  ])

  const recentDocs = [...docs.owned, ...docs.shared]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const recentSheets = [...sheets.owned, ...sheets.shared]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const recentWorkflows = [...projects.owned, ...projects.shared]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const totalResources =
    recentKnowledge.length + docs.owned.length + sheets.owned.length + projects.owned.length

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">
          Your knowledge workspace at a glance
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Knowledge Docs", value: recentKnowledge.length, icon: BookOpen, href: "/knowledge", color: "text-accent-primary bg-accent-primary-dim" },
          { label: "Documents", value: docs.owned.length + docs.shared.length, icon: FileText, href: "/documents", color: "text-accent-ai bg-[rgba(100,87,249,0.12)]" },
          { label: "Sheets", value: sheets.owned.length + sheets.shared.length, icon: Table2, href: "/sheets", color: "text-state-success bg-[rgba(52,211,153,0.12)]" },
          { label: "Workflows", value: projects.owned.length + projects.shared.length, icon: GitBranch, href: "/editor", color: "text-state-warning bg-[rgba(251,191,36,0.12)]" },
        ].map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="p-5 rounded-2xl bg-bg-surface border border-border-default hover:border-accent-primary/30 transition-all group"
          >
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-xs text-text-muted mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Main grid: Activity + AI Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Activity chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-bg-surface border border-border-default">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Activity this week</h2>
            <div className="flex items-center gap-4 text-[11px] text-text-muted">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent-primary inline-block" />Docs</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent-ai inline-block" />Maps</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-state-success inline-block" />Sheets</span>
            </div>
          </div>
          <DashboardActivityChart />
        </div>

        {/* AI Copilot */}
        <div className="h-72 lg:h-auto">
          <DashboardAiPanel />
        </div>
      </div>

      {/* Recent Knowledge */}
      {recentKnowledge.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Clock className="h-4 w-4 text-text-muted" />
              Recent Knowledge
            </h2>
            <Link href="/knowledge" className="text-xs text-accent-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentKnowledge.map((doc) => (
              <KnowledgeCard
                key={doc.id}
                title={doc.title}
                author={doc.author}
                slug={doc.slug}
                coverUrl={doc.coverUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Documents */}
      {recentDocs.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent-ai" />
              Recent Documents
            </h2>
            <Link href="/documents" className="text-xs text-accent-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recentDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="group p-4 rounded-2xl bg-bg-surface border border-border-default hover:border-accent-ai/40 transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-[rgba(100,87,249,0.12)] flex items-center justify-center mb-3">
                  <FileText className="h-3.5 w-3.5 text-accent-ai" />
                </div>
                <p className="text-sm font-medium text-text-primary line-clamp-2 leading-snug">
                  {doc.name}
                </p>
                <p className="text-xs text-text-faint mt-1">{formatDate(doc.createdAt)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Sheets */}
      {recentSheets.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Table2 className="h-4 w-4 text-state-success" />
              Recent Sheets
            </h2>
            <Link href="/sheets" className="text-xs text-accent-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recentSheets.map((sheet) => (
              <Link
                key={sheet.id}
                href={`/sheets/${sheet.id}`}
                className="group p-4 rounded-2xl bg-bg-surface border border-border-default hover:border-state-success/40 transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-[rgba(52,211,153,0.12)] flex items-center justify-center mb-3">
                  <Table2 className="h-3.5 w-3.5 text-state-success" />
                </div>
                <p className="text-sm font-medium text-text-primary line-clamp-2 leading-snug">
                  {sheet.name}
                </p>
                <p className="text-xs text-text-faint mt-1">{formatDate(sheet.createdAt)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Workflows */}
      {recentWorkflows.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-state-warning" />
              Recent Workflows
            </h2>
            <Link href="/editor" className="text-xs text-accent-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recentWorkflows.map((project) => (
              <Link
                key={project.id}
                href={`/editor/${project.id}`}
                className="group p-4 rounded-2xl bg-bg-surface border border-border-default hover:border-state-warning/40 transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-[rgba(251,191,36,0.12)] flex items-center justify-center mb-3">
                  <GitBranch className="h-3.5 w-3.5 text-state-warning" />
                </div>
                <p className="text-sm font-medium text-text-primary line-clamp-2 leading-snug">
                  {project.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {totalResources === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-bg-elevated flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-text-faint" />
          </div>
          <p className="text-text-primary font-semibold mb-2">Your workspace is empty</p>
          <p className="text-sm text-text-muted mb-6">
            Upload a document, create a workflow, or start a sheet to get going.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/knowledge/upload"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              Upload Knowledge
            </Link>
            <Link
              href="/editor"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border-default text-text-secondary text-sm font-medium hover:border-accent-primary hover:text-accent-primary transition-colors"
            >
              <GitBranch className="h-4 w-4" />
              New Workflow
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
