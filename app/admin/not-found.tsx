"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminNotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-[calc(100vh-140px)] w-full items-center justify-center p-4 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card p-8 sm:p-10 text-center shadow-md">
        
        {/* Stylized 404 Badge */}
        <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-primary/10 px-5 py-2.5 border border-primary/20">
          <span className="text-4xl sm:text-5xl font-black tracking-wider text-primary select-none leading-none">
            404
          </span>
        </div>

        {/* Heading & Subtext */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-9 px-4 text-xs font-semibold border-border hover:bg-muted/70 cursor-pointer"
          >
            <ArrowLeft className="size-3.5 mr-1.5" />
            Go Back
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
