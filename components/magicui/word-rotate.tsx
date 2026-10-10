"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface WordRotateProps {
  words: string[]
  duration?: number
  className?: string
}

/** Rotates through a list of words with a lift-and-fade transition. */
export function WordRotate({ words, duration = 2400, className }: WordRotateProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(
      () => setIndex(i => (i + 1) % words.length),
      duration
    )
    return () => clearInterval(interval)
  }, [words.length, duration])

  return (
    <span className="inline-block overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn("inline-block", className)}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
