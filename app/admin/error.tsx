"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, LayoutDashboard, RotateCcw } from "lucide-react"
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
    <div className="flex min-h-[calc(100vh-140px)] w-full items-center justify-center p-4 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-8 sm:p-10 text-center shadow-md">
        
        {/* Error Icon Badge */}
        <div className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive shadow-xs">
          <AlertCircle className="size-7" />
        </div>

        {/* Heading & Subtext */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Something Went Wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          An unexpected error occurred while loading this page.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-2.5">
          <Button
            type="button"
            onClick={reset}
            variant="outline"
            className="h-9 px-4 text-xs font-semibold border-border hover:bg-muted/70 cursor-pointer"
          >
            <RotateCcw className="size-3.5 mr-1.5" />
            Try Again
          </Button>

          <Button
            asChild
            className="h-9 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer"
          >
            <Link href="/admin/dashboard">
              <LayoutDashboard className="size-3.5 mr-1.5" />
              Dashboard
            </Link>
          </Button>
        </div>

      </div>
    </div>
  )
}
