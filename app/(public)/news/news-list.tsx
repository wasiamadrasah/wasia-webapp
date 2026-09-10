"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react"
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
  return (
    <section className="bg-[#F0F7F5] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Standalone Card Grid */}
        {news.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E7E4] bg-white px-6 py-16 text-center shadow-xs">
            <div className="flex flex-col items-center gap-3">
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#F0F7F5] border border-[#075E54]/20 text-[#075E54]">
                <Newspaper className="h-6 w-6" />
              </div>
              <p className="font-heading font-bold text-xl text-[#17211E]">
                কোনো সংবাদ পাওয়া যায়নি
              </p>
              <p className="text-[14px] text-[#5F6B67]">
                নতুন সংবাদ প্রকাশিত হলে এখানে প্রদর্শিত হবে।
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => {
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
