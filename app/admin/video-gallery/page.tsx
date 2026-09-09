import { VideoGalleryManager } from "@/components/admin/video-gallery-manager"
import { getVideoGalleryCategoriesForAdmin, getVideoGalleryItemsForAdmin } from "@/lib/gallery"

type VideoGalleryPageProps = {
  searchParams?: Promise<{
    status?: string
    message?: string
  }>
}

export default async function VideoGalleryPage({ searchParams }: VideoGalleryPageProps) {
  const params = (await searchParams) ?? {}
  const [categories, items] = await Promise.all([
    getVideoGalleryCategoriesForAdmin(),
    getVideoGalleryItemsForAdmin(200),
  ])

  return <VideoGalleryManager categories={categories} items={items} status={params.status} message={params.message} />
}
