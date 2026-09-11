"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
  Building2,
  CheckCircle2,
  ChevronDown,
  Circle,
  DoorOpen,
  LayoutGrid,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"

import type { AcademicBuildingRecord, AcademicClassroomRecord } from "@/lib/db"
import {
  createBuildingDirectAction,
  updateBuildingDirectAction,
  toggleBuildingActiveAction,
  deleteBuildingDirectAction,
} from "@/app/admin/academics/actions"
import { AdminActionsDropdown } from "@/components/admin/admin-actions-dropdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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

type Props = {
  data: AcademicBuildingRecord[]
  classrooms: AcademicClassroomRecord[]
}

function AddBuildingDialog() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isActive, setIsActive] = React.useState(true)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")

  const resetForm = () => {
    setName("")
    setDescription("")
    setIsActive(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Building name is required.")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("name", name.trim())
    if (description.trim()) formData.append("description", description.trim())
    formData.append("is_active", isActive ? "true" : "false")

    try {
      await createBuildingDirectAction(formData)
      toast.success(`Building "${name}" created successfully`)
      setOpen(false)
      resetForm()
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Failed to create building")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-2xs gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Building</span>
        </Button>
      </DialogTrigger>

      <DialogContent size="md" className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Building2 className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle>Add New Building</DialogTitle>
              <DialogDescription>
                Register a new academic building or campus facility.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="building_name" className="text-sm font-bold text-foreground">
                Building Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="building_name"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Science Block, Main Academic Building"
                className="h-10 border-input bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="building_desc" className="text-sm font-bold text-foreground">
                Description / Location Note
              </Label>
              <Textarea
                id="building_desc"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe physical location or general usage..."
                rows={3}
                className="border-input bg-background text-sm"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3 pt-3.5">
              <div className="space-y-0.5">
                <Label htmlFor="building_is_active_toggle" className="text-sm font-semibold text-foreground cursor-pointer">
                  Active Status
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow classrooms to be created under this building.
                </p>
              </div>
              <Switch
                id="building_is_active_toggle"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? "Creating..." : "Create Building"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditBuildingDialog({
  building,
  open,
  onOpenChange,
}: {
  building: AcademicBuildingRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isActive, setIsActive] = React.useState(true)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")

  React.useEffect(() => {
    if (building) {
      setName(building.name || "")
      setDescription(building.description || "")
      setIsActive(Boolean(building.is_active))
    }
  }, [building])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!building) return

    if (!name.trim()) {
      toast.error("Building name is required.")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("name", name.trim())
    if (description.trim()) formData.append("description", description.trim())
    formData.append("is_active", isActive ? "true" : "false")

    try {
      await updateBuildingDirectAction(building.id, formData)
      toast.success(`Building "${name}" updated successfully`)
      onOpenChange(false)
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Failed to update building")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Pencil className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle>Edit Building</DialogTitle>
              <DialogDescription>
                Update building name, description, and status.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit_building_name" className="text-sm font-bold text-foreground">
                Building Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="edit_building_name"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Science Block"
                className="h-10 border-input bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_building_desc" className="text-sm font-bold text-foreground">
                Description / Location Note
              </Label>
              <Textarea
                id="edit_building_desc"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe physical location or general usage..."
                rows={3}
                className="border-input bg-background text-sm"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3 pt-3.5">
              <div className="space-y-0.5">
                <Label htmlFor="edit_building_is_active_toggle" className="text-sm font-semibold text-foreground cursor-pointer">
                  Active Status
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow classrooms under this building.
                </p>
              </div>
              <Switch
                id="edit_building_is_active_toggle"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function BuildingsTable({ data, classrooms }: Props) {
  const router = useRouter()
  const [editingBuilding, setEditingBuilding] = React.useState<AcademicBuildingRecord | null>(null)
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

  // Map building ID to classroom count
  const classroomCountMap = React.useMemo(() => {
    const map = new Map<string, number>()
    classrooms.forEach((c) => {
      map.set(c.building_id, (map.get(c.building_id) || 0) + 1)
    })
    return map
  }, [classrooms])

  const columns = React.useMemo<ColumnDef<AcademicBuildingRecord>[]>(
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
        accessorKey: "name",
        header: "Building Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 py-0.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground shrink-0">
              <Building2 className="size-3.5" />
            </div>
            <span className="font-bold text-foreground text-sm">
              {row.original.name}
            </span>
          </div>
        ),
        meta: {
          className: "min-w-[180px] px-3",
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs line-clamp-1">
            {row.original.description || "—"}
          </span>
        ),
        meta: {
          className: "min-w-[200px] px-3",
        },
      },
      {
        id: "classrooms_count",
        header: "Classrooms",
        cell: ({ row }) => {
          const count = classroomCountMap.get(row.original.id) || 0
          return (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <DoorOpen className="size-3.5 text-primary" />
              <span>{count} Room{count !== 1 ? "s" : ""}</span>
            </div>
          )
        },
        meta: {
          className: "w-32 px-3",
        },
      },
      {
        accessorKey: "is_active",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
          const b = row.original
          return (
            <div className="flex justify-center">
              {b.is_active ? (
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
            </div>
          )
        },
        meta: {
          className: "w-28 px-3 text-center",
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right pr-2">Actions</div>,
        cell: ({ row }) => {
          const b = row.original
          return (
            <div className="flex items-center justify-end text-right pr-1">
              <AdminActionsDropdown
                onEdit={() => setEditingBuilding(b)}
                editLabel="Edit Building"
                toggleActive={{
                  isActive: b.is_active,
                  isLoading: toggling === b.id,
                  onToggle: async () => {
                    setToggling(b.id)
                    try {
                      await toggleBuildingActiveAction(b.id, b.is_active)
                      router.refresh()
                      toast.success(
                        `Building ${b.is_active ? "deactivated" : "activated"} successfully`
                      )
                    } catch (err: any) {
                      toast.error(err.message || "Failed to toggle status")
                    } finally {
                      setToggling(null)
                    }
                  },
                }}
                onDelete={() => setPendingDelete(b.id)}
              />
            </div>
          )
        },
        meta: {
          className: "w-24 px-2 text-right",
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [classroomCountMap, toggling, pagination, router]
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
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Filter buildings..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="h-10 pl-9 border-input bg-background text-sm w-full"
          />
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

          <AddBuildingDialog />
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
                  No buildings found.
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
            const building = row.original
            const roomCount = classroomCountMap.get(building.id) || 0
            return (
              <div
                key={building.id}
                className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">{building.name}</p>
                    {building.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {building.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      building.is_active
                        ? "rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 font-semibold text-xs px-2.5 py-0.5 shrink-0"
                        : "rounded-full bg-muted text-muted-foreground border-border font-semibold text-xs px-2.5 py-0.5 shrink-0"
                    }
                  >
                    {building.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <DoorOpen className="size-3.5 text-primary" />
                    <span>{roomCount} Room{roomCount !== 1 ? "s" : ""}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBuilding(building)}
                      className="h-8 px-2.5 text-xs font-semibold gap-1"
                    >
                      <Pencil className="size-3" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPendingDelete(building.id)}
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
            No buildings found.
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="hidden text-sm font-medium text-muted-foreground sm:block">
          Showing <strong className="text-foreground">{table.getFilteredRowModel().rows.length}</strong> building(s)
        </div>

        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6">
          <div className="flex items-center gap-2">
            <Label htmlFor="b-rows-per-page" className="text-sm font-medium text-muted-foreground">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-24 h-9 text-sm border-border" id="b-rows-per-page">
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

      {/* Edit Building Modal */}
      <EditBuildingDialog
        building={editingBuilding}
        open={Boolean(editingBuilding)}
        onOpenChange={(open) => {
          if (!open) setEditingBuilding(null)
        }}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this building?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Will fail if any classrooms are currently located in this building.
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
                    const res = await deleteBuildingDirectAction(pendingDelete)
                    if (res.success) {
                      toast.success("Building deleted successfully")
                      router.refresh()
                    } else {
                      toast.error(res.error || "Failed to delete building")
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
