
export interface MediaItem {
  id: string | number
  title: string
  description: string
  posterUrl: string
  backdropUrl?: string
  rating: number // normalized /10
  year: string
  genres: string[]
  mediaType: "movie" | "anime" | "manga" | "book"
  subType?: string
  source: "tmdb" | "anilist" | "googlebooks" | "openlibrary"
  externalId: string
  trailerUrl?: string
  externalUrl?: string
  status?: string
  episodeCount?: number
  chapterCount?: number
  pageCount?: number
  author?: string
  isAIPick?: boolean
}
