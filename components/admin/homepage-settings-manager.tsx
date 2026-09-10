"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Archive, BookOpen, Eye, GalleryHorizontal, Image as ImageIcon, LayoutDashboard, MoreHorizontal, Pencil, Plus, Send, Sparkles, Trash2Icon, Users, BarChart3, Link as LinkIcon, ExternalLink, SquarePen } from "lucide-react"

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

function StatIconField({
  id,
  defaultValue = "users",
  name = "icon_key",
}: {
  id: string
  defaultValue?: string
  name?: string
}) {
  const [value, setValue] = useState(defaultValue || "users")

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">Icon</Label>
      <input type="hidden" name={name} value={value} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id={id} className="!h-11 !w-full rounded-xl border border-input bg-background text-foreground px-4">
          <SelectValue placeholder="Select icon" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {iconOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

function StatColorField({
  id,
  defaultValue = "emerald",
  name = "color_scheme",
}: {
  id: string
  defaultValue?: string
  name?: string
}) {
  const [value, setValue] = useState(defaultValue || "emerald")

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">Color</Label>
      <input type="hidden" name={name} value={value} />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id={id} className="!h-11 !w-full rounded-xl border border-input bg-background text-foreground px-4">
          <SelectValue placeholder="Select color" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {colorSchemeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
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
  const [isAddHeroOpen, setIsAddHeroOpen] = useState(false)
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlideRecord | null>(null)
  const [deletingHeroSlide, setDeletingHeroSlide] = useState<HeroSlideRecord | null>(null)
  const [isAddQuickInfoOpen, setIsAddQuickInfoOpen] = useState(false)
  const [editingQuickInfo, setEditingQuickInfo] = useState<QuickInfoRecord | null>(null)
  const [deletingQuickInfo, setDeletingQuickInfo] = useState<QuickInfoRecord | null>(null)
  const [isAddLeadershipOpen, setIsAddLeadershipOpen] = useState(false)
  const [editingLeadership, setEditingLeadership] = useState<LeadershipCardRecord | null>(null)
  const [viewingLeadershipMessage, setViewingLeadershipMessage] = useState<LeadershipCardRecord | null>(null)
  const [deletingLeadership, setDeletingLeadership] = useState<LeadershipCardRecord | null>(null)
  const [isAddStatOpen, setIsAddStatOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<HomepageStatRecord | null>(null)
  const [deletingStat, setDeletingStat] = useState<HomepageStatRecord | null>(null)
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<FooterLinkSectionRecord | null>(null)
  const [deletingSection, setDeletingSection] = useState<FooterLinkSectionRecord | null>(null)
  const [addingLinkToSection, setAddingLinkToSection] = useState<FooterLinkSectionRecord | null>(null)
  const [editingLink, setEditingLink] = useState<{ sectionId: string; link: FooterLinkRecord } | null>(null)
  const [deletingLink, setDeletingLink] = useState<FooterLinkRecord | null>(null)

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

                <Button
                  onClick={() => setIsAddHeroOpen(true)}
                  className="h-10 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] gap-1.5 font-semibold text-sm px-4"
                >
                  <Plus className="size-4" />
                  <span>Add New Hero Photo</span>
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full min-w-[650px] text-sm">
                  <thead className="bg-muted/40 text-left border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-foreground">Title</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Image</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Order</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Status</th>
                      <th className="px-4 py-3 font-semibold text-foreground text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroSlides.map((item) => (
                      <tr key={item.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{item.title}</td>
                        <td className="px-4 py-3">
                          {item.image_url ? (
                            <a
                              href={item.image_url}
                              target="_blank"
                              rel="noreferrer"
                              title="Open image in new tab"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] bg-[#EEF2FF] hover:bg-[#E0E7FF] dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 border border-[#C7D2FE] dark:border-indigo-800/60 rounded-md px-2.5 py-1 transition-colors"
                            >
                              <ExternalLink className="size-3.5" />
                              <span>View</span>
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{item.display_order}</td>
                        <td className="px-4 py-3">
                          <Badge variant={item.is_active ? "success" : "secondary"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <form id={`hero-archive-form-${item.id}`} action={setHomepageHeroSlideStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="archived" />
                          </form>

                          <form id={`hero-publish-form-${item.id}`} action={setHomepageHeroSlideStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="published" />
                          </form>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => setEditingHeroSlide(item)}
                                className="cursor-pointer gap-2 text-sm"
                              >
                                <SquarePen className="h-4 w-4 text-[#4F46E5]" />
                                <span>Edit Slide</span>
                              </DropdownMenuItem>
                              {item.is_active ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    const form = document.getElementById(`hero-archive-form-${item.id}`) as HTMLFormElement | null
                                    form?.requestSubmit()
                                  }}
                                  className="cursor-pointer gap-2 text-sm"
                                >
                                  <Archive className="h-4 w-4 text-amber-600" />
                                  <span>Archive</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    const form = document.getElementById(`hero-publish-form-${item.id}`) as HTMLFormElement | null
                                    form?.requestSubmit()
                                  }}
                                  className="cursor-pointer gap-2 text-sm"
                                >
                                  <Send className="h-4 w-4 text-emerald-600" />
                                  <span>Publish</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeletingHeroSlide(item)}
                                className="cursor-pointer gap-2 text-sm text-rose-600 focus:text-rose-600"
                              >
                                <Trash2Icon className="h-4 w-4 text-rose-600" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {heroSlides.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No hero slides found. Add your first hero photo.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* Global Add Hero Slide Dialog */}
              <Dialog open={isAddHeroOpen} onOpenChange={setIsAddHeroOpen}>
                <DialogContent size="xl" className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Add Hero Slide</DialogTitle>
                    <DialogDescription>
                      Add a new hero slide image and title. Use a wide banner image for the best fit on the homepage.
                    </DialogDescription>
                  </DialogHeader>

                  <form action={createHomepageHeroSlideAction} onSubmit={() => setIsAddHeroOpen(false)}>
                    <div className="space-y-4 p-6">
                      <div className="space-y-1.5">
                        <Label htmlFor="hero-title" className="text-sm font-semibold text-foreground">Slide Title</Label>
                        <Input id="hero-title" name="title" required placeholder="e.g. Main Campus & Administrative Building" />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="hero-image-file" className="text-sm font-semibold text-foreground">Hero Image File</Label>
                        <Input id="hero-image-file" name="image_file" type="file" accept="image/jpeg,image/png,image/webp" required className="cursor-pointer file:cursor-pointer" />
                        <p className="text-xs text-muted-foreground">Recommended size: 1920 x 1080 px or wider, for a clean full-width hero on desktop and mobile.</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="hero-display-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                        <Input id="hero-display-order" type="number" name="display_order" defaultValue={heroSlides.length} min={0} />
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button" className="h-10 rounded-lg px-4 text-sm font-medium border-border">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                        Save Hero Slide
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Global Edit Hero Slide Dialog */}
              <Dialog open={Boolean(editingHeroSlide)} onOpenChange={(open) => { if (!open) setEditingHeroSlide(null) }}>
                <DialogContent size="xl" className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Edit Hero Slide</DialogTitle>
                    <DialogDescription>Update title, display order, or replace the banner image.</DialogDescription>
                  </DialogHeader>

                  {editingHeroSlide ? (
                    <form
                      key={editingHeroSlide.id}
                      action={updateHomepageHeroSlideAction}
                      onSubmit={() => setEditingHeroSlide(null)}
                    >
                      <div className="space-y-4 p-6">
                        <input type="hidden" name="id" value={editingHeroSlide.id} />
                        <input type="hidden" name="image_url" value={editingHeroSlide.image_url} />

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-hero-title" className="text-sm font-semibold text-foreground">Slide Title</Label>
                          <Input id="edit-hero-title" name="title" defaultValue={editingHeroSlide.title} required placeholder="e.g. Main Campus" />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-foreground">Current Image</Label>
                          {editingHeroSlide.image_url ? (
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                              <div className="relative h-20 w-36 shrink-0 rounded-md overflow-hidden border border-border bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={editingHeroSlide.image_url}
                                  alt={editingHeroSlide.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-foreground">Banner Preview</span>
                                <a
                                  href={editingHeroSlide.image_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-[#4F46E5] hover:underline"
                                >
                                  <ExternalLink className="size-3" />
                                  <span>View full image</span>
                                </a>
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-hero-image" className="text-sm font-semibold text-foreground">
                            Replace Hero Image <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                          </Label>
                          <Input id="edit-hero-image" name="image_file" type="file" accept="image/jpeg,image/png,image/webp" className="cursor-pointer file:cursor-pointer" />
                          <p className="text-xs text-muted-foreground">Leave empty to keep the existing image. Recommended size: 1920 x 1080 px or wider.</p>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-hero-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                          <Input id="edit-hero-order" type="number" name="display_order" defaultValue={editingHeroSlide.display_order} min={0} />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setEditingHeroSlide(null)}
                          className="h-10 rounded-lg px-4 text-sm font-medium border-border"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  ) : null}
                </DialogContent>
              </Dialog>

              {/* Global Delete Hero Slide AlertDialog */}
              <AlertDialog open={Boolean(deletingHeroSlide)} onOpenChange={(open) => { if (!open) setDeletingHeroSlide(null) }}>
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

                  <form action={deleteHomepageHeroSlideAction} onSubmit={() => setDeletingHeroSlide(null)}>
                    <input type="hidden" name="id" value={deletingHeroSlide?.id || ""} />
                    <AlertDialogFooter>
                      <AlertDialogCancel variant="outline" onClick={() => setDeletingHeroSlide(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          ) : null}

          {activeTab === "quick-info" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Quick Info Bar</h2>
                  <p className="text-sm text-muted-foreground">Manage the cards shown right after the hero section.</p>
                </div>

                <Button
                  onClick={() => setIsAddQuickInfoOpen(true)}
                  className="h-10 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] gap-1.5 font-semibold text-sm px-4"
                >
                  <Plus className="size-4" />
                  <span>Add Quick Info</span>
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="bg-muted/40 text-left border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-foreground">Title</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Link</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Order</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Status</th>
                      <th className="px-4 py-3 font-semibold text-foreground text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickInfoItems.map((item) => (
                      <tr key={item.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{item.title}</td>
                        <td className="px-4 py-3">
                          {item.link_url ? (
                            <a
                              href={item.link_url}
                              target="_blank"
                              rel="noreferrer"
                              title="Open link in new tab"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] bg-[#EEF2FF] hover:bg-[#E0E7FF] dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 border border-[#C7D2FE] dark:border-indigo-800/60 rounded-md px-2.5 py-1 transition-colors"
                            >
                              <ExternalLink className="size-3.5" />
                              <span>{item.link_url}</span>
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{item.display_order}</td>
                        <td className="px-4 py-3">
                          <Badge variant={item.is_active ? "success" : "secondary"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <form id={`quick-info-archive-form-${item.id}`} action={setHomepageQuickInfoItemStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="archived" />
                          </form>

                          <form id={`quick-info-publish-form-${item.id}`} action={setHomepageQuickInfoItemStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="published" />
                          </form>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => setEditingQuickInfo(item)}
                                className="cursor-pointer gap-2 text-sm"
                              >
                                <SquarePen className="h-4 w-4 text-[#4F46E5]" />
                                <span>Edit Item</span>
                              </DropdownMenuItem>
                              {item.is_active ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    const form = document.getElementById(`quick-info-archive-form-${item.id}`) as HTMLFormElement | null
                                    form?.requestSubmit()
                                  }}
                                  className="cursor-pointer gap-2 text-sm"
                                >
                                  <Archive className="h-4 w-4 text-amber-600" />
                                  <span>Archive</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    const form = document.getElementById(`quick-info-publish-form-${item.id}`) as HTMLFormElement | null
                                    form?.requestSubmit()
                                  }}
                                  className="cursor-pointer gap-2 text-sm"
                                >
                                  <Send className="h-4 w-4 text-emerald-600" />
                                  <span>Publish</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeletingQuickInfo(item)}
                                className="cursor-pointer gap-2 text-sm text-rose-600 focus:text-rose-600"
                              >
                                <Trash2Icon className="h-4 w-4 text-rose-600" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {quickInfoItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No quick info items found. Add the first card for the info bar.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* Global Add Quick Info Dialog */}
              <Dialog open={isAddQuickInfoOpen} onOpenChange={setIsAddQuickInfoOpen}>
                <DialogContent size="xl" className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Add Quick Info Item</DialogTitle>
                    <DialogDescription>
                      Add a card in the colored quick info bar under the hero section.
                    </DialogDescription>
                  </DialogHeader>

                  <form action={createHomepageQuickInfoItemAction} onSubmit={() => setIsAddQuickInfoOpen(false)}>
                    <div className="space-y-4 p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="quick-info-title" className="text-sm font-semibold text-foreground">Title</Label>
                          <Input id="quick-info-title" name="title" required placeholder="Admission Open" />
                        </div>
                        <QuickInfoIconField id="quick-info-icon" defaultValue="sparkles" />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="quick-info-subtitle" className="text-sm font-semibold text-foreground">Subtitle</Label>
                        <Input id="quick-info-subtitle" name="subtitle" required placeholder="Session 2026-2027" />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="quick-info-link" className="text-sm font-semibold text-foreground">Link URL</Label>
                          <Input id="quick-info-link" name="link_url" placeholder="/admission" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="quick-info-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                          <Input id="quick-info-order" type="number" name="display_order" defaultValue={quickInfoItems.length} min={0} />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button" className="h-10 rounded-lg px-4 text-sm font-medium border-border">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                        Save Quick Info
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Global Edit Quick Info Dialog */}
              <Dialog open={Boolean(editingQuickInfo)} onOpenChange={(open) => { if (!open) setEditingQuickInfo(null) }}>
                <DialogContent size="xl" className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Edit Quick Info Item</DialogTitle>
                    <DialogDescription>Update the bar card content and ordering.</DialogDescription>
                  </DialogHeader>

                  {editingQuickInfo ? (
                    <form
                      key={editingQuickInfo.id}
                      action={updateHomepageQuickInfoItemAction}
                      onSubmit={() => setEditingQuickInfo(null)}
                    >
                      <div className="space-y-4 p-6">
                        <input type="hidden" name="id" value={editingQuickInfo.id} />

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-quick-info-title" className="text-sm font-semibold text-foreground">Title</Label>
                            <Input id="edit-quick-info-title" name="title" defaultValue={editingQuickInfo.title} required placeholder="Admission Open" />
                          </div>
                          <QuickInfoIconField id="edit-quick-info-icon" defaultValue={editingQuickInfo.icon_key} />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-quick-info-subtitle" className="text-sm font-semibold text-foreground">Subtitle</Label>
                          <Input id="edit-quick-info-subtitle" name="subtitle" defaultValue={editingQuickInfo.subtitle} required placeholder="Session 2026-2027" />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-quick-info-link" className="text-sm font-semibold text-foreground">Link URL</Label>
                            <Input id="edit-quick-info-link" name="link_url" defaultValue={editingQuickInfo.link_url ?? ""} placeholder="/admission" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-quick-info-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                            <Input id="edit-quick-info-order" type="number" name="display_order" defaultValue={editingQuickInfo.display_order} min={0} />
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setEditingQuickInfo(null)}
                          className="h-10 rounded-lg px-4 text-sm font-medium border-border"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  ) : null}
                </DialogContent>
              </Dialog>

              {/* Global Delete Quick Info AlertDialog */}
              <AlertDialog open={Boolean(deletingQuickInfo)} onOpenChange={(open) => { if (!open) setDeletingQuickInfo(null) }}>
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

                  <form action={deleteHomepageQuickInfoItemAction} onSubmit={() => setDeletingQuickInfo(null)}>
                    <input type="hidden" name="id" value={deletingQuickInfo?.id || ""} />
                    <AlertDialogFooter>
                      <AlertDialogCancel variant="outline" onClick={() => setDeletingQuickInfo(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          ) : null}

          {activeTab === "leadership" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Leadership Cards</h2>
                  <p className="text-sm text-muted-foreground">Manage homepage leaders by name, designation, photo, and message.</p>
                </div>

                <Button
                  onClick={() => setIsAddLeadershipOpen(true)}
                  className="h-10 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] gap-1.5 font-semibold text-sm px-4"
                >
                  <Plus className="size-4" />
                  <span>Add New Leadership Card</span>
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border bg-card">
                <table className="w-full min-w-[600px] text-sm">
                  <thead className="bg-muted/40 text-left border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-foreground">Name</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Designation</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Order</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Status</th>
                      <th className="px-4 py-3 font-semibold text-foreground text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadershipCards.map((item) => {
                      const rawMessage = item.leader_message || item.subtitle || "-"
                      const messageText = rawMessage !== "-" ? stripHtmlTags(rawMessage) : "-"

                      return (
                        <tr key={item.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors align-middle">
                          <td className="px-4 py-3 text-foreground font-medium">{item.leader_name || "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.role_title}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.display_order}</td>
                          <td className="px-4 py-3">
                            <Badge variant={item.is_active ? "success" : "secondary"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <form id={`leadership-archive-form-${item.id}`} action={setHomepageLeadershipCardStatusAction} className="hidden">
                              <input type="hidden" name="role_slug" value={item.role_slug} />
                              <input type="hidden" name="status" value="archived" />
                            </form>

                            <form id={`leadership-publish-form-${item.id}`} action={setHomepageLeadershipCardStatusAction} className="hidden">
                              <input type="hidden" name="role_slug" value={item.role_slug} />
                              <input type="hidden" name="status" value="published" />
                            </form>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                {messageText !== "-" ? (
                                  <DropdownMenuItem
                                    onClick={() => setViewingLeadershipMessage(item)}
                                    className="cursor-pointer gap-2 text-sm"
                                  >
                                    <Eye className="h-4 w-4 text-[#2563EB]" />
                                    <span>View Message</span>
                                  </DropdownMenuItem>
                                ) : null}
                                <DropdownMenuItem
                                  onClick={() => setEditingLeadership(item)}
                                  className="cursor-pointer gap-2 text-sm"
                                >
                                  <SquarePen className="h-4 w-4 text-[#4F46E5]" />
                                  <span>Edit Card</span>
                                </DropdownMenuItem>
                                {item.is_active ? (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      const form = document.getElementById(`leadership-archive-form-${item.id}`) as HTMLFormElement | null
                                      form?.requestSubmit()
                                    }}
                                    className="cursor-pointer gap-2 text-sm"
                                  >
                                    <Archive className="h-4 w-4 text-amber-600" />
                                    <span>Archive</span>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      const form = document.getElementById(`leadership-publish-form-${item.id}`) as HTMLFormElement | null
                                      form?.requestSubmit()
                                    }}
                                    className="cursor-pointer gap-2 text-sm"
                                  >
                                    <Send className="h-4 w-4 text-emerald-600" />
                                    <span>Publish</span>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => setDeletingLeadership(item)}
                                  className="cursor-pointer gap-2 text-sm text-rose-600 focus:text-rose-600"
                                >
                                  <Trash2Icon className="h-4 w-4 text-rose-600" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      )
                    })}
                    {leadershipCards.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No leadership cards found. The default roles will appear after the migration is applied.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* Global Add Leadership Card Dialog */}
              <Dialog open={isAddLeadershipOpen} onOpenChange={setIsAddLeadershipOpen}>
                <DialogContent size="xl" className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add Leadership Card</DialogTitle>
                    <DialogDescription>
                      Create a new homepage leadership card with its own name, designation, photo, and message.
                    </DialogDescription>
                  </DialogHeader>

                  <form action={updateHomepageLeadershipCardAction} onSubmit={() => setIsAddLeadershipOpen(false)}>
                    <div className="space-y-4 p-6 max-h-[65vh] overflow-y-auto">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="leadership-role-slug" className="text-sm font-semibold text-foreground">Role Slug</Label>
                          <Input id="leadership-role-slug" name="role_slug" required placeholder="vice-principal" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="leadership-role-title" className="text-sm font-semibold text-foreground">Designation</Label>
                          <Input id="leadership-role-title" name="role_title" required placeholder="Vice Principal" />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="leadership-name" className="text-sm font-semibold text-foreground">Leader Name</Label>
                          <Input id="leadership-name" name="leader_name" placeholder="Dr. Jane Doe" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="leadership-photo-file" className="text-sm font-semibold text-foreground">Leader Photo File</Label>
                          <Input id="leadership-photo-file" name="leader_photo_file" type="file" accept="image/jpeg,image/png,image/webp" className="cursor-pointer file:cursor-pointer" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="leadership-photo-url" className="text-sm font-semibold text-foreground">
                          Photo URL <span className="text-xs text-muted-foreground font-normal">(Optional fallback)</span>
                        </Label>
                        <Input id="leadership-photo-url" name="leader_photo_url" placeholder="https://..." />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="leadership-subtitle" className="text-sm font-semibold text-foreground">Subtitle</Label>
                        <Input id="leadership-subtitle" name="subtitle" placeholder="Supporting school growth and operations." />
                      </div>

                      <div className="space-y-1.5">
                        <TiptapEditor
                          name="leader_message"
                          label="Leader Message"
                          initialValue=""
                          minHeightClassName="min-h-[180px]"
                          allowImage={false}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="leadership-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                        <Input id="leadership-order" type="number" name="display_order" defaultValue={leadershipCards.length > 0 ? Math.max(...leadershipCards.map((card) => card.display_order)) + 1 : 1} min={0} />
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button" className="h-10 rounded-lg px-4 text-sm font-medium border-border">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                        Save Leadership Card
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Global Edit Leadership Card Dialog */}
              <Dialog open={Boolean(editingLeadership)} onOpenChange={(open) => { if (!open) setEditingLeadership(null) }}>
                <DialogContent size="xl" className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Edit Leadership Card</DialogTitle>
                    <DialogDescription>
                      Update the leader name, designation, photo, and public message.
                    </DialogDescription>
                  </DialogHeader>

                  {editingLeadership ? (
                    <form
                      key={editingLeadership.id}
                      action={updateHomepageLeadershipCardAction}
                      onSubmit={() => setEditingLeadership(null)}
                    >
                      <div className="space-y-4 p-6 max-h-[65vh] overflow-y-auto">
                        <input type="hidden" name="role_slug" value={editingLeadership.role_slug} />
                        <input type="hidden" name="subtitle" value={editingLeadership.subtitle ?? ""} />
                        <input type="hidden" name="staff_id" value="" />

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-leader-name" className="text-sm font-semibold text-foreground">Leader Name</Label>
                            <Input id="edit-leader-name" name="leader_name" defaultValue={editingLeadership.leader_name ?? ""} placeholder="Leader name" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-role-title" className="text-sm font-semibold text-foreground">Designation</Label>
                            <Input id="edit-role-title" name="role_title" defaultValue={editingLeadership.role_title} required placeholder="Designation" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-foreground">Current Photo</Label>
                          {editingLeadership.leader_photo_url ? (
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                              <div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden border border-border bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={editingLeadership.leader_photo_url}
                                  alt={editingLeadership.leader_name || editingLeadership.role_title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-foreground">Photo Preview</span>
                                <a
                                  href={editingLeadership.leader_photo_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-[#4F46E5] hover:underline"
                                >
                                  <ExternalLink className="size-3" />
                                  <span>View full photo</span>
                                </a>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">No photo currently set.</p>
                          )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-leader-photo-file" className="text-sm font-semibold text-foreground">
                              Replace Photo <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                            </Label>
                            <Input id="edit-leader-photo-file" name="leader_photo_file" type="file" accept="image/jpeg,image/png,image/webp" className="cursor-pointer file:cursor-pointer" />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-leader-photo-url" className="text-sm font-semibold text-foreground">
                              Photo URL Fallback <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                            </Label>
                            <Input id="edit-leader-photo-url" name="leader_photo_url" defaultValue={editingLeadership.leader_photo_url ?? ""} placeholder="https://..." />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <TiptapEditor
                            name="leader_message"
                            label="Leader Message"
                            initialValue={editingLeadership.leader_message ?? ""}
                            minHeightClassName="min-h-[200px]"
                            allowImage={false}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-leadership-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                          <Input id="edit-leadership-order" type="number" name="display_order" defaultValue={editingLeadership.display_order} min={0} />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setEditingLeadership(null)}
                          className="h-10 rounded-lg px-4 text-sm font-medium border-border"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  ) : null}
                </DialogContent>
              </Dialog>

              {/* Global View Leader Message Dialog */}
              <Dialog open={Boolean(viewingLeadershipMessage)} onOpenChange={(open) => { if (!open) setViewingLeadershipMessage(null) }}>
                <DialogContent size="lg" className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Leader Message</DialogTitle>
                    <DialogDescription>
                      {viewingLeadershipMessage?.leader_name ? `${viewingLeadershipMessage.leader_name} (${viewingLeadershipMessage.role_title})` : viewingLeadershipMessage?.role_title}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="max-h-[60vh] overflow-y-auto p-6 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {stripHtmlTags(viewingLeadershipMessage?.leader_message || viewingLeadershipMessage?.subtitle || "No message provided.")}
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setViewingLeadershipMessage(null)}
                      className="h-10 rounded-lg px-4 text-sm font-medium border-border"
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Global Delete Leadership Card AlertDialog */}
              <AlertDialog open={Boolean(deletingLeadership)} onOpenChange={(open) => { if (!open) setDeletingLeadership(null) }}>
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

                  <form action={deleteHomepageLeadershipCardAction} onSubmit={() => setDeletingLeadership(null)}>
                    <input type="hidden" name="role_slug" value={deletingLeadership?.role_slug || ""} />
                    <AlertDialogFooter>
                      <AlertDialogCancel variant="outline" onClick={() => setDeletingLeadership(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
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
                  <p className="text-sm text-muted-foreground">Manage stat counters, values and ordering.</p>
                </div>
                <Button
                  onClick={() => setIsAddStatOpen(true)}
                  className="h-10 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] gap-1.5 font-semibold text-sm px-4"
                >
                  <Plus className="size-4" />
                  <span>Add Statistic</span>
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[600px] text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Label</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {homeStats.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{item.stat_label}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{item.stat_value}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.display_order}</td>
                        <td className="px-4 py-3">
                          <Badge variant={item.is_active ? "success" : "secondary"}>
                            {item.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <form id={`stat-archive-form-${item.id}`} action={setStatStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="archived" />
                          </form>
                          <form id={`stat-publish-form-${item.id}`} action={setStatStatusAction} className="hidden">
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="status" value="published" />
                          </form>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => setEditingStat(item)}
                                className="cursor-pointer gap-2 text-sm"
                              >
                                <SquarePen className="h-4 w-4 text-blue-600" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              {item.is_active ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    const form = document.getElementById(`stat-archive-form-${item.id}`) as HTMLFormElement | null
                                    form?.requestSubmit()
                                  }}
                                  className="cursor-pointer gap-2 text-sm"
                                >
                                  <Archive className="h-4 w-4 text-amber-600" />
                                  <span>Archive</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    const form = document.getElementById(`stat-publish-form-${item.id}`) as HTMLFormElement | null
                                    form?.requestSubmit()
                                  }}
                                  className="cursor-pointer gap-2 text-sm"
                                >
                                  <Send className="h-4 w-4 text-emerald-600" />
                                  <span>Publish</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeletingStat(item)}
                                className="cursor-pointer gap-2 text-sm text-rose-600 focus:text-rose-600"
                              >
                                <Trash2Icon className="h-4 w-4 text-rose-600" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {homeStats.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No statistics found. Add your first stat.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* Global Add Stat Dialog */}
              <Dialog open={isAddStatOpen} onOpenChange={setIsAddStatOpen}>
                <DialogContent size="xl" className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Statistic</DialogTitle>
                    <DialogDescription>
                      Create a new homepage statistic counter.
                    </DialogDescription>
                  </DialogHeader>

                  <form action={createStatAction} onSubmit={() => setIsAddStatOpen(false)}>
                    <div className="space-y-4 p-6 max-h-[70vh] overflow-y-auto">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="stat-label" className="text-sm font-semibold text-foreground">Stat Label</Label>
                          <Input id="stat-label" name="stat_label" required placeholder="Students Enrolled" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="stat-slug" className="text-sm font-semibold text-foreground">Slug</Label>
                          <Input id="stat-slug" name="stat_slug" required placeholder="students-enrolled" />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="stat-value" className="text-sm font-semibold text-foreground">Value</Label>
                          <Input id="stat-value" type="number" name="stat_value" required defaultValue={0} min={0} />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="stat-suffix" className="text-sm font-semibold text-foreground">Suffix</Label>
                          <Input id="stat-suffix" name="stat_suffix" defaultValue="+" placeholder="+" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="stat-desc" className="text-sm font-semibold text-foreground">Description <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
                        <Input id="stat-desc" name="description" placeholder="Brief description..." />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <StatIconField id="stat-icon" defaultValue="users" />
                        <StatColorField id="stat-color" defaultValue="emerald" />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="stat-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                        <Input id="stat-order" type="number" name="display_order" defaultValue={homeStats.length + 1} min={0} />
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button" className="h-10 rounded-lg px-4 text-sm font-medium border-border">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                        Save Statistic
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Global Edit Stat Dialog */}
              <Dialog open={Boolean(editingStat)} onOpenChange={(open) => { if (!open) setEditingStat(null) }}>
                <DialogContent size="xl" className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Statistic</DialogTitle>
                    <DialogDescription>
                      Update the statistic details, value, icon, and styling.
                    </DialogDescription>
                  </DialogHeader>

                  {editingStat ? (
                    <form
                      key={editingStat.id}
                      action={updateStatAction}
                      onSubmit={() => setEditingStat(null)}
                    >
                      <input type="hidden" name="id" value={editingStat.id} />

                      <div className="space-y-4 p-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-stat-label" className="text-sm font-semibold text-foreground">Stat Label</Label>
                          <Input id="edit-stat-label" name="stat_label" defaultValue={editingStat.stat_label} required placeholder="Stat label" />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-stat-value" className="text-sm font-semibold text-foreground">Value</Label>
                            <Input id="edit-stat-value" type="number" name="stat_value" defaultValue={editingStat.stat_value} required min={0} />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="edit-stat-suffix" className="text-sm font-semibold text-foreground">Suffix</Label>
                            <Input id="edit-stat-suffix" name="stat_suffix" defaultValue={editingStat.stat_suffix || ""} placeholder="+" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-stat-desc" className="text-sm font-semibold text-foreground">Description <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
                          <Input id="edit-stat-desc" name="description" defaultValue={editingStat.description || ""} placeholder="Brief description..." />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <StatIconField id="edit-stat-icon" defaultValue={editingStat.icon_key || "users"} />
                          <StatColorField id="edit-stat-color" defaultValue={editingStat.color_scheme || "emerald"} />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-stat-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                          <Input id="edit-stat-order" type="number" name="display_order" defaultValue={editingStat.display_order} min={0} />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setEditingStat(null)}
                          className="h-10 rounded-lg px-4 text-sm font-medium border-border"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  ) : null}
                </DialogContent>
              </Dialog>

              {/* Global Delete Stat AlertDialog */}
              <AlertDialog open={Boolean(deletingStat)} onOpenChange={(open) => { if (!open) setDeletingStat(null) }}>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                      <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Statistic?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this statistic.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <form action={deleteStatAction} onSubmit={() => setDeletingStat(null)}>
                    <input type="hidden" name="id" value={deletingStat?.id || ""} />
                    <AlertDialogFooter>
                      <AlertDialogCancel variant="outline" onClick={() => setDeletingStat(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction type="submit" variant="destructive">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          ) : null}

          {activeTab === "footer" ? (
            <section className="space-y-4 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Footer Links</h2>
                  <p className="text-sm text-muted-foreground">Manage footer sections and quick links.</p>
                </div>
                <Button
                  onClick={() => setIsAddSectionOpen(true)}
                  className="h-10 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] gap-1.5 font-semibold text-sm px-4"
                >
                  <Plus className="size-4" />
                  <span>Add Section</span>
                </Button>
              </div>

              <div className="space-y-6">
                {footerSections.map((section) => (
                  <div key={section.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-muted/20 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground text-base">{section.section_name}</h3>
                          <Badge variant={section.is_active ? "success" : "secondary"}>
                            {section.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                          {section.links.length} {section.links.length === 1 ? "link" : "links"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => setAddingLinkToSection(section)}
                          className="h-8 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] gap-1 font-semibold text-xs px-3"
                        >
                          <Plus className="size-3.5" />
                          <span>Add Link</span>
                        </Button>

                        <form id={`footer-section-archive-form-${section.id}`} action={setFooterLinkSectionStatusAction} className="hidden">
                          <input type="hidden" name="id" value={section.id} />
                          <input type="hidden" name="status" value="archived" />
                        </form>
                        <form id={`footer-section-publish-form-${section.id}`} action={setFooterLinkSectionStatusAction} className="hidden">
                          <input type="hidden" name="id" value={section.id} />
                          <input type="hidden" name="status" value="published" />
                        </form>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open section menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => setEditingSection(section)}
                              className="cursor-pointer gap-2 text-sm"
                            >
                              <SquarePen className="h-4 w-4 text-blue-600" />
                              <span>Edit Section</span>
                            </DropdownMenuItem>
                            {section.is_active ? (
                              <DropdownMenuItem
                                onClick={() => {
                                  const form = document.getElementById(`footer-section-archive-form-${section.id}`) as HTMLFormElement | null
                                  form?.requestSubmit()
                                }}
                                className="cursor-pointer gap-2 text-sm"
                              >
                                <Archive className="h-4 w-4 text-amber-600" />
                                <span>Archive</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => {
                                  const form = document.getElementById(`footer-section-publish-form-${section.id}`) as HTMLFormElement | null
                                  form?.requestSubmit()
                                }}
                                className="cursor-pointer gap-2 text-sm"
                              >
                                <Send className="h-4 w-4 text-emerald-600" />
                                <span>Publish</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeletingSection(section)}
                              className="cursor-pointer gap-2 text-sm text-rose-600 focus:text-rose-600"
                            >
                              <Trash2Icon className="h-4 w-4 text-rose-600" />
                              <span>Delete Section</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {section.links.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-sm text-left">
                          <thead className="bg-muted/50 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
                            <tr>
                              <th className="px-4 py-3">Link Label</th>
                              <th className="px-4 py-3">URL</th>
                              <th className="px-4 py-3">Order</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {section.links.map((link) => (
                              <tr key={link.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-medium text-foreground">{link.link_label}</td>
                                <td className="px-4 py-3">
                                  <a
                                    href={link.link_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-[#4F46E5] hover:underline"
                                  >
                                    <LinkIcon className="size-3 shrink-0" />
                                    <span className="truncate max-w-[280px]">{link.link_url}</span>
                                  </a>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{link.display_order}</td>
                                <td className="px-4 py-3">
                                  <Badge variant={link.is_active ? "success" : "secondary"}>
                                    {link.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <form id={`footer-link-archive-form-${link.id}`} action={setFooterLinkStatusAction} className="hidden">
                                    <input type="hidden" name="id" value={link.id} />
                                    <input type="hidden" name="status" value="archived" />
                                  </form>
                                  <form id={`footer-link-publish-form-${link.id}`} action={setFooterLinkStatusAction} className="hidden">
                                    <input type="hidden" name="id" value={link.id} />
                                    <input type="hidden" name="status" value="published" />
                                  </form>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Open link menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                      <DropdownMenuItem
                                        onClick={() => setEditingLink({ sectionId: section.id, link })}
                                        className="cursor-pointer gap-2 text-sm"
                                      >
                                        <SquarePen className="h-4 w-4 text-blue-600" />
                                        <span>Edit</span>
                                      </DropdownMenuItem>
                                      {link.is_active ? (
                                        <DropdownMenuItem
                                          onClick={() => {
                                            const form = document.getElementById(`footer-link-archive-form-${link.id}`) as HTMLFormElement | null
                                            form?.requestSubmit()
                                          }}
                                          className="cursor-pointer gap-2 text-sm"
                                        >
                                          <Archive className="h-4 w-4 text-amber-600" />
                                          <span>Archive</span>
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem
                                          onClick={() => {
                                            const form = document.getElementById(`footer-link-publish-form-${link.id}`) as HTMLFormElement | null
                                            form?.requestSubmit()
                                          }}
                                          className="cursor-pointer gap-2 text-sm"
                                        >
                                          <Send className="h-4 w-4 text-emerald-600" />
                                          <span>Publish</span>
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() => setDeletingLink(link)}
                                        className="cursor-pointer gap-2 text-sm text-rose-600 focus:text-rose-600"
                                      >
                                        <Trash2Icon className="h-4 w-4 text-rose-600" />
                                        <span>Delete</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No links in this section yet. Click &quot;Add Link&quot; above to create one.
                      </div>
                    )}
                  </div>
                ))}
                {footerSections.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    No footer sections found. Create your first section above.
                  </div>
                ) : null}
              </div>

              {/* Global Add Section Dialog */}
              <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                <DialogContent size="xl" className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Add Footer Section</DialogTitle>
                    <DialogDescription>Create a new footer link section category.</DialogDescription>
                  </DialogHeader>

                  <form action={createFooterLinkSectionAction} onSubmit={() => setIsAddSectionOpen(false)}>
                    <div className="space-y-4 p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="footer-section-name" className="text-sm font-semibold text-foreground">Section Name</Label>
                          <Input id="footer-section-name" name="section_name" required placeholder="Quick Links" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="footer-section-slug" className="text-sm font-semibold text-foreground">Section Slug</Label>
                          <Input id="footer-section-slug" name="section_slug" required placeholder="quick-links" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="footer-section-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                        <Input id="footer-section-order" type="number" name="display_order" defaultValue={footerSections.length + 1} min={0} />
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" type="button" className="h-10 rounded-lg px-4 text-sm font-medium border-border">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                        Save Section
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Global Edit Section Dialog */}
              <Dialog open={Boolean(editingSection)} onOpenChange={(open) => { if (!open) setEditingSection(null) }}>
                <DialogContent size="xl" className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Edit Footer Section</DialogTitle>
                    <DialogDescription>Update the section name and ordering.</DialogDescription>
                  </DialogHeader>

                  {editingSection ? (
                    <form
                      key={editingSection.id}
                      action={updateFooterLinkSectionAction}
                      onSubmit={() => setEditingSection(null)}
                    >
                      <input type="hidden" name="id" value={editingSection.id} />

                      <div className="space-y-4 p-6">
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-footer-name" className="text-sm font-semibold text-foreground">Section Name</Label>
                          <Input id="edit-footer-name" name="section_name" defaultValue={editingSection.section_name} required placeholder="Section name" />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-footer-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                          <Input id="edit-footer-order" type="number" name="display_order" defaultValue={editingSection.display_order} min={0} />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setEditingSection(null)}
                          className="h-10 rounded-lg px-4 text-sm font-medium border-border"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  ) : null}
                </DialogContent>
              </Dialog>

              {/* Global Delete Section AlertDialog */}
              <AlertDialog open={Boolean(deletingSection)} onOpenChange={(open) => { if (!open) setDeletingSection(null) }}>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                      <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Section?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this footer section and all its links.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <form action={deleteFooterLinkSectionAction} onSubmit={() => setDeletingSection(null)}>
                    <input type="hidden" name="id" value={deletingSection?.id || ""} />
                    <AlertDialogFooter>
                      <AlertDialogCancel variant="outline" onClick={() => setDeletingSection(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction type="submit" variant="destructive">Delete Section</AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>

              {/* Global Add Link Dialog */}
              <Dialog open={Boolean(addingLinkToSection)} onOpenChange={(open) => { if (!open) setAddingLinkToSection(null) }}>
                <DialogContent size="xl" className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Add Footer Link</DialogTitle>
                    <DialogDescription>
                      Add a new link into &ldquo;{addingLinkToSection?.section_name}&rdquo;.
                    </DialogDescription>
                  </DialogHeader>

                  {addingLinkToSection ? (
                    <form
                      key={addingLinkToSection.id}
                      action={createFooterLinkAction}
                      onSubmit={() => setAddingLinkToSection(null)}
                    >
                      <input type="hidden" name="section_id" value={addingLinkToSection.id} />

                      <div className="space-y-4 p-6">
                        <div className="space-y-1.5">
                          <Label htmlFor="link-label" className="text-sm font-semibold text-foreground">Link Label</Label>
                          <Input id="link-label" name="link_label" required placeholder="About Us" />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="link-url" className="text-sm font-semibold text-foreground">Link URL</Label>
                          <Input id="link-url" name="link_url" type="url" required placeholder="https://... or /about" />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="link-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                          <Input id="link-order" type="number" name="display_order" defaultValue={addingLinkToSection.links.length + 1} min={0} />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setAddingLinkToSection(null)}
                          className="h-10 rounded-lg px-4 text-sm font-medium border-border"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                          Save Link
                        </Button>
                      </DialogFooter>
                    </form>
                  ) : null}
                </DialogContent>
              </Dialog>

              {/* Global Edit Link Dialog */}
              <Dialog open={Boolean(editingLink)} onOpenChange={(open) => { if (!open) setEditingLink(null) }}>
                <DialogContent size="xl" className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Edit Footer Link</DialogTitle>
                    <DialogDescription>Update link label, URL, or ordering.</DialogDescription>
                  </DialogHeader>

                  {editingLink ? (
                    <form
                      key={editingLink.link.id}
                      action={updateFooterLinkAction}
                      onSubmit={() => setEditingLink(null)}
                    >
                      <input type="hidden" name="id" value={editingLink.link.id} />

                      <div className="space-y-4 p-6">
                        <div className="space-y-1.5">
                          <Label htmlFor="edit-link-label" className="text-sm font-semibold text-foreground">Link Label</Label>
                          <Input id="edit-link-label" name="link_label" defaultValue={editingLink.link.link_label} required placeholder="About Us" />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-link-url" className="text-sm font-semibold text-foreground">Link URL</Label>
                          <Input id="edit-link-url" name="link_url" type="url" defaultValue={editingLink.link.link_url} required placeholder="https://... or /about" />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="edit-link-order" className="text-sm font-semibold text-foreground">Display Order</Label>
                          <Input id="edit-link-order" type="number" name="display_order" defaultValue={editingLink.link.display_order} min={0} />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setEditingLink(null)}
                          className="h-10 rounded-lg px-4 text-sm font-medium border-border"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-[#4F46E5] text-white hover:bg-[#4338CA]">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  ) : null}
                </DialogContent>
              </Dialog>

              {/* Global Delete Link AlertDialog */}
              <AlertDialog open={Boolean(deletingLink)} onOpenChange={(open) => { if (!open) setDeletingLink(null) }}>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                      <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Link?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this footer link.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <form action={deleteFooterLinkAction} onSubmit={() => setDeletingLink(null)}>
                    <input type="hidden" name="id" value={deletingLink?.id || ""} />
                    <AlertDialogFooter>
                      <AlertDialogCancel variant="outline" onClick={() => setDeletingLink(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction type="submit" variant="destructive">Delete Link</AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
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
