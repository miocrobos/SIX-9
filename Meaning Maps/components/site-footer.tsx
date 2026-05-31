import Link from "next/link"

const footerLinks = [
  { label: "Privacy",   href: "#" },
  { label: "Security",  href: "#" },
  { label: "About SIX", href: "https://www.six-group.com", external: true },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border-default bg-bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-5 rounded-md bg-accent-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[9px] leading-none select-none">S</span>
          </div>
          <span className="text-xs text-text-secondary">Six Sense · Knowledge Hub · Internal Platform</span>
        </div>

        <p className="text-xs text-text-faint">
          © {new Date().getFullYear()} SIX Group AG. All rights reserved.
        </p>

        <nav className="flex items-center gap-6">
          {footerLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
