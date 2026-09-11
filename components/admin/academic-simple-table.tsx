"use client"

/**
 * AcademicSimpleTable
 * Reusable table for Versions, Shifts, Sections, and Groups — all share the same shape:
 * { id, name, is_active } plus optional extra columns passed via `extraColumns`.
 */

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AdminActionsDropdown } from "@/components/admin/admin-actions-dropdown"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type SimpleRow = {
  id: string
  name: string
  is_active: boolean
  [key: string]: unknown
}

export type ExtraColumnSpec = {
  header: string
  key: string
  renderType?: "text" | "mono" | "badge" | "capacity"
}

type Props<T extends SimpleRow> = {
  data: T[]
  basePath: string          // e.g. "/admin/academics/versions"
  addLabel: string          // e.g. "Add Version"
  filterPlaceholder?: string
  extraColumns?: ExtraColumnSpec[]
  toggleAction: (id: string, currentlyActive: boolean) => Promise<void>
  deleteAction: (id: string) => Promise<void>
  deleteWarning?: string
}

export function AcademicSimpleTable<T extends SimpleRow>({
  data,
  basePath,
  addLabel,
  filterPlaceholder = "Filter...",
  extraColumns = [],
  toggleAction,
  deleteAction,
  deleteWarning = "This will permanently delete this record. This action cannot be undone.",
}: Props<T>) {
  const router = useRouter()
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [toggling, setToggling] = React.useState<string | null>(null)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const columns: ColumnDef<T>[] = [
    {
      id: "serial",
      header: "#",
      cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.index + 1}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    ...extraColumns.map((col) => ({
      id: col.header.toLowerCase().replace(/\s+/g, "_"),
      header: col.header,
      cell: ({ row }: { row: { original: T } }) => {
        const val = row.original[col.key]
        if (val === null || val === undefined || val === "") return <span className="text-muted-foreground">—</span>
        
        switch (col.renderType) {
          case "mono":
            return <span className="font-mono text-sm font-medium text-foreground">{String(val)}</span>
          case "badge":
            return (
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs font-semibold text-foreground border">
                {String(val)}
              </span>
            )
          case "capacity":
            return <span className="font-mono text-sm text-foreground">{String(val)} Students</span>
          default:
            return <span className="text-sm text-foreground">{String(val)}</span>
        }
      },
    })),
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) =>
        row.original.is_active ? (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
            <CheckCircle2 className="size-3" /> Active
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground gap-1">
            <Circle className="size-3" /> Inactive
          </Badge>
        ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center justify-end text-right">
            <AdminActionsDropdown
              editHref={`${basePath}/${item.id}/edit`}
              toggleActive={{
                isActive: item.is_active,
                isLoading: toggling === item.id,
                onToggle: async () => {
                  setToggling(item.id)
                  try {
                    await toggleAction(item.id, item.is_active)
                    router.refresh()
                  } finally {
                    setToggling(null)
                  }
                },
              }}
              onDelete={() => setPendingDelete(item.id)}
            />
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder={filterPlaceholder}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <Button asChild size="sm">
          <Link href={`${basePath}/new`}>
            <Plus className="size-4 mr-1" /> {addLabel}
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-muted-foreground text-sm">{table.getFilteredRowModel().rows.length} record(s)</p>
        <div className="flex items-center gap-2">
          <span className="text-sm">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="size-8" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsLeft className="size-4" /></Button>
            <Button variant="outline" size="icon" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="size-4" /></Button>
            <Button variant="outline" size="icon" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="size-4" /></Button>
            <Button variant="outline" size="icon" className="size-8" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsRight className="size-4" /></Button>
          </div>
        </div>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => { if (!open) setPendingDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>{deleteWarning}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true)
                try {
                  if (pendingDelete) {
                    await deleteAction(pendingDelete)
                    router.refresh()
                  }
                } finally {
                  setIsDeleting(false)
                  setPendingDelete(null)
                }
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
