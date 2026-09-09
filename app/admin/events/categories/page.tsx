import Link from "next/link"

import { createEventCategoryAction } from "@/app/admin/actions"
import {
  NoticeCategoryDataTable,
  type NoticeCategoryTableRow,
} from "@/components/admin/notice-category-data-table"
import { Button } from "@/components/ui/button"
import { getEventCategoriesForAdmin, getEvents } from "@/lib/db"
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

type EventCategoriesPageProps = {
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

function getCategoryColor(name: string): NoticeCategoryTableRow["color"] {
  const normalized = name.trim().toLowerCase()
  if (normalized.includes("important") || normalized.includes("urgent")) return "danger"
  if (normalized.includes("seminar") || normalized.includes("workshop")) return "info"
  if (normalized.includes("holiday") || normalized.includes("vacation")) return "warning"
  if (normalized.includes("general") || normalized.includes("event")) return "primary"
  return "secondary"
}

export default async function EventCategoriesPage({ searchParams }: EventCategoriesPageProps) {
  const params = (await searchParams) ?? {}
  const categories = await getEventCategoriesForAdmin()
  const events = await getEvents(1000)

  const countMap = new Map<string, number>()
  for (const event of events) {
    const key = (event.category || "general").trim().toLowerCase()
    countMap.set(key, (countMap.get(key) ?? 0) + 1)
  }

  const rows: NoticeCategoryTableRow[] = categories.map((category) => {
    const normalized = category.name.trim().toLowerCase()
    return {
      id: category.id,
      name: category.name,
      slug: category.slug || toSlug(category.name),
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
          <h1 className="text-2xl font-semibold">Event Category Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Rename or remove categories used by events.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/events">Back to Events</Link>
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
            <CardDescription>Create category for events.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createEventCategoryAction} className="grid gap-3">
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
            <CardTitle>Event Categories</CardTitle>
            <CardDescription>Event categories table with management options.</CardDescription>
          </CardHeader>
          <CardContent>
            <NoticeCategoryDataTable data={rows} module="event" />
            <p className="text-muted-foreground mt-3 text-xs">
              Notes: deleting a category moves its events to <span className="font-medium">general</span>. The
              general category cannot be deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
