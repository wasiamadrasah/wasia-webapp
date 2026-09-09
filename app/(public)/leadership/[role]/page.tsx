import { Outfit } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight, Quote, Users } from "lucide-react"

import { getHomepageLeadershipCardsForAdmin } from "@/lib/homepage"
import { createPageMetadata, plainText } from "@/lib/seo"
import { sanitizeHTML } from "@/lib/utils"

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
    title: "Message from the President",
    heading: "President's Message",
    subtitle: "Building character, excellence, and a future-ready school culture.",
    message: [
      "Education is not only about academic results; it is about shaping people with values, confidence, and responsibility.",
      "Our institution is committed to creating an inclusive environment where every learner can grow intellectually and morally.",
      "Together with teachers, guardians, and our community, we will continue to build a stronger future for our students.",
    ],
  },
  "chief-education-officer": {
    title: "Message from the Chief Education Officer",
    heading: "Chief Education Officer's Message",
    subtitle: "Academic quality, innovation, and continuous development for every learner.",
    message: [
      "Our academic vision focuses on high standards, critical thinking, and practical learning experiences.",
      "We are strengthening teaching quality through planning, teacher support, and student-centered approaches.",
      "By integrating innovation with discipline, we aim to prepare students for both higher education and life.",
    ],
  },
  headmaster: {
    title: "Message from the Headmaster",
    heading: "Headmaster's Message",
    subtitle: "Nurturing discipline, curiosity, and all-round growth in daily school life.",
    message: [
      "Our classrooms are designed to encourage curiosity, consistency, and respect for learning.",
      "We prioritize a balanced journey where academics, co-curricular activities, and moral development go together.",
      "Every student matters, and we remain dedicated to helping each child reach their highest potential.",
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
      title: "Leadership Message Not Found",
      description: "The requested leadership message could not be found.",
      path: `/leadership/${role}`,
    })
  }

  const leader = card?.staff
  const leaderDesignation = card?.role_title || leader?.designation || config?.heading || "Leadership"
  const pageTitle = config?.title || `Message from the ${leaderDesignation}`
  const description =
    plainText(card?.leader_message, 160) ||
    card?.subtitle ||
    config?.subtitle ||
    "Read a leadership message from Purba Bakalia City Corporation High School."

  return createPageMetadata({
    title: pageTitle,
    description,
    path: `/leadership/${role}`,
    image: card?.leader_photo_url || leader?.profile_photo || undefined,
  })
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default async function LeadershipMessagePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const cards = (await getHomepageLeadershipCardsForAdmin(50)) as LeadershipCardRecord[]
  const card = cards.find((item) => item.role_slug === role) ?? null
  const config = roleConfig[role]

  if (!card && !config) {
    notFound()
  }

  const leader = card?.staff
  const fallbackHeading = config?.heading?.replace("'s Message", "") || "Leadership"
  const leaderName = card?.leader_name || leader?.full_name_en || fallbackHeading
  const leaderDesignation = card?.role_title || leader?.designation || fallbackHeading
  const leaderPhoto = card?.leader_photo_url || leader?.profile_photo || "/avatar.png"
  const pageTitle = config?.title || `Message from the ${leaderDesignation}`
  const pageSubtitle = card?.subtitle || config?.subtitle || "Leadership guidance for our school community."

  const rawMessage = card?.leader_message || ""
  const isHtmlMessage = /<[a-z][\s\S]*>/i.test(rawMessage)

  const paragraphs = !isHtmlMessage && rawMessage
    ? rawMessage
        .split(/\n\s*\n/)
        .map((part) => part.trim())
        .filter(Boolean)
    : []

  const staticParagraphs = !card?.leader_message ? (config?.message || ["Leadership message will be updated soon."]) : []

  return (
    <main>
      <section className={`${outfit.className} relative overflow-hidden bg-gradient-to-b from-[#021e17] via-[#01251e] to-slate-900 border-b border-emerald-950/40 px-6 py-6 md:px-10 md:py-8`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Modern radial glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          {/* Pill Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 shadow-md shadow-emerald-950/30 backdrop-blur-md">
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            <span>Leadership Desk</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {pageTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            {pageSubtitle}
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <aside className="lg:col-span-4">
              <div className="overflow-hidden rounded-lg bg-[#01251e] p-6 text-white shadow-md">
                <div className="overflow-hidden rounded-lg border border-white/10 bg-white/10 p-1">
                  <Image
                    src={leaderPhoto}
                    alt={leaderName}
                    width={800}
                    height={800}
                    unoptimized
                    className="aspect-square w-full rounded-md object-cover"
                  />
                </div>
                <div className="mt-5">
                  <h2 className="text-2xl font-semibold tracking-tight text-white">{leaderName}</h2>
                  <p className="mt-1 text-sm font-medium text-emerald-200">{leaderDesignation}</p>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8 overflow-hidden rounded-lg border border-slate-200 bg-white p-7 shadow-md md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase text-emerald-700 ring-1 ring-emerald-100">
                <Quote className="h-3.5 w-3.5" />
                Leadership Message
              </div>

               <div className="mt-6 space-y-5 text-[15px] leading-8 text-slate-700 md:text-base">
                {isHtmlMessage ? (
                  <div
                    className="prose prose-slate max-w-none prose-p:leading-8 prose-p:text-slate-700 prose-p:mb-5 prose-headings:text-slate-900 prose-strong:text-slate-900"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(rawMessage) }}
                  />
                ) : (
                  <>
                    {(paragraphs.length > 0 ? paragraphs : staticParagraphs).map((paragraph, index) => (
                      <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
