"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { BadgeInfo, BookOpen, ChevronDown, ChevronRight, GraduationCap, Home, Landmark, Mail, Menu, Shield, Users, X } from "lucide-react"
import { Outfit } from "next/font/google"

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

type NavbarProps = {
  initialLogo?: string | null
  initialInstituteName?: string | null
}

const menuItems = [
  { label: "Home", href: "/", icon: Home },
  {
    label: "About",
    icon: Landmark,
    children: [
      { label: "At a Glance", href: "/about#at-a-glance" },
      { label: "History", href: "/history" },
      { label: "Vision & Mission", href: "/about#vision-mission" },
      { label: "Performance Metrics", href: "/performance" }, 
    ],
  },
  {
    label: "Administration",
    icon: Users,
    children: [
      { label: "President", href: "/leadership/president" },
      { label: "Headmaster", href: "/headmaster" },
      { label: "Teachers", href: "/teachers" },
      { label: "Staffs", href: "/staffs" },
      { label: "Governing Body", href: "/governing-body" },
    ],
  },
  {
    label: "Academics",
    icon: BookOpen,
    children: [
      { label: "Admission", href: "/admission" },
      { label: "Students", href: "/students" },
      { label: "Results", href: "/results" },
    ],
  },
  {
    label: "Information",
    icon: BadgeInfo,
    children: [
      { label: "Notices", href: "/notices" },
      { label: "News", href: "/news" },
      { label: "Events", href: "/events" },
      { label: "Download", href: "/downloads" },
    ],
  },
  { label: "Contact", href: "/contact", icon: Mail },
]

function getBasePath(href: string) {
  return href.split("#")[0].split("?")[0] || "/"
}

export default function Navbar({
  initialLogo = null,
  initialInstituteName = "Purba Bakalia City Corporation High School",
}: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
  const [logo, setLogo] = useState<string | null>(initialLogo)
  const [instituteName, setInstituteName] = useState(
    initialInstituteName || "Purba Bakalia City Corporation High School"
  )
  const pathname = usePathname()

  // Fetch institute logo from API
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("/api/public/home-feed")
        const data = await response.json()
        if (data.institute_settings?.primary?.logo) {
          setLogo(data.institute_settings.primary.logo)
        }
        if (data.institute_settings?.primary?.instituteName) {
          setInstituteName(data.institute_settings.primary.instituteName)
        }
      } catch (error) {
        console.error("Failed to fetch institute settings:", error)
      }
    }

    fetchLogo()
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [open])


  const openMenu = () => setOpen(true)
  const closeMenu = () => {
    setOpen(false)
    setOpenMobileSection(null)
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
      <header className={`${outfit.className} sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(15,118,110,0.06),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-4">
            <Link href="/" className="group relative z-10 flex items-center gap-3">
              {logo ? (
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-[0_14px_26px_-18px_rgba(15,118,110,0.65)] ring-1 ring-emerald-100 bg-white">
                  <Image
                    src={logo}
                    alt="Institute Logo"
                    width={40}
                    height={40}
                    className="h-9 w-9 object-contain"
                    priority
                  />
                </div>
              ) : (
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-[0_14px_26px_-18px_rgba(15,118,110,0.65)] ring-1 ring-emerald-100">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="hidden sm:block">
                <div className="text-sm font-bold tracking-tighter text-teal-700 transition group-hover:text-emerald-600 leading-tight" style={{ fontStretch: 'condensed', lineHeight: '1.2' }}>
                  {instituteName.length > 14 ? (
                    <>
                      {(() => {
                        const words = instituteName.split(" ")
                        const mid = Math.ceil(words.length / 2)
                        const line1 = words.slice(0, mid).join(" ")
                        const line2 = words.slice(mid).join(" ")
                        return (
                          <>
                            <div>{line1}</div>
                            <div>{line2}</div>
                          </>
                        )
                      })()}
                    </>
                  ) : (
                    <div>{instituteName}</div>
                  )}
                </div>
              </div>
            </Link>

            <nav className="relative z-10 hidden items-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 py-1 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.3)] lg:flex">
              {menuItems.map((item) => {
                const active = isItemActive(item)

                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-[#006a4e] text-white ring-1 ring-[#00563f] shadow-[0_8px_18px_-14px_rgba(0,106,78,0.55)]"
                          : "text-slate-700 hover:-translate-y-0.5 hover:bg-[#006a4e]/30 hover:text-[#006a4e] hover:shadow-[0_10px_20px_-18px_rgba(15,23,42,0.25)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                }

                const children = item.children ?? []

                return (
                  <div key={item.label} className="group relative z-10">
                    <div
                      className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-[#006a4e] text-white ring-1 ring-[#00563f] shadow-[0_8px_18px_-14px_rgba(0,106,78,0.55)]"
                          : "text-slate-700 group-hover:-translate-y-0.5 group-hover:bg-[#006a4e]/30 group-hover:text-[#006a4e] group-hover:shadow-[0_10px_20px_-18px_rgba(15,23,42,0.25)]"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 group-hover:rotate-180 ${active ? "text-white" : "text-slate-400 group-hover:text-[#006a4e]"}`} />
                    </div>

                    <div className="pointer-events-none absolute left-1/2 top-full z-20 w-64 -translate-x-1/2 pt-3 group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                      <div className="translate-y-2 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl shadow-slate-900/10 ring-1 ring-slate-100 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        {children.map((child) => {
                          const childActive = isHrefActive(child.href)
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`group/item flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                childActive
                                  ? "bg-[#006a4e] text-white"
                                  : "text-slate-600 hover:bg-[#006a4e]/30 hover:text-[#006a4e]"
                              }`}
                            >
                              <span>{child.label}</span>
                              <ChevronRight className={`h-4 w-4 transition-transform duration-200 group-hover/item:translate-x-0.5 ${childActive ? "text-white/80" : "text-slate-300 group-hover/item:text-[#006a4e]"}`} />
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </nav>

            <div className="relative z-10 flex items-center gap-3">
              {/* Mobile Login Icon Button */}
              <Link
                href="/student/login"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00563f] bg-[#006a4e] text-white transition-all duration-300 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white hover:shadow-[0_12px_24px_-10px_rgba(15,118,110,0.4)] md:hidden shadow-[0_8px_18px_-14px_rgba(0,106,78,0.55)]"
                aria-label="Login"
              >
                <Shield className="h-5 w-5" strokeWidth={2.5} />
              </Link>

              {/* Desktop Login Pill Button */}
              <Link
                href="/student/login"
                className="group hidden items-center gap-2 rounded-full border border-[#00563f] bg-[#006a4e] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_30px_-22px_rgba(0,106,78,0.45)] ring-1 ring-white/10 transition-all duration-300 hover:bg-emerald-600 hover:border-emerald-500 hover:shadow-[0_20px_36px_-20px_rgba(15,118,110,0.4)] md:inline-flex"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white transition-colors duration-300 group-hover:bg-[#006a4e]">
                  <Shield className="h-3.5 w-3.5" strokeWidth={2.8} />
                </span>
                <span>Login</span>
              </Link>

              <button
                onClick={openMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-teal-200 hover:bg-slate-50 hover:text-teal-700 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={closeMenu}
        />
      )}

      <div
        className={`${outfit.className} fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-[#006a4e] px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-white">Menu</h2>
            <p className="text-sm text-emerald-100">{instituteName}</p>
          </div>
          <button
            onClick={closeMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white transition hover:bg-white/30"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-3 px-3 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isItemActive(item)

            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#006a4e] text-white font-semibold shadow-[0_4px_12px_-4px_rgba(0,106,78,0.45)]"
                      : "text-slate-700 hover:bg-[#006a4e]/30 hover:text-[#006a4e]"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              )
            }

            const isExpanded = openMobileSection === item.label
            const children = item.children ?? []

            return (
              <div key={item.label} className="overflow-hidden px-1 py-1">
                <button
                  type="button"
                  onClick={() => toggleMobileSection(item.label)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition rounded-xl ${
                    active
                      ? "bg-[#006a4e] text-white font-semibold shadow-[0_4px_12px_-4px_rgba(0,106,78,0.45)]"
                      : isExpanded
                        ? "text-[#006a4e] font-semibold bg-[#006a4e]/20"
                        : "text-slate-900 hover:text-[#006a4e] hover:bg-[#006a4e]/20"
                  }`}
                  aria-expanded={isExpanded}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-white" : "text-[#006a4e]"}`} />
                  <span className="flex-1">{item.label}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${active ? "text-white" : isExpanded ? "rotate-180 text-[#006a4e]" : "text-slate-400"}`} />
                </button>

                {isExpanded && (
                  <div className="mt-2 space-y-1 border-t border-slate-200/80 pt-2">
                    {children.map((child) => {
                      const childActive = isHrefActive(child.href)
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMenu}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                            childActive
                              ? "bg-[#006a4e] text-white font-semibold shadow-[0_4px_10px_-4px_rgba(0,106,78,0.35)]"
                              : "text-slate-600 hover:bg-[#006a4e]/25 hover:text-[#006a4e]"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${childActive ? "bg-white" : "bg-emerald-500"}`} />
                          <span className="flex-1">{child.label}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform duration-200 group-hover/item:translate-x-0.5 ${childActive ? "text-white/80" : "text-slate-400"}`} />
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>



      </div>
    </>
  )
}
