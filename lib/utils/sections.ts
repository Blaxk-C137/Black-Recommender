import type { MediaType } from "./constants"

export type SectionId = "best-rated" | "trending" | "in-genres" | "new-releases" | "more"

export const SECTION_TITLES: Record<SectionId, string> = {
  "best-rated": "★ Best Rated",
  trending: "🔥 Trending Now",
  "in-genres": "📚 In Your Genres",
  "new-releases": "🆕 New Releases",
  more: "🎯 More in Your Genres",
}

export function sectionsFor(type: MediaType): SectionId[] {
  return type === "book"
    ? ["in-genres", "new-releases", "more"]
    : ["best-rated", "trending", "more"]
}

export function buildSectionUrl(
  type: MediaType,
  sub: string,
  genres: string[],
  section: SectionId,
  page = 1
): string {
  const g = encodeURIComponent(genres.join(","))
  if (type === "book") {
    if (section === "new-releases")
      return `/api/books?section=newest&sub=${sub}&genres=${g}`
    if (section === "in-genres")
      return `/api/books?section=relevance&sub=${sub}&genres=${g}`
    return `/api/books?section=relevance&sub=${sub}&genres=${g}&page=${page}`
  }
  if (type === "anime" || type === "manga") {
    const t = type === "anime" ? "ANIME" : "MANGA"
    if (section === "best-rated")
      return `/api/anilist?section=best&type=${t}&sub=${sub}&genres=${g}`
    if (section === "trending")
      return `/api/anilist?section=trending&type=${t}&sub=${sub}&genres=${g}`
    return `/api/anilist?section=more&type=${t}&sub=${sub}&genres=${g}&page=${page}`
  }
  const kind = sub === "series" ? "tv" : "movie"
  if (section === "best-rated")
    return `/api/tmdb?section=best-rated&kind=${kind}&genres=${g}`
  if (section === "trending") return `/api/tmdb?section=trending&kind=${kind}`
  return `/api/tmdb?section=more&kind=${kind}&genres=${g}&page=${page}`
}
