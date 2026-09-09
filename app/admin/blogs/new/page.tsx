import Link from "next/link"
import { CheckCircle2, FileText, X } from "lucide-react"

import { createBlogAction } from "@/app/admin/actions"
import { NewsFeaturedImageUpload } from "@/components/admin/news-featured-image-upload"
import { TiptapEditor } from "@/components/forms/tiptap-editor"
import { getBlogCategories } from "@/lib/db"
import { Button } from "@/components/ui/button"
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

export default async function NewBlogPage() {
  const today = new Date().toISOString().slice(0, 10)
  const categories = await getBlogCategories()

  return (
    <form action={createBlogAction} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <Card className="py-0">
        <CardHeader className="rounded-t-xl border-b border-slate-600 !bg-slate-700 pt-4 pb-4">
          <CardTitle className="text-slate-50">Add New Blog</CardTitle>
          <CardDescription className="text-slate-200">Write the blog details and publish when ready.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Blog Title *</Label>
            <Input id="title" name="title" required placeholder="Enter blog title" />
          </div>

          <TiptapEditor name="content" label="Blog Content" minHeightClassName="min-h-[340px]" allowImage />

          <NewsFeaturedImageUpload uploadFolder="blogs/featured" />

          <input type="hidden" name="custom_category" value="" />
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-slate-50/50">
        <CardHeader className="rounded-t-lg border-b bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50">
          <CardTitle>Publish</CardTitle>
          <CardDescription>Choose publish options for this blog.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="publish_date">Publish Date</Label>
            <Input id="publish_date" name="publish_date" type="date" defaultValue={today} />
          </div>

          <div className="space-y-2 pt-2">
            <Button type="submit" name="published" value="true" className="w-full bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="size-4" />
              Publish Blog
            </Button>
            <Button type="submit" name="published" value="false" className="w-full bg-amber-500 text-black hover:bg-amber-600">
              <FileText className="size-4" />
              Save as Draft
            </Button>
            <Button asChild type="button" variant="outline" className="text-destructive border-destructive w-full">
              <Link href="/admin/blogs">
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
