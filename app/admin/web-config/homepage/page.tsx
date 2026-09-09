import { HomepageSettingsManager } from "@/components/admin/homepage-settings-manager"
import { createSupabaseAdminClient } from "@/lib/db"
import {
  getHomepageHeroSlidesForAdmin,
  getHomepageLeadershipCardsForAdmin,
  getHomepageQuickInfoItemsForAdmin,
  getHomepageAcademicProgramsForAdmin,
  getHomepageStatsForAdmin,
  getFooterLinkSectionsForAdmin,
  getHomepageExtracurricularsForAdmin,
} from "@/lib/homepage"
import { getPhotoGalleryItemsForAdmin } from "@/lib/gallery"

type HomepageSettingsPageProps = {
  searchParams?: Promise<{ tab?: string; status?: string; message?: string }>
}

export default async function HomepageSettingsPage({ searchParams }: HomepageSettingsPageProps) {
  const params = searchParams ? await searchParams : undefined
  const [
    heroSlides,
    quickInfoItems,
    leadershipCards,
    staffResult,
    academicPrograms,
    homeStats,
    footerSections,
    galleryPhotos,
    extracurriculars,
  ] = await Promise.all([
    getHomepageHeroSlidesForAdmin(100),
    getHomepageQuickInfoItemsForAdmin(100),
    getHomepageLeadershipCardsForAdmin(100),
    createSupabaseAdminClient().from("staffs").select("id, full_name_en, designation").order("full_name_en", { ascending: true }).limit(200),
    getHomepageAcademicProgramsForAdmin(100),
    getHomepageStatsForAdmin(100),
    getFooterLinkSectionsForAdmin(100),
    getPhotoGalleryItemsForAdmin(100),
    getHomepageExtracurricularsForAdmin(100),
  ])

  return (
    <HomepageSettingsManager
      heroSlides={heroSlides}
      quickInfoItems={quickInfoItems}
      leadershipCards={leadershipCards}
      staffOptions={(staffResult.data ?? []) as Array<{ id: string; full_name_en: string | null; designation: string | null }>}
      academicPrograms={academicPrograms}
      homeStats={homeStats}
      footerSections={footerSections}
      galleryPhotos={galleryPhotos}
      extracurriculars={extracurriculars}
      initialTab={params?.tab}
      status={params?.status}
      message={params?.message}
    />
  )
}
