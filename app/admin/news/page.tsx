import { NoticeDataTable } from "@/components/admin/notice-data-table"
import { getNews } from "@/lib/db"
import { PageHeader } from "@/components/digicampus/page-header"

export default async function NewsPage() {
  const news = await getNews(200)

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="News"
        description="Manage school news articles, announcements, publishing status, and categories."
      />

      <NoticeDataTable
        data={news.map((item) => ({
          id: item.id,
          title: item.title || "Untitled news",
          content: item.content,
          category: item.category || "general",
          author: item.author_name,
          views: item.views ?? 0,
          status: item.published ? "published" : "draft",
          publishDate: item.publish_date || item.published_at || item.created_at || "-",
          attachmentUrl: null,
        }))}
        basePath="/admin/news"
        addLabel="Add News"
        showCategoriesButton
        categoriesPath="/admin/news/categories"
      />
    </div>
  )
}
