import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Quote, Users, GraduationCap, ArrowRight, BookOpen, ShieldCheck } from "lucide-react"

import { getHomepageLeadershipCardsForAdmin } from "@/lib/homepage"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { createPageMetadata, plainText } from "@/lib/seo"
import { sanitizeHTML } from "@/lib/utils"
import { PublicHero } from "@/components/layout/public-hero"

export const dynamic = "force-dynamic"
export const revalidate = 60

type RoleConfig = {
  title: string
  heading: string
  subtitle: string
  message: string[]
}

type LeaderRecord = {
  id: string
  full_name_en: string | null
  designation: string | null
  profile_photo: string | null
}

type LeadershipCardRecord = {
  id: string
  role_slug: string
  role_title: string
  leader_name: string | null
  leader_photo_url: string | null
  leader_message: string | null
  subtitle: string | null
  is_active?: boolean
  staff: LeaderRecord | null
}

const roleConfig: Record<string, RoleConfig> = {
  president: {
    title: "সভাপতি মহোদয়ের বাণী",
    heading: "সভাপতি, পরিচালনা পর্ষদ",
    subtitle: "নৈতিক মূল্যবোধ, দ্বীনি তাহযীব ও আলোকিত ভবিষ্যৎ প্রজন্ম গঠনের অঙ্গীকার।",
    message: [
      "সকল প্রশংসা মহান আল্লাহ রাব্বুল আলামিনের জন্য এবং অসংখ্য দরুদ ও সালাম পেশ করছি সর্বশেষ ও সর্বশ্রেষ্ঠ নবি, হজরত মুহাম্মদ (সা.)-এর প্রতি।",
      "অত্র প্রতিষ্ঠানের সভাপতির দায়িত্ব গ্রহণ করে এর সার্বিক শৃঙ্খলা ও শিক্ষার পরিবেশ আরও উন্নত করার লক্ষ্যে আমি দৃঢ়প্রতিজ্ঞ। ছাত্র, শিক্ষক, অভিভাবক এবং ম্যানেজিং কমিটির সদস্যবৃন্দসহ আমরা সবাই এক অভিন্ন লক্ষ্যে ঐক্যবদ্ধ— এই প্রতিষ্ঠানকে শ্রেষ্ঠত্বের মর্যাদায় অভিষিক্ত করতে আমাদের নিরলস প্রচেষ্টা অব্যাহত রয়েছে।",
      "বার আউলিয়ার পুণ্যভূমি বন্দরনগরী চট্টগ্রামে ঐতিহ্যবাহী এই প্রতিষ্ঠানটি দীর্ঘকাল যাবৎ দ্বীনি ও আধুনিক শিক্ষার প্রসারে অনবদ্য ভূমিকা পালন করে আসছে। আমাদের প্রধান লক্ষ্য হলো অবকাঠামোগত উন্নয়ন এবং একটি শিক্ষাবান্ধব পরিবেশ নিশ্চিত করার মাধ্যমে কোমলমতি শিক্ষার্থীদের কাছে শিক্ষাকে আনন্দময় করে তোলা এবং তাদের আগামীর 'স্মার্ট নাগরিক' হিসেবে গড়ে তোলা।",
      "দেশ ও জাতির কাঙ্ক্ষিত সাফল্য অর্জনে মাদ্রাসার শিক্ষার্থীরা অত্যন্ত গুরুত্বপূর্ণ অবদান রাখছে। ইসলামি তাহজীব-তামাদ্দুনের চর্চা, বিকাশ ও প্রসারে এই প্রতিষ্ঠান ভবিষ্যতেও আরও সুদূরপ্রসারী ভূমিকা পালন করবে, ইনশাআল্লাহ।",
    ],
  },
  "chief-education-officer": {
    title: "শিক্ষা সচিব / শিক্ষা পরিচালকের বাণী",
    heading: "শিক্ষা পরিচালক",
    subtitle: "দ্বীনি শিক্ষার গুণগত মানোন্নয়ন, সময়োপযোগী পাঠ্যক্রম ও মেধা বিকাশ।",
    message: [
      "কুরআন-সুন্নাহর আলোয় শিক্ষার্থীদের জীবন আলোকিত করা এবং তাদের যুগোপযোগী শিক্ষায় পারদর্শী করে তোলাই আমাদের পাঠ্যক্রমের মূল উদ্দেশ্য।",
      "আমরা শিক্ষকদের নিয়মিত প্রশিক্ষণ ও আধুনিক শিক্ষাদান পদ্ধতির মাধ্যমে শিক্ষার্থীদের মেধার সর্বোচ্চ বিকাশ সাধনে সচেষ্ট।",
    ],
  },
  headmaster: {
    title: "অধ্যক্ষ মহোদয়ের বাণী",
    heading: "অধ্যক্ষ ও সম্পাদক",
    subtitle: "ইলম ও আমলের সমন্বয়ে ভবিষ্যৎ প্রজন্মের আলোকিত দ্বীনি ও সাধারণ শিক্ষা।",
    message: [
      "বিসমিল্লাহির রাহমানির রাহীম। আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ।",
      "সুশিক্ষিত, আদর্শবান ও খোদাভীরু নাগরিক গড়ে তুলতে মাদ্রাসা শিক্ষা একটি অনন্য মাধ্যম। জাগতিক ও পারলৌকিক উভয় জীবনে সফলতার দ্বারপ্রান্তে উপনীত হতে এই শিক্ষা অগ্রণী ভূমিকা রাখতে সক্ষম। কারণ, একজন মাদ্রাসা শিক্ষার্থী একাধারে কুরআন, হাদিস, ফিকহ তথা ইলমে দ্বীন অর্জনের সুযোগ যেমন লাভ করে, তেমনি বাংলা, গণিত, ইংরেজি, বিজ্ঞান ও কম্পিউটারসহ জীবন চলার পথে প্রয়োজনীয় আধুনিক সব বিষয়েও জ্ঞান অর্জনের সুযোগ পায়। ফলে একজন মুসলিম হিসেবে পূর্ণাঙ্গ জীবন গঠনের পথ অত্যন্ত সহজতর হয়ে ওঠে।",
      "সেই মহৎ লক্ষ্যকে সামনে রেখেই চান্দগাঁও থানাধীন ওয়াছিয়া আহমাদিয়া সুন্নিয়া মাদ্রাসা তার প্রাতিষ্ঠানিক অভিভাবকত্ব অব্যাহত রেখেছে। আমাদের একান্ত বিশ্বাস, শিক্ষার্থীরা তাদের সুপ্ত মেধার বিকাশ ঘটিয়ে কুসংস্কার ও কূপমণ্ডূকতার অভিশাপ থেকে সমাজকে মুক্ত করবে। শিক্ষা, স্বাস্থ্য ও জ্ঞান-বিজ্ঞানের আলোকিত বিশ্ব ধরায় প্রিয় মাতৃভূমির জন্য একটি মর্যাদাপূর্ণ অবস্থান গড়ে তুলতে তারা নিরলসভাবে কাজ করে যাবে।",
      "স্বনির্ভর জাতি গঠন ও সুনাগরিক তৈরির ক্ষেত্রে আদর্শ শিক্ষাপ্রতিষ্ঠানের কোনো বিকল্প নেই। সার্বিক মানদণ্ডে এই প্রতিষ্ঠানকে একটি আদর্শ ও মডেল প্রতিষ্ঠানে পরিণত করাই আমাদের প্রধান স্বপ্ন ও অঙ্গীকার।",
      "আল্লাহ তাআলা ও তাঁর প্রিয় হাবিব সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম আমাদের সহায় হোন। আমিন, বিহুরমাতি সায়্যিদিল মুরসালীন সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম।",
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const cards = (await getHomepageLeadershipCardsForAdmin(50)) as LeadershipCardRecord[]
  const card = cards.find((item) => item.role_slug === role) ?? null
  const config = roleConfig[role]

  if (!card && !config) {
    return createPageMetadata({
      title: "বাণী পাওয়া যায়নি",
      description: "অনুরোধকৃত নেতৃত্বের বাণীটি খুঁজে পাওয়া যায়নি।",
      path: `/leadership/${role}`,
    })
  }

  const leader = card?.staff
  const leaderDesignation = card?.role_title || leader?.designation || config?.heading || "নেতৃত্ব"
  const pageTitle = config?.title || `${leaderDesignation} মহোদয়ের বাণী`
  const description =
    plainText(card?.leader_message, 160) ||
    card?.subtitle ||
    config?.subtitle ||
    "মাদ্রাসার সম্মানিত নেতৃত্বের দিকনির্দেশনামূলক বক্তব্য পড়ুন।"

  return createPageMetadata({
    title: pageTitle,
    description,
    path: `/leadership/${role}`,
    image: card?.leader_photo_url || leader?.profile_photo || undefined,
  })
}

export default async function LeadershipMessagePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const [cards, instituteSettings] = await Promise.all([
    getHomepageLeadershipCardsForAdmin(50) as Promise<LeadershipCardRecord[]>,
    getInstituteSettings(),
  ])

  const card = cards.find((item) => item.role_slug === role) ?? null
  const config = roleConfig[role]

  if (!card && !config) {
    notFound()
  }

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    "ওয়াসিয়া কামিল মাদ্রাসা"

  const leader = card?.staff
  const fallbackHeading = config?.heading || "নেতৃত্ব"
  const leaderName = card?.leader_name || leader?.full_name_en || fallbackHeading
  const leaderDesignation = card?.role_title || leader?.designation || fallbackHeading
  const leaderPhoto =
    card?.leader_photo_url ||
    leader?.profile_photo ||
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80"
  const pageTitle = config?.title || `${leaderDesignation} মহোদয়ের বাণী`
  const pageSubtitle = card?.subtitle || config?.subtitle || "মাদ্রাসার সম্মানিত নেতৃত্বের প্রাতিষ্ঠানিক দিকনির্দেশনা"

  const rawMessage = card?.leader_message || ""
  const isHtmlMessage = /<[a-z][\s\S]*>/i.test(rawMessage)

  const paragraphs =
    !isHtmlMessage && rawMessage
      ? rawMessage
          .split(/\n\s*\n/)
          .map((part) => part.trim())
          .filter(Boolean)
      : []

  const staticParagraphs = !card?.leader_message
    ? config?.message || ["নেতৃত্বের বাণী শীঘ্রই বিস্তারিতভাবে আপডেট করা হবে।"]
    : []

  const displayParagraphs = paragraphs.length > 0 ? paragraphs : staticParagraphs

  return (
    <main className="min-h-screen bg-[#F7F9F8]">
      {/* 1. Hero */}
      <PublicHero
        title={pageTitle}
        subtitle={pageSubtitle}
        badgeText="মাদ্রাসার নেতৃত্ব"
        badgeIcon={GraduationCap}
        breadcrumbCurrent={pageTitle}
        breadcrumbParent={{ label: "পরিচালনা", href: "/governing-body" }}
      />

      {/* 2. Main Section */}
      <section className="relative py-12 md:py-20 border-b border-[#E2E7E4] overflow-hidden">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03]" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leader-islamic-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                <path
                  d="M40,10 L47,26 L63,19 L56,35 L72,40 L56,45 L63,61 L47,54 L40,70 L33,54 L17,61 L24,45 L8,40 L24,35 L17,19 L33,26 Z"
                  fill="none"
                  stroke="#075E54"
                  strokeWidth="1.2"
                />
                <circle cx="40" cy="40" r="14" fill="none" stroke="#B68A18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leader-islamic-pattern)" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            
            {/* Left Column: Mehram Arch Framed Profile (4 cols) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
              <div className="overflow-hidden rounded-3xl border border-[#E2E7E4] bg-white p-6 shadow-sm text-center">
                
                {/* Arch Frame */}
                <div className="relative mx-auto w-48 h-64 sm:w-52 sm:h-72 rounded-t-[60px] rounded-b-2xl border-2 border-[#075E54] bg-[#064A42] p-1.5 shadow-md overflow-hidden">
                  <div className="relative w-full h-full rounded-t-[52px] rounded-b-xl overflow-hidden bg-[#064A42]">
                    <Image
                      src={leaderPhoto}
                      alt={leaderName}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 30vw"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="mt-5 space-y-1">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#17211E]">{leaderName}</h2>
                  <p className="text-[15px] font-bold text-[#075E54]">{leaderDesignation}</p>
                  <p className="text-[13px] font-medium text-[#5F6B67]">{instituteName}</p>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-5 border-t border-[#E2E7E4] space-y-2.5">
                  <Link
                    href="/governing-body"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#075E54]/30 bg-white py-2.5 px-4 text-[13.5px] font-semibold text-[#075E54] transition-colors hover:bg-[#F0F7F5]"
                  >
                    <Users className="h-4 w-4" />
                    <span>পরিচালনা পর্ষদের তালিকা</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#075E54] py-2.5 px-4 text-[13.5px] font-bold text-white shadow-xs transition-colors hover:bg-[#064A42]"
                  >
                    <span>যোগাযোগ করুন</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Right Column: Message Card (8 cols) */}
            <div className="lg:col-span-8 overflow-hidden rounded-3xl border border-[#E2E7E4] bg-white p-6 sm:p-9 shadow-sm space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20 shadow-2xs">
                  <Quote className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#17211E]">
                    {pageTitle}
                  </h3>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-4 text-[15px] sm:text-[16.5px] leading-relaxed text-[#2C3834]">
                {isHtmlMessage ? (
                  <div
                    className="prose prose-emerald max-w-none prose-p:leading-relaxed prose-p:text-[#2C3834] prose-p:mb-4"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(rawMessage) }}
                  />
                ) : (
                  displayParagraphs.map((paragraph, index) => (
                    <p key={index} className="text-justify">{paragraph}</p>
                  ))
                )}
              </div>



            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
