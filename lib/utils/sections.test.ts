import { describe, expect, it } from "vitest"
import { buildSectionUrl, sectionsFor, SECTION_TITLES } from "./sections"

describe("sectionsFor", () => {
  it("books get relevance-based sections", () => {
    expect(sectionsFor("book")).toEqual(["in-genres", "new-releases", "more"])
  })
  it("everything else gets rated + trending", () => {
    expect(sectionsFor("movie")).toEqual(["best-rated", "trending", "more"])
    expect(sectionsFor("anime")).toEqual(["best-rated", "trending", "more"])
    expect(sectionsFor("manga")).toEqual(["best-rated", "trending", "more"])
  })
})

describe("buildSectionUrl", () => {
  const genres = ["Action", "Sci-Fi"]

  it("movies map series sub to tv kind", () => {
    expect(buildSectionUrl("movie", "series", genres, "best-rated")).toBe(
      "/api/tmdb?section=best-rated&kind=tv&genres=Action%2CSci-Fi"
    )
  })
  it("movie single stays movie kind and more pages", () => {
    expect(buildSectionUrl("movie", "movie", genres, "more", 2)).toBe(
      "/api/tmdb?section=more&kind=movie&genres=Action%2CSci-Fi&page=2"
    )
  })
  it("trending omits genres", () => {
    expect(buildSectionUrl("movie", "movie", genres, "trending")).toBe(
      "/api/tmdb?section=trending&kind=movie"
    )
  })
  it("anime passes type and sub", () => {
    expect(buildSectionUrl("anime", "tv", genres, "best-rated")).toBe(
      "/api/anilist?section=best&type=ANIME&sub=tv&genres=Action%2CSci-Fi"
    )
  })
  it("manga passes MANGA type", () => {
    expect(buildSectionUrl("manga", "manhwa", genres, "trending")).toBe(
      "/api/anilist?section=trending&type=MANGA&sub=manhwa&genres=Action%2CSci-Fi"
    )
  })
  it("books use relevance/newest", () => {
    expect(buildSectionUrl("book", "fiction", ["Fantasy"], "in-genres")).toBe(
      "/api/books?section=relevance&sub=fiction&genres=Fantasy"
    )
    expect(buildSectionUrl("book", "nonfiction", ["History"], "new-releases")).toBe(
      "/api/books?section=newest&sub=nonfiction&genres=History"
    )
  })
  it("all titles defined", () => {
    for (const id of ["best-rated", "trending", "in-genres", "new-releases", "more"] as const) {
      expect(SECTION_TITLES[id].length).toBeGreaterThan(0)
    }
  })
})
