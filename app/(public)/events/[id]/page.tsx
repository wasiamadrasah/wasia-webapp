import Link from "next/link"
import { notFound } from "next/navigation"
import { getEventById } from "@/lib/db"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { absoluteUrl, createPageMetadata, plainText } from "@/lib/seo"
import { CalendarDays, MapPin, ArrowLeft, Calendar, Tag } from "lucide-react"

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ev = await getEventById(id)

  if (!ev || (ev.published === false && !ev.event_date)) {
    return createPageMetadata({
      title: "অনুষ্ঠান পাওয়া যায়নি",
      description: "অনুরোধকৃত মাদ্রাসার অনুষ্ঠানটি খুঁজে পাওয়া যায়নি।",
      path: `/events/${id}`,
    })
  }

  return createPageMetadata({
    title: ev.title || "অনুষ্ঠান বিবরণ",
    description: plainText(ev.description, 160) || "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসার অনুষ্ঠান বিবরণ, তারিখ ও স্থান।",
    path: `/events/${id}`,
    keywords: [ev.category || "অনুষ্ঠান", "মাদ্রাসার অনুষ্ঠান", "ওয়াসিয়া আহমদিয়া সুন্নিয়া মাদ্রাসা"],
  })
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [ev, instituteSettings] = await Promise.all([
    getEventById(id),
    getInstituteSettings(),
  ])

  if (!ev || (ev.published === false && !ev.event_date)) notFound()

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা"

  const normalizedEvent = ev as {
    id: string
    title: string | null
    description: string | null
    event_date: string | null
    created_at: string | null
    location: string | null
    category: string | null
  }

  const dateStr = normalizedEvent.event_date || normalizedEvent.created_at
  const categorySlug = normalizedEvent.category ? slugify(normalizedEvent.category) : null

  let formattedDate = ""
  if (dateStr) {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString("bn-BD", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: normalizedEvent.title || "মাদ্রাসার অনুষ্ঠান",
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
      name: instituteName,
      url: absoluteUrl("/"),
    },
    url: absoluteUrl(`/events/${normalizedEvent.id}`),
  }

  return (
    <main className="bg-[#F7F8F5] py-10 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#075E54] hover:text-[#064A42] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>সকল অনুষ্ঠানে ফিরে যান</span>
          </Link>
          <PublicBreadcrumb
            current={normalizedEvent.title || "অনুষ্ঠান বিবরণ"}
            className="text-[13px] text-[#5F6B67]"
            plainCurrent
          />
        </div>

        {/* Main Event Article Card */}
        <article className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 md:p-10 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20 shadow-2xs">
              <CalendarDays className="h-7 w-7" />
            </div>

            {normalizedEvent.category && normalizedEvent.category !== "general" && categorySlug && (
              <Link
                href={`/events/category/${categorySlug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-3.5 py-1 text-[13px] font-semibold text-[#075E54] hover:bg-[#075E54] hover:text-white transition-colors"
              >
                <Tag className="h-3.5 w-3.5" />
                <span>{normalizedEvent.category}</span>
              </Link>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E] leading-snug">
              {normalizedEvent.title || "নামবিহীন অনুষ্ঠান"}
            </h1>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[14px] text-[#5F6B67] border-b border-[#E2E7E4]/70 pb-4">
              {formattedDate && (
                <div className="flex items-center gap-1.5 font-medium text-[#17211E]">
                  <Calendar className="h-4 w-4 text-[#075E54]" />
                  <span>{formattedDate}</span>
                </div>
              )}

              {normalizedEvent.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#B68A18]" />
                  <span>{normalizedEvent.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {normalizedEvent.description ? (
            <div className="text-[15px] leading-relaxed text-[#17211E]/90 whitespace-pre-wrap font-sans space-y-4 pt-2">
              {normalizedEvent.description}
            </div>
          ) : (
            <p className="text-[14.5px] italic text-[#5F6B67]">
              এই অনুষ্ঠানের কোনো বিস্তারিত বিবরণ দেওয়া হয়নি।
            </p>
          )}

          {/* Bottom actions */}
          <div className="pt-6 border-t border-[#E2E7E4] flex flex-wrap items-center justify-between gap-4">
            <div className="text-[13px] text-[#5F6B67]">
              প্রতিষ্ঠান: <strong className="text-[#17211E]">{instituteName}</strong>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F0F7F5] border border-[#075E54]/20 px-4 py-2 text-[13.5px] font-semibold text-[#075E54] hover:bg-[#075E54] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>অন্যান্য অনুষ্ঠান দেখুন</span>
            </Link>
          </div>
        </article>

      </div>
    </main>
  )
}
