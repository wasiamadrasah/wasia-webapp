import Link from "next/link"
import { notFound } from "next/navigation"
import { getNoticeById } from "@/lib/db"
import { createPageMetadata, plainText } from "@/lib/seo"
import { sanitizeHTML } from "@/lib/utils"
import { PublicHero } from "@/components/layout/public-hero"
import { ArrowLeft, Bell, CalendarDays, Download, Info, Paperclip, Tag } from "lucide-react"

export const dynamic = "force-dynamic"

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

function toBanglaNumber(num: number | string): string {
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const notice = await getNoticeById(id)

  if (!notice || (notice.published === false && !notice.published_at)) {
    return createPageMetadata({
      title: "নোটিশ পাওয়া যায়নি",
      description: "অনুরোধকৃত নোটিশটি পাওয়া যায়নি।",
      path: `/notices/${id}`,
      image: "/images/og/og-notice.png",
    })
  }

  return createPageMetadata({
    title: notice.title || "নোটিশ বিবরণ",
    description: plainText(notice.content, 160) || "ওয়াসিয়া কামিল মাদ্রাসার অফিসিয়াল নোটিশ।",
    path: `/notices/${id}`,
    image: "/images/og/og-notice.png",
    keywords: [notice.notice_type || "নোটিশ", "মাদ্রাসা নোটিশ", "ওয়াসিয়া মাদ্রাসা"],
  })
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const notice = await getNoticeById(id, { incrementViews: true })
  if (!notice || (notice.published === false && !notice.published_at)) notFound()

  const normalizedNotice = notice as {
    id: string
    title: string | null
    content: string | null
    published_at: string | null
    created_at: string | null
    notice_type: string | null
    attachment_url: string | null
  }

  const dateStr = normalizedNotice.published_at || normalizedNotice.created_at

  return (
    <main className="bg-[#F0F7F5]">
      {/* Global Public Hero Banner */}
      <PublicHero
        title={normalizedNotice.title || "নোটিশ বিবরণ"}
        badgeText={toBanglaCategory(normalizedNotice.notice_type)}
        badgeIcon={Bell}
        breadcrumbCurrent="নোটিশ বিবরণ"
        breadcrumbParent={{ label: "নোটিশ বোর্ড", href: "/notices" }}
      />

      <section className="bg-[#F0F7F5] py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left: Notice Content (8 cols) */}
            <div className="space-y-6 lg:col-span-8">
              <div className="overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white shadow-xs">
                <div className="border-b border-[#E2E7E4] bg-[#F7F8F5] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[15px] text-[#5F6B67]">
                    <CalendarDays className="h-4 w-4 text-[#075E54]" />
                    <span>প্রকাশের তারিখ: <strong className="text-[#17211E]">{formatBanglaDate(dateStr)}</strong></span>
                  </div>
                  {normalizedNotice.notice_type && (
                    <span className="rounded-full border border-[#075E54]/20 bg-[#F0F7F5] text-[#075E54] font-semibold text-[13px] px-3 py-1">
                      {toBanglaCategory(normalizedNotice.notice_type)}
                    </span>
                  )}
                </div>

                <div className="p-6 sm:p-8">
                  {normalizedNotice.content ? (
                    <div
                      className="prose max-w-none text-[16px] leading-relaxed text-[#17211E] prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#17211E] prose-p:leading-relaxed prose-p:text-[#17211E] prose-a:text-[#075E54] prose-a:font-semibold hover:prose-a:underline prose-li:text-[#17211E] prose-strong:text-[#17211E] prose-blockquote:border-l-[#075E54] prose-blockquote:text-[#5F6B67] prose-img:rounded-xl prose-img:shadow-xs"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(normalizedNotice.content) }}
                    />
                  ) : (
                    <p className="leading-relaxed text-[#5F6B67] text-[15px]">
                      এই নোটিশের কোনো অতিরিক্ত বিবরণ প্রদান করা হয়নি।
                    </p>
                  )}
                </div>

                {normalizedNotice.attachment_url && (
                  <div className="border-t border-[#E2E7E4] bg-[#F7F8F5] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#075E54] text-white">
                        <Paperclip className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#17211E] text-[15px]">সংযুক্তি ফাইল সংরক্ষিত আছে</p>
                        <p className="text-[13px] text-[#5F6B67]">অফিসিয়াল কপি দেখার জন্য ফাইল ডাউনলোড করুন</p>
                      </div>
                    </div>
                    <a
                      href={normalizedNotice.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#075E54] px-5 py-2.5 text-[15px] font-bold text-white transition hover:bg-[#064A42] shadow-xs"
                    >
                      <Download className="h-4 w-4" />
                      <span>ডাউনলোড করুন</span>
                    </a>
                  </div>
                )}
              </div>

              <div>
                <Link
                  href="/notices"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#075E54] px-5 py-2.5 text-[15px] font-bold text-white shadow-xs transition hover:bg-[#064A42]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>সকল নোটিশে ফিরে যান</span>
                </Link>
              </div>
            </div>

            {/* Right: Notice Information Box (4 cols) */}
            <div className="space-y-6 lg:col-span-4">
              <div className="overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white shadow-xs">
                <div className="bg-[#064A42] border-b border-[#043731] px-5 py-4 text-white">
                  <h3 className="flex items-center gap-2 text-[16px] font-heading font-bold text-white">
                    <Info className="h-4 w-4 text-[#B68A18]" />
                    বিজ্ঞপ্তি সংক্রান্ত তথ্য
                  </h3>
                </div>
                <ul className="divide-y divide-[#E2E7E4]">
                  <li className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-[14px] font-semibold text-[#5F6B67]">ক্যাটাগরি</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-3 py-0.5 text-[13px] font-semibold text-[#075E54]">
                      <Tag className="h-3.5 w-3.5" />
                      {toBanglaCategory(normalizedNotice.notice_type)}
                    </span>
                  </li>

                  <li className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-[14px] font-semibold text-[#5F6B67]">প্রকাশের তারিখ</span>
                    <span className="inline-flex items-center gap-1.5 text-[15px] text-[#17211E] font-medium">
                      <CalendarDays className="h-4 w-4 text-[#075E54]" />
                      {formatBanglaDate(dateStr)}
                    </span>
                  </li>

                  <li className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-[14px] font-semibold text-[#5F6B67]">সংযুক্তি ফাইল</span>
                    {normalizedNotice.attachment_url ? (
                      <a
                        href={normalizedNotice.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-[#075E54]/20 bg-[#F0F7F5] px-2.5 py-1 text-[13px] font-semibold text-[#075E54] transition hover:bg-[#075E54] hover:text-white"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        ডাউনলোড
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#F7F8F5] border border-[#E2E7E4] px-2.5 py-0.5 text-[13px] font-semibold text-[#5F6B67]">
                        ফাইল নেই
                      </span>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
