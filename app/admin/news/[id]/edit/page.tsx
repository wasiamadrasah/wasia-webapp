import Link from "next/link"
import { notFound } from "next/navigation"

import { updateNewsAction } from "@/app/admin/actions"
import { NewsFeaturedImageUpload } from "@/components/admin/news-featured-image-upload"
import { TiptapEditor } from "@/components/forms/tiptap-editor"
import { getNewsById, getNewsCategories } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/digicampus/page-header"
import { EditNewsSubmitButtons } from "./submit-buttons"
import { ArrowLeft, FileText, Settings, Tag, Calendar, Send, Image as ImageIcon } from "lucide-react"

type EditNewsPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params
  const [news, categories] = await Promise.all([getNewsById(id), getNewsCategories()])

  if (!news) {
    notFound()
  }

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Edit News"
        description="Update news article content, featured image, category, and publishing status."
        action={
          <Button asChild variant="outline" className="h-10 rounded-lg border-border bg-white text-foreground hover:bg-muted/40 text-sm font-medium gap-2">
            <Link href="/admin/news">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              <span>Back to News</span>
            </Link>
          </Button>
        }
      />

      <form action={updateNewsAction.bind(null, news.id)} className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* First Column: Main Title, Content & Featured Image (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <FileText className="h-5 w-5 text-[#4F46E5]" />
              <h2 className="text-base font-bold text-foreground">News Article Details</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-bold text-foreground">
                Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={news.title || ""}
                placeholder="Enter news title"
                className="h-10 text-sm border-[#CBD5E1]"
              />
            </div>

            <div className="space-y-2">
              <TiptapEditor
                name="content"
                label="Content"
                initialValue={news.content || ""}
                minHeightClassName="min-h-[340px]"
                allowImage
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="h-4 w-4 text-[#4F46E5]" />
                <Label className="text-sm font-bold text-foreground">Featured Image</Label>
              </div>
              <NewsFeaturedImageUpload initialUrl={news.featured_image_url || ""} />
            </div>
          </div>
        </div>

        {/* Second Column: Settings & Publishing Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <Settings className="h-5 w-5 text-[#4F46E5]" />
              <h2 className="text-base font-bold text-foreground">Publishing Settings</h2>
            </div>

            {/* Status Select (Published / Draft) */}
            <div className="space-y-2">
              <Label htmlFor="published" className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Send className="h-4 w-4 text-muted-foreground" />
                <span>Status</span>
              </Label>
              <Select name="published" defaultValue={news.published ? "true" : "false"}>
                <SelectTrigger id="published" className="w-full h-10 border-[#CBD5E1]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true" className="text-sm">
                    Published
                  </SelectItem>
                  <SelectItem value="false" className="text-sm">
                    Draft
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>Category</span>
              </Label>
              <Select name="category" defaultValue={news.category || "general"}>
                <SelectTrigger id="category" className="w-full h-10 border-[#CBD5E1]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize text-sm">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Category */}
            <div className="space-y-2">
              <Label htmlFor="custom_category" className="text-xs font-bold text-muted-foreground">
                Or Custom New Category
              </Label>
              <Input
                id="custom_category"
                name="custom_category"
                placeholder="Type new category name"
                className="h-10 text-sm border-[#CBD5E1]"
              />
            </div>

            {/* Publish Date */}
            <div className="space-y-2">
              <Label htmlFor="publish_date" className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Publish Date</span>
              </Label>
              <Input
                id="publish_date"
                name="publish_date"
                type="datetime-local"
                defaultValue={news.publish_date ? news.publish_date.slice(0, 16) : ""}
                className="h-10 text-sm border-[#CBD5E1]"
              />
            </div>

            <div className="pt-4 border-t border-border">
              <EditNewsSubmitButtons />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
