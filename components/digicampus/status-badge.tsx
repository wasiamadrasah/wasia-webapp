import * as React from "react"
import { Badge } from "@/components/ui/badge"

export type StatusType =
  | "Active"
  | "Approved"
  | "Published"
  | "Completed"
  | "Paid"
  | "Pending"
  | "Under Review"
  | "Draft"
  | "Inactive"
  | "Archived"
  | "Rejected"
  | "Failed"
  | "Cancelled"
  | "Suspended"
  | string

interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
  status: StatusType
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const normalized = (status || "").toString().trim()
  const lower = normalized.toLowerCase()

  let variant: "success" | "warning" | "destructive" | "neutral" | "info" | "primary" = "neutral"

  if (["active", "approved", "published", "completed", "paid", "verified"].includes(lower)) {
    variant = "success"
  } else if (["pending", "under review", "review", "expiring"].includes(lower)) {
    variant = "warning"
  } else if (["rejected", "failed", "cancelled", "suspended", "deleted"].includes(lower)) {
    variant = "destructive"
  } else if (["draft", "inactive", "archived"].includes(lower)) {
    variant = "neutral"
  } else if (["info", "information"].includes(lower)) {
    variant = "info"
  }

  return (
    <Badge variant={variant} className={className} {...props}>
      {normalized}
    </Badge>
  )
}
