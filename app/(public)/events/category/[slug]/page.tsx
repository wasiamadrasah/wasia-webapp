import Link from "next/link"
import { getEvents, getEventCategories } from "@/lib/db"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"
import { CalendarDays, MapPin, Calendar, ArrowRight, Tag, ArrowLeft } from "lucide-react"
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

function formatBengaliDate(dateStr: string | null) {
  if (!dateStr) return { day: "--", monthYear: "তারিখ নির্ধারিত নয়", fullDate: "" }
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return { day: "--", monthYear: "তারিখ নির্ধারিত নয়", fullDate: "" }

  const day = d.toLocaleDateString("bn-BD", { day: "numeric" })
  const month = d.toLocaleDateString("bn-BD", { month: "short" })
  const year = d.toLocaleDateString("bn-BD", { year: "numeric" })
  const weekday = d.toLocaleDateString("bn-BD", { weekday: "long" })

  return {
    day,
    monthYear: `${month}, ${year}`,
    fullDate: `${weekday}, ${day} ${month} ${year}`,
  }
}

export default async function EventCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [allCategories, instituteSettings, rawEvents] = await Promise.all([
    getEventCategories(),
    getInstituteSettings(),
    getEvents(100),
  ])

  const categoryName = allCategories.find((cat) => slugify(cat) === slug)

  if (!categoryName) {
    notFound()
  }

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা"

  const allEvents = rawEvents
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

  const heroSubtitle = `${instituteName}-এর "${categoryName}" ক্যাটাগরির সকল অনুষ্ঠান ও কর্মসূচি তালিকা।`

  return (
    <main className="bg-[#F7F8F5]">
      {/* 1. Public Standard Hero */}
      <PublicHero
        title={categoryName}
        subtitle={heroSubtitle}
        badgeText="ক্যাটাগরি ভিত্তিক অনুষ্ঠান"
        badgeIcon={CalendarDays}
        breadcrumbCurrent={categoryName}
      />

      {/* 2. Main Content */}
      <section className="relative py-10 md:py-12 overflow-hidden">
        {/* Subtle Islamic Geometric Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cat-events-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <path
                  d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,40 L6,35 L20,30 L14,16 L29,22 Z"
                  fill="none"
                  stroke="#075E54"
                  strokeWidth="1.2"
                />
                <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cat-events-pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Category Navigation Bar */}
          <div className="rounded-3xl border border-[#E2E7E4] bg-white p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E7E4] bg-[#F7F8F5] px-4 py-1.5 text-[13.5px] font-semibold text-[#5F6B67] hover:bg-[#F0F7F5] hover:text-[#075E54] transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>সকল অনুষ্ঠান</span>
              </Link>
              {allCategories.map((cat) => {
                const catSlug = slugify(cat)
                const isCurrent = catSlug === slug

                return (
                  <Link
                    key={cat}
                    href={`/events/category/${catSlug}`}
                    className={`rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition ${
                      isCurrent
                        ? "bg-[#075E54] text-white shadow-xs"
                        : "border border-[#E2E7E4] bg-[#F7F8F5] text-[#5F6B67] hover:bg-[#F0F7F5] hover:text-[#075E54]"
                    }`}
                  >
                    {cat}
                  </Link>
                )
              })}
            </div>

            <div className="text-[13.5px] font-medium text-[#5F6B67] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#075E54]" />
              <span>
                এই বিভাগে মোট <strong className="text-[#075E54] font-bold">{events.length}</strong> টি অনুষ্ঠান রয়েছে
              </span>
            </div>
          </div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <div className="rounded-3xl border border-[#E2E7E4] bg-white p-12 text-center space-y-3 shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                <CalendarDays className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#17211E]">
                এই ক্যাটাগরিতে কোনো অনুষ্ঠান নেই
              </h3>
              <p className="text-[14.5px] text-[#5F6B67] max-w-md mx-auto">
                বর্তমানে &ldquo;{categoryName}&rdquo; বিভাগে কোনো নির্ধারিত অনুষ্ঠান পাওয়া যায়নি।
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-xl bg-[#075E54] px-4 py-2 text-[13.5px] font-semibold text-white shadow-xs hover:bg-[#064A42] transition"
              >
                <span>সকল অনুষ্ঠান দেখুন</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {events.map((ev, idx) => {
                const dateInfo = formatBengaliDate(ev.event_date || ev.created_at)

                return (
                  <div
                    key={ev.id}
                    className="card-appear rounded-3xl border border-[#E2E7E4] bg-white p-6 shadow-xs flex flex-col justify-between hover:border-[#075E54]/40 hover:shadow-md transition-all group"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#F0F7F5] border border-[#075E54]/20 text-center">
                          <span className="font-heading text-lg font-extrabold text-[#075E54] leading-none">
                            {dateInfo.day}
                          </span>
                          <span className="text-[11px] font-semibold text-[#B68A18] leading-tight mt-0.5">
                            {dateInfo.monthYear.split(",")[0]}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-3 py-0.5 text-[12px] font-semibold text-[#075E54]">
                          <Tag className="h-3 w-3" />
                          <span>{categoryName}</span>
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-[#17211E] group-hover:text-[#075E54] transition-colors leading-snug line-clamp-2">
                        <Link href={`/events/${ev.id}`}>
                          {ev.title || "নামবিহীন অনুষ্ঠান"}
                        </Link>
                      </h3>

                      <div className="space-y-1.5 text-[13px] text-[#5F6B67]">
                        {dateInfo.fullDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#075E54] shrink-0" />
                            <span>{dateInfo.fullDate}</span>
                          </div>
                        )}

                        {ev.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#B68A18] shrink-0" />
                            <span className="line-clamp-1">{ev.location}</span>
                          </div>
                        )}
                      </div>

                      {ev.description && (
                        <p className="text-[14px] leading-relaxed text-[#5F6B67] line-clamp-2 pt-1 border-t border-[#E2E7E4]/60">
                          {ev.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#E2E7E4]/60">
                      <Link
                        href={`/events/${ev.id}`}
                        className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#075E54] group-hover:text-[#064A42] transition-colors"
                      >
                        <span>বিস্তারিত দেখুন</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </section>
    </main>
  )
}
