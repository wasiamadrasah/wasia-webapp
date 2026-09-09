"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Megaphone,
  Minus,
  Paperclip,
  Search,
} from "lucide-react"

type NoticeListItem = {
  id: string
  title: string | null
  published_at: string | null
  created_at: string | null
  notice_type: string | null
  attachment_url: string | null
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
  exam: "পরীক্ষা সংক্রান্ত",
  Exam: "পরীক্ষা সংক্রান্ত",
  examination: "পরীক্ষা সংক্রান্ত",
  holiday: "ছুটির নোটিশ",
  Holiday: "ছুটির নোটিশ",
  emergency: "জরুরি বিজ্ঞপ্তি",
  Emergency: "জরুরি বিজ্ঞপ্তি",
  administrative: "প্রশাসনিক",
  Administrative: "প্রশাসনিক",
  event: "অনুষ্ঠানমালা",
  Event: "অনুষ্ঠানমালা",
}

function toBanglaCategory(cat?: string | null): string {
  if (!cat) return "সাধারণ"
  const trimmed = cat.trim()
  return categoryMap[trimmed] || categoryMap[trimmed.toLowerCase()] || trimmed
}

const PAGE_SIZE = 15

export default function NoticesList({ notices }: { notices: NoticeListItem[] }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [page, setPage] = useState(1)

  const rawCategories = useMemo(() => {
    return Array.from(
      new Set(
        notices
          .map((notice) => notice.notice_type?.trim())
          .filter((value): value is string => Boolean(value))
      )
    )
  }, [notices])

  const filteredNotices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return notices.filter((notice) => {
      const matchesQuery = normalizedQuery
        ? (notice.title ?? "").toLowerCase().includes(normalizedQuery)
        : true

      const matchesCategory = category ? (notice.notice_type ?? "") === category : true

      return matchesQuery && matchesCategory
    })
  }, [notices, query, category])

  // Reset page when filter changes
  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedNotices = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filteredNotices.slice(start, start + PAGE_SIZE)
  }, [filteredNotices, safePage])

  const countLabel =
    !query && !category
      ? `মোট ${toBanglaNumber(filteredNotices.length)}টি নোটিশ প্রকাশিত`
      : `${toBanglaNumber(filteredNotices.length)}টি নোটিশ পাওয়া গেছে`

  return (
    <section className="w-full bg-[#F0F7F5] pt-6 sm:pt-8 pb-8 sm:pb-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="w-full overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white shadow-xs">
          {/* ── Header Toolbar ── */}
          <div className="bg-[#064A42] border-b border-[#043731] p-4 sm:p-5 lg:p-6 text-white">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Title & Count */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#075E54] border border-white/15 text-[#B68A18] shadow-inner">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-white leading-tight truncate">
                    সকল প্রকাশিত বিজ্ঞপ্তি
                  </h2>
                  <p className="text-[14px] text-[#DCEEE9] truncate mt-0.5">{countLabel}</p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64 md:w-72">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value)
                      setPage(1)
                    }}
                    placeholder="শিরোনাম দিয়ে খুঁজুন..."
                    className="w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-10 pr-3.5 text-[15px] text-white placeholder:text-white/60 outline-none transition focus:border-[#B68A18] focus:bg-white/15 focus:ring-2 focus:ring-[#B68A18]/20"
                  />
                </div>

                {/* Category Dropdown */}
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value)
                    setPage(1)
                  }}
                  className="w-full sm:w-48 rounded-lg border border-white/20 bg-[#075E54] px-3.5 py-2.5 text-[15px] text-white outline-none transition focus:border-[#B68A18] focus:ring-2 focus:ring-[#B68A18]/20 cursor-pointer"
                >
                  <option value="" className="bg-[#064A42] text-white">
                    সকল ক্যাটাগরি
                  </option>
                  {rawCategories.map((item) => (
                    <option key={item} value={item} className="bg-[#064A42] text-white">
                      {toBanglaCategory(item)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Content Section ── */}
          {filteredNotices.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#F0F7F5] border border-[#075E54]/20 text-[#075E54]">
                  <Search className="h-6 w-6" />
                </div>
                <p className="font-heading font-bold text-xl text-[#17211E]">
                  কোনো নোটিশ পাওয়া যায়নি
                </p>
                {(query || category) && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("")
                      setCategory("")
                      setPage(1)
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#075E54] bg-[#075E54] px-4 py-2 text-[15px] font-semibold text-white transition hover:bg-[#064A42]"
                  >
                    সকল ফিল্টার মুছুন
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* ── Table & Responsive Mobile View ── */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E7E4] bg-[#F7F8F5] text-[14px] font-bold text-[#17211E]">
                      <th scope="col" className="w-12 sm:w-16 px-4 py-3.5 text-center">
                        ক্র.
                      </th>
                      <th scope="col" className="px-4 py-3.5">
                        নোটিশ শিরোনাম
                      </th>
                      <th scope="col" className="w-32 lg:w-40 px-4 py-3.5 hidden md:table-cell">
                        ক্যাটাগরি
                      </th>
                      <th scope="col" className="w-36 md:w-44 px-4 py-3.5 hidden sm:table-cell whitespace-nowrap">
                        প্রকাশের তারিখ
                      </th>
                      <th scope="col" className="w-20 px-3 py-3.5 text-center hidden sm:table-cell whitespace-nowrap">
                        সংযুক্তি
                      </th>
                      <th scope="col" className="w-14 sm:w-24 px-3 sm:px-4 py-3.5 text-right whitespace-nowrap">
                        কার্যক্রম
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E7E4]">
                    {paginatedNotices.map((notice, index) => {
                      const dateStr = notice.published_at || notice.created_at
                      const serial = (safePage - 1) * PAGE_SIZE + index + 1

                      return (
                        <tr
                          key={notice.id}
                          className="group transition-colors duration-150 hover:bg-[#F0F7F5]"
                        >
                          {/* 1. Serial Number */}
                          <td className="px-4 py-4 text-center align-middle">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F0F7F5] border border-[#E2E7E4] text-[14px] font-bold text-[#075E54] transition-colors group-hover:bg-[#075E54] group-hover:text-white">
                              {toBanglaNumber(serial)}
                            </span>
                          </td>

                          {/* 2. Notice Title + Mobile Metadata (< 640px) */}
                          <td className="px-4 py-4 align-middle">
                            <div className="flex flex-col gap-1.5">
                              <div>
                                <Link
                                  href={`/notices/${notice.id}`}
                                  className="font-bold text-[#17211E] transition-colors hover:text-[#075E54] text-[17px] sm:text-[18px] leading-snug"
                                >
                                  <span className="relative inline">
                                    {notice.title || "শিরোনামহীন নোটিশ"}
                                  </span>
                                </Link>
                              </div>

                              {/* Mobile Extra Metadata (< 640px) */}
                              <div className="flex flex-wrap items-center gap-2 sm:hidden text-[13px] text-[#5F6B67] pt-1">
                                {notice.notice_type && (
                                  <span className="rounded-full border border-[#075E54]/20 bg-[#F0F7F5] text-[#075E54] font-semibold text-[11px] px-2.5 py-0.5">
                                    {toBanglaCategory(notice.notice_type)}
                                  </span>
                                )}

                                <span className="inline-flex items-center gap-1">
                                  <CalendarDays className="h-3.5 w-3.5 text-[#075E54]" />
                                  <span>{formatBanglaDate(dateStr)}</span>
                                </span>

                                {notice.attachment_url && (
                                  <a
                                    href={notice.attachment_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 font-semibold text-[#075E54] hover:underline"
                                  >
                                    <Paperclip className="h-3.5 w-3.5" />
                                    <span>ফাইল</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 3. Category Column (Hidden on < 768px) */}
                          <td className="px-4 py-4 hidden md:table-cell align-middle">
                            {notice.notice_type ? (
                              <span className="inline-flex items-center rounded-full border border-[#075E54]/20 bg-[#F0F7F5] text-[#075E54] font-semibold text-[12px] px-2.5 py-0.5">
                                {toBanglaCategory(notice.notice_type)}
                              </span>
                            ) : (
                              <span className="text-[14px] text-[#5F6B67]">—</span>
                            )}
                          </td>

                          {/* 4. Publish Date Column (Hidden on < 640px) */}
                          <td className="whitespace-nowrap px-4 py-4 hidden sm:table-cell align-middle">
                            <div className="inline-flex items-center gap-1.5 text-[15px] text-[#5F6B67]">
                              <CalendarDays className="h-4 w-4 text-[#075E54] shrink-0" />
                              <span className="font-medium text-[#17211E]">
                                {formatBanglaDate(dateStr)}
                              </span>
                            </div>
                          </td>

                          {/* 5. Attachment File (Hidden on < 640px) */}
                          <td className="px-3 py-4 text-center whitespace-nowrap hidden sm:table-cell align-middle">
                            {notice.attachment_url ? (
                              <a
                                href={notice.attachment_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#075E54]/25 bg-[#F0F7F5] px-2.5 py-1 text-[13px] font-semibold text-[#075E54] transition hover:bg-[#075E54] hover:text-white"
                                title="ফাইল ডাউনলোড করুন"
                              >
                                <Paperclip className="h-3.5 w-3.5" />
                                <span>ফাইল</span>
                              </a>
                            ) : (
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F7F8F5] text-[#5F6B67]/40 border border-[#E2E7E4]">
                                <Minus className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </td>

                          {/* 6. Action Button */}
                          <td className="px-3 sm:px-4 py-4 text-right whitespace-nowrap align-middle">
                            <Link
                              href={`/notices/${notice.id}`}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#075E54] p-2 sm:px-3.5 sm:py-1.5 text-[14px] font-semibold text-white transition hover:bg-[#064A42] shadow-xs"
                              title="দেখুন"
                              aria-label="দেখুন"
                            >
                              <Eye className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                              <span className="hidden sm:inline">দেখুন</span>
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination Footer ── */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E2E7E4] bg-[#F7F8F5] px-4 py-3.5 sm:px-6">
                  <p className="text-[14px] text-[#5F6B67]">
                    দেখাচ্ছে <span className="font-bold text-[#17211E]">{toBanglaNumber((safePage - 1) * PAGE_SIZE + 1)}</span> থেকে{" "}
                    <span className="font-bold text-[#17211E]">
                      {toBanglaNumber(Math.min(safePage * PAGE_SIZE, filteredNotices.length))}
                    </span>{" "}
                    (মোট <span className="font-bold text-[#17211E]">{toBanglaNumber(filteredNotices.length)}</span> টির মধ্যে)
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={safePage <= 1}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#E2E7E4] bg-white px-3 py-1.5 text-[14px] font-semibold text-[#17211E] transition hover:bg-[#F0F7F5] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>পূর্ববর্তী</span>
                    </button>

                    <span className="text-[14px] font-bold text-[#075E54] px-2">
                      {toBanglaNumber(safePage)} / {toBanglaNumber(totalPages)}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={safePage >= totalPages}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#E2E7E4] bg-white px-3 py-1.5 text-[14px] font-semibold text-[#17211E] transition hover:bg-[#F0F7F5] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>পরবর্তী</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
