import Link from "next/link"

import { createDownloadCategoryAction } from "@/app/admin/actions"
import {
  DownloadCategoryDataTable,
  type DownloadCategoryTableRow,
} from "@/components/admin/download-category-data-table"
import { Button } from "@/components/ui/button"
import { getDownloadCategoriesForAdmin, getDownloads } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DownloadCategoriesPageProps = {
  searchParams?: Promise<{
    status?: string
    message?: string
  }>
}

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

function getCategoryColor(name: string): DownloadCategoryTableRow["color"] {
  const normalized = name.trim().toLowerCase()
  if (normalized.includes("important") || normalized.includes("urgent")) return "danger"
  if (normalized.includes("syllabus") || normalized.includes("assignment")) return "info"
  if (normalized.includes("result") || normalized.includes("exam")) return "warning"
  if (normalized.includes("general") || normalized.includes("document")) return "primary"
  return "secondary"
}

export default async function DownloadCategoriesPage({ searchParams }: DownloadCategoriesPageProps) {
  const params = (await searchParams) ?? {}
  const categories = await getDownloadCategoriesForAdmin()
  const downloads = await getDownloads(1000)

  const countMap = new Map<string, number>()
  for (const download of downloads) {
    const key = (download.download_type || "general").trim().toLowerCase()
    countMap.set(key, (countMap.get(key) ?? 0) + 1)
  }

  const rows: DownloadCategoryTableRow[] = categories.map((category) => {
    const normalized = category.name.trim().toLowerCase()
    return {
      id: category.id,
      name: category.name,
      slug: toSlug(category.name),
      color: getCategoryColor(category.name),
      status: category.is_active ? "published" : "archived",
      count: countMap.get(normalized) ?? 0,
      createdAt: category.created_at,
    }
  })

  const status = params.status
  const message = params.message

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Download Category Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Rename or remove categories used by downloads.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/downloads">Back to Downloads</Link>
        </Button>
      </div>

      {message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
            <CardDescription>Create category for downloads.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createDownloadCategoryAction} className="grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name *</Label>
                <Input id="category" name="category" required placeholder="Enter category name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="category-slug" />
                <p className="text-muted-foreground text-xs">Leave empty to auto-generate from name</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color *</Label>
                <Select name="color" defaultValue="primary">
                  <SelectTrigger id="color" className="w-full">
                    <SelectValue placeholder="Choose color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="primary">Primary (Blue)</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="danger">Danger</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Add Category</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Download Categories</CardTitle>
            <CardDescription>Download-style table with checkbox, drawer, and row actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <DownloadCategoryDataTable data={rows} />
            <p className="text-muted-foreground mt-3 text-xs">
              Notes: deleting a category moves its downloads to <span className="font-medium">general</span>. The
              general category cannot be deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
