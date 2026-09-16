import { afterEach, describe, expect, it, vi } from "vitest"
import { GET as tmdbGET } from "./tmdb/route"

afterEach(() => vi.unstubAllGlobals())

function makeRequest(url: string) {
  return new Request(`http://localhost${url}`)
}

describe("GET /api/tmdb", () => {
  it("returns 400 for unknown section", async () => {
    const res = await tmdbGET(makeRequest("/api/tmdb?section=bogus"))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: "Unknown section: bogus" })
  })

  it("maps genre names to ids and returns items", async () => {
    process.env.TMDB_API_KEY = "test-key"
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ results: [{ id: 9, title: "Hit", poster_path: "/x.jpg", overview: "o", vote_average: 7.5, genre_ids: [] }] }), { status: 200 })
      )
    )
    const res = await tmdbGET(makeRequest("/api/tmdb?section=best-rated&kind=movie&genres=Action"))
    expect(res.status).toBe(200)
    const items = await res.json()
    expect(items[0].title).toBe("Hit")
    const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(calledUrl).toContain("with_genres=28")
  })

  it("returns 400 for details without an id", async () => {
    const res = await tmdbGET(makeRequest("/api/tmdb?section=details"))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: "Missing or invalid id" })
  })

  it("returns 502 when the upstream lib throws", async () => {
    process.env.TMDB_API_KEY = "test-key"
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })))
    const res = await tmdbGET(makeRequest("/api/tmdb?section=best-rated&kind=movie"))
    expect(res.status).toBe(502)
  })
})
