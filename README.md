# 🎬 Luminary — Find Your Next Obsession

A guided, step-by-step multi-media discovery web app. One question per screen —
pick a media type → a sub-type → your genres — and land on a shareable results
page with **Best Rated**, **Trending**, an **AI Pick** (Google Gemini), and a
browse grid across **Movies, TV, Anime, Manga, and Books**.

Built with **Next.js 15 (App Router) + React 19 + TypeScript**, styled with
**Tailwind CSS v4 + shadcn/ui** (Base UI primitives), animated with
**Framer Motion**, and data-fetched with **TanStack Query**. State lives in the
URL, so every results page is shareable.

---

## ✨ Features

- **4-step guided flow** — one decision per screen, auto-advance on select
- **4 media types** — 🎬 Movies/Series (TMDB), 📺 Anime (AniList), 📚 Manga/Manhwa/Manhua (AniList), 📖 Books (Google Books)
- **Results sections** — Best Rated, Trending Now, 🤖 Gemini AI Pick, More-in-Your-Genres grid with Load More
- **Detail modal** — backdrop, trailer (TMDB), similar titles, save-to-list (localStorage)
- **Resilient by design** — AI failure hides its section silently, image fallbacks everywhere, skeleton loaders, per-section retry
- **Fully responsive** — 44px tap targets, mobile-first horizontal snap rows
- **URL-driven state** — results links are shareable; back button always works

## 🧱 Tech Stack

| Layer      | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| Framework  | Next.js 15 (App Router, Turbopack) + React 19                 |
| Language   | TypeScript (strict)                                           |
| Styling    | Tailwind CSS v4, shadcn/ui components (Base UI), tw-animate   |
| Animation  | Framer Motion                                                  |
| Data       | TanStack Query v5, Zustand (ephemeral UI state only)          |
| APIs       | TMDB · AniList GraphQL (no key) · Google Books · Google Gemini |
| Testing    | Vitest (jsdom)                                                |

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 20+

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in the keys (all free tiers):

| Variable                | Where                                                  | Required                 |
| ----------------------- | ------------------------------------------------------ | ------------------------ |
| `TMDB_API_KEY`          | https://www.themoviedb.org/settings/api                | for movies/series        |
| `GOOGLE_BOOKS_API_KEY`  | https://console.cloud.google.com (Books API)           | for books                |
| `GEMINI_API_KEY`        | https://aistudio.google.com/app/apikey                 | for the AI Pick section  |
| `GEMINI_MODEL`          | defaults to `gemini-2.5-flash`                          | optional                 |
| `ANILIST_BASE_URL`      | defaults to `https://graphql.anilist.co` (no key)      | optional                 |

> The app degrades gracefully: missing TMDB/Books keys show a retry tile in the
> affected section; a missing Gemini key simply hides the AI Pick section.

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000 — pick a vibe.

## 🧪 Scripts

```bash
npm run dev    # dev server (Turbopack)
npm test       # Vitest suite
npm run lint   # ESLint (next/core-web-vitals + typescript)
npm run build  # production build
npm start      # serve production build
```

## ☁️ Deployment (Vercel)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import into Vercel — framework preset **Next.js** is auto-detected.
3. Add the environment variables from `.env.example` in **Project → Settings → Environment Variables**.
4. Deploy. No build settings needed (`npm run build` / default output).

Any Node host works too: `npm run build && npm start`.

## 🗺️ Routes

| Path                                        | Purpose                        |
| ------------------------------------------- | ------------------------------ |
| `/`                                         | Step 1 — media type            |
| `/discover?type=`                           | Step 2 — sub-type              |
| `/discover/genres?type=&sub=`               | Step 3 — genre multi-select    |
| `/discover/results?type=&sub=&genres=`      | Step 4 — results (shareable)   |
| `/api/tmdb` `/api/anilist` `/api/books`     | Param-based data routes        |
| `/api/ai/recommend`                         | Gemini recommendation + poster |

## 📁 Project Structure

```
app/                  # routes (steps 1–4) + api routes + template (page transitions)
components/
  ui/                 # shadcn/ui primitives (button, card, badge, dialog, skeleton…)
  layout/             # Header, ProgressBar, BackButton
  steps/              # MediaTypeCard, SubTypeCard, GenreChip, GenreGrid
  results/            # ResultsHeader, MediaCard, MediaRow, SectionTitle, AIPickCard, DetailModal
  shared/             # LoadingSkeleton, ErrorState, EmptyState
hooks/                # useSection, useAIPick (TanStack Query)
lib/
  api/                # tmdb, anilist, books, gemini
  store/              # useUIStore (selected item only — state lives in the URL)
  utils/              # constants, sections, accent, formatters, storage
  types/              # universal MediaItem
```

## 📜 License

MIT — build something people love.
