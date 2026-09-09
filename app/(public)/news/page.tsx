import { PublicHero } from "@/components/layout/public-hero"
import { Newspaper } from "lucide-react"
import { getNews } from "@/lib/db"
import { createPageMetadata } from "@/lib/seo"
import NewsList from "./news-list"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "সর্বশেষ সংবাদ",
  description: "ওয়াসিয়া কামিল মাদ্রাসার সর্বশেষ সংবাদ, একাডেমিক সাফল্য, অনুষ্ঠান ও গুরুত্বপূর্ণ ঘটনাবলীর বিবরণ।",
  path: "/news",
  keywords: ["মাদ্রাসা সংবাদ", "ওয়াসিয়া মাদ্রাসা খবর", "সর্বশেষ সংবাদ", "একাডেমিক আপডেট"],
})

type NewsRecord = {
  id: string
  title: string | null
  content: string | null
  category: string | null
  featured_image_url: string | null
  published_at: string | null
  created_at: string | null
}

export default async function NewsPublicPage() {
  const news = (await getNews(30))
    .filter((item) => item.published === true || Boolean(item.published_at))
    .map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category,
      featured_image_url: item.featured_image_url,
      published_at: item.published_at,
      created_at: item.created_at,
    })) as NewsRecord[]

  return (
    <main className="bg-[#F0F7F5]">
      {/* Global Public Hero Banner */}
      <PublicHero
        title="সর্বশেষ সংবাদ ও ঘটনাবলী"
        subtitle="ওয়াসিয়া কামিল মাদ্রাসার একাডেমিক কার্যক্রম, অর্জন, অনুষ্ঠানমালা ও সাম্প্রতিক খবরাখবর।"
        badgeText="সংবাদ ও আপডেট"
        badgeIcon={Newspaper}
        breadcrumbCurrent="সর্বশেষ সংবাদ"
      />

      <NewsList news={news} />
    </main>
  )
}
