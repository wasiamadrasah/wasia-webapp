"use client"

import { useState, useMemo } from "react"
import { Download, ChevronLeft, ChevronRight, File, Minus } from "lucide-react"

type DownloadItem = {
  id: string
  title: string | null
  file_url: string | null
  download_type: string | null
  views: number
  created_at: string | null
}

const ITEMS_PER_PAGE = 15

export default function DownloadsList({ downloads }: { downloads: DownloadItem[] }) {
  const [currentPage, setCurrentPage] = useState(1)

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return downloads.slice(startIndex, endIndex)
  }, [downloads, currentPage])

  const totalPages = Math.ceil(downloads.length / ITEMS_PER_PAGE)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
          {/* Header */}
          <div className="flex items-center gap-3 bg-[#006a4e] px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Available Downloads</h2>
              <p className="text-xs text-emerald-100">
                {downloads.length} file{downloads.length === 1 ? "" : "s"} available
              </p>
            </div>
          </div>

          {/* Table */}
          {downloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <File className="h-12 w-12 text-slate-300" />
              <p className="text-slate-600">No downloads available yet.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-slate-100 text-left">
                      <th className="w-16 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Sl</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">File Name</th>
                      <th className="w-40 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Category</th>
                      <th className="w-32 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-600">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((download, index) => {
                      const slNo = (currentPage - 1) * ITEMS_PER_PAGE + index + 1
                      return (
                        <tr key={download.id} className="group border-b border-slate-100 transition-colors duration-150 hover:bg-emerald-50">
                          <td className="px-6 py-4">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700">
                              {slNo}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900 max-w-sm truncate">
                            {download.title || "Untitled"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 capitalize">
                              {download.download_type || "general"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {download.file_url ? (
                              <a
                                href={download.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-[#006a4e] transition hover:bg-[#006a4e] hover:text-white"
                                aria-label="Download file"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            ) : (
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-300">
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
              <div className="divide-y divide-slate-100 md:hidden">
                {paginatedData.map((download, index) => {
                  const slNo = (currentPage - 1) * ITEMS_PER_PAGE + index + 1
                  return (
                    <div key={download.id} className="p-5 transition-colors hover:bg-emerald-50/30">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          <File className="h-3 w-3" />
                          {slNo}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 capitalize">
                          {download.download_type || "general"}
                        </span>
                      </div>

                      <h3 className="mb-4 block text-sm font-bold leading-snug text-slate-800">
                        {download.title || "Untitled"}
                      </h3>

                      {download.file_url ? (
                        <a
                          href={download.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-lg bg-[#006a4e] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-800"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full cursor-not-allowed rounded-lg bg-slate-100 py-2.5 text-xs font-bold text-slate-400"
                        >
                          No Link
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-900">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, downloads.length)}</span> to{" "}
                  <span className="font-semibold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, downloads.length)}</span> of{" "}
                  <span className="font-semibold text-slate-900">{downloads.length}</span> downloads
                </div>

                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                      let pageNum: number
                      if (totalPages <= 5) {
                        pageNum = idx + 1
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx
                      } else {
                        pageNum = currentPage - 2 + idx
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-[#006a4e] text-white"
                              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
