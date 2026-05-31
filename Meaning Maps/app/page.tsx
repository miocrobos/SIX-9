import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import {
  BrainCircuit,
  FileText,
  GitBranch,
  Share2,
  ScrollText,
  Table2,
  ArrowRight,
} from "lucide-react"

const features = [
  {
    icon: BrainCircuit,
    title: "AI Knowledge Mapping",
    description:
      "Drop in a document or prompt and Sense AI maps the concepts, sources, and relationships into a living knowledge map.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared editing so your team builds knowledge together — across documents, maps, and sheets.",
  },
  {
    icon: ScrollText,
    title: "Evidence-Based Briefs",
    description:
      "Turn any knowledge map into a traceable Markdown brief with source citations your whole team can reuse.",
  },
]

const sections = [
  {
    icon: BrainCircuit,
    label: "Knowledge",
    description: "Upload and explore source documents",
    href: "/knowledge",
    color: "bg-accent-primary-dim text-accent-primary",
  },
  {
    icon: FileText,
    label: "Documents",
    description: "Collaborative rich-text documents",
    href: "/documents",
    color: "bg-[rgba(100,87,249,0.12)] text-accent-ai",
  },
  {
    icon: Table2,
    label: "Sheets",
    description: "Multiplayer spreadsheets with AI",
    href: "/sheets",
    color: "bg-[rgba(52,211,153,0.12)] text-state-success",
  },
  {
    icon: GitBranch,
    label: "Workflow",
    description: "Drag-and-drop knowledge maps",
    href: "/editor",
    color: "bg-[rgba(251,191,36,0.12)] text-state-warning",
  },
]

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <SiteHeader />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary-dim border border-accent-primary/20 text-accent-primary text-xs font-semibold mb-6">
            <BrainCircuit className="h-3.5 w-3.5" />
            SIX &quot;Build the Company Brain&quot; Challenge
          </div>
          <h1 className="text-5xl font-bold text-text-primary leading-tight mb-6">
            Your company&apos;s knowledge,{" "}
            <span className="text-accent-primary">mapped.</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed mb-10 max-w-2xl mx-auto">
            Capture scattered expertise and documents as connected knowledge maps. Sense AI
            builds them with you in real time — transparent, traceable, and reusable even
            after the expert leaves.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-in"
              className="px-6 py-3 rounded-xl bg-accent-primary text-white font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="px-6 py-3 rounded-xl border border-border-default text-text-secondary font-semibold hover:border-accent-primary hover:text-accent-primary transition-colors"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Sections grid */}
      <section id="features" className="py-20 px-6 bg-bg-subtle border-y border-border-default">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-3">
            One platform, every knowledge format
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-xl mx-auto">
            Documents, workflows, spreadsheets, and AI maps — all in one collaborative workspace.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.map(({ icon: Icon, label, description, href, color }) => (
              <Link
                key={href}
                href="/sign-in"
                className="group p-6 rounded-2xl bg-bg-surface border border-border-default hover:border-accent-primary/40 transition-all hover:shadow-sm"
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-text-primary mb-1">{label}</p>
                <p className="text-sm text-text-muted">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent-primary-dim flex items-center justify-center">
                  <Icon className="h-6 w-6 text-accent-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-accent-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to build your company brain?
          </h2>
          <p className="text-white/80 mb-8">
            Sign in to start capturing, mapping, and sharing knowledge across your organization.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-accent-primary font-semibold hover:bg-white/90 transition-colors"
          >
            Get started now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
