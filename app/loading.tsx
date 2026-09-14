import { Skeleton } from "@/components/ui/skeleton"

/** Structural skeleton shown while a page streams in. */
export default function Loading() {
  return (
    <div aria-busy="true" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  )
}
