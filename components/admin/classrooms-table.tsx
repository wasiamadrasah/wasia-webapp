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
  Layers,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react"

import type { AcademicBuildingRecord, AcademicClassroomRecord } from "@/lib/db"
import {
  createClassroomDirectAction,
  updateClassroomDirectAction,
  toggleClassroomActiveAction,
  deleteClassroomDirectAction,
} from "@/app/admin/academics/actions"
import { AdminActionsDropdown } from "@/components/admin/admin-actions-dropdown"
import { FormSelect } from "@/components/admin/form-select"
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

export const FLOOR_OPTIONS = [
  { value: "0", label: "Ground Floor" },
  { value: "1", label: "1st Floor" },
  { value: "2", label: "2nd Floor" },
  { value: "3", label: "3rd Floor" },
  { value: "4", label: "4th Floor" },
  { value: "5", label: "5th Floor" },
  { value: "6", label: "6th Floor" },
  { value: "7", label: "7th Floor" },
  { value: "8", label: "8th Floor" },
  { value: "9", label: "9th Floor" },
  { value: "10", label: "10th Floor" },
  { value: "11", label: "11th Floor" },
  { value: "12", label: "12th Floor" },
]

export function formatFloorText(floor: number) {
  if (floor === 0) return "Ground Floor"
  const j = floor % 10
  const k = floor % 100
  if (j === 1 && k !== 11) return `${floor}st Floor`
  if (j === 2 && k !== 12) return `${floor}nd Floor`
  if (j === 3 && k !== 13) return `${floor}rd Floor`
  return `${floor}th Floor`
}

type Props = {
  data: AcademicClassroomRecord[]
  buildings: AcademicBuildingRecord[]
}

function AddClassroomDialog({ buildings }: { buildings: AcademicBuildingRecord[] }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isActive, setIsActive] = React.useState(true)

  const activeBuildings = React.useMemo(() => buildings.filter((b) => b.is_active), [buildings])

  const buildingOptions = React.useMemo(
    () =>
      activeBuildings.map((b) => ({
        value: b.id,
        label: b.name,
      })),
    [activeBuildings]
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    formData.set("is_active", isActive ? "true" : "false")

    try {
      await createClassroomDirectAction(formData)
      const roomName = formData.get("name")?.toString() || ""
      toast.success(`Classroom "${roomName}" created successfully`)
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Failed to create classroom")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-2xs gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Classroom</span>
        </Button>
      </DialogTrigger>

      <DialogContent size="md" className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <DoorOpen className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle>Add New Classroom</DialogTitle>
              <DialogDescription>
                Assign a classroom to a building and floor with student capacity.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {activeBuildings.length === 0 ? (
          <div className="p-6 text-sm text-amber-700 bg-amber-50 rounded-xl border border-amber-200">
            No active buildings found. Please create or activate a building first.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 space-y-4">
              {/* Building */}
              <div className="space-y-1.5">
                <Label htmlFor="add_room_building" className="text-sm font-bold text-foreground">
                  Building <span className="text-rose-500">*</span>
                </Label>
                <FormSelect
                  id="add_room_building"
                  name="building_id"
                  placeholder="Select Building"
                  options={buildingOptions}
                  required
                />
              </div>

              {/* Classroom Name */}
              <div className="space-y-1.5">
                <Label htmlFor="add_room_name" className="text-sm font-bold text-foreground">
                  Classroom Name / Room Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="add_room_name"
                  name="name"
                  required
                  placeholder="e.g. Room 101, Computer Lab, Seminar Hall"
                  className="h-10 border-input bg-background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Floor */}
                <div className="space-y-1.5">
                  <Label htmlFor="add_room_floor" className="text-sm font-bold text-foreground">
                    Floor <span className="text-rose-500">*</span>
                  </Label>
                  <FormSelect
                    id="add_room_floor"
                    name="floor"
                    defaultValue="0"
                    placeholder="Select Floor"
                    options={FLOOR_OPTIONS}
                    required
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-1.5">
                  <Label htmlFor="add_room_capacity" className="text-sm font-bold text-foreground">
                    Student Capacity <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="add_room_capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    defaultValue="40"
                    required
                    className="h-10 border-input bg-background"
                  />
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3 pt-3.5">
                <div className="space-y-0.5">
                  <Label htmlFor="add_room_is_active_toggle" className="text-sm font-semibold text-foreground cursor-pointer">
                    Active Status
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow this classroom to be allocated for class configurations.
                  </p>
                </div>
                <Switch
                  id="add_room_is_active_toggle"
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
                {isSubmitting ? "Creating..." : "Create Classroom"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function EditClassroomDialog({
  classroom,
  buildings,
  open,
  onOpenChange,
}: {
  classroom: AcademicClassroomRecord | null
  buildings: AcademicBuildingRecord[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isActive, setIsActive] = React.useState(true)
  const [name, setName] = React.useState("")
  const [capacity, setCapacity] = React.useState("40")

  const buildingOptions = React.useMemo(
    () =>
      buildings
        .filter((b) => b.is_active || b.id === classroom?.building_id)
        .map((b) => ({
          value: b.id,
          label: b.name,
        })),
    [buildings, classroom?.building_id]
  )

  React.useEffect(() => {
    if (classroom) {
      setName(classroom.name || "")
      setCapacity(classroom.capacity?.toString() || "40")
      setIsActive(Boolean(classroom.is_active))
    }
  }, [classroom])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!classroom) return

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    formData.set("is_active", isActive ? "true" : "false")

    try {
      await updateClassroomDirectAction(classroom.id, formData)
      toast.success(`Classroom "${name}" updated successfully`)
      onOpenChange(false)
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Failed to update classroom")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Pencil className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle>Edit Classroom</DialogTitle>
              <DialogDescription>
                Update classroom name, building, floor, or capacity.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {classroom && (
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 space-y-4">
              {/* Building */}
              <div className="space-y-1.5">
                <Label htmlFor="edit_room_building" className="text-sm font-bold text-foreground">
                  Building <span className="text-rose-500">*</span>
                </Label>
                <FormSelect
                  id="edit_room_building"
                  name="building_id"
                  defaultValue={classroom.building_id}
                  placeholder="Select Building"
                  options={buildingOptions}
                  required
                />
              </div>

              {/* Classroom Name */}
              <div className="space-y-1.5">
                <Label htmlFor="edit_room_name" className="text-sm font-bold text-foreground">
                  Classroom Name / Room Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="edit_room_name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Room 101"
                  className="h-10 border-input bg-background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Floor */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit_room_floor" className="text-sm font-bold text-foreground">
                    Floor <span className="text-rose-500">*</span>
                  </Label>
                  <FormSelect
                    id="edit_room_floor"
                    name="floor"
                    defaultValue={classroom.floor?.toString() || "0"}
                    placeholder="Select Floor"
                    options={FLOOR_OPTIONS}
                    required
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit_room_capacity" className="text-sm font-bold text-foreground">
                    Student Capacity <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="edit_room_capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                    className="h-10 border-input bg-background"
                  />
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3 pt-3.5">
                <div className="space-y-0.5">
                  <Label htmlFor="edit_room_is_active_toggle" className="text-sm font-semibold text-foreground cursor-pointer">
                    Active Status
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow this classroom to be allocated for class configurations.
                  </p>
                </div>
                <Switch
                  id="edit_room_is_active_toggle"
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
        )}
      </DialogContent>
    </Dialog>
  )
}

export function ClassroomsTable({ data, buildings }: Props) {
  const router = useRouter()
  const [editingClassroom, setEditingClassroom] = React.useState<AcademicClassroomRecord | null>(null)
  const [pendingDelete, setPendingDelete] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [toggling, setToggling] = React.useState<string | null>(null)
  const [buildingFilter, setBuildingFilter] = React.useState<string>("all")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 15,
  })

  const filteredData = React.useMemo(() => {
    if (buildingFilter === "all") return data
    return data.filter((item) => item.building_id === buildingFilter)
  }, [data, buildingFilter])

  const columns = React.useMemo<ColumnDef<AcademicClassroomRecord>[]>(
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
        header: "Room Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 py-0.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground shrink-0">
              <DoorOpen className="size-3.5" />
            </div>
            <span className="font-bold text-foreground text-sm">
              {row.original.name}
            </span>
          </div>
        ),
        meta: {
          className: "min-w-[160px] px-3",
        },
      },
      {
        accessorKey: "building_name",
        header: "Building",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground py-0.5">
            <Building2 className="size-3.5 text-muted-foreground shrink-0" />
            <span>{row.original.building_name || "—"}</span>
          </div>
        ),
        meta: {
          className: "min-w-[160px] px-3",
        },
      },
      {
        accessorKey: "floor",
        header: "Floor",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Layers className="size-3 text-muted-foreground shrink-0" />
            <span>{formatFloorText(row.original.floor)}</span>
          </div>
        ),
        meta: {
          className: "w-32 px-3",
        },
      },
      {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Users className="size-3 text-primary shrink-0" />
            <span>{row.original.capacity} Seats</span>
          </div>
        ),
        meta: {
          className: "w-28 px-3",
        },
      },
      {
        accessorKey: "is_active",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
          const r = row.original
          return (
            <div className="flex justify-center">
              {r.is_active ? (
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
          const r = row.original
          return (
            <div className="flex items-center justify-end text-right pr-1">
              <AdminActionsDropdown
                onEdit={() => setEditingClassroom(r)}
                editLabel="Edit Classroom"
                toggleActive={{
                  isActive: r.is_active,
                  isLoading: toggling === r.id,
                  onToggle: async () => {
                    setToggling(r.id)
                    try {
                      await toggleClassroomActiveAction(r.id, r.is_active)
                      router.refresh()
                      toast.success(
                        `Classroom ${r.is_active ? "deactivated" : "activated"} successfully`
                      )
                    } catch (err: any) {
                      toast.error(err.message || "Failed to toggle status")
                    } finally {
                      setToggling(null)
                    }
                  },
                }}
                onDelete={() => setPendingDelete(r.id)}
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
    [toggling, pagination, router]
  )

  const table = useReactTable({
    data: filteredData,
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
              placeholder="Filter rooms..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="h-10 pl-9 border-input bg-background text-sm w-full"
            />
          </div>

          <div className="w-full sm:w-48">
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="h-10 border-input bg-background w-full text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="All Buildings" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                {buildings.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
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

          <AddClassroomDialog buildings={buildings} />
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
                  No classrooms found.
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
            const room = row.original
            return (
              <div
                key={room.id}
                className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">{room.name}</p>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{room.building_name || "No building"}</span>
                      <span>• {formatFloorText(room.floor)}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      room.is_active
                        ? "rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 font-semibold text-xs px-2.5 py-0.5 shrink-0"
                        : "rounded-full bg-muted text-muted-foreground border-border font-semibold text-xs px-2.5 py-0.5 shrink-0"
                    }
                  >
                    {room.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Users className="size-3 text-primary" />
                    <span>{room.capacity} Seats</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingClassroom(room)}
                      className="h-8 px-2.5 text-xs font-semibold gap-1"
                    >
                      <Pencil className="size-3" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPendingDelete(room.id)}
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
            No classrooms found.
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="hidden text-sm font-medium text-muted-foreground sm:block">
          Showing <strong className="text-foreground">{table.getFilteredRowModel().rows.length}</strong> classroom(s)
        </div>

        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6">
          <div className="flex items-center gap-2">
            <Label htmlFor="c-rows-per-page" className="text-sm font-medium text-muted-foreground">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-24 h-9 text-sm border-border" id="c-rows-per-page">
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

      {/* Edit Classroom Modal */}
      <EditClassroomDialog
        classroom={editingClassroom}
        buildings={buildings}
        open={Boolean(editingClassroom)}
        onOpenChange={(open) => {
          if (!open) setEditingClassroom(null)
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
            <AlertDialogTitle>Delete this classroom?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This classroom will be removed from any assigned class combinations.
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
                    const res = await deleteClassroomDirectAction(pendingDelete)
                    if (res.success) {
                      toast.success("Classroom deleted successfully")
                      router.refresh()
                    } else {
                      toast.error(res.error || "Failed to delete classroom")
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
