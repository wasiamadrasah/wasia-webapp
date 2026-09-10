import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getAuthSession } from "@/lib/auth"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Student Portal",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = (await headers()).get("x-pathname") ?? ""

  if (pathname === "/student/login") {
    return <>{children}</>
  }

  const session = await getAuthSession()

  if (session?.user?.role !== "student") {
    redirect("/student/login")
  }

  return (
    <div className={`${outfit.className} min-h-screen bg-[#f6f7fb] text-slate-950`}>
      {children}
    </div>
  )
}
