"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { createSupabaseAdminClient } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { uploadImage } from "@/lib/r2"

function isRedirectError(error: unknown) {
  return error instanceof Error && error.message.includes("NEXT_REDIRECT")
}

async function requireAdminSession() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== "admin") {
    redirect("/admin/login")
  }
}

async function getAdminSupabaseClient() {
  await requireAdminSession()
  return createSupabaseAdminClient()
}

function redirectWithMessage(status: "success" | "error", message: string) {
  const params = new URLSearchParams({ tab: "hero", status, message })
  redirect(`/admin/web-config/homepage?${params.toString()}`)
}

function redirectWithTabMessage(tab: string, status: "success" | "error", message: string) {
  const params = new URLSearchParams({ tab, status, message })
  redirect(`/admin/web-config/homepage?${params.toString()}`)
}

function toText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : ""
}

function getHeroImageFile(value: FormDataEntryValue | null) {
  if (value instanceof File && value.size > 0) {
    return value
  }

  return null
}

async function uploadHeroImage(file: File) {
  await requireAdminSession()
  const result = await uploadImage(file, "homepage/hero")

  if (!result.success || !result.url) {
    throw new Error(result.error || "Failed to upload hero image to R2.")
  }

  return result.url
}

async function uploadLeadershipImage(file: File) {
  await requireAdminSession()
  const result = await uploadImage(file, "homepage/leadership")

  if (!result.success || !result.url) {
    throw new Error(result.error || "Failed to upload leadership photo to R2.")
  }

  return result.url
}

function normalizeText(value: FormDataEntryValue | null, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback
}

function normalizeIconKey(value: FormDataEntryValue | null) {
  const iconKey = normalizeText(value, "sparkles").toLowerCase()
  const allowedIcons = new Set(["book-open", "award", "calendar", "heart", "graduation-cap", "sparkles", "users", "zap"])
  return allowedIcons.has(iconKey) ? iconKey : "sparkles"
}

export async function createHomepageHeroSlideAction(formData: FormData) {
  try {
    const title = toText(formData.get("title"))
    const displayOrderRaw = toText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0
    const imageFile = getHeroImageFile(formData.get("image_file"))

    if (!title) throw new Error("Hero title is required.")

    if (!imageFile) {
      throw new Error("Hero image is required.")
    }

    const imageUrl = await uploadHeroImage(imageFile)

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("homepage_hero_slides").insert({
      title,
      image_url: imageUrl,
      display_order: displayOrder,
      is_active: true,
    })

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithMessage("success", "Hero slide added.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to add hero slide."
    redirectWithMessage("error", message)
  }
}

export async function updateHomepageHeroSlideAction(formData: FormData) {
  try {
    const id = toText(formData.get("id"))
    const title = toText(formData.get("title"))
    const displayOrderRaw = toText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0
    const imageFile = getHeroImageFile(formData.get("image_file"))

    if (!id) throw new Error("Hero slide id is required.")
    if (!title) throw new Error("Hero title is required.")

    const imageUrl = imageFile ? await uploadHeroImage(imageFile) : toText(formData.get("image_url"))

    if (!imageUrl) throw new Error("Hero image is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_hero_slides")
      .update({
        title,
        image_url: imageUrl,
        display_order: displayOrder,
      })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithMessage("success", "Hero slide updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update hero slide."
    redirectWithMessage("error", message)
  }
}

export async function setHomepageHeroSlideStatusAction(formData: FormData) {
  try {
    const id = toText(formData.get("id"))
    const statusRaw = toText(formData.get("status")).toLowerCase()
    const isActive = statusRaw !== "archived"

    if (!id) throw new Error("Hero slide id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_hero_slides")
      .update({ is_active: isActive })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithMessage("success", "Hero slide status updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update hero slide status."
    redirectWithMessage("error", message)
  }
}

export async function deleteHomepageHeroSlideAction(formData: FormData) {
  try {
    const id = toText(formData.get("id"))
    if (!id) throw new Error("Hero slide id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("homepage_hero_slides").delete().eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithMessage("success", "Hero slide deleted.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to delete hero slide."
    redirectWithMessage("error", message)
  }
}

export async function createHomepageQuickInfoItemAction(formData: FormData) {
  try {
    const title = normalizeText(formData.get("title"))
    const subtitle = normalizeText(formData.get("subtitle"))
    const iconKey = normalizeIconKey(formData.get("icon_key"))
    const linkUrl = normalizeText(formData.get("link_url")) || null
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0

    if (!title) throw new Error("Quick info title is required.")
    if (!subtitle) throw new Error("Quick info subtitle is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("homepage_quick_info_items").insert({
      title,
      subtitle,
      icon_key: iconKey,
      link_url: linkUrl,
      display_order: displayOrder,
      is_active: true,
    })

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithMessage("success", "Quick info item added.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to add quick info item."
    redirectWithMessage("error", message)
  }
}

export async function updateHomepageQuickInfoItemAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const title = normalizeText(formData.get("title"))
    const subtitle = normalizeText(formData.get("subtitle"))
    const iconKey = normalizeIconKey(formData.get("icon_key"))
    const linkUrl = normalizeText(formData.get("link_url")) || null
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0

    if (!id) throw new Error("Quick info item id is required.")
    if (!title) throw new Error("Quick info title is required.")
    if (!subtitle) throw new Error("Quick info subtitle is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_quick_info_items")
      .update({ title, subtitle, icon_key: iconKey, link_url: linkUrl, display_order: displayOrder })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithMessage("success", "Quick info item updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update quick info item."
    redirectWithMessage("error", message)
  }
}

export async function setHomepageQuickInfoItemStatusAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const statusRaw = normalizeText(formData.get("status")).toLowerCase()
    const isActive = statusRaw !== "archived"

    if (!id) throw new Error("Quick info item id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_quick_info_items")
      .update({ is_active: isActive })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithMessage("success", "Quick info item status updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update quick info item status."
    redirectWithMessage("error", message)
  }
}

export async function deleteHomepageQuickInfoItemAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    if (!id) throw new Error("Quick info item id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("homepage_quick_info_items").delete().eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithMessage("success", "Quick info item deleted.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to delete quick info item."
    redirectWithMessage("error", message)
  }
}

export async function updateHomepageLeadershipCardAction(formData: FormData) {
  try {
    const roleSlug = normalizeText(formData.get("role_slug"))
    const staffId = normalizeText(formData.get("staff_id")) || null
    const roleTitle = normalizeText(formData.get("role_title"))
    const leaderName = normalizeText(formData.get("leader_name")) || null
    const leaderMessage = normalizeText(formData.get("leader_message")) || null
    const leaderPhotoFile = getHeroImageFile(formData.get("leader_photo_file"))
    const leaderPhotoUrl = normalizeText(formData.get("leader_photo_url")) || null
    const subtitle = normalizeText(formData.get("subtitle")) || null
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0

    if (!roleSlug) throw new Error("Leadership role slug is required.")
    if (!roleTitle) throw new Error("Leadership role title is required.")

    const uploadedPhotoUrl = leaderPhotoFile ? await uploadLeadershipImage(leaderPhotoFile) : null
    const resolvedLeaderPhotoUrl = uploadedPhotoUrl ?? leaderPhotoUrl ?? null

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_leadership_cards")
      .upsert(
        {
          role_slug: roleSlug,
          role_title: roleTitle,
          staff_id: staffId,
          leader_name: leaderName,
          leader_photo_url: resolvedLeaderPhotoUrl,
          leader_message: leaderMessage,
          subtitle,
          display_order: displayOrder,
          is_active: true,
        },
        { onConflict: "role_slug" }
      )

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    revalidatePath(`/leadership/${roleSlug}`)
    redirectWithTabMessage("leadership", "success", "Leadership card updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update leadership card."
    redirectWithTabMessage("leadership", "error", message)
  }
}

export async function setHomepageLeadershipCardStatusAction(formData: FormData) {
  try {
    const roleSlug = normalizeText(formData.get("role_slug"))
    const statusRaw = normalizeText(formData.get("status")).toLowerCase()
    const isActive = statusRaw !== "archived"

    if (!roleSlug) throw new Error("Leadership role slug is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_leadership_cards")
      .update({ is_active: isActive })
      .eq("role_slug", roleSlug)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    revalidatePath(`/leadership/${roleSlug}`)
    redirectWithTabMessage("leadership", "success", "Leadership card status updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update leadership card status."
    redirectWithTabMessage("leadership", "error", message)
  }
}

export async function deleteHomepageLeadershipCardAction(formData: FormData) {
  try {
    const roleSlug = normalizeText(formData.get("role_slug"))

    if (!roleSlug) throw new Error("Leadership role slug is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("homepage_leadership_cards").delete().eq("role_slug", roleSlug)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    revalidatePath(`/leadership/${roleSlug}`)
    redirectWithTabMessage("leadership", "success", "Leadership card deleted.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to delete leadership card."
    redirectWithTabMessage("leadership", "error", message)
  }
}

// ══════════════════════════════════════════════════════════════
// ACADEMIC PROGRAMS SECTION
// ══════════════════════════════════════════════════════════════

export async function createAcademicProgramAction(formData: FormData) {
  try {
    const programName = normalizeText(formData.get("program_name"))
    const programSlug = normalizeText(formData.get("program_slug")).toLowerCase().replace(/\s+/g, "-")
    const description = normalizeText(formData.get("description")) || null
    const iconKey = normalizeIconKey(formData.get("icon_key"))
    const linkUrl = normalizeText(formData.get("link_url")) || null
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0

    if (!programName) throw new Error("Program name is required.")
    if (!programSlug) throw new Error("Program slug is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("homepage_academic_programs").insert({
      program_name: programName,
      program_slug: programSlug,
      description,
      icon_key: iconKey,
      link_url: linkUrl,
      display_order: displayOrder,
      is_active: true,
    })

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("programs", "success", "Academic program added.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to add academic program."
    redirectWithTabMessage("programs", "error", message)
  }
}

export async function updateAcademicProgramAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const programName = normalizeText(formData.get("program_name"))
    const description = normalizeText(formData.get("description")) || null
    const iconKey = normalizeIconKey(formData.get("icon_key"))
    const linkUrl = normalizeText(formData.get("link_url")) || null
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0

    if (!id) throw new Error("Program id is required.")
    if (!programName) throw new Error("Program name is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_academic_programs")
      .update({ program_name: programName, description, icon_key: iconKey, link_url: linkUrl, display_order: displayOrder })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("programs", "success", "Academic program updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update academic program."
    redirectWithTabMessage("programs", "error", message)
  }
}

export async function setAcademicProgramStatusAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const statusRaw = normalizeText(formData.get("status")).toLowerCase()
    const isActive = statusRaw !== "archived"

    if (!id) throw new Error("Program id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_academic_programs")
      .update({ is_active: isActive })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("programs", "success", "Academic program status updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update academic program status."
    redirectWithTabMessage("programs", "error", message)
  }
}

export async function deleteAcademicProgramAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    if (!id) throw new Error("Program id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("homepage_academic_programs").delete().eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("programs", "success", "Academic program deleted.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to delete academic program."
    redirectWithTabMessage("programs", "error", message)
  }
}

// ══════════════════════════════════════════════════════════════
// STATS SECTION
// ══════════════════════════════════════════════════════════════

export async function createStatAction(formData: FormData) {
  try {
    const statLabel = normalizeText(formData.get("stat_label"))
    const statSlug = normalizeText(formData.get("stat_slug")).toLowerCase().replace(/\s+/g, "-")
    const statValueRaw = normalizeText(formData.get("stat_value"))
    const statValue = Number.isFinite(Number(statValueRaw)) ? Number(statValueRaw) : 0
    const statSuffix = normalizeText(formData.get("stat_suffix"))
    const description = normalizeText(formData.get("description")) || null
    const iconKey = normalizeIconKey(formData.get("icon_key"))
    const colorScheme = normalizeText(formData.get("color_scheme"), "emerald")
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0

    if (!statLabel) throw new Error("Stat label is required.")
    if (!statSlug) throw new Error("Stat slug is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("homepage_stats").insert({
      stat_label: statLabel,
      stat_slug: statSlug,
      stat_value: statValue,
      stat_suffix: statSuffix,
      description,
      icon_key: iconKey,
      color_scheme: colorScheme,
      display_order: displayOrder,
      is_active: true,
    })

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("stats", "success", "Stat added.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to add stat."
    redirectWithTabMessage("stats", "error", message)
  }
}

export async function updateStatAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const statLabel = normalizeText(formData.get("stat_label"))
    const statValueRaw = normalizeText(formData.get("stat_value"))
    const statValue = Number.isFinite(Number(statValueRaw)) ? Number(statValueRaw) : 0
    const statSuffix = normalizeText(formData.get("stat_suffix"))
    const description = normalizeText(formData.get("description")) || null
    const iconKey = normalizeIconKey(formData.get("icon_key"))
    const colorScheme = normalizeText(formData.get("color_scheme"), "emerald")
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0

    if (!id) throw new Error("Stat id is required.")
    if (!statLabel) throw new Error("Stat label is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_stats")
      .update({
        stat_label: statLabel,
        stat_value: statValue,
        stat_suffix: statSuffix,
        description,
        icon_key: iconKey,
        color_scheme: colorScheme,
        display_order: displayOrder,
      })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("stats", "success", "Stat updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update stat."
    redirectWithTabMessage("stats", "error", message)
  }
}

export async function setStatStatusAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const statusRaw = normalizeText(formData.get("status")).toLowerCase()
    const isActive = statusRaw !== "archived"

    if (!id) throw new Error("Stat id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_stats")
      .update({ is_active: isActive })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("stats", "success", "Stat status updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update stat status."
    redirectWithTabMessage("stats", "error", message)
  }
}

export async function deleteStatAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    if (!id) throw new Error("Stat id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("homepage_stats").delete().eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("stats", "success", "Stat deleted.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to delete stat."
    redirectWithTabMessage("stats", "error", message)
  }
}

// ══════════════════════════════════════════════════════════════
// FOOTER LINKS SECTION
// ══════════════════════════════════════════════════════════════

export async function createFooterLinkSectionAction(formData: FormData) {
  try {
    const sectionName = normalizeText(formData.get("section_name"))
    const sectionSlug = normalizeText(formData.get("section_slug")).toLowerCase().replace(/\s+/g, "-")
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0

    if (!sectionName) throw new Error("Section name is required.")
    if (!sectionSlug) throw new Error("Section slug is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("footer_link_sections").insert({
      section_name: sectionName,
      section_slug: sectionSlug,
      display_order: displayOrder,
      is_active: true,
    })

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("footer", "success", "Footer section added.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to add footer section."
    redirectWithTabMessage("footer", "error", message)
  }
}

export async function updateFooterLinkSectionAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const sectionName = normalizeText(formData.get("section_name"))
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0

    if (!id) throw new Error("Section id is required.")
    if (!sectionName) throw new Error("Section name is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("footer_link_sections")
      .update({ section_name: sectionName, display_order: displayOrder })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("footer", "success", "Footer section updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update footer section."
    redirectWithTabMessage("footer", "error", message)
  }
}

export async function setFooterLinkSectionStatusAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const statusRaw = normalizeText(formData.get("status")).toLowerCase()
    const isActive = statusRaw !== "archived"

    if (!id) throw new Error("Section id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("footer_link_sections")
      .update({ is_active: isActive })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("footer", "success", "Footer section status updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update footer section status."
    redirectWithTabMessage("footer", "error", message)
  }
}

export async function deleteFooterLinkSectionAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    if (!id) throw new Error("Section id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("footer_link_sections").delete().eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("footer", "success", "Footer section deleted.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to delete footer section."
    redirectWithTabMessage("footer", "error", message)
  }
}

export async function createFooterLinkAction(formData: FormData) {
  try {
    const sectionId = normalizeText(formData.get("section_id"))
    const linkLabel = normalizeText(formData.get("link_label"))
    const linkUrl = normalizeText(formData.get("link_url"))
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0

    if (!sectionId) throw new Error("Section id is required.")
    if (!linkLabel) throw new Error("Link label is required.")
    if (!linkUrl) throw new Error("Link URL is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("footer_links").insert({
      section_id: sectionId,
      link_label: linkLabel,
      link_url: linkUrl,
      display_order: displayOrder,
      is_active: true,
    })

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("footer", "success", "Footer link added.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to add footer link."
    redirectWithTabMessage("footer", "error", message)
  }
}

export async function updateFooterLinkAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const linkLabel = normalizeText(formData.get("link_label"))
    const linkUrl = normalizeText(formData.get("link_url"))
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0

    if (!id) throw new Error("Link id is required.")
    if (!linkLabel) throw new Error("Link label is required.")
    if (!linkUrl) throw new Error("Link URL is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("footer_links")
      .update({ link_label: linkLabel, link_url: linkUrl, display_order: displayOrder })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("footer", "success", "Footer link updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update footer link."
    redirectWithTabMessage("footer", "error", message)
  }
}

export async function setFooterLinkStatusAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const statusRaw = normalizeText(formData.get("status")).toLowerCase()
    const isActive = statusRaw !== "archived"

    if (!id) throw new Error("Link id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("footer_links")
      .update({ is_active: isActive })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("footer", "success", "Footer link status updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update footer link status."
    redirectWithTabMessage("footer", "error", message)
  }
}

export async function deleteFooterLinkAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    if (!id) throw new Error("Link id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("footer_links").delete().eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("footer", "success", "Footer link deleted.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to delete footer link."
    redirectWithTabMessage("footer", "error", message)
  }
}

// ══════════════════════════════════════════════════════════════
// EXTRACURRICULARS SECTION
// ══════════════════════════════════════════════════════════════

function normalizeExtracurricularIconKey(value: FormDataEntryValue | null) {
  const iconKey = normalizeText(value, "sparkles").toLowerCase()
  const allowedIcons = new Set(["compass", "trophy", "award", "message-square", "languages", "heart", "sparkles"])
  return allowedIcons.has(iconKey) ? iconKey : "sparkles"
}

async function uploadExtracurricularLogo(file: File) {
  await requireAdminSession()
  const result = await uploadImage(file, "homepage/extracurriculars")

  if (!result.success || !result.url) {
    throw new Error(result.error || "Failed to upload extracurricular logo to R2.")
  }

  return result.url
}

export async function createHomepageExtracurricularAction(formData: FormData) {
  try {
    const name = normalizeText(formData.get("name"))
    const slug = normalizeText(formData.get("slug")).toLowerCase().replace(/\s+/g, "-")
    const description = normalizeText(formData.get("description")) || null
    const iconKey = normalizeExtracurricularIconKey(formData.get("icon_key"))
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0
    const logoFile = getHeroImageFile(formData.get("logo_file"))

    if (!name) throw new Error("Extracurricular name is required.")
    if (!slug) throw new Error("Extracurricular slug is required.")

    const logoUrl = logoFile ? await uploadExtracurricularLogo(logoFile) : null

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("homepage_extracurriculars").insert({
      name,
      slug,
      description,
      icon_key: iconKey,
      logo_url: logoUrl,
      display_order: displayOrder,
      is_active: true,
    })

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("extracurriculars", "success", "Extracurricular club added.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to add extracurricular club."
    redirectWithTabMessage("extracurriculars", "error", message)
  }
}

export async function updateHomepageExtracurricularAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const name = normalizeText(formData.get("name"))
    const description = normalizeText(formData.get("description")) || null
    const iconKey = normalizeExtracurricularIconKey(formData.get("icon_key"))
    const displayOrderRaw = normalizeText(formData.get("display_order"))
    const displayOrder = Number.isFinite(Number(displayOrderRaw)) ? Number(displayOrderRaw) : 0
    const logoFile = getHeroImageFile(formData.get("logo_file"))
    const existingLogoUrl = normalizeText(formData.get("existing_logo_url")) || null

    if (!id) throw new Error("Extracurricular id is required.")
    if (!name) throw new Error("Extracurricular name is required.")

    const logoUrl = logoFile ? await uploadExtracurricularLogo(logoFile) : existingLogoUrl

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_extracurriculars")
      .update({
        name,
        description,
        icon_key: iconKey,
        logo_url: logoUrl,
        display_order: displayOrder,
      })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("extracurriculars", "success", "Extracurricular club updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update extracurricular club."
    redirectWithTabMessage("extracurriculars", "error", message)
  }
}

export async function setHomepageExtracurricularStatusAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    const statusRaw = normalizeText(formData.get("status")).toLowerCase()
    const isActive = statusRaw !== "archived"

    if (!id) throw new Error("Extracurricular id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("homepage_extracurriculars")
      .update({ is_active: isActive })
      .eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("extracurriculars", "success", "Extracurricular status updated.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to update status."
    redirectWithTabMessage("extracurriculars", "error", message)
  }
}

export async function deleteHomepageExtracurricularAction(formData: FormData) {
  try {
    const id = normalizeText(formData.get("id"))
    if (!id) throw new Error("Extracurricular id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("homepage_extracurriculars").delete().eq("id", id)

    if (error) throw new Error(error.message)

    revalidatePath("/admin/web-config/homepage")
    revalidatePath("/")
    redirectWithTabMessage("extracurriculars", "success", "Extracurricular club deleted.")
  } catch (error) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : "Failed to delete extracurricular club."
    redirectWithTabMessage("extracurriculars", "error", message)
  }
}

