import Link from "next/link"
import {
  Landmark,
  School,
  CalendarDays,
  BadgeCheck,
  Laptop,
  Trophy,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Building2,
  Phone,
  MapPin,
} from "lucide-react"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"

export const dynamic = "force-dynamic"
export const revalidate = 60

const timeline = [
  {
    year: "১৯৬৫",
    title: "মাদ্রাসার ঐতিহাসিক প্রতিষ্ঠা ও শুভ সূচনা",
    description:
      "১২ ফেব্রুয়ারি ১৯৬৫ খ্রিষ্টাব্দে চট্টগ্রাম মহানগরীর চান্দগাঁও থানাধীন পূর্ব ষোলশহর এলাকায় দ্বীনি তাহযীব ও নৈতিক শিক্ষার প্রসারে ওয়াসিয়া আহমদিয়া সুন্নিয়া মাদ্রাসার শুভ সূচনা হয়।",
  },
  {
    year: "২০০৯",
    title: "বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের আনুষ্ঠানিক স্বীকৃতি",
    description:
      "১ জানুয়ারি ২০০৯ খ্রিষ্টাব্দে বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড কর্তৃক প্রাতিষ্ঠানিক আনুষ্ঠানিক স্বীকৃতি লাভ এবং একাডেমিক কার্যক্রমের নবদিগন্ত উন্মোচন।",
  },
  {
    year: "২০১০–২০১৫",
    title: "একাডেমিক শাখা ও বিজ্ঞান-মানবিক বিস্তার",
    description:
      "বিজ্ঞান (Science), মানবিক (Humanities) এবং ব্যবসায় শিক্ষা (Business Studies) শাখাসহ সমন্বিত দ্বীনি ও আধুনিক শিক্ষাক্রমের পূর্ণাঙ্গ রূপায়ন।",
  },
  {
    year: "২০১৯",
    title: "শিক্ষা বোর্ডের প্রাতিষ্ঠানিক কোড ও এমপিওভুক্তি",
    description:
      "সরকারি শিক্ষা বোর্ডের অধীনে EIIN: ১০৪২৩৩ এবং মাদ্রাসা কোড: ২০১৮৮ তালিকাভুক্তি ও প্রাতিষ্ঠানিক সক্ষমতা বৃদ্ধি।",
  },
  {
    year: "২০২৬–বর্তমান",
    title: "আলিম ১ম বর্ষ (আবাসিক/অনাবাসিক) ও স্মার্ট মাদ্রাসা",
    description:
      "২০২৬-২৭ শিক্ষাবর্ষে আলিম ১ম বর্ষে আবাসিক ও অনাবাসিক শাখায় ভর্তি, আধুনিক ডিজিটাল কম্পিউটার ল্যাব ও সান্ধ্যকালীন বিশেষ পাঠদান কার্যক্রম চালু।",
  },
]

const achievements = [
  "১৯৬৫ সাল থেকে অর্ধশতাব্দীরও বেশি সময় ধরে গৌরবময় দ্বীনি শিক্ষাসেবা",
  "বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড কর্তৃক আনুষ্ঠানিকভাবে স্বীকৃত (EIIN: ১০৪২৩৩)",
  "বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা শাখায় মানসম্মত শিক্ষাদান",
  "আন্তর্জাতিক মানসম্পন্ন হিফজুল কুরআন ও আরবি ব্যাকরণ বিশেষ কোর্স",
  "আধুনিক ডিজিটাল কম্পিউটার ল্যাব ও মাল্টিমিডিয়া ক্লাসরুম",
  "এতিম, গরীব ও অসচ্ছল মেধাবী শিক্ষার্থীদের জন্য বিশেষ শিক্ষাবৃত্তি সুবিধা",
]

const highlights = [
  {
    icon: School,
    title: "প্রতিষ্ঠাকাল",
    value: "১২ ফেব্রুয়ারি ১৯৬৫",
    subtitle: "প্রায় ছয় দশকের ঐতিহ্য",
  },
  {
    icon: BadgeCheck,
    title: "সরকারি স্বীকৃতি",
    value: "১ জানুয়ারি ২০০৯",
    subtitle: "মাদ্রাসা শিক্ষা বোর্ড",
  },
  {
    icon: GraduationCap,
    title: "প্রাতিষ্ঠানিক পরিচিতি",
    value: "EIIN: ১০৪২৩৩",
    subtitle: "মাদ্রাসা কোড: ২০১৮৮",
  },
  {
    icon: Laptop,
    title: "শিক্ষার বিভাগসমূহ",
    value: "বিজ্ঞান • মানবিক • ব্যবসায়",
    subtitle: "আলিম ও হিফজ বিভাগ",
  },
]

export default async function HistoryPage() {
  const instituteSettings = await getInstituteSettings()

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা"

  const heroSubtitle = `${instituteName}-এর গৌরবময় দ্বীনি ঐতিহ্য, ১৯৬৫ সাল থেকে ঐতিহাসিক মাইলফলক ও প্রাতিষ্ঠানিক পথচলা।`

  return (
    <main className="bg-[#F7F8F5]">
      {/* 1. Public Standard Hero Banner */}
      <PublicHero
        title="মাদ্রাসার সংক্ষিপ্ত ইতিহাস ও ঐতিহ্য"
        subtitle={heroSubtitle}
        badgeText="ঐতিহ্য ও ইতিহাস"
        badgeIcon={Landmark}
        breadcrumbCurrent="ইতিহাস"
      />

      {/* 2. Main Section */}
      <section className="relative py-10 md:py-12 overflow-hidden">
        {/* Subtle Islamic Geometric Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="history-islamic-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <path
                  d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,40 L6,35 L20,30 L14,16 L29,22 Z"
                  fill="none"
                  stroke="#075E54"
                  strokeWidth="1.2"
                />
                <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#history-islamic-pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-12">
          
          {/* Story Intro Card */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 rounded-3xl border border-[#B68A18]/40 bg-[#064A42] p-8 text-white shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#B68A18] border border-[#B68A18]/30">
                  <Landmark className="h-6 w-6" />
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-snug">
                  ছয় দশকের দ্বীনি ইলম ও আলোর মশাল
                </h2>
                <p className="text-[14.5px] leading-relaxed text-[#DCEEE9]">
                  ১৯৬৫ সাল থেকে বন্দরনগরী চট্টগ্রামের চান্দগাঁও এলাকায় দ্বীনি তাহযীব ও আধুনিক শিক্ষার সমন্বয়ে আদর্শ আলেম ও সুনাগরিক গড়ে তোলার নিরবচ্ছিন্ন প্রয়াস।
                </p>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="text-[13px] font-medium text-[#B68A18]">
                  • ইসলামী ও আধুনিক শিক্ষাই আমাদের বৈশিষ্ট্য
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-3xl border border-[#E2E7E4] bg-white p-8 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-3.5 py-1 text-[13px] font-semibold text-[#075E54]">
                  <Sparkles className="h-3.5 w-3.5 text-[#075E54]" />
                  <span>পটভূমি ও লক্ষ্য</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#17211E]">
                  প্রতিষ্ঠার প্রেক্ষাপট ও প্রাতিষ্ঠানিক বিস্তার
                </h3>
                <p className="text-[15px] leading-relaxed text-[#5F6B67]">
                  চট্টগ্রামের চান্দগাঁও থানাধীন পূর্ব ষোলশহরের খাজা রোড (বাদামতল) এলাকায় ১২ ফেব্রুয়ারি ১৯৬৫ খ্রিষ্টাব্দে অত্র মাদ্রাসাটি প্রতিষ্ঠিত হয়। পরবর্তীতে ১ জানুয়ারি ২০০৯ খ্রিষ্টাব্দে বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড কর্তৃক আনুষ্ঠানিক স্বীকৃতি লাভ করে এবং বর্তমানে EIIN নম্বর ১০৪২৩৩ ও মাদ্রাসা কোড ২০১৮৮ নিয়ে পরিচালিত হচ্ছে।
                </p>
                <p className="text-[15px] leading-relaxed text-[#5F6B67]">
                  মাদ্রাসায় ইবতেদায়ী, দাখিল ও আলিম স্তরে বিজ্ঞান (Science), মানবিক (Humanities) ও ব্যবসায় শিক্ষা (Business Studies) শাখার পাশাপাশি আন্তর্জাতিক মানসম্পন্ন হিফজুল কুরআন বিভাগ রয়েছে।
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics 4-Card Row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="card-appear rounded-2xl border border-[#E2E7E4] bg-white p-6 shadow-xs flex flex-col justify-between"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/15">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="mt-4 block text-[13px] font-semibold uppercase tracking-wider text-[#5F6B67]">
                      {item.title}
                    </span>
                    <h3 className="mt-1 font-heading text-xl font-bold text-[#17211E]">
                      {item.value}
                    </h3>
                    <p className="mt-1 text-[13.5px] text-[#075E54] font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Chronological Milestones Centered Timeline */}
          <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 md:p-10 shadow-xs space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-3.5 py-1 text-[13px] font-semibold text-[#075E54]">
                <CalendarDays className="h-3.5 w-3.5 text-[#075E54]" />
                <span>মাইলফলক ও অর্জন</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E]">
                ঐতিহাসিক অগ্রযাত্রার সময়রেখা
              </h2>
              <p className="text-[15px] text-[#5F6B67]">
                ১৯৬৫ সাল থেকে বর্তমান— আমাদের ধারাবাহিক সাফল্য ও সম্প্রসারণ
              </p>
            </div>

            {/* Centered Timeline Bar & Alternating Cards */}
            <div className="relative py-4">
              {/* Central vertical timeline bar */}
              <div className="absolute left-5 sm:left-6 md:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-[#075E54]/25" />

              <div className="space-y-8 md:space-y-12">
                {timeline.map((item, idx) => {
                  const isEven = idx % 2 === 0

                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col md:flex-row items-start"
                    >
                      {/* Central Timeline Dot */}
                      <div className="absolute left-5 sm:left-6 md:left-1/2 -translate-x-1/2 top-5 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[#075E54] shadow-sm z-10">
                        <div className="h-2 w-2 rounded-full bg-[#B68A18]" />
                      </div>

                      {/* Card Container */}
                      <div
                        className={`w-full pl-12 sm:pl-14 md:pl-0 ${
                          isEven
                            ? "md:w-1/2 md:pr-10 lg:pr-12 md:text-right"
                            : "md:w-1/2 md:pl-10 lg:pl-12 md:ml-auto md:text-left"
                        }`}
                      >
                        <div className="rounded-2xl border border-[#E2E7E4] bg-white p-5 sm:p-6 shadow-xs hover:border-[#075E54]/40 hover:shadow-md transition-all space-y-2 text-left">
                          <div
                            className={`flex items-center gap-2 ${
                              isEven ? "md:justify-end" : "md:justify-start"
                            }`}
                          >
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#075E54] px-3.5 py-0.5 text-[12.5px] font-bold text-white shadow-2xs font-heading">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#B68A18]" />
                              <span>{item.year}</span>
                            </span>
                          </div>
                          <h3 className="font-heading text-[17.5px] font-bold text-[#17211E] leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-[14px] leading-relaxed text-[#5F6B67]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Achievements + Culture & Values Split Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            {/* Left: Key Achievements */}
            <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#17211E]">
                    প্রধান প্রাতিষ্ঠানিক অর্জনসমূহ
                  </h3>
                  <p className="text-[13.5px] text-[#5F6B67]">
                    ধারাবাহিক মেধা ও অবকাঠামোগত সমৃদ্ধি
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {achievements.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl bg-[#F7F8F5] p-3.5 border border-[#E2E7E4]/70">
                    <BadgeCheck className="h-5 w-5 text-[#075E54] shrink-0 mt-0.5" />
                    <span className="text-[14.5px] font-medium text-[#17211E] leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Institutional Culture & Values */}
            <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#17211E]">
                    আদর্শ ও সামাজিক দায়বদ্ধতা
                  </h3>
                  <p className="text-[13.5px] text-[#5F6B67]">
                    নৈতিক মূল্যবোধ ও আলোকিত সমাজ গঠন
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 pt-1">
                <div className="rounded-xl bg-[#F7F8F5] p-4 border border-[#E2E7E4]/70 space-y-1">
                  <h4 className="font-heading text-[15.5px] font-bold text-[#17211E] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#075E54]" />
                    দ্বীনি ইলম ও আমলের সমন্বয়
                  </h4>
                  <p className="text-[14px] text-[#5F6B67] leading-relaxed">
                    সহীহ কুরআন তিলাওয়াত, তাজবীদ, আকাইদ ও ফিকাহ শাস্ত্রের বিশুদ্ধ চর্চা নিশ্চিতকরণ।
                  </p>
                </div>

                <div className="rounded-xl bg-[#F7F8F5] p-4 border border-[#E2E7E4]/70 space-y-1">
                  <h4 className="font-heading text-[15.5px] font-bold text-[#17211E] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#075E54]" />
                    বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা
                  </h4>
                  <p className="text-[14px] text-[#5F6B67] leading-relaxed">
                    আধুনিক জাতীয় শিক্ষাক্রমের সাথে সমন্বয় করে তিনটি প্রধান শাখায় মানসম্মত পাঠদান।
                  </p>
                </div>

                <div className="rounded-xl bg-[#F7F8F5] p-4 border border-[#E2E7E4]/70 space-y-1">
                  <h4 className="font-heading text-[15.5px] font-bold text-[#17211E] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#075E54]" />
                    আধুনিক প্রযুক্তি ও ভাষা দক্ষতা
                  </h4>
                  <p className="text-[14px] text-[#5F6B67] leading-relaxed">
                    ডিজিটাল ল্যাবে কম্পিউটার প্রশিক্ষণ ও আরবি-ইংরেজি ভাষা দক্ষতা বৃদ্ধি।
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Section 5: Closing CTA Callout (Solid Evergreen) */}
          <div className="rounded-3xl border border-[#B68A18]/40 bg-[#064A42] p-8 sm:p-10 text-white text-center space-y-5 shadow-xs">
            <div className="max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B68A18]/40 bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-[#B68A18]">
                <GraduationCap className="h-4 w-4 text-[#B68A18]" />
                <span>ঐতিহ্যের ধারক ও বাহক</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                আমাদের অগ্রযাত্রায় আপনিও অংশীদার হোন
              </h2>
              <p className="text-[15px] leading-relaxed text-[#DCEEE9]">
                ভর্তি তথ্য, একাডেমিক কার্যক্রম কিংবা মাদ্রাসার সার্বিক উন্নয়নে যেকোনো পরামর্শ ও সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করুন।
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/admission"
                className="inline-flex items-center gap-2 rounded-xl bg-[#075E54] px-5 py-2.5 text-[14.5px] font-bold text-white border border-[#B68A18]/30 shadow-xs hover:bg-[#064A42] transition-colors"
              >
                <span>ভর্তি সংক্রান্ত তথ্য</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-[14.5px] font-semibold text-white hover:bg-white/20 transition-colors"
              >
                <span>যোগাযোগ করুন</span>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}