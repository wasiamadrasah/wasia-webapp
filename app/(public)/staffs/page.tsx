import { Users, Briefcase } from "lucide-react"
import { createSupabaseAdminClient } from "@/lib/db"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"
import { StaffGrid, type StaffCard } from "@/components/layout/staff-grid"
import { createPageMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "কর্মকর্তা ও কর্মচারীবৃন্দ",
  description: "ওয়াসিয়া কামিল মাদ্রাসার প্রশাসনিক ও সহায়ক কর্মকর্তা-কর্মচারীদের তালিকা।",
  path: "/staffs",
  keywords: ["কর্মকর্তা ও কর্মচারী", "school staff", "administration", "ওয়াসিয়া মাদ্রাসা স্টাফ"],
})

type StaffsPageProps = {
  searchParams?: Promise<{
    type?: string | string[]
  }>
}

type StaffAccountStatus = {
  staff_id: string | null
  status: string | null
}

const filterContent = {
  default: {
    badge: "কর্মকর্তা ও কর্মচারী",
    title: "কর্মকর্তা ও কর্মচারীবৃন্দ",
    subtitle: "মাদ্রাসার সার্বিক প্রাতিষ্ঠানিক ও প্রশাসনিক কার্যক্রমে নিয়োজিত কর্মকর্তা ও কর্মচারীবৃন্দ।",
  },
  president: {
    badge: "পরিচালনা পর্ষদ",
    title: "সভাপতি ও পরিচালনা পর্ষদ",
    subtitle: "মাদ্রাসার সার্বিক তত্ত্বাবধান ও নীতি নির্ধারণে সম্মানিত পরিচালনা পর্ষদ।",
  },
  headmaster: {
    badge: "প্রশাসন",
    title: "অধ্যক্ষ ও প্রশাসন",
    subtitle: "মাদ্রাসার প্রশাসনিক ও একাডেমিক কার্যক্রম পরিচালনায় দায়িত্বপ্রাপ্ত নেতৃত্ব।",
  },
  adhoc: {
    badge: "কমিটি",
    title: "এডহক কমিটি",
    subtitle: "মাদ্রাসার সাংগঠনিক ও প্রশাসনিক কার্যক্রম পরিচালনায় এডহক কমিটি।",
  },
} as const

function normalizeTypeParam(value?: string | string[]) {
  const type = Array.isArray(value) ? value[0] : value

  if (!type) return null

  const normalized = type.toLowerCase()

  if (normalized === "adhocs") return "adhoc"
  if (normalized === "staffs") return null

  return normalized
}

async function withoutInactiveAccounts(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  staffs: StaffCard[]
) {
  if (!staffs.length) {
    return staffs
  }

  const { data, error } = await supabase
    .from("staff_accounts")
    .select("staff_id, status")
    .in("staff_id", staffs.map((staff) => staff.id))

  if (error) {
    return staffs
  }

  const inactiveIds = new Set(
    ((data ?? []) as StaffAccountStatus[])
      .filter((account) => account.status?.toLowerCase() === "inactive")
      .map((account) => account.staff_id)
      .filter((staffId): staffId is string => Boolean(staffId))
  )

  return staffs.filter((staff) => !inactiveIds.has(staff.id))
}

function getStaffRank(rawDesignation: string | null | undefined): number {
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

  // 4. Rank 4: Senior Staff/Teacher
  if (d.includes("senior") || d.includes("সিনিয়র") || d.includes("সিনিয়র")) return 4

  return 5
}

export default async function StaffsPage({ searchParams }: StaffsPageProps) {
  const supabase = createSupabaseAdminClient()
  const [params, instituteSettings] = await Promise.all([
    (await searchParams) ?? {},
    getInstituteSettings(),
  ])

  const filterType = normalizeTypeParam(params.type)

  let query = supabase
    .from("staffs")
    .select("id, profile_photo, full_name_en, full_name_bn, designation, email, type, contact_number, joining_date, status")
    .neq("type", "teacher")
    .eq("status", "active")
    .order("joining_date", { ascending: true })

  if (filterType && filterType in filterContent) {
    query = query.eq("type", filterType)
  }

  const primaryResult = await query

  const fallbackResult =
    primaryResult.error &&
    primaryResult.error.message.toLowerCase().includes("column")
      ? await supabase
          .from("staffs")
          .select("id, profile_photo, full_name_en, designation, email, type, contact_number, joining_date")
          .neq("type", "teacher")
          .order("joining_date", { ascending: true })
      : null

  const rawStaffs = ((fallbackResult?.data ?? primaryResult.data) ?? []) as StaffCard[]
  const staffs = await withoutInactiveAccounts(supabase, rawStaffs)

  // Sort: 1st Principal/Oddhokkho/Head, 2nd Vice Principal/Upaddhokko/Assistant Head, then joining date
  staffs.sort((a, b) => {
    const rankA = getStaffRank(a.designation)
    const rankB = getStaffRank(b.designation)

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

    const nameA = a.full_name_en || ""
    const nameB = b.full_name_en || ""
    return nameA.localeCompare(nameB)
  })

  const content =
    filterType && filterType in filterContent
      ? filterContent[filterType as keyof typeof filterContent]
      : filterContent.default

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    ""

  const heroSubtitle = instituteName
    ? `${instituteName}-এর প্রাতিষ্ঠানিক ও প্রশাসনিক কার্যক্রমে নিয়োজিত সুযোগ্য কর্মকর্তা ও কর্মচারীবৃন্দ।`
    : content.subtitle

  return (
    <main className="min-h-screen bg-[#F7F8F5]">
      {/* 1. Public Standard Hero Banner */}
      <PublicHero
        title={content.title}
        subtitle={heroSubtitle}
        badgeText={content.badge}
        badgeIcon={Briefcase}
        breadcrumbCurrent={content.title}
      />

      {/* 2. Main Section with Staff Grid & Watermark Pattern */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        {/* Subtle Islamic Geometric Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="staffs-islamic-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <path
                  d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,40 L6,35 L20,30 L14,16 L29,22 Z"
                  fill="none"
                  stroke="#075E54"
                  strokeWidth="1.2"
                />
                <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#staffs-islamic-pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <StaffGrid staffs={staffs} contentTitle={content.title} />
        </div>
      </section>
    </main>
  )
}
