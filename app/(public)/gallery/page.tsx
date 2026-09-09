import Image from "next/image"
import {
  Images,
  Play,
} from "lucide-react"

import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import { PublicHero } from "@/components/layout/public-hero"
import {
  getPhotoGalleryItems,
  getVideoGalleryItems,
} from "@/lib/gallery"
import { createPageMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"
export const revalidate = 60

export const metadata = createPageMetadata({
  title: "ফটোগ্যালারি ও ক্যাম্পাস চিত্র",
  description:
    "ওয়াছিয়া আহমাদিয়া সুন্নিয়া মাদ্রাসার ক্যাম্পাস, শ্রেণিকক্ষ, দ্বীনি অনুষ্ঠান, ক্রীড়া ও বিভিন্ন একাডেমিক কার্যক্রমের চিত্রমালা।",
  path: "/gallery",
  keywords: [
    "মাদ্রাসা গ্যালারি",
    "ফটোগ্যালারি",
    "ক্যাম্পাস ছবি",
    "মাদ্রাসা অনুষ্ঠান",
    "madrasah gallery",
    "wasia madrasah photo gallery",
  ],
})

type GalleryItem = {
  id: string
  type: "photo" | "video"
  category: string
  label: string
  image: string | null
  videoUrl?: string
  createdAt: string | null
}

const categoryTranslationMap: Record<string, string> = {
  campus: "ক্যাম্পাস",
  sports: "খেলাধুলা",
  "science lab": "বিজ্ঞানাগার",
  "science-lab": "বিজ্ঞানাগার",
  "science_lab": "বিজ্ঞানাগার",
  "cultural events": "অনুষ্ঠান",
  "cultural-events": "অনুষ্ঠান",
  "cultural_events": "অনুষ্ঠান",
  classrooms: "শ্রেণিকক্ষ",
  library: "পাঠাগার",
  general: "সাধারণ",
}

function formatCategoryLabel(value: string) {
  const normalized = value.trim().toLowerCase()
  if (categoryTranslationMap[normalized]) {
    return categoryTranslationMap[normalized]
  }
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function byNewest(a: GalleryItem, b: GalleryItem) {
  const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
  const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0

  return bTime - aTime
}

export default async function GalleryPage() {
  const [photos, videos] = await Promise.all([
    getPhotoGalleryItems(200),
    getVideoGalleryItems(200),
  ])

  const galleryItems: GalleryItem[] = [
    ...photos
      .filter((item) => item.published !== false && item.image_url)
      .map((item) => ({
        id: item.id,
        type: "photo" as const,
        category: item.category,
        label: item.title,
        image: item.image_url,
        createdAt: item.photo_date ?? item.created_at,
      })),
    ...videos
      .filter((item) => item.published !== false && item.video_url)
      .map((item) => ({
        id: item.id,
        type: "video" as const,
        category: item.category,
        label: item.title,
        image: item.thumbnail_url,
        videoUrl: item.video_url,
        createdAt: item.video_date ?? item.created_at,
      })),
  ].sort(byNewest)

  return (
    <main className="min-h-screen bg-[#F7F8F5] text-[#17211E]">
      {/* Public Hero adhering to Madrasah Design System */}
      <PublicHero
        title="ফটোগ্যালারি ও ক্যাম্পাস চিত্র"
        subtitle="মাদ্রাসার একাডেমিক কার্যক্রম, জাতীয় ও ধর্মীয় অনুষ্ঠান, প্রতিযোগিতা এবং ক্যাম্পাস জীবনের স্মরণীয় মুহূর্তসমূহ।"
        badgeText="ফটো ও ভিডিও গ্যালারি"
        badgeIcon={Images}
        breadcrumbCurrent="গ্যালারি"
        breadcrumbParent={{ label: "হোম", href: "/" }}
      />

      {/* GALLERY GRID */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryItems.map((item) => {
              const CardElement = item.type === "video" ? "a" : "div"

              return (
                <CardElement
                  key={`${item.type}-${item.id}`}
                  {...(item.type === "video"
                    ? {
                        href: item.videoUrl,
                        target: "_blank",
                        rel: "noreferrer",
                      }
                    : {})}
                  className="group overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#064A42]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#064A42] text-white">
                        <Play className="h-10 w-10 text-[#B68A18]" />
                      </div>
                    )}

                    {/* Gradient Overlay for Readable Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Video Badge */}
                    {item.type === "video" && (
                      <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#075E54] text-white shadow-sm">
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </div>
                    )}

                    {/* Bottom Label & Category */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-1">
                      <span className="inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[12px] font-semibold text-white backdrop-blur-sm">
                        {formatCategoryLabel(item.category)}
                      </span>

                      <h3 className="font-heading text-[16px] font-bold leading-snug text-white line-clamp-2">
                        {item.label}
                      </h3>
                    </div>
                  </div>
                </CardElement>
              )
            })}
          </div>

          {/* Empty State */}
          {galleryItems.length === 0 && (
            <div className="rounded-2xl border border-[#E2E7E4] bg-white p-12 text-center shadow-xs">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                <Images className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#17211E]">
                কোনো ছবি বা ভিডিও পাওয়া যায়নি
              </h3>
              <p className="mt-1 text-[15px] text-[#5F6B67]">
                গ্যালারিতে এখনো কোনো আইটেম যুক্ত করা হয়নি।
              </p>
            </div>
          )}

        </div>
      </section>
    </main>
  )
}
