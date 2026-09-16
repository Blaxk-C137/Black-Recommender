"use client"

import { cn } from "@/lib/utils"
import type { MediaType } from "@/lib/utils/constants"
import { ACCENT_HOVER, ACCENT_TEXT } from "@/lib/utils/accent"

export function MediaTypeCard({
  type,
  label,
  emoji,
  onClick,
}: {
  type: MediaType
  label: string
  emoji: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex min-h-[180px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-6",
        "transition-transform duration-200 hover:scale-[1.03]",
        ACCENT_HOVER[type]
      )}
      aria-label={label}
    >
      <span className="text-5xl" aria-hidden>
        {emoji}
      </span>
      <span className={cn("font-display text-2xl font-semibold", ACCENT_TEXT[type])}>
        {label}
      </span>
    </button>
  )
}
