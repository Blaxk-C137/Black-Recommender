"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BorderBeam } from "@/components/magicui/border-beam"
import { useAIPick } from "@/hooks/useAIPick"

export function AIPickCard() {
  const { data, isLoading, isError } = useAIPick()

  if (isError) return null // AI section never blocks — spec rule

  if (isLoading) {
    return (
      <div className="relative rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 shrink-0 rounded-lg" />
          <div className="w-full space-y-2">
            <p className="animate-pulse-slow text-sm italic text-muted-foreground">
              ✨ Consulting the AI oracle…
            </p>
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
        <BorderBeam size={160} duration={6} colorFrom="#8b5cf6" colorTo="#6366f1" borderWidth={1} />
      </div>
    )
  }

  if (!data) return null
  const { recommendation, item } = data

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative rounded-xl bg-card shadow-[0_0_50px_-12px_rgba(139,92,246,0.45)]"
    >
      <div className="relative flex flex-col gap-4 rounded-xl p-6 md:flex-row md:items-center">
        <Badge className="absolute -top-3 left-4 gap-1 border-0 bg-gradient-to-r from-accent-movie via-accent-book to-[#ec4899] text-white">
          <Sparkles className="size-3 animate-pulse" /> AI Pick
        </Badge>
        {item?.posterUrl && (
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- AI pick poster can come from any source CDN */}
            <img
              src={item.posterUrl}
              alt={recommendation.title}
              className="h-32 w-22 rounded-lg border border-border object-cover shadow-lg shadow-black/40"
            />
          </motion.div>
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
          <p className="mt-1 bg-gradient-to-r from-accent-book to-[#ec4899] bg-clip-text text-sm font-medium italic text-transparent">
            {recommendation.hype}
          </p>
        </div>
      </div>
      <BorderBeam size={220} duration={10} colorFrom="#6366f1" colorTo="#ec4899" />
      <BorderBeam size={220} duration={10} delay={5} colorFrom="#f59e0b" colorTo="#8b5cf6" />
    </motion.div>
  )
}
