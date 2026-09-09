"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  BadgeInfo,
  BookOpen,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Home,
  Landmark,
  Mail,
  Menu,
  Users,
  X,
} from "lucide-react"
import type { InstituteSettings } from "@/lib/institute-settings"

type NavbarProps = {
  initialLogo?: string | null
  initialInstituteName?: string | null
  initialSettings?: InstituteSettings | null
}

const menuItems = [
  { label: "হোম", href: "/", icon: Home },
  {
    label: "পরিচিতি",
    icon: Landmark,
    children: [
      { label: "এক নজরে", href: "/about#at-a-glance" },
      { label: "ইতিহাস", href: "/history" },
      { label: "লক্ষ্য ও উদ্দেশ্য", href: "/about#vision-mission" },
      { label: "অর্জন ও মূল্যায়ন", href: "/performance" },
    ],
  },
  {
    label: "প্রশাসন",
    icon: Users,
    children: [
      { label: "সভাপতি মহোদয়", href: "/leadership/president" },
      { label: "মুহতামিম / প্রধান", href: "/headmaster" },
      { label: "শিক্ষকমণ্ডলী", href: "/teachers" },
      { label: "কর্মকর্তা-কর্মচারী", href: "/staffs" },
      { label: "পরিচালনা পর্ষদ", href: "/governing-body" },
    ],
  },
  {
    label: "একাডেমিক",
    icon: BookOpen,
    children: [
      { label: "ভর্তি তথ্য", href: "/admission" },
      { label: "শিক্ষার্থীবৃন্দ", href: "/students" },
      { label: "ফলাফল", href: "/results" },
    ],
  },
  {
    label: "তথ্য ও সেবা",
    icon: BadgeInfo,
    children: [
      { label: "নোটিশ বোর্ড", href: "/notices" },
      { label: "সংবাদ", href: "/news" },
      { label: "অনুষ্ঠানমালা", href: "/events" },
      { label: "ডাউনলোড", href: "/downloads" },
      { label: "ফটোগ্যালারি", href: "/gallery" },
    ],
  },
  { label: "যোগাযোগ", href: "/contact", icon: Mail },
]

function getBasePath(href: string) {
  return href.split("#")[0].split("?")[0] || "/"
}

export default function Navbar({
  initialLogo = null,
  initialInstituteName = "ওয়াসিয়া কামিল মাদ্রাসা",
  initialSettings = null,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
  const [logo, setLogo] = useState<string | null>(initialLogo)
  const [instituteName, setInstituteName] = useState(
    initialInstituteName || "ওয়াসিয়া কামিল মাদ্রাসা"
  )
  const pathname = usePathname()

  // Fetch institute settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/public/home-feed")
        const data = await response.json()
        if (data.institute_settings?.primary?.logo) {
          setLogo(data.institute_settings.primary.logo)
        }
        const bnName =
          data.institute_settings?.primary?.instituteNameBn?.trim() ||
          data.institute_settings?.primary?.instituteName?.trim()
        if (bnName) {
          setInstituteName(bnName)
        }
      } catch (error) {
        console.error("Failed to fetch institute settings:", error)
      }
    }

    fetchSettings()
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenMobileSection(null)
  }, [pathname])

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  const toggleMobileSection = (label: string) => {
    setOpenMobileSection((current) => (current === label ? null : label))
  }

  const isHrefActive = (href: string) => {
    const basePath = getBasePath(href)
    if (basePath === "/") {
      return pathname === "/"
    }
    return pathname === basePath || pathname.startsWith(`${basePath}/`)
  }

  const isItemActive = (item: (typeof menuItems)[number]) => {
    if (item.href) {
      return isHrefActive(item.href)
    }
    return item.children?.some((child) => isHrefActive(child.href)) ?? false
  }

  return (
    <>
      {/* ── Topbar (Non-sticky, scrolls away naturally with page) ── */}
      <div className="w-full bg-[#064A42] text-white border-b border-[#075E54]/70 py-1.5 relative z-40">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-[#E8C86A] text-[15px] sm:text-[16px] leading-tight font-normal tracking-wide select-none drop-shadow-xs">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      </div>

      {/* ── Main Sticky Navigation Header ── */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E2E7E4] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      {/* Top Institutional Bar Accent */}
      <div className="h-[3px] w-full bg-[#075E54]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-3">
          {/* Logo & Institute Name */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition-opacity hover:opacity-95"
          >
            {logo ? (
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-[#E2E7E4] bg-white p-1">
                <Image
                  src={logo}
                  alt={instituteName}
                  width={40}
                  height={40}
                  className="h-9 w-9 object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#075E54] text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
            )}
            <div className="flex flex-col justify-center">
              {/* Mobile: 2-line layout */}
              <div className="sm:hidden font-heading font-bold text-[#17211E] text-[18px] leading-[1.2] group-hover:text-[#075E54] transition-colors">
                {(() => {
                  const words = instituteName.trim().split(/\s+/)
                  if (words.length > 1) {
                    const mid = Math.ceil(words.length / 2)
                    const line1 = words.slice(0, mid).join(" ")
                    const line2 = words.slice(mid).join(" ")
                    return (
                      <>
                        <div className="whitespace-nowrap">{line1}</div>
                        <div className="whitespace-nowrap">{line2}</div>
                      </>
                    )
                  }
                  return <div>{instituteName}</div>
                })()}
              </div>

              {/* Desktop / Tablet: Single-line layout with Subtitle */}
              <div className="hidden sm:flex sm:flex-col">
                <span className="font-heading font-bold text-[#17211E] text-xl md:text-[22px] leading-tight group-hover:text-[#075E54] transition-colors">
                  {instituteName}
                </span>
                <span className="text-[15px] text-[#5F6B67] leading-none mt-0.5">
                  ইসলামিক শিক্ষা ও আধুনিক জ্ঞানচর্চাকেন্দ্র
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const active = isItemActive(item)

              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative px-4 py-2 text-[17px] font-semibold rounded-md transition-colors duration-200 ${
                      active
                        ? "text-[#075E54] bg-[#F0F7F5]"
                        : "text-[#17211E] hover:text-[#075E54] hover:bg-[#F7F8F5]"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-[#B68A18]" />
                    )}
                  </Link>
                )
              }

              const children = item.children ?? []

              return (
                <div key={item.label} className="relative group">
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-[17px] font-semibold rounded-md transition-colors duration-200 ${
                      active
                        ? "text-[#075E54] bg-[#F0F7F5]"
                        : "text-[#17211E] group-hover:text-[#075E54] group-hover:bg-[#F7F8F5]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="h-4 w-4 text-[#5F6B67] transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#075E54]" />
                    {active && (
                      <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-[#B68A18]" />
                    )}
                  </button>

                  {/* Dropdown Card */}
                  <div className="pointer-events-none absolute left-0 top-full pt-2 opacity-0 -translate-y-1 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 z-50 min-w-[220px]">
                    <div className="rounded-xl border border-[#E2E7E4] bg-white p-2 shadow-lg shadow-black/5">
                      {children.map((child) => {
                        const childActive = isHrefActive(child.href)
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-[16px] transition-colors duration-150 ${
                              childActive
                                ? "bg-[#075E54] text-white font-semibold"
                                : "text-[#17211E] font-medium hover:bg-[#F7F8F5] hover:text-[#075E54]"
                            }`}
                          >
                            <span>{child.label}</span>
                            <ChevronRight
                              className={`h-4 w-4 ${
                                childActive ? "text-white/80" : "text-[#5F6B67]"
                              }`}
                            />
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>

          {/* Action / Login & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Portal Login Button */}
            <Link
              href="/student/login"
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#075E54] px-5 py-2 text-[16px] font-bold text-white transition-colors duration-200 hover:bg-[#064A42] shadow-xs"
            >
              লগইন
            </Link>

            {/* Mobile Login Text Button */}
            <Link
              href="/student/login"
              className="sm:hidden flex items-center justify-center rounded-lg bg-[#075E54] px-3.5 py-2 text-[16px] font-bold text-white hover:bg-[#064A42] transition-colors"
            >
              লগইন
            </Link>

            {/* Mobile Menu Toggle Button (No Offcanvas) */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E7E4] bg-white text-[#17211E] transition-colors hover:bg-[#F7F8F5] hover:text-[#075E54]"
              aria-label={mobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Inline Dropdown Navigation (Strictly In-Flow / No Offcanvas) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E7E4] bg-white shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-1 divide-y divide-[#E2E7E4]/60 max-h-[calc(100vh-80px)] overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isItemActive(item)

              if (item.href) {
                return (
                  <div key={item.label} className="pt-1.5 first:pt-0">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-lg px-3.5 py-3 text-[17px] font-semibold transition-colors ${
                        active
                          ? "bg-[#075E54] text-white"
                          : "text-[#17211E] hover:bg-[#F7F8F5] hover:text-[#075E54]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${active ? "text-white" : "text-[#075E54]"}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${active ? "text-white/80" : "text-[#5F6B67]"}`} />
                    </Link>
                  </div>
                )
              }

              const isExpanded = openMobileSection === item.label
              const children = item.children ?? []

              return (
                <div key={item.label} className="pt-1.5 first:pt-0">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection(item.label)}
                    className={`flex w-full items-center justify-between rounded-lg px-3.5 py-3 text-[17px] font-semibold transition-colors ${
                      active
                        ? "bg-[#F0F7F5] text-[#075E54]"
                        : "text-[#17211E] hover:bg-[#F7F8F5] hover:text-[#075E54]"
                    }`}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[#075E54]" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-[#5F6B67] transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-[#075E54]" : ""
                      }`}
                    />
                  </button>

                  {/* Inline Accordion for Sub-items */}
                  {isExpanded && (
                    <div className="mt-1 mb-2 ml-4 pl-3 border-l-2 border-[#E2E7E4] space-y-1">
                      {children.map((child) => {
                        const childActive = isHrefActive(child.href)
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center justify-between rounded-md px-3.5 py-2.5 text-[16px] transition-colors ${
                              childActive
                                ? "bg-[#075E54] text-white font-semibold"
                                : "text-[#17211E] font-medium hover:bg-[#F7F8F5] hover:text-[#075E54]"
                            }`}
                          >
                            <span>{child.label}</span>
                            <ChevronRight
                              className={`h-4 w-4 ${
                                childActive ? "text-white/80" : "text-[#5F6B67]"
                              }`}
                            />
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Mobile Portal Link Footer in Menu */}
            <div className="pt-3 pb-1">
              <Link
                href="/student/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full rounded-lg bg-[#075E54] px-4 py-3 text-[16px] font-bold text-white hover:bg-[#064A42] transition-colors"
              >
                লগইন / পোর্টাল
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  )
}
