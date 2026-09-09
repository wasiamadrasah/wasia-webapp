import { Outfit } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getNewsById } from "@/lib/db"
import { getSafeImageSrc } from "@/lib/media"
import { absoluteUrl, createPageMetadata, plainText } from "@/lib/seo"
import { sanitizeHTML } from "@/lib/utils"
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react"
import { ShareButtons } from "./share-buttons"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const news = await getNewsById(id)

  if (!news || (news.published === false && !news.published_at)) {
    return createPageMetadata({
      title: "News Not Found",
      description: "The requested school news article could not be found.",
      path: `/news/${id}`,
      image: "/images/og/og-home.png",
    })
  }

  return createPageMetadata({
    title: news.title || "School News",
    description: plainText(news.content, 160) || "Read the latest school news and updates.",
    path: `/news/${id}`,
    image: getSafeImageSrc(news.featured_image_url) || "/images/og/og-home.png",
  })
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const news = await getNewsById(id, { incrementViews: true })
  if (!news || (news.published === false && !news.published_at)) notFound()

  const normalizedNews = news as {
    id: string
    title: string | null
    content: string | null
    featured_image_url: string | null
    published_at: string | null
    created_at: string | null
  }

  const dateStr = normalizedNews.published_at || normalizedNews.created_at
  const imageSrc = getSafeImageSrc(normalizedNews.featured_image_url)
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
      "@id": absoluteUrl(`/news/${normalizedNews.id}`),
    },
  }

  return (
    <main className="bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Hero Section */}
      <section className={`${outfit.className} relative overflow-hidden bg-gradient-to-b from-[#021e17] via-[#01251e] to-slate-900 border-b border-emerald-950/40 px-6 py-6 md:px-10 md:py-8`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Modern radial glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {normalizedNews.title || "Untitled News"}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-slate-50 pt-14 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
                <div className="h-1 w-full bg-[#006a4e]" />

                <div className="p-6 sm:p-8">
                  {/* Featured Image */}
                  {imageSrc ? (
                    <div className="mb-8 overflow-hidden rounded-xl border border-slate-100">
                      <Image
                        src={imageSrc}
                        alt={normalizedNews.title || "Featured image"}
                        width={1200}
                        height={675}
                        unoptimized
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ) : null}

                  {/* Content */}
                  {normalizedNews.content ? (
                    <div
                      className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:leading-relaxed prose-p:text-slate-700 prose-a:text-[#006a4e] prose-a:no-underline hover:prose-a:underline prose-li:text-slate-700 prose-strong:text-slate-800 prose-blockquote:border-l-[#006a4e] prose-blockquote:text-slate-600 prose-code:text-[#006a4e] prose-code:bg-emerald-50 prose-code:rounded prose-code:px-1 prose-table:text-sm prose-th:text-slate-700 prose-td:text-slate-600 prose-img:rounded-lg"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(normalizedNews.content) }}
                    />
                  ) : (
                    <p className="leading-relaxed text-slate-600">No content available.</p>
                  )}
                </div>
              </div>

              <div>
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#006a4e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to News</span>
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
                <div className="bg-[#006a4e] px-5 py-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                    <Newspaper className="h-4 w-4" />
                    News Info
                  </h3>
                </div>
                <ul className="divide-y divide-slate-100">
                  <li className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Published</span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                      <CalendarDays className="h-4 w-4 text-[#006a4e]" />
                      {dateStr
                        ? new Date(dateStr).toLocaleDateString("en-BD", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Unknown"}
                    </span>
                  </li>
                </ul>
              </div>

              <ShareButtons
                url={absoluteUrl(`/news/${normalizedNews.id}`)}
                title={normalizedNews.title || "School News"}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
