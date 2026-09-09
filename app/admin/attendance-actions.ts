"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createSupabaseAdminClient } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type AttendanceRecordInput = {
  staff_id: string
  date: string
  status: "present" | "absent" | "leave"
  in_time?: string | null
  out_time?: string | null
  is_late: boolean
  is_early_exit: boolean
  remark?: string | null
  shift_id?: string | null
}

export type SettingsInput = {
  in_sms_enabled: boolean
  out_sms_enabled: boolean
}

// Helper to check authentication
async function checkAuth() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized. Administrative privileges required.")
  }
  return session
}

export async function getStaffsForAttendance(dateStr: string) {
  try {
    await checkAuth()
    const supabase = createSupabaseAdminClient()

    // 1. Fetch active staffs
    const { data: staffs, error: staffsError } = await supabase
      .from("staffs")
      .select("id, employee_id, full_name_en, contact_number, designation, profile_photo, type")
      .order("employee_id", { ascending: true })

    if (staffsError) {
      throw new Error(`Failed to fetch staff list: ${staffsError.message}`)
    }

    // 2. Fetch attendance for this specific date
    const { data: attendance, error: attendanceError } = await supabase
      .from("employee_attendance")
      .select("id, staff_id, date, status, in_time, out_time, is_late, is_early_exit, remark, shift_id, action_at")
      .eq("date", dateStr)

    if (attendanceError) {
      throw new Error(`Failed to fetch attendance records: ${attendanceError.message}`)
    }

    const attendanceMap = new Map<string, any>()
    attendance?.forEach((record) => {
      attendanceMap.set(record.staff_id, record)
    })

    // Combine staff data with attendance status
    const combined = staffs.map((staff) => {
      const record = attendanceMap.get(staff.id)
      return {
        staff_id: staff.id,
        employee_id: staff.employee_id || "N/A",
        full_name_en: staff.full_name_en || "Unnamed",
        contact_number: staff.contact_number || "N/A",
        designation: staff.designation || "N/A",
        profile_photo: staff.profile_photo || null,
        type: staff.type || "staff",
        attendance_id: record?.id || null,
        status: (record?.status || "absent") as "present" | "absent" | "leave",
        in_time: record?.in_time || "",
        out_time: record?.out_time || "",
        is_late: record?.is_late || false,
        is_early_exit: record?.is_early_exit || false,
        remark: record?.remark || "",
        shift_id: record?.shift_id || null,
        action_at: record?.action_at || null,
      }
    })

    return { success: true, data: combined }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("getStaffsForAttendance error:", error)
    return { success: false, message }
  }
}

export async function saveOrUpdateAttendance(records: AttendanceRecordInput[]) {
  try {
    await checkAuth()
    const supabase = createSupabaseAdminClient()

    if (records.length === 0) {
      return { success: true, message: "No records to save." }
    }

    // Format records for database structure
    const upsertData = records.map((rec) => ({
      staff_id: rec.staff_id,
      date: rec.date,
      status: rec.status,
      in_time: rec.in_time ? rec.in_time : null,
      out_time: rec.out_time ? rec.out_time : null,
      is_late: rec.is_late,
      is_early_exit: rec.is_early_exit,
      remark: rec.remark ? rec.remark.trim() : null,
      shift_id: rec.shift_id ? rec.shift_id : null,
      action_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from("employee_attendance")
      .upsert(upsertData, { onConflict: "staff_id,date" })

    if (error) {
      throw new Error(`Database upsert error: ${error.message}`)
    }

    revalidatePath("/admin/employee-attendance")
    return { success: true, message: "Attendance logs saved successfully." }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("saveOrUpdateAttendance error:", error)
    return { success: false, message }
  }
}

export async function getAttendanceSettings() {
  try {
    await checkAuth()
    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase
      .from("employee_attendance_settings")
      .select("in_sms_enabled, out_sms_enabled")
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to fetch settings: ${error.message}`)
    }

    const settings = data || { in_sms_enabled: false, out_sms_enabled: false }
    return { success: true, data: settings }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("getAttendanceSettings error:", error)
    return { success: false, message }
  }
}

export async function updateAttendanceSettings(settings: SettingsInput) {
  try {
    await checkAuth()
    const supabase = createSupabaseAdminClient()

    // Query if settings row exists
    const { data: existingRow } = await supabase
      .from("employee_attendance_settings")
      .select("id")
      .limit(1)
      .maybeSingle()

    let error: any
    if (existingRow?.id) {
      const { error: updateError } = await supabase
        .from("employee_attendance_settings")
        .update({
          in_sms_enabled: settings.in_sms_enabled,
          out_sms_enabled: settings.out_sms_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingRow.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from("employee_attendance_settings")
        .insert([
          {
            in_sms_enabled: settings.in_sms_enabled,
            out_sms_enabled: settings.out_sms_enabled,
            updated_at: new Date().toISOString(),
          },
        ])
      error = insertError
    }

    if (error) {
      throw new Error(`Failed to update settings: ${error.message}`)
    }

    return { success: true, message: "Settings updated successfully." }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("updateAttendanceSettings error:", error)
    return { success: false, message }
  }
}

export async function getDailyAttendanceReport(dateStr: string, shiftId?: string, employeeId?: string) {
  try {
    await checkAuth()
    const supabase = createSupabaseAdminClient()

    let query = supabase
      .from("employee_attendance")
      .select(`
        id,
        date,
        status,
        in_time,
        out_time,
        is_late,
        is_early_exit,
        remark,
        action_at,
        staffs (
          id,
          employee_id,
          full_name_en,
          designation,
          contact_number,
          type
        )
      `)
      .eq("date", dateStr)

    if (shiftId && shiftId !== "all") {
      query = query.eq("shift_id", shiftId)
    }

    if (employeeId && employeeId.trim() !== "") {
      query = query.eq("staff_id", employeeId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Report query error: ${error.message}`)
    }

    // Map raw query results into a structured format
    const records = (data || []).map((row: any) => ({
      attendance_id: row.id,
      date: row.date,
      status: row.status,
      in_time: row.in_time || "-",
      out_time: row.out_time || "-",
      is_late: row.is_late,
      is_early_exit: row.is_early_exit,
      remark: row.remark || "",
      action_at: row.action_at,
      employee_id: row.staffs?.employee_id || "N/A",
      full_name_en: row.staffs?.full_name_en || "Unnamed",
      designation: row.staffs?.designation || "N/A",
      contact_number: row.staffs?.contact_number || "N/A",
      type: row.staffs?.type || "staff",
    }))

    return { success: true, data: records }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("getDailyAttendanceReport error:", error)
    return { success: false, message }
  }
}

export async function getMonthlyAttendanceReport(
  startDateStr: string,
  endDateStr: string,
  reportType: string,
  category: string,
  shiftId?: string,
  employeeId?: string
) {
  try {
    await checkAuth()
    const supabase = createSupabaseAdminClient()

    // 1. Fetch staffs matching category filter
    let staffQuery = supabase.from("staffs").select("id, employee_id, full_name_en, designation, type")

    if (category === "teacher") {
      staffQuery = staffQuery.eq("type", "teacher")
    } else if (category === "staff") {
      staffQuery = staffQuery.eq("type", "staff")
    }

    if (employeeId && employeeId.trim() !== "") {
      staffQuery = staffQuery.eq("id", employeeId)
    }

    const { data: staffs, error: staffError } = await staffQuery

    if (staffError) {
      throw new Error(`Failed to fetch staffs for report: ${staffError.message}`)
    }

    const staffIds = staffs.map((s) => s.id)
    if (staffIds.length === 0) {
      return { success: true, data: [] }
    }

    // 2. Fetch all attendance logs in the date range for these staff IDs
    let attQuery = supabase
      .from("employee_attendance")
      .select("id, staff_id, date, status, is_late, is_early_exit")
      .in("staff_id", staffIds)
      .gte("date", startDateStr)
      .lte("date", endDateStr)

    if (shiftId && shiftId !== "all") {
      attQuery = attQuery.eq("shift_id", shiftId)
    }

    const { data: logs, error: logsError } = await attQuery

    if (logsError) {
      throw new Error(`Failed to fetch attendance logs: ${logsError.message}`)
    }

    const logsByStaffMap = new Map<string, any[]>()
    logs?.forEach((log) => {
      const staffLogs = logsByStaffMap.get(log.staff_id) || []
      staffLogs.push(log)
      logsByStaffMap.set(log.staff_id, staffLogs)
    })

    // 3. Compile report data depending on report type
    const reportData = staffs.map((staff) => {
      const staffLogs = logsByStaffMap.get(staff.id) || []
      const presentCount = staffLogs.filter((l) => l.status === "present").length
      const absentCount = staffLogs.filter((l) => l.status === "absent").length
      const leaveCount = staffLogs.filter((l) => l.status === "leave").length
      const lateCount = staffLogs.filter((l) => l.status === "present" && l.is_late).length
      const earlyExitCount = staffLogs.filter((l) => l.status === "present" && l.is_early_exit).length
      const totalDays = staffLogs.length

      return {
        id: staff.id,
        employee_id: staff.employee_id || "N/A",
        full_name_en: staff.full_name_en || "Unnamed",
        designation: staff.designation || "N/A",
        type: staff.type || "staff",
        present_count: presentCount,
        absent_count: absentCount,
        leave_count: leaveCount,
        late_count: lateCount,
        early_exit_count: earlyExitCount,
        total_days: totalDays,
        raw_logs: reportType === "details" ? staffLogs : [],
      }
    })

    return { success: true, data: reportData }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("getMonthlyAttendanceReport error:", error)
    return { success: false, message }
  }
}
