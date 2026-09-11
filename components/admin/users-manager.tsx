"use client"

import * as React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ShieldPlus,
  GraduationCap,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Mail,
  Phone,
  UserCheck,
  RefreshCw,
  ExternalLink,
  Loader2,
  Check,
  Sparkles,
  Info,
  Lock,
} from "lucide-react"

import {
  AdminDataTable,
  DataTableColumnHeader,
  createSelectColumn,
  type FacetedFilterConfig,
} from "@/components/admin/data-table"
import { AdminActionsDropdown } from "@/components/admin/admin-actions-dropdown"
import { PageHeader } from "@/components/digicampus/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { toast } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

import {
  type StaffUser,
  type StudentUser,
  type UsersDataResult,
  getAllUsers,
  toggleUserStatus,
  resetUserPassword,
  promoteTeacherToAdmin,
  demoteTeacherFromAdmin,
} from "@/app/admin/users/actions"

interface UsersManagerProps {
  initialData: UsersDataResult
}

export function UsersManager({ initialData }: UsersManagerProps) {
  const [data, setData] = React.useState<UsersDataResult>(initialData)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"staff" | "students">("staff")

  // Modals state
  const [viewingUser, setViewingUser] = React.useState<{
    user: StaffUser | StudentUser
    type: "staff" | "student"
  } | null>(null)

  const [passwordModalUser, setPasswordModalUser] = React.useState<{
    id: string
    name: string
    email?: string | null
    type: "admin" | "staff" | "student"
  } | null>(null)

  // Promotion / Demotion state
  const [promoteTeacher, setPromoteTeacher] = React.useState<StaffUser | null>(null)
  const [tempPromotePassword, setTempPromotePassword] = React.useState("")
  const [showPromotePassword, setShowPromotePassword] = React.useState(false)
  const [isSubmittingPromotion, setIsSubmittingPromotion] = React.useState(false)

  const [demoteTeacher, setDemoteTeacher] = React.useState<StaffUser | null>(null)
  const [isSubmittingDemotion, setIsSubmittingDemotion] = React.useState(false)

  const [newPassword, setNewPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmittingPassword, setIsSubmittingPassword] = React.useState(false)
  const [togglingUserId, setTogglingUserId] = React.useState<string | null>(null)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  // Copy helper
  const handleCopy = (text: string, label: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!text || text === "—") return
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success(`${label} copied to clipboard`)
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev))
    }, 2000)
  }

  // Reload data from server
  const refreshUsers = React.useCallback(async () => {
    setIsRefreshing(true)
    try {
      const res = await getAllUsers()
      if (res.success && res.data) {
        setData(res.data)
      } else {
        toast.error(res.error || "Failed to reload users.")
      }
    } catch {
      toast.error("An unexpected error occurred while reloading users.")
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  // Toggle user active/inactive status
  const handleToggleStatus = async (
    userId: string,
    userType: "admin" | "staff" | "student",
    currentStatus: "active" | "inactive" | "suspended"
  ) => {
    setTogglingUserId(userId)
    try {
      const res = await toggleUserStatus(userId, userType, currentStatus)
      if (res.success) {
        toast.success(`User status updated to ${res.newStatus}.`)
        await refreshUsers()
      } else {
        toast.error(res.error || "Failed to update status.")
      }
    } catch {
      toast.error("Failed to update status.")
    } finally {
      setTogglingUserId(null)
    }
  }

  // Handle password reset submission
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordModalUser) return

    if (!newPassword || newPassword.trim().length < 6) {
      toast.error("Password must be at least 6 characters long.")
      return
    }

    setIsSubmittingPassword(true)
    try {
      const res = await resetUserPassword(
        passwordModalUser.id,
        passwordModalUser.type,
        newPassword.trim()
      )
      if (res.success) {
        toast.success(`Password for ${passwordModalUser.name} updated successfully!`)
        setPasswordModalUser(null)
        setNewPassword("")
      } else {
        toast.error(res.error || "Failed to reset password.")
      }
    } catch {
      toast.error("Error resetting password.")
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  // Handle Promote Teacher to Admin
  const handleOpenPromote = (user: StaffUser) => {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789"
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    let random = ""
    for (let i = 0; i < 3; i++) {
      random += chars.charAt(Math.floor(Math.random() * chars.length))
      random += upper.charAt(Math.floor(Math.random() * upper.length))
    }
    setTempPromotePassword(`Wasia@${random}`)
    setPromoteTeacher(user)
  }

  const handlePromoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoteTeacher?.staffId) return

    if (!tempPromotePassword || tempPromotePassword.trim().length < 6) {
      toast.error("Admin temporary password must be at least 6 characters.")
      return
    }

    setIsSubmittingPromotion(true)
    try {
      const res = await promoteTeacherToAdmin(
        promoteTeacher.staffId,
        tempPromotePassword.trim()
      )
      if (res.success) {
        toast.success(
          `Teacher ${promoteTeacher.name} promoted to Admin! ${
            res.emailSent
              ? "Official email with credentials dispatched."
              : "Please share credentials manually."
          }`
        )
        setPromoteTeacher(null)
        await refreshUsers()
      } else {
        toast.error(res.error || "Failed to promote teacher.")
      }
    } catch {
      toast.error("An unexpected error occurred during promotion.")
    } finally {
      setIsSubmittingPromotion(false)
    }
  }

  // Handle Demote Admin to Teacher only
  const handleDemoteSubmit = async () => {
    if (!demoteTeacher?.staffId) return

    setIsSubmittingDemotion(true)
    try {
      const res = await demoteTeacherFromAdmin(demoteTeacher.staffId)
      if (res.success) {
        toast.success(`Administrator privileges revoked for ${demoteTeacher.name}.`)
        setDemoteTeacher(null)
        await refreshUsers()
      } else {
        toast.error(res.error || "Failed to demote teacher.")
      }
    } catch {
      toast.error("An unexpected error occurred.")
    } finally {
      setIsSubmittingDemotion(false)
    }
  }

  // Helper for role color badge
  const renderRoleBadge = (role: string, roleLabel: string, isAlsoAdmin?: boolean) => {
    const r = role.toLowerCase()
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {r === "superadmin" || r === "admin" ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="size-3" />
            {roleLabel}
          </span>
        ) : r === "teacher" ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <UserCheck className="size-3" />
            {roleLabel}
          </span>
        ) : r === "accountant" || r === "librarian" ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20">
            {roleLabel}
          </span>
        ) : r === "student" ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <GraduationCap className="size-3" />
            {roleLabel}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
            {roleLabel}
          </span>
        )}

        {/* Dual Role Admin Badge for Teachers / Staff */}
        {isAlsoAdmin && r !== "superadmin" && r !== "super_admin" && r !== "admin" && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
            <ShieldCheck className="size-2.5" />
            + Admin
          </span>
        )}
      </div>
    )
  }

  // Helper for status badge (clean badge without dot)
  const renderStatusBadge = (status: "active" | "inactive" | "suspended") => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 capitalize">
          Active
        </span>
      )
    }
    if (status === "suspended") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 capitalize">
          Suspended
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/20 capitalize">
        Inactive
      </span>
    )
  }

  // ==========================================
  // STAFF USERS TABLE COLUMNS DEFINITION
  // ==========================================
  const staffColumns = React.useMemo<ColumnDef<StaffUser>[]>(
    () => [
      createSelectColumn<StaffUser>(),
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => {
          const user = row.original
          const initials = user.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()
            : "U"

          const idLabel = user.employeeId
            ? user.employeeId
            : user.type === "admin"
            ? "ADMIN"
            : user.id.slice(0, 8).toUpperCase()

          return (
            <div className="flex items-center gap-3 min-w-[190px]">
              <Avatar className="size-9 rounded-full border border-border shrink-0 bg-muted/60">
                {user.photo ? (
                  <AvatarImage src={user.photo} alt={user.name} className="object-cover" />
                ) : null}
                <AvatarFallback className="text-xs font-semibold text-primary/80">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-1">
                <span className="font-semibold text-sm text-foreground leading-tight">
                  {user.name}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                  ID: {idLabel}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Contact" />
        ),
        cell: ({ row }) => {
          const user = row.original
          const mailKey = `staff-mail-${user.id}`
          const phoneKey = `staff-phone-${user.id}`

          return (
            <div className="flex items-center gap-1.5">
              {user.email ? (
                <button
                  type="button"
                  onClick={(e) => handleCopy(user.email, "Email", mailKey, e)}
                  className="size-8 rounded-full border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 flex items-center justify-center text-muted-foreground transition-all shadow-2xs active:scale-95"
                  title={`Copy email: ${user.email}`}
                >
                  {copiedKey === mailKey ? (
                    <Check className="size-4 text-emerald-600 animate-in zoom-in-50" />
                  ) : (
                    <Mail className="size-4" />
                  )}
                </button>
              ) : null}
              {user.phone ? (
                <button
                  type="button"
                  onClick={(e) => handleCopy(user.phone!, "Phone", phoneKey, e)}
                  className="size-8 rounded-full border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 flex items-center justify-center text-muted-foreground transition-all shadow-2xs active:scale-95"
                  title={`Copy phone: ${user.phone}`}
                >
                  {copiedKey === phoneKey ? (
                    <Check className="size-4 text-emerald-600 animate-in zoom-in-50" />
                  ) : (
                    <Phone className="size-4" />
                  )}
                </button>
              ) : null}
              {!user.email && !user.phone && (
                <span className="text-muted-foreground text-xs">—</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
          const user = row.original
          return renderRoleBadge(user.role, user.roleLabel, user.isAlsoAdmin)
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "designation",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Designation" />
        ),
        cell: ({ row }) => {
          const user = row.original
          return (
            <span className="text-sm font-medium text-foreground">
              {user.designation || "—"}
            </span>
          )
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const user = row.original
          return renderStatusBadge(user.status)
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        id: "actions",
        header: () => (
          <span className="text-sm font-semibold text-foreground tracking-wide block text-right pr-2">
            Action
          </span>
        ),
        cell: ({ row }) => {
          const user = row.original
          const isToggling = togglingUserId === user.id
          const isTeacher = user.role.toLowerCase() === "teacher" || user.staffId

          // Build custom actions
          const customActions = []

          // 1. Promote to Admin (for teachers who are not yet admin)
          if (isTeacher && !user.isAlsoAdmin && user.staffId) {
            customActions.push({
              key: "promote-admin",
              label: "Promote to Admin",
              icon: <ShieldPlus className="size-4 text-indigo-600" />,
              onClick: () => handleOpenPromote(user),
            })
          }

          // 2. Demote from Admin (for teachers who currently have dual admin role)
          if (isTeacher && user.isAlsoAdmin && user.staffId) {
            customActions.push({
              key: "demote-admin",
              label: "Demote from Admin",
              icon: <ShieldX className="size-4 text-rose-600" />,
              onClick: () => setDemoteTeacher(user),
            })
          }

          const isSuperAdmin =
            user.role.toLowerCase() === "superadmin" ||
            user.role.toLowerCase() === "super_admin" ||
            user.roleLabel?.toLowerCase() === "super admin"

          // 3. Reset Password (NOT available for Super Admin)
          if (!isSuperAdmin) {
            customActions.push({
              key: "reset-pw",
              label: "Reset Password",
              icon: <KeyRound className="size-4 text-amber-600" />,
              onClick: () =>
                setPasswordModalUser({
                  id: user.adminRecordId || user.id,
                  name: user.name,
                  email: user.email,
                  type: user.isAlsoAdmin ? "admin" : user.type,
                }),
            })
          }

          return (
            <div className="flex items-center justify-end">
              <AdminActionsDropdown
                onView={() => setViewingUser({ user, type: "staff" })}
                viewLabel="View Details"
                customActions={customActions}
                toggleActive={
                  user.type !== "admin" && user.role !== "superadmin"
                    ? {
                        isActive: user.status === "active",
                        isLoading: isToggling,
                        activeLabel: "Deactivate Account",
                        inactiveLabel: "Activate Account",
                        onToggle: () =>
                          handleToggleStatus(user.id, user.type, user.status),
                      }
                    : undefined
                }
              />
            </div>
          )
        },
      },
    ],
    [togglingUserId, copiedKey]
  )

  // ==========================================
  // STUDENT USERS TABLE COLUMNS DEFINITION
  // ==========================================
  const studentColumns = React.useMemo<ColumnDef<StudentUser>[]>(
    () => [
      createSelectColumn<StudentUser>(),
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => {
          const student = row.original
          const initials = student.name
            ? student.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()
            : "ST"

          return (
            <div className="flex items-center gap-3 min-w-[190px]">
              <Avatar className="size-9 rounded-full border border-border shrink-0 bg-muted/60">
                {student.photo ? (
                  <AvatarImage
                    src={student.photo}
                    alt={student.name}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-1">
                <span className="font-semibold text-sm text-foreground leading-tight">
                  {student.name}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                  ID: {student.studentUid}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        id: "academic",
        header: () => <span className="font-semibold text-sm">Class & Roll</span>,
        cell: ({ row }) => {
          const student = row.original
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {student.className
                  ? `${student.className} ${student.sectionName ? `(${student.sectionName})` : ""}`
                  : "Not Enrolled"}
              </span>
              <span className="text-xs text-muted-foreground">
                {student.rollNo ? `Roll: #${student.rollNo}` : "Roll: —"}
                {student.sessionName ? ` • ${student.sessionName}` : ""}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Contact" />
        ),
        cell: ({ row }) => {
          const student = row.original
          const mailKey = `stud-mail-${student.id}`
          const phoneKey = `stud-phone-${student.id}`

          return (
            <div className="flex items-center gap-1.5">
              {student.email ? (
                <button
                  type="button"
                  onClick={(e) => handleCopy(student.email!, "Email", mailKey, e)}
                  className="size-8 rounded-full border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 flex items-center justify-center text-muted-foreground transition-all shadow-2xs active:scale-95"
                  title={`Copy email: ${student.email}`}
                >
                  {copiedKey === mailKey ? (
                    <Check className="size-4 text-emerald-600 animate-in zoom-in-50" />
                  ) : (
                    <Mail className="size-4" />
                  )}
                </button>
              ) : null}
              {student.phone ? (
                <button
                  type="button"
                  onClick={(e) => handleCopy(student.phone!, "Mobile", phoneKey, e)}
                  className="size-8 rounded-full border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 flex items-center justify-center text-muted-foreground transition-all shadow-2xs active:scale-95"
                  title={`Copy mobile: ${student.phone}`}
                >
                  {copiedKey === phoneKey ? (
                    <Check className="size-4 text-emerald-600 animate-in zoom-in-50" />
                  ) : (
                    <Phone className="size-4" />
                  )}
                </button>
              ) : null}
              {!student.email && !student.phone && (
                <span className="text-muted-foreground text-xs">—</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "gender",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Gender" />
        ),
        cell: ({ row }) => {
          const gender = row.original.gender || "—"
          return (
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-foreground">
              {gender}
            </span>
          )
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const student = row.original
          return renderStatusBadge(student.status)
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        id: "actions",
        header: () => (
          <span className="text-sm font-semibold text-foreground tracking-wide block text-right pr-2">
            Action
          </span>
        ),
        cell: ({ row }) => {
          const student = row.original
          const isToggling = togglingUserId === student.id

          return (
            <div className="flex items-center justify-end">
              <AdminActionsDropdown
                onView={() => setViewingUser({ user: student, type: "student" })}
                viewLabel="View Details"
                customActions={[
                  {
                    key: "reset-student-pw",
                    label: "Reset Password",
                    icon: <KeyRound className="size-4 text-amber-600" />,
                    onClick: () =>
                      setPasswordModalUser({
                        id: student.id,
                        name: student.name,
                        email: student.email || `UID: ${student.studentUid}`,
                        type: "student",
                      }),
                  },
                  {
                    key: "view-academic",
                    label: "Academic Directory",
                    icon: <ExternalLink className="size-4 text-primary" />,
                    href: `/admin/students?search=${student.studentUid}`,
                  },
                ]}
                toggleActive={{
                  isActive: student.status === "active",
                  isLoading: isToggling,
                  activeLabel: "Deactivate Student",
                  inactiveLabel: "Activate Student",
                  onToggle: () =>
                    handleToggleStatus(student.id, "student", student.status),
                }}
              />
            </div>
          )
        },
      },
    ],
    [togglingUserId, copiedKey]
  )

  // ==========================================
  // FACETED FILTERS CONFIGURATION
  // ==========================================
  const staffFacetedFilters: FacetedFilterConfig[] = React.useMemo(
    () => [
      {
        column: "role",
        title: "Role",
        options: [
          ...(data.isSuperAdmin ? [{ label: "Super Admin", value: "superadmin" }] : []),
          { label: "Admin", value: "admin" },
          { label: "Teacher", value: "teacher" },
          { label: "Accountant", value: "accountant" },
          { label: "Librarian", value: "librarian" },
          { label: "Receptionist", value: "receptionist" },
          { label: "Staff", value: "staff" },
          { label: "Driver", value: "driver" },
        ],
      },
      {
        column: "status",
        title: "Status",
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
          { label: "Suspended", value: "suspended" },
        ],
      },
    ],
    [data.isSuperAdmin]
  )

  const studentFacetedFilters: FacetedFilterConfig[] = React.useMemo(
    () => [
      {
        column: "status",
        title: "Status",
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
          { label: "Suspended", value: "suspended" },
        ],
      },
    ],
    []
  )

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="User Management"
        description="View, search, and manage all registered system accounts across all administrative, academic, and student roles."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshUsers}
              disabled={isRefreshing}
              className="h-9 gap-1.5"
            >
              <RefreshCw className={cn("size-3.5", isRefreshing && "animate-spin")} />
              <span>Refresh</span>
            </Button>
            <Button size="sm" asChild className="h-9 gap-1.5">
              <Link href="/admin/settings/roles-permissions">
                <ShieldCheck className="size-3.5" />
                <span>Roles & Permissions</span>
              </Link>
            </Button>
          </div>
        }
      />

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card/80 backdrop-blur-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total System Users
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {data.stats.totalUsers}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {data.stats.totalActive} active accounts
              </p>
            </div>
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80 backdrop-blur-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Staff & Admins
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {data.stats.totalStaff}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {data.stats.totalAdmins} admins • {data.stats.totalTeachers} teachers
              </p>
            </div>
            <div className="size-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80 backdrop-blur-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Student Accounts
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {data.stats.totalStudents}
              </p>
              <p className="text-[11px] text-muted-foreground">Enrolled students</p>
            </div>
            <div className="size-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <GraduationCap className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80 backdrop-blur-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Users
              </p>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {data.stats.totalActive}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {data.stats.totalUsers > 0
                  ? `${Math.round((data.stats.totalActive / data.stats.totalUsers) * 100)}% active rate`
                  : "0% active rate"}
              </p>
            </div>
            <div className="size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Section: Staff & Students */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "staff" | "students")}
        className="w-full space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 pb-3.5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab("staff")}
              className={cn(
                "h-10 px-4 rounded-lg inline-flex items-center gap-2.5 text-sm font-semibold transition-all cursor-pointer border shadow-2xs select-none",
                activeTab === "staff"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card text-muted-foreground border-border/80 hover:bg-muted/50 hover:text-foreground hover:border-border"
              )}
            >
              <ShieldCheck className="size-4 shrink-0" />
              <span>Staff & Administration</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-bold tabular-nums transition-colors",
                  activeTab === "staff"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {data.staffUsers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("students")}
              className={cn(
                "h-10 px-4 rounded-lg inline-flex items-center gap-2.5 text-sm font-semibold transition-all cursor-pointer border shadow-2xs select-none",
                activeTab === "students"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card text-muted-foreground border-border/80 hover:bg-muted/50 hover:text-foreground hover:border-border"
              )}
            >
              <GraduationCap className="size-4 shrink-0" />
              <span>Students</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-bold tabular-nums transition-colors",
                  activeTab === "students"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {data.studentUsers.length}
              </span>
            </button>
          </div>

          <div className="text-xs font-medium text-muted-foreground">
            {activeTab === "staff"
              ? `Showing ${data.staffUsers.length} staff & administrator accounts`
              : `Showing ${data.studentUsers.length} registered student profiles`}
          </div>
        </div>

        {/* Tab 1: Staff Users Table */}
        <TabsContent value="staff" className="space-y-4 focus-visible:outline-none">
          <AdminDataTable
            columns={staffColumns}
            data={data.staffUsers}
            searchPlaceholder="Search staff by name, email, employee ID..."
            facetedFilters={staffFacetedFilters}
            enableExport={true}
            exportFilename="staff_users_digicampus.csv"
            emptyTitle="No staff users found"
            emptyDescription="There are no staff or administrator records matching your filters."
          />
        </TabsContent>

        {/* Tab 2: Students Table */}
        <TabsContent value="students" className="space-y-4 focus-visible:outline-none">
          <AdminDataTable
            columns={studentColumns}
            data={data.studentUsers}
            searchPlaceholder="Search students by name, UID, mobile..."
            facetedFilters={studentFacetedFilters}
            enableExport={true}
            exportFilename="student_users_digicampus.csv"
            emptyTitle="No student users found"
            emptyDescription="There are no student accounts or profiles matching your filters."
            emptyAction={
              <Button size="sm" asChild variant="outline">
                <Link href="/admin/students">Go to Student Directory</Link>
              </Button>
            }
          />
        </TabsContent>
      </Tabs>

      {/* PROMOTE TEACHER TO ADMIN MODAL */}
      <Dialog
        open={Boolean(promoteTeacher)}
        onOpenChange={(open) => {
          if (!open) setPromoteTeacher(null)
        }}
      >
        <DialogContent size="md" className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 shrink-0">
                <ShieldPlus className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <DialogTitle>Promote Teacher to Administrator</DialogTitle>
                <DialogDescription>
                  Assign dual-role administrator privileges to{" "}
                  <strong className="text-foreground">{promoteTeacher?.name}</strong>.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {promoteTeacher && (
            <form onSubmit={handlePromoteSubmit}>
              <div className="px-6 py-5 space-y-4">
                <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-1.5 text-xs text-indigo-900 dark:text-indigo-300">
                  <div className="flex items-center gap-2 font-semibold">
                    <Sparkles className="size-4 text-indigo-600 shrink-0" />
                    <span>Dual Role Privilege</span>
                  </div>
                  <p className="leading-relaxed">
                    The teacher will maintain their academic classroom access while receiving full
                    administrative portal access. An email with login credentials and security
                    guidelines will be dispatched to <strong>{promoteTeacher.email}</strong>.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="promote-temp-pw">Temporary Admin Password</Label>
                    <button
                      type="button"
                      onClick={() => {
                        const chars = "abcdefghjkmnpqrstuvwxyz23456789"
                        const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
                        let random = ""
                        for (let i = 0; i < 3; i++) {
                          random += chars.charAt(Math.floor(Math.random() * chars.length))
                          random += upper.charAt(Math.floor(Math.random() * upper.length))
                        }
                        setTempPromotePassword(`Wasia@${random}`)
                      }}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      <RefreshCw className="size-3" />
                      Regenerate
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      id="promote-temp-pw"
                      type={showPromotePassword ? "text" : "password"}
                      value={tempPromotePassword}
                      onChange={(e) => setTempPromotePassword(e.target.value)}
                      className="pr-10 font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPromotePassword(!showPromotePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPromotePassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    The email will instruct the teacher to sign in and immediately reset this temporary password.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPromoteTeacher(null)}
                  disabled={isSubmittingPromotion}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingPromotion || !tempPromotePassword.trim()}
                  className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isSubmittingPromotion ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Promoting & Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <ShieldPlus className="size-3.5" />
                      <span>Confirm & Send Email</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DEMOTE ADMIN TO TEACHER CONFIRMATION DIALOG */}
      <AlertDialog
        open={Boolean(demoteTeacher)}
        onOpenChange={(open) => {
          if (!open) setDemoteTeacher(null)
        }}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-rose-500/10 text-rose-600">
              <ShieldAlert className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Revoke Administrator Privileges?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to demote <strong>{demoteTeacher?.name}</strong>? Their administrative
              login account will be deleted, and they will only have regular Teacher portal access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmittingDemotion}>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDemoteSubmit}
              disabled={isSubmittingDemotion}
              className="gap-1.5"
            >
              {isSubmittingDemotion ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Revoking Privileges...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="size-3.5" />
                  <span>Revoke Admin Access</span>
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* VIEW USER DETAILS MODAL */}
      <Dialog
        open={Boolean(viewingUser)}
        onOpenChange={(open) => {
          if (!open) setViewingUser(null)
        }}
      >
        <DialogContent size="lg" className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <UserCheck className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <DialogTitle>User Profile Details</DialogTitle>
                <DialogDescription>
                  Comprehensive account and organizational metadata.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {viewingUser && (
            <div className="px-6 py-5 space-y-5">
              {/* Header profile banner */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                <Avatar className="size-16 rounded-full border-2 border-primary/20 bg-background shadow-xs">
                  {viewingUser.user.photo ? (
                    <AvatarImage
                      src={viewingUser.user.photo}
                      alt={viewingUser.user.name}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="text-base font-bold text-primary">
                    {viewingUser.user.name
                      ? viewingUser.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground leading-tight">
                    {viewingUser.user.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {viewingUser.type === "staff" ? (
                      renderRoleBadge(
                        (viewingUser.user as StaffUser).role,
                        (viewingUser.user as StaffUser).roleLabel,
                        (viewingUser.user as StaffUser).isAlsoAdmin
                      )
                    ) : (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-700">
                        Student
                      </Badge>
                    )}
                    {renderStatusBadge(viewingUser.user.status)}
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-xs text-muted-foreground block mb-0.5">
                    Email Address
                  </span>
                  <span className="font-medium text-foreground text-xs break-all">
                    {viewingUser.user.email || "—"}
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-xs text-muted-foreground block mb-0.5">
                    Phone / Mobile
                  </span>
                  <span className="font-medium text-foreground text-xs font-mono">
                    {viewingUser.user.phone || "—"}
                  </span>
                </div>

                {viewingUser.type === "staff" ? (
                  <>
                    <div className="p-3 rounded-lg border border-border bg-card">
                      <span className="text-xs text-muted-foreground block mb-0.5">
                        Employee ID
                      </span>
                      <span className="font-medium text-foreground text-xs font-mono">
                        {(viewingUser.user as StaffUser).employeeId || "—"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-card">
                      <span className="text-xs text-muted-foreground block mb-0.5">
                        Designation
                      </span>
                      <span className="font-medium text-foreground text-xs">
                        {(viewingUser.user as StaffUser).designation || "—"}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-lg border border-border bg-card">
                      <span className="text-xs text-muted-foreground block mb-0.5">
                        Student UID
                      </span>
                      <span className="font-bold text-primary text-xs font-mono">
                        {(viewingUser.user as StudentUser).studentUid}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-card">
                      <span className="text-xs text-muted-foreground block mb-0.5">
                        Academic Enrollment
                      </span>
                      <span className="font-medium text-foreground text-xs">
                        {(viewingUser.user as StudentUser).className || "—"} • Roll: #
                        {(viewingUser.user as StudentUser).rollNo || "—"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            {viewingUser &&
              !viewingUser.user.role?.toLowerCase().includes("super") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 mr-auto"
                  onClick={() => {
                    const u = viewingUser.user
                    const t = viewingUser.type
                    setViewingUser(null)
                    setPasswordModalUser({
                      id: (u as StaffUser).adminRecordId || u.id,
                      name: u.name,
                      email: u.email,
                      type: (u as StaffUser).isAlsoAdmin ? "admin" : t === "staff" ? (u as StaffUser).type : "student",
                    })
                  }}
                >
                  <KeyRound className="size-3.5 text-amber-600" />
                  <span>Reset Password</span>
                </Button>
              )}
            <Button
              variant="default"
              size="sm"
              onClick={() => setViewingUser(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RESET PASSWORD MODAL */}
      <Dialog
        open={Boolean(passwordModalUser)}
        onOpenChange={(open) => {
          if (!open) {
            setPasswordModalUser(null)
            setNewPassword("")
          }
        }}
      >
        <DialogContent size="md" className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 shrink-0">
                <KeyRound className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <DialogTitle>Reset User Password</DialogTitle>
                <DialogDescription>
                  Set a new secure password for{" "}
                  <strong className="text-foreground">{passwordModalUser?.name}</strong>.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleResetPasswordSubmit}>
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="reset-new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter at least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Minimum 6 characters. The user will be able to log in immediately with
                  this new password.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPasswordModalUser(null)
                  setNewPassword("")
                }}
                disabled={isSubmittingPassword}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingPassword || !newPassword.trim()}
                className="gap-1.5"
              >
                {isSubmittingPassword ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="size-3.5" />
                    <span>Update Password</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
