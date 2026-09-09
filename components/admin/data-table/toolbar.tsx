"use client"

import * as React from "react"
import { type Table } from "@tanstack/react-table"
import {
  Copy,
  FileSpreadsheet,
  FileText,
  FileDown,
  Printer,
  Columns3,
  Check,
  ChevronDown,
  X,
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableFacetedFilter } from "./faceted-filter"
import { BulkAction, FacetedFilterConfig } from "./types"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  searchPlaceholder?: string
  facetedFilters?: FacetedFilterConfig[]
  showColumnToggle?: boolean
  toolbarActions?: React.ReactNode
  enableExport?: boolean
  exportFilename?: string
  bulkActions?: BulkAction<TData>[]
  showPageSizeSelector?: boolean
  pageSizeOptions?: number[]
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search",
  facetedFilters = [],
  showColumnToggle = true,
  toolbarActions,
  enableExport = true,
  exportFilename = "export-data.csv",
  bulkActions = [],
  showPageSizeSelector = true,
  pageSizeOptions = [10, 25, 50, 100],
}: DataTableToolbarProps<TData>) {
  const [isCopied, setIsCopied] = React.useState(false)

  const isFiltered =
    table.getState().columnFilters.length > 0 || !!table.getState().globalFilter

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelection = selectedRows.length > 0

  const getExportData = React.useCallback(() => {
    const rowsToExport = hasSelection
      ? selectedRows.map((r) => r.original)
      : table.getFilteredRowModel().rows.map((r) => r.original)

    const visibleColumns = table
      .getAllColumns()
      .filter((c) => c.getIsVisible() && c.id !== "select" && c.id !== "actions")

    const headers = visibleColumns.map((c) => {
      if (typeof c.columnDef.header === "string") return c.columnDef.header
      return c.id
    })

    return { rowsToExport, visibleColumns, headers }
  }, [hasSelection, selectedRows, table])

  const handleCopy = React.useCallback(() => {
    const { rowsToExport, visibleColumns, headers } = getExportData()
    if (rowsToExport.length === 0) return

    const lines = [headers.join("\t")]
    rowsToExport.forEach((row) => {
      const vals = visibleColumns.map((col) => {
        const val = (row as Record<string, unknown>)[col.id]
        return val === null || val === undefined ? "" : String(val)
      })
      lines.push(vals.join("\t"))
    })

    navigator.clipboard.writeText(lines.join("\n"))
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }, [getExportData])

  const handleExportExcel = React.useCallback(() => {
    const { rowsToExport, visibleColumns, headers } = getExportData()
    if (rowsToExport.length === 0) return

    let tableHtml = `<table border="1"><thead><tr>`
    headers.forEach((h) => {
      tableHtml += `<th>${String(h)}</th>`
    })
    tableHtml += `</tr></thead><tbody>`
    rowsToExport.forEach((row) => {
      tableHtml += `<tr>`
      visibleColumns.forEach((col) => {
        const val = (row as Record<string, unknown>)[col.id]
        tableHtml += `<td>${val === null || val === undefined ? "" : String(val)}</td>`
      })
      tableHtml += `</tr>`
    })
    tableHtml += `</tbody></table>`

    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = exportFilename.replace(/\.csv$/, ".xls")
    link.click()
    URL.revokeObjectURL(url)
  }, [getExportData, exportFilename])

  const handleExportCSV = React.useCallback(() => {
    const { rowsToExport, visibleColumns, headers } = getExportData()
    if (rowsToExport.length === 0) return

    const csvRows: string[] = []
    csvRows.push(headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(","))

    rowsToExport.forEach((row) => {
      const values = visibleColumns.map((col) => {
        const val = (row as Record<string, unknown>)[col.id]
        if (val === null || val === undefined) return '""'
        if (typeof val === "object") return `"${JSON.stringify(val).replace(/"/g, '""')}"`
        return `"${String(val).replace(/"/g, '""')}"`
      })
      csvRows.push(values.join(","))
    })

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = exportFilename
    link.click()
    URL.revokeObjectURL(url)
  }, [getExportData, exportFilename])

  const handleExportPDF = React.useCallback(() => {
    const { rowsToExport, visibleColumns, headers } = getExportData()
    if (rowsToExport.length === 0) return

    const printWin = window.open("", "_blank")
    if (!printWin) {
      window.print()
      return
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${document.title || "Export Data"}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #111; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: 600; }
            h2 { margin-bottom: 5px; font-size: 18px; }
          </style>
        </head>
        <body>
          <h2>${document.title || "Export Data"}</h2>
          <table>
            <thead>
              <tr>${headers.map((h) => `<th>${String(h)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${rowsToExport
                .map(
                  (row) =>
                    `<tr>${visibleColumns
                      .map((col) => {
                        const val = (row as Record<string, unknown>)[col.id]
                        return `<td>${val === null || val === undefined ? "" : String(val)}</td>`
                      })
                      .join("")}</tr>`
                )
                .join("")}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `
    printWin.document.open()
    printWin.document.write(html)
    printWin.document.close()
  }, [getExportData])

  const handlePrint = React.useCallback(() => {
    window.print()
  }, [])

  const hideableColumns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())

  return (
    <div className="flex flex-col gap-2.5 pb-2">
      {/* Top Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left Side: Search Input */}
        <div className="flex flex-wrap items-center gap-2 flex-1 w-full sm:w-auto">
          {(() => {
            const searchValue = searchKey
              ? ((table.getColumn(searchKey)?.getFilterValue() as string) ?? "")
              : (table.getState().globalFilter ?? "")

            const handleSearchChange = (val: string) => {
              if (searchKey) {
                table.getColumn(searchKey)?.setFilterValue(val)
              } else {
                table.setGlobalFilter(val)
              }
            }

            return (
              <div className="relative w-full sm:w-56 md:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/70 pointer-events-none" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  className="h-8 pl-8 pr-7 py-0 text-sm bg-background border-border/80 hover:border-border rounded-[4px] focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary placeholder:text-muted-foreground/60 transition-colors"
                />
                {searchValue ? (
                  <button
                    type="button"
                    onClick={() => handleSearchChange("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 hover:text-foreground inline-flex items-center justify-center rounded-full hover:bg-muted/80 transition-colors"
                    title="Clear search"
                  >
                    <X className="size-3" />
                  </button>
                ) : null}
              </div>
            )
          })()}

          {/* Faceted Filters */}
          {facetedFilters.map((filter) => {
            const column = table.getColumn(filter.column)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.column}
                column={column}
                title={filter.title}
                options={filter.options}
                isMulti={filter.isMulti ?? true}
              />
            )
          })}

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                table.resetColumnFilters()
                table.setGlobalFilter("")
              }}
              className="h-8 px-2 text-sm text-muted-foreground hover:text-foreground rounded-[4px]"
            >
              Reset
              <X className="ml-1 size-3" />
            </Button>
          )}
        </div>

        {/* Right Side: Page Size Selector & Action Icons Strip (Exact Uniform h-8) */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0">
          {showPageSizeSelector && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-8 px-2.5 text-sm font-semibold text-foreground hover:text-foreground bg-background hover:bg-muted/40 border border-border/80 rounded-[4px] inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none box-border shrink-0"
                  title="Rows per page"
                >
                  <span className="tabular-nums font-semibold">{table.getState().pagination.pageSize}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[64px] p-1 bg-card border border-border shadow-md rounded-md sm:align-end">
                {pageSizeOptions.map((size) => {
                  const isCurrent = table.getState().pagination.pageSize === size
                  return (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => table.setPageSize(size)}
                      className={cn(
                        "cursor-pointer text-sm flex items-center justify-between px-2.5 py-1 rounded-sm",
                        isCurrent && "font-bold text-primary bg-primary/10"
                      )}
                    >
                      <span className="tabular-nums font-medium">{size}</span>
                      {isCurrent && <Check className="size-3.5 text-primary ml-1.5" />}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export Icons Toolbar (Exact h-8 Height) */}
          {enableExport && (
            <div className="h-8 flex items-center border border-border/80 rounded-[4px] p-0.5 space-x-0.5 bg-muted/20 text-foreground box-border shrink-0 overflow-x-auto">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-[26px] w-[26px] p-0 text-foreground hover:bg-primary hover:text-primary-foreground rounded-[3px] transition-colors"
                title="Copy to clipboard"
              >
                {isCopied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleExportExcel}
                className="h-[26px] w-[26px] p-0 text-foreground hover:bg-primary hover:text-primary-foreground rounded-[3px] transition-colors"
                title="Export Excel"
              >
                <FileSpreadsheet className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleExportCSV}
                className="h-[26px] w-[26px] p-0 text-foreground hover:bg-primary hover:text-primary-foreground rounded-[3px] transition-colors"
                title="Export CSV"
              >
                <FileText className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleExportPDF}
                className="h-[26px] w-[26px] p-0 text-foreground hover:bg-primary hover:text-primary-foreground rounded-[3px] transition-colors"
                title="Export PDF"
              >
                <FileDown className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="h-[26px] w-[26px] p-0 text-foreground hover:bg-primary hover:text-primary-foreground rounded-[3px] transition-colors"
                title="Print"
              >
                <Printer className="size-3.5" />
              </Button>

              {/* Column Visibility */}
              {showColumnToggle && hideableColumns.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-[26px] w-[26px] p-0 text-foreground hover:bg-primary hover:text-primary-foreground rounded-[3px] transition-colors"
                      title="Toggle Columns"
                    >
                      <Columns3 className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 bg-card border border-border shadow-md rounded-md p-1">
                    {hideableColumns.map((column) => {
                      const headerTitle =
                        typeof column.columnDef.header === "string"
                          ? column.columnDef.header
                          : column.id.replace(/_/g, " ")

                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize text-xs cursor-pointer rounded-sm py-1.5"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {headerTitle}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}

          {toolbarActions}
        </div>
      </div>

      {/* Bulk Action Strip */}
      {hasSelection && bulkActions.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-md transition-all">
          <div className="text-xs font-semibold text-primary">
            {selectedRows.length} item(s) selected
          </div>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || "outline"}
                  onClick={() =>
                    action.onClick(
                      selectedRows.map((r) => r.original),
                      table
                    )
                  }
                  className="h-7 text-xs rounded-md"
                >
                  {Icon && <Icon className="mr-1.5 size-3.5" />}
                  {action.label}
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
