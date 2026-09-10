import Link from "next/link"
import {
  GraduationCap,
  HeartHandshake,
  BookOpen,
  ShieldCheck,
  Trophy,
  Phone,
  ArrowRight,
  Laptop,
  Languages,
  Moon,
  Building2,
  CheckCircle2,
  HelpCircle,
  LogIn,
  Library,
} from "lucide-react"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"

export const dynamic = "force-dynamic"
export const revalidate = 60

const supportServices = [
  {
    icon: BookOpen,
    title: "একাডেমিক নিবিড় তত্ত্বাবধান",
    description: "প্রতিটি শিক্ষার্থীর পড়াশোনার অগ্রগতি নিয়মিত মূল্যায়ন, বিষয়ভিত্তিক বিশেষ দিকনির্দেশনা ও শিক্ষক পরামর্শ।",
  },
  {
    icon: Moon,
    title: "সান্ধ্যকালীন বিশেষ পাঠদান",
    description: "আবাসিক ও অনাবাসিক শিক্ষার্থীদের উপযুক্ত আলেমেদ্বীন ও দক্ষ নাগরিক হিসেবে গড়ে তুলতে সান্ধ্যকালীন তত্ত্বাবধান।",
  },
  {
    icon: Languages,
    title: "ভাষা ও দক্ষতা উন্নয়ন",
    description: "বিশুদ্ধ কুরআন তিলাওয়াত, আরবি ব্যাকরণ চর্চা ও আধুনিক কম্পিউটার প্রযুক্তির ব্যবহারিক প্রশিক্ষণ।",
  },
  {
    icon: ShieldCheck,
    title: "শৃঙ্খলা ও নিরাপদ পরিবেশ",
    description: "সুশৃঙ্খল ইসলামিক অনুশাসন, সর্বোচ্চ নিরাপত্তা এবং শিক্ষার্থীদের জন্য সম্পূর্ণ রাজনীতি ও ধূমপানমুক্ত পরিবেশ।",
  },
]

const activities = [
  "সাপ্তাহিক কিরাত, হামদ-নাত ও আজান প্রতিযোগিতা",
  "বিতর্ক প্রতিযোগিতা ও সাধারণ জ্ঞান আসর",
  "বার্ষিক ক্রীড়া ও শারীরিক সক্ষমতা উন্নয়ন",
  "স্কাউট ও রেড ক্রিসেন্ট সমাজসেবামূলক কার্যক্রম",
  "ইসলামিক ক্যালিগ্রাফি ও সাহিত্য চর্চা",
  "জাতীয় ও আন্তর্জাতিক দিবসসমূহ যথাযথ মর্যাদায় উদযাপন",
]

const facilities = [
  "আধুনিক কম্পিউটার ও ডিজিটাল আইসিটি ল্যাব",
  "সমৃদ্ধ ইসলামিক পাঠাগার ও গবেষণা কিতাবখানা",
  "মাল্টিমিডিয়া প্রজেক্টর সম্বলিত আধুনিক ক্লাসরুম",
  "মনোরম ও উন্মুক্ত খেলার মাঠ",
  "আবাসিক শিক্ষার্থীদের জন্য সুব্যবস্থাপনাযুক্ত হোস্টেল",
  "নিয়মিত প্রাথমিক স্বাস্থ্যসেবা ও ফার্স্ট এইড সুবিধা",
]

export default async function StudentsPage() {
  const instituteSettings = await getInstituteSettings()

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    ""

  const contactPhone =
    instituteSettings.contact.mobile?.trim() ||
    instituteSettings.contact.telephone?.trim() ||
    "+৮৮০১৭০০-০০০০০০"

  const heroSubtitle = instituteName
    ? `${instituteName}-এর শিক্ষার্থীদের দ্বীনি ও আধুনিক শিক্ষার সুযোগ-সুবিধা, সহ-শিক্ষা কার্যক্রম ও কল্যাণমূলক সেবা।`
    : "শিক্ষার্থীদের দ্বীনি ও আধুনিক শিক্ষার সুযোগ-সুবিধা, সহ-শিক্ষা কার্যক্রম ও কল্যাণমূলক সেবা।"

  return (
    <main className="bg-[#F7F8F5]">
      {/* 1. Public Standard Hero Banner */}
      <PublicHero
        title="শিক্ষার্থী কল্যাণ ও সেবা"
        subtitle={heroSubtitle}
        badgeText="শিক্ষার্থী সেবা ও সুবিধা"
        badgeIcon={GraduationCap}
        breadcrumbCurrent="শিক্ষার্থী সেবা"
      />

      {/* 2. Main Section with Islamic Watermark */}
      <section className="relative py-10 md:py-12 overflow-hidden">
        {/* Subtle Islamic Geometric Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="students-islamic-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <path
                  d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,40 L6,35 L20,30 L14,16 L29,22 Z"
                  fill="none"
                  stroke="#075E54"
                  strokeWidth="1.2"
                />
                <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#students-islamic-pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-12">
          
          {/* Section 1: Quick Highlights 4-Cards Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-appear rounded-2xl border border-[#E2E7E4] bg-white p-6 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/15">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-[#17211E]">একাডেমিক সেবা</h3>
              <p className="mt-1 text-[14.5px] text-[#5F6B67]">পরিকল্পিত সিলেবাস, পাঠদান ও নিয়মিত পরীক্ষা</p>
            </div>

            <div className="card-appear rounded-2xl border border-[#E2E7E4] bg-white p-6 shadow-xs" style={{ animationDelay: "60ms" }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/15">
                <Moon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-[#17211E]">সান্ধ্যকালীন ক্লাস</h3>
              <p className="mt-1 text-[14.5px] text-[#5F6B67]">দক্ষ শিক্ষকদের অধীনে নিয়মিত সান্ধ্যকালীন পাঠ</p>
            </div>

            <div className="card-appear rounded-2xl border border-[#E2E7E4] bg-white p-6 shadow-xs" style={{ animationDelay: "120ms" }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/15">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-[#17211E]">সহ-শিক্ষা ও ক্রীড়া</h3>
              <p className="mt-1 text-[14.5px] text-[#5F6B67]">সাপ্তাহিক প্রতিযোগিতা, কেরাত ও খেলাধুলা</p>
            </div>

            <div className="card-appear rounded-2xl border border-[#E2E7E4] bg-white p-6 shadow-xs" style={{ animationDelay: "180ms" }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/15">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-[#17211E]">অভিভাবক যোগাযোগ</h3>
              <a href={`tel:${contactPhone}`} className="mt-1 block text-[14.5px] font-bold text-[#075E54] hover:underline">
                {contactPhone}
              </a>
            </div>
          </div>

          {/* Section 2: Core Student Support Services */}
          <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 md:p-10 shadow-xs space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-3.5 py-1 text-[13px] font-semibold text-[#075E54]">
                <GraduationCap className="h-3.5 w-3.5 text-[#075E54]" />
                <span>সার্বিক পরিচর্যা ও সেবা</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E]">
                শিক্ষার্থী কল্যাণমূলক সেবাসমূহ
              </h2>
              <p className="text-[15px] text-[#5F6B67]">
                শিক্ষার্থীদের দ্বীনি, চারিত্রিক ও বুদ্ধিবৃত্তিক বিকাশে আমাদের বিশেষ উদ্যোগ
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {supportServices.map((s, idx) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.title}
                    style={{ animationDelay: `${idx * 60}ms` }}
                    className="card-appear rounded-2xl border border-[#E2E7E4] bg-[#F7F8F5]/80 p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#E2E7E4] text-[#075E54] shadow-2xs">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-heading text-[17px] font-bold text-[#17211E]">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-[#5F6B67]">
                        {s.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 3: Activities + Facilities Split Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            {/* Left: Co-curricular Activities */}
            <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-[#17211E]">
                    সহ-শিক্ষা কার্যক্রম
                  </h2>
                  <p className="text-[13.5px] text-[#5F6B67]">
                    সুপ্ত মেধার সর্বোচ্চ বিকাশ ও নেতৃত্বের চর্চা
                  </p>
                </div>
              </div>

              <ul className="space-y-3.5 pt-1">
                {activities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 rounded-xl bg-[#F7F8F5] p-3.5 border border-[#E2E7E4]/70">
                    <CheckCircle2 className="h-5 w-5 text-[#075E54] shrink-0 mt-0.5" />
                    <span className="text-[14.5px] font-medium text-[#17211E] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Institutional Facilities */}
            <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-[#17211E]">
                    ক্যাম্পাস সুযোগ-সুবিধাসমূহ
                  </h2>
                  <p className="text-[13.5px] text-[#5F6B67]">
                    আধুনিক ও মানসম্মত শিক্ষা অবকাঠামো
                  </p>
                </div>
              </div>

              <ul className="space-y-3.5 pt-1">
                {facilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 rounded-xl bg-[#F7F8F5] p-3.5 border border-[#E2E7E4]/70">
                    <CheckCircle2 className="h-5 w-5 text-[#075E54] shrink-0 mt-0.5" />
                    <span className="text-[14.5px] font-medium text-[#17211E] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 4: Special Scholarship Callout */}
          <div className="rounded-3xl border border-[#B68A18]/40 bg-[#FFFDF5] p-6 sm:p-8 border-l-8 border-l-[#B68A18] shadow-xs">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#B68A18]/15 text-[#B68A18]">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block rounded-full bg-[#B68A18] px-3 py-0.5 text-[12px] font-bold text-white">
                  বৃত্তি ও সহায়তা
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#17211E]">
                  এতিম, অসচ্ছল ও মেধাবী শিক্ষার্থীদের বিশেষ সুযোগ-সুবিধা
                </h3>
                <p className="text-[14.5px] leading-relaxed text-[#5F6B67]">
                  দ্বীনি শিক্ষার আলো সকলের মাঝে ছড়িয়ে দিতে অসচ্ছল, এতিম ও মেধার স্বাক্ষর রাখা শিক্ষার্থীদের জন্য মাদ্রাসার পক্ষ থেকে বিশেষ ছাড়, বৃত্তি এবং বিনা বেতনে পড়ার সুযোগ প্রদান করা হয়।
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Student Portal & Support CTA */}
          <div className="rounded-3xl border border-[#B68A18]/40 bg-[#064A42] p-8 sm:p-10 text-white text-center space-y-5 shadow-xs">
            <div className="max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B68A18]/40 bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-[#B68A18]">
                <HelpCircle className="h-4 w-4 text-[#B68A18]" />
                <span>শিক্ষার্থী সেবা ও তথ্য পোর্টাল</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                যেকোনো একাডেমিক ও শিক্ষার্থী সহায়তায় আমরা প্রস্তুত
              </h2>
              <p className="text-[15px] leading-relaxed text-[#DCEEE9]">
                পড়াশোনা, ফলাফল কিংবা পরীক্ষার রুটিন সংক্রান্ত তথ্যের জন্য সরাসরি অফিসে যোগাযোগ করুন অথবা স্টুডেন্ট পোর্টালে লগইন করুন।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/student/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#075E54] px-5 py-2.5 text-[14.5px] font-bold text-white border border-[#B68A18]/30 shadow-xs hover:bg-[#064A42] transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>স্টুডেন্ট পোর্টাল লগইন</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-[14.5px] font-semibold text-white hover:bg-white/20 transition-colors"
              >
                <span>যোগাযোগ করুন</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}