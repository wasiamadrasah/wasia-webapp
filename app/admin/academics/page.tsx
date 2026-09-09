import Link from "next/link"
import {
  BookOpen,
  Calendar,
  Clock,
  Grid3X3,
  LayoutGrid,
  Users,
  BookMarked,
  Settings2,
} from "lucide-react"
import {
  getAcademicSessions,
  getAcademicVersions,
  getAcademicShifts,
  getClasses,
  getSections,
  getGroups,
  getSubjects,
  getAcademicClassConfigs,
  getActiveAcademicSession,
} from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AcademicsPage() {
  const [
    sessions,
    versions,
    shifts,
    classes,
    sections,
    groups,
    subjects,
    configs,
    activeSession,
  ] = await Promise.all([
    getAcademicSessions(),
    getAcademicVersions(),
    getAcademicShifts(),
    getClasses(),
    getSections(),
    getGroups(),
    getSubjects(),
    getAcademicClassConfigs(),
    getActiveAcademicSession(),
  ])

  const statCards = [
    {
      label: "Sessions",
      count: sessions.length,
      icon: Calendar,
      href: "/admin/academics/sessions",
      gradient: "from-blue-400 via-cyan-500 to-sky-600",
      blob1: "from-blue-300 to-cyan-400",
      blob2: "from-sky-400 to-blue-300",
    },
    {
      label: "Versions",
      count: versions.length,
      icon: LayoutGrid,
      href: "/admin/academics/versions",
      gradient: "from-violet-500 via-purple-500 to-indigo-600",
      blob1: "from-violet-400 to-purple-400",
      blob2: "from-indigo-400 to-violet-300",
    },
    {
      label: "Shifts",
      count: shifts.length,
      icon: Clock,
      href: "/admin/academics/shifts",
      gradient: "from-amber-400 via-orange-500 to-red-500",
      blob1: "from-amber-300 to-orange-400",
      blob2: "from-red-400 to-amber-300",
    },
    {
      label: "Classes",
      count: classes.length,
      icon: BookOpen,
      href: "/admin/academics/classes",
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      blob1: "from-emerald-300 to-green-400",
      blob2: "from-teal-400 to-cyan-300",
    },
    {
      label: "Sections",
      count: sections.length,
      icon: Grid3X3,
      href: "/admin/academics/sections",
      gradient: "from-pink-500 via-rose-500 to-red-600",
      blob1: "from-pink-400 to-rose-400",
      blob2: "from-red-400 to-pink-300",
    },
    {
      label: "Groups",
      count: groups.length,
      icon: Users,
      href: "/admin/academics/groups",
      gradient: "from-fuchsia-500 via-purple-500 to-violet-600",
      blob1: "from-fuchsia-400 to-purple-400",
      blob2: "from-violet-400 to-fuchsia-300",
    },
    {
      label: "Subjects",
      count: subjects.length,
      icon: BookMarked,
      href: "/admin/academics/subjects",
      gradient: "from-teal-400 via-cyan-500 to-blue-600",
      blob1: "from-teal-300 to-cyan-400",
      blob2: "from-blue-400 to-teal-300",
    },
    {
      label: "Class Configurations",
      count: configs.length,
      icon: Settings2,
      href: "/admin/academics/class-setup",
      gradient: "from-orange-400 via-amber-500 to-yellow-500",
      blob1: "from-orange-300 to-amber-400",
      blob2: "from-yellow-400 to-orange-300",
    },
  ]

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Module</h1>
        <p className="text-muted-foreground mt-2">
          Configure sessions, classes, subjects, and all academic structure.
        </p>
      </div>

      {/* Active Session Banner */}
      {activeSession ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <Calendar className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-800">Active Academic Session</p>
            <p className="text-lg font-bold text-emerald-900">{activeSession.name}</p>
          </div>
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
            Active
          </Badge>
          <Button asChild size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
            <Link href="/admin/academics/sessions">Manage Sessions</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <Calendar className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">No Active Session</p>
            <p className="text-sm text-amber-700">Please activate an academic session to get started.</p>
          </div>
          <Button asChild size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
            <Link href="/admin/academics/sessions">Set Active Session</Link>
          </Button>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card
              key={card.label}
              className="group relative overflow-hidden border-0 shadow-2xl transition-all duration-300 hover:shadow-2xl cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
              <div
                className={`absolute top-0 right-0 h-40 w-40 rounded-full bg-gradient-to-br ${card.blob1} opacity-30 -mr-20 -mt-20 blur-2xl group-hover:scale-150 transition-transform duration-500`}
              />
              <div
                className={`absolute bottom-0 left-0 h-32 w-32 rounded-full bg-gradient-to-tr ${card.blob2} opacity-20 -ml-16 -mb-16 blur-2xl group-hover:scale-125 transition-transform duration-500`}
              />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                      {card.label}
                    </p>
                    <p className="text-4xl font-black text-white drop-shadow-lg">
                      {card.count}
                    </p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300">
                    <Icon className="h-7 w-7 text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    asChild
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200"
                    variant="outline"
                  >
                    <Link href={card.href}>Manage →</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
