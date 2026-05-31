"use client"

import { useOthers, useSelf } from "@liveblocks/react"
import Image from "next/image"

export function CollaboratorAvatarStack() {
  const others = useOthers()
  const me = useSelf()
  const all = me ? [me, ...others] : [...others]
  const visible = all.slice(0, 5)
  const overflow = all.length - 5

  if (all.length === 0) return null

  return (
    <div className="flex items-center">
      {visible.map((user, i) => {
        const info = user.info as { name?: string; avatar?: string; color?: string } | undefined
        const name = info?.name ?? "Anonymous"
        const avatar = info?.avatar ?? ""
        const color = info?.color ?? "#D92525"
        return (
          <div
            key={user.connectionId ?? i}
            className="relative h-7 w-7 rounded-full border-2 border-bg-surface"
            style={{ marginLeft: i > 0 ? "-8px" : 0, zIndex: visible.length - i }}
            title={name}
          >
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                fill
                className="rounded-full object-cover"
                sizes="28px"
              />
            ) : (
              <div
                className="h-full w-full rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )
      })}
      {overflow > 0 && (
        <div
          className="relative h-7 w-7 rounded-full border-2 border-bg-surface bg-bg-elevated flex items-center justify-center text-[10px] font-semibold text-text-muted"
          style={{ marginLeft: "-8px", zIndex: 0 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
