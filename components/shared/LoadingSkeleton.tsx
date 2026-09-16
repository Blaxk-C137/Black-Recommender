import { Skeleton } from "@/components/ui/skeleton"

export function MediaCardSkeleton() {
  return (
    <div className="w-[140px] shrink-0 md:w-[200px]">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-1 h-3 w-1/2" />
    </div>
  )
}

export function MediaRowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  )
}
