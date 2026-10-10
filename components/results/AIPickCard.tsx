"use client"

import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAIPick } from "@/hooks/useAIPick"

export function AIPickCard() {
  const { data, isLoading, isError } = useAIPick()

  if (isError) return null // AI section never blocks — spec rule

  if (isLoading) {
    return (
      <div className="rounded-xl bg-gradient-to-br from-accent-movie via-accent-book to-accent-anime p-[1px]">
        <div className="flex items-center gap-4 rounded-xl bg-card p-6">
          <Skeleton className="size-16 shrink-0 rounded-lg" />
          <div className="w-full space-y-2">
            <p className="text-sm italic text-muted-foreground">
              ✨ Consulting the AI oracle…
            </p>
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null
  const { recommendation, item } = data

  return (
    <div className="rounded-xl bg-gradient-to-br from-accent-movie via-accent-book to-accent-anime p-[1px]">
      <div className="relative flex flex-col gap-4 rounded-xl bg-card p-6 md:flex-row md:items-center">
        <Badge className="absolute -top-3 left-4 gap-1 bg-primary text-primary-foreground">
          <Sparkles className="size-3" /> AI Pick
        </Badge>
        {item?.posterUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- AI pick poster can come from any source CDN
          <img
            src={item.posterUrl}
            alt={recommendation.title}
            className="h-32 w-22 shrink-0 rounded-lg border border-border object-cover"
          />
        )}
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-semibold">
            {recommendation.title}{" "}
            {recommendation.year && (
              <span className="text-base font-normal text-muted-foreground">
                ({recommendation.year})
              </span>
            )}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{recommendation.reason}</p>
          <p className="mt-1 text-sm italic">{recommendation.hype}</p>
        </div>
      </div>
    </div>
  )
}
