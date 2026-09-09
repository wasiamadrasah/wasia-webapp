import Link from "next/link"
import Image from "next/image"
import { getBlogs } from "@/lib/db"
import { getSafeImageSrc } from "@/lib/media"
import { createPageMetadata } from "@/lib/seo"
import { BookText, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "Blogs",
  description: "Read school blog posts, educational articles, and community stories.",
  path: "/blogs",
  keywords: ["school blog", "education articles", "school stories"],
})

type BlogRecord = {
  id: string
  title: string | null
  content: string | null
  featured_image_url: string | null
  published_at: string | null
  created_at: string | null
}

function stripHtml(value: string | null) {
  if (!value) return ""
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

export default async function BlogsPublicPage() {
  const blogs = (await getBlogs(30))
    .filter((item) => item.published === true || Boolean(item.published_at))
    .map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      featured_image_url: item.featured_image_url,
      published_at: item.published_at,
      created_at: item.created_at,
    })) as BlogRecord[]

  return (
    <main className="px-6 py-12 md:px-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <p className="text-muted-foreground mt-2">Latest blog posts from the school.</p>
        <nav className="mt-6 flex justify-center text-sm text-slate-400" aria-label="Breadcrumb">
          <ol className="inline-flex items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-slate-700">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            </li>
            <li className="font-medium text-slate-600">Blogs</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-4">
          {blogs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
              No blogs have been published yet.
            </div>
          ) : (
            blogs.map((item) => {
              const dateStr = item.published_at || item.created_at
              const imageSrc = getSafeImageSrc(item.featured_image_url)

              return (
                <Link
                  key={item.id}
                  href={`/blogs/${item.id}`}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.title || "Blog image"}
                        width={112}
                        height={80}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <BookText className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition">{item.title || "Untitled blog"}</h2>
                    {dateStr ? (
                      <p className="mt-1 text-xs text-slate-400">{new Date(dateStr).toLocaleDateString()}</p>
                    ) : null}
                    {item.content ? <p className="mt-2 line-clamp-2 text-sm text-slate-500">{stripHtml(item.content)}</p> : null}
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 group-hover:text-emerald-500 transition" />
                </Link>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}
