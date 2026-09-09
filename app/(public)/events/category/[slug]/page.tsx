import { Outfit } from "next/font/google"
import Link from "next/link"
import { getEvents, getEventCategories } from "@/lib/db"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { Calendar, MapPin, ChevronRight } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 60

type EventRecord = {
  id: string
  title: string | null
  description: string | null
  event_date: string | null
  created_at: string | null
  location: string | null
  category: string | null
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export async function generateStaticParams() {
  const categories = await getEventCategories()
  return categories.map((category) => ({
    slug: slugify(category),
  }))
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default async function EventCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const allCategories = await getEventCategories()
  const categoryName = allCategories.find((cat) => slugify(cat) === slug)

  if (!categoryName) {
    notFound()
  }

  const allEvents = (await getEvents(100))
    .filter((item) => item.published !== false)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      event_date: item.event_date,
      created_at: item.created_at,
      location: item.location ?? null,
      category: item.category ?? "general",
    })) as EventRecord[]

  const events = allEvents.filter((event) => slugify(event.category || "general") === slug)

  return (
    <main className="bg-background">
      <section className={`${outfit.className} relative overflow-hidden bg-gradient-to-b from-[#021e17] via-[#01251e] to-slate-900 border-b border-emerald-950/40 px-6 py-6 md:px-10 md:py-8`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Modern radial glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          {/* Pill Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 shadow-md shadow-emerald-950/30 backdrop-blur-md">
            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
            <span>Event Category</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {categoryName}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            {events.length} event{events.length === 1 ? "" : "s"} in this category
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current={categoryName} className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:border-emerald-500 hover:text-foreground hover:bg-muted/40 transition"
            >
              All Events
            </Link>
            {allCategories.map((cat) => (
              <Link
                key={cat}
                href={`/events/category/${slugify(cat)}`}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  slugify(cat) === slug
                    ? "border border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                    : "border border-border bg-card text-muted-foreground hover:border-emerald-500 hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No events in this category yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {events.map((ev) => {
                const dateStr = ev.event_date || ev.created_at
                return (
                  <li key={ev.id}>
                    <Link
                      href={`/events/${ev.id}`}
                      className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-emerald-500/50 hover:shadow-md dark:hover:bg-muted/30"
                    >
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-emerald-200/60 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/60">
                        <Calendar className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                          {ev.title || "Untitled event"}
                        </h2>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                          {dateStr && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(dateStr).toLocaleDateString("en-BD", {
                                year: "numeric",
                                month: "long",
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
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-emerald-500 transition" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}
