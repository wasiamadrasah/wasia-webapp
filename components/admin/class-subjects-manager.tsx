"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { addClassSubjectAction, removeClassSubjectAction, updateClassSubjectAction, copyClassSubjectsAction } from "@/app/admin/academics/actions"
import { toast } from "@/components/ui/sonner"
import type { ClassSubjectRecord, SubjectRecord, AcademicClassConfigRecord } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Trash2,
  BookPlus,
  Settings2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  FileSpreadsheet,
  Link2,
  Copy,
} from "lucide-react"

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

interface ClassSubjectsManagerProps {
  configId: string
  assignedSubjects: ClassSubjectRecord[]
  allSubjects: SubjectRecord[]
  otherConfigs?: AcademicClassConfigRecord[]
  currentConfig?: AcademicClassConfigRecord
}

export function ClassSubjectsManager({
  configId,
  assignedSubjects,
  allSubjects,
  otherConfigs = [],
  currentConfig,
}: ClassSubjectsManagerProps) {
  const router = useRouter()
  const [selectedSubjectId, setSelectedSubjectId] = React.useState("")
  const [isOptional, setIsOptional] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isRemovingId, setIsRemovingId] = React.useState<string | null>(null)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  // Copy Config state
  const [isCopyDialogOpen, setIsCopyDialogOpen] = React.useState(false)
  const [selectedSourceConfigId, setSelectedSourceConfigId] = React.useState("")
  const [isCopying, setIsCopying] = React.useState(false)

  // Categorize otherConfigs for Grouping
  const sameGroupConfigs = React.useMemo(() => {
    if (!currentConfig) return []
    return otherConfigs.filter(
      (c) => c.class_id === currentConfig.class_id && c.group_id === currentConfig.group_id
    )
  }, [otherConfigs, currentConfig])

  const sameClassDiffGroupConfigs = React.useMemo(() => {
    if (!currentConfig) return []
    return otherConfigs.filter(
      (c) => c.class_id === currentConfig.class_id && c.group_id !== currentConfig.group_id
    )
  }, [otherConfigs, currentConfig])

  const differentClassConfigs = React.useMemo(() => {
    if (!currentConfig) return otherConfigs
    return otherConfigs.filter((c) => c.class_id !== currentConfig.class_id)
  }, [otherConfigs, currentConfig])

  // Sheet / Edit state
  const [editSubject, setEditSubject] = React.useState<ClassSubjectRecord | null>(null)
  const [editNameOverride, setEditNameOverride] = React.useState("")
  const [editStudentType, setEditStudentType] = React.useState<"mandatory" | "optional" | "religion" | "continuous_assessment" | "choice">("mandatory")
  const [editCountInResult, setEditCountInResult] = React.useState(true)
  const [editPaperGroupCode, setEditPaperGroupCode] = React.useState("")
  const [editSubjectGroups, setEditSubjectGroups] = React.useState<string[]>([])

  // Theory marks state
  const [editHasTheory, setEditHasTheory] = React.useState(true)
  const [editTheoryMarks, setEditTheoryMarks] = React.useState<number>(100)
  const [editTheoryExamMarks, setEditTheoryExamMarks] = React.useState<number>(100)
  const [editHasCqMcq, setEditHasCqMcq] = React.useState(false)
  const [editCqMarks, setEditCqMarks] = React.useState<number>(0)
  const [editMcqMarks, setEditMcqMarks] = React.useState<number>(0)
  const [editTheoryPassMarks, setEditTheoryPassMarks] = React.useState<number>(33)

  // CA marks state
  const [editHasCa, setEditHasCa] = React.useState(false)
  const [editCaMarks, setEditCaMarks] = React.useState<number>(0)
  const [editCaPassMarks, setEditCaPassMarks] = React.useState<number>(0)

  // Practical marks state
  const [editHasPractical, setEditHasPractical] = React.useState(false)
  const [editPracticalMarks, setEditPracticalMarks] = React.useState<number>(0)
  const [editPracticalPassMarks, setEditPracticalPassMarks] = React.useState<number>(0)

  // Overall pass state
  const [editTotalPassMarks, setEditTotalPassMarks] = React.useState<number>(33)

  const [isSavingEdit, setIsSavingEdit] = React.useState(false)

  // Filter out subjects already assigned
  const assignedSubjectIds = React.useMemo(() => {
    return new Set(assignedSubjects.map((s) => s.subject_id))
  }, [assignedSubjects])

  const availableSubjects = React.useMemo(() => {
    return allSubjects.filter((sub) => !assignedSubjectIds.has(sub.id) && sub.is_active)
  }, [allSubjects, assignedSubjectIds])

  // Computed fields
  const computedTotalMarks = React.useMemo(() => {
    let total = 0
    if (editHasTheory) total += editTheoryMarks
    if (editHasCa) total += editCaMarks
    if (editHasPractical) total += editPracticalMarks
    return total
  }, [editHasTheory, editTheoryMarks, editHasCa, editCaMarks, editHasPractical, editPracticalMarks])

  // Validation checks
  const isCqMcqValid = React.useMemo(() => {
    if (!editHasTheory || !editHasCqMcq) return true
    return (editCqMarks + editMcqMarks) === editTheoryMarks
  }, [editHasTheory, editHasCqMcq, editCqMarks, editMcqMarks, editTheoryMarks])

  const showScalingNotice = React.useMemo(() => {
    return editHasTheory && editTheoryExamMarks > 0 && editTheoryMarks > 0 && editTheoryExamMarks !== editTheoryMarks
  }, [editHasTheory, editTheoryExamMarks, editTheoryMarks])

  // Open Sheet with subject's values
  const handleOpenEdit = (cs: ClassSubjectRecord) => {
    setEditSubject(cs)
    setEditNameOverride(cs.subject_name_override ?? "")
    setEditStudentType(cs.student_type)
    setEditCountInResult(cs.count_in_result)
    setEditPaperGroupCode(cs.paper_group_code ?? "")
    setEditSubjectGroups(cs.subject_groups || [])

    setEditHasTheory(cs.has_theory)
    setEditTheoryMarks(cs.theory_marks ?? 100)
    setEditTheoryExamMarks(cs.theory_exam_marks ?? 100)
    setEditHasCqMcq(cs.has_cq_mcq)
    setEditCqMarks(cs.cq_marks ?? 0)
    setEditMcqMarks(cs.mcq_marks ?? 0)
    setEditTheoryPassMarks(cs.theory_pass_marks ?? 33)

    setEditHasCa(cs.ca_marks !== null)
    setEditCaMarks(cs.ca_marks ?? 25)
    setEditCaPassMarks(cs.ca_pass_marks ?? 8)

    setEditHasPractical(cs.has_practical)
    setEditPracticalMarks(cs.practical_marks ?? 25)
    setEditPracticalPassMarks(cs.practical_pass_marks ?? 8)

    setEditTotalPassMarks(cs.total_pass_marks ?? 33)
  }

  // Handle student type change (auto-update result counting for CA type)
  const handleStudentTypeChange = (val: string) => {
    const typedVal = val as "mandatory" | "optional" | "religion" | "continuous_assessment" | "choice"
    setEditStudentType(typedVal)
    if (typedVal === "continuous_assessment") {
      setEditCountInResult(false)
    } else {
      setEditCountInResult(true)
    }
  }

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubjectId) return

    setIsSubmitting(true)
    setErrorMsg(null)
    try {
      await addClassSubjectAction(configId, selectedSubjectId, isOptional)
      setSelectedSubjectId("")
      setIsOptional(false)
      toast.success("Subject assigned successfully")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Failed to assign subject")
      setErrorMsg(err.message || "Failed to assign subject")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subject? This will also clear related teacher assignments.")) {
      return
    }
    setIsRemovingId(id)
    setErrorMsg(null)
    try {
      await removeClassSubjectAction(id, configId)
      toast.success("Subject removed successfully")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Failed to remove subject")
      setErrorMsg(err.message || "Failed to remove subject")
    } finally {
      setIsRemovingId(null)
    }
  }

  const handleSaveEdit = async () => {
    if (!editSubject) return
    if (!isCqMcqValid) return

    setIsSavingEdit(true)
    setErrorMsg(null)
    try {
      await updateClassSubjectAction(editSubject.id, configId, {
        subject_name_override: editNameOverride.trim() || null,
        student_type: editStudentType,
        count_in_result: editCountInResult,
        paper_group_code: editPaperGroupCode.trim() || null,
        subject_groups: editSubjectGroups,
        has_theory: editHasTheory,
        theory_marks: editHasTheory ? editTheoryMarks : null,
        theory_exam_marks: editHasTheory ? editTheoryExamMarks : null,
        has_cq_mcq: editHasTheory && editHasCqMcq,
        cq_marks: editHasTheory && editHasCqMcq ? editCqMarks : null,
        mcq_marks: editHasTheory && editHasCqMcq ? editMcqMarks : null,
        theory_pass_marks: editHasTheory ? editTheoryPassMarks : null,
        ca_marks: editHasCa ? editCaMarks : null,
        ca_pass_marks: editHasCa ? editCaPassMarks : null,
        has_practical: editHasPractical,
        practical_marks: editHasPractical ? editPracticalMarks : null,
        practical_pass_marks: editHasPractical ? editPracticalPassMarks : null,
        total_pass_marks: editTotalPassMarks,
      })
      setEditSubject(null)
      toast.success("Configuration updated successfully")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Failed to update configuration")
      setErrorMsg(err.message || "Failed to update configuration")
    } finally {
      setIsSavingEdit(false)
    }
  }

  const handleCopyConfig = async () => {
    if (!selectedSourceConfigId) return
    setIsCopying(true)
    setErrorMsg(null)
    try {
      const res = await copyClassSubjectsAction(selectedSourceConfigId, configId)
      if (res.success) {
        toast.success("Subject configuration copied successfully")
        setIsCopyDialogOpen(false)
        router.refresh()
      } else {
        toast.error(res.error || "Failed to copy subject configuration")
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred")
    } finally {
      setIsCopying(false)
    }
  }

  // Group paper code categories
  const groupedSubjectsMap = React.useMemo(() => {
    const groups: Record<string, ClassSubjectRecord[]> = {}
    const ungrouped: ClassSubjectRecord[] = []

    assignedSubjects.forEach(s => {
      if (s.paper_group_code) {
        if (!groups[s.paper_group_code]) {
          groups[s.paper_group_code] = []
        }
        groups[s.paper_group_code].push(s)
      } else {
        ungrouped.push(s)
      }
    })

    return { groups, ungrouped }
  }, [assignedSubjects])

  return (
    <Card className="shadow-md border border-blue-100 dark:border-blue-950">
      <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/10 dark:from-blue-950/20 dark:to-transparent border-b border-blue-100 dark:border-blue-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <FileSpreadsheet className="size-5 text-blue-600" />
            Academic Subjects Setup
          </CardTitle>
          <CardDescription>
            Customize class-specific syllabuses, paper groups, student types, and marks distribution.
          </CardDescription>
        </div>

        {otherConfigs && otherConfigs.length > 0 && (
          <Dialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/30 gap-1.5">
                <Copy className="size-3.5" />
                Copy Config
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Copy Subject Configuration</DialogTitle>
                <DialogDescription>
                  Select another class configuration in the same session to copy its assigned subjects, marks distribution, and paper groups.
                  <span className="text-red-600 dark:text-red-400 font-semibold block mt-1">Warning: This will overwrite any subjects currently assigned to this class configuration!</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="source-config" className="text-sm font-medium">Source Configuration</Label>
                  <select
                    id="source-config"
                    value={selectedSourceConfigId}
                    onChange={(e) => setSelectedSourceConfigId(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select class configuration...</option>
                    {sameGroupConfigs.length > 0 && (
                      <optgroup label={`Same Class & Same Group (${currentConfig?.class_name} › ${currentConfig?.group_name || "No Group"})`}>
                        {sameGroupConfigs.map((c) => {
                          const label = [
                            c.version_name,
                            c.shift_name,
                            c.section_name
                          ]
                            .filter(Boolean)
                            .join(" › ")
                          return (
                            <option key={c.id} value={c.id}>
                              {label || "Default Section"}
                            </option>
                          )
                        })}
                      </optgroup>
                    )}
                    {sameClassDiffGroupConfigs.length > 0 && (
                      <optgroup label="Same Class, Different Groups">
                        {sameClassDiffGroupConfigs.map((c) => {
                          const label = [
                            c.version_name,
                            c.shift_name,
                            c.section_name,
                            c.group_name
                          ]
                            .filter(Boolean)
                            .join(" › ")
                          return (
                            <option key={c.id} value={c.id}>
                              {label}
                            </option>
                          )
                        })}
                      </optgroup>
                    )}
                    {differentClassConfigs.length > 0 && (
                      <optgroup label="Other Classes">
                        {differentClassConfigs.map((c) => {
                          const label = [
                            c.class_name,
                            c.version_name,
                            c.shift_name,
                            c.section_name,
                            c.group_name
                          ]
                            .filter(Boolean)
                            .join(" › ")
                          return (
                            <option key={c.id} value={c.id}>
                              {label}
                            </option>
                          )
                        })}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCopyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCopyConfig}
                  disabled={!selectedSourceConfigId || isCopying}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isCopying ? "Copying..." : "Copy Configuration"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 px-4 py-3 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left/Middle: Table of Assigned Subjects */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xs text-blue-900 dark:text-blue-200 uppercase tracking-widest flex items-center gap-1.5">
                Assigned Subjects ({assignedSubjects.length})
              </h3>
            </div>

            <div className="rounded-xl border border-blue-100 dark:border-blue-950 overflow-hidden bg-card shadow-sm">
              <Table>
                <TableHeader className="bg-blue-50/50 dark:bg-blue-950/20">
                  <TableRow className="border-blue-100 dark:border-blue-950 hover:bg-transparent">
                    <TableHead className="font-semibold text-blue-950 dark:text-blue-100">Subject / Override</TableHead>
                    <TableHead className="font-semibold text-blue-950 dark:text-blue-100 w-[120px]">Assignment</TableHead>
                    <TableHead className="font-semibold text-blue-950 dark:text-blue-100 w-[110px]">Paper Group</TableHead>
                    <TableHead className="font-semibold text-blue-950 dark:text-blue-100 text-center w-[180px]">Marks Config</TableHead>
                    <TableHead className="w-[100px] text-right font-semibold text-blue-950 dark:text-blue-100">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedSubjects.length > 0 ? (
                    <>
                      {/* 1. Paper Group Sections */}
                      {Object.entries(groupedSubjectsMap.groups).map(([groupCode, list]) => {
                        const totalGroupMarks = list.reduce((sum, item) => {
                          let itemTotal = 0
                          if (item.has_theory) itemTotal += item.theory_marks ?? 0
                          if (item.ca_marks !== null) itemTotal += item.ca_marks
                          if (item.has_practical) itemTotal += item.practical_marks ?? 0
                          return sum + itemTotal
                        }, 0)

                        return (
                          <React.Fragment key={groupCode}>
                            <TableRow className="bg-blue-50/30 dark:bg-blue-950/10 border-blue-100 dark:border-blue-950 hover:bg-blue-50/30 dark:hover:bg-blue-950/10">
                              <TableCell colSpan={5} className="py-2 px-4 font-bold text-xs text-blue-800 dark:text-blue-300">
                                <div className="flex items-center gap-1.5">
                                  <Link2 className="size-3 text-blue-600" />
                                  <span>📎 Group Code: {groupCode}</span>
                                  <span className="font-normal text-muted-foreground ml-2">({list.length} papers combined, total {totalGroupMarks} marks = 100%)</span>
                                </div>
                              </TableCell>
                            </TableRow>
                            {list.map((cs) => {
                              const calculatedTotal = (cs.has_theory ? (cs.theory_marks ?? 0) : 0) + (cs.ca_marks ?? 0) + (cs.has_practical ? (cs.practical_marks ?? 0) : 0)
                              return (
                                <TableRow key={cs.id} className="border-blue-100 dark:border-blue-950 hover:bg-blue-50/10 dark:hover:bg-blue-950/5 pl-4">
                                  <TableCell className="pl-6">
                                    <div className="font-semibold text-foreground">
                                      {cs.subject_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                                      <span>{cs.subject_code}</span>
                                      {cs.subject_name_bn && <span>• {cs.subject_name_bn}</span>}
                                      {cs.subject_name_override && (
                                        <Badge variant="outline" className="text-[10px] px-1 py-0 border-blue-200 text-blue-700 bg-blue-50/50">
                                          Override: &ldquo;{cs.subject_name_override}&rdquo;
                                        </Badge>
                                      )}
                                    </div>
                                    {cs.subject_groups && cs.subject_groups.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {cs.subject_groups.map((g) => (
                                          <Badge key={g} variant="secondary" className="text-[9px] px-1 py-0 uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-200">
                                            {g}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {cs.student_type === "mandatory" ? (
                                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs">🔵 Mandatory</Badge>
                                    ) : cs.student_type === "optional" ? (
                                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs">🟡 Optional</Badge>
                                    ) : cs.student_type === "choice" ? (
                                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border border-orange-200 text-xs">🟠 Group Choice</Badge>
                                    ) : cs.student_type === "religion" ? (
                                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs">🟢 Religion</Badge>
                                    ) : (
                                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border border-purple-200 text-xs">🟣 CA Only</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900">{groupCode}</span>
                                  </TableCell>
                                  <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                    <div className="flex flex-col gap-0.5">
                                      <div className="font-bold text-foreground">Total: {calculatedTotal} (Pass: {cs.total_pass_marks ?? "-"})</div>
                                      <div className="text-[10px]">
                                        {cs.has_theory && `Theory: ${cs.theory_marks}`}
                                        {cs.ca_marks !== null && ` | CA: ${cs.ca_marks}`}
                                        {cs.has_practical && ` | Prac: ${cs.practical_marks}`}
                                      </div>
                                      {cs.has_cq_mcq && (
                                        <div className="text-[9px] text-muted-foreground">
                                          (Split CQ: {cs.cq_marks} / MCQ: {cs.mcq_marks})
                                        </div>
                                      )}
                                      {!cs.count_in_result && (
                                        <Badge variant="outline" className="text-[9px] text-red-500 border-red-200 bg-red-50/50 mt-1 self-center">
                                          Excluded from GPA
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-900 dark:text-blue-400 dark:bg-blue-950/20"
                                        onClick={() => handleOpenEdit(cs)}
                                      >
                                        <Settings2 className="size-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                        disabled={isRemovingId === cs.id}
                                        onClick={() => handleRemove(cs.id)}
                                      >
                                        <Trash2 className="size-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </React.Fragment>
                        )
                      })}

                      {/* 2. Ungrouped Section */}
                      {groupedSubjectsMap.ungrouped.length > 0 && (
                        <>
                          {Object.keys(groupedSubjectsMap.groups).length > 0 && (
                            <TableRow className="bg-slate-50/50 dark:bg-slate-900/10 border-blue-100 dark:border-blue-950">
                              <TableCell colSpan={5} className="py-2 px-4 font-bold text-xs text-muted-foreground">
                                📚 Individual Subjects
                              </TableCell>
                            </TableRow>
                          )}
                          {groupedSubjectsMap.ungrouped.map((cs) => {
                            const calculatedTotal = (cs.has_theory ? (cs.theory_marks ?? 0) : 0) + (cs.ca_marks ?? 0) + (cs.has_practical ? (cs.practical_marks ?? 0) : 0)
                            return (
                              <TableRow key={cs.id} className="border-blue-100 dark:border-blue-950 hover:bg-blue-50/10 dark:hover:bg-blue-950/5">
                                <TableCell>
                                  <div className="font-semibold text-foreground">
                                    {cs.subject_name}
                                  </div>
                                  <div className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                                    <span>{cs.subject_code}</span>
                                    {cs.subject_name_bn && <span>• {cs.subject_name_bn}</span>}
                                    {cs.subject_name_override && (
                                      <Badge variant="outline" className="text-[10px] px-1 py-0 border-blue-200 text-blue-700 bg-blue-50/50">
                                        Override: &ldquo;{cs.subject_name_override}&rdquo;
                                      </Badge>
                                    )}
                                  </div>
                                  {cs.subject_groups && cs.subject_groups.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {cs.subject_groups.map((g) => (
                                        <Badge key={g} variant="secondary" className="text-[9px] px-1 py-0 uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-200">
                                          {g}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {cs.student_type === "mandatory" ? (
                                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs">🔵 Mandatory</Badge>
                                  ) : cs.student_type === "optional" ? (
                                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs">🟡 Optional</Badge>
                                  ) : cs.student_type === "choice" ? (
                                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border border-orange-200 text-xs">🟠 Group Choice</Badge>
                                  ) : cs.student_type === "religion" ? (
                                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs">🟢 Religion</Badge>
                                  ) : (
                                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border border-purple-200 text-xs">🟣 CA Only</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <span className="text-muted-foreground text-xs italic">—</span>
                                </TableCell>
                                <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                  <div className="flex flex-col gap-0.5">
                                    <div className="font-bold text-foreground">Total: {calculatedTotal} (Pass: {cs.total_pass_marks ?? "-"})</div>
                                    <div className="text-[10px]">
                                      {cs.has_theory && `Theory: ${cs.theory_marks}`}
                                      {cs.ca_marks !== null && ` | CA: ${cs.ca_marks}`}
                                      {cs.has_practical && ` | Prac: ${cs.practical_marks}`}
                                    </div>
                                    {cs.has_cq_mcq && (
                                      <div className="text-[9px] text-muted-foreground">
                                        (Split CQ: {cs.cq_marks} / MCQ: {cs.mcq_marks})
                                      </div>
                                    )}
                                    {!cs.count_in_result && (
                                      <Badge variant="outline" className="text-[9px] text-red-500 border-red-200 bg-red-50/50 mt-1 self-center">
                                        Excluded from GPA
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-900 dark:text-blue-400 dark:bg-blue-950/20"
                                      onClick={() => handleOpenEdit(cs)}
                                    >
                                      <Settings2 className="size-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                      disabled={isRemovingId === cs.id}
                                      onClick={() => handleRemove(cs.id)}
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </>
                      )}
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                        No subjects assigned yet. Please assign a subject using the tool on the right.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right: Assign Subject Form */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs text-blue-900 dark:text-blue-200 uppercase tracking-widest">
              Assign New Subject
            </h3>
            <form onSubmit={handleAssign} className="rounded-xl border border-blue-100 dark:border-blue-950 p-4 bg-blue-50/10 dark:bg-blue-950/5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject_select" className="text-sm font-medium">Subject <span className="text-red-500">*</span></Label>
                <select
                  id="subject_select"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">Select Subject</option>
                  {availableSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} {sub.name_bn ? `(${sub.name_bn})` : ""} [{sub.code}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="is_optional_check"
                  checked={isOptional}
                  onCheckedChange={(checked) => setIsOptional(!!checked)}
                />
                <Label htmlFor="is_optional_check" className="cursor-pointer text-sm font-medium">
                  Default as Optional Subject
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !selectedSubjectId}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2 shadow"
              >
                <BookPlus className="size-4" />
                {isSubmitting ? "Assigning..." : "Assign Subject"}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>

      {/* Radical Configuration Slide-Out Panel (Radix Sheet) */}
      <Sheet open={!!editSubject} onOpenChange={(open) => { if (!open) setEditSubject(null) }}>
        <SheetContent className="sm:max-w-md overflow-y-auto w-full h-full flex flex-col justify-start border-l border-blue-100 dark:border-blue-950 p-0">
          <SheetHeader className="p-6 border-b border-blue-100 dark:border-blue-950 bg-blue-50/20 dark:bg-blue-950/10">
            <SheetTitle className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Settings2 className="size-5 text-blue-600" />
              Configure Subject Marks
            </SheetTitle>
            <SheetDescription>
              Modify marks distribution, pass marks, and other configurations for &ldquo;{editSubject?.subject_name}&rdquo;.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Step 1 — Basic Settings */}
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-blue-900 dark:text-blue-200 uppercase tracking-wider border-b border-blue-100 dark:border-blue-950 pb-1">
                Step 1: General Settings
              </h4>

              {/* Name Override */}
              <div className="space-y-1.5">
                <Label htmlFor="name_override" className="text-xs font-semibold">Subject Name Override</Label>
                <Input
                  id="name_override"
                  value={editNameOverride}
                  onChange={(e) => setEditNameOverride(e.target.value)}
                  placeholder="e.g. English 1st Paper (leave blank for default)"
                  className="h-9 border-blue-200 dark:border-blue-900"
                />
              </div>

              {/* Student Type */}
              <div className="space-y-1.5">
                <Label htmlFor="student_type_select" className="text-xs font-semibold">Student Assignment Type</Label>
                <select
                  id="student_type_select"
                  value={editStudentType}
                  onChange={(e) => handleStudentTypeChange(e.target.value)}
                  className="h-9 w-full rounded-lg border border-blue-200 dark:border-blue-900 bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="mandatory">Mandatory (all students take it)</option>
                  <option value="optional">Optional (elective list selection)</option>
                  <option value="choice">Choice (student selects as compulsory or optional/4th subject)</option>
                  <option value="religion">Religion (assigned based on student religion)</option>
                  <option value="continuous_assessment">Continuous Assessment (not counted in GPAs)</option>
                </select>
                {editStudentType === "continuous_assessment" && (
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium leading-normal flex items-start gap-1">
                    <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                    <span>CA-only subjects are usually excluded from GPA calculations. Result counting has been disabled.</span>
                  </p>
                )}
              </div>

              {/* Result Count and Paper Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between border border-blue-100 dark:border-blue-950 rounded-lg p-2.5 bg-blue-50/10 dark:bg-blue-950/5">
                  <div className="space-y-0.5">
                    <Label htmlFor="count_result_toggle" className="text-xs font-semibold cursor-pointer">Count in Result?</Label>
                    <p className="text-[10px] text-muted-foreground">Include in final GPA calculations.</p>
                  </div>
                  <Switch
                    id="count_result_toggle"
                    checked={editCountInResult}
                    onCheckedChange={setEditCountInResult}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="paper_group_input" className="text-xs font-semibold">Paper Group Code</Label>
                  <Input
                    id="paper_group_input"
                    value={editPaperGroupCode}
                    onChange={(e) => setEditPaperGroupCode(e.target.value)}
                    placeholder="e.g. BANGLA (leave blank for none)"
                    className="h-9 font-mono text-xs border-blue-200 dark:border-blue-900 uppercase"
                  />
                  <p className="text-[9px] text-muted-foreground">Same code groups Bangla-I & Bangla-II into 1 subject in results.</p>
                </div>
              </div>

              {/* Subject Groups Checklist */}
              <div className="space-y-1.5 border border-indigo-100 dark:border-indigo-950 rounded-xl p-3 bg-indigo-50/10 dark:bg-indigo-950/5">
                <Label className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">Target Academic Groups</Label>
                <p className="text-[10px] text-muted-foreground mb-2">Specify which groups take this subject (e.g. Science, Business, Humanities). If unselected, it will act as a general compulsory/optional subject.</p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: "science", name: "Science" },
                    { id: "business", name: "Business Studies" },
                    { id: "humanities", name: "Humanities" },
                  ].map((g) => {
                    const isChecked = editSubjectGroups.includes(g.id)
                    return (
                      <div key={g.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`group_${g.id}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setEditSubjectGroups((prev) => [...prev, g.id])
                            } else {
                              setEditSubjectGroups((prev) => prev.filter((item) => item !== g.id))
                            }
                          }}
                        />
                        <Label htmlFor={`group_${g.id}`} className="text-xs cursor-pointer select-none">
                          {g.name}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Step 2 — Marks Configuration */}
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-blue-900 dark:text-blue-200 uppercase tracking-wider border-b border-blue-100 dark:border-blue-950 pb-1">
                Step 2: Marks Configuration
              </h4>

              {/* A. Theory marks section */}
              <div className="border border-blue-100 dark:border-blue-950 rounded-xl p-3 bg-blue-50/10 dark:bg-blue-950/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="has_theory_check"
                      checked={editHasTheory}
                      onCheckedChange={(checked) => setEditHasTheory(!!checked)}
                    />
                    <Label htmlFor="has_theory_check" className="text-xs font-bold cursor-pointer">Theory Component</Label>
                  </div>
                </div>

                {editHasTheory && (
                  <div className="space-y-3 pt-1 border-t border-blue-100/50 dark:border-blue-900/20">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="theory_marks_input" className="text-[11px] font-semibold">Theory Marks (result contrib)</Label>
                        <Input
                          id="theory_marks_input"
                          type="number"
                          value={editTheoryMarks}
                          onChange={(e) => setEditTheoryMarks(parseInt(e.target.value) || 0)}
                          className="h-8 text-xs border-blue-200 dark:border-blue-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="theory_exam_input" className="text-[11px] font-semibold">Exam Paper Marks (total)</Label>
                        <Input
                          id="theory_exam_input"
                          type="number"
                          value={editTheoryExamMarks}
                          onChange={(e) => setEditTheoryExamMarks(parseInt(e.target.value) || 0)}
                          className="h-8 text-xs border-blue-200 dark:border-blue-900"
                        />
                      </div>
                    </div>

                    {showScalingNotice && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium leading-normal flex items-start gap-1">
                        <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                        <span>Exam score out of {editTheoryExamMarks} will be scaled down/up to a maximum contribution of {editTheoryMarks} marks.</span>
                      </p>
                    )}

                    {/* CQ / MCQ Split */}
                    <div className="space-y-2 border-t border-blue-100/30 dark:border-blue-900/10 pt-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="has_cq_mcq_check"
                          checked={editHasCqMcq}
                          onCheckedChange={(checked) => setEditHasCqMcq(!!checked)}
                        />
                        <Label htmlFor="has_cq_mcq_check" className="text-[11px] font-semibold cursor-pointer">Split Theory into CQ & MCQ</Label>
                      </div>

                      {editHasCqMcq && (
                        <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-blue-300 dark:border-blue-800">
                          <div className="space-y-1">
                            <Label htmlFor="cq_marks_input" className="text-[10px] font-semibold">CQ Marks</Label>
                            <Input
                              id="cq_marks_input"
                              type="number"
                              value={editCqMarks}
                              onChange={(e) => setEditCqMarks(parseInt(e.target.value) || 0)}
                              className="h-7 text-xs border-blue-200 dark:border-blue-900"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="mcq_marks_input" className="text-[10px] font-semibold">MCQ Marks</Label>
                            <Input
                              id="mcq_marks_input"
                              type="number"
                              value={editMcqMarks}
                              onChange={(e) => setEditMcqMarks(parseInt(e.target.value) || 0)}
                              className="h-7 text-xs border-blue-200 dark:border-blue-900"
                            />
                          </div>
                        </div>
                      )}

                      {editHasCqMcq && !isCqMcqValid && (
                        <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold leading-normal flex items-start gap-1">
                          <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                          <span>CQ ({editCqMarks}) + MCQ ({editMcqMarks}) = {editCqMarks + editMcqMarks}. It must sum up exactly to the theory contribution ({editTheoryMarks}).</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1 pt-1">
                      <Label htmlFor="theory_pass_input" className="text-[11px] font-semibold">Theory Pass Marks</Label>
                      <Input
                        id="theory_pass_input"
                        type="number"
                        value={editTheoryPassMarks}
                        onChange={(e) => setEditTheoryPassMarks(parseInt(e.target.value) || 0)}
                        className="h-8 text-xs border-blue-200 dark:border-blue-900 w-1/2"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* B. Class Assessment (CA) section */}
              <div className="border border-blue-100 dark:border-blue-950 rounded-xl p-3 bg-blue-50/10 dark:bg-blue-950/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="has_ca_check"
                    checked={editHasCa}
                    onCheckedChange={(checked) => setEditHasCa(!!checked)}
                  />
                  <Label htmlFor="has_ca_check" className="text-xs font-bold cursor-pointer">Class Assessment (CA) Component</Label>
                </div>

                {editHasCa && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-100/50 dark:border-blue-900/20">
                    <div className="space-y-1">
                      <Label htmlFor="ca_marks_input" className="text-[11px] font-semibold">CA Marks</Label>
                      <Input
                        id="ca_marks_input"
                        type="number"
                        value={editCaMarks}
                        onChange={(e) => setEditCaMarks(parseInt(e.target.value) || 0)}
                        className="h-8 text-xs border-blue-200 dark:border-blue-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="ca_pass_input" className="text-[11px] font-semibold">CA Pass Marks</Label>
                      <Input
                        id="ca_pass_input"
                        type="number"
                        value={editCaPassMarks}
                        onChange={(e) => setEditCaPassMarks(parseInt(e.target.value) || 0)}
                        className="h-8 text-xs border-blue-200 dark:border-blue-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* C. Practical marks section */}
              <div className="border border-blue-100 dark:border-blue-950 rounded-xl p-3 bg-blue-50/10 dark:bg-blue-950/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="has_practical_check"
                    checked={editHasPractical}
                    onCheckedChange={(checked) => setEditHasPractical(!!checked)}
                  />
                  <Label htmlFor="has_practical_check" className="text-xs font-bold cursor-pointer">Practical Component</Label>
                </div>

                {editHasPractical && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-100/50 dark:border-blue-900/20">
                    <div className="space-y-1">
                      <Label htmlFor="practical_marks_input" className="text-[11px] font-semibold">Practical Marks</Label>
                      <Input
                        id="practical_marks_input"
                        type="number"
                        value={editPracticalMarks}
                        onChange={(e) => setEditPracticalMarks(parseInt(e.target.value) || 0)}
                        className="h-8 text-xs border-blue-200 dark:border-blue-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="practical_pass_input" className="text-[11px] font-semibold">Practical Pass Marks</Label>
                      <Input
                        id="practical_pass_input"
                        type="number"
                        value={editPracticalPassMarks}
                        onChange={(e) => setEditPracticalPassMarks(parseInt(e.target.value) || 0)}
                        className="h-8 text-xs border-blue-200 dark:border-blue-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Total Computed Marks and Overall Pass marks */}
              <div className="border-2 border-blue-600/30 rounded-xl p-4 bg-blue-50/30 dark:bg-blue-950/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Total Marks (computed):</span>
                  <Badge className="bg-blue-600 text-white font-mono text-sm px-2.5 py-0.5">{computedTotalMarks}</Badge>
                </div>

                <div className="space-y-1 pt-2 border-t border-blue-200/50 dark:border-blue-800/40">
                  <Label htmlFor="total_pass_input" className="text-xs font-bold">Overall Pass Marks</Label>
                  <Input
                    id="total_pass_input"
                    type="number"
                    value={editTotalPassMarks}
                    onChange={(e) => setEditTotalPassMarks(parseInt(e.target.value) || 0)}
                    className="h-8 text-xs border-blue-400 dark:border-blue-700 font-bold"
                  />
                  <p className="text-[9px] text-muted-foreground mt-0.5">Overall minimum score needed to pass this subject.</p>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="p-4 border-t border-blue-100 dark:border-blue-950 bg-blue-50/10 dark:bg-blue-950/5 flex flex-row gap-2 shrink-0">
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => setEditSubject(null)}
            >
              Cancel
            </Button>
            <Button
              disabled={isSavingEdit || !isCqMcqValid}
              onClick={handleSaveEdit}
              className="w-1/2 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-1.5"
            >
              {isSavingEdit ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckCircle className="size-4" />
                  <span>Save Config</span>
                </>
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Card>
  )
}
