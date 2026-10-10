
import { NextResponse } from "next/server"
import {
  getBestRated, getMoreByGenre, getTmdbDetails, getTrailerUrl, getTrending,
  TMDB_GENRE_MAP, type TmdbKind,
} from "@/lib/api/tmdb"
import { parseGenresParam } from "@/lib/utils/formatters"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get("section") ?? ""
  const kind = (searchParams.get("kind") === "tv" ? "tv" : "movie") as TmdbKind
  const genres = parseGenresParam(searchParams.get("genres"))
  const genreIds = genres.map(g => TMDB_GENRE_MAP[g]).filter((id): id is number => id != null)
  const page = Number(searchParams.get("page") ?? 1) || 1
  const id = Number(searchParams.get("id"))

  try {
    switch (section) {
      case "best-rated":
        return NextResponse.json(await getBestRated(kind, genreIds, page))
      case "trending":
        return NextResponse.json(await getTrending(kind))
      case "more":
        return NextResponse.json(await getMoreByGenre(kind, genreIds, page))
      case "details":
        if (!Number.isInteger(id) || id <= 0) {
          return NextResponse.json({ error: "Missing or invalid id" }, { status: 400 })
        }
        return NextResponse.json(await getTmdbDetails(kind, id))
      case "trailer":
        if (!Number.isInteger(id) || id <= 0) {
          return NextResponse.json({ error: "Missing or invalid id" }, { status: 400 })
        }
        return NextResponse.json({ url: await getTrailerUrl(kind, id) })
      default:
        return NextResponse.json({ error: `Unknown section: ${section}` }, { status: 400 })
    }
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "TMDB error" }, { status: 502 })
  }
}
