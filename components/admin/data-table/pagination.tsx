"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
  showRowSelectionCount?: boolean
  showPageSizeSelector?: boolean
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const totalFilteredCount = table.getFilteredRowModel().rows.length

  const startIndex = totalFilteredCount > 0 ? pageIndex * pageSize + 1 : 0
  const endIndex = Math.min((pageIndex + 1) * pageSize, totalFilteredCount)
  const pageCount = Math.max(1, table.getPageCount())

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 px-1 text-sm text-muted-foreground">
      {/* Left: Showing entries */}
      <div className="text-muted-foreground">
        Showing {startIndex} to {endIndex} of {totalFilteredCount} entries
      </div>

      {/* Right: Clean pagination controls matching screenshot */}
      <div className="flex items-center space-x-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="size-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {Array.from({ length: pageCount }).map((_, i) => {
          const pageNum = i + 1
          const isActive = pageIndex === i

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => table.setPageIndex(i)}
              className={`min-w-[28px] h-7 px-2 text-sm font-semibold rounded-[4px] transition-colors flex items-center justify-center ${
                isActive
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {pageNum}
            </button>
          )
        })}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="size-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
