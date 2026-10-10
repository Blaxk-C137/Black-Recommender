
"use client"

import { ArrowRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { ProgressBar } from "@/components/layout/ProgressBar"
import { BackButton } from "@/components/layout/BackButton"
import { GenreGrid } from "@/components/steps/GenreGrid"
import { Button } from "@/components/ui/button"
import { ACCENT_SELECTED, ACCENT_TEXT } from "@/lib/utils/accent"
import { GENRE_GROUPS, MEDIA_LABELS, MEDIA_TYPES, SUBTYPES, type MediaType } from "@/lib/utils/constants"

function GenresContent() {
  const router = useRouter()
  const params = useSearchParams()
  const type = params.get("type") as MediaType | null
  const sub = params.get("sub")

  const [selected, setSelected] = useState<string[]>([])

  const validType = !!type && MEDIA_TYPES.includes(type as MediaType)
  const validSub =
    validType && !!sub && SUBTYPES[type as MediaType].some(s => s.value === sub)
  const valid = validType && validSub

  useEffect(() => {
    if (!valid) {
      router.replace(validType ? `/discover?type=${type}` : "/")
    }
  }, [valid, validType, type, router])

  if (!valid) return null

  const mediaType = type as MediaType
  const groups = GENRE_GROUPS[mediaType][sub as string]

  const toggle = (genre: string) =>
    setSelected(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )

  return (
    <main className="min-h-dvh">
      <Header>
        <ProgressBar currentStep={3} />
      </Header>
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-12 md:px-8">
        <BackButton />
        <h1 className="mb-2 text-center font-display text-3xl font-bold md:text-4xl">
          Pick your vibe
        </h1>
        <p className="mb-10 text-center text-muted-foreground">
          For {MEDIA_LABELS[mediaType]} — pick as many as you like.
        </p>
        <GenreGrid
          groups={groups}
          selected={selected}
          accentSelected={ACCENT_SELECTED[mediaType]}
          onToggle={toggle}
        />
        <Button
          size="lg"
          disabled={selected.length === 0}
          onClick={() =>
            router.push(
              `/discover/results?type=${mediaType}&sub=${sub}&genres=${encodeURIComponent(selected.join(","))}`
            )
          }
          className={`mt-10 gap-2 ${selected.length > 0 ? ACCENT_TEXT[mediaType] : ""}`}
        >
          Find It <ArrowRight className="size-4" />
        </Button>
      </div>
    </main>
  )
}

export default function GenresPage() {
  return (
    <Suspense>
      <GenresContent />
    </Suspense>
  )
}
