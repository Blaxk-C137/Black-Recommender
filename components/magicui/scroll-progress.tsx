"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

/** Thin spring-animated page scroll progress bar pinned to the top. */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 40,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-0 z-[70] h-[3px] origin-left",
        "bg-gradient-to-r from-accent-movie via-accent-book to-[#ec4899]",
        className
      )}
      style={{ scaleX }}
    />
  )
}
