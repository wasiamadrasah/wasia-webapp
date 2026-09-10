import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, Users, ShieldCheck, ArrowRight } from "lucide-react"
import { getGoverningBodyMembers } from "@/lib/db"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"

export const dynamic = "force-dynamic"
export const revalidate = 60

const categoryTranslations: Record<string, string> = {
  President: "সভাপতি",
  VicePresident: "সহ-সভাপতি",
  Secretary: "সাধারণ সম্পাদক",
  Treasurer: "কোষাধ্যক্ষ",
  Auditor: "অডিটর",
  Chairman: "চেয়ারম্যান",
  Principal: "অধ্যক্ষ / সদস্য সচিব",
  Guardian: "অভিভাবক সদস্য",
  Teacher: "শিক্ষক প্রতিনিধি",
  Donor: "দাতা সদস্য",
  Nominee: "মনোনীত সদস্য",
}

function formatCategory(cat: string | null | undefined): string {
  if (!cat) return "পরিচালনা সদস্য"
  return categoryTranslations[cat] || cat
}

function isValidUrl(value: string | null | undefined) {
  if (!value) return false
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export default async function GoverningBodyPage() {
  const [governingBody, instituteSettings] = await Promise.all([
    getGoverningBodyMembers(),
    getInstituteSettings(),
  ])

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    ""

  const heroSubtitle = instituteName
    ? `${instituteName}-এর সার্বিক তত্ত্বাবধান, নীতি নির্ধারণ ও উন্নয়নে দায়িত্বপ্রাপ্ত সম্মানিত পরিচালনা পর্ষদ।`
    : "মাদ্রাসার সার্বিক তত্ত্বাবধান, নীতি নির্ধারণ ও উন্নয়নে দায়িত্বপ্রাপ্ত সম্মানিত পরিচালনা পর্ষদ।"

  return (
    <main className="bg-[#F7F8F5]">
      {/* 1. Public Standard Hero Banner */}
      <PublicHero
        title="সম্মানিত পরিচালনা পর্ষদ"
        subtitle={heroSubtitle}
        badgeText="পরিচালনা পর্ষদ ও ট্রাস্টি"
        badgeIcon={ShieldCheck}
        breadcrumbCurrent="পরিচালনা পর্ষদ"
      />

      {/* 2. Main Section with Members Grid & Watermark Pattern */}
      <section className="relative py-10 md:py-12 overflow-hidden">
        {/* Subtle Islamic Geometric Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="governing-islamic-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <path
                  d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,40 L6,35 L20,30 L14,16 L29,22 Z"
                  fill="none"
                  stroke="#075E54"
                  strokeWidth="1.2"
                />
                <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#governing-islamic-pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Members Grid */}
          {governingBody.length === 0 ? (
            <div className="card-appear rounded-2xl border border-dashed border-[#E2E7E4] bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F7F5] text-[#075E54]">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-[#17211E]">
                কোনো সদস্যের তথ্য পাওয়া যায়নি
              </h3>
              <p className="mt-1 text-[14.5px] text-[#5F6B67]">
                বর্তমানে পরিচালনা পর্ষদের সদস্য তালিকা প্রস্তুত করা হচ্ছে।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {governingBody.map((member, index) => {
                const isPresident =
                  (member.category || "").toLowerCase() === "president" ||
                  (member.designation || "").includes("সভাপতি")
                const isPrincipal =
                  (member.category || "").toLowerCase() === "principal" ||
                  (member.designation || "").includes("অধ্যক্ষ")

                return (
                  <div
                    key={member.id}
                    style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
                    className="card-appear group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white shadow-xs transition-colors duration-200 hover:border-[#075E54]/40 hover:shadow-md"
                  >
                    {/* Card Content Top Section */}
                    <div className="p-5 pb-3">
                      {/* Photo Container with Rounded frame */}
                      <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl border-2 border-[#E2E7E4] bg-[#F7F8F5] p-1 shadow-2xs group-hover:border-[#075E54]/30 transition-colors">
                        <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-100">
                          {isValidUrl(member.image_url) ? (
                            <Image
                              src={member.image_url as string}
                              alt={member.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              unoptimized
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#F0F7F5] text-[#075E54]">
                              <Users className="h-10 w-10 opacity-40" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Member Information */}
                      <div className="mt-4 text-center space-y-2">
                        <h3 className="font-heading text-[17.5px] font-bold text-[#17211E] group-hover:text-[#075E54] transition-colors line-clamp-1 leading-snug">
                          {member.name}
                        </h3>

                        {/* Category / Role Badge */}
                        <div>
                          <span className="inline-flex items-center rounded-full bg-[#F0F7F5] border border-[#075E54]/15 px-3 py-0.5 text-[12.5px] font-semibold text-[#075E54] line-clamp-1">
                            {formatCategory(member.category)}
                          </span>
                        </div>

                        {/* Designation if different from category */}
                        {member.designation && member.designation !== member.category && (
                          <p className="text-[13px] font-medium text-[#5F6B67] line-clamp-1">
                            {member.designation}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: Quick Contact Actions & Leadership Speech Link */}
                    <div className="mt-2 border-t border-[#E2E7E4] bg-[#F7F8F5]/60 px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        {/* Contact Action Icons */}
                        <div className="flex items-center gap-1.5">
                          {member.phone && (
                            <a
                              href={`tel:${member.phone}`}
                              title={`কল করুন: ${member.phone}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E7E4] bg-white text-[#075E54] transition-colors duration-200 hover:bg-[#075E54] hover:text-white hover:border-[#075E54] shadow-2xs"
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                          )}

                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              title={`ইমেইল: ${member.email}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E7E4] bg-white text-[#B68A18] transition-colors duration-200 hover:bg-[#B68A18] hover:text-white hover:border-[#B68A18] shadow-2xs"
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </a>
                          )}

                          {!member.phone && !member.email && (
                            <span className="text-[12.5px] font-medium text-[#5F6B67]">
                              পরিচালনা পর্ষদ
                            </span>
                          )}
                        </div>

                        {/* Leadership Message Link if President/Principal */}
                        {isPresident ? (
                          <Link
                            href="/leadership/president"
                            className="inline-flex items-center gap-1 rounded-lg bg-white border border-[#075E54]/20 px-2.5 py-1.5 text-[12.5px] font-semibold text-[#075E54] transition-colors duration-200 hover:bg-[#075E54] hover:text-white shadow-2xs ml-auto"
                          >
                            <span>বাণী দেখুন</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : isPrincipal ? (
                          <Link
                            href="/leadership/headmaster"
                            className="inline-flex items-center gap-1 rounded-lg bg-white border border-[#075E54]/20 px-2.5 py-1.5 text-[12.5px] font-semibold text-[#075E54] transition-colors duration-200 hover:bg-[#075E54] hover:text-white shadow-2xs ml-auto"
                          >
                            <span>বাণী দেখুন</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Institutional Governance Banner (Solid color, compact bottom) */}
          <div className="rounded-3xl border border-[#B68A18]/40 bg-[#064A42] p-6 sm:p-8 text-white shadow-xs">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B68A18]/40 bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-[#B68A18]">
                <ShieldCheck className="h-4 w-4 text-[#B68A18]" />
                <span>প্রাতিষ্ঠানিক সুশাসন ও দায়বদ্ধতা</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                দক্ষ নেতৃত্ব ও সুশৃঙ্খল প্রাতিষ্ঠানিক পরিচালনা
              </h2>
              <p className="text-[15px] leading-relaxed text-[#DCEEE9]">
                সম্মানিত পরিচালনা পর্ষদ মাদ্রাসার স্বচ্ছ প্রশাসন, কৌশলগত নেতৃত্ব, শিক্ষা নীতির সঠিক বাস্তবায়ন এবং শিক্ষার্থীদের দ্বীনি ও নৈতিক বিকাশে সার্বক্ষণিক দিকনির্দেশনা প্রদান করে থাকে।
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
