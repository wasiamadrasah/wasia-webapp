import "server-only"

import { createClient } from "@supabase/supabase-js"

type MissingError = { code?: string; message?: string } | null

const getEnv = (name: "NEXT_PUBLIC_SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY") => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is required for gallery data access.`)
  }

  return value
}

const isMissingTableError = (error: MissingError) => {
  if (!error) return false

  const message = (error.message ?? "").toLowerCase()
  return error.code === "PGRST205" || message.includes("schema cache") || (message.includes("relation") && message.includes("does not exist"))
}

const isMissingColumnError = (error: MissingError) => {
  if (!error) return false

  const message = (error.message ?? "").toLowerCase()
  return message.includes("column") && (message.includes("does not exist") || message.includes("could not find") || message.includes("schema cache"))
}

export type GalleryCategoryRecord = {
  id: string
  name: string
  is_active: boolean
  created_at: string | null
}

export type GalleryPhotoItemRecord = {
  id: string
  title: string
  description: string | null
  category: string
  image_url: string
  photo_date: string | null
  published: boolean | null
  created_at: string | null
}

export type GalleryVideoItemRecord = {
  id: string
  title: string
  description: string | null
  category: string
  video_url: string
  thumbnail_url: string | null
  video_date: string | null
  published: boolean | null
  created_at: string | null
}

function createGalleryClient() {
  return createClient(getEnv("NEXT_PUBLIC_SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function normalizeCategory(value: string | null | undefined) {
  const text = (value ?? "").trim()
  return (text || "general").toLowerCase()
}

async function getCategoryRows(tableName: string) {
  const supabase = createGalleryClient()
  const { data, error } = await supabase
    .from(tableName)
    .select("id, name, is_active, created_at")
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    return [] as GalleryCategoryRecord[]
  }

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as GalleryCategoryRecord[]
  return rows
}

async function getItemRows(tableName: string, limit = 100) {
  const supabase = createGalleryClient()
  const isPhotoTable = tableName === "photo_gallery_items"

  const primarySelect = isPhotoTable
    ? "id, title, description, category, image_url, photo_date, published, created_at"
    : "id, title, description, category, video_url, thumbnail_url, video_date, published, created_at"

  const primary = await supabase
    .from(tableName)
    .select(primarySelect)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (isMissingTableError(primary.error)) {
    return [] as Array<Record<string, unknown>>
  }

  if (primary.error && isMissingColumnError(primary.error)) {
    const fallbackSelect = isPhotoTable
      ? "id, title, description, category, image_url, published, created_at"
      : "id, title, description, category, video_url, thumbnail_url, published, created_at"

    const fallback = await supabase
      .from(tableName)
      .select(fallbackSelect)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (fallback.error) {
      throw new Error(fallback.error.message)
    }

    return (fallback.data as unknown as Array<Record<string, unknown>>) ?? []
  }

  if (primary.error) {
    throw new Error(primary.error.message)
  }

  return (primary.data as unknown as Array<Record<string, unknown>>) ?? []
}

async function getActiveCategoryNames(tableName: string, itemTableName: string, categoryField: string) {
  const supabase = createGalleryClient()
  const { data, error } = await supabase
    .from(tableName)
    .select("name")
    .eq("is_active", true)
    .order("name", { ascending: true })

  if (isMissingTableError(error)) {
    const items = await getItemRows(itemTableName, 500)
    const categories = Array.from(
      new Set(
        items
          .map((item) => normalizeCategory((item[categoryField] as string | null | undefined) ?? null))
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b))

    if (!categories.includes("general")) {
      categories.unshift("general")
    }

    return categories
  }

  if (error) {
    throw new Error(error.message)
  }

  const categories = (data ?? []).map((item) => item.name)
  if (!categories.includes("general")) {
    categories.unshift("general")
  }

  return categories
}

export async function getPhotoGalleryCategories() {
  return getActiveCategoryNames("photo_gallery_categories", "photo_gallery_items", "category")
}

export async function getPhotoGalleryCategoriesForAdmin() {
  const rows = await getCategoryRows("photo_gallery_categories")
  return rows.length > 0
    ? rows
    : (await getPhotoGalleryCategories()).map((name) => ({
        id: name,
        name,
        is_active: true,
        created_at: null,
      }))
}

export async function getPhotoGalleryItems(limit = 100) {
  const rows = await getItemRows("photo_gallery_items", limit)
  return rows.map((item) => ({
    id: String(item.id),
    title: String(item.title ?? "Untitled photo"),
    description: (item.description as string | null | undefined) ?? null,
    category: normalizeCategory(item.category as string | null | undefined),
    image_url: String(item.image_url ?? ""),
    photo_date: (item.photo_date as string | null | undefined) ?? null,
    published: (item.published as boolean | null | undefined) ?? true,
    created_at: (item.created_at as string | null | undefined) ?? null,
  })) as GalleryPhotoItemRecord[]
}

export async function getPhotoGalleryItemsForAdmin(limit = 100) {
  return getPhotoGalleryItems(limit)
}

export async function getVideoGalleryCategories() {
  return getActiveCategoryNames("video_gallery_categories", "video_gallery_items", "category")
}

export async function getVideoGalleryCategoriesForAdmin() {
  const rows = await getCategoryRows("video_gallery_categories")
  return rows.length > 0
    ? rows
    : (await getVideoGalleryCategories()).map((name) => ({
        id: name,
        name,
        is_active: true,
        created_at: null,
      }))
}

export async function getVideoGalleryItems(limit = 100) {
  const rows = await getItemRows("video_gallery_items", limit)
  return rows.map((item) => ({
    id: String(item.id),
    title: String(item.title ?? "Untitled video"),
    description: (item.description as string | null | undefined) ?? null,
    category: normalizeCategory(item.category as string | null | undefined),
    video_url: String(item.video_url ?? ""),
    thumbnail_url: (item.thumbnail_url as string | null | undefined) ?? null,
    video_date: (item.video_date as string | null | undefined) ?? null,
    published: (item.published as boolean | null | undefined) ?? true,
    created_at: (item.created_at as string | null | undefined) ?? null,
  })) as GalleryVideoItemRecord[]
}

export async function getVideoGalleryItemsForAdmin(limit = 100) {
  return getVideoGalleryItems(limit)
}
