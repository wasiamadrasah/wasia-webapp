"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, Home, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Admin Portal] Unhandled error:", error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-180px)] w-full items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred while processing this request.
        </p>

        {error.digest && (
          <p className="mt-1 font-mono text-[11px] text-muted-foreground/70">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            type="button"
            onClick={reset}
            variant="outline"
            className="h-9 px-4 text-xs font-semibold border-border text-foreground hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Try Again
          </Button>

          <Button
            asChild
            className="h-9 bg-[#4F46E5] hover:bg-[#4338CA] px-4 text-xs font-semibold text-white shadow-sm"
          >
            <Link href="/dashboard">
              <Home className="h-3.5 w-3.5 mr-1.5" />
              Dashboard
            </Link>
          </Button>
        </div>

      </div>
    </div>
  )
}
