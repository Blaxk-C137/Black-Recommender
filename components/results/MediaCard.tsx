"use client"

import { useState } from "react"
import type { MediaItem } from "@/lib/types/media.types"

export function MediaCard({ item, onClick }: { item: MediaItem; onClick?: () => void }) {
  const [imgError, setImgError] = useState(false)
  const showPoster = item.posterUrl && !imgError

  return (
    <button
      onClick={onClick}
      className="group w-[140px] shrink-0 text-left md:w-[200px]"
      aria-label={item.title}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-200 group-hover:shadow-[0_0_24px_rgba(99,102,241,0.18)]">
        {showPoster ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote posters from many CDNs; next/image config not worth it here
          <img
            src={item.posterUrl}
            alt={item.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-card to-surface p-3 text-center text-sm text-muted-foreground">
            {item.title}
          </div>
        )}
        {item.rating > 0 && (
          <span className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-xs">
            ★ {item.rating.toFixed(1)}
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-sm font-medium">{item.title}</p>
      <p className="truncate text-xs text-muted-foreground">
        {[item.year, item.genres[0]].filter(Boolean).join(" • ")}
      </p>
    </button>
  )
}
