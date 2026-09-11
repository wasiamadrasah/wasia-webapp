"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { deleteNoticeAction, deleteNewsAction } from "@/app/admin/actions"
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
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2Icon,
  CircleIcon,
  LayoutGrid,
  MoreHorizontalIcon,
  PaperclipIcon,
  Plus,
  SquarePenIcon,
  Tag,
  Trash2Icon,
  Eye,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

export type NoticeTableRow = {
  id: string
  title: string
  content: string | null
  category: string
  author: string | null
  views: number
  status: "published" | "draft"
  publishDate: string
  attachmentUrl: string | null
}

type NoticeDataTableProps = {
  data: NoticeTableRow[]
  basePath?: string
  addLabel?: string
  showCategoriesButton?: boolean
  categoriesPath?: string
}

function formatDate(raw: string | null) {
  if (!raw || raw === "-") return "—"
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function NoticeViewer({ notice, basePath = "/admin/notices" }: { notice: NoticeTableRow; basePath?: string }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <button type="button" className="text-left font-bold text-sm text-foreground hover:text-primary transition-colors truncate max-w-xs md:max-w-md block">
          {notice.title}
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-w-xl">
        <DrawerHeader className="border-b border-border bg-muted/40 px-6 py-4">
          <DrawerTitle className="text-lg font-bold text-foreground">{notice.title}</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">Notice ID: {notice.id}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto p-6 text-sm">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-bold text-foreground">Title</Label>
            <Input defaultValue={notice.title} readOnly className="h-10 text-sm border-border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-foreground">Category</Label>
              <Input defaultValue={notice.category} readOnly className="h-10 text-sm border-border capitalize" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-foreground">Author</Label>
              <Input defaultValue={notice.author || "Admin"} placeholder="Admin" readOnly className="h-10 text-sm border-border" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-foreground">Status</Label>
              <Input defaultValue={notice.status} readOnly className="h-10 text-sm border-border capitalize" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-foreground">Publish Date</Label>
              <Input defaultValue={formatDate(notice.publishDate)} readOnly className="h-10 text-sm border-border" />
            </div>
          </div>
          {notice.content ? (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-foreground">Content</Label>
              <textarea
                readOnly
                defaultValue={notice.content}
                rows={6}
                className="w-full rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground focus:outline-none"
              />
            </div>
          ) : null}
          {notice.attachmentUrl ? (
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-bold text-foreground">Attachment</Label>
              <a
                href={notice.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <PaperclipIcon className="h-4 w-4" />
                <span>Open Attachment File</span>
              </a>
            </div>
          ) : null}
        </div>
        <DrawerFooter className="border-t border-border bg-muted/40 px-6 py-3.5 flex flex-row items-center justify-end gap-2.5">
          <Button asChild className="h-10 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Link href={`${basePath}/${notice.id}/edit`}>Edit Notice</Link>
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="h-10 rounded-lg text-sm font-medium border-border">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export function NoticeDataTable({
  data,
  basePath = "/admin/notices",
  addLabel = "Add Notice",
  showCategoriesButton = true,
  categoriesPath = "/admin/notices/categories",
}: NoticeDataTableProps) {
  const router = useRouter()
  const isNewsPage = basePath.includes("/news")
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns: ColumnDef<NoticeTableRow>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "serial",
      header: "#",
      cell: ({ row }) => (
        <span className="tabular-nums font-semibold text-xs text-muted-foreground">{row.index + 1}</span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <NoticeViewer notice={row.original} basePath={basePath} />,
      enableHiding: false,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 font-semibold text-xs px-2.5 py-0.5 capitalize">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {row.original.author || "Admin"}
        </span>
      ),
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => (
        <span className="tabular-nums text-sm font-medium text-foreground">{row.original.views.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return status === "published" ? (
          <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs px-2.5 py-0.5 inline-flex items-center gap-1">
            <CheckCircle2Icon className="h-3 w-3" />
            <span>Published</span>
          </Badge>
        ) : (
          <Badge variant="outline" className="rounded-full bg-muted/50 text-foreground/90 border-border font-semibold text-xs px-2.5 py-0.5 inline-flex items-center gap-1">
            <CircleIcon className="h-3 w-3 fill-slate-400 text-muted-foreground" />
            <span>Draft</span>
          </Badge>
        )
      },
    },
    {
      accessorKey: "publishDate",
      header: "Publish Date",
      cell: ({ row }) => (
        <span className="tabular-nums text-sm font-medium text-foreground whitespace-nowrap">{formatDate(row.original.publishDate)}</span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const notice = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
              <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm">
                <Link href={`${basePath}/${notice.id}/edit`}>
                  <SquarePenIcon className="h-4 w-4 text-primary" />
                  <span>Edit Notice</span>
                </Link>
              </DropdownMenuItem>
              {notice.attachmentUrl ? (
                <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm">
                  <a href={notice.attachmentUrl} target="_blank" rel="noreferrer">
                    <PaperclipIcon className="h-4 w-4 text-primary" />
                    <span>Attachment</span>
                  </a>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setPendingDelete(notice.id)}
                className="cursor-pointer gap-2 text-sm text-rose-600 focus:text-rose-600"
              >
                <Trash2Icon className="h-4 w-4 text-rose-600" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="w-full max-w-full space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Input
          placeholder="Search notices by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm h-10 text-sm border-border"
        />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 text-sm border-border gap-1.5 font-medium">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                <span className="hidden lg:inline">Columns</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-sm"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {showCategoriesButton ? (
            <Button asChild variant="outline" size="sm" className="h-10 text-sm border-border gap-1.5 font-medium">
              <Link href={categoriesPath}>
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="hidden lg:inline">Categories</span>
              </Link>
            </Button>
          ) : null}

          <Button asChild size="sm" className="h-10 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 px-4 rounded-lg">
            <Link href={`${basePath}/new`}>
              <Plus className="h-4 w-4" />
              <span>{addLabel}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-border bg-card shadow-2xs">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40 border-b border-border">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan} className="text-sm font-bold text-foreground whitespace-nowrap">
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/40 border-b border-border transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm font-medium text-muted-foreground">
                  No notice records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View (Seamless Clean Layout) */}
      <div className="block md:hidden space-y-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const notice = row.original
            return (
              <div key={notice.id} className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground leading-snug">{notice.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(notice.publishDate)}</p>
                  </div>
                  <div className="shrink-0">
                    {notice.status === "published" ? (
                      <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs px-2.5 py-0.5">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="rounded-full bg-muted/50 text-foreground/90 border-border font-semibold text-xs px-2.5 py-0.5">
                        Draft
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
                  <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 font-semibold text-xs px-2.5 py-0.5 capitalize">
                    {notice.category}
                  </Badge>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1 text-xs">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{notice.views}</span>
                    </span>
                    {notice.attachmentUrl && (
                      <a href={notice.attachmentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary font-semibold">
                        <PaperclipIcon className="h-3.5 w-3.5" />
                        <span>Attachment</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8 gap-1.5 text-xs font-semibold text-primary border-primary/20 bg-primary/10 hover:bg-primary/20"
                  >
                    <Link href={`${basePath}/${notice.id}/edit`}>
                      <SquarePenIcon className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPendingDelete(notice.id)}
                    className="h-8 gap-1.5 text-xs font-semibold text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100"
                  >
                    <Trash2Icon className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No notice records found.
          </div>
        )}
      </div>

      {/* Responsive Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-sm font-medium text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} notice(s) selected.
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span>Rows per page</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger size="sm" className="w-24 h-9 text-sm border-border">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`} className="text-sm">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              Page <strong className="text-foreground">{table.getState().pagination.pageIndex + 1}</strong> of <strong className="text-foreground">{table.getPageCount() || 1}</strong>
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-9 text-sm font-medium border-border text-foreground hover:bg-muted/40"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-9 text-sm font-medium border-border text-foreground hover:bg-muted/40"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => {
        if (!open) setPendingDelete(null)
      }}>
        <AlertDialogContent className="max-w-md rounded-xl border border-border p-0 overflow-hidden">
          <AlertDialogHeader className="border-b border-border bg-muted/40 px-6 py-4">
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              Delete {isNewsPage ? 'News Post' : 'Notice'}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              This will permanently delete this {isNewsPage ? 'news post' : 'notice'}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-border bg-muted/40 px-6 py-3.5 flex flex-row items-center justify-end gap-2.5">
            <AlertDialogCancel variant="outline" className="h-10 rounded-lg px-4 text-sm font-medium border-border text-foreground hover:bg-card">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true)
                try {
                  if (pendingDelete) {
                    if (isNewsPage) {
                      await deleteNewsAction(pendingDelete)
                    } else {
                      await deleteNoticeAction(pendingDelete)
                    }
                    router.refresh()
                  }
                } finally {
                  setIsDeleting(false)
                  setPendingDelete(null)
                }
              }}
              className="h-10 rounded-lg px-4 text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
