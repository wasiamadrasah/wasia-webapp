"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { hash } from "bcryptjs"
import { createSupabaseAdminClient } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { sendAdminPromotionEmail } from "@/lib/email"

export type StaffUser = {
  id: string
  accountId?: string | null
  staffId?: string | null
  adminId?: string | null
  type: "admin" | "staff"
  name: string
  nameBn?: string | null
  email: string
  phone?: string | null
  role: string
  roleLabel: string
  designation?: string | null
  department?: string | null
  employeeId?: string | null
  photo?: string | null
  status: "active" | "inactive" | "suspended"
  canLogin: boolean
  hasAccount: boolean
  isAlsoAdmin?: boolean
  adminRecordId?: string | null
  createdAt?: string | null
}

export type StudentUser = {
  id: string
  accountId?: string | null
  studentId: string
  studentUid: string
  name: string
  nameBn?: string | null
  email?: string | null
  phone?: string | null
  role: "student"
  className?: string | null
  sectionName?: string | null
  rollNo?: number | string | null
  sessionName?: string | null
  photo?: string | null
  gender?: string | null
  status: "active" | "inactive" | "suspended"
  hasAccount: boolean
  createdAt?: string | null
}

export type UsersDataResult = {
  staffUsers: StaffUser[]
  studentUsers: StudentUser[]
  isSuperAdmin: boolean
  currentUserRole: string
  stats: {
    totalUsers: number
    totalStaff: number
    totalStudents: number
    totalActive: number
    totalAdmins: number
    totalTeachers: number
  }
}

/**
 * Format role identifier into a readable badge label
 */
function formatRoleLabel(role: string): string {
  const map: Record<string, string> = {
    superadmin: "Super Admin",
    super_admin: "Super Admin",
    admin: "Admin",
    teacher: "Teacher",
    accountant: "Accountant",
    librarian: "Librarian",
    receptionist: "Receptionist",
    staff: "Staff",
    driver: "Driver",
    parent: "Parent",
    student: "Student",
  }
  return map[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1)
}

/**
 * Generate a cryptographically pleasant temporary password
 */
function generateSecureTempPassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  let random = ""
  for (let i = 0; i < 3; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length))
    random += upper.charAt(Math.floor(Math.random() * upper.length))
  }
  return `Wasia@${random}`
}

/**
 * Fetch all registered users across all roles (Staff, Admins, Teachers, Students)
 */
export async function getAllUsers(): Promise<{ success: boolean; data?: UsersDataResult; error?: string }> {
  try {
    const supabase = createSupabaseAdminClient()
    const session = await getServerSession(authOptions)

    // Check if the currently logged-in user is a Super Admin or Admin
    let isCurrentSuperAdmin = false
    let currentRole = "admin"

    if (session?.user?.email) {
      const { data: currentAdmin } = await supabase
        .from("admins")
        .select("role")
        .ilike("email", session.user.email)
        .limit(1)
        .maybeSingle()

      const roleStr = (currentAdmin?.role || session.user.userRole || "").toLowerCase().trim()
      currentRole = roleStr || "admin"
      if (roleStr === "superadmin" || roleStr === "super_admin" || roleStr === "super admin") {
        isCurrentSuperAdmin = true
      }
    }

    // Run parallel queries across all user tables
    const [
      { data: admins, error: adminErr },
      { data: staffAccounts, error: staffAccErr },
      { data: staffs, error: staffErr },
      { data: studentAccounts, error: studAccErr },
      { data: students, error: studErr },
      { data: enrollments, error: enrollErr },
      { data: classConfigs, error: configErr },
      { data: classes, error: classErr },
      { data: sections, error: secErr },
      { data: sessions, error: sessErr }
    ] = await Promise.all([
      supabase.from("admins").select("id, email, role, full_name, profile_photo, created_at"),
      supabase.from("staff_accounts").select("id, staff_id, email, role, status, can_login, created_at"),
      supabase.from("staffs").select("id, employee_id, full_name_en, full_name_bn, designation, type, email, contact_number, profile_photo, created_at"),
      supabase.from("student_accounts").select("id, student_id, student_uid, email, role, status, created_at"),
      supabase.from("students").select("id, student_uid, name_en, name_bn, gender, mobile, email, photo, status, created_at"),
      supabase.from("student_enrollments").select("id, student_id, academic_class_config_id, roll_no, enrollment_status"),
      supabase.from("academic_class_configs").select("id, class_id, section_id, academic_session_id"),
      supabase.from("classes").select("id, name_en, name_bn"),
      supabase.from("sections").select("id, name_en, name_bn"),
      supabase.from("academic_sessions").select("id, name_en, name_bn, is_current")
    ])

    if (adminErr) console.warn("Error querying admins:", adminErr.message)
    if (staffAccErr) console.warn("Error querying staff_accounts:", staffAccErr.message)
    if (staffErr) console.warn("Error querying staffs:", staffErr.message)
    if (studAccErr) console.warn("Error querying student_accounts:", studAccErr.message)
    if (studErr) console.warn("Error querying students:", studErr.message)

    // Lookup maps
    const classMap = new Map((classes || []).map((c) => [c.id, c.name_en || c.name_bn]))
    const sectionMap = new Map((sections || []).map((s) => [s.id, s.name_en || s.name_bn]))
    const sessionMap = new Map((sessions || []).map((s) => [s.id, s.name_en || s.name_bn]))

    const configMap = new Map((classConfigs || []).map((cfg) => [
      cfg.id,
      {
        className: classMap.get(cfg.class_id) || "Class",
        sectionName: sectionMap.get(cfg.section_id) || "Section",
        sessionName: sessionMap.get(cfg.academic_session_id) || "",
      }
    ]))

    const enrollmentByStudentId = new Map<string, { className: string; sectionName: string; sessionName: string; rollNo: number }>()
    if (enrollments) {
      for (const e of enrollments) {
        const cfg = configMap.get(e.academic_class_config_id)
        if (cfg && !enrollmentByStudentId.has(e.student_id)) {
          enrollmentByStudentId.set(e.student_id, {
            className: cfg.className,
            sectionName: cfg.sectionName,
            sessionName: cfg.sessionName,
            rollNo: e.roll_no,
          })
        }
      }
    }

    // Process Staff & Admin Users
    const staffUsersList: StaffUser[] = []
    const seenStaffEmails = new Set<string>()

    const adminByEmail = new Map((admins || []).map((a) => [a.email?.toLowerCase().trim(), a]))
    const staffAccountByStaffId = new Map((staffAccounts || []).map((sa) => [sa.staff_id, sa]))
    const staffAccountByEmail = new Map((staffAccounts || []).map((sa) => [sa.email?.toLowerCase().trim(), sa]))

    // 1. Process Staffs (Teachers, Staff, and dual-role Admin Teachers)
    if (staffs) {
      for (const staff of staffs) {
        const staffEmail = staff.email?.toLowerCase().trim()
        const account = staffAccountByStaffId.get(staff.id) || (staffEmail ? staffAccountByEmail.get(staffEmail) : null)
        const adminAccount = staffEmail ? adminByEmail.get(staffEmail) : null

        // Determine role
        let role = account?.role || (staff.type === "teacher" ? "teacher" : "staff")
        if (!role && staff.designation?.toLowerCase().includes("teacher")) {
          role = "teacher"
        } else if (!role) {
          role = "staff"
        }

        const roleLower = role.toLowerCase().trim()
        if ((roleLower === "superadmin" || roleLower === "super_admin") && !isCurrentSuperAdmin) {
          continue
        }

        const isAlsoAdmin =
          Boolean(adminAccount) &&
          roleLower !== "superadmin" &&
          roleLower !== "super_admin" &&
          roleLower !== "admin"
        const statusRaw = account?.status || "active"
        const status = (["active", "inactive", "suspended"].includes(statusRaw) ? statusRaw : "active") as "active" | "inactive" | "suspended"
        const canLogin = account?.can_login !== false || isAlsoAdmin

        if (staffEmail) seenStaffEmails.add(staffEmail)

        staffUsersList.push({
          id: account?.id || staff.id,
          accountId: account?.id || null,
          staffId: staff.id,
          adminId: adminAccount?.id || null,
          type: "staff",
          name: staff.full_name_en || staff.full_name_bn || "Staff Member",
          nameBn: staff.full_name_bn,
          email: staff.email || account?.email || "No email",
          phone: staff.contact_number,
          role: role,
          roleLabel: formatRoleLabel(role),
          designation: staff.designation || "Staff",
          department: staff.type || "General",
          employeeId: staff.employee_id,
          photo: staff.profile_photo,
          status: status,
          canLogin: canLogin,
          hasAccount: Boolean(account?.id) || isAlsoAdmin,
          isAlsoAdmin: isAlsoAdmin,
          adminRecordId: adminAccount?.id || null,
          createdAt: account?.created_at || staff.created_at,
        })
      }
    }

    // 2. Add Admins who are not in staffs table
    if (admins) {
      for (const admin of admins) {
        const normalizedEmail = admin.email?.toLowerCase().trim()
        if (normalizedEmail && seenStaffEmails.has(normalizedEmail)) {
          // Already included as a dual-role staff member above
          continue
        }

        const adminRole = (admin.role || "superadmin").toLowerCase().trim()
        const isSuper = adminRole === "superadmin" || adminRole === "super_admin"

        // If the logged-in user is NOT superadmin, hide superadmin rows!
        if (isSuper && !isCurrentSuperAdmin) {
          continue
        }

        if (normalizedEmail) seenStaffEmails.add(normalizedEmail)

        staffUsersList.push({
          id: admin.id,
          adminId: admin.id,
          type: "admin",
          name: admin.full_name || "Administrator",
          email: admin.email,
          role: admin.role || "superadmin",
          roleLabel: formatRoleLabel(admin.role || "superadmin"),
          designation: isSuper ? "System Super Admin" : "System Administrator",
          department: "Administration",
          photo: admin.profile_photo,
          status: "active",
          canLogin: true,
          hasAccount: true,
          isAlsoAdmin: false,
          adminRecordId: admin.id,
          createdAt: admin.created_at,
        })
      }
    }

    // 3. Standalone staff_accounts not yet mapped to staffs or admins
    if (staffAccounts) {
      for (const sa of staffAccounts) {
        const normalizedEmail = sa.email?.toLowerCase().trim()
        const roleLower = (sa.role || "staff").toLowerCase().trim()
        if ((roleLower === "superadmin" || roleLower === "super_admin") && !isCurrentSuperAdmin) {
          continue
        }

        if (normalizedEmail && !seenStaffEmails.has(normalizedEmail)) {
          seenStaffEmails.add(normalizedEmail)
          staffUsersList.push({
            id: sa.id,
            accountId: sa.id,
            staffId: sa.staff_id,
            type: "staff",
            name: sa.email?.split("@")[0] || "Staff Account",
            email: sa.email,
            role: sa.role || "staff",
            roleLabel: formatRoleLabel(sa.role || "staff"),
            designation: formatRoleLabel(sa.role || "staff"),
            department: "General",
            status: (sa.status || "active") as "active" | "inactive" | "suspended",
            canLogin: sa.can_login !== false,
            hasAccount: true,
            createdAt: sa.created_at,
          })
        }
      }
    }

    // Process Students
    const studentUsersList: StudentUser[] = []
    const studentAccountByStudentId = new Map((studentAccounts || []).map((sa) => [sa.student_id, sa]))
    const studentAccountByUid = new Map((studentAccounts || []).map((sa) => [sa.student_uid, sa]))

    if (students) {
      for (const st of students) {
        const account = studentAccountByStudentId.get(st.id) || studentAccountByUid.get(st.student_uid)
        const enrollment = enrollmentByStudentId.get(st.id)

        const statusRaw = account?.status || st.status || "active"
        const status = (["active", "inactive", "suspended"].includes(statusRaw) ? statusRaw : "active") as "active" | "inactive" | "suspended"

        studentUsersList.push({
          id: account?.id || st.id,
          accountId: account?.id || null,
          studentId: st.id,
          studentUid: st.student_uid,
          name: st.name_en || st.name_bn || `Student ${st.student_uid}`,
          nameBn: st.name_bn,
          email: account?.email || st.email,
          phone: st.mobile,
          role: "student",
          className: enrollment?.className,
          sectionName: enrollment?.sectionName,
          rollNo: enrollment?.rollNo,
          sessionName: enrollment?.sessionName,
          photo: st.photo,
          gender: st.gender,
          status: status,
          hasAccount: Boolean(account?.id),
          createdAt: account?.created_at || st.created_at,
        })
      }
    }

    // Also include any student_accounts that might not be in students table
    if (studentAccounts) {
      const seenStudentUids = new Set(studentUsersList.map((s) => s.studentUid))
      for (const sa of studentAccounts) {
        if (!seenStudentUids.has(sa.student_uid)) {
          seenStudentUids.add(sa.student_uid)
          studentUsersList.push({
            id: sa.id,
            accountId: sa.id,
            studentId: sa.student_id,
            studentUid: sa.student_uid,
            name: `Student (${sa.student_uid})`,
            email: sa.email,
            role: "student",
            status: (sa.status || "active") as "active" | "inactive" | "suspended",
            hasAccount: true,
            createdAt: sa.created_at,
          })
        }
      }
    }

    // Stats calculations
    const totalStaff = staffUsersList.length
    const totalStudents = studentUsersList.length
    const totalUsers = totalStaff + totalStudents
    const totalActive =
      staffUsersList.filter((s) => s.status === "active").length +
      studentUsersList.filter((s) => s.status === "active").length
    const totalAdmins = staffUsersList.filter((s) => s.role === "admin" || s.role === "superadmin" || s.isAlsoAdmin).length
    const totalTeachers = staffUsersList.filter((s) => s.role === "teacher").length

    return {
      success: true,
      data: {
        staffUsers: staffUsersList,
        studentUsers: studentUsersList,
        isSuperAdmin: isCurrentSuperAdmin,
        currentUserRole: currentRole,
        stats: {
          totalUsers,
          totalStaff,
          totalStudents,
          totalActive,
          totalAdmins,
          totalTeachers,
        },
      },
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch users."
    return { success: false, error: msg }
  }
}

/**
 * Promote a Teacher to have an Administrator dual-role.
 * Creates an admin credential record in `admins` and `admin_roles`, and emails their password.
 */
export async function promoteTeacherToAdmin(
  staffId: string,
  customPassword?: string
): Promise<{ success: boolean; temporaryPassword?: string; emailSent?: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin privileges required." }
    }

    const supabase = createSupabaseAdminClient()

    // 1. Fetch teacher record
    const { data: staff, error: staffErr } = await supabase
      .from("staffs")
      .select("id, full_name_en, full_name_bn, email, profile_photo")
      .eq("id", staffId)
      .single()

    if (staffErr || !staff) {
      return { success: false, error: "Teacher profile record not found." }
    }

    if (!staff.email || !staff.email.trim()) {
      return {
        success: false,
        error: "Teacher does not have an email address registered. An email is required to assign admin access and send credentials.",
      }
    }

    const normalizedEmail = staff.email.toLowerCase().trim()
    const temporaryPassword = (customPassword && customPassword.trim().length >= 6)
      ? customPassword.trim()
      : generateSecureTempPassword()

    const passwordHash = await hash(temporaryPassword, 10)

    // 2. Upsert into admins table
    const { data: adminRecord, error: adminErr } = await supabase
      .from("admins")
      .upsert(
        {
          email: normalizedEmail,
          full_name: staff.full_name_en || staff.full_name_bn || "Teacher Administrator",
          password_hash: passwordHash,
          role: "admin",
          profile_photo: staff.profile_photo || null,
        },
        { onConflict: "email" }
      )
      .select("id")
      .single()

    if (adminErr || !adminRecord) {
      throw adminErr || new Error("Failed to insert admin record.")
    }

    // 3. Upsert into admin_roles table
    await supabase
      .from("admin_roles")
      .upsert({ user_id: adminRecord.id, role: "admin" }, { onConflict: "user_id" })

    // 4. Send official promotion email
    const emailResult = await sendAdminPromotionEmail({
      to: normalizedEmail,
      name: staff.full_name_en || staff.full_name_bn || "Teacher",
      temporaryPassword,
    })

    revalidatePath("/admin/users")
    return {
      success: true,
      temporaryPassword,
      emailSent: emailResult.success,
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to promote teacher to admin."
    return { success: false, error: msg }
  }
}

/**
 * Demote an admin-teacher back to standard teacher access.
 * Removes their administrator record from `admins` and `admin_roles`.
 */
export async function demoteTeacherFromAdmin(
  staffId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin privileges required." }
    }

    const supabase = createSupabaseAdminClient()

    // 1. Fetch teacher record
    const { data: staff, error: staffErr } = await supabase
      .from("staffs")
      .select("id, email")
      .eq("id", staffId)
      .single()

    if (staffErr || !staff || !staff.email) {
      return { success: false, error: "Teacher record or email not found." }
    }

    const normalizedEmail = staff.email.toLowerCase().trim()

    // 2. Find admin record
    const { data: adminRecord } = await supabase
      .from("admins")
      .select("id, role")
      .ilike("email", normalizedEmail)
      .maybeSingle()

    if (!adminRecord) {
      return { success: false, error: "No active administrator account found for this teacher." }
    }

    if (adminRecord.role === "superadmin") {
      return { success: false, error: "Super Admin accounts cannot be demoted." }
    }

    // 3. Remove admin roles and admin record
    await supabase.from("admin_roles").delete().eq("user_id", adminRecord.id)
    const { error: deleteErr } = await supabase.from("admins").delete().eq("id", adminRecord.id)

    if (deleteErr) {
      throw deleteErr
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to demote teacher from admin."
    return { success: false, error: msg }
  }
}

/**
 * Toggle active/inactive status for a staff or student user
 */
export async function toggleUserStatus(
  userId: string,
  userType: "admin" | "staff" | "student",
  currentStatus: "active" | "inactive" | "suspended"
): Promise<{ success: boolean; newStatus?: string; error?: string }> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin privileges required." }
    }

    const nextStatus = currentStatus === "active" ? "inactive" : "active"
    const supabase = createSupabaseAdminClient()

    if (userType === "admin") {
      return { success: false, error: "Main administrator status cannot be deactivated." }
    }

    if (userType === "staff") {
      // Check if staff_account exists for this id
      const { data: existingAccount } = await supabase
        .from("staff_accounts")
        .select("id, staff_id, role")
        .or(`id.eq.${userId},staff_id.eq.${userId}`)
        .maybeSingle()

      if (existingAccount) {
        const { error } = await supabase
          .from("staff_accounts")
          .update({
            status: nextStatus,
            can_login: nextStatus === "active",
          })
          .eq("id", existingAccount.id)

        if (error) throw error
      } else {
        // Staff member without account: create active/inactive record
        const { data: staffData } = await supabase
          .from("staffs")
          .select("id, email, type")
          .eq("id", userId)
          .single()

        if (staffData) {
          const defaultPasswordHash = await hash("Wasia@2026", 10)
          await supabase.from("staff_accounts").insert({
            staff_id: staffData.id,
            email: staffData.email || `staff_${staffData.id.slice(0, 8)}@madrasah.local`,
            password_hash: defaultPasswordHash,
            role: staffData.type === "teacher" ? "teacher" : "staff",
            status: nextStatus,
            can_login: nextStatus === "active",
          })
        }
      }
    } else if (userType === "student") {
      // Check student_accounts
      const { data: existingStudAccount } = await supabase
        .from("student_accounts")
        .select("id, student_id")
        .or(`id.eq.${userId},student_id.eq.${userId}`)
        .maybeSingle()

      if (existingStudAccount) {
        const { error } = await supabase
          .from("student_accounts")
          .update({ status: nextStatus })
          .eq("id", existingStudAccount.id)

        if (error) throw error
      }

      // Also update students table status
      await supabase
        .from("students")
        .update({ status: nextStatus })
        .or(`id.eq.${userId},student_uid.eq.${userId}`)
    }

    revalidatePath("/admin/users")
    return { success: true, newStatus: nextStatus }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to toggle status."
    return { success: false, error: msg }
  }
}

/**
 * Reset password for a staff, admin, or student account
 */
export async function resetUserPassword(
  userId: string,
  userType: "admin" | "staff" | "student",
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin privileges required." }
    }

    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." }
    }

    const passwordHash = await hash(newPassword.trim(), 10)
    const supabase = createSupabaseAdminClient()

    if (userType === "admin") {
      // Super admin password cannot be reset from the users management panel
      const { data: targetAdmin } = await supabase
        .from("admins")
        .select("role")
        .eq("id", userId)
        .maybeSingle()

      const targetRole = (targetAdmin?.role || "").toLowerCase().trim()
      if (targetRole === "superadmin" || targetRole === "super_admin") {
        return { success: false, error: "Super Administrator passwords cannot be reset from this panel." }
      }

      const { error } = await supabase
        .from("admins")
        .update({ password_hash: passwordHash })
        .eq("id", userId)

      if (error) throw error
    } else if (userType === "staff") {
      // Check if staff_account exists
      const { data: existingAccount } = await supabase
        .from("staff_accounts")
        .select("id")
        .or(`id.eq.${userId},staff_id.eq.${userId}`)
        .maybeSingle()

      if (existingAccount) {
        const { error } = await supabase
          .from("staff_accounts")
          .update({ password_hash: passwordHash })
          .eq("id", existingAccount.id)

        if (error) throw error
      } else {
        // Staff member without an existing staff_account row
        const { data: staffData } = await supabase
          .from("staffs")
          .select("id, email, type")
          .eq("id", userId)
          .single()

        if (!staffData) {
          return { success: false, error: "Staff member record not found." }
        }

        const { error: insertErr } = await supabase.from("staff_accounts").insert({
          staff_id: staffData.id,
          email: staffData.email || `staff_${staffData.id.slice(0, 8)}@madrasah.local`,
          password_hash: passwordHash,
          role: staffData.type === "teacher" ? "teacher" : "staff",
          status: "active",
          can_login: true,
        })

        if (insertErr) throw insertErr
      }
    } else if (userType === "student") {
      const { data: existingStudAccount } = await supabase
        .from("student_accounts")
        .select("id")
        .or(`id.eq.${userId},student_id.eq.${userId}`)
        .maybeSingle()

      if (existingStudAccount) {
        const { error } = await supabase
          .from("student_accounts")
          .update({ password_hash: passwordHash })
          .eq("id", existingStudAccount.id)

        if (error) throw error
      } else {
        // Student without student_account row: create one
        const { data: studentData } = await supabase
          .from("students")
          .select("id, student_uid, email")
          .eq("id", userId)
          .single()

        if (!studentData) {
          return { success: false, error: "Student record not found." }
        }

        const { error: insertErr } = await supabase.from("student_accounts").insert({
          student_id: studentData.id,
          student_uid: studentData.student_uid,
          email: studentData.email || null,
          password_hash: passwordHash,
          role: "student",
          status: "active",
        })

        if (insertErr) throw insertErr
      }
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to reset password."
    return { success: false, error: msg }
  }
}

/**
 * Update role for a staff user
 */
export async function updateStaffRole(
  userId: string,
  newRole: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin privileges required." }
    }

    const supabase = createSupabaseAdminClient()

    // Check if it is an admin
    const { data: adminRecord } = await supabase
      .from("admins")
      .select("id, role")
      .eq("id", userId)
      .maybeSingle()

    if (adminRecord) {
      if (adminRecord.role === "superadmin") {
        const { data: currentAdmin } = await supabase
          .from("admins")
          .select("role")
          .ilike("email", session.user.email || "")
          .maybeSingle()

        if (currentAdmin?.role !== "superadmin") {
          return { success: false, error: "Only Super Administrators can modify Super Admin roles." }
        }
      }

      const { error } = await supabase
        .from("admins")
        .update({ role: newRole })
        .eq("id", userId)

      if (error) throw error
      revalidatePath("/admin/users")
      return { success: true }
    }

    // Otherwise staff_accounts
    const { data: existingAccount } = await supabase
      .from("staff_accounts")
      .select("id")
      .or(`id.eq.${userId},staff_id.eq.${userId}`)
      .maybeSingle()

    if (existingAccount) {
      const { error } = await supabase
        .from("staff_accounts")
        .update({ role: newRole })
        .eq("id", existingAccount.id)

      if (error) throw error
    } else {
      const { data: staffData } = await supabase
        .from("staffs")
        .select("id, email, type")
        .eq("id", userId)
        .single()

      if (staffData) {
        const defaultPasswordHash = await hash("Wasia@2026", 10)
        await supabase.from("staff_accounts").insert({
          staff_id: staffData.id,
          email: staffData.email || `staff_${staffData.id.slice(0, 8)}@madrasah.local`,
          password_hash: defaultPasswordHash,
          role: newRole,
          status: "active",
          can_login: true,
        })
      }
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update role."
    return { success: false, error: msg }
  }
}
