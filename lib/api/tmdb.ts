import type { MediaItem } from "@/lib/types/media.types"

const BASE_URL = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3"
const IMG_BASE = "https://image.tmdb.org/t/p/w500"

export type TmdbKind = "movie" | "tv"

export const TMDB_GENRE_MAP: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  Historical: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Reality: 10764,
  Romance: 10749,
  "Sci-Fi": 878,
  Thriller: 53,
  War: 10752,
  Western: 37,
}

const ID_TO_GENRE = Object.fromEntries(
  Object.entries(TMDB_GENRE_MAP).map(([name, id]) => [id, name])
)

export interface TmdbResult {
  id: number
  title?: string
  name?: string
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  vote_average?: number
  release_date?: string
  first_air_date?: string
  genre_ids?: number[]
  genres?: { id: number; name: string }[]
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  const key = process.env.TMDB_API_KEY
  if (!key) throw new Error("TMDB_API_KEY is not set")
  const url = new URL(`${BASE_URL}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v))
  url.searchParams.set("api_key", key)
  // Pass the URL as a string so consumers (and tests) can inspect the exact request URL.
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB request failed: ${res.status} ${path}`)
  return (await res.json()) as T
}

export function mapTmdbItem(r: TmdbResult, kind: TmdbKind): MediaItem {
  const date = r.release_date ?? r.first_air_date ?? ""
  const genres = r.genres
    ? r.genres.map(g => g.name)
    : (r.genre_ids ?? []).map(id => ID_TO_GENRE[id]).filter(Boolean)
  return {
    id: r.id,
    title: r.title ?? r.name ?? "Untitled",
    description: r.overview ?? "",
    posterUrl: r.poster_path ? `${IMG_BASE}${r.poster_path}` : "",
    backdropUrl: r.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${r.backdrop_path}`
      : undefined,
    rating: Math.round((r.vote_average ?? 0) * 10) / 10,
    year: date.slice(0, 4),
    genres,
    mediaType: "movie",
    subType: kind,
    source: "tmdb",
    externalId: String(r.id),
  }
}

export async function getBestRated(
  kind: TmdbKind,
  genreIds: number[],
  page = 1
): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: TmdbResult[] }>(`/discover/${kind}`, {
    with_genres: genreIds.join(","),
    sort_by: "vote_average.desc",
    "vote_count.gte": 300,
    include_adult: false,
    page,
  })
  return data.results.map(r => mapTmdbItem(r, kind))
}

export async function getMoreByGenre(
  kind: TmdbKind,
  genreIds: number[],
  page = 1
): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: TmdbResult[] }>(`/discover/${kind}`, {
    with_genres: genreIds.join(","),
    sort_by: "popularity.desc",
    include_adult: false,
    page,
  })
  return data.results.map(r => mapTmdbItem(r, kind))
}

export async function getTrending(kind: TmdbKind): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: TmdbResult[] }>(`/trending/${kind}/week`)
  return data.results.map(r => mapTmdbItem(r, kind))
}

export async function getTmdbDetails(kind: TmdbKind, id: number): Promise<MediaItem> {
  const r = await tmdbFetch<TmdbResult>(`/${kind}/${id}`)
  return mapTmdbItem(r, kind)
}

export async function getTrailerUrl(kind: TmdbKind, id: number): Promise<string | null> {
  const data = await tmdbFetch<{ results: { key: string; type: string; site: string }[] }>(
    `/${kind}/${id}/videos`
  )
  const trailer = data.results.find(
    v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  )
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
}

export async function searchTmdb(query: string, kind: TmdbKind): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: TmdbResult[] }>(`/search/${kind}`, {
    query,
    include_adult: false,
  })
  return data.results.filter(r => r.poster_path).map(r => mapTmdbItem(r, kind))
}
