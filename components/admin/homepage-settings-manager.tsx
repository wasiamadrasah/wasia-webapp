"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Archive, BookOpen, Eye, GalleryHorizontal, Image as ImageIcon, LayoutDashboard, MoreHorizontal, Pencil, Plus, Send, Sparkles, Trash2Icon, Users, BarChart3, Link as LinkIcon, ExternalLink, SquarePen, CheckCircle2, AlertCircle } from "lucide-react"
import { PageHeader } from "@/components/digicampus/page-header"
import { AdminActionsDropdown } from "@/components/admin/admin-actions-dropdown"

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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TiptapEditor } from "@/components/forms/tiptap-editor"
import { ProfilePhotoUpload } from "./profile-photo-upload"

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
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">Icon</Label>
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
    </div>
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
  const [editingProgram, setEditingProgram] = useState<AcademicProgramRecord | null>(null)
  const [editingClub, setEditingClub] = useState<HomepageExtracurricularRecord | null>(null)

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
    <div className="w-full max-w-full space-y-6">
      {/* ── Standard DigiCampus Page Header ── */}
      <PageHeader
        title="Homepage Settings"
        description="Configure public portal homepage sections, banners, leadership messages, and academic programs."
        action={
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="h-10 rounded-lg border-border text-foreground hover:bg-muted/50 gap-1.5 font-medium text-xs cursor-pointer">
              <Link href="/" target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5 text-muted-foreground" />
                <span>View Live Site</span>
              </Link>
            </Button>
          </div>
        }
      />

      {/* ── Feedback Message Banner ── */}
      {message ? (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-medium shadow-2xs animate-in fade-in-50 duration-200 ${
            status === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400"
          }`}
        >
          {status === "success" ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{message}</span>
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        {/* Column 1: Vertical Navigation Menu (System Settings Style) */}
        <div className="w-full md:w-56 lg:w-64 shrink-0">
          <div className="flex flex-col rounded-xl border border-border/80 bg-card overflow-hidden divide-y divide-border/70 shadow-xs">
            {tabItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              const count = tabCounts[item.id]
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "hover:bg-muted/60 text-foreground font-medium bg-card hover:text-primary"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`size-4.5 shrink-0 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {count !== undefined && (
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold shrink-0 ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Column 2: Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {activeTab === "overview" ? (
            <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Overview</h2>
                  <p className="text-sm text-muted-foreground">Live summary of homepage sections and publish status.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs">
                    <Link href="/" target="_blank" rel="noreferrer">
                      <Eye className="size-3.5 mr-1" />
                      Open Homepage
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
                    <Link href="/admin/photo-gallery">
                      <GalleryHorizontal className="size-3.5 mr-1" />
                      Open Photo Gallery
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hero Slides</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ImageIcon className="size-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-foreground">{activeHeroSlidesCount} / {heroSlides.length}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">Active / Total</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Info</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="size-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-foreground">{activeQuickInfoCount} / {quickInfoItems.length}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">Active / Total</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Leadership</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Users className="size-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-foreground">{activeLeadershipCount} / {leadershipCards.length}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">Active / Total</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Photo Gallery</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <GalleryHorizontal className="size-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-foreground">{publishedGalleryCount} / {galleryPhotos.length}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">Published / Total</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Academic Programs</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="size-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-foreground">{activeProgramCount} / {academicPrograms.length}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">Active / Total</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Statistics</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BarChart3 className="size-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-foreground">{activeStatCount} / {homeStats.length}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">Active / Total</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Footer Sections</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <LayoutDashboard className="size-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-foreground">{activeFooterSectionCount} / {footerSections.length}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">Active / Total</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Extracurriculars</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Sparkles className="size-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-foreground">{activeExtracurricularCount} / {extracurriculars.length}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">Active / Total</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs font-medium text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-primary shrink-0" />
                <span>Homepage photo gallery cards now read directly from the live public media database.</span>
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
                  className="h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-semibold text-sm px-4"
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
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/15 border border-primary/20 rounded-md px-2.5 py-1 transition-colors"
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
                                <SquarePen className="h-4 w-4 text-primary" />
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
                      <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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
                                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
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
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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
                  className="h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-semibold text-sm px-4"
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
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/15 border border-primary/20 rounded-md px-2.5 py-1 transition-colors"
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
                                <SquarePen className="h-4 w-4 text-primary" />
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
                      <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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
                  className="h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-semibold text-sm px-4"
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
                                  <SquarePen className="h-4 w-4 text-primary" />
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

                      <div className="space-y-1.5">
                        <Label htmlFor="leadership-name" className="text-sm font-semibold text-foreground">Leader Name</Label>
                        <Input id="leadership-name" name="leader_name" placeholder="Dr. Jane Doe" />
                      </div>

                      <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
                        <ProfilePhotoUpload
                          label="Leader Photo"
                          name="leader_photo_url"
                          uploadFolder="homepage/leadership"
                          aspectRatio="portrait"
                        />
                        <div className="space-y-1">
                          <Label htmlFor="leadership-photo-url" className="text-xs text-muted-foreground font-normal">
                            Photo URL <span className="text-xs text-muted-foreground font-normal">(Optional fallback)</span>
                          </Label>
                          <Input id="leadership-photo-url" name="leader_photo_url_fallback" placeholder="https://..." className="h-9 text-xs" />
                        </div>
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
                      <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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

                        <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
                          <ProfilePhotoUpload
                            currentPhotoUrl={editingLeadership.leader_photo_url}
                            label="Leader Photo"
                            name="leader_photo_url"
                            uploadFolder="homepage/leadership"
                            aspectRatio="portrait"
                          />
                          <div className="space-y-1">
                            <Label htmlFor="edit-leader-photo-url" className="text-xs text-muted-foreground font-normal">
                              Photo URL Fallback <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                            </Label>
                            <Input
                              id="edit-leader-photo-url"
                              name="leader_photo_url_fallback"
                              defaultValue={editingLeadership.leader_photo_url ?? ""}
                              placeholder="https://..."
                              className="h-9 text-xs"
                            />
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
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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
            <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Photo Gallery Section</h2>
                  <p className="text-sm text-muted-foreground">
                    Direct feed of campus photo gallery records displayed on the public homepage.
                  </p>
                </div>
                <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs cursor-pointer">
                  <Link href="/admin/photo-gallery">
                    <Plus className="size-3.5 mr-1" />
                    Manage Photo Gallery
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Photos</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <GalleryHorizontal className="size-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-foreground">{galleryPhotos.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Published Photos</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Eye className="size-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-foreground">{galleryPhotos.filter((item) => item.published !== false).length}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Categories</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="size-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-foreground">{new Set(galleryPhotos.map((item) => item.category)).size}</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
                <table className="w-full min-w-[500px] text-sm">
                  <thead className="bg-muted/50 text-left border-b border-border text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Photo & Title</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {galleryPhotos.slice(0, 20).map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative size-10 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground text-sm truncate max-w-sm">{item.title}</p>
                              {item.description ? (
                                <p className="text-xs text-muted-foreground truncate max-w-sm">{item.description}</p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={item.published !== false ? "success" : "secondary"}>
                            {item.published !== false ? "Published" : "Draft"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <a
                            href={item.image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            <ExternalLink className="size-3.5" />
                            <span>View</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                    {galleryPhotos.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">
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
            <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Academic Programs</h2>
                  <p className="text-sm text-muted-foreground">Manage academic departments, syllabus links, and homepage highlights.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-semibold text-xs shadow-xs cursor-pointer px-3.5"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Program</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-xl">
                    <form action={createAcademicProgramAction} className="space-y-0">
                      <AlertDialogHeader>
                        <AlertDialogMedia className="bg-primary/10 text-primary">
                          <BookOpen className="size-5" />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Add Academic Program</AlertDialogTitle>
                        <AlertDialogDescription>Create a new academic department or program card.</AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="grid gap-4 px-6 py-4 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-2">
                          <Label htmlFor="prog-name" className="text-sm font-bold text-foreground">
                            Program Name <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="prog-name"
                            name="program_name"
                            required
                            className="h-10 text-sm border-border"
                            placeholder="e.g. Science, Commerce, Hifz-ul-Quran"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="prog-slug" className="text-sm font-bold text-foreground">
                            Program Slug <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="prog-slug"
                            name="program_slug"
                            required
                            className="h-10 text-sm border-border"
                            placeholder="e.g. science, commerce, hifz"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="prog-desc" className="text-sm font-bold text-foreground">
                            Description
                          </Label>
                          <textarea
                            id="prog-desc"
                            name="description"
                            rows={3}
                            className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                            placeholder="Brief description of the academic program..."
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="prog-icon" className="text-sm font-bold text-foreground">
                              Icon
                            </Label>
                            <Select defaultValue="book-open" name="icon_key">
                              <SelectTrigger id="prog-icon" className="h-10 text-sm border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {iconOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="prog-order" className="text-sm font-bold text-foreground">
                              Display Order
                            </Label>
                            <Input
                              id="prog-order"
                              type="number"
                              name="display_order"
                              defaultValue={academicPrograms.length + 1}
                              className="h-10 text-sm border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="prog-url" className="text-sm font-bold text-foreground">
                            Link URL (Optional)
                          </Label>
                          <Input
                            id="prog-url"
                            name="link_url"
                            type="url"
                            className="h-10 text-sm border-border"
                            placeholder="https://... (Optional)"
                          />
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                          Save Program
                        </Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
                <table className="w-full min-w-[500px] text-sm">
                  <thead className="bg-muted/50 text-left border-b border-border text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Program Name</th>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {academicPrograms.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground">{item.program_name}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs font-medium">{item.display_order}</td>
                        <td className="px-4 py-3">
                          <Badge variant={item.is_active ? "success" : "secondary"}>
                            {item.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end">
                            <AdminActionsDropdown
                              onEdit={() => setEditingProgram(item)}
                              editLabel="Edit"
                              toggleActive={{
                                isActive: item.is_active,
                                activeLabel: "Archive",
                                inactiveLabel: "Publish",
                                activeIcon: <Archive className="h-4 w-4 text-muted-foreground" />,
                                inactiveIcon: <Send className="h-4 w-4 text-emerald-600" />,
                                onToggle: () => {
                                  const form = document.getElementById(
                                    item.is_active ? `prog-archive-${item.id}` : `prog-publish-${item.id}`
                                  ) as HTMLFormElement | null
                                  form?.requestSubmit()
                                },
                              }}
                              onDelete={() => {
                                if (confirm(`Permanently delete academic program "${item.program_name}"?`)) {
                                  const form = document.getElementById(`prog-del-${item.id}`) as HTMLFormElement | null
                                  form?.requestSubmit()
                                }
                              }}
                              deleteLabel="Delete"
                            />

                            {/* Hidden action forms */}
                            <form id={`prog-archive-${item.id}`} action={setAcademicProgramStatusAction} className="hidden">
                              <input type="hidden" name="id" value={item.id} />
                              <input type="hidden" name="status" value="archived" />
                            </form>
                            <form id={`prog-publish-${item.id}`} action={setAcademicProgramStatusAction} className="hidden">
                              <input type="hidden" name="id" value={item.id} />
                              <input type="hidden" name="status" value="published" />
                            </form>
                            <form id={`prog-del-${item.id}`} action={deleteAcademicProgramAction} className="hidden">
                              <input type="hidden" name="id" value={item.id} />
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {academicPrograms.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No academic programs found. Add your first program.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* Edit Program Dialog */}
              {editingProgram && (
                <AlertDialog open={true} onOpenChange={(open) => !open && setEditingProgram(null)}>
                  <AlertDialogContent className="sm:max-w-xl">
                    <form action={updateAcademicProgramAction} className="space-y-0" onSubmit={() => setEditingProgram(null)}>
                      <input type="hidden" name="id" value={editingProgram.id} />
                      <AlertDialogHeader>
                        <AlertDialogMedia className="bg-primary/10 text-primary">
                          <Pencil className="size-5" />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Edit Academic Program</AlertDialogTitle>
                        <AlertDialogDescription>Update program information, icon, and ordering.</AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="grid gap-4 px-6 py-4 max-h-[70vh] overflow-y-auto text-left">
                        <div className="space-y-2">
                          <Label htmlFor="edit-prog-name" className="text-sm font-bold text-foreground">
                            Program Name <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="edit-prog-name"
                            name="program_name"
                            defaultValue={editingProgram.program_name}
                            required
                            className="h-10 text-sm border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-prog-slug" className="text-sm font-bold text-foreground">
                            Program Slug <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="edit-prog-slug"
                            name="program_slug"
                            defaultValue={editingProgram.program_slug}
                            required
                            className="h-10 text-sm border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-prog-desc" className="text-sm font-bold text-foreground">
                            Description
                          </Label>
                          <textarea
                            id="edit-prog-desc"
                            name="description"
                            defaultValue={editingProgram.description || ""}
                            rows={3}
                            className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-prog-icon" className="text-sm font-bold text-foreground">
                              Icon
                            </Label>
                            <Select defaultValue={editingProgram.icon_key} name="icon_key">
                              <SelectTrigger id="edit-prog-icon" className="h-10 text-sm border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {iconOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-prog-order" className="text-sm font-bold text-foreground">
                              Display Order
                            </Label>
                            <Input
                              id="edit-prog-order"
                              type="number"
                              name="display_order"
                              defaultValue={editingProgram.display_order}
                              className="h-10 text-sm border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-prog-url" className="text-sm font-bold text-foreground">
                            Link URL (Optional)
                          </Label>
                          <Input
                            id="edit-prog-url"
                            name="link_url"
                            type="url"
                            defaultValue={editingProgram.link_url || ""}
                            className="h-10 text-sm border-border"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setEditingProgram(null)}>Cancel</AlertDialogCancel>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                          Update Program
                        </Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              )}
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
                  className="h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-semibold text-sm px-4"
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
                      <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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
                  className="h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-semibold text-sm px-4"
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
                          className="h-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-1 font-semibold text-xs px-3"
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
                                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary hover:underline"
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
                      <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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
                        <Button type="submit" className="h-10 rounded-lg px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
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
            <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Extracurricular Clubs</h2>
                  <p className="text-sm text-muted-foreground">Manage co-curricular activities, display order, and upload logos.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-xs">
                      <Plus className="size-4" />
                      Add Club
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-xl">
                    <form action={createHomepageExtracurricularAction} className="space-y-0">
                      <AlertDialogHeader>
                        <AlertDialogMedia className="bg-primary/10 text-primary">
                          <Sparkles className="size-5" />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Add Extracurricular Club</AlertDialogTitle>
                        <AlertDialogDescription>Create a new extracurricular club card.</AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="grid gap-4 px-6 py-4 max-h-[70vh] overflow-y-auto text-left">
                        <div className="space-y-2">
                          <Label htmlFor="club-name" className="text-sm font-bold text-foreground">
                            Club Name <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="club-name"
                            name="name"
                            required
                            className="h-10 text-sm border-border"
                            placeholder="e.g. Scouts & Rover Club"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="club-slug" className="text-sm font-bold text-foreground">
                            Club Slug <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="club-slug"
                            name="slug"
                            required
                            className="h-10 text-sm border-border"
                            placeholder="e.g. scouts-club"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="club-desc" className="text-sm font-bold text-foreground">
                            Description
                          </Label>
                          <textarea
                            id="club-desc"
                            name="description"
                            rows={3}
                            className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                            placeholder="Brief description of the club..."
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="club-icon" className="text-sm font-bold text-foreground">
                              Lucide Icon
                            </Label>
                            <Select defaultValue="sparkles" name="icon_key">
                              <SelectTrigger id="club-icon" className="h-10 text-sm border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {extracurricularIconOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="club-order" className="text-sm font-bold text-foreground">
                              Display Order
                            </Label>
                            <Input
                              id="club-order"
                              type="number"
                              name="display_order"
                              defaultValue={extracurriculars.length + 1}
                              className="h-10 text-sm border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="club-logo-file" className="text-sm font-bold text-foreground">
                            Club Logo File
                          </Label>
                          <input
                            id="club-logo-file"
                            name="logo_file"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20 cursor-pointer"
                          />
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                          Save Club
                        </Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
                <table className="w-full min-w-[500px] text-sm">
                  <thead className="bg-muted/50 text-left border-b border-border text-xs font-semibold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Club Name</th>
                      <th className="px-4 py-3">Logo</th>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {extracurriculars.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground">{item.name}</td>
                        <td className="px-4 py-3 text-sm">
                          {item.logo_url ? (
                            <a href={item.logo_url} target="_blank" rel="noreferrer" className="text-primary underline hover:text-primary/80 text-xs font-medium">
                              View Logo
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs font-medium">{item.display_order}</td>
                        <td className="px-4 py-3">
                          <Badge variant={item.is_active ? "success" : "secondary"}>
                            {item.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end">
                            <AdminActionsDropdown
                              onEdit={() => setEditingClub(item)}
                              editLabel="Edit"
                              toggleActive={{
                                isActive: item.is_active,
                                activeLabel: "Archive",
                                inactiveLabel: "Publish",
                                activeIcon: <Archive className="h-4 w-4 text-muted-foreground" />,
                                inactiveIcon: <Send className="h-4 w-4 text-emerald-600" />,
                                onToggle: () => {
                                  const form = document.getElementById(
                                    item.is_active ? `club-archive-${item.id}` : `club-publish-${item.id}`
                                  ) as HTMLFormElement | null
                                  form?.requestSubmit()
                                },
                              }}
                              onDelete={() => {
                                if (confirm(`Permanently delete extracurricular club "${item.name}"?`)) {
                                  const form = document.getElementById(`club-del-${item.id}`) as HTMLFormElement | null
                                  form?.requestSubmit()
                                }
                              }}
                              deleteLabel="Delete"
                            />

                            {/* Hidden action forms */}
                            <form id={`club-archive-${item.id}`} action={setHomepageExtracurricularStatusAction} className="hidden">
                              <input type="hidden" name="id" value={item.id} />
                              <input type="hidden" name="status" value="archived" />
                            </form>
                            <form id={`club-publish-${item.id}`} action={setHomepageExtracurricularStatusAction} className="hidden">
                              <input type="hidden" name="id" value={item.id} />
                              <input type="hidden" name="status" value="published" />
                            </form>
                            <form id={`club-del-${item.id}`} action={deleteHomepageExtracurricularAction} className="hidden">
                              <input type="hidden" name="id" value={item.id} />
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {extracurriculars.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No extracurricular clubs found. Add your first club.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* Edit Club Dialog */}
              {editingClub && (
                <AlertDialog open={true} onOpenChange={(open) => !open && setEditingClub(null)}>
                  <AlertDialogContent className="sm:max-w-xl">
                    <form action={updateHomepageExtracurricularAction} className="space-y-0" onSubmit={() => setEditingClub(null)}>
                      <input type="hidden" name="id" value={editingClub.id} />
                      <input type="hidden" name="existing_logo_url" value={editingClub.logo_url || ""} />
                      <AlertDialogHeader>
                        <AlertDialogMedia className="bg-primary/10 text-primary">
                          <Pencil className="size-5" />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Edit Extracurricular Club</AlertDialogTitle>
                        <AlertDialogDescription>Update club details and upload a new logo if needed.</AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="grid gap-4 px-6 py-4 max-h-[70vh] overflow-y-auto text-left">
                        <div className="space-y-2">
                          <Label htmlFor="edit-club-name" className="text-sm font-bold text-foreground">
                            Club Name <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="edit-club-name"
                            name="name"
                            defaultValue={editingClub.name}
                            required
                            className="h-10 text-sm border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-club-slug" className="text-sm font-bold text-foreground">
                            Club Slug <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="edit-club-slug"
                            name="slug"
                            defaultValue={editingClub.slug}
                            required
                            className="h-10 text-sm border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-club-desc" className="text-sm font-bold text-foreground">
                            Description
                          </Label>
                          <textarea
                            id="edit-club-desc"
                            name="description"
                            defaultValue={editingClub.description || ""}
                            rows={3}
                            className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-club-icon" className="text-sm font-bold text-foreground">
                              Lucide Icon
                            </Label>
                            <Select defaultValue={editingClub.icon_key} name="icon_key">
                              <SelectTrigger id="edit-club-icon" className="h-10 text-sm border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {extracurricularIconOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-club-order" className="text-sm font-bold text-foreground">
                              Display Order
                            </Label>
                            <Input
                              id="edit-club-order"
                              type="number"
                              name="display_order"
                              defaultValue={editingClub.display_order}
                              className="h-10 text-sm border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-club-logo" className="text-sm font-bold text-foreground">
                            Replace Logo File
                          </Label>
                          <input
                            id="edit-club-logo"
                            name="logo_file"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20 cursor-pointer"
                          />
                          {editingClub.logo_url && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Current logo: <a href={editingClub.logo_url} target="_blank" rel="noreferrer" className="text-primary underline">View</a>
                            </p>
                          )}
                        </div>
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel type="button" onClick={() => setEditingClub(null)}>Cancel</AlertDialogCancel>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                          Save Changes
                        </Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
