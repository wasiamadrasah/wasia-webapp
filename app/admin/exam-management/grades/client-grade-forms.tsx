"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Settings, Trash2, MoreHorizontal, Pencil, Award } from "lucide-react"
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

import { createGradeScaleAction, deleteGradeScaleAction, updateGradeScaleAction } from "../actions"

// ─── Create Grade Scale Dialog ─────────────────────────────────────────────────
export function CreateGradeScaleDialog() {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    try {
      const result = await createGradeScaleAction(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.message || "Grade scale created!")
        setOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create grade scale")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add New Grade Scale
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-primary/10 text-primary">
              <Award className="h-5 w-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Add New Grade Scale</AlertDialogTitle>
            <AlertDialogDescription>
              Create a new grading system. Click save when you're done.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Scale Name</Label>
              <Input id="name" name="name" required placeholder="e.g. GPA 5 (Bangladesh Standard)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input id="description" name="description" placeholder="e.g. Standard grading for secondary schools" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending} className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? "Saving..." : "Save Scale"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Grade Scale Row Actions (Edit/Delete/Configure) ───────────────────────────
export function GradeScaleActions({ scale }: { scale: { id: string; name: string; description: string | null } }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  async function onEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    try {
      const result = await updateGradeScaleAction(scale.id, formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.message || "Grade scale updated!")
        setEditOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update grade scale")
    } finally {
      setIsPending(false)
    }
  }

  async function onDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    try {
      const result = await deleteGradeScaleAction(scale.id)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.message || "Grade scale deleted!")
        setDeleteOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete grade scale")
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
            onSelect={() => router.push(`/admin/exam-management/grades/${scale.id}`)}
          >
            <Settings className="mr-2 h-4 w-4" /> Configure
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => {
              e.preventDefault()
              setEditOpen(true)
            }}
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
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

      {/* Edit Scale Dialog */}
      <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <form onSubmit={onEdit}>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-primary/10 text-primary">
                <Pencil className="h-5 w-5" />
              </AlertDialogMedia>
              <AlertDialogTitle>Edit Grade Scale</AlertDialogTitle>
              <AlertDialogDescription>
                Update the grade scale name or description.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 px-6 py-4">
              <div className="space-y-2">
                <Label htmlFor={`edit-name-${scale.id}`}>Scale Name</Label>
                <Input id={`edit-name-${scale.id}`} name="name" required defaultValue={scale.name} placeholder="e.g. GPA 5 (Bangladesh Standard)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`edit-desc-${scale.id}`}>Description (Optional)</Label>
                <Input id={`edit-desc-${scale.id}`} name="description" defaultValue={scale.description || ""} placeholder="e.g. Standard grading for secondary schools" />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={isPending} className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
                {isPending ? "Saving..." : "Save Changes"}
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
              <AlertDialogTitle>Delete Grade Scale</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This will permanently delete this scale and all its grade details.
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
