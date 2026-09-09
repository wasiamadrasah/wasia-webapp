import { Outfit } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import {
  Images,
  Building2,
  Grid2X2,
  Trophy,
  FlaskConical,
  BookOpen,
  Monitor,
  Drama,
  Play,
} from "lucide-react"

import { PublicBreadcrumb } from "@/components/layout/public-breadcrumb"
import {
  getPhotoGalleryCategories,
  getPhotoGalleryItems,
  getVideoGalleryCategories,
  getVideoGalleryItems,
} from "@/lib/gallery"
import { createPageMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"

export const metadata = createPageMetadata({
  title: "Gallery",
  description:
    "Explore campus life, classrooms, achievements, cultural events, sports, and memorable moments at Purba Bakalia City Corporation High School.",
  path: "/gallery",
  keywords: [
    "school gallery",
    "PBCCHS gallery",
    "campus photos",
    "school events",
    "student activities",
  ],
})

type GalleryPageProps = {
  searchParams?: Promise<{
    category?: string
  }>
}

type GalleryItem = {
  id: string
  type: "photo" | "video"
  category: string
  label: string
  image: string | null
  videoUrl?: string
  createdAt: string | null
}

const categoryIconMap = new Map([
  ["campus", Building2],
  ["sports", Trophy],
  ["science lab", FlaskConical],
  ["science-lab", FlaskConical],
  ["science_lab", FlaskConical],
  ["cultural events", Drama],
  ["cultural-events", Drama],
  ["cultural_events", Drama],
  ["classrooms", Monitor],
  ["library", BookOpen],
])

function formatCategoryLabel(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function getCategoryIcon(value: string) {
  return categoryIconMap.get(value.trim().toLowerCase()) ?? Grid2X2
}

function byNewest(a: GalleryItem, b: GalleryItem) {
  const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
  const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0

  return bTime - aTime
}

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = (await searchParams) ?? {}
  const selectedCategory = (params.category ?? "all").trim().toLowerCase()

  const [photoCategories, videoCategories, photos, videos] = await Promise.all([
    getPhotoGalleryCategories(),
    getVideoGalleryCategories(),
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

  const categoryNames = Array.from(
    new Set([
      ...photoCategories,
      ...videoCategories,
      ...galleryItems.map((item) => item.category),
    ])
  )
    .filter(Boolean)
    .sort((a, b) => formatCategoryLabel(a).localeCompare(formatCategoryLabel(b)))

  const categories = [
    {
      label: "All",
      value: "all",
      icon: Grid2X2,
    },
    ...categoryNames.map((category) => ({
      label: formatCategoryLabel(category),
      value: category,
      icon: getCategoryIcon(category),
    })),
  ]

  const visibleItems =
    selectedCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory)

  return (
    <main>
      {/* HERO */}
      <section className={`${outfit.className} relative overflow-hidden bg-gradient-to-b from-[#021e17] via-[#01251e] to-slate-900 border-b border-emerald-950/40 px-6 py-6 md:px-10 md:py-8`}>
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Modern radial glow overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          {/* Pill Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 shadow-md shadow-emerald-950/30 backdrop-blur-md">
            <Images className="h-3.5 w-3.5 text-emerald-400" />
            <span>PHOTO GALLERY</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Campus{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base">
            Explore memorable moments, academic activities, cultural programs,
            sports, achievements, and everyday campus life at Purba Bakalia
            City Corporation High School.
          </p>
          <div className="mt-4 flex justify-center">
            <PublicBreadcrumb current="Gallery" className="text-sm" plainCurrent />
          </div>
        </div>
      </section>


      {/* CATEGORY FILTER */}
      <section className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto pb-1">
          {categories.map(({ label, value, icon: Icon }) => (
            <Link
              key={label}
              href={
                value === "all"
                  ? "/gallery"
                  : `/gallery?category=${encodeURIComponent(value)}`
              }
              className={`group inline-flex shrink-0 items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold transition-all duration-300 ${
                selectedCategory === value
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-slate-50 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleItems.map((item) => {
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
                  className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 to-emerald-900 text-white">
                        <Play className="h-12 w-12" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                        {item.type === "video"
                          ? `Video / ${formatCategoryLabel(item.category)}`
                          : formatCategoryLabel(item.category)}
                      </span>

                      <h3 className="mt-3 text-lg font-black leading-6 text-white">
                        {item.label}
                      </h3>
                    </div>
                  </div>
                </CardElement>
              )
            })}
          </div>

          {visibleItems.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-700">
                No gallery items found.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Published photo and video gallery items will appear here.
              </p>
            </div>
          ) : null}

          {/* FOOTNOTE */}
          <div className="mt-16 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <Building2 className="h-8 w-8 text-emerald-700" />
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-900">
              More Moments Coming Soon
            </h3>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              New event albums, academic activities, and student achievements
              will be regularly added through the administration panel.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center rounded-full bg-emerald-600 px-7 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20"
            >
              Contact School
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
