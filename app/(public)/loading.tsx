import { Skeleton } from "@/components/ui/skeleton"

export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      {/* Banner / Header area skeleton */}
      <div className="space-y-4 mb-10">
        <Skeleton className="h-4 w-32 rounded-md bg-emerald-500/10" />
        <Skeleton className="h-9 w-72 md:w-96 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-4 w-full max-w-xl rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
      </div>

      {/* Grid cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4"
          >
            <Skeleton className="h-44 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
            <Skeleton className="h-5 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
              <Skeleton className="h-3.5 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="pt-2 flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded bg-slate-100 dark:bg-slate-800" />
              <Skeleton className="h-8 w-24 rounded-lg bg-emerald-500/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
