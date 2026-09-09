"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { quickAddStudentsAction } from "@/app/admin/students/actions"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Users,
  Loader2,
  Sparkles,
  RotateCcw,
} from "lucide-react"
import type { AcademicClassConfigRecord } from "@/lib/db"

interface QuickAddManagerProps {
  classConfigs: AcademicClassConfigRecord[]
}

type QuickRow = {
  name_en: string
  gender: "Male" | "Female" | "Other"
  mobile: string
  roll_no: string
}

const emptyRow = (): QuickRow => ({
  name_en: "",
  gender: "Male",
  mobile: "",
  roll_no: "",
})

export function QuickAddManager({ classConfigs }: QuickAddManagerProps) {
  const router = useRouter()
  const [classConfigId, setClassConfigId] = React.useState("")
  const [rows, setRows] = React.useState<QuickRow[]>([
    emptyRow(),
    emptyRow(),
    emptyRow(),
  ])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [feedback, setFeedback] = React.useState<{ status: "success" | "error"; message: string } | null>(null)

  const activeConfigs = React.useMemo(() => {
    return classConfigs.filter((cc) => cc.is_active)
  }, [classConfigs])

  const handleAddRow = () => {
    setRows((prev) => [...prev, emptyRow()])
  }

  const handleAddMultipleRows = (count: number) => {
    setRows((prev) => [
      ...prev,
      ...Array.from({ length: count }, () => emptyRow()),
    ])
  }

  const handleRemoveRow = (idx: number) => {
    if (rows.length === 1) {
      setRows([emptyRow()])
      return
    }
    setRows((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleReset = () => {
    setRows([emptyRow(), emptyRow(), emptyRow()])
    setFeedback(null)
  }

  const handleChange = (idx: number, field: keyof QuickRow, val: string) => {
    setRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: val } : row))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!classConfigId) {
      setFeedback({ status: "error", message: "Please select an academic class placement combination." })
      return
    }

    const filledRows = rows.filter((r) => r.name_en.trim() || r.mobile.trim() || r.roll_no.trim())
    if (filledRows.length === 0) {
      setFeedback({ status: "error", message: "Please fill in at least one student's information." })
      return
    }

    if (filledRows.some((r) => !r.name_en.trim())) {
      setFeedback({ status: "error", message: "Student Name (English) is required for all entered rows." })
      return
    }

    // Check if any row has an invalid mobile number (must be 11 digits starting with 01 if provided)
    const hasInvalidMobile = filledRows.some(
      (r) => r.mobile.trim() !== "" && !/^01\d{9}$/.test(r.mobile.trim())
    )
    if (hasInvalidMobile) {
      return
    }

    setIsSubmitting(true)
    setFeedback(null)

    try {
      await quickAddStudentsAction(classConfigId, filledRows)
      setFeedback({
        status: "success",
        message: `Successfully created and enrolled ${filledRows.length} student${filledRows.length > 1 ? "s" : ""}!`,
      })
      setRows([emptyRow(), emptyRow(), emptyRow()])
      router.refresh()
    } catch (err) {
      setFeedback({ status: "error", message: err instanceof Error ? err.message : "Failed to add students." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`rounded-xl border p-4 text-sm flex items-start gap-3 transition-all ${
            feedback.status === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
              : "border-destructive/20 bg-destructive/10 text-destructive dark:text-red-400"
          }`}
        >
          {feedback.status === "success" ? (
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="size-5 shrink-0 text-destructive dark:text-red-400 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <p className="font-semibold text-sm">
              {feedback.status === "success" ? "Success" : "Error Occurred"}
            </p>
            <p className="text-xs opacity-90">{feedback.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Academic Placement Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                <BookOpen className="size-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Target Academic Placement</h3>
                <p className="text-xs text-muted-foreground">Select the class, section, and session where students will be enrolled.</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 max-w-xl">
            <Label htmlFor="class_config_id" className="text-sm font-semibold text-foreground">
              Class Placement Combination <span className="text-rose-500">*</span>
            </Label>
            <Select value={classConfigId} onValueChange={setClassConfigId}>
              <SelectTrigger id="class_config_id" className="w-full">
                <SelectValue placeholder="Select Class Combination (Session › Class › Section › Shift › Group)" />
              </SelectTrigger>
              <SelectContent>
                {activeConfigs.map((cc) => {
                  const label = [
                    cc.session_name,
                    cc.class_name,
                    cc.section_name ? `Sec: ${cc.section_name}` : null,
                    cc.shift_name ? `Shift: ${cc.shift_name}` : null,
                    cc.group_name ? `Grp: ${cc.group_name}` : null,
                  ]
                    .filter(Boolean)
                    .join(" › ")
                  return (
                    <SelectItem key={cc.id} value={cc.id}>
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Student Checklist Table Card */}
        <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
          {/* Header Banner */}
          <div className="bg-slate-100/70 dark:bg-slate-800/40 px-6 py-3 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary dark:text-indigo-400 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/90">
                Student Intake Checklist ({rows.length} {rows.length === 1 ? "Row" : "Rows"})
              </h3>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-muted/40 border-b border-border">
                  <TableHead className="text-xs font-bold text-foreground min-w-[240px]">
                    Student Name (English) <span className="text-rose-500">*</span>
                  </TableHead>
                  <TableHead className="text-xs font-bold text-foreground w-[160px]">
                    Gender <span className="text-rose-500">*</span>
                  </TableHead>
                  <TableHead className="text-xs font-bold text-foreground min-w-[190px]">
                    Contact Mobile
                  </TableHead>
                  <TableHead className="text-xs font-bold text-foreground w-[140px]">
                    Roll No (Optional)
                  </TableHead>
                  <TableHead className="w-[60px] text-right text-xs font-bold text-foreground">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => {
                  const isMobileInvalid =
                    row.mobile.trim() !== "" && !/^01\d{9}$/.test(row.mobile.trim())

                  return (
                    <TableRow key={idx} className="hover:bg-muted/20 border-b border-border transition-colors">
                      <TableCell className="py-2.5">
                        <Input
                          placeholder="e.g. Rakib Hasan"
                          value={row.name_en}
                          onChange={(e) => handleChange(idx, "name_en", e.target.value)}
                          required={idx === 0 || row.mobile.trim() !== "" || row.roll_no.trim() !== ""}
                          className="h-9 border-input bg-background text-sm rounded-lg"
                        />
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Select
                          value={row.gender}
                          onValueChange={(val) =>
                            handleChange(idx, "gender", val as "Male" | "Female" | "Other")
                          }
                        >
                          <SelectTrigger size="sm" className="h-9 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Input
                          placeholder="017xxxxxxxx"
                          value={row.mobile}
                          maxLength={11}
                          onChange={(e) => handleChange(idx, "mobile", e.target.value)}
                          className={`h-9 font-mono bg-background text-sm rounded-lg transition-colors ${
                            isMobileInvalid
                              ? "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-500/20 text-rose-600 dark:text-rose-400"
                              : "border-input"
                          }`}
                        />
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Input
                          placeholder="Auto / Roll"
                          type="number"
                          min="1"
                          value={row.roll_no}
                          onChange={(e) => handleChange(idx, "roll_no", e.target.value)}
                          className="h-9 font-mono border-input bg-background text-sm rounded-lg"
                        />
                      </TableCell>
                      <TableCell className="py-2.5 text-right">
                        <Button
                          type="button"
                          size="icon"
                          disabled={rows.length === 1 && !row.name_en && !row.mobile && !row.roll_no}
                          onClick={() => handleRemoveRow(idx)}
                          className="size-8 rounded-lg bg-rose-500 hover:bg-rose-600 text-white shadow-2xs transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        >
                          <Trash2 className="size-4 text-white" />
                          <span className="sr-only">Delete row</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer Actions */}
          <div className="p-4 px-6 bg-muted/20 border-t border-border flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddRow}
                className="h-9 px-3.5 text-sm font-semibold border-border bg-background hover:bg-muted/40 gap-1.5"
              >
                <Plus className="size-4" />
                <span>Add Row</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-9 px-3.5 text-sm font-semibold border-border bg-background hover:bg-muted/40 text-muted-foreground hover:text-foreground gap-1.5"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset</span>
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !classConfigId}
              className="h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-2xs gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Enrolling Students...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Save & Enroll Students</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
