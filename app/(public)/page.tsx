'use client'

import Link from "next/link"
import Image from "next/image"
import { generateBlurPlaceholder } from "@/lib/image-optimizer"
import { Fragment, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatedStatCounter } from "@/components/ui/AnimatedStatCounter"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users, BookOpen, Award, Calendar, Heart,
  ChevronLeft, ChevronRight, Zap,
  GraduationCap, BarChart3, Sparkles, Newspaper, Search, ArrowUpRight, ArrowRight, FileText, Play, X,
  Compass, Trophy, MessageSquare, Languages, Quote, UserCheck, Eye, Maximize2, Camera,
} from "lucide-react"

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
  image_url?: string | null
  featured_image?: string | null
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
    instituteNameBn?: string
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
    label: "শিক্ষার্থী সংখ্যা",
    description: "নিয়মিত অধ্যয়নরত প্রাণবন্ত শিক্ষার্থী",
    icon: Users,
    icon_key: "users",
    color_scheme: "emerald",
  },
  {
    value: 200,
    suffix: "+",
    label: "যোগ্য শিক্ষকমণ্ডলী",
    description: "অভিজ্ঞ ও নিবেদিতপ্রাণ ওলামা ও শিক্ষকবৃন্দ",
    icon: GraduationCap,
    icon_key: "graduation-cap",
    color_scheme: "gold",
  },
  {
    value: 98,
    suffix: "%",
    label: "পরীক্ষায় সাফল্যের হার",
    description: "বোর্ড ও মাদ্রাসার সমাপনী পরীক্ষায় ধারাবাহিক সাফল্য",
    icon: Award,
    icon_key: "award",
    color_scheme: "gold",
  },
  {
    value: 50,
    suffix: "+",
    label: "বছরের ঐতিহ্য ও গৌরব",
    description: "দীর্ঘ অর্ধশতাব্দীর নিরবচ্ছিন্ন দ্বীনি খেদমত",
    icon: Sparkles,
    icon_key: "sparkles",
    color_scheme: "emerald",
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
    title: "বার্ষিক হিফজ সমাপনী ও দস্তারবন্দী সম্মেলন",
    date: "১৮ মার্চ, ২০২৬",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1400&q=80",
    alt: "বার্ষিক হিফজ সমাপনী সম্মেলন",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "gallery-2",
    title: "শিক্ষার্থীদের বার্ষিক ক্রীড়া ও শরীরচর্চা উৎসব",
    date: "২৪ ফেব্রুয়ারি, ২০২৬",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1400&q=80",
    alt: "বার্ষিক ক্রীড়া প্রতিযোগিতা",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "gallery-3",
    title: "ইসলামিক ক্যালিগ্রাফি ও সাংস্কৃতিক প্রদর্শনী",
    date: "৩০ জানুয়ারি, ২০২৬",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&q=80",
    alt: "ক্যালিগ্রাফি প্রদর্শনী",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: "gallery-4",
    title: "আধুনিক কম্পিউটার ল্যাব ও আইসিটি প্রশিক্ষণ",
    date: "০২ এপ্রিল, ২০২৬",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1400&q=80",
    alt: "কম্পিউটার ল্যাব কার্যক্রম",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "gallery-5",
    title: "মাদ্রাসার কেন্দ্রীয় পাঠাগার ও গবেষণা কার্যক্রম",
    date: "১০ মার্চ, ২০২৬",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&q=80",
    alt: "মাদ্রাসা পাঠাগার",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "gallery-6",
    title: "সবুজ ক্যাম্পাস ও পরিবেশবান্ধব বৃক্ষরোপণ উৎসব",
    date: "০৫ মার্চ, ২০২৬",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80",
    alt: "ক্যাম্পাস বৃক্ষরোপণ",
    className: "md:col-span-2 md:row-span-1",
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

function IslamicPatternBackground({ opacity = 0.08, color = "#075E54" }: { opacity?: number; color?: string }) {
  const safeId = color.replace('#', '')
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`islamic-geom-${safeId}`} width="72" height="72" patternUnits="userSpaceOnUse">
            {/* Islamic 8-Pointed Star Lattice (Girih) */}
            <path
              d="M36,6 L43,21 L59,14 L52,30 L68,36 L52,42 L59,58 L43,51 L36,66 L29,51 L13,58 L20,42 L4,36 L20,30 L13,14 L29,21 Z"
              fill="none"
              stroke={color}
              strokeWidth="1.2"
            />
            {/* Inner Star & Islamic Medallion */}
            <circle cx="36" cy="36" r="14" fill="none" stroke="#B68A18" strokeWidth="0.9" />
            <circle cx="36" cy="36" r="5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="0.8" />
            {/* Interlocking corner connections */}
            <path d="M0,0 L12,12 M72,0 L60,12 M0,72 L12,60 M72,72 L60,60" stroke={color} strokeWidth="1" />
            <circle cx="0" cy="0" r="9" fill="none" stroke="#B68A18" strokeWidth="0.8" />
            <circle cx="72" cy="0" r="9" fill="none" stroke="#B68A18" strokeWidth="0.8" />
            <circle cx="0" cy="72" r="9" fill="none" stroke="#B68A18" strokeWidth="0.8" />
            <circle cx="72" cy="72" r="9" fill="none" stroke="#B68A18" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#islamic-geom-${safeId})`} />
      </svg>
    </div>
  )
}

function IslamicCornerOrnament({ position = "top-right", className = "w-40 h-40 sm:w-56 sm:h-56" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; className?: string }) {
  const posMap = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
    "bottom-left": "bottom-0 left-0 -rotate-90",
  }

  return (
    <div className={`absolute ${posMap[position]} pointer-events-none select-none z-0 opacity-20 sm:opacity-25 text-[#075E54] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
        <path d="M0,0 Q130,25 190,190" stroke="#075E54" strokeWidth="1.5" />
        <path d="M0,0 Q105,18 155,155" stroke="#B68A18" strokeWidth="1.2" />
        <path d="M0,0 Q80,12 120,120" stroke="#075E54" strokeWidth="1.2" strokeDasharray="4 3" />
        <path d="M0,0 Q55,8 85,85" stroke="#B68A18" strokeWidth="1" />
        <circle cx="85" cy="85" r="7" fill="none" stroke="#B68A18" strokeWidth="1" />
        <circle cx="155" cy="155" r="5" fill="#075E54" fillOpacity="0.3" stroke="#075E54" strokeWidth="1" />
        <path d="M40,0 C65,40 40,65 0,40" fill="none" stroke="#075E54" strokeWidth="1" />
        <path d="M85,0 C115,50 85,85 0,85" fill="none" stroke="#B68A18" strokeWidth="1" />
      </svg>
    </div>
  )
}

function IslamicSectionDivider({ align = "left" }: { align?: "left" | "center" }) {
  return (
    <div className={`flex items-center gap-2 ${align === "center" ? "justify-center" : "justify-start"} py-1 select-none pointer-events-none`}>
      <div className="h-[2px] w-8 sm:w-14 bg-gradient-to-r from-transparent via-[#075E54] to-[#B68A18]" />
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rotate-45 bg-[#075E54]" />
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#B68A18] fill-current">
          <path d="M12 2l2.4 5.2 5.6.8-4 4 1 5.6-5-2.6-5 2.6 1-5.6-4-4 5.6-.8z" />
        </svg>
        <span className="h-1.5 w-1.5 rotate-45 bg-[#075E54]" />
      </div>
      <div className="h-[2px] w-8 sm:w-14 bg-gradient-to-l from-transparent via-[#075E54] to-[#B68A18]" />
    </div>
  )
}

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
  const [instituteName, setInstituteName] = useState("ওয়াসিয়া আহমদিয়া সুন্নিয়া মাদ্রাসা")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
        const apiInstituteName =
          payload.institute_settings?.primary?.instituteNameBn?.trim() ||
          payload.institute_settings?.primary?.instituteName?.trim()
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


  const normalizedFeedSearch = feedSearch.trim().toLowerCase()
  const filteredNotices = notices.filter((item) => (item.title ?? "").toLowerCase().includes(normalizedFeedSearch))
  const filteredNews = news.filter((item) => `${item.title ?? ""} ${stripHtml(item.content)}`.toLowerCase().includes(normalizedFeedSearch))
  const filteredEvents = events.filter((item) => `${item.title ?? ""} ${item.location ?? ""}`.toLowerCase().includes(normalizedFeedSearch))

  const activeFeedTitle =
    activeFeed === "notices" ? "Latest Notices" : activeFeed === "news" ? "Latest News" : "Upcoming Events"
  const presidentCard = leadershipCardItems.find((c) => c.role_slug === "president")
  const presidentPhoto = presidentCard?.leader_photo_url || presidentCard?.staff?.profile_photo || leadership.president?.profile_photo || null
  const presidentName = presidentCard?.leader_name || presidentCard?.staff?.full_name_en || leadership.president?.full_name_en || "সভাপতি, পরিচালনা পর্ষদ"
  const presidentRoleTitle = presidentCard?.role_title || leadership.president?.designation || "সভাপতি, পরিচালনা পর্ষদ"
  const presidentSubtitle = presidentCard?.subtitle || "নৈতিক মূল্যবোধ ও আলোকিত জাতি গঠনের অঙ্গীকার"
  const presidentMessage = presidentCard?.leader_message

  const principalCard = leadershipCardItems.find((c) => c.role_slug === "headmaster" || c.role_slug === "principal")
  const principalPhoto = principalCard?.leader_photo_url || principalCard?.staff?.profile_photo || leadership.headmaster?.profile_photo || null
  const principalName = principalCard?.leader_name || principalCard?.staff?.full_name_en || leadership.headmaster?.full_name_en || "সৈয়দ মুহাম্মদ আবু ছালেহ"
  const principalRoleTitle = principalCard?.role_title || leadership.headmaster?.designation || "অধ্যক্ষ ও সম্পাদক"
  const principalSubtitle = principalCard?.subtitle || "সুশিক্ষিত, আদর্শবান ও খোদাভীরু নাগরিক গড়ার প্রত্যয়"
  const principalMessage = principalCard?.leader_message

  const displayQuickInfoItems = quickInfoItems.length > 0 ? quickInfoItems : [...fallbackQuickInfoItems]
  const displayLeadershipCards = leadershipCardItems.length > 0
    ? leadershipCardItems
    : [
        {
          id: "leadership-president",
          role_slug: "president",
          role_title: "President",
          leader_name: presidentName,
          leader_photo_url: presidentPhoto,
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
          leader_name: principalName,
          leader_photo_url: principalPhoto,
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

  const currentPhotoIndex = photoGalleryItems.findIndex((item) => item.id === selectedPhotoId)
  const selectedPhoto = currentPhotoIndex >= 0 ? photoGalleryItems[currentPhotoIndex] : null

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (photoGalleryItems.length === 0) return
    const prevIdx = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : photoGalleryItems.length - 1
    setSelectedPhotoId(photoGalleryItems[prevIdx].id)
  }

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (photoGalleryItems.length === 0) return
    const nextIdx = currentPhotoIndex < photoGalleryItems.length - 1 ? currentPhotoIndex + 1 : 0
    setSelectedPhotoId(photoGalleryItems[nextIdx].id)
  }

  function formatDateLabel(value: string | null) {
    if (!value) return "তারিখ নেই"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    const bnMonths = [
      "জানুয়ারি",
      "ফেব্রুয়ারি",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগস্ট",
      "সেপ্টেম্বর",
      "অক্টোবর",
      "নভেম্বর",
      "ডিসেম্বর",
    ]
    const toBn = (n: number) => String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d])
    return `${toBn(date.getDate())} ${bnMonths[date.getMonth()]}, ${toBn(date.getFullYear())}`
  }

  useEffect(() => {
    if (!selectedPhotoId) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhotoId(null)
      } else if (event.key === "ArrowLeft") {
        setSelectedPhotoId((prevId) => {
          if (!prevId) return null
          const idx = photoGalleryItems.findIndex((p) => p.id === prevId)
          if (idx <= 0) return photoGalleryItems[photoGalleryItems.length - 1]?.id ?? null
          return photoGalleryItems[idx - 1]?.id ?? null
        })
      } else if (event.key === "ArrowRight") {
        setSelectedPhotoId((prevId) => {
          if (!prevId) return null
          const idx = photoGalleryItems.findIndex((p) => p.id === prevId)
          if (idx >= photoGalleryItems.length - 1) return photoGalleryItems[0]?.id ?? null
          return photoGalleryItems[idx + 1]?.id ?? null
        })
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [selectedPhotoId, photoGalleryItems])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO SLIDER SECTION - CINEMATIC MOTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO SLIDER SECTION - CLASSIC & MODERN MADRASAH */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <section className="relative overflow-hidden bg-[#064A42] select-none [contain:strict] isolate w-full">
        <div className="relative h-[440px] sm:h-[540px] md:h-[620px] lg:h-[700px] w-full overflow-hidden [contain:strict]">
          {/* Background Slides (Ken Burns zoom effect) */}
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
                    className={`absolute inset-0 w-full h-full transition-transform duration-[7000ms] ease-out will-change-transform ${
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
                      blurDataURL={generateBlurPlaceholder("rgba(6,74,66,0.6)")}
                      sizes="100vw"
                      className="object-cover pointer-events-none"
                    />
                  </div>

                  {/* Deep Green Madrasah Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#064A42] via-[#064A42]/75 to-[#064A42]/40 pointer-events-none" />
                </div>
              )
            })}
          </div>

          {/* Foreground Hero Content */}
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
                  {/* Institutional Top Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#B68A18]/50 bg-[#064A42]/85 px-4 py-1.5 text-[13px] sm:text-[14px] font-semibold text-[#E8C86A] backdrop-blur-md shadow-md"
                  >
                    <Sparkles className="h-4 w-4 text-[#B68A18]" />
                    <span>দ্বীনি ও আধুনিক শিক্ষার সমন্বিত প্রতিষ্ঠান</span>
                  </motion.div>

                  {/* Main Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.7 }}
                    className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.25] text-white drop-shadow-md"
                  >
                    {instituteName}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38, duration: 0.6 }}
                    className="mx-auto mt-4 max-w-2xl text-[15px] sm:text-[17px] md:text-[19px] font-normal text-white/95 leading-relaxed drop-shadow"
                  >
                    ইসলামিক ঐতিহ্য, নৈতিক মূল্যবোধ ও সমকালীন আধুনিক শিক্ষার মাধ্যমে আলোকিত জাতি গঠনের অঙ্গীকারবদ্ধ দ্বীনি শিক্ষাপ্রতিষ্ঠান।
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-7 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
                  >
                    <Link
                      href="/admission"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#B68A18] px-7 py-3 text-[16px] font-bold text-white shadow-lg transition-colors hover:bg-[#9E7614]"
                    >
                      <span>ভর্তি আবেদন</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-7 py-3 text-[16px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                    >
                      <span>মাদ্রাসা পরিচিতি</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Navigation Arrows */}
          {activeHeroSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 sm:left-6 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-[#064A42]/70 text-white backdrop-blur-md transition-colors hover:bg-[#075E54] focus:outline-none shadow-lg"
                aria-label="পূর্ববর্তী স্লাইড"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 sm:right-6 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/25 bg-[#064A42]/70 text-white backdrop-blur-md transition-colors hover:bg-[#075E54] focus:outline-none shadow-lg"
                aria-label="পরবর্তী স্লাইড"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </>
          )}

          {/* Dot Navigation Indicators */}
          {activeHeroSlides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
              {activeHeroSlides.map((slide, index) => (
                <button
                  key={`${slide.alt}-dot-${index}`}
                  onClick={() => setCurrentSlide(index)}
                  className="group relative py-2 focus:outline-none"
                  aria-label={`স্লাইড ${index + 1}`}
                >
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      safeCurrentSlide === index
                        ? "w-8 sm:w-10 bg-[#B68A18] shadow-[0_0_10px_rgba(182,138,24,0.7)]"
                        : "w-2.5 bg-white/40 hover:bg-white/70"
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
      <section className="relative bg-[#075E54] border-t border-[#B68A18]/25 py-3.5 text-white md:py-6">
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
      {/* WELCOME SECTION - 2 COLUMN INSTITUTIONAL OVERVIEW */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#F0F7F5] py-12 md:py-20 border-b border-[#E2E7E4]">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Text & Features (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center rounded-full border border-[#075E54]/25 bg-white px-3.5 py-1 text-[13px] font-semibold text-[#075E54] shadow-xs">
                <span>মাদ্রাসার সংক্ষিপ্ত পরিচিতি</span>
              </div>

              <div className="space-y-3">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#17211E] leading-tight">
                  {instituteName}-এ আপনাকে স্বাগতম
                </h2>
                <div className="h-1 w-20 bg-[#B68A18] rounded-full" />
              </div>

              <p className="text-[16px] md:text-[17px] leading-relaxed text-[#5F6B67]">
                ইসলামিক মূল্যবোধ, সুন্নাহর সঠিক দিকনির্দেশনা এবং সমকালীন আধুনিক সাধারণ শিক্ষার এক অনুপম মেলবন্ধন হিসেবে আমাদের মাদ্রাসা যুগোপযোগী শিক্ষা প্রদান করে আসছে। আমাদের মূল লক্ষ্য হল শিক্ষার্থীদের সুনাগরিক, চরিত্রবান ও আদর্শ দ্বীনি ব্যক্তিত্ব হিসেবে গড়ে তোলা।
              </p>

              {/* 4 Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 rounded-xl bg-white p-3.5 border border-[#E2E7E4] shadow-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#17211E]">দ্বীনি ও সাধারণ সমন্বয়</h3>
                    <p className="text-[13px] text-[#5F6B67] mt-0.5">কুরআন-হাদিসের পাশাপাশি আধুনিক পাঠ্যক্রম</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-white p-3.5 border border-[#E2E7E4] shadow-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#17211E]">যোগ্য শিক্ষকমণ্ডলী</h3>
                    <p className="text-[13px] text-[#5F6B67] mt-0.5">অভিজ্ঞ ও নিবেদিতপ্রাণ ওলামা ও শিক্ষকবৃন্দ</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-white p-3.5 border border-[#E2E7E4] shadow-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#17211E]">নৈতিক ও সুশৃঙ্খল পরিবেশ</h3>
                    <p className="text-[13px] text-[#5F6B67] mt-0.5">উত্তম চরিত্র ও ইসলামী তাহযীব গঠন</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-white p-3.5 border border-[#E2E7E4] shadow-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#17211E]">আধুনিক সুযোগ-সুবিধা</h3>
                    <p className="text-[13px] text-[#5F6B67] mt-0.5">ডিজিটাল ল্যাব, সমৃদ্ধ পাঠাগার ও ক্রীড়াঙ্গন</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#075E54] px-6 py-2.5 text-[15px] font-semibold text-white shadow-xs transition-colors hover:bg-[#064A42]"
                >
                  <span>মাদ্রাসা সম্পর্কে বিস্তারিত</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/history"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#075E54]/30 bg-white px-6 py-2.5 text-[15px] font-semibold text-[#075E54] transition-colors hover:bg-[#F0F7F5]"
                >
                  <span>আমাদের ইতিহাস</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Visual & Featured Card (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card */}
                <div className="overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white p-3 shadow-md">
                  <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden rounded-xl bg-[#064A42]">
                    <Image
                      src={activeHeroSlides[0]?.image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80"}
                      alt="মাদ্রাসা ক্যাম্পাস"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#064A42]/85 via-transparent to-transparent" />
                    
                    {/* Badge on Image */}
                    <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-black/40 backdrop-blur-md p-3 border border-white/20 text-white">
                      <p className="text-[13px] font-bold leading-tight">
                        ইলম ও আমলের সমন্বয়ে ভবিষ্যৎ প্রজন্মের আলোকবর্তিকা
                      </p>
                    </div>
                  </div>

                  {/* Hadith / Quote Footer under image */}
                  <div className="mt-3 rounded-xl bg-[#F0F7F5] border border-[#075E54]/15 p-3.5 text-center">
                    <p className="text-[14px] font-medium text-[#075E54] italic">
                      “তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সেই, যে কুরআন শিখে এবং অন্যকে শেখায়।”
                    </p>
                    <span className="text-[12px] font-bold text-[#B68A18] mt-1 block">
                      — সহীহ বুখারী: ৫০২৭
                    </span>
                  </div>
                </div>

                {/* Floating Decorative Gold Badge */}
                <div className="absolute -top-3 -right-2 sm:-right-4 rounded-xl bg-[#064A42] border-2 border-[#B68A18] p-3 text-white shadow-lg hidden sm:flex items-center gap-2.5">
                  <Award className="h-6 w-6 text-[#E8C86A]" />
                  <div>
                    <p className="text-[11px] text-white/80 font-medium leading-none">দ্বীনি শিক্ষার বিশ্বস্ত কেন্দ্র</p>
                    <p className="text-[14px] font-bold text-[#E8C86A] mt-0.5">ঐতিহ্য ও উৎকর্ষ</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PRESIDENT & PRINCIPAL / LEADERSHIP MESSAGE SECTION (COMBINED ONE SECTION) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#F7F9F8] py-14 md:py-20 border-b border-[#E2E7E4] overflow-hidden">
        {/* Subtle Islamic Geometric Pattern Background */}
        <IslamicPatternBackground opacity={0.08} color="#075E54" />
        <IslamicCornerOrnament position="top-right" />
        <IslamicCornerOrnament position="bottom-left" />
        <div className="absolute left-0 top-1/3 -translate-y-1/2 w-80 h-80 rounded-full bg-[#075E54]/5 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-1/3 w-80 h-80 rounded-full bg-[#B68A18]/5 blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 space-y-14 md:space-y-18">
          
          {/* 1. PRESIDENT SUBSECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Portrait & Profile (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="relative w-44 sm:w-52 aspect-[3/4] rounded-2xl border border-[#E2E7E4] bg-white p-1.5 shadow-sm overflow-hidden">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#F0F7F5]">
                  {presidentPhoto ? (
                    <Image
                      src={presidentPhoto}
                      alt={presidentName}
                      fill
                      unoptimized={presidentPhoto.startsWith("http://") || presidentPhoto.startsWith("https://")}
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 30vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#075E54]">
                      <GraduationCap className="h-16 w-16" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E]">
                  {presidentName}
                </h3>
                <p className="text-[15px] text-[#075E54] font-bold">
                  সভাপতি, পরিচালনা পর্ষদ
                </p>
                <p className="text-[13.5px] text-[#5F6B67] font-medium">
                  {instituteName}
                </p>
              </div>
            </div>

            {/* Message & Pillars (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#075E54] border border-[#075E54]/20 shadow-xs">
                  <Quote className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[12px] font-bold text-[#B68A18] uppercase tracking-wider">
                    সভাপতি মহোদয়ের বাণী
                  </span>
                  <h4 className="font-heading text-xl sm:text-2xl font-bold text-[#17211E]">
                    নৈতিক মূল্যবোধ ও আলোকিত জাতি গঠনের অঙ্গীকার
                  </h4>
                </div>
              </div>

              <div className="relative rounded-2xl bg-white p-5 sm:p-7 border border-[#E2E7E4] shadow-xs">
                <p className="text-[15px] sm:text-[16.5px] leading-relaxed text-[#2C3834] font-normal line-clamp-6 sm:line-clamp-none">
                  {presidentMessage
                    ? stripHtml(presidentMessage)
                    : "“সকল প্রশংসা মহান আল্লাহ রাব্বুল আলামিনের জন্য এবং অসংখ্য দরুদ ও সালাম পেশ করছি সর্বশেষ ও সর্বশ্রেষ্ঠ নবি, হজরত মুহাম্মদ (সা.)-এর প্রতি। অত্র প্রতিষ্ঠানের সভাপতির দায়িত্ব গ্রহণ করে এর সার্বিক শৃঙ্খলা ও শিক্ষার পরিবেশ আরও উন্নত করার লক্ষ্যে আমি দৃঢ়প্রতিজ্ঞ। ছাত্র, শিক্ষক, অভিভাবক এবং ম্যানেজিং কমিটির সদস্যবৃন্দসহ আমরা সবাই এক অভিন্ন লক্ষ্যে ঐক্যবদ্ধ— এই প্রতিষ্ঠানকে শ্রেষ্ঠত্বের মর্যাদায় অভিষিক্ত করতে আমাদের নিরলস প্রচেষ্টা অব্যাহত রয়েছে।”"}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/leadership/president"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#075E54] px-6 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-[#064A42] shadow-xs"
                >
                  <span>সম্পূর্ণ বক্তব্য পড়ুন</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/governing-body"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#075E54]/30 bg-white px-6 py-2.5 text-[14px] font-semibold text-[#075E54] transition-colors hover:bg-[#F0F7F5]"
                >
                  <span>পরিচালনা পর্ষদের তালিকা</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. PRINCIPAL / HEADMASTER SUBSECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Portrait & Profile (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="relative w-44 sm:w-52 aspect-[3/4] rounded-2xl border border-[#E2E7E4] bg-white p-1.5 shadow-sm overflow-hidden">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#F0F7F5]">
                  {principalPhoto ? (
                    <Image
                      src={principalPhoto}
                      alt={principalName}
                      fill
                      unoptimized={principalPhoto.startsWith("http://") || principalPhoto.startsWith("https://")}
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 30vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#075E54]">
                      <GraduationCap className="h-16 w-16" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#17211E]">
                  {principalName}
                </h3>
                <p className="text-[15px] text-[#075E54] font-bold">
                  অধ্যক্ষ ও সম্পাদক
                </p>
                <p className="text-[13.5px] text-[#5F6B67] font-medium">
                  {instituteName}
                </p>
              </div>
            </div>

            {/* Message & Pillars (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F7F5] text-[#075E54] border border-[#075E54]/20">
                  <Quote className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[12px] font-bold text-[#075E54] uppercase tracking-wider">
                    অধ্যক্ষ মহোদয়ের বাণী
                  </span>
                  <h4 className="font-heading text-xl sm:text-2xl font-bold text-[#17211E]">
                    সুশিক্ষিত, আদর্শবান ও খোদাভীরু নাগরিক গড়ার প্রত্যয়
                  </h4>
                </div>
              </div>

              <div className="relative rounded-2xl bg-white p-5 sm:p-7 border border-[#E2E7E4]">
                <p className="text-[15px] sm:text-[16.5px] leading-relaxed text-[#2C3834] font-normal line-clamp-6 sm:line-clamp-none">
                  {principalMessage
                    ? stripHtml(principalMessage)
                    : "“বিসমিল্লাহির রাহমানির রাহীম। আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ। সুশিক্ষিত, আদর্শবান ও খোদাভীরু নাগরিক গড়ে তুলতে মাদ্রাসা শিক্ষা একটি অনন্য মাধ্যম। জাগতিক ও পারলৌকিক উভয় জীবনে সফলতার দ্বারপ্রান্তে উপনীত হতে এই শিক্ষা অগ্রণী ভূমিকা রাখতে সক্ষম। একজন মাদ্রাসা শিক্ষার্থী একাধারে ইলমে দ্বীন অর্জনের সুযোগ লাভ করে, তেমনি আধুনিক সব বিষয়েও জ্ঞান অর্জনের সুযোগ পায়। এই প্রতিষ্ঠানকে একটি মডেল শিক্ষাপ্রতিষ্ঠানে পরিণত করাই আমাদের প্রধান স্বপ্ন ও অঙ্গীকার।”"}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  href={principalCard?.role_slug ? `/leadership/${principalCard.role_slug}` : "/leadership/headmaster"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#075E54] px-6 py-2.5 text-[14px] font-bold text-white transition-all hover:bg-[#064A42] shadow-xs"
                >
                  <span>সম্পূর্ণ বক্তব্য পড়ুন</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/teachers"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#075E54]/30 bg-white px-6 py-2.5 text-[14px] font-semibold text-[#075E54] transition-colors hover:bg-[#F0F7F5]"
                >
                  <span>শিক্ষকমণ্ডলীর তালিকা</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 1. NEW DEDICATED LATEST NOTICES SECTION (AFTER PRINCIPAL) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#F7F9F8] py-14 md:py-20 border-b border-[#E2E7E4]">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
            <div className="space-y-2.5">
              <div className="inline-flex items-center rounded-full border border-[#075E54]/20 bg-white px-3.5 py-1 text-[13px] font-semibold text-[#075E54] shadow-xs">
                <span>জরুরি নোটিশ ও বিজ্ঞপ্তি</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#17211E] leading-tight">
                সর্বশেষ নোটিশ বোর্ড
              </h2>
              <div className="h-1 w-16 bg-[#B68A18] rounded-full" />
            </div>

            <Link
              href="/notices"
              className="inline-flex items-center gap-2 rounded-xl border border-[#075E54]/30 bg-white px-5 py-2.5 text-[14px] font-semibold text-[#075E54] shadow-xs transition-colors hover:bg-[#F0F7F5] self-start md:self-auto"
            >
              <span>সকল নোটিশ দেখুন</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Notice Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(notices.length > 0 ? notices.slice(0, 6) : [
              {
                id: "fallback-notice-1",
                title: "২০২৬-২০২৭ শিক্ষাবর্ষে সকল বিভাগে নতুন শিক্ষার্থী ভর্তি কার্যক্রম শুরু",
                published_at: new Date().toISOString(),
                is_important: true,
              },
              {
                id: "fallback-notice-2",
                title: "পবিত্র মাহে রমজান ও ঈদুল ফিতর উপলক্ষে মাদ্রাসা ছুটির বিজ্ঞপ্তি",
                published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
                is_important: false,
              },
              {
                id: "fallback-notice-3",
                title: "হিফজুল কুরআন সমাপনী ও বার্ষিক পুরস্কার বিতরণী অনুষ্ঠান",
                published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
                is_important: false,
              },
              {
                id: "fallback-notice-4",
                title: "প্রথম সাময়িক পরীক্ষার সময়সূচি ও প্রবেশপত্র বিতরণ সংক্রান্ত বিজ্ঞপ্তি",
                published_at: new Date(Date.now() - 86400000 * 12).toISOString(),
                is_important: true,
              },
              {
                id: "fallback-notice-5",
                title: "অভিভাবক সমাবেশ ও ত্রৈমাসিক ফলাফল প্রকাশ সংক্রান্ত জরুরি নোটিশ",
                published_at: new Date(Date.now() - 86400000 * 18).toISOString(),
                is_important: false,
              },
              {
                id: "fallback-notice-6",
                title: "আন্তর্জাতিক হিফজ ও কিরাত প্রতিযোগিতার বাছাই পর্বের সময়সূচি",
                published_at: new Date(Date.now() - 86400000 * 25).toISOString(),
                is_important: false,
              },
            ]).map((notice) => {
              const dateVal = notice.published_at || (notice as any).created_at
              const parsedDate = dateVal ? new Date(dateVal) : new Date()
              const bnMonths = [
                "জানুয়ারি",
                "ফেব্রুয়ারি",
                "মার্চ",
                "এপ্রিল",
                "মে",
                "জুন",
                "জুলাই",
                "আগস্ট",
                "সেপ্টেম্বর",
                "অক্টোবর",
                "নভেম্বর",
                "ডিসেম্বর",
              ]
              const toBn = (n: number) => String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d])
              const dayBn = toBn(parsedDate.getDate())
              const monthBn = bnMonths[parsedDate.getMonth()]
              const yearBn = toBn(parsedDate.getFullYear())

              return (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-[#E2E7E4] bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-[#075E54]/40 hover:shadow-md"
                >
                  <div>
                    {/* Date & Urgency Row */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#5F6B67]">
                        <Calendar className="h-3.5 w-3.5 text-[#075E54]" />
                        <span>{dayBn} {monthBn}, {yearBn}</span>
                      </div>
                      {((notice as any).is_important || (notice as any).is_pinned) && (
                        <span className="inline-block rounded-full bg-[#B68A18]/15 border border-[#B68A18]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#9E7614]">
                          জরুরি
                        </span>
                      )}
                    </div>

                    {/* Notice Title */}
                    <h3 className="font-heading text-[16px] sm:text-[17px] font-bold text-[#17211E] group-hover:text-[#075E54] transition-colors line-clamp-3 leading-snug">
                      {notice.title || "শিরোনামহীন নোটিশ"}
                    </h3>
                  </div>

                  {/* Read More Footer */}
                  <div className="mt-5 pt-3.5 border-t border-[#E2E7E4] flex items-center justify-between text-[13px] font-semibold text-[#075E54]">
                    <span>বিস্তারিত দেখুন</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* LATEST NEWS & MEDIA SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-white py-14 md:py-20 border-b border-[#E2E7E4]">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
            <div className="space-y-2.5">
              <div className="inline-flex items-center rounded-full border border-[#075E54]/20 bg-[#F0F7F5] px-3.5 py-1 text-[13px] font-semibold text-[#075E54] shadow-xs">
                <span>সংবাদ ও মিডিয়া</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#17211E] leading-tight">
                মাদ্রাসার সাম্প্রতিক সংবাদ ও কার্যক্রম
              </h2>
              <div className="h-1 w-16 bg-[#B68A18] rounded-full" />
            </div>

            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-xl border border-[#075E54]/30 bg-white px-5 py-2.5 text-[14px] font-semibold text-[#075E54] shadow-xs transition-colors hover:bg-[#F0F7F5] self-start md:self-auto"
            >
              <span>সকল সংবাদ দেখুন</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* News Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(news.length > 0 ? news.slice(0, 3) : [
              {
                id: "fallback-news-1",
                title: "মাদ্রাসার বার্ষিক কুরআন তিলাওয়াত ও হিফজ প্রতিযোগিতা ২০২৬ অনুষ্ঠিত",
                content: "অত্যন্ত ভাবগাম্ভীর্য ও উৎসবমুখর পরিবেশে মাদ্রাসার বার্ষিক কিরাত ও হিফজ প্রতিযোগিতা সম্পন্ন হয়েছে। দেশবরেণ্য ওলামায়ে কেরাম ও বিচারকমণ্ডলীর উপস্থিতিতে কৃতি শিক্ষার্থীদের পুরস্কৃত করা হয়।",
                image_url: null,
                published_at: new Date().toISOString(),
              },
              {
                id: "fallback-news-2",
                title: "শিক্ষার্থীদের আধুনিক তথ্যপ্রযুক্তি ও কম্পিউটার ল্যাব প্রশিক্ষণ কর্মশালা",
                content: "দ্বীনি শিক্ষার পাশাপাশি আধুনিক জ্ঞান ও তথ্যপ্রযুক্তিতে দক্ষ করে গড়ে তুলতে শিক্ষার্থীদের জন্য বিশেষ কম্পিউটার প্রশিক্ষণ কর্মশালা উদ্বোধন করা হয়েছে।",
                image_url: null,
                published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
              },
              {
                id: "fallback-news-3",
                title: "পরিবেশ সুরক্ষায় মাদ্রাসার উদ্যোগে বৃক্ষরোপণ কর্মসূচি ও আলোচনা সভা",
                content: "সবুজ ক্যাম্পাস বিনির্মাণ ও পরিবেশ সংরক্ষণে সচেতনতা বৃদ্ধির লক্ষ্যে শিক্ষক ও শিক্ষার্থীদের অংশগ্রহণে দিনব্যাপী ফলদ ও বনজ বৃক্ষরোপণ কর্মসূচি পালিত হয়েছে।",
                image_url: null,
                published_at: new Date(Date.now() - 86400000 * 10).toISOString(),
              },
            ]).map((item) => {
              const dateVal = item.published_at || (item as any).created_at
              const parsedDate = dateVal ? new Date(dateVal) : new Date()
              const bnMonths = [
                "জানুয়ারি",
                "ফেব্রুয়ারি",
                "মার্চ",
                "এপ্রিল",
                "মে",
                "জুন",
                "জুলাই",
                "আগস্ট",
                "সেপ্টেম্বর",
                "অক্টোবর",
                "নভেম্বর",
                "ডিসেম্বর",
              ]
              const toBn = (n: number) => String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d])
              const dayBn = toBn(parsedDate.getDate())
              const monthBn = bnMonths[parsedDate.getMonth()]
              const yearBn = toBn(parsedDate.getFullYear())
              const snippet = stripHtml(item.content)
              const featuredImg = item.image_url || ('featured_image' in item ? (item as any).featured_image : null) || null

              return (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white shadow-xs transition-all duration-200 hover:border-[#075E54]/40 hover:shadow-md"
                >
                  <div>
                    {/* Thumbnail Image or Static Icon Banner */}
                    {featuredImg ? (
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#064A42]">
                        <Image
                          src={featuredImg}
                          alt={item.title || "মাদ্রাসা সংবাদ"}
                          fill
                          unoptimized={featuredImg.startsWith("http://") || featuredImg.startsWith("https://")}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>
                    ) : (
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gradient-to-br from-[#075E54] via-[#064A42] to-[#03342E] flex flex-col items-center justify-center p-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-[#B68A18] shadow-inner backdrop-blur-xs transition-transform duration-300 group-hover:scale-110">
                          <Newspaper className="h-7 w-7" />
                        </div>
                      </div>
                    )}

                    {/* Content Block */}
                    <div className="p-5 sm:p-6 space-y-2.5">
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#5F6B67]">
                        <Calendar className="h-3.5 w-3.5 text-[#075E54]" />
                        <span>{dayBn} {monthBn}, {yearBn}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-heading text-[17px] sm:text-[18px] font-bold text-[#17211E] group-hover:text-[#075E54] transition-colors line-clamp-2 leading-snug">
                        {item.title || "শিরোনামহীন সংবাদ"}
                      </h3>

                      {/* Snippet */}
                      {snippet && (
                        <p className="text-[14px] text-[#5F6B67] line-clamp-2 leading-relaxed">
                          {snippet}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 flex items-center justify-between text-[13px] font-semibold text-[#075E54]">
                    <span>সম্পূর্ণ সংবাদ পড়ুন</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 2. NOTICES, NEWS, EVENTS & STUDENT SERVICES SECTION (Disabled for now) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 
      <section className="relative bg-white py-12 md:py-18 border-b border-[#E2E7E4]">
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
      */}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FACULTY SECTION (Disabled for now) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 
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
      */}

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
      {/* EXTRACURRICULARS SECTION (Disabled for now) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 
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
      */}

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
      {/* STATS & IMPACT SECTION (CLASSIC + MODERN MADRASAH THEME) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#F7F8F5] py-16 md:py-24 border-b border-[#E2E7E4]">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center space-y-3 mb-12 md:mb-16">
            <div className="inline-flex items-center rounded-full border border-[#075E54]/20 bg-white px-4 py-1 text-[13px] font-semibold text-[#075E54] shadow-xs">
              <span>আমাদের গৌরব ও অর্জন</span>
            </div>
            
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#17211E] leading-tight">
              সংখ্যায় আমাদের সাফল্য ও অগ্রযাত্রা
            </h2>
            
            <div className="h-1 w-16 bg-[#B68A18] rounded-full mx-auto" />
            
            <p className="text-[15px] sm:text-[16px] text-[#5F6B67] leading-relaxed">
              দ্বীনি মূল্যবোধ ও সমকালীন আধুনিক শিক্ষার সুসমন্বয়ে দীর্ঘ পথচলায় শিক্ষার্থীদের সাফল্য ও সার্বিক অগ্রগতি
            </p>
          </div>

          {/* 4 Classic + Modern Madrasah Stat Cards (2 in a row on mobile) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {(homeStats.length > 0 ? homeStats : statsCards).map((stat, index) => {
              const isAdminStat = 'stat_value' in stat
              const label = isAdminStat ? stat.stat_label : stat.label
              const value = isAdminStat ? stat.stat_value : stat.value
              const suffix = isAdminStat ? stat.stat_suffix : stat.suffix
              const iconKey = isAdminStat ? stat.icon_key : (stat as typeof statsCards[0]).icon_key

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

              return (
                <div
                  key={`${label}-${index}`}
                  className="group relative flex flex-col items-center justify-center text-center overflow-hidden rounded-2xl border border-[#E2E7E4] bg-white p-4 sm:p-7 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-200 hover:border-[#075E54]/40 hover:shadow-[0_8px_24px_rgba(7,94,84,0.08)]"
                >
                  {/* Top Accent Strip */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#075E54] group-hover:bg-[#B68A18] transition-colors duration-200" />

                  {/* Icon */}
                  <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-[#F0F7F5] border border-[#075E54]/20 text-[#075E54] shadow-2xs mb-3 sm:mb-4 transition-colors duration-200 group-hover:bg-[#075E54] group-hover:text-white">
                    <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                  </div>

                  {/* Number Counter */}
                  <div className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-[#075E54] tracking-tight">
                    <AnimatedStatCounter value={value} suffix={suffix} delay={index * 100} />
                  </div>

                  {/* Title Only */}
                  <h3 className="font-heading text-[14px] sm:text-lg md:text-xl font-bold text-[#17211E] mt-1.5 sm:mt-2.5">
                    {label}
                  </h3>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PHOTO GALLERY SECTION - CLASSIC & MODERN MADRASAH */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#F0F7F5] py-14 md:py-20 border-b border-[#E2E7E4]">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
            <div className="space-y-2.5">
              <div className="inline-flex items-center rounded-full border border-[#075E54]/20 bg-white px-3.5 py-1 text-[13px] font-semibold text-[#075E54] shadow-xs">
                <span>ফটো ও ভিডিও গ্যালারি</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#17211E] leading-tight">
                ক্যাম্পাস জীবনের স্মরণীয় মুহূর্তসমূহ
              </h2>
              <div className="h-1 w-16 bg-[#B68A18] rounded-full" />
              <p className="text-[14px] sm:text-[15px] text-[#5F6B67] max-w-xl leading-relaxed">
                মাদ্রাসার দ্বীনি ও সাধারণ শিক্ষা কার্যক্রম, হিফজ সমাপনী, বার্ষিক ক্রীড়া ও শিক্ষার্থীদের অর্জনের খণ্ডচিত্র
              </p>
            </div>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-xl border border-[#075E54]/30 bg-white px-5 py-2.5 text-[14px] font-semibold text-[#075E54] shadow-xs transition-colors hover:bg-[#F7F9F8] self-start md:self-auto"
            >
              <span>সকল অ্যালবাম দেখুন</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Asymmetric Bento Photo Grid */}
          <div className="grid auto-rows-[220px] sm:auto-rows-[240px] md:auto-rows-[220px] lg:auto-rows-[250px] grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:auto-flow-dense gap-4 sm:gap-5">
            {photoGalleryItems.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedPhotoId(photo.id)}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E2E7E4] bg-[#064A42] shadow-xs transition-all duration-300 hover:border-[#075E54]/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#075E54]/40 text-left ${photo.className}`}
                aria-label={`Open ${photo.title}`}
              >
                {/* Image */}
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  fill
                  priority={index < 2}
                  quality={75}
                  loading={index < 2 ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL={generateBlurPlaceholder("rgba(6,74,66,0.6)")}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Islamic Green Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#064A42]/95 via-[#064A42]/35 to-transparent transition-opacity duration-300 group-hover:from-[#064A42] group-hover:via-[#064A42]/45" />

                {/* Floating Preview Icon on Hover */}
                <div className="absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#B68A18] text-white shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75">
                  <Eye className="h-4 w-4" />
                </div>

                {/* Bottom Photo Metadata */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#B68A18]/25 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-[#E8C86A] border border-[#B68A18]/30 mb-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>{photo.date}</span>
                  </div>
                  <h3 className="font-heading text-[15px] sm:text-[16px] md:text-[17px] font-bold text-white group-hover:text-[#E8C86A] transition-colors line-clamp-2 leading-snug drop-shadow">
                    {photo.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PHOTO LIGHTBOX MODAL (PORTALED TO BODY FOR 100% VIEWPORT CENTER) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {isMounted && selectedPhoto && createPortal(
        <div
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[99999] flex items-center justify-center bg-black/90 p-2 sm:p-4 md:p-6 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-hidden"
          onClick={() => setSelectedPhotoId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
        >
          <div
            className="relative flex flex-col w-full max-w-5xl h-auto max-h-[92vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-[#064A42] border border-[#B68A18]/40 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#075E54] px-4 py-3 sm:px-6 sm:py-3.5 text-white">
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-hidden">
                <span className="inline-flex shrink-0 items-center rounded-full bg-[#B68A18]/20 px-2.5 py-0.5 text-[11px] sm:text-[12px] font-bold text-[#E8C86A] border border-[#B68A18]/30">
                  {selectedPhoto.date}
                </span>
                <span className="text-[12px] text-white/60 hidden sm:inline">•</span>
                <span className="text-[12px] font-medium text-white/80 hidden sm:inline">
                  ছবি {currentPhotoIndex + 1} / {photoGalleryItems.length}
                </span>
                <h3 className="font-heading text-[14px] sm:text-[17px] font-bold text-white truncate ml-1 sm:ml-2">
                  {selectedPhoto.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedPhotoId(null)}
                  className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 hover:text-[#E8C86A] focus:outline-none"
                  aria-label="গ্যালারি পপআপ বন্ধ করুন"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Photo Viewport with Navigation */}
            <div className="relative flex-1 min-h-[260px] sm:min-h-[380px] md:min-h-[460px] max-h-[68vh] w-full bg-black/60 flex items-center justify-center overflow-hidden">
              <Image
                src={selectedPhoto.image}
                alt={selectedPhoto.alt}
                fill
                quality={90}
                priority
                placeholder="blur"
                blurDataURL={generateBlurPlaceholder("rgba(6,74,66,0.8)")}
                sizes="(max-width: 1024px) 100vw, 85vw"
                className="object-contain p-2 sm:p-4"
              />

              {/* Prev Button */}
              {photoGalleryItems.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#064A42]/80 border border-white/20 text-white backdrop-blur-md shadow-lg transition-all hover:bg-[#075E54] hover:scale-105 focus:outline-none"
                  aria-label="পূর্ববর্তী ছবি"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              )}

              {/* Next Button */}
              {photoGalleryItems.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#064A42]/80 border border-white/20 text-white backdrop-blur-md shadow-lg transition-all hover:bg-[#075E54] hover:scale-105 focus:outline-none"
                  aria-label="পরবর্তী ছবি"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2.5 border-t border-white/10 bg-[#064A42] px-4 py-2.5 sm:px-6 sm:py-3 text-white">
              <p className="text-[12px] sm:text-[13px] text-white/80 font-medium truncate max-w-[240px] sm:max-w-none">
                {instituteName} • অ্যালবাম গ্যালারি
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/gallery"
                  onClick={() => setSelectedPhotoId(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#B68A18] px-3.5 py-1.5 text-[12px] sm:text-[13px] font-bold text-white transition hover:bg-[#9E7614]"
                >
                  <span>সব ছবি দেখুন</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
    </>
  )
}

