import Link from "next/link"
import { CheckCircle2, FileText, X } from "lucide-react"

import { createNotificationAction } from "@/app/admin/actions"
import { getNotificationCategories } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TiptapEditor } from "@/components/forms/tiptap-editor"
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

export default async function NewNotificationPage() {
  const categories = await getNotificationCategories()

  // Common roles in a school system
  const targetRoles = [
    { value: "all", label: "All Users" },
    { value: "teacher", label: "Teachers" },
    { value: "student", label: "Students" },
    { value: "parent", label: "Parents" },
    { value: "staff", label: "Staff" },
    { value: "admin", label: "Admin" },
  ]

  return (
    <form action={createNotificationAction} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <Card className="py-0 overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/40 pt-4 pb-4">
          <CardTitle>Create New Notification</CardTitle>
          <CardDescription>
            Write the notification details and publish when ready. Notifications are internal messages for registered users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <div className="space-y-2">
            <Label htmlFor="title">Notification Title *</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Enter notification title"
            />
          </div>

          <TiptapEditor
            name="content"
            label="Notification Content"
            minHeightClassName="min-h-[340px]"
          />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle>Publish Options</CardTitle>
          <CardDescription>Configure notification settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="space-y-2">
            <Label htmlFor="status_ui">Status</Label>
            <Select defaultValue="draft" name="status_ui">
              <SelectTrigger id="status_ui" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_role">Target Role *</Label>
            <Select name="target_role" defaultValue="all">
              <SelectTrigger id="target_role" className="w-full">
                <SelectValue placeholder="Select target role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {targetRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Users with this role will see this notification in their portal.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue="general">
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              type="submit"
              name="published"
              value="true"
              className="w-full"
            >
              <CheckCircle2 className="size-4" />
              Publish Notification
            </Button>
            <Button
              type="submit"
              name="published"
              value="false"
              variant="secondary"
              className="w-full"
            >
              <FileText className="size-4" />
              Save as Draft
            </Button>
            <Button
              asChild
              type="button"
              variant="outline"
              className="w-full"
            >
              <Link href="/admin/communications/notifications">
                <X className="size-4" />
                Cancel
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
