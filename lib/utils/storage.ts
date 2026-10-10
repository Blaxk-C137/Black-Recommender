import type { MediaItem } from "@/lib/types/media.types"

const KEY = "luminary:list"

export function getList(): MediaItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as MediaItem[]) : []
  } catch {
    return []
  }
}

export function isSaved(id: string | number): boolean {
  return getList().some(item => String(item.id) === String(id))
}

/** Toggles the item in the saved list. Returns the new saved state. */
export function toggleSaved(item: MediaItem): boolean {
  const list = getList()
  const exists = list.some(i => String(i.id) === String(item.id))
  const next = exists ? list.filter(i => String(i.id) !== String(item.id)) : [...list, item]
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // private mode / quota — treat as no-op
  }
  return !exists
}
