"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { ProgressBar } from "@/components/layout/ProgressBar"
import { BackButton } from "@/components/layout/BackButton"
import { AIPickCard } from "@/components/results/AIPickCard"
import { DetailModal } from "@/components/results/DetailModal"
import { MediaCard } from "@/components/results/MediaCard"
import { MediaRow } from "@/components/results/MediaRow"
import { ResultsHeader } from "@/components/results/ResultsHeader"
import { SectionTitle } from "@/components/results/SectionTitle"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { ErrorState } from "@/components/shared/ErrorState"
import { GridSkeleton, MediaRowSkeleton } from "@/components/shared/LoadingSkeleton"
import { BlurFade } from "@/components/magicui/blur-fade"
import { useSection } from "@/hooks/useSection"
import { useUIStore } from "@/lib/store/useUIStore"
import type { MediaItem } from "@/lib/types/media.types"
import { MEDIA_TYPES, SUBTYPES, type MediaType } from "@/lib/utils/constants"
import { parseGenresParam } from "@/lib/utils/formatters"
import { SECTION_TITLES, sectionsFor, type SectionId } from "@/lib/utils/sections"

function SectionRow({ section }: { section: Exclude<SectionId, "more"> }) {
  const setSelected = useUIStore(s => s.setSelectedItem)
  const { data, isLoading, isError, refetch } = useSection(section)

  if (isError)
    return <ErrorState message="Couldn't load this section." onRetry={() => refetch()} />
  if (isLoading) return <MediaRowSkeleton />
  if (!data?.length) return <EmptyState message="Nothing here — try different genres." />
  return <MediaRow items={data.slice(0, 10)} onItemClick={setSelected} />
}

function MoreGrid() {
  const [pages, setPages] = useState([1])
  const first = useSection("more", 1)

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {pages.map((page, i) => (
          <MorePage key={page} page={page} isFirst={i === 0} />
        ))}
      </div>
      {(first.isLoading || !first.isError) && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setPages(p => [...p, p.length + 1])}
            disabled={first.isLoading}
          >
            Load More
          </Button>
        </div>
      )}
      {first.isLoading && <span className="sr-only">Loading</span>}
    </div>
  )
}

function MorePage({ page, isFirst }: { page: number; isFirst: boolean }) {
  const setSelected = useUIStore(s => s.setSelectedItem)
  const { data, isLoading, isError, refetch } = useSection("more", page)

  if (isError) {
    if (!isFirst) return null
    return (
      <div className="col-span-full">
        <ErrorState message="Couldn't load results." onRetry={() => refetch()} />
      </div>
    )
  }
  if (isLoading) {
    return (
      <div className="col-span-full">
        <GridSkeleton />
      </div>
    )
  }
  if (!data?.length && isFirst) {
    return (
      <div className="col-span-full">
        <EmptyState message="No matches for that combination — try refining your genres." />
      </div>
    )
  }
  return (
    <>
      {(data ?? []).map((item: MediaItem, i: number) => (
        <BlurFade
          key={`${item.source}-${item.id}`}
          inView
          delay={Math.min(i * 0.05, 0.5)}
          yOffset={18}
        >
          <MediaCard item={item} className="w-full md:w-full" onClick={() => setSelected(item)} />
        </BlurFade>
      ))}
    </>
  )
}

function ResultsContent() {
  const router = useRouter()
  const params = useSearchParams()
  const type = params.get("type") as MediaType | null
  const sub = params.get("sub")
  const genres = parseGenresParam(params.get("genres"))

  const validType = !!type && MEDIA_TYPES.includes(type as MediaType)
  const validSub =
    validType && !!sub && SUBTYPES[type as MediaType].some(s => s.value === sub)
  const valid = validType && validSub && genres.length > 0

  // URL params are the single source of truth — invalid params step back.
  useEffect(() => {
    if (!valid) {
      router.replace(
        validType && validSub ? `/discover/genres?type=${type}&sub=${sub}` : "/"
      )
    }
  }, [valid, validType, validSub, type, sub, router])

  if (!valid) return null

  const mediaType = type as MediaType
  const rowSections = sectionsFor(mediaType).filter(
    s => s !== "more"
  ) as Exclude<SectionId, "more">[]

  return (
    <main className="min-h-dvh">
      <Header>
        <ProgressBar currentStep={4} />
      </Header>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <BlurFade delay={0.02} className="w-full">
          <BackButton />
        </BlurFade>
        <BlurFade delay={0.08} yOffset={16}>
          <ResultsHeader type={mediaType} sub={sub as string} genres={genres} />
        </BlurFade>
        <div className="space-y-14">
          {rowSections.map((section, i) => (
            <section key={section}>
              <SectionTitle>{SECTION_TITLES[section]}</SectionTitle>
              <BlurFade inView delay={i * 0.05} yOffset={24}>
                <SectionRow section={section} />
              </BlurFade>
            </section>
          ))}
          <section>
            <SectionTitle>🤖 AI Pick</SectionTitle>
            <AIPickCard />
          </section>
          <section>
            <SectionTitle>{SECTION_TITLES.more}</SectionTitle>
            <MoreGrid />
          </section>
        </div>
      </div>
      <DetailModal />
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  )
}
