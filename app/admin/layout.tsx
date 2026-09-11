import { Suspense } from "react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/auth"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { AppSidebar } from "@/components/app-sidebar"
import { AdminStatusSonner } from "@/components/admin/admin-status-sonner"
import { PageTransition } from "@/components/admin/page-transition"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { Outfit } from "next/font/google"
import { AdminSystemThemeProvider } from "@/components/admin/admin-system-theme-provider"

const outfit = Outfit({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  let shortCode = ""
  try {
    const instituteSettings = await getInstituteSettings()
    shortCode = instituteSettings?.primary?.shortForm?.trim() || instituteSettings?.primary?.instituteCode?.trim() || ""
  } catch {
    shortCode = ""
  }

  const centralTitle = shortCode ? `DigiCampus Workspace | ${shortCode}` : "DigiCampus Workspace"

  return {
    title: {
      absolute: centralTitle,
    },
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? ""
  const host = headersList.get("host") ?? ""
  const isSubdomain = host.startsWith("console.")

  // Allow login page without authentication
  if (pathname === "/admin/login" || pathname === "/login") {
    return <>{children}</>
  }

  // Check authentication for other admin routes
  const session = await getAuthSession()

  if (session?.user?.role !== "admin") {
    redirect(isSubdomain ? "/login" : "/admin/login")
  }

  // Fetch institute settings to get the logo
  let logoUrl: string | null = null
  try {
    const instituteSettings = await getInstituteSettings()
    logoUrl = instituteSettings?.primary?.logo ?? null
  } catch (error) {
    console.error("Failed to fetch institute settings:", error)
  }

  return (
    <div 
      className="admin-theme h-screen overflow-hidden flex flex-col bg-background text-foreground"
      style={{
        "--font-sans": "var(--admin-font-family, 'Outfit', sans-serif)",
        fontFamily: "var(--admin-font-family, 'Outfit', sans-serif)",
      } as React.CSSProperties}
    >
      <TooltipProvider>
        <SidebarProvider suppressHydrationWarning>
          <AppSidebar userSession={session?.user} suppressHydrationWarning />
          <SidebarInset>
            <SiteHeader logoUrl={logoUrl} />
            <main id="admin-main-scroll" data-admin-scroll="true" className="w-full flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
              <Suspense fallback={null}>
                <AdminStatusSonner />
              </Suspense>
              <PageTransition>{children}</PageTransition>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
