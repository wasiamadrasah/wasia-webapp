import Link from "next/link"
import { createNoticeAction } from "@/app/admin/actions"
import { getNoticeCategories } from "@/lib/db"
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
import { TiptapEditor } from "@/components/forms/tiptap-editor"
import { PageHeader } from "@/components/digicampus/page-header"
import { NoticeSubmitButtons } from "./submit-buttons"
import { ArrowLeft, FileText, Settings, Tag, Calendar, Link as LinkIcon, Send } from "lucide-react"

export default async function NewNoticePage() {
  const categories = await getNoticeCategories()
  const today = new Date().toISOString().slice(0, 16)

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Add New Notice"
        description="Create official notice details, content, attachments, and status."
        action={
          <Button asChild variant="outline" className="h-10 rounded-lg border-border bg-white text-foreground hover:bg-muted/40 text-sm font-medium gap-2">
            <Link href="/admin/notices">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              <span>Back to Notices</span>
            </Link>
          </Button>
        }
      />

      <form action={createNoticeAction} className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* First Column: Main Title & Content (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Notice Details</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-bold text-foreground">
                Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Enter notice title"
                className="h-10 text-sm border-[#CBD5E1]"
              />
            </div>

            <div className="space-y-2">
              <TiptapEditor
                name="content"
                label="Content"
                minHeightClassName="min-h-[340px]"
              />
            </div>
          </div>
        </div>

        {/* Second Column: Settings & Status (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Publishing Settings</h2>
            </div>

            {/* Status Select (Published / Draft) */}
            <div className="space-y-2">
              <Label htmlFor="published" className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Send className="h-4 w-4 text-muted-foreground" />
                <span>Status</span>
              </Label>
              <Select name="published" defaultValue="true">
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
              <Label htmlFor="notice_type" className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>Category</span>
              </Label>
              <Select name="notice_type" defaultValue="general">
                <SelectTrigger id="notice_type" className="w-full h-10 border-[#CBD5E1]">
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
              <Label htmlFor="custom_notice_type" className="text-xs font-bold text-muted-foreground">
                Or Custom New Category
              </Label>
              <Input
                id="custom_notice_type"
                name="custom_notice_type"
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
                defaultValue={today}
                className="h-10 text-sm border-[#CBD5E1]"
              />
            </div>

            {/* Attachment Link */}
            <div className="space-y-2">
              <Label htmlFor="attachment_url" className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span>Attachment Link</span>
              </Label>
              <Input
                id="attachment_url"
                name="attachment_url"
                placeholder="https://example.com/document.pdf"
                className="h-10 text-sm border-[#CBD5E1]"
              />
            </div>

            <input type="hidden" name="image_url" value="" />

            <div className="pt-4 border-t border-border">
              <NoticeSubmitButtons />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
