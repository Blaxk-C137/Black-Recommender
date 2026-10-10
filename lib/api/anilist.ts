
import type { MediaItem } from "@/lib/types/media.types"
import { stripHtml } from "@/lib/utils/formatters"

const ANILIST_URL = process.env.ANILIST_BASE_URL ?? "https://graphql.anilist.co"

export type AniListType = "ANIME" | "MANGA"
export type AniListSort = "SCORE_DESC" | "TRENDING_DESC" | "POPULARITY_DESC"

/** Selected-genre strings that are AniList TAGS (not genres) → tag names. */
const ANILIST_TAG_MAP: Record<string, string> = {
  Shonen: "Shounen",
  Shojo: "Shoujo",
  Seinen: "Seinen",
  Isekai: "Isekai",
  "School Life": "School",
  "Martial Arts": "Martial Arts",
}

export function splitAnilistGenres(genres: string[]): { genres: string[]; tags: string[] } {
  const tags: string[] = []
  const rest = genres.filter(g => {
    const tag = ANILIST_TAG_MAP[g]
    if (tag) {
      tags.push(tag)
      return false
    }
    return true
  })
  return { genres: rest, tags }
}

const FIELDS = `
  id
  title { romaji english }
  description(asHtml: false)
  averageScore
  coverImage { large }
  bannerImage
  startDate { year }
  genres
  format
  status
  episodes
  chapters
  siteUrl
`

const LIST_QUERY = `
query ($page: Int, $perPage: Int, $type: MediaType, $sort: [MediaSort], $genres: [String], $tags: [String], $countryOfOrigin: CountryCode, $formats: [MediaFormat], $search: String) {
  Page(page: $page, perPage: $perPage) {
    media(type: $type, sort: $sort, genre_in: $genres, tag_in: $tags, countryOfOrigin: $countryOfOrigin, format_in: $formats, search: $search, isAdult: false) {
      ${FIELDS}
    }
  }
}`

const DETAIL_QUERY = `
query ($id: Int) {
  Media(id: $id) {
    ${FIELDS}
  }
}`

export interface AniListMedia {
  id: number
  title: { romaji: string | null; english: string | null }
  description: string | null
  averageScore: number | null
  coverImage: { large: string | null } | null
  bannerImage: string | null
  startDate: { year: number | null } | null
  genres: string[] | null
  format: string | null
  status: string | null
  episodes: number | null
  chapters: number | null
  siteUrl: string | null
}

async function anilistRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`AniList request failed: ${res.status}`)
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] }
  if (json.errors?.length) throw new Error(`AniList error: ${json.errors[0].message}`)
  if (!json.data) throw new Error("AniList returned no data")
  return json.data
}

export function mapAnilistItem(m: AniListMedia, type: AniListType): MediaItem {
  return {
    id: m.id,
    title: m.title.english ?? m.title.romaji ?? "Untitled",
    description: stripHtml(m.description),
    posterUrl: m.coverImage?.large ?? "",
    backdropUrl: m.bannerImage ?? undefined,
    rating: m.averageScore ? Math.round(m.averageScore) / 10 : 0,
    year: m.startDate?.year ? String(m.startDate.year) : "",
    genres: m.genres ?? [],
    mediaType: type === "ANIME" ? "anime" : "manga",
    source: "anilist",
    externalId: String(m.id),
    externalUrl: m.siteUrl ?? undefined,
    status: m.status ?? undefined,
    episodeCount: m.episodes ?? undefined,
    chapterCount: m.chapters ?? undefined,
  }
}

export interface AniListQueryOpts {
  type: AniListType
  genres?: string[]
  countryOfOrigin?: "JP" | "KR" | "CN"
  formats?: string[]
  search?: string
  page?: number
}

export async function anilistMedia(sort: AniListSort, opts: AniListQueryOpts): Promise<MediaItem[]> {
  const { genres, tags } = splitAnilistGenres(opts.genres ?? [])
  const data = await anilistRequest<{ Page: { media: AniListMedia[] } }>(LIST_QUERY, {
    page: opts.page ?? 1,
    perPage: 20,
    type: opts.type,
    sort: [sort],
    genres: genres.length ? genres : undefined,
    tags: tags.length ? tags : undefined,
    countryOfOrigin: opts.countryOfOrigin,
    formats: opts.formats,
    search: opts.search,
  })
  return data.Page.media.map(m => mapAnilistItem(m, opts.type))
}

export async function getAniListDetails(id: number, type: AniListType): Promise<MediaItem> {
  const data = await anilistRequest<{ Media: AniListMedia }>(DETAIL_QUERY, { id })
  return mapAnilistItem(data.Media, type)
}

export async function searchAniList(query: string, type: AniListType): Promise<MediaItem[]> {
  return anilistMedia("POPULARITY_DESC", { type, search: query })
}
