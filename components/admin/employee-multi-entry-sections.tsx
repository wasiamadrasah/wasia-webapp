"use client"

import * as React from "react"
import { Plus, Trash2, GraduationCap, Award, BookOpen, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormDatePicker } from "@/components/admin/form-date-picker"
import { FormSelect } from "@/components/admin/form-select"

type AcademicItem = {
  degree: string | null
  institution: string | null
  subject: string | null
  passing_year: number | null
  duration: string | null
  result: string | null
}

type ExperienceItem = {
  institute_name: string | null
  location: string | null
  designation: string | null
  subject: string | null
  employment_type: string | null
  start_date: string | null
  end_date: string | null
  currently_working: boolean | null
}

type TrainingItem = {
  training_name: string | null
  training_institute: string | null
  year: number | null
  duration: string | null
  subject: string | null
}

type FamilyItem = {
  name: string | null
  relationship: string | null
  date_of_birth: string | null
  age: number | null
  blood_group: string | null
  remark: string | null
}

type Props = {
  academics: AcademicItem[]
  experience: ExperienceItem[]
  training: TrainingItem[]
  family: FamilyItem[]
}

function normalizeDateForInput(value: string | null | undefined) {
  if (!value) return ""
  return value.slice(0, 10)
}

function SectionHeader({ title, icon: Icon, action }: { title: string; icon: React.ElementType; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function EmployeeMultiEntrySections({ academics, experience, training, family }: Props) {
  const [academicRows, setAcademicRows] = React.useState<AcademicItem[]>(
    academics.length > 0 ? academics : [{ degree: null, institution: null, subject: null, passing_year: null, duration: null, result: null }]
  )
  const [experienceRows, setExperienceRows] = React.useState<ExperienceItem[]>(
    experience.length > 0
      ? experience
      : [{ institute_name: null, location: null, designation: null, subject: null, employment_type: null, start_date: null, end_date: null, currently_working: null }]
  )
  const [trainingRows, setTrainingRows] = React.useState<TrainingItem[]>(
    training.length > 0 ? training : [{ training_name: null, training_institute: null, year: null, duration: null, subject: null }]
  )
  const [familyRows, setFamilyRows] = React.useState<FamilyItem[]>(
    family.length > 0 ? family : [{ name: null, relationship: null, date_of_birth: null, age: null, blood_group: null, remark: null }]
  )

  return (
    <>
      {/* 6. Academic Qualifications */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-4">
        <SectionHeader
          title="6. Academic Qualifications"
          icon={GraduationCap}
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAcademicRows((prev) => [...prev, { degree: null, institution: null, subject: null, passing_year: null, duration: null, result: null }])}
              className="h-8 px-3 rounded-lg border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Qualification</span>
            </Button>
          }
        />
        <div className="space-y-4">
          {academicRows.map((row, index) => (
            <div key={`academic-${index}`} className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Academic #{index + 1}</p>
                {academicRows.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAcademicRows((prev) => prev.filter((_, i) => i !== index))}
                    className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Exam / Degree</Label><Input name="academic_degree[]" defaultValue={row.degree ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Board / University</Label><Input name="academic_institution[]" defaultValue={row.institution ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Group / Subject</Label><Input name="academic_subject[]" defaultValue={row.subject ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Passing Year</Label><Input name="academic_passing_year[]" type="number" defaultValue={row.passing_year ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Duration</Label><Input name="academic_duration[]" defaultValue={row.duration ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Result</Label><Input name="academic_result[]" defaultValue={row.result ?? ""} className="h-10 text-sm border-input bg-background" /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Professional Experience */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-4">
        <SectionHeader
          title="7. Professional Experience"
          icon={Award}
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExperienceRows((prev) => [...prev, { institute_name: null, location: null, designation: null, subject: null, employment_type: null, start_date: null, end_date: null, currently_working: null }])}
              className="h-8 px-3 rounded-lg border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Experience</span>
            </Button>
          }
        />
        <div className="space-y-4">
          {experienceRows.map((row, index) => (
            <div key={`experience-${index}`} className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Experience #{index + 1}</p>
                {experienceRows.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExperienceRows((prev) => prev.filter((_, i) => i !== index))}
                    className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Institute Name</Label><Input name="experience_institute_name[]" defaultValue={row.institute_name ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Location</Label><Input name="experience_location[]" defaultValue={row.location ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Designation</Label><Input name="experience_designation[]" defaultValue={row.designation ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Subject</Label><Input name="experience_subject[]" defaultValue={row.subject ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Employment Type</Label><Input name="experience_employment_type[]" defaultValue={row.employment_type ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Start Date</Label><FormDatePicker name="experience_start_date[]" defaultValue={normalizeDateForInput(row.start_date)} placeholder="DD/MM/YYYY" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">End Date</Label><FormDatePicker name="experience_end_date[]" defaultValue={normalizeDateForInput(row.end_date)} placeholder="DD/MM/YYYY" /></div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground">Currently Working</Label>
                  <FormSelect
                    name="experience_currently_working[]"
                    defaultValue={row.currently_working === null ? "" : row.currently_working ? "true" : "false"}
                    placeholder="Select"
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Training Information */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-4">
        <SectionHeader
          title="9. Training Information"
          icon={BookOpen}
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTrainingRows((prev) => [...prev, { training_name: null, training_institute: null, year: null, duration: null, subject: null }])}
              className="h-8 px-3 rounded-lg border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Training</span>
            </Button>
          }
        />
        <div className="space-y-4">
          {trainingRows.map((row, index) => (
            <div key={`training-${index}`} className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Training #{index + 1}</p>
                {trainingRows.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setTrainingRows((prev) => prev.filter((_, i) => i !== index))}
                    className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Training Name</Label><Input name="training_name[]" defaultValue={row.training_name ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Training Institute</Label><Input name="training_institute[]" defaultValue={row.training_institute ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Training Year</Label><Input name="training_year[]" type="number" defaultValue={row.year ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Duration</Label><Input name="training_duration[]" defaultValue={row.duration ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Subject</Label><Input name="training_subject[]" defaultValue={row.subject ?? ""} className="h-10 text-sm border-input bg-background" /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10. Family Information */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-4">
        <SectionHeader
          title="10. Family Information"
          icon={Users}
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFamilyRows((prev) => [...prev, { name: null, relationship: null, date_of_birth: null, age: null, blood_group: null, remark: null }])}
              className="h-8 px-3 rounded-lg border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Family Member</span>
            </Button>
          }
        />
        <div className="space-y-4">
          {familyRows.map((row, index) => (
            <div key={`family-${index}`} className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Family Member #{index + 1}</p>
                {familyRows.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFamilyRows((prev) => prev.filter((_, i) => i !== index))}
                    className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Family Member Name</Label><Input name="family_name[]" defaultValue={row.name ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Relationship</Label><Input name="family_relationship[]" defaultValue={row.relationship ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Date of Birth</Label><FormDatePicker name="family_date_of_birth[]" defaultValue={normalizeDateForInput(row.date_of_birth)} placeholder="DD/MM/YYYY" /></div>
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Age</Label><Input name="family_age[]" type="number" defaultValue={row.age ?? ""} className="h-10 text-sm border-input bg-background" /></div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground">Blood Group</Label>
                  <FormSelect
                    name="family_blood_group[]"
                    defaultValue={row.blood_group ?? ""}
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
                <div className="space-y-1.5"><Label className="text-xs font-bold text-muted-foreground">Remark</Label><Input name="family_remark[]" defaultValue={row.remark ?? ""} className="h-10 text-sm border-input bg-background" /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
