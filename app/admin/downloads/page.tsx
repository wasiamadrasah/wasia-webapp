import { DownloadDataTable } from "@/components/admin/download-data-table"
import { getDownloads, getDownloadCategoriesForAdmin } from "@/lib/db"

type DownloadsPageProps = {
  searchParams?: Promise<{
    status?: string
    message?: string
  }>
}

export default async function DownloadsPage({ searchParams }: DownloadsPageProps) {
  const params = (await searchParams) ?? {}
  const downloads = await getDownloads(200)
  const categories = await getDownloadCategoriesForAdmin()
  const status = params.status
  const message = params.message

  return (
    <div className="w-full">
      <div>
        <h1 className="text-3xl font-bold">Downloads</h1>
        <p className="text-muted-foreground">
          Manage downloadable files, categories, and publishing status.
        </p>
      </div>

      {message ? (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}

      <div className="mt-4">
        <DownloadDataTable
          data={downloads.map((download) => ({
            id: download.id,
            title: download.title || "Untitled download",
            description: download.description,
            category: download.download_type || "general",
            file_name: download.file_name,
            file_size: download.file_size,
            author: download.author_name,
            views: download.views ?? 0,
            status: download.published ? "published" : "draft",
            publishDate: download.published_at || download.created_at || "-",
          }))}
          categories={categories}
        />
      </div>
    </div>
  )
}
