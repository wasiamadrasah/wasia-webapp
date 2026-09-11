import { GraduationCap } from "lucide-react"
import { createSupabaseAdminClient } from "@/lib/db"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"
import { TeacherGrid, type TeacherCard } from "@/components/layout/teacher-grid"
import { createPageMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "সম্মানিত শিক্ষকমণ্ডলী",
  description: "সুযোগ্য, অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক ও অনুষদ সদস্যদের তালিকা ও প্রোফাইল।",
  path: "/teachers",
  keywords: ["শিক্ষকমণ্ডলী", "teachers", "faculty", "অনুষদ সদস্য", "মাদ্রাসার শিক্ষক"],
})

type StaffAccountStatus = {
  staff_id: string | null
  status: string | null
}

async function withoutInactiveAccounts(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  teachers: TeacherCard[]
) {
  if (!teachers.length) {
    return teachers
  }

  const { data, error } = await supabase
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

function getTeacherRank(rawDesignation: string | null | undefined): number {
  if (!rawDesignation) return 99
  const d = rawDesignation.toLowerCase().trim()

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

export default async function TeachersPage() {
  const supabase = createSupabaseAdminClient()

  const [primaryResult, instituteSettings] = await Promise.all([
    supabase
      .from("staffs")
      .select("id, profile_photo, full_name_en, full_name_bn, designation, email, contact_number, joining_date, status")
      .eq("type", "teacher")
      .eq("status", "active")
      .order("joining_date", { ascending: true }),
    getInstituteSettings(),
  ])

  const fallbackResult =
    primaryResult.error &&
    primaryResult.error.message.toLowerCase().includes("column")
      ? await supabase
          .from("staffs")
          .select("id, profile_photo, full_name_en, designation, email, contact_number, joining_date")
          .eq("type", "teacher")
          .order("joining_date", { ascending: true })
      : null

  const teachers = await withoutInactiveAccounts(
    supabase,
    ((fallbackResult?.data ?? primaryResult.data) ?? []) as TeacherCard[]
  )

  // Sort: 1st Principal/Oddhokkho/Head, 2nd Vice Principal/Upaddhokko/Assistant Head, then joining date
  teachers.sort((a, b) => {
    const rankA = getTeacherRank(a.designation)
    const rankB = getTeacherRank(b.designation)

    if (rankA !== rankB) {
      return rankA - rankB
    }

    const aDate = a.joining_date ? new Date(a.joining_date).getTime() : Infinity
    const bDate = b.joining_date ? new Date(b.joining_date).getTime() : Infinity
    const invalidA = Number.isNaN(aDate)
    const invalidB = Number.isNaN(bDate)

    if (!invalidA && !invalidB && aDate !== bDate) {
      return aDate - bDate
    }
    if (invalidA && !invalidB) return 1
    if (!invalidA && invalidB) return -1

    const nameA = a.full_name_en || a.full_name_bn || ""
    const nameB = b.full_name_en || b.full_name_bn || ""
    return nameA.localeCompare(nameB)
  })

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    ""

  const heroSubtitle = instituteName
    ? `ইলম ও আমলের সমন্বয়ে ভবিষ্যৎ প্রজন্ম গঠনে ${instituteName}-এর নিবেদিতপ্রাণ শিক্ষকবৃন্দ।`
    : "ইলম ও আমলের সমন্বয়ে ভবিষ্যৎ প্রজন্ম গঠনে অত্র মাদ্রাসার নিবেদিতপ্রাণ শিক্ষকবৃন্দ।"

  return (
    <main className="min-h-screen bg-[#F7F8F5]">
      {/* 1. Public Standard Hero Banner */}
      <PublicHero
        title="সম্মানিত শিক্ষকমণ্ডলী"
        subtitle={heroSubtitle}
        badgeText="অনুষদ ও শিক্ষকমণ্ডলী"
        badgeIcon={GraduationCap}
        breadcrumbCurrent="শিক্ষকমণ্ডলী"
      />

      {/* 2. Main Section with Teacher Grid & Watermark Pattern */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        {/* Subtle Islamic Geometric Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="teachers-islamic-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <path
                  d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,40 L6,35 L20,30 L14,16 L29,22 Z"
                  fill="none"
                  stroke="#075E54"
                  strokeWidth="1.2"
                />
                <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#teachers-islamic-pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <TeacherGrid teachers={teachers} />
        </div>
      </section>
    </main>
  )
}
