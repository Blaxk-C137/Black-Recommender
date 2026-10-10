"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  yOffset?: number
  blur?: string
  /** Animate when scrolled into view (once) instead of on mount. */
  inView?: boolean
}

/** Fades content in from a blurred, offset state — mount or scroll-triggered. */
export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.45,
  yOffset = 14,
  blur = "8px",
  inView = false,
}: BlurFadeProps) {
  const reduce = useReducedMotion()
  const variants = {
    hidden: { y: reduce ? 0 : yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  }
  return (
    <motion.div
      initial="hidden"
      {...(inView
        ? { whileInView: "visible", viewport: { once: true, margin: "-64px" } }
        : { animate: "visible" })}
      variants={variants}
      transition={{ delay, duration, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
