"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { ProgressBar } from "@/components/layout/ProgressBar"
import { MediaTypeCard } from "@/components/steps/MediaTypeCard"
import { AuroraText } from "@/components/magicui/aurora-text"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Particles } from "@/components/magicui/particles"
import { WordRotate } from "@/components/magicui/word-rotate"
import { MEDIA_EMOJI, MEDIA_LABELS, MEDIA_TYPES } from "@/lib/utils/constants"

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Ambient starfield */}
      <Particles
        className="absolute inset-0"
        quantity={70}
        staticity={60}
        color="#a78bfa"
      />
      {/* Radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg-primary)_90%)]"
      />

      <div className="relative">
        <Header>
          <ProgressBar currentStep={1} />
        </Header>

        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-14 md:px-8 md:py-20">
          <BlurFade delay={0.05} yOffset={20}>
            <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              ✦ guided discovery ✦
            </p>
          </BlurFade>

          <BlurFade delay={0.15} yOffset={24} duration={0.6}>
            <h1 className="mb-3 text-center font-display text-4xl font-bold leading-tight md:text-6xl">
              What are you in
              <br />
              the <AuroraText>mood</AuroraText> for?
            </h1>
          </BlurFade>

          <BlurFade delay={0.3} yOffset={20}>
            <p className="mb-12 text-center text-muted-foreground md:text-lg">
              Tonight&apos;s agenda: a great{" "}
              <WordRotate
                words={["movie", "anime", "manga", "book"]}
                className="font-semibold text-accent-movie"
              />
              <br className="hidden md:block" />
              <span className="text-sm md:text-base">
                One question at a time. No overwhelm. Just discovery.
              </span>
            </p>
          </BlurFade>

          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {MEDIA_TYPES.map((type, i) => (
              <BlurFade key={type} delay={0.4 + i * 0.12} yOffset={28}>
                <MediaTypeCard
                  type={type}
                  label={MEDIA_LABELS[type]}
                  emoji={MEDIA_EMOJI[type]}
                  onClick={() => router.push(`/discover?type=${type}`)}
                />
              </BlurFade>
            ))}
          </div>

          <BlurFade delay={0.95} yOffset={12}>
            <p className="mt-12 text-center text-xs text-muted-foreground/70">
              🍿 curated by TMDB · AniList · Google Books · Gemini AI
            </p>
          </BlurFade>
        </div>
      </div>
    </main>
  )
}
