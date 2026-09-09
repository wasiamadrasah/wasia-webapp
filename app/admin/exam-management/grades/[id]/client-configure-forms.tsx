"use client"

import * as React from "react"
import { Plus, Trash2, MoreHorizontal, Settings, Pencil, Award } from "lucide-react"
import { toast } from "@/components/ui/sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { createGradeScaleDetailAction, deleteGradeScaleDetailAction, updateGradeScaleDetailAction } from "../../actions"

// ─── Add Grade Detail Dialog ───────────────────────────────────────────────────
export function CreateGradeScaleDetailDialog({ scaleId }: { scaleId: string }) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    formData.append("grade_scale_id", scaleId)
    try {
      const result = await createGradeScaleDetailAction(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.message || "Grade detail added!")
        setOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add grade detail")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add Grade
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-[#EEF2FF] text-[#4F46E5] dark:bg-primary/10 dark:text-primary">
              <Award className="h-5 w-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Add Grade Detail</AlertDialogTitle>
            <AlertDialogDescription>
              Add a grade boundary to this scale.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Letter Grade</Label>
                <Input name="grade_letter" required placeholder="e.g. A+" />
              </div>
              <div className="space-y-2">
                <Label>Grade Point</Label>
                <Input name="grade_point" type="number" step="0.01" required placeholder="e.g. 5.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Marks %</Label>
                <Input name="min_percentage" type="number" step="0.01" required placeholder="e.g. 80" />
              </div>
              <div className="space-y-2">
                <Label>Max Marks %</Label>
                <Input name="max_percentage" type="number" step="0.01" required placeholder="e.g. 100" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Input name="remarks" placeholder="e.g. Outstanding" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending} className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? "Saving..." : "Save"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Grade Detail Row Actions (Edit/Delete) ──────────────────────────────────
type GradeScaleDetail = {
  id: string
  grade_scale_id: string
  grade_letter: string
  grade_point: number
  min_percentage: number
  max_percentage: number
  remarks: string | null
}

export function GradeScaleDetailActions({ detail }: { detail: GradeScaleDetail }) {
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  async function onEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    try {
      const result = await updateGradeScaleDetailAction(detail.id, formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.message || "Grade detail updated!")
        setEditOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update grade detail")
    } finally {
      setIsPending(false)
    }
  }

  async function onDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    try {
      const result = await deleteGradeScaleDetailAction(detail.id)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.message || "Grade detail deleted!")
        setDeleteOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete detail")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => {
              e.preventDefault()
              setEditOpen(true)
            }}
          >
            <Settings className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onSelect={(e) => {
              e.preventDefault()
              setDeleteOpen(true)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Grade Detail Dialog */}
      <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <form onSubmit={onEdit}>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-[#EEF2FF] text-[#4F46E5] dark:bg-primary/10 dark:text-primary">
                <Pencil className="h-5 w-5" />
              </AlertDialogMedia>
              <AlertDialogTitle>Edit Grade Detail</AlertDialogTitle>
              <AlertDialogDescription>
                Modify the grade boundary fields. Click update when you're done.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 px-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name / Letter Grade</Label>
                  <Input name="grade_letter" required defaultValue={detail.grade_letter} placeholder="e.g. A+" />
                </div>
                <div className="space-y-2">
                  <Label>Grade Point</Label>
                  <Input name="grade_point" type="number" step="0.01" required defaultValue={detail.grade_point} placeholder="e.g. 5.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Marks %</Label>
                  <Input name="min_percentage" type="number" step="0.01" required defaultValue={detail.min_percentage} placeholder="e.g. 80" />
                </div>
                <div className="space-y-2">
                  <Label>Max Marks %</Label>
                  <Input name="max_percentage" type="number" step="0.01" required defaultValue={detail.max_percentage} placeholder="e.g. 100" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Input name="remarks" defaultValue={detail.remarks || ""} placeholder="e.g. Outstanding" />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={isPending} className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
                {isPending ? "Updating..." : "Update"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <form onSubmit={onDelete}>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                <Trash2 className="h-5 w-5" />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete Grade</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this grade boundary?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <Button type="submit" variant="destructive" disabled={isPending} className="h-10">
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
