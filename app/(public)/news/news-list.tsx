"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { CalendarDays, ChevronRight, Newspaper, Search } from "lucide-react"
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

function stripHtml(value: string | null) {
  if (!value) return ""
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function formatNewsDate(value: string | null) {
  if (!value) return "Unknown"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown"

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export default function NewsList({ news }: { news: NewsListItem[] }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")

  const categories = useMemo(
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
      ? `${filteredNews.length} article${filteredNews.length === 1 ? "" : "s"} published`
      : `${filteredNews.length} article${filteredNews.length === 1 ? "" : "s"} shown`

  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">All News</h2>
            <p className="mt-0.5 text-sm text-slate-400">{countLabel}</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search news..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 sm:w-56"
              />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 sm:w-44"
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <Search className="h-5 w-5 text-emerald-300" />
              </div>
              <p className="text-sm font-semibold text-slate-600">No news matches your search.</p>
              <p className="text-xs text-slate-400">Try a different keyword or category.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((item) => {
              const imageSrc = getSafeImageSrc(item.featured_image_url)
              const dateStr = item.published_at || item.created_at
              const excerpt = stripHtml(item.content)
              const categoryLabel = item.category?.trim() || "General"

              return (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/60"
                >
                  <Link href={`/news/${item.id}`} className="relative block h-52 overflow-hidden bg-slate-100">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.title || "News image"}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                        <Newspaper className="h-10 w-10" />
                      </div>
                    )}

                    <span className="absolute left-3 top-3 inline-flex rounded-full bg-emerald-600/85 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {categoryLabel}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                      <CalendarDays className="h-4 w-4 text-emerald-400" />
                      <span>{formatNewsDate(dateStr)}</span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-slate-800 transition-colors group-hover:text-emerald-700">
                      <Link href={`/news/${item.id}`}>{item.title || "Untitled news"}</Link>
                    </h3>

                    {excerpt ? <p className="line-clamp-3 text-sm leading-6 text-slate-500">{excerpt}</p> : null}

                    <div className="flex-1" />

                    <Link
                      href={`/news/${item.id}`}
                      className="group/link mt-4 inline-flex items-center gap-2 border-t border-slate-100 pt-3 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-800"
                    >
                      Read more
                      <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
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
