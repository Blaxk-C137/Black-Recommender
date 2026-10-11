
import { describe, expect, it } from "vitest"
import { filterByMinYear, normalizeRating, parseGenresParam, stripHtml, truncate } from "./formatters"

describe("normalizeRating", () => {
  it("converts a 100-scale score to /10", () => {
    expect(normalizeRating(87, 100)).toBe(8.7)
  })
  it("rounds to one decimal", () => {
    expect(normalizeRating(85, 100)).toBe(8.5)
  })
  it("returns 0 for nullish", () => {
    expect(normalizeRating(null, 10)).toBe(0)
    expect(normalizeRating(undefined, 100)).toBe(0)
  })
})

describe("stripHtml", () => {
  it("removes tags and trims", () => {
    expect(stripHtml("<p>Hello <b>world</b></p>")).toBe("Hello world")
  })
  it("returns empty string for nullish", () => {
    expect(stripHtml(null)).toBe("")
  })
})

describe("truncate", () => {
  it("keeps short text as-is", () => {
    expect(truncate("short", 10)).toBe("short")
  })
  it("truncates on a word boundary with ellipsis", () => {
    expect(truncate("one two three four", 8)).toBe("one two…")
  })
})

describe("parseGenresParam", () => {
  it("splits and trims comma list", () => {
    expect(parseGenresParam("Action, Sci-Fi,Slice of Life")).toEqual([
      "Action",
      "Sci-Fi",
      "Slice of Life",
    ])
  })
  it("returns empty array for null/empty", () => {
    expect(parseGenresParam(null)).toEqual([])
    expect(parseGenresParam("")).toEqual([])
  })
})

describe("filterByMinYear", () => {
  const items = [
    { year: "1999", title: "old" },
    { year: "2008", title: "boundary" },
    { year: "2024", title: "new" },
    { year: "", title: "unknown" },
  ]
  it("drops items older than the floor, keeps the boundary year", () => {
    expect(filterByMinYear(items, 2008).map(i => i.title)).toEqual([
      "boundary",
      "new",
      "unknown",
    ])
  })
})
