import type { MetadataRoute } from "next"
import { getSeoSettings } from "@/lib/seo"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoSettings()

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/og"],
      disallow: ["/admin", "/admin/", "/teacher", "/teacher/", "/api"],
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  }
}
