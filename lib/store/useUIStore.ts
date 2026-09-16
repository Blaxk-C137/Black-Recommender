import { create } from "zustand"
import type { MediaItem } from "@/lib/types/media.types"

interface UIState {
  selectedItem: MediaItem | null
  setSelectedItem: (item: MediaItem | null) => void
}

export const useUIStore = create<UIState>(set => ({
  selectedItem: null,
  setSelectedItem: item => set({ selectedItem: item }),
}))
