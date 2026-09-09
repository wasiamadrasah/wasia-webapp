import { Outfit } from "next/font/google"
import { getEvents, getEventCategories } from "@/lib/db"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { createPageMetadata } from "@/lib/seo"
import { Calendar } from "lucide-react"
import EventsList from "./events-list"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "Events",
  description: "Explore upcoming and recent school events, programs, activities, and event categories.",
  path: "/events",
  keywords: ["school events", "events calendar", "programs", "activities"],
})

type EventRecord = {
  id: string
  title: string | null
  description: string | null
  event_date: string | null
  created_at: string | null
  location: string | null
  category: string | null
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default async function EventsPage() {
  const [allEvents, categories] = await Promise.all([
    getEvents(100),
    getEventCategories(),
  ])

  const events = allEvents
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

  return (
    <main>
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
            <span>CALENDAR</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            School Events
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            Upcoming programs, activities, and important dates.
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Events" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      <EventsList events={events} categories={categories} />
    </main>
  )
}
