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
  Filter,
  Copy,
  Check,
  KeyRound,
} from "lucide-react"

import {
  createEmployeeAction,
  deleteEmployeeByFormAction,
  resetEmployeePasswordAction,
  setEmployeeLoginAccessAction,
  setEmployeeStatusAction,
} from "@/app/admin/actions"
import { AdminActionsDropdown } from "@/components/admin/admin-actions-dropdown"
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
import { cn } from "@/lib/utils"

export type EmployeeTableRow = {
  id: string
  name: string
  nameBn?: string | null
  profilePhoto: string | null
  employeeId: string | null
  designation: string | null
  phone: string | null
  email?: string | null
  category: "teacher" | "staff"
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

function CopyableIdBadge({ employeeId }: { employeeId: string | null }) {
  const [copied, setCopied] = React.useState(false)

  if (!employeeId) return null

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigator.clipboard.writeText(employeeId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy Employee ID"
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-mono font-medium border border-border/80 transition-colors cursor-pointer group"
    >
      <span>ID: {employeeId}</span>
      {copied ? (
        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground/70 group-hover:text-foreground shrink-0" />
      )}
    </button>
  )
}

function EmployeeStatusToggle({ employeeId, checked }: { employeeId: string; checked: boolean }) {
  const formRef = React.useRef<HTMLFormElement>(null)

  return (
    <form ref={formRef} action={setEmployeeStatusAction} className="inline-flex items-center">
      <input type="hidden" name="employee_id" value={employeeId} />
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
        aria-label="Toggle employee status"
      />
    </form>
  )
}

function EmployeeLoginToggle({
  employeeId,
  checked,
  disabled = false,
}: {
  employeeId: string
  checked: boolean
  disabled?: boolean
}) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const isChecked = disabled ? false : checked

  return (
    <form ref={formRef} action={setEmployeeLoginAccessAction} className="inline-flex items-center">
      <input type="hidden" name="employee_id" value={employeeId} />
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
        aria-label="Toggle employee login access"
      />
    </form>
  )
}



function AddEmployeeDialog() {
  const [open, setOpen] = React.useState(false)
  const [category, setCategory] = React.useState<"teacher" | "staff">("teacher")
  const formRef = React.useRef<HTMLFormElement>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-2xs gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Employee</span>
        </Button>
      </DialogTrigger>

      <DialogContent size="md" className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <UserRound className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Create an employee account for teaching or administrative personnel.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form ref={formRef} action={createEmployeeAction}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="employee_category" className="text-sm font-bold text-foreground">
                Employee Category <span className="text-rose-500">*</span>
              </Label>
              <Select
                name="type"
                value={category}
                onValueChange={(val: "teacher" | "staff") => setCategory(val)}
              >
                <SelectTrigger id="employee_category" className="h-10 border-input bg-background w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teaching Personnel</SelectItem>
                  <SelectItem value="staff">Administrative Personnel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="employee_full_name_en" className="text-sm font-bold text-foreground">
                Full Name (English) <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="employee_full_name_en"
                name="full_name_en"
                required
                placeholder="Enter employee full name"
                className="h-10 border-input bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="employee_full_name_bn" className="text-sm font-bold text-foreground">
                Full Name (Bangla)
              </Label>
              <Input
                id="employee_full_name_bn"
                name="full_name_bn"
                placeholder="বাংলায় নাম লিখুন"
                className="h-10 border-input bg-background font-bensen"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="employee_designation" className="text-sm font-bold text-foreground">
                Designation <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="employee_designation"
                name="designation"
                required
                placeholder={category === "teacher" ? "e.g. Assistant Teacher" : "e.g. Accountant"}
                className="h-10 border-input bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="employee_phone" className="text-sm font-bold text-foreground">
                Phone Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="employee_phone"
                name="contact_number"
                required
                placeholder="018XXXXXXXX"
                className="h-10 border-input bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="employee_email" className="text-sm font-bold text-foreground">
                Email Address
              </Label>
              <Input
                id="employee_email"
                type="email"
                name="email"
                placeholder="employee@example.com"
                className="h-10 border-input bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="employee_password" className="text-sm font-bold text-foreground">
                Temporary Password
              </Label>
              <Input
                id="employee_password"
                type="password"
                name="password"
                defaultValue="Wasia@2026"
                placeholder="Enter login password"
                className="h-10 border-input bg-background font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Default initial password is Wasia@2026.
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="font-semibold">
              Save Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function EmployeeDataTable({ data }: { data: EmployeeTableRow[] }) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [categoryFilter, setCategoryFilter] = React.useState<"all" | "teacher" | "staff">("all")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Filter data based on category filter
  const filteredData = React.useMemo(() => {
    if (categoryFilter === "all") return data
    return data.filter((item) => item.category === categoryFilter)
  }, [data, categoryFilter])

  const counts = React.useMemo(() => {
    const total = data.length
    const teachers = data.filter((d) => d.category === "teacher").length
    const staff = data.filter((d) => d.category === "staff").length
    return { total, teachers, staff }
  }, [data])

  const columns: ColumnDef<EmployeeTableRow>[] = [
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
      meta: {
        className: "w-10 px-2 text-center",
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "photo",
      header: () => <span className="block text-center">Photo</span>,
      cell: ({ row }) => {
        const photo = row.original.profilePhoto
        const name = row.original.name
        return (
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-xs font-bold uppercase text-indigo-700 dark:text-indigo-300 shrink-0">
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
          </div>
        )
      },
      meta: {
        className: "w-12 px-2 text-center",
      },
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const designation = (row.original.designation || "").toLowerCase().trim()
        const isHeadmaster = designation === "headmaster" || designation === "head master" || designation.includes("principal") || designation.includes("অধ্যক্ষ")
        return (
          <div className="space-y-1 py-0.5">
            <span className="font-bold text-sm text-foreground inline-flex items-center gap-1.5">
              {row.original.name}
              {isHeadmaster && <Crown className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />}
            </span>
            <div>
              <CopyableIdBadge employeeId={row.original.employeeId} />
            </div>
          </div>
        )
      },
      meta: {
        className: "min-w-[180px] px-3",
      },
      enableHiding: false,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const isTeacher = row.original.category === "teacher"
        return (
          <Badge
            variant="outline"
            className={
              isTeacher
                ? "rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 font-semibold text-xs px-2.5 py-0.5"
                : "rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 font-semibold text-xs px-2.5 py-0.5"
            }
          >
            {isTeacher ? "Teaching" : "Administrative"}
          </Badge>
        )
      },
      meta: {
        className: "w-36 px-3",
      },
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground">{row.original.designation || "-"}</span>
      ),
      meta: {
        className: "w-44 px-3",
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground font-mono">{row.original.phone || "-"}</span>
      ),
      meta: {
        className: "w-36 px-3",
      },
    },
    {
      id: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <EmployeeStatusToggle
            employeeId={row.original.id}
            checked={row.original.status === "active"}
          />
        </div>
      ),
      meta: {
        className: "w-20 px-2 text-center",
      },
      enableSorting: false,
    },
    {
      id: "login",
      header: () => <div className="text-center">Login</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <EmployeeLoginToggle
            employeeId={row.original.id}
            checked={row.original.canLogin}
            disabled={row.original.status === "inactive"}
          />
        </div>
      ),
      meta: {
        className: "w-20 px-2 text-center",
      },
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        const employee = row.original

        return (
          <div className="flex items-center justify-end">
            <AdminActionsDropdown
              viewHref={`/admin/employees/${employee.id}`}
              viewLabel="View Profile"
              editHref={`/admin/employees/${employee.id}/edit`}
              editLabel="Edit Details"
              customActions={[
                {
                  key: "reset-password",
                  label: "Reset Password",
                  icon: <KeyRound className="size-4 text-amber-600" />,
                  onClick: () => {
                    const form = document.getElementById(`reset-pw-${employee.id}`) as HTMLFormElement | null
                    form?.requestSubmit()
                  },
                },
              ]}
              deleteDialog={{
                title: "Delete employee record?",
                description: `Are you sure you want to delete ${employee.name}? This will permanently remove the employee profile and linked credentials.`,
                confirmLabel: "Delete Record",
                onConfirm: async () => {
                  const form = document.getElementById(`del-emp-${employee.id}`) as HTMLFormElement | null
                  form?.requestSubmit()
                },
              }}
            />

            {/* Hidden Forms for Actions */}
            <form id={`reset-pw-${employee.id}`} action={resetEmployeePasswordAction} className="hidden">
              <input type="hidden" name="employee_id" value={employee.id} />
            </form>
            <form id={`del-emp-${employee.id}`} action={deleteEmployeeByFormAction} className="hidden">
              <input type="hidden" name="employee_id" value={employee.id} />
            </form>
          </div>
        )
      },
      meta: {
        className: "w-16 px-3 text-right",
      },
    },
  ]

  const table = useReactTable({
    data: filteredData,
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
      {/* Header Toolbar matching DigiCampus style */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto flex-1 max-w-2xl">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees by name..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="h-10 pl-9 border-input bg-background text-sm w-full"
            />
          </div>

          {/* Category Filter Selector */}
          <div className="w-full sm:w-60">
            <Select
              value={categoryFilter}
              onValueChange={(val: "all" | "teacher" | "staff") => setCategoryFilter(val)}
            >
              <SelectTrigger className="h-10 border-input bg-background text-sm w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Category Filter" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Personnel ({counts.total})</SelectItem>
                <SelectItem value="teacher">Teaching Personnel ({counts.teachers})</SelectItem>
                <SelectItem value="staff">Administrative Personnel ({counts.staff})</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

          <AddEmployeeDialog />
        </div>
      </div>

      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block w-full">
        <Table className="w-full min-w-[850px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40 border-b border-border">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      "text-sm font-bold text-foreground",
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/40 border-b border-border transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-3 whitespace-nowrap",
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
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm font-medium text-muted-foreground">
                  No employees found in this category.
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
            const employee = row.original
            const isTeacher = employee.category === "teacher"
            const designation = (employee.designation || "").toLowerCase().trim()
            const isHeadmaster = designation === "headmaster" || designation === "head master" || designation.includes("principal") || designation.includes("অধ্যক্ষ")

            return (
              <div key={employee.id} className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-xs font-bold uppercase text-indigo-700 dark:text-indigo-300">
                      {employee.profilePhoto ? (
                        <img
                          src={employee.profilePhoto}
                          alt={employee.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        employee.name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-bold text-foreground truncate flex items-center gap-1.5">
                        {employee.name}
                        {isHeadmaster && <Crown className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                      </p>
                      <CopyableIdBadge employeeId={employee.employeeId} />
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      isTeacher
                        ? "rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 font-semibold text-xs px-2.5 py-0.5 shrink-0"
                        : "rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 font-semibold text-xs px-2.5 py-0.5 shrink-0"
                    }
                  >
                    {isTeacher ? "Teaching" : "Admin"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                  {employee.phone && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  {employee.registeredOn && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{formatDate(employee.registeredOn)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Status:</span>
                      <EmployeeStatusToggle employeeId={employee.id} checked={employee.status === "active"} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">Login:</span>
                      <EmployeeLoginToggle employeeId={employee.id} checked={employee.canLogin} disabled={employee.status === "inactive"} />
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60"
                  >
                    <Link href={`/admin/employees/${employee.id}`}>
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
            No employees found in this category.
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
