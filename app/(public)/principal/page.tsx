import Image from "next/image"
import Link from "next/link"
import {
  Quote,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  Clock,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Building,
} from "lucide-react"
import { PublicHero } from "@/components/layout/public-hero"
import { createPageMetadata } from "@/lib/seo"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { getHomepageLeadershipCardsForAdmin } from "@/lib/homepage"
import { sanitizeHTML } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "অধ্যক্ষ মহোদয়ের বাণী",
  description: "ওয়াসিয়া কামিল মাদ্রাসার অধ্যক্ষ মহোদয়ের বাণী, প্রোফাইল, শিক্ষাগত যোগ্যতা এবং প্রাতিষ্ঠানিক দিকনির্দেশনা।",
  path: "/principal",
  keywords: ["অধ্যক্ষ", "অধ্যক্ষের বাণী", "মাদ্রাসার নেতৃত্ব"],
})

type FormerLeader = {
  name: string
  period: string
  qualification: string
}

const formerLeaders: FormerLeader[] = [
  {
    name: "মাওলানা হাফেজ কারী আব্দুল্লাহ আল-মামুন (রহ.)",
    period: "২০১৮ — ২০২৪",
    qualification: "দাওরায়ে হাদিস, কামিল (ফিকহ)",
  },
  {
    name: "মাওলানা মুফতি আব্দুর রহমান (রহ.)",
    period: "২০১২ — ২০১৮",
    qualification: "কামিল (হাদিস), এম.এ. (ইসলামিক স্টাডিজ)",
  },
  {
    name: "মাওলানা কাসেম আলী (রহ.)",
    period: "২০০৫ — ২০১২",
    qualification: "দাওরায়ে হাদিস, কামিল (তাফসির)",
  },
  {
    name: "মাওলানা নূরুল ইসলাম (রহ.)",
    period: "১৯৯৮ — ২০০৫",
    qualification: "কামিল (আদব ও সাহিত্য)",
  },
]

export default async function PrincipalPage() {
  const [instituteSettings, leadershipCards] = await Promise.all([
    getInstituteSettings(),
    getHomepageLeadershipCardsForAdmin(20).catch(() => []),
  ])

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    "ওয়াসিয়া কামিল মাদ্রাসা"

  // Find principal/headmaster card
  const principalCard =
    leadershipCards.find(
      (card) =>
        card.role_slug === "principal" ||
        card.role_slug === "headmaster" ||
        card.role_slug === "chief_education_officer"
    ) || null

  const leaderStaff = principalCard?.staff
  const leaderName =
    principalCard?.leader_name ||
    leaderStaff?.full_name_en ||
    "সৈয়দ মুহাম্মদ আবু ছালেহ"

  const leaderDesignation =
    principalCard?.role_title ||
    leaderStaff?.designation ||
    "অধ্যক্ষ ও সম্পাদক"

  const leaderPhoto =
    principalCard?.leader_photo_url ||
    leaderStaff?.profile_photo ||
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80"

  const rawMessage = principalCard?.leader_message || ""
  const isHtmlMessage = /<[a-z][\s\S]*>/i.test(rawMessage)

  const defaultMessageParagraphs = [
    "বিসমিল্লাহির রাহমানির রাহীম। আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ।",
    "সুশিক্ষিত, আদর্শবান ও খোদাভীরু নাগরিক গড়ে তুলতে মাদ্রাসা শিক্ষা একটি অনন্য মাধ্যম। জাগতিক ও পারলৌকিক উভয় জীবনে সফলতার দ্বারপ্রান্তে উপনীত হতে এই শিক্ষা অগ্রণী ভূমিকা রাখতে সক্ষম। কারণ, একজন মাদ্রাসা শিক্ষার্থী একাধারে কুরআন, হাদিস, ফিকহ তথা ইলমে দ্বীন অর্জনের সুযোগ যেমন লাভ করে, তেমনি বাংলা, গণিত, ইংরেজি, বিজ্ঞান ও কম্পিউটারসহ জীবন চলার পথে প্রয়োজনীয় আধুনিক সব বিষয়েও জ্ঞান অর্জনের সুযোগ পায়। ফলে একজন মুসলিম হিসেবে পূর্ণাঙ্গ জীবন গঠনের পথ অত্যন্ত সহজতর হয়ে ওঠে।",
    "সেই মহৎ লক্ষ্যকে সামনে রেখেই চান্দগাঁও থানাধীন ওয়াছিয়া আহমাদিয়া সুন্নিয়া মাদ্রাসা তার প্রাতিষ্ঠানিক অভিভাবকত্ব অব্যাহত রেখেছে। আমাদের একান্ত বিশ্বাস, শিক্ষার্থীরা তাদের সুপ্ত মেধার বিকাশ ঘটিয়ে কুসংস্কার ও কূপমণ্ডূকতার অভিশাপ থেকে সমাজকে মুক্ত করবে। শিক্ষা, স্বাস্থ্য ও জ্ঞান-বিজ্ঞানের আলোকিত বিশ্ব ধরায় প্রিয় মাতৃভূমির জন্য একটি মর্যাদাপূর্ণ অবস্থান গড়ে তুলতে তারা নিরলসভাবে কাজ করে যাবে।",
    "স্বনির্ভর জাতি গঠন ও সুনাগরিক তৈরির ক্ষেত্রে আদর্শ শিক্ষাপ্রতিষ্ঠানের কোনো বিকল্প নেই। সার্বিক মানদণ্ডে এই প্রতিষ্ঠানকে একটি আদর্শ ও মডেল প্রতিষ্ঠানে পরিণত করাই আমাদের প্রধান স্বপ্ন ও অঙ্গীকার।",
    "আল্লাহ তাআলা ও তাঁর প্রিয় হাবিব সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম আমাদের সহায় হোন। আমিন, বিহুরমাতি সায়্যিদিল মুরসালীন সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম।",
  ]

  const parsedParagraphs =
    !isHtmlMessage && rawMessage.trim()
      ? rawMessage
          .split(/\n\s*\n/)
          .map((part) => part.trim())
          .filter(Boolean)
      : []

  const displayParagraphs =
    parsedParagraphs.length > 0 ? parsedParagraphs : defaultMessageParagraphs

  const contactEmail =
    instituteSettings.contact.email?.trim() || "principal@wasiamadrasah.edu.bd"
  const contactPhone =
    instituteSettings.contact.telephone?.trim() ||
    instituteSettings.contact.mobile?.trim() ||
    "+880 1800-000000"

  const toBn = (n: number) => String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d])

  return (
    <main className="min-h-screen bg-[#F7F8F5]">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 1. PUBLIC HERO HEADER (Standard Classic + Modern Token) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <PublicHero
        title="অধ্যক্ষ মহোদয়ের বাণী"
        subtitle="ইলম ও আমলের সমন্বয়ে ভবিষ্যৎ প্রজন্মের আদর্শ দ্বীনি ও সমকালীন শিক্ষা"
        badgeText="অধ্যক্ষ মহোদয়ের দপ্তর"
        badgeIcon={GraduationCap}
        breadcrumbCurrent="অধ্যক্ষের বাণী"
        breadcrumbParent={{ label: "প্রশাসন", href: "/teachers" }}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 2. MAIN EDITORIAL PROFILE & MESSAGE SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 border-b border-[#E2E7E4]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* ─────────────────────────────────────────────────────────── */}
            {/* LEFT: PRINCIPAL PROFILE CARD (4 cols / Sticky) */}
            {/* ─────────────────────────────────────────────────────────── */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-[#E2E7E4] bg-white p-6 shadow-sm">
                
                {/* Clean 16px Radius Portrait Photo */}
                <div className="relative mx-auto w-full aspect-[3/4] max-w-[260px] overflow-hidden rounded-2xl border border-[#E2E7E4] bg-[#F0F7F5]">
                  <Image
                    src={leaderPhoto}
                    alt={leaderName}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 30vw"
                  />
                </div>

                {/* Name & Title */}
                <div className="mt-5 text-center space-y-1">
                  <h2 className="font-heading text-2xl font-bold text-[#17211E] leading-snug">
                    {leaderName}
                  </h2>
                  <p className="text-[15px] font-semibold text-[#075E54]">
                    {leaderDesignation}
                  </p>
                  <p className="text-[14px] text-[#5F6B67]">
                    {instituteName}
                  </p>
                </div>

                {/* Key Meta Details */}
                <div className="mt-6 pt-5 border-t border-[#E2E7E4] space-y-3.5 text-[15px]">
                  
                  <div className="flex items-start gap-3 text-[#17211E]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F5] text-[#075E54] border border-[#E2E7E4]">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-medium text-[#5F6B67]">
                        যোগ্যতা
                      </span>
                      <span className="font-semibold text-[#17211E]">
                        দাওরায়ে হাদিস, কামিল (হাদিস ও ফিকহ)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-[#17211E]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F5] text-[#075E54] border border-[#E2E7E4]">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-medium text-[#5F6B67]">
                        কার্যকাল
                      </span>
                      <span className="font-semibold text-[#17211E]">
                        বর্তমান অধ্যক্ষ
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-[#17211E]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F5] text-[#075E54] border border-[#E2E7E4]">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-medium text-[#5F6B67]">
                        সাক্ষাতের সময়
                      </span>
                      <span className="font-semibold text-[#17211E]">
                        রবি — বৃহস্পতি (১০:০০ — ০১:০০)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-[#17211E]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F5] text-[#075E54] border border-[#E2E7E4]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-medium text-[#5F6B67]">
                        ইমেইল
                      </span>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="font-medium text-[#075E54] hover:underline break-all"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-[#17211E]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F5] text-[#075E54] border border-[#E2E7E4]">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-medium text-[#5F6B67]">
                        ফোন
                      </span>
                      <a
                        href={`tel:${contactPhone}`}
                        className="font-medium text-[#075E54] hover:underline"
                      >
                        {contactPhone}
                      </a>
                    </div>
                  </div>

                </div>

                {/* Primary Button (44px height, 8px radius, #075E54) */}
                <div className="mt-6 pt-2">
                  <Link
                    href="/contact"
                    className="flex h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#075E54] px-[18px] text-[15px] font-semibold text-white shadow-xs transition-colors duration-200 hover:bg-[#064A42]"
                  >
                    <span>দপ্তরে যোগাযোগ করুন</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

              </div>
            </aside>

            {/* ─────────────────────────────────────────────────────────── */}
            {/* RIGHT: MAIN STATEMENT & INSTITUTIONAL PILLARS (8 cols) */}
            {/* ─────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Main Message Card */}
              <div className="rounded-2xl border border-[#E2E7E4] bg-white p-6 sm:p-9 shadow-sm space-y-6">
                
                {/* Title Header */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-3.5 py-1 text-[13px] font-semibold text-[#075E54]">
                    <Quote className="h-3.5 w-3.5" />
                    <span>প্রাতিষ্ঠানিক দিকনির্দেশনা</span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E] leading-tight">
                    নৈতিক মূল্যবোধ, দ্বীনি তাহযীব ও আধুনিক শিক্ষার সমন্বিত প্রয়াস
                  </h2>
                  <div className="h-1 w-16 bg-[#B68A18] rounded-full" />
                </div>

                {/* Hadith Callout Box */}
                <div className="rounded-xl border-l-4 border-[#B68A18] bg-[#F0F7F5] p-4 sm:p-5">
                  <p className="text-[16px] font-medium text-[#075E54] italic leading-relaxed">
                    “যে ব্যক্তি জ্ঞানার্জনের উদ্দেশ্যে কোনো পথ অবলম্বন করে, আল্লাহ তার জন্য জান্নাতের পথ সহজ ও সুগম করে দেন।”
                  </p>
                  <span className="text-[14px] font-semibold text-[#B68A18] block mt-1.5">
                    — সহীহ মুসলিম: ২৬৯৯
                  </span>
                </div>

                {/* Editorial Body Text (Standard 16px, leading-1.6) */}
                <div className="space-y-4 text-[16px] leading-relaxed text-[#17211E]">
                  {isHtmlMessage ? (
                    <div
                      className="prose prose-emerald max-w-none prose-p:leading-relaxed prose-p:text-[#17211E] prose-p:mb-4"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(rawMessage) }}
                    />
                  ) : (
                    displayParagraphs.map((para, index) => (
                      <p key={index} className="text-justify">
                        {para}
                      </p>
                    ))
                  )}
                </div>

                {/* 3 Core Institutional Focus Pillars */}
                <div className="pt-5 border-t border-[#E2E7E4]">
                  <h3 className="font-heading text-[18px] font-semibold text-[#17211E] mb-4">
                    আমাদের ৩টি মূল প্রাতিষ্ঠানিক স্তম্ভ
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="rounded-xl bg-[#F7F8F5] p-4 border border-[#E2E7E4]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#075E54] border border-[#E2E7E4] mb-2.5">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <h4 className="text-[15px] font-bold text-[#17211E]">১. বিশুদ্ধ দ্বীনি শিক্ষা</h4>
                      <p className="text-[14px] text-[#5F6B67] mt-1 leading-normal">
                        কুরআনুল কারীম হিফজ, তাজভীদ ও সহীহ হাদিস চর্চা।
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F7F8F5] p-4 border border-[#E2E7E4]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#075E54] border border-[#E2E7E4] mb-2.5">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <h4 className="text-[15px] font-bold text-[#17211E]">২. আধুনিক পাঠ্যক্রম</h4>
                      <p className="text-[14px] text-[#5F6B67] mt-1 leading-normal">
                        বিজ্ঞান, গণিত, আইসিটি ল্যাব ও ইংরেজি দক্ষতা।
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F7F8F5] p-4 border border-[#E2E7E4]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#075E54] border border-[#E2E7E4] mb-2.5">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <h4 className="text-[15px] font-bold text-[#17211E]">৩. তারবিয়াহ ও চরিত্র</h4>
                      <p className="text-[14px] text-[#5F6B67] mt-1 leading-normal">
                        সুন্নাহর বাস্তবায়ন, শৃঙ্খলা ও উত্তম শিষ্টাচার গঠন।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Formal Signature Block */}
                <div className="pt-6 border-t border-[#E2E7E4]">
                  <div>
                    <p className="text-[14px] text-[#5F6B67]">আন্তরিক দোয়াপ্রার্থী,</p>
                    <p className="font-heading text-[18px] font-bold text-[#17211E] mt-0.5">
                      {leaderName}
                    </p>
                    <p className="text-[15px] font-semibold text-[#075E54]">
                      {leaderDesignation}
                    </p>
                    <p className="text-[14px] text-[#5F6B67]">
                      {instituteName}
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 3. FORMER PRINCIPALS / HEADMASTERS TABLE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-14 md:py-20 border-b border-[#E2E7E4]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          
          {/* Section Header */}
          <div className="text-center space-y-2 mb-10 md:mb-12">
            <div className="inline-flex items-center rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-3.5 py-1 text-[13px] font-semibold text-[#075E54]">
              <span>ঐতিহ্য ও খেদমত</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E]">
              প্রাক্তন অধ্যক্ষবৃন্দের তালিকা
            </h2>
            <div className="h-1 w-16 bg-[#B68A18] rounded-full mx-auto" />
            <p className="text-[15px] text-[#5F6B67] max-w-2xl mx-auto leading-relaxed">
              মাদ্রাসার প্রতিষ্ঠাকালীন সময় থেকে যাদের মেহনত ও দিকনির্দেশনায় প্রতিষ্ঠানটি আজকের এই মানে পৌঁছেছে
            </p>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl border border-[#E2E7E4] bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E2E7E4]">
                <thead className="bg-[#075E54] text-white">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 text-left text-[14px] font-semibold">
                      ক্রমিক
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-[14px] font-semibold">
                      নাম
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-[14px] font-semibold">
                      শিক্ষাগত যোগ্যতা
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-[14px] font-semibold">
                      কার্যকাল
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E7E4] bg-white text-[15px]">
                  {formerLeaders.map((leader, index) => (
                    <tr
                      key={leader.name}
                      className="hover:bg-[#F0F7F5] transition-colors duration-150"
                    >
                      <td className="px-5 py-4 font-semibold text-[#075E54]">
                        {toBn(index + 1)}
                      </td>
                      <td className="px-5 py-4 font-bold text-[#17211E]">
                        {leader.name}
                      </td>
                      <td className="px-5 py-4 text-[#5F6B67]">
                        {leader.qualification}
                      </td>
                      <td className="px-5 py-4 font-medium text-[#075E54]">
                        {leader.period}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tribute Note */}
          <div className="mt-8 rounded-xl border border-[#E2E7E4] bg-[#F7F8F5] p-6 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-[#075E54] font-semibold text-[15px]">
              <Building className="h-4 w-4 text-[#B68A18]" />
              <span>স্মৃতিচারণ ও কৃতজ্ঞতা</span>
            </div>
            <p className="text-[14px] leading-relaxed text-[#5F6B67] max-w-2xl mx-auto">
              মাদ্রাসার সার্বিক উন্নয়ন ও শিক্ষা প্রসারে সকল সাবেক দায়িত্বশীলদের অবদান আমরা গভীর শ্রদ্ধার সাথে স্মরণ করি। আল্লাহ সুবহানাহু ওয়া তায়ালা তাঁদের খেদমত কবুল করুন।
            </p>
          </div>

        </div>
      </section>
    </main>
  )
}
