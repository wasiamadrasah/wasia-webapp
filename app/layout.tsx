import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { createOgImageUrl, getSeoSettings } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings()
  const shareImage = "/images/og/og-home.png"

  return {
    metadataBase: new URL(seo.siteUrl),
    applicationName: seo.siteName,
    title: {
      default: seo.siteName,
      template: `%s | ${seo.shortName}`,
    },
    description: seo.description,
    keywords: [
      seo.siteName,
      seo.shortName,
      "school",
      "education",
      "teachers",
      "notices",
      "events",
      "admission",
      "results",
    ],
    authors: [{ name: seo.siteName }],
    creator: seo.siteName,
    publisher: seo.siteName,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: seo.siteName,
      title: seo.siteName,
      description: seo.description,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: seo.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.siteName,
      description: seo.description,
      images: [shareImage],
    },
    icons: {
      icon: seo.faviconUrl,
      shortcut: seo.faviconUrl,
      apple: seo.faviconUrl,
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

export const viewport: Viewport = {
  themeColor: "#059669",
  colorScheme: "light",
}

import { CustomScrollbar } from "@/components/custom-scrollbar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <CustomScrollbar />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
