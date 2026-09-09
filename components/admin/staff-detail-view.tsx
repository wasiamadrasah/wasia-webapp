"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { StudentBarcode } from "@/components/admin/student-barcode"
import { StudentQRCode } from "@/components/admin/student-qr-code"
import { resetTeacherPasswordAction } from "@/app/admin/actions"
import {
  TeacherProfileRecord,
  AcademicRecord,
  ExperienceRecord,
  TrainingRecord,
  FamilyRecord,
  AddressRecord,
  GovernmentInfoRecord,
} from "@/lib/db"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  User,
  MapPin,
  Users,
  GraduationCap,
  Phone,
  Briefcase,
  Building,
  Award,
  Printer,
  Pencil,
  KeyRound,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react"

type StaffDetailViewProps = {
  staff: TeacherProfileRecord
  academics: AcademicRecord[]
  experience: ExperienceRecord[]
  training: TrainingRecord[]
  family: FamilyRecord[]
  addresses: AddressRecord[]
  governmentInfo: GovernmentInfoRecord | null
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

export function StaffDetailView({
  staff,
  academics,
  experience,
  training,
  family,
  addresses,
  governmentInfo,
}: StaffDetailViewProps) {
  const [resetPasswordOpen, setResetPasswordOpen] = React.useState(false)
  const resetFormRef = React.useRef<HTMLFormElement>(null)

  const presentAddress = addresses.find((a) => a.address_type === "present" || a.address_type === "Present")
  const permanentAddress = addresses.find((a) => a.address_type === "permanent" || a.address_type === "Permanent")

  const formatAddress = (address?: AddressRecord) => {
    if (!address) return "-"
    const parts = [
      address.house ? `House: ${address.house}` : null,
      address.road ? `Road: ${address.road}` : null,
      address.area,
      address.post_office ? `PO: ${address.post_office}` : null,
      address.post_code ? `Postcode: ${address.post_code}` : null,
      address.thana ? `Thana: ${address.thana}` : null,
      address.district ? `District: ${address.district}` : null,
    ]
      .map((p) => (p ?? "").trim())
      .filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : "-"
  }

  return (
    <div className="w-full pb-12">
      {/* Hidden reset password form */}
      <form ref={resetFormRef} action={resetTeacherPasswordAction}>
        <input type="hidden" name="teacher_id" value={staff.id} />
      </form>

      {/* Reset Password Confirmation Dialog */}
      <AlertDialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <ShieldCheck />
            </AlertDialogMedia>
            <AlertDialogTitle>Reset staff password?</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a new 6-character password (a-z, 0-9), reset the current password, and email it to the staff member.
              The staff member will be advised to change it immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetFormRef.current?.requestSubmit()
              }}
            >
              Confirm Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Two Column Layout matching Student & Teacher profile views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Staff Profile & Quick Details                                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-6">
          <div className="rounded-xl border border-border bg-card text-card-foreground shadow-xs overflow-hidden">
            {/* Header Photo + Name */}
            <div className="p-6 pb-5 flex flex-col items-center text-center space-y-3">
              <div className="relative size-28 rounded-xl overflow-hidden bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center">
                {staff.profile_photo ? (
                  <Image
                    src={staff.profile_photo}
                    alt={staff.full_name_en || "Staff photo"}
                    fill
                    className="object-cover"
                    sizes="112px"
                    unoptimized
                  />
                ) : (
                  <span className="text-3xl font-extrabold uppercase text-indigo-700 dark:text-indigo-300">
                    {staff.full_name_en ? staff.full_name_en.charAt(0) : "S"}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-1.5">
                  {valueOrDash(staff.full_name_en)}
                </h2>
                {staff.full_name_bn && (
                  <p className="text-sm text-muted-foreground mt-0.5">{staff.full_name_bn}</p>
                )}
              </div>

              {/* Action Buttons Row (Print, Edit, Password, Back to Staff) */}
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
                    <p>Print Profile</p>
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
                      <Link href={`/admin/staffs/${staff.id}/edit`}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Edit Profile</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8.5 rounded-lg border border-border bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 dark:hover:border-indigo-500/40 transition-all cursor-pointer"
                      onClick={() => setResetPasswordOpen(true)}
                    >
                      <KeyRound className="size-4" />
                      <span className="sr-only">Password</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Reset Password</p>
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
                      <Link href="/admin/staffs">
                        <ArrowLeft className="size-4" />
                        <span className="sr-only">Back to Staff</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Back to Staff</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Employment Quick Details Section */}
            <SectionBanner title="Employment & Details" icon={Briefcase} />

            <div className="py-2">
              <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                <span className="text-muted-foreground font-medium text-xs sm:text-sm">Employee ID</span>
                <span className="font-semibold text-foreground text-xs sm:text-sm font-mono">{valueOrDash(staff.employee_id)}</span>
              </div>

              {staff.designation && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Designation</span>
                  <span className="font-semibold text-primary dark:text-indigo-400 text-xs sm:text-sm">{staff.designation}</span>
                </div>
              )}

              {staff.type && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Staff Type</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{formatEnumText(staff.type)}</span>
                </div>
              )}

              {staff.subject && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Department / Section</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{staff.subject}</span>
                </div>
              )}

              {staff.employment_type && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Employment Type</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{formatEnumText(staff.employment_type)}</span>
                </div>
              )}

              {staff.joining_date && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Joining Date</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{formatDate(staff.joining_date)}</span>
                </div>
              )}

              {staff.blood_group && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Blood Group</span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">{formatEnumText(staff.blood_group)}</span>
                </div>
              )}

              {/* Signature Row (Placed before Barcode) */}
              <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                <span className="text-muted-foreground font-medium text-xs sm:text-sm">Signature</span>
                <div className="flex items-center justify-end">
                  {staff.signature ? (
                    <div className="relative h-10 w-28 overflow-hidden rounded-md border border-border bg-white dark:bg-slate-100 p-1 shadow-2xs">
                      <Image
                        src={staff.signature}
                        alt={`${staff.full_name_en || "Staff"} signature`}
                        fill
                        unoptimized
                        className="object-contain p-0.5"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">No signature</span>
                  )}
                </div>
              </div>

              {/* Barcode Row */}
              {(staff.employee_id || staff.id) && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">Barcode</span>
                  <div className="flex items-center justify-end">
                    <StudentBarcode value={staff.employee_id || staff.id} height={26} width={1.1} fontSize={10} />
                  </div>
                </div>
              )}

              {/* QR Code Row */}
              {(staff.employee_id || staff.id) && (
                <div className="flex items-center justify-between px-6 py-2 text-sm hover:bg-muted/15 transition-colors">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm">QR Code</span>
                  <div className="flex items-center justify-end">
                    <StudentQRCode value={staff.employee_id || staff.id} size={60} altText="Staff QR Code" />
                  </div>
                </div>
              )}
            </div>
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
              <DetailRow label="Full Name (English)" value={staff.full_name_en} />
              <DetailRow label="Name (বাংলা)" value={staff.full_name_bn} />
              <DetailRow label="Gender" value={formatEnumText(staff.gender)} />
              <DetailRow label="Date of Birth" value={formatDate(staff.date_of_birth)} />
              <DetailRow label="Marital Status" value={formatEnumText(staff.marital_status)} />
              <DetailRow label="Religion" value={formatEnumText(staff.religion)} />
              <DetailRow label="Nationality" value={formatEnumText(staff.nationality)} />
              <DetailRow label="Blood Group" value={formatEnumText(staff.blood_group)} />
              <DetailRow label="National ID (NID)" value={staff.nid_number} />
              <DetailRow label="Birth Certificate No" value={staff.birth_certificate} />
              <DetailRow label="Passport Number" value={staff.passport_number} />
            </div>

            {/* Government / MPO Information (if present) */}
            {governmentInfo && (
              <>
                <SectionBanner title="Government & Service Information" icon={Building} />
                <div className="py-2">
                  <DetailRow label="NTRCA Registration" value={governmentInfo.ntrca_registration} />
                  <DetailRow label="MPO Date" value={formatDate(governmentInfo.mpo_date)} />
                  <DetailRow label="PDS ID" value={governmentInfo.pds_id} />
                  <DetailRow label="Index Number" value={governmentInfo.index_number} />
                  <DetailRow label="First Joining Date" value={formatDate(governmentInfo.first_joining_date)} />
                  <DetailRow label="Appointment Letter No" value={governmentInfo.appointment_letter_no} />
                </div>
              </>
            )}

            {/* Contact Information */}
            <SectionBanner title="Contact Information" icon={Phone} />
            <div className="py-2">
              <DetailRow label="Contact Number" value={staff.contact_number} />
              <DetailRow label="Alternative Contact" value={staff.alt_contact_number} />
              <DetailRow label="Email Address" value={staff.email} />
              <DetailRow label="Emergency Contact" value={staff.emergency_contact} />
            </div>

            {/* Address Information */}
            <SectionBanner title="Address Information" icon={MapPin} />
            <div className="py-2">
              <DetailRow label="Present Address" value={formatAddress(presentAddress)} />
              <DetailRow label="Permanent Address" value={formatAddress(permanentAddress)} />
            </div>

            {/* Family Information */}
            <SectionBanner title="Family Information" icon={Users} />
            <div className="py-2">
              {family.length === 0 ? (
                <div className="py-2 px-6 text-sm text-muted-foreground">No family records found.</div>
              ) : (
                family.map((item, idx) => (
                  <div key={item.id} className={idx > 0 ? "pt-3 mt-3 border-t border-border" : ""}>
                    <div className="bg-slate-100/50 dark:bg-slate-800/30 px-6 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {formatEnumText(item.relationship)}: {item.name}
                    </div>
                    <div>
                      <DetailRow label="Full Name" value={item.name} />
                      <DetailRow label="Relationship" value={formatEnumText(item.relationship)} />
                      <DetailRow label="Date of Birth" value={formatDate(item.date_of_birth)} />
                      <DetailRow label="Age" value={item.age ? `${item.age} years` : "-"} />
                      <DetailRow label="Blood Group" value={formatEnumText(item.blood_group)} />
                      {item.remark && <DetailRow label="Remarks" value={item.remark} />}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Academic Qualifications */}
            <SectionBanner title="Academic Qualifications" icon={GraduationCap} />
            <div className="py-2">
              {academics.length === 0 ? (
                <div className="py-2 px-6 text-sm text-muted-foreground">No academic qualifications found.</div>
              ) : (
                academics.map((item, idx) => (
                  <div key={item.id} className={idx > 0 ? "pt-3 mt-3 border-t border-border" : ""}>
                    <div className="bg-slate-100/50 dark:bg-slate-800/30 px-6 py-1.5 text-xs font-bold text-foreground">
                      {item.degree || `Qualification #${idx + 1}`} - {item.institution || "Institution"}
                    </div>
                    <div>
                      <DetailRow label="Exam / Degree" value={item.degree} />
                      <DetailRow label="Board / University" value={item.institution} />
                      <DetailRow label="Group / Subject" value={item.subject} />
                      <DetailRow label="Passing Year" value={item.passing_year} />
                      <DetailRow label="Duration" value={item.duration} />
                      <DetailRow label="Result / GPA" value={item.result} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Experience & Training */}
            {(experience.length > 0 || training.length > 0) && (
              <>
                <SectionBanner title="Professional Experience & Training" icon={Award} />
                <div className="py-2">
                  {experience.length > 0 && (
                    <div className="space-y-3 mb-4">
                      <div className="px-6 pt-2 pb-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Experience History</p>
                      </div>
                      {experience.map((exp, idx) => (
                        <div key={exp.id} className={idx > 0 ? "pt-3 mt-3 border-t border-border" : ""}>
                          <div className="bg-slate-100/50 dark:bg-slate-800/30 px-6 py-1.5 text-xs font-bold text-foreground">
                            {exp.designation || "Position"} at {exp.institute_name || "Institution"}
                          </div>
                          <div>
                            <DetailRow label="Institution" value={exp.institute_name} />
                            <DetailRow label="Location" value={exp.location} />
                            <DetailRow label="Designation" value={exp.designation} />
                            <DetailRow label="Subject / Field" value={exp.subject} />
                            <DetailRow label="Employment Type" value={formatEnumText(exp.employment_type)} />
                            <DetailRow
                              label="Duration"
                              value={`${formatDate(exp.start_date)} - ${exp.currently_working ? "Present (Currently Working)" : formatDate(exp.end_date)}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {training.length > 0 && (
                    <div className="space-y-3">
                      <div className="px-6 pt-2 pb-1 border-t border-border">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Training & Certifications</p>
                      </div>
                      {training.map((trn, idx) => (
                        <div key={trn.id} className={idx > 0 ? "pt-3 mt-3 border-t border-border" : ""}>
                          <div className="bg-slate-100/50 dark:bg-slate-800/30 px-6 py-1.5 text-xs font-bold text-foreground">
                            {trn.training_name}
                          </div>
                          <div>
                            <DetailRow label="Training Title" value={trn.training_name} />
                            <DetailRow label="Training Institute" value={trn.training_institute} />
                            <DetailRow label="Year" value={trn.year} />
                            <DetailRow label="Duration" value={trn.duration} />
                            <DetailRow label="Subject / Topic" value={trn.subject} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
