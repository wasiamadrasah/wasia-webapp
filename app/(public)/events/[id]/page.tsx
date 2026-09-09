import Link from "next/link"
import { notFound } from "next/navigation"
import { getEventById } from "@/lib/db"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { absoluteUrl, createPageMetadata, plainText } from "@/lib/seo"
import { Calendar, MapPin, ArrowLeft } from "lucide-react"

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ev = await getEventById(id)

  if (!ev || (ev.published === false && !ev.event_date)) {
    return createPageMetadata({
      title: "Event Not Found",
      description: "The requested school event could not be found.",
      path: `/events/${id}`,
    })
  }

  return createPageMetadata({
    title: ev.title || "School Event",
    description: plainText(ev.description, 160) || "View school event details, date, and location.",
    path: `/events/${id}`,
    keywords: [ev.category || "event", "school event", "PBCCHS event"],
  })
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ev = await getEventById(id)
  if (!ev || (ev.published === false && !ev.event_date)) notFound()

  const normalizedEvent = ev as {
    id: string; title: string | null; description: string | null
    event_date: string | null; created_at: string | null; location: string | null
    category: string | null
  }

  const dateStr = normalizedEvent.event_date || normalizedEvent.created_at
  const categorySlug = normalizedEvent.category ? slugify(normalizedEvent.category) : null
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: normalizedEvent.title || "School Event",
    description: plainText(normalizedEvent.description, 300),
    startDate: normalizedEvent.event_date || undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: normalizedEvent.location
      ? {
          "@type": "Place",
          name: normalizedEvent.location,
        }
      : undefined,
    organizer: {
      "@type": "EducationalOrganization",
      name: "Purba Bakalia City Corporation High School",
      url: absoluteUrl("/"),
    },
    url: absoluteUrl(`/events/${normalizedEvent.id}`),
  }

  return (
    <main className="bg-background px-6 py-12 md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <PublicBreadcrumb
          current={normalizedEvent.title || "Untitled Event"}
          className="mt-6 mb-8 flex text-sm text-muted-foreground"
          tone="onLight"
        />

        <Link href="/events" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400">
          <ArrowLeft className="h-4 w-4" /> All Events
        </Link>

        <article className="rounded-3xl border border-border bg-card p-8 shadow-sm md:p-10">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/60 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/60">
            <Calendar className="h-7 w-7 text-emerald-700 dark:text-emerald-400" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground">{normalizedEvent.title || "Untitled Event"}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-3">
              {dateStr && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(dateStr).toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
              {normalizedEvent.location && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" />{normalizedEvent.location}
                </span>
              )}
            </div>
            {normalizedEvent.category && normalizedEvent.category !== "general" && categorySlug && (
              <Link
                href={`/events/category/${categorySlug}`}
                className="rounded-full border border-emerald-300/60 bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 hover:bg-emerald-200 dark:border-emerald-800/60 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900/70 transition"
              >
                {normalizedEvent.category}
              </Link>
            )}
          </div>

          {normalizedEvent.description && (
            <div className="mt-8">
              <p className="leading-8 text-foreground/90 whitespace-pre-wrap">{normalizedEvent.description}</p>
            </div>
          )}
        </article>
      </div>
    </main>
  )
}
