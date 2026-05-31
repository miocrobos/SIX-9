import Link from "next/link"
import Image from "next/image"
import { FileText } from "lucide-react"

interface KnowledgeCardProps {
  title: string
  author: string
  slug: string
  coverUrl: string | null
}

export function KnowledgeCard({ title, author, slug, coverUrl }: KnowledgeCardProps) {
  return (
    <Link href={`/knowledge/${slug}`} className="group block">
      <article className="flex flex-col h-full">
        {/* Cover */}
        <div className="relative w-full aspect-[2/3] max-h-[200px] bg-bg-elevated rounded-2xl overflow-hidden flex items-center justify-center mb-3 border border-border-default group-hover:border-accent-primary/40 transition-colors shadow-sm group-hover:-translate-y-1 transition-transform duration-200">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <FileText className="h-10 w-10 text-text-faint" />
          )}
        </div>

        {/* Meta */}
        <p className="font-semibold text-text-primary text-sm leading-snug line-clamp-2 mb-1">
          {title}
        </p>
        <p className="text-xs text-text-muted line-clamp-1">{author}</p>
      </article>
    </Link>
  )
}
