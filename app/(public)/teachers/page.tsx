import { Outfit } from "next/font/google"
import { createSupabaseAdminClient } from "@/lib/db"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { TeacherGrid } from "@/components/layout/teacher-grid"
import { createPageMetadata } from "@/lib/seo"
import { Mail } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "Teachers",
  description: "Browse teacher profiles, designations, contact details, and faculty information.",
  path: "/teachers",
  keywords: ["teachers", "faculty", "school teachers", "teacher profiles"],
})

type TeacherCard = {
  id: string
  profile_photo: string | null
  full_name_en: string | null
  designation: string | null
  email: string | null
  contact_number: string | null
  joining_date: string | null
  status?: string | null
}

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

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default async function TeachersPage() {
  const supabase = createSupabaseAdminClient()

  const primaryResult = await supabase
    .from("staffs")
    .select("id, profile_photo, full_name_en, designation, email, contact_number, joining_date, status")
    .eq("type", "teacher")
    .eq("status", "active")
    .order("joining_date", { ascending: true })

  const fallbackResult =
    primaryResult.error &&
    primaryResult.error.message.toLowerCase().includes("column") &&
    primaryResult.error.message.toLowerCase().includes("status")
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

  // Sort: headmaster/principal first, then by joining date
  teachers.sort((a, b) => {
    const aDesignation = a.designation?.toLowerCase() || ""
    const bDesignation = b.designation?.toLowerCase() || ""
    
    const isAHeadmaster = aDesignation.includes("headmaster") || aDesignation.includes("principal")
    const isBHeadmaster = bDesignation.includes("headmaster") || bDesignation.includes("principal")
    
    if (isAHeadmaster && !isBHeadmaster) return -1
    if (!isAHeadmaster && isBHeadmaster) return 1
    
    // If both are headmasters or both are regular teachers, sort by joining date
    const aDate = a.joining_date ? new Date(a.joining_date).getTime() : Infinity
    const bDate = b.joining_date ? new Date(b.joining_date).getTime() : Infinity
    
    return aDate - bDate
  })

  return (
    <main>
      {/* Header */}
      <section className={`${outfit.className} relative overflow-hidden bg-gradient-to-b from-[#021e17] via-[#01251e] to-slate-900 border-b border-emerald-950/40 px-6 py-6 md:px-10 md:py-8`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Modern radial glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          {/* Pill Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 shadow-md shadow-emerald-950/30 backdrop-blur-md">
            <Mail className="h-3.5 w-3.5 text-emerald-400" />
            <span>FACULTY DESK</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Our <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Teachers</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            Dedicated educators committed to student success.
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Teachers" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          {teachers.length === 0 ? (
            <p className="text-center text-slate-500">No teachers found.</p>
          ) : (
            <TeacherGrid teachers={teachers} />
          )}
        </div>
      </section>
    </main>
  )
}
