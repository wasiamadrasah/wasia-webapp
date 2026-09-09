"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, CalendarDays, Newspaper, Search, Sparkles } from "lucide-react"
import { getSafeImageSrc } from "@/lib/media"

type NewsListItem = {
  id: string
  title: string | null
  content: string | null
  category: string | null
  featured_image_url: string | null
  published_at: string | null
  created_at: string | null
}

const banglaDigits: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
}

export function toBanglaNumber(num: number | string): string {
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit)
}

const banglaMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
]

function formatBanglaDate(value: string | null) {
  if (!value) return "তারিখ অপ্রাপ্ত"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "তারিখ অপ্রাপ্ত"

  const day = toBanglaNumber(date.getDate())
  const month = banglaMonths[date.getMonth()]
  const year = toBanglaNumber(date.getFullYear())
  return `${day} ${month}, ${year}`
}

const categoryMap: Record<string, string> = {
  general: "সাধারণ",
  General: "সাধারণ",
  academic: "একাডেমিক",
  Academic: "একাডেমিক",
  admission: "ভর্তি সংক্রান্ত",
  Admission: "ভর্তি সংক্রান্ত",
  event: "অনুষ্ঠানমালা",
  Event: "অনুষ্ঠানমালা",
  events: "অনুষ্ঠানমালা",
  achievement: "অর্জন ও পুরস্কার",
  Achievement: "অর্জন ও পুরস্কার",
  sports: "সহশিক্ষা ও খেলাধুলা",
  Sports: "সহশিক্ষা ও খেলাধুলা",
  campus: "ক্যাম্পাস জীবন",
  Campus: "ক্যাম্পাস জীবন",
}

function toBanglaCategory(cat?: string | null): string {
  if (!cat) return "সাধারণ"
  const trimmed = cat.trim()
  return categoryMap[trimmed] || categoryMap[trimmed.toLowerCase()] || trimmed
}

function stripHtml(value: string | null) {
  if (!value) return ""
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

export default function NewsList({ news }: { news: NewsListItem[] }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")

  const rawCategories = useMemo(
    () =>
      Array.from(
        new Set(
          news
            .map((item) => item.category?.trim())
            .filter((value): value is string => Boolean(value))
        )
      ),
    [news]
  )

  const normalizedQuery = query.trim().toLowerCase()

  const filteredNews = useMemo(
    () =>
      news.filter((item) => {
        const haystack = [item.title, stripHtml(item.content)].join(" ").toLowerCase()
        const matchesQuery = normalizedQuery ? haystack.includes(normalizedQuery) : true
        const matchesCategory = category ? (item.category ?? "") === category : true

        return matchesQuery && matchesCategory
      }),
    [category, news, normalizedQuery]
  )

  const countLabel =
    !query && !category
      ? `মোট ${toBanglaNumber(filteredNews.length)}টি সংবাদ প্রকাশিত`
      : `${toBanglaNumber(filteredNews.length)}টি সংবাদ পাওয়া গেছে`

  return (
    <section className="bg-[#F0F7F5] pt-6 sm:pt-8 pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Filter & Search Card */}
        <div className="mb-8 rounded-2xl bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Header info */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F7F5] border border-[#075E54]/20 text-[#075E54]">
                <Newspaper className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-[#17211E]">
                  সকল প্রকাশিত সংবাদ
                </h2>
                <p className="text-[14px] text-[#5F6B67]">{countLabel}</p>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-64 md:w-72">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6B67]" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="সংবাদ অনুসন্ধান করুন..."
                  className="w-full rounded-lg border border-[#E2E7E4] bg-[#F7F8F5] py-2.5 pl-10 pr-3.5 text-[15px] text-[#17211E] placeholder:text-[#5F6B67]/70 outline-none transition focus:border-[#075E54] focus:bg-white focus:ring-2 focus:ring-[#075E54]/15"
                />
              </div>

              {/* Category dropdown */}
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full sm:w-48 rounded-lg border border-[#E2E7E4] bg-[#F7F8F5] px-3.5 py-2.5 text-[15px] font-medium text-[#17211E] outline-none transition focus:border-[#075E54] focus:bg-white focus:ring-2 focus:ring-[#075E54]/15 cursor-pointer"
              >
                <option value="">সকল ক্যাটাগরি</option>
                {rawCategories.map((item) => (
                  <option key={item} value={item}>
                    {toBanglaCategory(item)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Standalone Card Grid */}
        {filteredNews.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E7E4] bg-white px-6 py-16 text-center shadow-xs">
            <div className="flex flex-col items-center gap-3">
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#F0F7F5] border border-[#075E54]/20 text-[#075E54]">
                <Search className="h-6 w-6" />
              </div>
              <p className="font-heading font-bold text-xl text-[#17211E]">
                কোনো সংবাদ পাওয়া যায়নি
              </p>
              {(query || category) && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("")
                    setCategory("")
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#075E54] px-4 py-2 text-[15px] font-semibold text-white transition hover:bg-[#064A42]"
                >
                  সকল ফিল্টার মুছুন
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((item) => {
              const imageSrc = getSafeImageSrc(item.featured_image_url)
              const dateStr = item.published_at || item.created_at
              const excerpt = stripHtml(item.content)
              const categoryLabel = toBanglaCategory(item.category)

              return (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-xs transition-shadow duration-200 hover:shadow-md"
                >
                  {/* Card Image */}
                  <Link
                    href={`/news/${item.id}`}
                    className="relative block h-52 overflow-hidden bg-[#F0F7F5]"
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.title || "News image"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E2E7E4]/50 to-[#F0F7F5] text-[#5F6B67]">
                        <Newspaper className="h-12 w-12 text-[#075E54]/30" />
                      </div>
                    )}

                    {/* Category badge */}
                    <span className="absolute left-3.5 top-3.5 inline-flex rounded-full bg-[#064A42]/90 border border-white/20 px-3 py-0.5 text-[12px] font-semibold text-white shadow-xs backdrop-blur-xs">
                      {categoryLabel}
                    </span>
                  </Link>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-2.5 flex items-center gap-1.5 text-[13px] text-[#5F6B67]">
                      <CalendarDays className="h-4 w-4 text-[#075E54]" />
                      <span>{formatBanglaDate(dateStr)}</span>
                    </div>

                    <h3 className="mb-2.5 line-clamp-2 font-heading text-lg sm:text-xl font-bold leading-snug text-[#17211E] transition-colors group-hover:text-[#075E54]">
                      <Link href={`/news/${item.id}`}>
                        {item.title || "শিরোনামহীন সংবাদ"}
                      </Link>
                    </h3>

                    {excerpt ? (
                      <p className="line-clamp-3 text-[15px] leading-relaxed text-[#5F6B67]">
                        {excerpt}
                      </p>
                    ) : null}

                    <div className="flex-1 min-h-[14px]" />

                    {/* Card Footer Link */}
                    <div className="mt-4 pt-1">
                      <Link
                        href={`/news/${item.id}`}
                        className="group/link inline-flex items-center gap-1.5 text-[15px] font-bold text-[#075E54] transition-colors hover:text-[#064A42]"
                      >
                        <span>বিস্তারিত পড়ুন</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
