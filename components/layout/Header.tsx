import { Sparkles } from "lucide-react"
import Link from "next/link"

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-3 md:px-8">
        <div className="flex w-full items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 font-display text-2xl font-bold tracking-tight"
          >
            <Sparkles className="size-5 text-accent-book transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="bg-gradient-to-r from-accent-movie via-accent-book to-[#ec4899] bg-clip-text text-transparent">
              Luminary
            </span>
          </Link>
        </div>
        {children}
      </div>
    </header>
  )
}
