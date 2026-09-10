import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createSupabaseAdminClient } from "@/lib/db"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"
import { absoluteUrl, createPageMetadata } from "@/lib/seo"
import {
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  BookOpen,
  ArrowLeft,
  Award,
  Calendar,
  HeartPulse,
} from "lucide-react"

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
  const result = await supabase
    .from("staffs")
    .select(`
      id, status, full_name_en, full_name_bn, profile_photo, religion, blood_group,
      designation, employment_type, joining_date, contact_number, email
    `)
    .eq("id", id)
    .eq("type", "teacher")
    .eq("status", "active")
    .single<TeacherRecord>()

  if (
    result.error &&
    result.error.message.toLowerCase().includes("column") &&
    result.error.message.toLowerCase().includes("status")
  ) {
    return supabase
      .from("staffs")
      .select(`
        id, full_name_en, full_name_bn, profile_photo, religion, blood_group,
        designation, employment_type, joining_date, contact_number, email
      `)
      .eq("id", id)
      .eq("type", "teacher")
      .single<TeacherRecord>()
  }

  return result
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: teacher } = await getPublicTeacher(id)

  if (!teacher) {
    return createPageMetadata({
      title: "শিক্ষকের তথ্য পাওয়া যায়নি",
      description: "অনুরোধকৃত শিক্ষকের প্রোফাইল খুঁজে পাওয়া যায়নি।",
      path: `/teachers/${id}`,
    })
  }

  const name = teacher.full_name_bn || teacher.full_name_en || "সম্মানিত শিক্ষক"
  return createPageMetadata({
    title: `${name} - প্রোফাইল`,
    description: `${name}${teacher.designation ? `, ${teacher.designation}` : ""} - ওয়াসিয়া কামিল মাদ্রাসা।`,
    path: `/teachers/${id}`,
    image: teacher.profile_photo || undefined,
    keywords: ["শিক্ষক প্রোফাইল", teacher.designation || "শিক্ষক", "ওয়াসিয়া কামিল মাদ্রাসা"],
  })
}

export default async function TeacherProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createSupabaseAdminClient()

  const [teacherResult, accountResult, { data: academics }, { data: experience }, { data: training }, instituteSettings] =
    await Promise.all([
      getPublicTeacher(id),
      supabase.from("staff_accounts").select("status").eq("staff_id", id).maybeSingle<StaffAccountStatus>(),
      supabase.from("staff_academics").select("id, degree, institution, subject, passing_year, duration, result").eq("staff_id", id),
      supabase.from("staff_experience").select(`
        id, institute_name, location, designation, subject, employment_type,
        start_date, end_date, currently_working
      `).eq("staff_id", id),
      supabase.from("staff_training").select("id, training_name, training_institute, year, duration, subject").eq("staff_id", id),
      getInstituteSettings(),
    ])

  let teacher = teacherResult.data

  if (
    teacherResult.error &&
    teacherResult.error.message.toLowerCase().includes("column") &&
    teacherResult.error.message.toLowerCase().includes("status")
  ) {
    const fallback = await supabase
      .from("staffs")
      .select(`
        id, full_name_en, full_name_bn, profile_photo, religion, blood_group,
        designation, employment_type, joining_date, contact_number, email
      `)
      .eq("id", id)
      .eq("type", "teacher")
      .single<TeacherRecord>()

    if (!fallback.data) {
      notFound()
    }

    teacher = fallback.data
  }

  if (!accountResult.error && accountResult.data?.status?.toLowerCase() === "inactive") {
    notFound()
  }

  if (!teacher) notFound()

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    ""

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

  const displayName = teacher.full_name_bn || teacher.full_name_en || "সম্মানিত শিক্ষক"
  const secondaryName = teacher.full_name_bn && teacher.full_name_en ? teacher.full_name_en : null

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: displayName,
    alternateName: secondaryName || undefined,
    image: teacher.profile_photo ? absoluteUrl(teacher.profile_photo) : undefined,
    jobTitle: teacher.designation || "Teacher",
    email: teacher.email || undefined,
    telephone: teacher.contact_number || undefined,
    worksFor: {
      "@type": "EducationalOrganization",
      name: instituteName || "Madrasah",
      url: absoluteUrl("/"),
    },
    url: absoluteUrl(`/teachers/${teacher.id}`),
  }

  const heroSubtitle = instituteName
    ? `${teacher.designation || "শিক্ষক"} • ${instituteName}`
    : (teacher.designation || "সম্মানিত শিক্ষক")

  return (
    <main className="min-h-screen bg-[#F7F8F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* 1. Header Banner */}
      <PublicHero
        title={displayName}
        subtitle={heroSubtitle}
        badgeText="শিক্ষক প্রোফাইল"
        badgeIcon={GraduationCap}
        breadcrumbCurrent={displayName}
        breadcrumbParent={{ label: "শিক্ষকমণ্ডলী", href: "/teachers" }}
      />

      {/* 2. Main Content */}
      <section className="relative py-12 md:py-16">
        <div className="container relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Back Link */}
          <div>
            <Link
              href="/teachers"
              className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-[#075E54] hover:text-[#064A42] transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>সকল শিক্ষকমণ্ডলীর তালিকা</span>
            </Link>
          </div>

          {/* Profile Overview Card */}
          <div className="overflow-hidden rounded-3xl border border-[#E2E7E4] bg-white shadow-sm">
            
            {/* Top Bio Banner */}
            <div className="border-b border-[#E2E7E4] bg-[#F7F8F5]/60 p-6 sm:p-8 md:p-10">
              <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-start">
                
                {/* Photo Frame with Islamic Border */}
                <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl border-2 border-[#075E54]/30 bg-white p-1.5 shadow-md">
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#064A42]">
                    <Image
                      src={teacher.profile_photo || "/avatar.png"}
                      alt={displayName}
                      fill
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Bio Info */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="space-y-1">
                    <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#17211E]">
                      {displayName}
                    </h1>
                    {secondaryName && (
                      <p className="text-[16px] font-medium text-[#5F6B67]">
                        {secondaryName}
                      </p>
                    )}
                    <div className="pt-1.5">
                      <span className="inline-flex items-center rounded-full bg-[#075E54] px-3.5 py-1 text-[13.5px] font-semibold text-white shadow-2xs">
                        {teacher.designation || "অনুষদ সদস্য"}
                      </span>
                    </div>
                  </div>

                  {/* Contact Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 pt-3 md:justify-start">
                    {teacher.email && (
                      <a
                        href={`mailto:${teacher.email}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#E2E7E4] bg-white px-3.5 py-1.5 text-[14px] font-semibold text-[#17211E] transition hover:border-[#075E54] hover:text-[#075E54] shadow-2xs"
                      >
                        <Mail className="h-4 w-4 text-[#B68A18]" />
                        <span>{teacher.email}</span>
                      </a>
                    )}
                    {teacher.contact_number && (
                      <a
                        href={`tel:${teacher.contact_number}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#E2E7E4] bg-white px-3.5 py-1.5 text-[14px] font-semibold text-[#17211E] transition hover:border-[#075E54] hover:text-[#075E54] shadow-2xs"
                      >
                        <Phone className="h-4 w-4 text-[#075E54]" />
                        <span>{teacher.contact_number}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Sections */}
            <div className="p-6 sm:p-8 md:p-10 space-y-10">
              
              {/* 1. Personal & Employment Grid */}
              <section className="space-y-4">
                <h2 className="font-heading text-xl font-bold text-[#17211E] flex items-center gap-2.5">
                  <span className="h-4 w-1.5 bg-[#075E54] rounded-full inline-block"></span>
                  ব্যক্তিগত ও কর্মসংক্রান্ত তথ্য
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-2xl border border-[#E2E7E4] bg-[#F7F8F5]/80 p-5 sm:p-6">
                  <div>
                    <p className="text-[12.5px] font-semibold uppercase tracking-wider text-[#5F6B67]">কর্মসংস্থানের ধরণ</p>
                    <p className="mt-1 text-[15px] font-bold text-[#17211E]">{formatNaturalText(teacher.employment_type)}</p>
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold uppercase tracking-wider text-[#5F6B67]">যোগদানের তারিখ</p>
                    <p className="mt-1 text-[15px] font-bold text-[#17211E]">{teacher.joining_date ? formatDate(teacher.joining_date) : "তথ্য নেই"}</p>
                  </div>
                  {teacher.blood_group && (
                    <div>
                      <p className="text-[12.5px] font-semibold uppercase tracking-wider text-[#5F6B67]">রক্তের গ্রুপ</p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-[15px] font-extrabold text-red-600">
                        <HeartPulse className="h-4 w-4 text-red-500" />
                        <span>{teacher.blood_group}</span>
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* 2. Academic Journey Timeline */}
              <section className="space-y-4">
                <h2 className="font-heading text-xl font-bold text-[#17211E] flex items-center gap-2.5">
                  <span className="h-4 w-1.5 bg-[#075E54] rounded-full inline-block"></span>
                  শিক্ষাগত যোগ্যতা
                </h2>
                {acads.length === 0 ? (
                  <p className="text-[14.5px] text-[#5F6B67] bg-[#F7F8F5] p-4 rounded-xl border border-[#E2E7E4]">কোনো শিক্ষাগত যোগ্যতার তথ্য সংরক্ষিত নেই।</p>
                ) : (
                  <div className="relative border-l-2 border-[#075E54]/20 pl-6 ml-2 space-y-6">
                    {acads.map((item) => (
                      <div key={item.id} className="relative group">
                        {/* Timeline Dot */}
                        <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#075E54] shadow-xs"></span>
                        
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-heading text-[16.5px] font-bold text-[#17211E]">
                              {item.degree}
                            </span>
                            {item.passing_year && (
                              <span className="rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-2.5 py-0.5 text-[12px] font-semibold text-[#075E54]">
                                পাস: {item.passing_year}
                              </span>
                            )}
                          </div>
                          <p className="text-[14.5px] font-semibold text-[#075E54]">
                            {item.subject ? `বিষয়: ${item.subject}` : "সাধারণ পাঠ্যক্রম"}
                          </p>
                          <p className="text-[14px] text-[#5F6B67]">
                            {item.institution || "শিক্ষা প্রতিষ্ঠান"}
                          </p>
                          {item.result && (
                            <p className="text-[13px] text-[#5F6B67] mt-0.5">
                              ফলাফল: <span className="font-semibold text-[#17211E]">{item.result}</span>
                              {item.duration && ` • মেয়াদ: ${item.duration}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* 3. Professional Experience Timeline */}
              <section className="space-y-4">
                <h2 className="font-heading text-xl font-bold text-[#17211E] flex items-center gap-2.5">
                  <span className="h-4 w-1.5 bg-[#075E54] rounded-full inline-block"></span>
                  পেশাগত অভিজ্ঞতা
                </h2>
                {exps.length === 0 ? (
                  <p className="text-[14.5px] text-[#5F6B67] bg-[#F7F8F5] p-4 rounded-xl border border-[#E2E7E4]">কোনো পূর্ববর্তী অভিজ্ঞতার তথ্য সংরক্ষিত নেই।</p>
                ) : (
                  <div className="relative border-l-2 border-[#075E54]/20 pl-6 ml-2 space-y-6">
                    {exps.map((item) => (
                      <div key={item.id} className="relative group">
                        {/* Timeline Dot */}
                        <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#075E54] shadow-xs"></span>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-heading text-[16.5px] font-bold text-[#17211E]">
                              {item.designation}
                            </span>
                            <span className="rounded-full bg-[#F7F8F5] border border-[#E2E7E4] px-2.5 py-0.5 text-[12px] font-semibold text-[#5F6B67]">
                              {item.start_date ? formatDate(item.start_date) : "N/A"}
                              {" → "}
                              {item.currently_working ? (
                                <span className="text-[#075E54] font-bold">বর্তমান</span>
                              ) : (
                                item.end_date ? formatDate(item.end_date) : "N/A"
                              )}
                            </span>
                          </div>
                          <p className="text-[14.5px] font-semibold text-[#17211E]">
                            {item.institute_name}
                          </p>
                          {item.location && (
                            <p className="text-[13px] text-[#5F6B67]">
                              {item.location} {item.subject && `• বিষয়: ${item.subject}`} {item.employment_type && `• ${formatNaturalText(item.employment_type)}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* 4. Trainings & Workshops */}
              {trainings.length > 0 && (
                <section className="space-y-4">
                  <h2 className="font-heading text-xl font-bold text-[#17211E] flex items-center gap-2.5">
                    <span className="h-4 w-1.5 bg-[#075E54] rounded-full inline-block"></span>
                    প্রশিক্ষণ ও কর্মশালা
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trainings.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-[#E2E7E4] p-5 bg-[#F7F8F5]/60 transition hover:border-[#075E54]/30 hover:bg-white hover:shadow-sm">
                        <h4 className="font-heading font-bold text-[#17211E] text-[15px]">{item.training_name}</h4>
                        <p className="text-[13.5px] font-semibold text-[#075E54] mt-1">{item.training_institute}</p>
                        <p className="text-[12.5px] text-[#5F6B67] mt-2">
                          {item.subject && `বিষয়: ${item.subject}`} {item.year && ` • বছর: ${item.year}`} {item.duration && ` • মেয়াদ: ${item.duration}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
