"use client"

import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Navbar } from "@/components/navbar"

interface SiteHeaderProps {
  logoUrl?: string | null
}

export function SiteHeader({ logoUrl }: SiteHeaderProps) {
  return (
    <header
      suppressHydrationWarning
      className="admin-top-nav sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 px-4"
    >
      <SidebarTrigger className="admin-top-nav-trigger shrink-0" />
      <Separator orientation="vertical" className="admin-top-nav-sep shrink-0" />

      {/* Institute Logo */}
      {logoUrl && (
        <>
          <div className="flex items-center shrink-0">
            <Image
              src={logoUrl}
              alt="Institute Logo"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              priority
            />
          </div>
          <Separator orientation="vertical" className="admin-top-nav-sep shrink-0" />
        </>
      )}

      <div className="ml-auto flex items-center">
        <Navbar />
      </div>
    </header>
  )
}
