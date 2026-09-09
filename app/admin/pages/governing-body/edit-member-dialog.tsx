"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { GoverningBodyMemberForm } from "./form"
import { GoverningBodyMemberRecord } from "@/lib/db"

export function EditMemberDialog({
  member,
  open,
  onOpenChange,
}: {
  member?: GoverningBodyMemberRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!member) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl rounded-xl border border-border p-0 overflow-hidden">
        <AlertDialogHeader className="border-b border-border bg-muted/40 px-6 py-4">
          <AlertDialogTitle className="text-lg font-bold text-foreground">Edit Governing Body Member</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">Update member details below</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="p-6">
          <GoverningBodyMemberForm
            member={member}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
