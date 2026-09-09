import Link from "next/link"
import { Plus } from "lucide-react"
import { getNotifications } from "@/lib/db"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { NotificationActionsMenu } from "@/components/admin/notification-actions-menu"
import { format } from "date-fns"

type NotificationsPageProps = {
  searchParams?: Promise<{
    status?: string
    message?: string
  }>
}

export default async function NotificationsPage({ searchParams }: NotificationsPageProps) {
  const params = (await searchParams) ?? {}
  const notifications = await getNotifications(200)
  const status = params.status
  const message = params.message

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Internal Notifications</h1>
          <p className="text-muted-foreground">
            Manage internal notifications with role-based targeting.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/communications/notifications/categories">
              Manage Categories
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/communications/notifications/new">
              <Plus className="size-4" />
              Create Notification
            </Link>
          </Button>
        </div>
      </div>

      {message ? (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {message}
        </div>
      ) : null}

      <Table>
        <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Target Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No notifications found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification, index) => (
                <TableRow key={notification.id}>
                  <TableCell className="text-muted-foreground tabular-nums">{index + 1}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {notification.title || "Untitled"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{notification.category || "general"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{notification.target_role || "all"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={notification.published ? "success" : "secondary"}>
                      {notification.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{notification.author_name || "-"}</TableCell>
                  <TableCell className="text-sm">
                    {notification.created_at
                      ? format(new Date(notification.created_at), "MMM dd, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <NotificationActionsMenu notificationId={notification.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
    </div>
  )
}
