"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Sparkle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { ProgressBar } from "@/components/layout/ProgressBar"
import { BackButton } from "@/components/layout/BackButton"
import { GenreGrid } from "@/components/steps/GenreGrid"
import { AuroraText } from "@/components/magicui/aurora-text"
import { BlurFade } from "@/components/magicui/blur-fade"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
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

  const go = () =>
    router.push(
      `/discover/results?type=${mediaType}&sub=${sub}&genres=${encodeURIComponent(selected.join(","))}`
    )

  return (
    <main className="relative min-h-dvh">
      <Header>
        <ProgressBar currentStep={3} />
      </Header>
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-32 pt-12 md:px-8">
        <BlurFade delay={0.05} className="w-full">
          <BackButton />
        </BlurFade>
        <BlurFade delay={0.12} yOffset={20}>
          <h1 className="mb-2 mt-4 text-center font-display text-3xl font-bold md:text-5xl">
            Pick your <AuroraText>vibe</AuroraText>
          </h1>
        </BlurFade>
        <BlurFade delay={0.22}>
          <p className="mb-10 text-center text-muted-foreground">
            For {MEDIA_LABELS[mediaType]} — pick as many as you like.
          </p>
        </BlurFade>
        <GenreGrid
          groups={groups}
          selected={selected}
          accentSelected={ACCENT_SELECTED[mediaType]}
          onToggle={toggle}
        />
        <BlurFade delay={0.3}>
          <div className="mt-12 flex flex-col items-center gap-2">
            <ShimmerButton
              onClick={go}
              disabled={selected.length === 0}
              className={`gap-2 text-base font-semibold ${selected.length > 0 ? ACCENT_TEXT[mediaType] : ""}`}
            >
              {selected.length > 0 ? (
                <>
                  Find It <ArrowRight className="size-4" />
                </>
              ) : (
                "Pick at least one vibe"
              )}
            </ShimmerButton>
          </div>
        </BlurFade>
      </div>

      {/* Floating selection dock */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
          >
            <div className="flex items-center gap-4 rounded-full border border-border bg-background/80 py-2 pl-5 pr-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Sparkle className="size-4 text-accent-book" />
                <motion.span
                  key={selected.length}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="inline-block font-mono font-semibold text-foreground"
                >
                  {selected.length}
                </motion.span>
                {selected.length === 1 ? "vibe" : "vibes"} picked
              </span>
              <ShimmerButton
                onClick={go}
                borderRadius="999px"
                shimmerColor="#a78bfa"
                className="px-5 py-2 text-sm font-semibold"
              >
                Find It <ArrowRight className="ml-1.5 size-4" />
              </ShimmerButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
