"use client"

import { useState, useEffect } from "react"
import { Users, BookOpen, FileText, Calendar } from "lucide-react"
import { getDashboardStats } from "@/app/admin/actions"
import Link from "next/link"

const CARDS = [
  {
    title: "Teachers",
    subtitle: "active members",
    key: "totalTeachers" as const,
    icon: Users,
    href: "/admin/teachers",
    bg: "#0062e3",          // Vibrant Blue
    shadow: "rgba(0,98,227,0.35)",
  },
  {
    title: "Staff Members",
    subtitle: "on the team",
    key: "totalStaff" as const,
    icon: BookOpen,
    href: "/admin/staff",
    bg: "#00a65a",          // Vibrant Green
    shadow: "rgba(0,166,90,0.35)",
  },
  {
    title: "Notices",
    subtitle: "published",
    key: "totalNotices" as const,
    icon: FileText,
    href: "/admin/notices",
    bg: "#e91e63",          // Vibrant Pink/Crimson
    shadow: "rgba(233,30,99,0.35)",
  },
  {
    title: "Events",
    subtitle: "scheduled",
    key: "activeEvents" as const,
    icon: Calendar,
    href: "/admin/events",
    bg: "#ff851b",          // Vibrant Orange
    shadow: "rgba(255,133,27,0.35)",
  },
]

type Stats = {
  totalTeachers: number
  totalStaff: number
  totalNotices: number
  activeEvents: number
}

export function SectionCards() {
  const [stats, setStats] = useState<Stats>({
    totalTeachers: 0,
    totalStaff: 0,
    totalNotices: 0,
    activeEvents: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getDashboardStats()
        if (result.success && result.data) {
          setStats({
            totalTeachers: result.data.totalTeachers || 0,
            totalStaff: result.data.totalStaff || 0,
            totalNotices: result.data.totalNotices || 0,
            activeEvents: result.data.activeEvents || 0,
          })
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="w-full">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse h-32 rounded-2xl"
              style={{ backgroundColor: ["#0062e3","#00a65a","#e91e63","#ff851b"][i] + "40" }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => {
          const Icon = card.icon
          const value = stats[card.key]

          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative block h-32 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer isolate"
              style={{
                backgroundColor: card.bg,
                boxShadow: `0 6px 20px ${card.shadow}`,
              }}
            >
              {/* ── Top row: Icon Badge + Title (Grouped horizontally) ── */}
              <div className="absolute inset-x-0 top-0 flex items-center gap-2.5 px-5 pt-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 border border-white/20">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-base font-semibold text-white tracking-wide">
                  {card.title}
                </p>
              </div>

              {/* ── Bottom row: Value + Subtitle ── */}
              <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
                <p className="text-4xl font-extrabold text-white leading-none tabular-nums">
                  {value.toLocaleString()}
                </p>
                <p className="mt-1.5 text-xs font-medium text-white/80">
                  {card.subtitle}
                </p>
              </div>

              {/* ── Watermark icon top-right (partially clipped, faded) ── */}
              <div className="pointer-events-none absolute -top-4 -right-4 opacity-[0.12] group-hover:opacity-[0.18] transition-opacity duration-300 rounded-lg">
                <Icon className="h-20 w-20 text-white" strokeWidth={1.2} />
              </div>

              {/* ── Hover shimmer ── */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 rounded-lg" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
