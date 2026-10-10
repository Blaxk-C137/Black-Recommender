"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { MediaType } from "@/lib/utils/constants"
import { ACCENT_HOVER, ACCENT_SPOTLIGHT, ACCENT_TEXT } from "@/lib/utils/accent"
import { SpotlightCard } from "@/components/magicui/spotlight-card"

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
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="h-full"
    >
      <SpotlightCard
        spotlightColor={ACCENT_SPOTLIGHT[type]}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onClick()
          }
        }}
        aria-label={label}
        className={cn(
          "group flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-6 transition-colors",
          ACCENT_HOVER[type]
        )}
      >
        <motion.span
          aria-hidden
          className="text-5xl"
          whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.15 }}
          transition={{ duration: 0.5 }}
        >
          {emoji}
        </motion.span>
        <span className={cn("font-display text-2xl font-semibold", ACCENT_TEXT[type])}>
          {label}
        </span>
      </SpotlightCard>
    </motion.div>
  )
}
