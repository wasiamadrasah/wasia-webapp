import Link from "next/link"
import {
  School,
  Landmark,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  Laptop,
  BookOpen,
  Users,
  Building2,
  Heart,
  Target,
  Eye,
  Sparkles,
  MapPin,
  Phone,
  ArrowRight,
  Trophy,
  Moon,
  Tv,
  HeartHandshake,
  Languages,
  CheckCircle2,
} from "lucide-react"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"

export const dynamic = "force-dynamic"
export const revalidate = 60

// 1. At a glance key facts
const atAGlanceFacts = [
  {
    label: "প্রতিষ্ঠানের পূর্ণ নাম",
    value: "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা",
    subtext: "Wasia Ahmadia Sunnia Alim Madrasah",
    icon: School,
  },
  {
    label: "EIIN নম্বর",
    value: "১০৪২৩৩",
    subtext: "মাধ্যমিক ও উচ্চশিক্ষা বিভাগ",
    icon: BadgeCheck,
  },
  {
    label: "মাদ্রাসা কোড",
    value: "২০১৮৮",
    subtext: "বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড",
    icon: GraduationCap,
  },
  {
    label: "প্রতিষ্ঠাকাল",
    value: "১২ ফেব্রুয়ারি ১৯৬৫",
    subtext: "প্রায় ছয় দশকের ঐতিহ্য",
    icon: CalendarDays,
  },
  {
    label: "বোর্ড স্বীকৃতি",
    value: "১ জানুয়ারি ২০০৯",
    subtext: "সরকারি স্বীকৃতিপ্রাপ্ত",
    icon: BadgeCheck,
  },
  {
    label: "একাডেমিক স্তর",
    value: "ইবতেদায়ী, দাখিল ও আলিম",
    subtext: "হিফজুল কুরআন বিভাগসহ",
    icon: BookOpen,
  },
  {
    label: "শিক্ষার বিভাগসমূহ",
    value: "বিজ্ঞান • মানবিক • ব্যবসায়",
    subtext: "জাতীয় শিক্ষাক্রমের আলোকে",
    icon: Laptop,
  },
  {
    label: "আবাসন সুবিধা",
    value: "আবাসিক ও অনাবাসিক",
    subtext: "উন্নত পরিবেশ ও নিবিড় যত্ন",
    icon: Building2,
  },
  {
    label: "শিক্ষার ধরন",
    value: "সহশিক্ষা (Co-education)",
    subtext: "শৃঙ্খলাপরায়ণ দ্বীনি পরিবেশ",
    icon: Users,
  },
  {
    label: "ক্যাম্পাস অবস্থান",
    value: "খাজা রোড, বাদামতল, চান্দগাঁও",
    subtext: "পূর্ব ষোলশহর, চট্টগ্রাম",
    icon: MapPin,
  },
]

// 2. Core Pillars (Mission, Vision, Values)
const corePillars = [
  {
    title: "আমাদের লক্ষ্য (Mission)",
    icon: Target,
    badge: "মিশন",
    description:
      "পবিত্র কুরআন ও সুন্নাহর বিশুদ্ধ আদর্শে শিক্ষার্থীদের চারিত্রিক গুণাবলি গঠন করা এবং যুগোপযোগী আধুনিক শিক্ষা ও তথ্যপ্রযুক্তির সমন্বয়ে আদর্শ আলেম, সৎ, যোগ্য ও দেশপ্রেমিক নাগরিক হিসেবে গড়ে তোলা।",
  },
  {
    title: "আমাদের রূপকল্প (Vision)",
    icon: Eye,
    badge: "ভিশন",
    description:
      "বন্দরনগরী চট্টগ্রামে আহলে সুন্নাত ওয়াল জামাআতের তাহযীব-তমাদ্দুন ভিত্তিক দ্বীনি শিক্ষা ও সমন্বিত আধুনিক জ্ঞানচর্চার এক শীর্ষস্থানীয় ও আদর্শ মডেল শিক্ষা প্রতিষ্ঠান হিসেবে শ্রেষ্ঠত্ব বজায় রাখা।",
  },
  {
    title: "মূল মূল্যবোধ (Values)",
    icon: Heart,
    badge: "মূল্যবোধ",
    description:
      "তাকওয়া ও আমল, চারিত্রিক শুদ্ধতা, নিষ্ঠা, নিয়মানুবর্তিতা, পরমতসহিষ্ণুতা এবং সমাজের অনগ্রসর ও মেধা সম্পন্ন শিক্ষার্থীদের সার্বিক কল্যাণে নিঃস্বার্থ সামাজিক দায়বদ্ধতা।",
  },
]

// 3. Institutional Facilities
const facilities = [
  {
    icon: Users,
    title: "দক্ষ ও অভিজ্ঞ শিক্ষক পরিষদ",
    description: "উচ্চশিক্ষিত, নিবেদিতপ্রাণ ও প্রশিক্ষণপ্রাপ্ত শিক্ষক ও ওলামায়ে কেরামের প্রত্যক্ষ তত্ত্বাবধান।",
  },
  {
    icon: Moon,
    title: "সান্ধ্যকালীন বিশেষ পাঠদান",
    description: "উপযুক্ত আলেম গড়ার লক্ষ্যে নিয়মিত সান্ধ্যকালীন নিবিড় পাঠ ও রিভিশন ক্লাসের ব্যবস্থা।",
  },
  {
    icon: BookOpen,
    title: "হিফজুল কুরআন ও ক্বেরাত বিভাগ",
    description: "আন্তর্জাতিক মানসম্পন্ন তাজবীদ সহ হিফজ ও সহীহ তিলাওয়াত প্রশিক্ষণের বিশেষ ব্যবস্থা।",
  },
  {
    icon: Laptop,
    title: "ডিজিটাল কম্পিউটার ল্যাব",
    description: "শিক্ষার্থীদের তথ্যপ্রযুক্তি ও আধুনিক প্রযুক্তিতে দক্ষ করে তুলতে সমৃদ্ধ ডিজিটাল ল্যাব।",
  },
  {
    icon: Tv,
    title: "মাল্টিমিডিয়া ক্লাসরুম",
    description: "ভিজ্যুয়াল প্রজেক্টর ও মাল্টিমিডিয়া পদ্ধতিতে প্রতিটি পাঠ সহজবোধ্যভাবে উপস্থাপন।",
  },
  {
    icon: Languages,
    title: "আরবি ভাষা ও ব্যাকরণ কোর্স",
    description: "কুরআন-হাদিসের গভীর জ্ঞানার্জনে আরবি ব্যাকরণ ও কথোপকথনের বিশেষ কোর্স।",
  },
  {
    icon: HeartHandshake,
    title: "মেধাবৃত্তি ও আর্থিক সুবিধা",
    description: "এতিম, গরীব ও অসচ্ছল মেধাবী শিক্ষার্থীদের জন্য বিশেষ শিক্ষাবৃত্তি ও ফি মওকুফের সুবিধা।",
  },
  {
    icon: Building2,
    title: "মনোরম ক্যাম্পাস ও খেলার মাঠ",
    description: "শারীরিক সুস্থতা ও মানসিক প্রফুল্লতার জন্য নিরাপদ, নিরিবিলি ও স্বাস্থ্যকর পরিবেশ।",
  },
]

// 4. Institutional Achievements
const achievements = [
  "১৯৬৫ সাল থেকে প্রায় ছয় দশক ধরে নিরবচ্ছিন্ন দ্বীনি ও আধুনিক শিক্ষাসেবা প্রদান।",
  "বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ডের অধীনে দাখিল ও আলিম স্তরে শতভাগ পর্যন্ত সাফল্য।",
  "বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা শাখায় আধুনিক ল্যাব ও মানসম্মত পাঠদান।",
  "আন্তর্জাতিক মানসম্পন্ন হিফজুল কুরআন বিভাগ ও বিশুদ্ধ কেরাত চর্চা।",
  "শৃঙ্খলা, নৈতিকতা ও জাতীয় দিবসসমূহে স্কাউটিং ও সাংস্কৃতিক কার্যক্রমে সক্রিয় উপস্থিতি।",
]

export default async function AboutPage() {
  const instituteSettings = await getInstituteSettings()

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা"

  const heroSubtitle = `${instituteName}-এর সংক্ষিপ্ত পরিচিতি, লক্ষ্য, উদ্দেশ্য, এক নজরে সার্বিক তথ্য ও ক্যাম্পাস সুযোগ-সুবিধাসমূহ।`

  return (
    <main className="bg-[#F7F8F5]">
      {/* 1. Public Standard Hero Banner */}
      <PublicHero
        title="আমাদের পরিচিতি ও আদর্শ"
        subtitle={heroSubtitle}
        badgeText="পরিচিতি ও ঐতিহ্য"
        badgeIcon={School}
        breadcrumbCurrent="আমাদের সম্পর্কে"
      />

      {/* 2. Main Body Content */}
      <section className="relative py-10 md:py-12 overflow-hidden">
        {/* Subtle Islamic Geometric Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.025]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="about-islamic-pattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <path
                  d="M35,8 L41,22 L56,16 L50,30 L64,35 L50,40 L56,54 L41,48 L35,62 L29,48 L14,54 L20,40 L6,35 L20,30 L14,16 L29,22 Z"
                  fill="none"
                  stroke="#075E54"
                  strokeWidth="1.2"
                />
                <circle cx="35" cy="35" r="12" fill="none" stroke="#B68A18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-islamic-pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-12">
          
          {/* Section A: Institutional Introduction Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            {/* Left Col (5 cols): Deep Evergreen Institutional Spotlight */}
            <div className="lg:col-span-5 rounded-3xl border border-[#B68A18]/40 bg-[#064A42] p-8 text-white shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#B68A18] border border-[#B68A18]/30">
                  <Landmark className="h-6 w-6" />
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-snug">
                  দ্বীনি ইলম ও নৈতিকতার এক অনন্য আলোকবর্তিকা
                </h2>
                <p className="text-[14.5px] leading-relaxed text-[#DCEEE9]">
                  ১৯৬৫ সাল থেকে বন্দরনগরী চট্টগ্রামের চান্দগাঁও এলাকায় দ্বীনি তাহযীব ও আধুনিক শিক্ষার সমন্বয়ে আলোকিত মানুষ ও সুনাগরিক গড়ে তোলার নিরবচ্ছিন্ন মিশন।
                </p>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="text-[13.5px] font-bold text-[#B68A18]">
                  • ইসলামী ও আধুনিক শিক্ষাই আমাদের বৈশিষ্ট্য
                </p>
              </div>
            </div>

            {/* Right Col (7 cols): Background Narrative */}
            <div className="lg:col-span-7 rounded-3xl border border-[#E2E7E4] bg-white p-8 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-3.5 py-1 text-[13px] font-semibold text-[#075E54]">
                  <Sparkles className="h-3.5 w-3.5 text-[#075E54]" />
                  <span>প্রতিষ্ঠানের পটভূমি ও পরিচয়</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#17211E]">
                  ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা
                </h3>
                <p className="text-[15px] leading-relaxed text-[#5F6B67]">
                  চট্টগ্রামের চান্দগাঁও থানাধীন পূর্ব ষোলশহরের খাজা রোড (বাদামতল) এলাকায় ১২ ফেব্রুয়ারি ১৯৬৫ খ্রিষ্টাব্দে প্রতিষ্ঠিত হয় ঐতিহ্যবাহী ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা। পরবর্তীতে ১ জানুয়ারি ২০০৯ খ্রিষ্টাব্দে বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড কর্তৃক প্রাতিষ্ঠানিক স্বীকৃতি লাভ করে এবং বর্তমানে EIIN নম্বর ১০৪২৩৩ ও মাদ্রাসা কোড ২০১৮৮ সহ সুপরিচালিত হচ্ছে।
                </p>
                <p className="text-[15px] leading-relaxed text-[#5F6B67]">
                  এখানে ইবতেদায়ী, দাখিল ও আলিম স্তরে বিজ্ঞান (Science), মানবিক (Humanities) ও ব্যবসায় শিক্ষা (Business Studies) শাখার পাশাপাশি আন্তর্জাতিক মানসম্পন্ন হিফজুল কুরআন বিভাগ পরিচালিত হয়।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/admission"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#075E54] px-4 py-2 text-[13.5px] font-bold text-white hover:bg-[#064A42] transition-colors"
                >
                  <span>ভর্তি তথ্য দেখুন</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/history"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#075E54]/30 bg-[#F0F7F5] px-4 py-2 text-[13.5px] font-semibold text-[#075E54] hover:bg-[#075E54]/10 transition-colors"
                >
                  <span>মাদ্রাসার ইতিহাস পড়ুন</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Section B: এক নজরে মাদ্রাসা (At a Glance Section) */}
          <div id="at-a-glance" className="scroll-mt-24 rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 md:p-10 shadow-xs space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-3.5 py-1 text-[13px] font-semibold text-[#075E54]">
                <BadgeCheck className="h-3.5 w-3.5 text-[#075E54]" />
                <span>প্রাতিষ্ঠানিক তথ্যাবলি</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E]">
                এক নজরে মাদ্রাসা
              </h2>
              <p className="text-[15px] text-[#5F6B67]">
                ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসার গুরুত্বপূর্ণ পরিচিতি ও পরিসংখ্যান
              </p>
            </div>

            {/* Structured Facts Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {atAGlanceFacts.map((fact, idx) => {
                const Icon = fact.icon
                return (
                  <div
                    key={idx}
                    className="card-appear rounded-2xl border border-[#E2E7E4] bg-[#F7F8F5] p-4.5 sm:p-5 transition hover:border-[#075E54]/40 hover:bg-white hover:shadow-sm"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/15">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[12.5px] font-semibold text-[#5F6B67] uppercase tracking-wider block">
                          {fact.label}
                        </span>
                        <h3 className="font-heading text-[16.5px] font-bold text-[#17211E] leading-snug">
                          {fact.value}
                        </h3>
                        <p className="text-[13px] text-[#075E54] font-medium">
                          {fact.subtext}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section C: Mission, Vision & Core Values (3 Cards) */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-3.5 py-1 text-[13px] font-semibold text-[#075E54]">
                <Target className="h-3.5 w-3.5 text-[#075E54]" />
                <span>আমাদের মূল দর্শন</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E]">
                লক্ষ্য, রূপকল্প ও মূল্যবোধ
              </h2>
              <p className="text-[15px] text-[#5F6B67]">
                যে নীতি ও আদর্শ আমাদের প্রতিটি পদক্ষেপকে অনুপ্রাণিত করে
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {corePillars.map((pillar, idx) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={idx}
                    className="card-appear rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#075E54]/40 hover:shadow-md transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/15">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="rounded-full bg-[#075E54]/10 border border-[#075E54]/20 px-3 py-0.5 text-[12px] font-bold text-[#075E54]">
                          {pillar.badge}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-[#17211E]">
                        {pillar.title}
                      </h3>
                      <p className="text-[14.5px] leading-relaxed text-[#5F6B67]">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section D: Key Facilities & Strengths */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F7F5] border border-[#075E54]/20 px-3.5 py-1 text-[13px] font-semibold text-[#075E54]">
                <Sparkles className="h-3.5 w-3.5 text-[#075E54]" />
                <span>ক্যাম্পাস ও একাডেমিক সুবিধা</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E]">
                আমাদের বৈশিষ্ট্য ও সুযোগ-সুবিধা
              </h2>
              <p className="text-[15px] text-[#5F6B67]">
                শিক্ষার্থীদের মেধা ও চরিত্র বিকাশে সর্বাধুনিক সুযোগ-সুবিধা
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {facilities.map((facility, idx) => {
                const Icon = facility.icon
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
                        {facility.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-[#5F6B67]">
                        {facility.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section E: Achievements List */}
          <div className="rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-8 md:p-9 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#17211E]">
                  আমাদের গৌরব ও অর্জন
                </h3>
                <p className="text-[13.5px] text-[#5F6B67]">
                  ধারাবাহিক মেধা, সুন্নিয়ত চর্চা ও একাডেমিক শ্রেষ্ঠত্বের মাইলফলক
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {achievements.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl bg-[#F7F8F5] p-3.5 border border-[#E2E7E4]/70"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#075E54] shrink-0 mt-0.5" />
                  <span className="text-[14.5px] font-medium text-[#17211E] leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section F: Closing CTA Banner (Solid Evergreen) */}
          <div className="rounded-3xl border border-[#B68A18]/40 bg-[#064A42] p-8 sm:p-10 text-white text-center space-y-5 shadow-xs">
            <div className="max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B68A18]/40 bg-white/10 px-3.5 py-1 text-[13px] font-semibold text-[#B68A18]">
                <GraduationCap className="h-4 w-4 text-[#B68A18]" />
                <span>ভর্তি ও অন্যান্য তথ্য</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                দ্বীনি ও আধুনিক শিক্ষায় আপনার সন্তানের সুন্দর ভবিষ্যৎ গড়ে তুলুন
              </h2>
              <p className="text-[15px] leading-relaxed text-[#DCEEE9]">
                ২০২৬-২৭ সেশনের আলিম ১ম বর্ষে (আবাসিক/অনাবাসিক) ভর্তি কিংবা মাদ্রাসা সম্পর্কে বিস্তারিত জানতে আমাদের সাথে যোগাযোগ করুন।
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
                <span>যোগাযোগ ও ঠিকানা</span>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
