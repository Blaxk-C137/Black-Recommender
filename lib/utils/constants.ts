
export const MEDIA_TYPES = ["movie", "anime", "manga", "book"] as const
export type MediaType = (typeof MEDIA_TYPES)[number]

/** Recency floor: nothing older than this year is ever recommended. */
export const MIN_YEAR = 2008

export const MEDIA_LABELS: Record<MediaType, string> = {
  movie: "Movie",
  anime: "Anime",
  manga: "Manga",
  book: "Book",
}

export const MEDIA_EMOJI: Record<MediaType, string> = {
  movie: "🎬",
  anime: "📺",
  manga: "📚",
  book: "📖",
}

export interface SubTypeOption {
  value: string
  label: string
  emoji: string
}

export const SUBTYPES: Record<MediaType, SubTypeOption[]> = {
  movie: [
    { value: "movie", label: "Single Movie", emoji: "🎥" },
    { value: "series", label: "Series / TV Show", emoji: "📺" },
  ],
  anime: [
    { value: "tv", label: "Series", emoji: "📺" },
    { value: "movie", label: "Movie", emoji: "🎬" },
    { value: "ova", label: "OVA / Special", emoji: "📦" },
  ],
  manga: [
    { value: "manga", label: "Manga", emoji: "📚" },
    { value: "manhwa", label: "Manhwa (Korean)", emoji: "📓" },
    { value: "manhua", label: "Manhua (Chinese)", emoji: "🀄" },
  ],
  book: [
    { value: "fiction", label: "Fiction", emoji: "📖" },
    { value: "nonfiction", label: "Non-Fiction", emoji: "📰" },
  ],
}

export interface GenreGroup {
  label?: string
  genres: string[]
}

const ANIME_SERIES_GENRES: GenreGroup[] = [
  { label: "Vibe", genres: ["Shonen", "Shojo", "Seinen"] },
  {
    genres: [
      "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
      "Isekai", "Mecha", "Mystery", "Psychological", "Romance", "Sci-Fi",
      "Slice of Life", "Sports", "Supernatural",
    ],
  },
]

const MANGA_GENRES: GenreGroup[] = [
  { label: "Vibe", genres: ["Shonen", "Shojo", "Seinen"] },
  {
    genres: [
      "Action", "Comedy", "Fantasy", "Horror", "Isekai", "Martial Arts",
      "Mystery", "Psychological", "Romance", "School Life", "Slice of Life",
      "Supernatural",
    ],
  },
]

export const GENRE_GROUPS: Record<MediaType, Record<string, GenreGroup[]>> = {
  movie: {
    movie: [
      {
        genres: [
          "Action", "Animation", "Comedy", "Crime", "Documentary", "Drama",
          "Fantasy", "Historical", "Horror", "Mystery", "Romance", "Sci-Fi",
          "Thriller",
        ],
      },
    ],
    series: [
      {
        genres: [
          "Action", "Animation", "Comedy", "Crime", "Documentary", "Drama",
          "Fantasy", "Horror", "Mystery", "Reality", "Romance", "Sci-Fi",
          "Thriller",
        ],
      },
    ],
  },
  anime: {
    tv: ANIME_SERIES_GENRES,
    ova: ANIME_SERIES_GENRES,
    movie: [
      {
        genres: [
          "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
          "Isekai", "Romance", "Sci-Fi", "Slice of Life",
        ],
      },
    ],
  },
  manga: {
    manga: MANGA_GENRES,
    manhwa: MANGA_GENRES,
    manhua: MANGA_GENRES,
  },
  book: {
    fiction: [
      {
        genres: [
          "Fantasy", "Sci-Fi", "Romance", "Mystery", "Thriller", "Horror",
          "Historical", "Literary", "Young Adult", "Classic",
        ],
      },
    ],
    nonfiction: [
      {
        genres: [
          "Self-Help", "Biography", "History", "Science", "Psychology",
          "Philosophy", "True Crime", "Travel", "Business",
        ],
      },
    ],
  },
}
