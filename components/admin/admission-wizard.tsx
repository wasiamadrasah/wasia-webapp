"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { fullAdmitStudentAction } from "@/app/admin/students/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ArrowRight, CheckCircle2, User, Landmark, Users, Home, BookOpen, AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/sonner"
import { FormDatePicker } from "@/components/admin/form-date-picker"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { AcademicClassConfigRecord } from "@/lib/db"

interface AdmissionWizardProps {
  classConfigs: AcademicClassConfigRecord[]
  allSubjects: Array<{ id: string; name: string; is_active: boolean }> // list of all subjects to find optional ones
  groups: Array<{ id: string; name: string; is_active: boolean }>
}

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

const textClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"

export function AdmissionWizard({ classConfigs, allSubjects, groups }: AdmissionWizardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = React.useState<1 | 2 | 3 | 4 | 5 | 6>(1)
  const [errors, setErrors] = React.useState<string[]>([])
  const [showConfirm, setShowConfirm] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)
  
  React.useEffect(() => {
    const status = searchParams.get("status")
    const message = searchParams.get("message")
    if (status === "error") {
      toast.error(message || "An error occurred.")
      router.replace("/admin/students/admit")
      setStep(1)
    }
  }, [searchParams, router])

  // State maps
  const [placement, setPlacement] = React.useState({
    class_config_id: "",
    group_id: "",
    student_category: "general",
    roll_no: "",
  })

  const [profile, setProfile] = React.useState({
    name_en: "",
    name_bn: "",
    gender: "Male",
    religion: "Islam",
    blood_group: "",
    date_of_birth: "",
    birth_certificate_no: "",
    national_id: "",
    passport_no: "",
    mobile: "",
    email: "",
    note: "",
  })

  const [parents, setParents] = React.useState({
    father_name: "",
    father_nid: "",
    father_mobile: "",
    father_occupation: "",
    mother_name: "",
    mother_nid: "",
    mother_mobile: "",
    mother_occupation: "",
    guardian_name: "",
    guardian_nid: "",
    guardian_mobile: "",
    guardian_occupation: "",
  })

  const [addresses, setAddresses] = React.useState({
    present_address: "",
    present_division: "",
    present_district: "",
    present_thana: "",
    permanent_address: "",
    permanent_division: "",
    permanent_district: "",
    permanent_thana: "",
    same_as_present: false,
  })

  const [previous, setPrevious] = React.useState({
    prev_school: "",
    prev_class: "",
    prev_gpa: "",
    prev_result: "",
    tc_number: "",
    tc_date: "",
  })

  const [allClassSubjects, setAllClassSubjects] = React.useState<any[]>([])
  const [selectedOptional, setSelectedOptional] = React.useState<string[]>([])
  const [availableOptionals, setAvailableOptionals] = React.useState<any[]>([])
  const [availableChoices, setAvailableChoices] = React.useState<any[]>([])
  const [selectedCompulsoryChoice, setSelectedCompulsoryChoice] = React.useState<string>("")
  const [selectedOptionalChoice, setSelectedOptionalChoice] = React.useState<string>("")
  const [subjectGroupFilter, setSubjectGroupFilter] = React.useState<string>("")

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (step === 6) {
      if (placement.group_id) {
        const selectedGroupObj = groups.find((g) => g.id === placement.group_id)
        if (selectedGroupObj) {
          const name = selectedGroupObj.name.toLowerCase()
          if (name.includes("science")) {
            setSubjectGroupFilter("science")
          } else if (name.includes("business") || name.includes("commerce")) {
            setSubjectGroupFilter("business")
          } else if (name.includes("humanities") || name.includes("arts")) {
            setSubjectGroupFilter("humanities")
          } else {
            setSubjectGroupFilter("")
          }
        } else {
          setSubjectGroupFilter("")
        }
      } else {
        setSubjectGroupFilter("")
      }
    }
  }, [step, placement.group_id, groups])

  const handleFinalSubmit = async () => {
    if (step < 6) return
    if (!validateStep()) {
       toast("Validation Error", { description: "Please fix the validation errors before submitting." })
       toast.error("Please fix the validation errors before submitting.")
       window.scrollTo({ top: 0, behavior: 'smooth' })
       return
    }

    if (!formRef.current) return
    const formData = new FormData(formRef.current)

    setIsSubmitting(true)
    setShowConfirm(false)

    try {
       const res = await fullAdmitStudentAction(formData)
       if (res?.error) {
          toast("Error", { description: res.error })
          toast.error(res.error)
       } else if (res?.success) {
          toast("Success", {
            description: res.message || "Student admitted successfully!",
          })
          toast.success(res.message || "Student admitted successfully!")
          
          setStep(1)
          setPlacement({ class_config_id: "", group_id: "", student_category: "general", roll_no: "" })
          setProfile({ name_en: "", name_bn: "", gender: "Male", religion: "Islam", blood_group: "", date_of_birth: "", birth_certificate_no: "", national_id: "", passport_no: "", mobile: "", email: "", note: "" })
          setParents({ father_name: "", father_nid: "", father_mobile: "", father_occupation: "", mother_name: "", mother_nid: "", mother_mobile: "", mother_occupation: "", guardian_name: "", guardian_nid: "", guardian_mobile: "", guardian_occupation: "" })
          setAddresses({ present_address: "", present_division: "", present_district: "", present_thana: "", permanent_address: "", permanent_division: "", permanent_district: "", permanent_thana: "", same_as_present: false })
          setPrevious({ prev_school: "", prev_class: "", prev_gpa: "", prev_result: "", tc_number: "", tc_date: "" })
          setSelectedCompulsoryChoice("")
          setSelectedOptionalChoice("")
          setSelectedOptional([])
          formRef.current?.reset()
       }
    } catch (err) {
      console.error(err)
      if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
         toast("Error", { description: err.message || "An unexpected error occurred." })
         toast.error(err.message || "An unexpected error occurred.")
      } else {
         throw err;
      }
    } finally {
       setIsSubmitting(false)
    }
  }

  const shouldShowSubjectForGroup = (sub: any) => {
    const subGroups = sub.subject_groups || []
    if (subGroups.length === 0) {
      return true
    }
    if (!subjectGroupFilter) {
      return true
    }
    return subGroups.includes(subjectGroupFilter)
  }

  // Religion match helper for previewing dynamically matched religion courses
  const isReligionMatch = (subjectName: string, subjectCode: string) => {
    const subName = (subjectName || "").toLowerCase()
    const subCode = (subjectCode || "").toLowerCase()
    const studentRel = (profile.religion || "").toLowerCase()

    if (studentRel.includes("islam")) {
      return subName.includes("islam") || subCode.includes("isl")
    } else if (studentRel.includes("hindu") || studentRel.includes("sanatan")) {
      return subName.includes("hindu") || subName.includes("sanatan") || subCode.includes("hin")
    } else if (studentRel.includes("buddh")) {
      return subName.includes("buddh") || subCode.includes("bud")
    } else if (studentRel.includes("christ")) {
      return subName.includes("christ") || subCode.includes("chr")
    }
    return false
  }

  // 1. Fetch optional/choice subjects for selected config when stepping into subject step
  React.useEffect(() => {
    if (placement.class_config_id) {
      const fetchOptionals = async () => {
        try {
          const res = await fetch(`/api/class-setup/${placement.class_config_id}/subjects`)
          if (res.ok) {
            const data = await res.json()
            if (Array.isArray(data)) {
              const optionals = data.filter((s: any) => s && s.student_type === "optional")
              const choices = data.filter((s: any) => s && s.student_type === "choice")
              setAvailableOptionals(optionals)
              setAvailableChoices(choices)
              setAllClassSubjects(data)
            } else {
              throw new Error("Invalid response format")
            }
          } else {
            // Fallback to all active subjects as options if route fails
            const fallbacks = allSubjects.map((s) => ({
              id: s.id,
              name: s.name,
              subject_name: s.name,
              subject_id: s.id,
              student_type: "optional",
            }))
            setAvailableOptionals(fallbacks)
            setAvailableChoices([])
            setAllClassSubjects(fallbacks)
          }
        } catch (err) {
          console.error("Failed to fetch subjects:", err)
          setAvailableOptionals([])
          setAvailableChoices([])
          setAllClassSubjects([])
        }
      }
      fetchOptionals()
    }
  }, [placement.class_config_id, step, allSubjects])

  const validateStep = (): boolean => {
    const errList: string[] = []
    setErrors([])

    if (step === 1) {
      if (!placement.class_config_id) errList.push("Class combination placement is required.")
    } else if (step === 2) {
      if (!profile.name_en.trim()) errList.push("Student Name EN is required.")
      if (!profile.date_of_birth) errList.push("Date of Birth is required.")
      if (profile.birth_certificate_no && !/^\d{17}$/.test(profile.birth_certificate_no)) {
        errList.push("Birth Certificate Number must be exactly 17 digits.")
      }
      if (profile.mobile && !/^\d{11}$/.test(profile.mobile)) {
        errList.push("Mobile number must be exactly 11 digits.")
      }
    } else if (step === 3) {
      if (parents.father_nid && !/^\d{10}$|^\d{17}$/.test(parents.father_nid)) {
        errList.push("Father NID must be exactly 10 or 17 digits.")
      }
      if (parents.father_mobile && !/^\d{11}$/.test(parents.father_mobile)) {
        errList.push("Father Mobile must be exactly 11 digits.")
      }
      if (parents.mother_nid && !/^\d{10}$|^\d{17}$/.test(parents.mother_nid)) {
        errList.push("Mother NID must be exactly 10 or 17 digits.")
      }
      if (parents.mother_mobile && !/^\d{11}$/.test(parents.mother_mobile)) {
        errList.push("Mother Mobile must be exactly 11 digits.")
      }
      if (parents.guardian_nid && !/^\d{10}$|^\d{17}$/.test(parents.guardian_nid)) {
        errList.push("Legal Guardian NID must be exactly 10 or 17 digits.")
      }
      if (parents.guardian_mobile && !/^\d{11}$/.test(parents.guardian_mobile)) {
        errList.push("Legal Guardian Mobile must be exactly 11 digits.")
      }
    } else if (step === 4) {
      if (!addresses.present_address.trim()) errList.push("Present address line is required.")
    } else if (step === 6) {
      if (availableChoices.length > 0) {
        if (!selectedCompulsoryChoice) {
          errList.push("Compulsory Choice (3rd Subject) is required.")
        }
        if (selectedCompulsoryChoice && selectedOptionalChoice && selectedCompulsoryChoice === selectedOptionalChoice) {
          errList.push("Compulsory Choice and Optional (4th) Subject cannot be the same.")
        }
      }
    }

    if (errList.length > 0) {
      setErrors(errList)
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => (s + 1) as any)
    }
  }

  const handlePrev = () => {
    setStep((s) => (s - 1) as any)
  }

  const handleCheckboxChange = (id: string) => {
    setSelectedOptional((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Wizard Steps Header */}
      <div className="flex justify-between items-center bg-card border rounded-xl p-4 shadow-sm">
        {[
          { label: "Placement", icon: Landmark },
          { label: "Profile", icon: User },
          { label: "Guardians", icon: Users },
          { label: "Address", icon: Home },
          { label: "Previous", icon: BookOpen },
          { label: "Subjects", icon: BookOpen },
        ].map((item, idx) => {
          const stepNum = idx + 1
          const Icon = item.icon
          const isActive = step === stepNum
          const isDone = step > stepNum

          return (
            <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`size-8 rounded-full flex items-center justify-center border font-semibold text-sm ${
                  isActive
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : isDone
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-muted text-muted-foreground border-input"
                }`}
              >
                {isDone ? "✓" : stepNum}
              </div>
              <span className={`text-[10px] hidden sm:block ${isActive ? "text-indigo-600 font-semibold" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 space-y-1">
          <div className="flex gap-2 items-center text-sm font-semibold">
            <AlertCircle className="size-4 text-red-600" />
            <span>Form verification errors:</span>
          </div>
          <ul className="text-xs list-disc pl-4 space-y-0.5">
            {errors.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="rounded-xl border p-6 bg-card shadow-sm space-y-6"
      >
        {/* Hidden inputs to pass data when final submit triggers */}
        <input type="hidden" name="class_config_id" value={placement.class_config_id} />
        <input type="hidden" name="group_id" value={placement.group_id} />
        <input type="hidden" name="student_category" value={placement.student_category} />
        <input type="hidden" name="roll_no" value={placement.roll_no} />

        {/* Step 1 — Academic Placement */}
        <div className={step === 1 ? "block" : "hidden"}>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-foreground">Step 1 — Academic Placement</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Define student target placement combination.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="placement_config">Class Combination Placement *</Label>
                <select
                  id="placement_config"
                  value={placement.class_config_id}
                  onChange={(e) => setPlacement((prev) => ({ ...prev, class_config_id: e.target.value }))}
                  className={selectClass}
                >
                  <option value="">Select Placement Combination</option>
                  {classConfigs
                    .filter((cc) => cc.is_active)
                    .map((cc) => {
                      const label = [
                        cc.session_name,
                        cc.version_name,
                        cc.shift_name,
                        cc.class_name,
                        cc.section_name,
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

              <div className="space-y-2">
                <Label htmlFor="placement_group">Academic Group (If applicable)</Label>
                <select
                  id="placement_group"
                  value={placement.group_id}
                  onChange={(e) => setPlacement((prev) => ({ ...prev, group_id: e.target.value }))}
                  className={selectClass}
                >
                  <option value="">— General / No Group —</option>
                  {groups
                    .filter((g) => g.is_active)
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Enrollment Category</Label>
                <select
                  id="category"
                  value={placement.student_category}
                  onChange={(e) => setPlacement((prev) => ({ ...prev, student_category: e.target.value }))}
                  className={selectClass}
                >
                  <option value="general">General Student</option>
                  <option value="scholarship">Scholarship Intake</option>
                  <option value="quota">Quota / Special intake</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roll">Roll Number (Leave empty to auto-generate)</Label>
                <Input
                  id="roll"
                  type="number"
                  placeholder="e.g. 15"
                  value={placement.roll_no}
                  onChange={(e) => setPlacement((prev) => ({ ...prev, roll_no: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 — Student Profile */}
        <div className={step === 2 ? "block" : "hidden"}>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-foreground">Step 2 — Student Permanent Identity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Enter core student identity fields.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name_en">Student Name EN *</Label>
                <Input
                  id="name_en"
                  name="name_en"
                  placeholder="e.g. Rakib Hasan"
                  value={profile.name_en}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name_en: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name_bn">Student Name BN</Label>
                <Input
                  id="name_bn"
                  name="name_bn"
                  placeholder="e.g. রকিব হাসান"
                  value={profile.name_bn}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name_bn: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  name="gender"
                  value={profile.gender}
                  onChange={(e) => setProfile((prev) => ({ ...prev, gender: e.target.value }))}
                  className={selectClass}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="religion">Religion *</Label>
                <select
                  id="religion"
                  name="religion"
                  value={profile.religion}
                  onChange={(e) => setProfile((prev) => ({ ...prev, religion: e.target.value }))}
                  className={selectClass}
                >
                  <option value="Islam">Islam</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Buddhism">Buddhism</option>
                  <option value="Christianity">Christianity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blood_group">Blood Group</Label>
                <select
                  id="blood_group"
                  name="blood_group"
                  value={profile.blood_group}
                  onChange={(e) => setProfile((prev) => ({ ...prev, blood_group: e.target.value }))}
                  className={selectClass}
                >
                  <option value="">— Select Blood Group —</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <FormDatePicker
                  id="dob"
                  name="date_of_birth"
                  value={profile.date_of_birth}
                  onChange={(val) => setProfile((prev) => ({ ...prev, date_of_birth: val }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_certificate_no">Birth Certificate No (Exactly 17 Digits)</Label>
                <Input
                  id="birth_certificate_no"
                  name="birth_certificate_no"
                  placeholder="e.g. 2012xxxxxxxxxxxxx"
                  value={profile.birth_certificate_no}
                  onChange={(e) => setProfile((prev) => ({ ...prev, birth_certificate_no: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number (Exactly 11 Digits)</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  placeholder="e.g. 017xxxxxxxx"
                  value={profile.mobile}
                  onChange={(e) => setProfile((prev) => ({ ...prev, mobile: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. student@school.com"
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 — Parent & Guardian Info */}
        <div className={step === 3 ? "block" : "hidden"}>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-foreground">Step 3 — Parents & Guardians Details</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Provide parent and legal guardian configurations.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Father Info */}
              <div className="space-y-4 border p-4 rounded-xl bg-muted/20">
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-indigo-600">Father Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="father_name">Father Name EN</Label>
                  <Input
                    id="father_name"
                    name="father_name"
                    value={parents.father_name}
                    onChange={(e) => setParents((prev) => ({ ...prev, father_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father_nid">Father NID (10 or 17 Digits)</Label>
                  <Input
                    id="father_nid"
                    name="father_nid"
                    value={parents.father_nid}
                    onChange={(e) => setParents((prev) => ({ ...prev, father_nid: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father_mobile">Father Mobile (11 Digits)</Label>
                  <Input
                    id="father_mobile"
                    name="father_mobile"
                    value={parents.father_mobile}
                    onChange={(e) => setParents((prev) => ({ ...prev, father_mobile: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father_occupation">Occupation</Label>
                  <Input
                    id="father_occupation"
                    name="father_occupation"
                    value={parents.father_occupation}
                    onChange={(e) => setParents((prev) => ({ ...prev, father_occupation: e.target.value }))}
                  />
                </div>
              </div>

              {/* Mother Info */}
              <div className="space-y-4 border p-4 rounded-xl bg-muted/20">
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-indigo-600">Mother Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="mother_name">Mother Name EN</Label>
                  <Input
                    id="mother_name"
                    name="mother_name"
                    value={parents.mother_name}
                    onChange={(e) => setParents((prev) => ({ ...prev, mother_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mother_nid">Mother NID (10 or 17 Digits)</Label>
                  <Input
                    id="mother_nid"
                    name="mother_nid"
                    value={parents.mother_nid}
                    onChange={(e) => setParents((prev) => ({ ...prev, mother_nid: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mother_mobile">Mother Mobile (11 Digits)</Label>
                  <Input
                    id="mother_mobile"
                    name="mother_mobile"
                    value={parents.mother_mobile}
                    onChange={(e) => setParents((prev) => ({ ...prev, mother_mobile: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mother_occupation">Occupation</Label>
                  <Input
                    id="mother_occupation"
                    name="mother_occupation"
                    value={parents.mother_occupation}
                    onChange={(e) => setParents((prev) => ({ ...prev, mother_occupation: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 — Addresses */}
        <div className={step === 4 ? "block" : "hidden"}>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-foreground">Step 4 — Addresses</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Input present and permanent home locations.</p>
            </div>
            
            <div className="space-y-6">
              {/* Present Address */}
              <div className="space-y-4 border p-4 rounded-xl">
                <h3 className="font-semibold text-sm text-foreground text-indigo-600">Present Address *</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="present_division">Division</Label>
                    <Input
                      id="present_division"
                      name="present_division"
                      value={addresses.present_division}
                      onChange={(e) => setAddresses((prev) => ({ ...prev, present_division: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="present_district">District</Label>
                    <Input
                      id="present_district"
                      name="present_district"
                      value={addresses.present_district}
                      onChange={(e) => setAddresses((prev) => ({ ...prev, present_district: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="present_thana">Thana / Upazila</Label>
                    <Input
                      id="present_thana"
                      name="present_thana"
                      value={addresses.present_thana}
                      onChange={(e) => setAddresses((prev) => ({ ...prev, present_thana: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="present_address">Address Line *</Label>
                  <Input
                    id="present_address"
                    name="present_address"
                    placeholder="Village, Road, House No, etc."
                    value={addresses.present_address}
                    onChange={(e) => setAddresses((prev) => ({ ...prev, present_address: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Permanent Address */}
              <div className="space-y-4 border p-4 rounded-xl bg-muted/10">
                <h3 className="font-semibold text-sm text-foreground text-indigo-600 flex justify-between items-center">
                  <span>Permanent Address</span>
                  <label className="flex items-center gap-2 text-xs font-normal text-muted-foreground cursor-pointer hover:text-foreground">
                    <Checkbox
                      checked={addresses.same_as_present}
                      onCheckedChange={(checked) => {
                        const isChecked = checked === true
                        setAddresses((prev) => ({
                          ...prev,
                          same_as_present: isChecked,
                          permanent_address: isChecked ? prev.present_address : prev.permanent_address,
                          permanent_division: isChecked ? prev.present_division : prev.permanent_division,
                          permanent_district: isChecked ? prev.present_district : prev.permanent_district,
                          permanent_thana: isChecked ? prev.present_thana : prev.permanent_thana,
                        }))
                      }}
                    />
                    Same as Present Address
                  </label>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="permanent_division">Division</Label>
                    <Input
                      id="permanent_division"
                      name="permanent_division"
                      value={addresses.permanent_division}
                      disabled={addresses.same_as_present}
                      onChange={(e) => setAddresses((prev) => ({ ...prev, permanent_division: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permanent_district">District</Label>
                    <Input
                      id="permanent_district"
                      name="permanent_district"
                      value={addresses.permanent_district}
                      disabled={addresses.same_as_present}
                      onChange={(e) => setAddresses((prev) => ({ ...prev, permanent_district: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permanent_thana">Thana / Upazila</Label>
                    <Input
                      id="permanent_thana"
                      name="permanent_thana"
                      value={addresses.permanent_thana}
                      disabled={addresses.same_as_present}
                      onChange={(e) => setAddresses((prev) => ({ ...prev, permanent_thana: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permanent_address">Address Line</Label>
                  <Input
                    id="permanent_address"
                    name="permanent_address"
                    placeholder="Village, Road, House No, etc."
                    value={addresses.permanent_address}
                    disabled={addresses.same_as_present}
                    onChange={(e) => setAddresses((prev) => ({ ...prev, permanent_address: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 — Previous Academic Info */}
        <div className={step === 5 ? "block" : "hidden"}>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-foreground">Step 5 — Previous School Details</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Input details for transfer and re-admission intakes.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="prev_school">Previous Institute Name</Label>
                <Input
                  id="prev_school"
                  name="prev_school"
                  value={previous.prev_school}
                  onChange={(e) => setPrevious((prev) => ({ ...prev, prev_school: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prev_class">Previous Class</Label>
                <Input
                  id="prev_class"
                  name="prev_class"
                  value={previous.prev_class}
                  onChange={(e) => setPrevious((prev) => ({ ...prev, prev_class: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prev_gpa">Previous GPA</Label>
                <Input
                  id="prev_gpa"
                  name="prev_gpa"
                  type="number"
                  step="0.01"
                  min="0.00"
                  max="5.00"
                  value={previous.prev_gpa}
                  onChange={(e) => setPrevious((prev) => ({ ...prev, prev_gpa: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prev_result">Previous Result</Label>
                <Input
                  id="prev_result"
                  name="prev_result"
                  value={previous.prev_result}
                  onChange={(e) => setPrevious((prev) => ({ ...prev, prev_result: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tc_number">Transfer Certificate (TC) Number</Label>
                <Input
                  id="tc_number"
                  name="tc_number"
                  value={previous.tc_number}
                  onChange={(e) => setPrevious((prev) => ({ ...prev, tc_number: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tc_date">TC Date</Label>
                <FormDatePicker
                  id="tc_date"
                  name="tc_date"
                  value={previous.tc_date}
                  onChange={(val) => setPrevious((prev) => ({ ...prev, tc_date: val }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 6 — Subject Selection & Finish */}
        <div className={step === 6 ? "block" : "hidden"}>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-foreground">Step 6 — Subject Mapping</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Assign elective or optional courses.</p>
            </div>
            
            {/* Hidden input bindings to send the selected choices and optionals to fullAdmitStudentAction */}
            <input type="hidden" name="compulsory_choice_subject" value={selectedCompulsoryChoice} />
            <input type="hidden" name="optional_choice_subject" value={selectedOptionalChoice} />
            {selectedOptional.map((sid) => (
              <input key={sid} type="hidden" name="optional_subjects" value={sid} />
            ))}

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="font-semibold text-sm text-indigo-600">Unified Subject Enrollment Preview</h3>
                {placement.group_id && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="subject_group_filter" className="text-xs text-muted-foreground whitespace-nowrap">Filter by Group:</Label>
                    <select
                      id="subject_group_filter"
                      value={subjectGroupFilter}
                      onChange={(e) => setSubjectGroupFilter(e.target.value)}
                      className="h-8 rounded-lg border border-input bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">All Groups</option>
                      <option value="science">Science</option>
                      <option value="business">Business Studies</option>
                      <option value="humanities">Humanities</option>
                    </select>
                  </div>
                )}
              </div>
              
              {allClassSubjects.filter(shouldShowSubjectForGroup).length === 0 ? (
                <div className="text-xs text-muted-foreground italic border rounded p-4 bg-muted/30">
                  No subjects found. Please ensure subjects are mapped to this class in Academic Setup.
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden bg-background">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                        <th className="px-4 py-3">Subject Name & Code</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3 text-right">Status / Assignment Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {allClassSubjects.filter(shouldShowSubjectForGroup).map((sub) => {
                        const sid = sub.subject_id || sub.id
                        const name = sub.subject_name || sub.name
                        const code = sub.subject_code || ""
                        const type = sub.student_type || "mandatory"

                        // Hide other religion courses to show a dynamic preview of exactly matched subject
                        if (type === "religion") {
                          const matches = isReligionMatch(name, code)
                          if (!matches) {
                            return null
                          }
                        }

                        return (
                          <tr key={sid} className="hover:bg-muted/5 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-foreground">{name}</div>
                              {code && <div className="text-xs text-muted-foreground mt-0.5">Code: {code}</div>}
                            </td>
                            <td className="px-4 py-3.5">
                              {type === "mandatory" && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                                  Compulsory
                                </span>
                              )}
                              {type === "religion" && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-400">
                                  Religion
                                </span>
                              )}
                              {type === "choice" && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                                  Group Choice
                                </span>
                              )}
                              {type === "optional" && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-400">
                                  Optional Elective
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              {type === "mandatory" && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                                  ✓ Auto-Assigned
                                </span>
                              )}
                              {type === "religion" && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                                  ✓ Assigned ({profile.religion})
                                </span>
                              )}
                              {type === "choice" && (
                                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input
                                      type="radio"
                                      name="compulsory_choice"
                                      className="accent-emerald-600 w-4 h-4"
                                      checked={selectedCompulsoryChoice === sid}
                                      onChange={() => {
                                        setSelectedCompulsoryChoice(sid)
                                        if (selectedOptionalChoice === sid) {
                                          setSelectedOptionalChoice("")
                                        }
                                      }}
                                    />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Main Subject</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input
                                      type="radio"
                                      name="optional_choice"
                                      className="accent-indigo-600 w-4 h-4"
                                      checked={selectedOptionalChoice === sid}
                                      onChange={() => {
                                        setSelectedOptionalChoice(sid)
                                        if (selectedCompulsoryChoice === sid) {
                                          setSelectedCompulsoryChoice("")
                                        }
                                      }}
                                    />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">4th Subject (Optional)</span>
                                  </label>
                                  
                                  {/* Clear selection option if this is currently selected */}
                                  {(selectedCompulsoryChoice === sid || selectedOptionalChoice === sid) && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (selectedCompulsoryChoice === sid) setSelectedCompulsoryChoice("")
                                        if (selectedOptionalChoice === sid) setSelectedOptionalChoice("")
                                      }}
                                      className="text-xs text-rose-500 hover:text-rose-700 hover:underline"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>
                              )}
                              {type === "optional" && (
                                <div className="inline-flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground mr-1">
                                    {selectedOptional.includes(sid) ? "Assigned" : "Not Assigned"}
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked={selectedOptional.includes(sid)}
                                    onChange={() => handleCheckboxChange(sid)}
                                    className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                  />
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Footer Navigation buttons */}
        <div className="flex gap-3 pt-4 border-t justify-between">
          <div>
            {step > 1 && (
              <Button key="prev-btn" type="button" variant="outline" onClick={handlePrev}>
                Previous
              </Button>
            )}
          </div>
          <div>
            {step < 6 ? (
              <Button
                key="next-btn"
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
              >
                Next <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                key="submit-btn"
                type="button"
                onClick={() => {
                  if (!validateStep()) {
                     toast("Validation Error", { description: "Please fix the validation errors before submitting." })
                     toast.error("Please fix the validation errors before submitting.")
                     window.scrollTo({ top: 0, behavior: 'smooth' })
                     return
                  }
                  setShowConfirm(true)
                }}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 gap-1.5"
              >
                Complete Admission
              </Button>
            )}
          </div>
        </div>
      </form>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Admission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to complete the admission process and enroll this student? This will save all the data and generate a student roll number.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
               onClick={handleFinalSubmit}
               disabled={isSubmitting}
               className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Yes, Complete Admission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
