"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import type { MediaItem } from "@/lib/types/media.types"
import type { AIRecommendation } from "@/lib/api/gemini"
import { parseGenresParam } from "@/lib/utils/formatters"

export interface AIPickResponse {
  recommendation: AIRecommendation
  item: MediaItem | null
}

export function useAIPick(): UseQueryResult<AIPickResponse> {
  const params = useSearchParams()
  const type = params.get("type") ?? "movie"
  const sub = params.get("sub") ?? ""
  const genres = parseGenresParam(params.get("genres"))

  return useQuery({
    queryKey: ["ai-pick", type, sub, genres],
    queryFn: async () => {
      const res = await fetch(
        `/api/ai/recommend?type=${type}&sub=${sub}&genres=${encodeURIComponent(genres.join(","))}`
      )
      if (!res.ok) throw new Error("AI pick failed")
      return (await res.json()) as AIPickResponse
    },
    staleTime: 1000 * 60 * 30,
    retry: false,
  })
}
