import "server-only"

import { createSupabaseAdminClient } from "@/lib/db"

type MissingError = { code?: string; message?: string } | null

const isMissingTableError = (error: MissingError) => {
  if (!error) return false

  const message = (error.message ?? "").toLowerCase()
  return error.code === "PGRST205" || message.includes("schema cache") || (message.includes("relation") && message.includes("does not exist"))
}

export type HomepageHeroSlideRecord = {
  id: string
  title: string
  image_url: string
  display_order: number
  is_active: boolean
  created_at: string | null
}

export type HomepageQuickInfoRecord = {
  id: string
  title: string
  subtitle: string
  icon_key: string
  link_url: string | null
  display_order: number
  is_active: boolean
  created_at: string | null
}

export type HomepageLeadershipCardRecord = {
  id: string
  role_slug: string
  role_title: string
  leader_name: string | null
  leader_photo_url: string | null
  leader_message: string | null
  subtitle: string | null
  display_order: number
  is_active: boolean
  staff: {
    id: string
    full_name_en: string | null
    designation: string | null
    profile_photo: string | null
  } | null
}

export async function getHomepageHeroSlidesForAdmin(limit = 50) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("homepage_hero_slides")
    .select("id, title, image_url, display_order, is_active, created_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as HomepageHeroSlideRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as HomepageHeroSlideRecord[]
}

export async function getHomepageHeroSlides(limit = 10) {
  const rows = await getHomepageHeroSlidesForAdmin(limit)
  return rows.filter((row) => row.is_active)
}

export async function getHomepageQuickInfoItemsForAdmin(limit = 20) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("homepage_quick_info_items")
    .select("id, title, subtitle, icon_key, link_url, display_order, is_active, created_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as HomepageQuickInfoRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as HomepageQuickInfoRecord[]
}

export async function getHomepageQuickInfoItems(limit = 20) {
  const rows = await getHomepageQuickInfoItemsForAdmin(limit)
  return rows.filter((row) => row.is_active)
}

export async function getHomepageLeadershipCardsForAdmin(limit = 10) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("homepage_leadership_cards")
    .select("id, role_slug, role_title, leader_name, leader_photo_url, leader_message, subtitle, display_order, is_active, staff:staff_id(id, full_name_en, designation, profile_photo)")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as HomepageLeadershipCardRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  type RawLeadershipRow = {
    id: string
    role_slug: string
    role_title: string
    leader_name: string | null
    leader_photo_url: string | null
    leader_message: string | null
    subtitle: string | null
    display_order: number | null
    is_active: boolean
    staff: Array<{
      id: string
      full_name_en: string | null
      designation: string | null
      profile_photo: string | null
    }> | {
      id: string
      full_name_en: string | null
      designation: string | null
      profile_photo: string | null
    } | null
  }

  return ((data ?? []) as RawLeadershipRow[]).map((row) => ({
    id: String(row.id),
    role_slug: String(row.role_slug),
    role_title: String(row.role_title),
    leader_name: (row.leader_name as string | null | undefined) ?? null,
    leader_photo_url: (row.leader_photo_url as string | null | undefined) ?? null,
    leader_message: (row.leader_message as string | null | undefined) ?? null,
    subtitle: (row.subtitle as string | null | undefined) ?? null,
    display_order: Number(row.display_order ?? 0),
    is_active: Boolean(row.is_active),
    staff: Array.isArray(row.staff)
      ? (row.staff[0]
        ? {
            id: String(row.staff[0].id),
            full_name_en: (row.staff[0].full_name_en as string | null | undefined) ?? null,
            designation: (row.staff[0].designation as string | null | undefined) ?? null,
            profile_photo: (row.staff[0].profile_photo as string | null | undefined) ?? null,
          }
        : null)
      : row.staff
        ? {
            id: String(row.staff.id),
            full_name_en: (row.staff.full_name_en as string | null | undefined) ?? null,
            designation: (row.staff.designation as string | null | undefined) ?? null,
            profile_photo: (row.staff.profile_photo as string | null | undefined) ?? null,
          }
        : null,
  })) as HomepageLeadershipCardRecord[]
}

export async function getHomepageLeadershipCards(limit = 10) {
  const rows = await getHomepageLeadershipCardsForAdmin(limit)
  return rows.filter((row) => row.is_active)
}

export type HomepageAcademicProgramRecord = {
  id: string
  program_name: string
  program_slug: string
  description: string | null
  icon_key: string
  link_url: string | null
  display_order: number
  is_active: boolean
  created_at: string | null
}

export async function getHomepageAcademicProgramsForAdmin(limit = 20) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("homepage_academic_programs")
    .select("id, program_name, program_slug, description, icon_key, link_url, display_order, is_active, created_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as HomepageAcademicProgramRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as HomepageAcademicProgramRecord[]
}

export async function getHomepageAcademicPrograms(limit = 20) {
  const rows = await getHomepageAcademicProgramsForAdmin(limit)
  return rows.filter((row) => row.is_active)
}

export type HomepageExtracurricularRecord = {
  id: string
  name: string
  slug: string
  description: string | null
  icon_key: string
  logo_url: string | null
  display_order: number
  is_active: boolean
  created_at: string | null
}

export async function getHomepageExtracurricularsForAdmin(limit = 50) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("homepage_extracurriculars")
    .select("id, name, slug, description, icon_key, logo_url, display_order, is_active, created_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as HomepageExtracurricularRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as HomepageExtracurricularRecord[]
}

export async function getHomepageExtracurriculars(limit = 50) {
  const rows = await getHomepageExtracurricularsForAdmin(limit)
  return rows.filter((row) => row.is_active)
}


export type HomepageStatRecord = {
  id: string
  stat_label: string
  stat_slug: string
  stat_value: number
  stat_suffix: string
  description: string | null
  icon_key: string
  color_scheme: string
  display_order: number
  is_active: boolean
  created_at: string | null
}

export async function getHomepageStatsForAdmin(limit = 20) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("homepage_stats")
    .select("id, stat_label, stat_slug, stat_value, stat_suffix, description, icon_key, color_scheme, display_order, is_active, created_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as HomepageStatRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as HomepageStatRecord[]
}

export async function getHomepageStats(limit = 20) {
  const rows = await getHomepageStatsForAdmin(limit)
  return rows.filter((row) => row.is_active)
}

export type FooterLinkSectionRecord = {
  id: string
  section_name: string
  section_slug: string
  display_order: number
  is_active: boolean
  links: FooterLinkRecord[]
  created_at: string | null
}

export type FooterLinkRecord = {
  id: string
  section_id: string
  link_label: string
  link_url: string
  display_order: number
  is_active: boolean
  created_at: string | null
}

export async function getFooterLinkSectionsForAdmin(limit = 20) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from("footer_link_sections")
    .select("id, section_name, section_slug, display_order, is_active, created_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(error)) {
    return [] as FooterLinkSectionRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  const sections = (data ?? []) as Array<{
    id: string
    section_name: string
    section_slug: string
    display_order: number
    is_active: boolean
    created_at: string | null
  }>

  const { data: linksData, error: linksError } = await supabase
    .from("footer_links")
    .select("id, section_id, link_label, link_url, display_order, is_active, created_at")
    .order("display_order", { ascending: true })

  if (linksError && !isMissingTableError(linksError)) {
    throw new Error(linksError.message)
  }

  const allLinks = (linksData ?? []) as FooterLinkRecord[]
  const linksBySection = new Map<string, FooterLinkRecord[]>()

  allLinks.forEach((link) => {
    if (!linksBySection.has(link.section_id)) {
      linksBySection.set(link.section_id, [])
    }
    linksBySection.get(link.section_id)!.push(link)
  })

  return sections.map((section) => ({
    ...section,
    links: linksBySection.get(section.id) ?? [],
  })) as FooterLinkSectionRecord[]
}

export async function getFooterLinkSections(limit = 20) {
  const rows = await getFooterLinkSectionsForAdmin(limit)
  return rows.filter((row) => row.is_active).map((section) => ({
    ...section,
    links: section.links.filter((link) => link.is_active),
  }))
}
