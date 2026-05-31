"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentCreateButtonProps {
  label?: string
}

export function DocumentCreateButton({ label = "New Document" }: DocumentCreateButtonProps) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    setCreating(true)
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Untitled Document" }),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      const doc = await res.json() as { id: string }
      if (!doc.id) throw new Error("No id returned")
      router.push(`/documents/${doc.id}`)
    } catch {
      setCreating(false)
    }
  }

  return (
    <Button onClick={handleCreate} disabled={creating} className="gap-1.5">
      {creating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      {label}
    </Button>
  )
}
