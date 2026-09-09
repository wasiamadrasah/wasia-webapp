import Link from "next/link"

import { createNotificationCategoryAction } from "@/app/admin/actions"
import {
  NotificationCategoryDataTable,
  type NotificationCategoryTableRow,
} from "@/components/admin/notification-category-data-table"
import { Button } from "@/components/ui/button"
import { getNotificationCategoriesForAdmin, getNotifications } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type NotificationCategoriesPageProps = {
  searchParams?: Promise<{
    status?: string
    message?: string
  }>
}

export default async function NotificationCategoriesPage({
  searchParams,
}: NotificationCategoriesPageProps) {
  const params = (await searchParams) ?? {}
  const categories = await getNotificationCategoriesForAdmin()
  const notifications = await getNotifications(1000)

  const countMap = new Map<string, number>()
  for (const notification of notifications) {
    const key = (notification.category || "general").trim().toLowerCase()
    countMap.set(key, (countMap.get(key) ?? 0) + 1)
  }

  const rows: NotificationCategoryTableRow[] = categories.map((category) => {
    const normalized = category.name.trim().toLowerCase()
    return {
      id: category.id,
      name: category.name,
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
          <h1 className="text-2xl font-semibold">Notification Category Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage categories used by notifications.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/communications/notifications">Back to Notifications</Link>
        </Button>
      </div>

      {message ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
            <CardDescription>Create category for notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createNotificationCategoryAction} className="grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name *</Label>
                <Input id="category" name="category" required placeholder="Enter category name" />
              </div>

              <Button type="submit">Add Category</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Categories</CardTitle>
            <CardDescription>Data table with checkbox, drawer, and row actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationCategoryDataTable data={rows} />
            <p className="text-muted-foreground mt-3 text-xs">
              Notes: deleting a category moves its notifications to <span className="font-medium">general</span>. The
              general category cannot be deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
