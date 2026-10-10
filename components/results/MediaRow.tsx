"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/lib/types/media.types"
import { MediaCard } from "./MediaCard"

export function MediaRow({
  items,
  onItemClick,
}: {
  items: MediaItem[]
  onItemClick?: (item: MediaItem) => void
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateArrows = () => {
    const el = scroller.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    updateArrows()
    const el = scroller.current
    if (!el) return
    window.addEventListener("resize", updateArrows)
    return () => window.removeEventListener("resize", updateArrows)
  }, [items])

  const nudge = (dir: 1 | -1) =>
    scroller.current?.scrollBy({ left: dir * (scroller.current.clientWidth * 0.75), behavior: "smooth" })

  return (
    <div className="group/row relative">
      <div
        ref={scroller}
        onScroll={updateArrows}
        data-lenis-prevent
        className="scrollbar-thin row-mask -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6"
      >
        {items.map(item => (
          <div key={`${item.source}-${item.id}`} className="snap-start">
            <MediaCard item={item} onClick={onItemClick ? () => onItemClick(item) : undefined} />
          </div>
        ))}
      </div>

      {/* Scroll nudge arrows (desktop, appear on row hover) */}
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => nudge(-1)}
        className={cn(
          "absolute -left-3 top-[38%] z-10 hidden rounded-full border border-border bg-background/90 p-2 shadow-lg shadow-black/40 backdrop-blur transition-all hover:scale-110 hover:border-ring md:block",
          canLeft ? "opacity-0 group-hover/row:opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => nudge(1)}
        className={cn(
          "absolute -right-3 top-[38%] z-10 hidden rounded-full border border-border bg-background/90 p-2 shadow-lg shadow-black/40 backdrop-blur transition-all hover:scale-110 hover:border-ring md:block",
          canRight ? "opacity-0 group-hover/row:opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}
