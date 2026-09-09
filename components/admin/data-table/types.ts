import * as React from "react"
import { type ColumnDef, type Table as TanstackTable } from "@tanstack/react-table"

export interface FacetedFilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}

export interface FacetedFilterConfig {
  column: string
  title: string
  options: FacetedFilterOption[]
  isMulti?: boolean
}

export interface BulkAction<TData> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
  onClick: (selectedRows: TData[], table: TanstackTable<TData>) => void | Promise<void>
}

export interface AdminDataTableProps<TData, TValue = unknown> {
  /** Column definitions for the table */
  columns: ColumnDef<TData, TValue>[]
  /** Array of data items to display */
  data: TData[]
  /** Search filter configuration */
  searchKey?: string
  searchPlaceholder?: string
  /** Faceted dropdown filters (e.g., filter by Status, Category, Role) */
  facetedFilters?: FacetedFilterConfig[]
  /** Additional custom actions on the right side of the toolbar (e.g. "Add New", "Import") */
  toolbarActions?: React.ReactNode
  /** Enable built-in CSV export button */
  enableExport?: boolean
  exportFilename?: string
  /** Bulk actions when rows are selected */
  bulkActions?: BulkAction<TData>[]
  /** Visibility & Toggle controls */
  showColumnToggle?: boolean
  showPagination?: boolean
  showRowSelectionCount?: boolean
  showPageSizeSelector?: boolean
  /** Loading state indicator */
  isLoading?: boolean
  loadingRowCount?: number
  /** Empty state customization */
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: React.ReactNode
  /** Row identification and events */
  getRowId?: (row: TData) => string
  onRowClick?: (row: TData) => void
  /** Pagination settings */
  pageSizeOptions?: number[]
  defaultPageSize?: number
  /** Server-side pagination overrides (optional) */
  manualPagination?: boolean
  pageCount?: number
  pageIndex?: number
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  /** Responsive mobile expandable child row options */
  enableResponsiveRows?: boolean
  mobileVisibleColumns?: number
  /** Class name customization */
  className?: string
  tableClassName?: string
}
