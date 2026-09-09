"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { promoteStudentsAction, deleteStudentEnrollmentAction } from "@/app/admin/students/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, CheckCircle2, MoreHorizontal, User, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/sonner"
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
import type { StudentEnrollmentRecord, AcademicClassConfigRecord } from "@/lib/db"

interface PromotionsManagerProps {
  enrollments: StudentEnrollmentRecord[]
  classConfigs: AcademicClassConfigRecord[]
}

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

export function PromotionsManager({ enrollments, classConfigs }: PromotionsManagerProps) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [targetConfigId, setTargetConfigId] = React.useState("")
  const [rollMappings, setRollMappings] = React.useState<Record<string, string>>({})
  const [step, setStep] = React.useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState("")

  const [classFilterId, setClassFilterId] = React.useState("")
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const res = await deleteStudentEnrollmentAction(deleteId)
      if (res?.error) {
        toast("Error", { description: res.error })
        toast.error(res.error)
      } else if (res?.success) {
        toast("Success", { description: res.message })
        toast.success(res.message)
        router.refresh()
      }
    } catch (err) {
      if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
        toast("Error", { description: err.message })
        toast.error(err.message)
      }
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  // Filter active enrollments for search and class selection
  const filteredEnrollments = enrollments.filter((e) => {
    const query = search.toLowerCase()
    
    if (classFilterId && e.academic_class_config_id !== classFilterId) {
      return false
    }

    return (
      e.enrollment_status === "Active" &&
      (e.student_uid?.toLowerCase().includes(query) ||
        e.student_name_en?.toLowerCase().includes(query) ||
        e.class_combination_name?.toLowerCase().includes(query))
    )
  })

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredEnrollments.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredEnrollments.map((e) => e.id))
    }
  }

  const handleNextStep = () => {
    if (selectedIds.length === 0) {
      setErrorMsg("Select at least one student to promote.")
      return
    }
    if (!targetConfigId) {
      setErrorMsg("Select a target class combination.")
      return
    }
    setErrorMsg(null)

    // Pre-populate roll mapping (1, 2, 3...)
    const initialRolls: Record<string, string> = {}
    selectedIds.forEach((id, idx) => {
      initialRolls[id] = String(idx + 1)
    })
    setRollMappings(initialRolls)
    setStep(2)
  }

  const handleRollChange = (enrollmentId: string, val: string) => {
    setRollMappings((prev) => ({
      ...prev,
      [enrollmentId]: val,
    }))
  }

  const handlePromote = async () => {
    setIsSubmitting(true)
    setErrorMsg(null)
    try {
      // Convert roll mapping values to integer numbers
      const finalRolls: Record<string, number> = {}
      for (const [id, rStr] of Object.entries(rollMappings)) {
        const parsed = parseInt(rStr, 10)
        if (isNaN(parsed) || parsed <= 0) {
          throw new Error("All rolls must be valid positive integers.")
        }
        finalRolls[id] = parsed
      }

      await promoteStudentsAction(targetConfigId, selectedIds, finalRolls)
      router.refresh()
      // Reset promotion manager state
      setStep(1)
      setSelectedIds([])
      setTargetConfigId("")
      setRollMappings({})
      setErrorMsg("Promotion completed successfully!")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to promote students.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            errorMsg.includes("successfully")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {errorMsg}
        </div>
      )}

      {step === 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left grid: Select students */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-foreground">Select Students for Promotion</h2>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <select
                  value={classFilterId}
                  onChange={(e) => setClassFilterId(e.target.value)}
                  className="h-9 w-full sm:w-[200px] rounded-lg border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Classes</option>
                  {classConfigs
                    .filter((cc) => cc.is_active)
                    .map((cc) => {
                      const label = [
                        cc.session_name,
                        cc.class_name,
                        cc.section_name,
                        cc.group_name,
                      ]
                        .filter(Boolean)
                        .join(" › ")
                      return (
                        <option key={cc.id} value={cc.id}>
                          {label}
                        </option>
                      )
                    })}
                </select>
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-[200px] h-9"
                />
              </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          filteredEnrollments.length > 0 &&
                          selectedIds.length === filteredEnrollments.length
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Current Class Combo</TableHead>
                    <TableHead>Roll</TableHead>
                    <TableHead className="w-[70px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground italic">
                        No active student enrollments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEnrollments.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(e.id)}
                            onCheckedChange={() => toggleSelect(e.id)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs">{e.student_uid}</TableCell>
                        <TableCell className="font-medium text-foreground">{e.student_name_en}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{e.class_combination_name}</TableCell>
                        <TableCell className="font-mono font-medium">{e.roll_no}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="size-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => router.push(`/admin/students/${e.student_uid}`)}>
                                <User className="mr-2 size-4" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 size-4" /> Edit Enrollment
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => setDeleteId(e.id)}
                              >
                                <Trash2 className="mr-2 size-4" /> Delete Enrollment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* right grid: target selector */}
          <div className="space-y-6 rounded-xl border p-6 bg-card shadow-sm h-fit">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Promotion Configuration</h3>
              <p className="text-xs text-muted-foreground">
                Choose the target academic class combination to promote selected students into.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target_config">Target Combination</Label>
                <select
                  id="target_config"
                  value={targetConfigId}
                  onChange={(e) => setTargetConfigId(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select Target Combo</option>
                  {classConfigs
                    .filter((cc) => cc.is_active)
                    .map((cc) => {
                      const label = [
                        cc.session_name,
                        cc.version_name,
                        cc.shift_name,
                        cc.class_name,
                        cc.section_name,
                        cc.group_name,
                      ]
                        .filter(Boolean)
                        .join(" › ")
                      return (
                        <option key={cc.id} value={cc.id}>
                          {label}
                        </option>
                      )
                    })}
                </select>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-muted-foreground">Students Selected:</span>
                  <Badge variant="secondary" className="font-semibold">
                    {selectedIds.length}
                  </Badge>
                </div>

                <Button
                  onClick={handleNextStep}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 gap-1.5"
                >
                  Configure Rolls <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6 rounded-xl border p-6 bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b pb-4">
            <Sparkles className="size-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-lg text-foreground">Assign Rolls & Confirm Promotion</h3>
              <p className="text-xs text-muted-foreground">
                Set roll numbers for each student in their new class combination.
              </p>
            </div>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {selectedIds.map((id) => {
              const enrollment = enrollments.find((e) => e.id === id)
              return (
                <div key={id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-lg border bg-muted/40">
                  <div>
                    <h4 className="font-medium text-foreground">{enrollment?.student_name_en}</h4>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      ID: {enrollment?.student_uid} • Old Roll: {enrollment?.roll_no}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Label htmlFor={`roll_${id}`} className="text-xs shrink-0">New Roll:</Label>
                    <Input
                      id={`roll_${id}`}
                      type="number"
                      min="1"
                      className="w-24 h-9"
                      value={rollMappings[id] || ""}
                      onChange={(e) => handleRollChange(id, e.target.value)}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handlePromote}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
            >
              <CheckCircle2 className="size-4" /> {isSubmitting ? "Promoting..." : "Confirm Promotion"}
            </Button>
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this enrollment record. If this is the student's only enrollment, the student profile will also be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Enrollment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
