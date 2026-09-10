import Link from "next/link"
import {
  ShieldCheck,
  BookOpen,
  Landmark,
  Users,
  FileText,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Laptop,
  Moon,
  HeartHandshake,
  Scale,
  Sparkles,
  HelpCircle,
} from "lucide-react"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"

export const dynamic = "force-dynamic"
export const revalidate = 60

type PolicyDoc = {
  title: string
  description: string
  category: string
  icon: typeof FileText
  badgeTone: "green" | "gold" | "evergreen"
}

const policies: PolicyDoc[] = [
  {
    title: "শিক্ষার্থীদের সাধারণ আচরণবিধি ও পোষাকনীতি",
    description:
      "মাদ্রাসা ক্যাম্পাসে নির্ধারিত মার্জিত ইসলামী পোষাক পরিধান, সুন্নতি তাহযীব বজায় রাখা, শিক্ষকদের প্রতি সর্বোচ্চ সম্মান প্রদর্শন এবং সহপাঠীদের সাথে সৌহার্দ্যপূর্ণ আচরণ নিশ্চিত করার সুনির্দিষ্ট নির্দেশনা।",
    category: "শিক্ষার্থী আচরণবিধি",
    icon: GraduationCap,
    badgeTone: "green",
  },
  {
    title: "উপস্থিতি ও ছুটি সংক্রান্ত নীতিমালা",
    description:
      "নিয়মিত পাঠদানে ন্যূনতম ৮০% উপস্থিতি বাধ্যতামূলক। যৌক্তিক কারণে ছুটির প্রয়োজনে অভিভাবকের স্বাক্ষরসহ অগ্রিম লিখিত দরখাস্ত প্রদান এবং ধারাবাহিক অনুপস্থিতির ক্ষেত্রে কঠোর প্রশাসনিক ব্যবস্থার বিধান।",
    category: "একাডেমিক শৃঙ্খলা",
    icon: BookOpen,
    badgeTone: "evergreen",
  },
  {
    title: "পরীক্ষা, ধারাবাহিক মূল্যায়ন ও প্রমোশন বিধান",
    description:
      "অর্ধবার্ষিক, বার্ষিক, প্রাক-নির্বাচনী ও মডেল টেস্ট পরীক্ষা গ্রহণ, বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের গ্রেডিং পদ্ধতিতে ফলাফল প্রণয়ন এবং পরবর্তী শ্রেণিতে উত্তীর্ণ হওয়ার সুনির্দিষ্ট মানদণ্ড।",
    category: "পরীক্ষা ও মূল্যায়ন",
    icon: Scale,
    badgeTone: "gold",
  },
  {
    title: "হিফজুল কুরআন ও সান্ধ্যকালীন পাঠদান গাইডলাইন",
    description:
      "আন্তর্জাতিক মানসম্পন্ন তাজবীদ সহকারে হিফজ শাখার শিক্ষার্থীদের দৈনিক সবক, আমপারা ও দাওর তদারকি এবং দক্ষ শিক্ষকদের তত্ত্বাবধানে সান্ধ্যকালীন বিশেষ পাঠদান কার্যক্রমের নিয়মাবলি।",
    category: "হিফজ ও বিশেষ ক্লাস",
    icon: Moon,
    badgeTone: "green",
  },
  {
    title: "ডিজিটাল ল্যাব ও আধুনিক কম্পিউটার ব্যবহার নির্দেশিকা",
    description:
      "তথ্যপ্রযুক্তি ল্যাবে কম্পিউটার, প্রজেক্টর ও মাল্টিমিডিয়া প্রযুক্তির দায়িত্বশীল, সুশৃঙ্খল ও কেবলমাত্র শিক্ষণীয় ব্যবহার সংক্রান্ত নিরাপত্তা ও আচরণ নীতিমালা।",
    category: "আইসিটি ও ল্যাব",
    icon: Laptop,
    badgeTone: "evergreen",
  },
  {
    title: "ক্যাম্পাস শৃঙ্খলা রক্ষা ও র‍্যাগিং-বুলিং প্রতিরোধ",
    description:
      "ক্যাম্পাসে যেকোনো প্রকার অশোভন আচরণ, র‍্যাগিং, গালিগালাজ বা বৈষম্য সম্পূর্ণরূপে নিষিদ্ধ। সকল শিক্ষার্থীর জন্য নিরাপদ, সৌহার্দ্যপূর্ণ ও নৈতিক পরিবেশ বজায় রাখতে সার্বক্ষণিক মনিটরিং ব্যবস্থা।",
    category: "শৃঙ্খলা ও নিরাপত্তা",
    icon: ShieldCheck,
    badgeTone: "gold",
  },
  {
    title: "মাসিক বেতন, ফি ও বিশেষ শিক্ষাবৃত্তি নীতিমালা",
    description:
      "সময়মতো মাসিক টিউশন ফি পরিশোধের নিয়মাবলি এবং এতিম, গরীব ও অসচ্ছল মেধাবী শিক্ষার্থীদের জন্য বিশেষ আর্থিক ছাড় ও প্রাতিষ্ঠানিক শিক্ষাবৃত্তি প্রদানের নীতিমালা।",
    category: "আর্থিক ও বৃত্তি",
    icon: HeartHandshake,
    badgeTone: "green",
  },
  {
    title: "অভিভাবক-শিক্ষক মতবিনিময় ও প্রশাসনিক সমন্বয়",
    description:
      "শিক্ষার্থীর সার্বিক বিকাশ ও মেধা মূল্যায়নের লক্ষ্যে নিয়মিত অভিভাবক সমাবেশ আয়োজন এবং প্রাতিষ্ঠানিক মানোন্নয়নে সম্মানিত অভিভাবকদের গঠনমূলক পরামর্শ গ্রহণের সুশৃঙ্খল প্রক্রিয়া।",
    category: "প্রশাসন ও অভিভাবক",
    icon: Users,
    badgeTone: "evergreen",
  },
]

export default async function PoliciesPage() {
  const instituteSettings = await getInstituteSettings()

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা"

  const heroSubtitle = `${instituteName}-এর একাডেমিক নীতিমালা, শিক্ষার্থী আচরণবিধি, শৃঙ্খলা ও প্রশাসনিক নির্দেশিকাসমূহ।`

  return (
    <main className="bg-[#F7F8F5]">
      {/* 1. Public Standard Hero Banner */}
      <PublicHero
        title="প্রাতিষ্ঠানিক নীতিমালা ও আচরণবিধি"
        subtitle={heroSubtitle}
        badgeText="নীতিমালা ও শৃঙ্খলা"
        badgeIcon={ShieldCheck}
        breadcrumbCurrent="নীতিমালা"
      />

      {/* 2. Main Section */}
      <section className="relative py-10 md:py-12 overflow-hidden">
        {/* Subtle Islamic Geometric Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="policies-islamic-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <path
                  d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,40 L6,35 L20,30 L14,16 L29,22 Z"
                  fill="none"
                  stroke="#075E54"
                  strokeWidth="1.2"
                />
                <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#policies-islamic-pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-12">
          
          {/* Section A: 3 Top Core Governance Pillars */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-7 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#17211E]">
                  একাডেমিক শৃঙ্খলা ও পাঠদান
                </h3>
                <p className="text-[14px] leading-relaxed text-[#5F6B67]">
                  পাঠ্যসূচি অনুসরণ, নিয়মিত ক্লাস উপস্থিতি, পরীক্ষা ও মূল্যায়নের স্বচ্ছ প্রাতিষ্ঠানিক নীতিমালা।
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-7 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#17211E]">
                  নৈতিক আচরণ ও নিরাপত্তা
                </h3>
                <p className="text-[14px] leading-relaxed text-[#5F6B67]">
                  সুন্নতি তাহযীব, চারিত্রিক শুদ্ধতা, পারস্পরিক সম্মানবোধ ও নিরাপদ ক্যাম্পাস পরিবেশের নিশ্চয়তা।
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-7 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                  <Landmark className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#17211E]">
                  সুশাসন ও প্রাতিষ্ঠানিক পরিচালনা
                </h3>
                <p className="text-[14px] leading-relaxed text-[#5F6B67]">
                  বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের বিধিমালা ও গভর্নিং বডির সুনির্দিষ্ট নির্দেশনার যথাযথ বাস্তবায়ন।
                </p>
              </div>
            </div>
          </div>

          {/* Section B: Policies List Grid */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-3.5 py-1 text-[13px] font-semibold text-[#075E54]">
                <Sparkles className="h-3.5 w-3.5 text-[#075E54]" />
                <span>সুনির্দিষ্ট নিয়মাবলি</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E]">
                নীতিমালা ও প্রাতিষ্ঠানিক নির্দেশিকাসমূহ
              </h2>
              <p className="text-[15px] text-[#5F6B67]">
                মাদ্রাসার শৃঙ্খলা, পাঠদান ও সার্বিক পরিবেশ অক্ষুণ্ণ রাখতে নির্ধারিত বিধানাবলি
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {policies.map((policy, idx) => {
                const Icon = policy.icon
                return (
                  <div
                    key={idx}
                    className="card-appear rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#075E54]/40 hover:shadow-md transition-all"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/15 shadow-2xs">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-3 py-0.5 text-[12px] font-semibold text-[#075E54]">
                          {policy.category}
                        </span>
                      </div>

                      <h3 className="font-heading text-[17.5px] font-bold text-[#17211E] leading-snug">
                        {policy.title}
                      </h3>

                      <p className="text-[14.5px] leading-relaxed text-[#5F6B67]">
                        {policy.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E2E7E4]/60 flex items-center justify-between text-[13px]">
                      <span className="text-[#075E54] font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>প্রযোজ্য ও কার্যকর</span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section C: Footnote Callout Box */}
          <div className="rounded-3xl border border-[#B68A18]/40 bg-[#FFFDF5] p-6 sm:p-8 border-l-8 border-l-[#B68A18] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B68A18]/15 text-[#B68A18]">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block rounded-full bg-[#B68A18] px-3 py-0.5 text-[12px] font-bold text-white">
                    বিশেষ জ্ঞাতব্য
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#17211E]">
                    প্রিন্ট কপি বা সত্যায়িত নীতিমালার জন্য যোগাযোগ
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#5F6B67]">
                    নীতিমালার মুদ্রিত কপি কিংবা প্রাতিষ্ঠানিক নির্দেশিকা সংক্রান্ত যেকোনো তথ্যের জন্য মাদ্রাসা কার্যালয়ে সরাসরি যোগাযোগ করার জন্য অনুরোধ করা যাচ্ছে।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Closing CTA Banner (Solid Evergreen) */}
          <div className="rounded-3xl border border-[#B68A18]/40 bg-[#064A42] p-8 sm:p-10 text-white text-center space-y-5 shadow-xs">
            <div className="max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B68A18]/40 bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-[#B68A18]">
                <GraduationCap className="h-4 w-4 text-[#B68A18]" />
                <span>সুশৃঙ্খল দ্বীনি ক্যাম্পাস</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                দ্বীনি তাহযীব ও আধুনিক শিক্ষায় আপনার সন্তানের আদর্শ শিক্ষা
              </h2>
              <p className="text-[15px] leading-relaxed text-[#DCEEE9]">
                ভর্তি তথ্য, সিলেবাস কিংবা সার্বিক প্রাতিষ্ঠানিক নির্দেশিকা সম্পর্কে জানতে আমাদের সাথে যোগাযোগ করুন।
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
