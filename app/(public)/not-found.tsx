"use client"

import Link from "next/link"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function PublicNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-6 py-20 text-center">

      {/* Big 404 number */}
      <p className="select-none text-[9rem] font-black leading-none tracking-tighter text-slate-100 sm:text-[12rem]">
        404
      </p>

      <div className="-mt-4">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/notices"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Search className="h-4 w-4" />
          Browse Notices
        </Link>
      </div>

      <button
        type="button"
        onClick={() => window.history.back()}
        className="mt-5 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Go back
      </button>
    </div>
  )
}
