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
import {
  CheckCircle2Icon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleIcon,
  LayoutGrid,
  MoreHorizontalIcon,
  SendIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react"

import {
  deleteDownloadCategoryAction,
  setDownloadCategoryStatusAction,
} from "@/app/admin/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AdminActionsDropdown } from "@/components/admin/admin-actions-dropdown"
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

export type DownloadCategoryTableRow = {
  id: string
  name: string
  slug: string
  color: "primary" | "info" | "warning" | "danger" | "secondary"
  status: "published" | "archived"
  count: number
  createdAt: string | null
}

function formatDate(raw: string | null) {
  if (!raw) return "-"
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  return `${day}/${month}/${d.getFullYear()}`
}

function colorBadgeClass(color: DownloadCategoryTableRow["color"]) {
  if (color === "danger") return "bg-red-100 text-red-700 border-red-200"
  if (color === "info") return "bg-sky-100 text-sky-700 border-sky-200"
  if (color === "warning") return "bg-amber-100 text-amber-700 border-amber-200"
  if (color === "primary") return "bg-blue-100 text-blue-700 border-blue-200"
  return "bg-muted/50 text-foreground/90 border-border"
}

function CategoryViewer({ category }: { category: DownloadCategoryTableRow }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground h-auto px-0 font-medium capitalize">
          {category.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>View Category</DrawerTitle>
          <DrawerDescription>Category ID: {category.id}</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-3">
            <Label>Name</Label>
            <Input value={category.name} readOnly className="capitalize" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label>Slug</Label>
              <Input value={category.slug} readOnly />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Created</Label>
              <Input value={formatDate(category.createdAt)} readOnly />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label>Linked Downloads</Label>
            <Input value={`${category.count}`} readOnly />
          </div>
        </div>

        <DrawerFooter>
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
  archived: CircleIcon,
}

export function DownloadCategoryDataTable({
  data,
}: {
  data: DownloadCategoryTableRow[]
}) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns: ColumnDef<DownloadCategoryTableRow>[] = [
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <CategoryViewer category={row.original} />,
      enableHiding: false,
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => <span className="text-pink-600">{row.original.slug}</span>,
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
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <Badge variant="outline" className={colorBadgeClass(row.original.color)}>
          {row.original.color}
        </Badge>
      ),
    },
    {
      accessorKey: "count",
      header: "Count",
      cell: ({ row }) => <span className="tabular-nums">{row.original.count}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => <span className="tabular-nums">{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const category = row.original
        if (category.name.toLowerCase() === "general") {
          return <span className="text-muted-foreground text-xs">Default</span>
        }

        return (
          <div className="flex items-center justify-end">
            <AdminActionsDropdown
              toggleActive={{
                isActive: category.status === "published",
                activeLabel: "Archive",
                inactiveLabel: "Publish",
                onToggle: async () => {
                  const formData = new FormData()
                  formData.append("category", category.name)
                  formData.append("status", category.status === "published" ? "archived" : "published")
                  await setDownloadCategoryStatusAction(formData)
                },
              }}
              onDelete={async () => {
                if (confirm(`Permanently delete category "${category.name}"?`)) {
                  const formData = new FormData()
                  formData.append("category", category.name)
                  await deleteDownloadCategoryAction(formData)
                }
              }}
              deleteLabel="Delete"
            />
          </div>
        )
      },
    },
  ]

  // eslint-disable-next-line react-hooks/incompatible-library
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
    </div>
  )
}
