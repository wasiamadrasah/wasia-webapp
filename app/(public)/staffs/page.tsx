import { Outfit } from "next/font/google"
import { createSupabaseAdminClient } from "@/lib/db"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { StaffGrid } from "@/components/layout/staff-grid"
import { createPageMetadata } from "@/lib/seo"
import { Mail } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "Staff",
  description: "Meet the administrative and support staff serving the school community.",
  path: "/staffs",
  keywords: ["school staff", "administration", "support staff"],
})

type StaffCard = {
  id: string
  profile_photo: string | null
  full_name_en: string | null
  designation: string | null
  email: string | null
  type: string | null
  contact_number: string | null
  joining_date: string | null
}

type StaffsPageProps = {
  searchParams?: Promise<{
    type?: string | string[]
  }>
}

const filterContent = {
  default: {
    badge: "Personnel",
    title: "Non-Teaching Staff",
    description: "The dedicated team behind the school's daily operations.",
  },
  president: {
    badge: "Administration",
    title: "President",
    description: "Institutional leadership and strategic oversight of the school community.",
  },
  headmaster: {
    badge: "Administration",
    title: "Headmaster",
    description: "Academic and operational leadership of the school.",
  },
  adhoc: {
    badge: "Administration",
    title: "Adhoc Committee",
    description: "Committee members supporting school governance and administration.",
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

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default async function StaffsPage({ searchParams }: StaffsPageProps) {
  const supabase = createSupabaseAdminClient()
  const params = (await searchParams) ?? {}
  const filterType = normalizeTypeParam(params.type)

  let query = supabase
    .from("staffs")
    .select("id, profile_photo, full_name_en, designation, email, type, contact_number, joining_date")
    .neq("type", "teacher")
    .order("joining_date", { ascending: true })

  if (filterType && filterType in filterContent) {
    query = query.eq("type", filterType)
  }

  const staffs = (await query).data as StaffCard[] ?? []
  
  // Sort: headmaster/principal first, then by joining date
  staffs.sort((a, b) => {
    const aDesignation = a.designation?.toLowerCase() || ""
    const bDesignation = b.designation?.toLowerCase() || ""
    
    const isAHeadmaster = aDesignation.includes("headmaster") || aDesignation.includes("principal")
    const isBHeadmaster = bDesignation.includes("headmaster") || bDesignation.includes("principal")
    
    if (isAHeadmaster && !isBHeadmaster) return -1
    if (!isAHeadmaster && isBHeadmaster) return 1
    
    // If both are headmasters or both are regular staff, sort by joining date
    const aDate = a.joining_date ? new Date(a.joining_date).getTime() : Infinity
    const bDate = b.joining_date ? new Date(b.joining_date).getTime() : Infinity
    
    return aDate - bDate
  })

  const content = filterType && filterType in filterContent ? filterContent[filterType as keyof typeof filterContent] : filterContent.default

  return (
    <main>
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
            <span>{content.badge}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {content.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            {content.description}
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Staffs" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          {staffs.length === 0 ? (
            <p className="text-center text-slate-500">No records found for this section.</p>
          ) : (
            <StaffGrid staffs={staffs} contentTitle={content.title} />
          )}
        </div>
      </section>
    </main>
  )
}
