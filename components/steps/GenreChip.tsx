
"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function GenreChip({
  label,
  selected,
  accentSelected,
  onToggle,
}: {
  label: string
  selected: boolean
  accentSelected: string // ACCENT_SELECTED[mediaType] — static class string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        selected
          ? cn(accentSelected, "shadow-sm")
          : "border-border bg-card text-muted-foreground hover:border-ring hover:text-foreground"
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        {selected && <Check className="size-3.5" />}
        {label}
      </span>
    </button>
  )
}
