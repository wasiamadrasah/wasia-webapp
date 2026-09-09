import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { getAuthSession } from "@/lib/auth"
import { getNotificationsByRole, getTeacherProfile } from "@/lib/db"
import { TeacherStatusSonner } from "@/components/teacher/teacher-status-sonner"
import { TeacherPortalShell } from "@/components/teacher/teacher-portal-shell"
import { Toaster } from "@/components/ui/sonner"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Teacher Portal",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = (await headers()).get("x-pathname") ?? ""

  if (pathname === "/teacher/login") {
    return <div className={outfit.className}>{children}</div>
  }

  const session = await getAuthSession()

  if (session?.user?.role !== "teacher") {
    redirect("/teacher/login")
  }

  const profile = await getTeacherProfile(session.user.id)

  if (!profile) {
    redirect("/teacher/login")
  }

  const displayName =
    profile?.full_name_en || session.user.email?.split("@")[0] || "Teacher"
  const notifications = await getNotificationsByRole("teacher", 8)

  return (
    <div className={`${outfit.className} min-h-screen bg-[#f6f7fb] text-slate-950 dark:bg-slate-950 dark:text-slate-100`}>
      <TeacherStatusSonner />
      <TeacherPortalShell
        displayName={displayName}
        email={session.user.email}
        profilePhoto={profile?.profile_photo}
        notifications={notifications}
      >
        {children}
      </TeacherPortalShell>
      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}
