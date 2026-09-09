import { NextResponse } from "next/server"
import { createSupabaseAdminClient, getEvents, getNews, getNotices } from "@/lib/db"
import { getPhotoGalleryItems } from "@/lib/gallery"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import {
  getHomepageHeroSlides,
  getHomepageLeadershipCards,
  getHomepageQuickInfoItems,
  getHomepageAcademicPrograms,
  getHomepageStats,
  getFooterLinkSections,
  getHomepageExtracurriculars,
} from "@/lib/homepage"

type TeacherCard = {
  id: string
  full_name_en: string | null
  designation: string | null
  profile_photo: string | null
  status?: string | null
}

type StaffAccountStatus = {
  staff_id: string | null
  status: string | null
}

function isMissingStatusColumnError(error: { message?: string } | null | undefined) {
  const message = (error?.message ?? "").toLowerCase()
  return message.includes("column") && message.includes("status")
}

async function withoutInactiveAccounts(teachers: TeacherCard[]) {
  if (!teachers.length) {
    return teachers
  }

  const { data, error } = await createSupabaseAdminClient()
    .from("staff_accounts")
    .select("staff_id, status")
    .in("staff_id", teachers.map((teacher) => teacher.id))

  if (error) {
    return teachers
  }

  const inactiveIds = new Set(
    ((data ?? []) as StaffAccountStatus[])
      .filter((account) => account.status?.toLowerCase() === "inactive")
      .map((account) => account.staff_id)
      .filter((staffId): staffId is string => Boolean(staffId))
  )

  return teachers.filter((teacher) => !inactiveIds.has(teacher.id))
}

export async function GET() {
  try {
    const [teachers, notices, news, events, photos, heroSlides, quickInfoItems, leadershipCards, academicPrograms, stats, footerSections, instituteSettings, extracurriculars] = await Promise.all([
      createSupabaseAdminClient()
        .from("staffs")
        .select("id, full_name_en, designation, profile_photo, status")
        .eq("type", "teacher")
        .eq("status", "active")
        .order("full_name_en", { ascending: true })
        .limit(3),
      getNotices(5),
      getNews(5),
      getEvents(5),
      getPhotoGalleryItems(12),
      getHomepageHeroSlides(10),
      getHomepageQuickInfoItems(10),
      getHomepageLeadershipCards(10),
      getHomepageAcademicPrograms(20),
      getHomepageStats(20),
      getFooterLinkSections(20),
      getInstituteSettings(),
      getHomepageExtracurriculars(50),
    ])
    let teacherRows = (teachers.data ?? []) as TeacherCard[]

    if (isMissingStatusColumnError(teachers.error)) {
      const fallbackTeachers = await createSupabaseAdminClient()
        .from("staffs")
        .select("id, full_name_en, designation, profile_photo")
        .eq("type", "teacher")
        .order("full_name_en", { ascending: true })
        .limit(3)

      teacherRows = (fallbackTeachers.data ?? []) as TeacherCard[]
    }

    teacherRows = await withoutInactiveAccounts(teacherRows)
    const leadershipByRole = new Map(leadershipCards.map((item) => [item.role_slug, item]))

    return NextResponse.json({
      teachers: teacherRows,
      notices: notices
        .filter((item) => item.published === true || Boolean(item.published_at))
        .map((item) => ({
          id: item.id,
          title: item.title,
          published_at: item.published_at,
          created_at: item.created_at,
          notice_type: item.notice_type,
        })),
      news: news
        .filter((item) => item.published === true || Boolean(item.published_at))
        .map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          published_at: item.published_at,
          created_at: item.created_at,
        })),
      events: events
        .filter((item) => item.published !== false)
        .map((item) => ({
          id: item.id,
          title: item.title,
          event_date: item.event_date,
          location: item.location ?? null,
        })),
      photos: photos
        .filter((item) => item.published !== false)
        .map((item) => ({
          id: item.id,
          title: item.title,
          image_url: item.image_url,
          photo_date: item.photo_date,
          created_at: item.created_at,
          category: item.category,
        })),
      hero_slides: heroSlides.map((item) => ({
        id: item.id,
        title: item.title,
        image_url: item.image_url,
        display_order: item.display_order,
      })),
      quick_info_items: quickInfoItems.map((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        icon_key: item.icon_key,
        link_url: item.link_url,
        display_order: item.display_order,
      })),
      leadership_cards: leadershipCards.map((item) => ({
        id: item.id,
        role_slug: item.role_slug,
        role_title: item.role_title,
        leader_name: item.leader_name,
        leader_photo_url: item.leader_photo_url,
        leader_message: item.leader_message,
        subtitle: item.subtitle,
        display_order: item.display_order,
        staff: item.staff,
      })),
      academic_programs: academicPrograms.map((item) => ({
        id: item.id,
        program_name: item.program_name,
        program_slug: item.program_slug,
        description: item.description,
        icon_key: item.icon_key,
        link_url: item.link_url,
        display_order: item.display_order,
      })),
      stats: stats.map((item) => ({
        id: item.id,
        stat_label: item.stat_label,
        stat_slug: item.stat_slug,
        stat_value: item.stat_value,
        stat_suffix: item.stat_suffix,
        description: item.description,
        icon_key: item.icon_key,
        color_scheme: item.color_scheme,
        display_order: item.display_order,
      })),
      footer_sections: footerSections.map((section) => ({
        id: section.id,
        section_name: section.section_name,
        section_slug: section.section_slug,
        display_order: section.display_order,
        links: section.links.map((link) => ({
          id: link.id,
          link_label: link.link_label,
          link_url: link.link_url,
          display_order: link.display_order,
        })),
      })),
      leadership: {
        president: leadershipByRole.get("president")?.staff ?? null,
        chief_education_officer: leadershipByRole.get("chief-education-officer")?.staff ?? null,
        headmaster: leadershipByRole.get("headmaster")?.staff ?? null,
      },
      institute_settings: instituteSettings,
      extracurriculars: extracurriculars.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        icon_key: item.icon_key,
        logo_url: item.logo_url,
        display_order: item.display_order,
      })),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error("[HOME-FEED-API] Error:", {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
    })
    
    return NextResponse.json(
      {
        error: errorMessage,
        teachers: [],
        notices: [],
        news: [],
        events: [],
        photos: [],
        hero_slides: [],
        quick_info_items: [],
        leadership_cards: [],
        academic_programs: [],
        stats: [],
        footer_sections: [],
        leadership: {
          president: null,
          chief_education_officer: null,
          headmaster: null,
        },
        institute_settings: null,
        extracurriculars: [],
      },
      { status: 500 }
    )
  }
}
