"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Download, 
  Copy, 
  Search, 
  Filter, 
  ChevronRight,
  Printer,
  MoreHorizontal,
  Eye,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { toast } from "@/components/ui/sonner"
import { openStudentReport } from "@/lib/student-report-print"
import type { 
  AcademicSessionRecord, 
  ClassRecord,
  AcademicClassConfigRecord,
  StudentEnrollmentRecord,
  GroupRecord
} from "@/lib/db"

interface StudentQueryManagerProps {
  sessions: AcademicSessionRecord[]
  classes: ClassRecord[]
  classConfigs: AcademicClassConfigRecord[]
  enrollments: StudentEnrollmentRecord[]
  groups: GroupRecord[]
  schoolInfo?: {
    name: string
    address: string
    logoUrl?: string
  }
}

const selectStyle =
  "h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"

export function StudentQueryManager({ sessions, classes, classConfigs, enrollments, groups, schoolInfo }: StudentQueryManagerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Cascading query states
  const [selectedSessionId, setSelectedSessionId] = React.useState(searchParams.get("session_id") || "")
  const [selectedClassId, setSelectedClassId]     = React.useState(searchParams.get("class_id") || "")
  const [selectedGroupId, setSelectedGroupId]     = React.useState(searchParams.get("group_id") || "")
  const [selectedSectionId, setSelectedSectionId] = React.useState(searchParams.get("section_id") || "")
  const [selectedCategory, setSelectedCategory]   = React.useState(searchParams.get("category") || "")
  const [selectedAdmissionType, setSelectedAdmissionType] = React.useState(searchParams.get("admission_type") || "")

  // Table operations
  const [localSearch, setLocalSearch] = React.useState("")
  const [localStatus, setLocalStatus] = React.useState("Active")
  const [pageSize, setPageSize]       = React.useState(100)

  // ── Cascading derived options ─────────────────────────────────────────────

  // Classes available for the selected session
  const availableClasses = React.useMemo(() => {
    if (!selectedSessionId) return classes
    const classIdsInSession = new Set(
      classConfigs
        .filter((cc) => cc.session_id === selectedSessionId)
        .map((cc) => cc.class_id)
    )
    return classes.filter((c) => classIdsInSession.has(c.id))
  }, [selectedSessionId, classes, classConfigs])

  // Groups available for selected session + class
  const availableGroups = React.useMemo(() => {
    if (!selectedClassId) return []
    const cls = classes.find((c) => c.id === selectedClassId)
    if (!cls) return []
    const className = cls.name.toLowerCase()
    const hasGroup =
      className.includes("9") ||
      className.includes("10") ||
      className.includes("nine") ||
      className.includes("ten") ||
      className.includes("ix") ||
      className.includes("x") ||
      className.includes("ssc")

    if (hasGroup) {
      return groups.filter((g) => g.is_active).map((g) => ({ id: g.id, name: g.name }))
    }
    return []
  }, [selectedClassId, classes, groups])

  // Sections available for selected session + class
  const availableSections = React.useMemo(() => {
    const filtered = classConfigs.filter((cc) => {
      const matchSession = selectedSessionId ? cc.session_id === selectedSessionId : true
      const matchClass   = selectedClassId   ? cc.class_id   === selectedClassId   : true
      return matchSession && matchClass && cc.section_id && cc.section_name
    })
    const seen = new Map<string, string>()
    filtered.forEach((cc) => { if (cc.section_id) seen.set(cc.section_id, cc.section_name || cc.section_id) })
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
  }, [selectedSessionId, selectedClassId, classConfigs])

  // Reset downstream when upstream changes
  const handleSessionChange = (v: string) => {
    setSelectedSessionId(v)
    setSelectedClassId(""); setSelectedGroupId(""); setSelectedSectionId("")
  }
  const handleClassChange = (v: string) => {
    setSelectedClassId(v)
    setSelectedGroupId(""); setSelectedSectionId("")
  }
  const handleGroupChange = (v: string) => {
    setSelectedGroupId(v)
    setSelectedSectionId("")
  }

  // ── Visible columns ───────────────────────────────────────────────────────
  const [visibleCols, setVisibleCols] = React.useState({
    pic: false,
    name_bn: true,
    roll: true,
    student_id: true,
    class: true,
    group: true,
    section: true,
    shift: true,
    mobile: true,
    father_name: true,
    mother_name: false,
    gender: true,
    blood_group: false,
    religion: true,
    date_of_birth: false,
    admission_type: false,
    student_category: false,
  })
  const toggleColumn = (key: keyof typeof visibleCols) =>
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }))

  const hasQuery = !!(
    searchParams.get("session_id") ||
    searchParams.get("class_id") ||
    searchParams.get("group_id") ||
    searchParams.get("section_id") ||
    searchParams.get("category") ||
    searchParams.get("admission_type") ||
    searchParams.get("search")
  )

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleGetStudentList = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (selectedSessionId)    params.set("session_id",    selectedSessionId)
    if (selectedClassId)      params.set("class_id",      selectedClassId)
    if (selectedGroupId)      params.set("group_id",      selectedGroupId)
    if (selectedSectionId)    params.set("section_id",    selectedSectionId)
    if (selectedCategory)     params.set("category",      selectedCategory)
    if (selectedAdmissionType) params.set("admission_type", selectedAdmissionType)
    router.push(`/admin/students?${params.toString()}`)
  }

  const handleReset = () => {
    setSelectedSessionId(""); setSelectedClassId(""); setSelectedGroupId("")
    setSelectedSectionId(""); setSelectedCategory(""); setSelectedAdmissionType("")
    router.push("/admin/students")
  }

  // ── Table processing ──────────────────────────────────────────────────────
  const processedEnrollments = React.useMemo(() => {
    return enrollments.filter((e) => {
      if (localStatus === "Active"    && e.enrollment_status !== "Active")    return false
      if (localStatus === "Completed" && e.enrollment_status !== "Completed") return false
      if (localSearch) {
        const q = localSearch.toLowerCase()
        return (
          e.student_name_en?.toLowerCase().includes(q) ||
          e.student_uid?.toLowerCase().includes(q) ||
          e.student_mobile?.includes(q) ||
          e.student_name_bn?.toLowerCase().includes(q)
        )
      }
      return true
    }).slice(0, pageSize)
  }, [enrollments, localStatus, localSearch, pageSize])

  // ── Build report meta from current enrollments / selections ─────────────
  const buildReportMeta = () => {
    const sample = processedEnrollments[0]
    return {
      schoolName:    schoolInfo?.name    || "School Name",
      schoolAddress: schoolInfo?.address || "",
      logoUrl:       schoolInfo?.logoUrl || "/images/system/icon.png",
      sessionName:   sample?.session_name  || undefined,
      className:     sample?.class_name    || undefined,
      groupName:     sample?.group_name    || undefined,
      sectionName:   sample?.section_name  || undefined,
      shiftName:     sample?.shift_name    || undefined,
    }
  }

  // ── PDF download ──────────────────────────────────────────────────────────
  const handleDownloadPDF = () => {
    openStudentReport(processedEnrollments, buildReportMeta(), "pdf")
  }

  // ── Print ─────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    openStudentReport(processedEnrollments, buildReportMeta(), "print")
  }

  const handleCopyToClipboard = () => {
    const headers = ["Student ID", "Full Name", "Roll", "Contact", "Class", "Section"]
    const rows = processedEnrollments.map((e) => [
      e.student_uid, e.student_name_en, e.roll_no, e.student_mobile || "", e.class_name || "", e.section_name || "",
    ])
    navigator.clipboard.writeText([headers.join("\t"), ...rows.map((r) => r.join("\t"))].join("\n"))
    toast("Copied!", { description: "Paste directly into Excel." })
    toast.success("Copied to clipboard! Paste directly into Excel.")
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-muted">
        <Link href="/admin/students/admit" className="px-6 py-3 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-muted">
          List &amp; Add
        </Link>
        <Link href="/admin/students/quick-add" className="px-6 py-3 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-muted">
          Quick Student Add
        </Link>
        <div className="px-6 py-3 text-sm font-bold border-b-2 border-blue-600 text-blue-600 bg-blue-50/20">
          Student List
        </div>
      </div>

      {/* Query Form */}
      <div className="rounded-xl border p-6 bg-card shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Filter className="size-5 text-blue-600" />
          <h2 className="font-bold text-lg text-foreground">Student Query Form</h2>
        </div>

        <form onSubmit={handleGetStudentList} className="space-y-5">
          {/* Row 1: Year → Class → Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="session_select" className="flex items-center gap-1">
                Year <span className="text-red-500">*</span>
              </Label>
              <select
                id="session_select"
                value={selectedSessionId}
                onChange={(e) => handleSessionChange(e.target.value)}
                className={selectStyle}
                required
              >
                <option value="">— Select Year —</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label htmlFor="class_select" className="flex items-center gap-1">
                Class <span className="text-red-500">*</span>
                {selectedSessionId && <ChevronRight className="size-3 text-muted-foreground" />}
              </Label>
              <select
                id="class_select"
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
                className={selectStyle}
                disabled={!selectedSessionId}
                required
              >
                <option value="">— Select Class —</option>
                {availableClasses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Group */}
            <div className="space-y-2">
              <Label htmlFor="group_select" className="flex items-center gap-1">
                Group
                {selectedClassId && availableGroups.length > 0 && <ChevronRight className="size-3 text-muted-foreground" />}
              </Label>
              <select
                id="group_select"
                value={selectedGroupId}
                onChange={(e) => handleGroupChange(e.target.value)}
                className={selectStyle}
                disabled={!selectedClassId || availableGroups.length === 0}
              >
                <option value="">— All Groups —</option>
                {availableGroups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Section → Student Category → Admission Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Section */}
            <div className="space-y-2">
              <Label htmlFor="section_select" className="flex items-center gap-1">
                Section
                {selectedClassId && <ChevronRight className="size-3 text-muted-foreground" />}
              </Label>
              <select
                id="section_select"
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className={selectStyle}
                disabled={!selectedClassId || availableSections.length === 0}
              >
                <option value="">— All Sections —</option>
                {availableSections.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Student Category */}
            <div className="space-y-2">
              <Label htmlFor="category_select">Student Category</Label>
              <select
                id="category_select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={selectStyle}
              >
                <option value="">— All Categories —</option>
                <option value="general">General</option>
                <option value="scholarship">Scholarship</option>
                <option value="quota">Quota</option>
                <option value="special">Special Needs</option>
              </select>
            </div>

            {/* Admission Type */}
            <div className="space-y-2">
              <Label htmlFor="admission_select">Admission Type</Label>
              <select
                id="admission_select"
                value={selectedAdmissionType}
                onChange={(e) => setSelectedAdmissionType(e.target.value)}
                className={selectStyle}
              >
                <option value="">— All Types —</option>
                <option value="new">New Admission</option>
                <option value="promotion">Promotion</option>
                <option value="transfer">Transfer</option>
                <option value="re_admission">Re-Admission</option>
              </select>
            </div>
          </div>

          {/* Column Visibility */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
              Toggle Column Visibility
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 border rounded-xl p-4 bg-muted/20">
              {([
                ["pic", "Photo"], ["name_bn", "বাংলা নাম"], ["roll", "Roll"], ["student_id", "St. ID"],
                ["class", "Class"], ["group", "Group"], ["section", "Section"], ["shift", "Shift"],
                ["mobile", "Mobile"], ["father_name", "Father"], ["gender", "Gender"],
                ["religion", "Religion"], ["date_of_birth", "DOB"], ["admission_type", "Adm. Type"],
                ["student_category", "Category"],
              ] as [keyof typeof visibleCols, string][]).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                  <Checkbox checked={visibleCols[key]} onCheckedChange={() => toggleColumn(key)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 min-w-[180px]"
            >
              Get Student List
            </Button>
            {hasQuery && (
              <Button type="button" variant="outline" onClick={handleReset} className="min-w-[120px]">
                Reset
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Query Results Card */}
      <div className="rounded-xl border p-6 bg-card shadow-sm space-y-4">
        {/* Table top tools mimicking the green/blue buttons */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b pb-4">
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-9 w-20 rounded-lg border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
            </select>

            {hasQuery && processedEnrollments.length > 0 && (
              <>
                <Button
                  onClick={handleDownloadPDF}
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5 h-9"
                >
                  <Download className="size-4" /> Download PDF
                </Button>
                <Button
                  onClick={handlePrint}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 h-9"
                >
                  <Printer className="size-4" /> Print List
                </Button>
                <Button
                  onClick={handleCopyToClipboard}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 h-9"
                >
                  <Copy className="size-4" /> Copy for Excel
                </Button>
              </>
            )}
          </div>

          {/* Table local search & status filter */}
          <div className="flex gap-2 items-center w-full md:w-auto">
            <select
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value)}
              className="h-9 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-1"
            >
              <option value="All">All Students</option>
              <option value="Active">Active Only</option>
              <option value="Completed">Completed Only</option>
            </select>

            <div className="relative w-full md:w-60">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search local rows..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                {visibleCols.pic && <TableHead>Photo</TableHead>}
                <TableHead>Full Name</TableHead>
                {visibleCols.name_bn && <TableHead>বাংলা নাম</TableHead>}
                {visibleCols.roll && <TableHead>Roll</TableHead>}
                {visibleCols.student_id && <TableHead>Student ID</TableHead>}
                {visibleCols.class && <TableHead>Class</TableHead>}
                {visibleCols.group && <TableHead>Group</TableHead>}
                {visibleCols.section && <TableHead>Section</TableHead>}
                {visibleCols.shift && <TableHead>Shift</TableHead>}
                {visibleCols.mobile && <TableHead>Contact Number</TableHead>}
                {visibleCols.gender && <TableHead>Gender</TableHead>}
                {visibleCols.religion && <TableHead>Religion</TableHead>}
                {visibleCols.date_of_birth && <TableHead>Date of Birth</TableHead>}
                {visibleCols.admission_type && <TableHead>Admission Type</TableHead>}
                {visibleCols.student_category && <TableHead>Category</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hasQuery || processedEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={20}
                    className="h-32 text-center text-muted-foreground italic font-medium"
                  >
                    {!hasQuery ? "No Student Queried Yet. Select filters above and click 'Get Student List'." : "No Student Found Matching Query."}
                  </TableCell>
                </TableRow>
              ) : (
                processedEnrollments.map((e, idx) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-mono text-muted-foreground">{idx + 1}</TableCell>
                    {visibleCols.pic && (
                      <TableCell>
                        <div className="size-8 rounded-full bg-muted border overflow-hidden flex items-center justify-center text-xs font-semibold text-muted-foreground">
                          Photo
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="font-medium text-foreground">{e.student_name_en}</TableCell>
                    {visibleCols.name_bn && <TableCell>{e.student_name_bn || "—"}</TableCell>}
                    {visibleCols.roll && <TableCell className="font-mono">{e.roll_no}</TableCell>}
                    {visibleCols.student_id && <TableCell className="font-mono font-semibold">{e.student_uid}</TableCell>}
                    {visibleCols.class && <TableCell>{e.class_name || "—"}</TableCell>}
                    {visibleCols.group && <TableCell>{e.group_name || "—"}</TableCell>}
                    {visibleCols.section && <TableCell>{e.section_name || "—"}</TableCell>}
                    {visibleCols.shift && <TableCell>{e.shift_name || "—"}</TableCell>}
                    {visibleCols.mobile && <TableCell className="font-mono">{e.student_mobile || "—"}</TableCell>}
                    {visibleCols.gender && <TableCell>{e.student_gender}</TableCell>}
                    {visibleCols.religion && <TableCell>{e.student_religion || "—"}</TableCell>}
                    {visibleCols.date_of_birth && <TableCell className="font-mono">—</TableCell>}
                    {visibleCols.admission_type && <TableCell className="capitalize">{e.admission_type}</TableCell>}
                    {visibleCols.student_category && <TableCell className="capitalize">{e.student_category}</TableCell>}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/students/${e.student_id}`} className="flex items-center gap-2">
                              <Eye className="size-4" />
                              View Profile
                            </Link>
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
    </div>
  )
}
