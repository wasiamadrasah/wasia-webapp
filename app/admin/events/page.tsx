import { Calendar, Clock, Zap } from "lucide-react"

import { getEvents } from "@/lib/db"
import { NoticeDataTable } from "@/components/admin/notice-data-table"
import { PageHeader } from "@/components/digicampus/page-header"

type EventSummary = Awaited<ReturnType<typeof getEvents>>[number]

function calculateEventStats(events: EventSummary[]) {
  const now = new Date()
  const activeEvents = events.filter((event) => {
    if (event.status?.toLowerCase() === "ongoing") return true
    if (event.status?.toLowerCase() === "completed") return false
    if (event.status?.toLowerCase() === "cancelled") return false

    const startDate = event.start_date || event.event_date
    const endDate = event.end_date

    if (!startDate) return false

    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null

    if (end) {
      return start <= now && now <= end
    }

    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    return start >= dayAgo && start <= now
  }).length

  const upcomingEvents = events.filter((event) => {
    if (event.status?.toLowerCase() === "completed") return false
    if (event.status?.toLowerCase() === "cancelled") return false

    const startDate = event.start_date || event.event_date
    if (!startDate) return false

    const start = new Date(startDate)
    return start > now
  }).length

  const passedEvents = events.filter((event) => {
    if (event.status?.toLowerCase() === "completed") return true
    if (event.status?.toLowerCase() === "cancelled") return true

    const endDate = event.end_date || event.event_date
    if (!endDate) return false

    const end = new Date(endDate)
    return end < now
  }).length

  return { activeEvents, upcomingEvents, passedEvents }
}

export default async function EventsPage() {
  const events = await getEvents(100)
  const { activeEvents, upcomingEvents, passedEvents } = calculateEventStats(events)

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Events Management"
        description="Create, organize, and manage school events, schedules, categories, and publishing status."
      />

      {/* DigiCampus Modern Stat Cards */}
      <div className="grid w-full gap-5 md:grid-cols-3">
        {/* Active Events */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Events</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground">{activeEvents}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              Live Now
            </span>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upcoming Events</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground">{upcomingEvents}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] dark:bg-indigo-950/80 px-2.5 py-0.5 text-xs font-semibold text-[#4F46E5] dark:text-indigo-300 border border-[#C7D2FE] dark:border-indigo-800/60">
              Scheduled
            </span>
          </div>
        </div>

        {/* Passed Events */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Passed Events</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground">{passedEvents}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Archived
            </span>
          </div>
        </div>
      </div>

      <NoticeDataTable
        data={events.map((event) => ({
          id: event.id,
          title: event.title || "Untitled Event",
          content: event.description,
          category: event.category || "general",
          author: null,
          views: 0,
          status: event.published ? "published" : "draft",
          publishDate: event.start_date || event.event_date || event.created_at || "-",
          attachmentUrl: null,
        }))}
        basePath="/admin/events"
        addLabel="Add Event"
        showCategoriesButton={true}
        categoriesPath="/admin/events/categories"
      />
    </div>
  )
}
