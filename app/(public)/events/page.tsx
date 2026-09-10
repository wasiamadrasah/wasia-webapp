import { getEvents, getEventCategories } from "@/lib/db"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"
import { createPageMetadata } from "@/lib/seo"
import { CalendarDays } from "lucide-react"
import EventsList from "./events-list"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "অনুষ্ঠানমালা ও কার্যক্রম",
  description: "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসার দ্বীনি মাহফিল, কেরাত প্রতিযোগিতা, জাতীয় দিবস ও একাডেমিক অনুষ্ঠানমালার সময়সূচি।",
  path: "/events",
  keywords: ["মাদ্রাসার অনুষ্ঠানমালা", "ওয়াসিয়া মাদ্রাসা ইভেন্ট", "দ্বীনি মাহফিল", "কেরাত প্রতিযোগিতা", "জাতীয় দিবস"],
})

type EventRecord = {
  id: string
  title: string | null
  description: string | null
  event_date: string | null
  created_at: string | null
  location: string | null
  category: string | null
}

export default async function EventsPage() {
  const [allEvents, categories, instituteSettings] = await Promise.all([
    getEvents(100),
    getEventCategories(),
    getInstituteSettings(),
  ])

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা"

  const events = allEvents
    .filter((item) => item.published !== false)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      event_date: item.event_date,
      created_at: item.created_at,
      location: item.location ?? null,
      category: item.category ?? "general",
    })) as EventRecord[]

  const heroSubtitle = `${instituteName}-এর দ্বীনি মাহফিল, ক্বেরাত প্রতিযোগিতা, বার্ষিক ক্রীড়া, জাতীয় দিবস ও সার্বিক শিক্ষামূলক কার্যক্রম।`

  return (
    <main className="bg-[#F7F8F5]">
      {/* 1. Public Standard Hero Banner */}
      <PublicHero
        title="অনুষ্ঠানমালা ও কার্যক্রম"
        subtitle={heroSubtitle}
        badgeText="অনুষ্ঠান ও ক্যালেন্ডার"
        badgeIcon={CalendarDays}
        breadcrumbCurrent="অনুষ্ঠানমালা"
      />

      {/* 2. Events List Component */}
      <EventsList events={events} categories={categories} />
    </main>
  )
}
