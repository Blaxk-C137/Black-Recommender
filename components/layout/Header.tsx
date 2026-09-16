import Link from "next/link"

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-3 md:px-8">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            Luminary
          </Link>
        </div>
        {children}
      </div>
    </header>
  )
}
