"use client"

import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { voiceCategories, voiceOptions } from "@/lib/knowledge-constants"

interface VoiceSelectorProps {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

const ACCENT = "#D92525" // SIX red

function VoiceCard({
  voiceId,
  selected,
  disabled,
  onChange,
}: {
  voiceId: string
  selected: boolean
  disabled?: boolean
  onChange: (v: string) => void
}) {
  const voice = voiceOptions[voiceId as keyof typeof voiceOptions]
  return (
    <Label
      htmlFor={voiceId}
      onClick={() => !disabled && onChange(voiceId)}
      className={cn(
        "flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer select-none transition-colors",
        selected
          ? "border-[#D92525] bg-[#D92525]/5"
          : "border-border-default bg-bg-surface hover:border-[#D92525]/40 hover:bg-bg-subtle",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <RadioGroupItem value={voiceId} id={voiceId} className="sr-only" />
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
            selected ? "border-[#D92525]" : "border-border-default"
          )}
        >
          {selected && <div className="w-2 h-2 rounded-full" style={{ background: ACCENT }} />}
        </div>
        <span className="font-bold text-text-primary text-sm">{voice.name}</span>
      </div>
      <p className="text-xs text-text-muted leading-relaxed pl-6">{voice.description}</p>
    </Label>
  )
}

export function KnowledgeVoiceSelector({ value, onChange, disabled }: VoiceSelectorProps) {
  return (
    <div className="space-y-6">
      <RadioGroup value={value} onValueChange={onChange} disabled={disabled} className="space-y-8">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-text-muted">SIX Financial Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {voiceCategories.financialInformation.map((id) => (
              <VoiceCard key={id} voiceId={id} selected={value === id} disabled={disabled} onChange={onChange} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-text-muted">Innovation Hub</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {voiceCategories.innovationHub.map((id) => (
              <VoiceCard key={id} voiceId={id} selected={value === id} disabled={disabled} onChange={onChange} />
            ))}
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}
