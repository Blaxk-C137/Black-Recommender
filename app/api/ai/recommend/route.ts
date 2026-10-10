import { NextResponse } from "next/server"
import { searchAniList } from "@/lib/api/anilist"
import { searchBooks } from "@/lib/api/books"
import { getAIRecommendation } from "@/lib/api/gemini"
import { searchTmdb } from "@/lib/api/tmdb"
import type { MediaItem } from "@/lib/types/media.types"
import { parseGenresParam } from "@/lib/utils/formatters"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") ?? "movie"
  const sub = searchParams.get("sub") ?? ""
  const genres = parseGenresParam(searchParams.get("genres"))

  try {
    const recommendation = await getAIRecommendation(type, sub, genres)

    // Best-effort poster lookup — never fails the request.
    let item: MediaItem | null = null
    try {
      if (type === "movie") {
        const kind = sub === "series" ? "tv" : "movie"
        item = (await searchTmdb(recommendation.searchQuery, kind))[0] ?? null
      } else if (type === "anime") {
        item = (await searchAniList(recommendation.searchQuery, "ANIME"))[0] ?? null
      } else if (type === "manga") {
        item = (await searchAniList(recommendation.searchQuery, "MANGA"))[0] ?? null
      } else {
        item = (await searchBooks(recommendation.searchQuery))[0] ?? null
      }
    } catch {
      item = null
    }

    return NextResponse.json({ recommendation, item })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gemini error" },
      { status: 502 }
    )
  }
}
