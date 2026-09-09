"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Archive, BookOpen, Eye, GalleryHorizontal, Image as ImageIcon, LayoutDashboard, MoreHorizontal, Pencil, Plus, Send, Sparkles, Trash2Icon, Users, BarChart3, Link as LinkIcon } from "lucide-react"

import {
  createHomepageQuickInfoItemAction,
  createHomepageHeroSlideAction,
  deleteHomepageLeadershipCardAction,
  deleteHomepageQuickInfoItemAction,
  deleteHomepageHeroSlideAction,
  setHomepageLeadershipCardStatusAction,
  setHomepageQuickInfoItemStatusAction,
  setHomepageHeroSlideStatusAction,
  updateHomepageQuickInfoItemAction,
  updateHomepageHeroSlideAction,
  updateHomepageLeadershipCardAction,
  createAcademicProgramAction,
  updateAcademicProgramAction,
  setAcademicProgramStatusAction,
  deleteAcademicProgramAction,
  createStatAction,
  updateStatAction,
  setStatStatusAction,
  deleteStatAction,
  createFooterLinkSectionAction,
  updateFooterLinkSectionAction,
  setFooterLinkSectionStatusAction,
  deleteFooterLinkSectionAction,
  createFooterLinkAction,
  updateFooterLinkAction,
  setFooterLinkStatusAction,
  deleteFooterLinkAction,
  createHomepageExtracurricularAction,
  updateHomepageExtracurricularAction,
  setHomepageExtracurricularStatusAction,
  deleteHomepageExtracurricularAction,
} from "@/app/admin/web-config/homepage-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TiptapEditor } from "@/components/forms/tiptap-editor"

type HomepageTab = "overview" | "hero" | "gallery"

type HomepageTabExtended = HomepageTab | "quick-info" | "leadership" | "programs" | "stats" | "footer" | "extracurriculars"

type AcademicProgramRecord = {
  id: string
  program_name: string
  program_slug: string
  description: string | null
  icon_key: string
  link_url: string | null
  display_order: number
  is_active: boolean
  created_at: string | null
}

type HomepageStatRecord = {
  id: string
  stat_label: string
  stat_slug: string
  stat_value: number
  stat_suffix: string
  description: string | null
  icon_key: string
  color_scheme: string
  display_order: number
  is_active: boolean
  created_at: string | null
}

type FooterLinkRecord = {
  id: string
  link_label: string
  link_url: string
  display_order: number
  is_active: boolean
}

type FooterLinkSectionRecord = {
  id: string
  section_name: string
  section_slug: string
  display_order: number
  is_active: boolean
  links: FooterLinkRecord[]
  created_at: string | null
}

type GalleryPhotoRecord = {
  id: string
  title: string
  description: string | null
  category: string
  image_url: string
  photo_date: string | null
  published: boolean | null
  created_at: string | null
}

type HeroSlideRecord = {
  id: string
  title: string
  image_url: string
  display_order: number
  is_active: boolean
  created_at: string | null
}

type QuickInfoRecord = {
  id: string
  title: string
  subtitle: string
  icon_key: string
  link_url: string | null
  display_order: number
  is_active: boolean
  created_at: string | null
}

type LeadershipCardRecord = {
  id: string
  role_slug: string
  role_title: string
  leader_name: string | null
  leader_photo_url: string | null
  leader_message: string | null
  subtitle: string | null
  display_order: number
  is_active: boolean
  staff: {
    id: string
    full_name_en: string | null
    designation: string | null
    profile_photo: string | null
  } | null
}

type StaffOption = {
  id: string
  full_name_en: string | null
  designation: string | null
}

type HomepageExtracurricularRecord = {
  id: string
  name: string
  slug: string
  description: string | null
  icon_key: string
  logo_url: string | null
  display_order: number
  is_active: boolean
  created_at: string | null
}

type HomepageSettingsManagerProps = {
  heroSlides: HeroSlideRecord[]
  quickInfoItems: QuickInfoRecord[]
  leadershipCards: LeadershipCardRecord[]
  staffOptions: StaffOption[]
  academicPrograms: AcademicProgramRecord[]
  homeStats: HomepageStatRecord[]
  footerSections: FooterLinkSectionRecord[]
  galleryPhotos: GalleryPhotoRecord[]
  extracurriculars: HomepageExtracurricularRecord[]
  status?: string
  message?: string
  initialTab?: string
}

const quickInfoIconOptions = [
  { value: "book-open", label: "Book Open" },
  { value: "award", label: "Award" },
  { value: "calendar", label: "Calendar" },
  { value: "heart", label: "Heart" },
  { value: "users", label: "Users" },
  { value: "zap", label: "Zap" },
  { value: "sparkles", label: "Sparkles" },
] as const

const iconOptions = [
  { value: "book-open", label: "Book Open" },
  { value: "graduation-cap", label: "Graduation Cap" },
  { value: "bar-chart-3", label: "Bar Chart" },
  { value: "zap", label: "Zap" },
  { value: "award", label: "Award" },
  { value: "sparkles", label: "Sparkles" },
  { value: "users", label: "Users" },
  { value: "calendar", label: "Calendar" },
  { value: "heart", label: "Heart" },
] as const

const colorSchemeOptions = [
  { value: "emerald", label: "Emerald" },
  { value: "cyan", label: "Cyan" },
  { value: "amber", label: "Amber" },
  { value: "rose", label: "Rose" },
] as const

const extracurricularIconOptions = [
  { value: "compass", label: "Compass (Scouts)" },
  { value: "heart", label: "Heart (Red Crescent)" },
  { value: "trophy", label: "Trophy (Football)" },
  { value: "award", label: "Award (Cricket)" },
  { value: "message-square", label: "Message Square (Debate)" },
  { value: "languages", label: "Languages (English)" },
  { value: "sparkles", label: "Sparkles (Other)" },
] as const

function QuickInfoIconField({
  id,
  defaultValue,
  name = "icon_key",
}: {
  id: string
  defaultValue?: string
  name?: string
}) {
  const [value, setValue] = useState(defaultValue || "sparkles")

  return (
    <Field>
      <FieldLabel htmlFor={id}>Icon</FieldLabel>
      <input type="hidden" name={name} value={value} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id={id} className="!h-11 !w-full rounded-xl border border-input bg-background text-foreground px-4">
          <SelectValue placeholder="Select icon" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {quickInfoIconOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

function stripHtmlTags(html: string): string {
  if (!html) return ""
  let text = html.replace(/<[^>]*>/g, "")
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  return text.trim()
}

export function HomepageSettingsManager({ heroSlides, quickInfoItems, leadershipCards, academicPrograms, homeStats, footerSections, galleryPhotos, extracurriculars = [], status, message, initialTab }: HomepageSettingsManagerProps) {
  const validInitialTab: HomepageTabExtended =
    initialTab === "hero" || initialTab === "gallery" || initialTab === "quick-info" || initialTab === "leadership" || initialTab === "programs" || initialTab === "stats" || initialTab === "footer" || initialTab === "extracurriculars"
      ? initialTab
      : "overview"
  const [activeTab, setActiveTab] = useState<HomepageTabExtended>(validInitialTab)

  const tabItems = useMemo(
    () => [
      {
        id: "overview" as const,
        label: "Overview",
        description: "Quick stats and preview",
        icon: LayoutDashboard,
      },
      {
        id: "hero" as const,
        label: "Hero Section",
        description: "Slides and ordering",
        icon: ImageIcon,
      },
      {
        id: "gallery" as const,
        label: "Photo Gallery",
        description: "Section text and items",
        icon: GalleryHorizontal,
      },
      {
        id: "quick-info" as const,
        label: "Quick Info",
        description: "Info bar cards",
        icon: BookOpen,
      },
      {
        id: "leadership" as const,
        label: "Leadership",
        description: "Homepage role cards",
        icon: Users,
      },
      {
        id: "programs" as const,
        label: "Academic Programs",
        description: "Program cards and ordering",
        icon: BookOpen,
      },
      {
        id: "extracurriculars" as const,
        label: "Extracurriculars",
        description: "Clubs and activities",
        icon: Sparkles,
      },
      {
        id: "stats" as const,
        label: "Statistics",
        description: "Homepage stat counters",
        icon: BarChart3,
      },
      {
        id: "footer" as const,
        label: "Footer Links",
        description: "Quick links and sections",
        icon: LinkIcon,
      },
    ],
    []
  )

  const publishedGalleryCount = galleryPhotos.filter((item) => item.published !== false).length
  const activeHeroSlidesCount = heroSlides.filter((item) => item.is_active).length
  const activeQuickInfoCount = quickInfoItems.filter((item) => item.is_active).length
  const activeLeadershipCount = leadershipCards.filter((item) => item.is_active).length
  const activeProgramCount = academicPrograms.filter((item) => item.is_active).length
  const activeStatCount = homeStats.filter((item) => item.is_active).length
  const activeFooterSectionCount = footerSections.filter((item) => item.is_active).length
  const activeFooterLinkCount = footerSections.reduce((count, section) => count + section.links.filter((link) => link.is_active).length, 0)
  const activeExtracurricularCount = extracurriculars.filter((item) => item.is_active).length

  const tabCounts: Record<HomepageTabExtended, number | undefined> = {
    overview: undefined,
    hero: heroSlides.length,
    "quick-info": quickInfoItems.length,
    leadership: leadershipCards.length,
    gallery: galleryPhotos.length,
    programs: academicPrograms.length,
    extracurriculars: extracurriculars.length,
    stats: homeStats.length,
    footer: footerSections.length,
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Homepage Settings</h1>
        <p className="text-muted-foreground">
          Configure homepage sections with tab-based navigation. Switch tabs instantly without page refresh.
        </p>
      </div>

      {message ? (
        <div className={`rounded-xl border px-4 py-3 text-sm ${status === "success" ? "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200" : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"}`}>
          {message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-xl border bg-card p-3 lg:sticky lg:top-4 lg:h-fit">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sections</p>
          <nav className="space-y-1">
            {tabItems.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              const count = tabCounts[tab.id]
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition ${
                    isActive
                      ? "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-100"
                      : "border-transparent hover:border-muted-foreground/20 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <Icon className={`mt-0.5 size-4 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`} />
                    <span className="space-y-0.5 truncate">
                      <span className="block text-sm font-medium leading-tight">{tab.label}</span>
                      <span className="block text-xs text-muted-foreground truncate">{tab.description}</span>
                    </span>
                  </div>
                  {count !== undefined ? (
                    <Badge
                      variant={isActive ? "primary" : "secondary"}
                      className="ml-2 shrink-0 font-mono text-xs px-2 py-0.5"
                    >
                      {count}
                    </Badge>
                  ) : null}
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          {activeTab === "overview" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Overview</h2>
                  <p className="text-sm text-muted-foreground">Live summary of homepage sections and publish status.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild>
                    <Link href="/" target="_blank" rel="noreferrer">
                      <Eye className="size-4" />
                      Open Homepage
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/photo-gallery">
                      <GalleryHorizontal className="size-4" />
                      Open Photo Gallery
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 dark:border-sky-900/60 dark:from-sky-950/40 dark:to-cyan-950/30 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Hero Slides</p>
                    <ImageIcon className="size-4 text-sky-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-sky-900 dark:text-sky-100">{activeHeroSlidesCount} / {heroSlides.length}</p>
                  <p className="text-xs text-sky-800/80 dark:text-sky-300/70">Active / Total</p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 dark:border-blue-900/60 dark:from-blue-950/40 dark:to-sky-950/30 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Quick Info</p>
                    <Sparkles className="size-4 text-blue-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-100">{activeQuickInfoCount} / {quickInfoItems.length}</p>
                  <p className="text-xs text-blue-800/80 dark:text-blue-300/70">Active / Total</p>
                </div>
                <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:border-violet-900/60 dark:from-violet-950/40 dark:to-fuchsia-950/30 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Leadership Cards</p>
                    <Users className="size-4 text-violet-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-violet-900 dark:text-violet-100">{activeLeadershipCount} / {leadershipCards.length}</p>
                  <p className="text-xs text-violet-800/80 dark:text-violet-300/70">Active / Total</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:border-amber-900/60 dark:from-amber-950/40 dark:to-orange-950/30 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Photo Gallery</p>
                    <GalleryHorizontal className="size-4 text-amber-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-amber-900 dark:text-amber-100">{publishedGalleryCount} / {galleryPhotos.length}</p>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300/70">Published / Total</p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900/60 dark:from-blue-950/40 dark:to-indigo-950/30 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Academic Programs</p>
                    <BookOpen className="size-4 text-blue-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-100">{activeProgramCount} / {academicPrograms.length}</p>
                  <p className="text-xs text-blue-800/80 dark:text-blue-300/70">Active / Total</p>
                </div>
                <div className="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 dark:border-rose-900/60 dark:from-rose-950/40 dark:to-pink-950/30 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">Stats</p>
                    <BarChart3 className="size-4 text-rose-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-rose-900 dark:text-rose-100">{activeStatCount} / {homeStats.length}</p>
                  <p className="text-xs text-rose-800/80 dark:text-rose-300/70">Active / Total</p>
                </div>
                <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-teal-50 dark:border-cyan-900/60 dark:from-cyan-950/40 dark:to-teal-950/30 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Footer Sections</p>
                    <LayoutDashboard className="size-4 text-cyan-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-cyan-900 dark:text-cyan-100">{activeFooterSectionCount} / {footerSections.length}</p>
                  <p className="text-xs text-cyan-800/80 dark:text-cyan-300/70">Active / Total</p>
                </div>
                <div className="rounded-xl border border-lime-200 bg-gradient-to-br from-lime-50 to-green-50 dark:border-lime-900/60 dark:from-lime-950/40 dark:to-green-950/30 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-lime-700 dark:text-lime-300">Footer Links</p>
                    <LinkIcon className="size-4 text-lime-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-lime-900 dark:text-lime-100">{activeFooterLinkCount}</p>
                  <p className="text-xs text-lime-800/80 dark:text-lime-300/70">Active links across all sections</p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 dark:border-blue-900/60 dark:from-blue-950/40 dark:to-sky-950/30 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Extracurriculars</p>
                    <Sparkles className="size-4 text-blue-600" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-100">{activeExtracurricularCount} / {extracurriculars.length}</p>
                  <p className="text-xs text-blue-800/80 dark:text-blue-300/70">Active / Total</p>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
                Homepage photo gallery cards now read from the same data source as the public homepage feed.
              </div>
            </section>
          ) : null}

          {activeTab === "hero" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Hero Section</h2>
                  <p className="text-sm text-muted-foreground">Manage top slider content and order.</p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Plus className="size-4" />
                      Add New Hero Photo
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-2xl sm:max-w-2xl">
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <Sparkles className="size-5" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Add Hero Slide</AlertDialogTitle>
                      <AlertDialogDescription>
                          Add a new hero slide image and title. Use a wide banner image for the best fit on the homepage.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                      <form action={createHomepageHeroSlideAction} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="hero-title" className="text-sm font-medium text-foreground">Title</label>
                        <input id="hero-title" name="title" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Main Campus" />
                      </div>

                      <div className="space-y-2">
                          <label htmlFor="hero-image-file" className="text-sm font-medium text-foreground">Hero Image</label>
                          <input id="hero-image-file" name="image_file" type="file" accept="image/jpeg,image/png,image/webp" required className="block h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 py-2 outline-none focus:border-primary" />
                          <p className="text-xs text-muted-foreground">Recommended size: 1920 x 1080 px or wider, for a clean full-width hero on desktop and mobile.</p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="hero-display-order" className="text-sm font-medium text-foreground">Display Order</label>
                        <input id="hero-display-order" type="number" name="display_order" defaultValue={heroSlides.length} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit">Save Hero Slide</Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <table className="w-full min-w-[860px] text-sm">
                  <thead className="bg-muted/40 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">ID</th>
                      <th className="px-3 py-2 font-medium">Title</th>
                      <th className="px-3 py-2 font-medium">Image URL</th>
                      <th className="px-3 py-2 font-medium">Order</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroSlides.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-3 py-2 font-mono text-xs">{item.id}</td>
                        <td className="px-3 py-2">{item.title}</td>
                        <td className="px-3 py-2 max-w-[260px] truncate">
                          <a href={item.image_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-300">
                            {item.image_url}
                          </a>
                        </td>
                        <td className="px-3 py-2">{item.display_order}</td>
                        <td className="px-3 py-2">
                          <Badge variant={item.is_active ? "success" : "secondary"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`hero-edit-trigger-${item.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-2xl sm:max-w-2xl">
                              <AlertDialogHeader>
                                <AlertDialogMedia>
                                  <Pencil className="size-5" />
                                </AlertDialogMedia>
                                <AlertDialogTitle>Edit Hero Slide</AlertDialogTitle>
                                <AlertDialogDescription>Update title, image URL and order.</AlertDialogDescription>
                              </AlertDialogHeader>

                              <form action={updateHomepageHeroSlideAction} className="space-y-4">
                                <input type="hidden" name="id" value={item.id} />
                                <input type="hidden" name="image_url" value={item.image_url} />
                                <div className="space-y-2">
                                  <label htmlFor={`edit-hero-title-${item.id}`} className="text-sm font-medium text-foreground">Title</label>
                                  <input id={`edit-hero-title-${item.id}`} name="title" defaultValue={item.title} required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor={`edit-hero-image-${item.id}`} className="text-sm font-medium text-foreground">Replace Hero Image</label>
                                  <input id={`edit-hero-image-${item.id}`} name="image_file" type="file" accept="image/jpeg,image/png,image/webp" className="block h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 py-2 outline-none focus:border-primary" />
                                  <p className="text-xs text-muted-foreground">Leave empty to keep the existing image. Recommended size: 1920 x 1080 px or wider.</p>
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor={`edit-hero-order-${item.id}`} className="text-sm font-medium text-foreground">Display Order</label>
                                  <input id={`edit-hero-order-${item.id}`} type="number" name="display_order" defaultValue={item.display_order} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <Button type="submit">Save Changes</Button>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>

                          <form id={`hero-archive-form-${item.id}`} action={setHomepageHeroSlideStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="archived" />
                          </form>

                          <form id={`hero-publish-form-${item.id}`} action={setHomepageHeroSlideStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="published" />
                          </form>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`hero-delete-trigger-${item.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                              <AlertDialogHeader>
                                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                  <Trash2Icon />
                                </AlertDialogMedia>
                                <AlertDialogTitle>Delete Hero Slide?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this hero slide.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <form action={deleteHomepageHeroSlideAction}>
                                <input type="hidden" name="id" value={item.id} />
                                <AlertDialogFooter>
                                  <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                                  <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Open actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  const trigger = document.getElementById(`hero-edit-trigger-${item.id}`)
                                  trigger?.click()
                                }}
                              >
                                <Pencil className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                              {item.is_active ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    const form = document.getElementById(`hero-archive-form-${item.id}`) as HTMLFormElement | null
                                    form?.requestSubmit()
                                  }}
                                >
                                  <Archive className="mr-2 size-4" />
                                  Archive
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    const form = document.getElementById(`hero-publish-form-${item.id}`) as HTMLFormElement | null
                                    form?.requestSubmit()
                                  }}
                                >
                                  <Send className="mr-2 size-4" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-700"
                                onClick={() => {
                                  const trigger = document.getElementById(`hero-delete-trigger-${item.id}`)
                                  trigger?.click()
                                }}
                              >
                                <Trash2Icon className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {heroSlides.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-6 text-center text-sm text-muted-foreground">
                          No hero slides found. Add your first hero photo.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeTab === "quick-info" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Quick Info Bar</h2>
                  <p className="text-sm text-muted-foreground">Manage the cards shown right after the hero section.</p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Plus className="size-4" />
                      Add Quick Info
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-2xl sm:max-w-2xl">
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <Sparkles className="size-5" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Add Quick Info Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Add or replace a card in the colored quick info bar under the hero.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <form action={createHomepageQuickInfoItemAction} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="quick-info-title" className="text-sm font-medium text-foreground">Title</label>
                          <input id="quick-info-title" name="title" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Admission Open" />
                        </div>
                        <QuickInfoIconField id="quick-info-icon" defaultValue="sparkles" />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="quick-info-subtitle" className="text-sm font-medium text-foreground">Subtitle</label>
                        <input id="quick-info-subtitle" name="subtitle" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Session 2026-2027" />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="quick-info-link" className="text-sm font-medium text-foreground">Link URL</label>
                          <input id="quick-info-link" name="link_url" className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="/admission" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="quick-info-order" className="text-sm font-medium text-foreground">Display Order</label>
                          <input id="quick-info-order" type="number" name="display_order" defaultValue={quickInfoItems.length} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit">Save Quick Info</Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <table className="w-full min-w-[980px] text-sm">
                  <thead className="bg-muted/40 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">ID</th>
                      <th className="px-3 py-2 font-medium">Title</th>
                      <th className="px-3 py-2 font-medium">Subtitle</th>
                      <th className="px-3 py-2 font-medium">Icon</th>
                      <th className="px-3 py-2 font-medium">Link</th>
                      <th className="px-3 py-2 font-medium">Order</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickInfoItems.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-3 py-2 font-mono text-xs">{item.id}</td>
                        <td className="px-3 py-2">{item.title}</td>
                        <td className="px-3 py-2">{item.subtitle}</td>
                        <td className="px-3 py-2">{item.icon_key}</td>
                        <td className="px-3 py-2 max-w-[180px] truncate">{item.link_url || "-"}</td>
                        <td className="px-3 py-2">{item.display_order}</td>
                        <td className="px-3 py-2">
                          <Badge variant={item.is_active ? "success" : "secondary"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`quick-info-edit-trigger-${item.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-2xl sm:max-w-2xl">
                              <AlertDialogHeader>
                                <AlertDialogMedia>
                                  <Pencil className="size-5" />
                                </AlertDialogMedia>
                                <AlertDialogTitle>Edit Quick Info Item</AlertDialogTitle>
                                <AlertDialogDescription>Update the bar card content and ordering.</AlertDialogDescription>
                              </AlertDialogHeader>

                              <form action={updateHomepageQuickInfoItemAction} className="space-y-4">
                                <input type="hidden" name="id" value={item.id} />
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <label htmlFor={`quick-info-title-${item.id}`} className="text-sm font-medium text-foreground">Title</label>
                                    <input id={`quick-info-title-${item.id}`} name="title" defaultValue={item.title} required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                  </div>
                                  <QuickInfoIconField id={`quick-info-icon-${item.id}`} defaultValue={item.icon_key} />
                                </div>

                                <div className="space-y-2">
                                  <label htmlFor={`quick-info-subtitle-${item.id}`} className="text-sm font-medium text-foreground">Subtitle</label>
                                  <input id={`quick-info-subtitle-${item.id}`} name="subtitle" defaultValue={item.subtitle} required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <label htmlFor={`quick-info-link-${item.id}`} className="text-sm font-medium text-foreground">Link URL</label>
                                    <input id={`quick-info-link-${item.id}`} name="link_url" defaultValue={item.link_url ?? ""} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                  </div>
                                  <div className="space-y-2">
                                    <label htmlFor={`quick-info-order-${item.id}`} className="text-sm font-medium text-foreground">Display Order</label>
                                    <input id={`quick-info-order-${item.id}`} type="number" name="display_order" defaultValue={item.display_order} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                  </div>
                                </div>

                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <Button type="submit">Save Changes</Button>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>

                          <form id={`quick-info-archive-form-${item.id}`} action={setHomepageQuickInfoItemStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="archived" />
                          </form>

                          <form id={`quick-info-publish-form-${item.id}`} action={setHomepageQuickInfoItemStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="published" />
                          </form>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`quick-info-delete-trigger-${item.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                              <AlertDialogHeader>
                                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                  <Trash2Icon />
                                </AlertDialogMedia>
                                <AlertDialogTitle>Delete Quick Info Item?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this quick info card.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <form action={deleteHomepageQuickInfoItemAction}>
                                <input type="hidden" name="id" value={item.id} />
                                <AlertDialogFooter>
                                  <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                                  <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Open quick info actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  const trigger = document.getElementById(`quick-info-edit-trigger-${item.id}`)
                                  trigger?.click()
                                }}
                              >
                                <Pencil className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                              {item.is_active ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    const form = document.getElementById(`quick-info-archive-form-${item.id}`) as HTMLFormElement | null
                                    form?.requestSubmit()
                                  }}
                                >
                                  <Archive className="mr-2 size-4" />
                                  Archive
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    const form = document.getElementById(`quick-info-publish-form-${item.id}`) as HTMLFormElement | null
                                    form?.requestSubmit()
                                  }}
                                >
                                  <Send className="mr-2 size-4" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-700"
                                onClick={() => {
                                  const trigger = document.getElementById(`quick-info-delete-trigger-${item.id}`)
                                  trigger?.click()
                                }}
                              >
                                <Trash2Icon className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {quickInfoItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center text-sm text-muted-foreground">
                          No quick info items found. Add the first card for the info bar.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeTab === "leadership" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Leadership Cards</h2>
                  <p className="text-sm text-muted-foreground">Manage homepage leaders by name, designation, photo, and message.</p>
                </div>

                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Plus className="size-4" />
                      Add New Leadership Card
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="!max-w-5xl sm:!max-w-5xl max-h-[90vh] flex flex-col">
                    <AlertDialogHeader className="flex-shrink-0">
                      <AlertDialogMedia>
                        <Sparkles className="size-5" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Add Leadership Card</AlertDialogTitle>
                      <AlertDialogDescription>
                        Create a new homepage leadership card with its own name, designation, photo, and message.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <form action={updateHomepageLeadershipCardAction} className="flex flex-col flex-1 overflow-hidden space-y-4">
                      <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[55vh]">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label htmlFor="leadership-role-slug" className="text-sm font-medium text-foreground">Role Slug</label>
                            <input id="leadership-role-slug" name="role_slug" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="vice-principal" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="leadership-role-title" className="text-sm font-medium text-foreground">Designation</label>
                            <input id="leadership-role-title" name="role_title" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Vice Principal" />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label htmlFor="leadership-name" className="text-sm font-medium text-foreground">Leader Name</label>
                            <input id="leadership-name" name="leader_name" className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Dr. Jane Doe" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="leadership-photo-file" className="text-sm font-medium text-foreground">Leader Photo</label>
                            <input id="leadership-photo-file" name="leader_photo_file" type="file" accept="image/jpeg,image/png,image/webp" className="block h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 py-2 outline-none focus:border-primary" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="leadership-photo-url" className="text-sm font-medium text-foreground">Photo URL Optional</label>
                          <input id="leadership-photo-url" name="leader_photo_url" className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="https://..." />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="leadership-subtitle" className="text-sm font-medium text-foreground">Subtitle</label>
                          <input id="leadership-subtitle" name="subtitle" className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Supporting school growth and operations." />
                        </div>

                        <div className="space-y-2">
                          <TiptapEditor
                            name="leader_message"
                            label="Leader Message"
                            initialValue=""
                            minHeightClassName="min-h-[180px]"
                            allowImage={false}
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="leadership-order" className="text-sm font-medium text-foreground">Display Order</label>
                          <input id="leadership-order" type="number" name="display_order" defaultValue={leadershipCards.length > 0 ? Math.max(...leadershipCards.map((card) => card.display_order)) + 1 : 1} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                        </div>
                      </div>

                      <AlertDialogFooter className="flex-shrink-0 pt-2 border-t">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit">Save Leadership Card</Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <table className="w-full min-w-[980px] text-sm">
                  <thead className="bg-muted/40 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">Role</th>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Designation</th>
                      <th className="px-3 py-2 font-medium">Photo</th>
                      <th className="px-3 py-2 font-medium">Message</th>
                      <th className="px-3 py-2 font-medium">Order</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadershipCards.map((item) => {
                      const rawMessage = item.leader_message || item.subtitle || "-"
                      const messageText = rawMessage !== "-" ? stripHtmlTags(rawMessage) : "-"
                      const messagePreview = messageText.length > 90 ? `${messageText.slice(0, 90)}...` : messageText

                      return (
                        <tr key={item.id} className="border-t align-top">
                          <td className="px-3 py-3 font-medium capitalize">{item.role_slug.replace(/-/g, " ")}</td>
                          <td className="px-3 py-3">{item.leader_name || "-"}</td>
                          <td className="px-3 py-3">{item.role_title}</td>
                          <td className="px-3 py-3">{item.leader_photo_url ? <a href={item.leader_photo_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-300">View</a> : "-"}</td>
                          <td className="px-3 py-3">
                            <p className="max-w-[280px] text-sm text-slate-700">{messagePreview}</p>
                            {messageText !== "-" ? (
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-blue-600 hover:text-blue-700 dark:text-blue-300"
                                onClick={() => {
                                  const trigger = document.getElementById(`leadership-view-trigger-${item.id}`)
                                  trigger?.click()
                                }}
                              >
                                View
                              </Button>
                            ) : null}
                          </td>
                          <td className="px-3 py-3">{item.display_order}</td>
                          <td className="px-3 py-3">
                            <Badge variant={item.is_active ? "success" : "secondary"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button id={`leadership-edit-trigger-${item.id}`} type="button" className="hidden" />
                              </AlertDialogTrigger>
                              <AlertDialogContent className="!max-w-5xl sm:!max-w-5xl max-h-[90vh] flex flex-col">
                                <AlertDialogHeader className="flex-shrink-0">
                                  <AlertDialogMedia>
                                    <Pencil className="size-5" />
                                  </AlertDialogMedia>
                                  <AlertDialogTitle>Edit Leadership Card</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Update the leader name, designation, photo, and public message.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <form action={updateHomepageLeadershipCardAction} className="flex flex-col flex-1 overflow-hidden space-y-4">
                                  <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[55vh]">
                                    <input type="hidden" name="role_slug" value={item.role_slug} />
                                    <input type="hidden" name="display_order" value={item.display_order} />
                                    <input type="hidden" name="subtitle" value={item.subtitle ?? ""} />
                                    <input type="hidden" name="staff_id" value="" />

                                    <div className="grid gap-4 md:grid-cols-2">
                                      <div className="space-y-2">
                                        <label htmlFor={`leader-name-${item.id}`} className="text-sm font-medium text-foreground">Leader Name</label>
                                        <input id={`leader-name-${item.id}`} name="leader_name" defaultValue={item.leader_name ?? ""} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Leader name" />
                                      </div>
                                      <div className="space-y-2">
                                        <label htmlFor={`role-title-${item.id}`} className="text-sm font-medium text-foreground">Designation</label>
                                        <input id={`role-title-${item.id}`} name="role_title" defaultValue={item.role_title} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Designation" />
                                      </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                      <div className="space-y-2">
                                        <label htmlFor={`leader-photo-url-${item.id}`} className="text-sm font-medium text-foreground">Photo URL</label>
                                        <input id={`leader-photo-url-${item.id}`} name="leader_photo_url" defaultValue={item.leader_photo_url ?? ""} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="https://..." />
                                      </div>
                                      <div className="space-y-2">
                                        <label htmlFor={`leader-photo-file-${item.id}`} className="text-sm font-medium text-foreground">Replace Photo</label>
                                        <input id={`leader-photo-file-${item.id}`} name="leader_photo_file" type="file" accept="image/jpeg,image/png,image/webp" className="block h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 py-2 outline-none focus:border-primary" />
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <TiptapEditor
                                        name="leader_message"
                                        label="Leader Message"
                                        initialValue={item.leader_message ?? ""}
                                        minHeightClassName="min-h-[200px]"
                                        allowImage={false}
                                      />
                                    </div>
                                  </div>

                                  <AlertDialogFooter className="flex-shrink-0 pt-2 border-t">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <Button type="submit">Save Changes</Button>
                                  </AlertDialogFooter>
                                </form>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button id={`leadership-view-trigger-${item.id}`} type="button" className="hidden" />
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-xl sm:max-w-xl">
                                <AlertDialogHeader>
                                  <AlertDialogMedia>
                                    <Eye className="size-5" />
                                  </AlertDialogMedia>
                                  <AlertDialogTitle>Leader Message</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {item.leader_name || item.role_title}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="max-h-[55vh] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 whitespace-pre-wrap">
                                  {messageText}
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Close</AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <form id={`leadership-archive-form-${item.id}`} action={setHomepageLeadershipCardStatusAction} className="hidden">
                              <input type="hidden" name="role_slug" value={item.role_slug} />
                              <input type="hidden" name="status" value="archived" />
                            </form>

                            <form id={`leadership-publish-form-${item.id}`} action={setHomepageLeadershipCardStatusAction} className="hidden">
                              <input type="hidden" name="role_slug" value={item.role_slug} />
                              <input type="hidden" name="status" value="published" />
                            </form>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button id={`leadership-delete-trigger-${item.id}`} type="button" className="hidden" />
                              </AlertDialogTrigger>
                              <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                    <Trash2Icon />
                                  </AlertDialogMedia>
                                  <AlertDialogTitle>Delete Leadership Card?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this leadership card.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <form action={deleteHomepageLeadershipCardAction}>
                                  <input type="hidden" name="role_slug" value={item.role_slug} />
                                  <AlertDialogFooter>
                                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                                    <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </form>
                              </AlertDialogContent>
                            </AlertDialog>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Open leadership actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    const trigger = document.getElementById(`leadership-edit-trigger-${item.id}`)
                                    trigger?.click()
                                  }}
                                >
                                  <Pencil className="mr-2 size-4" />
                                  Edit
                                </DropdownMenuItem>
                                {item.is_active ? (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      const form = document.getElementById(`leadership-archive-form-${item.id}`) as HTMLFormElement | null
                                      form?.requestSubmit()
                                    }}
                                  >
                                    <Archive className="mr-2 size-4" />
                                    Archive
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      const form = document.getElementById(`leadership-publish-form-${item.id}`) as HTMLFormElement | null
                                      form?.requestSubmit()
                                    }}
                                  >
                                    <Send className="mr-2 size-4" />
                                    Publish
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-700"
                                  onClick={() => {
                                    const trigger = document.getElementById(`leadership-delete-trigger-${item.id}`)
                                    trigger?.click()
                                  }}
                                >
                                  <Trash2Icon className="mr-2 size-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      )
                    })}
                    {leadershipCards.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center text-sm text-muted-foreground">
                          No leadership cards found. The default three roles will appear after the migration is applied.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeTab === "gallery" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Photo Gallery Section</h2>
                  <p className="text-sm text-muted-foreground">
                    Uses the same photo gallery records shown on the public homepage.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/admin/photo-gallery">
                    <Plus className="size-4" />
                    Manage Photo Gallery
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Photos</p>
                  <p className="mt-2 text-2xl font-bold">{galleryPhotos.length}</p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Published Photos</p>
                  <p className="mt-2 text-2xl font-bold">{galleryPhotos.filter((item) => item.published !== false).length}</p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</p>
                  <p className="mt-2 text-2xl font-bold">{new Set(galleryPhotos.map((item) => item.category)).size}</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <table className="w-full min-w-[920px] text-sm">
                  <thead className="bg-muted/40 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">ID</th>
                      <th className="px-3 py-2 font-medium">Title</th>
                      <th className="px-3 py-2 font-medium">Category</th>
                      <th className="px-3 py-2 font-medium">Date</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium">Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleryPhotos.slice(0, 20).map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-3 py-2 font-mono text-xs">{item.id}</td>
                        <td className="px-3 py-2">{item.title}</td>
                        <td className="px-3 py-2 capitalize">{item.category}</td>
                        <td className="px-3 py-2">{item.photo_date ? new Date(item.photo_date).toLocaleDateString() : "-"}</td>
                        <td className="px-3 py-2">
                          <Badge variant={item.published !== false ? "success" : "secondary"}>{item.published !== false ? "Published" : "Draft"}</Badge>
                        </td>
                        <td className="px-3 py-2 max-w-[220px] truncate">
                          <a href={item.image_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-300">
                            Open Image
                          </a>
                        </td>
                      </tr>
                    ))}
                    {galleryPhotos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-6 text-center text-sm text-muted-foreground">
                          No photo gallery items found. Add photos from the Photo Gallery admin page.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeTab === "programs" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Academic Programs</h2>
                  <p className="text-sm text-muted-foreground">Manage program cards, icons and order.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Plus className="size-4" />
                      Add Program
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-2xl sm:max-w-2xl">
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <Sparkles className="size-5" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Add Academic Program</AlertDialogTitle>
                      <AlertDialogDescription>Create a new academic program card.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <form action={createAcademicProgramAction} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="prog-name" className="text-sm font-medium text-foreground">Program Name</label>
                        <input id="prog-name" name="program_name" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Science" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="prog-slug" className="text-sm font-medium text-foreground">Program Slug</label>
                        <input id="prog-slug" name="program_slug" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="science" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="prog-desc" className="text-sm font-medium text-foreground">Description</label>
                        <textarea id="prog-desc" name="description" rows={3} className="w-full rounded-xl border border-input bg-background text-foreground px-4 py-3 outline-none focus:border-blue-500" placeholder="Program description..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="prog-icon" className="text-sm font-medium text-foreground">Icon</label>
                          <Select defaultValue="book-open" name="icon_key">
                            <SelectTrigger id="prog-icon" className="!h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {iconOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="prog-order" className="text-sm font-medium text-foreground">Display Order</label>
                          <input id="prog-order" type="number" name="display_order" defaultValue={academicPrograms.length + 1} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="prog-url" className="text-sm font-medium text-foreground">Link URL</label>
                        <input id="prog-url" name="link_url" type="url" className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="#" />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit">Save Program</Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="bg-muted/40 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Slug</th>
                      <th className="px-3 py-2 font-medium">Description</th>
                      <th className="px-3 py-2 font-medium">Icon</th>
                      <th className="px-3 py-2 font-medium">Order</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {academicPrograms.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-3 py-2 font-medium">{item.program_name}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{item.program_slug}</td>
                        <td className="px-3 py-2 max-w-[200px] truncate text-sm">{item.description}</td>
                        <td className="px-3 py-2 text-sm">{item.icon_key}</td>
                        <td className="px-3 py-2">{item.display_order}</td>
                        <td className="px-3 py-2">
                          <Badge variant={item.is_active ? "success" : "secondary"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`prog-edit-${item.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-2xl">
                              <AlertDialogHeader>
                                <AlertDialogMedia><Pencil className="size-5" /></AlertDialogMedia>
                                <AlertDialogTitle>Edit Program</AlertDialogTitle>
                                <AlertDialogDescription>Update program details.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <form action={updateAcademicProgramAction} className="space-y-4">
                                <input type="hidden" name="id" value={item.id} />
                                <div className="space-y-2">
                                  <label htmlFor={`edit-prog-name-${item.id}`} className="text-sm font-medium text-foreground">Program Name</label>
                                  <input id={`edit-prog-name-${item.id}`} name="program_name" defaultValue={item.program_name} required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor={`edit-prog-desc-${item.id}`} className="text-sm font-medium text-foreground">Description</label>
                                  <textarea id={`edit-prog-desc-${item.id}`} name="description" defaultValue={item.description || ""} rows={3} className="w-full rounded-xl border border-input bg-background text-foreground px-4 py-3 outline-none focus:border-blue-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label htmlFor={`edit-prog-icon-${item.id}`} className="text-sm font-medium text-foreground">Icon</label>
                                    <Select defaultValue={item.icon_key} name="icon_key">
                                      <SelectTrigger id={`edit-prog-icon-${item.id}`} className="!h-11">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {iconOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <label htmlFor={`edit-prog-order-${item.id}`} className="text-sm font-medium text-foreground">Display Order</label>
                                    <input id={`edit-prog-order-${item.id}`} type="number" name="display_order" defaultValue={item.display_order} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor={`edit-prog-url-${item.id}`} className="text-sm font-medium text-foreground">Link URL</label>
                                  <input id={`edit-prog-url-${item.id}`} name="link_url" type="url" defaultValue={item.link_url || ""} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <Button type="submit">Save Changes</Button>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>
                          <form id={`prog-archive-${item.id}`} action={setAcademicProgramStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="archived" />
                          </form>
                          <form id={`prog-publish-${item.id}`} action={setAcademicProgramStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="published" />
                          </form>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`prog-delete-${item.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                              <AlertDialogHeader>
                                <AlertDialogMedia className="bg-destructive/10 text-destructive"><Trash2Icon /></AlertDialogMedia>
                                <AlertDialogTitle>Delete Program?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently delete this program.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <form action={deleteAcademicProgramAction}>
                                <input type="hidden" name="id" value={item.id} />
                                <AlertDialogFooter>
                                  <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                                  <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => document.getElementById(`prog-edit-${item.id}`)?.click()}>
                                <Pencil className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                              {item.is_active ? (
                                <DropdownMenuItem onClick={() => (document.getElementById(`prog-archive-${item.id}`) as HTMLFormElement)?.requestSubmit()}>
                                  <Archive className="mr-2 size-4" />
                                  Archive
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => (document.getElementById(`prog-publish-${item.id}`) as HTMLFormElement)?.requestSubmit()}>
                                  <Send className="mr-2 size-4" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600" onClick={() => document.getElementById(`prog-delete-${item.id}`)?.click()}>
                                <Trash2Icon className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {academicPrograms.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-6 text-center text-sm text-muted-foreground">
                          No academic programs found. Add your first program.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeTab === "stats" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Homepage Statistics</h2>
                  <p className="text-sm text-muted-foreground">Manage stat counters, values and styling.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Plus className="size-4" />
                      Add Statistic
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-2xl sm:max-w-2xl">
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <BarChart3 className="size-5" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Add Statistic</AlertDialogTitle>
                      <AlertDialogDescription>Create a new homepage statistic.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <form action={createStatAction} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="stat-label" className="text-sm font-medium text-foreground">Stat Label</label>
                        <input id="stat-label" name="stat_label" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Students Enrolled" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="stat-slug" className="text-sm font-medium text-foreground">Slug</label>
                        <input id="stat-slug" name="stat_slug" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="students-enrolled" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="stat-value" className="text-sm font-medium text-foreground">Value</label>
                          <input id="stat-value" type="number" name="stat_value" required defaultValue={0} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="stat-suffix" className="text-sm font-medium text-foreground">Suffix</label>
                          <input id="stat-suffix" name="stat_suffix" defaultValue="+" className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="+" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="stat-desc" className="text-sm font-medium text-foreground">Description</label>
                        <textarea id="stat-desc" name="description" rows={2} className="w-full rounded-xl border border-input bg-background text-foreground px-4 py-3 outline-none focus:border-blue-500" placeholder="Description..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="stat-icon" className="text-sm font-medium text-foreground">Icon</label>
                          <Select defaultValue="users" name="icon_key">
                            <SelectTrigger id="stat-icon" className="!h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {iconOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="stat-color" className="text-sm font-medium text-foreground">Color</label>
                          <Select defaultValue="emerald" name="color_scheme">
                            <SelectTrigger id="stat-color" className="!h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {colorSchemeOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="stat-order" className="text-sm font-medium text-foreground">Display Order</label>
                        <input id="stat-order" type="number" name="display_order" defaultValue={homeStats.length + 1} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit">Save Stat</Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full min-w-[1000px] text-sm">
                  <thead className="bg-muted/40 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">Label</th>
                      <th className="px-3 py-2 font-medium">Value</th>
                      <th className="px-3 py-2 font-medium">Suffix</th>
                      <th className="px-3 py-2 font-medium">Icon</th>
                      <th className="px-3 py-2 font-medium">Color</th>
                      <th className="px-3 py-2 font-medium">Order</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeStats.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-3 py-2 font-medium">{item.stat_label}</td>
                        <td className="px-3 py-2">{item.stat_value}</td>
                        <td className="px-3 py-2 text-xs">{item.stat_suffix}</td>
                        <td className="px-3 py-2 text-sm">{item.icon_key}</td>
                        <td className="px-3 py-2"><span className={`inline-block px-2 py-1 rounded text-xs font-medium bg-${item.color_scheme}-50 text-${item.color_scheme}-700`}>{item.color_scheme}</span></td>
                        <td className="px-3 py-2">{item.display_order}</td>
                        <td className="px-3 py-2">
                          <Badge variant={item.is_active ? "success" : "secondary"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`stat-edit-${item.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-2xl">
                              <AlertDialogHeader>
                                <AlertDialogMedia><Pencil className="size-5" /></AlertDialogMedia>
                                <AlertDialogTitle>Edit Statistic</AlertDialogTitle>
                                <AlertDialogDescription>Update stat details and styling.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <form action={updateStatAction} className="space-y-4">
                                <input type="hidden" name="id" value={item.id} />
                                <div className="space-y-2">
                                  <label htmlFor={`edit-stat-label-${item.id}`} className="text-sm font-medium text-foreground">Stat Label</label>
                                  <input id={`edit-stat-label-${item.id}`} name="stat_label" defaultValue={item.stat_label} required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label htmlFor={`edit-stat-value-${item.id}`} className="text-sm font-medium text-foreground">Value</label>
                                    <input id={`edit-stat-value-${item.id}`} type="number" name="stat_value" defaultValue={item.stat_value} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                  </div>
                                  <div className="space-y-2">
                                    <label htmlFor={`edit-stat-suffix-${item.id}`} className="text-sm font-medium text-foreground">Suffix</label>
                                    <input id={`edit-stat-suffix-${item.id}`} name="stat_suffix" defaultValue={item.stat_suffix} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor={`edit-stat-desc-${item.id}`} className="text-sm font-medium text-foreground">Description</label>
                                  <textarea id={`edit-stat-desc-${item.id}`} name="description" defaultValue={item.description || ""} rows={2} className="w-full rounded-xl border border-input bg-background text-foreground px-4 py-3 outline-none focus:border-blue-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label htmlFor={`edit-stat-icon-${item.id}`} className="text-sm font-medium text-foreground">Icon</label>
                                    <Select defaultValue={item.icon_key} name="icon_key">
                                      <SelectTrigger id={`edit-stat-icon-${item.id}`} className="!h-11">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {iconOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <label htmlFor={`edit-stat-color-${item.id}`} className="text-sm font-medium text-foreground">Color</label>
                                    <Select defaultValue={item.color_scheme} name="color_scheme">
                                      <SelectTrigger id={`edit-stat-color-${item.id}`} className="!h-11">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {colorSchemeOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor={`edit-stat-order-${item.id}`} className="text-sm font-medium text-foreground">Display Order</label>
                                  <input id={`edit-stat-order-${item.id}`} type="number" name="display_order" defaultValue={item.display_order} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <Button type="submit">Save Changes</Button>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>
                          <form id={`stat-archive-${item.id}`} action={setStatStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="archived" />
                          </form>
                          <form id={`stat-publish-${item.id}`} action={setStatStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="published" />
                          </form>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`stat-delete-${item.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                              <AlertDialogHeader>
                                <AlertDialogMedia className="bg-destructive/10 text-destructive"><Trash2Icon /></AlertDialogMedia>
                                <AlertDialogTitle>Delete Stat?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently delete this statistic.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <form action={deleteStatAction}>
                                <input type="hidden" name="id" value={item.id} />
                                <AlertDialogFooter>
                                  <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                                  <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => document.getElementById(`stat-edit-${item.id}`)?.click()}>
                                <Pencil className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                              {item.is_active ? (
                                <DropdownMenuItem onClick={() => (document.getElementById(`stat-archive-${item.id}`) as HTMLFormElement)?.requestSubmit()}>
                                  <Archive className="mr-2 size-4" />
                                  Archive
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => (document.getElementById(`stat-publish-${item.id}`) as HTMLFormElement)?.requestSubmit()}>
                                  <Send className="mr-2 size-4" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600" onClick={() => document.getElementById(`stat-delete-${item.id}`)?.click()}>
                                <Trash2Icon className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {homeStats.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center text-sm text-muted-foreground">
                          No statistics found. Add your first stat.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeTab === "footer" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Footer Links</h2>
                  <p className="text-sm text-muted-foreground">Manage footer sections and quick links.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Plus className="size-4" />
                      Add Section
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-2xl sm:max-w-2xl">
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <LinkIcon className="size-5" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Add Footer Section</AlertDialogTitle>
                      <AlertDialogDescription>Create a new footer link section.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <form action={createFooterLinkSectionAction} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="footer-section-name" className="text-sm font-medium text-foreground">Section Name</label>
                        <input id="footer-section-name" name="section_name" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Quick Links" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="footer-section-slug" className="text-sm font-medium text-foreground">Section Slug</label>
                        <input id="footer-section-slug" name="section_slug" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="quick-links" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="footer-section-order" className="text-sm font-medium text-foreground">Display Order</label>
                        <input id="footer-section-order" type="number" name="display_order" defaultValue={footerSections.length + 1} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit">Save Section</Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="space-y-6">
                {footerSections.map((section) => (
                  <div key={section.id} className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{section.section_name}</h3>
                          <Badge variant={section.is_active ? "success" : "secondary"}>
                            {section.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{section.links.length} links</p>
                      </div>
                      <div className="flex gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-xs">
                              <Plus className="mr-1 size-3" />
                              Add Link
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-2xl">
                            <AlertDialogHeader>
                              <AlertDialogMedia><Plus className="size-5" /></AlertDialogMedia>
                              <AlertDialogTitle>Add Footer Link</AlertDialogTitle>
                              <AlertDialogDescription>Add a new link to {section.section_name}.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <form action={createFooterLinkAction} className="space-y-4">
                              <input type="hidden" name="section_id" value={section.id} />
                              <div className="space-y-2">
                                <label htmlFor={`link-label-${section.id}`} className="text-sm font-medium text-foreground">Link Label</label>
                                <input id={`link-label-${section.id}`} name="link_label" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="About Us" />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor={`link-url-${section.id}`} className="text-sm font-medium text-foreground">Link URL</label>
                                <input id={`link-url-${section.id}`} name="link_url" type="url" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="/about" />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor={`link-order-${section.id}`} className="text-sm font-medium text-foreground">Display Order</label>
                                <input id={`link-order-${section.id}`} type="number" name="display_order" defaultValue={section.links.length + 1} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button type="submit">Save Link</Button>
                              </AlertDialogFooter>
                            </form>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button id={`footer-section-edit-${section.id}`} type="button" className="hidden" />
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-2xl">
                            <AlertDialogHeader>
                              <AlertDialogMedia><Pencil className="size-5" /></AlertDialogMedia>
                              <AlertDialogTitle>Edit Section</AlertDialogTitle>
                              <AlertDialogDescription>Update section details.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <form action={updateFooterLinkSectionAction} className="space-y-4">
                              <input type="hidden" name="id" value={section.id} />
                              <div className="space-y-2">
                                <label htmlFor={`edit-footer-name-${section.id}`} className="text-sm font-medium text-foreground">Section Name</label>
                                <input id={`edit-footer-name-${section.id}`} name="section_name" defaultValue={section.section_name} required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor={`edit-footer-order-${section.id}`} className="text-sm font-medium text-foreground">Display Order</label>
                                <input id={`edit-footer-order-${section.id}`} type="number" name="display_order" defaultValue={section.display_order} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button type="submit">Save Changes</Button>
                              </AlertDialogFooter>
                            </form>
                          </AlertDialogContent>
                        </AlertDialog>
                        <form id={`footer-section-archive-${section.id}`} action={setFooterLinkSectionStatusAction} className="hidden">
                          <input type="hidden" name="id" value={section.id} />
                          <input type="hidden" name="status" value="archived" />
                        </form>
                        <form id={`footer-section-publish-${section.id}`} action={setFooterLinkSectionStatusAction} className="hidden">
                          <input type="hidden" name="id" value={section.id} />
                          <input type="hidden" name="status" value="published" />
                        </form>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button id={`footer-section-delete-${section.id}`} type="button" className="hidden" />
                          </AlertDialogTrigger>
                          <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                              <AlertDialogMedia className="bg-destructive/10 text-destructive"><Trash2Icon /></AlertDialogMedia>
                              <AlertDialogTitle>Delete Section?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently delete this footer section and all its links.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <form action={deleteFooterLinkSectionAction}>
                              <input type="hidden" name="id" value={section.id} />
                              <AlertDialogFooter>
                                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                                <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </form>
                          </AlertDialogContent>
                        </AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => document.getElementById(`footer-section-edit-${section.id}`)?.click()}>
                              <Pencil className="mr-2 size-4" />
                              Edit
                            </DropdownMenuItem>
                            {section.is_active ? (
                              <DropdownMenuItem onClick={() => (document.getElementById(`footer-section-archive-${section.id}`) as HTMLFormElement)?.requestSubmit()}>
                                <Archive className="mr-2 size-4" />
                                Archive
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => (document.getElementById(`footer-section-publish-${section.id}`) as HTMLFormElement)?.requestSubmit()}>
                                <Send className="mr-2 size-4" />
                                Publish
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => document.getElementById(`footer-section-delete-${section.id}`)?.click()}>
                              <Trash2Icon className="mr-2 size-4" />
                              Delete Section
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {section.links.map((link) => (
                        <div key={link.id} className="flex items-center justify-between rounded-md border border-border bg-muted/30 p-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{link.link_label}</p>
                            <p className="text-xs text-muted-foreground">{link.link_url}</p>
                          </div>
                          <Badge variant={link.is_active ? "success" : "secondary"}>{link.is_active ? "Active" : "Inactive"}</Badge>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`footer-link-edit-${link.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-2xl">
                              <AlertDialogHeader>
                                <AlertDialogMedia><Pencil className="size-5" /></AlertDialogMedia>
                                <AlertDialogTitle>Edit Link</AlertDialogTitle>
                                <AlertDialogDescription>Update link details.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <form action={updateFooterLinkAction} className="space-y-4">
                                <input type="hidden" name="id" value={link.id} />
                                <div className="space-y-2">
                                  <label htmlFor={`edit-link-label-${link.id}`} className="text-sm font-medium text-foreground">Link Label</label>
                                  <input id={`edit-link-label-${link.id}`} name="link_label" defaultValue={link.link_label} required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor={`edit-link-url-${link.id}`} className="text-sm font-medium text-foreground">Link URL</label>
                                  <input id={`edit-link-url-${link.id}`} name="link_url" type="url" defaultValue={link.link_url} required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor={`edit-link-order-${link.id}`} className="text-sm font-medium text-foreground">Display Order</label>
                                  <input id={`edit-link-order-${link.id}`} type="number" name="display_order" defaultValue={link.display_order} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <Button type="submit">Save Changes</Button>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>
                          <form id={`footer-link-archive-${link.id}`} action={setFooterLinkStatusAction} className="hidden">
                            <input type="hidden" name="id" value={link.id} />
                            <input type="hidden" name="status" value="archived" />
                          </form>
                          <form id={`footer-link-publish-${link.id}`} action={setFooterLinkStatusAction} className="hidden">
                            <input type="hidden" name="id" value={link.id} />
                            <input type="hidden" name="status" value="published" />
                          </form>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`footer-link-delete-${link.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                              <AlertDialogHeader>
                                <AlertDialogMedia className="bg-destructive/10 text-destructive"><Trash2Icon /></AlertDialogMedia>
                                <AlertDialogTitle>Delete Link?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently delete this footer link.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <form action={deleteFooterLinkAction}>
                                <input type="hidden" name="id" value={link.id} />
                                <AlertDialogFooter>
                                  <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                                  <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => document.getElementById(`footer-link-edit-${link.id}`)?.click()}>
                                <Pencil className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                              {link.is_active ? (
                                <DropdownMenuItem onClick={() => (document.getElementById(`footer-link-archive-${link.id}`) as HTMLFormElement)?.requestSubmit()}>
                                  <Archive className="mr-2 size-4" />
                                  Archive
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => (document.getElementById(`footer-link-publish-${link.id}`) as HTMLFormElement)?.requestSubmit()}>
                                  <Send className="mr-2 size-4" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600" onClick={() => document.getElementById(`footer-link-delete-${link.id}`)?.click()}>
                                <Trash2Icon className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                      {section.links.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground">No links in this section. Add one to get started.</p>
                      ) : null}
                    </div>
                  </div>
                ))}
                {footerSections.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground">No footer sections found. Create your first section above.</p>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {activeTab === "extracurriculars" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Extracurricular Clubs</h2>
                  <p className="text-sm text-muted-foreground">Manage co-curricular activities, display order, and upload logos.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Plus className="size-4" />
                      Add Club
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-2xl sm:max-w-2xl">
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <Sparkles className="size-5" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Add Extracurricular Club</AlertDialogTitle>
                      <AlertDialogDescription>Create a new extracurricular club card.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <form action={createHomepageExtracurricularAction} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="club-name" className="text-sm font-medium text-foreground">Club Name</label>
                        <input id="club-name" name="name" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="Scouts" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="club-slug" className="text-sm font-medium text-foreground">Club Slug</label>
                        <input id="club-slug" name="slug" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="scouts" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="club-desc" className="text-sm font-medium text-foreground">Description</label>
                        <textarea id="club-desc" name="description" rows={3} className="w-full rounded-xl border border-input bg-background text-foreground px-4 py-3 outline-none focus:border-blue-500" placeholder="Club description..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="club-icon" className="text-sm font-medium text-foreground">Lucide Icon</label>
                          <Select defaultValue="sparkles" name="icon_key">
                            <SelectTrigger id="club-icon" className="!h-11">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {extracurricularIconOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="club-order" className="text-sm font-medium text-foreground">Display Order</label>
                          <input id="club-order" type="number" name="display_order" defaultValue={extracurriculars.length + 1} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="club-logo-file" className="text-sm font-medium text-foreground">Club Logo File</label>
                        <input id="club-logo-file" name="logo_file" type="file" accept="image/jpeg,image/png,image/webp" className="block h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 py-2 outline-none focus:border-primary" />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit">Save Club</Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="bg-muted/40 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Slug</th>
                      <th className="px-3 py-2 font-medium">Description</th>
                      <th className="px-3 py-2 font-medium">Icon</th>
                      <th className="px-3 py-2 font-medium">Logo</th>
                      <th className="px-3 py-2 font-medium">Order</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extracurriculars.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-3 py-2 font-medium">{item.name}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{item.slug}</td>
                        <td className="px-3 py-2 max-w-[200px] truncate text-sm">{item.description || "-"}</td>
                        <td className="px-3 py-2 text-sm">{item.icon_key}</td>
                        <td className="px-3 py-2 text-sm">
                          {item.logo_url ? (
                            <a href={item.logo_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-300">
                              View Logo
                            </a>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </td>
                        <td className="px-3 py-2">{item.display_order}</td>
                        <td className="px-3 py-2">
                          <Badge variant={item.is_active ? "success" : "secondary"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`club-edit-${item.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-2xl">
                              <AlertDialogHeader>
                                <AlertDialogMedia><Pencil className="size-5" /></AlertDialogMedia>
                                <AlertDialogTitle>Edit Extracurricular Club</AlertDialogTitle>
                                <AlertDialogDescription>Update club details and upload a new logo if needed.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <form action={updateHomepageExtracurricularAction} className="space-y-4">
                                <input type="hidden" name="id" value={item.id} />
                                <input type="hidden" name="existing_logo_url" value={item.logo_url || ""} />
                                <div className="space-y-2">
                                  <label htmlFor={`edit-club-name-${item.id}`} className="text-sm font-medium text-foreground">Club Name</label>
                                  <input id={`edit-club-name-${item.id}`} name="name" defaultValue={item.name} required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor={`edit-club-desc-${item.id}`} className="text-sm font-medium text-foreground">Description</label>
                                  <textarea id={`edit-club-desc-${item.id}`} name="description" defaultValue={item.description || ""} rows={3} className="w-full rounded-xl border border-input bg-background text-foreground px-4 py-3 outline-none focus:border-blue-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label htmlFor={`edit-club-icon-${item.id}`} className="text-sm font-medium text-foreground">Lucide Icon</label>
                                    <Select defaultValue={item.icon_key} name="icon_key">
                                      <SelectTrigger id={`edit-club-icon-${item.id}`} className="!h-11">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {extracurricularIconOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <label htmlFor={`edit-club-order-${item.id}`} className="text-sm font-medium text-foreground">Display Order</label>
                                    <input id={`edit-club-order-${item.id}`} type="number" name="display_order" defaultValue={item.display_order} className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label htmlFor={`edit-club-logo-${item.id}`} className="text-sm font-medium text-foreground">Replace Logo File</label>
                                  <input id={`edit-club-logo-${item.id}`} name="logo_file" type="file" accept="image/jpeg,image/png,image/webp" className="block h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 py-2 outline-none focus:border-primary" />
                                  {item.logo_url && (
                                    <p className="text-xs text-muted-foreground mt-1">Current logo: <a href={item.logo_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">View</a></p>
                                  )}
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <Button type="submit">Save Changes</Button>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>

                          <form id={`club-archive-${item.id}`} action={setHomepageExtracurricularStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="archived" />
                          </form>
                          <form id={`club-publish-${item.id}`} action={setHomepageExtracurricularStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="published" />
                          </form>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button id={`club-delete-${item.id}`} type="button" className="hidden" />
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                              <AlertDialogHeader>
                                <AlertDialogMedia className="bg-destructive/10 text-destructive"><Trash2Icon /></AlertDialogMedia>
                                <AlertDialogTitle>Delete Club?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently delete the club "{item.name}".</AlertDialogDescription>
                              </AlertDialogHeader>
                              <form action={deleteHomepageExtracurricularAction}>
                                <input type="hidden" name="id" value={item.id} />
                                <AlertDialogFooter>
                                  <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                                  <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => document.getElementById(`club-edit-${item.id}`)?.click()}>
                                <Pencil className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                              {item.is_active ? (
                                <DropdownMenuItem onClick={() => (document.getElementById(`club-archive-${item.id}`) as HTMLFormElement)?.requestSubmit()}>
                                  <Archive className="mr-2 size-4" />
                                  Archive
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => (document.getElementById(`club-publish-${item.id}`) as HTMLFormElement)?.requestSubmit()}>
                                  <Send className="mr-2 size-4" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600" onClick={() => document.getElementById(`club-delete-${item.id}`)?.click()}>
                                <Trash2Icon className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {extracurriculars.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center text-sm text-muted-foreground">
                          No extracurricular clubs found. Add your first club.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
