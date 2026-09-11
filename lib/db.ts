import "server-only"

import { createClient } from "@supabase/supabase-js"

const getEnv = (name: "NEXT_PUBLIC_SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY") => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is required for secure server-side database access.`)
  }

  return value
}

export type TeacherProfileRecord = {
  id: string
  employee_id: string | null
  full_name_en: string | null
  full_name_bn: string | null
  profile_photo: string | null
  signature: string | null
  gender: string | null
  date_of_birth: string | null
  marital_status: string | null
  religion: string | null
  nationality: string | null
  blood_group: string | null
  designation: string | null
  type: string | null
  subject: string | null
  employment_type: string | null
  email: string | null
  contact_number: string | null
  alt_contact_number: string | null
  emergency_contact: string | null
  nid_number: string | null
  birth_certificate: string | null
  passport_number: string | null
  joining_date: string | null
}

export type AcademicRecord = {
  id: string
  degree: string | null
  institution: string | null
  subject: string | null
  passing_year: number | null
  duration: string | null
  result: string | null
}

export type ExperienceRecord = {
  id: string
  institute_name: string | null
  location: string | null
  designation: string | null
  subject: string | null
  employment_type: string | null
  start_date: string | null
  end_date: string | null
  currently_working: boolean | null
}

export type TrainingRecord = {
  id: string
  training_name: string | null
  training_institute: string | null
  year: number | null
  duration: string | null
  subject: string | null
}

export type FamilyRecord = {
  id: string
  name: string | null
  relationship: string | null
  date_of_birth: string | null
  age: number | null
  blood_group: string | null
  remark: string | null
}

export type AddressRecord = {
  id: string
  address_type: string | null
  house: string | null
  road: string | null
  area: string | null
  post_office: string | null
  post_code: string | null
  thana: string | null
  district: string | null
}

export type GovernmentInfoRecord = {
  id: string
  ntrca_registration: string | null
  mpo_date: string | null
  pds_id: string | null
  index_number: string | null
  first_joining_date: string | null
  appointment_letter_no: string | null
}

export type StaffListRecord = {
  id: string
  employee_id: string | null
  full_name_en: string | null
  designation: string | null
  subject: string | null
  email: string | null
  contact_number: string | null
  status: string | null
  can_login: boolean | null
  type: string | null
  joining_date: string | null
  profile_photo: string | null
}

export type NoticeRecord = {
  id: string
  title: string | null
  content: string | null
  notice_type: string | null
  publish_date: string | null
  published: boolean | null
  image_url: string | null
  attachment_url: string | null
  published_at: string | null
  created_at: string | null
  author_id: string | null
  author_name: string | null
  views: number
}

export type NoticeCategoryRecord = {
  name: string
}

export type NoticeCategoryAdminRecord = {
  id: string
  name: string
  is_active: boolean
  created_at: string | null
}

export type NotificationRecord = {
  id: string
  title: string | null
  content: string | null
  category: string | null
  target_role: string | null
  published: boolean | null
  published_at: string | null
  created_at: string | null
  author_id: string | null
  author_name: string | null
}

export type NotificationCategoryAdminRecord = {
  id: string
  name: string
  is_active: boolean
  created_at: string | null
}

export type NewsRecord = {
  id: string
  title: string | null
  content: string | null
  category: string | null
  featured_image_url: string | null
  publish_date: string | null
  published: boolean | null
  published_at: string | null
  created_at: string | null
  author_id: string | null
  author_name: string | null
  views: number
}

export type BlogRecord = {
  id: string
  title: string | null
  content: string | null
  category: string | null
  featured_image_url: string | null
  publish_date: string | null
  published: boolean | null
  published_at: string | null
  created_at: string | null
  author_id: string | null
  author_name: string | null
  views: number
}

export type EventRecord = {
  id: string
  title: string | null
  slug: string | null
  short_description: string | null
  description: string | null
  category: string | null
  event_type: string | null
  status: string | null
  image: string | null
  image_url?: string | null
  start_date: string | null
  end_date: string | null
  start_time: string | null
  end_time: string | null
  all_day: boolean | null
  registration_deadline: string | null
  timezone: string | null
  event_date?: string | null
  location?: string | null
  venue_name: string | null
  address: string | null
  city: string | null
  district_state: string | null
  google_map_link: string | null
  room_number: string | null
  meeting_platform: string | null
  meeting_url: string | null
  meeting_id: string | null
  meeting_passcode: string | null
  organizer_name: string | null
  organizer_email: string | null
  organizer_phone: string | null
  co_organizer: string | null
  hosted_by: string | null
  registration_enabled: boolean | null
  max_participants: number | null
  registration_fee: number | null
  payment_method: string | null
  ticket_type: string | null
  approval_required: boolean | null
  custom_form_fields: Record<string, unknown> | null
  thumbnail_image_url: string | null
  gallery_images: string[] | null
  brochure_url: string | null
  promo_video_url: string | null
  event_logo_url: string | null
  meta_title: string | null
  meta_description: string | null
  keywords: string | null
  social_share_image_url: string | null
  share_buttons_enabled: boolean | null
  is_public: boolean | null
  audience_type: string | null
  applicable_class: string | null
  session_batch: string | null
  department: string | null
  is_featured: boolean | null
  homepage_highlight: boolean | null
  password_protected: boolean | null
  event_password: string | null
  email_reminder_enabled: boolean | null
  sms_reminder_enabled: boolean | null
  reminder_schedule: string | null
  guest_speakers: Record<string, unknown>[] | null
  sponsors: Record<string, unknown>[] | null
  dress_code: string | null
  required_materials: string | null
  certificate_available: boolean | null
  attendance_tracking: boolean | null
  feedback_form_enabled: boolean | null
  qr_checkin_enabled: boolean | null
  ticket_download_enabled: boolean | null
  created_by: string | null
  updated_by: string | null
  published?: boolean | null
  created_at: string | null
  updated_at: string | null
}

export type EventCategoryRecord = {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export type EventRegistrationRecord = {
  id: string
  event_id: string
  participant_name: string
  participant_email: string
  participant_phone: string | null
  participant_department: string | null
  participant_student_id: string | null
  custom_fields: Record<string, unknown> | null
  status: string
  registered_at: string | null
  created_at: string | null
  updated_at: string | null
}

export type EventAttendanceRecord = {
  id: string
  event_id: string
  registration_id: string | null
  participant_name: string
  participant_email: string | null
  check_in_time: string | null
  check_out_time: string | null
  attended: boolean
  created_at: string | null
  updated_at: string | null
}

export type EventCertificateRecord = {
  id: string
  event_id: string
  registration_id: string | null
  participant_name: string
  participant_email: string | null
  certificate_url: string | null
  certificate_issued_at: string | null
  created_at: string | null
  updated_at: string | null
}

export type GoverningBodyMemberRecord = {
  id: string
  name: string
  designation: string
  category: string
  image_url: string | null
  phone: string | null
  email: string | null
  created_at: string | null
  updated_at: string | null
}

export function createSupabaseAdminClient() {
  return createClient(getEnv("NEXT_PUBLIC_SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
    },
  })
}

const escapeLike = (value: string) => value.replace(/[%_,]/g, "")

const isMissingTableError = (error: { code?: string; message?: string } | null) => {
  if (!error) return false

  const message = (error.message ?? "").toLowerCase()
  return (
    error.code === "PGRST205" ||
    message.includes("schema cache") ||
    message.includes("relation") && message.includes("does not exist")
  )
}

const isMissingColumnError = (error: { code?: string; message?: string } | null) => {
  if (!error) return false

  const message = (error.message ?? "").toLowerCase()
  return (
    message.includes("column") &&
    (message.includes("does not exist") ||
      message.includes("could not find") ||
      message.includes("schema cache"))
  )
}

type AuthoredContentRow = {
  author_id: string | null
  author_name?: string | null
  views: number | null
}

type ContentLookupOptions = {
  incrementViews?: boolean
}

type ContentTableName = "notices" | "news_posts" | "blog_posts"

function isPubliclyVisible(
  record: { published?: boolean | null; publish_date?: string | null; published_at?: string | null } | null | undefined
): boolean {
  if (!record || !record.published) return false
  const dateStr = record.publish_date || record.published_at
  if (!dateStr) return true
  const pubTime = new Date(dateStr).getTime()
  if (isNaN(pubTime)) return true
  return pubTime <= Date.now()
}

function normalizeDisplayName(value: string | null | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed || null
}

function formatAuthorDisplayName(rawNameOrEmail: string | null | undefined): string {
  if (!rawNameOrEmail) return "Admin"
  const trimmed = rawNameOrEmail.trim()
  if (!trimmed) return "Admin"

  if (trimmed.includes("@")) {
    const username = trimmed.split("@")[0]
    if (username.toLowerCase() === "admin" || username.toLowerCase() === "superadmin") {
      return "Admin"
    }
    const formatted = username
      .replace(/[._-]/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ")
    return formatted || "Admin"
  }

  return trimmed
}

async function hydrateAuthorNames<T extends AuthoredContentRow>(rows: T[]) {
  if (!rows.length) return rows

  const normalizedRows = rows.map((row) => ({
    ...row,
    author_name: normalizeDisplayName(row.author_name),
    views: row.views ?? 0,
  }))

  const rowsNeedingResolution = normalizedRows.filter(
    (row) => !row.author_name || row.author_name.includes("@") || Boolean(row.author_id)
  )

  if (rowsNeedingResolution.length === 0) {
    return normalizedRows.map((r) => ({
      ...r,
      author_name: formatAuthorDisplayName(r.author_name),
    }))
  }

  const supabase = createSupabaseAdminClient()

  // 1. Check admins table by ID and Email (try full_name and fallback to name)
  const adminNameMap = new Map<string, string>()
  const adminEmailToNameMap = new Map<string, string>()
  try {
    const { data: admins, error: adminErr } = await supabase
      .from("admins")
      .select("id, email, full_name")

    if (!adminErr && admins) {
      for (const admin of admins as { id: string; email: string | null; full_name: string | null }[]) {
        const name = admin.full_name?.trim()
        if (name) {
          adminNameMap.set(admin.id, name)
          if (admin.email) {
            adminEmailToNameMap.set(admin.email.trim().toLowerCase(), name)
          }
        }
      }
    } else {
      // Fallback: check if column is named 'name'
      const { data: altAdmins } = await supabase
        .from("admins")
        .select("id, email, name")

      if (altAdmins) {
        for (const admin of altAdmins as { id: string; email: string | null; name: string | null }[]) {
          const name = admin.name?.trim()
          if (name) {
            adminNameMap.set(admin.id, name)
            if (admin.email) {
              adminEmailToNameMap.set(admin.email.trim().toLowerCase(), name)
            }
          }
        }
      }
    }
  } catch {
    // Table or column might be absent in some schemas
  }

  // 2. Check staffs table and staff_accounts by ID and Email
  const staffAccountNameMap = new Map<string, string>()
  const staffEmailToNameMap = new Map<string, string>()
  try {
    const { data: staffs } = await supabase
      .from("staffs")
      .select("id, full_name_en, email")

    const staffMap = new Map(
      (staffs ?? []).map((s: { id: string; full_name_en: string | null }) => [s.id, s.full_name_en?.trim()])
    )

    for (const s of (staffs ?? []) as { id: string; full_name_en: string | null; email: string | null }[]) {
      if (s.full_name_en?.trim()) {
        const sName = s.full_name_en.trim()
        staffAccountNameMap.set(s.id, sName)
        if (s.email) {
          staffEmailToNameMap.set(s.email.trim().toLowerCase(), sName)
        }
      }
    }

    const { data: accounts } = await supabase
      .from("staff_accounts")
      .select("id, staff_id, email")

    const accountRows = (accounts ?? []) as { id: string; staff_id: string | null; email: string | null }[]
    for (const acc of accountRows) {
      if (acc.staff_id && staffMap.has(acc.staff_id)) {
        const sName = staffMap.get(acc.staff_id)
        if (sName) {
          staffAccountNameMap.set(acc.id, sName)
          if (acc.email) {
            staffEmailToNameMap.set(acc.email.trim().toLowerCase(), sName)
          }
        }
      }
    }
  } catch {
    // Ignore error
  }

  return normalizedRows.map((row) => {
    let resolvedName: string | null = null

    // Check if author_id matches staff_accounts or admins
    if (row.author_id) {
      resolvedName =
        staffAccountNameMap.get(row.author_id) ||
        adminNameMap.get(row.author_id) ||
        null
    }

    // Check if author_name is an email that matches admin/staff email
    if (!resolvedName && row.author_name) {
      const lowerAuthor = row.author_name.trim().toLowerCase()
      resolvedName =
        adminEmailToNameMap.get(lowerAuthor) ||
        staffEmailToNameMap.get(lowerAuthor) ||
        null
    }

    // If still not resolved, check if author_name is already a clean name (not email)
    if (!resolvedName && row.author_name && !row.author_name.includes("@")) {
      resolvedName = row.author_name.trim()
    }

    // Format fallback if it was an email
    if (!resolvedName && row.author_name) {
      resolvedName = formatAuthorDisplayName(row.author_name)
    }

    return {
      ...row,
      author_name: resolvedName || "Admin",
    }
  })
}

async function incrementContentViewCount(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  tableName: ContentTableName,
  id: string,
  currentViews: number | null
) {
  const rpcResult = await supabase.rpc("increment_content_view_count", {
    target_table: tableName,
    target_id: id,
  })

  if (!rpcResult.error && typeof rpcResult.data === "number") {
    return rpcResult.data
  }

  const nextViews = (currentViews ?? 0) + 1
  const { data, error } = await supabase
    .from(tableName)
    .update({ views: nextViews })
    .eq("id", id)
    .select("views")
    .maybeSingle<{ views: number | null }>()

  if (error) {
    return currentViews ?? 0
  }

  return data?.views ?? nextViews
}

export async function getAdminDashboardMetrics() {
  const supabase = createSupabaseAdminClient()

  const [teachers, staffs, notices, events] = await Promise.all([
    supabase.from("staffs").select("id", { count: "exact", head: true }).eq("type", "teacher"),
    supabase.from("staffs").select("id", { count: "exact", head: true }),
    supabase.from("notices").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
  ])

  const safeNoticeCount = isMissingTableError(notices.error) ? 0 : (notices.count ?? 0)

  return {
    teacherCount: teachers.count ?? 0,
    staffCount: staffs.count ?? 0,
    noticeCount: safeNoticeCount,
    eventCount: events.count ?? 0,
  }
}

function sortTeachersList(list: StaffListRecord[]): StaffListRecord[] {
  const getPriority = (designation: string | null) => {
    const d = (designation || "").toLowerCase().trim()
    if (!d) return 5

    // 1. Rank 1: Principal / Oddhokkho / Headmaster / Muhtamim
    const isPrincipal =
      (d.includes("অধ্যক্ষ") && !d.includes("উপাধ্যক্ষ") && !d.includes("সহকারী")) ||
      (d.includes("principal") && !d.includes("vice") && !d.includes("assistant")) ||
      ((d === "headmaster" || d === "head master" || d === "প্রধান শিক্ষক") && !d.includes("assistant") && !d.includes("সহকারী")) ||
      ((d.includes("মুহতামিম") || d.includes("মুহতামীম")) && !d.includes("নায়েবে") && !d.includes("নায়েবে"))

    if (isPrincipal) return 1

    // 2. Rank 2: Vice-Principal / Upaddhokko / Assistant Headmaster
    const isVicePrincipal =
      d.includes("উপাধ্যক্ষ") ||
      d.includes("vice principal") ||
      d.includes("vice-principal") ||
      d.includes("vice_principal") ||
      d.includes("assistant headmaster") ||
      d.includes("assistant head master") ||
      d.includes("assistant head") ||
      d.includes("সহকারী প্রধান শিক্ষক") ||
      d.includes("সহকারী প্রধান") ||
      d.includes("নায়েবে মুহতামিম") ||
      d.includes("নায়েবে মুহতামিম") ||
      d.includes("সহকারী অধ্যক্ষ")

    if (isVicePrincipal) return 2

    // 3. Rank 3: Ibtedayi Head / ইবি প্রধান / Department Head
    const isIbHead =
      d.includes("ইবি প্রধান") ||
      d.includes("ইবতেদায়ি প্রধান") ||
      d.includes("ইবতেদায়ী প্রধান") ||
      d.includes("ইবতেদায়ি প্রধান")

    if (isIbHead) return 3

    // 4. Rank 4: Senior Teacher
    if (d.includes("senior") || d.includes("সিনিয়র") || d.includes("সিনিয়র")) return 4

    return 5
  }

  return [...list].sort((a, b) => {
    const pA = getPriority(a.designation)
    const pB = getPriority(b.designation)
    if (pA !== pB) return pA - pB

    const dateA = a.joining_date ? new Date(a.joining_date).getTime() : Infinity
    const dateB = b.joining_date ? new Date(b.joining_date).getTime() : Infinity
    const invalidA = Number.isNaN(dateA)
    const invalidB = Number.isNaN(dateB)

    if (!invalidA && !invalidB && dateA !== dateB) {
      return dateA - dateB
    }
    if (invalidA && !invalidB) return 1
    if (!invalidA && invalidB) return -1

    const nameA = a.full_name_en || ""
    const nameB = b.full_name_en || ""
    return nameA.localeCompare(nameB)
  })
}

export type EmployeeListRecord = StaffListRecord & {
  full_name_bn?: string | null
  category?: "teacher" | "staff" | string | null
}

export async function getAdminEmployees(options?: {
  search?: string
  category?: "all" | "teacher" | "staff"
}) {
  const supabase = createSupabaseAdminClient()
  const query = escapeLike(options?.search?.trim() ?? "")
  const category = options?.category ?? "all"

  let request = supabase
    .from("staffs")
    .select(
      "id, employee_id, full_name_en, full_name_bn, designation, subject, email, contact_number, status, type, joining_date, profile_photo"
    )

  if (category === "teacher") {
    request = request.eq("type", "teacher")
  } else if (category === "staff") {
    request = request.neq("type", "teacher")
  }

  if (query) {
    request = request.or(
      `full_name_en.ilike.%${query}%,full_name_bn.ilike.%${query}%,employee_id.ilike.%${query}%,subject.ilike.%${query}%,designation.ilike.%${query}%`
    )
  }

  request = request.order("joining_date", { ascending: true })

  const { data, error } = await request

  if (error) {
    throw new Error(error.message)
  }

  const employees = ((data ?? []) as EmployeeListRecord[]).map((row) => ({
    ...row,
    category: row.type === "teacher" ? "teacher" : "staff",
    can_login: null,
  }))

  const employeeIds = employees.map((item) => item.id)
  if (!employeeIds.length) {
    return employees
  }

  const accountResult = await supabase
    .from("staff_accounts")
    .select("staff_id, can_login")
    .in("staff_id", employeeIds)

  if (!accountResult.error) {
    const accountMap = new Map<string, boolean | null>(
      (accountResult.data ?? []).map((account) => [
        account.staff_id as string,
        typeof account.can_login === "boolean" ? account.can_login : null,
      ])
    )

    return employees.map((row) => ({
      ...row,
      can_login: accountMap.has(row.id) ? accountMap.get(row.id) ?? null : row.can_login,
    }))
  }

  return employees
}

export async function getAdminTeachers(search?: string) {
  const supabase = createSupabaseAdminClient()
  const query = escapeLike(search?.trim() ?? "")
  const filter = `full_name_en.ilike.%${query}%,employee_id.ilike.%${query}%,subject.ilike.%${query}%,designation.ilike.%${query}%`

  let withStatus = supabase
    .from("staffs")
    .select("id, employee_id, full_name_en, designation, subject, email, contact_number, status, type, joining_date, profile_photo")
    .eq("type", "teacher")
    .order("full_name_en")

  if (query) {
    withStatus = withStatus.or(filter)
  }

  const { data, error } = await withStatus

  if (error && isMissingColumnError(error)) {
    let withoutStatus = supabase
      .from("staffs")
      .select("id, employee_id, full_name_en, designation, subject, email, contact_number, type, joining_date, profile_photo")
      .eq("type", "teacher")
      .order("full_name_en")

    if (query) {
      withoutStatus = withoutStatus.or(filter)
    }

    const fallbackResult = await withoutStatus

    if (fallbackResult.error) {
      throw new Error(fallbackResult.error.message)
    }

    const fallbackRows = (fallbackResult.data ?? []).map((item) => ({
      ...item,
      status: null,
      can_login: null,
    })) as StaffListRecord[]

    const teacherIds = fallbackRows.map((item) => item.id)
    if (!teacherIds.length) {
      return sortTeachersList(fallbackRows)
    }

    const accountResult = await supabase
      .from("staff_accounts")
      .select("staff_id, can_login")
      .in("staff_id", teacherIds)

    if (!accountResult.error) {
      const accountMap = new Map<string, boolean | null>(
        (accountResult.data ?? []).map((account) => [
          account.staff_id as string,
          typeof account.can_login === "boolean" ? account.can_login : null,
        ])
      )

      return sortTeachersList(
        fallbackRows.map((row) => ({
          ...row,
          can_login: accountMap.has(row.id) ? accountMap.get(row.id) ?? null : row.can_login,
        }))
      )
    }

    return sortTeachersList(fallbackRows)
  }

  if (error) {
    throw new Error(error.message)
  }

  const teachers = ((data ?? []) as StaffListRecord[]).map((row) => ({
    ...row,
    can_login: null,
  }))

  const teacherIds = teachers.map((item) => item.id)
  if (!teacherIds.length) {
    return sortTeachersList(teachers)
  }

  const accountResult = await supabase
    .from("staff_accounts")
    .select("staff_id, can_login")
    .in("staff_id", teacherIds)

  if (accountResult.error && !isMissingColumnError(accountResult.error) && !isMissingTableError(accountResult.error)) {
    throw new Error(accountResult.error.message)
  }

  if (accountResult.error) {
    return sortTeachersList(teachers)
  }

  const accountMap = new Map<string, boolean | null>(
    (accountResult.data ?? []).map((account) => [
      account.staff_id as string,
      typeof account.can_login === "boolean" ? account.can_login : null,
    ])
  )

  return sortTeachersList(
    teachers.map((row) => ({
      ...row,
      can_login: accountMap.has(row.id) ? accountMap.get(row.id) ?? null : row.can_login,
    }))
  )
}

export async function getAdminStaffs(search?: string) {
  const supabase = createSupabaseAdminClient()
  const query = escapeLike(search?.trim() ?? "")

  let request = supabase
    .from("staffs")
    .select("id, employee_id, full_name_en, designation, subject, email, type, joining_date")
    .neq("type", "teacher")
    .order("full_name_en")

  if (query) {
    request = request.or(
      `full_name_en.ilike.%${query}%,employee_id.ilike.%${query}%,subject.ilike.%${query}%,designation.ilike.%${query}%`
    )
  }

  const { data, error } = await request

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as StaffListRecord[]
}

export async function getNotices(limit = 10) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("notices")
    .select("id, title, content, notice_type, publish_date, published, image_url, attachment_url, published_at, created_at, author_id, author_name, views")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as NoticeRecord[]
  }

  if (isMissingColumnError(error)) {
    const withoutAuthorName = await supabase
      .from("notices")
      .select("id, title, content, notice_type, publish_date, published, image_url, attachment_url, published_at, created_at, author_id, views")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (!withoutAuthorName.error) {
      const rows = (withoutAuthorName.data ?? []).map((item) => ({
        ...item,
        author_name: null,
      })) as (NoticeRecord & { views: number | null })[]

      return (await hydrateAuthorNames(rows)) as NoticeRecord[]
    }

    const { data: fallbackData, error: fallbackError } = await supabase
      .from("notices")
      .select("id, title, content, notice_type, publish_date, published, image_url, attachment_url, published_at, created_at")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (fallbackError) {
      throw new Error(fallbackError.message)
    }

    return (fallbackData ?? []).map((item) => ({
      ...item,
      author_id: null,
      author_name: null,
      views: 0,
    })) as NoticeRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  // Hydrate any missing author names (fallback for posts created before author_name was stored or with email)
  const rows = (data ?? []).map((item) => ({
    ...item,
    author_name: item.author_name || null,
  })) as (NoticeRecord & { views: number | null })[]

  return (await hydrateAuthorNames(rows)) as NoticeRecord[]
}

/**
 * Fetch published notices that belong to a specific category (notice_type).
 * Used by the admission portal notice page.
 */
export async function getNoticesByCategory(
  category: string,
  limit = 50
): Promise<{ id: string; title: string | null; published_at: string | null; publish_date: string | null; attachment_url: string | null }[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("notices")
    .select("id, title, published_at, publish_date, attachment_url")
    .ilike("notice_type", category)
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("getNoticesByCategory error:", error.message)
    return []
  }

  return data ?? []
}

export async function getNoticeById(id: string, options: ContentLookupOptions = {}) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("notices")
    .select("id, title, content, notice_type, publish_date, published, image_url, attachment_url, published_at, created_at, author_id, views")
    .eq("id", id)
    .maybeSingle<NoticeRecord>()

  if (isMissingTableError(error)) {
    return null
  }

  if (isMissingColumnError(error)) {
    const withAuthorIdViews = await supabase
      .from("notices")
      .select("id, title, content, notice_type, publish_date, published, image_url, attachment_url, published_at, created_at, author_id, views")
      .eq("id", id)
      .maybeSingle<Omit<NoticeRecord, "author_name">>()

    if (!withAuthorIdViews.error && withAuthorIdViews.data) {
      const [record] = await hydrateAuthorNames([{ ...withAuthorIdViews.data, author_name: null }])

      if (options.incrementViews && isPubliclyVisible(record)) {
        record.views = await incrementContentViewCount(supabase, "notices", id, record.views)
      }

      return record as NoticeRecord
    }

    const { data: fallbackData, error: fallbackError } = await supabase
      .from("notices")
      .select("id, title, content, notice_type, publish_date, published, image_url, attachment_url, published_at, created_at")
      .eq("id", id)
      .maybeSingle<Omit<NoticeRecord, "author_id" | "author_name" | "views">>()

    if (fallbackError) {
      throw new Error(fallbackError.message)
    }

    if (!fallbackData) {
      return null
    }

    return {
      ...fallbackData,
      author_id: null,
      author_name: null,
      views: 0,
    }
  }

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    return null
  }

  const [record] = await hydrateAuthorNames([{ ...data, author_name: data.author_name || null }])

  if (options.incrementViews && isPubliclyVisible(record)) {
    record.views = await incrementContentViewCount(supabase, "notices", id, record.views)
  }

  return record as NoticeRecord
}

export async function getNoticeCategories() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("notice_categories")
    .select("name")
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    const notices = await getNotices(500)
    const fallbackCategories = Array.from(
      new Set(notices.map((notice) => notice.notice_type?.trim()).filter(Boolean))
    ).sort((a, b) => a!.localeCompare(b!)) as string[]

    if (!fallbackCategories.includes("general")) {
      fallbackCategories.unshift("general")
    }

    return fallbackCategories
  }

  if (error) {
    throw new Error(error.message)
  }

  const categories = (data ?? []).map((item) => item.name)

  if (!categories.includes("general")) {
    categories.unshift("general")
  }

  return categories
}

export async function getNoticeCategoriesForAdmin() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("notice_categories")
    .select("id, name, is_active, created_at")
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    const categories = await getNoticeCategories()
    return categories.map((name) => ({
      id: name,
      name,
      is_active: true,
      created_at: null,
    })) as NoticeCategoryAdminRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as NoticeCategoryAdminRecord[]
  if (!rows.some((item) => item.name.toLowerCase() === "general")) {
    rows.unshift({
      id: "general",
      name: "general",
      is_active: true,
      created_at: null,
    })
  }

  return rows
}

export async function getNews(limit = 20) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("news_posts")
    .select("id, title, content, category, featured_image_url, publish_date, published, published_at, created_at, author_id, author_name, views")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as NewsRecord[]
  }

  if (isMissingColumnError(error)) {
    const withoutAuthorName = await supabase
      .from("news_posts")
      .select("id, title, content, category, featured_image_url, publish_date, published, published_at, created_at, author_id, views")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (!withoutAuthorName.error) {
      const rows = (withoutAuthorName.data ?? []).map((item) => ({
        ...item,
        author_name: null,
      })) as (NewsRecord & { views: number | null })[]

      return (await hydrateAuthorNames(rows)) as NewsRecord[]
    }

    const { data: fallbackData, error: fallbackError } = await supabase
      .from("news_posts")
      .select("id, title, content, featured_image_url, publish_date, published, published_at, created_at")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (fallbackError) {
      throw new Error(fallbackError.message)
    }

    return (fallbackData ?? []).map((item) => ({
      ...item,
      category: "general",
      author_id: null,
      author_name: null,
      views: 0,
    })) as NewsRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  // Hydrate any missing author names (fallback for posts created before author_name was stored or with email)
  const rows = (data ?? []).map((item) => ({
    ...item,
    author_name: item.author_name || null,
  })) as (NewsRecord & { views: number | null })[]

  return (await hydrateAuthorNames(rows)) as NewsRecord[]
}

export async function getNewsById(id: string, options: ContentLookupOptions = {}) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("news_posts")
    .select("id, title, content, category, featured_image_url, publish_date, published, published_at, created_at, author_id, views")
    .eq("id", id)
    .maybeSingle<NewsRecord>()

  if (isMissingTableError(error)) {
    return null
  }

  if (isMissingColumnError(error)) {
    const withAuthorIdViews = await supabase
      .from("news_posts")
      .select("id, title, content, category, featured_image_url, publish_date, published, published_at, created_at, author_id, views")
      .eq("id", id)
      .maybeSingle<Omit<NewsRecord, "author_name">>()

    if (!withAuthorIdViews.error && withAuthorIdViews.data) {
      const [record] = await hydrateAuthorNames([{ ...withAuthorIdViews.data, author_name: null }])

      if (options.incrementViews && isPubliclyVisible(record)) {
        record.views = await incrementContentViewCount(supabase, "news_posts", id, record.views)
      }

      return record as NewsRecord
    }

    const { data: fallbackData, error: fallbackError } = await supabase
      .from("news_posts")
      .select("id, title, content, featured_image_url, publish_date, published, published_at, created_at")
      .eq("id", id)
      .maybeSingle<
        Omit<NewsRecord, "category">
      >()

    if (fallbackError) {
      throw new Error(fallbackError.message)
    }

    if (!fallbackData) {
      return null
    }

    return {
      ...fallbackData,
      category: "general",
      author_id: null,
      author_name: null,
      views: 0,
    }
  }

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    return null
  }

  const [record] = await hydrateAuthorNames([{ ...data, author_name: data.author_name || null }])

  if (options.incrementViews && isPubliclyVisible(record)) {
    record.views = await incrementContentViewCount(supabase, "news_posts", id, record.views)
  }

  return record as NewsRecord
}

export async function getBlogs(limit = 20) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, content, category, featured_image_url, publish_date, published, published_at, created_at, author_id, author_name, views")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as BlogRecord[]
  }

  if (isMissingColumnError(error)) {
    const withoutAuthorName = await supabase
      .from("blog_posts")
      .select("id, title, content, category, featured_image_url, publish_date, published, published_at, created_at, author_id, views")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (!withoutAuthorName.error) {
      const rows = (withoutAuthorName.data ?? []).map((item) => ({
        ...item,
        author_name: null,
      })) as (BlogRecord & { views: number | null })[]

      return (await hydrateAuthorNames(rows)) as BlogRecord[]
    }

    const { data: fallbackData, error: fallbackError } = await supabase
      .from("blog_posts")
      .select("id, title, content, featured_image_url, publish_date, published, published_at, created_at")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (fallbackError) {
      throw new Error(fallbackError.message)
    }

    return (fallbackData ?? []).map((item) => ({
      ...item,
      category: "general",
      author_id: null,
      author_name: null,
      views: 0,
    })) as BlogRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  // Hydrate any missing author names (fallback for posts created before author_name was stored or with email)
  const rows = (data ?? []).map((item) => ({
    ...item,
    author_name: item.author_name || null,
  })) as (BlogRecord & { views: number | null })[]

  return (await hydrateAuthorNames(rows)) as BlogRecord[]
}

export async function getBlogById(id: string, options: ContentLookupOptions = {}) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, content, category, featured_image_url, publish_date, published, published_at, created_at, author_id, views")
    .eq("id", id)
    .maybeSingle<BlogRecord>()

  if (isMissingTableError(error)) {
    return null
  }

  if (isMissingColumnError(error)) {
    const withAuthorIdViews = await supabase
      .from("blog_posts")
      .select("id, title, content, category, featured_image_url, publish_date, published, published_at, created_at, author_id, views")
      .eq("id", id)
      .maybeSingle<Omit<BlogRecord, "author_name">>()

    if (!withAuthorIdViews.error && withAuthorIdViews.data) {
      const [record] = await hydrateAuthorNames([{ ...withAuthorIdViews.data, author_name: null }])

      if (options.incrementViews && isPubliclyVisible(record)) {
        record.views = await incrementContentViewCount(supabase, "blog_posts", id, record.views)
      }

      return record as BlogRecord
    }

    const { data: fallbackData, error: fallbackError } = await supabase
      .from("blog_posts")
      .select("id, title, content, featured_image_url, publish_date, published, published_at, created_at")
      .eq("id", id)
      .maybeSingle<
        Omit<BlogRecord, "category">
      >()

    if (fallbackError) {
      throw new Error(fallbackError.message)
    }

    if (!fallbackData) {
      return null
    }

    return {
      ...fallbackData,
      category: "general",
      author_id: null,
      author_name: null,
      views: 0,
    }
  }

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    return null
  }

  const [record] = await hydrateAuthorNames([{ ...data, author_name: data.author_name || null }])

  if (options.incrementViews && isPubliclyVisible(record)) {
    record.views = await incrementContentViewCount(supabase, "blog_posts", id, record.views)
  }

  return record as BlogRecord
}

export async function getNewsCategories() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("news_categories")
    .select("name")
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    const rows = await getNews(500)
    const fallbackCategories = Array.from(
      new Set(rows.map((item) => item.category?.trim()).filter(Boolean))
    ).sort((a, b) => a!.localeCompare(b!)) as string[]

    if (!fallbackCategories.includes("general")) {
      fallbackCategories.unshift("general")
    }

    return fallbackCategories
  }

  if (error) {
    throw new Error(error.message)
  }

  const categories = (data ?? []).map((item) => item.name)
  if (!categories.includes("general")) {
    categories.unshift("general")
  }
  return categories
}

export async function getNewsCategoriesForAdmin() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("news_categories")
    .select("id, name, is_active, created_at")
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    const categories = await getNewsCategories()
    return categories.map((name) => ({
      id: name,
      name,
      is_active: true,
      created_at: null,
    })) as NoticeCategoryAdminRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as NoticeCategoryAdminRecord[]
  if (!rows.some((item) => item.name.toLowerCase() === "general")) {
    rows.unshift({
      id: "general",
      name: "general",
      is_active: true,
      created_at: null,
    })
  }

  return rows
}

export async function getBlogCategories() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("blog_categories")
    .select("name")
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    const rows = await getBlogs(500)
    const fallbackCategories = Array.from(
      new Set(rows.map((item) => item.category?.trim()).filter(Boolean))
    ).sort((a, b) => a!.localeCompare(b!)) as string[]

    if (!fallbackCategories.includes("general")) {
      fallbackCategories.unshift("general")
    }

    return fallbackCategories
  }

  if (error) {
    throw new Error(error.message)
  }

  const categories = (data ?? []).map((item) => item.name)
  if (!categories.includes("general")) {
    categories.unshift("general")
  }
  return categories
}

export async function getBlogCategoriesForAdmin() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("blog_categories")
    .select("id, name, is_active, created_at")
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    const categories = await getBlogCategories()
    return categories.map((name) => ({
      id: name,
      name,
      is_active: true,
      created_at: null,
    })) as NoticeCategoryAdminRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as NoticeCategoryAdminRecord[]
  if (!rows.some((item) => item.name.toLowerCase() === "general")) {
    rows.unshift({
      id: "general",
      name: "general",
      is_active: true,
      created_at: null,
    })
  }

  return rows
}

export async function getEvents(limit = 10) {
  const supabase = createSupabaseAdminClient()
  const primaryResult = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: true, nullsFirst: false })
    .order("event_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  let data = primaryResult.data
  let error = primaryResult.error

  if (error && isMissingColumnError(error)) {
    const fallbackResult = await supabase
      .from("events")
      .select("id, title, description, image, image_url, event_date, location, published, created_at")
      .order("event_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    data = fallbackResult.data as EventRecord[] | null
    error = fallbackResult.error
  }

  if (isMissingTableError(error)) {
    return [] as EventRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as EventRecord[]
}

export async function getEventById(id: string) {
  const supabase = createSupabaseAdminClient()
  const primaryResult = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle<EventRecord>()

  let data = primaryResult.data
  let error = primaryResult.error

  if (error && isMissingColumnError(error)) {
    const fallbackResult = await supabase
      .from("events")
      .select("id, title, description, image, image_url, event_date, location, published, created_at")
      .eq("id", id)
      .maybeSingle<Omit<EventRecord, "slug" | "short_description" | "category" | "event_type" | "status" | "end_date" | "start_time" | "end_time">>()

    data = fallbackResult.data as EventRecord | null
    error = fallbackResult.error
  }

  if (isMissingTableError(error)) {
    return null
  }

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getEventCategories() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("event_categories")
    .select("name")
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    const events = await getEvents(500)
    const fallbackCategories = Array.from(
      new Set(events.map((event) => event.category?.trim()).filter(Boolean))
    ).sort((a, b) => a!.localeCompare(b!)) as string[]

    if (!fallbackCategories.includes("general")) {
      fallbackCategories.unshift("general")
    }

    return fallbackCategories
  }

  if (error) {
    throw new Error(error.message)
  }

  const categories = (data ?? []).map((item) => item.name)

  if (!categories.includes("general")) {
    categories.unshift("general")
  }

  return categories
}

export async function getEventCategoriesForAdmin() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("event_categories")
    .select("id, name, slug, is_active, created_at")
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    const categories = await getEventCategories()
    return categories.map((name) => ({
      id: name,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      is_active: true,
      created_at: null,
    })) as (NoticeCategoryAdminRecord & { slug: string | null })[]
  }

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as (NoticeCategoryAdminRecord & { slug: string | null })[]
  if (!rows.some((item) => item.name.toLowerCase() === "general")) {
    rows.unshift({
      id: "general",
      name: "general",
      slug: "general",
      is_active: true,
      created_at: null,
    })
  }

  return rows
}

export async function getTeacherProfile(staffId: string) {
  const supabase = createSupabaseAdminClient()
  const primary = await supabase
    .from("staffs")
    .select(
      "id, status, employee_id, full_name_en, full_name_bn, profile_photo, signature, gender, date_of_birth, marital_status, religion, nationality, blood_group, designation, type, subject, employment_type, joining_date, contact_number, alt_contact_number, email, emergency_contact, nid_number, birth_certificate, passport_number"
    )
    .eq("id", staffId)
    .eq("status", "active")
    .maybeSingle<TeacherProfileRecord>()

  let data = primary.data
  let error = primary.error

  if (error && isMissingColumnError(error)) {
    const fallback = await supabase
      .from("staffs")
      .select(
        "id, employee_id, full_name_en, full_name_bn, profile_photo, signature, gender, date_of_birth, marital_status, religion, nationality, blood_group, designation, type, subject, employment_type, joining_date, contact_number, alt_contact_number, email, emergency_contact, nid_number, birth_certificate, passport_number"
      )
      .eq("id", staffId)
      .maybeSingle<TeacherProfileRecord>()

    data = fallback.data
    error = fallback.error
  }

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getStaffProfile(staffId: string) {
  return getTeacherProfile(staffId)
}

export async function getEmployeeProfile(employeeId: string) {
  return getTeacherProfile(employeeId)
}

export async function getTeacherAcademics(staffId: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("staff_academics")
    .select("id, degree, institution, subject, passing_year, duration, result")
    .eq("staff_id", staffId)
    .order("passing_year", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as AcademicRecord[]
}

export async function getTeacherExperience(staffId: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("staff_experience")
    .select("id, institute_name, location, designation, subject, employment_type, start_date, end_date, currently_working")
    .eq("staff_id", staffId)
    .order("start_date", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as ExperienceRecord[]
}

export async function getTeacherTraining(staffId: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("staff_training")
    .select("id, training_name, training_institute, year, duration, subject")
    .eq("staff_id", staffId)
    .order("year", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as TrainingRecord[]
}

export async function getTeacherFamily(staffId: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("staff_family")
    .select("id, name, relationship, date_of_birth, age, blood_group, remark")
    .eq("staff_id", staffId)
    .order("relationship")

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as FamilyRecord[]
}

export async function getTeacherAddresses(staffId: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("staff_addresses")
    .select("id, address_type, house, road, area, post_office, post_code, thana, district")
    .eq("staff_id", staffId)
    .order("address_type", { ascending: true })

  if (isMissingTableError(error)) {
    return [] as AddressRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as AddressRecord[]
}

export async function getTeacherGovernmentInfo(staffId: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("staff_government_info")
    .select("id, ntrca_registration, mpo_date, pds_id, index_number, first_joining_date, appointment_letter_no")
    .eq("staff_id", staffId)
    .maybeSingle<GovernmentInfoRecord>()

  if (isMissingTableError(error)) {
    return null
  }

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getTeacherDashboardMetrics(staffId: string) {
  const supabase = createSupabaseAdminClient()
  const profilePromise = getTeacherProfile(staffId)

  const [profile, academics, experience, training, family] = await Promise.all([
    profilePromise,
    supabase.from("staff_academics").select("id", { count: "exact", head: true }).eq("staff_id", staffId),
    supabase.from("staff_experience").select("id", { count: "exact", head: true }).eq("staff_id", staffId),
    supabase.from("staff_training").select("id", { count: "exact", head: true }).eq("staff_id", staffId),
    supabase.from("staff_family").select("id", { count: "exact", head: true }).eq("staff_id", staffId),
  ])

  const profileFields = [
    profile?.full_name_en,
    profile?.designation,
    profile?.subject,
    profile?.contact_number,
    profile?.email,
    profile?.profile_photo,
  ]

  const completedFields = profileFields.filter(Boolean).length

  return {
    profile,
    academics: academics.count ?? 0,
    experience: experience.count ?? 0,
    training: training.count ?? 0,
    family: family.count ?? 0,
    profileCompletion: Math.round((completedFields / profileFields.length) * 100),
  }
}

export async function getTeacherAccountByStaffId(staffId: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("staff_accounts")
    .select("id, staff_id, email, password_hash, role, status, can_login")
    .eq("staff_id", staffId)
    .maybeSingle<{
      id: string
      staff_id: string
      email: string
      password_hash: string
      role: string | null
      status: string | null
      can_login: boolean | null
    }>()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Governing Body Members
export async function getGoverningBodyMembers() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("governing_body_members")
    .select("*")
    .order("created_at", { ascending: true })

  if (isMissingTableError(error)) {
    return [] as GoverningBodyMemberRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as GoverningBodyMemberRecord[]
}

export async function getGoverningBodyMembersForAdmin() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("governing_body_members")
    .select("*")
    .order("created_at", { ascending: true })

  if (isMissingTableError(error)) {
    return [] as GoverningBodyMemberRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as GoverningBodyMemberRecord[]
}

export async function getGoverningBodyMemberById(id: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("governing_body_members")
    .select("*")
    .eq("id", id)
    .maybeSingle<GoverningBodyMemberRecord>()

  if (isMissingTableError(error)) {
    return null
  }

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export type DownloadRecord = {
  id: string
  title: string | null
  description: string | null
  download_type: string | null
  file_url: string | null
  file_name: string | null
  file_size: number | null
  published: boolean | null
  published_at: string | null
  views: number | null
  author_name: string | null
  created_at: string | null
}

export type DownloadCategoryAdminRecord = {
  id: string
  name: string
  is_active: boolean
  created_at: string | null
}

export async function getDownloads(limit = 10) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("downloads")
    .select("id, title, description, download_type, file_url, file_name, file_size, published, published_at, views, author_name, created_at")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as DownloadRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as DownloadRecord[]
}

export async function getDownloadCategoriesForAdmin() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("download_categories")
    .select("id, name, is_active, created_at")
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    return [] as DownloadCategoryAdminRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as DownloadCategoryAdminRecord[]
  if (!rows.some((item) => item.name.toLowerCase() === "general")) {
    rows.unshift({
      id: "general",
      name: "general",
      is_active: true,
      created_at: null,
    })
  }

  return rows
}

export async function getDownloadById(id: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("downloads")
    .select("*")
    .eq("id", id)
    .maybeSingle<DownloadRecord>()

  if (isMissingTableError(error)) {
    return null
  }

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Notification functions
export async function getNotifications(limit = 10) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, content, category, target_role, published, published_at, created_at, author_id, author_name")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as NotificationRecord[]
  }

  if (isMissingColumnError(error)) {
    const withoutAuthorName = await supabase
      .from("notifications")
      .select("id, title, content, category, target_role, published, published_at, created_at, author_id")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (!withoutAuthorName.error) {
      const rows = (withoutAuthorName.data ?? []).map((item) => ({
        ...item,
        author_name: null,
      })) as NotificationRecord[]

      return rows
    }

    return [] as NotificationRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []).map((item) => ({
    ...item,
    author_name: item.author_name || null,
    views: 0,
  })) as (NotificationRecord & { views: number | null })[]

  return (await hydrateAuthorNames(rows)) as NotificationRecord[]
}

export async function getNotificationById(id: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, content, category, target_role, published, published_at, created_at, author_id, author_name")
    .eq("id", id)
    .maybeSingle<NotificationRecord>()

  if (isMissingTableError(error)) {
    return null
  }

  if (isMissingColumnError(error)) {
    const withoutAuthorName = await supabase
      .from("notifications")
      .select("id, title, content, category, target_role, published, published_at, created_at, author_id")
      .eq("id", id)
      .maybeSingle<Omit<NotificationRecord, "author_name">>()

    if (!withoutAuthorName.error && withoutAuthorName.data) {
      return {
        ...withoutAuthorName.data,
        author_name: null,
      } as NotificationRecord
    }

    return null
  }

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getNotificationCategories() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("notification_categories")
    .select("name")
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    return ["general"] as string[]
  }

  if (error) {
    throw new Error(error.message)
  }

  const categories = (data ?? []).map((item) => item.name)

  if (!categories.includes("general")) {
    categories.unshift("general")
  }

  return categories
}

export async function getNotificationCategoriesForAdmin() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("notification_categories")
    .select("id, name, is_active, created_at")
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    const categories = await getNotificationCategories()
    return categories.map((name) => ({
      id: name,
      name,
      is_active: true,
      created_at: null,
    })) as NotificationCategoryAdminRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as NotificationCategoryAdminRecord[]
  if (!rows.some((item) => item.name.toLowerCase() === "general")) {
    rows.unshift({
      id: "general",
      name: "general",
      is_active: true,
      created_at: null,
    })
  }

  return rows
}

export async function getNotificationsByRole(userRole: string, limit = 50) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, content, category, target_role, published, published_at, created_at, author_id, author_name")
    .eq("published", true)
    .or(`target_role.eq.all,target_role.eq.${userRole}`)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as NotificationRecord[]
  }

  if (isMissingColumnError(error)) {
    const withoutAuthorName = await supabase
      .from("notifications")
      .select("id, title, content, category, target_role, published, published_at, created_at, author_id")
      .eq("published", true)
      .or(`target_role.eq.all,target_role.eq.${userRole}`)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (!withoutAuthorName.error) {
      const rows = (withoutAuthorName.data ?? []).map((item) => ({
        ...item,
        author_name: null,
      })) as NotificationRecord[]

      return rows
    }

    return [] as NotificationRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as NotificationRecord[]
  return rows
}

// ============================================================================
// ACADEMIC MODULE — Types
// ============================================================================

export type AcademicSessionRecord = {
  id: string
  name: string
  start_date: string | null
  end_date: string | null
  is_active: boolean
  created_at: string | null
}

export type AcademicVersionRecord = {
  id: string
  name: string
  code: string
  is_active: boolean
  created_at: string | null
}

export type AcademicShiftRecord = {
  id: string
  name: string
  start_time: string | null
  end_time: string | null
  is_active: boolean
  created_at: string | null
}

export type ClassRecord = {
  id: string
  name: string
  numeric_value: number | null
  display_order: number
  is_active: boolean
  created_at: string | null
}

export type SectionRecord = {
  id: string
  name: string
  capacity: number | null
  room_no: string | null
  is_active: boolean
  created_at: string | null
}

export type GroupRecord = {
  id: string
  name: string
  short_name: string | null
  is_active: boolean
  created_at: string | null
}

export type SubjectRecord = {
  id: string
  name: string
  name_bn: string | null
  code: string
  is_active: boolean
  created_at: string | null
}

export type AcademicClassConfigRecord = {
  id: string
  session_id: string
  version_id: string | null
  shift_id: string | null
  class_id: string
  section_id: string | null
  group_id: string | null
  class_teacher_id: string | null
  classroom_id: string | null
  capacity: number | null
  is_active: boolean
  grade_scale_id: string | null
  created_at: string | null
  updated_at: string | null
  session_name?: string | null
  version_name?: string | null
  shift_name?: string | null
  class_name?: string | null
  section_name?: string | null
  group_name?: string | null
  class_teacher_name?: string | null
  classroom_name?: string | null
  grade_scale_name?: string | null
}

export type ClassSubjectRecord = {
  id: string
  academic_class_config_id: string
  subject_id: string
  is_optional: boolean
  sort_order: number
  created_at: string | null
  subject_name?: string | null
  subject_name_bn?: string | null
  subject_code?: string | null
  
  subject_name_override: string | null
  student_type: "mandatory" | "optional" | "religion" | "continuous_assessment" | "choice"
  count_in_result: boolean
  paper_group_code: string | null
  subject_groups?: string[] | null
  has_theory: boolean
  theory_marks: number | null
  theory_exam_marks: number | null
  has_cq_mcq: boolean
  cq_marks: number | null
  mcq_marks: number | null
  theory_pass_marks: number | null
  ca_marks: number | null
  ca_pass_marks: number | null
  has_practical: boolean
  practical_marks: number | null
  practical_pass_marks: number | null
  total_pass_marks: number | null
}

export type SubjectTeacherRecord = {
  id: string
  academic_class_config_id: string
  subject_id: string
  teacher_id: string
  assignment_type: "full" | "theory" | "practical"
  created_at: string | null
  subject_name?: string | null
  subject_code?: string | null
  teacher_name?: string | null
}

// ============================================================================
// ACADEMIC MODULE — Query Functions
// ============================================================================

export async function getAcademicSessions(): Promise<AcademicSessionRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("academic_sessions")
    .select("id, name, start_date, end_date, is_active, created_at")
    .order("is_active", { ascending: false })
    .order("name", { ascending: false })

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)
  return (data ?? []) as AcademicSessionRecord[]
}

export async function getActiveAcademicSession(): Promise<AcademicSessionRecord | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("academic_sessions")
    .select("id, name, start_date, end_date, is_active, created_at")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle<AcademicSessionRecord>()

  if (isMissingTableError(error)) return null
  if (error) throw new Error(error.message)
  return data
}

export async function getAcademicVersions(): Promise<AcademicVersionRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("academic_versions")
    .select("id, name, code, is_active, created_at")
    .order("name")

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)
  return (data ?? []) as AcademicVersionRecord[]
}

export async function getAcademicShifts(): Promise<AcademicShiftRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("academic_shifts")
    .select("id, name, start_time, end_time, is_active, created_at")
    .order("start_time", { ascending: true, nullsFirst: false })

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)
  return (data ?? []) as AcademicShiftRecord[]
}

export async function getClasses(): Promise<ClassRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("classes")
    .select("id, name, numeric_value, display_order, is_active, created_at")
    .order("display_order")

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)
  return (data ?? []) as ClassRecord[]
}

export async function getSections(): Promise<SectionRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("sections")
    .select("id, name, capacity, room_no, is_active, created_at")
    .order("name")

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)
  return (data ?? []) as SectionRecord[]
}

export async function getGroups(): Promise<GroupRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("groups")
    .select("id, name, short_name, is_active, created_at")
    .order("name")

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)
  return (data ?? []) as GroupRecord[]
}

export async function getSubjects(filters?: {
  activeOnly?: boolean
}): Promise<SubjectRecord[]> {
  const supabase = createSupabaseAdminClient()
  let query = supabase
    .from("subjects")
    .select("id, name, name_bn, code, is_active, created_at")
    .order("name")

  if (filters?.activeOnly) query = query.eq("is_active", true)

  const { data, error } = await query

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)
  return (data ?? []) as SubjectRecord[]
}

export async function getSubjectById(id: string): Promise<SubjectRecord | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, name_bn, code, is_active, created_at")
    .eq("id", id)
    .maybeSingle<SubjectRecord>()

  if (isMissingTableError(error)) return null
  if (error) throw new Error(error.message)
  return data
}

export async function getAcademicClassConfigs(sessionId?: string): Promise<AcademicClassConfigRecord[]> {
  const supabase = createSupabaseAdminClient()
  let query = supabase
    .from("academic_class_configs")
    .select(`
      id, session_id, version_id, shift_id, class_id, section_id, group_id,
      class_teacher_id, classroom_id, capacity, is_active, grade_scale_id, created_at, updated_at,
      academic_sessions!session_id (name),
      academic_versions!version_id (name),
      academic_shifts!shift_id (name),
      classes!class_id (name),
      sections!section_id (name),
      groups!group_id (name),
      staffs!class_teacher_id (full_name_en),
      academic_classrooms!classroom_id (name, academic_buildings!building_id (name)),
      grade_scales!grade_scale_id (name)
    `)
    .order("created_at", { ascending: false })

  if (sessionId) query = query.eq("session_id", sessionId)

  const { data, error } = await query

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)

  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    session_id: row.session_id as string,
    version_id: row.version_id as string | null,
    shift_id: row.shift_id as string | null,
    class_id: row.class_id as string,
    section_id: row.section_id as string | null,
    group_id: row.group_id as string | null,
    class_teacher_id: row.class_teacher_id as string | null,
    classroom_id: row.classroom_id as string | null,
    capacity: row.capacity as number | null,
    is_active: row.is_active as boolean,
    grade_scale_id: row.grade_scale_id as string | null,
    created_at: row.created_at as string | null,
    updated_at: row.updated_at as string | null,
    session_name: (row.academic_sessions as { name?: string } | null)?.name ?? null,
    version_name: (row.academic_versions as { name?: string } | null)?.name ?? null,
    shift_name: (row.academic_shifts as { name?: string } | null)?.name ?? null,
    class_name: (row.classes as { name?: string } | null)?.name ?? null,
    section_name: (row.sections as { name?: string } | null)?.name ?? null,
    group_name: (row.groups as { name?: string } | null)?.name ?? null,
    class_teacher_name: (row.staffs as { full_name_en?: string } | null)?.full_name_en ?? null,
    classroom_name: row.academic_classrooms
      ? `${((row.academic_classrooms as any).academic_buildings as { name?: string } | null)?.name ?? ""} - ${(row.academic_classrooms as any).name}`
      : null,
    grade_scale_name: (row.grade_scales as { name?: string } | null)?.name ?? null,
  })) as AcademicClassConfigRecord[]
}

export async function getAcademicClassConfigById(id: string): Promise<AcademicClassConfigRecord | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("academic_class_configs")
    .select(`
      id, session_id, version_id, shift_id, class_id, section_id, group_id,
      class_teacher_id, classroom_id, capacity, is_active, grade_scale_id, created_at, updated_at,
      academic_sessions!session_id (name),
      academic_versions!version_id (name),
      academic_shifts!shift_id (name),
      classes!class_id (name),
      sections!section_id (name),
      groups!group_id (name),
      staffs!class_teacher_id (full_name_en),
      academic_classrooms!classroom_id (name, academic_buildings!building_id (name)),
      grade_scales!grade_scale_id (name)
    `)
    .eq("id", id)
    .maybeSingle()

  if (isMissingTableError(error)) return null
  if (error) throw new Error(error.message)
  if (!data) return null

  const row = data as Record<string, unknown>
  return {
    id: row.id as string,
    session_id: row.session_id as string,
    version_id: row.version_id as string | null,
    shift_id: row.shift_id as string | null,
    class_id: row.class_id as string,
    section_id: row.section_id as string | null,
    group_id: row.group_id as string | null,
    class_teacher_id: row.class_teacher_id as string | null,
    classroom_id: row.classroom_id as string | null,
    capacity: row.capacity as number | null,
    is_active: row.is_active as boolean,
    grade_scale_id: row.grade_scale_id as string | null,
    created_at: row.created_at as string | null,
    updated_at: row.updated_at as string | null,
    session_name: (row.academic_sessions as { name?: string } | null)?.name ?? null,
    version_name: (row.academic_versions as { name?: string } | null)?.name ?? null,
    shift_name: (row.academic_shifts as { name?: string } | null)?.name ?? null,
    class_name: (row.classes as { name?: string } | null)?.name ?? null,
    section_name: (row.sections as { name?: string } | null)?.name ?? null,
    group_name: (row.groups as { name?: string } | null)?.name ?? null,
    class_teacher_name: (row.staffs as { full_name_en?: string } | null)?.full_name_en ?? null,
    classroom_name: row.academic_classrooms
      ? `${((row.academic_classrooms as any).academic_buildings as { name?: string } | null)?.name ?? ""} - ${(row.academic_classrooms as any).name}`
      : null,
    grade_scale_name: (row.grade_scales as { name?: string } | null)?.name ?? null,
  } as AcademicClassConfigRecord
}

export async function getClassSubjects(configId: string): Promise<ClassSubjectRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("class_subjects")
    .select(`
      id, academic_class_config_id, subject_id, is_optional, sort_order, created_at,
      subject_name_override, student_type, count_in_result, paper_group_code, subject_groups,
      has_theory, theory_marks, theory_exam_marks, has_cq_mcq, cq_marks, mcq_marks, theory_pass_marks,
      ca_marks, ca_pass_marks,
      has_practical, practical_marks, practical_pass_marks,
      total_pass_marks,
      subjects!subject_id (name, name_bn, code)
    `)
    .eq("academic_class_config_id", configId)
    .order("sort_order")

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)

  return ((data ?? []) as Record<string, unknown>[]).map((row) => {
    const sub = row.subjects as { name?: string; name_bn?: string; code?: string } | null
    return {
      id: row.id as string,
      academic_class_config_id: row.academic_class_config_id as string,
      subject_id: row.subject_id as string,
      is_optional: row.is_optional as boolean,
      sort_order: row.sort_order as number,
      created_at: row.created_at as string | null,
      subject_name: sub?.name ?? null,
      subject_name_bn: sub?.name_bn ?? null,
      subject_code: sub?.code ?? null,
      
      subject_name_override: row.subject_name_override as string | null,
      student_type: (row.student_type as string) || "mandatory",
      count_in_result: typeof row.count_in_result === "boolean" ? row.count_in_result : true,
      paper_group_code: row.paper_group_code as string | null,
      subject_groups: (row.subject_groups as string[]) || [],
      has_theory: typeof row.has_theory === "boolean" ? row.has_theory : true,
      theory_marks: row.theory_marks as number | null,
      theory_exam_marks: row.theory_exam_marks as number | null,
      has_cq_mcq: typeof row.has_cq_mcq === "boolean" ? row.has_cq_mcq : false,
      cq_marks: row.cq_marks as number | null,
      mcq_marks: row.mcq_marks as number | null,
      theory_pass_marks: row.theory_pass_marks as number | null,
      ca_marks: row.ca_marks as number | null,
      ca_pass_marks: row.ca_pass_marks as number | null,
      has_practical: typeof row.has_practical === "boolean" ? row.has_practical : false,
      practical_marks: row.practical_marks as number | null,
      practical_pass_marks: row.practical_pass_marks as number | null,
      total_pass_marks: row.total_pass_marks as number | null,
    }
  }) as ClassSubjectRecord[]
}

export async function getSubjectTeachers(configId: string): Promise<SubjectTeacherRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("subject_teachers")
    .select(`
      id, academic_class_config_id, subject_id, teacher_id, assignment_type, created_at,
      subjects!subject_id (name, code),
      staffs!teacher_id (full_name_en)
    `)
    .eq("academic_class_config_id", configId)
    .order("created_at")

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)

  return ((data ?? []) as Record<string, unknown>[]).map((row) => {
    const sub = row.subjects as { name?: string; code?: string } | null
    const teacher = row.staffs as { full_name_en?: string } | null
    return {
      id: row.id as string,
      academic_class_config_id: row.academic_class_config_id as string,
      subject_id: row.subject_id as string,
      teacher_id: row.teacher_id as string,
      assignment_type: row.assignment_type as "full" | "theory" | "practical",
      created_at: row.created_at as string | null,
      subject_name: sub?.name ?? null,
      subject_code: sub?.code ?? null,
      teacher_name: teacher?.full_name_en ?? null,
    }
  }) as SubjectTeacherRecord[]
}

// ============================================================================
// CLASSROOM MANAGEMENT — Types & Query Functions
// ============================================================================

export type AcademicBuildingRecord = {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string | null
}

export type AcademicClassroomRecord = {
  id: string
  building_id: string
  name: string
  floor: number
  capacity: number
  is_active: boolean
  created_at: string | null
  building_name?: string | null
}

export async function getAcademicBuildings(): Promise<AcademicBuildingRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("academic_buildings")
    .select("id, name, description, is_active, created_at")
    .order("name", { ascending: true })

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAcademicBuildingById(id: string): Promise<AcademicBuildingRecord | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("academic_buildings")
    .select("id, name, description, is_active, created_at")
    .eq("id", id)
    .maybeSingle()

  if (isMissingTableError(error)) return null
  if (error) throw new Error(error.message)
  return data
}

export async function getAcademicClassrooms(): Promise<AcademicClassroomRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("academic_classrooms")
    .select(`
      id, building_id, name, floor, capacity, is_active, created_at,
      academic_buildings!building_id (name)
    `)
    .order("floor", { ascending: true })
    .order("name", { ascending: true })

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)

  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    building_id: row.building_id as string,
    name: row.name as string,
    floor: row.floor as number,
    capacity: row.capacity as number,
    is_active: row.is_active as boolean,
    created_at: row.created_at as string | null,
    building_name: (row.academic_buildings as { name?: string } | null)?.name ?? null,
  })) as AcademicClassroomRecord[]
}

export async function getAcademicClassroomById(id: string): Promise<AcademicClassroomRecord | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("academic_classrooms")
    .select(`
      id, building_id, name, floor, capacity, is_active, created_at,
      academic_buildings!building_id (name)
    `)
    .eq("id", id)
    .maybeSingle()

  if (isMissingTableError(error)) return null
  if (error) throw new Error(error.message)
  if (!data) return null

  const row = data as Record<string, unknown>
  return {
    id: row.id as string,
    building_id: row.building_id as string,
    name: row.name as string,
    floor: row.floor as number,
    capacity: row.capacity as number,
    is_active: row.is_active as boolean,
    created_at: row.created_at as string | null,
    building_name: (row.academic_buildings as { name?: string } | null)?.name ?? null,
  } as AcademicClassroomRecord
}

// ============================================================================
// STUDENT MODULE — Types & Query Functions
// ============================================================================

export type StudentRecord = {
  id: string
  student_uid: string
  name_en: string
  name_bn: string | null
  gender: "Male" | "Female" | "Other"
  religion: "Islam" | "Hinduism" | "Buddhism" | "Christianity" | "Other" | null
  blood_group: string | null
  date_of_birth: string | null
  birth_certificate_no: string | null
  national_id: string | null
  passport_no: string | null
  mobile: string | null
  email: string | null
  photo: string | null
  note: string | null
  status: "active" | "inactive" | "suspended"
  created_at: string | null
}

export type StudentEnrollmentRecord = {
  id: string
  student_id: string
  academic_class_config_id: string
  group_id?: string | null
  admission_type: "new" | "promotion" | "transfer" | "re_admission"
  student_category: string
  roll_no: number
  board_roll: string | null
  board_registration: string | null
  quota_id: string | null
  enrollment_date: string
  enrollment_status: "Active" | "Completed" | "Transferred" | "Cancelled"
  promoted_from_enrollment_id: string | null
  created_at: string | null
  // Joins — names
  student_uid?: string
  student_name_en?: string
  student_name_bn?: string
  student_gender?: string
  student_religion?: string
  student_mobile?: string
  class_combination_name?: string
  session_name?: string
  class_name?: string
  section_name?: string
  group_name?: string
  shift_name?: string
  // Joins — raw IDs for filtering
  config_session_id?: string | null
  config_class_id?: string | null
  config_group_id?: string | null
  config_section_id?: string | null
}

export type StudentGuardianRecord = {
  id: string
  student_id: string
  relation_type: "Father" | "Mother" | "Guardian"
  name_en: string
  name_bn: string | null
  occupation: string | null
  yearly_income: number | null
  mobile: string | null
  email: string | null
  nid_no: string | null
}

export type StudentAddressRecord = {
  id: string
  student_id: string
  address_type: "Present" | "Permanent"
  country: string
  division: string | null
  district: string | null
  thana: string | null
  address_line: string
}

export type StudentPreviousAcademicRecord = {
  id: string
  student_id: string
  institute_name: string
  previous_class: string | null
  previous_gpa: number | null
  previous_marks: number | null
  previous_result: string | null
  tc_number: string | null
  tc_date: string | null
  institute_location: string | null
}

export type StudentDocumentRecord = {
  id: string
  student_id: string
  document_type: "Birth Certificate" | "Photo" | "Transcript" | "TC"
  file_path: string
  uploaded_at: string | null
}

export type StudentSubjectRecord = {
  id: string
  enrollment_id: string
  subject_id: string
  subject_category: "Mandatory" | "Optional" | "Religion"
  subject_name?: string | null
  subject_code?: string | null
}

export type AdmissionApplicationRecord = {
  id: string
  application_no: string
  session_id: string
  academic_class_config_id: string
  student_data_json: any
  guardian_data_json: any
  status: "Pending" | "Approved" | "Rejected" | "Waiting"
  submitted_at: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  session_name?: string | null
  class_combination_name?: string | null
}

export type AdmissionSettingsRecord = {
  id: string
  enable_online_admission: boolean
  start_date: string | null
  end_date: string | null
  allowed_classes: string[]
  require_approval: boolean
  auto_roll_generation: boolean
}

export async function getStudents(): Promise<StudentRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false })

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getStudentById(id: string): Promise<{
  student: StudentRecord
  guardians: StudentGuardianRecord[]
  addresses: StudentAddressRecord[]
  previousAcademics: StudentPreviousAcademicRecord[]
  documents: StudentDocumentRecord[]
  enrollments: StudentEnrollmentRecord[]
} | null> {
  const supabase = createSupabaseAdminClient()
  const [studentRes, guardiansRes, addressesRes, prevRes, docsRes, enrollmentsRes] = await Promise.all([
    supabase.from("students").select("*").eq("id", id).maybeSingle(),
    supabase.from("student_guardians").select("*").eq("student_id", id),
    supabase.from("student_addresses").select("*").eq("student_id", id),
    supabase.from("student_previous_academics").select("*").eq("student_id", id),
    supabase.from("student_documents").select("*").eq("student_id", id),
    supabase
      .from("student_enrollments")
      .select(`
        id, student_id, academic_class_config_id, group_id, admission_type, student_category,
        roll_no, board_roll, board_registration, quota_id, enrollment_date, enrollment_status,
        promoted_from_enrollment_id, created_at,
        groups!group_id (name),
        academic_class_configs!academic_class_config_id (
          session_id, version_id, shift_id, class_id, section_id,
          academic_sessions!session_id (name),
          classes!class_id (name),
          sections!section_id (name),
          academic_shifts!shift_id (name),
          academic_versions!version_id (name)
        )
      `)
      .eq("student_id", id)
      .order("created_at", { ascending: false }),
  ])

  if (studentRes.error) throw new Error(studentRes.error.message)
  if (!studentRes.data) return null

  const enrollments = ((enrollmentsRes.data ?? []) as Record<string, unknown>[]).map((row) => {
    const group = row.groups as Record<string, unknown> | null
    const config = row.academic_class_configs as Record<string, unknown> | null
    const session = config?.academic_sessions as Record<string, unknown> | null
    const cls = config?.classes as Record<string, unknown> | null
    const sec = config?.sections as Record<string, unknown> | null
    const shift = config?.academic_shifts as Record<string, unknown> | null
    const ver = config?.academic_versions as Record<string, unknown> | null

    const comboLabel = [
      session?.name,
      ver?.name,
      shift?.name,
      cls?.name,
      sec?.name,
      group?.name,
    ]
      .filter(Boolean)
      .join(" › ")

    return {
      id: row.id as string,
      student_id: row.student_id as string,
      academic_class_config_id: row.academic_class_config_id as string,
      group_id: row.group_id as string | null,
      admission_type: row.admission_type as any,
      student_category: row.student_category as string,
      roll_no: row.roll_no as number,
      board_roll: row.board_roll as string | null,
      board_registration: row.board_registration as string | null,
      quota_id: row.quota_id as string | null,
      enrollment_date: row.enrollment_date as string,
      enrollment_status: row.enrollment_status as any,
      promoted_from_enrollment_id: row.promoted_from_enrollment_id as string | null,
      created_at: row.created_at as string | null,
      class_combination_name: comboLabel,
      session_name: session?.name as string | null,
      class_name: cls?.name as string | null,
      section_name: sec?.name as string | null,
      group_name: group?.name as string | null,
      shift_name: shift?.name as string | null,
      config_session_id: config?.session_id as string | null,
      config_class_id: config?.class_id as string | null,
      config_group_id: row.group_id as string | null,
      config_section_id: config?.section_id as string | null,
    }
  }) as StudentEnrollmentRecord[]

  return {
    student: studentRes.data as StudentRecord,
    guardians: (guardiansRes.data ?? []) as StudentGuardianRecord[],
    addresses: (addressesRes.data ?? []) as StudentAddressRecord[],
    previousAcademics: (prevRes.data ?? []) as StudentPreviousAcademicRecord[],
    documents: (docsRes.data ?? []) as StudentDocumentRecord[],
    enrollments,
  }
}

export async function getStudentEnrollments(
  sessionId?: string,
  classConfigId?: string
): Promise<StudentEnrollmentRecord[]> {
  const supabase = createSupabaseAdminClient()
  let query = supabase
    .from("student_enrollments")
    .select(`
      id, student_id, academic_class_config_id, group_id, admission_type, student_category,
      roll_no, board_roll, board_registration, quota_id, enrollment_date, enrollment_status,
      promoted_from_enrollment_id, created_at,
      students!student_id (student_uid, name_en, name_bn, gender, religion, mobile),
      groups!group_id (name),
      academic_class_configs!academic_class_config_id (
        session_id, version_id, shift_id, class_id, section_id,
        academic_sessions!session_id (name),
        classes!class_id (name),
        sections!section_id (name),
        academic_shifts!shift_id (name),
        academic_versions!version_id (name)
      )
    `)

  if (classConfigId) {
    query = query.eq("academic_class_config_id", classConfigId)
  }

  const { data, error } = await query

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)

  return ((data ?? []) as Record<string, unknown>[]).map((row) => {
    const student = row.students as Record<string, unknown> | null
    const group = row.groups as Record<string, unknown> | null
    const config = row.academic_class_configs as Record<string, unknown> | null
    const session = config?.academic_sessions as Record<string, unknown> | null
    const cls = config?.classes as Record<string, unknown> | null
    const sec = config?.sections as Record<string, unknown> | null
    const shift = config?.academic_shifts as Record<string, unknown> | null
    const ver = config?.academic_versions as Record<string, unknown> | null

    const comboLabel = [
      session?.name,
      ver?.name,
      shift?.name,
      cls?.name,
      sec?.name,
      group?.name,
    ]
      .filter(Boolean)
      .join(" › ")

    return {
      id: row.id as string,
      student_id: row.student_id as string,
      academic_class_config_id: row.academic_class_config_id as string,
      group_id: row.group_id as string | null,
      admission_type: row.admission_type as any,
      student_category: row.student_category as string,
      roll_no: row.roll_no as number,
      board_roll: row.board_roll as string | null,
      board_registration: row.board_registration as string | null,
      quota_id: row.quota_id as string | null,
      enrollment_date: row.enrollment_date as string,
      enrollment_status: row.enrollment_status as any,
      promoted_from_enrollment_id: row.promoted_from_enrollment_id as string | null,
      created_at: row.created_at as string | null,
      student_uid: student?.student_uid as string,
      student_name_en: student?.name_en as string,
      student_name_bn: student?.name_bn as string | null,
      student_gender: student?.gender as string,
      student_religion: student?.religion as string,
      student_mobile: student?.mobile as string | null,
      class_combination_name: comboLabel,
      session_name: session?.name as string | null,
      class_name: cls?.name as string | null,
      section_name: sec?.name as string | null,
      group_name: group?.name as string | null,
      shift_name: shift?.name as string | null,
      // Raw IDs for direct filtering
      config_session_id: config?.session_id as string | null,
      config_class_id: config?.class_id as string | null,
      config_group_id: row.group_id as string | null,
      config_section_id: config?.section_id as string | null,
    }
  }) as StudentEnrollmentRecord[]
}

export async function getStudentEnrollmentById(id: string): Promise<StudentEnrollmentRecord | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("student_enrollments")
    .select(`
      id, student_id, academic_class_config_id, group_id, admission_type, student_category,
      roll_no, board_roll, board_registration, quota_id, enrollment_date, enrollment_status,
      promoted_from_enrollment_id, created_at,
      students!student_id (student_uid, name_en, name_bn, gender, religion, mobile),
      groups!group_id (name),
      academic_class_configs!academic_class_config_id (
        session_id, version_id, shift_id, class_id, section_id,
        academic_sessions!session_id (name),
        classes!class_id (name),
        sections!section_id (name),
        academic_shifts!shift_id (name),
        academic_versions!version_id (name)
      )
    `)
    .eq("id", id)
    .maybeSingle()

  if (isMissingTableError(error)) return null
  if (error) throw new Error(error.message)
  if (!data) return null

  const row = data as Record<string, unknown>
  const student = row.students as Record<string, unknown> | null
  const group = row.groups as Record<string, unknown> | null
  const config = row.academic_class_configs as Record<string, unknown> | null
  const session = config?.academic_sessions as Record<string, unknown> | null
  const cls = config?.classes as Record<string, unknown> | null
  const sec = config?.sections as Record<string, unknown> | null
  const shift = config?.academic_shifts as Record<string, unknown> | null
  const ver = config?.academic_versions as Record<string, unknown> | null

  const comboLabel = [
    session?.name,
    ver?.name,
    shift?.name,
    cls?.name,
    sec?.name,
    group?.name,
  ]
    .filter(Boolean)
    .join(" › ")

  return {
    id: row.id as string,
    student_id: row.student_id as string,
    academic_class_config_id: row.academic_class_config_id as string,
    group_id: row.group_id as string | null,
    admission_type: row.admission_type as any,
    student_category: row.student_category as string,
    roll_no: row.roll_no as number,
    board_roll: row.board_roll as string | null,
    board_registration: row.board_registration as string | null,
    quota_id: row.quota_id as string | null,
    enrollment_date: row.enrollment_date as string,
    enrollment_status: row.enrollment_status as any,
    promoted_from_enrollment_id: row.promoted_from_enrollment_id as string | null,
    created_at: row.created_at as string | null,
    student_uid: student?.student_uid as string,
    student_name_en: student?.name_en as string,
    student_name_bn: student?.name_bn as string | null,
    student_gender: student?.gender as string,
    student_religion: student?.religion as string,
    student_mobile: student?.mobile as string | null,
    class_combination_name: comboLabel,
    session_name: session?.name as string | null,
    class_name: cls?.name as string | null,
    section_name: sec?.name as string | null,
    group_name: group?.name as string | null,
    shift_name: shift?.name as string | null,
  } as StudentEnrollmentRecord
}

export async function getStudentSubjects(enrollmentId: string): Promise<StudentSubjectRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("student_subjects")
    .select(`
      id, enrollment_id, subject_id, subject_category,
      subjects!subject_id (name, code)
    `)
    .eq("enrollment_id", enrollmentId)

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)

  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    enrollment_id: row.enrollment_id as string,
    subject_id: row.subject_id as string,
    subject_category: row.subject_category as any,
    subject_name: (row.subjects as { name?: string } | null)?.name ?? null,
    subject_code: (row.subjects as { code?: string } | null)?.code ?? null,
  })) as StudentSubjectRecord[]
}

export async function getAdmissionApplications(): Promise<AdmissionApplicationRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("admission_applications")
    .select(`
      id, application_no, session_id, academic_class_config_id,
      student_data_json, guardian_data_json, status, submitted_at,
      reviewed_at, reviewed_by,
      academic_sessions!session_id (name),
      academic_class_configs!academic_class_config_id (
        session_id, version_id, shift_id, class_id, section_id, group_id,
        academic_sessions!session_id (name),
        classes!class_id (name),
        sections!section_id (name),
        groups!group_id (name),
        academic_shifts!shift_id (name),
        academic_versions!version_id (name)
      )
    `)
    .order("submitted_at", { ascending: false })

  if (isMissingTableError(error)) return []
  if (error) throw new Error(error.message)

  return ((data ?? []) as Record<string, unknown>[]).map((row) => {
    const session = row.academic_sessions as Record<string, unknown> | null
    const config = row.academic_class_configs as Record<string, unknown> | null
    const cSession = config?.academic_sessions as Record<string, unknown> | null
    const cls = config?.classes as Record<string, unknown> | null
    const sec = config?.sections as Record<string, unknown> | null
    const grp = config?.groups as Record<string, unknown> | null
    const shift = config?.academic_shifts as Record<string, unknown> | null
    const ver = config?.academic_versions as Record<string, unknown> | null

    const comboLabel = [
      cSession?.name,
      ver?.name,
      shift?.name,
      cls?.name,
      sec?.name,
      grp?.name,
    ]
      .filter(Boolean)
      .join(" › ")

    return {
      id: row.id as string,
      application_no: row.application_no as string,
      session_id: row.session_id as string,
      academic_class_config_id: row.academic_class_config_id as string,
      student_data_json: row.student_data_json,
      guardian_data_json: row.guardian_data_json,
      status: row.status as any,
      submitted_at: row.submitted_at as string | null,
      reviewed_at: row.reviewed_at as string | null,
      reviewed_by: row.reviewed_by as string | null,
      session_name: session?.name ?? null,
      class_combination_name: comboLabel,
    } as AdmissionApplicationRecord
  })
}

export async function getAdmissionSettings(): Promise<AdmissionSettingsRecord> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("admission_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle()

  if (error && !isMissingTableError(error)) throw new Error(error.message)
  return (
    data ?? {
      id: "default",
      enable_online_admission: false,
      start_date: null,
      end_date: null,
      allowed_classes: [],
      require_approval: true,
      auto_roll_generation: true,
    }
  )
}

export async function generateStudentUID(admissionYear: string, classConfigId: string): Promise<string> {
  const classConfig = await getAcademicClassConfigById(classConfigId)
  if (!classConfig) throw new Error("Class configuration not found")

  const supabase = createSupabaseAdminClient()
  const { data: cls } = await supabase
    .from("classes")
    .select("numeric_value")
    .eq("id", classConfig.class_id)
    .maybeSingle()

  const classVal = cls?.numeric_value ?? 0
  const ccStr = String(classVal).padStart(2, "0").substring(0, 2)

  // YY part (e.g. 2026 -> "26")
  const yyStr = admissionYear.length === 4 ? admissionYear.substring(2, 4) : admissionYear.substring(0, 2)

  const prefix = `${yyStr}${ccStr}`

  // SSSS part: find max serial
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

  const ssssStr = String(nextSerial).padStart(4, "0")
  return `${prefix}${ssssStr}`
}


export type ExamRecord = {
  id: string
  name: string
  session_id: string
  status: string
  created_at: string | null
  session_name?: string | null
}

export type ExamScheduleRecord = {
  id: string
  exam_id: string
  class_id: string
  subject_id: string
  exam_date: string
  start_time: string
  end_time: string
  room_id: string | null
  created_at: string | null
  exam_name?: string | null
  class_name?: string | null
  subject_name?: string | null
  room_name?: string | null
}

export type GradeScaleRecord = {
  id: string
  name: string
  description: string | null
  created_at: string | null
}

export type GradeScaleDetailRecord = {
  id: string
  grade_scale_id: string
  grade_letter: string
  grade_point: number
  min_percentage: number
  max_percentage: number
  remarks: string | null
  created_at: string | null
}

// ============================================================================
// EXAM MANAGEMENT MODULE - Query Functions
// ============================================================================

export async function getExams(): Promise<ExamRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("exams")
    .select(`
      id, name, session_id, status, created_at,
      academic_sessions!session_id (name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    if (isMissingTableError(error)) return []
    throw new Error(error.message)
  }

  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    session_id: row.session_id as string,
    status: row.status as string,
    created_at: row.created_at as string | null,
    session_name: (row.academic_sessions as { name?: string } | null)?.name ?? null,
  }))
}

export async function getExamSchedules(): Promise<ExamScheduleRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("exam_schedules")
    .select(`
      id, exam_id, class_id, subject_id, exam_date, start_time, end_time, room_id, created_at,
      exams!exam_id (name),
      classes!class_id (name),
      subjects!subject_id (name),
      academic_classrooms!room_id (name)
    `)
    .order("exam_date", { ascending: true })

  if (error) {
    if (isMissingTableError(error)) return []
    throw new Error(error.message)
  }

  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    exam_id: row.exam_id as string,
    class_id: row.class_id as string,
    subject_id: row.subject_id as string,
    exam_date: row.exam_date as string,
    start_time: row.start_time as string,
    end_time: row.end_time as string,
    room_id: row.room_id as string | null,
    created_at: row.created_at as string | null,
    exam_name: (row.exams as { name?: string } | null)?.name ?? null,
    class_name: (row.classes as { name?: string } | null)?.name ?? null,
    subject_name: (row.subjects as { name?: string } | null)?.name ?? null,
    room_name: (row.academic_classrooms as { name?: string } | null)?.name ?? null,
  }))
}

export async function getGradeScaleById(id: string): Promise<GradeScaleRecord | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("grade_scales")
    .select("id, name, description, created_at")
    .eq("id", id)
    .single()

  if (error) return null
  return data as GradeScaleRecord
}

export async function getGradeScales(): Promise<GradeScaleRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("grade_scales")
    .select("id, name, description, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    if (isMissingTableError(error)) return []
    throw new Error(error.message)
  }
  return (data ?? []) as GradeScaleRecord[]
}

export async function getGradeScaleDetails(scaleId: string): Promise<GradeScaleDetailRecord[]> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("grade_scale_details")
    .select("id, grade_scale_id, grade_letter, grade_point, min_percentage, max_percentage, remarks, created_at")
    .eq("grade_scale_id", scaleId)
    .order("grade_point", { ascending: false })

  if (error) {
    if (isMissingTableError(error)) return []
    throw new Error(error.message)
  }
  return (data ?? []) as GradeScaleDetailRecord[]
}
