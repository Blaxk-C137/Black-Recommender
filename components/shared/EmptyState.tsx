import { SearchX } from "lucide-react"

export function EmptyState({ message = "Nothing found." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <SearchX className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
