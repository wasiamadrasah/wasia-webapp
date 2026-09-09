import "server-only"

import { createSupabaseAdminClient } from "@/lib/db"
import {
  defaultIDGenerationSettings,
  type IDGenerationConfig,
  type IDGenerationSettings,
} from "@/lib/id-generation"

type MissingError = { code?: string; message?: string } | null

const isMissingTableOrColumnError = (error: MissingError) => {
  if (!error) return false
  const message = (error.message ?? "").toLowerCase()
  return (
    error.code === "PGRST205" ||
    error.code === "PGRST204" ||
    message.includes("schema cache") ||
    message.includes("does not exist") ||
    message.includes("column")
  )
}

function sanitizeConfig(value: unknown, fallback: IDGenerationConfig): IDGenerationConfig {
  if (typeof value !== "object" || value === null) {
    return fallback
  }

  const obj = value as Record<string, unknown>
  return {
    auto_generation: typeof obj.auto_generation === "boolean" ? obj.auto_generation : fallback.auto_generation,
    prefix: typeof obj.prefix === "string" ? obj.prefix.trim() : fallback.prefix,
    no_of_digits: typeof obj.no_of_digits === "number" && Number.isFinite(obj.no_of_digits)
      ? Math.max(2, Math.min(10, Math.round(obj.no_of_digits)))
      : fallback.no_of_digits,
    start_from: typeof obj.start_from === "number" && Number.isFinite(obj.start_from)
      ? Math.max(1, Math.round(obj.start_from))
      : fallback.start_from,
  }
}

export async function getIDGenerationSettings(): Promise<IDGenerationSettings> {
  const supabase = createSupabaseAdminClient()

  // 1. Try dedicated table first
  const { data: dedicatedData, error: dedicatedError } = await supabase
    .from("id_generation_settings")
    .select("staff_config, student_config")
    .eq("id", "default")
    .maybeSingle()

  if (!dedicatedError && dedicatedData) {
    return {
      staff: sanitizeConfig(dedicatedData.staff_config, defaultIDGenerationSettings.staff),
      student: sanitizeConfig(dedicatedData.student_config, defaultIDGenerationSettings.student),
    }
  }

  // 2. Fallback to institute_settings metadata
  const { data: instData, error: instError } = await supabase
    .from("institute_settings")
    .select("primary_info")
    .eq("id", "default")
    .maybeSingle()

  if (!instError && instData?.primary_info && typeof instData.primary_info === "object") {
    const primary = instData.primary_info as Record<string, unknown>
    if (primary.idGeneration && typeof primary.idGeneration === "object") {
      const idGen = primary.idGeneration as Record<string, unknown>
      return {
        staff: sanitizeConfig(idGen.staff, defaultIDGenerationSettings.staff),
        student: sanitizeConfig(idGen.student, defaultIDGenerationSettings.student),
      }
    }
  }

  return defaultIDGenerationSettings
}

export async function saveIDGenerationSettings(settings: IDGenerationSettings): Promise<void> {
  const supabase = createSupabaseAdminClient()
  const payload = {
    staff: sanitizeConfig(settings.staff, defaultIDGenerationSettings.staff),
    student: sanitizeConfig(settings.student, defaultIDGenerationSettings.student),
  }

  // 1. Try dedicated table
  const { error: dedicatedError } = await supabase
    .from("id_generation_settings")
    .upsert(
      {
        id: "default",
        staff_config: payload.staff,
        student_config: payload.student,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )

  if (!dedicatedError) {
    return
  }

  // 2. Fallback to save inside institute_settings
  const { data: instData } = await supabase
    .from("institute_settings")
    .select("primary_info")
    .eq("id", "default")
    .maybeSingle()

  const currentPrimary = (instData?.primary_info && typeof instData.primary_info === "object")
    ? (instData.primary_info as Record<string, unknown>)
    : {}

  const updatedPrimary = {
    ...currentPrimary,
    idGeneration: payload,
  }

  const { error: fallbackError } = await supabase
    .from("institute_settings")
    .upsert(
      {
        id: "default",
        primary_info: updatedPrimary,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )

  if (fallbackError) {
    throw new Error(fallbackError.message || "Failed to save ID generation settings.")
  }
}

/**
 * Generates the next auto-generated Employee ID
 */
export async function generateNextEmployeeID(): Promise<string | null> {
  const settings = await getIDGenerationSettings().catch(() => defaultIDGenerationSettings)
  const config = settings.staff

  if (!config.auto_generation) {
    return null
  }

  const prefix = (config.prefix || "").trim()

  const supabase = createSupabaseAdminClient()

  // Find existing employee IDs matching prefix
  let query = supabase.from("staffs").select("employee_id").not("employee_id", "is", null)
  if (prefix) {
    query = query.like("employee_id", `${prefix}%`)
  }

  const { data: existingStaffs } = await query

  let highestNum = Math.max(0, config.start_from - 1)

  if (existingStaffs && existingStaffs.length > 0) {
    for (const staff of existingStaffs) {
      if (!staff.employee_id) continue
      const numericPart = prefix
        ? staff.employee_id.replace(prefix, "")
        : staff.employee_id.replace(/\D/g, "")
      const parsed = parseInt(numericPart, 10)
      if (!isNaN(parsed) && parsed > highestNum) {
        highestNum = parsed
      }
    }
  }

  const nextNum = highestNum + 1
  const padded = String(nextNum).padStart(config.no_of_digits, "0")

  return `${prefix}${padded}`
}
