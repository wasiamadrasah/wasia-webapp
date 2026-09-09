"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { createSupabaseAdminClient } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { uploadImage } from "@/lib/r2"

type GalleryScope = "photo" | "video"

type CategoryConfig = {
  categoryTable: string
  itemTable: string
  redirectPath: string
}

const configByScope: Record<GalleryScope, CategoryConfig> = {
  photo: {
    categoryTable: "photo_gallery_categories",
    itemTable: "photo_gallery_items",
    redirectPath: "/admin/photo-gallery",
  },
  video: {
    categoryTable: "video_gallery_categories",
    itemTable: "video_gallery_items",
    redirectPath: "/admin/video-gallery",
  },
}

function isRedirectError(error: unknown) {
  return error instanceof Error && error.message.includes("NEXT_REDIRECT")
}

async function requireAdminSession() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== "admin") {
    redirect("/admin/login")
  }
}

async function getAdminSupabaseClient() {
  await requireAdminSession()
  return createSupabaseAdminClient()
}

function redirectWithMessage(path: string, status: "success" | "error", message: string) {
  const params = new URLSearchParams({ status, message })
  redirect(`${path}?${params.toString()}`)
}

function isMissingTableError(error: { code?: string; message?: string } | null) {
  if (!error) return false

  const message = (error.message ?? "").toLowerCase()
  return error.code === "PGRST205" || message.includes("schema cache") || (message.includes("relation") && message.includes("does not exist"))
}

function normalizeCategoryName(input: FormDataEntryValue | null) {
  const value = typeof input === "string" ? input.trim() : ""
  return (value || "general").toLowerCase()
}

async function upsertCategory(scope: GalleryScope, categoryName: string) {
  const { categoryTable } = configByScope[scope]
  const supabase = await getAdminSupabaseClient()

  const { error } = await supabase
    .from(categoryTable)
    .upsert(
      [
        {
          name: categoryName.toLowerCase(),
          is_active: true,
        },
      ],
      { onConflict: "name" }
    )

  if (error && !isMissingTableError(error)) {
    throw new Error(error.message)
  }
}

async function insertGalleryItem(scope: GalleryScope, payload: Record<string, unknown>) {
  const { itemTable } = configByScope[scope]
  const supabase = await getAdminSupabaseClient()

  const { error } = await supabase.from(itemTable).insert(payload)

  if (error && !isMissingTableError(error)) {
    throw new Error(error.message)
  }
}

async function renameCategory(scope: GalleryScope, fromCategory: string, toCategory: string) {
  const { categoryTable, itemTable } = configByScope[scope]
  const supabase = await getAdminSupabaseClient()

  await upsertCategory(scope, toCategory)

  const { error: moveItemsError } = await supabase
    .from(itemTable)
    .update({ category: toCategory })
    .eq("category", fromCategory)

  if (moveItemsError && !isMissingTableError(moveItemsError)) {
    throw new Error(moveItemsError.message)
  }

  const { error: deleteOldError } = await supabase
    .from(categoryTable)
    .delete()
    .eq("name", fromCategory)
    .neq("name", "general")

  if (deleteOldError && !isMissingTableError(deleteOldError)) {
    throw new Error(deleteOldError.message)
  }
}

async function setCategoryStatus(scope: GalleryScope, category: string, status: "published" | "archived") {
  const { categoryTable } = configByScope[scope]
  const supabase = await getAdminSupabaseClient()

  const { error } = await supabase
    .from(categoryTable)
    .update({ is_active: status === "published" })
    .eq("name", category)

  if (error && !isMissingTableError(error)) {
    throw new Error(error.message)
  }
}

async function deleteCategory(scope: GalleryScope, category: string) {
  const { categoryTable, itemTable } = configByScope[scope]
  const supabase = await getAdminSupabaseClient()

  if (category === "general") {
    throw new Error("The general category cannot be deleted.")
  }

  const { error: moveItemsError } = await supabase
    .from(itemTable)
    .update({ category: "general" })
    .eq("category", category)

  if (moveItemsError && !isMissingTableError(moveItemsError)) {
    throw new Error(moveItemsError.message)
  }

  await upsertCategory(scope, "general")

  const { error: deleteCategoryError } = await supabase
    .from(categoryTable)
    .delete()
    .eq("name", category)
    .neq("name", "general")

  if (deleteCategoryError && !isMissingTableError(deleteCategoryError)) {
    throw new Error(deleteCategoryError.message)
  }
}

export async function createPhotoGalleryCategoryAction(formData: FormData) {
  try {
    const category = normalizeCategoryName(formData.get("category"))
    await upsertCategory("photo", category)

    revalidatePath("/admin/photo-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/photo-gallery", "success", "Photo category added.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to add photo category."
    redirectWithMessage("/admin/photo-gallery", "error", message)
  }
}

export async function createVideoGalleryCategoryAction(formData: FormData) {
  try {
    const category = normalizeCategoryName(formData.get("category"))
    await upsertCategory("video", category)

    revalidatePath("/admin/video-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/video-gallery", "success", "Video category added.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to add video category."
    redirectWithMessage("/admin/video-gallery", "error", message)
  }
}

export async function createPhotoGalleryItemAction(formData: FormData) {
  try {
    const title = typeof formData.get("title") === "string" ? (formData.get("title") as string).trim() : ""
    const description = typeof formData.get("description") === "string" ? (formData.get("description") as string).trim() : ""
    const category = normalizeCategoryName(formData.get("category"))
    const dateValue = typeof formData.get("photo_date") === "string" ? (formData.get("photo_date") as string).trim() : ""
    const imageFile = formData.get("image_file")

    if (!title) {
      throw new Error("Photo title is required.")
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      throw new Error("Photo image is required.")
    }

    await upsertCategory("photo", category)
    const uploadResult = await uploadImage(imageFile, `photo-gallery/${category}`)

    if (!uploadResult.success || !uploadResult.url) {
      throw new Error(uploadResult.error || "Failed to upload photo image.")
    }

    await insertGalleryItem("photo", {
      title,
      description: description || null,
      category,
      image_url: uploadResult.url,
      photo_date: dateValue || null,
      published: true,
    })

    revalidatePath("/admin/photo-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/photo-gallery", "success", "Photo added to gallery.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to add photo item."
    redirectWithMessage("/admin/photo-gallery", "error", message)
  }
}

export async function createVideoGalleryItemAction(formData: FormData) {
  try {
    const title = typeof formData.get("title") === "string" ? (formData.get("title") as string).trim() : ""
    const description = typeof formData.get("description") === "string" ? (formData.get("description") as string).trim() : ""
    const category = normalizeCategoryName(formData.get("category"))
    const dateValue = typeof formData.get("video_date") === "string" ? (formData.get("video_date") as string).trim() : ""
    const videoUrl = typeof formData.get("video_url") === "string" ? (formData.get("video_url") as string).trim() : ""
    const thumbnailUrl = typeof formData.get("thumbnail_url") === "string" ? (formData.get("thumbnail_url") as string).trim() : ""

    if (!title) {
      throw new Error("Video title is required.")
    }

    if (!videoUrl) {
      throw new Error("Video URL is required.")
    }

    await upsertCategory("video", category)

    await insertGalleryItem("video", {
      title,
      description: description || null,
      category,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl || null,
      video_date: dateValue || null,
      published: true,
    })

    revalidatePath("/admin/video-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/video-gallery", "success", "Video added to gallery.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to add video item."
    redirectWithMessage("/admin/video-gallery", "error", message)
  }
}

export async function updatePhotoGalleryItemAction(formData: FormData) {
  try {
    const id = typeof formData.get("id") === "string" ? (formData.get("id") as string).trim() : ""
    const title = typeof formData.get("title") === "string" ? (formData.get("title") as string).trim() : ""
    const description = typeof formData.get("description") === "string" ? (formData.get("description") as string).trim() : ""
    const category = normalizeCategoryName(formData.get("category"))
    const photoDate = typeof formData.get("photo_date") === "string" ? (formData.get("photo_date") as string).trim() : ""

    if (!id) throw new Error("Photo item id is required.")
    if (!title) throw new Error("Photo title is required.")

    await upsertCategory("photo", category)
    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("photo_gallery_items")
      .update({
        title,
        description: description || null,
        category,
        photo_date: photoDate || null,
      })
      .eq("id", id)

    if (error && !isMissingTableError(error)) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/photo-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/photo-gallery", "success", "Photo updated.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to update photo item."
    redirectWithMessage("/admin/photo-gallery", "error", message)
  }
}

export async function deletePhotoGalleryItemAction(formData: FormData) {
  try {
    const id = typeof formData.get("id") === "string" ? (formData.get("id") as string).trim() : ""
    if (!id) throw new Error("Photo item id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("photo_gallery_items").delete().eq("id", id)

    if (error && !isMissingTableError(error)) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/photo-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/photo-gallery", "success", "Photo deleted.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to delete photo item."
    redirectWithMessage("/admin/photo-gallery", "error", message)
  }
}

export async function setPhotoGalleryItemStatusAction(formData: FormData) {
  try {
    const id = typeof formData.get("id") === "string" ? (formData.get("id") as string).trim() : ""
    const statusRaw = typeof formData.get("status") === "string" ? (formData.get("status") as string).trim().toLowerCase() : ""
    const status = statusRaw === "archived" ? "archived" : "published"

    if (!id) {
      throw new Error("Photo item id is required.")
    }

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("photo_gallery_items")
      .update({ published: status === "published" })
      .eq("id", id)

    if (error && !isMissingTableError(error)) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/photo-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/photo-gallery", "success", "Photo item status updated.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to update photo item status."
    redirectWithMessage("/admin/photo-gallery", "error", message)
  }
}

export async function updateVideoGalleryItemAction(formData: FormData) {
  try {
    const id = typeof formData.get("id") === "string" ? (formData.get("id") as string).trim() : ""
    const title = typeof formData.get("title") === "string" ? (formData.get("title") as string).trim() : ""
    const description = typeof formData.get("description") === "string" ? (formData.get("description") as string).trim() : ""
    const category = normalizeCategoryName(formData.get("category"))
    const videoDate = typeof formData.get("video_date") === "string" ? (formData.get("video_date") as string).trim() : ""
    const videoUrl = typeof formData.get("video_url") === "string" ? (formData.get("video_url") as string).trim() : ""
    const thumbnailUrl = typeof formData.get("thumbnail_url") === "string" ? (formData.get("thumbnail_url") as string).trim() : ""

    if (!id) throw new Error("Video item id is required.")
    if (!title) throw new Error("Video title is required.")
    if (!videoUrl) throw new Error("Video URL is required.")

    await upsertCategory("video", category)
    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("video_gallery_items")
      .update({
        title,
        description: description || null,
        category,
        video_date: videoDate || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
      })
      .eq("id", id)

    if (error && !isMissingTableError(error)) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/video-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/video-gallery", "success", "Video updated.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to update video item."
    redirectWithMessage("/admin/video-gallery", "error", message)
  }
}

export async function deleteVideoGalleryItemAction(formData: FormData) {
  try {
    const id = typeof formData.get("id") === "string" ? (formData.get("id") as string).trim() : ""
    if (!id) throw new Error("Video item id is required.")

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase.from("video_gallery_items").delete().eq("id", id)

    if (error && !isMissingTableError(error)) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/video-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/video-gallery", "success", "Video deleted.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to delete video item."
    redirectWithMessage("/admin/video-gallery", "error", message)
  }
}

export async function setVideoGalleryItemStatusAction(formData: FormData) {
  try {
    const id = typeof formData.get("id") === "string" ? (formData.get("id") as string).trim() : ""
    const statusRaw = typeof formData.get("status") === "string" ? (formData.get("status") as string).trim().toLowerCase() : ""
    const status = statusRaw === "archived" ? "archived" : "published"

    if (!id) {
      throw new Error("Video item id is required.")
    }

    const supabase = await getAdminSupabaseClient()
    const { error } = await supabase
      .from("video_gallery_items")
      .update({ published: status === "published" })
      .eq("id", id)

    if (error && !isMissingTableError(error)) {
      throw new Error(error.message)
    }

    revalidatePath("/admin/video-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/video-gallery", "success", "Video item status updated.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to update video item status."
    redirectWithMessage("/admin/video-gallery", "error", message)
  }
}

export async function renamePhotoGalleryCategoryAction(formData: FormData) {
  try {
    const fromCategory = normalizeCategoryName(formData.get("from_category"))
    const toCategory = normalizeCategoryName(formData.get("to_category"))

    if (!fromCategory || !toCategory) {
      throw new Error("Both source and destination categories are required.")
    }

    await renameCategory("photo", fromCategory, toCategory)
    revalidatePath("/admin/photo-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/photo-gallery", "success", "Photo category renamed.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to rename photo category."
    redirectWithMessage("/admin/photo-gallery", "error", message)
  }
}

export async function setPhotoGalleryCategoryStatusAction(formData: FormData) {
  try {
    const category = normalizeCategoryName(formData.get("category"))
    const statusRaw = typeof formData.get("status") === "string" ? (formData.get("status") as string).trim().toLowerCase() : ""
    const status = statusRaw === "archived" ? "archived" : "published"

    await setCategoryStatus("photo", category, status)
    revalidatePath("/admin/photo-gallery")
    redirectWithMessage("/admin/photo-gallery", "success", "Photo category status updated.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to update photo category status."
    redirectWithMessage("/admin/photo-gallery", "error", message)
  }
}

export async function deletePhotoGalleryCategoryAction(formData: FormData) {
  try {
    const category = normalizeCategoryName(formData.get("category"))
    await deleteCategory("photo", category)
    revalidatePath("/admin/photo-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/photo-gallery", "success", "Photo category deleted.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to delete photo category."
    redirectWithMessage("/admin/photo-gallery", "error", message)
  }
}

export async function renameVideoGalleryCategoryAction(formData: FormData) {
  try {
    const fromCategory = normalizeCategoryName(formData.get("from_category"))
    const toCategory = normalizeCategoryName(formData.get("to_category"))

    if (!fromCategory || !toCategory) {
      throw new Error("Both source and destination categories are required.")
    }

    await renameCategory("video", fromCategory, toCategory)
    revalidatePath("/admin/video-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/video-gallery", "success", "Video category renamed.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to rename video category."
    redirectWithMessage("/admin/video-gallery", "error", message)
  }
}

export async function setVideoGalleryCategoryStatusAction(formData: FormData) {
  try {
    const category = normalizeCategoryName(formData.get("category"))
    const statusRaw = typeof formData.get("status") === "string" ? (formData.get("status") as string).trim().toLowerCase() : ""
    const status = statusRaw === "archived" ? "archived" : "published"

    await setCategoryStatus("video", category, status)
    revalidatePath("/admin/video-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/video-gallery", "success", "Video category status updated.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to update video category status."
    redirectWithMessage("/admin/video-gallery", "error", message)
  }
}

export async function deleteVideoGalleryCategoryAction(formData: FormData) {
  try {
    const category = normalizeCategoryName(formData.get("category"))
    await deleteCategory("video", category)
    revalidatePath("/admin/video-gallery")
    revalidatePath("/gallery")
    redirectWithMessage("/admin/video-gallery", "success", "Video category deleted.")
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    const message = error instanceof Error ? error.message : "Failed to delete video category."
    redirectWithMessage("/admin/video-gallery", "error", message)
  }
}

