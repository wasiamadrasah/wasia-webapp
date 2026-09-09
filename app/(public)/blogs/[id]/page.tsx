import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getBlogById } from "@/lib/db"
import { getSafeImageSrc } from "@/lib/media"
import { absoluteUrl, createPageMetadata, plainText } from "@/lib/seo"
import { sanitizeHTML } from "@/lib/utils"
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = await getBlogById(id)

  if (!blog || (blog.published === false && !blog.published_at)) {
    return createPageMetadata({
      title: "Blog Not Found",
      description: "The requested school blog post could not be found.",
      path: `/blogs/${id}`,
    })
  }

  return createPageMetadata({
    title: blog.title || "School Blog",
    description: plainText(blog.content, 160) || "Read this school blog post.",
    path: `/blogs/${id}`,
    image: getSafeImageSrc(blog.featured_image_url) || undefined,
  })
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = await getBlogById(id, { incrementViews: true })
  if (!blog || (blog.published === false && !blog.published_at)) notFound()

  const normalizedBlog = blog as {
    id: string
    title: string | null
    content: string | null
    featured_image_url: string | null
    published_at: string | null
    created_at: string | null
  }

  const dateStr = normalizedBlog.published_at || normalizedBlog.created_at
  const imageSrc = getSafeImageSrc(normalizedBlog.featured_image_url)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: normalizedBlog.title || "School Blog",
    description: plainText(normalizedBlog.content, 160),
    datePublished: normalizedBlog.published_at || normalizedBlog.created_at || undefined,
    dateModified: normalizedBlog.published_at || normalizedBlog.created_at || undefined,
    image: imageSrc ? [absoluteUrl(imageSrc)] : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blogs/${normalizedBlog.id}`),
    },
  }

  return (
    <main className="bg-slate-50 px-6 py-12 md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="mx-auto max-w-4xl">
        <nav className="mt-6 mb-8 flex text-sm text-slate-400" aria-label="Breadcrumb">
          <ol className="inline-flex items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-slate-700">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            </li>
            <li>
              <Link href="/blogs" className="transition-colors hover:text-slate-700">
                Blogs
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            </li>
            <li className="max-w-xs truncate font-medium text-slate-600 sm:max-w-md">
              {normalizedBlog.title || "Untitled Blog"}
            </li>
          </ol>
        </nav>

        <Link href="/blogs" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600">
          <ArrowLeft className="h-4 w-4" /> All Blogs
        </Link>

        <article className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-3xl font-bold text-slate-900">{normalizedBlog.title || "Untitled Blog"}</h1>
          {dateStr ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="h-4 w-4" />
              {new Date(dateStr).toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          ) : null}

          {imageSrc ? (
            <div className="mt-6 overflow-hidden rounded-xl">
              <Image
                src={imageSrc}
                alt={normalizedBlog.title || "Featured image"}
                width={1200}
                height={675}
                unoptimized
                className="h-auto w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-8 prose prose-slate max-w-none [&_*]:!text-slate-700 [&_*]:!bg-transparent [&_p]:!text-slate-700 [&_h1]:!text-slate-900 [&_h2]:!text-slate-900 [&_h3]:!text-slate-900 [&_h4]:!text-slate-900 [&_h5]:!text-slate-900 [&_h6]:!text-slate-900 [&_li]:!text-slate-700 [&_a]:!text-emerald-600">
            {normalizedBlog.content ? (
              <div className="leading-8 text-slate-700" dangerouslySetInnerHTML={{ __html: sanitizeHTML(normalizedBlog.content) }} />
            ) : (
              <p className="leading-8 text-slate-700">No content available.</p>
            )}
          </div>
        </article>
      </div>
    </main>
  )
}
