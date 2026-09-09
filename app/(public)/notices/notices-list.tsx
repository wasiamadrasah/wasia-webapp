"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Grid3X3,
  Hash,
  LayoutList,
  Megaphone,
  Minus,
  Paperclip,
  Search,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type NoticeListItem = {
  id: string
  title: string | null
  published_at: string | null
  created_at: string | null
  notice_type: string | null
  attachment_url: string | null
}

function formatNoticeDate(value: string | null) {
  if (!value) return "Unknown"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown"

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

function isNoticeNew(value: string | null): boolean {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= 14
}

const PAGE_SIZE = 15

export default function NoticesList({ notices }: { notices: NoticeListItem[] }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [page, setPage] = useState(1)

  const categories = useMemo(() => {
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
      ? `${filteredNotices.length} notice${filteredNotices.length === 1 ? "" : "s"} published`
      : `${filteredNotices.length} notice${filteredNotices.length === 1 ? "" : "s"} found`

  return (
    <section className="w-full bg-background py-6 sm:py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Main Card Container */}
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg dark:shadow-none">

          {/* ── Header Toolbar ── */}
          <div className="bg-[#006a4e] dark:bg-emerald-950/90 border-b border-emerald-800/40 p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              
              {/* Title & Count */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white shadow-inner">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-white leading-tight truncate">Notice Board</h2>
                  <p className="text-xs text-emerald-100/90 truncate">{countLabel}</p>
                </div>
              </div>

              {/* Filters & View Switcher */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                
                {/* Search Input */}
                <div className="relative flex-1 sm:w-60 md:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value)
                      setPage(1)
                    }}
                    placeholder="Search by title..."
                    className="w-full rounded-xl border border-white/20 bg-white/15 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/60 outline-none transition focus:border-white/50 focus:bg-white/25 focus:ring-2 focus:ring-white/20"
                  />
                </div>

                {/* Category Dropdown */}
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value)
                    setPage(1)
                  }}
                  className="w-full sm:w-44 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-sm text-white outline-none transition focus:border-white/50 focus:bg-white/25 cursor-pointer"
                >
                  <option value="" className="bg-popover text-popover-foreground">
                    All Categories
                  </option>
                  {categories.map((item) => (
                    <option key={item} value={item} className="bg-popover text-popover-foreground">
                      {item}
                    </option>
                  ))}
                </select>

                {/* View Switcher (Table / Cards) */}
                <div className="flex items-center self-end sm:self-auto rounded-xl bg-white/10 p-1 border border-white/15">
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    aria-label="Table view"
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                      viewMode === "table"
                        ? "bg-white text-emerald-950 shadow-sm"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <LayoutList className="h-3.5 w-3.5" />
                    <span>Table</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                      viewMode === "grid"
                        ? "bg-white text-emerald-950 shadow-sm"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Grid3X3 className="h-3.5 w-3.5" />
                    <span>Cards</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* ── Content Section ── */}
          {filteredNotices.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50">
                  <Search className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-base font-bold text-foreground">No notices found</p>
                <p className="text-xs text-muted-foreground max-w-sm">
                  We couldn't find any notices matching &quot;{query}&quot; {category ? `in category &quot;${category}&quot;` : ""}.
                </p>
                {(query || category) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery("")
                      setCategory("")
                      setPage(1)
                    }}
                    className="mt-2 text-xs border-border"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* ── MODE 1: Truly Responsive Fluid Table ── */}
              {viewMode === "table" && (
                <div className="w-full overflow-hidden">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <th scope="col" className="w-10 sm:w-12 px-3 sm:px-4 py-3.5 text-center">#</th>
                        <th scope="col" className="px-3 sm:px-4 py-3.5">Notice Title</th>
                        <th scope="col" className="w-28 lg:w-36 px-4 py-3.5 hidden md:table-cell">Category</th>
                        <th scope="col" className="w-28 sm:w-32 md:w-36 px-3 sm:px-4 py-3.5 hidden sm:table-cell whitespace-nowrap">Publish Date</th>
                        <th scope="col" className="w-16 sm:w-20 px-3 py-3.5 text-center hidden sm:table-cell whitespace-nowrap">File</th>
                        <th scope="col" className="w-16 sm:w-20 px-3 sm:px-4 py-3.5 text-right whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedNotices.map((notice, index) => {
                        const dateStr = notice.published_at || notice.created_at
                        const isNew = isNoticeNew(dateStr)
                        const serial = (safePage - 1) * PAGE_SIZE + index + 1

                        return (
                          <tr
                            key={notice.id}
                            className="group transition-colors duration-150 hover:bg-muted/50"
                          >
                            {/* 1. Serial Number (Visible on all screens) */}
                            <td className="px-3 sm:px-4 py-3 sm:py-4 text-center align-middle">
                              <span className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-muted border border-border text-[11px] sm:text-xs font-bold text-muted-foreground transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-800 dark:group-hover:bg-emerald-950 dark:group-hover:text-emerald-300">
                                {serial}
                              </span>
                            </td>

                            {/* 2. Notice Title + Mobile Inline Badges */}
                            <td className="px-3 sm:px-4 py-3 sm:py-4 align-middle">
                              <div className="flex flex-col gap-1.5">
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                  <Link
                                    href={`/notices/${notice.id}`}
                                    className="group/title font-semibold text-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 text-xs sm:text-sm leading-snug"
                                  >
                                    <span className="[background-image:linear-gradient(#006a4e,#006a4e)] dark:[background-image:linear-gradient(#10b981,#10b981)] bg-no-repeat [background-position:0_100%] [background-size:0%_2px] transition-[background-size,color] duration-300 group-hover/title:[background-size:100%_2px]">
                                      {notice.title || "Untitled notice"}
                                    </span>
                                  </Link>

                                  {isNew && (
                                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] sm:text-[10px] px-1.5 py-0 rounded-md tracking-wider animate-pulse inline-flex items-center gap-0.5 shrink-0">
                                      <Sparkles className="h-2.5 w-2.5" />
                                      NEW
                                    </Badge>
                                  )}
                                </div>

                                {/* Mobile Extra Metadata (< 640px) */}
                                <div className="flex flex-wrap items-center gap-2 sm:hidden text-[11px] text-muted-foreground pt-0.5">
                                  {notice.notice_type && (
                                    <Badge
                                      variant="outline"
                                      className="rounded-full border-emerald-300/80 bg-emerald-50 text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold text-[10px] px-2 py-0"
                                    >
                                      {notice.notice_type}
                                    </Badge>
                                  )}

                                  <span className="inline-flex items-center gap-1">
                                    <CalendarDays className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>{formatNoticeDate(dateStr)}</span>
                                  </span>

                                  {notice.attachment_url && (
                                    <a
                                      href={notice.attachment_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                                    >
                                      <Paperclip className="h-3 w-3" />
                                      <span>Attachment</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* 3. Category Column (Hidden on < 768px) */}
                            <td className="px-4 py-3 sm:py-4 hidden md:table-cell align-middle">
                              {notice.notice_type ? (
                                <Badge
                                  variant="outline"
                                  className="rounded-full border-emerald-300/80 bg-emerald-50 text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold text-xs px-2.5 py-0.5"
                                >
                                  {notice.notice_type}
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>

                            {/* 4. Publish Date Column (Hidden on < 640px) */}
                            <td className="whitespace-nowrap px-3 sm:px-4 py-3 sm:py-4 hidden sm:table-cell align-middle">
                              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                                <CalendarDays className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="font-medium text-foreground/85">{formatNoticeDate(dateStr)}</span>
                              </div>
                            </td>

                            {/* 5. Attachment File Badge (Hidden on < 640px) */}
                            <td className="px-3 py-3 sm:py-4 text-center whitespace-nowrap hidden sm:table-cell align-middle">
                              {notice.attachment_url ? (
                                <a
                                  href={notice.attachment_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full border border-emerald-300/80 bg-emerald-100 dark:border-emerald-800/60 dark:bg-emerald-950 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition hover:bg-[#006a4e] hover:text-white dark:hover:bg-emerald-700"
                                  title="Download Attachment"
                                >
                                  <Paperclip className="h-3.5 w-3.5" />
                                  <span className="hidden md:inline">File</span>
                                </a>
                              ) : (
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground/40 border border-border/50">
                                  <Minus className="h-3 w-3" />
                                </span>
                              )}
                            </td>

                            {/* 6. Action Button (Visible on all screens) */}
                            <td className="px-3 sm:px-4 py-3 sm:py-4 text-right whitespace-nowrap align-middle">
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 sm:px-2.5 text-xs font-semibold border-emerald-300/80 hover:bg-emerald-50 dark:border-emerald-800/60 dark:hover:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded-lg gap-1"
                              >
                                <Link href={`/notices/${notice.id}`}>
                                  <Eye className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">View</span>
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── MODE 2: Responsive Card Grid View ── */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
                  {paginatedNotices.map((notice, index) => {
                    const dateStr = notice.published_at || notice.created_at
                    const isNew = isNoticeNew(dateStr)
                    const serial = (safePage - 1) * PAGE_SIZE + index + 1

                    return (
                      <div
                        key={notice.id}
                        className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs transition-all hover:border-emerald-500/40 hover:shadow-md dark:hover:border-emerald-500/30"
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                              <Hash className="h-3 w-3" />
                              {serial}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {isNew && (
                                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] px-1.5 py-0 rounded-md tracking-wider">
                                  NEW
                                </Badge>
                              )}
                              {notice.notice_type && (
                                <Badge
                                  variant="outline"
                                  className="rounded-full border-emerald-300/80 bg-emerald-50 text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold text-xs px-2.5 py-0.5"
                                >
                                  {notice.notice_type}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Title */}
                          <Link
                            href={`/notices/${notice.id}`}
                            className="group/title block text-base font-bold leading-snug text-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 mb-3"
                          >
                            <span className="[background-image:linear-gradient(#006a4e,#006a4e)] dark:[background-image:linear-gradient(#10b981,#10b981)] bg-no-repeat [background-position:0_100%] [background-size:0%_2px] transition-[background-size,color] duration-300 group-hover/title:[background-size:100%_2px]">
                              {notice.title || "Untitled notice"}
                            </span>
                          </Link>
                        </div>

                        {/* Card Footer */}
                        <div className="border-t border-border pt-3 mt-3">
                          <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{formatNoticeDate(dateStr)}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              asChild
                              size="sm"
                              className="w-full bg-[#006a4e] dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl gap-1.5"
                            >
                              <Link href={`/notices/${notice.id}`}>
                                <Eye className="h-3.5 w-3.5" />
                                View Notice
                              </Link>
                            </Button>

                            {notice.attachment_url ? (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="w-full border-emerald-300 text-emerald-800 dark:border-emerald-800/60 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-bold rounded-xl gap-1.5"
                              >
                                <a href={notice.attachment_url} target="_blank" rel="noreferrer">
                                  <Download className="h-3.5 w-3.5" />
                                  Download
                                </a>
                              </Button>
                            ) : (
                              <Button
                                disabled
                                size="sm"
                                variant="outline"
                                className="w-full border-border text-muted-foreground text-xs rounded-xl gap-1.5 opacity-60"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                No File
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ── Pagination Footer ── */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border bg-muted/30 px-4 py-3 sm:px-6">
                  <p className="text-xs text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{(safePage - 1) * PAGE_SIZE + 1}</span> to{" "}
                    <span className="font-semibold text-foreground">
                      {Math.min(safePage * PAGE_SIZE, filteredNotices.length)}
                    </span>{" "}
                    of <span className="font-semibold text-foreground">{filteredNotices.length}</span> notices
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={safePage <= 1}
                      className="h-8 px-3 text-xs border-border"
                    >
                      <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                      Previous
                    </Button>

                    <span className="text-xs font-semibold text-muted-foreground px-1">
                      {safePage} / {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={safePage >= totalPages}
                      className="h-8 px-3 text-xs border-border"
                    >
                      Next
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
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
