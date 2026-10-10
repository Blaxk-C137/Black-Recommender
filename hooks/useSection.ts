"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import type { MediaItem } from "@/lib/types/media.types"
import { parseGenresParam } from "@/lib/utils/formatters"
import type { MediaType } from "@/lib/utils/constants"
import { buildSectionUrl, type SectionId } from "@/lib/utils/sections"

const HOUR = 1000 * 60 * 60
const DAY = HOUR * 24

export function useSection(section: SectionId, page = 1): UseQueryResult<MediaItem[]> {
  const params = useSearchParams()
  const type = (params.get("type") ?? "movie") as MediaType
  const sub = params.get("sub") ?? ""
  const genres = parseGenresParam(params.get("genres"))
  const url = buildSectionUrl(type, sub, genres, section, page)

  return useQuery({
    queryKey: ["section", type, sub, genres, section, page],
    queryFn: async () => {
      const res = await fetch(url)
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? `Request failed: ${res.status}`)
      }
      return (await res.json()) as MediaItem[]
    },
    // Trending/newest change faster than best-rated/discover lists.
    staleTime: section === "trending" || section === "new-releases" ? HOUR : DAY,
    gcTime: DAY,
  })
}
