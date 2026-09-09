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
  ChevronsRight,
} from "lucide-react"
import { Outfit } from "next/font/google"

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

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
    logo?: string
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

const fallbackFooterLinks = {
  "Quick Links": [
    { href: "/about", label: "About Us" },
    { href: "/teachers", label: "Teachers" },
    { href: "/notices", label: "Notices" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
  ],
  Academics: [
    { href: "/admission", label: "Admission" },
    { href: "/results", label: "Results" },
    { href: "/news", label: "News" },
    { href: "/faq", label: "FAQ" },
    { href: "/policies", label: "Policies" },
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
          if (payload.footer_sections) {
            setFooterSections(payload.footer_sections)
          }
          setInstituteSettings(payload.institute_settings ?? null)
        }
      } catch (error) {
        console.error("Error fetching footer data:", error)
      }
    }
    fetchFooterData()
  }, [])

  const displaySections = footerSections.length > 0 ? footerSections : Object.entries(fallbackFooterLinks).map(([sectionName, sectionLinks]) => ({
    id: sectionName.toLowerCase().replace(/\s+/g, "-"),
    section_name: sectionName,
    section_slug: sectionName.toLowerCase().replace(/\s+/g, "-"),
    display_order: sectionName === "Quick Links" ? 1 : 2,
    links: sectionLinks.map((link, idx) => ({
      id: `${sectionName}-${idx}`,
      link_label: link.label,
      link_url: link.href,
      display_order: idx + 1,
    })),
  }))

  const instituteName =
    instituteSettings?.primary?.instituteName?.trim() ||
    "Purba Bakalia City Corporation High School"
  const logo = instituteSettings?.primary?.logo?.trim() || "/favicon.ico"
  const contactAddress =
    instituteSettings?.contact?.address?.trim() ||
    "Bakalia, Chattogram, Bangladesh"
  const contactPhone =
    instituteSettings?.contact?.telephone?.trim() ||
    instituteSettings?.contact?.mobile?.trim() ||
    "+880"
  const contactEmail =
    instituteSettings?.contact?.email?.trim() ||
    "info@pbcchs.edu.bd"

  const socialLinks = [
    { label: "Facebook", href: instituteSettings?.social?.facebook?.trim() || "#", icon: Facebook },
    { label: "YouTube", href: instituteSettings?.social?.youtube?.trim() || "#", icon: Youtube },
    { label: "Instagram", href: instituteSettings?.social?.instagram?.trim() || "#", icon: Instagram },
    { label: "LinkedIn", href: instituteSettings?.social?.linkedin?.trim() || "#", icon: Linkedin },
    { label: "Twitter", href: instituteSettings?.social?.twitter?.trim() || "#", icon: Twitter },
  ]

  return (
    <footer className={`${outfit.className} border-t-4 border-emerald-500 bg-gradient-to-b from-[#021e17] to-slate-950 text-slate-300`}>
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Image
                src={logo}
                alt={`${instituteName} logo`}
                width={45}
                height={45}
                className="rounded-lg"
                unoptimized
              />
              <span className="text-xl font-bold">{instituteName}</span>
            </div>
            <p className="text-base leading-7 text-slate-400">
              Empowering students with knowledge, values, and skills for a better tomorrow.
            </p>
            <div className="flex gap-3">
              {socialLinks.filter((item) => item.href && item.href !== "#").slice(0, 5).map((item) => {
                const Icon = item.icon
                return (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="rounded-full bg-white/5 border border-white/10 p-2 text-slate-300 shadow-sm transition hover:bg-emerald-600 hover:border-emerald-600 hover:text-white">
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {displaySections.map(({ section_name, links }) => (
            <div key={section_name}>
              <h3 className="mb-4 text-base font-semibold uppercase tracking-widest text-white">{section_name}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.link_url}
                      className="group inline-flex items-center gap-2 text-base text-slate-400 transition-colors duration-300 hover:text-emerald-400"
                    >
                      <ChevronsRight className="h-4 w-4 shrink-0 text-emerald-400/80 transition-all duration-300 group-hover:translate-x-1" />
                      <span className="relative inline-block">
                        {link.link_label}
                        <span className="absolute block left-0 bottom-0 h-px w-full origin-left scale-x-0 bg-[#34d399] transition-transform duration-300 group-hover:scale-x-100" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 text-base font-semibold uppercase tracking-widest text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-base text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {contactAddress}
              </li>
              <li className="flex items-center gap-2 text-base text-slate-400">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <a href={`tel:${contactPhone}`} className="hover:text-emerald-400 transition-colors">
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-base text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <a href={`mailto:${contactEmail}`} className="hover:text-emerald-400 transition-colors">
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-center text-sm text-slate-400">
          <p className="sm:text-left">
            All Rights Reserved
          </p>
          <p className="sm:text-right">
            Developed by{" "}
            <a
              href="https://github.com/sadijubair"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-300 transition-all duration-300 font-semibold"
            >
              Sadi
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
