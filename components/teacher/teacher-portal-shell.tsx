"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  BriefcaseBusiness,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Sparkles,
  UserCircle,
  Users,
} from "lucide-react"

import type { NotificationRecord } from "@/lib/db"
import { TeacherTopbarControls } from "@/components/teacher/teacher-topbar-controls"

const navigation = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/profile", label: "My Profile", icon: UserCircle },
  { href: "/teacher/academics", label: "Academics", icon: GraduationCap },
  { href: "/teacher/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/teacher/training", label: "Training", icon: Sparkles },
  { href: "/teacher/family", label: "Family", icon: Users },
  { href: "/teacher/settings", label: "Account Settings", icon: Settings },
]

type TeacherPortalShellProps = {
  children: React.ReactNode
  displayName: string
  email?: string | null
  profilePhoto?: string | null
  notifications: NotificationRecord[]
}

export function TeacherPortalShell({
  children,
  displayName,
  email,
  profilePhoto,
  notifications,
}: TeacherPortalShellProps) {
  const pathname = usePathname()
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const clearPendingTimer = useRef<number | null>(null)

  const isPendingRoute = pendingHref !== null && pendingHref !== pathname
  const activePathname = isPendingRoute ? pendingHref : pathname

  const activeNavigationItem = useMemo(
    () =>
      navigation
        .filter((item) => activePathname.startsWith(item.href))
        .sort((a, b) => b.href.length - a.href.length)[0] ?? navigation[0],
    [activePathname]
  )

  useEffect(() => {
    const clearPending = () => setPendingHref(null)
    window.addEventListener("popstate", clearPending)

    return () => {
      window.removeEventListener("popstate", clearPending)
      if (clearPendingTimer.current) {
        window.clearTimeout(clearPendingTimer.current)
      }
    }
  }, [])

  const handleNavigate = (href: string) => {
    if (href === pathname) return

    if (clearPendingTimer.current) {
      window.clearTimeout(clearPendingTimer.current)
    }

    setPendingHref(href)
    clearPendingTimer.current = window.setTimeout(() => {
      setPendingHref(null)
    }, 4000)
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r border-slate-200 bg-white px-4 py-5 lg:block dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-base font-bold text-white dark:bg-white dark:text-slate-950">
            T
          </span>
          <div>
            <p className="text-sm font-semibold leading-none text-slate-950 dark:text-white">Teacher Portal</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Faculty workspace</p>
          </div>
        </div>

        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>
        <nav className="space-y-1">
          {navigation.map((item) => (
            <TeacherNavigationLink
              key={item.href}
              item={item}
              isActive={activePathname.startsWith(item.href)}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-950 dark:text-white">{displayName}</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{email}</p>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[280px]">
        <header className="fixed left-0 right-0 top-0 z-20 h-16 border-b border-slate-200 bg-white/90 backdrop-blur lg:left-[280px] dark:border-slate-800 dark:bg-slate-900/90">
          <div
            className={`absolute inset-x-0 top-0 h-0.5 origin-left bg-slate-950 transition-all duration-300 dark:bg-white ${
              isPendingRoute ? "scale-x-75 opacity-100" : "scale-x-0 opacity-0"
            }`}
          />
          <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between px-4 sm:px-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Teacher Portal
              </p>
              <p className="text-base font-semibold text-slate-950 transition-colors dark:text-white">
                {activeNavigationItem.label}
              </p>
            </div>
            <TeacherTopbarControls profilePhoto={profilePhoto} name={displayName} notifications={notifications} />
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 pb-24 pt-20 sm:px-6 lg:pb-8">
          <nav className="fixed bottom-3 left-3 right-3 z-30 grid grid-cols-7 gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg shadow-slate-950/10 lg:hidden dark:border-slate-800 dark:bg-slate-900">
            {navigation.map((item) => (
              <TeacherMobileNavigationLink
                key={item.href}
                item={item}
                isActive={activePathname.startsWith(item.href)}
                onNavigate={handleNavigate}
              />
            ))}
          </nav>
          <div key={pathname} className="teacher-page-transition">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}

type TeacherNavigationItem = (typeof navigation)[number]

function TeacherNavigationLink({
  item,
  isActive,
  onNavigate,
}: {
  item: TeacherNavigationItem
  isActive: boolean
  onNavigate: (href: string) => void
}) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={() => onNavigate(item.href)}
      aria-current={isActive ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
    >
      <Icon className="size-4 transition-transform duration-200 group-hover:scale-105" />
      {item.label}
    </Link>
  )
}

function TeacherMobileNavigationLink({
  item,
  isActive,
  onNavigate,
}: {
  item: TeacherNavigationItem
  isActive: boolean
  onNavigate: (href: string) => void
}) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={() => onNavigate(item.href)}
      aria-current={isActive ? "page" : undefined}
      className={`grid min-h-12 place-items-center rounded-md px-1 py-1 text-[10px] font-medium transition-all duration-200 ${
        isActive
          ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
    >
      <Icon className="size-4" />
      <span className="mt-0.5 hidden sm:inline">{item.label}</span>
    </Link>
  )
}
