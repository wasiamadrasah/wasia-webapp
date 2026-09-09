import Link from "next/link"
import { FileText, X } from "lucide-react"
import { notFound } from "next/navigation"

import { updateDownloadAction } from "@/app/admin/actions"
import { getDownloadById, getDownloadCategoriesForAdmin } from "@/lib/db"
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
import { Textarea } from "@/components/ui/textarea"

type EditDownloadPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditDownloadPage({ params }: EditDownloadPageProps) {
  const { id } = await params
  const download = await getDownloadById(id)

  if (!download) {
    notFound()
  }

  const categories = await getDownloadCategoriesForAdmin()
  const publishDate = download.published_at
    ? new Date(download.published_at).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10)

  const createUpdateAction = async (formData: FormData) => {
    "use server"
    return updateDownloadAction(id, formData)
  }

  return (
    <form action={createUpdateAction} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
      <Card className="py-0">
        <CardHeader className="rounded-t-xl border-b border-slate-600 !bg-slate-700 pt-4 pb-4">
          <CardTitle className="text-slate-50">Edit Download</CardTitle>
          <CardDescription className="text-slate-200">Update file details and publishing status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">File Title *</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={download.title || ""}
              placeholder="Enter download title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={download.description || ""}
              placeholder="Enter file description (optional)"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file_url">File URL *</Label>
            <Input
              id="file_url"
              name="file_url"
              type="url"
              required
              defaultValue={download.file_url || ""}
              placeholder="https://drive.google.com/file/d/... or your file URL"
            />
            <p className="text-muted-foreground text-xs">
              Paste a link to Google Drive, Dropbox, OneDrive, or any cloud storage file.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file_name">File Name (Optional)</Label>
            <Input
              id="file_name"
              name="file_name"
              defaultValue={download.file_name || ""}
              placeholder="e.g., syllabus.pdf"
            />
            <p className="text-muted-foreground text-xs">
              Leave empty if the file URL already has the correct name.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Category</CardTitle>
            <CardDescription>Choose or create category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="download_type">Select Category</Label>
              <Select name="download_type" defaultValue={download.download_type || "general"}>
                <SelectTrigger id="download_type" className="w-full">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom_download_type">Or Create New</Label>
              <Input
                id="custom_download_type"
                name="custom_download_type"
                placeholder="New category name"
              />
              <p className="text-muted-foreground text-xs">Leave empty to use selected category</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>Visibility and scheduling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="publish_date">Publish Date</Label>
              <Input
                id="publish_date"
                name="publish_date"
                type="date"
                defaultValue={publishDate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="published" className="flex items-center gap-2">
                <input
                  id="published"
                  name="published"
                  type="checkbox"
                  value="true"
                  defaultChecked={download.published || false}
                  className="size-4"
                />
                <span>Published</span>
              </Label>
              <p className="text-muted-foreground text-xs">
                Uncheck to save as draft
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" className="w-full">
            <FileText className="mr-2 size-4" />
            Update Download
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/downloads">
              <X className="mr-2 size-4" />
              Cancel
            </Link>
          </Button>
        </div>
      </div>
    </form>
  )
}
