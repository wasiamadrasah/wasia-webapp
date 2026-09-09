"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { getInstituteSettings, saveInstituteSettings } from "@/lib/institute-settings-store"
import { uploadImage } from "@/lib/r2"
import type { InstituteSettings, PrimaryInfo } from "@/lib/institute-settings"

export type SaveInstituteSettingsActionResult = {
  status: "success" | "error"
  message: string
}

function text(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key)
  return value.length > 0 ? value : undefined
}

function getImageFile(formData: FormData, key: string) {
  const value = formData.get(key)
  if (value instanceof File && value.size > 0) {
    return value
  }

  return null
}

async function uploadInstituteBrandingImage(file: File, type: "logo" | "favicon") {
  await requireAdminSession()
  const result = await uploadImage(file, `institute/branding/${type}`)

  if (!result.success || !result.url) {
    throw new Error(result.error || `Failed to upload ${type}.`)
  }

  return result.url
}

function toNumber(value: string | undefined) {
  if (!value) return undefined

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function toMedium(value: string): PrimaryInfo["medium"] {
  if (value === "Bangla" || value === "English" || value === "Both") {
    return value
  }

  return "Both"
}

function toInstituteType(value: string): PrimaryInfo["instituteType"] {
  if (value === "School" || value === "College" || value === "School & College") {
    return value
  }

  return undefined
}

type EditableTab = "primary" | "contact" | "social"

async function requireAdminSession() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== "admin") {
    redirect("/admin/login")
  }
}

function toEditableTab(value: string): EditableTab {
  if (value === "primary" || value === "contact" || value === "social") {
    return value
  }

  return "primary"
}

export async function saveInstituteSettingsAction(formData: FormData) {
  try {
    await requireAdminSession()

    const editingTab = toEditableTab(text(formData, "editingTab"))
    const current = await getInstituteSettings()
    const payload: InstituteSettings = {
      primary: { ...current.primary },
      contact: { ...current.contact },
      social: { ...current.social },
    }

    if (editingTab === "primary") {
      const instituteName = text(formData, "instituteName")
      const medium = toMedium(text(formData, "medium"))
      const currentLogo = optionalText(formData, "logo_current") ?? current.primary.logo
      const currentFavicon = optionalText(formData, "favicon_current") ?? current.primary.favicon
      const logoFile = getImageFile(formData, "logo_file")
      const faviconFile = getImageFile(formData, "favicon_file")
      const uploadedLogo = logoFile ? await uploadInstituteBrandingImage(logoFile, "logo") : undefined
      const uploadedFavicon = faviconFile ? await uploadInstituteBrandingImage(faviconFile, "favicon") : undefined

      if (!instituteName) {
        throw new Error("Institute name is required.")
      }

      payload.primary = {
        instituteName,
        instituteNameBn: optionalText(formData, "instituteNameBn"),
        shortForm: optionalText(formData, "shortForm"),
        motto: optionalText(formData, "motto"),
        medium,
        establishYear: toNumber(optionalText(formData, "establishYear")),
        eiin: optionalText(formData, "eiin"),
        mpoCode: optionalText(formData, "mpoCode"),
        instituteCode: optionalText(formData, "instituteCode"),
        instituteType: toInstituteType(text(formData, "instituteType")),
        board: optionalText(formData, "board"),
        affiliation: optionalText(formData, "affiliation"),
        logo: uploadedLogo ?? currentLogo,
        favicon: uploadedFavicon ?? currentFavicon,
      }
    }

    if (editingTab === "contact") {
      payload.contact = {
        telephone: optionalText(formData, "telephone"),
        mobile: optionalText(formData, "mobile"),
        fax: optionalText(formData, "fax"),
        officeHours: optionalText(formData, "officeHours"),
        website: optionalText(formData, "website"),
        email: optionalText(formData, "email"),
        address: optionalText(formData, "address"),
        googleMapEmbed: optionalText(formData, "googleMapEmbed"),
      }
    }

    if (editingTab === "social") {
      payload.social = {
        facebook: optionalText(formData, "facebook"),
        twitter: optionalText(formData, "twitter"),
        linkedin: optionalText(formData, "linkedin"),
        instagram: optionalText(formData, "instagram"),
        youtube: optionalText(formData, "youtube"),
        whatsapp: optionalText(formData, "whatsapp"),
        tiktok: optionalText(formData, "tiktok"),
        telegram: optionalText(formData, "telegram"),
      }
    }

    await saveInstituteSettings(payload)
    revalidatePath("/admin/iconfig")
    return { status: "success", message: "Institute settings saved." } satisfies SaveInstituteSettingsActionResult
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save institute settings."
    return { status: "error", message } satisfies SaveInstituteSettingsActionResult
  }
}
