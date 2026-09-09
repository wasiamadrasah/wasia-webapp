"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/sonner"
import { PageHeader } from "@/components/digicampus/page-header"
import {
  getRoleById,
  saveRolePermissionsAction,
  type DBRole,
} from "../actions"
import { SYSTEM_PERMISSION_MODULES } from "../modules-config"

export default function RolePermissionMatrixPage() {
  const params = useParams()
  const router = useRouter()
  const idOrSlug = params.id as string

  const [role, setRole] = React.useState<DBRole | null>(null)
  const [activePermissions, setActivePermissions] = React.useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)

  // Load role data and assigned permissions from DB
  React.useEffect(() => {
    async function loadData() {
      if (!idOrSlug) return
      setIsLoading(true)
      try {
        const res = await getRoleById(idOrSlug)
        if (res.success && res.data) {
          setRole(res.data)
          setActivePermissions(new Set(res.data.permissions || []))
        } else {
          toast.error(res.error || "Role not found.")
        }
      } catch (err: unknown) {
        toast.error("Error loading permissions.")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [idOrSlug])

  // Helper to check if a specific permission is granted
  const hasPerm = (featureId: string, action: string) => {
    return activePermissions.has(`${featureId}_${action}`)
  }

  // Toggle single permission checkbox
  const togglePerm = (featureId: string, action: string) => {
    const key = `${featureId}_${action}`
    setActivePermissions((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  // Toggle all permissions for an entire action column (View, Add, Edit, Delete)
  const toggleColumnAction = (action: "view" | "add" | "edit" | "delete") => {
    const relevantKeys: string[] = []
    SYSTEM_PERMISSION_MODULES.forEach((mod) => {
      mod.features.forEach((feat) => {
        if (feat.actions.includes(action)) {
          relevantKeys.push(`${feat.id}_${action}`)
        }
      })
    })

    const allChecked = relevantKeys.every((k) => activePermissions.has(k))

    setActivePermissions((prev) => {
      const next = new Set(prev)
      if (allChecked) {
        relevantKeys.forEach((k) => next.delete(k))
      } else {
        relevantKeys.forEach((k) => next.add(k))
      }
      return next
    })
  }

  // Check if all permissions for an entire module row group are granted
  const isModuleChecked = (category: string) => {
    const moduleItem = SYSTEM_PERMISSION_MODULES.find((m) => m.category === category)
    if (!moduleItem) return false

    const moduleKeys: string[] = []
    moduleItem.features.forEach((feat) => {
      feat.actions.forEach((act) => {
        moduleKeys.push(`${feat.id}_${act}`)
      })
    })

    if (moduleKeys.length === 0) return false
    return moduleKeys.every((k) => activePermissions.has(k))
  }

  // Toggle all permissions for an entire module row group
  const toggleModuleAll = (category: string) => {
    const moduleItem = SYSTEM_PERMISSION_MODULES.find((m) => m.category === category)
    if (!moduleItem) return

    const moduleKeys: string[] = []
    moduleItem.features.forEach((feat) => {
      feat.actions.forEach((act) => {
        moduleKeys.push(`${feat.id}_${act}`)
      })
    })

    const allChecked = moduleKeys.every((k) => activePermissions.has(k))

    setActivePermissions((prev) => {
      const next = new Set(prev)
      if (allChecked) {
        moduleKeys.forEach((k) => next.delete(k))
      } else {
        moduleKeys.forEach((k) => next.add(k))
      }
      return next
    })
  }

  // Save permissions to DB
  const handleSave = async () => {
    if (!role) return
    setIsSaving(true)
    try {
      const permsArray = Array.from(activePermissions)
      const res = await saveRolePermissionsAction(role.id, permsArray)
      if (res.success) {
        toast.success(`Permissions for "${role.name}" updated successfully!`)
      } else {
        toast.error(res.error || "Failed to save permissions.")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving permissions to database."
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  // Calculate column header check states
  const getActionColumnState = (action: "view" | "add" | "edit" | "delete") => {
    const relevantKeys: string[] = []
    SYSTEM_PERMISSION_MODULES.forEach((mod) => {
      mod.features.forEach((feat) => {
        if (feat.actions.includes(action)) {
          relevantKeys.push(`${feat.id}_${action}`)
        }
      })
    })

    if (relevantKeys.length === 0) return false
    return relevantKeys.every((k) => activePermissions.has(k))
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-14rem)] min-h-[360px] w-full items-center justify-center">
        <div className="admin-loader" aria-label="Loading..." />
      </div>
    )
  }

  if (!role) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Role Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/admin/settings/roles-permissions">Back to Roles List</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <PageHeader
        title={`${role.name} Permission`}
        description={`Configure system permissions for the ${role.name} role.`}
        action={
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
            >
              <Link href="/admin/settings/roles-permissions">
                <ArrowLeft className="size-3.5" />
                <span>Back</span>
              </Link>
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="h-8 px-5 text-xs font-semibold"
            >
              {isSaving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              Save
            </Button>
          </div>
        }
      />

      {/* Main Permissions Matrix Table Card */}
      <Card className="gap-0 py-0 overflow-hidden">
        <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">
            {role.name} Permission
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{activePermissions.size}</span> permissions active
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-x-auto">
            <table className="w-full text-sm caption-bottom border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-foreground font-semibold text-sm">
                  <th className="py-3 px-4 text-left font-semibold w-1/4 select-none">
                    Module
                  </th>
                  <th className="py-3 px-4 text-left font-semibold w-1/3 select-none">
                    Feature
                  </th>
                  <th className="py-3 px-4 text-center font-semibold w-24 select-none">
                    <div
                      className="flex items-center justify-center gap-1.5 cursor-pointer"
                      onClick={() => toggleColumnAction("view")}
                    >
                      <span>View</span>
                      <Checkbox
                        checked={getActionColumnState("view")}
                        onCheckedChange={() => toggleColumnAction("view")}
                        className="size-4 translate-y-[1px]"
                      />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center font-semibold w-24 select-none">
                    <div
                      className="flex items-center justify-center gap-1.5 cursor-pointer"
                      onClick={() => toggleColumnAction("add")}
                    >
                      <span>Add</span>
                      <Checkbox
                        checked={getActionColumnState("add")}
                        onCheckedChange={() => toggleColumnAction("add")}
                        className="size-4 translate-y-[1px]"
                      />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center font-semibold w-24 select-none">
                    <div
                      className="flex items-center justify-center gap-1.5 cursor-pointer"
                      onClick={() => toggleColumnAction("edit")}
                    >
                      <span>Edit</span>
                      <Checkbox
                        checked={getActionColumnState("edit")}
                        onCheckedChange={() => toggleColumnAction("edit")}
                        className="size-4 translate-y-[1px]"
                      />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center font-semibold w-24 select-none">
                    <div
                      className="flex items-center justify-center gap-1.5 cursor-pointer"
                      onClick={() => toggleColumnAction("delete")}
                    >
                      <span>Delete</span>
                      <Checkbox
                        checked={getActionColumnState("delete")}
                        onCheckedChange={() => toggleColumnAction("delete")}
                        className="size-4 translate-y-[1px]"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SYSTEM_PERMISSION_MODULES.map((module) => {
                  return module.features.map((feature, featureIdx) => {
                    const isFirstInModule = featureIdx === 0

                    return (
                      <tr
                        key={feature.id}
                        className="border-b border-border hover:bg-muted/25 transition-colors"
                      >
                        {/* Module Column (Rowspan across all features in this module) */}
                        {isFirstInModule && (
                          <td
                            rowSpan={module.features.length}
                            className="py-3.5 px-4 align-top font-semibold text-sm text-foreground bg-muted/10 border-r border-border"
                          >
                            <div className="flex flex-col gap-2 sticky top-4">
                              <span className="text-foreground font-semibold">
                                {module.category}
                              </span>
                              <label
                                className="flex items-center gap-1.5 cursor-pointer select-none text-muted-foreground hover:text-foreground w-fit"
                                onClick={(e) => {
                                  e.preventDefault()
                                  toggleModuleAll(module.category)
                                }}
                              >
                                <Checkbox
                                  checked={isModuleChecked(module.category)}
                                  className="size-3.5"
                                />
                                <span className="text-[11px] font-normal">
                                  {isModuleChecked(module.category) ? "Uncheck all" : "Check all"}
                                </span>
                              </label>
                            </div>
                          </td>
                        )}

                        {/* Feature Name */}
                        <td className="py-3 px-4 align-middle font-medium text-sm text-foreground">
                          {feature.name}
                        </td>

                        {/* View Checkbox */}
                        <td className="py-3 px-4 text-center align-middle">
                          {feature.actions.includes("view") ? (
                            <Checkbox
                              checked={hasPerm(feature.id, "view")}
                              onCheckedChange={() => togglePerm(feature.id, "view")}
                              className="size-4 mx-auto"
                            />
                          ) : (
                            <span className="text-muted-foreground/30">—</span>
                          )}
                        </td>

                        {/* Add Checkbox */}
                        <td className="py-3 px-4 text-center align-middle">
                          {feature.actions.includes("add") ? (
                            <Checkbox
                              checked={hasPerm(feature.id, "add")}
                              onCheckedChange={() => togglePerm(feature.id, "add")}
                              className="size-4 mx-auto"
                            />
                          ) : (
                            <span className="text-muted-foreground/30">—</span>
                          )}
                        </td>

                        {/* Edit Checkbox */}
                        <td className="py-3 px-4 text-center align-middle">
                          {feature.actions.includes("edit") ? (
                            <Checkbox
                              checked={hasPerm(feature.id, "edit")}
                              onCheckedChange={() => togglePerm(feature.id, "edit")}
                              className="size-4 mx-auto"
                            />
                          ) : (
                            <span className="text-muted-foreground/30">—</span>
                          )}
                        </td>

                        {/* Delete Checkbox */}
                        <td className="py-3 px-4 text-center align-middle">
                          {feature.actions.includes("delete") ? (
                            <Checkbox
                              checked={hasPerm(feature.id, "delete")}
                              onCheckedChange={() => togglePerm(feature.id, "delete")}
                              className="size-4 mx-auto"
                            />
                          ) : (
                            <span className="text-muted-foreground/30">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                })}
              </tbody>
            </table>
          </div>

          {/* Card Footer Save Button */}
          <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
            <div className="text-xs text-muted-foreground">
              Total <strong className="text-foreground">{activePermissions.size}</strong> permissions granted to <strong>{role.name}</strong>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 px-6 text-xs font-semibold"
            >
              {isSaving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
