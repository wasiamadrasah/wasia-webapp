import Link from "next/link"
import {
  GraduationCap,
  Phone,
  ExternalLink,
  Laptop,
  Languages,
  Users,
  HeartHandshake,
  Trophy,
  Moon,
  Tv,
  Sparkles,
  MapPin,
  Building2,
  Globe,
  ArrowRight,
} from "lucide-react"
import { PublicHero } from "@/components/layout/public-hero"
import { createPageMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "২০২৬-২৭ সেশনের আলিম ১ম বর্ষে ভর্তি চলছে - ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা",
  description: "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসায় ২০২৬-২৭ সেশনে আলিম ১ম বর্ষে আবাসিক ও অনাবাসিক শাখায় ভর্তি চলছে। EIIN: 104233, মাদ্রাসা কোড: 20188।",
  path: "/admission",
  keywords: ["আলিম ১ম বর্ষে ভর্তি", "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা", "আবাসিক অনাবাসিক মাদ্রাসা", "xiclassadmission.gov.bd", "মাদ্রাসা ভর্তি ২০২৬-২৭"],
})

const features = [
  {
    icon: Users,
    title: "অভিজ্ঞ শিক্ষকমণ্ডলী দ্বারা পাঠদান",
    description: "অভিজ্ঞ, নিবেদিতপ্রাণ ও প্রশিক্ষণপ্রাপ্ত ওলামা এবং শিক্ষকমণ্ডলীর সার্বক্ষণিক নিবিড় পাঠদান।",
  },
  {
    icon: Moon,
    title: "সান্ধ্যকালীন বিশেষ ক্লাস",
    description: "উপযুক্ত আলেমেদ্বীন তৈরির লক্ষ্যে সুদক্ষ শিক্ষকদের তত্ত্বাবধানে নিয়মিত সান্ধ্যকালীন বিশেষ ক্লাস।",
  },
  {
    icon: Languages,
    title: "আরবি গ্রামার ও ভাষার বিশেষ কোর্স",
    description: "কুরআন-সুন্নাহর গভীর জ্ঞান অর্জনের জন্য আরবি ব্যাকরণ ও কথোপকথনের উপর বিশেষ কোর্সের ব্যবস্থা।",
  },
  {
    icon: Laptop,
    title: "ডিজিটাল ল্যাব ও কম্পিউটার প্রশিক্ষণ",
    description: "আধুনিক ডিজিটাল কম্পিউটার ল্যাবের মাধ্যমে ছাত্র-ছাত্রীদের তথ্যপ্রযুক্তি ও যুগোপযোগী প্রশিক্ষণ।",
  },
  {
    icon: Tv,
    title: "মাল্টিমিডিয়া ক্লাসরুম",
    description: "অডিও-ভিজ্যুয়াল প্রজেক্টরের মাধ্যমে প্রতিটি পাঠ সহজ ও আনন্দদায়কভাবে উপস্থাপন।",
  },
  {
    icon: HeartHandshake,
    title: "এতিম, গরীব ও মেধাবীদের বিশেষ সুবিধা",
    description: "এতিম, অসচ্ছল এবং মেধার স্বাক্ষর রাখা শিক্ষার্থীদের জন্য বিশেষ আর্থিক ছাড় ও সুযোগ-সুবিধা।",
  },
  {
    icon: Trophy,
    title: "সাপ্তাহিক প্রতিযোগিতা ও বিতর্ক",
    description: "শিক্ষার্থীদের সুপ্ত প্রতিভা বিকাশে কেরাত, হামদ-নাত, ক্বেরাত ও সাধারণ জ্ঞান প্রতিযোগিতা।",
  },
  {
    icon: Building2,
    title: "খেলার মাঠ ও মনোরম ক্যাম্পাস",
    description: "শারীরিক সুস্থতা ও মানসিক প্রফুল্লতার জন্য নিজস্ব খেলার মাঠ ও নিরিবিলি শিক্ষা পরিবেশ।",
  },
]

const helplines = [
  { phone: "০১৮৭৮-৯২৫৩২৫", tel: "01878925325" },
  { phone: "০১৮১২-৪৭১০৪০", tel: "01812471040" },
  { phone: "০১৭০১-০১৮৭২৬", tel: "01701018726" },
]

export default function AdmissionPage() {
  return (
    <main className="bg-[#F7F8F5]">
      {/* 1. Public Standard Hero Banner */}
      <PublicHero
        title="২০২৬-২৭ সেশনের আলিম ১ম বর্ষে ভর্তি চলছে"
        subtitle="ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা • EIIN: ১০৪২৩৩ • মাদ্রাসা কোড: ২০১৮৮"
        badgeText="ইসলামী ও আধুনিক শিক্ষাই আমাদের বৈশিষ্ট্য"
        badgeIcon={GraduationCap}
        breadcrumbCurrent="ভর্তি তথ্য"
      />

      {/* 2. Main Section */}
      <section className="relative py-10 md:py-12 overflow-hidden">
        {/* Subtle Islamic Geometric Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="admission-poster-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <path
                  d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,40 L6,35 L20,30 L14,16 L29,22 Z"
                  fill="none"
                  stroke="#075E54"
                  strokeWidth="1.2"
                />
                <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#admission-poster-pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10">
          
          {/* Top Clean Institutional Admission Announcement Card */}
          <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 md:p-9 shadow-xs">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              
              {/* Left Column: Admission Overview & Actions (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <p className="text-[13.5px] font-bold text-[#B68A18]">
                    বিসমিল্লাহির রাহমানির রাহিম • ইসলামী ও আধুনিক শিক্ষাই আমাদের বৈশিষ্ট্য
                  </p>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E]">
                    ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা
                  </h2>
                </div>

                <p className="text-[15px] leading-relaxed text-[#5F6B67]">
                  সুশিক্ষিত, আদর্শবান ও চরিত্রবান নাগরিক তৈরির লক্ষ্যে ২০২৬-২৭ শিক্ষাবর্ষে আলিম ১ম বর্ষে শিক্ষার্থী ভর্তি চলছে। দ্বীনি পরিবেশ, মানসম্মত পাঠদান ও সুদক্ষ ওলামায়ে কেরামের সার্বক্ষণিক তত্ত্বাবধানে পাঠদান নিশ্চিত করা হয়।
                </p>

                {/* Facility Tags */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#B68A18]/40 bg-[#FFFDF5] px-3.5 py-1.5 text-[13.5px] font-bold text-[#B68A18]">
                    <span className="h-2 w-2 rounded-full bg-[#B68A18]" />
                    <span>আবাসিক সুবিধা</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#075E54]/20 bg-[#F0F7F5] px-3.5 py-1.5 text-[13.5px] font-bold text-[#075E54]">
                    <span className="h-2 w-2 rounded-full bg-[#075E54]" />
                    <span>অনাবাসিক সুবিধা</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E7E4] bg-[#F7F8F5] px-3.5 py-1.5 text-[13.5px] font-semibold text-[#17211E]">
                    <span>সেশন: ২০২৬-২৭</span>
                  </span>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="http://www.xiclassadmission.gov.bd"
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#075E54] px-5 py-2.5 text-[14px] font-bold text-white shadow-xs hover:bg-[#064A42] transition-colors"
                  >
                    <span>কেন্দ্রীয় অনলাইন আবেদন</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <a
                    href="tel:01878925325"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#075E54]/30 bg-white px-4 py-2.5 text-[14px] font-semibold text-[#075E54] hover:bg-[#F0F7F5] transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span>ভর্তি হেল্পলাইন: ০১৮৭৮-৯২৫৩২৫</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Key Institutional Identifiers Box (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl border border-[#E2E7E4] bg-[#F7F8F5] p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white border border-[#E2E7E4] p-3.5 text-center">
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-[#5F6B67]">
                      EIIN নম্বর
                    </span>
                    <p className="font-heading text-xl font-extrabold text-[#075E54] mt-0.5">
                      ১০৪২৩৩
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-[#E2E7E4] p-3.5 text-center">
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-[#5F6B67]">
                      মাদ্রাসা কোড
                    </span>
                    <p className="font-heading text-xl font-extrabold text-[#B68A18] mt-0.5">
                      ২০১৮৮
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1 text-[13.5px]">
                  <div className="flex items-start gap-2 text-[#5F6B67]">
                    <Globe className="h-4 w-4 text-[#075E54] shrink-0 mt-0.5" />
                    <span>
                      <strong>ভর্তি পোর্টাল:</strong>{" "}
                      <Link
                        href="http://www.xiclassadmission.gov.bd"
                        target="_blank"
                        className="text-[#075E54] font-semibold hover:underline"
                      >
                        xiclassadmission.gov.bd
                      </Link>
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-[#5F6B67]">
                    <MapPin className="h-4 w-4 text-[#075E54] shrink-0 mt-0.5" />
                    <span>
                      <strong>ক্যাম্পাস:</strong> খাজা রোড, বাদামতল, পূর্ব ষোলশহর, চান্দগাঁও, চট্টগ্রাম।
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Institutional Features Grid (আমাদের বৈশিষ্ট্যসমূহ) */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-3.5 py-1 text-[13px] font-semibold text-[#075E54]">
                <Sparkles className="h-3.5 w-3.5 text-[#075E54]" />
                <span>আমাদের স্বাতন্ত্র্য ও শ্রেষ্ঠত্ব</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E]">
                আমাদের বিশেষ বৈশিষ্ট্যসমূহ
              </h2>
              <p className="text-[15px] text-[#5F6B67]">
                ইসলামী মূল্যবোধ ও আধুনিক শিক্ষার এক অনন্য সমন্বিত পরিবেশ
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className="card-appear rounded-2xl border border-[#E2E7E4] bg-white p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/15 shadow-2xs">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-heading text-[17px] font-bold text-[#17211E] leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-[#5F6B67]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 3: Special Evening Note Callout (বিশেষ দ্রষ্টব্য) */}
          <div className="rounded-3xl border border-[#B68A18]/40 bg-[#FFFDF5] p-6 sm:p-8 border-l-8 border-l-[#B68A18] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#B68A18]/15 text-[#B68A18]">
                  <Moon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block rounded-full bg-[#B68A18] px-3 py-0.5 text-[12px] font-bold text-white">
                    বিশেষ দ্রষ্টব্য
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#17211E]">
                    সান্ধ্যকালীন বিশেষ ক্লাসের ব্যবস্থা
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-[#5F6B67]">
                    উপযুক্ত আলেমেদ্বীন তৈরির লক্ষ্যে সুদক্ষ ও অভিজ্ঞ শিক্ষকদের সরাসরি তত্ত্বাবধানে সান্ধ্যকালীন বিশেষ পাঠদান ও তত্ত্বাবধান কার্যক্রম পরিচালিত হয়।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Helpline and Application Gateway */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Left: Contact Helplines (6 cols) */}
            <div className="lg:col-span-6 rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#17211E]">
                    ভর্তি হেল্পলাইন ও পরামর্শ
                  </h3>
                  <p className="text-[13.5px] text-[#5F6B67]">
                    যেকোনো তথ্যের জন্য সরাসরি কল করুন
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {helplines.map((h, i) => (
                  <a
                    key={i}
                    href={`tel:${h.tel}`}
                    className="flex flex-col items-center justify-center rounded-xl border border-[#E2E7E4] bg-[#F7F8F5] p-3 text-center transition hover:border-[#075E54] hover:bg-[#F0F7F5] shadow-2xs"
                  >
                    <Phone className="h-4 w-4 text-[#075E54] mb-1" />
                    <span className="text-[14px] font-bold text-[#17211E]">
                      {h.phone}
                    </span>
                  </a>
                ))}
              </div>

              <div className="flex items-start gap-2.5 pt-2 text-[13.5px] text-[#5F6B67] border-t border-[#E2E7E4]">
                <MapPin className="h-4 w-4 text-[#075E54] shrink-0 mt-0.5" />
                <span>
                  <strong>ক্যাম্পাস ঠিকানা:</strong> খাজা রোড, বাদামতল, পূর্ব ষোলশহর, চান্দগাঁও, চট্টগ্রাম।
                </span>
              </div>
            </div>

            {/* Right: Online Application Gateway (6 cols) */}
            <div className="lg:col-span-6 rounded-3xl border border-[#B68A18]/40 bg-[#064A42] p-6 sm:p-8 text-white shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#B68A18]/40 bg-white/10 px-3 py-0.5 text-[12.5px] font-semibold text-[#B68A18]">
                  <Globe className="h-3.5 w-3.5" />
                  <span>ভর্তির মূল ওয়েবসাইট</span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  একাদশ ও আলিম ভর্তি পোর্টাল
                </h3>
                <p className="text-[14.5px] leading-relaxed text-[#DCEEE9]">
                  ভর্তি সংক্রান্ত সকল আপডেট ও কেন্দ্রীয় অনলাইন আবেদন করার জন্য সরকারি ভর্তি পোর্টালে চোখ রাখুন।
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="http://www.xiclassadmission.gov.bd"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#075E54] border border-[#B68A18]/40 px-5 py-2.5 text-[14.5px] font-bold text-white shadow-xs hover:bg-[#064A42] transition-colors"
                >
                  <span>xiclassadmission.gov.bd</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  <span>যোগাযোগ করুন</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  )
}
