
import { afterEach, describe, expect, it, vi } from "vitest"
import { anilistMedia, mapAnilistItem, splitAnilistGenres, type AniListMedia } from "./anilist"

// Note: vi.stubGlobal() returns the vi utils object (not the mock), so we
// create the mock first and return it for call inspection.
const mockFetch = (body: unknown) => {
  const fn = vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }))
  vi.stubGlobal("fetch", fn)
  return fn
}

afterEach(() => vi.unstubAllGlobals())

describe("splitAnilistGenres", () => {
  it("sends demographics and isekai to tags, rest to genres", () => {
    const { genres, tags } = splitAnilistGenres(["Shonen", "Action", "Isekai", "Romance"])
    expect(tags).toEqual(["Shounen", "Isekai"])
    expect(genres).toEqual(["Action", "Romance"])
  })
  it("passes through plain genres untouched", () => {
    expect(splitAnilistGenres(["Horror", "Mecha"])).toEqual({
      genres: ["Horror", "Mecha"],
      tags: [],
    })
  })
})

describe("mapAnilistItem", () => {
  const fixture: AniListMedia = {
    id: 1,
    title: { romaji: "Romaji Title", english: "English Title" },
    description: "<p>Some <b>description</b></p>",
    averageScore: 86,
    coverImage: { large: "https://img.example/cover.jpg" },
    bannerImage: "https://img.example/banner.jpg",
    startDate: { year: 2019 },
    genres: ["Action", "Drama"],
    format: "TV",
    status: "FINISHED",
    episodes: 24,
    chapters: null,
    siteUrl: "https://anilist.co/anime/1",
  }

  it("prefers english title, strips html, normalizes score", () => {
    const item = mapAnilistItem(fixture, "ANIME")
    expect(item.title).toBe("English Title")
    expect(item.description).toBe("Some description")
    expect(item.rating).toBe(8.6)
    expect(item.mediaType).toBe("anime")
    expect(item.source).toBe("anilist")
    expect(item.episodeCount).toBe(24)
    expect(item.externalUrl).toBe("https://anilist.co/anime/1")
  })

  it("falls back to romaji title and zero score", () => {
    const item = mapAnilistItem(
      { ...fixture, title: { romaji: "Romaji Only", english: null }, averageScore: null },
      "MANGA"
    )
    expect(item.title).toBe("Romaji Only")
    expect(item.rating).toBe(0)
    expect(item.mediaType).toBe("manga")
  })
})

describe("anilistMedia", () => {
  it("POSTs the GraphQL query with variables", async () => {
    const fetchMock = mockFetch({ data: { Page: { media: [] } } })
    await anilistMedia("SCORE_DESC", { type: "ANIME", genres: ["Action"], formats: ["TV"] })
    const [url, init] = (fetchMock as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit]
    expect(url).toBe("https://graphql.anilist.co")
    expect(init.method).toBe("POST")
    const body = JSON.parse(init.body as string)
    expect(body.query).toContain("genre_in: $genres")
    expect(body.variables).toEqual({
      page: 1, perPage: 20, type: "ANIME", sort: ["SCORE_DESC"],
      genres: ["Action"], tags: undefined, countryOfOrigin: undefined,
      formats: ["TV"], search: undefined, startDateGreater: 20080000,
    })
    expect(body.query).toContain("startDate_greater: $startDateGreater")
  })
})
