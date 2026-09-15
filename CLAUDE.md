```md
# CLAUDE.md — Multi-Media Discovery App: Complete Build Plan

## Project Overview

A guided, step-by-step multi-media discovery web application that helps users find
Movies, Anime, Manga, Books, and Animations through a clean, conversational flow.
One question at a time. No overwhelm. Just discovery.

---

## Project Name (Working Title)
**Luminary** — Find Your Next Obsession

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Icons:** Lucide React

### Backend / API Layer
- **API Routes:** Next.js Server Actions & Route Handlers
- **AI:** Google Gemini API
- **Environment:** .env.local for all API keys

### Deployment
- **Platform:** Vercel (free tier)
- **Domain:** Optional custom domain

---

## API Keys Required

### Free APIs (Grab Keys From These)
```
TMDB_API_KEY                → https://www.themoviedb.org/settings/api
OMDB_API_KEY                → https://www.omdbapi.com/apikey.aspx
YOUTUBE_API_KEY             → https://console.cloud.google.com
GOOGLE_BOOKS_API_KEY        → https://console.cloud.google.com
GEMINI_API_KEY              → https://makersuite.google.com/app/apikey
```

### Free APIs (No Key Needed)
```
Jikan API      → https://api.jikan.moe/v4        (MyAnimeList data, no key)
AniList API    → https://graphql.anilist.co       (GraphQL, no key)
MangaDex API   → https://api.mangadex.org         (no key for public endpoints)
Open Library   → https://openlibrary.org/api      (no key)
Kitsu API      → https://kitsu.io/api/edge        (no key)
```

### Environment Variables File Structure
```
# .env.local

# TMDB
TMDB_API_KEY=your_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/w500

# OMDB
OMDB_API_KEY=your_key_here
OMDB_BASE_URL=https://www.omdbapi.com

# YouTube
YOUTUBE_API_KEY=your_key_here
YOUTUBE_BASE_URL=https://www.googleapis.com/youtube/v3

# Google Books
GOOGLE_BOOKS_API_KEY=your_key_here
GOOGLE_BOOKS_BASE_URL=https://www.googleapis.com/books/v1

# Gemini
GEMINI_API_KEY=your_key_here

# No key APIs (just base URLs for reference)
JIKAN_BASE_URL=https://api.jikan.moe/v4
ANILIST_BASE_URL=https://graphql.anilist.co
MANGADEX_BASE_URL=https://api.mangadex.org
OPEN_LIBRARY_BASE_URL=https://openlibrary.org
KITSU_BASE_URL=https://kitsu.io/api/edge
```

---

## Project Folder Structure

```
luminary/
├── app/
│   ├── layout.tsx                    # Root layout, fonts, metadata
│   ├── page.tsx                      # Step 1: Media Type Selection (home)
│   ├── globals.css                   # Global styles, Tailwind imports
│   │
│   ├── discover/
│   │   ├── page.tsx                  # Step 2: Sub-type selection
│   │   ├── genres/
│   │   │   └── page.tsx              # Step 3: Genre multi-select
│   │   └── results/
│   │       └── page.tsx              # Step 4: Results page
│   │
│   └── api/
│       ├── movies/
│       │   ├── trending/route.ts
│       │   ├── top-rated/route.ts
│       │   └── search/route.ts
│       ├── anime/
│       │   ├── trending/route.ts
│       │   ├── top-rated/route.ts
│       │   └── search/route.ts
│       ├── manga/
│       │   ├── trending/route.ts
│       │   ├── top-rated/route.ts
│       │   └── search/route.ts
│       ├── books/
│       │   ├── trending/route.ts
│       │   ├── top-rated/route.ts
│       │   └── search/route.ts
│       └── ai/
│           └── recommend/route.ts    # Gemini recommendations
│
├── components/
│   ├── ui/                           # shadcn/ui base components
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── ProgressBar.tsx           # Step progress indicator
│   │   └── BackButton.tsx
│   │
│   ├── steps/
│   │   ├── MediaTypeCard.tsx         # Step 1 cards
│   │   ├── SubTypeCard.tsx           # Step 2 cards
│   │   ├── GenreChip.tsx             # Step 3 genre pills
│   │   └── GenreGrid.tsx             # Grid of genre chips
│   │
│   ├── results/
│   │   ├── ResultsHeader.tsx         # Summary chips + refine button
│   │   ├── MediaCard.tsx             # Universal media card
│   │   ├── MediaRow.tsx              # Horizontal scroll row
│   │   ├── SectionTitle.tsx          # Section headers (Best Rated etc)
│   │   ├── AIPickCard.tsx            # Gemini recommendation highlight
│   │   └── DetailModal.tsx           # Click card → detail modal
│   │
│   └── shared/
│       ├── LoadingSkeleton.tsx
│       ├── ErrorState.tsx
│       └── EmptyState.tsx
│
├── lib/
│   ├── api/
│   │   ├── tmdb.ts                   # TMDB API functions
│   │   ├── jikan.ts                  # Jikan (anime) API functions
│   │   ├── anilist.ts                # AniList GraphQL queries
│   │   ├── mangadex.ts               # MangaDex API functions
│   │   ├── books.ts                  # Google Books + Open Library
│   │   └── gemini.ts                 # Gemini AI functions
│   │
│   ├── store/
│   │   └── useDiscoveryStore.ts      # Zustand store for flow state
│   │
│   ├── utils/
│   │   ├── genreMapper.ts            # Map genres across APIs
│   │   ├── formatters.ts             # Date, rating, text formatters
│   │   └── constants.ts              # App-wide constants
│   │
│   └── types/
│       ├── media.types.ts            # Shared media interfaces
│       ├── movie.types.ts
│       ├── anime.types.ts
│       ├── manga.types.ts
│       └── book.types.ts
│
├── hooks/
│   ├── useMovies.ts
│   ├── useAnime.ts
│   ├── useManga.ts
│   ├── useBooks.ts
│   └── useGeminiRecommend.ts
│
├── public/
│   ├── icons/
│   └── images/
│
├── .env.local
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## User Flow — Complete Step By Step

### STEP 1 — "What are you in the mood for?" (Home Page `/`)
```
User sees 5 large cards:
- 🎬 Movie
- 📺 Anime
- 📚 Manga
- 📖 Book
- 🎨 Animation

Action: Click card → auto-advance to Step 2
State saved: { mediaType: "movie" | "anime" | "manga" | "book" | "animation" }
Progress: ● ○ ○ ○
```

### STEP 2 — Sub-type Selection (`/discover?type=movie`)
```
IF movie selected:
  Cards: [🎥 Single Movie] [📺 Series / TV Show]
  State saved: { subType: "movie" | "series" }

IF anime selected:
  Cards: [📺 Series] [🎬 Movie] [📦 OVA / Special]
  State saved: { subType: "series" | "movie" | "ova" }

IF manga selected:
  Cards: [📚 Manga] [📓 Manhwa (Korean)] [🀄 Manhua (Chinese)]
  State saved: { subType: "manga" | "manhwa" | "manhua" }

IF book selected:
  Cards: [📖 Fiction] [📰 Non-Fiction]
  State saved: { subType: "fiction" | "nonfiction" }

IF animation selected:
  Cards: [🇺🇸 Western] [🌍 European / World] [🎬 Animated Movie]
  State saved: { subType: "western" | "world" | "movie" }

Action: Click card → auto-advance to Step 3
Progress: ● ● ○ ○
```

### STEP 3 — Genre Multi-Select (`/discover/genres`)
```
IF movie + single:
  Genres: Action, Romance, Horror, Comedy, Thriller, Sci-Fi,
          Fantasy, Mystery, Drama, Crime, Historical, Documentary

IF movie + series:
  Genres: Action, Drama, Comedy, Crime, Sci-Fi, Fantasy,
          Mystery, Thriller, Romance, Horror, Reality, Documentary

IF anime + series:
  Genres: Shonen, Shojo, Seinen, Isekai, Mecha, Slice of Life,
          Horror, Romance, Action, Psychological, Fantasy, Sports, Comedy

IF anime + movie:
  Genres: Action, Fantasy, Romance, Adventure, Sci-Fi,
          Drama, Horror, Comedy, Slice of Life

IF manga:
  Genres: Action, Romance, Fantasy, Horror, Slice of Life,
          Isekai, Psychological, Comedy, Mystery, School Life,
          Martial Arts, Supernatural

IF book + fiction:
  Genres: Fantasy, Sci-Fi, Romance, Mystery, Thriller,
          Horror, Historical, Literary, Young Adult, Classic

IF book + nonfiction:
  Genres: Self-Help, Biography, History, Science,
          Psychology, Philosophy, True Crime, Travel, Business

IF animation:
  Genres: Adventure, Comedy, Fantasy, Musical, Action,
          Family, Sci-Fi, Horror, Drama

Rules:
- Multi-select (can pick many)
- Minimum 1 genre required to proceed
- Pills/chips toggle on and off
- Selected chips visually distinct (filled, glowing)
- "Find It →" button appears after at least 1 selected

Action: Click "Find It →" → navigate to Results
Progress: ● ● ● ○
```

### STEP 4 — Results Page (`/discover/results`)
```
Layout:
┌────────────────────────────────────────────┐
│ You picked: [Movie][Single][Action][Sci-Fi] │
│                              [Refine ✏️]    │
└────────────────────────────────────────────┘

★ BEST RATED
  → Horizontal scroll row of MediaCards
  → Sorted by rating/score descending
  → API: TMDB top_rated filtered by genre

🔥 TRENDING NOW
  → Horizontal scroll row of MediaCards
  → API: TMDB trending/week

🤖 AI PICK — Gemini
  → Special highlighted card
  → Gemini prompt: "Recommend 1 perfect [mediaType]
     for someone who loves [genres]. Give title,
     why they'd love it, and a hype sentence."
  → Shown with distinct AI badge

🎯 MORE IN YOUR GENRES
  → Full grid of results
  → Paginated or infinite scroll
  → Sorted by popularity

Progress: ● ● ● ●
```

---

## Zustand Store Shape

```typescript
interface DiscoveryState {
  // Current selections
  mediaType: "movie" | "anime" | "manga" | "book" | "animation" | null
  subType: string | null
  selectedGenres: string[]
  currentStep: 1 | 2 | 3 | 4

  // Actions
  setMediaType: (type: string) => void
  setSubType: (type: string) => void
  toggleGenre: (genre: string) => void
  setStep: (step: number) => void
  resetFlow: () => void

  // Selected detail item
  selectedItem: MediaItem | null
  setSelectedItem: (item: MediaItem | null) => void
}
```

---

## Genre → API Mapping (genreMapper.ts)

```typescript
// TMDB Genre IDs
const TMDB_GENRE_MAP = {
  "Action": 28,
  "Comedy": 35,
  "Drama": 18,
  "Horror": 27,
  "Romance": 10749,
  "Sci-Fi": 878,
  "Fantasy": 14,
  "Mystery": 9648,
  "Thriller": 53,
  "Crime": 80,
  "Documentary": 99,
  "Historical": 36,
  "Animation": 16,
  "Family": 10751,
}

// Jikan (MAL) Genre IDs for Anime
const JIKAN_GENRE_MAP = {
  "Action": 1,
  "Adventure": 2,
  "Comedy": 4,
  "Drama": 8,
  "Fantasy": 10,
  "Horror": 14,
  "Mystery": 7,
  "Romance": 22,
  "Sci-Fi": 24,
  "Slice of Life": 36,
  "Sports": 30,
  "Supernatural": 37,
  "Psychological": 40,
  "Mecha": 18,
  "Isekai": 62,
  "Shonen": 27,
  "Shojo": 25,
  "Seinen": 42,
}

// MangaDex Genre Tags (UUIDs)
const MANGADEX_GENRE_MAP = {
  "Action": "391b0423-d847-456f-aff0-8b0cfc03066b",
  "Romance": "423e2eae-a7a2-4a8b-ac03-a8351462d71d",
  "Fantasy": "cdc58593-87dd-415e-bbc0-2ec27bf404cc",
  "Horror": "cdad7e68-1419-41d4-b036-b4a688ba5d1b",
  "Comedy": "4d32cc48-9f00-4cca-9b5a-a839f0764984",
  "Mystery": "ee968100-4191-4968-93d3-f82d72be7e46",
  "Psychological": "3b60b75c-a2d7-4860-ab56-05f391bb889c",
  "Slice of Life": "e5301a23-ebd9-49dd-a0cb-2add944c7fe9",
  "Isekai": "ace04997-f6bd-436e-b261-779182193d3d",
}

// Google Books subject queries
const GOOGLE_BOOKS_MAP = {
  "Fantasy": "subject:fantasy",
  "Sci-Fi": "subject:science+fiction",
  "Romance": "subject:romance",
  "Mystery": "subject:mystery",
  "Thriller": "subject:thriller",
  "Horror": "subject:horror",
  "Historical": "subject:historical+fiction",
  "Self-Help": "subject:self-help",
  "Biography": "subject:biography",
  "Psychology": "subject:psychology",
  "Philosophy": "subject:philosophy",
  "True Crime": "subject:true+crime",
  "Science": "subject:science",
  "History": "subject:history",
}
```

---

## API Functions Plan

### TMDB (Movies & Animations)
```typescript
// lib/api/tmdb.ts

getTopRatedMovies(genreIds: number[], type: "movie" | "tv")
getTrendingMovies(type: "movie" | "tv", timeWindow: "day" | "week")
getMoviesByGenre(genreIds: number[], page: number)
getMovieDetails(id: number)
getMovieTrailer(id: number)         // hits /videos endpoint
searchMovies(query: string)
```

### Jikan (Anime)
```typescript
// lib/api/jikan.ts

getTopAnime(type: "tv" | "movie" | "ova", genreIds: number[])
getTrendingAnime()
getAnimeByGenres(genreIds: number[], page: number)
getAnimeDetails(id: number)
searchAnime(query: string)
```

### AniList (Anime + Manga fallback)
```typescript
// lib/api/anilist.ts

getTopRatedAnime(genres: string[])
getTrendingAnime(genres: string[])
getTopRatedManga(genres: string[])
getMediaDetails(id: number, type: "ANIME" | "MANGA")
```

### MangaDex
```typescript
// lib/api/mangadex.ts

getTopManga(tagIds: string[], type: "manga" | "manhwa" | "manhua")
getTrendingManga()
getMangaDetails(id: string)
getMangaCover(mangaId: string, coverId: string)   // separate cover endpoint
searchManga(query: string)
```

### Google Books + Open Library
```typescript
// lib/api/books.ts

getTopRatedBooks(subjects: string[], fiction: boolean)
searchBooks(query: string, subject: string)
getBookDetails(id: string)                        // Google Books
getOpenLibraryBook(olid: string)                  // Open Library fallback
```

### Gemini
```typescript
// lib/api/gemini.ts

getAIRecommendation(mediaType: string, subType: string, genres: string[])
// Returns: { title, reason, hypeText, searchQuery }

getAISimilarTitles(title: string, mediaType: string)
// Returns: string[] of similar title names
```

---

## Gemini Prompt Templates

### Main Recommendation Prompt
```
You are a media recommendation expert.

The user wants: ${mediaType} (${subType})
Their favorite genres: ${genres.join(", ")}

Recommend exactly ONE perfect title for them.
Respond in this exact JSON format:
{
  "title": "Title Name",
  "year": "2019",
  "reason": "One sentence why this matches their taste",
  "hype": "One punchy exciting sentence to make them want it",
  "searchQuery": "title name year"  
}

Only respond with the JSON. No extra text.
```

### Similar Titles Prompt
```
Based on someone who loves "${title}" (${mediaType}),
suggest 3 similar titles they would enjoy.
Respond as a JSON array of strings: ["Title 1", "Title 2", "Title 3"]
Only the array, no other text.
```

---

## Universal MediaItem Type

```typescript
// lib/types/media.types.ts

interface MediaItem {
  id: string | number
  title: string
  description: string
  posterUrl: string
  backdropUrl?: string
  rating: number          // normalized to /10
  year: string
  genres: string[]
  mediaType: "movie" | "anime" | "manga" | "book" | "animation"
  subType?: string
  source: "tmdb" | "jikan" | "anilist" | "mangadex" | "googlebooks" | "openlibrary"
  externalId: string      // original ID from source API
  trailerUrl?: string
  externalUrl?: string    // MAL link, Goodreads, etc.
  status?: string         // ongoing, completed, etc.
  episodeCount?: number   // anime/series
  chapterCount?: number   // manga
  pageCount?: number      // books
  author?: string         // books/manga
  studio?: string         // anime/animation
  isAIPick?: boolean
}
```

---

## Design System

### Colors
```css
/* globals.css */

:root {
  --bg-primary: #0a0a0f;
  --bg-surface: #13131a;
  --bg-card: #1c1c27;
  --bg-card-hover: #22223a;

  --accent-movie: #6366f1;        /* indigo */
  --accent-anime: #f59e0b;        /* amber */
  --accent-manga: #10b981;        /* emerald */
  --accent-book: #8b5cf6;         /* violet */
  --accent-animation: #ec4899;    /* pink */

  --text-primary: #e8e8f0;
  --text-secondary: #9090a8;
  --text-muted: #55556a;

  --border: #2a2a3a;
  --border-glow: rgba(99, 102, 241, 0.3);

  --ai-gradient: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
}
```

### Typography
```
Font Display: "Playfair Display" (headings, big text)
Font Body:    "Inter" (everything else)
Font Mono:    "JetBrains Mono" (ratings, numbers)

Scale:
  xs:   0.75rem
  sm:   0.875rem
  base: 1rem
  lg:   1.125rem
  xl:   1.25rem
  2xl:  1.5rem
  3xl:  1.875rem
  4xl:  2.25rem
  5xl:  3rem
```

### Component Specs

#### MediaTypeCard (Step 1)
```
Size: ~280px × 180px (desktop), full width (mobile)
Hover: scale(1.03), border glow with accent color
Selected: filled background, checkmark icon
Border: 1px solid var(--border), on hover accent color border
```

#### GenreChip (Step 3)
```
Unselected: bg-card, text-secondary, border-border
Selected: bg-accent/20, text-accent, border-accent, subtle glow
Size: px-4 py-2, rounded-full
Font: text-sm font-medium
```

#### MediaCard (Results)
```
Width: 160px (mobile), 200px (desktop)
Aspect: 2:3 (poster ratio)
Hover: scale(1.05), show overlay with description
Rating badge: top-right corner
Genre tags: bottom of card
```

### Spacing System (Tailwind)
```
Page padding:     px-4 (mobile) → px-8 (tablet) → px-16 (desktop)
Section gap:      space-y-12
Card gap:         gap-4 (mobile) → gap-6 (desktop)
Step container:   max-w-4xl mx-auto
Results:          max-w-7xl mx-auto
```

---

## Animation Plan (Framer Motion)

```typescript
// Step transitions — slide
const pageVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -60 }
}
const pageTransition = { type: "spring", stiffness: 300, damping: 30 }

// Card hover
const cardVariants = {
  rest:  { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2 } }
}

// Genre chips — stagger in
const containerVariants = {
  animate: { transition: { staggerChildren: 0.05 } }
}
const chipVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

// Results sections — fade up stagger
const sectionVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}
```

---

## Progress Bar Component

```
Step 1:  ●──○──○──○   "What do you want?"
Step 2:  ●──●──○──○   "How do you want it?"
Step 3:  ●──●──●──○   "Pick your vibe"
Step 4:  ●──●──●──●   "Here's what we found"

- Dots connected by lines
- Completed dots: filled accent color
- Current dot: pulsing ring animation
- Future dots: muted/empty
- Step label shown below progress bar
```

---

## Results Page — Section Details

### Best Rated Section
```
Source by media type:
- Movie:      TMDB /movie/top_rated + genre filter
- Series:     TMDB /tv/top_rated + genre filter
- Anime:      Jikan /top/anime?filter=bypopularity + genre
- Manga:      AniList top manga query + genre
- Book:       Google Books ordered by relevance + subject
- Animation:  TMDB /movie/top_rated + genre 16 (animation)

Display: Horizontal scroll, 10 items, sorted rating desc
```

### Trending Now Section
```
Source by media type:
- Movie/Animation: TMDB /trending/movie/week
- Series:          TMDB /trending/tv/week
- Anime:           Jikan /seasons/now
- Manga:           MangaDex latestUpdatedAt sort
- Book:            Google Books newest + subject

Display: Horizontal scroll, 10 items
```

### AI Pick Section (Gemini)
```
- Single highlighted card, wider than normal
- Gradient border using --ai-gradient
- "✨ AI Pick" badge in top corner
- Shows: title, reason text, hype text
- After Gemini returns title → search TMDB/Jikan/etc for poster
- Loading state: shimmer + "Consulting the AI oracle..."
```

### More In Your Genres Section
```
- Grid layout: 4 cols desktop, 2 cols mobile
- 20 items per page
- Load more button (not infinite scroll — intentional)
- Sorted by: vote_average desc
```

---

## Detail Modal

```
Opens when user clicks any MediaCard
No page navigation — stays on results

Layout:
┌──────────────────────────────────────────┐
│ [X close]                                 │
│                                           │
│ [Backdrop Image Full Width]               │
│                                           │
│ [Poster]  Title                           │
│           ★ 8.4  •  2021  •  Action      │
│           Studio / Author                 │
│                                           │
│ Description text here...                  │
│                                           │
│ [▶ Watch Trailer]  [🔖 Save]             │
│                                           │
│ ── Similar Titles ──                      │
│ [Card] [Card] [Card]                      │
│                                           │
│ 🤖 Why you'd love this (Gemini)          │
│ "One AI-generated sentence..."            │
└──────────────────────────────────────────┘
```

---

## Error Handling Strategy

```typescript
// Every API call wrapped in try/catch
// Fallback chain:

Movie fails     → show empty state with retry
Anime (Jikan)   → fallback to AniList
Manga (Mangadex)→ fallback to AniList manga
Book (Google)   → fallback to Open Library
Gemini fails    → hide AI section silently, no crash
Image fails     → show placeholder gradient card

// Rate limiting aware:
// Jikan: 3 requests/second limit → add 350ms delays
// TMDB: 40 requests/10 seconds → generally fine
// Google Books: 1000/day free → cache aggressively
```

---

## Caching Strategy (TanStack Query)

```typescript
// Cache times
const CACHE_CONFIG = {
  topRated:   1000 * 60 * 60 * 24,    // 24 hours (doesn't change often)
  trending:   1000 * 60 * 60,          // 1 hour
  details:    1000 * 60 * 60 * 12,     // 12 hours
  aiPick:     1000 * 60 * 30,          // 30 minutes
  search:     1000 * 60 * 5,           // 5 minutes
}
```

---

## Mobile Responsiveness Plan

```
Step 1 (Media Type):
  Mobile: 2×3 grid of cards (2 per row)
  Desktop: 3×2 or single row of 5

Step 2 (Sub-type):
  Mobile: stacked full-width cards
  Desktop: side by side cards

Step 3 (Genres):
  Mobile: wrap grid of chips, 3 per row approx
  Desktop: flexible wrap, more per row

Step 4 (Results):
  Mobile: horizontal scroll rows, 2.5 cards visible
  Desktop: horizontal scroll rows, 5 cards visible
  Grid section: 2 cols mobile → 4 cols desktop

MediaCard:
  Mobile: 140px wide
  Desktop: 200px wide

Modal:
  Mobile: bottom sheet style, full screen
  Desktop: centered dialog, max-w-3xl
```

---

## Pages & Routing

```
/                           → Step 1: Media Type
/discover                   → Step 2: Sub-type (query: ?type=movie)
/discover/genres            → Step 3: Genres (query: ?type=movie&sub=single)
/discover/results           → Step 4: Results (query: ?type=movie&sub=single&genres=action,scifi)

URL params carry all state → shareable results links
Zustand store also carries state → for in-session navigation
Back button → browser back works naturally with URL params
```

---

## Build Phases

### Phase 1 — Foundation (Core Flow)
```
[ ] Project setup (Next.js + Tailwind + shadcn)
[ ] Install all dependencies
[ ] Set up .env.local with all API keys
[ ] Build Zustand store
[ ] Build ProgressBar component
[ ] Build Step 1 page (MediaTypeCard)
[ ] Build Step 2 page (SubTypeCard)
[ ] Build Step 3 page (GenreChip, GenreGrid)
[ ] Build URL-based routing between steps
[ ] Build BackButton with proper navigation
```

### Phase 2 — API Integration
```
[ ] Set up TMDB functions (movies, trending, top rated)
[ ] Set up Jikan functions (anime)
[ ] Set up MangaDex functions (manga)
[ ] Set up Google Books + Open Library (books)
[ ] Set up genreMapper utility
[ ] Set up TanStack Query providers and hooks
[ ] Test all API connections individually
```

### Phase 3 — Results Page
```
[ ] Build MediaCard component
[ ] Build MediaRow (horizontal scroll) component
[ ] Build ResultsHeader with summary chips
[ ] Build Best Rated section
[ ] Build Trending section
[ ] Build More In Your Genres grid
[ ] Build LoadingSkeleton states
[ ] Build ErrorState and EmptyState components
```

### Phase 4 — AI Layer
```
[ ] Set up Gemini API route
[ ] Build AI Pick section
[ ] Build AIPickCard component
[ ] Test Gemini prompts and JSON parsing
[ ] Add "Why you'd love this" to Detail Modal
[ ] Handle Gemini failures gracefully
```

### Phase 5 — Detail Modal
```
[ ] Build DetailModal component
[ ] Fetch additional details on open
[ ] Embed YouTube trailer
[ ] Build Similar Titles row inside modal
[ ] Add save to list (localStorage)
[ ] Build My List page (stretch goal)
```

### Phase 6 — Polish
```
[ ] Add Framer Motion to all step transitions
[ ] Add stagger animations to genre chips
[ ] Add card hover animations
[ ] Responsive pass — test all breakpoints
[ ] Loading skeletons for all async content
[ ] Dark mode refinement
[ ] Favicon, metadata, OG tags
[ ] Deploy to Vercel
```

---

## Dependencies List

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "typescript": "5.x",
    "tailwindcss": "3.x",
    "framer-motion": "^11.0.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.0.0",
    "lucide-react": "latest",
    "@google/generative-ai": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "class-variance-authority": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "autoprefixer": "latest",
    "postcss": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest"
  }
}
```

---

## shadcn/ui Components to Install

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add toast
```

---

## Key UX Rules (Do Not Violate)

```
1. ONE decision per screen — never show two questions at once
2. Auto-advance after single-select — no "Next" button for Steps 1 & 2
3. "Find It" button required for Step 3 — because multi-select needs confirmation
4. Always show back button — user can always go back
5. URL must reflect state — results must be shareable
6. AI section never blocks — if Gemini fails, rest of page shows fine
7. Images must have fallbacks — no broken image icons ever
8. Skeleton loaders always — no empty flashes of content
9. Mobile tap targets minimum 44×44px — accessibility
10. Jikan rate limit respected — never hammer the API
```

---

## Future Features (Post-MVP)

```
[ ] "Surprise Me" button on Step 1 — random media type
[ ] User accounts with Supabase — cloud saved lists
[ ] Cross-media lists — mix movie + anime + book in one list
[ ] "Complete the Vibe" — watched X, here's matching Y across media
[ ] Streaming availability — where to watch (JustWatch API)
[ ] Social sharing — share your results page
[ ] PWA support — installable on mobile
[ ] Notifications — new episodes of tracked anime
[ ] Review/rating — user rates what they watched
[ ] "For You" feed — learns from your history
```

---

## Notes & Gotchas

```
TMDB Images:
  Base URL: https://image.tmdb.org/t/p/w500/{poster_path}
  Always check poster_path is not null before rendering

Jikan Rate Limiting:
  Max 3 requests/second, 60/minute
  Add delay between sequential calls
  Use React Query caching to minimize calls

MangaDex Cover Images:
  Cover art is a SEPARATE API call from manga details
  URL: https://uploads.mangadex.org/covers/{mangaId}/{filename}
  Must fetch /cover/{coverId} first to get filename

Gemini Response:
  Always parse as JSON in try/catch
  Model may sometimes add markdown code blocks around JSON
  Strip ```json and ``` if present before parsing

AniList GraphQL:
  POST request to https://graphql.anilist.co
  No API key needed — just send query in body
  Has generous rate limits

Google Books:
  Results quality varies a lot
  orderBy: "relevance" better than "newest" for genre browsing
  Always filter: printType=books to exclude magazines

Open Library:
  Good for classic books
  Cover URL: https://covers.openlibrary.org/b/id/{cover_id}-L.jpg
  Use as fallback when Google Books has no cover
```

---

*Last Updated: Initial Planning Document*
*Status: Ready to Build*
*Codename: Luminary*
```
