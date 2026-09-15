import { afterEach, describe, expect, it, vi } from "vitest"
import { getBestRated, mapTmdbItem, TMDB_GENRE_MAP } from "./tmdb"

// Note: vi.stubGlobal() returns the vi utils object (not the mock), so we
// create the mock first and return it for call inspection.
const mockFetch = (body: unknown) => {
  const fn = vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }))
  vi.stubGlobal("fetch", fn)
  return fn
}

afterEach(() => vi.unstubAllGlobals())

describe("TMDB_GENRE_MAP", () => {
  it("contains required genres", () => {
    expect(TMDB_GENRE_MAP["Action"]).toBe(28)
    expect(TMDB_GENRE_MAP["Animation"]).toBe(16)
    expect(TMDB_GENRE_MAP["Sci-Fi"]).toBe(878)
  })
})

describe("mapTmdbItem", () => {
  it("maps a movie result", () => {
    const item = mapTmdbItem(
      {
        id: 1,
        title: "Test Movie",
        overview: "An overview",
        poster_path: "/abc.jpg",
        backdrop_path: "/bg.jpg",
        vote_average: 8.44,
        release_date: "2019-05-01",
        genre_ids: [28, 878],
      },
      "movie"
    )
    expect(item.title).toBe("Test Movie")
    expect(item.posterUrl).toBe("https://image.tmdb.org/t/p/w500/abc.jpg")
    expect(item.rating).toBe(8.4)
    expect(item.year).toBe("2019")
    expect(item.genres).toEqual(["Action", "Sci-Fi"])
    expect(item.subType).toBe("movie")
    expect(item.source).toBe("tmdb")
  })

  it("maps a tv result using name/first_air_date and falls back on missing poster", () => {
    const item = mapTmdbItem(
      { id: 2, name: "Test Show", overview: "", poster_path: null, vote_average: 0, first_air_date: "2021-01-01", genre_ids: [18] },
      "tv"
    )
    expect(item.title).toBe("Test Show")
    expect(item.posterUrl).toBe("")
    expect(item.subType).toBe("tv")
    expect(item.genres).toEqual(["Drama"])
  })
})

describe("getBestRated", () => {
  it("uses /discover with genre filter and vote_count floor", async () => {
    const fetchMock = mockFetch({ results: [] })
    process.env.TMDB_API_KEY = "test-key"
    await getBestRated("movie", [28, 878], 2)
    const url = (fetchMock as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(url).toContain("/discover/movie")
    expect(url).toContain("with_genres=28%2C878")
    expect(url).toContain("sort_by=vote_average.desc")
    expect(url).toContain("vote_count.gte=300")
    expect(url).toContain("page=2")
  })

  it("throws a clear error when TMDB_API_KEY is missing", async () => {
    delete process.env.TMDB_API_KEY
    await expect(getBestRated("movie", [])).rejects.toThrow("TMDB_API_KEY is not set")
  })
})
