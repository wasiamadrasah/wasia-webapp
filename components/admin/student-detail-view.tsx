"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { StudentBarcode } from "@/components/admin/student-barcode"
import { StudentQRCode } from "@/components/admin/student-qr-code"
import {
  StudentRecord,
  StudentGuardianRecord,
  StudentAddressRecord,
  StudentPreviousAcademicRecord,
  StudentDocumentRecord,
  StudentEnrollmentRecord,
} from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  User,
  MapPin,
  Users,
  GraduationCap,
  FileText,
  Phone,
  Eye,
  BookOpen,
  Printer,
  Pencil,
  KeyRound,
  UserCog,
  Receipt,
} from "lucide-react"

type StudentDetailViewProps = {
  student: StudentRecord
  guardians: StudentGuardianRecord[]
  addresses: StudentAddressRecord[]
  previousAcademics: StudentPreviousAcademicRecord[]
  documents: StudentDocumentRecord[]
  enrollments: StudentEnrollmentRecord[]
}

function valueOrDash(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "-"
  const text = String(value).trim()
  return text.length > 0 ? text : "-"
}

function formatEnumText(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "-"
  const text = String(value).trim()
  if (!text || text === "-") return "-"

  // Blood group: A+, B+, AB-, O+, etc.
  if (/^(a|b|ab|o)[+-]$/i.test(text)) {
    return text.toUpperCase()
  }

  return text
    .replace(/_/g, " ")
    .split(" ")
    .map((part) =>
      part
        .split("-")
        .map((sub) => (sub ? sub.charAt(0).toUpperCase() + sub.slice(1).toLowerCase() : ""))
        .join("-")
    )
    .join(" ")
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "2-digit" })
}

function SectionBanner({
  title,
  icon: Icon,
}: {
  title: string
  icon?: React.ElementType
}) {
  return (
    <div className="w-full bg-slate-100/70 dark:bg-slate-800/40 px-6 py-2.5 flex items-center gap-2.5 text-foreground">
      {Icon && <Icon className="size-4 text-primary dark:text-indigo-400 shrink-0" />}
      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/90">{title}</h3>
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 px-6 text-sm hover:bg-muted/15 transition-colors">
      <span className="text-muted-foreground font-medium text-xs sm:text-sm sm:w-1/3 md:w-1/4 shrink-0">{label}</span>
      <span className="font-semibold text-foreground text-xs sm:text-sm sm:w-2/3 md:w-3/4 break-words">{valueOrDash(value)}</span>
    </div>
  )
}

export function StudentDetailView({
  student,
  guardians,
  addresses,
  previousAcademics,
  documents,
  enrollments,
}: StudentDetailViewProps) {
  const currentEnrollment = enrollments[0]
  const presentAddress = addresses.find((a) => a.address_type === "Present")
  const permanentAddress = addresses.find((a) => a.address_type === "Permanent")

  const formatAddress = (address?: StudentAddressRecord) => {
    if (!address) return "-"
    const parts = [
      address.address_line,
      address.thana,
      address.district,
      address.division,
      address.country,
    ]
      .map((p) => (p ?? "").trim())
      .filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : "-"
  }

  return (
    <div className="w-full pb-12">
      {/* Two Column Layout: Items align to top at y=0 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Student Profile & Academic/Enrollment Details                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-6">
          <div className="rounded-xl border border-border bg-card text-card-foreground shadow-xs overflow-hidden">
            {/* Header Photo + Name */}
            <div className="p-6 pb-5 flex flex-col items-center text-center space-y-3">
              <div className="relative size-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-border flex items-center justify-center">
                {student.photo ? (
                  <Image
                    src={student.photo}
                    alt={student.name_en || "Student photo"}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <User className="size-14 text-muted-foreground/60" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {valueOrDash(student.name_en)}
                </h2>
                {student.name_bn && (
                  <p className="text-sm text-muted-foreground mt-0.5">{student.name_bn}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    student.status === "active"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                  }
                >
                  {student.status.toUpperCase()}
                </Badge>
                {currentEnrollment?.enrollment_status && currentEnrollment.enrollment_status !== "Active" && (
                  <Badge variant="secondary" className="border border-border text-xs">
                    {currentEnrollment.enrollment_status}
                  </Badge>
                )}
              </div>

              {/* Action Buttons Row (Print, Edit, Password, Account Manage, Fees) */}
              <div className="flex items-center justify-center gap-1.5 pt-1 w-full flex-wrap">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8.5 rounded-lg border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer"
                      onClick={() => window.print()}
                    >
                      <Printer className="size-4" />
                      <span className="sr-only">Print</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Print</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8.5 rounded-lg border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer"
                      asChild
                    >
                      <Link href={`/admin/students?edit=${student.id}`}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Edit</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8.5 rounded-lg border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer"
                    >
                      <KeyRound className="size-4" />
                      <span className="sr-only">Password</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Password</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8.5 rounded-lg border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer"
                    >
                      <UserCog className="size-4" />
                      <span className="sr-only">Account Manage</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Account Manage</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8.5 rounded-lg border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer"
                      asChild
                    >
                      <Link href={`/admin/fees?student_id=${student.student_uid}`}>
                        <Receipt className="size-4" />
                        <span className="sr-only">Fees</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Fees</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Academic & Enrollment Section Header */}
            <SectionBanner title="Academic & Enrollment" icon={BookOpen} />

            <div className="py-2">
              <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                <span className="text-muted-foreground font-medium text-xs sm:text-sm">Student ID</span>
                <span className="font-semibold text-foreground text-xs sm:text-sm">{student.student_uid}</span>
              </div>

              {currentEnrollment?.roll_no !== undefined && currentEnrollment?.roll_no !== null && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Roll Number</span>
                  <span className="font-semibold text-primary dark:text-indigo-400 text-xs sm:text-sm">{currentEnrollment.roll_no}</span>
                </div>
              )}

              {currentEnrollment?.session_name && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Session</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{currentEnrollment.session_name}</span>
                </div>
              )}

              {currentEnrollment?.class_name && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Class</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{currentEnrollment.class_name}</span>
                </div>
              )}

              {currentEnrollment?.section_name && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Section</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{currentEnrollment.section_name}</span>
                </div>
              )}

              {currentEnrollment?.shift_name && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Shift</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{currentEnrollment.shift_name}</span>
                </div>
              )}

              {currentEnrollment?.group_name && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Group</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{currentEnrollment.group_name}</span>
                </div>
              )}

              {currentEnrollment?.student_category && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Category</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{currentEnrollment.student_category}</span>
                </div>
              )}

              {currentEnrollment?.board_roll && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Board Roll</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{currentEnrollment.board_roll}</span>
                </div>
              )}

              {currentEnrollment?.board_registration && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Board Reg.</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{currentEnrollment.board_registration}</span>
                </div>
              )}

              {currentEnrollment?.enrollment_date && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Enrollment Date</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{formatDate(currentEnrollment.enrollment_date)}</span>
                </div>
              )}

              <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                <span className="text-muted-foreground font-medium text-xs sm:text-sm">Gender</span>
                <span className="font-semibold text-foreground text-xs sm:text-sm">{formatEnumText(student.gender)}</span>
              </div>

              {student.blood_group && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Blood Group</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{formatEnumText(student.blood_group)}</span>
                </div>
              )}

              {/* Barcode Row */}
              <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                <span className="text-muted-foreground font-medium text-xs sm:text-sm">Barcode</span>
                <div className="flex items-center justify-end">
                  <StudentBarcode value={student.student_uid} height={26} width={1.1} fontSize={10} />
                </div>
              </div>

              {/* QR Code Row */}
              <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                <span className="text-muted-foreground font-medium text-xs sm:text-sm">QR Code</span>
                <div className="flex items-center justify-end">
                  <StudentQRCode value={student.student_uid} size={60} />
                </div>
              </div>
            </div>

            {/* Additional Enrollment History if more than 1 */}
            {enrollments.length > 1 && (
              <div className="border-t border-border p-4 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Past Enrollments ({enrollments.length - 1})
                </p>
                {enrollments.slice(1).map((past) => (
                  <div key={past.id} className="text-xs rounded-lg border border-border bg-card p-2.5 space-y-1">
                    <p className="font-semibold text-foreground">{past.class_combination_name || "Previous Enrollment"}</p>
                    <p className="text-muted-foreground">Roll: {past.roll_no} • {past.enrollment_status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Single Unified Card without Section Numbers                 */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 xl:col-span-8">
          <div className="rounded-xl border border-border bg-card text-card-foreground shadow-xs overflow-hidden">
            {/* Basic Information */}
            <SectionBanner title="Basic Information" icon={User} />
            <div className="py-2">
              <DetailRow label="Full Name (English)" value={student.name_en} />
              <DetailRow label="Name (বাংলা)" value={student.name_bn} />
              <DetailRow label="Gender" value={formatEnumText(student.gender)} />
              <DetailRow label="Date of Birth" value={formatDate(student.date_of_birth)} />
              <DetailRow label="Religion" value={formatEnumText(student.religion)} />
              <DetailRow label="Nationality" value={student.national_id ? "Bangladeshi" : "-"} />
              <DetailRow label="Blood Group" value={formatEnumText(student.blood_group)} />
              <DetailRow label="Birth Certificate No" value={student.birth_certificate_no} />
              <DetailRow label="National ID" value={student.national_id} />
              {student.passport_no && <DetailRow label="Passport No" value={student.passport_no} />}
              {student.note && <DetailRow label="Note / Remarks" value={student.note} />}
            </div>

            {/* Contact Information */}
            <SectionBanner title="Contact Information" icon={Phone} />
            <div className="py-2">
              <DetailRow label="Mobile Number" value={student.mobile} />
              <DetailRow label="Email Address" value={student.email} />
            </div>

            {/* Address Information */}
            <SectionBanner title="Address Information" icon={MapPin} />
            <div className="py-2">
              <DetailRow label="Present Address" value={formatAddress(presentAddress)} />
              <DetailRow label="Permanent Address" value={formatAddress(permanentAddress)} />
            </div>

            {/* Guardian Information */}
            <SectionBanner title="Guardian Information" icon={Users} />
            <div className="py-2">
              {guardians.length === 0 ? (
                <div className="py-2 px-6 text-sm text-muted-foreground">No guardian records found.</div>
              ) : (
                guardians.map((item, idx) => (
                  <div key={item.id} className={idx > 0 ? "pt-3 mt-3 border-t border-border" : ""}>
                    {guardians.length > 1 && (
                      <div className="bg-slate-100/50 dark:bg-slate-800/30 px-6 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {formatEnumText(item.relation_type)}: {item.name_en}
                      </div>
                    )}
                    <div>
                      <DetailRow label="Guardian Type" value={formatEnumText(item.relation_type)} />
                      <DetailRow label="Name (English)" value={item.name_en} />
                      <DetailRow label="Name (বাংলা)" value={item.name_bn} />
                      <DetailRow label="Contact Number" value={item.mobile} />
                      <DetailRow label="Occupation" value={item.occupation} />
                      <DetailRow
                        label="Yearly Income"
                        value={item.yearly_income ? `৳ ${item.yearly_income.toLocaleString()}` : "-"}
                      />
                      <DetailRow label="NID Number" value={item.nid_no} />
                      {item.email && <DetailRow label="Email" value={item.email} />}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Previous Academic Records */}
            <SectionBanner title="Previous Academic Records" icon={GraduationCap} />
            <div className="py-2">
              {previousAcademics.length === 0 ? (
                <div className="py-2 px-6 text-sm text-muted-foreground">No previous academic records found.</div>
              ) : (
                previousAcademics.map((item, idx) => (
                  <div key={item.id} className={idx > 0 ? "pt-3 mt-3 border-t border-border" : ""}>
                    <div className="bg-slate-100/50 dark:bg-slate-800/30 px-6 py-1.5 text-xs font-bold text-foreground">
                      {item.institute_name}
                    </div>
                    <div>
                      <DetailRow label="Previous Class" value={item.previous_class} />
                      <DetailRow label="Previous Result" value={item.previous_result} />
                      <DetailRow label="Previous GPA" value={item.previous_gpa} />
                      <DetailRow label="Previous Marks" value={item.previous_marks} />
                      <DetailRow label="TC Number" value={item.tc_number} />
                      <DetailRow label="TC Date" value={formatDate(item.tc_date)} />
                      <DetailRow label="Institute Location" value={item.institute_location} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Attached Documents */}
            <SectionBanner title="Attached Documents" icon={FileText} />
            <div className="p-6">
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents uploaded.</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-lg border border-border bg-slate-50/40 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-indigo-400 shrink-0">
                          <FileText className="size-4.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{doc.document_type}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {formatDate(doc.uploaded_at)}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs shrink-0 self-start sm:self-center border border-border" asChild>
                        <a href={doc.file_path} target="_blank" rel="noopener noreferrer">
                          <Eye className="size-3.5" />
                          View Document
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




