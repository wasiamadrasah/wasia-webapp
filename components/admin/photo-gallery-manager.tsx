"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Archive, Camera, Eye, FolderPlus, Grid2x2, ImagePlus, MoreHorizontal, Pencil, Send, Sparkles, Trash2 } from "lucide-react"

import {
  createPhotoGalleryCategoryAction,
  createPhotoGalleryItemAction,
  deletePhotoGalleryCategoryAction,
  deletePhotoGalleryItemAction,
  renamePhotoGalleryCategoryAction,
  setPhotoGalleryCategoryStatusAction,
  setPhotoGalleryItemStatusAction,
  updatePhotoGalleryItemAction,
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
  image_url: string
  photo_date: string | null
  published: boolean | null
  created_at: string | null
}

type PhotoGalleryManagerProps = {
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

export function PhotoGalleryManager({ categories, items, status, message }: PhotoGalleryManagerProps) {
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
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Frontend Content</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Photo Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage categories and upload gallery photos through Cloudflare R2.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="size-4" />
                Add Category
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-xl sm:max-w-xl">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <FolderPlus className="size-5" />
                </AlertDialogMedia>
                <AlertDialogTitle>Create Photo Category</AlertDialogTitle>
                <AlertDialogDescription>Categories help you organize gallery photos by event or theme.</AlertDialogDescription>
              </AlertDialogHeader>
              <form action={createPhotoGalleryCategoryAction} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="photo-gallery-category-name">Category Name</label>
                  <input id="photo-gallery-category-name" name="category" required className="h-11 w-full rounded-xl border border-input bg-background text-foreground px-4 outline-none focus:border-primary" placeholder="e.g. Campus, Sports, Science Lab" />
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
              <Button>
                <ImagePlus className="size-4" />
                Add New Item
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="default" className="max-w-3xl sm:max-w-3xl">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Sparkles className="size-5" />
                </AlertDialogMedia>
                <AlertDialogTitle>Add Photo to Gallery</AlertDialogTitle>
                <AlertDialogDescription>Upload an image, pick a category, and it will be stored in Cloudflare R2.</AlertDialogDescription>
              </AlertDialogHeader>
              <form action={createPhotoGalleryItemAction} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="photo-title">Title</label>
                  <input id="photo-title" name="title" required className="h-12 w-full rounded-xl border border-input bg-background text-foreground px-4 text-base outline-none focus:border-primary" placeholder="Photo title" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="photo-description">Description</label>
                  <textarea id="photo-description" name="description" rows={3} className="w-full rounded-xl border border-input bg-background text-foreground px-4 py-3 outline-none focus:border-primary" placeholder="Short caption or description" />
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
                    <FieldDescription>Select a category for this photo.</FieldDescription>
                  </Field>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="photo-date">Date</label>
                    <input id="photo-date" type="date" name="photo_date" className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-1">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="photo-file">Photo File</label>
                    <input id="photo-file" name="image_file" type="file" accept="image/png,image/jpeg,image/webp" required className="block w-full rounded-xl border border-slate-300 px-4 py-2.5" />
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit">Save Photo</Button>
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
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">Categories</CardTitle>
              <Grid2x2 className="size-4 text-white/80" />
            </div>
            <CardDescription className="text-emerald-100">Organize photos by event or theme.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tracking-tight text-white">{categories.length}</CardContent>
        </Card>
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">Photos</CardTitle>
              <Camera className="size-4 text-white/80" />
            </div>
            <CardDescription className="text-sky-100">Total gallery items.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tracking-tight text-white">{items.length}</CardContent>
        </Card>
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-white/90">Published</CardTitle>
              <Eye className="size-4 text-white/80" />
            </div>
            <CardDescription className="text-violet-100">Visible on the public gallery.</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-semibold tracking-tight text-white">{items.filter((item) => item.published !== false).length}</CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border-white/70 bg-white/95 shadow-md backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">Photo Categories</CardTitle>
            <CardDescription>Active categories used in the gallery.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white px-3 py-3 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
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
                      <button id={`photo-category-edit-trigger-${category.id}`} type="button" className="hidden" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-xl sm:max-w-xl">
                      <AlertDialogHeader>
                        <AlertDialogMedia>
                          <Pencil className="size-5" />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Edit Category</AlertDialogTitle>
                        <AlertDialogDescription>Rename or archive this category.</AlertDialogDescription>
                      </AlertDialogHeader>

                      <form action={renamePhotoGalleryCategoryAction} className="space-y-4">
                        <input type="hidden" name="from_category" value={category.name} />
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700" htmlFor={`rename-photo-category-${category.id}`}>New Name</label>
                          <input id={`rename-photo-category-${category.id}`} name="to_category" defaultValue={formatCategoryLabel(category.name)} required className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-500" />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button type="submit">Rename</Button>
                        </AlertDialogFooter>
                      </form>
                    </AlertDialogContent>
                  </AlertDialog>

                  <form id={`photo-category-archive-form-${category.id}`} action={setPhotoGalleryCategoryStatusAction} className="hidden">
                    <input type="hidden" name="category" value={category.name} />
                    <input type="hidden" name="status" value="archived" />
                  </form>

                  <form id={`photo-category-publish-form-${category.id}`} action={setPhotoGalleryCategoryStatusAction} className="hidden">
                    <input type="hidden" name="category" value={category.name} />
                    <input type="hidden" name="status" value="published" />
                  </form>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button id={`photo-category-delete-trigger-${category.id}`} type="button" className="hidden" />
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

                      <form action={deletePhotoGalleryCategoryAction}>
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
                          const trigger = document.getElementById(`photo-category-edit-trigger-${category.id}`)
                          trigger?.click()
                        }}
                      >
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      {category.is_active ? (
                        <DropdownMenuItem
                          onClick={() => {
                            const form = document.getElementById(`photo-category-archive-form-${category.id}`) as HTMLFormElement | null
                            form?.requestSubmit()
                          }}
                        >
                          <Archive className="mr-2 size-4" />
                          Archive
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => {
                            const form = document.getElementById(`photo-category-publish-form-${category.id}`) as HTMLFormElement | null
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
                          const trigger = document.getElementById(`photo-category-delete-trigger-${category.id}`)
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
            {categories.length === 0 ? <p className="text-sm text-slate-500">No categories yet. Add one to start organizing photos.</p> : null}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/95 shadow-md backdrop-blur">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-xl">Recent Photos</CardTitle>
                <CardDescription>Latest uploaded gallery items.</CardDescription>
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
              <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">{filteredItems.length} filtered</Badge>
              <Badge className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 hover:bg-slate-100">Page {normalizedPage} / {totalPages}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pagedItems.map((item) => (
                <article key={item.id} className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition duration-300 hover:shadow-lg">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <Image src={item.image_url} alt={item.title} fill unoptimized className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-white/80">{formatDate(item.photo_date || item.created_at)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50/80 p-3">
                    <p className="line-clamp-1 text-sm font-semibold text-slate-900">{item.title}</p>
                    {item.description ? <p className="line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</p> : null}

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">{formatCategoryLabel(item.category)}</Badge>
                        <Badge variant="outline" className={item.published === false ? "border-slate-200 bg-slate-50 text-slate-500" : "border-emerald-200 bg-emerald-50 text-emerald-700"}>
                          {item.published === false ? "inactive" : "active"}
                        </Badge>
                        <p className="shrink-0 text-xs text-slate-500">{formatDate(item.photo_date || item.created_at)}</p>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button id={`photo-item-edit-trigger-${item.id}`} type="button" className="hidden" />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-3xl sm:max-w-3xl">
                          <AlertDialogHeader>
                            <AlertDialogMedia>
                              <Pencil className="size-5" />
                            </AlertDialogMedia>
                            <AlertDialogTitle>Edit Photo Item</AlertDialogTitle>
                            <AlertDialogDescription>Update metadata for this photo gallery item.</AlertDialogDescription>
                          </AlertDialogHeader>

                          <form action={updatePhotoGalleryItemAction} className="space-y-4">
                            <input type="hidden" name="id" value={item.id} />
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700" htmlFor={`edit-photo-title-${item.id}`}>Title</label>
                              <input id={`edit-photo-title-${item.id}`} name="title" defaultValue={item.title} required className="h-12 w-full rounded-xl border border-slate-300 px-4 text-base outline-none focus:border-emerald-500" />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700" htmlFor={`edit-photo-description-${item.id}`}>Description</label>
                              <textarea id={`edit-photo-description-${item.id}`} name="description" defaultValue={item.description ?? ""} rows={3} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500" />
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
                                <label className="text-sm font-medium text-slate-700" htmlFor={`edit-photo-date-${item.id}`}>Date</label>
                                <input id={`edit-photo-date-${item.id}`} type="date" name="photo_date" defaultValue={item.photo_date ?? ""} className="h-11 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-500" />
                              </div>
                            </div>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button type="submit">Save Changes</Button>
                            </AlertDialogFooter>
                          </form>
                        </AlertDialogContent>
                      </AlertDialog>

                      <form id={`photo-item-archive-form-${item.id}`} action={setPhotoGalleryItemStatusAction} className="hidden">
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value="archived" />
                      </form>

                      <form id={`photo-item-publish-form-${item.id}`} action={setPhotoGalleryItemStatusAction} className="hidden">
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value="published" />
                      </form>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button id={`photo-item-delete-trigger-${item.id}`} type="button" className="hidden" />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-lg sm:max-w-lg">
                          <AlertDialogHeader>
                            <AlertDialogMedia>
                              <Trash2 className="size-5" />
                            </AlertDialogMedia>
                            <AlertDialogTitle>Delete This Photo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action permanently removes the photo from the gallery.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <div className="rounded-xl border border-red-200 bg-red-50/70 p-3">
                            <p className="text-sm font-medium text-red-800">{item.title}</p>
                            <p className="mt-1 text-xs text-red-700">
                              Category: {formatCategoryLabel(item.category)}
                            </p>
                            <p className="mt-1 text-xs text-red-700">This cannot be undone.</p>
                          </div>

                          <form action={deletePhotoGalleryItemAction} className="mt-4">
                            <input type="hidden" name="id" value={item.id} />
                            <AlertDialogFooter>
                              <AlertDialogCancel className="min-w-24">Cancel</AlertDialogCancel>
                              <Button type="submit" variant="destructive" className="min-w-28">Delete Photo</Button>
                            </AlertDialogFooter>
                          </form>
                        </AlertDialogContent>
                      </AlertDialog>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-300 bg-white/80">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open photo item actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              const trigger = document.getElementById(`photo-item-edit-trigger-${item.id}`)
                              trigger?.click()
                            }}
                          >
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          {item.published === false ? (
                            <DropdownMenuItem
                              onClick={() => {
                                const form = document.getElementById(`photo-item-publish-form-${item.id}`) as HTMLFormElement | null
                                form?.requestSubmit()
                              }}
                            >
                              <Send className="mr-2 size-4" />
                              Publish
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                const form = document.getElementById(`photo-item-archive-form-${item.id}`) as HTMLFormElement | null
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
                              const trigger = document.getElementById(`photo-item-delete-trigger-${item.id}`)
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
              {filteredItems.length === 0 ? <p className="text-sm text-slate-500">No photos found for this category.</p> : null}
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
                    <PaginationItem key={`photo-page-token-${index}`}>
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
