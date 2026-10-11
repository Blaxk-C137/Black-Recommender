
import type { MediaItem } from "@/lib/types/media.types"
import { MIN_YEAR } from "@/lib/utils/constants"
import { filterByMinYear } from "@/lib/utils/formatters"

const BASE_URL = process.env.GOOGLE_BOOKS_BASE_URL ?? "https://www.googleapis.com/books/v1"

const GOOGLE_BOOKS_MAP: Record<string, string> = {
  Fantasy: "fantasy",
  "Sci-Fi": "science fiction",
  Romance: "romance",
  Mystery: "mystery",
  Thriller: "thriller",
  Horror: "horror",
  Historical: "historical fiction",
  Literary: "literary fiction",
  "Young Adult": "young adult fiction",
  Classic: "classics",
  "Self-Help": "self-help",
  Biography: "biography",
  History: "history",
  Science: "science",
  Psychology: "psychology",
  Philosophy: "philosophy",
  "True Crime": "true crime",
  Travel: "travel",
  Business: "business",
}

export type BookOrderBy = "relevance" | "newest"

export function buildBooksQuery(genres: string[]): string {
  return genres.map(g => `subject:${GOOGLE_BOOKS_MAP[g] ?? g}`).join(" ")
}

export interface GoogleVolume {
  id: string
  volumeInfo: {
    title?: string
    authors?: string[]
    description?: string
    averageRating?: number
    imageLinks?: { thumbnail?: string }
    publishedDate?: string
    categories?: string[]
    industryIdentifiers?: { type: string; identifier: string }[]
    pageCount?: number
  }
}

export function mapBookItem(v: GoogleVolume): MediaItem {
  const info = v.volumeInfo
  const thumbnail = info.imageLinks?.thumbnail?.replace("http://", "https://")
  const isbn13 = info.industryIdentifiers?.find(i => i.type === "ISBN_13")?.identifier
  return {
    id: v.id,
    title: info.title ?? "Untitled",
    description: info.description ?? "",
    posterUrl: thumbnail ?? (isbn13 ? `https://covers.openlibrary.org/b/isbn/${isbn13}-L.jpg` : ""),
    rating: Math.round((info.averageRating ?? 0) * 2 * 10) / 10,
    year: (info.publishedDate ?? "").slice(0, 4),
    genres: info.categories ?? [],
    mediaType: "book",
    source: "googlebooks",
    externalId: v.id,
    author: info.authors?.[0],
    pageCount: info.pageCount,
  }
}

export async function getBooks(
  genres: string[],
  orderBy: BookOrderBy,
  page = 0
): Promise<MediaItem[]> {
  const key = process.env.GOOGLE_BOOKS_API_KEY
  if (!key) throw new Error("GOOGLE_BOOKS_API_KEY is not set")
  const params = new URLSearchParams({
    q: buildBooksQuery(genres),
    printType: "books",
    maxResults: "20",
    orderBy,
    startIndex: String(page * 20),
    key,
  })
  const res = await fetch(`${BASE_URL}/volumes?${params}`)
  if (!res.ok) throw new Error(`Google Books request failed: ${res.status}`)
  const json = (await res.json()) as { items?: GoogleVolume[] }
  return filterByMinYear((json.items ?? []).map(mapBookItem).filter(b => b.posterUrl), MIN_YEAR)
}

export async function searchBooks(query: string): Promise<MediaItem[]> {
  const key = process.env.GOOGLE_BOOKS_API_KEY
  if (!key) throw new Error("GOOGLE_BOOKS_API_KEY is not set")
  const params = new URLSearchParams({ q: query, maxResults: "5", key })
  const res = await fetch(`${BASE_URL}/volumes?${params}`)
  if (!res.ok) throw new Error(`Google Books request failed: ${res.status}`)
  const json = (await res.json()) as { items?: GoogleVolume[] }
  return (json.items ?? []).map(mapBookItem).filter(b => b.posterUrl)
}
