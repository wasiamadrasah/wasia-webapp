import type { MetadataRoute } from "next"
import { createSupabaseAdminClient } from "@/lib/db"
import { absoluteUrl, getSeoSettings } from "@/lib/seo"

export const revalidate = 3600

type SitemapEntry = MetadataRoute.Sitemap[number]

const staticRoutes: Array<Pick<SitemapEntry, "changeFrequency" | "priority"> & { path: string }> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/history", changeFrequency: "monthly", priority: 0.7 },
  { path: "/principal", changeFrequency: "monthly", priority: 0.7 },
  { path: "/leadership/president", changeFrequency: "monthly", priority: 0.6 },
  { path: "/leadership/chief-education-officer", changeFrequency: "monthly", priority: 0.6 },
  { path: "/leadership/headmaster", changeFrequency: "monthly", priority: 0.6 },
  { path: "/governing-body", changeFrequency: "monthly", priority: 0.7 },
  { path: "/teachers", changeFrequency: "weekly", priority: 0.8 },
  { path: "/staffs", changeFrequency: "monthly", priority: 0.6 },
  { path: "/notices", changeFrequency: "daily", priority: 0.9 },
  { path: "/news", changeFrequency: "daily", priority: 0.8 },
  { path: "/blogs", changeFrequency: "weekly", priority: 0.7 },
  { path: "/events", changeFrequency: "daily", priority: 0.8 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.7 },
  { path: "/downloads", changeFrequency: "weekly", priority: 0.6 },
  { path: "/admission", changeFrequency: "monthly", priority: 0.8 },
  { path: "/results", changeFrequency: "monthly", priority: 0.7 },
  { path: "/students", changeFrequency: "monthly", priority: 0.6 },
  { path: "/performance", changeFrequency: "monthly", priority: 0.6 },
  { path: "/policies", changeFrequency: "yearly", priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
]

function entry(path: string, siteUrl: string, options: Partial<SitemapEntry> = {}): SitemapEntry {
  return {
    url: absoluteUrl(path, siteUrl),
    lastModified: options.lastModified || new Date(),
    changeFrequency: options.changeFrequency || "weekly",
    priority: options.priority ?? 0.5,
  }
}

async function getDynamicEntries(siteUrl: string): Promise<SitemapEntry[]> {
  try {
    const supabase = createSupabaseAdminClient()
    const [notices, news, blogs, events, teachers] = await Promise.allSettled([
      supabase
        .from("notices")
        .select("id, updated_at, created_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(100),
      supabase
        .from("news_posts")
        .select("id, updated_at, created_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(100),
      supabase
        .from("blog_posts")
        .select("id, updated_at, created_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(100),
      supabase
        .from("events")
        .select("id, updated_at, created_at")
        .eq("published", true)
        .order("event_date", { ascending: false })
        .limit(100),
      supabase
        .from("staffs")
        .select("id")
        .eq("type", "teacher")
        .eq("status", "active")
        .order("full_name_en", { ascending: true })
        .limit(200),
    ])

    const rows = <T extends { id: string; updated_at?: string | null; created_at?: string | null }>(
      result: PromiseSettledResult<{ data: T[] | null; error: unknown }>
    ) => {
      if (result.status !== "fulfilled" || result.value.error) {
        return [] as T[]
      }

      return result.value.data ?? []
    }

    return [
      ...rows(notices).map((item) =>
        entry(`/notices/${item.id}`, siteUrl, {
          changeFrequency: "monthly",
          priority: 0.7,
          lastModified: item.updated_at || item.created_at || undefined,
        })
      ),
      ...rows(news).map((item) =>
        entry(`/news/${item.id}`, siteUrl, {
          changeFrequency: "monthly",
          priority: 0.7,
          lastModified: item.updated_at || item.created_at || undefined,
        })
      ),
      ...rows(blogs).map((item) =>
        entry(`/blogs/${item.id}`, siteUrl, {
          changeFrequency: "monthly",
          priority: 0.6,
          lastModified: item.updated_at || item.created_at || undefined,
        })
      ),
      ...rows(events).map((item) =>
        entry(`/events/${item.id}`, siteUrl, {
          changeFrequency: "weekly",
          priority: 0.7,
          lastModified: item.updated_at || item.created_at || undefined,
        })
      ),
      ...rows(teachers).map((item) =>
        entry(`/teachers/${item.id}`, siteUrl, {
          changeFrequency: "monthly",
          priority: 0.6,
        })
      ),
    ]
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeoSettings()
  const staticEntries = staticRoutes.map(({ path, ...options }) => entry(path, seo.siteUrl, options))
  const dynamicEntries = await getDynamicEntries(seo.siteUrl)

  return [...staticEntries, ...dynamicEntries]
}
