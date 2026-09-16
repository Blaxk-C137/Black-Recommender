import { NextResponse } from "next/server"
import {
  anilistMedia, getAniListDetails, searchAniList, type AniListType,
} from "@/lib/api/anilist"
import { parseGenresParam } from "@/lib/utils/formatters"

const ANIME_FORMATS: Record<string, string[]> = {
  tv: ["TV", "TV_SHORT"],
  movie: ["MOVIE"],
  ova: ["OVA", "ONA", "SPECIAL"],
}

const MANGA_COUNTRY: Record<string, "JP" | "KR" | "CN"> = {
  manga: "JP",
  manhwa: "KR",
  manhua: "CN",
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get("section") ?? ""
  const type = (searchParams.get("type") === "MANGA" ? "MANGA" : "ANIME") as AniListType
  const sub = searchParams.get("sub") ?? ""
  const genres = parseGenresParam(searchParams.get("genres"))
  const page = Number(searchParams.get("page") ?? 1) || 1
  const id = Number(searchParams.get("id"))
  const q = searchParams.get("q") ?? undefined

  const opts = {
    type,
    genres,
    formats: type === "ANIME" ? ANIME_FORMATS[sub] : undefined,
    countryOfOrigin: type === "MANGA" ? MANGA_COUNTRY[sub] : undefined,
    page,
  }

  try {
    switch (section) {
      case "best":
        return NextResponse.json(await anilistMedia("SCORE_DESC", opts))
      case "trending":
        return NextResponse.json(await anilistMedia("TRENDING_DESC", opts))
      case "more":
        return NextResponse.json(await anilistMedia("POPULARITY_DESC", opts))
      case "details":
        if (!Number.isInteger(id) || id <= 0) {
          return NextResponse.json({ error: "Missing or invalid id" }, { status: 400 })
        }
        return NextResponse.json(await getAniListDetails(id, type))
      case "search":
        return NextResponse.json(await searchAniList(q ?? "", type))
      default:
        return NextResponse.json({ error: `Unknown section: ${section}` }, { status: 400 })
    }
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "AniList error" }, { status: 502 })
  }
}
