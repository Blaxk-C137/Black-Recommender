"use client"

import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { Bookmark, BookmarkCheck, ExternalLink, Play, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MediaRow } from "./MediaRow"
import { SectionTitle } from "./SectionTitle"
import { useUIStore } from "@/lib/store/useUIStore"
import type { MediaItem } from "@/lib/types/media.types"
import { truncate } from "@/lib/utils/formatters"
import { isSaved, toggleSaved } from "@/lib/utils/storage"

export function DetailModal() {
  const item = useUIStore(s => s.selectedItem)
  const setSelected = useUIStore(s => s.setSelectedItem)
  const close = () => setSelected(null)
  const params = useSearchParams()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (item) setSaved(isSaved(item.id))
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
  const trailer = useQuery<{ url: string | null }>({
    queryKey: ["trailer", item?.source, item?.externalId],
    queryFn: async () => {
      if (!item || item.source !== "tmdb") return { url: null }
      const kind = item.subType === "tv" ? "tv" : "movie"
      const res = await fetch(`/api/tmdb?section=trailer&kind=${kind}&id=${item.externalId}`)
      if (!res.ok) return { url: null }
      return (await res.json()) as { url: string | null }
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
  const externalUrl =
    item.externalUrl ??
    (item.source === "tmdb"
      ? `https://www.themoviedb.org/${item.subType === "tv" ? "tv" : "movie"}/${item.externalId}`
      : undefined)

  return (
    <Dialog open onOpenChange={open => !open && close()}>
      <DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto p-0">
        <DialogTitle className="sr-only">{item.title}</DialogTitle>
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 transition-colors hover:bg-black/80"
        >
          <X className="size-4" />
        </button>

        {full?.backdropUrl || item.backdropUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote backdrops from several CDNs
          <img
            src={(full?.backdropUrl ?? item.backdropUrl) as string}
            alt=""
            className="h-48 w-full rounded-t-xl object-cover md:h-64"
          />
        ) : (
          <div className="h-24 w-full rounded-t-xl bg-gradient-to-br from-card to-surface" />
        )}

        <div className="flex flex-col gap-4 p-6 md:flex-row">
          {item.posterUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- remote posters from several CDNs
            <img
              src={item.posterUrl}
              alt={item.title}
              className="h-48 w-32 shrink-0 rounded-lg border border-border object-cover"
            />
          )}
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold">{item.title}</h2>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {[
                item.rating > 0 ? `★ ${item.rating.toFixed(1)}` : null,
                full?.year || item.year,
                ...(full?.genres ?? item.genres).slice(0, 3),
                item.author,
                item.episodeCount ? `${item.episodeCount} eps` : null,
                item.chapterCount ? `${item.chapterCount} ch` : null,
                item.pageCount ? `${item.pageCount} pages` : null,
                item.status,
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {truncate(full?.description || item.description, 300)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {trailer.data?.url && (
                <Button onClick={() => window.open(trailer.data?.url ?? "", "_blank")} className="gap-2">
                  <Play className="size-4" /> Watch Trailer
                </Button>
              )}
              <Button
                variant={saved ? "secondary" : "outline"}
                onClick={() => setSaved(toggleSaved(item))}
                className="gap-2"
              >
                {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                {saved ? "Saved" : "Save"}
              </Button>
              {externalUrl && (
                <Button
                  variant="ghost"
                  onClick={() => window.open(externalUrl, "_blank")}
                  className="gap-2"
                >
                  <ExternalLink className="size-4" /> View on{" "}
                  {item.source === "anilist"
                    ? "AniList"
                    : item.source === "tmdb"
                      ? "TMDB"
                      : "Google Books"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {similar.data && similar.data.length > 0 && (
          <div className="px-6 pb-6">
            <SectionTitle>Similar Titles</SectionTitle>
            <MediaRow items={similar.data} onItemClick={setSelected} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
