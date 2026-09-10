"use client"

import Link from "next/link"
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Calendar,
  Tag,
} from "lucide-react"

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
  categories?: string[]
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

export default function EventsList({ events }: EventsListProps) {
  return (
    <section className="relative py-10 md:py-12 overflow-hidden">
      {/* Subtle Islamic Geometric Watermark */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="events-list-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
              <path
                d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,30 L14,16 L29,22 Z"
                fill="none"
                stroke="#075E54"
                strokeWidth="1.2"
              />
              <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#events-list-pattern)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="rounded-3xl border border-[#E2E7E4] bg-white p-12 text-center space-y-3 shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
              <CalendarDays className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#17211E]">
              বর্তমানে কোনো অনুষ্ঠান নির্ধারিত নেই
            </h3>
            <p className="text-[14.5px] text-[#5F6B67] max-w-md mx-auto">
              মাদ্রাসার নতুন কোনো অনুষ্ঠান বা কর্মসূচির সময়সূচি প্রকাশিত হলে এখানে দেখতে পাবেন।
            </p>
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
                    {/* Top Row: Date Box & Category Pill */}
                    <div className="flex items-start justify-between gap-3">
                      {/* Styled Bengali Date Badge */}
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#F0F7F5] border border-[#075E54]/20 text-center">
                        <span className="font-heading text-lg font-extrabold text-[#075E54] leading-none">
                          {dateInfo.day}
                        </span>
                        <span className="text-[11px] font-semibold text-[#B68A18] leading-tight mt-0.5">
                          {dateInfo.monthYear.split(",")[0]}
                        </span>
                      </div>

                      {/* Category Badge */}
                      {ev.category && ev.category !== "general" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-3 py-0.5 text-[12px] font-semibold text-[#075E54]">
                          <Tag className="h-3 w-3" />
                          <span>{ev.category}</span>
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <h3 className="font-heading text-lg font-bold text-[#17211E] group-hover:text-[#075E54] transition-colors leading-snug line-clamp-2">
                      <Link href={`/events/${ev.id}`}>
                        {ev.title || "নামবিহীন অনুষ্ঠান"}
                      </Link>
                    </h3>

                    {/* Meta Info: Full Date & Location */}
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

                    {/* Description snippet */}
                    {ev.description && (
                      <p className="text-[14px] leading-relaxed text-[#5F6B67] line-clamp-2 pt-1 border-t border-[#E2E7E4]/60">
                        {ev.description}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom CTA */}
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
  )
}
