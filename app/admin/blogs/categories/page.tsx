import Link from "next/link"

import { createBlogCategoryAction } from "@/app/admin/actions"
import {
  NoticeCategoryDataTable,
  type NoticeCategoryTableRow,
} from "@/components/admin/notice-category-data-table"
import { Button } from "@/components/ui/button"
import { getBlogCategoriesForAdmin, getBlogs } from "@/lib/db"
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

type BlogCategoriesPageProps = {
  searchParams?: Promise<{
    status?: string
    message?: string
  }>
}

export default async function BlogCategoriesPage({ searchParams }: BlogCategoriesPageProps) {
  const params = (await searchParams) ?? {}
  const categories = await getBlogCategoriesForAdmin()
  const blogs = await getBlogs(1000)

  const countMap = new Map<string, number>()
  for (const item of blogs) {
    const key = (item.category || "general").trim().toLowerCase()
    countMap.set(key, (countMap.get(key) ?? 0) + 1)
  }

  const rows: NoticeCategoryTableRow[] = categories.map((category) => {
    const normalized = category.name.trim().toLowerCase()
    return {
      id: category.id,
      name: category.name,
      slug: category.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-"),
      color: normalized.includes("important") || normalized.includes("urgent")
        ? "danger"
        : normalized.includes("event")
          ? "info"
          : normalized.includes("holiday")
            ? "warning"
            : normalized.includes("general") || normalized.includes("notice")
              ? "primary"
              : "secondary",
      status: category.is_active ? "published" : "archived",
      count: countMap.get(normalized) ?? 0,
      createdAt: category.created_at,
    }
  })

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog Category Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Rename or remove categories used by blogs.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/blogs">Back to Blogs</Link>
        </Button>
      </div>

      {params.message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            params.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {params.message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
            <CardDescription>Create category for blogs.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createBlogCategoryAction} className="grid gap-3">
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
            <CardTitle>Blog Categories</CardTitle>
            <CardDescription>Notice-style table with checkbox, drawer, and row actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <NoticeCategoryDataTable data={rows} module="blog" />
            <p className="text-muted-foreground mt-3 text-xs">
              Notes: deleting a category moves its blogs to <span className="font-medium">general</span>. The
              general category cannot be deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
