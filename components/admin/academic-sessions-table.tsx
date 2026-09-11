"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  toggleSessionActiveAction,
  deleteSessionAction,
} from "@/app/admin/academics/actions"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
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

import type { AcademicSessionRecord } from "@/lib/db"
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  data: AcademicSessionRecord[]
}

function formatDate(d: string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

export function AcademicSessionsTable({ data }: Props) {
  const router = useRouter()
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [toggling, setToggling] = React.useState<string | null>(null)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const columns: ColumnDef<AcademicSessionRecord>[] = [
    {
      id: "serial",
      header: "#",
      cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.index + 1}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Session Name",
      cell: ({ row }) => (
        <span className="font-semibold text-base">{row.original.name}</span>
      ),
    },
    {
      id: "dates",
      header: "Duration",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(row.original.start_date)} — {formatDate(row.original.end_date)}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const active = row.original.is_active
        return active ? (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
            <CheckCircle2 className="size-3" />
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground gap-1">
            <Circle className="size-3" />
            Inactive
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const session = row.original
        return (
          <div className="flex items-center justify-end text-right">
            <AdminActionsDropdown
              editHref={`/admin/academics/sessions/${session.id}/edit`}
              editLabel="Edit Session"
              toggleActive={{
                isActive: session.is_active,
                isLoading: toggling === session.id,
                onToggle: async () => {
                  setToggling(session.id)
                  try {
                    await toggleSessionActiveAction(session.id, session.is_active)
                    router.refresh()
                  } finally {
                    setToggling(null)
                  }
                },
              }}
              onDelete={() => setPendingDelete(session.id)}
            />
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
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
          placeholder="Filter sessions..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <Button asChild size="sm">
          <Link href="/admin/academics/sessions/new">
            <Plus className="size-4 mr-1" /> Add Session
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
                  No sessions found. Create your first academic session.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <p className="text-muted-foreground text-sm">
          {table.getFilteredRowModel().rows.length} session(s)
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="rows-sessions" className="text-sm">Rows</Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <SelectTrigger id="rows-sessions" className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((s) => <SelectItem key={s} value={`${s}`}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
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
            <AlertDialogTitle>Delete this session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the session. This cannot be undone. The operation will fail if any class configurations reference this session.
            </AlertDialogDescription>
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
                    await deleteSessionAction(pendingDelete)
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
