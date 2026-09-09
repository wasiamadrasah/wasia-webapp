"use client"

import * as React from "react"
import Link from "next/link"
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
  Crown,
  LayoutGrid,
  MoreHorizontalIcon,
  Plus,
  ShieldCheck,
  Trash2Icon,
  UserRound,
  Search,
  Phone,
  Calendar,
  User,
} from "lucide-react"

import {
  createTeacherAction,
  deleteTeacherByFormAction,
  resetTeacherPasswordAction,
  setTeacherLoginAccessAction,
  setTeacherStatusAction,
} from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldGroup } from "@/components/ui/field"
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
import { Switch } from "@/components/ui/switch"

export type TeacherTableRow = {
  id: string
  name: string
  profilePhoto: string | null
  employeeId: string | null
  designation: string | null
  phone: string | null
  registeredOn: string | null
  status: "active" | "inactive"
  canLogin: boolean
}

function formatDate(raw: string | null) {
  if (!raw) return "-"
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  return `${day}/${month}/${d.getFullYear()}`
}

function TeacherStatusToggle({ teacherId, checked }: { teacherId: string; checked: boolean }) {
  const formRef = React.useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={setTeacherStatusAction} className="inline-flex items-center">
      <input type="hidden" name="teacher_id" value={teacherId} />
      <input type="hidden" name="status" value={checked ? "active" : "inactive"} />
      <Switch
        checked={checked}
        onCheckedChange={(value) => {
          const statusInput = formRef.current?.elements.namedItem("status") as HTMLInputElement | null
          if (statusInput) {
            statusInput.value = value ? "active" : "inactive"
          }
          formRef.current?.requestSubmit()
        }}
        aria-label="Toggle teacher status"
      />
    </form>
  )
}

function TeacherLoginToggle({
  teacherId,
  checked,
  disabled = false,
}: {
  teacherId: string
  checked: boolean
  disabled?: boolean
}) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const isChecked = disabled ? false : checked

  return (
    <form ref={formRef} action={setTeacherLoginAccessAction} className="inline-flex items-center">
      <input type="hidden" name="teacher_id" value={teacherId} />
      <input type="hidden" name="can_login" value={isChecked ? "true" : "false"} />
      <Switch
        checked={isChecked}
        disabled={disabled}
        onCheckedChange={(value) => {
          const canLoginInput = formRef.current?.elements.namedItem("can_login") as HTMLInputElement | null
          if (canLoginInput) {
            canLoginInput.value = value ? "true" : "false"
          }
          formRef.current?.requestSubmit()
        }}
        aria-label="Toggle teacher login access"
      />
    </form>
  )
}

function ResetTeacherPasswordAction({ teacherId }: { teacherId: string }) {
  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  return (
    <>
      <form ref={formRef} action={resetTeacherPasswordAction}>
        <input type="hidden" name="teacher_id" value={teacherId} />
      </form>

      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault()
          setOpen(true)
        }}
        className="cursor-pointer gap-2 text-sm"
      >
        <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span>Reset Password</span>
      </DropdownMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <ShieldCheck />
            </AlertDialogMedia>
            <AlertDialogTitle>Reset teacher password?</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a new 6-character password (a-z, 0-9), reset the current password, and email it to the teacher.
              The teacher will be advised to change it immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                formRef.current?.requestSubmit()
              }}
            >
              Confirm Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function DeleteTeacherAction({
  teacherId,
  teacherName,
}: {
  teacherId: string
  teacherName: string
}) {
  const [open, setOpen] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  return (
    <>
      <form ref={formRef} action={deleteTeacherByFormAction}>
        <input type="hidden" name="teacher_id" value={teacherId} />
      </form>

      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault()
          setOpen(true)
        }}
        className="cursor-pointer gap-2 text-sm text-rose-600 focus:text-rose-600"
      >
        <Trash2Icon className="h-4 w-4 text-rose-600" />
        <span>Delete</span>
      </DropdownMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete teacher?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {teacherName} and related profile records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                formRef.current?.requestSubmit()
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function AddTeacherDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-10 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-2xs gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Teacher</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={createTeacherAction} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Teacher</DialogTitle>
            <DialogDescription>
              Fill in the teacher information and set an initial login password.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 px-6 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="teacher_full_name_en" className="text-sm font-bold text-foreground">
                Name (EN) <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="teacher_full_name_en"
                name="full_name_en"
                required
                placeholder="Enter teacher full name"
                className="h-10 border-input bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="teacher_phone" className="text-sm font-bold text-foreground">
                Phone Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="teacher_phone"
                name="contact_number"
                required
                placeholder="Enter phone number"
                className="h-10 border-input bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="teacher_email" className="text-sm font-bold text-foreground">
                Email Address <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="teacher_email"
                type="email"
                name="email"
                required
                placeholder="teacher@example.com"
                className="h-10 border-input bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="teacher_password" className="text-sm font-bold text-foreground">
                Password <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="teacher_password"
                type="password"
                name="password"
                required
                placeholder="Enter login password"
                className="h-10 border-input bg-background"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-9 px-4 text-sm font-medium border-border">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function TeacherDataTable({ data }: { data: TeacherTableRow[] }) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns: ColumnDef<TeacherTableRow>[] = [
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
      id: "photo",
      header: "Photo",
      cell: ({ row }) => {
        const photo = row.original.profilePhoto
        const name = row.original.name
        return (
          <div className="h-9 w-9 rounded-full overflow-hidden bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-xs font-bold uppercase text-indigo-700 dark:text-indigo-300 shrink-0">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              name.charAt(0)
            )}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const designation = (row.original.designation || "").toLowerCase().trim()
        const isHeadmaster = designation === "headmaster" || designation === "head master"
        return (
          <span className="font-bold text-sm text-foreground inline-flex items-center gap-1.5">
            {row.original.name}
            {isHeadmaster && <Crown className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />}
          </span>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "employeeId",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground font-mono">{row.original.employeeId || "-"}</span>
      ),
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground">{row.original.designation || "-"}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.phone || "-"}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <TeacherStatusToggle
          teacherId={row.original.id}
          checked={row.original.status === "active"}
        />
      ),
      enableSorting: false,
    },
    {
      id: "login",
      header: "Login",
      cell: ({ row }) => (
        <TeacherLoginToggle
          teacherId={row.original.id}
          checked={row.original.canLogin}
          disabled={row.original.status === "inactive"}
        />
      ),
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        const teacher = row.original

        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
                <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm">
                    <Link href={`/admin/teachers/${teacher.id}`}>
                      <UserRound className="h-4 w-4 text-primary" />
                      <span>View Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <ResetTeacherPasswordAction teacherId={teacher.id} />
                  <DeleteTeacherAction teacherId={teacher.id} teacherName={teacher.name} />
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
    <div className="w-full max-w-full space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="h-10 pl-9 border-input bg-background text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 border-border bg-card text-foreground hover:bg-muted/40 text-sm font-medium gap-2">
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
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <AddTeacherDialog />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-x-auto rounded-lg border border-border bg-card shadow-2xs">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40 border-b border-border">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan} className="text-sm font-bold text-foreground">
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
                  No teachers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View (Clean Single Outer Border) */}
      <div className="block md:hidden space-y-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const teacher = row.original
            const designation = (teacher.designation || "").toLowerCase().trim()
            const isHeadmaster = designation === "headmaster" || designation === "head master"

            return (
              <div key={teacher.id} className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-xs font-bold uppercase text-indigo-700 dark:text-indigo-300">
                      {teacher.profilePhoto ? (
                        <img
                          src={teacher.profilePhoto}
                          alt={teacher.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        teacher.name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate flex items-center gap-1.5">
                        {teacher.name}
                        {isHeadmaster && <Crown className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{teacher.designation || "Faculty Member"}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60 font-semibold text-xs px-2.5 py-0.5 shrink-0">
                    {teacher.employeeId || "Teacher"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                  {teacher.phone && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{teacher.phone}</span>
                    </div>
                  )}
                  {teacher.registeredOn && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{formatDate(teacher.registeredOn)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Status:</span>
                      <TeacherStatusToggle teacherId={teacher.id} checked={teacher.status === "active"} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Login:</span>
                      <TeacherLoginToggle teacherId={teacher.id} checked={teacher.canLogin} disabled={teacher.status === "inactive"} />
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60"
                  >
                    <Link href={`/admin/teachers/${teacher.id}`}>
                      <User className="h-3.5 w-3.5" />
                      <span>Profile</span>
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No teachers found.
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="hidden text-sm font-medium text-muted-foreground sm:block">
          Showing <strong className="text-foreground">{table.getFilteredSelectedRowModel().rows.length}</strong> of{" "}
          <strong className="text-foreground">{table.getFilteredRowModel().rows.length}</strong> selected
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
                {[10, 20, 30, 40, 50].map((pageSize) => (
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
              <ChevronLeft className="h-4 w-4 mr-1" />
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
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
