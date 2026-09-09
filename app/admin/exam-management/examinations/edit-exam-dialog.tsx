"use client"

import * as React from "react"
import { Edit } from "lucide-react"
import { toast } from "@/components/ui/sonner"

import { Button } from "@/components/ui/button"
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
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { updateExamAction } from "../actions"
import { ExamRecord } from "@/lib/db"

export function EditExamDialog({
  exam,
  sessions,
}: {
  exam: ExamRecord
  sessions: { id: string; name: string }[]
}) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    const formData = new FormData(event.currentTarget)

    try {
      const result = await updateExamAction(exam.id, formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.message || "Exam updated successfully!")
        setOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update exam")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => {
          e.preventDefault()
          setOpen(true)
        }} className="w-full flex items-center cursor-pointer">
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="admin-theme sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Update examination details. Click save when you're done.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${exam.id}`}>Exam Name</Label>
              <Input
                id={`name-${exam.id}`}
                name="name"
                defaultValue={exam.name}
                required
                placeholder="e.g. First Term Examination"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`session_id-${exam.id}`}>Academic Session</Label>
              <Select name="session_id" defaultValue={exam.session_id}>
                <SelectTrigger id={`session_id-${exam.id}`}>
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`status-${exam.id}`}>Status</Label>
              <Select name="status" defaultValue={exam.status || "active"}>
                <SelectTrigger id={`status-${exam.id}`}>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} variant="destructive">Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending} className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
