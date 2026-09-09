"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  ChevronRight,
  GraduationCap,
} from "lucide-react"

type FooterLinkSection = {
  id: string
  section_name: string
  section_slug: string
  display_order: number
  links: Array<{
    id: string
    link_label: string
    link_url: string
    display_order: number
  }>
}

type InstituteSettingsPayload = {
  primary?: {
    instituteName?: string
    instituteNameBn?: string
    logo?: string
    motto?: string
  }
  contact?: {
    address?: string
    telephone?: string
    mobile?: string
    email?: string
  }
  social?: {
    facebook?: string
    youtube?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
}

type FooterProps = {
  initialFooterSections?: FooterLinkSection[]
  initialInstituteSettings?: InstituteSettingsPayload | null
}

const banglaTranslationMap: Record<string, string> = {
  // Section Titles
  "Quick Links": "গুরুত্বপূর্ণ লিংক",
  "quick links": "গুরুত্বপূর্ণ লিংক",
  "Quick links": "গুরুত্বপূর্ণ লিংক",
  "Academics": "একাডেমিক ও সেবা",
  "academics": "একাডেমিক ও সেবা",
  "Important Links": "গুরুত্বপূর্ণ লিংক",
  "important links": "গুরুত্বপূর্ণ লিংক",
  "Information": "তথ্য ও সেবা",
  "information": "তথ্য ও সেবা",
  "Contact": "যোগাযোগ",
  "contact": "যোগাযোগ",
  "About": "পরিচিতি",
  "about": "পরিচিতি",

  // Link Labels
  "About Us": "আমাদের পরিচিতি",
  "about us": "আমাদের পরিচিতি",
  "Teachers": "শিক্ষকমণ্ডলী",
  "teachers": "শিক্ষকমণ্ডলী",
  "Teachers List": "শিক্ষকবৃন্দের তালিকা",
  "Notices": "নোটিশ বোর্ড",
  "notices": "নোটিশ বোর্ড",
  "Notice": "নোটিশ",
  "Events": "অনুষ্ঠানমালা",
  "events": "অনুষ্ঠানমালা",
  "Event": "অনুষ্ঠান",
  "Gallery": "ফটোগ্যালারি",
  "gallery": "ফটোগ্যালারি",
  "Photo Gallery": "ফটোগ্যালারি",
  "Admission": "ভর্তি তথ্য",
  "admission": "ভর্তি তথ্য",
  "Admissions": "ভর্তি তথ্য ও প্রক্রিয়া",
  "Results": "পরীক্ষার ফলাফল",
  "results": "পরীক্ষার ফলাফল",
  "Result": "ফলাফল",
  "News": "সর্বশেষ সংবাদ",
  "news": "সংবাদ",
  "FAQ": "সাধারণ জিজ্ঞাসা",
  "faq": "সাধারণ জিজ্ঞাসা",
  "Faq": "সাধারণ জিজ্ঞাসা",
  "Policies": "নীতিমালা ও নিয়মাবলী",
  "policies": "নীতিমালা",
  "Policy": "নীতিমালা",
  "Students": "শিক্ষার্থীবৃন্দ",
  "students": "শিক্ষার্থীবৃন্দ",
  "Student": "শিক্ষার্থী",
  "Downloads": "প্রয়োজনীয় ডাউনলোড",
  "downloads": "ডাউনলোড",
  "Download": "প্রয়োজনীয় ফরম ও ডাউনলোড",
  "Forms": "প্রয়োজনীয় ফরম",
  "Staffs": "কর্মকর্তা-কর্মচারী",
  "staffs": "কর্মকর্তা-কর্মচারী",
  "Staff": "কর্মকর্তা-কর্মচারী",
  "Governing Body": "পরিচালনা পর্ষদ",
  "governing body": "পরিচালনা পর্ষদ",
  "Managing Committee": "ব্যবস্থাপনা কমিটি",
  "Headmaster": "মুহতামিম / প্রধান",
  "headmaster": "মুহতামিম / প্রধান",
  "Principal": "অধ্যক্ষ মহোদয়",
  "President": "সভাপতি মহোদয়",
  "Contact Us": "যোগাযোগ",
  "contact us": "যোগাযোগ",
  "History": "ইতিহাস ও পটভূমি",
  "history": "ইতিহাস",
  "Performance Metrics": "অর্জন ও মূল্যায়ন",
  "performance": "অর্জন ও মূল্যায়ন",
  "At a Glance": "এক নজরে",
  "Vision & Mission": "লক্ষ্য ও উদ্দেশ্য",
}

function toBangla(text?: string | null): string {
  if (!text) return ""
  const trimmed = text.trim()
  return banglaTranslationMap[trimmed] || banglaTranslationMap[trimmed.toLowerCase()] || trimmed
}

const fallbackFooterLinks = {
  "গুরুত্বপূর্ণ লিংক": [
    { href: "/about", label: "আমাদের পরিচিতি" },
    { href: "/teachers", label: "শিক্ষকমণ্ডলী" },
    { href: "/notices", label: "নোটিশ বোর্ড" },
    { href: "/events", label: "অনুষ্ঠানমালা" },
    { href: "/gallery", label: "ফটোগ্যালারি" },
  ],
  "একাডেমিক ও সেবা": [
    { href: "/admission", label: "ভর্তি তথ্য ও প্রক্রিয়া" },
    { href: "/students", label: "শিক্ষার্থীবৃন্দ" },
    { href: "/results", label: "পরীক্ষার ফলাফল" },
    { href: "/news", label: "সর্বশেষ সংবাদ" },
    { href: "/downloads", label: "প্রয়োজনীয় ফরম ও ডাউনলোড" },
  ],
} as const

export default function Footer({
  initialFooterSections = [],
  initialInstituteSettings = null,
}: FooterProps) {
  const [footerSections, setFooterSections] = useState<FooterLinkSection[]>(initialFooterSections)
  const [instituteSettings, setInstituteSettings] = useState<InstituteSettingsPayload | null>(
    initialInstituteSettings
  )

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const response = await fetch("/api/public/home-feed", { cache: "no-store" })
        const payload = (await response.json()) as {
          footer_sections?: FooterLinkSection[]
          institute_settings?: InstituteSettingsPayload | null
        }
        if (response.ok) {
          if (payload.footer_sections && payload.footer_sections.length > 0) {
            setFooterSections(payload.footer_sections)
          }
          if (payload.institute_settings) {
            setInstituteSettings(payload.institute_settings)
          }
        }
      } catch (error) {
        console.error("Error fetching footer data:", error)
      }
    }
    fetchFooterData()
  }, [])

  const displaySections =
    footerSections.length > 0
      ? footerSections
      : Object.entries(fallbackFooterLinks).map(([sectionName, sectionLinks], sIdx) => ({
          id: `section-${sIdx}`,
          section_name: sectionName,
          section_slug: `section-${sIdx}`,
          display_order: sIdx + 1,
          links: sectionLinks.map((link, idx) => ({
            id: `link-${sIdx}-${idx}`,
            link_label: link.label,
            link_url: link.href,
            display_order: idx + 1,
          })),
        }))

  const instituteName =
    instituteSettings?.primary?.instituteNameBn?.trim() ||
    instituteSettings?.primary?.instituteName?.trim() ||
    "ওয়াসিয়া কামিল মাদ্রাসা"

  const logo = instituteSettings?.primary?.logo?.trim() || null

  const contactAddress =
    instituteSettings?.contact?.address?.trim() ||
    "ওয়াসিয়া কামিল মাদ্রাসা ক্যাম্পাস, বাংলাদেশ"

  const contactPhone =
    instituteSettings?.contact?.telephone?.trim() ||
    instituteSettings?.contact?.mobile?.trim() ||
    "+৮৮০১৭০০-০০০০০০"

  const contactEmail =
    instituteSettings?.contact?.email?.trim() ||
    "info@wasiamadrasah.edu.bd"

  const socialLinks = [
    {
      label: "Facebook",
      href: instituteSettings?.social?.facebook?.trim() || "https://facebook.com",
      icon: Facebook,
    },
    {
      label: "YouTube",
      href: instituteSettings?.social?.youtube?.trim() || "https://youtube.com",
      icon: Youtube,
    },
    {
      label: "Instagram",
      href: instituteSettings?.social?.instagram?.trim() || "https://instagram.com",
      icon: Instagram,
    },
    {
      label: "LinkedIn",
      href: instituteSettings?.social?.linkedin?.trim() || "https://linkedin.com",
      icon: Linkedin,
    },
    {
      label: "Twitter",
      href: instituteSettings?.social?.twitter?.trim() || "https://twitter.com",
      icon: Twitter,
    },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-[#064A42] text-[#E2E7E4] border-t-2 border-[#B68A18]">
      {/* Top Quranic/Calligraphic Accent Bar */}
      <div className="bg-[#043731] py-3 px-4 border-b border-white/10 text-center">
        <p className="font-heading text-[#B68A18] text-base md:text-lg tracking-wide">
          رَبِّ زِدْنِي عِلْمًا — &ldquo;হে আমার প্রতিপালক! আমাকে জ্ঞানে সমৃদ্ধ করুন।&rdquo;
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Institute Brand & Info (Expanded Width) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {logo ? (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white p-1">
                  <Image
                    src={logo}
                    alt={instituteName}
                    width={44}
                    height={44}
                    className="h-10 w-10 object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#075E54] border border-white/20 text-white">
                  <GraduationCap className="h-7 w-7 text-[#B68A18]" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-heading font-bold text-white text-lg md:text-xl leading-snug group-hover:text-[#B68A18] transition-colors">
                  {instituteName}
                </span>
                <span className="text-[15px] text-[#A3BFB8] leading-tight mt-0.5">
                  দ্বীনি ও আধুনিক শিক্ষার সমন্বিত প্রতিষ্ঠান
                </span>
              </div>
            </Link>

            <p className="text-[16px] leading-relaxed text-[#DCEEE9] max-w-md">
              ইসলামিক ঐতিহ্য, নৈতিক মূল্যবোধ ও সমকালীন আধুনিক শিক্ষার মাধ্যমে আলোকিত জাতি গঠনের অঙ্গীকারবদ্ধ শিক্ষাপ্রতিষ্ঠান।
            </p>

            {/* Social Icons in First Column */}
            <div className="pt-2">
              <span className="block text-[15px] font-semibold text-white mb-2.5">
                সামাজিক যোগাযোগ:
              </span>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 border border-white/15 text-white transition-all duration-200 hover:bg-[#B68A18] hover:border-[#B68A18] hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Col 2 & 3: Dynamic Links in Bangla */}
          {displaySections.slice(0, 2).map(({ section_name, links }) => (
            <div key={section_name} className="lg:col-span-2 space-y-4">
              <h3 className="font-heading font-bold text-lg text-white">
                {toBangla(section_name)}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.link_url}
                      className="group inline-flex items-center gap-1.5 text-[16px] text-[#DCEEE9] transition-colors duration-200 hover:text-[#B68A18]"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-[#B68A18] transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0" />
                      <span className="relative inline-block">
                        {toBangla(link.link_label)}
                        <span className="absolute bottom-[2px] left-0 h-[1px] w-0 bg-[#B68A18] transition-all duration-300 ease-out group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 4: Contact Information */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">
              যোগাযোগ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-[16px] text-[#DCEEE9]">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#B68A18]" />
                <span>{contactAddress}</span>
              </li>
              <li className="flex items-center gap-2.5 text-[16px] text-[#DCEEE9]">
                <Phone className="h-4 w-4 shrink-0 text-[#B68A18]" />
                <a
                  href={`tel:${contactPhone}`}
                  className="hover:text-[#B68A18] transition-colors"
                >
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[16px] text-[#DCEEE9]">
                <Mail className="h-4 w-4 shrink-0 text-[#B68A18]" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-[#B68A18] transition-colors break-all"
                >
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Credit Bar (Full Width) */}
      <div className="w-full border-t border-white/15 bg-[#043731] py-5 px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-center text-[15px] text-[#A3BFB8] w-full">
          <p className="sm:text-left text-[#E2E7E4]">
            “যে ব্যক্তি জ্ঞান অর্জনের উদ্দেশ্যে কোনো পথে চলে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।”
            <span className="text-[#B68A18] font-medium ml-1.5">— সহিহ মুসলিম</span>
          </p>
          <p className="sm:text-right text-[15px]">
            কারিগরি সহযোগিতায়{" "}
            <span className="font-semibold text-white">
              ডিজিক্যাম্পাস
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
