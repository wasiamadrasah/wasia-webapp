"use client"

import * as React from "react"
import { Plus, GraduationCap } from "lucide-react"
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
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createExamAction } from "../actions"

export function CreateExamDialog({
  sessions,
}: {
  sessions: { id: string; name: string }[]
}) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    const formData = new FormData(event.currentTarget)

    try {
      const result = await createExamAction(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.message || "Exam created successfully!")
        setOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create exam")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add New Exam
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Add New Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Create a new examination. Click save when you're done.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Exam Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g. First Term Examination"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session_id">Academic Session</Label>
              <Select name="session_id">
                <SelectTrigger>
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
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="active">
                <SelectTrigger>
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
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending} className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? "Saving..." : "Save Exam"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
