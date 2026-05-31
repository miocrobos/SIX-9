"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { Bell, BookOpen, FileText, GitBranch, LayoutDashboard, Table2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const tabs = [
  { label: "Workflow",  href: "/editor",      icon: GitBranch       },
  { label: "Dashboard", href: "/dashboard",   icon: LayoutDashboard },
  { label: "Sheet",     href: "/sheets",      icon: Table2          },
  { label: "Knowledge", href: "/knowledge",   icon: BookOpen        },
  { label: "Document",  href: "/documents",   icon: FileText        },
]

function useActiveTab(pathname: string) {
  if (pathname.startsWith("/editor"))    return "/editor"
  if (pathname.startsWith("/dashboard")) return "/dashboard"
  if (pathname.startsWith("/sheets"))    return "/sheets"
  if (pathname.startsWith("/knowledge")) return "/knowledge"
  if (pathname.startsWith("/documents")) return "/documents"
  return null
}

interface AppNavbarProps {
  inboxCount?: number
}

export function AppNavbar({ inboxCount = 0 }: AppNavbarProps) {
  const pathname = usePathname()
  const activeHref = useActiveTab(pathname)

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-4">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 shrink-0 mr-6"
        aria-label="Six Sense home"
      >
        <div className="h-6 w-6 rounded-md bg-accent-primary flex items-center justify-center">
          <span className="text-white font-bold text-xs leading-none select-none">S</span>
        </div>
        <span className="text-sm font-semibold text-text-primary hidden sm:block">
          Six Sense
        </span>
      </Link>

      {/* Tab navigation */}
      <nav className="flex items-center gap-1 flex-1" aria-label="Main sections">
        {tabs.map(({ label, href, icon: Icon }) => {
          const isActive = activeHref === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-primary-dim text-accent-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:block">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {inboxCount > 0 && (
          <Link
            href="/dashboard"
            className="relative p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
            aria-label={`${inboxCount} notifications`}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent-primary text-white text-[9px] font-bold flex items-center justify-center">
              {inboxCount > 9 ? "9+" : inboxCount}
            </span>
          </Link>
        )}
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  )
}
