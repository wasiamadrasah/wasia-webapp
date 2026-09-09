import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getNews, getNewsById } from "@/lib/db"
import { getSafeImageSrc } from "@/lib/media"
import { absoluteUrl, createPageMetadata, plainText } from "@/lib/seo"
import { sanitizeHTML } from "@/lib/utils"
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react"
import { NewsActionBar } from "./news-action-bar"

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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const news = await getNewsById(id)

  if (!news || (news.published === false && !news.published_at)) {
    return createPageMetadata({
      title: "সংবাদ পাওয়া যায়নি",
      description: "অনুরোধকৃত সংবাদটি পাওয়া যায়নি।",
      path: `/news/${id}`,
      image: "/images/og/og-home.png",
    })
  }

  return createPageMetadata({
    title: news.title || "সংবাদ বিবরণ",
    description: plainText(news.content, 160) || "ওয়াসিয়া কামিল মাদ্রাসার সর্বশেষ সংবাদ ও আপডেট।",
    path: `/news/${id}`,
    image: getSafeImageSrc(news.featured_image_url) || "/images/og/og-home.png",
  })
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [news, allNews] = await Promise.all([
    getNewsById(id, { incrementViews: true }),
    getNews(10),
  ])

  if (!news || (news.published === false && !news.published_at)) notFound()

  const normalizedNews = news as {
    id: string
    title: string | null
    content: string | null
    category: string | null
    featured_image_url: string | null
    published_at: string | null
    created_at: string | null
  }

  const relatedNews = allNews
    .filter(
      (item) =>
        item.id !== normalizedNews.id &&
        (item.published === true || Boolean(item.published_at))
    )
    .slice(0, 5)

  const dateStr = normalizedNews.published_at || normalizedNews.created_at
  const imageSrc = getSafeImageSrc(normalizedNews.featured_image_url)
  const categoryLabel = toBanglaCategory(normalizedNews.category)
  const currentUrl = absoluteUrl(`/news/${normalizedNews.id}`)

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: normalizedNews.title || "School News",
    description: plainText(normalizedNews.content, 160),
    datePublished: normalizedNews.published_at || normalizedNews.created_at || undefined,
    dateModified: normalizedNews.published_at || normalizedNews.created_at || undefined,
    image: imageSrc ? [absoluteUrl(imageSrc)] : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },
  }

  return (
    <main className="bg-[#F0F7F5] py-6 sm:py-8 md:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ── Left Column: Article Details (8 cols) ── */}
          <article className="space-y-6 lg:col-span-8">
            <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xs">
              {/* 1. Category Badge */}
              <div className="mb-3">
                <span className="inline-flex items-center rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-3.5 py-1 text-[13px] font-bold text-[#075E54]">
                  {categoryLabel}
                </span>
              </div>

              {/* 2. Main Title */}
              <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-[#17211E] leading-snug">
                {normalizedNews.title || "শিরোনামহীন সংবাদ"}
              </h1>

              {/* 3. Publication Date */}
              <div className="mt-3 flex items-center gap-2 text-[14px] text-[#5F6B67]">
                <CalendarDays className="h-4 w-4 text-[#075E54]" />
                <span>প্রকাশের তারিখ: <strong className="font-semibold text-[#17211E]">{formatBanglaDate(dateStr)}</strong></span>
              </div>

              {/* 4. Horizontal Line 1 */}
              <hr className="my-4 border-[#E2E7E4]" />

              {/* 5. Action Row: Share on Left, Print/Copy on Right */}
              <NewsActionBar
                url={currentUrl}
                title={normalizedNews.title || "মাদ্রাসার সংবাদ"}
              />

              {/* 6. Horizontal Line 2 */}
              <hr className="my-4 border-[#E2E7E4]" />

              {/* 7. Thumbnail / Featured Image */}
              {imageSrc ? (
                <div className="my-6 overflow-hidden rounded-xl bg-[#F0F7F5]">
                  <Image
                    src={imageSrc}
                    alt={normalizedNews.title || "সংবাদের ছবি"}
                    width={1200}
                    height={675}
                    unoptimized
                    className="h-auto w-full object-cover rounded-xl"
                  />
                </div>
              ) : null}

              {/* 8. News Content Body */}
              <div className="mt-6">
                {normalizedNews.content ? (
                  <div
                    className="prose max-w-none text-[16px] leading-relaxed text-[#17211E] prose-headings:font-heading prose-headings:font-bold prose-headings:text-[#17211E] prose-p:leading-relaxed prose-p:text-[#17211E] prose-a:text-[#075E54] prose-a:font-semibold hover:prose-a:underline prose-li:text-[#17211E] prose-strong:text-[#17211E] prose-blockquote:border-l-4 prose-blockquote:border-l-[#075E54] prose-blockquote:bg-[#F0F7F5] prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:text-[#5F6B67] prose-img:rounded-xl prose-img:shadow-xs"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(normalizedNews.content) }}
                  />
                ) : (
                  <p className="leading-relaxed text-[#5F6B67] text-[15px]">
                    এই সংবাদের কোনো অতিরিক্ত বিবরণ নেই।
                  </p>
                )}
              </div>
            </div>
          </article>

          {/* ── Right Column: Related News (4 cols) ── */}
          <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-xs">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between border-b border-[#E2E7E4] pb-3">
                <h2 className="font-heading font-bold text-lg text-[#17211E]">
                  সম্পর্কিত ও অন্যান্য সংবাদ
                </h2>
              </div>

              {/* Related List */}
              {relatedNews.length === 0 ? (
                <p className="text-[14px] text-[#5F6B67] py-4 text-center">
                  অন্য কোনো সংবাদ পাওয়া যায়নি।
                </p>
              ) : (
                <div className="divide-y divide-[#E2E7E4]">
                  {relatedNews.map((item) => {
                    const thumbSrc = getSafeImageSrc(item.featured_image_url)
                    const itemDate = item.published_at || item.created_at

                    return (
                      <article key={item.id} className="group py-3.5 first:pt-0 last:pb-0">
                        <Link href={`/news/${item.id}`} className="flex items-start gap-3">
                          {/* Mini Thumbnail */}
                          <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F0F7F5]">
                            {thumbSrc ? (
                              <Image
                                src={thumbSrc}
                                alt={item.title || "News thumb"}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#5F6B67]">
                                <Newspaper className="h-6 w-6 text-[#075E54]/30" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <span className="inline-block rounded-full bg-[#F0F7F5] border border-[#075E54]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#075E54] mb-1">
                              {toBanglaCategory(item.category)}
                            </span>
                            <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-[#17211E] transition-colors group-hover:text-[#075E54]">
                              {item.title || "শিরোনামহীন সংবাদ"}
                            </h3>
                            <div className="mt-1 flex items-center gap-1 text-[12px] text-[#5F6B67]">
                              <CalendarDays className="h-3 w-3 text-[#075E54]" />
                              <span>{formatBanglaDate(itemDate)}</span>
                            </div>
                          </div>
                        </Link>
                      </article>
                    )
                  })}
                </div>
              )}

              {/* View all link */}
              <div className="mt-5 border-t border-[#E2E7E4] pt-3 text-center">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#075E54] hover:text-[#064A42] transition-colors"
                >
                  <span>সকল সংবাদ দেখুন</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
