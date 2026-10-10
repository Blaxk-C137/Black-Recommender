"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MEDIA_LABELS, SUBTYPES, type MediaType } from "@/lib/utils/constants"

export function ResultsHeader({
  type,
  sub,
  genres,
}: {
  type: MediaType
  sub: string
  genres: string[]
}) {
  const subLabel = SUBTYPES[type].find(s => s.value === sub)?.label ?? sub

  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted-foreground">You picked:</span>
        <Badge variant="secondary" className="h-7 px-3 text-sm">
          {MEDIA_LABELS[type]}
        </Badge>
        <Badge variant="secondary" className="h-7 px-3 text-sm">
          {subLabel}
        </Badge>
        {genres.map(g => (
          <Badge key={g} variant="outline" className="h-7 px-3 text-sm">
            {g}
          </Badge>
        ))}
      </div>
      <Link
        href={`/discover/genres?type=${type}&sub=${sub}`}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit gap-2")}
      >
        <Pencil className="size-3.5" /> Refine
      </Link>
    </div>
  )
}
