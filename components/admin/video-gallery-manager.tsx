"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  Archive,
  Clapperboard,
  Eye,
  FolderPlus,
  Grid2x2,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Search,
  Send,
  Trash2,
  Video,
  CheckCircle2,
  SlidersHorizontal,
  Calendar,
  ExternalLink,
} from "lucide-react"

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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/digicampus/page-header"
import { AdminActionsDropdown } from "@/components/admin/admin-actions-dropdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [newItemCategory, setNewItemCategory] = useState(categories[0]?.name ?? "general")
  const [editItemCategories, setEditItemCategories] = useState<Record<string, string>>({})
  const [activeVideo, setActiveVideo] = useState<Item | null>(null)
  const [editingVideo, setEditingVideo] = useState<Item | null>(null)
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)

  const itemsPerPage = 12

  // Calculate category item counts
  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of items) {
      const key = item.category.trim().toLowerCase()
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return map
  }, [items])

  // Filter items by category and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [items, categoryFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))
  const normalizedPage = Math.min(page, totalPages)

  const pagedItems = useMemo(() => {
    const start = (normalizedPage - 1) * itemsPerPage
    return filteredItems.slice(start, start + itemsPerPage)
  }, [filteredItems, normalizedPage, itemsPerPage])

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

  const publishedCount = useMemo(() => items.filter((item) => item.published !== false).length, [items])

  return (
    <div className="w-full max-w-full space-y-6">
      {/* ── Standard DigiCampus Page Header ── */}
      <PageHeader
        title="Video Gallery"
        description="Curate campus video highlights, ceremony recordings, and academic multimedia collections."
        action={
          <div className="flex items-center gap-2.5">
            {/* Add Category Dialog */}
            <AlertDialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-lg border-border text-foreground hover:bg-muted/50 gap-1.5 font-medium text-sm cursor-pointer"
                >
                  <FolderPlus className="size-4 text-muted-foreground" />
                  <span>Add Category</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md">
                <form action={createVideoGalleryCategoryAction}>
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-primary/10 text-primary">
                      <FolderPlus className="size-5" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Create Video Category</AlertDialogTitle>
                    <AlertDialogDescription>
                      Group video highlights by events, annual programs, or academic activities.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="grid gap-4 px-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-cat-name" className="text-sm font-bold text-foreground">
                        Category Name <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="video-cat-name"
                        name="category"
                        required
                        placeholder="e.g. Annual Sports, Speeches, Workshops"
                        className="h-10 text-sm border-border"
                      />
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                      Create Category
                    </Button>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>

            {/* Upload Video Dialog */}
            <AlertDialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  className="h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 font-semibold text-sm shadow-xs cursor-pointer px-4"
                >
                  <Plus className="size-4" />
                  <span>Add Video</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-xl">
                <form
                  action={createVideoGalleryItemAction}
                  onSubmit={() => setIsAddVideoOpen(false)}
                  className="space-y-0"
                >
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-primary/10 text-primary">
                      <Video className="size-5" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Add Video to Gallery</AlertDialogTitle>
                    <AlertDialogDescription>
                      Embed a video URL from YouTube, Vimeo, or a direct media link.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="grid gap-4 px-6 py-4 max-h-[70vh] overflow-y-auto">
                    {/* Video URL */}
                    <div className="space-y-2">
                      <Label htmlFor="video-url" className="text-sm font-bold text-foreground">
                        Video URL <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="video-url"
                        name="video_url"
                        required
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="h-10 text-sm border-border"
                      />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="video-title" className="text-sm font-bold text-foreground">
                        Title <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="video-title"
                        name="title"
                        required
                        placeholder="e.g. Annual Convocation Ceremony 2026"
                        className="h-10 text-sm border-border"
                      />
                    </div>

                    {/* Thumbnail URL */}
                    <div className="space-y-2">
                      <Label htmlFor="thumb-url" className="text-sm font-bold text-foreground">
                        Custom Thumbnail Image URL (Optional)
                      </Label>
                      <Input
                        id="thumb-url"
                        name="thumbnail_url"
                        placeholder="https://.../thumbnail.jpg (Leave empty for auto)"
                        className="h-10 text-sm border-border"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="video-desc" className="text-sm font-bold text-foreground">
                        Caption / Description
                      </Label>
                      <textarea
                        id="video-desc"
                        name="description"
                        rows={3}
                        placeholder="Optional summary or description of the video..."
                        className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>

                    {/* Category & Date Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-foreground">Category</Label>
                        <input type="hidden" name="category" value={newItemCategory} />
                        <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                          <SelectTrigger className="h-10 text-sm border-border">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {categories.length === 0 ? <SelectItem value="general">General</SelectItem> : null}
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {formatCategoryLabel(category.name)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="video-date" className="text-sm font-bold text-foreground">
                          Event Date
                        </Label>
                        <Input
                          id="video-date"
                          type="date"
                          name="video_date"
                          className="h-10 text-sm border-border"
                        />
                      </div>
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsAddVideoOpen(false)}>Cancel</AlertDialogCancel>
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                      Save & Publish Video
                    </Button>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      {/* ── Feedback Message Banner ── */}
      {message ? (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-medium shadow-2xs animate-in fade-in-50 duration-200 ${
            status === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400"
          }`}
        >
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{message}</span>
        </div>
      ) : null}

      {/* ── Metric Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Videos */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Videos</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clapperboard className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground">{items.length}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              Video Clips
            </span>
          </div>
        </div>

        {/* Published Videos */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Publicly</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Eye className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground">{publishedCount}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              Published
            </span>
          </div>
        </div>
      </div>

      {/* ── Full-Width Filter & Search Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-2xs">
        <div className="flex flex-1 items-center gap-3 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search videos by title or caption..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="h-10 pl-9 text-xs border-border bg-background"
            />
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              setCategoryFilter(val)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-10 w-44 text-xs border-border bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Categories ({items.length})</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {formatCategoryLabel(c.name)} ({counts.get(c.name.trim().toLowerCase()) ?? 0})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <SlidersHorizontal className="size-3.5 text-primary" />
            <span>
              Showing {filteredItems.length} of {items.length} Videos
            </span>
          </div>
        </div>
      </div>

      {/* ── Full-Width Video Cards Grid ── */}
      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center space-y-3">
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Video className="size-6" />
          </div>
          <h4 className="text-base font-bold text-foreground">No Videos Found</h4>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            {searchQuery || categoryFilter !== "all"
              ? "No videos match your filter criteria. Try selecting another category or clearing the search."
              : "Start building your video gallery by adding your first clip."}
          </p>
          <Button
            size="sm"
            onClick={() => setIsAddVideoOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold mt-2 cursor-pointer"
          >
            <Plus className="size-3.5 mr-1" />
            Add New Video
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
          {pagedItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-border bg-card shadow-2xs overflow-hidden transition-all hover:shadow-md hover:border-primary/40 flex flex-col"
            >
              {/* Video Thumbnail with Play Button */}
              <div
                onClick={() => setActiveVideo(item)}
                className="relative aspect-16/10 w-full bg-slate-950 overflow-hidden cursor-pointer flex items-center justify-center"
              >
                {item.thumbnail_url ? (
                  <Image
                    src={item.thumbnail_url}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover opacity-85 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                )}

                {/* Play Badge */}
                <div className="relative size-11 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="size-4.5 fill-current ml-0.5" />
                </div>

                {/* Top Overlay Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-background/90 text-foreground backdrop-blur-xs shadow-xs">
                    {formatCategoryLabel(item.category)}
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  {item.published === false ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted/90 text-muted-foreground backdrop-blur-xs shadow-xs">
                      Draft
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-xs shadow-xs">
                      Live
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-foreground truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="size-3" />
                    <span>{formatDate(item.video_date || item.created_at)}</span>
                  </div>

                  {/* Card Action Controls */}
                  <div className="flex items-center gap-1">
                    <AdminActionsDropdown
                      onEdit={() => setEditingVideo(item)}
                      editLabel="Edit Video"
                      customActions={[
                        {
                          label: "Watch Externally",
                          icon: <ExternalLink className="h-4 w-4 text-sky-600" />,
                          href: item.video_url,
                        },
                      ]}
                      toggleActive={{
                        isActive: item.published !== false,
                        activeLabel: "Archive",
                        inactiveLabel: "Publish",
                        activeIcon: <Archive className="h-4 w-4 text-muted-foreground" />,
                        inactiveIcon: <Send className="h-4 w-4 text-emerald-600" />,
                        onToggle: () => {
                          const form = document.getElementById(
                            item.published === false ? `vid-pub-${item.id}` : `vid-arch-${item.id}`
                          ) as HTMLFormElement | null
                          form?.requestSubmit()
                        },
                      }}
                      onDelete={() => {
                        if (confirm(`Permanently delete video "${item.title}"?`)) {
                          const form = document.getElementById(`vid-del-${item.id}`) as HTMLFormElement | null
                          form?.requestSubmit()
                        }
                      }}
                      deleteLabel="Delete"
                    />

                    {/* Hidden Item Actions */}
                    <form id={`vid-arch-${item.id}`} action={setVideoGalleryItemStatusAction} className="hidden">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="status" value="archived" />
                    </form>
                    <form id={`vid-pub-${item.id}`} action={setVideoGalleryItemStatusAction} className="hidden">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="status" value="published" />
                    </form>
                    <form id={`vid-del-${item.id}`} action={deleteVideoGalleryItemAction} className="hidden">
                      <input type="hidden" name="id" value={item.id} />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Responsive Pagination ── */}
      {filteredItems.length > itemsPerPage ? (
        <div className="pt-4 flex items-center justify-between border-t border-border">
          <span className="text-xs font-medium text-muted-foreground">
            Page {normalizedPage} of {totalPages} ({filteredItems.length} videos)
          </span>

          <Pagination className="mx-0 w-auto">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.max(1, p - 1))
                  }}
                  className={normalizedPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {pageTokens.map((token, index) => (
                <PaginationItem key={`vid-page-token-${index}`}>
                  {token === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={token === normalizedPage}
                      onClick={(e) => {
                        e.preventDefault()
                        setPage(token)
                      }}
                      className={`cursor-pointer ${
                        token === normalizedPage
                          ? "bg-primary text-primary-foreground font-bold hover:bg-primary hover:text-primary-foreground"
                          : ""
                      }`}
                    >
                      {token}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.min(totalPages, p + 1))
                  }}
                  className={normalizedPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}

      {/* ── Centralized Edit Video Dialog ── */}
      {editingVideo && (
        <AlertDialog open={true} onOpenChange={(open) => !open && setEditingVideo(null)}>
          <AlertDialogContent className="sm:max-w-lg">
            <form action={updateVideoGalleryItemAction} className="space-y-0" onSubmit={() => setEditingVideo(null)}>
              <input type="hidden" name="id" value={editingVideo.id} />
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-primary/10 text-primary">
                  <Pencil className="size-5" />
                </AlertDialogMedia>
                <AlertDialogTitle>Edit Video Information</AlertDialogTitle>
                <AlertDialogDescription>
                  Update URL, title, description, or category.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="grid gap-4 px-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-vid-url" className="text-sm font-bold text-foreground">
                    Video URL <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="edit-vid-url"
                    name="video_url"
                    defaultValue={editingVideo.video_url}
                    required
                    className="h-10 text-sm border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-vid-title" className="text-sm font-bold text-foreground">
                    Title <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="edit-vid-title"
                    name="title"
                    defaultValue={editingVideo.title}
                    required
                    className="h-10 text-sm border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-vid-thumb" className="text-sm font-bold text-foreground">
                    Thumbnail URL (Optional)
                  </Label>
                  <Input
                    id="edit-vid-thumb"
                    name="thumbnail_url"
                    defaultValue={editingVideo.thumbnail_url ?? ""}
                    className="h-10 text-sm border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-vid-desc" className="text-sm font-bold text-foreground">
                    Caption / Description
                  </Label>
                  <textarea
                    id="edit-vid-desc"
                    name="description"
                    defaultValue={editingVideo.description ?? ""}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-foreground">Category</Label>
                    <Select defaultValue={editingVideo.category} name="category">
                      <SelectTrigger className="h-10 text-sm border-border">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.name}>
                              {formatCategoryLabel(c.name)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-vid-date" className="text-sm font-bold text-foreground">
                      Event Date
                    </Label>
                    <Input
                      id="edit-vid-date"
                      type="date"
                      name="video_date"
                      defaultValue={editingVideo.video_date ?? ""}
                      className="h-10 text-sm border-border"
                    />
                  </div>
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel type="button" onClick={() => setEditingVideo(null)}>Cancel</AlertDialogCancel>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Update Video
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* ── Video Player Modal ── */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden border border-border shadow-2xl"
          >
            <div className="relative aspect-video w-full bg-black">
              {activeVideo.video_url.includes("youtube.com") || activeVideo.video_url.includes("youtu.be") ? (
                <iframe
                  src={
                    activeVideo.video_url.includes("watch?v=")
                      ? activeVideo.video_url.replace("watch?v=", "embed/")
                      : activeVideo.video_url.replace("youtu.be/", "www.youtube.com/embed/")
                  }
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={activeVideo.video_url} controls className="w-full h-full object-contain" />
              )}
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 size-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black text-sm z-10 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-5 flex items-center justify-between bg-card border-t border-border">
              <div>
                <h3 className="font-bold text-base text-foreground">{activeVideo.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatCategoryLabel(activeVideo.category)} • {formatDate(activeVideo.video_date || activeVideo.created_at)}
                </p>
                {activeVideo.description && (
                  <p className="text-xs text-foreground mt-2 max-w-xl">{activeVideo.description}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveVideo(null)}
                className="text-xs font-semibold cursor-pointer"
              >
                Close Player
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
