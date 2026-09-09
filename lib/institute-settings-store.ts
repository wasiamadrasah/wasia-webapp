import "server-only"

import { createSupabaseAdminClient } from "@/lib/db"
import {
  defaultInstituteSettings,
  type ContactInfo,
  type InstituteSettings,
  type PrimaryInfo,
  type SocialInfo,
} from "@/lib/institute-settings"

type MissingError = { code?: string; message?: string } | null

const isMissingTableError = (error: MissingError) => {
  if (!error) return false

  const message = (error.message ?? "").toLowerCase()
  return (
    error.code === "PGRST205" ||
    message.includes("schema cache") ||
    (message.includes("relation") && message.includes("does not exist"))
  )
}

function asObject(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return {}
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined
}

function asMedium(value: unknown): PrimaryInfo["medium"] {
  if (value === "Bangla" || value === "English" || value === "Both") {
    return value
  }

  return defaultInstituteSettings.primary.medium
}

function asInstituteType(value: unknown): PrimaryInfo["instituteType"] {
  if (value === "School" || value === "College" || value === "School & College") {
    return value
  }

  return undefined
}

function toPrimaryInfo(value: unknown): PrimaryInfo {
  const source = asObject(value)

  return {
    instituteName: asString(source.instituteName) ?? defaultInstituteSettings.primary.instituteName,
    instituteNameBn: asString(source.instituteNameBn),
    shortForm: asString(source.shortForm),
    motto: asString(source.motto),
    medium: asMedium(source.medium),
    establishYear: asNumber(source.establishYear),
    eiin: asString(source.eiin),
    mpoCode: asString(source.mpoCode),
    instituteCode: asString(source.instituteCode),
    instituteType: asInstituteType(source.instituteType),
    board: asString(source.board),
    affiliation: asString(source.affiliation),
    logo: asString(source.logo),
    favicon: asString(source.favicon),
  }
}

function toContactInfo(value: unknown): ContactInfo {
  const source = asObject(value)

  return {
    telephone: asString(source.telephone),
    mobile: asString(source.mobile),
    fax: asString(source.fax),
    officeHours: asString(source.officeHours),
    website: asString(source.website),
    email: asString(source.email),
    address: asString(source.address),
    googleMapEmbed: asString(source.googleMapEmbed),
  }
}

function toSocialInfo(value: unknown): SocialInfo {
  const source = asObject(value)

  return {
    facebook: asString(source.facebook),
    twitter: asString(source.twitter),
    linkedin: asString(source.linkedin),
    instagram: asString(source.instagram),
    youtube: asString(source.youtube),
    whatsapp: asString(source.whatsapp),
    tiktok: asString(source.tiktok),
    telegram: asString(source.telegram),
  }
}

export function normalizeInstituteSettings(value: Partial<InstituteSettings> | null | undefined): InstituteSettings {
  const source = value ?? {}

  return {
    primary: toPrimaryInfo(source.primary),
    contact: toContactInfo(source.contact),
    social: toSocialInfo(source.social),
  }
}

export async function getInstituteSettings() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("institute_settings")
    .select("primary_info, contact_info, social_info")
    .eq("id", "default")
    .maybeSingle()

  if (isMissingTableError(error)) {
    return defaultInstituteSettings
  }

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    return defaultInstituteSettings
  }

  return normalizeInstituteSettings({
    primary: data.primary_info as PrimaryInfo,
    contact: data.contact_info as ContactInfo,
    social: data.social_info as SocialInfo,
  })
}

export async function saveInstituteSettings(settings: InstituteSettings) {
  const normalized = normalizeInstituteSettings(settings)
  const supabase = createSupabaseAdminClient()

  const { error } = await supabase
    .from("institute_settings")
    .upsert(
      {
        id: "default",
        primary_info: normalized.primary,
        contact_info: normalized.contact,
        social_info: normalized.social,
      },
      { onConflict: "id" }
    )

  if (error) {
    throw new Error(error.message)
  }
}
