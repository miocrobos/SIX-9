"use client"

import Link from "next/link"
import { useAuth, UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { label: "Features",     href: "#features" },
  { label: "How It Works", href: "#how"      },
]

export function SiteHeader() {
  const { isSignedIn } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-bg-surface border-b border-border-default">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-accent-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs leading-none select-none">S</span>
          </div>
          <span className="text-sm font-semibold text-text-primary">Six Sense</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Auth controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium px-4 py-1.5 rounded-lg bg-accent-primary text-white hover:opacity-90 transition-opacity"
              >
                Open App
              </Link>
              <UserButton />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm font-medium px-4 py-1.5 rounded-lg bg-accent-primary text-white hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
