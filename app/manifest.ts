import type { MetadataRoute } from "next"
import { getSeoSettings } from "@/lib/seo"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const seo = await getSeoSettings()

  return {
    name: seo.siteName,
    short_name: seo.shortName,
    description: seo.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [
      {
        src: seo.faviconUrl || "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
