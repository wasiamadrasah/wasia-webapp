import { PublicHero } from "@/components/layout/public-hero"
import { Bell } from "lucide-react"
import { getNotices } from "@/lib/db"
import { createPageMetadata } from "@/lib/seo"
import NoticesList from "./notices-list"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "নোটিশ বোর্ড",
  description: "ওয়াসিয়া কামিল মাদ্রাসার সকল অফিসিয়াল নোটিশ, সার্কুলার, ভর্তি ও পরীক্ষার ঘোষণা এবং জরুরি বিজ্ঞপ্তিসমূহ।",
  path: "/notices",
  image: "/images/og/og-notice.png",
  keywords: ["মাদ্রাসা নোটিশ", "ওয়াসিয়া মাদ্রাসা নোটিশ", "নোটিশ বোর্ড", "সার্কুলার"],
})

type NoticeRecord = {
  id: string
  title: string | null
  published_at: string | null
  created_at: string | null
  notice_type: string | null
  attachment_url: string | null
}

export default async function NoticesPage() {
  const notices = (await getNotices(100))
    .filter((item) => item.published === true || Boolean(item.published_at))
    .map((item) => ({
      id: item.id,
      title: item.title,
      published_at: item.published_at,
      created_at: item.created_at,
      notice_type: item.notice_type,
      attachment_url: item.attachment_url,
    })) as NoticeRecord[]

  return (
    <main className="bg-[#F0F7F5]">
      {/* Global Public Hero Banner */}
      <PublicHero
        title="নোটিশ বোর্ড ও সার্কুলার"
        subtitle="মাদ্রাসার সকল সাম্প্রতিক নোটিশ, সার্কুলার, ভর্তি ও পরীক্ষার ঘোষণা এবং জরুরি বিজ্ঞপ্তিসমূহ।"
        badgeText="নোটিশ ও সার্কুলার"
        badgeIcon={Bell}
        breadcrumbCurrent="নোটিশ বোর্ড"
      />

      <NoticesList notices={notices} />
    </main>
  )
}
