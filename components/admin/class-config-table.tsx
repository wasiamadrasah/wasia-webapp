"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
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
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  DoorOpen,
  LayoutGrid,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
  Users,
} from "lucide-react"

import type { AcademicClassConfigRecord, AcademicSessionRecord } from "@/lib/db"
import {
  toggleClassConfigActiveAction,
  deleteClassConfigAction,
} from "@/app/admin/academics/actions"
import { AdminActionsDropdown } from "@/components/admin/admin-actions-dropdown"
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

interface ClassConfigTableProps {
  data: AcademicClassConfigRecord[]
  sessions: AcademicSessionRecord[]
}

export function ClassConfigTable({ data, sessions }: ClassConfigTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [toggling, setToggling] = React.useState<string | null>(null)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 15,
  })

  const currentSessionFilter = searchParams.get("session") || "all"

  const handleSessionFilterChange = (sessionId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (sessionId && sessionId !== "all") {
      params.set("session", sessionId)
    } else {
      params.delete("session")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const columns = React.useMemo<ColumnDef<AcademicClassConfigRecord>[]>(
    () => [
      {
        id: "serial",
        header: "#",
        cell: ({ row }) => (
          <span className="tabular-nums text-xs font-medium text-muted-foreground">
            {row.index + 1 + pagination.pageIndex * pagination.pageSize}
          </span>
        ),
        meta: {
          className: "w-12 px-3 text-center",
        },
        enableSorting: false,
      },
      {
        accessorFn: (row) =>
          [
            row.class_name,
            row.section_name,
            row.session_name,
            row.version_name,
            row.shift_name,
            row.group_name,
            row.class_teacher_name,
            row.classroom_name,
          ]
            .filter(Boolean)
            .join(" "),
        id: "combination",
        header: "Class & Section",
        cell: ({ row }) => {
          const config = row.original
          return (
            <div className="space-y-1 py-0.5">
              <Link
                href={`/admin/academics/class-setup/${config.id}`}
                className="font-bold text-sm text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
              >
                <span>{config.class_name}</span>
                {config.section_name && (
                  <Badge variant="secondary" className="font-semibold text-xs px-2 py-0">
                    {config.section_name}
                  </Badge>
                )}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                {config.version_name && (
                  <span className="inline-flex items-center gap-1 bg-muted/60 px-1.5 py-0.5 rounded text-[11px] font-medium border border-border/60">
                    {config.version_name}
                  </span>
                )}
                {config.shift_name && (
                  <span className="inline-flex items-center gap-1 bg-muted/60 px-1.5 py-0.5 rounded text-[11px] font-medium border border-border/60">
                    <Clock className="size-2.5" />
                    {config.shift_name}
                  </span>
                )}
                {config.group_name && (
                  <span className="inline-flex items-center gap-1 bg-muted/60 px-1.5 py-0.5 rounded text-[11px] font-medium border border-border/60">
                    {config.group_name}
                  </span>
                )}
              </div>
            </div>
          )
        },
        meta: {
          className: "min-w-[200px] px-3",
        },
      },
      {
        accessorKey: "session_name",
        header: "Academic Session",
        cell: ({ row }) => {
          const name = row.original.session_name
          return (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground py-0.5">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <span>{name || "—"}</span>
            </div>
          )
        },
        meta: {
          className: "w-36 px-3",
        },
      },
      {
        accessorKey: "class_teacher_name",
        header: "Class Teacher",
        cell: ({ row }) => {
          const name = row.original.class_teacher_name
          return name ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground py-0.5">
              <User className="size-3.5 text-primary shrink-0" />
              <span>{name}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic">Unassigned</span>
          )
        },
        meta: {
          className: "w-40 px-3",
        },
      },
      {
        id: "room_capacity",
        header: "Room & Capacity",
        cell: ({ row }) => {
          const config = row.original
          return (
            <div className="flex flex-wrap items-center gap-1.5 text-xs py-0.5">
              {config.classroom_name ? (
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium bg-muted/60 px-2 py-0.5 rounded border border-border/60 text-foreground">
                  <DoorOpen className="size-3 text-muted-foreground" />
                  {config.classroom_name}
                </span>
              ) : null}
              {config.capacity !== null && config.capacity !== undefined ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <Users className="size-3" />
                  {config.capacity} Seats
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground italic">Unlimited</span>
              )}
            </div>
          )
        },
        meta: {
          className: "w-40 px-3",
        },
      },
      {
        accessorKey: "is_active",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
          const config = row.original
          const isActive = config.is_active

          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 hover:bg-muted"
                disabled={toggling === config.id}
                onClick={async () => {
                  setToggling(config.id)
                  try {
                    await toggleClassConfigActiveAction(config.id, isActive)
                    router.refresh()
                    toast.success(
                      `Class "${config.class_name}${config.section_name ? ` - ${config.section_name}` : ""}" ${
                        isActive ? "deactivated" : "activated"
                      } successfully`
                    )
                  } catch (err: any) {
                    toast.error(err.message || "Failed to toggle status")
                  } finally {
                    setToggling(null)
                  }
                }}
              >
                {isActive ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 gap-1 font-semibold text-xs">
                    <CheckCircle2 className="size-3" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground gap-1 font-semibold text-xs">
                    <Circle className="size-3" />
                    Inactive
                  </Badge>
                )}
              </Button>
            </div>
          )
        },
        meta: {
          className: "w-32 px-3 text-center",
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right pr-2">Actions</div>,
        cell: ({ row }) => {
          const config = row.original
          return (
            <div className="flex items-center justify-end gap-1.5 text-right pr-1">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 px-2.5 text-xs font-semibold gap-1.5 text-primary border-primary/30 hover:bg-primary/10"
              >
                <Link href={`/admin/academics/class-setup/${config.id}`}>
                  <BookOpen className="size-3.5" />
                  <span>Setup</span>
                </Link>
              </Button>
              <AdminActionsDropdown
                viewHref={`/admin/academics/class-setup/${config.id}`}
                viewLabel="View Setup"
                editHref={`/admin/academics/class-setup/${config.id}/edit`}
                editLabel="Edit Config"
                onDelete={() => setPendingDelete(config.id)}
              />
            </div>
          )
        },
        meta: {
          className: "w-36 px-2 text-right",
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [toggling, pagination, router]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
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
    <div className="space-y-4">
      {/* Top Filter & Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Filter classes..."
              value={(table.getColumn("combination")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("combination")?.setFilterValue(event.target.value)}
              className="h-10 pl-9 border-input bg-background text-sm w-full"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={currentSessionFilter}
              onValueChange={handleSessionFilterChange}
            >
              <SelectTrigger className="h-10 border-input bg-background w-full text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="All Sessions" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {sessions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} {s.is_active ? "(Active)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 border-border bg-card text-foreground hover:bg-muted/40 text-sm font-medium gap-2"
              >
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                <span>Columns</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-sm cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id.replace("_", " ")}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            asChild
            className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-2xs gap-2"
          >
            <Link href="/admin/academics/class-setup/new">
              <Plus className="h-4 w-4" />
              <span>Add Configuration</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block w-full">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40 border-b border-border">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      "text-sm font-bold text-foreground py-3.5",
                      (header.column.columnDef.meta as { className?: string } | undefined)?.className
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/40 border-b border-border transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-3",
                        (cell.column.columnDef.meta as { className?: string } | undefined)?.className
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm font-medium text-muted-foreground"
                >
                  No class configurations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const config = row.original
            return (
              <div
                key={config.id}
                className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <span>{config.class_name}</span>
                      {config.section_name && (
                        <Badge variant="secondary" className="font-semibold text-xs px-2 py-0">
                          {config.section_name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{config.session_name}</span>
                      {config.version_name && <span>• {config.version_name}</span>}
                      {config.shift_name && <span>• {config.shift_name}</span>}
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={
                      config.is_active
                        ? "rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 font-semibold text-xs px-2.5 py-0.5 shrink-0"
                        : "rounded-full bg-muted text-muted-foreground border-border font-semibold text-xs px-2.5 py-0.5 shrink-0"
                    }
                  >
                    {config.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">Teacher:</span>{" "}
                    {config.class_teacher_name || "Unassigned"}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Room:</span>{" "}
                    {config.classroom_name || "—"}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {config.capacity !== null && config.capacity !== undefined
                        ? `${config.capacity} Seats`
                        : "Unlimited Seats"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8 px-2.5 text-xs font-semibold gap-1 text-primary border-primary/30"
                    >
                      <Link href={`/admin/academics/class-setup/${config.id}`}>
                        <BookOpen className="size-3" />
                        <span>Setup</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8 px-2 text-xs font-semibold"
                    >
                      <Link href={`/admin/academics/class-setup/${config.id}/edit`}>
                        <Pencil className="size-3" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPendingDelete(config.id)}
                      className="h-8 px-2 text-destructive hover:bg-destructive/10 border-destructive/30"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No class configurations found.
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="hidden text-sm font-medium text-muted-foreground sm:block">
          Showing <strong className="text-foreground">{table.getFilteredRowModel().rows.length}</strong> configuration(s)
        </div>

        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6">
          <div className="flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm font-medium text-muted-foreground">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-24 h-9 text-sm border-border" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 15, 20, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`} className="text-sm">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center text-sm font-medium text-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-9 px-3 text-sm font-medium border-border text-foreground hover:bg-muted/40"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-9 px-3 text-sm font-medium border-border text-foreground hover:bg-muted/40"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
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
