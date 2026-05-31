"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import {
  BookOpen, ChevronLeft, FileText,
  GitBranch, LayoutDashboard, Table2,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// ─── Tab order: Dashboard → Workflow → Sheet → Knowledge → Document ──────────
const tabs = [
  { label: "Dashboard", href: "/dashboard",  icon: LayoutDashboard },
  { label: "Workflow",  href: "/editor",      icon: GitBranch       },
  { label: "Sheet",     href: "/sheets",      icon: Table2          },
  { label: "Knowledge", href: "/knowledge",   icon: BookOpen        },
  { label: "Document",  href: "/documents",   icon: FileText        },
]

function useActiveTab(pathname: string) {
  if (pathname.startsWith("/dashboard")) return "/dashboard"
  if (pathname.startsWith("/editor"))    return "/editor"
  if (pathname.startsWith("/sheets"))    return "/sheets"
  if (pathname.startsWith("/knowledge")) return "/knowledge"
  if (pathname.startsWith("/documents")) return "/documents"
  return null
}

export function AppNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const activeHref = useActiveTab(pathname)

  return (
    <header
      className="sticky top-0 z-40 bg-white dark:bg-black border-b border-[#E8E8E8] dark:border-[#1f1f1f]"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-5 h-13 md:h-14 flex items-center gap-3 md:gap-4">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-[#D92525] dark:hover:text-[#D92525] transition-colors shrink-0 text-sm font-semibold"
          title="Go back"
          type="button"
        >
          <ChevronLeft size={16} />
        </button>

        {/* SIX Sense logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 border-r border-[#E8E8E8] dark:border-[#1f1f1f] pr-3 md:pr-4"
        >
          <Image src="/Six-Sense.png" alt="SIX SENSE" width={110} height={26} priority />
        </Link>

        {/* Tab navigation — desktop */}
        <nav
          className="hidden md:flex items-center gap-0.5 overflow-x-auto flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          aria-label="Main sections"
        >
          {tabs.map(({ label, href, icon: Icon }) => {
            const isActive = activeHref === href
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors duration-200 shrink-0",
                  isActive
                    ? "bg-[#D92525]/10 dark:bg-[#D92525]/20 text-[#D92525] font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-[#F5F5F7] dark:hover:bg-[#111] hover:text-[#1A1A1A] dark:hover:text-white font-semibold",
                ].join(" ")}
              >
                <Icon size={13} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile spacer */}
        <div className="flex-1 md:hidden" />

        {/* Right controls */}
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>

      {/* Mobile tab bar */}
      <div className="md:hidden flex items-center overflow-x-auto border-t border-[#F0F0F0] dark:border-[#1f1f1f] px-2 py-1 gap-0.5"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {tabs.map(({ label, href, icon: Icon }) => {
          const isActive = activeHref === href
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap shrink-0 font-semibold transition-colors",
                isActive
                  ? "bg-[#D92525]/10 text-[#D92525]"
                  : "text-gray-500 dark:text-gray-400",
              ].join(" ")}
            >
              <Icon size={11} />
              {label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}
