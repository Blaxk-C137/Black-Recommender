"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** rgba spotlight color, e.g. "rgba(99,102,241,0.22)" */
  spotlightColor?: string
  spotlightSize?: number
}

/**
 * Wrapper that renders a mouse-following radial spotlight inside itself.
 * Parent must be `relative` + `overflow-hidden`.
 */
export function SpotlightCard({
  spotlightColor = "rgba(139,92,246,0.22)",
  spotlightSize = 260,
  className,
  children,
  onMouseMove,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: -9999, y: -9999 })
  const [active, setActive] = useState(false)

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      onMouseMove?.(e)
    },
    [onMouseMove]
  )

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  )
}
