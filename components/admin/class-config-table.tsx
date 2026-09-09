"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  toggleClassConfigActiveAction,
  deleteClassConfigAction,
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
  Eye,
  SlidersHorizontal,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

import type { AcademicClassConfigRecord, AcademicSessionRecord } from "@/lib/db"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ClassConfigTableProps {
  data: AcademicClassConfigRecord[]
  sessions: AcademicSessionRecord[]
}

export function ClassConfigTable({ data, sessions }: ClassConfigTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const currentSessionFilter = searchParams.get("session") || ""

  const handleSessionFilterChange = (sessionId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (sessionId) {
      params.set("session", sessionId)
    } else {
      params.delete("session")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const columns = React.useMemo<ColumnDef<AcademicClassConfigRecord>[]>(
    () => [
      {
        accessorFn: (row) =>
          [
            row.session_name,
            row.version_name,
            row.shift_name,
            row.class_name,
            row.section_name,
          ]
            .filter(Boolean)
            .join(" › "),
        id: "combination",
        header: "Class Combination",
        cell: ({ row }) => {
          const config = row.original
          return (
            <div className="flex flex-col">
              <Link href={`/admin/academics/class-setup/${config.id}`} className="font-semibold text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                {config.class_name}
                {config.section_name && ` - ${config.section_name}`}
              </Link>
              <span className="text-xs text-muted-foreground mt-0.5">
                {config.session_name}
                {config.version_name && ` • ${config.version_name}`}
                {config.shift_name && ` • ${config.shift_name}`}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "class_teacher_name",
        header: "Class Teacher",
        cell: ({ row }) => {
          const val = row.getValue("class_teacher_name") as string | null
          return val ? (
            <span className="font-medium text-foreground">{val}</span>
          ) : (
            <span className="text-muted-foreground italic">Unassigned</span>
          )
        },
      },
      {
        accessorKey: "classroom_name",
        header: "Classroom",
        cell: ({ row }) => {
          const val = row.original.classroom_name
          return val ? (
            <span className="font-mono text-sm text-foreground bg-muted/50 border rounded px-1.5 py-0.5">{val}</span>
          ) : (
            <span className="text-muted-foreground italic">Unassigned</span>
          )
        },
      },
      {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => {
          const val = row.getValue("capacity") as number | null
          return val !== null ? (
            <span className="font-mono">{val} Students</span>
          ) : (
            <span className="text-muted-foreground italic">Unlimited</span>
          )
        },
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.getValue("is_active") as boolean
          const configId = row.original.id

          return (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 hover:bg-muted"
              onClick={async () => {
                try {
                  await toggleClassConfigActiveAction(configId, isActive)
                  router.refresh()
                } catch (err) {
                  console.error(err)
                }
              }}
            >
              {isActive ? (
                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                  <CheckCircle2 className="mr-1 size-3" /> Active
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Circle className="mr-1 size-3" /> Inactive
                </Badge>
              )}
            </Button>
          )
        },
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const config = row.original

          return (
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" asChild className="h-8 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/30">
                <Link href={`/admin/academics/class-setup/${config.id}`}>
                  <BookOpen className="mr-1.5 size-4" /> Setup
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/academics/class-setup/${config.id}`} className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" /> View Setup
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/academics/class-setup/${config.id}/edit`} className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4" /> Edit Config
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    onClick={() => setPendingDelete(config.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [router]
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Input
            placeholder="Filter classes..."
            value={(table.getColumn("combination")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("combination")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />

          <select
            value={currentSessionFilter}
            onChange={(e) => handleSessionFilterChange(e.target.value)}
            className="h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">All Sessions</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name} {session.is_active ? "(Active)" : ""}
              </option>
            ))}
          </select>
        </div>

        <Button asChild className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700">
          <Link href="/admin/academics/class-setup/new">
            <Plus className="mr-2 size-4" /> Add Configuration
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No class configurations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows?.length ?? 0} of {data.length} configurations
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Page</p>
            <strong className="text-sm">
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </strong>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete class configuration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this class combination. This cannot be undone. All assigned subjects and teacher mappings under this config will also be removed.
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
                    await deleteClassConfigAction(pendingDelete)
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
