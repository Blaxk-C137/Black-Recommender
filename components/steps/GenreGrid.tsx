"use client"

import { GenreChip } from "./GenreChip"
import type { GenreGroup } from "@/lib/utils/constants"

export function GenreGrid({
  groups,
  selected,
  accentSelected,
  onToggle,
}: {
  groups: GenreGroup[]
  selected: string[]
  accentSelected: string
  onToggle: (genre: string) => void
}) {
  return (
    <div className="w-full space-y-8">
      {groups.map((group, i) => (
        <section key={group.label ?? i}>
          {group.label && (
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {group.label}
            </h2>
          )}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {group.genres.map(genre => (
              <GenreChip
                key={genre}
                label={genre}
                selected={selected.includes(genre)}
                accentSelected={accentSelected}
                onToggle={() => onToggle(genre)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
