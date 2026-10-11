"use client"

import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Bookmark, BookmarkCheck, ExternalLink, Play, Star, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MediaRow } from "./MediaRow"
import { useUIStore } from "@/lib/store/useUIStore"
import type { MediaItem } from "@/lib/types/media.types"
import { isSaved, toggleSaved } from "@/lib/utils/storage"

function extractYouTubeKey(embedUrl: string): string | null {
  const m = embedUrl.match(/embed\/([^?&#]+)/)
  return m?.[1] ?? null
}

export function DetailModal() {
  const item = useUIStore(s => s.selectedItem)
  const setSelected = useUIStore(s => s.setSelectedItem)
  const close = () => setSelected(null)
  const params = useSearchParams()
  const [saved, setSaved] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    if (item) {
      setSaved(isSaved(item.id))
      setShowTrailer(false)
    }
  }, [item])

  // Extra details for TMDB/AniList sources (books already carry everything).
  const details = useQuery<MediaItem | null>({
    queryKey: ["details", item?.source, item?.externalId],
    queryFn: async () => {
      if (!item) return null
      if (item.source === "tmdb") {
        const kind = item.subType === "tv" ? "tv" : "movie"
        const res = await fetch(`/api/tmdb?section=details&kind=${kind}&id=${item.externalId}`)
        if (!res.ok) return null
        return (await res.json()) as MediaItem
      }
      if (item.source === "anilist") {
        const type = item.mediaType === "manga" ? "MANGA" : "ANIME"
        const res = await fetch(`/api/anilist?section=details&type=${type}&id=${item.externalId}`)
        if (!res.ok) return null
        return (await res.json()) as MediaItem
      }
      return null
    },
    enabled: !!item,
    staleTime: 1000 * 60 * 60 * 12,
  })

  // Trailer (TMDB only).
  const trailer = useQuery<{ trailerUrl: string | null }>({
    queryKey: ["trailer", item?.source, item?.externalId],
    queryFn: async () => {
      if (!item || item.source !== "tmdb") return { trailerUrl: null }
      const kind = item.subType === "tv" ? "tv" : "movie"
      const res = await fetch(`/api/tmdb?section=trailer&kind=${kind}&id=${item.externalId}`)
      if (!res.ok) return { trailerUrl: null }
      const json = (await res.json()) as { url: string | null }
      return { trailerUrl: json.url }
    },
    enabled: !!item && item.source === "tmdb",
    staleTime: 1000 * 60 * 60 * 12,
  })

  // Similar: same source, first genre, current item filtered out.
  const similar = useQuery<MediaItem[]>({
    queryKey: ["similar", item?.source, item?.externalId, item?.genres[0]],
    queryFn: async () => {
      if (!item?.genres.length) return []
      const sub = params.get("sub") ?? ""
      const type = item.mediaType
      let url: string
      if (type === "movie") {
        const kind = item.subType === "tv" ? "tv" : "movie"
        url = `/api/tmdb?section=more&kind=${kind}&genres=${encodeURIComponent(item.genres[0])}`
      } else if (type === "anime" || type === "manga") {
        const t = type === "anime" ? "ANIME" : "MANGA"
        url = `/api/anilist?section=more&type=${t}&sub=${sub}&genres=${encodeURIComponent(item.genres[0])}`
      } else {
        url = `/api/books?section=relevance&sub=${sub}&genres=${encodeURIComponent(item.genres[0])}`
      }
      const res = await fetch(url)
      if (!res.ok) return []
      const all = (await res.json()) as MediaItem[]
      return all.filter(i => String(i.id) !== String(item.id)).slice(0, 8)
    },
    enabled: !!item,
    staleTime: 1000 * 60 * 60,
  })

  if (!item) return null

  const full = details.data
  const backdrop = full?.backdropUrl ?? item.backdropUrl
  const externalUrl =
    item.externalUrl ??
    (item.source === "tmdb"
      ? `https://www.themoviedb.org/${item.subType === "tv" ? "tv" : "movie"}/${item.externalId}`
      : undefined)
  const ytKey = trailer.data?.trailerUrl ? extractYouTubeKey(trailer.data.trailerUrl) : null
  const metaBadges = (full?.genres ?? item.genres).slice(0, 3)
  const metaBits = [
    item.author,
    item.episodeCount ? `${item.episodeCount} eps` : null,
    item.chapterCount ? `${item.chapterCount} ch` : null,
    item.pageCount ? `${item.pageCount} pages` : null,
    item.status,
  ].filter(Boolean)

  return (
    <Dialog open onOpenChange={open => !open && close()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92dvh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden overflow-y-auto rounded-2xl p-0 sm:max-w-2xl lg:max-w-3xl"
      >
        <DialogTitle className="sr-only">{item.title}</DialogTitle>

        {/* ── Hero backdrop ─────────────────────────────── */}
        <div className="relative">
          <div className="h-48 w-full overflow-hidden md:h-64">
            {backdrop ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote backdrops from several CDNs
              <img src={backdrop} alt="" className="size-full object-cover" />
            ) : (
              <div className="size-full bg-gradient-to-br from-accent-book/30 via-card to-accent-movie/20" />
            )}
          </div>
          {/* melt backdrop into card */}
          <div className="absolute inset-0 bg-gradient-to-t from-popover via-popover/30 to-transparent" />

          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-all hover:scale-110 hover:bg-black/85"
          >
            <X className="size-4" />
          </button>

          {/* Trailer overlay replaces backdrop when playing */}
          {showTrailer && ytKey && (
            <div className="absolute inset-0 z-10 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${ytKey}?autoplay=1&rel=0`}
                title={`${item.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            </div>
          )}

          {/* Poster + title overlapping the backdrop */}
          <div className="relative -mt-16 flex items-end gap-4 px-6 md:-mt-20 md:px-9">
            <motion.div
              initial={{ opacity: 0, y: 16, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 }}
              className="shrink-0"
            >
              {item.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote posters from several CDNs
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="h-36 w-24 rounded-xl object-cover shadow-2xl shadow-black/70 ring-1 ring-white/15 md:h-44 md:w-32"
                />
              ) : (
                <div className="flex h-36 w-24 items-center justify-center rounded-xl bg-card p-2 text-center text-xs text-muted-foreground ring-1 ring-white/10 md:h-44 md:w-32">
                  {item.title}
                </div>
              )}
            </motion.div>
            <div className="min-w-0 pb-1">
              <h2 className="break-words font-display text-xl font-bold leading-tight md:text-3xl [overflow-wrap:anywhere]">
                {item.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {item.rating > 0 && (
                  <Badge className="gap-1 border-0 bg-amber-500/15 text-amber-400">
                    <Star className="size-3 fill-amber-400" /> {item.rating.toFixed(1)}
                  </Badge>
                )}
                {(full?.year || item.year) && (
                  <Badge variant="secondary" className="font-mono">
                    {full?.year || item.year}
                  </Badge>
                )}
                {metaBadges.map(g => (
                  <Badge key={g} variant="outline">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────── */}
        <div className="min-w-0 px-6 pb-8 pt-5 md:px-9 md:pb-10">
          {metaBits.length > 0 && (
            <p className="mb-3 break-words font-mono text-xs leading-relaxed text-muted-foreground">
              {metaBits.join(" • ")}
            </p>
          )}
          {/* Full description — never truncated, wraps inside the pane */}
          <p className="min-w-0 break-words text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
            {full?.description || item.description || "No description available."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {ytKey && (
              <Button onClick={() => setShowTrailer(v => !v)} className="gap-2">
                <Play className="size-4" />
                {showTrailer ? "Hide Trailer" : "Watch Trailer"}
              </Button>
            )}
            <Button
              variant={saved ? "secondary" : "outline"}
              onClick={() => setSaved(toggleSaved(item))}
              className="gap-2"
            >
              <motion.span
                key={String(saved)}
                initial={{ scale: 1.6, rotate: saved ? 0 : -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className="inline-flex"
              >
                {saved ? (
                  <BookmarkCheck className="size-4 text-accent-book" />
                ) : (
                  <Bookmark className="size-4" />
                )}
              </motion.span>
              {saved ? "Saved" : "Save"}
            </Button>
            {externalUrl && (
              <Button
                variant="ghost"
                onClick={() => window.open(externalUrl, "_blank", "noopener")}
                className="gap-2"
              >
                <ExternalLink className="size-4" />
                {item.source === "anilist"
                  ? "AniList"
                  : item.source === "tmdb"
                    ? "TMDB"
                    : "Google Books"}
              </Button>
            )}
          </div>

          {/* ── Similar titles ─────────────────────────── */}
          {similar.data && similar.data.length > 0 && (
            <div className="mt-7">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                You might also like
              </h3>
              <MediaRow items={similar.data} onItemClick={setSelected} bleed={false} cardSize="sm" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
