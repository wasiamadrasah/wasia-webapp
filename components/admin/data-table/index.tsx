"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Inbox, Plus, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"

import { DataTableToolbar } from "./toolbar"
import { DataTablePagination } from "./pagination"
import { DataTableColumnHeader } from "./column-header"
import { DataTableFacetedFilter } from "./faceted-filter"
import { DataTableViewOptions } from "./view-options"
import {
  AdminDataTableProps,
  BulkAction,
  FacetedFilterConfig,
  FacetedFilterOption,
} from "./types"

/**
 * Global Reusable Admin Data Table Component
 * Designed for DigiCampus Admin Portal with mobile responsive expandable child rows.
 */
export function AdminDataTable<TData, TValue = unknown>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  facetedFilters = [],
  toolbarActions,
  enableExport = false,
  exportFilename,
  bulkActions = [],
  showColumnToggle = true,
  showPagination = true,
  showRowSelectionCount = true,
  showPageSizeSelector = true,
  isLoading = false,
  loadingRowCount = 6,
  emptyTitle = "No records found",
  emptyDescription = "There are no data records available to display.",
  emptyAction,
  getRowId,
  onRowClick,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  manualPagination = false,
  pageCount,
  enableResponsiveRows = true,
  mobileVisibleColumns = 2,
  className,
  tableClassName,
}: AdminDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState<string>("")
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())

  // Initialize TanStack React Table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    manualPagination,
    pageCount,
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
  })

  const toggleRowExpansion = (rowId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      return next
    })
  }

  const hasMultipleColumns = columns.length > mobileVisibleColumns
  const showMobileExpander = enableResponsiveRows && hasMultipleColumns

  return (
    <div className={cn("w-full space-y-3.5", className)}>
      {/* Top Toolbar */}
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        searchPlaceholder={searchPlaceholder}
        facetedFilters={facetedFilters}
        showColumnToggle={showColumnToggle}
        toolbarActions={toolbarActions}
        enableExport={enableExport}
        exportFilename={exportFilename}
        bulkActions={bulkActions}
        showPageSizeSelector={showPageSizeSelector}
        pageSizeOptions={pageSizeOptions}
      />

      {/* Main Table Container (Sharp / Square Corners) */}
      <div className={cn("border border-border bg-card overflow-hidden rounded-none", tableClassName)}>
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-muted/30 border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border hover:bg-transparent">
                  {/* Mobile expansion indicator column header */}
                  {showMobileExpander && (
                    <th className="w-8 px-2 text-center md:hidden" aria-label="Expand" />
                  )}

                  {headerGroup.headers.map((header, idx) => {
                    const isHiddenOnMobile = showMobileExpander && idx >= mobileVisibleColumns
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          "h-10 px-4 text-left align-middle font-semibold text-sm text-foreground tracking-wide select-none",
                          isHiddenOnMobile && "hidden md:table-cell"
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                // Skeleton loading rows
                Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
                  <tr key={`skeleton-${rowIndex}`} className="border-b border-border">
                    {showMobileExpander && (
                      <td className="w-8 px-2 text-center md:hidden">
                        <Skeleton className="size-4 rounded-full mx-auto" />
                      </td>
                    )}
                    {columns.map((_, colIndex) => {
                      const isHiddenOnMobile = showMobileExpander && colIndex >= mobileVisibleColumns
                      return (
                        <td
                          key={`skeleton-cell-${colIndex}`}
                          className={cn(
                            "py-3.5 px-4 align-middle",
                            isHiddenOnMobile && "hidden md:table-cell"
                          )}
                        >
                          <Skeleton className="h-5 w-full bg-muted/60" />
                        </td>
                      )
                    })}
                  </tr>
                ))
              ) : table.getRowModel().rows?.length ? (
                // Data rows
                table.getRowModel().rows.map((row) => {
                  const isExpanded = expandedRows.has(row.id)
                  const cells = row.getVisibleCells()
                  const hiddenCellsOnMobile = showMobileExpander
                    ? cells.slice(mobileVisibleColumns)
                    : []

                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        data-state={row.getIsSelected() && "selected"}
                        className={cn(
                          "border-b border-border transition-colors hover:bg-muted/30",
                          onRowClick && "cursor-pointer"
                        )}
                        onClick={() => onRowClick?.(row.original)}
                      >
                        {/* Mobile +/- circular toggle button */}
                        {showMobileExpander && (
                          <td className="w-8 px-2 text-center align-middle md:hidden">
                            <button
                              type="button"
                              onClick={(e) => toggleRowExpansion(row.id, e)}
                              className={cn(
                                "size-4 rounded-full inline-flex items-center justify-center text-white transition-transform active:scale-95 shadow-2xs",
                                isExpanded ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"
                              )}
                              title={isExpanded ? "Collapse details" : "Expand details"}
                            >
                              {isExpanded ? (
                                <Minus className="size-2.5 stroke-[3]" />
                              ) : (
                                <Plus className="size-2.5 stroke-[3]" />
                              )}
                            </button>
                          </td>
                        )}

                        {cells.map((cell, idx) => {
                          const isHiddenOnMobile = showMobileExpander && idx >= mobileVisibleColumns
                          return (
                            <td
                              key={cell.id}
                              className={cn(
                                "py-3.5 px-4 align-middle text-sm font-normal text-foreground",
                                isHiddenOnMobile && "hidden md:table-cell"
                              )}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          )
                        })}
                      </tr>

                      {/* Expanded Mobile Child Row (Accordion Key-Value List) */}
                      {showMobileExpander && isExpanded && hiddenCellsOnMobile.length > 0 && (
                        <tr className="md:hidden border-b border-border bg-muted/15">
                          <td
                            colSpan={mobileVisibleColumns + 1}
                            className="p-3 pl-8 bg-card/60"
                          >
                            <div className="space-y-2 border-l-2 border-primary/40 pl-3">
                              {hiddenCellsOnMobile.map((cell) => {
                                const headerDef = cell.column.columnDef.header
                                const headerTitle =
                                  typeof headerDef === "string"
                                    ? headerDef
                                    : cell.column.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

                                return (
                                  <div
                                    key={cell.id}
                                    className="flex items-start justify-between py-1.5 border-b border-border/40 last:border-0 text-sm gap-3"
                                  >
                                    <span className="font-semibold text-foreground text-sm shrink-0">
                                      {headerTitle}
                                    </span>
                                    <div className="text-right text-foreground text-sm">
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              ) : (
                // Empty state
                <tr>
                  <td
                    colSpan={columns.length + (showMobileExpander ? 1 : 0)}
                    className="h-44 text-center align-middle"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                      <div className="size-10 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-1">
                        <Inbox className="size-5" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">{emptyTitle}</h4>
                      <p className="text-xs text-muted-foreground max-w-sm">{emptyDescription}</p>
                      {emptyAction && <div className="mt-3">{emptyAction}</div>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {showPagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
          showRowSelectionCount={showRowSelectionCount}
          showPageSizeSelector={showPageSizeSelector}
        />
      )}
    </div>
  )
}

/**
 * Helper to easily generate a Select All / Select Row checkbox column
 */
export function createSelectColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

// Re-export subcomponents and types
export { DataTableColumnHeader } from "./column-header"
export { DataTablePagination } from "./pagination"
export { DataTableToolbar } from "./toolbar"
export { DataTableFacetedFilter } from "./faceted-filter"
export { DataTableViewOptions } from "./view-options"
export type {
  AdminDataTableProps,
  BulkAction,
  FacetedFilterConfig,
  FacetedFilterOption,
} from "./types"

// Alias for convenience
export const GlobalDataTable = AdminDataTable
