"use client"

import * as React from "react"
import { Plus, Trash2, MoreHorizontal, Pencil, Calendar } from "lucide-react"
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
import { FormDatePicker } from "@/components/admin/form-date-picker"
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

import { createExamScheduleAction, updateExamScheduleAction, deleteExamScheduleAction } from "../actions"

type OptionsList = {
  id: string
  name: string
}[]

// ─── Create Exam Schedule Dialog ───────────────────────────────────────────────
export function CreateExamScheduleDialog({
  exams,
  classes,
}: {
  exams: OptionsList
  classes: OptionsList
}) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  const [selectedClassId, setSelectedClassId] = React.useState("")
  const [selectedSubjectId, setSelectedSubjectId] = React.useState("")
  const [classSubjects, setClassSubjects] = React.useState<{ id: string; name: string; code?: string | null }[]>([])
  const [loadingSubjects, setLoadingSubjects] = React.useState(false)

  // Reset inputs when closing dialog
  React.useEffect(() => {
    if (!open) {
      setSelectedClassId("")
      setSelectedSubjectId("")
      setClassSubjects([])
    }
  }, [open])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    try {
      const result = await createExamScheduleAction(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.message || "Exam schedule created successfully!")
        setOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create schedule")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-[#EEF2FF] text-[#4F46E5] dark:bg-primary/10 dark:text-primary">
              <Calendar className="h-5 w-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Add Exam Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Create a new exam slot for a class and subject.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 px-6 py-4">
            <div className="space-y-2">
              <Label>Exam</Label>
              <Select name="exam_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select
                name="class_id"
                value={selectedClassId}
                onValueChange={async (classId) => {
                  setSelectedClassId(classId)
                  setSelectedSubjectId("")
                  setClassSubjects([])
                  if (!classId) return

                  setLoadingSubjects(true)
                  try {
                    const res = await fetch(`/api/classes/${classId}/subjects`)
                    if (res.ok) {
                      const data = await res.json()
                      setClassSubjects(data)
                    } else {
                      toast.error("Failed to load subjects for class")
                    }
                  } catch (err) {
                    toast.error("Error loading subjects")
                  } finally {
                    setLoadingSubjects(false)
                  }
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select
                name="subject_id"
                value={selectedSubjectId}
                onValueChange={setSelectedSubjectId}
                disabled={loadingSubjects || !selectedClassId}
                required
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingSubjects
                        ? "Loading subjects..."
                        : !selectedClassId
                        ? "Select Class first"
                        : "Select Subject"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {classSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} {s.code ? `(${s.code})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <FormDatePicker name="exam_date" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" name="start_time" required />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" name="end_time" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Room / Classroom (Optional)</Label>
              <Input name="room_id" placeholder="e.g. Room 102" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending} className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? "Saving..." : "Save Schedule"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ─── Exam Schedule Row Actions ────────────────────────────────────────────────
type ScheduleData = {
  id: string
  exam_id: string
  class_id: string
  subject_id: string
  exam_date: string
  start_time: string
  end_time: string
  room_id: string | null
}

export function ExamScheduleActions({
  schedule,
  exams,
  classes,
}: {
  schedule: ScheduleData
  exams: OptionsList
  classes: OptionsList
}) {
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)

  const [selectedClassId, setSelectedClassId] = React.useState(schedule.class_id)
  const [selectedSubjectId, setSelectedSubjectId] = React.useState(schedule.subject_id)
  const [classSubjects, setClassSubjects] = React.useState<{ id: string; name: string; code?: string | null }[]>([])
  const [loadingSubjects, setLoadingSubjects] = React.useState(false)

  // Reset values when edit closes/opens
  React.useEffect(() => {
    if (editOpen) {
      setSelectedClassId(schedule.class_id)
      setSelectedSubjectId(schedule.subject_id)
    }
  }, [editOpen, schedule])

  // Load class subjects dynamically when selected class ID changes (or initial load)
  React.useEffect(() => {
    if (!editOpen || !selectedClassId) {
      setClassSubjects([])
      return
    }

    async function loadSubjects() {
      setLoadingSubjects(true)
      try {
        const res = await fetch(`/api/classes/${selectedClassId}/subjects`)
        if (res.ok) {
          const data = await res.json()
          setClassSubjects(data)
        }
      } catch (err) {
        console.error("Error loading subjects", err)
      } finally {
        setLoadingSubjects(false)
      }
    }
    loadSubjects()
  }, [editOpen, selectedClassId])

  // format date from YYYY-MM-DD to date input format
  const formattedDate = React.useMemo(() => {
    if (!schedule.exam_date) return ""
    try {
      const d = new Date(schedule.exam_date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    } catch {
      return ""
    }
  }, [schedule.exam_date])

  async function onEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    try {
      const result = await updateExamScheduleAction(schedule.id, formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.message || "Exam schedule updated successfully!")
        setEditOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update schedule")
    } finally {
      setIsPending(false)
    }
  }

  async function onDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    try {
      const result = await deleteExamScheduleAction(schedule.id)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.message || "Exam schedule deleted!")
        setDeleteOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete schedule")
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

      {/* Edit Schedule Dialog */}
      <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <form onSubmit={onEdit}>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-[#EEF2FF] text-[#4F46E5] dark:bg-primary/10 dark:text-primary">
                <Pencil className="h-5 w-5" />
              </AlertDialogMedia>
              <AlertDialogTitle>Edit Exam Schedule</AlertDialogTitle>
              <AlertDialogDescription>
                Update exam slot details. Click save when you're done.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 px-6 py-4">
              <div className="space-y-2">
                <Label>Exam</Label>
                <Select name="exam_id" defaultValue={schedule.exam_id} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select
                  name="class_id"
                  value={selectedClassId}
                  onValueChange={(classId) => {
                    setSelectedClassId(classId)
                    setSelectedSubjectId("")
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  name="subject_id"
                  value={selectedSubjectId}
                  onValueChange={setSelectedSubjectId}
                  disabled={loadingSubjects || !selectedClassId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingSubjects
                          ? "Loading subjects..."
                          : !selectedClassId
                          ? "Select Class first"
                          : "Select Subject"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {classSubjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} {s.code ? `(${s.code})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <FormDatePicker name="exam_date" defaultValue={formattedDate} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input type="time" name="start_time" defaultValue={schedule.start_time.substring(0, 5)} required />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input type="time" name="end_time" defaultValue={schedule.end_time.substring(0, 5)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Room / Classroom (Optional)</Label>
                <Input name="room_id" defaultValue={schedule.room_id || ""} placeholder="e.g. Room 102" />
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
              <AlertDialogTitle>Delete Exam Schedule</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This will permanently remove this exam schedule slot.
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
