"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminNotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-[calc(100vh-180px)] w-full items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        
        {/* Simple 404 Display */}
        <p className="text-7xl font-extrabold tracking-tight text-muted-foreground/30 sm:text-8xl select-none">
          404
        </p>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Page Not Found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-9 px-4 text-xs font-semibold border-border text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Go Back
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
