"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Calendar, MapPin, ChevronRight } from "lucide-react"

type EventRecord = {
  id: string
  title: string | null
  description: string | null
  event_date: string | null
  created_at: string | null
  location: string | null
  category: string | null
}

interface EventsListProps {
  events: EventRecord[]
  categories: string[]
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export default function EventsList({ events, categories }: EventsListProps) {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const query = searchParams.get("q")

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query?.trim().toLowerCase() ?? ""

    return events.filter((event) => {
      const matchesQuery = normalizedQuery
        ? (event.title ?? "").toLowerCase().includes(normalizedQuery)
        : true

      const matchesCategory = category
        ? slugify(event.category || "general") === category
        : true

      return matchesQuery && matchesCategory
    })
  }, [events, query, category])

  const countLabel =
    !query && !category
      ? `${filteredEvents.length} event${filteredEvents.length === 1 ? "" : "s"}`
      : `${filteredEvents.length} event${filteredEvents.length === 1 ? "" : "s"} shown`

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg dark:shadow-none">
          <div className="flex flex-col gap-4 bg-[#006a4e] dark:bg-emerald-950/90 border-b border-emerald-800/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Events Calendar</h2>
              <p className="text-sm text-emerald-100/90">{countLabel}</p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              View All
            </Link>
          </div>

          <div className="border-b border-border bg-card px-6 py-4">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/events"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  !category
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                    : "border border-border text-muted-foreground hover:border-emerald-500 hover:text-foreground hover:bg-muted/40"
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/events?category=${slugify(cat)}`}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    slugify(cat) === category
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                      : "border border-border text-muted-foreground hover:border-emerald-500 hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No events found in this category.
              </div>
            ) : (
              filteredEvents.map((ev) => {
                const dateStr = ev.event_date || ev.created_at
                return (
                  <Link
                    key={ev.id}
                    href={`/events/${ev.id}`}
                    className="group block p-6 transition hover:bg-muted/40"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-200/60 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/60">
                        <Calendar className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground transition group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          {ev.title || "Untitled event"}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          {dateStr && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(dateStr).toLocaleDateString("en-BD", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                          {ev.location && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {ev.location}
                            </span>
                          )}
                          {ev.category && ev.category !== "general" && (
                            <span className="rounded-full border border-emerald-300/60 bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950 dark:text-emerald-300">
                              {ev.category}
                            </span>
                          )}
                        </div>
                        {ev.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{ev.description}</p>
                        )}
                      </div>
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 transition group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
