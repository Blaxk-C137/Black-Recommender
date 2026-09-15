export function normalizeRating(score: number | null | undefined, scale: 10 | 100 = 10): number {
  if (score == null) return 0
  const value = scale === 100 ? score / 10 : score
  return Math.round(value * 10) / 10
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").trim()
}

export function truncate(text: string, max = 200): string {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…"
}

export function parseGenresParam(param: string | null | undefined): string[] {
  if (!param) return []
  return param
    .split(",")
    .map(g => g.trim())
    .filter(Boolean)
}
