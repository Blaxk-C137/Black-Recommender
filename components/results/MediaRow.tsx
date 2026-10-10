"use client"

import type { MediaItem } from "@/lib/types/media.types"
import { MediaCard } from "./MediaCard"

export function MediaRow({
  items,
  onItemClick,
}: {
  items: MediaItem[]
  onItemClick?: (item: MediaItem) => void
}) {
  return (
    <div className="scrollbar-thin -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      {items.map(item => (
        <div key={`${item.source}-${item.id}`} className="snap-start">
          <MediaCard item={item} onClick={onItemClick ? () => onItemClick(item) : undefined} />
        </div>
      ))}
    </div>
  )
}
