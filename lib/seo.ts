import "server-only"

import type { Metadata } from "next"
import { cache } from "react"
import { defaultInstituteSettings, type InstituteSettings } from "@/lib/institute-settings"
import { getInstituteSettings } from "@/lib/institute-settings-store"

const FALLBACK_SITE_NAME = "Purba Bakalia City Corporation High School"
const FALLBACK_DESCRIPTION =
  "Official website for school notices, teachers, events, admission information, results, and public updates."
const FALLBACK_SITE_URL = "https://pbcchs.edu.bd"
const FALLBACK_OG_IMAGE = "/api/og"

function trimSlash(value: string) {
  return value.replace(/\/+$/, "")
}

function normalizeUrl(value?: string | null) {
  if (!value?.trim()) return null

  try {
    return trimSlash(new URL(value.trim()).toString())
  } catch {
    return null
  }
}

function getConfiguredSiteUrl(settings?: InstituteSettings) {
  return (
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    normalizeUrl(process.env.NEXTAUTH_URL) ||
    normalizeUrl(settings?.contact.website) ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? normalizeUrl(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
      : null) ||
    FALLBACK_SITE_URL
  )
}

function getSettingsFallback(): InstituteSettings {
  return {
    ...defaultInstituteSettings,
    primary: {
      ...defaultInstituteSettings.primary,
      instituteName: FALLBACK_SITE_NAME,
    },
  }
}

function compactList(values: Array<string | undefined | null>) {
  return values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))
}

export function absoluteUrl(path = "/", siteUrl = FALLBACK_SITE_URL) {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${trimSlash(siteUrl)}${normalizedPath}`
}

export function plainText(value?: string | null, maxLength = 160) {
  const text = (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength - 1).trim()}...`
}

function truncateForOg(value: string, maxLength: number) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).trim()}...`
}

export function createOgImageUrl({
  title,
  description,
  label,
}: {
  title: string
  description?: string | null
  label?: string | null
}) {
  const params = new URLSearchParams()
  params.set("title", truncateForOg(plainText(title, 100), 100))

  const cleanDescription = plainText(description, 150)
  if (cleanDescription) {
    params.set("description", truncateForOg(cleanDescription, 150))
  }

  if (label?.trim()) {
    params.set("label", truncateForOg(label.trim(), 40))
  }

  return `${FALLBACK_OG_IMAGE}?${params.toString()}`
}

export const getSeoSettings = cache(async () => {
  let settings = getSettingsFallback()

  try {
    settings = await getInstituteSettings()
  } catch {
    settings = getSettingsFallback()
  }

  const siteName = settings.primary.instituteName?.trim() || FALLBACK_SITE_NAME
  const shortName = settings.primary.shortForm?.trim() || siteName
  const siteUrl = getConfiguredSiteUrl(settings)
  const description =
    settings.primary.motto?.trim() ||
    compactList([
      settings.primary.instituteType,
      settings.primary.board,
      settings.primary.affiliation,
      settings.contact.address,
    ]).join(" | ") ||
    FALLBACK_DESCRIPTION

  return {
    settings,
    siteName,
    shortName,
    siteUrl,
    description,
    logoUrl: settings.primary.logo?.trim() || null,
    faviconUrl: settings.primary.favicon?.trim() || "/favicon.ico",
    contactEmail: settings.contact.email?.trim() || null,
    contactPhone: settings.contact.telephone?.trim() || settings.contact.mobile?.trim() || null,
    address: settings.contact.address?.trim() || null,
    socialLinks: compactList([
      settings.social.facebook,
      settings.social.twitter,
      settings.social.linkedin,
      settings.social.instagram,
      settings.social.youtube,
      settings.social.whatsapp,
      settings.social.tiktok,
      settings.social.telegram,
    ]),
  }
})

export function createPageMetadata({
  title,
  description,
  path,
  image,
  keywords = [],
}: {
  title: string
  description: string
  path: string
  image?: string | null
  keywords?: string[]
}): Metadata {
  const sanitizedDescription = plainText(description, 160)
  const shareImage = image || createOgImageUrl({ title, description: sanitizedDescription })

  return {
    title,
    description: sanitizedDescription,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description: sanitizedDescription,
      url: path,
      type: "website",
      siteName: FALLBACK_SITE_NAME,
      locale: "en_US",
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: sanitizedDescription,
      images: [shareImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}
