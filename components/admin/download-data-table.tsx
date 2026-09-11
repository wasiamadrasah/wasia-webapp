"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { deleteDownloadAction } from "@/app/admin/actions"
import { DownloadFormDialog } from "./download-form-dialog"
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
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2Icon,
  CircleIcon,
  LayoutGrid,
  MoreHorizontalIcon,
  Plus,
  SquarePenIcon,
  Tag,
  Trash2Icon,
  Download,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AdminActionsDropdown } from "@/components/admin/admin-actions-dropdown"
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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

export type DownloadTableRow = {
  id: string
  title: string
  description: string | null
  category: string
  file_name: string | null
  file_size: number | null
  author: string | null
  views: number
  status: "published" | "draft"
  publishDate: string
}

type DownloadDataTableProps = {
  data: DownloadTableRow[]
  basePath?: string
  addLabel?: string
  showCategoriesButton?: boolean
  categoriesPath?: string
  categories?: Array<{ name: string; is_active: boolean }>
}

function formatDate(raw: string | null) {
  if (!raw || raw === "-") return "—"
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  return `${day}-${month}-${d.getFullYear()}`
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function DownloadViewer({ download, basePath = "/admin/downloads" }: { download: DownloadTableRow; basePath?: string }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground h-auto w-full min-w-0 max-w-[320px] justify-start px-0 text-left font-medium">
          <span className="block truncate">{download.title}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{download.title}</DrawerTitle>
          <DrawerDescription>Download ID: {download.id}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-3">
            <Label>Title</Label>
            <Input defaultValue={download.title} readOnly />
          </div>
          {download.description ? (
            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <textarea
                readOnly
                defaultValue={download.description}
                rows={4}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label>Category</Label>
              <Input defaultValue={download.category} readOnly className="capitalize" />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Author</Label>
              <Input defaultValue={download.author ?? ""} placeholder="-" readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label>Status</Label>
              <Input defaultValue={download.status} readOnly className="capitalize" />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Publish Date</Label>
              <Input defaultValue={formatDate(download.publishDate)} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label>File Name</Label>
              <Input defaultValue={download.file_name ?? ""} placeholder="-" readOnly />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Views</Label>
              <Input defaultValue={download.views.toString()} readOnly />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button asChild>
            <Link href={`${basePath}/${download.id}/edit`}>Edit</Link>
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const statusIcons = {
  published: CheckCircle2Icon,
  draft: CircleIcon,
}

export function DownloadDataTable({
  data,
  basePath = "/admin/downloads",
  addLabel = "Add Download",
  showCategoriesButton = true,
  categoriesPath = "/admin/downloads/categories",
  categories = [],
}: DownloadDataTableProps) {
  const router = useRouter()
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [editingDownloadId, setEditingDownloadId] = React.useState<string | null>(null)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const editingDownload = React.useMemo(
    () => data.find((d) => d.id === editingDownloadId),
    [editingDownloadId, data]
  )

  const columns: ColumnDef<DownloadTableRow>[] = [
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
        <span className="tabular-nums text-muted-foreground">{row.index + 1}</span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <DownloadViewer download={row.original} basePath={basePath} />,
      enableHiding: false,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5 capitalize">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "file_name",
      header: "File Name",
      cell: ({ row }) => (
        <span className="block max-w-[200px] truncate text-muted-foreground text-sm">
          {row.original.file_name ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.author ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "views",
      header: "Downloads",
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.views.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const Icon = statusIcons[status]
        return (
          <Badge variant="outline" className="text-muted-foreground px-1.5 capitalize">
            {status === "published" ? (
              <Icon className="size-3 fill-green-500 text-green-500 dark:fill-green-400 dark:text-green-400" />
            ) : (
              <span className="size-3 rounded-full bg-gray-400" />
            )}
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "publishDate",
      header: "Publish Date",
      cell: ({ row }) => (
        <span className="tabular-nums">{formatDate(row.original.publishDate)}</span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const download = row.original
        return (
          <div className="flex items-center justify-end">
            <AdminActionsDropdown
              onEdit={() => setEditingDownloadId(download.id)}
              editLabel="Edit Download"
              onDelete={() => setPendingDelete(download.id)}
              deleteLabel="Delete"
            />
          </div>
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <div className="flex items-center gap-2">
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <LayoutGrid className="size-4" />
                <span className="hidden lg:inline">Columns</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            {showCategoriesButton ? (
              <Button asChild variant="outline" size="sm">
                <Link href={categoriesPath}>
                  <Tag className="size-4" />
                  <span className="hidden lg:inline">Categories</span>
                </Link>
              </Button>
            ) : null}
            <DownloadFormDialog
              categories={categories}
              trigger={
                <Button size="sm">
                  <Plus className="size-4" />
                  <span className="hidden lg:inline">{addLabel}</span>
                </Button>
              }
              onSuccess={() => router.refresh()}
            />
          </div>
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
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="size-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="size-4" />
            </Button>

            <div className="hidden items-center gap-1 lg:flex">
              <span className="text-muted-foreground text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
            </div>

            <Button
              variant="outline"
              className="size-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={pendingDelete !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Download</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this download? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!pendingDelete) return
                setIsDeleting(true)
                try {
                  await deleteDownloadAction(pendingDelete)
                } finally {
                  setIsDeleting(false)
                  setPendingDelete(null)
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingDownload && (
        <DownloadFormDialog
          isEdit
          downloadId={editingDownload.id}
          categories={categories}
          open={editingDownloadId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditingDownloadId(null)
            }
          }}
          onSuccess={() => {
            setEditingDownloadId(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
