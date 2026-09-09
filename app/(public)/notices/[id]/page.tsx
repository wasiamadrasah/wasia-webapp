import { Outfit } from "next/font/google"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getNoticeById } from "@/lib/db"
import { createPageMetadata, plainText } from "@/lib/seo"
import { sanitizeHTML } from "@/lib/utils"
import { ArrowLeft, CalendarDays, CircleAlert, Paperclip, Tag } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const notice = await getNoticeById(id)

  if (!notice || (notice.published === false && !notice.published_at)) {
    return createPageMetadata({
      title: "Notice Not Found",
      description: "The requested school notice could not be found.",
      path: `/notices/${id}`,
      image: "/images/og/og-notice.png",
    })
  }

  return createPageMetadata({
    title: notice.title || "School Notice",
    description: plainText(notice.content, 160) || "Read this official school notice.",
    path: `/notices/${id}`,
    image: "/images/og/og-notice.png",
    keywords: [notice.notice_type || "notice", "school notice", "PBCCHS notice"],
  })
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

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
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className={`${outfit.className} relative overflow-hidden bg-gradient-to-b from-[#021e17] via-[#01251e] to-slate-900 border-b border-emerald-950/40 px-6 py-6 md:px-10 md:py-8`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Modern radial glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {normalizedNotice.title || "Untitled Notice"}
          </h1>
        </div>
      </section>

      <section className="bg-background pt-10 pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg dark:shadow-none">
                <div className="h-1.5 w-full bg-[#006a4e] dark:bg-emerald-500" />

                <div className="p-6 sm:p-8">
                  {normalizedNotice.content ? (
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:leading-relaxed prose-p:text-foreground/90 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-li:text-foreground/90 prose-strong:text-foreground prose-blockquote:border-l-emerald-600 dark:prose-blockquote:border-l-emerald-400 prose-blockquote:text-muted-foreground prose-code:text-emerald-600 dark:prose-code:text-emerald-400 prose-code:bg-emerald-50 dark:prose-code:bg-emerald-950/60 prose-code:rounded prose-code:px-1 prose-table:text-sm prose-th:text-foreground prose-td:text-muted-foreground prose-img:rounded-lg"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(normalizedNotice.content) }}
                    />
                  ) : (
                    <p className="leading-relaxed text-muted-foreground">No content available.</p>
                  )}
                </div>
              </div>

              <div>
                <Link
                  href="/notices"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#006a4e] dark:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 dark:hover:bg-emerald-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Notices</span>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg dark:shadow-none">
                <div className="bg-[#006a4e] dark:bg-emerald-950/90 border-b border-emerald-800/40 px-5 py-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                    <CircleAlert className="h-4 w-4" />
                    Notice Info
                  </h3>
                </div>
                <ul className="divide-y divide-border">
                  <li className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/80 bg-emerald-50 dark:border-emerald-800/60 dark:bg-emerald-950/70 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      <Tag className="h-3.5 w-3.5" />
                      {normalizedNotice.notice_type?.trim() || "General"}
                    </span>
                  </li>

                  <li className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Published</span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                      <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      {dateStr
                        ? new Date(dateStr).toLocaleDateString("en-BD", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Unknown"}
                    </span>
                  </li>

                  <li className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attachment</span>
                    {normalizedNotice.attachment_url ? (
                      <a
                        href={normalizedNotice.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-emerald-300/80 bg-emerald-100 dark:border-emerald-800/60 dark:bg-emerald-950/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition hover:bg-[#006a4e] hover:text-white dark:hover:bg-emerald-700"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        Open File
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        <Paperclip className="h-3.5 w-3.5" />
                        None
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



