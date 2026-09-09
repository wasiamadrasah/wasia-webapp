import Link from "next/link"
import { notFound } from "next/navigation"

import { updateBlogAction } from "@/app/admin/actions"
import { NewsFeaturedImageUpload } from "@/components/admin/news-featured-image-upload"
import { TiptapEditor } from "@/components/forms/tiptap-editor"
import { getBlogById, getBlogCategories } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

type EditBlogPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params
  const [blog, categories] = await Promise.all([getBlogById(id), getBlogCategories()])

  if (!blog) {
    notFound()
  }

  return (
    <Card className="max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Edit Blog</CardTitle>
          <CardDescription>Update blog details and publishing settings.</CardDescription>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/blogs">Back to Blogs</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <form action={updateBlogAction.bind(null, blog.id)} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required defaultValue={blog.title || ""} />
          </div>

          <div className="md:col-span-2">
            <TiptapEditor
              name="content"
              label="Content"
              initialValue={blog.content || ""}
              minHeightClassName="min-h-[280px]"
              allowImage
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <NativeSelect id="category" name="category" className="w-full" defaultValue={blog.category || "general"}>
              {categories.map((category) => (
                <NativeSelectOption key={category} value={category}>
                  {category}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom_category">Or New Category</Label>
            <Input id="custom_category" name="custom_category" placeholder="Optional new category" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publish_date">Publish Date</Label>
            <Input
              id="publish_date"
              name="publish_date"
              type="datetime-local"
              defaultValue={blog.publish_date ? blog.publish_date.slice(0, 16) : ""}
            />
          </div>

          <div className="md:col-span-2">
            <NewsFeaturedImageUpload
              initialUrl={blog.featured_image_url || ""}
              uploadFolder="blogs/featured"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="published">Published</Label>
            <NativeSelect id="published" name="published" className="w-full" defaultValue={blog.published ? "true" : "false"}>
              <NativeSelectOption value="true">Yes</NativeSelectOption>
              <NativeSelectOption value="false">No</NativeSelectOption>
            </NativeSelect>
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <Button type="submit">Save Changes</Button>
            <Button asChild variant="outline">
              <Link href="/admin/blogs">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
