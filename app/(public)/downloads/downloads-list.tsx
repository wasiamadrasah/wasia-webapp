"use client"

import { useState, useMemo } from "react"
import {
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  Minus,
  Calendar,
  Tag,
  Search,
  X,
  FileDown,
} from "lucide-react"

type DownloadItem = {
  id: string
  title: string | null
  file_url: string | null
  download_type: string | null
  views: number
  created_at: string | null
}

const ITEMS_PER_PAGE = 15

function formatBengaliDate(dateStr: string | null) {
  if (!dateStr) return "তারিখ নেই"
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return "তারিখ নেই"

  return d.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function toBengaliNumber(num: number): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"]
  return num
    .toString()
    .split("")
    .map((d) => (d >= "0" && d <= "9" ? bnDigits[parseInt(d, 10)] : d))
    .join("")
}

export default function DownloadsList({ downloads }: { downloads: DownloadItem[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDownloads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return downloads

    return downloads.filter((item) => {
      const matchTitle = (item.title ?? "").toLowerCase().includes(query)
      const matchType = (item.download_type ?? "").toLowerCase().includes(query)
      return matchTitle || matchType
    })
  }, [downloads, searchQuery])

  const totalPages = Math.ceil(filteredDownloads.length / ITEMS_PER_PAGE) || 1

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredDownloads.slice(startIndex, endIndex)
  }, [filteredDownloads, currentPage])

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <section className="relative py-10 md:py-12 overflow-hidden">
      {/* Subtle Islamic Geometric Watermark */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="downloads-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
              <path
                d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,40 L6,35 L20,30 L14,16 L29,22 Z"
                fill="none"
                stroke="#075E54"
                strokeWidth="1.2"
              />
              <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#downloads-pattern)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Main Document Table Container */}
        <div className="overflow-hidden rounded-3xl border border-[#E2E7E4] bg-white shadow-xs">
          
          {/* Header Bar */}
          <div className="flex flex-col gap-4 bg-[#064A42] p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between text-white border-b border-[#B68A18]/30">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#B68A18] border border-[#B68A18]/30">
                <FileDown className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                  ডাউনলোডযোগ্য নথিপত্রের তালিকা
                </h2>
                <p className="text-[13px] text-[#DCEEE9]">
                  সর্বমোট {toBengaliNumber(downloads.length)}টি ফাইল সংরক্ষিত রয়েছে
                </p>
              </div>
            </div>

            {/* Quick Search */}
            {downloads.length > 0 && (
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#DCEEE9]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="ফাইলের নাম লিখে খুঁজুন..."
                  className="w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-9 py-2 text-[13.5px] text-white placeholder:text-[#DCEEE9]/70 focus:border-[#B68A18] focus:bg-white/20 focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("")
                      setCurrentPage(1)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#DCEEE9] hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Table Content */}
          {filteredDownloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#17211E]">
                কোনো ডাউনলোড ফাইল পাওয়া যায়নি
              </h3>
              <p className="text-[14px] text-[#5F6B67] max-w-sm">
                {searchQuery
                  ? "আপনার অনুসন্ধানের সাথে মিল রেখে কোনো নথি পাওয়া যায়নি।"
                  : "বর্তমানে কোনো নথি বা ফরম আপলোড করা নেই।"}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#075E54] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-[#064A42] transition"
                >
                  <span>অনুসন্ধান রিসেট করুন</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#E2E7E4] bg-[#F7F8F5] text-[13.5px] font-bold text-[#17211E]">
                      <th className="w-16 px-6 py-4 text-center">ক্র.নং</th>
                      <th className="px-6 py-4">ফাইলের নাম ও বিবরণ</th>
                      <th className="w-48 px-6 py-4">ক্যাটাগরি / ধরন</th>
                      <th className="w-36 px-6 py-4">প্রকাশের তারিখ</th>
                      <th className="w-32 px-6 py-4 text-center">ডাউনলোড</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E7E4]/70">
                    {paginatedData.map((download, index) => {
                      const slNo = (currentPage - 1) * ITEMS_PER_PAGE + index + 1

                      return (
                        <tr
                          key={download.id}
                          className="group transition-colors hover:bg-[#F0F7F5]/50"
                        >
                          {/* Serial Number */}
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7F8F5] border border-[#E2E7E4] text-[13px] font-bold text-[#5F6B67] group-hover:border-[#075E54]/30 group-hover:bg-[#075E54] group-hover:text-white transition-colors">
                              {toBengaliNumber(slNo)}
                            </span>
                          </td>

                          {/* File Title */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/15">
                                <FileText className="h-4.5 w-4.5" />
                              </div>
                              <span className="font-heading text-[15px] font-bold text-[#17211E] group-hover:text-[#075E54] transition-colors leading-snug">
                                {download.title || "নামবিহীন ফাইল"}
                              </span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-3 py-0.5 text-[12.5px] font-semibold text-[#075E54] capitalize">
                              <Tag className="h-3 w-3" />
                              <span>{download.download_type || "সাধারণ"}</span>
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-[13px] text-[#5F6B67]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-[#5F6B67]" />
                              <span>{formatBengaliDate(download.created_at)}</span>
                            </div>
                          </td>

                          {/* Download Button */}
                          <td className="px-6 py-4 text-center">
                            {download.file_url ? (
                              <a
                                href={download.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#075E54] text-white shadow-2xs transition hover:bg-[#064A42] hover:scale-105"
                                title="ফাইল ডাউনলোড করুন"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            ) : (
                              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7F8F5] text-[#5F6B67]/40 border border-[#E2E7E4]">
                                <Minus className="h-4 w-4" />
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="divide-y divide-[#E2E7E4] md:hidden">
                {paginatedData.map((download, index) => {
                  const slNo = (currentPage - 1) * ITEMS_PER_PAGE + index + 1

                  return (
                    <div key={download.id} className="p-5 space-y-3.5 hover:bg-[#F0F7F5]/30 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E7E4] bg-[#F7F8F5] px-2.5 py-1 text-[12px] font-bold text-[#5F6B67]">
                          <FileText className="h-3.5 w-3.5 text-[#075E54]" />
                          <span>নং: {toBengaliNumber(slNo)}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-2.5 py-0.5 text-[12px] font-semibold text-[#075E54] capitalize">
                          <Tag className="h-3 w-3" />
                          <span>{download.download_type || "সাধারণ"}</span>
                        </span>
                      </div>

                      <h3 className="font-heading text-[15.5px] font-bold text-[#17211E] leading-snug">
                        {download.title || "নামবিহীন ফাইল"}
                      </h3>

                      <div className="flex items-center justify-between gap-4 pt-1">
                        <span className="text-[12.5px] text-[#5F6B67] flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatBengaliDate(download.created_at)}</span>
                        </span>

                        {download.file_url ? (
                          <a
                            href={download.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#075E54] px-3.5 py-1.5 text-[13px] font-bold text-white shadow-xs hover:bg-[#064A42] transition"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>ডাউনলোড</span>
                          </a>
                        ) : (
                          <span className="text-[12px] font-medium text-[#5F6B67]/60">
                            লিংক নেই
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex flex-col gap-4 border-t border-[#E2E7E4] bg-[#F7F8F5] px-6 py-4 sm:flex-row sm:items-center sm:justify-between text-[13.5px]">
                  <div className="text-[#5F6B67]">
                    মোট <strong className="text-[#17211E] font-bold">{toBengaliNumber(filteredDownloads.length)}</strong> টি ফাইলের মধ্যে{" "}
                    <strong className="text-[#17211E] font-bold">
                      {toBengaliNumber((currentPage - 1) * ITEMS_PER_PAGE + 1)}–
                      {toBengaliNumber(Math.min(currentPage * ITEMS_PER_PAGE, filteredDownloads.length))}
                    </strong>{" "}
                    দেখানো হচ্ছে
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 rounded-xl border border-[#E2E7E4] bg-white px-3 py-1.5 font-semibold text-[#17211E] hover:bg-[#F0F7F5] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>পূর্ববর্তী</span>
                    </button>

                    <span className="rounded-xl border border-[#075E54]/20 bg-[#F0F7F5] px-3.5 py-1.5 font-bold text-[#075E54]">
                      পৃষ্ঠা {toBengaliNumber(currentPage)} / {toBengaliNumber(totalPages)}
                    </span>

                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 rounded-xl border border-[#E2E7E4] bg-white px-3 py-1.5 font-semibold text-[#17211E] hover:bg-[#F0F7F5] disabled:opacity-40 disabled:cursor-not-allowed transition"
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
