"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { ProgressBar } from "@/components/layout/ProgressBar"
import { MediaTypeCard } from "@/components/steps/MediaTypeCard"
import { MEDIA_EMOJI, MEDIA_LABELS, MEDIA_TYPES } from "@/lib/utils/constants"

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="min-h-dvh">
      <Header>
        <ProgressBar currentStep={1} />
      </Header>
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-12 md:px-8">
        <h1 className="mb-2 text-center font-display text-4xl font-bold md:text-5xl">
          What are you in the mood for?
        </h1>
        <p className="mb-10 text-center text-muted-foreground">
          One question at a time. No overwhelm. Just discovery.
        </p>
        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {MEDIA_TYPES.map(type => (
            <MediaTypeCard
              key={type}
              type={type}
              label={MEDIA_LABELS[type]}
              emoji={MEDIA_EMOJI[type]}
              onClick={() => router.push(`/discover?type=${type}`)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
