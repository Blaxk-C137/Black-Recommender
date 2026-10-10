import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { getList, isSaved, toggleSaved } from "./storage"
import type { MediaItem } from "@/lib/types/media.types"

const item: MediaItem = {
  id: 1,
  title: "Test",
  description: "",
  posterUrl: "",
  rating: 8,
  year: "2020",
  genres: ["Action"],
  mediaType: "movie",
  source: "tmdb",
  externalId: "1",
}

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe("storage", () => {
  it("toggles an item on and off", () => {
    expect(toggleSaved(item)).toBe(true)
    expect(isSaved(1)).toBe(true)
    expect(getList()).toHaveLength(1)
    expect(toggleSaved(item)).toBe(false)
    expect(getList()).toHaveLength(0)
  })
  it("survives unparseable storage content", () => {
    localStorage.setItem("luminary:list", "not json")
    expect(getList()).toEqual([])
    expect(isSaved(1)).toBe(false)
  })
  it("matches string ids against numeric ids", () => {
    toggleSaved({ ...item, id: "abc" })
    expect(isSaved("abc")).toBe(true)
  })
})
