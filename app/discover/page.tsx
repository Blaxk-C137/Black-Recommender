"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { ProgressBar } from "@/components/layout/ProgressBar"
import { BackButton } from "@/components/layout/BackButton"
import { SubTypeCard } from "@/components/steps/SubTypeCard"
import { MEDIA_LABELS, MEDIA_TYPES, SUBTYPES, type MediaType } from "@/lib/utils/constants"

function DiscoverContent() {
  const router = useRouter()
  const params = useSearchParams()
  const type = params.get("type") as MediaType | null
  const valid = !!type && MEDIA_TYPES.includes(type as MediaType)

  useEffect(() => {
    if (!valid) router.replace("/")
  }, [valid, router])

  if (!valid) {
    return null
  }

  return (
    <main className="min-h-dvh">
      <Header>
        <ProgressBar currentStep={2} />
      </Header>
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-12 md:px-8">
        <BackButton />
        <h1 className="mb-2 text-center font-display text-3xl font-bold md:text-4xl">
          How do you want your {MEDIA_LABELS[type]}?
        </h1>
        <p className="mb-10 text-center text-muted-foreground">Pick one to continue.</p>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center">
          {SUBTYPES[type].map(sub => (
            <SubTypeCard
              key={sub.value}
              label={sub.label}
              emoji={sub.emoji}
              onClick={() =>
                router.push(`/discover/genres?type=${type}&sub=${sub.value}`)
              }
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default function DiscoverPage() {
  return (
    <Suspense>
      <DiscoverContent />
    </Suspense>
  )
}
