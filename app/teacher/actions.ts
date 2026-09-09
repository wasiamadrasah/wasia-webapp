"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { compare, hash } from "bcryptjs"
import { randomInt } from "crypto"

import { getAuthSession } from "@/lib/auth"
import { createSupabaseAdminClient, getTeacherAccountByStaffId } from "@/lib/db"
import { sendOTPEmail } from "@/lib/email"
import { checkRateLimit } from "@/lib/rate-limit"
import { uploadImage } from "@/lib/r2"

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"])
const maxImageSize = 2 * 1024 * 1024

const requiredString = (formData: FormData, key: string, label: string) => {
  const value = formData.get(key)

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`)
  }

  return value.trim()
}

const optionalString = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

const normalizeDateInput = (value: string, label: string) => {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }

  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed)

  if (!match) {
    throw new Error(`${label} must use dd/mm/yyyy format.`)
  }

  const [, day, month, year] = match
  const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`)
  const isValid =
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() + 1 === Number(month) &&
    date.getUTCDate() === Number(day)

  if (!isValid) {
    throw new Error(`${label} is not a valid date.`)
  }

  return `${year}-${month}-${day}`
}

const optionalDateString = (formData: FormData, key: string, label: string) =>
  normalizeDateInput(optionalString(formData, key), label)

const requiredDateString = (formData: FormData, key: string, label: string) => {
  const value = optionalDateString(formData, key, label)

  if (!value) {
    throw new Error(`${label} is required.`)
  }

  return value
}

const normalizeHumanName = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  const isAllLower = trimmed === trimmed.toLowerCase()
  if (!isAllLower) return trimmed
  return trimmed
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

const redirectWithMessage = (path: string, status: "success" | "error", message: string) => {
  const params = new URLSearchParams({ status, message })
  redirect(`${path}?${params.toString()}`)
}

function isRedirectError(error: unknown) {
  return error instanceof Error && error.message.includes("NEXT_REDIRECT")
}

const sensitiveActionLimit = { requests: 5, windowMs: 15 * 60 * 1000 }
const otpRequestLimit = { requests: 3, windowMs: 15 * 60 * 1000 }
const otpVerifyLimit = { requests: 10, windowMs: 15 * 60 * 1000 }
const maxOtpAttempts = 5

const generateOTP = () => randomInt(100000, 1000000).toString()

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

async function requireTeacherId() {
  const session = await getAuthSession()

  if (session?.user?.role !== "teacher") {
    redirect("/teacher/login")
  }

  const account = await getTeacherAccountByStaffId(session.user.id)
  const role = account?.role?.toLowerCase() ?? "teacher"
  const status = account?.status?.toLowerCase() ?? "active"

  if (!account || role !== "teacher" || status !== "active" || account.can_login === false) {
    redirect("/teacher/login")
  }

  return session.user.id
}

function enforceRateLimit(key: string, limit: { requests: number; windowMs: number }) {
  const result = checkRateLimit(key, limit)

  if (!result.allowed) {
    throw new Error("Too many attempts. Please try again later.")
  }
}

async function uploadAsset(
  staffId: string,
  file: FormDataEntryValue | null,
  folder: "profiles" | "signatures"
) {
  if (!(file instanceof File) || file.size === 0) {
    return null
  }

  if (!imageTypes.has(file.type)) {
    throw new Error("Only JPG, PNG, and WEBP images are allowed.")
  }

  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"])
  if (!fileExtension || !allowedExtensions.has(fileExtension)) {
    throw new Error("Only JPG, PNG, and WEBP image extensions are allowed.")
  }

  if (file.size > maxImageSize) {
    throw new Error("Images must be 2MB or smaller.")
  }

  const result = await uploadImage(file, `teacher-photos/${folder}/${staffId}`)

  if (!result.success || !result.url) {
    throw new Error(result.error || "Failed to upload image to R2.")
  }

  return result.url
}

export async function updateTeacherProfileAction(formData: FormData) {
  const staffId = await requireTeacherId()

  try {
    const supabase = createSupabaseAdminClient()
    const fullNameEn = normalizeHumanName(requiredString(formData, "full_name_en", "Full name"))
    const profilePhotoUrl = await uploadAsset(staffId, formData.get("profile_photo"), "profiles")
    const signatureUrl = await uploadAsset(staffId, formData.get("signature"), "signatures")

    const updates: {
      full_name_en: string
      full_name_bn: string | null
      gender: string | null
      date_of_birth: string | null
      marital_status: string | null
      religion: string | null
      nationality: string | null
      blood_group: string | null
      designation: string | null
      subject: string | null
      employment_type: string | null
      joining_date: string | null
      contact_number: string | null
      alt_contact_number: string | null
      emergency_contact: string | null
      nid_number: string | null
      birth_certificate: string | null
      passport_number: string | null
      profile_photo?: string
      signature?: string
    } = {
      full_name_en: fullNameEn,
      full_name_bn: optionalString(formData, "full_name_bn") || null,
      gender: optionalString(formData, "gender") || null,
      date_of_birth: optionalDateString(formData, "date_of_birth", "Date of Birth"),
      marital_status: optionalString(formData, "marital_status") || null,
      religion: optionalString(formData, "religion") || null,
      nationality: optionalString(formData, "nationality") || null,
      blood_group: optionalString(formData, "blood_group") || null,
      designation: optionalString(formData, "designation") || null,
      subject: optionalString(formData, "subject") || null,
      employment_type: optionalString(formData, "employment_type") || null,
      joining_date: optionalDateString(formData, "joining_date", "Joining Date"),
      contact_number: optionalString(formData, "contact_number") || null,
      alt_contact_number: optionalString(formData, "alt_contact_number") || null,
      emergency_contact: optionalString(formData, "emergency_contact") || null,
      nid_number: optionalString(formData, "nid_number") || null,
      birth_certificate: optionalString(formData, "birth_certificate") || null,
      passport_number: optionalString(formData, "passport_number") || null,
    }

    if (profilePhotoUrl) {
      updates.profile_photo = profilePhotoUrl
    }

    if (signatureUrl) {
      updates.signature = signatureUrl
    }

    const { error } = await supabase.from("staffs").update(updates).eq("id", staffId)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/teacher/profile")
    revalidatePath("/teacher/dashboard")
    revalidatePath(`/teachers/${staffId}`)
    redirectWithMessage("/teacher/profile", "success", "Profile updated.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    const message = error instanceof Error ? error.message : "Profile update failed."
    redirectWithMessage("/teacher/profile", "error", message)
  }
}

export async function addTeacherAcademicAction(formData: FormData) {
  const staffId = await requireTeacherId()

  try {
    const supabase = createSupabaseAdminClient()
    const payload = {
      staff_id: staffId,
      degree: requiredString(formData, "degree", "Degree"),
      institution: requiredString(formData, "institution", "Institution"),
      subject: optionalString(formData, "subject") || null,
      passing_year: requiredString(formData, "passing_year", "Passing year"),
      result: optionalString(formData, "result") || null,
    }

    const { error } = await supabase.from("staff_academics").insert(payload)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/teacher/academics")
    revalidatePath("/teacher/dashboard")
    redirectWithMessage("/teacher/academics", "success", "Academic qualification added.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    const message = error instanceof Error ? error.message : "Academic entry failed."
    redirectWithMessage("/teacher/academics", "error", message)
  }
}

export async function addTeacherExperienceAction(formData: FormData) {
  const staffId = await requireTeacherId()

  try {
    const supabase = createSupabaseAdminClient()
    const payload = {
      staff_id: staffId,
      institute_name: requiredString(formData, "institute_name", "Institute name"),
      designation: requiredString(formData, "designation", "Designation"),
      subject: optionalString(formData, "subject") || null,
      employment_type: optionalString(formData, "employment_type") || null,
      start_date: requiredDateString(formData, "start_date", "Start Date"),
      end_date: optionalDateString(formData, "end_date", "End Date"),
    }

    const { error } = await supabase.from("staff_experience").insert(payload)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/teacher/experience")
    revalidatePath("/teacher/dashboard")
    redirectWithMessage("/teacher/experience", "success", "Experience record added.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    const message = error instanceof Error ? error.message : "Experience entry failed."
    redirectWithMessage("/teacher/experience", "error", message)
  }
}

export async function addTeacherTrainingAction(formData: FormData) {
  const staffId = await requireTeacherId()

  try {
    const supabase = createSupabaseAdminClient()
    const payload = {
      staff_id: staffId,
      training_name: requiredString(formData, "training_name", "Training name"),
      training_institute: requiredString(formData, "training_institute", "Training institute"),
      year: requiredString(formData, "year", "Year"),
      duration: optionalString(formData, "duration") || null,
      subject: optionalString(formData, "subject") || null,
    }

    const { error } = await supabase.from("staff_training").insert(payload)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/teacher/training")
    revalidatePath("/teacher/dashboard")
    redirectWithMessage("/teacher/training", "success", "Training record added.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    const message = error instanceof Error ? error.message : "Training entry failed."
    redirectWithMessage("/teacher/training", "error", message)
  }
}

export async function addTeacherFamilyAction(formData: FormData) {
  const staffId = await requireTeacherId()

  try {
    const supabase = createSupabaseAdminClient()
    const payload = {
      staff_id: staffId,
      name: requiredString(formData, "name", "Name"),
      relationship: requiredString(formData, "relationship", "Relationship"),
      age: optionalString(formData, "age") || null,
      blood_group: optionalString(formData, "blood_group") || null,
    }

    const { error } = await supabase.from("staff_family").insert(payload)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/teacher/family")
    revalidatePath("/teacher/dashboard")
    redirectWithMessage("/teacher/family", "success", "Family member added.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    const message = error instanceof Error ? error.message : "Family entry failed."
    redirectWithMessage("/teacher/family", "error", message)
  }
}

export async function updateTeacherEmailAction(formData: FormData) {
  await requireTeacherId()
  void formData

  redirectWithMessage(
    "/teacher/settings",
    "error",
    "Email changes require OTP verification. Please request a verification code first."
  )
}

export async function requestTeacherEmailChangeOTP(newEmail: string, currentPassword: string) {
  const staffId = await requireTeacherId()
  const normalizedNewEmail = newEmail.trim().toLowerCase()

  try {
    await enforceRateLimit(`teacher:${staffId}:email-otp-request`, otpRequestLimit)
    await enforceRateLimit(`teacher:${staffId}:sensitive`, sensitiveActionLimit)

    const supabase = createSupabaseAdminClient()
    const account = await getTeacherAccountByStaffId(staffId)

    if (!account) {
      return { success: false, message: "Teacher account not found." }
    }

    const currentEmail = account.email?.toLowerCase()

    if (!normalizedNewEmail || normalizedNewEmail === currentEmail) {
      return { success: false, message: "Please enter a different email address." }
    }

    if (!isValidEmail(normalizedNewEmail)) {
      return { success: false, message: "Please enter a valid email address." }
    }

    const validPassword = await compare(currentPassword, account.password_hash)

    if (!validPassword) {
      return { success: false, message: "Current password is incorrect." }
    }

    const { data: existing } = await supabase
      .from("staff_accounts")
      .select("staff_id")
      .ilike("email", normalizedNewEmail)
      .neq("staff_id", staffId)
      .maybeSingle<{ staff_id: string }>()

    if (existing) {
      return { success: false, message: "That email address is already in use." }
    }

    const { data: adminWithEmail } = await supabase
      .from("admins")
      .select("id")
      .ilike("email", normalizedNewEmail)
      .maybeSingle<{ id: string }>()

    if (adminWithEmail) {
      return { success: false, message: "That email address is already in use." }
    }

    const { data: profile } = await supabase
      .from("staffs")
      .select("full_name_en")
      .eq("id", staffId)
      .maybeSingle<{ full_name_en: string | null }>()

    const otp = generateOTP()
    const otpHash = await hash(otp, 10)

    await supabase
      .from("email_otp_tokens")
      .update({ verified: true })
      .eq("staff_id", staffId)
      .eq("verified", false)

    const { error: otpError } = await supabase.from("email_otp_tokens").insert({
      staff_id: staffId,
      new_email: normalizedNewEmail,
      otp_code: otpHash,
      attempt_count: 0,
      locked_at: null,
    })

    if (otpError) {
      return { success: false, message: otpError.message }
    }

    const emailResult = await sendOTPEmail(normalizedNewEmail, otp, profile?.full_name_en || "Teacher")

    if (!emailResult.success) {
      return { success: false, message: "Failed to send OTP email. Please check the email address." }
    }

    return {
      success: true,
      message: `Verification code sent to ${normalizedNewEmail}. It will expire in 15 minutes.`,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to request email verification."
    return { success: false, message }
  }
}

export async function verifyTeacherEmailChangeOTP(otp: string) {
  const staffId = await requireTeacherId()
  const normalizedOTP = otp.trim()

  if (!/^\d{6}$/.test(normalizedOTP)) {
    return { success: false, message: "Please enter a valid 6-digit OTP." }
  }

  try {
    await enforceRateLimit(`teacher:${staffId}:email-otp-verify`, otpVerifyLimit)

    const supabase = createSupabaseAdminClient()
    const { data: otpToken, error: tokenError } = await supabase
      .from("email_otp_tokens")
      .select("id, new_email, otp_code, attempt_count, locked_at")
      .eq("staff_id", staffId)
      .gt("expires_at", new Date().toISOString())
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<{
        id: string
        new_email: string
        otp_code: string
        attempt_count: number | null
        locked_at: string | null
      }>()

    if (tokenError) {
      return { success: false, message: tokenError.message }
    }

    if (!otpToken) {
      return { success: false, message: "Invalid or expired OTP." }
    }

    const attemptCount = otpToken.attempt_count ?? 0

    if (otpToken.locked_at || attemptCount >= maxOtpAttempts) {
      return { success: false, message: "Too many invalid attempts. Please request a new verification code." }
    }

    const validOTP = await compare(normalizedOTP, otpToken.otp_code)

    if (!validOTP) {
      const nextAttemptCount = attemptCount + 1
      await supabase
        .from("email_otp_tokens")
        .update({
          attempt_count: nextAttemptCount,
          locked_at: nextAttemptCount >= maxOtpAttempts ? new Date().toISOString() : null,
        })
        .eq("id", otpToken.id)

      return { success: false, message: "Invalid or expired OTP." }
    }

    const { data: existing } = await supabase
      .from("staff_accounts")
      .select("staff_id")
      .ilike("email", otpToken.new_email)
      .neq("staff_id", staffId)
      .maybeSingle<{ staff_id: string }>()

    if (existing) {
      return { success: false, message: "That email address is already in use." }
    }

    const accountUpdate = await supabase
      .from("staff_accounts")
      .update({ email: otpToken.new_email })
      .eq("staff_id", staffId)
    const profileUpdate = await supabase.from("staffs").update({ email: otpToken.new_email }).eq("id", staffId)

    if (accountUpdate.error || profileUpdate.error) {
      return {
        success: false,
        message: accountUpdate.error?.message || profileUpdate.error?.message || "Email update failed.",
      }
    }

    await supabase.from("email_otp_tokens").update({ verified: true }).eq("id", otpToken.id)

    revalidatePath("/teacher/settings")
    revalidatePath("/teacher/profile")
    revalidatePath("/teacher/dashboard")

    return {
      success: true,
      message: "Email updated successfully. Please sign in again if your session is refreshed.",
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to verify OTP."
    return { success: false, message }
  }
}

export async function updateTeacherPasswordAction(formData: FormData) {
  const staffId = await requireTeacherId()

  try {
    await enforceRateLimit(`teacher:${staffId}:password-change`, sensitiveActionLimit)

    const supabase = createSupabaseAdminClient()
    const currentPassword = requiredString(formData, "current_password", "Current password")
    const newPassword = requiredString(formData, "new_password", "New password")
    const confirmPassword = requiredString(formData, "confirm_password", "Confirm password")
    const account = await getTeacherAccountByStaffId(staffId)

    if (!account) {
      throw new Error("Teacher account not found.")
    }

    if (newPassword.length < 10) {
      throw new Error("New password must be at least 10 characters long.")
    }

    if (newPassword !== confirmPassword) {
      throw new Error("New password and confirmation do not match.")
    }

    const validPassword = await compare(currentPassword, account.password_hash)

    if (!validPassword) {
      throw new Error("Current password is incorrect.")
    }

    const passwordHash = await hash(newPassword, 12)
    const { error } = await supabase.from("staff_accounts").update({ password_hash: passwordHash }).eq("staff_id", staffId)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath("/teacher/settings")
    redirectWithMessage("/teacher/settings", "success", "Password updated.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    const message = error instanceof Error ? error.message : "Password update failed."
    redirectWithMessage("/teacher/settings", "error", message)
  }
}
