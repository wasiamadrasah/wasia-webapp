"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createAuditLog } from "@/app/server-actions/audit"
import { createSupabaseAdminClient, generateStudentUID, getAcademicClassConfigById } from "@/lib/db"
import { RATE_LIMITS, createUserRateLimitMiddleware } from "@/lib/rate-limit"

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function requireAdminSession() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "admin") {
    redirect("/admin/login")
  }
  return session.user.id
}

function checkAdminRateLimit(userId: string) {
  const rl = createUserRateLimitMiddleware(`admin:${userId}`, RATE_LIMITS.ADMIN_MUTATIONS)
  if (!rl.allowed) throw new Error("Rate limit exceeded. Please try again later.")
}

function isRedirectError(error: unknown) {
  return error instanceof Error && error.message.includes("NEXT_REDIRECT")
}

function resolveErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

function getGroupKey(groupName: string): string {
  const name = (groupName || "").toLowerCase()
  if (name.includes("science")) return "science"
  if (name.includes("business") || name.includes("commerce")) return "business"
  if (name.includes("humanities") || name.includes("arts")) return "humanities"
  return ""
}

function toNullableString(value: FormDataEntryValue | null): string | null {
  const text = typeof value === "string" ? value.trim() : ""
  return text ? text : null
}

function toNullableNumber(value: FormDataEntryValue | null): number | null {
  const text = toNullableString(value)
  if (!text) return null
  const parsed = Number.parseInt(text, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function toNullableBoolean(value: FormDataEntryValue | null): boolean | null {
  const text = toNullableString(value)
  if (text === "true" || text === "on") return true
  if (text === "false") return false
  return null
}

const REVALIDATE_PATHS = ["/admin/students", "/admin/students/enrollments", "/admin/students/directory"]

function revalidateStudentPaths(...extra: string[]) {
  for (const p of [...REVALIDATE_PATHS, ...extra]) {
    revalidatePath(p)
  }
}

// ─── QUICK ADD STUDENTS ──────────────────────────────────────────────────────

export async function quickAddStudentsAction(
  classConfigId: string,
  students: Array<{ name_en: string; gender: "Male" | "Female" | "Other"; mobile: string; roll_no?: string }>
) {
  const adminId = await requireAdminSession()
  checkAdminRateLimit(adminId)

  if (!classConfigId) throw new Error("Academic class combination is required.")
  if (!students || students.length === 0) throw new Error("No student data provided.")

  const supabase = createSupabaseAdminClient()

  // 1. Fetch Class Config details
  const classConfig = await getAcademicClassConfigById(classConfigId)
  if (!classConfig) throw new Error("Class combination config not found.")

  const sessionName = classConfig.session_name || new Date().getFullYear().toString()
  const yyStr = sessionName.length === 4 ? sessionName.substring(2, 4) : sessionName.substring(0, 2)

  // Get Class numeric code
  const { data: cls } = await supabase
    .from("classes")
    .select("numeric_value")
    .eq("id", classConfig.class_id)
    .maybeSingle()
  const classVal = cls?.numeric_value ?? 0
  const ccStr = String(classVal).padStart(2, "0").substring(0, 2)
  const prefix = `${yyStr}${ccStr}`

  // 2. Fetch Latest Serial for UID generation
  const { data: latestStudent } = await supabase
    .from("students")
    .select("student_uid")
    .like("student_uid", `${prefix}%`)
    .order("student_uid", { ascending: false })
    .limit(1)

  let nextSerial = 1
  if (latestStudent && latestStudent.length > 0) {
    const latestUID = latestStudent[0].student_uid
    const serialPart = latestUID.substring(4)
    const parsed = parseInt(serialPart, 10)
    if (!isNaN(parsed)) {
      nextSerial = parsed + 1
    }
  }

  // 3. Fetch latest Roll number for auto increment
  const { data: latestEnrollment } = await supabase
    .from("student_enrollments")
    .select("roll_no")
    .eq("academic_class_config_id", classConfigId)
    .order("roll_no", { ascending: false })
    .limit(1)

  let nextRoll = (latestEnrollment?.[0]?.roll_no ?? 0) + 1

  // 4. Validate and construct records
  const insertRecords: any[] = []
  const validationErrors: string[] = []

  students.forEach((s, idx) => {
    const rowNum = idx + 1
    if (!s.name_en) {
      validationErrors.push(`Row ${rowNum}: Name is required.`)
    }
    if (!s.gender || !["Male", "Female", "Other"].includes(s.gender)) {
      validationErrors.push(`Row ${rowNum}: Gender must be Male, Female, or Other.`)
    }
    if (s.mobile && !/^01\d{9}$/.test(s.mobile)) {
      validationErrors.push(`Row ${rowNum}: Mobile must be 11 digits starting with 01 (e.g. 01712345678).`)
    }

    const ssssStr = String(nextSerial++).padStart(4, "0")
    const studentUid = `${prefix}${ssssStr}`
    const finalRoll = s.roll_no ? parseInt(s.roll_no, 10) : nextRoll++

    insertRecords.push({
      studentData: {
        student_uid: studentUid,
        name_en: s.name_en.trim(),
        gender: s.gender,
        religion: null,
        date_of_birth: null,
        mobile: s.mobile || null,
        status: "active" as const,
      },
      enrollmentData: {
        academic_class_config_id: classConfigId,
        roll_no: finalRoll,
        admission_type: "new" as const,
        enrollment_status: "Active" as const,
      },
    })
  })

  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(" | "))
  }

  // 5. Batch Insert Students
  const studentsToInsert = insertRecords.map((r) => r.studentData)
  const { data: createdStudents, error: sErr } = await supabase
    .from("students")
    .insert(studentsToInsert)
    .select("id, student_uid")

  if (sErr) throw new Error(sErr.message)

  // 6. Batch Insert Enrollments
  const enrollmentsToInsert = insertRecords.map((r) => {
    const matchedStudent = (createdStudents as any[])?.find((cs) => cs.student_uid === r.studentData.student_uid)
    return {
      ...r.enrollmentData,
      student_id: matchedStudent!.id,
    }
  })

  const { error: eErr } = await supabase.from("student_enrollments").insert(enrollmentsToInsert)
  if (eErr) {
    // If enrollment fails, attempt cleanup of inserted students
    const createdIds = createdStudents?.map((s) => s.id) ?? []
    if (createdIds.length > 0) {
      await supabase.from("students").delete().in("id", createdIds)
    }
    throw new Error(eErr.message)
  }

  // 7. Auto assign Mandatory Subjects
  const { data: mandatorySubjects } = await supabase
    .from("class_subjects")
    .select("subject_id, is_optional")
    .eq("academic_class_config_id", classConfigId)

  if (mandatorySubjects && mandatorySubjects.length > 0) {
    const studentIds = createdStudents.map((s) => s.id)
    const { data: newEnrollments } = await supabase
      .from("student_enrollments")
      .select("id, student_id")
      .in("student_id", studentIds)
      .eq("academic_class_config_id", classConfigId)

    if (newEnrollments && newEnrollments.length > 0) {
      const studentSubjectsToInsert: any[] = []
      newEnrollments.forEach((e) => {
        mandatorySubjects.forEach((sub) => {
          if (!sub.is_optional) {
            studentSubjectsToInsert.push({
              enrollment_id: e.id,
              subject_id: sub.subject_id,
              subject_category: "Mandatory" as const,
            })
          }
        })
      })

      if (studentSubjectsToInsert.length > 0) {
        await supabase.from("student_subjects").insert(studentSubjectsToInsert)
      }
    }
  }

  revalidateStudentPaths()
}

// ─── BULK IMPORT STUDENTS (CSV) ──────────────────────────────────────────────

export async function bulkImportStudentsAction(
  classConfigId: string,
  rows: Array<{
    name_en: string
    name_bn?: string
    gender: "Male" | "Female" | "Other"
    religion?: "Islam" | "Hinduism" | "Buddhism" | "Christianity" | "Other"
    blood_group?: string
    date_of_birth?: string
    birth_certificate_no?: string
    mobile?: string
    email?: string
    roll_no?: string
    father_name?: string
    mother_name?: string
    guardian_mobile?: string
  }>
) {
  const adminId = await requireAdminSession()
  checkAdminRateLimit(adminId)

  if (!classConfigId) throw new Error("Academic combination class is required.")
  if (!rows || rows.length === 0) throw new Error("No data rows to import.")

  // 1. Perform validation
  const validationErrors: string[] = []
  rows.forEach((row, index) => {
    const line = index + 2
    if (!row.name_en) validationErrors.push(`Row ${line}: Name EN is required.`)
    if (!row.gender || !["Male", "Female", "Other"].includes(row.gender)) {
      validationErrors.push(`Row ${line}: Gender must be 'Male', 'Female', or 'Other'.`)
    }
    if (row.religion && !["Islam", "Hinduism", "Buddhism", "Christianity", "Other"].includes(row.religion)) {
      validationErrors.push(`Row ${line}: Religion must be 'Islam', 'Hinduism', 'Buddhism', 'Christianity', or 'Other'.`)
    }
    if (row.date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(row.date_of_birth)) {
      validationErrors.push(`Row ${line}: Date of Birth must be YYYY-MM-DD.`)
    }
    if (row.birth_certificate_no && !/^\d{17}$/.test(row.birth_certificate_no)) {
      validationErrors.push(`Row ${line}: Birth certificate must be exactly 17 digits.`)
    }
    if (row.mobile && !/^01\d{9}$/.test(row.mobile)) {
      validationErrors.push(`Row ${line}: Mobile must be 11 digits starting with 01 (e.g. 01712345678).`)
    }
    if (row.guardian_mobile && !/^01\d{9}$/.test(row.guardian_mobile)) {
      validationErrors.push(`Row ${line}: Guardian Mobile must be 11 digits starting with 01 (e.g. 01712345678).`)
    }
  })

  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(" \n"))
  }

  const supabase = createSupabaseAdminClient()

  // 2. Fetch config details
  const classConfig = await getAcademicClassConfigById(classConfigId)
  if (!classConfig) throw new Error("Class combination config not found.")

  const sessionName = classConfig.session_name || new Date().getFullYear().toString()
  const yyStr = sessionName.length === 4 ? sessionName.substring(2, 4) : sessionName.substring(0, 2)

  const { data: cls } = await supabase
    .from("classes")
    .select("numeric_value")
    .eq("id", classConfig.class_id)
    .maybeSingle()
  const classVal = cls?.numeric_value ?? 0
  const ccStr = String(classVal).padStart(2, "0").substring(0, 2)
  const prefix = `${yyStr}${ccStr}`

  // 3. Fetch latest serial for student ID
  const { data: latestStudent } = await supabase
    .from("students")
    .select("student_uid")
    .like("student_uid", `${prefix}%`)
    .order("student_uid", { ascending: false })
    .limit(1)

  let nextSerial = 1
  if (latestStudent && latestStudent.length > 0) {
    const latestUID = latestStudent[0].student_uid
    const serialPart = latestUID.substring(4)
    const parsed = parseInt(serialPart, 10)
    if (!isNaN(parsed)) {
      nextSerial = parsed + 1
    }
  }

  // 4. Fetch latest Roll number
  const { data: latestEnrollment } = await supabase
    .from("student_enrollments")
    .select("roll_no")
    .eq("academic_class_config_id", classConfigId)
    .order("roll_no", { ascending: false })
    .limit(1)

  let nextRoll = (latestEnrollment?.[0]?.roll_no ?? 0) + 1

  // 5. Construct records map
  const insertRecords: any[] = []
  rows.forEach((row) => {
    const ssssStr = String(nextSerial++).padStart(4, "0")
    const studentUid = `${prefix}${ssssStr}`
    const finalRoll = row.roll_no ? parseInt(row.roll_no, 10) : nextRoll++

    insertRecords.push({
      studentData: {
        student_uid: studentUid,
        name_en: row.name_en.trim(),
        name_bn: row.name_bn?.trim() || null,
        gender: row.gender,
        religion: row.religion || null,
        blood_group: row.blood_group || null,
        date_of_birth: row.date_of_birth || null,
        birth_certificate_no: row.birth_certificate_no || null,
        mobile: row.mobile || null,
        email: row.email?.trim() || null,
        status: "active" as const,
      },
      enrollmentData: {
        academic_class_config_id: classConfigId,
        roll_no: finalRoll,
        admission_type: "new" as const,
        enrollment_status: "Active" as const,
      },
      guardians: {
        fatherName: row.father_name?.trim() || null,
        motherName: row.mother_name?.trim() || null,
        guardianMobile: row.guardian_mobile || null,
      },
    })
  })

  // 6. Batch Insert Students
  const studentsToInsert = insertRecords.map((r) => r.studentData)
  const { data: createdStudents, error: sErr } = await supabase
    .from("students")
    .insert(studentsToInsert)
    .select("id, student_uid")

  if (sErr) throw new Error(sErr.message)

  // 7. Batch Insert Enrollments
  const enrollmentsToInsert = insertRecords.map((r) => {
    const matchedStudent = (createdStudents as any[])!.find((cs) => cs.student_uid === r.studentData.student_uid)
    return {
      ...r.enrollmentData,
      student_id: matchedStudent!.id,
    }
  })

  const { error: eErr } = await supabase.from("student_enrollments").insert(enrollmentsToInsert)
  if (eErr) {
    const createdIds = createdStudents?.map((s) => s.id) ?? []
    if (createdIds.length > 0) {
      await supabase.from("students").delete().in("id", createdIds)
    }
    throw new Error(eErr.message)
  }

  // 8. Batch Insert Guardians
  const guardiansToInsert: any[] = []
  createdStudents.forEach((student) => {
    const match = insertRecords.find((r) => r.studentData.student_uid === (student as any).student_uid)
    if (match) {
      if (match.guardians.fatherName) {
        guardiansToInsert.push({
          student_id: student.id,
          relation_type: "Father",
          name_en: match.guardians.fatherName,
          mobile: match.guardians.guardianMobile,
        })
      }
      if (match.guardians.motherName) {
        guardiansToInsert.push({
          student_id: student.id,
          relation_type: "Mother",
          name_en: match.guardians.motherName,
          mobile: match.guardians.guardianMobile,
        })
      }
    }
  })

  if (guardiansToInsert.length > 0) {
    await supabase.from("student_guardians").insert(guardiansToInsert)
  }

  // 9. Auto assign Mandatory Subjects
  const { data: mandatorySubjects } = await supabase
    .from("class_subjects")
    .select("subject_id, is_optional")
    .eq("academic_class_config_id", classConfigId)

  if (mandatorySubjects && mandatorySubjects.length > 0) {
    const studentIds = createdStudents.map((s) => s.id)
    const { data: newEnrollments } = await supabase
      .from("student_enrollments")
      .select("id, student_id")
      .in("student_id", studentIds)
      .eq("academic_class_config_id", classConfigId)

    if (newEnrollments && newEnrollments.length > 0) {
      const studentSubjectsToInsert: any[] = []
      newEnrollments.forEach((e) => {
        mandatorySubjects.forEach((sub) => {
          if (!sub.is_optional) {
            studentSubjectsToInsert.push({
              enrollment_id: e.id,
              subject_id: sub.subject_id,
              subject_category: "Mandatory" as const,
            })
          }
        })
      })

      if (studentSubjectsToInsert.length > 0) {
        await supabase.from("student_subjects").insert(studentSubjectsToInsert)
      }
    }
  }

  // Log the bulk import action
  await createAuditLog({
    user_id: adminId,
    action: "student_bulk_import",
    table_name: "students",
    status: "success",
    new_values: { imported_count: rows.length, target_class_config: classConfigId },
  })

  revalidateStudentPaths()
}

export async function getBulkImportLogs() {
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from("audit_logs")
      .select("id, created_at, user_id, new_values, status, error_message")
      .eq("action", "student_bulk_import")
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      if (error.code === "PGRST205") return [] // Table doesn't exist yet
      console.error("Error fetching import logs:", error.message || error)
      return []
    }

    if (!data || data.length === 0) return []

    // Fetch admin details manually to avoid join errors
    const userIds = [...new Set(data.map(log => log.user_id).filter(Boolean))]
    let adminMap: Record<string, { full_name?: string, email?: string }> = {}
    
    if (userIds.length > 0) {
      const { data: admins } = await supabase
        .from("admins")
        .select("id, full_name, email")
        .in("id", userIds)

      if (admins) {
        adminMap = admins.reduce((acc, admin) => {
          acc[admin.id] = admin
          return acc
        }, {} as any)
      }
    }

    // Attach admin info to logs
    return data.map(log => ({
      ...log,
      admins: adminMap[log.user_id as string] || { full_name: "Unknown", email: "Unknown" }
    }))
  } catch (error) {
    return []
  }
}


// ─── FULL ADMISSION FORM ─────────────────────────────────────────────────────

export async function fullAdmitStudentAction(formData: FormData) {
  const adminId = await requireAdminSession()
  checkAdminRateLimit(adminId)

  try {
    const supabase = createSupabaseAdminClient()

    // 1. Read placement details
    const classConfigId = toNullableString(formData.get("class_config_id"))
    const rollNo = toNullableNumber(formData.get("roll_no"))
    const category = toNullableString(formData.get("student_category")) || "general"

    if (!classConfigId) throw new Error("Academic combination class setup is required.")

    // Fetch config to verify
    const classConfig = await getAcademicClassConfigById(classConfigId)
    if (!classConfig) throw new Error("Class configuration combo not found.")

    // 2. Read student profile and validate
    const nameEn = toNullableString(formData.get("name_en"))
    const nameBn = toNullableString(formData.get("name_bn"))
    const gender = toNullableString(formData.get("gender"))
    const religion = toNullableString(formData.get("religion"))
    const bloodGroup = toNullableString(formData.get("blood_group"))
    const dob = toNullableString(formData.get("date_of_birth"))
    const birthCertNo = toNullableString(formData.get("birth_certificate_no"))
    const nid = toNullableString(formData.get("national_id"))
    const passportNo = toNullableString(formData.get("passport_no"))
    const mobile = toNullableString(formData.get("mobile"))
    const email = toNullableString(formData.get("email"))
    const note = toNullableString(formData.get("note"))

    if (!nameEn) throw new Error("Student Name EN is required.")
    if (!gender || !["Male", "Female", "Other"].includes(gender)) throw new Error("Gender must be Male, Female, or Other.")
    if (!religion || !["Islam", "Hinduism", "Buddhism", "Christianity", "Other"].includes(religion)) {
      throw new Error("Religion is required.")
    }
    if (!dob) throw new Error("Date of Birth is required.")

    // Custom strict validations requested
    if (birthCertNo && !/^\d{17}$/.test(birthCertNo)) {
      throw new Error("Birth certificate must be exactly 17 digits.")
    }
    if (mobile && !/^\d{11}$/.test(mobile)) {
      throw new Error("Mobile number must be exactly 11 digits.")
    }

    // Auto Roll generator fallback
    let finalRoll = rollNo
    if (!finalRoll) {
      const { data: latestRoll } = await supabase
        .from("student_enrollments")
        .select("roll_no")
        .eq("academic_class_config_id", classConfigId)
        .order("roll_no", { ascending: false })
        .limit(1)
      finalRoll = (latestRoll?.[0]?.roll_no ?? 0) + 1
    }

    // Generate Student UID
    const sessionName = classConfig.session_name || new Date().getFullYear().toString()
    const studentUid = await generateStudentUID(sessionName, classConfigId)

    // 3. Insert student core
    const { data: studentRecord, error: sErr } = await supabase
      .from("students")
      .insert({
        student_uid: studentUid,
        name_en: nameEn,
        name_bn: nameBn,
        gender,
        religion,
        blood_group: bloodGroup,
        date_of_birth: dob,
        birth_certificate_no: birthCertNo,
        national_id: nid,
        passport_no: passportNo,
        mobile,
        email,
        note,
        status: "active",
      })
      .select("id")
      .single()

    if (sErr) throw sErr

    const studentId = studentRecord.id

    // 4. Insert Guardians
    const guardiansList = []
    const fName = toNullableString(formData.get("father_name"))
    const fNid = toNullableString(formData.get("father_nid"))
    const fMobile = toNullableString(formData.get("father_mobile"))

    if (fNid && !/^\d{10}$|^\d{17}$/.test(fNid)) {
      throw new Error("Father NID must be exactly 10 or 17 digits.")
    }
    if (fMobile && !/^\d{11}$/.test(fMobile)) {
      throw new Error("Father mobile must be exactly 11 digits.")
    }

    if (fName) {
      guardiansList.push({
        student_id: studentId,
        relation_type: "Father" as const,
        name_en: fName,
        nid_no: fNid,
        mobile: fMobile,
        occupation: toNullableString(formData.get("father_occupation")),
      })
    }

    const mName = toNullableString(formData.get("mother_name"))
    const mNid = toNullableString(formData.get("mother_nid"))
    const mMobile = toNullableString(formData.get("mother_mobile"))

    if (mNid && !/^\d{10}$|^\d{17}$/.test(mNid)) {
      throw new Error("Mother NID must be exactly 10 or 17 digits.")
    }
    if (mMobile && !/^\d{11}$/.test(mMobile)) {
      throw new Error("Mother mobile must be exactly 11 digits.")
    }

    if (mName) {
      guardiansList.push({
        student_id: studentId,
        relation_type: "Mother" as const,
        name_en: mName,
        nid_no: mNid,
        mobile: mMobile,
        occupation: toNullableString(formData.get("mother_occupation")),
      })
    }

    const gName = toNullableString(formData.get("guardian_name"))
    const gNid = toNullableString(formData.get("guardian_nid"))
    const gMobile = toNullableString(formData.get("guardian_mobile"))

    if (gNid && !/^\d{10}$|^\d{17}$/.test(gNid)) {
      throw new Error("Legal Guardian NID must be exactly 10 or 17 digits.")
    }
    if (gMobile && !/^\d{11}$/.test(gMobile)) {
      throw new Error("Legal Guardian mobile must be exactly 11 digits.")
    }

    if (gName) {
      guardiansList.push({
        student_id: studentId,
        relation_type: "Guardian" as const,
        name_en: gName,
        nid_no: gNid,
        mobile: gMobile,
        occupation: toNullableString(formData.get("guardian_occupation")),
      })
    }

    if (guardiansList.length > 0) {
      const { error: gErr } = await supabase.from("student_guardians").insert(guardiansList)
      if (gErr) throw gErr
    }

    // 5. Insert Addresses
    const addresses = []
    const presentAddr = toNullableString(formData.get("present_address"))
    if (presentAddr) {
      addresses.push({
        student_id: studentId,
        address_type: "Present" as const,
        division: toNullableString(formData.get("present_division")),
        district: toNullableString(formData.get("present_district")),
        thana: toNullableString(formData.get("present_thana")),
        address_line: presentAddr,
      })
    }

    const permAddr = toNullableString(formData.get("permanent_address"))
    if (permAddr) {
      addresses.push({
        student_id: studentId,
        address_type: "Permanent" as const,
        division: toNullableString(formData.get("permanent_division")),
        district: toNullableString(formData.get("permanent_district")),
        thana: toNullableString(formData.get("permanent_thana")),
        address_line: permAddr,
      })
    }

    if (addresses.length > 0) {
      const { error: aErr } = await supabase.from("student_addresses").insert(addresses)
      if (aErr) throw aErr
    }

    // 6. Insert previous academics (if any)
    const prevSchool = toNullableString(formData.get("prev_school"))
    if (prevSchool) {
      const { error: pErr } = await supabase.from("student_previous_academics").insert({
        student_id: studentId,
        institute_name: prevSchool,
        previous_class: toNullableString(formData.get("prev_class")),
        previous_gpa: toNullableNumber(formData.get("prev_gpa")),
        previous_result: toNullableString(formData.get("prev_result")),
        tc_number: toNullableString(formData.get("tc_number")),
        tc_date: toNullableString(formData.get("tc_date")),
      })
      if (pErr) throw pErr
    }

    // 7. Create Enrollment
    const groupId = toNullableString(formData.get("group_id"))
    const { data: enrollment, error: eErr } = await supabase
      .from("student_enrollments")
      .insert({
        student_id: studentId,
        academic_class_config_id: classConfigId,
        group_id: groupId,
        admission_type: "new",
        student_category: category,
        roll_no: finalRoll,
        board_roll: toNullableString(formData.get("board_roll")),
        board_registration: toNullableString(formData.get("board_registration")),
      })
      .select("id")
      .single()

    if (eErr) throw eErr

    // 8. Assign Subjects (Mandatory automatically, Religion automatically, Optional manually)
    let groupKey = ""
    if (groupId) {
      const { data: grpData } = await supabase.from("groups").select("name").eq("id", groupId).single()
      if (grpData) {
        groupKey = getGroupKey(grpData.name)
      }
    }

    const { data: configSubjects } = await supabase
      .from("class_subjects")
      .select("subject_id, student_type, subject_name_override, subject_groups, subjects!subject_id(name, code)")
      .eq("academic_class_config_id", classConfigId)

    if (configSubjects && configSubjects.length > 0) {
      const subjectsToInsert: any[] = []

      // Mandatory/Religion subjects mapping
      configSubjects.forEach((cs) => {
        const subGroups = (cs.subject_groups as string[]) || []
        if (subGroups.length > 0) {
          if (!groupKey || !subGroups.includes(groupKey)) {
            return // Skip group choice subject for this student group
          }
        }

        const sub = cs.subjects as any
        if (cs.student_type !== "optional" && cs.student_type !== "choice") {
          if (cs.student_type === "religion") {
            const subName = (cs.subject_name_override || sub?.name || "").toLowerCase()
            const subCode = (sub?.code || "").toLowerCase()
            const studentRel = religion.toLowerCase()

            let matches = false
            if (studentRel.includes("islam")) {
              matches = subName.includes("islam") || subCode.includes("isl")
            } else if (studentRel.includes("hindu") || studentRel.includes("sanatan")) {
              matches = subName.includes("hindu") || subName.includes("sanatan") || subCode.includes("hin")
            } else if (studentRel.includes("buddh")) {
              matches = subName.includes("buddh") || subCode.includes("bud")
            } else if (studentRel.includes("christ")) {
              matches = subName.includes("christ") || subCode.includes("chr")
            }

            if (matches) {
              subjectsToInsert.push({
                enrollment_id: enrollment.id,
                subject_id: cs.subject_id,
                subject_category: "Religion" as const,
              })
            }
          } else {
            subjectsToInsert.push({
              enrollment_id: enrollment.id,
              subject_id: cs.subject_id,
              subject_category: "Mandatory" as const,
            })
          }
        }
      })

      // Read selected group choices from dropdowns
      const compulsoryChoiceId = formData.get("compulsory_choice_subject") as string | null
      const optionalChoiceId = formData.get("optional_choice_subject") as string | null

      if (compulsoryChoiceId) {
        subjectsToInsert.push({
          enrollment_id: enrollment.id,
          subject_id: compulsoryChoiceId,
          subject_category: "Mandatory" as const,
        })
      }

      if (optionalChoiceId) {
        subjectsToInsert.push({
          enrollment_id: enrollment.id,
          subject_id: optionalChoiceId,
          subject_category: "Optional" as const,
        })
      }

      // Read selected optional subjects from checklist
      const optionalIds = formData.getAll("optional_subjects") as string[]
      optionalIds.forEach((sid) => {
        subjectsToInsert.push({
          enrollment_id: enrollment.id,
          subject_id: sid,
          subject_category: "Optional" as const,
        })
      })

      if (subjectsToInsert.length > 0) {
        await supabase.from("student_subjects").insert(subjectsToInsert)
      }
    }

    revalidateStudentPaths()
    return { success: true, message: "Student admitted successfully" }
  } catch (error) {
    if (isRedirectError(error)) throw error
    const msg = resolveErrorMessage(error, "Failed to admit student")
    return { error: msg }
  }
}

// ─── ADMISSION APPLICATIONS (ONLINE REVIEW) ─────────────────────────────────

export async function processAdmissionApplicationAction(applicationId: string, approve: boolean, remarks?: string) {
  const adminId = await requireAdminSession()
  checkAdminRateLimit(adminId)

  const supabase = createSupabaseAdminClient()

  if (!approve) {
    // Reject application
    const { error } = await supabase
      .from("admission_applications")
      .update({
        status: "Rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId,
      })
      .eq("id", applicationId)

    if (error) throw new Error(error.message)
    revalidatePath("/admin/students/applications")
    return
  }

  // Approve Application: Fetch data to insert student
  const { data: app, error: appErr } = await supabase
    .from("admission_applications")
    .select("*")
    .eq("id", applicationId)
    .single()

  if (appErr) throw new Error(appErr.message)
  if (app.status === "Approved") throw new Error("Application is already approved.")

  const student = app.student_data_json as any
  const guardian = app.guardian_data_json as any

  // 1. Fetch target config
  const classConfig = await getAcademicClassConfigById(app.academic_class_config_id)
  if (!classConfig) throw new Error("Class configuration combo not found.")

  // 2. Fetch latest serial for UID
  const sessionName = classConfig.session_name || new Date().getFullYear().toString()
  const studentUid = await generateStudentUID(sessionName, app.academic_class_config_id)

  // 3. Insert student profile
  const { data: studentRecord, error: sErr } = await supabase
    .from("students")
    .insert({
      student_uid: studentUid,
      name_en: student.name_en,
      name_bn: student.name_bn || null,
      gender: student.gender,
      religion: student.religion,
      blood_group: student.blood_group || null,
      date_of_birth: student.date_of_birth,
      birth_certificate_no: student.birth_certificate_no || null,
      mobile: student.mobile || null,
      email: student.email || null,
      status: "active",
    })
    .select("id")
    .single()

  if (sErr) throw new Error(sErr.message)

  const studentId = studentRecord.id

  // 4. Insert Guardians
  const guardiansList = []
  if (guardian.father_name) {
    guardiansList.push({
      student_id: studentId,
      relation_type: "Father" as const,
      name_en: guardian.father_name,
      mobile: guardian.father_mobile || null,
    })
  }
  if (guardian.mother_name) {
    guardiansList.push({
      student_id: studentId,
      relation_type: "Mother" as const,
      name_en: guardian.mother_name,
      mobile: guardian.mother_mobile || null,
    })
  }

  if (guardiansList.length > 0) {
    await supabase.from("student_guardians").insert(guardiansList)
  }

  // 5. Auto generate Roll Number
  const { data: latestRoll } = await supabase
    .from("student_enrollments")
    .select("roll_no")
    .eq("academic_class_config_id", app.academic_class_config_id)
    .order("roll_no", { ascending: false })
    .limit(1)

  const nextRoll = (latestRoll?.[0]?.roll_no ?? 0) + 1

  // 6. Create Enrollment
  const appGroupId = student.group_id || null
  const { data: enrollRecord, error: eErr } = await supabase
    .from("student_enrollments")
    .insert({
      student_id: studentId,
      academic_class_config_id: app.academic_class_config_id,
      group_id: appGroupId,
      admission_type: "new",
      roll_no: nextRoll,
      enrollment_status: "Active",
    })
    .select("id")
    .single()

  if (eErr) {
    await supabase.from("students").delete().eq("id", studentId)
    throw new Error(eErr.message)
  }

  // 7. Auto assign Mandatory/Religion subjects
  let groupKey = ""
  if (appGroupId) {
    const { data: grpData } = await supabase.from("groups").select("name").eq("id", appGroupId).single()
    if (grpData) {
      groupKey = getGroupKey(grpData.name)
    }
  }

  const { data: configSubjects } = await supabase
    .from("class_subjects")
    .select("subject_id, student_type, subject_name_override, subject_groups, subjects!subject_id(name, code)")
    .eq("academic_class_config_id", app.academic_class_config_id)

  if (configSubjects && configSubjects.length > 0) {
    const subjectsToInsert: any[] = []
    configSubjects.forEach((cs) => {
      const subGroups = (cs.subject_groups as string[]) || []
      if (subGroups.length > 0) {
        if (!groupKey || !subGroups.includes(groupKey)) {
          return // Skip group choice subject for this student group
        }
      }

      const sub = cs.subjects as any
      if (cs.student_type !== "optional" && cs.student_type !== "choice") {
        if (cs.student_type === "religion") {
          const subName = (cs.subject_name_override || sub?.name || "").toLowerCase()
          const subCode = (sub?.code || "").toLowerCase()
          const studentReligion = (student.religion ?? "").toLowerCase()

          let matches = false
          if (studentReligion.includes("islam")) {
            matches = subName.includes("islam") || subCode.includes("isl")
          } else if (studentReligion.includes("hindu") || studentReligion.includes("sanatan")) {
            matches = subName.includes("hindu") || subName.includes("sanatan") || subCode.includes("hin")
          } else if (studentReligion.includes("buddh")) {
            matches = subName.includes("buddh") || subCode.includes("bud")
          } else if (studentReligion.includes("christ")) {
            matches = subName.includes("christ") || subCode.includes("chr")
          }

          if (matches) {
            subjectsToInsert.push({
              enrollment_id: enrollRecord.id,
              subject_id: cs.subject_id,
              subject_category: "Religion" as const,
            })
          }
        } else {
          subjectsToInsert.push({
            enrollment_id: enrollRecord.id,
            subject_id: cs.subject_id,
            subject_category: "Mandatory" as const,
          })
        }
      }
    })

    // Assign chosen optional/choice subjects from student_data_json if they exist
    const studentData = app.student_data_json as any
    if (studentData) {
      if (studentData.compulsory_choice_subject) {
        subjectsToInsert.push({
          enrollment_id: enrollRecord.id,
          subject_id: studentData.compulsory_choice_subject,
          subject_category: "Mandatory" as const,
        })
      }
      if (studentData.optional_choice_subject) {
        subjectsToInsert.push({
          enrollment_id: enrollRecord.id,
          subject_id: studentData.optional_choice_subject,
          subject_category: "Optional" as const,
        })
      }
      if (Array.isArray(studentData.optional_subjects)) {
        studentData.optional_subjects.forEach((sid: string) => {
          subjectsToInsert.push({
            enrollment_id: enrollRecord.id,
            subject_id: sid,
            subject_category: "Optional" as const,
          })
        })
      }
    }

    if (subjectsToInsert.length > 0) {
      await supabase.from("student_subjects").insert(subjectsToInsert)
    }
  }

  // 8. Update Application Status
  await supabase
    .from("admission_applications")
    .update({
      status: "Approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminId,
    })
    .eq("id", applicationId)

  revalidateStudentPaths("/admin/students/applications")
}

// ─── ADMISSION SETTINGS ──────────────────────────────────────────────────────

export async function updateAdmissionSettingsAction(formData: FormData) {
  const adminId = await requireAdminSession()
  checkAdminRateLimit(adminId)

  try {
    const supabase = createSupabaseAdminClient()

    const enable = toNullableBoolean(formData.get("enable_online_admission")) ?? false
    const startDate = toNullableString(formData.get("start_date"))
    const endDate = toNullableString(formData.get("end_date"))
    const requireApproval = toNullableBoolean(formData.get("require_approval")) ?? true
    const autoRoll = toNullableBoolean(formData.get("auto_roll_generation")) ?? true

    // Allowed classes json parsing
    const classes = formData.getAll("allowed_classes") as string[]

    const { error } = await supabase
      .from("admission_settings")
      .update({
        enable_online_admission: enable,
        start_date: startDate,
        end_date: endDate,
        require_approval: requireApproval,
        auto_roll_generation: autoRoll,
        allowed_classes: classes,
      })
      .eq("id", "default")

    if (error) throw error

    revalidatePath("/admin/students/settings")
    redirect("/admin/students/settings?status=success&message=Admission settings updated successfully")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const msg = resolveErrorMessage(error, "Failed to update settings")
    redirect(`/admin/students/settings?status=error&message=${encodeURIComponent(msg)}`)
  }
}

// ─── PROMOTION SYSTEM ────────────────────────────────────────────────────────

export async function promoteStudentsAction(
  targetClassConfigId: string,
  enrollmentIds: string[],
  rollMappings: Record<string, number>
) {
  const adminId = await requireAdminSession()
  checkAdminRateLimit(adminId)

  if (!targetClassConfigId) throw new Error("Target academic combination class is required.")
  if (!enrollmentIds || enrollmentIds.length === 0) throw new Error("Select at least one student to promote.")

  const supabase = createSupabaseAdminClient()

  // 1. Fetch Target config to verify
  const targetConfig = await getAcademicClassConfigById(targetClassConfigId)
  if (!targetConfig) throw new Error("Target configuration combo not found.")

  // 2. Fetch current enrollments
  const { data: currentEnrollments, error: ceErr } = await supabase
    .from("student_enrollments")
    .select("id, student_id, enrollment_status, group_id, students!student_id(religion)")
    .in("id", enrollmentIds)

  if (ceErr) throw new Error(ceErr.message)

  // 3. Mark old enrollments Completed and Insert New ones in transaction loop
  const enrollmentsToCreate: any[] = []

  for (const ce of currentEnrollments) {
    // Determine roll number mapping
    const roll = rollMappings[ce.id]
    if (!roll) {
      throw new Error(`Roll assignment mapping missing for student ID ${(ce as any).student_id}`)
    }

    enrollmentsToCreate.push({
      student_id: (ce as any).student_id,
      academic_class_config_id: targetClassConfigId,
      group_id: (ce as any).group_id || null,
      admission_type: "promotion" as const,
      roll_no: roll,
      promoted_from_enrollment_id: ce.id,
      enrollment_status: "Active" as const,
    })
  }

  // Complete old enrollments status
  const { error: completeErr } = await supabase
    .from("student_enrollments")
    .update({ enrollment_status: "Completed" })
    .in("id", enrollmentIds)

  if (completeErr) throw new Error(completeErr.message)

  // Batch insert new promoted enrollments
  const { data: createdEnrollments, error: insertErr } = await supabase
    .from("student_enrollments")
    .insert(enrollmentsToCreate)
    .select("id, student_id")

  if (insertErr) {
    // Rollback completes on failure
    await supabase.from("student_enrollments").update({ enrollment_status: "Active" }).in("id", enrollmentIds)
    throw new Error(insertErr.message)
  }

  // 4. Auto assign Mandatory & Religion subjects to promoted configurations
  const { data: groupsList } = await supabase.from("groups").select("id, name")
  const groupKeyMap: Record<string, string> = {}
  if (groupsList) {
    groupsList.forEach((g) => {
      groupKeyMap[g.id] = getGroupKey(g.name)
    })
  }

  const { data: targetSubjects } = await supabase
    .from("class_subjects")
    .select("subject_id, student_type, subject_name_override, subject_groups, subjects!subject_id(name, code)")
    .eq("academic_class_config_id", targetClassConfigId)

  if (targetSubjects && targetSubjects.length > 0) {
    const studentSubjectsToInsert: any[] = [];

    (createdEnrollments as any[]).forEach((e: any) => {
      const matchOld = currentEnrollments.find((ce) => ce.student_id === e.student_id)
      const religion = (matchOld?.students as any)?.religion ?? "Islam"
      const oldGroupId = (matchOld as any)?.group_id
      const groupKey = oldGroupId ? groupKeyMap[oldGroupId] || "" : ""

      targetSubjects.forEach((cs) => {
        const subGroups = (cs.subject_groups as string[]) || []
        if (subGroups.length > 0) {
          if (!groupKey || !subGroups.includes(groupKey)) {
            return // Skip group choice subject for this student group
          }
        }

        const sub = cs.subjects as any
        if (cs.student_type !== "optional" && cs.student_type !== "choice") {
          if (cs.student_type === "religion") {
            const subName = (cs.subject_name_override || sub?.name || "").toLowerCase()
            const subCode = (sub?.code || "").toLowerCase()
            const studentReligion = religion.toLowerCase()

            let matches = false
            if (studentReligion.includes("islam")) {
              matches = subName.includes("islam") || subCode.includes("isl")
            } else if (studentReligion.includes("hindu") || studentReligion.includes("sanatan")) {
              matches = subName.includes("hindu") || subName.includes("sanatan") || subCode.includes("hin")
            } else if (studentReligion.includes("buddh")) {
              matches = subName.includes("buddh") || subCode.includes("bud")
            } else if (studentReligion.includes("christ")) {
              matches = subName.includes("christ") || subCode.includes("chr")
            }

            if (matches) {
              studentSubjectsToInsert.push({
                enrollment_id: e.id,
                subject_id: cs.subject_id,
                subject_category: "Religion" as const,
              })
            }
          } else {
            studentSubjectsToInsert.push({
              enrollment_id: e.id,
              subject_id: cs.subject_id,
              subject_category: "Mandatory" as const,
            })
          }
        }
      })
    })

    if (studentSubjectsToInsert.length > 0) {
      await supabase.from("student_subjects").insert(studentSubjectsToInsert)
    }
  }

  revalidateStudentPaths()
}

export async function deleteStudentEnrollmentAction(enrollmentId: string) {
  try {
    const userId = await requireAdminSession()
    checkAdminRateLimit(userId)

    const supabase = createSupabaseAdminClient()

    // Find the enrollment to get the student_id
    const { data: enrollment, error: findErr } = await supabase
      .from("student_enrollments")
      .select("student_id")
      .eq("id", enrollmentId)
      .single()

    if (findErr || !enrollment) {
      return { error: findErr?.message || "Enrollment not found." }
    }

    // Delete the enrollment
    const { error: delErr } = await supabase
      .from("student_enrollments")
      .delete()
      .eq("id", enrollmentId)

    if (delErr) {
      return { error: delErr.message }
    }

    // Check if the student has other enrollments
    const { data: otherEnrollments } = await supabase
      .from("student_enrollments")
      .select("id")
      .eq("student_id", enrollment.student_id)

    if (!otherEnrollments || otherEnrollments.length === 0) {
      // It's the only enrollment, so delete the student entirely
      await supabase.from("students").delete().eq("id", enrollment.student_id)
    }

    revalidateStudentPaths()
    return { success: true, message: "Enrollment deleted successfully." }
  } catch (error) {
    if (isRedirectError(error)) throw error
    return { error: resolveErrorMessage(error, "Failed to delete enrollment.") }
  }
}
