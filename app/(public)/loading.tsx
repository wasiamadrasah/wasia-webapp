import { Skeleton } from "@/components/ui/skeleton"

export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] bg-[#F7F8F5] py-10 md:py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-28 rounded-full bg-[#075E54]/15" />
          </div>
          <Skeleton className="h-8 w-64 sm:w-96 rounded-xl bg-[#E2E7E4]" />
          <Skeleton className="h-4 w-full max-w-xl rounded-lg bg-[#E2E7E4]/70" />
        </div>

        {/* Grid Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-[#E2E7E4] bg-white p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-12 rounded-2xl bg-[#075E54]/10" />
                <Skeleton className="h-5 w-20 rounded-full bg-[#E2E7E4]/70" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded-lg bg-[#E2E7E4]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded bg-[#E2E7E4]/60" />
                <Skeleton className="h-4 w-4/5 rounded bg-[#E2E7E4]/60" />
              </div>
              <div className="pt-3 border-t border-[#E2E7E4]/60 flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded bg-[#E2E7E4]/70" />
                <Skeleton className="h-8 w-24 rounded-xl bg-[#075E54]/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
