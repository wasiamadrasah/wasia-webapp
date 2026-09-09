import { Outfit } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createSupabaseAdminClient } from "@/lib/db"
import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { absoluteUrl, createPageMetadata } from "@/lib/seo"
import { Mail, Phone, GraduationCap, Briefcase, BookOpen, ArrowLeft, User, Droplet } from "lucide-react"

type TeacherRecord = {
  id: string
  status?: string | null
  full_name_en: string | null
  full_name_bn: string | null
  profile_photo: string | null
  religion: string | null
  blood_group: string | null
  designation: string | null
  employment_type: string | null
  joining_date: string | null
  contact_number: string | null
  email: string | null
}
type StaffAccountStatus = {
  status: string | null
}
type AcademicRecord = {
  id: string
  degree: string | null
  institution: string | null
  subject: string | null
  passing_year: string | null
  duration: string | null
  result: string | null
}
type ExperienceRecord = {
  id: string
  institute_name: string | null
  location: string | null
  designation: string | null
  subject: string | null
  employment_type: string | null
  start_date: string | null
  end_date: string | null
  currently_working: boolean | null
}
type TrainingRecord = {
  id: string
  training_name: string | null
  training_institute: string | null
  year: string | null
  duration: string | null
  subject: string | null
}

async function getPublicTeacher(id: string) {
  const supabase = createSupabaseAdminClient()
  const result = await supabase.from("staffs").select(`
    id, status, full_name_en, full_name_bn, profile_photo, religion, blood_group,
    designation, employment_type, joining_date, contact_number, email
  `).eq("id", id).eq("type", "teacher").eq("status", "active").single<TeacherRecord>()

  if (result.error && result.error.message.toLowerCase().includes("column") && result.error.message.toLowerCase().includes("status")) {
    return supabase.from("staffs").select(`
      id, full_name_en, full_name_bn, profile_photo, religion, blood_group,
      designation, employment_type, joining_date, contact_number, email
    `).eq("id", id).eq("type", "teacher").single<TeacherRecord>()
  }

  return result
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: teacher } = await getPublicTeacher(id)

  if (!teacher) {
    return createPageMetadata({
      title: "Teacher Not Found",
      description: "The requested teacher profile could not be found.",
      path: `/teachers/${id}`,
    })
  }

  return createPageMetadata({
    title: teacher.full_name_en || "Teacher Profile",
    description: `${teacher.full_name_en || "Teacher"}${teacher.designation ? `, ${teacher.designation}` : ""} at Purba Bakalia City Corporation High School.`,
    path: `/teachers/${id}`,
    image: teacher.profile_photo || undefined,
    keywords: ["teacher profile", teacher.designation || "teacher", "PBCCHS teacher"],
  })
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default async function TeacherProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createSupabaseAdminClient()

  const [teacherResult, accountResult, { data: academics }, { data: experience }, { data: training }] =
    await Promise.all([
      getPublicTeacher(id),
      supabase.from("staff_accounts").select("status").eq("staff_id", id).maybeSingle<StaffAccountStatus>(),
      supabase.from("staff_academics").select("id, degree, institution, subject, passing_year, duration, result").eq("staff_id", id),
      supabase.from("staff_experience").select(`
        id, institute_name, location, designation, subject, employment_type,
        start_date, end_date, currently_working
      `).eq("staff_id", id),
      supabase.from("staff_training").select("id, training_name, training_institute, year, duration, subject").eq("staff_id", id),
    ])

  let teacher = teacherResult.data

  if (teacherResult.error && teacherResult.error.message.toLowerCase().includes("column") && teacherResult.error.message.toLowerCase().includes("status")) {
    const fallback = await supabase.from("staffs").select(`
      id, full_name_en, full_name_bn, profile_photo, religion, blood_group,
      designation, employment_type, joining_date, contact_number, email
    `).eq("id", id).eq("type", "teacher").single<TeacherRecord>()

    if (!fallback.data) {
      notFound()
    }

    teacher = fallback.data
  }

  if (!accountResult.error && accountResult.data?.status?.toLowerCase() === "inactive") {
    notFound()
  }

  if (!teacher) notFound()

  const acads = (academics ?? []) as AcademicRecord[]
  const exps = (experience ?? []) as ExperienceRecord[]
  const trainings = (training ?? []) as TrainingRecord[]

  const formatDate = (date: string | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "2-digit" })
  }
  const formatNaturalText = (val: string | null | undefined, fallback = "N/A") => {
    if (!val) return fallback
    return val
      .split(/[-_ ]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: teacher.full_name_en || teacher.full_name_bn || "Teacher",
    alternateName: teacher.full_name_bn || undefined,
    image: teacher.profile_photo ? absoluteUrl(teacher.profile_photo) : undefined,
    jobTitle: teacher.designation || "Teacher",
    email: teacher.email || undefined,
    telephone: teacher.contact_number || undefined,
    worksFor: {
      "@type": "EducationalOrganization",
      name: "Purba Bakalia City Corporation High School",
      url: absoluteUrl("/"),
    },
    url: absoluteUrl(`/teachers/${teacher.id}`),
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Top Header Navigation */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/teachers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#006a4e] hover:opacity-80 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>All Faculty Members</span>
            </Link>
            <div className="hidden sm:block">
              <PublicBreadcrumb
                current={teacher.full_name_en || "Teacher Profile"}
                className="text-xs"
                plainCurrent
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Single Card Container */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {/* Top Profile Banner Section */}
          <div className="relative border-b border-slate-100 bg-slate-50/50 p-8 md:p-10">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              {/* Photo Frame */}
              <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-lg border-2 border-slate-200 bg-white p-1.5 shadow-sm">
                <Image
                  src={teacher.profile_photo || "/avatar.png"}
                  alt={teacher.full_name_en || "Teacher"}
                  width={500}
                  height={500}
                  unoptimized
                  className="h-full w-full rounded object-cover"
                />
              </div>

              {/* Bio Details */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="space-y-1">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    {teacher.full_name_en || "Teacher Profile"}
                  </h1>
                  {teacher.full_name_bn && (
                    <p className="text-lg font-semibold text-slate-500">
                      {teacher.full_name_bn}
                    </p>
                  )}
                  <p className="inline-flex items-center rounded-full bg-[#006a4e] px-3 py-1 text-xs font-semibold text-white mt-1">
                    {teacher.designation || "Faculty Member"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 md:justify-start">
                  {teacher.email && (
                    <a
                      href={`mailto:${teacher.email}`}
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#006a4e] transition"
                    >
                      <Mail className="h-4 w-4 text-[#006a4e]" />
                      <span>{teacher.email}</span>
                    </a>
                  )}
                  {teacher.contact_number && (
                    <a
                      href={`tel:${teacher.contact_number}`}
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#006a4e] transition"
                    >
                      <Phone className="h-4 w-4 text-[#006a4e]" />
                      <span>{teacher.contact_number}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-8 md:p-10 space-y-12">
            {/* Grid for Personal Details */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span className="h-4 w-1 bg-[#006a4e] rounded-full inline-block"></span>
                Personal & Employment Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 rounded-lg border border-slate-100 bg-slate-50/40 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Employment Type</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{formatNaturalText(teacher.employment_type)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Joining Date</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{teacher.joining_date ? formatDate(teacher.joining_date) : "N/A"}</p>
                </div>
                {teacher.blood_group && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Blood Group</p>
                    <p className="mt-1 text-sm font-extrabold text-red-600">{teacher.blood_group}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Academic Journey Timeline */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span className="h-4 w-1 bg-[#006a4e] rounded-full inline-block"></span>
                Academic Qualifications
              </h2>
              {acads.length === 0 ? (
                <p className="text-sm text-slate-400">No academic qualifications listed.</p>
              ) : (
                <div className="relative border-l-2 border-slate-200 pl-6 ml-2 space-y-8">
                  {acads.map((item) => (
                    <div key={item.id} className="relative group">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#006a4e] shadow-sm transition-transform group-hover:scale-110"></span>
                      
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-extrabold text-slate-900 md:text-base">
                            {item.degree}
                          </span>
                          {item.passing_year && (
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                              Class of {item.passing_year}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-[#006a4e]">
                          {item.subject ? `Major in ${item.subject}` : "General Curriculum"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.institution || "Undocumented Institution"}
                        </p>
                        {item.result && (
                          <p className="text-xs text-slate-400 mt-1">
                            Result: <span className="font-semibold text-slate-700">{item.result}</span>
                            {item.duration && ` • Duration: ${item.duration}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Professional Experience Timeline */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span className="h-4 w-1 bg-[#006a4e] rounded-full inline-block"></span>
                Professional Experience
              </h2>
              {exps.length === 0 ? (
                <p className="text-sm text-slate-400">No experience history listed.</p>
              ) : (
                <div className="relative border-l-2 border-slate-200 pl-6 ml-2 space-y-8">
                  {exps.map((item) => (
                    <div key={item.id} className="relative group">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#006a4e] shadow-sm transition-transform group-hover:scale-110"></span>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-extrabold text-slate-900 md:text-base">
                            {item.designation}
                          </span>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                            {item.start_date ? formatDate(item.start_date) : "N/A"}
                            {" → "}
                            {item.currently_working ? (
                              <span className="text-[#006a4e] font-bold">Present</span>
                            ) : (
                              item.end_date ? formatDate(item.end_date) : "N/A"
                            )}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                          {item.institute_name}
                        </p>
                        {item.location && (
                          <p className="text-xs text-slate-400">
                            {item.location} {item.subject && `• Subject: ${item.subject}`} {item.employment_type && `• ${formatNaturalText(item.employment_type)}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Trainings & Workshops */}
            {trainings.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="h-4 w-1 bg-[#006a4e] rounded-full inline-block"></span>
                  Trainings & Workshops
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trainings.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 p-5 bg-white transition hover:border-[#006a4e]/20 hover:shadow-sm">
                      <h4 className="font-bold text-slate-900 text-sm">{item.training_name}</h4>
                      <p className="text-xs font-semibold text-[#006a4e] mt-1">{item.training_institute}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {item.subject && `Subject: ${item.subject}`} {item.year && `• Year: ${item.year}`} {item.duration && `• Duration: ${item.duration}`}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

