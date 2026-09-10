import { getDownloads } from "@/lib/db"
import { getInstituteSettings } from "@/lib/institute-settings-store"
import { PublicHero } from "@/components/layout/public-hero"
import { createPageMetadata } from "@/lib/seo"
import { FileDown } from "lucide-react"
import DownloadsList from "./downloads-list"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "ডাউনলোড ও প্রয়োজনীয় ফরমসমূহ",
  description: "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসার ভর্তি ফরম, সিলেবাস, একাডেমিক রুটিন ও প্রাতিষ্ঠানিক নথিপত্র ডাউনলোড করুন।",
  path: "/downloads",
  keywords: ["মাদ্রাসা ডাউনলোড", "ভর্তি ফরম ডাউনলোড", "সিলেবাস ডাউনলোড", "ওয়াসিয়া আহমদিয়া সুন্নিয়া মাদ্রাসা", "একাডেমিক ফাইল"],
})

type DownloadRecord = {
  id: string
  title: string | null
  file_url: string | null
  download_type: string | null
  views: number
  created_at: string | null
}

export default async function DownloadsPage() {
  const [allDownloads, instituteSettings] = await Promise.all([
    getDownloads(500),
    getInstituteSettings(),
  ])

  const instituteName =
    instituteSettings.primary.instituteNameBn?.trim() ||
    instituteSettings.primary.instituteName?.trim() ||
    "ওয়াসিয়া আহমদিয়া সুন্নিয়া আলিম মাদ্রাসা"

  const downloads = allDownloads
    .filter((item) => item.published === true || Boolean(item.published_at))
    .map((item) => ({
      id: item.id,
      title: item.title,
      file_url: item.file_url,
      download_type: item.download_type,
      views: item.views ?? 0,
      created_at: item.created_at,
    })) as DownloadRecord[]

  const heroSubtitle = `${instituteName}-এর ভর্তি ফরম, সিলেবাস, ক্লাস রুটিন, পরীক্ষার সূচি ও অন্যান্য প্রয়োজনীয় প্রাতিষ্ঠানিক নথিপত্র।`

  return (
    <main className="bg-[#F7F8F5]">
      {/* 1. Public Standard Hero Banner */}
      <PublicHero
        title="ডাউনলোড ও ফরমসমূহ"
        subtitle={heroSubtitle}
        badgeText="ডাউনলোড কর্নার"
        badgeIcon={FileDown}
        breadcrumbCurrent="ডাউনলোড"
      />

      {/* 2. Downloads List Component */}
      <DownloadsList downloads={downloads} />
    </main>
  )
}
