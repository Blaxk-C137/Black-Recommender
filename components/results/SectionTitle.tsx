"use client"

import { motion } from "framer-motion"

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <motion.h2
        initial={{ opacity: 0, x: -18 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-xl font-semibold tracking-tight md:text-2xl"
      >
        {children}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="mt-2 h-[3px] w-24 origin-left rounded-full bg-gradient-to-r from-accent-movie via-accent-book to-[#ec4899]"
      />
    </div>
  )
}
