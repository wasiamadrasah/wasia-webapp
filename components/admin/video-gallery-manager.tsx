"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Archive, Clapperboard, Eye, FolderPlus, Grid2x2, MoreHorizontal, Pencil, Play, Plus, Send, Trash2, Video } from "lucide-react"

import {
  createVideoGalleryCategoryAction,
  createVideoGalleryItemAction,
  deleteVideoGalleryCategoryAction,
  deleteVideoGalleryItemAction,
  renameVideoGalleryCategoryAction,
  setVideoGalleryCategoryStatusAction,
  setVideoGalleryItemStatusAction,
  updateVideoGalleryItemAction,
} from "@/app/admin/web-config/gallery-actions"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Category = {
  id: string
  name: string
  is_active: boolean
  created_at: string | null
}

type Item = {
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

type VideoGalleryManagerProps = {
  categories: Category[]
  items: Item[]
  status?: string
  message?: string
}

function formatDate(value: string | null) {
  if (!value) return "No date"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("en-BD", { day: "2-digit", month: "short", year: "numeric" }).format(date)
}

function formatCategoryLabel(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function VideoGalleryManager({ categories, items, status, message }: VideoGalleryManagerProps) {
  const [page, setPage] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [newItemCategory, setNewItemCategory] = useState(categories[0]?.name ?? "general")
  const [editItemCategories, setEditItemCategories] = useState<Record<string, string>>({})
  const itemsPerPage = 6

  const filteredItems = useMemo(() => {
    if (categoryFilter === "all") return items
    return items.filter((item) => item.category === categoryFilter)
  }, [items, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))
  const normalizedPage = Math.min(page, totalPages)

  const pagedItems = useMemo(() => {
    const start = (normalizedPage - 1) * itemsPerPage
    return filteredItems.slice(start, start + itemsPerPage)
  }, [filteredItems, normalizedPage])

  const pageTokens = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (normalizedPage <= 3) {
      return [1, 2, 3, 4, "ellipsis", totalPages] as const
    }

    if (normalizedPage >= totalPages - 2) {
      return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const
    }

    return [1, "ellipsis", normalizedPage - 1, normalizedPage, normalizedPage + 1, "ellipsis", totalPages] as const
  }, [normalizedPage, totalPages])

  const counts = new Map<string, number>()
  for (const item of items) {
    const key = item.category.trim().toLowerCase()
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Frontend Content</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Video Gallery</h1>
          <p className="mt-1 text-sm text-slate-600">Manage categories and add video gallery content.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-cyan-300 bg-white/90 text-cyan-700 shadow-sm hover:bg-cyan-50">
                <FolderPlus className="size-4" />
                Add Category
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-xl sm:max-w-xl">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <FolderPlus className="size-5" />
                </AlertDialogMedia>
                <AlertDialogTitle>Create Video Category</AlertDialogTitle>
                <AlertDialogDescription>Use categories to group videos by events, clubs, and activities.</AlertDialogDescription>
              </AlertDialogHeader>
              <form action={createVideoGalleryCategoryAction} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="video-gallery-category-name">Category Name</label>
                  <input id="video-gallery-category-name" name="category" required className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-500" placeholder="e.g. Events, Ceremonies, Workshops" />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit">Create Category</Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-sm hover:from-cyan-700 hover:to-sky-700">
                <Plus className="size-4" />
                Add New Item
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="default" className="max-w-3xl sm:max-w-3xl">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Video className="size-5" />
                </AlertDialogMedia>
                <AlertDialogTitle>Add Video to Gallery</AlertDialogTitle>
                <AlertDialogDescription>Enter the video URL and optionally provide a thumbnail image URL.</AlertDialogDescription>
              </AlertDialogHeader>
              <form action={createVideoGalleryItemAction} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="video-title">Title</label>
                  <input id="video-title" name="title" required className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none focus:border-emerald-500" placeholder="Video title" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="video-description">Description</label>
                  <textarea id="video-description" name="description" rows={3} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Short caption or description" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field className="w-full">
                    <FieldLabel>Category</FieldLabel>
                    <input type="hidden" name="category" value={newItemCategory} />
                    <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                      <SelectTrigger className="h-11 w-full rounded-xl px-4">
                        <SelectValue placeholder="Choose category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.length === 0 ? <SelectItem value="general">General</SelectItem> : null}
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>{formatCategoryLabel(category.name)}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldDescription>Select a category for this video.</FieldDescription>
                  </Field>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="video-date">Date</label>
                    <input id="video-date" type="date" name="video_date" className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="video-url">Video URL</label>
                    <input id="video-url" name="video_url" required className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-500" placeholder="https://youtube.com/..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="thumbnail-url">Thumbnail URL</label>
                    <input id="thumbnail-url" name="thumbnail_url" className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-500" placeholder="https://.../thumb.jpg" />
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit">Save Video</Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {message ? (
        <div className={`relative rounded-2xl border px-4 py-3 text-sm shadow-sm ${status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>
          {message}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">Categories</CardTitle>
              <Grid2x2 className="size-4 text-white/80" />
            </div>
            <CardDescription className="text-cyan-100">Organize videos by theme.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tracking-tight text-white">{categories.length}</CardContent>
        </Card>
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">Videos</CardTitle>
              <Clapperboard className="size-4 text-white/80" />
            </div>
            <CardDescription className="text-amber-100">Total gallery items.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tracking-tight text-white">{items.length}</CardContent>
        </Card>
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">Published</CardTitle>
              <Eye className="size-4 text-white/80" />
            </div>
            <CardDescription className="text-fuchsia-100">Visible on the public gallery.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tracking-tight text-white">{items.filter((item) => item.published !== false).length}</CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border-white/70 bg-white/95 shadow-md backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">Video Categories</CardTitle>
            <CardDescription>Active categories used in the gallery.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white px-3 py-3 shadow-sm transition hover:border-cyan-200 hover:shadow-md">
                <div>
                  <p className="font-medium text-slate-900">{formatCategoryLabel(category.name)}</p>
                  <p className="text-xs text-slate-500">{counts.get(category.name.trim().toLowerCase()) ?? 0} items</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={category.is_active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"}>
                    {category.is_active ? "active" : "inactive"}
                  </Badge>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button id={`video-category-edit-trigger-${category.id}`} type="button" className="hidden" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-xl sm:max-w-xl">
                      <AlertDialogHeader>
                        <AlertDialogMedia>
                          <Pencil className="size-5" />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Edit Category</AlertDialogTitle>
                        <AlertDialogDescription>Rename or archive this category.</AlertDialogDescription>
                      </AlertDialogHeader>

                      <form action={renameVideoGalleryCategoryAction} className="space-y-4">
                        <input type="hidden" name="from_category" value={category.name} />
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700" htmlFor={`rename-video-category-${category.id}`}>New Name</label>
                          <input id={`rename-video-category-${category.id}`} name="to_category" defaultValue={formatCategoryLabel(category.name)} required className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-500" />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button type="submit">Rename</Button>
                        </AlertDialogFooter>
                      </form>
                    </AlertDialogContent>
                  </AlertDialog>

                  <form id={`video-category-archive-form-${category.id}`} action={setVideoGalleryCategoryStatusAction} className="hidden">
                    <input type="hidden" name="category" value={category.name} />
                    <input type="hidden" name="status" value="archived" />
                  </form>

                  <form id={`video-category-publish-form-${category.id}`} action={setVideoGalleryCategoryStatusAction} className="hidden">
                    <input type="hidden" name="category" value={category.name} />
                    <input type="hidden" name="status" value="published" />
                  </form>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button id={`video-category-delete-trigger-${category.id}`} type="button" className="hidden" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-lg sm:max-w-lg">
                      <AlertDialogHeader>
                        <AlertDialogMedia>
                          <Trash2 className="size-5" />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will move all items in {formatCategoryLabel(category.name)} to General and delete the category.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <form action={deleteVideoGalleryCategoryAction}>
                        <input type="hidden" name="category" value={category.name} />
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button type="submit" variant="destructive" disabled={category.name === "general"}>Delete</Button>
                        </AlertDialogFooter>
                      </form>
                    </AlertDialogContent>
                  </AlertDialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open category actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          const trigger = document.getElementById(`video-category-edit-trigger-${category.id}`)
                          trigger?.click()
                        }}
                      >
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      {category.is_active ? (
                        <DropdownMenuItem
                          onClick={() => {
                            const form = document.getElementById(`video-category-archive-form-${category.id}`) as HTMLFormElement | null
                            form?.requestSubmit()
                          }}
                        >
                          <Archive className="mr-2 size-4" />
                          Archive
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => {
                            const form = document.getElementById(`video-category-publish-form-${category.id}`) as HTMLFormElement | null
                            form?.requestSubmit()
                          }}
                        >
                          <Send className="mr-2 size-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        disabled={category.name === "general"}
                        className="text-red-600 focus:text-red-700"
                        onClick={() => {
                          const trigger = document.getElementById(`video-category-delete-trigger-${category.id}`)
                          trigger?.click()
                        }}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {categories.length === 0 ? <p className="text-sm text-slate-500">No categories yet. Add one to start organizing videos.</p> : null}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/95 shadow-md backdrop-blur">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-xl">Recent Videos</CardTitle>
                <CardDescription>Latest added videos and their links.</CardDescription>
              </div>
              <Field className="w-full sm:max-w-52">
                <FieldLabel>Filter By Category</FieldLabel>
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => {
                    setCategoryFilter(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl px-3.5">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>{formatCategoryLabel(category.name)}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-700 hover:bg-cyan-100">{filteredItems.length} filtered</Badge>
              <Badge className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-100">Page {normalizedPage} / {totalPages}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pagedItems.map((item) => (
                <article key={item.id} className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition duration-300 hover:shadow-lg">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {item.thumbnail_url ? (
                      <Image src={item.thumbnail_url} alt={item.title} fill unoptimized className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 to-slate-700 text-white">
                        <Play className="size-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-white/80">{formatDate(item.video_date || item.created_at)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50/80 p-3">
                    <p className="line-clamp-1 text-sm font-semibold text-slate-900">{item.title}</p>
                    <a href={item.video_url} target="_blank" rel="noreferrer" className="block truncate text-xs text-emerald-700 hover:text-emerald-900">
                      {item.video_url}
                    </a>
                    {item.description ? <p className="line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</p> : null}

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">{formatCategoryLabel(item.category)}</Badge>
                        <Badge variant="outline" className={item.published === false ? "border-slate-200 bg-slate-50 text-slate-500" : "border-emerald-200 bg-emerald-50 text-emerald-700"}>
                          {item.published === false ? "inactive" : "active"}
                        </Badge>
                        <p className="shrink-0 text-xs text-slate-500">{formatDate(item.video_date || item.created_at)}</p>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button id={`video-item-edit-trigger-${item.id}`} type="button" className="hidden" />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-3xl sm:max-w-3xl">
                          <AlertDialogHeader>
                            <AlertDialogMedia>
                              <Pencil className="size-5" />
                            </AlertDialogMedia>
                            <AlertDialogTitle>Edit Video Item</AlertDialogTitle>
                            <AlertDialogDescription>Update video details and metadata.</AlertDialogDescription>
                          </AlertDialogHeader>

                          <form action={updateVideoGalleryItemAction} className="space-y-4">
                            <input type="hidden" name="id" value={item.id} />
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700" htmlFor={`edit-video-title-${item.id}`}>Title</label>
                              <input id={`edit-video-title-${item.id}`} name="title" defaultValue={item.title} required className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none focus:border-emerald-500" />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700" htmlFor={`edit-video-description-${item.id}`}>Description</label>
                              <textarea id={`edit-video-description-${item.id}`} name="description" defaultValue={item.description ?? ""} rows={3} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500" />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <Field className="w-full">
                                <FieldLabel>Category</FieldLabel>
                                <input type="hidden" name="category" value={editItemCategories[item.id] ?? item.category} />
                                <Select
                                  value={editItemCategories[item.id] ?? item.category}
                                  onValueChange={(value) => {
                                    setEditItemCategories((previous) => ({ ...previous, [item.id]: value }))
                                  }}
                                >
                                  <SelectTrigger className="h-11 w-full rounded-xl px-4">
                                    <SelectValue placeholder="Choose category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {categories.length === 0 ? <SelectItem value="general">General</SelectItem> : null}
                                      {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.name}>{formatCategoryLabel(category.name)}</SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </Field>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700" htmlFor={`edit-video-date-${item.id}`}>Date</label>
                                <input id={`edit-video-date-${item.id}`} type="date" name="video_date" defaultValue={item.video_date ?? ""} className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-500" />
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700" htmlFor={`edit-video-url-${item.id}`}>Video URL</label>
                                <input id={`edit-video-url-${item.id}`} name="video_url" defaultValue={item.video_url} required className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-500" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700" htmlFor={`edit-video-thumbnail-${item.id}`}>Thumbnail URL</label>
                                <input id={`edit-video-thumbnail-${item.id}`} name="thumbnail_url" defaultValue={item.thumbnail_url ?? ""} className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-500" />
                              </div>
                            </div>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button type="submit">Save Changes</Button>
                            </AlertDialogFooter>
                          </form>
                        </AlertDialogContent>
                      </AlertDialog>

                      <form id={`video-item-archive-form-${item.id}`} action={setVideoGalleryItemStatusAction} className="hidden">
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value="archived" />
                      </form>

                      <form id={`video-item-publish-form-${item.id}`} action={setVideoGalleryItemStatusAction} className="hidden">
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value="published" />
                      </form>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button id={`video-item-delete-trigger-${item.id}`} type="button" className="hidden" />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-lg sm:max-w-lg">
                          <AlertDialogHeader>
                            <AlertDialogMedia>
                              <Trash2 className="size-5" />
                            </AlertDialogMedia>
                            <AlertDialogTitle>Delete This Video?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action permanently removes the video from the gallery.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <div className="rounded-xl border border-red-200 bg-red-50/70 p-3">
                            <p className="text-sm font-medium text-red-800">{item.title}</p>
                            <p className="mt-1 text-xs text-red-700">
                              Category: {formatCategoryLabel(item.category)}
                            </p>
                            <p className="mt-1 text-xs text-red-700">This cannot be undone.</p>
                          </div>

                          <form action={deleteVideoGalleryItemAction} className="mt-4">
                            <input type="hidden" name="id" value={item.id} />
                            <AlertDialogFooter>
                              <AlertDialogCancel className="min-w-24">Cancel</AlertDialogCancel>
                              <Button type="submit" variant="destructive" className="min-w-28">Delete Video</Button>
                            </AlertDialogFooter>
                          </form>
                        </AlertDialogContent>
                      </AlertDialog>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-300 bg-white/80">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open video item actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              const trigger = document.getElementById(`video-item-edit-trigger-${item.id}`)
                              trigger?.click()
                            }}
                          >
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          {item.published === false ? (
                            <DropdownMenuItem
                              onClick={() => {
                                const form = document.getElementById(`video-item-publish-form-${item.id}`) as HTMLFormElement | null
                                form?.requestSubmit()
                              }}
                            >
                              <Send className="mr-2 size-4" />
                              Publish
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                const form = document.getElementById(`video-item-archive-form-${item.id}`) as HTMLFormElement | null
                                form?.requestSubmit()
                              }}
                            >
                              <Archive className="mr-2 size-4" />
                              Archive
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-700"
                            onClick={() => {
                              const trigger = document.getElementById(`video-item-delete-trigger-${item.id}`)
                              trigger?.click()
                            }}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </article>
              ))}
              {filteredItems.length === 0 ? <p className="text-sm text-slate-500">No videos found for this category.</p> : null}
            </div>
            {filteredItems.length > 0 ? (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        setPage((previous) => Math.max(1, previous - 1))
                      }}
                    />
                  </PaginationItem>

                  {pageTokens.map((token, index) => (
                    <PaginationItem key={`video-page-token-${index}`}>
                      {token === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={token === normalizedPage}
                          onClick={(event) => {
                            event.preventDefault()
                            setPage(token)
                          }}
                        >
                          {token}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        setPage((previous) => Math.min(totalPages, previous + 1))
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
