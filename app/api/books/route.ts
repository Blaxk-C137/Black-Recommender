
import { NextResponse } from "next/server"
import { getBooks, searchBooks } from "@/lib/api/books"
import { parseGenresParam } from "@/lib/utils/formatters"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get("section") ?? ""
  const genres = parseGenresParam(searchParams.get("genres"))
  const page = Number(searchParams.get("page") ?? 0) || 0
  const q = searchParams.get("q") ?? undefined

  try {
    switch (section) {
      case "relevance":
        return NextResponse.json(await getBooks(genres, "relevance", page))
      case "newest":
        return NextResponse.json(await getBooks(genres, "newest", page))
      case "search":
        return NextResponse.json(await searchBooks(q ?? ""))
      default:
        return NextResponse.json({ error: `Unknown section: ${section}` }, { status: 400 })
    }
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Books error" }, { status: 502 })
  }
}
