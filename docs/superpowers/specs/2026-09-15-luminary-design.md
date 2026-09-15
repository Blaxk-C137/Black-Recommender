# Luminary — Corrected Design Spec

Date: 2026-09-15
Status: Approved (supersedes conflicting details in CLAUDE.md)

A guided multi-media discovery web app. One question per screen. User picks a
media type → sub-type → genres, then lands on a results page with Best Rated,
Trending, an AI pick, and a browse grid. State lives in the URL so results are
shareable.

## Decisions locked in (from brainstorm review)

1. **Media types: 4, not 5.** Movie, Anime, Manga, Book. "Animation" is folded
   into Movie/Series as a genre chip (TMDB genre 16). The Western/European/World
   sub-types were unfilterable with TMDB and are dropped.
2. **Anime + Manga data: AniList only** (GraphQL, no key). Covers Jikan's and
   MangaDex's roles. Manhwa/manhua via `countryOfOrigin: KR/CN`. Genres passed
   as plain strings — no ID mapping tables. No Jikan rate-limit code.
3. **Movies/Series: TMDB.** Genre-filtered queries use `/discover/movie` (or
   `/discover/tv`) with `with_genres` + `sort_by=vote_average.desc` +
   `vote_count.gte=300` (avoids one-vote 10/10 noise). `/movie/top_rated` and
   `/tv/top_rated` take no genre param — never used for genre sections.
   Trending: `/trending/{movie|tv}/week`.
4. **Books: Google Books only** (Open Library as cover fallback). No
   "Best Rated"/"Trending" sections — the API doesn't support either honestly.
   Book results sections are:
   - "In Your Genres" — subject query, `orderBy=relevance`, `printType=books`
   - "New Releases" — same query, `orderBy=newest`
5. **API keys: 3.** TMDB, GOOGLE_BOOKS, GEMINI. OMDB (redundant with TMDB) and
   YouTube (trailers come from TMDB `/videos`; embedding needs no key) are
   dropped.
6. **State: URL params are the single source of truth.** Zustand shrinks to
   ephemeral UI state only (open modal, selected item). No flow state in the
   store — the store as originally specced is deleted.
7. **Demographics (Shonen/Shojo/Seinen): kept**, grouped at the top of the
   anime genre grid under a "Vibe" label. AniList supports them natively.
8. **Stack versions:** Next.js 15 (App Router) + React 19, `npx shadcn@latest`
   (not shadcn-ui), `@google/genai` (not @google/generative-ai).
9. **API routes: 4.** One param-based route per source — `/api/tmdb`,
   `/api/anilist`, `/api/books` — plus `/api/ai/recommend`. No per-section
   route trees.
10. **subType vocabulary:** fixed to `movie`|`series` (movies), `tv`|`movie`|`ova`
    (anime), `manga`|`manhwa`|`manhua` (manga), `fiction`|`nonfiction` (books).
    URL param `sub` always matches these strings.

## Result sections by media type

| Media type | Best Rated | Trending |
|---|---|---|
| Movie (single) | TMDB discover + genres + vote_count floor | TMDB trending/movie/week |
| Series | TMDB discover (tv) + genres + vote_count floor | TMDB trending/tv/week |
| Anime | AniList top by score + genres | AniList trending |
| Manga/Manhwa/Manhua | AniList top manga by score + genres + country | AniList trending manga |
| Book | "In Your Genres" (relevance) + "New Releases" (newest) | — |

AI Pick (Gemini) and "More in your genres" grid appear for all types. Gemini
failure hides the AI section silently.

## Architecture

```
app/                    Next.js 15 App Router
  page.tsx              Step 1 — media type (4 cards)
  discover/page.tsx     Step 2 — sub-type (?type=)
  discover/genres/      Step 3 — genre multi-select (?type=&sub=)
  discover/results/     Step 4 — results (?type=&sub=&genres=)
  api/tmdb/route.ts     param-based: section=top-rated|trending|discover
  api/anilist/route.ts  param-based
  api/books/route.ts    param-based
  api/ai/recommend/     Gemini
components/
  layout/               Header, ProgressBar, BackButton
  steps/                MediaTypeCard, SubTypeCard, GenreChip, GenreGrid
  results/              ResultsHeader, MediaCard, MediaRow, SectionTitle,
                        AIPickCard, DetailModal
  shared/               LoadingSkeleton, ErrorState, EmptyState
lib/
  api/                  tmdb.ts, anilist.ts, books.ts, gemini.ts
  types/                media.types.ts (universal MediaItem)
  utils/                formatters.ts, constants.ts
hooks/                  useResults per source (TanStack Query)
```

- Universal `MediaItem` type as specced in CLAUDE.md (unchanged).
- Fallback chain: Anime/Manga → none needed (single source). Books → Open
  Library covers only. Gemini failure → hide section. Image failure → gradient
  placeholder.
- Cache: top-rated 24h, trending 1h, details 12h, AI pick 30m.
- Dark theme per CLAUDE.md design system; accent colors per media type
  (4 colors now).

## UX rules (unchanged from CLAUDE.md)

One decision per screen; auto-advance on single-select; "Find It" button only
on step 3; always-visible back button; URL reflects state; AI section never
blocks; image fallbacks; skeletons; 44px tap targets.

## Build order

1. Scaffold Next.js 15 + Tailwind + shadcn + Zustand + TanStack Query, env setup
2. Universal types + formatters + ProgressBar + Step 1–3 flow with URL state
3. TMDB + AniList + Books lib functions and param-based routes
4. Results page: sections, MediaCard/MediaRow, skeletons/error/empty states
5. Gemini AI pick + AIPickCard
6. DetailModal (trailer via TMDB /videos, save-to-list in localStorage)
7. Polish: Framer Motion, responsive pass, metadata, deploy prep
