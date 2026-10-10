
import type { MediaType } from "./constants"

export const ACCENT_TEXT: Record<MediaType, string> = {
  movie: "text-accent-movie",
  anime: "text-accent-anime",
  manga: "text-accent-manga",
  book: "text-accent-book",
}

export const ACCENT_BORDER: Record<MediaType, string> = {
  movie: "border-accent-movie",
  anime: "border-accent-anime",
  manga: "border-accent-manga",
  book: "border-accent-book",
}

/** Selected chip style: tinted bg + accent border */
export const ACCENT_SELECTED: Record<MediaType, string> = {
  movie: "bg-accent-movie/20 border-accent-movie text-accent-movie",
  anime: "bg-accent-anime/20 border-accent-anime text-accent-anime",
  manga: "bg-accent-manga/20 border-accent-manga text-accent-manga",
  book: "bg-accent-book/20 border-accent-book text-accent-book",
}

export const ACCENT_DOT: Record<MediaType, string> = {
  movie: "bg-accent-movie",
  anime: "bg-accent-anime",
  manga: "bg-accent-manga",
  book: "bg-accent-book",
}

export const ACCENT_GLOW: Record<MediaType, string> = {
  movie: "shadow-[0_0_24px_rgba(99,102,241,0.25)]",
  anime: "shadow-[0_0_24px_rgba(245,158,11,0.25)]",
  manga: "shadow-[0_0_24px_rgba(16,185,129,0.25)]",
  book: "shadow-[0_0_24px_rgba(139,92,246,0.25)]",
}

/** Mouse spotlight tint per media type (rgba, translucent). */
export const ACCENT_SPOTLIGHT: Record<MediaType, string> = {
  movie: "rgba(99,102,241,0.22)",
  anime: "rgba(245,158,11,0.20)",
  manga: "rgba(16,185,129,0.20)",
  book: "rgba(139,92,246,0.22)",
}

/** Hover style: accent border + accent glow. Literal strings so Tailwind's scanner sees them. */
export const ACCENT_HOVER: Record<MediaType, string> = {
  movie: "hover:border-accent-movie hover:shadow-[0_0_24px_rgba(99,102,241,0.25)]",
  anime: "hover:border-accent-anime hover:shadow-[0_0_24px_rgba(245,158,11,0.25)]",
  manga: "hover:border-accent-manga hover:shadow-[0_0_24px_rgba(16,185,129,0.25)]",
  book: "hover:border-accent-book hover:shadow-[0_0_24px_rgba(139,92,246,0.25)]",
}
