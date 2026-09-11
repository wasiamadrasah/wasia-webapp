"use client"

import * as React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { PageHeader } from "@/components/digicampus/page-header"
import {
  AdminDataTable,
  DataTableColumnHeader,
} from "@/components/admin/data-table"
import {
  Tag,
  Pencil,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/sonner"
import {
  getRolesWithPermissions,
  createRoleAction,
  updateRoleAction,
  deleteRoleAction,
  type DBRole,
} from "./actions"

export default function RolesPermissionsPage() {
  const [roles, setRoles] = React.useState<DBRole[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  
  // Form State
  const [roleName, setRoleName] = React.useState("")
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Fetch all roles from database
  const loadRoles = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await getRolesWithPermissions()
      if (res.success && res.data) {
        setRoles(res.data)
      } else if (res.error) {
        toast.error(res.error)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to database."
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    let active = true
    const init = async () => {
      try {
        const res = await getRolesWithPermissions()
        if (active) {
          if (res.success && res.data) {
            setRoles(res.data)
          } else if (res.error) {
            toast.error(res.error)
          }
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : "Error connecting to database."
          toast.error(msg)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    init()
    return () => {
      active = false
    }
  }, [])

  // Handle Save / Update Role in DB
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleName.trim()) {
      toast.error("Please enter a valid role name")
      return
    }

    setIsSubmitting(true)
    try {
      if (editingId) {
        const res = await updateRoleAction(editingId, roleName)
        if (res.success) {
          toast.success(`Role updated successfully in database.`)
          setRoleName("")
          setEditingId(null)
          await loadRoles()
        } else {
          toast.error(res.error || "Failed to update role.")
        }
      } else {
        const res = await createRoleAction(roleName)
        if (res.success) {
          toast.success(`Role "${roleName.trim()}" created successfully in database.`)
          setRoleName("")
          await loadRoles()
        } else {
          toast.error(res.error || "Failed to create role.")
        }
      }
    } catch {
      toast.error("An unexpected error occurred while saving the role.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete Role
  const handleDeleteRole = async (role: DBRole) => {
    if (role.is_system) {
      toast.error("Core system roles cannot be deleted.")
      return
    }

    if (!confirm(`Are you sure you want to delete the "${role.name}" role from the database?`)) {
      return
    }

    try {
      const res = await deleteRoleAction(role.id)
      if (res.success) {
        toast.success(`Role "${role.name}" deleted from database.`)
        if (editingId === role.id) {
          setEditingId(null)
          setRoleName("")
        }
        await loadRoles()
      } else {
        toast.error(res.error || "Failed to delete role.")
      }
    } catch {
      toast.error("An error occurred while deleting the role.")
    }
  }

  // Columns definition for AdminDataTable
  const columns = React.useMemo<ColumnDef<DBRole>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-sm text-foreground tracking-wide py-1">
            {row.original.name}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => (
          <span className="text-sm font-semibold text-foreground tracking-wide block text-right pr-2">
            Action
          </span>
        ),
        cell: ({ row }) => {
          const item = row.original

          return (
            <div className="flex items-center justify-end gap-1">
              {/* Action Buttons (Super Admin has no action buttons as in screenshot) */}
              {item.slug !== "superadmin" && (
                <>
                  {/* Permission Matrix Tag Button - opens the single reusable permission matrix page for this role */}
                  <Link
                    href={`/admin/settings/roles-permissions/${item.id}`}
                    className="size-7 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center rounded-[3px] shadow-2xs transition-all cursor-pointer"
                    title="Assign Permissions"
                  >
                    <Tag className="size-3.5 fill-current" />
                  </Link>

                  {/* Edit Role Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingId(item.id)
                      setRoleName(item.name)
                    }}
                    className="size-7 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center rounded-[3px] shadow-2xs transition-all cursor-pointer"
                    title="Edit Role"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </>
              )}
            </div>
          )
        },
      },
    ],
    [editingId]
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Roles & Permissions"
        description="Manage live database user roles and assign granular permissions."
      />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Role Create / Edit */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle>
                {editingId ? "Edit Role" : "Role"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSaveRole} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name" className="text-xs font-medium text-foreground">
                    Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="role-name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder=""
                    className="h-9 text-xs"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4">
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => {
                        setEditingId(null)
                        setRoleName("")
                      }}
                      className="h-8 px-4 text-xs"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="h-8 px-5 text-xs font-semibold"
                  >
                    {isSubmitting && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                    {editingId ? "Update" : "Save"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Role List Data Table */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle>
                Role List
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <AdminDataTable
                columns={columns}
                data={roles}
                isLoading={isLoading}
                loadingRowCount={6}
                searchPlaceholder="Search"
                enableExport={true}
                exportFilename="roles-permissions.csv"
                showColumnToggle={true}
                showPagination={true}
                showPageSizeSelector={true}
                pageSizeOptions={[10, 25, 50, 100]}
                defaultPageSize={10}
                emptyTitle="No roles found"
                emptyDescription="No role records are available in the database."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
