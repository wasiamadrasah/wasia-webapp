"use client"

import Image from "next/image"
import {
  Bell,
  Bookmark,
  CalendarDays,
  LogOut,
  Maximize2,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useTheme } from "@/app/providers"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import type { NotificationRecord } from "@/lib/db"

type TeacherTopbarControlsProps = {
  profilePhoto?: string | null
  name?: string | null
  notifications?: NotificationRecord[]
}

export function TeacherTopbarControls({
  profilePhoto,
  name,
  notifications = [],
}: TeacherTopbarControlsProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const notificationsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false)
      }

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const displayName = name?.trim() || "Teacher"
  const isDark = resolvedTheme === "dark"
  const notificationCount = notifications.length
  const notificationBadge = notificationCount > 9 ? "9+" : String(notificationCount)

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="relative hidden xl:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search dashboard..."
          className="h-10 w-64 rounded-full border border-slate-300 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-400"
        />
      </div>

      <button
        type="button"
        className="hidden h-10 w-10 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-slate-400 hover:text-slate-900 sm:grid dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        aria-label="Fullscreen"
      >
        <Maximize2 className="size-4" />
      </button>

      <div ref={notificationsRef} className="relative hidden sm:block">
        <button
          type="button"
          onClick={() => setNotificationsOpen((prev) => !prev)}
          className="relative grid h-10 w-10 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          aria-label="Open notifications"
          aria-expanded={notificationsOpen}
        >
          <Bell className="size-4" />
          {notificationCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-rose-600 px-1 text-[10px] font-semibold leading-none text-white dark:border-slate-900">
              {notificationBadge}
            </span>
          ) : null}
        </button>

        {notificationsOpen ? (
          <div className="absolute right-0 top-12 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">Notifications</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {notificationCount > 0 ? `${notificationCount} recent update${notificationCount === 1 ? "" : "s"}` : "No updates yet"}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Teacher
              </span>
            </div>

            {notificationCount > 0 ? (
              <div className="max-h-[28rem] overflow-y-auto p-2">
                {notifications.map((notification) => (
                  <article
                    key={notification.id}
                    className="rounded-lg px-3 py-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-950 dark:text-white">
                        {notification.title || "Untitled notification"}
                      </p>
                      <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium capitalize text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                        {notification.category || "general"}
                      </span>
                    </div>
                    {notification.content ? (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                        {toPlainText(notification.content)}
                      </p>
                    ) : null}
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <CalendarDays className="size-3.5" />
                      {formatNotificationDate(notification.published_at || notification.created_at)}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <Bell className="size-4" />
                </div>
                <p className="mt-3 text-sm font-medium text-slate-950 dark:text-white">No notifications</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Published teacher updates will appear here.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        className="hidden h-10 w-10 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-slate-400 hover:text-slate-900 md:grid dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        aria-label="Bookmarks"
      >
        <Bookmark className="size-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle theme"
        className="grid h-10 w-10 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500"
      >
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-1 py-1 pr-2 transition hover:border-slate-400 sm:pr-3 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500"
          aria-label="Open profile menu"
        >
          <span className="block h-8 w-8 overflow-hidden rounded-full bg-slate-100">
            <Image
              src={profilePhoto || "/avatar.png"}
              alt="Teacher avatar"
              width={32}
              height={32}
              unoptimized
              className="h-full w-full object-cover"
            />
          </span>
          <span className="hidden text-left md:block">
            <span className="block max-w-28 truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
              {displayName}
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">
              Teacher
            </span>
          </span>
        </button>

        {menuOpen ? (
            <div className="absolute right-0 top-12 w-52 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">

            <Link
              href="/teacher/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <User className="size-4" />
              My Profile
            </Link>

            <Link
              href="/teacher/settings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Settings className="size-4" />
              Account Settings
            </Link>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/teacher/login" })}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function toPlainText(content: string) {
  return content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function formatNotificationDate(value: string | null) {
  if (!value) return "Recently"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Recently"

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}
