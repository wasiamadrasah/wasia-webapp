"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { addSubjectTeacherAction, removeSubjectTeacherAction } from "@/app/admin/academics/actions"
import type { SubjectTeacherRecord, ClassSubjectRecord } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, UserPlus } from "lucide-react"

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

interface SubjectTeachersManagerProps {
  configId: string
  assignments: SubjectTeacherRecord[]
  assignedSubjects: ClassSubjectRecord[]
  teachers: { id: string; name: string }[]
}

export function SubjectTeachersManager({
  configId,
  assignments,
  assignedSubjects,
  teachers,
}: SubjectTeachersManagerProps) {
  const router = useRouter()
  const [selectedSubjectId, setSelectedSubjectId] = React.useState("")
  const [selectedTeacherId, setSelectedTeacherId] = React.useState("")
  const [assignmentType, setAssignmentType] = React.useState<"full" | "theory" | "practical">("full")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isRemovingId, setIsRemovingId] = React.useState<string | null>(null)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubjectId || !selectedTeacherId || !assignmentType) return

    setIsSubmitting(true)
    setErrorMsg(null)
    try {
      await addSubjectTeacherAction(configId, selectedSubjectId, selectedTeacherId, assignmentType)
      setSelectedSubjectId("")
      setSelectedTeacherId("")
      setAssignmentType("full")
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to assign teacher")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async (id: string) => {
    setIsRemovingId(id)
    setErrorMsg(null)
    try {
      await removeSubjectTeacherAction(id, configId)
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to remove teacher assignment")
    } finally {
      setIsRemovingId(null)
    }
  }

  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Subject Teachers Mappings</CardTitle>
        <CardDescription>
          Assign teachers to specific subjects for this class. Multiple teachers can be assigned to the same subject (e.g. for theory vs. practical parts).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left/Middle: Table of Teacher Assignments */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Current Teacher Assignments ({assignments.length})
            </h3>
            <div className="rounded-xl border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length > 0 ? (
                    assignments.map((asm) => (
                      <TableRow key={asm.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {asm.subject_name || "Unnamed"}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {asm.subject_code}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-foreground">
                            {asm.teacher_name || "Unnamed Teacher"}
                          </span>
                        </TableCell>
                        <TableCell className="capitalize">
                          {asm.assignment_type === "full" ? (
                            <Badge className="bg-blue-500 hover:bg-blue-600">Full</Badge>
                          ) : asm.assignment_type === "theory" ? (
                            <Badge className="bg-purple-500 hover:bg-purple-600">Theory Only</Badge>
                          ) : (
                            <Badge className="bg-amber-500 hover:bg-amber-600">Practical Only</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              disabled={isRemovingId === asm.id}
                              onClick={() => handleRemove(asm.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">
                        No teachers assigned yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right: Assign Teacher Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Assign Teacher to Subject
            </h3>
            <form onSubmit={handleAssign} className="rounded-xl border p-4 bg-muted/30 space-y-4">
              {/* Subject Select */}
              <div className="space-y-2">
                <Label htmlFor="subject_select_teacher">Subject <span className="text-red-500">*</span></Label>
                <select
                  id="subject_select_teacher"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">Select Subject</option>
                  {assignedSubjects.map((cs) => (
                    <option key={cs.subject_id} value={cs.subject_id}>
                      {cs.subject_name} ({cs.subject_code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Teacher Select */}
              <div className="space-y-2">
                <Label htmlFor="teacher_select">Teacher <span className="text-red-500">*</span></Label>
                <select
                  id="teacher_select"
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignment Type Select */}
              <div className="space-y-2">
                <Label htmlFor="assignment_type_select">Assignment Type <span className="text-red-500">*</span></Label>
                <select
                  id="assignment_type_select"
                  value={assignmentType}
                  onChange={(e) => setAssignmentType(e.target.value as any)}
                  className={selectClass}
                  required
                >
                  <option value="full">Full Subject (Theory & Practical)</option>
                  <option value="theory">Theory Only</option>
                  <option value="practical">Practical Only</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !selectedSubjectId || !selectedTeacherId}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              >
                <UserPlus className="mr-2 size-4" />
                {isSubmitting ? "Assigning..." : "Assign Teacher"}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
