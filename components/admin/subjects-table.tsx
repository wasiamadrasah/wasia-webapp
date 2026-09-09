"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toggleSubjectActiveAction, deleteSubjectAction } from "@/app/admin/academics/actions"
import {
  type ColumnDef, type ColumnFiltersState, type SortingState, type VisibilityState,
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table"
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ChevronDown, MoreHorizontal, Pencil, Plus, Trash2, Power,
} from "lucide-react"
import Link from "next/link"

import type { SubjectRecord } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/sonner"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Props = { data: SubjectRecord[] }

export function SubjectsTable({ data }: Props) {
  const router = useRouter()
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [toggling, setToggling] = React.useState<string | null>(null)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 15 })

  const columns: ColumnDef<SubjectRecord>[] = [
    { id: "serial", header: "#", cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.index + 1}</span>, enableSorting: false },
    {
      accessorKey: "name",
      header: "Subject Name (English)",
      cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.name}</span>,
    },
    {
      accessorKey: "name_bn",
      header: "Subject Name (Bangla)",
      cell: ({ row }) => <span className="text-muted-foreground font-medium">{row.original.name_bn || "—"}</span>,
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <span className="font-mono text-xs bg-muted/50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-foreground">{row.original.code}</span>,
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) =>
        row.original.is_active ? (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1"><CheckCircle2 className="size-3" />Active</Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground gap-1"><Circle className="size-3" />Inactive</Badge>
        ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const s = row.original
        return (
          <div className="flex items-center justify-end text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="size-4 text-blue-700 dark:text-blue-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/admin/academics/subjects/${s.id}/edit`}>
                    <Pencil className="size-4 mr-2 text-muted-foreground" />Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    setToggling(s.id)
                    try {
                      await toggleSubjectActiveAction(s.id, s.is_active)
                      router.refresh()
                      toast.success(`Subject ${s.is_active ? 'deactivated' : 'activated'} successfully`)
                    } catch (err: any) {
                      toast.error(err.message || "Failed to toggle status")
                    } finally {
                      setToggling(null)
                    }
                  }}
                  disabled={toggling === s.id}
                >
                  <Power className="size-4 mr-2 text-muted-foreground" />
                  {s.is_active ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setPendingDelete(s.id)}>
                  <Trash2 className="size-4 mr-2" />Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data, columns,
    state: { sorting, columnVisibility, columnFilters, pagination },
    onSortingChange: setSorting, onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility, onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter subjects..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
          className="max-w-sm border-blue-200 dark:border-blue-900"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><span>Columns</span><ChevronDown className="size-4 ml-1" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter(c => c.getCanHide()).map(c => (
                <DropdownMenuCheckboxItem key={c.id} checked={c.getIsVisible()} onCheckedChange={v => c.toggleVisibility(!!v)} className="capitalize">
                  {c.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/admin/academics/subjects/new"><Plus className="size-4 mr-1" />Add Subject</Link>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-blue-100 dark:border-blue-950">
        <Table>
          <TableHeader className="bg-blue-50/50 dark:bg-blue-950/20 sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-blue-100 dark:border-blue-950 hover:bg-transparent">
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="text-blue-900/80 dark:text-blue-100/80 font-semibold">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-blue-100 dark:border-blue-950 hover:bg-blue-50/20 dark:hover:bg-blue-950/10">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">No subjects found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-muted-foreground text-sm">{table.getFilteredRowModel().rows.length} subject(s)</p>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="size-8 border-blue-200 text-blue-700 dark:border-blue-900" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsLeft className="size-4" /></Button>
          <Button variant="outline" size="icon" className="size-8 border-blue-200 text-blue-700 dark:border-blue-900" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="size-4" /></Button>
          <Button variant="outline" size="icon" className="size-8 border-blue-200 text-blue-700 dark:border-blue-900" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="size-4" /></Button>
          <Button variant="outline" size="icon" className="size-8 border-blue-200 text-blue-700 dark:border-blue-900" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsRight className="size-4" /></Button>
        </div>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => { if (!open) setPendingDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this subject?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. Will fail if the subject is assigned to any class configuration.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true)
                try {
                  if (pendingDelete) {
                    const res = await deleteSubjectAction(pendingDelete)
                    if (res.success) {
                      toast.success("Subject deleted successfully")
                      router.refresh()
                    } else {
                      toast.error(res.error || "Failed to delete subject")
                    }
                  }
                } catch (err: any) {
                  toast.error(err.message || "An unexpected error occurred")
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
