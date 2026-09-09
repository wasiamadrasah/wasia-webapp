'use client'

import Link from "next/link"
import Image from "next/image"
import { generateBlurPlaceholder } from "@/lib/image-optimizer"
import { Cormorant_Garamond } from "next/font/google"
import { Fragment, useEffect, useRef, useState } from "react"
import { AnimatedStatCounter } from "@/components/ui/AnimatedStatCounter"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, BookOpen, Award, Calendar, Heart,
  ChevronLeft, ChevronRight, Zap,
  GraduationCap, BarChart3, Sparkles, Newspaper, Search, ArrowUpRight, FileText, Play, X,
  Compass, Trophy, MessageSquare, Languages,
} from "lucide-react"

const welcomeFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
})

type TeacherCard = {
  id: string
  full_name_en: string | null
  designation: string | null
  profile_photo: string | null
}

type NoticeRow = {
  id: string
  title: string | null
  published_at: string | null
  created_at: string | null
  notice_type: string | null
}

type EventRow = {
  id: string
  title: string | null
  event_date: string | null
  location: string | null
}

type NewsRow = {
  id: string
  title: string | null
  content: string | null
  published_at: string | null
  created_at: string | null
}

type HomePhotoRow = {
  id: string
  title: string | null
  image_url: string | null
  photo_date: string | null
  created_at: string | null
  category: string | null
}

type HomeLeadershipPayload = {
  president: TeacherCard | null
  chief_education_officer: TeacherCard | null
  headmaster: TeacherCard | null
}

type HomeQuickInfoRow = {
  id: string
  title: string
  subtitle: string
  icon_key: string
  link_url: string | null
  display_order: number
}

type HomeLeadershipCardRow = {
  id: string
  role_slug: string
  role_title: string
  leader_name: string | null
  leader_photo_url: string | null
  leader_message: string | null
  subtitle: string | null
  display_order: number
  staff: TeacherCard | null
}

type HomeAcademicProgramRow = {
  id: string
  program_name: string
  program_slug: string
  description: string | null
  icon_key: string
  link_url: string | null
  display_order: number
}

type HomeExtracurricularRow = {
  id: string
  name: string
  slug: string
  description: string | null
  icon_key: string
  logo_url: string | null
  display_order: number
}

type HomeStatRow = {
  id: string
  stat_label: string
  stat_slug: string
  stat_value: number
  stat_suffix: string
  description: string | null
  icon_key: string
  color_scheme: string
  display_order: number
}

type HomeHeroSlide = {
  id: string
  title: string | null
  image_url: string | null
  display_order: number | null
}

type InstituteSettingsPublic = {
  primary?: {
    instituteName?: string
  }
}

function stripHtml(value: string | null) {
  if (!value) return ""
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

const statsCards = [
  {
    value: 5000,
    suffix: "+",
    label: "Students Enrolled",
    description: "A vibrant student community growing across every grade.",
    icon: Users,
    icon_key: "users",
    color_scheme: "emerald",
    iconClass: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20",
    glowClass: "from-emerald-400/20 to-transparent",
  },
  {
    value: 200,
    suffix: "+",
    label: "Qualified Teachers",
    description: "Experienced educators mentoring with care and rigor.",
    icon: GraduationCap,
    icon_key: "graduation-cap",
    color_scheme: "cyan",
    iconClass: "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20",
    glowClass: "from-cyan-400/20 to-transparent",
  },
  {
    value: 95,
    suffix: "%",
    label: "Success Rate",
    description: "Consistent academic outcomes backed by focused support.",
    icon: Award,
    icon_key: "award",
    color_scheme: "amber",
    iconClass: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20",
    glowClass: "from-amber-400/20 to-transparent",
  },
  {
    value: 50,
    suffix: "+",
    label: "Years Legacy",
    description: "A long-standing culture of excellence and trust.",
    icon: Sparkles,
    icon_key: "sparkles",
    color_scheme: "rose",
    iconClass: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/20",
    glowClass: "from-rose-400/20 to-transparent",
  },
] as const

const fallbackQuickInfoItems = [
  { id: "quick-1", title: "Admission Open", subtitle: "Session 2026-2027", icon_key: "book-open", link_url: "/admission", display_order: 1 },
  { id: "quick-2", title: "Accredited", subtitle: "Govt. Approved", icon_key: "award", link_url: "/about", display_order: 2 },
  { id: "quick-3", title: "Classes Start", subtitle: "March 1, 2026", icon_key: "calendar", link_url: "/admission", display_order: 3 },
  { id: "quick-4", title: "Scholarships", subtitle: "Up to 100% Tuition", icon_key: "heart", link_url: "/admission", display_order: 4 },
] as const

const fallbackPhotoGalleryItems = [
  {
    id: "gallery-1",
    title: "Science Fair 2026",
    date: "Mar 18, 2026",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1400&q=80",
    alt: "Students presenting science projects",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "gallery-2",
    title: "Annual Sports Day",
    date: "Feb 24, 2026",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1400&q=80",
    alt: "Students running on the sports field",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "gallery-3",
    title: "Art & Culture Festival",
    date: "Jan 30, 2026",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&q=80",
    alt: "Students performing on a stage",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: "gallery-4",
    title: "Robotics Workshop",
    date: "Apr 02, 2026",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1400&q=80",
    alt: "Students working with robotics kits",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "gallery-5",
    title: "Library Reading Circle",
    date: "Mar 10, 2026",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&q=80",
    alt: "Students reading books in library",
    className: "md:col-span-1 md:row-span-1",
  },
] as const

const fallbackHeroSlides = [
  {
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80",
    alt: "Students learning in a modern school classroom",
  },
  {
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80",
    alt: "School campus building and learning environment",
  },
] as const

export default function HomePage() {
  const [heroSlides, setHeroSlides] = useState<{ image: string; alt: string }[]>([])
  const [quickInfoItems, setQuickInfoItems] = useState<HomeQuickInfoRow[]>([])
  const [notices, setNotices] = useState<NoticeRow[]>([])
  const [news, setNews] = useState<NewsRow[]>([])
  const [events, setEvents] = useState<EventRow[]>([])
  const [photos, setPhotos] = useState<HomePhotoRow[]>([])
  const [leadershipCardItems, setLeadershipCardItems] = useState<HomeLeadershipCardRow[]>([])
  const [academicPrograms, setAcademicPrograms] = useState<HomeAcademicProgramRow[]>([])
  const [homeStats, setHomeStats] = useState<HomeStatRow[]>([])
  const [extracurriculars, setExtracurriculars] = useState<HomeExtracurricularRow[]>([])
  const [leadership, setLeadership] = useState<HomeLeadershipPayload>({
    president: null,
    chief_education_officer: null,
    headmaster: null,
  })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeFeed, setActiveFeed] = useState<"notices" | "news" | "events">("notices")
  const [feedSearch, setFeedSearch] = useState("")
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null)
  const [instituteName, setInstituteName] = useState("Purba Bakalia City Corporation High School")

  const activeHeroSlides = heroSlides.length > 0 ? heroSlides : [...fallbackHeroSlides]
  const safeCurrentSlide = activeHeroSlides.length > 0 ? Math.min(currentSlide, activeHeroSlides.length - 1) : 0

  const nextSlide = () => {
    if (activeHeroSlides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % activeHeroSlides.length)
    }
  }

  const prevSlide = () => {
    if (activeHeroSlides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + activeHeroSlides.length) % activeHeroSlides.length)
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/public/home-feed", { cache: "no-store" })
        
        if (!response.ok) {
          console.error("Homepage feed API error: HTTP", response.status, response.statusText)
          return
        }

        const payload = (await response.json()) as {
          error?: string
          notices?: NoticeRow[]
          news?: NewsRow[]
          events?: EventRow[]
          photos?: HomePhotoRow[]
          hero_slides?: HomeHeroSlide[]
          quick_info_items?: HomeQuickInfoRow[]
          leadership_cards?: HomeLeadershipCardRow[]
          academic_programs?: HomeAcademicProgramRow[]
          stats?: HomeStatRow[]
          leadership?: HomeLeadershipPayload
          institute_settings?: InstituteSettingsPublic | null
          extracurriculars?: HomeExtracurricularRow[]
        }

        if (payload.error) {
          console.error("Homepage feed API error:", payload.error)
          return
        }

        setNotices(payload.notices ?? [])
        setNews(payload.news ?? [])
        setEvents(payload.events ?? [])
        setPhotos(payload.photos ?? [])
        setQuickInfoItems(payload.quick_info_items ?? [])
        setLeadershipCardItems(payload.leadership_cards ?? [])
        setAcademicPrograms(payload.academic_programs ?? [])
        setHomeStats(payload.stats ?? [])
        setExtracurriculars(payload.extracurriculars ?? [])
        const apiInstituteName = payload.institute_settings?.primary?.instituteName?.trim()
        if (apiInstituteName) {
          setInstituteName(apiInstituteName)
        }
        const heroFromApi = (payload.hero_slides ?? [])
          .filter((item) => Boolean(item.image_url))
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
          .map((item, index) => ({
            image: item.image_url as string,
            alt: item.title || `Hero slide ${index + 1}`,
          }))

        if (heroFromApi.length > 0) {
          setHeroSlides(heroFromApi)
        }
        setLeadership(
          payload.leadership ?? {
            president: null,
            chief_education_officer: null,
            headmaster: null,
          }
        )
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
        console.error(
          "Error fetching homepage data:",
          errorMessage,
          {
            isNetworkError: error instanceof TypeError && error.message.includes("fetch"),
            timestamp: new Date().toISOString(),
          }
        )
        // Silently fail - use default state for graceful degradation
      }
    }
    
    fetchData()
  }, [])

  // Auto-rotate slider
  useEffect(() => {
    if (activeHeroSlides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeHeroSlides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [activeHeroSlides.length])

  useEffect(() => {
    if (!selectedPhotoId) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhotoId(null)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selectedPhotoId])

  const normalizedFeedSearch = feedSearch.trim().toLowerCase()
  const filteredNotices = notices.filter((item) => (item.title ?? "").toLowerCase().includes(normalizedFeedSearch))
  const filteredNews = news.filter((item) => `${item.title ?? ""} ${stripHtml(item.content)}`.toLowerCase().includes(normalizedFeedSearch))
  const filteredEvents = events.filter((item) => `${item.title ?? ""} ${item.location ?? ""}`.toLowerCase().includes(normalizedFeedSearch))

  const activeFeedTitle =
    activeFeed === "notices" ? "Latest Notices" : activeFeed === "news" ? "Latest News" : "Upcoming Events"
  const displayQuickInfoItems = quickInfoItems.length > 0 ? quickInfoItems : [...fallbackQuickInfoItems]
  const displayLeadershipCards = leadershipCardItems.length > 0
    ? leadershipCardItems
    : [
        {
          id: "leadership-president",
          role_slug: "president",
          role_title: "President",
          leader_name: leadership.president?.full_name_en ?? "President",
          leader_photo_url: leadership.president?.profile_photo ?? null,
          leader_message: "Building character, excellence, and a future-ready school culture.",
          subtitle: "Building character, excellence, and a future-ready school culture.",
          display_order: 1,
          staff: leadership.president,
        },
        {
          id: "leadership-ceo",
          role_slug: "chief-education-officer",
          role_title: "Chief Education Officer",
          leader_name: leadership.chief_education_officer?.full_name_en ?? "Chief Education Officer",
          leader_photo_url: leadership.chief_education_officer?.profile_photo ?? null,
          leader_message: "Academic quality, innovation, and continuous development for every learner.",
          subtitle: "Academic quality, innovation, and continuous development for every learner.",
          display_order: 2,
          staff: leadership.chief_education_officer,
        },
        {
          id: "leadership-headmaster",
          role_slug: "headmaster",
          role_title: "Headmaster",
          leader_name: leadership.headmaster?.full_name_en ?? "Headmaster",
          leader_photo_url: leadership.headmaster?.profile_photo ?? null,
          leader_message: "Nurturing discipline, curiosity, and all-round growth in daily school life.",
          subtitle: "Nurturing discipline, curiosity, and all-round growth in daily school life.",
          display_order: 3,
          staff: leadership.headmaster,
        },
      ]

  const displayExtracurriculars = extracurriculars.length > 0
    ? extracurriculars
    : [
        { id: "1", name: "Scouts", slug: "scouts", description: "Leadership & Adventure", icon_key: "compass", logo_url: null, display_order: 1 },
        { id: "2", name: "Red Crescent", slug: "red-crescent", description: "First Aid & Service", icon_key: "heart", logo_url: null, display_order: 2 },
        { id: "3", name: "Football Club", slug: "football-club", description: "Athleticism & Teamwork", icon_key: "trophy", logo_url: null, display_order: 3 },
        { id: "4", name: "Cricket Club", slug: "cricket-club", description: "Precision & Discipline", icon_key: "award", logo_url: null, display_order: 4 },
        { id: "5", name: "Debate Club", slug: "debate-club", description: "Public Speaking & Logic", icon_key: "message-square", logo_url: null, display_order: 5 },
        { id: "6", name: "English Club", slug: "english-club", description: "Language & Literature", icon_key: "languages", logo_url: null, display_order: 6 },
      ]

  const photoCardClasses = [
    "md:col-span-2 md:row-span-2", // 0: Tree Plantation (2x2)
    "md:col-span-1 md:row-span-1", // 1: Teachers Panel (1x1)
    "md:col-span-1 md:row-span-2", // 2: Students Creativity (1x2)
    "md:col-span-1 md:row-span-1", // 3: Award Ceremony (1x1)
    "md:col-span-1 md:row-span-1", // 4: Victory Day (1x1)
    "md:col-span-2 md:row-span-2", // 5: Campus Moment (2x2)
    "md:col-span-1 md:row-span-1", // 6: New Photo 1 (1x1)
    "md:col-span-1 md:row-span-1", // 7: New Photo 2 (1x1)
    "md:col-span-1 md:row-span-1", // 8: New Photo 3 (1x1)
  ] as const

  const photoGalleryItems = photos.length > 0
    ? photos
        .filter((item) => Boolean(item.image_url))
        .slice(0, 9)
        .map((item, index) => ({
          id: item.id,
          title: item.title || "Campus Moment",
          date: formatDateLabel(item.photo_date || item.created_at),
          image: item.image_url || "",
          alt: item.title || "School photo",
          className: photoCardClasses[index % photoCardClasses.length],
        }))
    : fallbackPhotoGalleryItems

  const selectedPhoto = photoGalleryItems.find((item) => item.id === selectedPhotoId) ?? null

  function formatDateLabel(value: string | null) {
    if (!value) return "No date"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat("en-BD", { day: "2-digit", month: "short", year: "numeric" }).format(date)
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO SLIDER SECTION - CINEMATIC MOTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <section className="relative overflow-hidden bg-emerald-950 select-none [contain:strict] isolate w-full">
        <div className="relative h-[440px] sm:h-[540px] md:h-[650px] lg:h-[760px] w-full overflow-hidden [contain:strict]">
          {/* Background Slides (All preloaded and animated with continuous Ken Burns zoom) */}
          <div className="absolute inset-0 w-full h-full overflow-hidden [contain:strict]">
            {activeHeroSlides.map((slide, index) => {
              const isActive = safeCurrentSlide === index
              return (
                <div
                  key={`hero-slide-${index}`}
                  className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-1000 ease-out ${
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <div
                    className={`absolute inset-0 w-full h-full transition-transform duration-[6500ms] ease-out will-change-transform ${
                      isActive ? "scale-105" : "scale-100"
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={true}
                      quality={85}
                      placeholder="blur"
                      blurDataURL={generateBlurPlaceholder("rgba(15,23,42,0.5)")}
                      sizes="100vw"
                      className="object-cover pointer-events-none"
                    />
                  </div>

                  {/* Clean Standard Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 pointer-events-none" />
                </div>
              )
            })}
          </div>

          {/* Foreground Hero Content with Staggered Framer Motion Animation */}
          <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden pointer-events-none [contain:strict]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`hero-text-${safeCurrentSlide}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mx-auto max-w-4xl text-center text-white"
                >
                  {/* Glowing Top Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-lg sm:text-sm"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                    <span>Excellence in Education & Character Building</span>
                  </motion.div>

                  {/* Main Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.7 }}
                    className={`${welcomeFont.className} text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-md`}
                  >
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                      {instituteName}
                    </span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38, duration: 0.6 }}
                    className="mx-auto mt-4 max-w-2xl text-sm font-normal text-slate-200 sm:text-base md:text-lg drop-shadow"
                  >
                    Fostering critical thinking, moral integrity, and lifelong learning for future global leaders.
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
                  >
                    <Link
                      href="/admission"
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-950/50 transition-all hover:bg-emerald-500 hover:scale-105 active:scale-95"
                    >
                      <span>Apply for Admission</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md shadow-lg transition-all hover:bg-white/25 hover:scale-105 active:scale-95"
                    >
                      <span>Explore Institute</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Left & Right Navigation Arrows */}
          {activeHeroSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 sm:left-6 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-[#022c22]/60 text-white backdrop-blur-md transition-all hover:bg-emerald-600 hover:border-emerald-500 hover:scale-110 active:scale-95 focus:outline-none shadow-lg"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 sm:right-6 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-[#022c22]/60 text-white backdrop-blur-md transition-all hover:bg-emerald-600 hover:border-emerald-500 hover:scale-110 active:scale-95 focus:outline-none shadow-lg"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </>
          )}

          {/* Dot Navigation & Progress Indicators */}
          {activeHeroSlides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
              {activeHeroSlides.map((slide, index) => (
                <button
                  key={`${slide.alt}-dot-${index}`}
                  onClick={() => setCurrentSlide(index)}
                  className="group relative py-2 focus:outline-none"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      safeCurrentSlide === index
                        ? "w-8 sm:w-10 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                        : "w-2.5 bg-white/45 hover:bg-white/75"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* QUICK INFO BAR */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#006a4e] py-3 text-white md:py-6">
        <div className="absolute inset-0 hidden opacity-10 md:block pointer-events-none">
          <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-white blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-6 lg:gap-10">
            {displayQuickInfoItems.map((item, index) => {
              const iconKey = item.icon_key.toLowerCase()
              const Icon = iconKey === "book-open" ? BookOpen : iconKey === "award" ? Award : iconKey === "calendar" ? Calendar : iconKey === "heart" ? Heart : iconKey === "users" ? Users : iconKey === "zap" ? Zap : Sparkles

              const content = (
                <>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm md:h-12 md:w-12">
                    <Icon className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-200 group-hover:scale-110 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold md:text-base lg:text-lg">{item.title}</div>
                    <div className="text-xs text-white/80 md:text-sm">{item.subtitle}</div>
                  </div>
                </>
              )

              return (
                <Fragment key={item.id}>
                  {item.link_url ? (
                    <Link
                      href={item.link_url}
                      className="group flex cursor-pointer items-center gap-2 md:gap-3 transition-opacity hover:opacity-90"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="group flex cursor-pointer items-center gap-2 md:gap-3">
                      {content}
                    </div>
                  )}
                  {index < displayQuickInfoItems.length - 1 && (
                    <div className="hidden h-10 w-px bg-white/30 md:block md:h-12" aria-hidden="true" />
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* NOTICES & SERVICES SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-white py-8 md:py-16">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="rounded-2xl border border-emerald-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div role="tablist" className="flex flex-wrap gap-2 border-b border-emerald-100 px-4 pt-4">
                {[
                  { key: "notices" as const, label: "Notice" },
                  { key: "news" as const, label: "News" },
                  { key: "events" as const, label: "Events" },
                ].map((tab) => {
                  const isActive = activeFeed === tab.key
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      onClick={() => setActiveFeed(tab.key)}
                      className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors ${
                        isActive ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                      aria-selected={isActive}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              <div className="px-4 py-5">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-bold text-emerald-900">{activeFeedTitle}</h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={feedSearch}
                      onChange={(event) => setFeedSearch(event.target.value)}
                      placeholder="Search..."
                      className="w-full rounded-lg border border-emerald-200 bg-slate-50/50 px-3 py-2 pr-9 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 md:w-56"
                    />
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-emerald-600" />
                  </div>
                </div>

                <div className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
                  {activeFeed === "notices" && (
                    filteredNotices.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-sm text-slate-500">
                        No notices found.
                      </div>
                    ) : (
                      filteredNotices.slice(0, 6).map((item) => {
                        const dateStr = item.published_at || item.created_at
                        return (
                          <Link
                            key={item.id}
                            href={`/notices/${item.id}`}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 transition-all hover:bg-emerald-50/60 hover:border-emerald-100"
                          >
                            <Play className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-emerald-950">{item.title || "Untitled notice"}</p>
                              <p className="mt-1 text-xs font-medium text-slate-500">
                                {dateStr ? new Date(dateStr).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "2-digit" }) : "No date"}
                              </p>
                            </div>
                          </Link>
                        )
                      })
                    )
                  )}

                  {activeFeed === "news" && (
                    filteredNews.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-sm text-slate-500">
                        No news found.
                      </div>
                    ) : (
                      filteredNews.slice(0, 6).map((item) => {
                        const dateStr = item.published_at || item.created_at
                        return (
                          <Link
                            key={item.id}
                            href={`/news/${item.id}`}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 transition-all hover:bg-emerald-50/60 hover:border-emerald-100"
                          >
                            <Newspaper className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-emerald-950">{item.title || "Untitled news"}</p>
                              <p className="mt-1 text-xs font-medium text-slate-500">
                                {dateStr ? new Date(dateStr).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "2-digit" }) : "No date"}
                              </p>
                            </div>
                          </Link>
                        )
                      })
                    )
                  )}

                  {activeFeed === "events" && (
                    filteredEvents.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-sm text-slate-500">
                        No events found.
                      </div>
                    ) : (
                      filteredEvents.slice(0, 6).map((item) => {
                        const dateStr = item.event_date
                        return (
                          <Link
                            key={item.id}
                            href={`/events/${item.id}`}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 transition-all hover:bg-emerald-50/60 hover:border-emerald-100"
                          >
                            <Calendar className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-emerald-950">{item.title || "Untitled event"}</p>
                              <p className="mt-1 text-xs font-medium text-slate-500">
                                {dateStr ? new Date(dateStr).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "2-digit" }) : "No date"}
                                {item.location ? ` - ${item.location}` : ""}
                              </p>
                            </div>
                          </Link>
                        )
                      })
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-100/50 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-emerald-900 md:text-2xl">Student Services</h2>
                <p className="mt-1 text-sm text-emerald-700">Quick access to important actions and resources.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    href: "/admission",
                    title: "Apply Now",
                    desc: "Admission application and info sheet.",
                    icon: FileText,
                    iconClass: "bg-orange-100 text-orange-600",
                  },
                  {
                    href: "/teacher/login",
                    title: "Portal Access",
                    desc: "Open dashboard, notices, and updates.",
                    icon: GraduationCap,
                    iconClass: "bg-green-100 text-green-600",
                  },
                  {
                    href: "/admission",
                    title: "Scholarships",
                    desc: "Explore merit and need-based support.",
                    icon: Heart,
                    iconClass: "bg-purple-100 text-purple-600",
                  },
                  {
                    href: "/results",
                    title: "Results & Reports",
                    desc: "Latest results, reports, and analytics.",
                    icon: BarChart3,
                    iconClass: "bg-red-100 text-red-600",
                  },
                ].map((service) => {
                  const Icon = service.icon
                  return (
                    <Link
                      key={service.title}
                      href={service.href}
                      className="group rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] hover:border-emerald-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${service.iconClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-emerald-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                      <h4 className="mt-4 font-semibold text-emerald-950">{service.title}</h4>
                      <p className="mt-1 text-sm text-slate-600">{service.desc}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FACULTY SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-50 px-4 py-10 md:px-10 md:py-24">

          <div className="container relative z-10 mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Leadership & Faculty
              </span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">Meet Our Esteemed Leaders and Educators</h2>
              <div className="mx-auto mt-4 h-1 w-24 bg-emerald-600 rounded-full" />
              <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                Our dedicated faculty members bring years of experience and passion for teaching,
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
              {displayLeadershipCards.map((card) => {
                const person = card.staff
                const leaderName = card.leader_name || person?.full_name_en || card.role_title
                const leaderPhoto = card.leader_photo_url || person?.profile_photo || "/avatar.png"
                const leaderDesignation = person?.designation || card.role_title
                return (
                <Link
                  key={card.role_slug}
                  href={`/leadership/${card.role_slug}`}
                  className="group rounded-2xl border-2 border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.08)] transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)]"
                >
                  <div className="rounded-2xl bg-white p-1 shadow-sm">
                    <Image
                      src={leaderPhoto}
                      alt={leaderName}
                      width={320}
                      height={320}
                      quality={75}
                      priority={false}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={generateBlurPlaceholder("rgba(200,200,200,0.3)")}
                      className="aspect-square w-full rounded-xl object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="mt-5 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">{leaderName}</h3>
                    <p className="mt-1 text-sm font-medium text-emerald-600">{leaderDesignation}</p>
                  </div>
                </Link>
                )
              })}

              <Link
                href="/teachers"
                className="group flex min-h-[320px] flex-col items-center justify-center rounded-2xl bg-[#006a4e] p-6 text-center text-white shadow-[0_20px_50px_-30px_rgba(16,185,129,0.5)] transition-all duration-300 hover:shadow-[0_24px_60px_-20px_rgba(16,185,129,0.65)] hover:-translate-y-1"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">View All Faculty</h3>
                <p className="mt-2 text-sm text-white/80">Complete Faculty Directory</p>
                <span className="mt-4 h-1 w-12 rounded-full bg-white/60" />
              </Link>
            </div>
          </div>
        </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PROGRAMS/DEPARTMENTS SECTION (Disabled for now) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 
      <section className="bg-white px-4 py-10 md:px-10 md:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              Academics
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">Academic Programs</h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-emerald-600 rounded-full" />
            <p className="mt-4 text-lg text-slate-600">Comprehensive curriculum designed for excellence</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(academicPrograms.length > 0 ? academicPrograms : [
              { id: "2", program_name: "Arts", program_slug: "arts", description: "Literature, History, Philosophy, Languages", icon_key: "graduation-cap", link_url: "#", display_order: 2 },
              { id: "3", program_name: "Commerce", program_slug: "commerce", description: "Accounting, Economics, Business Studies", icon_key: "bar-chart-3", link_url: "#", display_order: 3 },
              { id: "4", program_name: "Computer Science", program_slug: "computer-science", description: "Programming, Web Development, AI", icon_key: "zap", link_url: "#", display_order: 4 },
              { id: "5", program_name: "Sports", program_slug: "sports", description: "Cricket, Football, Athletics, Indoor Games", icon_key: "award", link_url: "#", display_order: 5 },
              { id: "6", program_name: "Extracurriculars", program_slug: "extracurriculars", description: "Music, Arts, Tech Club, Debate", icon_key: "sparkles", link_url: "#", display_order: 6 },
            ]).map((program) => {
              const IconMap: Record<string, typeof BookOpen> = {
                'book-open': BookOpen,
                'graduation-cap': GraduationCap,
                'bar-chart-3': BarChart3,
                'zap': Zap,
                'award': Award,
                'sparkles': Sparkles,
                'users': Users,
              }
              const Icon = IconMap[program.icon_key] || BookOpen

              return (
                <div key={program.id} className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm hover:shadow-lg transition">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-emerald-100 p-3 flex-shrink-0">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{program.program_name}</h3>
                      <p className="text-sm text-slate-600 mb-3">{program.description}</p>
                      <Link href={program.link_url || "#"} className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Learn More →</Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      */}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EXTRACURRICULARS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-50 px-6 py-16 md:px-10 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-100/50 blur-3xl animate-pulse" />
          <div className="absolute left-10 bottom-0 h-64 w-64 rounded-full bg-teal-100/40 blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-12 text-center"
          >
            <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm">
              Co-Curricular Activities
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">Extracurriculars</h2>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-emerald-600" />
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Nurturing talents, leadership skills, and teamwork through our diverse clubs and programs.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {displayExtracurriculars.map((club, index) => {
              const IconMap: Record<string, any> = {
                "compass": Compass,
                "heart": Heart,
                "trophy": Trophy,
                "award": Award,
                "message-square": MessageSquare,
                "languages": Languages,
                "sparkles": Sparkles,
              }
              const Icon = IconMap[club.icon_key] || Sparkles
              return (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 28, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.07,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.2, ease: "easeOut" } }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex flex-col items-center text-center p-5 bg-white/90 backdrop-blur-sm border border-slate-200/70 rounded-3xl shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/10 cursor-default"
                >
                  <div className="relative mb-4">
                    {club.logo_url ? (
                      <div className="relative aspect-square w-24 mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-md">
                        <Image
                          src={club.logo_url}
                          alt={club.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 shadow-sm transition-all duration-300 group-hover:border-emerald-500/30 group-hover:bg-emerald-50/50 group-hover:text-emerald-600 group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-md">
                        {club.slug === "red-crescent" ? (
                          <svg className="h-12 w-12 text-red-500 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.54 0 3.01-.35 4.33-1-2.92-1.2-5-4.06-5-7.4 0-3.34 2.08-6.2 5-7.4C15.01 2.35 13.54 2 12 2z" />
                          </svg>
                        ) : Icon ? (
                          <Icon className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" />
                        ) : (
                          <Sparkles className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="mt-2 font-bold text-slate-800 text-sm md:text-base group-hover:text-emerald-700 transition-colors duration-200">
                    {club.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-[140px] leading-tight">
                    {club.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* UPCOMING EVENTS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {events.length > 0 && (
        <section className="bg-white px-4 py-10 md:px-10 md:py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-teal-600 font-semibold">Events</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Upcoming Events</h2>
              </div>
              <Link href="/events" className="hidden text-sm font-semibold text-teal-600 md:flex">
                View All Events →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {events.slice(0, 4).map((ev) => (
                <Link
                  key={ev.id}
                  href={`/events/${ev.id}`}
                  className="group rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-green-50 p-6 shadow-sm transition hover:shadow-lg hover:border-teal-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-teal-100 p-3 flex-shrink-0">
                      <Calendar className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-teal-700">{ev.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {ev.event_date ? new Date(ev.event_date).toLocaleDateString() : 'TBD'}
                        {ev.location ? ` • ${ev.location}` : ''}
                      </p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 text-teal-300 group-hover:text-teal-600 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* STATS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* STATS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <section className="relative overflow-hidden bg-slate-950 px-4 py-12 text-white md:px-10 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-cyan-500/12 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-600/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.06)_0%,transparent_35%,rgba(6,182,212,0.06)_68%,transparent_100%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
              Our Impact
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Numbers That Reflect Our Growth</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {(homeStats.length > 0 ? homeStats : statsCards).map((stat, index) => {
              // Handle both admin-fetched stats and fallback hardcoded stats
              const isAdminStat = 'stat_value' in stat
              const label = isAdminStat ? stat.stat_label : stat.label
              const value = isAdminStat ? stat.stat_value : stat.value
              const suffix = isAdminStat ? stat.stat_suffix : stat.suffix
              const iconKey = isAdminStat ? stat.icon_key : (stat as typeof statsCards[0]).icon_key
              const colorScheme = isAdminStat ? stat.color_scheme : (stat as typeof statsCards[0]).color_scheme

              // Map icon_key to icon component
              const IconMap: Record<string, typeof Users> = {
                'users': Users,
                'graduation-cap': GraduationCap,
                'award': Award,
                'sparkles': Sparkles,
                'book-open': BookOpen,
                'bar-chart-3': BarChart3,
                'zap': Zap,
              }
              const Icon = IconMap[iconKey] || Users

              // Map color scheme to classes
              const colorClassMap: Record<string, { iconClass: string; glowClass: string; borderHover: string }> = {
                'emerald': {
                  iconClass: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30 group-hover:bg-emerald-500/25 group-hover:text-emerald-300",
                  glowClass: "from-emerald-500/20 to-transparent",
                  borderHover: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
                },
                'cyan': {
                  iconClass: "bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30 group-hover:bg-cyan-500/25 group-hover:text-cyan-300",
                  glowClass: "from-cyan-500/20 to-transparent",
                  borderHover: "hover:border-cyan-500/40 hover:shadow-cyan-500/10",
                },
                'amber': {
                  iconClass: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30 group-hover:bg-amber-500/25 group-hover:text-amber-300",
                  glowClass: "from-amber-500/20 to-transparent",
                  borderHover: "hover:border-amber-500/40 hover:shadow-amber-500/10",
                },
                'rose': {
                  iconClass: "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30 group-hover:bg-rose-500/25 group-hover:text-rose-300",
                  glowClass: "from-rose-500/20 to-transparent",
                  borderHover: "hover:border-rose-500/40 hover:shadow-rose-500/10",
                },
              }
              const { iconClass, glowClass, borderHover } = colorClassMap[colorScheme] || colorClassMap['emerald']

              return (
                <div
                  key={`${label}-${index}`}
                  className={`group relative flex flex-col items-center justify-center text-center overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8 backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${borderHover}`}
                >
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${glowClass} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass} transition-all duration-300 group-hover:scale-110 md:h-14 md:w-14`}>
                      <Icon className="h-6 w-6 md:h-7 md:w-7" />
                    </div>

                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-black tracking-tight text-white md:text-5xl">
                        <AnimatedStatCounter value={value} suffix={suffix} delay={index * 100} />
                      </span>
                    </div>

                    <h3 className="mt-3 text-sm font-semibold tracking-wide text-slate-300 group-hover:text-white transition-colors md:text-base">
                      {label}
                    </h3>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PHOTO GALLERY SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 px-4 py-10 md:px-10 md:py-20">

        <div className="container relative z-10 mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              Photo Gallery
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">Campus Life in Moments</h2>
            <div className="mx-auto mt-4 h-1 w-24 bg-emerald-600 rounded-full" />
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              A quick visual tour of academics, culture, events, and student achievements.
            </p>
          </div>

          <div className="grid auto-rows-[210px] grid-cols-1 gap-4 md:auto-flow-dense md:grid-cols-4 md:auto-rows-[190px] lg:auto-rows-[220px]">
            {photoGalleryItems.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhotoId(photo.id)}
                className={`group relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_24px_50px_-35px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_32px_70px_-40px_rgba(16,185,129,0.4)] ${photo.className}`}
                aria-label={`Open ${photo.title}`}
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  fill
                  priority={index < 2}
                  quality={70}
                  loading={index < 2 ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL={generateBlurPlaceholder("rgba(150,160,170,0.4)")}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 via-slate-900/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                  <h3 className="text-base font-semibold text-white">{photo.title}</h3>
                  <p className="mt-1 inline-flex rounded-full bg-emerald-500/35 px-2.5 py-1 text-xs font-medium tracking-wide text-white ring-1 ring-emerald-200/60">{photo.date}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhotoId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhotoId(null)}
              className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/70 text-white transition hover:bg-slate-950"
              aria-label="Close gallery popup"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[16/10] w-full bg-slate-950">
              <Image
                src={selectedPhoto.image}
                alt={selectedPhoto.alt}
                fill
                quality={85}
                priority
                placeholder="blur"
                blurDataURL={generateBlurPlaceholder("rgba(15,23,42,0.8)")}
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="border-t border-slate-200 bg-white px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">{selectedPhoto.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{selectedPhoto.date}</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
    </>
  )
}

