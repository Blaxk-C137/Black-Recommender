
import { afterEach, describe, expect, it, vi } from "vitest"
import { buildBooksQuery, getBooks, mapBookItem, type GoogleVolume } from "./books"

// Note: vi.stubGlobal() returns the vi utils object (not the mock), so we
// create the mock first and return it for call inspection.
const mockFetch = (body: unknown) => {
  const fn = vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }))
  vi.stubGlobal("fetch", fn)
  return fn
}

afterEach(() => vi.unstubAllGlobals())

describe("buildBooksQuery", () => {
  it("maps genre names to subject phrases", () => {
    expect(buildBooksQuery(["Sci-Fi", "Romance"])).toBe(
      "subject:science fiction subject:romance"
    )
  })
  it("passes unknown genres through as subjects", () => {
    expect(buildBooksQuery(["History"])).toBe("subject:history")
  })
})

describe("mapBookItem", () => {
  const base: GoogleVolume = {
    id: "abc",
    volumeInfo: {
      title: "Test Book",
      authors: ["Author Name"],
      description: "A book about things",
      averageRating: 4.2,
      imageLinks: { thumbnail: "http://books.google.com/cover?id=1&zoom=1" },
      publishedDate: "2019-03-01",
      categories: ["Fiction"],
    },
  }

  it("maps fields and https-fixes the cover", () => {
    const item = mapBookItem(base)
    expect(item.title).toBe("Test Book")
    expect(item.author).toBe("Author Name")
    expect(item.rating).toBe(8.4)
    expect(item.year).toBe("2019")
    expect(item.mediaType).toBe("book")
    expect(item.source).toBe("googlebooks")
    expect(item.posterUrl.startsWith("https://")).toBe(true)
  })

  it("falls back to Open Library cover by ISBN_13", () => {
    const item = mapBookItem({
      ...base,
      volumeInfo: {
        ...base.volumeInfo,
        imageLinks: undefined,
        industryIdentifiers: [{ type: "ISBN_13", identifier: "9780123456789" }],
      },
    })
    expect(item.posterUrl).toBe(
      "https://covers.openlibrary.org/b/isbn/9780123456789-L.jpg"
    )
  })
})

describe("getBooks", () => {
  it("calls Google Books with relevance, printType, and key", async () => {
    process.env.GOOGLE_BOOKS_API_KEY = "test-key"
    const fetchMock = mockFetch({ items: [] })
    await getBooks(["Fantasy"], "relevance", 1)
    const url = (fetchMock as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(url).toContain("https://www.googleapis.com/books/v1/volumes?")
    expect(url).toContain("q=subject%3Afantasy")
    expect(url).toContain("orderBy=relevance")
    expect(url).toContain("printType=books")
    expect(url).toContain("startIndex=20")
  })
})
