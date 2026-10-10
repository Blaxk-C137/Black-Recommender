"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import type { MediaItem } from "@/lib/types/media.types"

export function MediaCard({ item, onClick }: { item: MediaItem; onClick?: () => void }) {
  const [imgError, setImgError] = useState(false)
  const showPoster = item.posterUrl && !imgError

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group w-[140px] shrink-0 text-left md:w-[200px]"
      aria-label={item.title}
    >
      <div className="shine-sweep relative aspect-[2/3] overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_12px_40px_-8px_rgba(139,92,246,0.4)]">
        {showPoster ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote posters from many CDNs; next/image config not worth it here
          <img
            src={item.posterUrl}
            alt={item.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-card to-surface p-3 text-center text-sm text-muted-foreground">
            {item.title}
          </div>
        )}
        {/* bottom gradient vignette on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {item.rating > 0 && (
          <span className="absolute right-1.5 top-1.5 rounded-md bg-black/70 px-1.5 py-0.5 font-mono text-xs backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            ★ {item.rating.toFixed(1)}
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-sm font-medium">{item.title}</p>
      <p className="truncate text-xs text-muted-foreground">
        {[item.year, item.genres[0]].filter(Boolean).join(" • ")}
      </p>
    </motion.button>
  )
}
