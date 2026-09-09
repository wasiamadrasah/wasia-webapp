import { PhotoGalleryManager } from "@/components/admin/photo-gallery-manager"
import { getPhotoGalleryCategoriesForAdmin, getPhotoGalleryItemsForAdmin } from "@/lib/gallery"

type PhotoGalleryPageProps = {
  searchParams?: Promise<{
    status?: string
    message?: string
  }>
}

export default async function PhotoGalleryPage({ searchParams }: PhotoGalleryPageProps) {
  const params = (await searchParams) ?? {}
  const [categories, items] = await Promise.all([
    getPhotoGalleryCategoriesForAdmin(),
    getPhotoGalleryItemsForAdmin(200),
  ])

  return <PhotoGalleryManager categories={categories} items={items} status={params.status} message={params.message} />
}
