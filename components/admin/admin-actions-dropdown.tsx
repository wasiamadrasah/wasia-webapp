"use client"

import * as React from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Circle,
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export interface AdminCustomActionItem {
  key?: string
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void | Promise<void>
  disabled?: boolean
  variant?: "default" | "destructive" | "emerald" | "indigo"
  separatorBefore?: boolean
  separatorAfter?: boolean
}

export interface AdminActionsDropdownProps {
  /** Optional view link or action */
  viewHref?: string
  viewLabel?: string
  onView?: () => void

  /** Optional edit link or action */
  editHref?: string
  editLabel?: string
  onEdit?: () => void

  /** Optional active / inactive toggle */
  toggleActive?: {
    isActive: boolean
    onToggle: () => Promise<void> | void
    isLoading?: boolean
    activeLabel?: string
    inactiveLabel?: string
    activeIcon?: React.ReactNode
    inactiveIcon?: React.ReactNode
  }

  /** Extra custom actions before or after */
  customActions?: AdminCustomActionItem[]

  /** Optional delete action or delete confirmation dialog handler */
  onDelete?: () => void | Promise<void>
  deleteLabel?: string
  isDeleting?: boolean

  /** Self-contained delete dialog support */
  deleteDialog?: {
    title?: string
    description?: string
    confirmLabel?: string
    onConfirm: () => Promise<void> | void
  }

  /** Menu alignment */
  align?: "start" | "center" | "end"
  className?: string
  triggerClassName?: string

  /** Children for custom dropdown items */
  children?: React.ReactNode
}

export function AdminActionsDropdown({
  viewHref,
  viewLabel = "View Details",
  onView,
  editHref,
  editLabel = "Edit",
  onEdit,
  toggleActive,
  customActions,
  onDelete,
  deleteLabel = "Delete",
  isDeleting = false,
  deleteDialog,
  align = "end",
  className = "w-48",
  triggerClassName,
  children,
}: AdminActionsDropdownProps) {
  const [internalDialogOpen, setInternalDialogOpen] = React.useState(false)
  const [internalDeleting, setInternalDeleting] = React.useState(false)

  const handleDeleteTrigger = () => {
    if (deleteDialog) {
      setInternalDialogOpen(true)
    } else if (onDelete) {
      onDelete()
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteDialog) return
    setInternalDeleting(true)
    try {
      await deleteDialog.onConfirm()
      setInternalDialogOpen(false)
    } finally {
      setInternalDeleting(false)
    }
  }

  const hasDelete = Boolean(onDelete || deleteDialog)
  const hasPreDeleteContent = Boolean(
    viewHref || onView || editHref || onEdit || toggleActive || customActions?.length || children
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
          <Button
            variant="ghost"
            className={`h-8 w-8 p-0 text-muted-foreground hover:text-foreground ${triggerClassName || ""}`}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={align} className={className}>
          {/* View Action */}
          {viewHref && (
            <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm">
              <Link href={viewHref}>
                <Eye className="h-4 w-4 text-blue-600" />
                <span>{viewLabel}</span>
              </Link>
            </DropdownMenuItem>
          )}
          {onView && !viewHref && (
            <DropdownMenuItem onClick={onView} className="cursor-pointer gap-2 text-sm">
              <Eye className="h-4 w-4 text-blue-600" />
              <span>{viewLabel}</span>
            </DropdownMenuItem>
          )}

          {/* Edit Action */}
          {editHref && (
            <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm">
              <Link href={editHref}>
                <Pencil className="h-4 w-4 text-primary" />
                <span>{editLabel}</span>
              </Link>
            </DropdownMenuItem>
          )}
          {onEdit && !editHref && (
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer gap-2 text-sm">
              <Pencil className="h-4 w-4 text-primary" />
              <span>{editLabel}</span>
            </DropdownMenuItem>
          )}

          {/* Toggle Active Action */}
          {toggleActive && (
            <DropdownMenuItem
              disabled={toggleActive.isLoading}
              onClick={async (e) => {
                e.stopPropagation()
                await toggleActive.onToggle()
              }}
              className="cursor-pointer gap-2 text-sm"
            >
              {toggleActive.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span>Updating...</span>
                </>
              ) : toggleActive.isActive ? (
                <>
                  {toggleActive.activeIcon || <Circle className="h-4 w-4 text-muted-foreground" />}
                  <span>{toggleActive.activeLabel || "Deactivate"}</span>
                </>
              ) : (
                <>
                  {toggleActive.inactiveIcon || <CheckCircle2 className="h-4 w-4 text-primary" />}
                  <span>{toggleActive.inactiveLabel || "Set Active"}</span>
                </>
              )}
            </DropdownMenuItem>
          )}

          {/* Custom Actions */}
          {customActions?.map((action, idx) => {
            const itemContent = (
              <>
                {action.icon}
                <span>{action.label}</span>
              </>
            )

            const variantClass =
              action.variant === "destructive"
                ? "text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40"
                : action.variant === "emerald" || action.variant === "indigo"
                ? "text-primary focus:text-primary focus:bg-primary/10 dark:focus:bg-primary/20"
                : ""

            return (
              <React.Fragment key={action.key || idx}>
                {action.separatorBefore && <DropdownMenuSeparator />}
                {action.href ? (
                  <DropdownMenuItem
                    asChild
                    disabled={action.disabled}
                    className={`cursor-pointer gap-2 text-sm ${variantClass}`}
                  >
                    <Link href={action.href}>{itemContent}</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    disabled={action.disabled}
                    onClick={action.onClick}
                    className={`cursor-pointer gap-2 text-sm ${variantClass}`}
                  >
                    {itemContent}
                  </DropdownMenuItem>
                )}
                {action.separatorAfter && <DropdownMenuSeparator />}
              </React.Fragment>
            )
          })}

          {/* Custom children slots */}
          {children}

          {/* Delete Action with Separator */}
          {hasDelete && (
            <>
              {hasPreDeleteContent && <DropdownMenuSeparator />}
              <DropdownMenuItem
                disabled={isDeleting || internalDeleting}
                onClick={handleDeleteTrigger}
                className="cursor-pointer gap-2 text-sm text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40"
              >
                {isDeleting || internalDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 text-rose-600" />
                    <span>{deleteLabel}</span>
                  </>
                )}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Built-in Delete Dialog if configured */}
      {deleteDialog && (
        <AlertDialog open={internalDialogOpen} onOpenChange={setInternalDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{deleteDialog.title || "Are you sure?"}</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteDialog.description ||
                  "This action cannot be undone. This will permanently delete the record."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={internalDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={internalDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {internalDeleting ? "Deleting..." : deleteDialog.confirmLabel || "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
