"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Home, RefreshCw, AlertTriangle } from "lucide-react"

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Public] Page error:", error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-6 py-20 text-center">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      <h1 className="mt-5 text-2xl font-bold text-slate-800 sm:text-3xl">Something Went Wrong</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-500">
        An unexpected error occurred while loading this page. Please try again or return to the home page.
      </p>

      {error.digest && (
        <p className="mt-2 font-mono text-xs text-slate-400">Error ID: {error.digest}</p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Home className="h-4 w-4" />
          Go to Home
        </Link>
      </div>
    </div>
  )
}
