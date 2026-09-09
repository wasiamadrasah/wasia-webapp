"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { GoverningBodyMemberForm } from "./form"
import { Plus } from "lucide-react"

export function NewMemberDialog({
  triggerLabel = "Add Member",
}: {
  triggerLabel?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="h-10 gap-1.5 rounded-lg bg-[#4F46E5] px-4 text-sm font-semibold text-white shadow-xs hover:bg-[#4338CA] transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>{triggerLabel}</span>
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-2xl rounded-xl border border-border p-0 overflow-hidden">
          <AlertDialogHeader className="border-b border-border bg-muted/40 px-6 py-4">
            <AlertDialogTitle className="text-lg font-bold text-foreground">Add New Governing Body Member</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Fill in the member details and upload an official profile photo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="p-6">
            <GoverningBodyMemberForm
              member={undefined}
              onSuccess={() => setOpen(false)}
              onCancel={() => setOpen(false)}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
