import { cn } from "@/lib/utils"

interface AuroraTextProps {
  className?: string
  children: React.ReactNode
}

/** Gradient text that slowly shifts its colors (Magic UI style). */
export function AuroraText({ className, children }: AuroraTextProps) {
  return (
    <span
      className={cn(
        "animate-aurora bg-[linear-gradient(110deg,#6366f1,10%,#8b5cf6,25%,#ec4899,45%,#f59e0b,60%,#8b5cf6,80%,#6366f1)] bg-[length:200%_auto] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  )
}
