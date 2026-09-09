import Link from "next/link"
import { notFound } from "next/navigation"
import { AlertCircle, ArrowLeft, User, Briefcase, Phone, MapPin, FileText, Building } from "lucide-react"

import { updateTeacherAction } from "@/app/admin/actions"
import {
  getTeacherAcademics,
  getTeacherAddresses,
  getTeacherExperience,
  getTeacherFamily,
  getTeacherGovernmentInfo,
  getTeacherProfile,
  getTeacherTraining,
} from "@/lib/db"
import { TeacherMultiEntrySections } from "@/components/admin/teacher-multi-entry-sections"
import { TeacherEditActions } from "@/components/admin/teacher-edit-actions"
import { TeacherProfilePhotoField } from "@/components/admin/teacher-profile-photo-field"
import { PageHeader } from "@/components/digicampus/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormDatePicker } from "@/components/admin/form-date-picker"
import { FormSelect } from "@/components/admin/form-select"

type EditTeacherPageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{
    status?: string
    message?: string
    error_full_name_en?: string
    error_gender?: string
    error_date_of_birth?: string
    error_contact_number?: string
    error_email?: string
  }>
}

function normalizeDateForInput(value: string | null | undefined) {
  if (!value) return ""
  return value.slice(0, 10)
}

function SectionHeader({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-border pb-3 mb-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-base font-bold text-foreground">{title}</h2>
    </div>
  )
}

export default async function EditTeacherPage({ params, searchParams }: EditTeacherPageProps) {
  const { id } = await params
  const query = (await searchParams) ?? {}
  const status = query.status
  const message = query.message ? decodeURIComponent(query.message) : ""
  const fieldErrors = {
    full_name_en: query.error_full_name_en ? decodeURIComponent(query.error_full_name_en) : "",
    gender: query.error_gender ? decodeURIComponent(query.error_gender) : "",
    date_of_birth: query.error_date_of_birth ? decodeURIComponent(query.error_date_of_birth) : "",
    contact_number: query.error_contact_number ? decodeURIComponent(query.error_contact_number) : "",
    email: query.error_email ? decodeURIComponent(query.error_email) : "",
  }
  const [teacher, addresses, governmentInfo, academics, experience, training, family] = await Promise.all([
    getTeacherProfile(id),
    getTeacherAddresses(id),
    getTeacherGovernmentInfo(id),
    getTeacherAcademics(id),
    getTeacherExperience(id),
    getTeacherTraining(id),
    getTeacherFamily(id),
  ])

  if (!teacher) {
    notFound()
  }

  const presentAddress = addresses.find((item) => item.address_type === "present")
  const permanentAddress = addresses.find((item) => item.address_type === "permanent")

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Edit Teacher Profile"
        description={`Editing profile for ${teacher.full_name_en ?? "Unnamed"} (ID: ${teacher.employee_id ?? "N/A"})`}
        action={
          <Button asChild variant="outline" className="h-10 rounded-lg border-border bg-card text-foreground hover:bg-muted/40 text-sm font-medium gap-2">
            <Link href={`/admin/teachers/${teacher.id}`}>
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              <span>Back to Profile</span>
            </Link>
          </Button>
        }
      />

      {status === "error" && message ? (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm font-semibold text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{message}</p>
        </div>
      ) : null}

      <form id="teacher-edit-form" action={updateTeacherAction.bind(null, teacher.id)} noValidate className="space-y-6">
        {/* 1. Basic Information */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <SectionHeader title="1. Basic Information" icon={User} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="full_name_en" className="text-sm font-bold text-foreground">
                Full Name (English) <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="full_name_en"
                name="full_name_en"
                defaultValue={teacher.full_name_en ?? ""}
                required
                aria-invalid={Boolean(fieldErrors.full_name_en)}
                className={`h-10 text-sm border-input bg-background ${fieldErrors.full_name_en ? "border-rose-500 focus-visible:ring-rose-200" : ""}`}
              />
              {fieldErrors.full_name_en ? <p className="text-xs font-semibold text-rose-600">{fieldErrors.full_name_en}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="full_name_bn" className="text-sm font-bold text-foreground">
                Name (বাংলা)
              </Label>
              <Input id="full_name_bn" name="full_name_bn" defaultValue={teacher.full_name_bn ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="signature" className="text-sm font-bold text-foreground">
                Signature URL
              </Label>
              <Input id="signature" name="signature" defaultValue={teacher.signature ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gender" className="text-sm font-bold text-foreground">
                Gender <span className="text-rose-500">*</span>
              </Label>
              <FormSelect
                id="gender"
                name="gender"
                required
                invalid={Boolean(fieldErrors.gender)}
                defaultValue={teacher.gender ?? ""}
                placeholder="Select gender"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />
              {fieldErrors.gender ? <p className="text-xs font-semibold text-rose-600">{fieldErrors.gender}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date_of_birth" className="text-sm font-bold text-foreground">
                Date of Birth <span className="text-rose-500">*</span>
              </Label>
              <FormDatePicker
                id="date_of_birth"
                name="date_of_birth"
                required
                invalid={Boolean(fieldErrors.date_of_birth)}
                defaultValue={normalizeDateForInput(teacher.date_of_birth)}
                placeholder="DD/MM/YYYY"
              />
              {fieldErrors.date_of_birth ? <p className="text-xs font-semibold text-rose-600">{fieldErrors.date_of_birth}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="marital_status" className="text-sm font-bold text-foreground">
                Marital Status
              </Label>
              <FormSelect
                id="marital_status"
                name="marital_status"
                defaultValue={teacher.marital_status ?? ""}
                placeholder="Select marital status"
                options={[
                  { value: "married", label: "Married" },
                  { value: "unmarried", label: "Unmarried" },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="religion" className="text-sm font-bold text-foreground">
                Religion
              </Label>
              <FormSelect
                id="religion"
                name="religion"
                defaultValue={teacher.religion ?? ""}
                placeholder="Select religion"
                options={[
                  { value: "islam", label: "Islam" },
                  { value: "hinduism", label: "Hinduism" },
                  { value: "christianity", label: "Christianity" },
                  { value: "buddhism", label: "Buddhism" },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nationality" className="text-sm font-bold text-foreground">
                Nationality
              </Label>
              <Input id="nationality" name="nationality" defaultValue={teacher.nationality ?? "Bangladeshi"} className="h-10 text-sm border-input bg-background" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="blood_group" className="text-sm font-bold text-foreground">
                Blood Group
              </Label>
              <FormSelect
                id="blood_group"
                name="blood_group"
                defaultValue={teacher.blood_group ?? ""}
                placeholder="Select blood group"
                options={[
                  { value: "A+", label: "A+" },
                  { value: "A-", label: "A-" },
                  { value: "B+", label: "B+" },
                  { value: "B-", label: "B-" },
                  { value: "O+", label: "O+" },
                  { value: "O-", label: "O-" },
                  { value: "AB+", label: "AB+" },
                  { value: "AB-", label: "AB-" },
                ]}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2 lg:col-span-3 pt-2">
              <TeacherProfilePhotoField teacherId={id} currentPhotoUrl={teacher.profile_photo} />
            </div>
          </div>
        </div>

        {/* 2. Employment Information */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <SectionHeader title="2. Employment Information" icon={Briefcase} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="employee_id" className="text-sm font-bold text-foreground">
                Employee ID
              </Label>
              <Input id="employee_id" name="employee_id" defaultValue={teacher.employee_id ?? ""} disabled className="h-10 text-sm border-input bg-muted/40 text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="designation" className="text-sm font-bold text-foreground">
                Designation
              </Label>
              <Input id="designation" name="designation" defaultValue={teacher.designation ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-sm font-bold text-foreground">
                Type
              </Label>
              <FormSelect
                id="type"
                name="type"
                defaultValue={teacher.type ?? ""}
                placeholder="Select type"
                options={[
                  { value: "teacher", label: "Teacher" },
                  { value: "staff", label: "Staff" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-sm font-bold text-foreground">
                Subject
              </Label>
              <Input id="subject" name="subject" defaultValue={teacher.subject ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="employment_type" className="text-sm font-bold text-foreground">
                Employment Type
              </Label>
              <FormSelect
                id="employment_type"
                name="employment_type"
                defaultValue={teacher.employment_type ?? ""}
                placeholder="Select employment type"
                options={[
                  { value: "permanent", label: "Permanent" },
                  { value: "non-permanent", label: "Non-Permanent" },
                  { value: "guest", label: "Guest" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="joining_date" className="text-sm font-bold text-foreground">
                Joining Date
              </Label>
              <FormDatePicker id="joining_date" name="joining_date" defaultValue={normalizeDateForInput(teacher.joining_date)} placeholder="DD/MM/YYYY" />
            </div>
          </div>
        </div>

        {/* 3. Contact Information */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <SectionHeader title="3. Contact Information" icon={Phone} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="contact_number" className="text-sm font-bold text-foreground">
                Contact Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="contact_number"
                name="contact_number"
                defaultValue={teacher.contact_number ?? ""}
                required
                aria-invalid={Boolean(fieldErrors.contact_number)}
                inputMode="numeric"
                maxLength={11}
                minLength={11}
                pattern="\d{11}"
                title="Contact number must be exactly 11 digits"
                className={`h-10 text-sm border-input bg-background ${fieldErrors.contact_number ? "border-rose-500 focus-visible:ring-rose-200" : ""}`}
              />
              {fieldErrors.contact_number ? <p className="text-xs font-semibold text-rose-600">{fieldErrors.contact_number}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alt_contact_number" className="text-sm font-bold text-foreground">
                Alternative Contact Number
              </Label>
              <Input id="alt_contact_number" name="alt_contact_number" defaultValue={teacher.alt_contact_number ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-bold text-foreground">
                Email Address <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={teacher.email ?? ""}
                required
                aria-invalid={Boolean(fieldErrors.email)}
                className={`h-10 text-sm border-input bg-background ${fieldErrors.email ? "border-rose-500 focus-visible:ring-rose-200" : ""}`}
              />
              {fieldErrors.email ? <p className="text-xs font-semibold text-rose-600">{fieldErrors.email}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emergency_contact" className="text-sm font-bold text-foreground">
                Emergency Contact
              </Label>
              <Input id="emergency_contact" name="emergency_contact" defaultValue={teacher.emergency_contact ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>
          </div>
        </div>

        {/* 5. Identity Documents */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <SectionHeader title="5. Identity Documents" icon={FileText} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="nid_number" className="text-sm font-bold text-foreground">
                National ID (NID)
              </Label>
              <Input id="nid_number" name="nid_number" defaultValue={teacher.nid_number ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="birth_certificate" className="text-sm font-bold text-foreground">
                Birth Certificate Number
              </Label>
              <Input id="birth_certificate" name="birth_certificate" defaultValue={teacher.birth_certificate ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="passport_number" className="text-sm font-bold text-foreground">
                Passport Number
              </Label>
              <Input id="passport_number" name="passport_number" defaultValue={teacher.passport_number ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>
          </div>
        </div>

        {/* 4. Address Information */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-6">
          <SectionHeader title="4. Address Information" icon={MapPin} />
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Present Address</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="present_house" className="text-sm font-bold text-foreground">House</Label>
                <Input id="present_house" name="present_house" defaultValue={presentAddress?.house ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="present_road" className="text-sm font-bold text-foreground">Road</Label>
                <Input id="present_road" name="present_road" defaultValue={presentAddress?.road ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="present_area" className="text-sm font-bold text-foreground">Area</Label>
                <Input id="present_area" name="present_area" defaultValue={presentAddress?.area ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="present_post_office" className="text-sm font-bold text-foreground">Post Office</Label>
                <Input id="present_post_office" name="present_post_office" defaultValue={presentAddress?.post_office ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="present_post_code" className="text-sm font-bold text-foreground">Post Code</Label>
                <Input id="present_post_code" name="present_post_code" defaultValue={presentAddress?.post_code ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="present_thana" className="text-sm font-bold text-foreground">Thana / Upazila</Label>
                <Input id="present_thana" name="present_thana" defaultValue={presentAddress?.thana ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="present_district" className="text-sm font-bold text-foreground">District</Label>
                <Input id="present_district" name="present_district" defaultValue={presentAddress?.district ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Permanent Address</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="permanent_house" className="text-sm font-bold text-foreground">House</Label>
                <Input id="permanent_house" name="permanent_house" defaultValue={permanentAddress?.house ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="permanent_road" className="text-sm font-bold text-foreground">Road</Label>
                <Input id="permanent_road" name="permanent_road" defaultValue={permanentAddress?.road ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="permanent_area" className="text-sm font-bold text-foreground">Area</Label>
                <Input id="permanent_area" name="permanent_area" defaultValue={permanentAddress?.area ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="permanent_post_office" className="text-sm font-bold text-foreground">Post Office</Label>
                <Input id="permanent_post_office" name="permanent_post_office" defaultValue={permanentAddress?.post_office ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="permanent_post_code" className="text-sm font-bold text-foreground">Post Code</Label>
                <Input id="permanent_post_code" name="permanent_post_code" defaultValue={permanentAddress?.post_code ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="permanent_thana" className="text-sm font-bold text-foreground">Thana / Upazila</Label>
                <Input id="permanent_thana" name="permanent_thana" defaultValue={permanentAddress?.thana ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="permanent_district" className="text-sm font-bold text-foreground">District</Label>
                <Input id="permanent_district" name="permanent_district" defaultValue={permanentAddress?.district ?? ""} className="h-10 text-sm border-input bg-background" />
              </div>
            </div>
          </div>
        </div>

        {/* 8. Government / MPO Information */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
          <SectionHeader title="8. Government / MPO Information" icon={Building} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="ntrca_registration" className="text-sm font-bold text-foreground">NTRCA Registration Number</Label>
              <Input id="ntrca_registration" name="ntrca_registration" defaultValue={governmentInfo?.ntrca_registration ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mpo_date" className="text-sm font-bold text-foreground">MPO Date</Label>
              <FormDatePicker id="mpo_date" name="mpo_date" defaultValue={normalizeDateForInput(governmentInfo?.mpo_date)} placeholder="DD/MM/YYYY" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pds_id" className="text-sm font-bold text-foreground">PDS ID</Label>
              <Input id="pds_id" name="pds_id" defaultValue={governmentInfo?.pds_id ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="index_number" className="text-sm font-bold text-foreground">Index Number</Label>
              <Input id="index_number" name="index_number" defaultValue={governmentInfo?.index_number ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="first_joining_date" className="text-sm font-bold text-foreground">First Joining Date</Label>
              <FormDatePicker
                id="first_joining_date"
                name="first_joining_date"
                defaultValue={normalizeDateForInput(governmentInfo?.first_joining_date)}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appointment_letter_no" className="text-sm font-bold text-foreground">First Appointment Letter No</Label>
              <Input id="appointment_letter_no" name="appointment_letter_no" defaultValue={governmentInfo?.appointment_letter_no ?? ""} className="h-10 text-sm border-input bg-background" />
            </div>
          </div>
        </div>

        {/* Dynamic Multi-Entry Sections (Academics, Experience, Training, Family) */}
        <TeacherMultiEntrySections
          academics={academics}
          experience={experience}
          training={training}
          family={family}
        />

        <TeacherEditActions teacherId={teacher.id} formId="teacher-edit-form" />
      </form>
    </div>
  )
}
