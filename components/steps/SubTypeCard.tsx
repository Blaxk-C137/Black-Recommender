"use client"

import { motion } from "framer-motion"
import { SpotlightCard } from "@/components/magicui/spotlight-card"

export function SubTypeCard({
  label,
  emoji,
  onClick,
}: {
  label: string
  emoji: string
  onClick: () => void
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="w-full md:max-w-sm"
    >
      <SpotlightCard
        spotlightColor="rgba(139,92,246,0.25)"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onClick()
          }
        }}
        className="group flex min-h-[120px] w-full cursor-pointer items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-ring/60 hover:bg-card/80"
      >
        <motion.span
          aria-hidden
          className="text-4xl"
          whileHover={{ scale: 1.2, rotate: -6 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          {emoji}
        </motion.span>
        <span className="text-lg font-medium">{label}</span>
      </SpotlightCard>
    </motion.div>
  )
}
