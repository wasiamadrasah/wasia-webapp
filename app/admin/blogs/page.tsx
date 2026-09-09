import { NoticeDataTable } from "@/components/admin/notice-data-table"
import { getBlogs } from "@/lib/db"

type BlogsPageProps = {
  searchParams?: Promise<{
    status?: string
    message?: string
  }>
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = (await searchParams) ?? {}
  const blogs = await getBlogs(200)

  return (
    <div className="w-full">
      <div>
        <h1 className="text-3xl font-bold">Blogs</h1>
        <p className="text-muted-foreground">Manage blog posts and publishing status.</p>
      </div>

      {params.message ? (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            params.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {params.message}
        </div>
      ) : null}

      <div className="mt-4">
        <NoticeDataTable
          data={blogs.map((item) => ({
            id: item.id,
            title: item.title || "Untitled blog",
            content: item.content,
            category: item.category || "general",
            author: item.author_name,
            views: item.views ?? 0,
            status: item.published ? "published" : "draft",
            publishDate: item.publish_date || item.published_at || item.created_at || "-",
            attachmentUrl: null,
          }))}
          basePath="/admin/blogs"
          addLabel="Add Blog"
          showCategoriesButton
          categoriesPath="/admin/blogs/categories"
        />
      </div>
    </div>
  )
}
