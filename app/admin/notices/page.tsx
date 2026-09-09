import { NoticeDataTable } from "@/components/admin/notice-data-table"
import { getNotices } from "@/lib/db"
import { PageHeader } from "@/components/digicampus/page-header"

export default async function NoticesPage() {
  const notices = await getNotices(200)

  return (
    <div className="w-full max-w-full space-y-6">
      <PageHeader
        title="Notices"
        description="Manage official notices, announcements, publishing status, and attachments."
      />

      <NoticeDataTable
        data={notices.map((notice) => ({
          id: notice.id,
          title: notice.title || "Untitled notice",
          content: notice.content,
          category: notice.notice_type || "general",
          author: notice.author_name,
          views: notice.views ?? 0,
          status: notice.published ? "published" : "draft",
          publishDate: notice.publish_date || notice.published_at || notice.created_at || "-",
          attachmentUrl: notice.attachment_url,
        }))}
      />
    </div>
  )
}
