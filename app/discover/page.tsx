"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { ProgressBar } from "@/components/layout/ProgressBar"
import { BackButton } from "@/components/layout/BackButton"
import { SubTypeCard } from "@/components/steps/SubTypeCard"
import { AuroraText } from "@/components/magicui/aurora-text"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Particles } from "@/components/magicui/particles"
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

  const mediaType = type as MediaType

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <Particles className="absolute inset-0" quantity={40} staticity={80} color="#a78bfa" />
      <div className="relative">
        <Header>
          <ProgressBar currentStep={2} />
        </Header>
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-12 md:px-8">
          <BlurFade delay={0.05} className="w-full">
            <BackButton />
          </BlurFade>
          <BlurFade delay={0.12} yOffset={20}>
            <h1 className="mb-2 mt-4 text-center font-display text-3xl font-bold md:text-5xl">
              How do you want your{" "}
              <AuroraText>{MEDIA_LABELS[mediaType].toLowerCase()}</AuroraText>?
            </h1>
          </BlurFade>
          <BlurFade delay={0.22}>
            <p className="mb-10 text-center text-muted-foreground">Pick one to continue.</p>
          </BlurFade>
          <div className="flex w-full flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center">
            {SUBTYPES[mediaType].map((sub, i) => (
              <BlurFade
                key={sub.value}
                delay={0.3 + i * 0.12}
                yOffset={24}
                className="w-full md:w-auto"
              >
                <SubTypeCard
                  label={sub.label}
                  emoji={sub.emoji}
                  onClick={() =>
                    router.push(`/discover/genres?type=${mediaType}&sub=${sub.value}`)
                  }
                />
              </BlurFade>
            ))}
          </div>
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
